/**
 * Turns a source photo into the WebP sizes the site loads.
 *
 * Uses the Chromium that Playwright already provides for QA, so there is no
 * image-processing dependency to install.
 *
 *   node scripts/optimize-images.mjs <source> <output-base> [widths...]
 *
 * Example:
 *   node scripts/optimize-images.mjs ~/photos/room.jpg public/images/interior/interior-01 640 1024
 *
 * Writes <output-base>-<width>.webp for every width below the largest, and
 * <output-base>.webp for the largest. Never upscales past the source width.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, extname } from 'node:path'
import { launchBrowser } from './launch.mjs'

const [source, outputBase, ...widthArgs] = process.argv.slice(2)

if (!source || !outputBase) {
  console.error('usage: node scripts/optimize-images.mjs <source> <output-base> [widths...]')
  process.exit(1)
}

const widths = (widthArgs.length ? widthArgs : ['640', '1024', '1600']).map(Number).sort((a, b) => a - b)
const QUALITY = 0.82

const mime =
  { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[
    extname(source).toLowerCase()
  ] ?? 'image/png'

const dataUrl = `data:${mime};base64,${readFileSync(source).toString('base64')}`

const browser = await launchBrowser()
const page = await browser.newPage()

const encoded = await page.evaluate(
  async ({ dataUrl, widths, quality }) => {
    const image = new Image()
    image.src = dataUrl
    await image.decode()

    const results = []
    for (const width of widths) {
      if (width > image.naturalWidth) continue
      const height = Math.round((width / image.naturalWidth) * image.naturalHeight)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      context.imageSmoothingQuality = 'high'
      context.drawImage(image, 0, 0, width, height)
      results.push({
        width,
        height,
        data: canvas.toDataURL('image/webp', quality).split(',')[1],
      })
    }
    return { natural: { width: image.naturalWidth, height: image.naturalHeight }, results }
  },
  { dataUrl, widths, quality: QUALITY },
)

await browser.close()

if (encoded.results.length === 0) {
  console.error(`source is only ${encoded.natural.width}px wide; no requested width fits`)
  process.exit(1)
}

mkdirSync(dirname(outputBase), { recursive: true })

const largest = encoded.results.at(-1)
for (const result of encoded.results) {
  const path = result === largest ? `${outputBase}.webp` : `${outputBase}-${result.width}.webp`
  const buffer = Buffer.from(result.data, 'base64')
  writeFileSync(path, buffer)
  console.log(`${path}  ${result.width}x${result.height}  ${(buffer.length / 1024).toFixed(1)} kB`)
}

console.log(`source: ${encoded.natural.width}x${encoded.natural.height}`)
