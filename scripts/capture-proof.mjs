import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const outDir = path.resolve('docs/proof')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
})

const page = await context.newPage()

async function shot(name) {
  await page.screenshot({ path: path.join(outDir, name), fullPage: true })
  console.log('saved', name, page.url())
}

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(2500)
await shot('storefront-home.png')

await page.goto('http://localhost:3000/new-arrivals', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(2000)
await shot('storefront-new-arrivals.png')

await page.goto('http://localhost:3000/product/2', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(2000)
await shot('storefront-product.png')

await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(2000)
await shot('payload-admin.png')

await page.goto('http://localhost:3001/api/system/health', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(800)
await shot('cdn-health.png')

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
await page.mouse.wheel(0, 900)
await page.waitForTimeout(900)
await page.mouse.wheel(0, 900)
await page.waitForTimeout(900)

await context.close()
await browser.close()
console.log('capture complete')
