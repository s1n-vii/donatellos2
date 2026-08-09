import { BASE, launchBrowser } from './launch.mjs'

const browser = await launchBrowser()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const issues = []

const AUDIT = () => {
  const parse = (color) => {
    const m = color.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
    if (!m) return null
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] }
  }
  const lum = ({ r, g, b }) => {
    const c = [r, g, b].map((v) => {
      const s = v / 255
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }
  const effectiveBackground = (el) => {
    let node = el
    while (node && node !== document.documentElement) {
      const bg = parse(getComputedStyle(node).backgroundColor)
      if (bg && bg.a > 0.9) return bg
      node = node.parentElement
    }
    return { r: 255, g: 255, b: 255, a: 1 }
  }

  const contrast = []
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length > 0) {
      const direct = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 1,
      )
      if (!direct) continue
    }
    const text = el.textContent.trim()
    if (!text) continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue

    const fg = parse(cs.color)
    if (!fg) continue
    const bg = effectiveBackground(el)
    const size = parseFloat(cs.fontSize)
    const weight = Number(cs.fontWeight) || 400
    const isLarge = size >= 24 || (size >= 18.66 && weight >= 700)
    const required = isLarge ? 3 : 4.5
    const value = ratio(fg, bg)
    if (value < required) {
      contrast.push(
        `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} "${text.slice(0, 30)}" ratio=${value.toFixed(2)} need=${required}`,
      )
    }
  }

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
    level: Number(h.tagName[1]),
    text: h.textContent.trim().slice(0, 40),
  }))
  const headingIssues = []
  let previous = 0
  for (const heading of headings) {
    if (previous && heading.level > previous + 1) {
      headingIssues.push(`jump from h${previous} to h${heading.level} at "${heading.text}"`)
    }
    previous = heading.level
  }

  const imagesWithoutAlt = [...document.querySelectorAll('img')]
    .filter((img) => img.getAttribute('alt') === null)
    .map((img) => img.src)

  const namelessControls = [...document.querySelectorAll('a, button')]
    .filter((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return false
      const name = (el.textContent || '').trim() || el.getAttribute('aria-label') || ''
      return name.length === 0
    })
    .map((el) => el.outerHTML.slice(0, 60))

  const unlabelledInputs = [...document.querySelectorAll('input')].filter((input) => {
    if (input.getAttribute('aria-label')) return false
    const id = input.id
    return !(id && document.querySelector(`label[for="${CSS.escape(id)}"]`))
  }).length

  return {
    contrast: [...new Set(contrast)],
    headings: headingIssues,
    imagesWithoutAlt,
    namelessControls,
    unlabelledInputs,
    headingOutline: headings.map((h) => `h${h.level} ${h.text}`),
  }
}

for (const route of ['/', '/menu', '/visit', '/reviews']) {
  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  const audit = await page.evaluate(AUDIT)
  for (const item of audit.contrast) issues.push(`[contrast] ${route} ${item}`)
  for (const item of audit.headings) issues.push(`[heading order] ${route} ${item}`)
  for (const item of audit.imagesWithoutAlt) issues.push(`[alt missing] ${route} ${item}`)
  for (const item of audit.namelessControls) issues.push(`[no accessible name] ${route} ${item}`)
  if (audit.unlabelledInputs) issues.push(`[input label] ${route} ${audit.unlabelledInputs}`)
  console.log(`\n${route} heading outline:\n  ${audit.headingOutline.join('\n  ')}`)
}

await browser.close()

console.log('')
if (issues.length) {
  console.log('PROBLEMS:')
  for (const issue of issues) console.log(' - ' + issue)
  process.exitCode = 1
} else {
  console.log('Accessibility audit clean: contrast, heading order, alt text, control names.')
}
