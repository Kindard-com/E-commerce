import { chromium } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const root = path.resolve(process.cwd(), 'docs/proof')
fs.mkdirSync(root, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: root, size: { width: 1440, height: 900 } },
})
const page = await context.newPage()

const tour = [
  'http://localhost:3000/en',
  'http://localhost:3000/en/buy',
  'http://localhost:3000/de/buy',
  'http://localhost:3000/en/tees',
  'http://localhost:3000/en/product/classic-logo-tee',
  'http://localhost:3000/admin',
]

for (const url of tour) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  await page.waitForTimeout(2500)
}

await page.goto('http://localhost:3000/en/buy', { waitUntil: 'domcontentloaded', timeout: 120_000 })
await page.locator('select.lang-switch').selectOption('de')
await page.waitForTimeout(2000)
await page.locator('select.lang-switch').selectOption('fr')
await page.waitForTimeout(2000)

const video = page.video()
await page.close()
await context.close()
await browser.close()

const webmPath = path.join(root, 'kindard-storefront-demo.webm')
if (video) {
  await video.saveAs(webmPath)
  console.log('Saved', webmPath)
}
