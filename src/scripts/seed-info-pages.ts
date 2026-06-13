import { getPayload } from 'payload'
import configPromise from '../payload.config'
import * as dotenv from 'dotenv'
dotenv.config()

const createRichText = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          }
        ]
      }
    ]
  }
})

async function run() {
  const payload = await getPayload({ config: configPromise })

  const pagesToCreate = [
    {
      title: 'Shipping Info',
      slug: 'shipping-info',
      content: 'This is the official Shipping Info page. You can edit this text from the Payload Admin dashboard.'
    },
    {
      title: 'Returns & Exchanges',
      slug: 'returns-exchanges',
      content: 'This is the official Returns & Exchanges policy page. You can edit this text from the Payload Admin dashboard.'
    },
    {
      title: 'Size Guide',
      slug: 'size-guide',
      content: 'Here is our Size Guide. Edit this page in the Payload Admin dashboard to add your size charts or sizing recommendations.'
    }
  ]

  for (const page of pagesToCreate) {
    try {
      // Check if it already exists to avoid duplicates
      const { docs } = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } }
      })

      if (docs.length > 0) {
        console.log(`Page already exists: ${page.slug}`)
        continue
      }

      await payload.create({
        collection: 'pages',
        data: {
          title: page.title,
          slug: page.slug,
          _status: 'published',
          layout: [
            {
              blockType: 'content',
              columns: [
                {
                  size: 'full',
                  richText: createRichText(page.content) as any
                }
              ]
            }
          ]
        }
      })
      console.log(`Created page: ${page.title}`)
    } catch (e) {
      console.error(`Error creating ${page.title}:`, e)
    }
  }
}

run().catch(console.error).finally(() => process.exit(0))
