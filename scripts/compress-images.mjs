/**
 * Kompresuje slike iz public/ i čuva sa URL‑bezbednim imenima.
 * Pokretanje: node scripts/compress-images.mjs
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const SOURCES = [
  { in: 'divlja tresnja cista.webp', out: 'divlja-tresnja-cista.webp' },
  { in: 'zima 2026.webp', out: 'zima-2026.webp' },
  { in: 'IMG_20260108_094818183_HDR b.webp', out: 'vrbovsko-hdr.webp' }
];

const maxWidth = 1200;
const quality = 82;

async function compress() {
  for (const { in: nameIn, out: nameOut } of SOURCES) {
    const inputPath = join(publicDir, nameIn);
    const outputPath = join(publicDir, nameOut);
    try {
      await sharp(inputPath)
        .resize(maxWidth, null, { withoutEnlargement: true })
        .webp({ quality })
        .toFile(outputPath);
      console.log('OK:', nameIn, '->', nameOut);
    } catch (e) {
      console.warn('Preskočeno (fajl možda ne postoji):', nameIn, e.message);
    }
  }
}

compress();
