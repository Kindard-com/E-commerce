import { fallbackProducts, type Product } from './products'
import { mapMedusaProduct } from './medusa-mapper'
import { mapPayloadProduct } from './payload-mapper'
import { medusaClient, SALES_CHANNEL_ID } from './medusa'
import { medusaServerClient } from './medusa-server'

const PRODUCT_FIELDS =
  '*variants,*variants.calculated_price,*variants.prices,*options,*categories,*collection,*images,*thumbnail'

export type ProductCatalogSource = 'payload' | 'medusa-store' | 'medusa-admin' | 'merged' | 'fallback'

export type ProductCatalogResult = {
  products: Product[]
  source: ProductCatalogSource
}

async function getDefaultRegionId(): Promise<string | undefined> {
  try {
    const { regions } = await medusaClient.store.region.list()
    return regions[0]?.id
  } catch {
    return undefined
  }
}

function listArgs(limit: number, query?: string, regionId?: string) {
  return {
    limit,
    fields: PRODUCT_FIELDS,
    ...(query ? { q: query } : {}),
    ...(regionId ? { region_id: regionId } : {}),
    ...(SALES_CHANNEL_ID ? { sales_channel_id: SALES_CHANNEL_ID } : {}),
  }
}

async function loadPayloadProducts(limit = 20, query?: string): Promise<Product[]> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })
    const where = query
      ? {
          or: [
            { title: { contains: query } },
            { slug: { contains: query } },
          ],
        }
      : { _status: { equals: 'published' as const } }

    const result = await payload.find({
      collection: 'products',
      depth: 2,
      limit,
      overrideAccess: true,
      where: query
        ? {
            and: [{ _status: { equals: 'published' } }, where],
          }
        : where,
    })

    return (result.docs || []).map(mapPayloadProduct)
  } catch (error) {
    console.warn('[payload] product list failed', error)
    return []
  }
}

async function loadMedusaCatalog(limit = 20, query?: string): Promise<{ products: Product[]; source: 'medusa-store' | 'medusa-admin' | null }> {
  const regionId = await getDefaultRegionId()
  const attempts = [listArgs(limit, query, regionId), listArgs(limit, query)]

  for (const args of attempts) {
    try {
      const { products } = await medusaClient.store.product.list(args)
      if (products?.length) {
        return { products: products.map(mapMedusaProduct), source: 'medusa-store' }
      }
    } catch (error) {
      console.warn('[medusa] store product list failed', error)
    }
  }

  try {
    const { products } = await medusaServerClient.admin.product.list(listArgs(limit, query))
    if (products?.length) {
      return { products: products.map(mapMedusaProduct), source: 'medusa-admin' }
    }
  } catch (error) {
    console.warn('[medusa] admin product list failed', error)
  }

  return { products: [], source: null }
}

function mergeProduct(existing: Product, incoming: Product): Product {
  return {
    ...existing,
    name: incoming.name || existing.name,
    brand: incoming.brand || existing.brand,
    category:
      incoming.category && incoming.category !== 'uncategorized'
        ? incoming.category
        : existing.category,
    id: existing.id,
    medusa_id: existing.medusa_id || incoming.medusa_id,
    payload_id: incoming.payload_id,
    image: existing.image || incoming.image,
    price: existing.price || incoming.price,
    variants: existing.variants?.length ? existing.variants : incoming.variants,
  }
}

export function mergeCatalog(payloadProducts: Product[], medusaProducts: Product[]): Product[] {
  const byMedusaId = new Map<string, Product>()
  const byName = new Map<string, Product>()
  const merged: Product[] = []

  const index = (product: Product) => {
    merged.push(product)
    if (product.medusa_id) byMedusaId.set(String(product.medusa_id), product)
    if (product.name) byName.set(product.name.toLowerCase(), product)
  }

  for (const product of medusaProducts) {
    index(product)
  }

  for (const product of payloadProducts) {
    const existing =
      (product.medusa_id && byMedusaId.get(String(product.medusa_id))) ||
      byName.get(product.name.toLowerCase())

    if (!existing) {
      index(product)
      continue
    }

    const next = mergeProduct(existing, product)
    merged.splice(merged.indexOf(existing), 1, next)
    if (next.medusa_id) byMedusaId.set(String(next.medusa_id), next)
    if (next.name) byName.set(next.name.toLowerCase(), next)
  }

  return merged
}

export async function loadMedusaProducts(limit = 20, query?: string): Promise<ProductCatalogResult> {
  const [payloadProducts, medusa] = await Promise.all([
    loadPayloadProducts(limit, query),
    loadMedusaCatalog(limit, query),
  ])

  if (payloadProducts.length && medusa.products.length) {
    return { products: mergeCatalog(payloadProducts, medusa.products), source: 'merged' }
  }
  if (payloadProducts.length) {
    return { products: payloadProducts, source: 'payload' }
  }
  if (medusa.products.length && medusa.source) {
    return { products: medusa.products, source: medusa.source }
  }

  return { products: [], source: 'fallback' }
}

export async function loadMedusaProductById(rawId: string): Promise<Product | null> {
  if (!rawId) return null
  const id = decodeURIComponent(rawId).split(' ')[0].trim()
  const regionId = await getDefaultRegionId()

  try {
    const { product } = await medusaClient.store.product.retrieve(id, {
      fields: PRODUCT_FIELDS,
      ...(regionId ? { region_id: regionId } : {}),
    })
    if (product) return mapMedusaProduct(product)
  } catch {
    // Try Payload / admin next.
  }

  try {
    const payloadProducts = await loadPayloadProducts(100)
    const match = payloadProducts.find(
      (product) =>
        String(product.id) === id ||
        String(product.payload_id) === id ||
        String(product.medusa_id) === id,
    )
    if (match) return match
  } catch {
    // Fall through.
  }

  try {
    const { product } = await medusaServerClient.admin.product.retrieve(id, {
      fields: PRODUCT_FIELDS,
    })
    if (product) return mapMedusaProduct(product)
  } catch {
    // Fall through to local catalog only for the original demo ids.
  }

  return fallbackProducts.find((product) => String(product.id) === String(id)) || null
}

export function isMedusaUnavailable(source: ProductCatalogSource): boolean {
  return source === 'fallback'
}
