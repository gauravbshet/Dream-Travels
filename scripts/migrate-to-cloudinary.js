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
 * Safe to re-run: uploads use overwrite:false + deterministic public_id,
 * and DB updates only touch rows whose value matches an old URL.
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
// Supabase public URL — no local download needed), build old->new URL map
// -------------------------------------------------------------------------
async function uploadAllToCloudinary(paths) {
  const urlMap = new Map(); // oldSupabaseUrl -> newCloudinaryUrl

  for (const path of paths) {
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const sourceUrl = urlData.publicUrl;

    try {
      const result = await cloudinary.uploader.upload(sourceUrl, {
        folder: `dream-travels/${path.substring(0, path.lastIndexOf('/'))}` || 'dream-travels',
        public_id: path.substring(path.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, ''),
        overwrite: false,
      });

      urlMap.set(sourceUrl, result.secure_url);
      console.log(`Uploaded: ${path} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`  Failed to upload ${path}:`, err.message);
    }
  }

  return urlMap;
}

// -------------------------------------------------------------------------
// Step 3: rewrite URLs in the DB across all tables/columns that hold them
// -------------------------------------------------------------------------
async function updateDestinations(urlMap) {
  const { data: rows, error } = await supabase.from('destinations').select('id, image, cover_image');
  if (error) throw error;

  for (const row of rows) {
    const patch = {};
    if (urlMap.has(row.image)) patch.image = urlMap.get(row.image);
    if (urlMap.has(row.cover_image)) patch.cover_image = urlMap.get(row.cover_image);

    if (Object.keys(patch).length > 0) {
      const { error: updErr } = await supabase.from('destinations').update(patch).eq('id', row.id);
      if (updErr) console.error(`  destinations ${row.id} update failed:`, updErr.message);
      else console.log(`Updated destinations.${row.id}`);
    }
  }
}

async function updatePackages(urlMap) {
  const { data: rows, error } = await supabase.from('packages').select('id, image, additional_images');
  if (error) throw error;

  for (const row of rows) {
    const patch = {};

    if (urlMap.has(row.image)) {
      patch.image = urlMap.get(row.image);
    }

    if (Array.isArray(row.additional_images)) {
      const newImages = row.additional_images.map((url) => urlMap.get(url) || url);
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

async function updateItineraries(urlMap) {
  const { data: rows, error } = await supabase.from('itineraries').select('id, image');
  if (error) throw error;

  for (const row of rows) {
    if (urlMap.has(row.image)) {
      const { error: updErr } = await supabase
        .from('itineraries')
        .update({ image: urlMap.get(row.image) })
        .eq('id', row.id);
      if (updErr) console.error(`  itineraries ${row.id} update failed:`, updErr.message);
      else console.log(`Updated itineraries.${row.id}`);
    }
  }
}

// -------------------------------------------------------------------------
async function migrate() {
  console.log('Listing files in bucket...');
  const files = await listAllFiles();
  console.log(`Found ${files.length} files.`);

  console.log('Uploading to Cloudinary...');
  const urlMap = await uploadAllToCloudinary(files);
  console.log(`Uploaded ${urlMap.size} files.`);

  console.log('Updating destinations...');
  await updateDestinations(urlMap);

  console.log('Updating packages...');
  await updatePackages(urlMap);

  console.log('Updating itineraries...');
  await updateItineraries(urlMap);

  console.log('Migration complete.');
  console.log(
    'Next: verify every page renders res.cloudinary.com URLs, then delete the old files from the Supabase bucket to reclaim storage.'
  );
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
