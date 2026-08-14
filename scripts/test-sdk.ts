/**
 * Live smoke test for the Medusa JS SDK used by the Kindard storefront.
 * Run against a running backend: `npx tsx scripts/test-sdk.ts`
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import Medusa from '@medusajs/js-sdk'

type Check = {
  name: string
  ok: boolean
  detail?: string
}

const baseUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_URL ||
  'http://127.0.0.1:9000'

const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
const adminKey = process.env.MEDUSA_ADMIN_API_KEY || process.env.MEDUSA_SECRET_API_KEY || ''

async function runCheck(name: string, fn: () => Promise<string>): Promise<Check> {
  try {
    const detail = await fn()
    return { name, ok: true, detail }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { name, ok: false, detail: message }
  }
}

async function main() {
  const storeSdk = new Medusa({
    baseUrl,
    publishableKey: publishableKey || undefined,
    maxRetries: 1,
  })

  const adminSdk = adminKey
    ? new Medusa({
        baseUrl,
        apiKey: adminKey,
        maxRetries: 1,
      })
    : null

  const checks: Check[] = []

  checks.push(
    await runCheck('sdk.namespaces', async () => {
      const storeKeys = Object.keys(storeSdk.store || {})
      if (!storeKeys.includes('product') || !storeKeys.includes('cart')) {
        throw new Error(`Missing store namespaces: ${storeKeys.join(', ')}`)
      }
      return `store=[${storeKeys.join(', ')}]`
    }),
  )

  checks.push(
    await runCheck('health', async () => {
      const res = await fetch(`${baseUrl}/health`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    }),
  )

  checks.push(
    await runCheck('store.region.list', async () => {
      const { regions } = await storeSdk.store.region.list()
      return `${regions.length} region(s)`
    }),
  )

  checks.push(
    await runCheck('store.product.list', async () => {
      const { products } = await storeSdk.store.product.list({ limit: 5 })
      const names = products.map((product) => product.title).join(', ')
      return `${products.length} product(s)${names ? `: ${names}` : ''}`
    }),
  )

  if (adminSdk) {
    checks.push(
      await runCheck('admin.product.list', async () => {
        const { products } = await adminSdk.admin.product.list({ limit: 5 })
        return `${products.length} product(s)`
      }),
    )
  } else {
    checks.push({
      name: 'admin.product.list',
      ok: false,
      detail: 'MEDUSA_ADMIN_API_KEY not set',
    })
  }

  let regionId: string | undefined
  try {
    const { regions } = await storeSdk.store.region.list()
    regionId = regions[0]?.id
  } catch {
    regionId = undefined
  }

  checks.push(
    await runCheck('store.cart.create', async () => {
      if (!regionId) throw new Error('No region available to create a cart')
      const { cart } = await storeSdk.store.cart.create({ region_id: regionId })
      return cart.id
    }),
  )

  const passed = checks.filter((check) => check.ok).length
  const report = {
    ok: checks.every((check) => check.ok || check.name === 'admin.product.list'),
    baseUrl,
    hasPublishableKey: Boolean(publishableKey),
    hasAdminKey: Boolean(adminKey),
    passed,
    total: checks.length,
    checks,
    generatedAt: new Date().toISOString(),
  }

  const outDir = path.resolve(process.cwd(), 'docs/proof')
  await mkdir(outDir, { recursive: true })
  const outFile = path.join(outDir, 'sdk-test.json')
  await writeFile(outFile, `${JSON.stringify(report, null, 2)}\n`)

  console.log(JSON.stringify(report, null, 2))
  console.log(`Wrote ${outFile}`)

  if (!report.ok) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
