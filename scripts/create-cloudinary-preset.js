/**
 * One-off setup: creates an unsigned Cloudinary upload preset so the
 * browser (admin dashboard) can upload images/videos directly to
 * Cloudinary without exposing the API secret.
 *
 * Run once:
 *   node scripts/create-cloudinary-preset.js
 */
require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PRESET_NAME = 'dream_travels_unsigned';

async function main() {
  try {
    const existing = await cloudinary.api.upload_preset(PRESET_NAME);
    console.log(`Preset "${PRESET_NAME}" already exists. Unsigned: ${existing.unsigned}`);
    return;
  } catch (err) {
    // 404 means it doesn't exist yet — fall through and create it
    if (err.error && err.error.http_code === 404) {
      // ignore
    } else if (err.http_code !== 404) {
      throw err;
    }
  }

  const result = await cloudinary.api.create_upload_preset({
    name: PRESET_NAME,
    unsigned: true,
    folder: 'dream-travels',
  });

  console.log(`Created unsigned upload preset: ${result.name}`);
  console.log('Add these to your .env:');
  console.log(`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=${PRESET_NAME}`);
}

main().catch((err) => {
  console.error('Failed to create upload preset:', err);
  process.exit(1);
});
