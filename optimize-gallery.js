// Run: npm install sharp && node optimize-gallery.js
// Outputs 1600px long-edge WebP + JPEG into img/optimized/
// Use the optimized versions in gallery.html once generated.

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const OUT_DIR   = 'img/optimized';
const MAX_EDGE  = 1600;
const WEBP_Q    = 82;
const JPEG_Q    = 85;

const IMAGES = [
  'img/12209c73-276e-4acc-ac0a-6c317c41b5ac.JPG',
  'img/71c86dd7-e76f-4b9f-9d34-fab91e02d678.JPG',
  'img/786d43d8-a294-43c2-abf4-179a4f043f23.JPG',
  'img/PHOTO-2025-10-22-21-25-50 7.JPG',
  'img/PHOTO-2025-10-22-21-25-50 8.JPG',
  'img/ed9500f3-64f0-406f-b445-ff45c7233bec.JPG',
  'img/f24d7334-a767-49ab-a882-668199e9c9f9.JPG',
  'img/cagepic.jpeg',
  'img/pooolcage.JPG',
  'img/guysworking.jpeg',
  'img/lanairockingchair.JPG',
  'img/lanaihurricneshutter1.jpeg',
  'img/lanaihurricneshutter2.jpeg',
  'img/PHOTO-2026-03-18-13-08-33.JPG',
  'img/e99eb1c9-b51c-48f1-a82a-5ae756fe1060.JPG',
  'img/before.jpeg',
  'img/after.JPG',
  'img/before1.JPG',
  'img/after1.JPG',
  'img/before2.JPG',
  'img/after2.JPG',
  'img/before3.JPG',
  'img/after3.JPG',
  'img/IMG_1153.JPG',
  'img/IMG_1154.JPG',
  'img/IMG_1158.JPG',
  'pavers.jpg',
  'mailbox.jpg',
];

async function optimize() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const src of IMAGES) {
    const base = path.basename(src, path.extname(src)).replace(/\s+/g, '-');
    const meta = await sharp(src).metadata();

    const isLandscape = (meta.width ?? 0) >= (meta.height ?? 0);
    const resize = isLandscape
      ? { width: MAX_EDGE, withoutEnlargement: true }
      : { height: MAX_EDGE, withoutEnlargement: true };

    const pipeline = sharp(src).resize(resize).withMetadata();

    await pipeline.clone().webp({ quality: WEBP_Q }).toFile(path.join(OUT_DIR, base + '.webp'));
    await pipeline.clone().jpeg({ quality: JPEG_Q, progressive: true }).toFile(path.join(OUT_DIR, base + '.jpg'));

    console.log(`✓  ${src}  →  ${base}.webp / .jpg`);
  }

  console.log(`\nAll done! ${IMAGES.length} images optimized → ${OUT_DIR}/`);
  console.log('Swap the src paths in gallery.html to img/optimized/<name>.webp once reviewed.');
}

optimize().catch(err => { console.error(err); process.exit(1); });
