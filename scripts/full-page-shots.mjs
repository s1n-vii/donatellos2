/**
 * Full-page screenshots for visual review artifacts.
 * Usage: QA_BASE=http://127.0.0.1:4173 node scripts/full-page-shots.mjs <outDir>
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { BASE, launchBrowser } from './launch.mjs'

const outDir = process.argv[2] ?? 'qa-shots'
mkdirSync(outDir, { recursive: true })

const ROUTES = [
  ['/', 'home'],
  ['/menu', 'menu'],
  ['/visit', 'visit'],
  ['/reviews', 'reviews'],
]

const WIDTHS = [390, 1440]

const browser = await launchBrowser()
const page = await browser.newPage()

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 })
  for (const [route, name] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    const path = join(outDir, `abbottstown-${name}-${width}w-full.png`)
    await page.screenshot({ path, fullPage: true })
    console.log(`wrote ${path}`)
  }
}

await browser.close()
