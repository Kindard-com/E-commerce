import type { Field } from 'payload'
import { fetchMedusaProducts } from '@/utilities/medusa'

export const MedusaProductField: Field = {
  name: 'medusaProductId',
  type: 'select',
  admin: {
    description: 'Select a product from your MedusaJS backend to feature here.',
  },
  options: async () => {
    const products = await fetchMedusaProducts()
    
    if (!products || products.length === 0) {
      return [{ label: 'No products found', value: 'none' }]
    }

    return products.map((product: any) => ({
      label: product.title,
      value: product.id,
    }))
  },
}
