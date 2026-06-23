// One-off utility: neutralize the unwanted blue tint in the asset2 frame sequence
// while preserving the correct chartreuse-green (#C6FF4A) glow, then recompress.
//
// The AI-generated asset2 has a "deep blue data filaments" cast: across frames the
// BLUE channel mean sits ABOVE green and red (e.g. R35 G47 B52 on frame 1), which is
// the opposite ordering of the correctly-graded asset1 (R33 G43 B37 — blue below green).
// The brand allows only lime as a notable accent; blue may exist only as faint ambient.
//
// Strategy (per-pixel, channel-recombination linear matrix):
//   - Scale the blue channel down so it can no longer dominate (kills the overall cast).
//   - Bleed a little of the removed blue energy into green, which (a) keeps overall
//     luminance/contrast from dropping and (b) nudges residual cool pixels toward the
//     lime/chartreuse family instead of going flat grey.
//   - Leave red and green largely intact so the existing chartreuse glow (high R+G, low B)
//     is untouched — those pixels already have little blue to remove.
//
// sharp's .recomb() applies a 3x3 matrix [out] = M . [r,g,b]. Rows = output R,G,B.
//   R_out = 1.00*R + 0.00*G + 0.00*B
//   G_out = 0.00*R + 1.00*G + 0.06*B   (slight blue->green bleed, keeps luminance up)
//   B_out = 0.00*R + 0.00*G + 0.70*B   (blue suppression — drops blue below green so it
//                                        no longer dominates, without recoloring grey metal)
//
// An earlier, more aggressive version (B*0.55 + 0.05G->B + 0.12B->G) killed the blue but
// tinted the neutral grey gears green — a wholesale recolor the brief warns against. This
// gentler matrix neutralizes the cast while leaving metal reading neutral.
//
// Run:  node scripts/color-grade-asset2.mjs --sample   (frames 1 & 96 only, writes *-graded.webp next to source for review)
//       node scripts/color-grade-asset2.mjs            (all 192 frames, in place)

import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Read the whole source into memory FIRST so sharp never holds an OS handle on the
// path we're about to overwrite (libvips keeps the input mapped, which causes EPERM
// on Windows when writing back to the same path). Then write the graded bytes in place.

const DIR = path.resolve('public/sequences/asset2');
const QUALITY = 80; // webp quality used for the compression pass

const RECOMB = [
  [1.0, 0.0, 0.0],
  [0.0, 1.0, 0.06],
  [0.0, 0.0, 0.7],
];

function gradeBuffer(inputBuf) {
  return sharp(inputBuf)
    .recomb(RECOMB)
    .webp({ quality: QUALITY, effort: 5 })
    .toBuffer();
}

async function meanRGB(buf) {
  const { channels } = await sharp(buf).stats();
  const [r, g, b] = channels;
  return `R${r.mean.toFixed(1)} G${g.mean.toFixed(1)} B${b.mean.toFixed(1)}`;
}

async function sample() {
  for (const n of ['0001', '0096']) {
    const src = path.join(DIR, `hero-sequence-${n}.webp`);
    const inBuf = await readFile(src);
    const before = await meanRGB(inBuf);
    const out = await gradeBuffer(inBuf);
    const after = await meanRGB(out);
    const outPath = path.join(DIR, `hero-sequence-${n}-graded.webp`);
    await writeFile(outPath, out);
    console.log(`frame ${n}: before ${before}  ->  after ${after}  (${outPath})`);
  }
}

async function batchAll() {
  const files = (await readdir(DIR)).filter((f) => /^hero-sequence-\d{4}\.webp$/.test(f)).sort();
  console.log(`grading ${files.length} frames in ${DIR}`);
  for (const f of files) {
    const src = path.join(DIR, f);
    const inBuf = await readFile(src);
    const out = await gradeBuffer(inBuf);
    await writeFile(src, out);
  }
  console.log('done.');
}

const isSample = process.argv.includes('--sample');
await (isSample ? sample() : batchAll());
