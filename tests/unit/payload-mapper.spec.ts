import { describe, expect, it } from 'vitest'
import { mapPayloadProduct } from '@/storefront/lib/payload-mapper'
import { mergeCatalog } from '@/storefront/lib/load-products'
import type { Product } from '@/storefront/lib/products'

const payloadTee = () =>
  mapPayloadProduct({
    id: 12,
    title: 'Classic Logo Tee',
    slug: 'classic-logo-tee',
    priceInUSD: 3500,
    storefrontImage: '/api/images?file=tee.png',
    medusaProductId: 'prod_123',
    categories: [{ slug: 'tees', title: 'Tees' }],
  })

describe('mapPayloadProduct', () => {
  it('maps a published Payload product onto the storefront catalog shape', () => {
    const product = payloadTee()

    expect(product.name).toBe('Classic Logo Tee')
    expect(product.price).toBe(35)
    expect(product.image).toBe('/api/images?file=tee.png')
    expect(product.category).toBe('tees')
    expect(product.payload_id).toBe(12)
    expect(product.medusa_id).toBe('prod_123')
  })

  it('keeps dollar amounts that are already major units', () => {
    const product = mapPayloadProduct({
      id: 1,
      title: 'Beanie',
      priceInUSD: 24,
    })
    expect(product.price).toBe(24)
  })

  it('falls back to gallery media when storefrontImage is missing', () => {
    const product = mapPayloadProduct({
      id: 2,
      title: 'Hoodie',
      gallery: [{ image: { url: '/api/media/file/hoodie.png' } }],
    })
    expect(product.image).toBe('/api/media/file/hoodie.png')
  })
})

describe('mergeCatalog', () => {
  const medusaTee = {
    id: 'prod_123',
    medusa_id: 'prod_123',
    brand: 'KINDARD KIDS',
    name: 'Classic Logo Tee',
    price: 35,
    orig: null,
    discount: null,
    image: 'https://cdn.example/tee.png',
    colors: ['#000'],
    sizes: ['3-4Y'],
    avail: ['3-4Y'],
    rating: 5,
    isNew: true,
    category: 'shirts',
  } satisfies Product

  it('merges Payload copy onto a matching Medusa product', () => {
    const [product] = mergeCatalog([payloadTee()], [medusaTee])
    expect(product).toMatchObject({
      id: 'prod_123',
      payload_id: 12,
      name: 'Classic Logo Tee',
      image: 'https://cdn.example/tee.png',
      category: 'tees',
    })
  })

  it('keeps Payload-only products when Medusa has no match', () => {
    const extra = mapPayloadProduct({ id: 99, title: 'CMS Only Jacket', priceInUSD: 95 })
    const products = mergeCatalog([extra], [medusaTee])
    expect(products.map((item) => item.name)).toEqual(['Classic Logo Tee', 'CMS Only Jacket'])
  })
})

describe('normalizeStorefrontImage', () => {
  it('rewrites localhost product URLs to same-origin paths', async () => {
    const { normalizeStorefrontImage } = await import('@/storefront/lib/storefront-image')
    expect(
      normalizeStorefrontImage('http://localhost:3000/api/images?file=product_kid_tee_blue_1779803656124.png'),
    ).toBe('/api/images?file=product_kid_tee_blue_1779803656124.png')
    expect(normalizeStorefrontImage('https://cdn.example/tee.png')).toBe('https://cdn.example/tee.png')
  })
})
