import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

if (!process.env.PAYLOAD_SECRET) process.env.PAYLOAD_SECRET = 'changeme-local-payload-secret'
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = 'file:./payload.db'

const KINDARD_CATALOG = [
  {
    title: 'Classic Logo Tee',
    slug: 'classic-logo-tee',
    category: 'tees',
    categoryTitle: 'Tees',
    image: '/api/images?file=product_kid_tee_blue_1779803656124.png',
    price: 3500,
    description: 'Soft cotton tee with the Kindard logo. Built for everyday play.',
  },
  {
    title: 'Mini Explorer Hoodie',
    slug: 'mini-explorer-hoodie',
    category: 'hoodies',
    categoryTitle: 'Hoodies',
    image: '/api/images?file=product_kid_hoodie_cream_1779803671261.png',
    price: 6500,
    description: 'Premium kids hoodie for everyday play.',
  },
  {
    title: 'Playtime Sweat Shorts',
    slug: 'playtime-sweat-shorts',
    category: 'shorts',
    categoryTitle: 'Shorts',
    image: '/api/images?file=product_kid_shorts_navy_1779803696624.png',
    price: 3000,
    description: 'Easy-move sweat shorts with a durable wash.',
  },
  {
    title: 'Chunky Cable Knit',
    slug: 'chunky-cable-knit',
    category: 'knits',
    categoryTitle: 'Knits',
    image: '/api/images?file=product_kid_knit_sweater_1779803717074.png',
    price: 8500,
    description: 'Heavyweight cable knit that survives the playground.',
  },
  {
    title: 'Urban Ribbed Beanie',
    slug: 'urban-ribbed-beanie',
    category: 'accessories',
    categoryTitle: 'Accessories',
    image: '/api/images?file=product_kid_beanie_orange_1779803732374.png',
    price: 2400,
    description: 'One-size ribbed beanie for cool-weather drop days.',
  },
  {
    title: 'Vintage Wash Denim Jacket',
    slug: 'vintage-wash-denim-jacket',
    category: 'jackets',
    categoryTitle: 'Jackets',
    image: '/api/images?file=product_kid_jacket_denim_1779803748559.png',
    price: 9500,
    description: 'Vintage-wash denim jacket with room to layer.',
  },
]

async function medusaIdByHandle(handle: string): Promise<string | undefined> {
  try {
    const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_URL || 'http://127.0.0.1:9000'
    const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
    const res = await fetch(`${base}/store/products?handle=${encodeURIComponent(handle)}&limit=1`, {
      headers: key ? { 'x-publishable-api-key': key } : {},
    })
    if (!res.ok) return undefined
    const json = await res.json()
    return json.products?.[0]?.id
  } catch {
    return undefined
  }
}

export async function seedPayloadCatalog() {
  const payload = await getPayload({ config: configPromise })
  const categoryIds: Record<string, number | string> = {}

  for (const item of KINDARD_CATALOG) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: item.category } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      categoryIds[item.category] = existing.docs[0].id
      continue
    }
    const created = await payload.create({
      collection: 'categories',
      overrideAccess: true,
      data: { title: item.categoryTitle, slug: item.category },
    })
    categoryIds[item.category] = created.id
  }

  let createdCount = 0
  for (const item of KINDARD_CATALOG) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: item.slug } },
      limit: 1,
      overrideAccess: true,
    })
    const medusaProductId = await medusaIdByHandle(item.slug)
    const data: any = {
      title: item.title,
      slug: item.slug,
      generateSlug: false,
      _status: 'published' as const,
      priceInUSDEnabled: true,
      priceInUSD: item.price,
      storefrontImage: item.image,
      medusaProductId: medusaProductId || undefined,
      categories: [categoryIds[item.category]],
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: item.description, version: 1 }],
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      },
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        overrideAccess: true,
        data,
      })
    } else {
      await payload.create({
        collection: 'products',
        overrideAccess: true,
        data,
      })
      createdCount += 1
    }
  }

  return { createdCount, total: KINDARD_CATALOG.length }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seed-payload-catalog.ts')) {
  seedPayloadCatalog()
    .then((result) => {
      console.log(`Payload catalog ready (${result.createdCount} created, ${result.total} total).`)
      process.exit(0)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
