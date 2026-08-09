/**
 * Guards the promise that nothing unverified ships: no placeholder review text,
 * no development notes, and no leftover template copy in a production build.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PAGE_META, SHARE_IMAGE_PATH } from '../src/data/seo.js'
import { launchBrowser } from './launch.mjs'

// These two suites check the built output, so they default to `vite preview`.
const BASE = process.env.QA_BASE ?? 'http://localhost:4173'
const ORIGIN = 'https://donatellos2.vercel.app'
const ROUTES = [PAGE_META.home, PAGE_META.menu, PAGE_META.visit, PAGE_META.reviews]
const ROUTE_FILES = [
  [PAGE_META.home, 'index.html'],
  [PAGE_META.menu, 'menu.html'],
  [PAGE_META.visit, 'visit.html'],
  [PAGE_META.reviews, 'reviews.html'],
]

const FORBIDDEN = [
  'VERIFIED GOOGLE REVIEW',
  'REVIEWER NAME',
  'Development only',
  'lorem ipsum',
  'Photo slot',
  'TODO',
  'PLACEHOLDER',
  'Elevate your',
  'Discover',
  'Crafted with passion',
  'Culinary excellence',
  'Dough made in-house daily',
  'No reservation needed',
  'fastest way to order',
]

const browser = await launchBrowser()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const issues = []

page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') issues.push(`console ${m.type()}: ${m.text()}`)
})
page.on('pageerror', (e) => issues.push('pageerror: ' + e.message))

for (const meta of ROUTES) {
  await page.goto(BASE + meta.path, { waitUntil: 'networkidle' })
  const text = await page.evaluate(() => document.body.innerText)
  for (const phrase of FORBIDDEN) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`${meta.path} contains forbidden copy: "${phrase}"`)
    }
  }
  if ((await page.locator('.dev-note').count()) > 0)
    issues.push(`${meta.path} renders a .dev-note`)
  if ((await page.locator('.review--placeholder').count()) > 0)
    issues.push(`${meta.path} renders a placeholder review`)

  const schemaCount = await page.locator('script[type="application/ld+json"]').count()
  if (schemaCount !== 1)
    issues.push(`${meta.path} should render exactly one JSON-LD script, got ${schemaCount}`)
}

// JSON-LD must parse and contain only confirmed facts.
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
const jsonLd = JSON.parse(
  await page.locator('script[type="application/ld+json"]').first().textContent(),
)
const banned = ['priceRange', 'geo', 'sameAs', 'founder', 'foundingDate', 'aggregateRating', 'review']
for (const key of banned) {
  if (key in jsonLd) issues.push(`JSON-LD contains unverified field: ${key}`)
}
if (jsonLd.telephone !== '+1-717-699-7896') issues.push(`JSON-LD phone wrong: ${jsonLd.telephone}`)
if (jsonLd.address?.streetAddress !== '4790 W Market St')
  issues.push(`JSON-LD street wrong: ${jsonLd.address?.streetAddress}`)
if (jsonLd.openingHoursSpecification?.length !== 6)
  issues.push(`JSON-LD should list 6 open days, got ${jsonLd.openingHoursSpecification?.length}`)
const friday = jsonLd.openingHoursSpecification?.find((d) => d.dayOfWeek.endsWith('Friday'))
if (friday?.closes !== '22:00') issues.push(`JSON-LD Friday close wrong: ${friday?.closes}`)
const tuesday = jsonLd.openingHoursSpecification?.find((d) => d.dayOfWeek.endsWith('Tuesday'))
if (tuesday?.opens !== '11:00' || tuesday?.closes !== '21:00')
  issues.push(`JSON-LD Tuesday wrong: ${tuesday?.opens}–${tuesday?.closes}`)
if (jsonLd.openingHoursSpecification?.some((d) => d.dayOfWeek.endsWith('Sunday')))
  issues.push('JSON-LD lists Sunday, which is a closed day')
if (jsonLd.url !== 'https://donatellos2.vercel.app') issues.push(`JSON-LD url wrong: ${jsonLd.url}`)
if (jsonLd.hasMenu !== 'https://donatellos2.vercel.app/menu')
  issues.push(`JSON-LD hasMenu wrong: ${jsonLd.hasMenu}`)

// Client-rendered metadata must stay correct after direct loads and SPA
// navigation. Raw pre-JavaScript metadata is checked separately below.
for (const meta of ROUTES) {
  await page.goto(BASE + meta.path, { waitUntil: 'networkidle' })
  const title = await page.title()
  if (title !== meta.title) issues.push(`title ${meta.path}: got "${title}"`)
  const description = await page.locator('meta[name="description"]').getAttribute('content')
  if (description !== meta.description)
    issues.push(`${meta.path} description is "${description}"`)
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  if (canonical !== ORIGIN + (meta.path === '/' ? '/' : meta.path))
    issues.push(`${meta.path} canonical is "${canonical}"`)
  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
  if (ogUrl !== canonical) issues.push(`${meta.path} og:url is "${ogUrl}"`)
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
  if (ogTitle !== meta.title) issues.push(`${meta.path} og:title is "${ogTitle}"`)
  const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
  if (twitterTitle !== meta.title)
    issues.push(`${meta.path} twitter:title is "${twitterTitle}"`)
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
  if (ogImage !== ORIGIN + SHARE_IMAGE_PATH)
    issues.push(`${meta.path} og:image is "${ogImage}"`)
  const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')
  if (twitterImage !== ogImage)
    issues.push(`${meta.path} twitter:image is "${twitterImage}"`)
  // The share image has to exist, or the link preview is blank.
  const status = await page.evaluate(
    (url) => fetch(url, { method: 'HEAD' }).then((r) => r.status),
    new URL(new URL(ogImage).pathname, BASE).href,
  )
  if (status !== 200) issues.push(`${meta.path} og:image returns ${status}`)
}

// Inspect the built files directly. This is deliberately not a DOM/browser
// assertion: it proves metadata is present before React or any JavaScript runs.
const decodeHtml = (value = '') =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')

function rawMeta(html, attribute, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const tag = html.match(new RegExp(`<meta\\s+[^>]*${attribute}=["']${escaped}["'][^>]*>`, 'i'))?.[0]
  return decodeHtml(tag?.match(/content=["']([^"']*)["']/i)?.[1])
}

for (const [meta, file] of ROUTE_FILES) {
  const html = readFileSync(join('dist', file), 'utf8')
  const rawTitle = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1])
  const rawCanonical = decodeHtml(
    html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1],
  )
  const expectedCanonical = ORIGIN + (meta.path === '/' ? '/' : meta.path)

  if (rawTitle !== meta.title) issues.push(`${file} raw title is "${rawTitle}"`)
  if (rawMeta(html, 'name', 'description') !== meta.description)
    issues.push(`${file} raw description is wrong`)
  if (rawCanonical !== expectedCanonical)
    issues.push(`${file} raw canonical is "${rawCanonical}"`)
  if (rawMeta(html, 'property', 'og:title') !== meta.title)
    issues.push(`${file} raw og:title is wrong`)
  if (rawMeta(html, 'property', 'og:url') !== expectedCanonical)
    issues.push(`${file} raw og:url is wrong`)
  if (rawMeta(html, 'name', 'twitter:title') !== meta.title)
    issues.push(`${file} raw twitter:title is wrong`)

  const rawSchemas = [...html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  if (rawSchemas.length !== 1) {
    issues.push(`${file} should contain one raw JSON-LD script, got ${rawSchemas.length}`)
  } else {
    try {
      JSON.parse(rawSchemas[0][1])
    } catch (error) {
      issues.push(`${file} raw JSON-LD is invalid: ${error.message}`)
    }
  }
}

const notFoundHtmlPath = join('dist', '404.html')
if (!existsSync(notFoundHtmlPath)) {
  issues.push('dist/404.html is missing')
} else {
  const notFoundHtml = readFileSync(notFoundHtmlPath, 'utf8')
  if (!notFoundHtml.includes('<title>Page not found | Donatellos 2</title>'))
    issues.push('404.html has the wrong raw title')
  if (rawMeta(notFoundHtml, 'name', 'robots') !== 'noindex, follow')
    issues.push('404.html must use noindex, follow')
  if (/<link\s+[^>]*rel=["']canonical["']/i.test(notFoundHtml))
    issues.push('404.html should not publish a canonical for an unknown path')
}

const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'))
if (vercelConfig.cleanUrls !== true) issues.push('vercel.json must enable cleanUrls')
if (vercelConfig.trailingSlash !== false) issues.push('vercel.json must disable trailingSlash')
if (Array.isArray(vercelConfig.rewrites) && vercelConfig.rewrites.length > 0)
  issues.push('vercel.json still contains a catch-all rewrite that would create soft 404s')

// Vite preview always applies its own SPA history fallback. Enforce the HTTP
// 404 only against a server that is expected to model the deployed platform.
if (process.env.QA_EXPECT_REAL_404 === '1') {
  const response = await page.request.get(BASE + '/definitely-not-a-page')
  if (response.status() !== 404)
    issues.push(`unknown URL returned ${response.status()}, expected a real 404`)
} else {
  console.log('HTTP 404 status check skipped (set QA_EXPECT_REAL_404=1 against Vercel).')
}

// Generated crawler files must be reachable and carry the right origin.
for (const [path, expected] of [
  ['/robots.txt', `Sitemap: ${ORIGIN}/sitemap.xml`],
  ['/sitemap.xml', `<loc>${ORIGIN}/menu</loc>`],
]) {
  const response = await page.request.get(BASE + path)
  if (!response.ok()) {
    issues.push(`${path} returned ${response.status()}`)
    continue
  }
  const body = await response.text()
  if (!body.includes(expected)) issues.push(`${path} is missing "${expected}"`)
}

// Every photograph that made it into the markup must actually load.
for (const route of ['/', '/visit']) {
  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForLoadState('networkidle')
  const broken = await page.evaluate(() =>
    [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
  )
  for (const src of broken) issues.push(`${route} has an image that did not load: ${src}`)
  if ((await page.locator('.media--empty').count()) > 0)
    issues.push(`${route} renders an empty photo frame`)
}

// The Reviews page must carry the verified rating and real reviewer names.
await page.goto(BASE + '/reviews', { waitUntil: 'networkidle' })
const reviewsText = await page.evaluate(() => document.body.innerText)
for (const expected of ['4.6 out of 5', '49 Google reviews', 'David Stout', 'Glenn Ford', 'David Bickford']) {
  if (!reviewsText.includes(expected)) issues.push(`/reviews is missing "${expected}"`)
}

await browser.close()

if (issues.length) {
  console.log('PROBLEMS:')
  for (const issue of issues) console.log(' - ' + issue)
  process.exitCode = 1
} else {
  console.log('Production build is clean: no placeholders, no dev notes, JSON-LD and titles correct.')
}
