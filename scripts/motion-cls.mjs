import { launchBrowser } from './launch.mjs'

// These two suites check the built output, so they default to `vite preview`.
const BASE = process.env.QA_BASE ?? 'http://localhost:4173'

const browser = await launchBrowser()
const issues = []

/* Reduced motion: category jumps must be instant and still land correctly. */
const reduced = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
})
const page = await reduced.newPage()
await page.goto(BASE + '/menu', { waitUntil: 'networkidle' })

const scrollBehavior = await page.evaluate(
  () => getComputedStyle(document.documentElement).scrollBehavior,
)
if (scrollBehavior !== 'auto') issues.push(`scroll-behavior should be auto, got ${scrollBehavior}`)

await page.locator('.category-nav__link', { hasText: 'Desserts' }).first().click()
await page.waitForTimeout(120) // deliberately short: an instant jump needs no settle time
const landing = await page.evaluate(() => {
  const el = document.getElementById('desserts')
  const header = document.querySelector('.site-header').getBoundingClientRect().height
  const nav = document.querySelector('.menu-page__nav').getBoundingClientRect().height
  return { top: el.getBoundingClientRect().top, obstruction: header + nav }
})
if (!(landing.top >= landing.obstruction - 2 && landing.top <= landing.obstruction + 40)) {
  issues.push(
    `reduced-motion jump landed at ${Math.round(landing.top)}, expected near ${Math.round(landing.obstruction)}`,
  )
}

const transitionCount = await page.evaluate(() => {
  let animated = 0
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    const duration = parseFloat(cs.transitionDuration) + parseFloat(cs.animationDuration)
    if (duration > 0.05) animated += 1
  }
  return animated
})
if (transitionCount > 0) issues.push(`${transitionCount} elements still animate under reduced motion`)

await reduced.close()

/* Layout stability with images absent, which is the current state of the site. */
const normal = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page2 = await normal.newPage()
await page2.addInitScript(() => {
  window.__cls = 0
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__cls += entry.value
    }
  }).observe({ type: 'layout-shift', buffered: true })
})

for (const route of ['/', '/menu', '/visit']) {
  await page2.goto(BASE + route, { waitUntil: 'networkidle' })
  await page2.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
  await page2.waitForTimeout(600)
  const cls = await page2.evaluate(() => window.__cls)
  console.log(`${route} cumulative layout shift: ${cls.toFixed(4)}`)
  if (cls > 0.1) issues.push(`${route} CLS ${cls.toFixed(3)} exceeds 0.1`)
  await page2.evaluate(() => (window.__cls = 0))
}

await normal.close()
await browser.close()

console.log('')
if (issues.length) {
  console.log('PROBLEMS:')
  for (const issue of issues) console.log(' - ' + issue)
  process.exitCode = 1
} else {
  console.log('Reduced motion respected and no meaningful layout shift.')
}
