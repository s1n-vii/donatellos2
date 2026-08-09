/**
 * Section screenshots for visual review. Defaults to the dev server; point at
 * the production build with QA_BASE=http://localhost:4173.
 *
 *   node scripts/shots.mjs [width]
 */
import { BASE, launchBrowser } from './launch.mjs'

const width = Number(process.argv[2]) || 1440

const SHOTS = [
  ['/', '.hero', 'hero'],
  ['/', '.food', 'food'],
  ['/', '.made', 'made'],
  ['/', '.menu-preview', 'menu-preview'],
  ['/', '.dine-in', 'dinein'],
  ['/', '.home-reviews', 'home-reviews'],
  ['/', '.home-location', 'location'],
  ['/', '.site-footer', 'footer'],
  ['/menu', '#fresh-hot-pizzas', 'menu-pizzas'],
  ['/menu', '#wings', 'menu-wings'],
  ['/visit', '.visit-photo', 'visit-photo'],
  ['/reviews', '.reviews-page', 'reviews'],
]

const browser = await launchBrowser()
const page = await browser.newPage({ viewport: { width, height: 900 } })

let current = null
for (const [route, selector, name] of SHOTS) {
  if (route !== current) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    current = route
  }
  const target = page.locator(selector).first()
  await target.scrollIntoViewIfNeeded()
  await page.waitForLoadState('networkidle')
  const path = `qa-shots/${width}-${name}.png`
  await target.screenshot({ path })
  console.log(`wrote ${path}`)
}

await browser.close()
