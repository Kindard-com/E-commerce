import { describe, expect, it } from 'vitest'
import { formatMoney } from '@/storefront/lib/money'
import { findVariantId } from '@/storefront/lib/variants'
import type { Product } from '@/storefront/lib/products'

describe('formatMoney', () => {
  it('formats EUR amounts from Medusa', () => {
    expect(formatMoney(35, 'EUR')).toContain('35')
  })
})

describe('findVariantId', () => {
  const product = {
    id: 'prod_1',
    brand: 'KINDARD KIDS',
    name: 'Classic Logo Tee',
    price: 35,
    orig: null,
    discount: null,
    colors: ['Blue'],
    sizes: ['2-3Y', '3-4Y'],
    avail: ['2-3Y', '3-4Y'],
    rating: 5,
    isNew: true,
    category: 'tees',
    variants: [
      { id: 'var_a', options: [{ title: 'Size', value: '2-3Y' }, { title: 'Color', value: 'Blue' }] },
      { id: 'var_b', options: [{ title: 'Size', value: '3-4Y' }, { title: 'Color', value: 'Blue' }] },
    ],
  } as Product

  it('matches size and color to a Medusa variant', () => {
    expect(findVariantId(product, '3-4Y', 'Blue')).toBe('var_b')
  })
})
