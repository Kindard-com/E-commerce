import type { Product } from './products'
import { normalizeCategory } from './medusa-mapper'
import { normalizeStorefrontImage } from './storefront-image'

function mediaUrl(image: unknown): string | undefined {
  if (!image) return undefined
  if (typeof image === 'string') {
    if (image.startsWith('http') || image.startsWith('/')) return image
    return `/api/media/file/${image}`
  }
  if (typeof image === 'object') {
    const doc = image as { url?: string | null; filename?: string | null }
    if (doc.url) return doc.url
    if (doc.filename) return `/api/media/file/${doc.filename}`
  }
  return undefined
}

function majorPrice(value: number | null | undefined): number {
  if (value == null || Number.isNaN(Number(value))) return 0
  const amount = Number(value)
  return amount >= 100 ? amount / 100 : amount
}

function categoryHandle(categories: unknown): string {
  const first = Array.isArray(categories) ? categories[0] : categories
  if (!first) return 'uncategorized'
  if (typeof first === 'object') {
    const doc = first as { slug?: string | null; title?: string | null }
    return normalizeCategory(doc.slug || doc.title)
  }
  return 'uncategorized'
}

export function mapPayloadProduct(doc: any): Product {
  const galleryImage = mediaUrl(doc.gallery?.[0]?.image)
  const metaImage = mediaUrl(doc.meta?.image)
  const image = normalizeStorefrontImage(doc.storefrontImage || galleryImage || metaImage)
  const variantDocs = Array.isArray(doc.variants?.docs) ? doc.variants.docs : []
  const sizes = new Set<string>()
  const colors = new Set<string>()

  for (const variant of variantDocs) {
    const options = Array.isArray(variant?.options) ? variant.options : []
    for (const option of options) {
      const label = String(option?.variantType?.label || option?.variantType?.name || '').toLowerCase()
      const value = option?.label || option?.value
      if (!value) continue
      if (label.includes('size')) sizes.add(String(value))
      if (label.includes('color')) colors.add(String(value))
    }
  }

  return {
    id: doc.medusaProductId || doc.slug || String(doc.id),
    payload_id: doc.id,
    medusa_id: doc.medusaProductId || undefined,
    variants: variantDocs,
    brand: 'KINDARD KIDS',
    name: doc.title,
    price: majorPrice(doc.priceInUSD),
    orig: null,
    discount: null,
    image,
    dark: false,
    colors: colors.size ? Array.from(colors) : ['#000000'],
    sizes: sizes.size ? Array.from(sizes) : ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    avail: sizes.size ? Array.from(sizes) : ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    rating: 5,
    isNew: true,
    category: categoryHandle(doc.categories),
  }
}
