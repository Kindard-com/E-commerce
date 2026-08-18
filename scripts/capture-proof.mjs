import { chromium } from 'playwright'
import path from 'path'

const root = path.resolve(process.cwd(), 'docs/proof')
const pages = [
  { url: 'http://localhost:3000/en', file: 'storefront-home.png' },
  { url: 'http://localhost:3000/en/buy', file: 'storefront-buy-en.png' },
  { url: 'http://localhost:3000/de/buy', file: 'storefront-buy-de.png' },
  { url: 'http://localhost:3000/en/tees', file: 'storefront-new-arrivals.png' },
  { url: 'http://localhost:3000/en/product/classic-logo-tee', file: 'storefront-product.png' },
  { url: 'http://localhost:3000/admin', file: 'payload-admin.png' },
]

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: root, size: { width: 1440, height: 900 } },
})
const page = await context.newPage()

for (const { url } of pages) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.waitForTimeout(1500)
}

await page.goto('http://localhost:3000/en/buy', { waitUntil: 'networkidle', timeout: 120_000 })
await page.locator('select.lang-switch').selectOption('de')
await page.waitForTimeout(2000)
await page.locator('select.lang-switch').selectOption('fr')
await page.waitForTimeout(2000)

const cdn = await context.newPage()
await cdn.goto('http://localhost:3001/health', { waitUntil: 'networkidle', timeout: 60_000 })
await cdn.waitForTimeout(1500)
await cdn.screenshot({ path: path.join(root, 'cdn-health.png'), fullPage: true })

await context.close()
await browser.close()

const video = context.pages()[0]?.video()
if (video) {
  await video.saveAs(path.join(root, 'kindard-storefront-demo.webm'))
}

console.log('Recorded demo video and CDN screenshot')
