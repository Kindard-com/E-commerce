import { fallbackProducts, type Product } from './products'
import { mapMedusaProduct } from './medusa-mapper'
import { medusaClient } from './medusa'
import { medusaServerClient } from './medusa-server'

const PRODUCT_FIELDS =
  '*variants,*variants.calculated_price,*variants.prices,*options,*categories,*collection,*images,*thumbnail'

export async function loadMedusaProducts(limit = 20, query?: string): Promise<Product[]> {
  const listArgs = {
    limit,
    fields: PRODUCT_FIELDS,
    ...(query ? { q: query } : {}),
  }
  try {
    const { products } = await medusaClient.store.product.list(listArgs)
    if (products?.length) {
      return products.map(mapMedusaProduct)
    }
  } catch (error) {
    console.warn('[medusa] store product list failed, trying admin API', error)
  }

  try {
    const { products } = await medusaServerClient.admin.product.list(listArgs)
    if (products?.length) {
      return products.map(mapMedusaProduct)
    }
  } catch (error) {
    console.warn('[medusa] admin product list failed, using fallback catalog', error)
  }

  return fallbackProducts
}

export async function loadMedusaProductById(rawId: string): Promise<Product | null> {
  if (!rawId) return null
  const id = decodeURIComponent(rawId).split(' ')[0].trim()

  const fallback = fallbackProducts.find((product) => String(product.id) === String(id))
  if (fallback) return fallback

  try {
    const { product } = await medusaClient.store.product.retrieve(id, {
      fields: PRODUCT_FIELDS,
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
    return null
  }

  return null
}

export function isFallbackCatalog(products: Product[]): boolean {
  return products === fallbackProducts
}
