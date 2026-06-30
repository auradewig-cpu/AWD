#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = path.join(__dirname, 'public', 'frames', 'mobile');

if (!fs.existsSync(FRAMES_DIR)) {
  console.error(`Folder tidak ditemukan: ${FRAMES_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(FRAMES_DIR).filter(f => f.endsWith('.webp')).sort();
console.log(`Recompressing ${files.length} mobile frames (360px, q30)...\n`);

let totalBefore = 0;
let totalAfter = 0;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const inputPath = path.join(FRAMES_DIR, file);

  const stat = fs.statSync(inputPath);
  totalBefore += stat.size;

  const inputBuf = fs.readFileSync(inputPath);
  const outputBuf = await sharp(inputBuf).resize(360).webp({ quality: 30 }).toBuffer();
  totalAfter += outputBuf.length;

  fs.writeFileSync(inputPath, outputBuf);

  if ((i + 1) % 20 === 0 || i === files.length - 1) {
    const pct = Math.round((1 - outputBuf.length / stat.size) * 100);
    console.log(`  Progress: ${i + 1}/${files.length} | ${file} | ${(stat.size / 1024).toFixed(1)} KB → ${(outputBuf.length / 1024).toFixed(1)} KB (${pct}% smaller)`);
  }
}

const saved = totalBefore - totalAfter;
const pct = Math.round((1 - totalAfter / totalBefore) * 100);
console.log(`\n✅ Selesai! Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Hemat: ${(saved / 1024 / 1024).toFixed(2)} MB (${pct}%)`);
