import { describe, expect, it } from 'vitest'
import { mapMedusaProduct } from '@/storefront/lib/medusa-mapper'

describe('mapMedusaProduct', () => {
  it('maps a store API product with calculated prices', () => {
    const mapped = mapMedusaProduct({
      id: 'prod_store_1',
      title: 'Mini Explorer Hoodie',
      thumbnail: 'https://cdn.example/hoodie.png',
      collection: { title: 'KINDARD KIDS' },
      categories: [{ handle: 'hoodies' }],
      options: [
        { title: 'Color', values: [{ value: '#F5F5F0' }] },
        { title: 'Size', id: 'opt_size', values: [{ value: '3-4Y' }, { value: '4-5Y' }] },
      ],
      variants: [
        {
          manage_inventory: false,
          calculated_price: { calculated_amount: 65, original_amount: 80 },
          options: [{ option_id: 'opt_size', value: '3-4Y' }],
        },
      ],
    })

    expect(mapped.id).toBe('prod_store_1')
    expect(mapped.name).toBe('Mini Explorer Hoodie')
    expect(mapped.price).toBe(65)
    expect(mapped.orig).toBe(80)
    expect(mapped.discount).toBe(19)
    expect(mapped.category).toBe('hoodies')
    expect(mapped.sizes).toEqual(['3-4Y', '4-5Y'])
    expect(mapped.image).toBe('https://cdn.example/hoodie.png')
  })

  it('maps an admin API product with a prices array', () => {
    const mapped = mapMedusaProduct({
      id: 'prod_admin_1',
      title: 'Classic Logo Tee',
      variants: [
        {
          manage_inventory: false,
          prices: [
            { currency_code: 'usd', amount: 40 },
            { currency_code: 'eur', amount: 35 },
          ],
        },
      ],
    })

    expect(mapped.price).toBe(35)
    expect(mapped.brand).toBe('KINDARD KIDS')
    expect(mapped.sizes).toEqual(['One Size'])
  })
})
