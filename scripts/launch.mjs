import { chromium } from 'playwright'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SYSTEM_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
]

/**
 * Playwright normally resolves its own browser. When PLAYWRIGHT_BROWSERS_PATH
 * points at a custom directory whose platform folder does not match what
 * Playwright expects, find the binary instead of failing.
 */
function findChromium() {
  const explicit = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  if (explicit && existsSync(explicit)) return explicit

  const root = process.env.PLAYWRIGHT_BROWSERS_PATH
  if (!root || !existsSync(root)) return undefined

  for (const dir of readdirSync(root)) {
    if (!dir.startsWith('chromium-')) continue
    for (const platform of readdirSync(join(root, dir))) {
      for (const relative of [
        'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-linux/chrome',
        'chrome.exe',
      ]) {
        const candidate = join(root, dir, platform, relative)
        if (existsSync(candidate)) return candidate
      }
    }
  }
  return undefined
}

/**
 * Prefer an explicitly configured/custom Playwright browser, then Playwright's
 * bundled browser when it is installed. If neither exists, use an installed
 * system Chrome so QA remains runnable without another large download.
 */
export function launchBrowser(options = {}) {
  const customChromium = findChromium()
  if (customChromium) return chromium.launch({ ...options, executablePath: customChromium })

  const bundledChromium = chromium.executablePath()
  if (bundledChromium && existsSync(bundledChromium)) return chromium.launch(options)

  const systemChrome = SYSTEM_CHROME_PATHS.find((candidate) => existsSync(candidate))
  if (systemChrome) return chromium.launch({ ...options, executablePath: systemChrome })

  // Preserve Playwright's normal error with its installation guidance when no
  // custom, bundled or system executable exists.
  return chromium.launch(options)
}

export const BASE = process.env.QA_BASE ?? 'http://localhost:5173'
