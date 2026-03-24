import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = './public/icons';

async function createIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f59e0b"/>
          <stop offset="50%" style="stop-color:#ea580c"/>
          <stop offset="100%" style="stop-color:#dc2626"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
      <text x="50%" y="55%" font-size="${size * 0.5}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">X</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
  
  console.log(`Created icon-${size}x${size}.png`);
}

async function main() {
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  for (const size of sizes) {
    await createIcon(size);
  }
  
  console.log('All icons created!');
}

main().catch(console.error);
