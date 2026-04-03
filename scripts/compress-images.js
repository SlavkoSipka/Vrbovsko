import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const publicDir = path.join(__dirname, '..', 'public')

const images = [
  {
    input: 'Misija i vizija.webp',
    output: 'misija-vizija.webp',
    width: 1600,
    quality: 75,
  },
  {
    input: 'istorijat.webp',
    output: 'istorijat-compressed.webp',
    width: 1200,
    quality: 75,
  },
]

async function compress() {
  for (const img of images) {
    const inputPath = path.join(publicDir, img.input)
    const outputPath = path.join(publicDir, img.output)

    const before = fs.statSync(inputPath).size
    await sharp(inputPath)
      .resize({ width: img.width, withoutEnlargement: true })
      .webp({ quality: img.quality })
      .toFile(outputPath)

    const after = fs.statSync(outputPath).size
    console.log(
      `${img.input} → ${img.output}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${Math.round((1 - after / before) * 100)}% manji)`
    )
  }
}

compress().catch(console.error)
