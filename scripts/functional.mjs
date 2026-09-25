import { BASE, launchBrowser } from './launch.mjs'

const results = []
const check = (name, pass, detail = '') =>
  results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' :: ' + detail : ''}`)

const browser = await launchBrowser()

/* ---------- desktop ---------- */
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await desktop.newPage()
const consoleIssues = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') consoleIssues.push(m.text())
})
page.on('pageerror', (e) => consoleIssues.push('pageerror: ' + e.message))

// Every known production route renders exactly one expected H1.
const KNOWN_ROUTES = [
  ['/', 'Pizza, subs & wings made fresh in Abbottstown.'],
  ['/menu', 'Menu'],
  ['/visit', "Visit Donatello's Pizzeria & Grill in Abbottstown"],
  ['/reviews', 'What customers say'],
]
for (const [route, expected] of KNOWN_ROUTES) {
  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  const h1s = await page.locator('h1').allTextContents()
  check(`route ${route} single H1`, h1s.length === 1, `found ${h1s.length}: ${h1s.join(' | ')}`)
  check(`route ${route} H1 text`, h1s[0] === expected, h1s[0])
}

// The React fallback still renders for a client-side unknown URL. Vercel's
// deployed HTTP status is checked separately by qa:prod when available.
await page.goto(BASE + '/definitely-not-a-page', { waitUntil: 'networkidle' })
check(
  'unknown client route renders the Not Found page',
  (await page.locator('h1').textContent()) === 'That page isn’t here.',
)

// Phone links
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
const telHrefs = await page.locator('a[href^="tel:"]').evaluateAll((els) => [
  ...new Set(els.map((el) => el.getAttribute('href'))),
])
check('all tel: links use the correct number', telHrefs.length === 1 && telHrefs[0] === 'tel:+17176247930', telHrefs.join(','))

// External delivery links
const sliceLinks = await page.locator('a[href*="slicelife.com"]').evaluateAll((els) =>
  els.map((el) => ({
    target: el.getAttribute('target'),
    rel: el.getAttribute('rel'),
    text: el.textContent.trim(),
  })),
)
check('delivery links present', sliceLinks.length > 0, `${sliceLinks.length} found`)
check(
  'delivery links open in new tab with rel=noopener',
  sliceLinks.every((l) => l.target === '_blank' && (l.rel ?? '').includes('noopener')),
)
check(
  'no bare "Order Online" label',
  sliceLinks.every((l) => !/^order online/i.test(l.text)),
  sliceLinks.map((l) => l.text).join(' | '),
)

// Menu search
await page.goto(BASE + '/menu', { waitUntil: 'networkidle' })
const input = page.locator('.menu-search__input')
await input.fill('cheesesteak')
await page.waitForTimeout(120)
const visibleItems = await page.locator('.menu-item__name').allTextContents()
check(
  'search filters to matching items',
  visibleItems.length > 0 && visibleItems.every((t) => /cheesesteak/i.test(t)),
  `${visibleItems.length} items: ${visibleItems.slice(0, 3).join(', ')}`,
)
check(
  'Call to Order still available while searching',
  (await page.locator('a.btn--primary', { hasText: 'Call to Order' }).count()) > 0,
)

await input.fill('sushi')
await page.waitForTimeout(120)
check(
  'empty search state message',
  (await page.locator('.menu-empty__message').textContent()) === 'No menu items match that search.',
)
check('category nav hidden when no results', (await page.locator('.category-nav').count()) === 0)

// Searching by category name returns that category's items
await input.fill('wraps')
await page.waitForTimeout(120)
const wrapItems = await page.locator('.menu-item__name').allTextContents()
check('search matches category names', wrapItems.length === 6, `${wrapItems.length} wrap items`)
await input.fill('')

// Category jump respects the sticky header offset
await page.goto(BASE + '/menu', { waitUntil: 'networkidle' })
const settle = async (target) => {
  await target.waitForFunction(() => {
    return new Promise((resolve) => {
      let last = window.scrollY
      let still = 0
      const tick = () => {
        if (window.scrollY === last) still += 1
        else {
          still = 0
          last = window.scrollY
        }
        if (still > 5) resolve(true)
        else requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
  })
}

await page.locator('.category-nav__link', { hasText: 'Wings' }).first().click()
await settle(page)
const wingsTop = await page.evaluate(() => {
  const el = document.getElementById('wings')
  const header = document.querySelector('.site-header').getBoundingClientRect().height
  const nav = document.querySelector('.menu-page__nav').getBoundingClientRect().height
  return { top: el.getBoundingClientRect().top, obstruction: header + nav }
})
check(
  'category jump lands just below the sticky header + nav',
  wingsTop.top >= wingsTop.obstruction - 2 && wingsTop.top <= wingsTop.obstruction + 40,
  `heading top ${Math.round(wingsTop.top)} vs obstruction ${Math.round(wingsTop.obstruction)}`,
)

// Active category tracking
const activeLabel = await page.locator('.category-nav__link--active').first().textContent()
check('active category follows scroll', activeLabel.trim() === 'Wings', activeLabel)

// Menu anchor from another page
await page.goto(BASE + '/menu#hot-subs', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const subsTop = await page.evaluate(() => {
  const el = document.getElementById('hot-subs')
  const header = document.querySelector('.site-header').getBoundingClientRect().height
  const nav = document.querySelector('.menu-page__nav').getBoundingClientRect().height
  return { top: el.getBoundingClientRect().top, obstruction: header + nav }
})
check(
  'deep link to /menu#hot-subs lands below sticky UI',
  subsTop.top >= subsTop.obstruction - 2 && subsTop.top < 400,
  `top ${Math.round(subsTop.top)}`,
)

// Map iframe
await page.goto(BASE + '/visit', { waitUntil: 'networkidle' })
const iframe = page.locator('iframe')
check('map iframe has title', ((await iframe.getAttribute('title')) ?? '').includes('6945 York Rd'))
check('map iframe lazy loads', (await iframe.getAttribute('loading')) === 'lazy')

const visitHours = page.locator('.visit-head__hours')
check(
  'visit page lists owner-confirmed hours',
  (await visitHours.locator('.hours--full').count()) === 1 &&
    (await visitHours.locator('.hours__row').count()) === 7,
  `rows ${await visitHours.locator('.hours__row').count()}`,
)
const tuesdayHours = await visitHours
  .locator('.hours__row', { has: page.locator('.hours__day', { hasText: 'Tuesday' }) })
  .locator('.hours__time')
  .textContent()
check('Tuesday shows closed', (tuesdayHours ?? '').trim() === 'Closed', tuesdayHours?.trim())
const mondayHours = await visitHours
  .locator('.hours__row', { has: page.locator('.hours__day', { hasText: 'Monday' }) })
  .locator('.hours__time')
  .textContent()
check(
  'Monday hours match site config',
  (mondayHours ?? '').includes('11:00 AM') && (mondayHours ?? '').includes('9:00 PM'),
  mondayHours?.trim(),
)

// Focus visibility on the skip link
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.keyboard.press('Tab')
const focused = await page.evaluate(() => document.activeElement?.textContent?.trim())
check('first tab stop is the skip link', focused === 'Skip to content', String(focused))

/* ---------- mobile ---------- */
const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true })
const mpage = await mobile.newPage()
mpage.on('pageerror', (e) => consoleIssues.push('mobile pageerror: ' + e.message))
await mpage.goto(BASE + '/', { waitUntil: 'networkidle' })

const toggle = mpage.locator('.nav-toggle')
check('mobile toggle starts collapsed', (await toggle.getAttribute('aria-expanded')) === 'false')
await toggle.click()
check('mobile toggle expands', (await toggle.getAttribute('aria-expanded')) === 'true')
check('mobile panel visible', await mpage.locator('.mobile-nav__link').first().isVisible())
await mpage.keyboard.press('Escape')
check('Escape closes mobile nav', (await toggle.getAttribute('aria-expanded')) === 'false')

await toggle.click()
await mpage.locator('.mobile-nav__link', { hasText: 'Visit' }).click()
await mpage.waitForTimeout(300)
check('mobile nav navigates and closes', mpage.url().endsWith('/visit') && (await toggle.getAttribute('aria-expanded')) === 'false', mpage.url())

// Sticky bar does not cover the end of the page
await mpage.goto(BASE + '/', { waitUntil: 'networkidle' })
await mpage.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await mpage.waitForTimeout(300)
const barOverlap = await mpage.evaluate(() => {
  const bar = document.querySelector('.mobile-bar').getBoundingClientRect()
  const legal = document.querySelector('.site-footer__legal').getBoundingClientRect()
  return { barTop: Math.round(bar.top), legalBottom: Math.round(legal.bottom) }
})
check(
  'mobile action bar never covers footer content',
  barOverlap.legalBottom <= barOverlap.barTop + 1,
  `legal bottom ${barOverlap.legalBottom} vs bar top ${barOverlap.barTop}`,
)

// Touch target sizes
const smallTargets = await mpage.evaluate(() => {
  const bad = []
  for (const el of document.querySelectorAll('a, button, input')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.height < 40)
      bad.push(
        `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}[${(el.textContent ?? '').trim().slice(0, 24)}] h=${Math.round(r.height)}`,
      )
  }
  return [...new Set(bad)]
})
check('interactive targets are at least 40px tall', smallTargets.length === 0, smallTargets.join(' | '))

check('no console errors or warnings', consoleIssues.length === 0, consoleIssues.slice(0, 5).join(' | '))

await browser.close()

console.log(results.join('\n'))
const failures = results.filter((r) => r.startsWith('FAIL'))
console.log(`\n${results.length - failures.length}/${results.length} passed`)
if (failures.length) process.exitCode = 1
