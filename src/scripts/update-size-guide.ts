import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })

  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'size-guide' } }
    })

    if (docs.length === 0) {
      console.error('size-guide page not found in CMS!')
      return
    }

    const page = docs[0]

    const updatedLayout = [
      {
        blockType: 'sizeGuide',
        headline: 'Size Guide',
        description: 'Find your perfect fit. Our sizes run true to fit, but if you prefer an oversized look, we recommend sizing up.',
        cards: [
          {
            sizeName: 'S',
            measurements: 'Chest: 38", Length: 27"',
            fitType: 'regular',
            description: 'A standard fit that provides just enough room for comfort without being baggy.'
          },
          {
            sizeName: 'M',
            measurements: 'Chest: 40", Length: 28"',
            fitType: 'regular',
            description: 'Our most popular size, offering a balanced and classic silhouette.'
          },
          {
            sizeName: 'L',
            measurements: 'Chest: 42", Length: 29"',
            fitType: 'regular',
            description: 'Ideal for broader shoulders or if you prefer a slightly looser fit.'
          },
          {
            sizeName: 'XL',
            measurements: 'Chest: 44", Length: 30"',
            fitType: 'oversized',
            description: 'Designed to have a relaxed, oversized drop-shoulder fit.'
          }
        ]
      }
    ]

    await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        layout: updatedLayout as any
      }
    })

    console.log('Successfully updated size-guide page with Size Guide block!')
  } catch (e) {
    console.error('Error updating size-guide:', e)
  }
}

run().catch(console.error).finally(() => process.exit(0))
