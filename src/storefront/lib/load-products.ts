import { fallbackProducts, type Product } from './products'
import { mapMedusaProduct } from './medusa-mapper'
import { medusaClient, SALES_CHANNEL_ID } from './medusa'
import { medusaServerClient } from './medusa-server'

const PRODUCT_FIELDS =
  '*variants,*variants.calculated_price,*variants.prices,*options,*categories,*collection,*images,*thumbnail'

export type ProductCatalogSource = 'medusa-store' | 'medusa-admin' | 'fallback'

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

export async function loadMedusaProducts(limit = 20, query?: string): Promise<ProductCatalogResult> {
  const regionId = await getDefaultRegionId()
  const attempts = [
    listArgs(limit, query, regionId),
    listArgs(limit, query),
  ]

  for (const args of attempts) {
    try {
      const { products } = await medusaClient.store.product.list(args)
      if (products?.length) {
        return {
          products: products.map(mapMedusaProduct),
          source: 'medusa-store',
        }
      }
    } catch (error) {
      console.warn('[medusa] store product list failed', error)
    }
  }

  try {
    const { products } = await medusaServerClient.admin.product.list(listArgs(limit, query))
    if (products?.length) {
      return {
        products: products.map(mapMedusaProduct),
        source: 'medusa-admin',
      }
    }
  } catch (error) {
    console.warn('[medusa] admin product list failed', error)
  }

  return {
    products: [],
    source: 'fallback',
  }
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
    // Try admin retrieve next — storefront ids can be admin-only during local setup.
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
