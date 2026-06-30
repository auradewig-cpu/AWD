#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = path.join(__dirname, 'public', 'fonts');

const FONT_URLS = [
  ['Inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'],
  ['Inter+Tight', 'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,800&display=swap'],
  ['JetBrains+Mono', 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'],
];

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const seen = new Set();
let cssOutput = '';

for (const [familyParam, url] of FONT_URLS) {
  const displayName = familyParam.replace(/[+]/g, ' ');
  console.log(`\nFetching ${displayName}...`);

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0' },
  });
  const css = await res.text();
  const blocks = css.match(/@font-face\s*\{[^}]+}/g) || [];
  console.log(`  ${blocks.length} @font-face blocks`);

  for (const block of blocks) {
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1] || '400';
    const style = block.match(/font-style:\s*(\w+)/)?.[1] || 'normal';
    const srcUrl = block.match(/src:\s*url\(([^)]+)\)/)?.[1];
    const range = block.match(/unicode-range:\s*([^;}]+)/)?.[1]?.trim()
      || 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

    if (srcUrl) {
      const key = `${familyParam}-${weight}-${style}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const safe = familyParam.replace(/[+]/g, '-').toLowerCase();
      const suffix = style === 'italic' ? `-${weight}italic` : `-${weight}`;
      const filename = `${safe}${suffix}.woff2`;
      const filepath = path.join(FONTS_DIR, filename);

      if (!fs.existsSync(filepath)) {
        const fontRes = await fetch(srcUrl);
        const buf = Buffer.from(await fontRes.arrayBuffer());
        fs.writeFileSync(filepath, buf);
        console.log(`  + ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
      }

      cssOutput += `@font-face {
  font-family: '${displayName}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${filename}') format('woff2');
  unicode-range: ${range};
}

`;
    }
  }
}

const cssPath = path.join(__dirname, 'src', 'styles', 'fonts.css');
fs.writeFileSync(cssPath, cssOutput);
const totalFiles = fs.readdirSync(FONTS_DIR).filter(f => f.endsWith('.woff2')).length;
console.log(`\n✅ fonts.css — ${(cssOutput.length / 1024).toFixed(1)} KB of @font-face rules`);
console.log(`   ${FONTS_DIR} — ${totalFiles} font files`);
