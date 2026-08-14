/**
 * Migrate Dream Travels images: Supabase Storage -> Cloudinary,
 * then rewrite every URL reference back into Supabase Postgres.
 *
 * Matches the real schema:
 *   - destinations.image, destinations.cover_image      (text)
 *   - packages.image                                     (text)
 *   - packages.additional_images                         (text[])
 *   - itineraries.image                                  (text)
 *
 * Bucket: "images", with files under destinations/, packages/, itinerary-days/
 *
 * Run:
 *   node scripts/migrate-to-cloudinary.js
 *
 * Safe to re-run, and safe to re-run after switching Cloudinary accounts:
 * matching is done by filename basename, so a row currently pointing at
 * either the original Supabase URL OR a previously-migrated Cloudinary URL
 * (any cloud) will be detected and repointed at the CURRENT
 * CLOUDINARY_CLOUD_NAME.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v2: cloudinary } = require('cloudinary');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BUCKET = process.env.SUPABASE_BUCKET || 'images';

// -------------------------------------------------------------------------
// helpers: derive a stable "basename" (filename, no extension) from either
// a Supabase storage path or any URL (Supabase public URL or a Cloudinary
// delivery URL from a previous migration run/account)
// -------------------------------------------------------------------------
function basenameFromPath(path) {
  const file = path.substring(path.lastIndexOf('/') + 1);
  return file.replace(/\.[^/.]+$/, '');
}

function basenameFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/');
    const last = parts[parts.length - 1];
    return last ? last.replace(/\.[^/.]+$/, '') : null;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------------------
// Step 1: recursively list every file in the bucket (it has subfolders:
// destinations/, packages/, itinerary-days/ — .list() is not recursive)
// -------------------------------------------------------------------------
async function listAllFiles(prefix = '') {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) throw error;

  let files = [];
  for (const entry of data) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.id === null) {
      // it's a folder — recurse
      files = files.concat(await listAllFiles(path));
    } else {
      files.push(path);
    }
  }
  return files;
}

// -------------------------------------------------------------------------
// Step 2: upload every file to Cloudinary (fetched server-side from the
// Supabase public URL — no local download needed), build a basename ->
// new Cloudinary URL map
// -------------------------------------------------------------------------
async function uploadAllToCloudinary(paths) {
  const basenameMap = new Map(); // basename -> newCloudinaryUrl

  for (const path of paths) {
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const sourceUrl = urlData.publicUrl;
    const basename = basenameFromPath(path);

    try {
      const result = await cloudinary.uploader.upload(sourceUrl, {
        folder: `dream-travels/${path.substring(0, path.lastIndexOf('/'))}` || 'dream-travels',
        public_id: basename,
        overwrite: true, // re-running should refresh to the current cloud/account
      });

      basenameMap.set(basename, result.secure_url);
      console.log(`Uploaded: ${path} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`  Failed to upload ${path}:`, err.message);
    }
  }

  return basenameMap;
}

// -------------------------------------------------------------------------
// Step 3: rewrite URLs in the DB across all tables/columns that hold them.
// Matches by basename so it repairs rows currently on a stale Cloudinary
// URL (old account) just as well as rows still on the original Supabase URL.
// -------------------------------------------------------------------------
function resolveNewUrl(basenameMap, currentValue) {
  const basename = basenameFromUrl(currentValue);
  if (!basename) return null;
  const newUrl = basenameMap.get(basename);
  if (!newUrl || newUrl === currentValue) return null;
  return newUrl;
}

async function updateDestinations(basenameMap) {
  const { data: rows, error } = await supabase.from('destinations').select('id, image, cover_image');
  if (error) throw error;

  for (const row of rows) {
    const patch = {};
    const newImage = resolveNewUrl(basenameMap, row.image);
    const newCover = resolveNewUrl(basenameMap, row.cover_image);
    if (newImage) patch.image = newImage;
    if (newCover) patch.cover_image = newCover;

    if (Object.keys(patch).length > 0) {
      const { error: updErr } = await supabase.from('destinations').update(patch).eq('id', row.id);
      if (updErr) console.error(`  destinations ${row.id} update failed:`, updErr.message);
      else console.log(`Updated destinations.${row.id}`);
    }
  }
}

async function updatePackages(basenameMap) {
  const { data: rows, error } = await supabase.from('packages').select('id, image, additional_images');
  if (error) throw error;

  for (const row of rows) {
    const patch = {};

    const newImage = resolveNewUrl(basenameMap, row.image);
    if (newImage) patch.image = newImage;

    if (Array.isArray(row.additional_images)) {
      const newImages = row.additional_images.map((url) => resolveNewUrl(basenameMap, url) || url);
      const changed = newImages.some((url, i) => url !== row.additional_images[i]);
      if (changed) patch.additional_images = newImages;
    }

    if (Object.keys(patch).length > 0) {
      const { error: updErr } = await supabase.from('packages').update(patch).eq('id', row.id);
      if (updErr) console.error(`  packages ${row.id} update failed:`, updErr.message);
      else console.log(`Updated packages.${row.id}`);
    }
  }
}

async function updateItineraries(basenameMap) {
  const { data: rows, error } = await supabase.from('itineraries').select('id, image');
  if (error) throw error;

  for (const row of rows) {
    const newImage = resolveNewUrl(basenameMap, row.image);
    if (newImage) {
      const { error: updErr } = await supabase.from('itineraries').update({ image: newImage }).eq('id', row.id);
      if (updErr) console.error(`  itineraries ${row.id} update failed:`, updErr.message);
      else console.log(`Updated itineraries.${row.id}`);
    }
  }
}

// -------------------------------------------------------------------------
async function migrate() {
  console.log(`Target Cloudinary cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log('Listing files in bucket...');
  const files = await listAllFiles();
  console.log(`Found ${files.length} files.`);

  console.log('Uploading to Cloudinary...');
  const basenameMap = await uploadAllToCloudinary(files);
  console.log(`Uploaded ${basenameMap.size} files.`);

  console.log('Updating destinations...');
  await updateDestinations(basenameMap);

  console.log('Updating packages...');
  await updatePackages(basenameMap);

  console.log('Updating itineraries...');
  await updateItineraries(basenameMap);

  console.log('Migration complete.');
  console.log(
    'Next: verify every page renders res.cloudinary.com URLs under the current cloud, then delete the old files from the Supabase bucket to reclaim storage.'
  );
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
