// One-off utility: resize + recompress both frame sequences to fit the performance
// budget (each sequence's 192 webp frames combined under ~5MB).
//
// Source frames are 1280x720. Resizing to 1024px wide (~64% of the pixels) plus a
// moderate webp quality lands both sequences under budget without visible banding on
// the glow gradients — these are full-bleed backgrounds behind text, not pixel-peeped UI.
//
// asset2 carries more high-frequency detail (gears + glowing filaments) so it needs a
// slightly lower quality than asset1 to hit the same budget. Run AFTER color-grade-asset2.
//
// Reads each file fully into memory before writing back (avoids the Windows EPERM that
// occurs when sharp still holds an OS handle on a path being overwritten in place).
//
// Run:  node scripts/compress-sequences.mjs

import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const TARGET_WIDTH = 1024;

const SEQUENCES = [
  { name: 'asset1', quality: 62 },
  { name: 'asset2', quality: 52 },
];

async function compressSequence({ name, quality }) {
  const dir = path.resolve('public/sequences', name);
  const files = (await readdir(dir)).filter((f) => /^hero-sequence-\d{4}\.webp$/.test(f)).sort();
  let total = 0;
  for (const f of files) {
    const src = path.join(dir, f);
    const inBuf = await readFile(src);
    const out = await sharp(inBuf)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer();
    await writeFile(src, out);
    total += out.length;
  }
  const mb = (total / 1048576).toFixed(2);
  console.log(`${name}: ${files.length} frames, ${mb}MB total (width ${TARGET_WIDTH}, q${quality})`);
}

for (const seq of SEQUENCES) {
  await compressSequence(seq);
}
console.log('done.');
