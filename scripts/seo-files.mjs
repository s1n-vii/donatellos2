/**
 * Writes route-specific initial HTML plus crawler files after a Vite build.
 *
 * Vite remains a client-rendered React app, but /menu, /visit and /reviews each
 * receive their own static HTML shell. That gives crawlers and link previews
 * the correct metadata before JavaScript executes and lets Vercel serve a real
 * 404 for unknown URLs instead of rewriting every path to the homepage.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { business } from '../src/data/business.js'
import {
  PAGE_META,
  SHARE_IMAGE_PATH,
  absoluteSiteUrl,
  buildRestaurantSchema,
} from '../src/data/seo.js'

const DIST = 'dist'
const ROUTES = [PAGE_META.home, PAGE_META.menu, PAGE_META.visit, PAGE_META.reviews]
const ROUTE_FILES = [
  [PAGE_META.home, 'index.html'],
  [PAGE_META.menu, 'menu.html'],
  [PAGE_META.visit, 'visit.html'],
  [PAGE_META.reviews, 'reviews.html'],
  [PAGE_META.notFound, '404.html'],
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function upsertHeadTag(html, pattern, tag) {
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function setMeta(html, attribute, key, content) {
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attribute}=["']${escapeRegExp(key)}["'][^>]*>`,
    'i',
  )
  if (!content) return html.replace(pattern, '')
  return upsertHeadTag(
    html,
    pattern,
    `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`,
  )
}

function setCanonical(html, href) {
  const pattern = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i
  if (!href) return html.replace(pattern, '')
  return upsertHeadTag(html, pattern, `<link rel="canonical" href="${escapeHtml(href)}" />`)
}

function renderRouteHtml(source, meta) {
  const canonical = meta.path ? absoluteSiteUrl(meta.path) : null
  const shareImage =
    canonical && SHARE_IMAGE_PATH ? `${business.siteUrl}${SHARE_IMAGE_PATH}` : null
  let html = source.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`)

  html = setMeta(html, 'name', 'description', meta.description)
  html = setMeta(html, 'name', 'robots', meta.robots)
  html = setMeta(html, 'property', 'og:title', meta.title)
  html = setMeta(html, 'property', 'og:description', meta.description)
  html = setMeta(html, 'property', 'og:type', 'website')
  html = setMeta(html, 'property', 'og:site_name', business.name)
  html = setMeta(html, 'property', 'og:url', canonical)
  html = setMeta(html, 'property', 'og:image', shareImage)
  html = setMeta(
    html,
    'name',
    'twitter:card',
    canonical && shareImage ? 'summary_large_image' : canonical ? 'summary' : null,
  )
  html = setMeta(html, 'name', 'twitter:title', meta.title)
  html = setMeta(html, 'name', 'twitter:description', meta.description)
  html = setMeta(html, 'name', 'twitter:image', shareImage)
  html = setCanonical(html, canonical)

  const encodedSchema = JSON.stringify(buildRestaurantSchema()).replaceAll('<', '\\u003c')
  const schemaTag = `<script id="restaurant-schema" type="application/ld+json">${encodedSchema}</script>`
  const schemaPattern = /<script\s+[^>]*id=["']restaurant-schema["'][^>]*>[\s\S]*?<\/script>/i
  html = upsertHeadTag(html, schemaPattern, schemaTag)

  return html
}

const sourceHtml = readFileSync(join(DIST, 'index.html'), 'utf8')
for (const [meta, file] of ROUTE_FILES) {
  writeFileSync(join(DIST, file), renderRouteHtml(sourceHtml, meta))
  console.log(`wrote dist/${file}`)
}

const origin = business.siteUrl
const robots = [
  'User-agent: *',
  'Allow: /',
  ...(origin ? ['', `Sitemap: ${origin}/sitemap.xml`] : []),
  '',
].join('\n')

writeFileSync(join(DIST, 'robots.txt'), robots)
console.log('wrote dist/robots.txt')

if (!origin) {
  console.log('no business.siteUrl, skipped sitemap.xml')
  process.exit(0)
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...ROUTES.map((meta) =>
    [
      '  <url>',
      `    <loc>${absoluteSiteUrl(meta.path)}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <priority>${meta.path === '/' ? '1.0' : '0.8'}</priority>`,
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n')

writeFileSync(join(DIST, 'sitemap.xml'), sitemap)
console.log(`wrote dist/sitemap.xml with ${ROUTES.length} routes`)
