import { mkdirSync } from 'node:fs'

import { BASE, launchBrowser } from './launch.mjs'

const ROUTES = ['/', '/menu', '/visit', '/reviews']
const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1600]
const OUT = 'qa-shots'

mkdirSync(OUT, { recursive: true })

const browser = await launchBrowser()
const problems = []

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await context.newPage()

  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`[console ${message.type()}] ${width}px ${page.url()} :: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => {
    problems.push(`[pageerror] ${width}px ${page.url()} :: ${error.message}`)
  })

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      const offenders = []
      if (doc.scrollWidth > doc.clientWidth + 1) {
        for (const el of document.querySelectorAll('body *')) {
          const rect = el.getBoundingClientRect()
          if (rect.width === 0) continue
          if (rect.right > doc.clientWidth + 1 || rect.left < -1) {
            offenders.push(
              `${el.tagName.toLowerCase()}.${String(el.className).split(' ').filter(Boolean).slice(0, 2).join('.')} right=${Math.round(rect.right)} left=${Math.round(rect.left)}`,
            )
          }
        }
      }
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        offenders: offenders.slice(0, 8),
      }
    })

    if (overflow.scrollWidth > overflow.clientWidth + 1) {
      problems.push(
        `[overflow] ${width}px ${route} scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth} :: ${overflow.offenders.join(' | ')}`,
      )
    }

    const name = route === '/' ? 'home' : route.replace(/\//g, '')
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: width >= 768 })
  }

  await context.close()
}

await browser.close()

if (problems.length) {
  console.log('PROBLEMS:')
  for (const problem of problems) console.log(' - ' + problem)
  process.exitCode = 1
} else {
  console.log('No console errors, no horizontal overflow at any width.')
}
