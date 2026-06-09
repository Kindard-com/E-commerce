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

  const articlesData = [
    {
      title: 'Frequently Asked Questions',
      slug: 'faq',
      content: createRichText('Here are the answers to some of the most frequently asked questions about shopping with Kindard Kids, sizing, and our materials. Our sizes run true to fit, and we use 100% organic cotton.')
    },
    {
      title: 'Features and Functionalities',
      slug: 'features-and-functionalities',
      content: createRichText('Learn about our premium fabric technology, durability features, and care instructions. All our clothes are machine washable and designed to withstand rigorous playground activities.')
    },
    {
      title: 'Users and Accounts',
      slug: 'users-and-accounts',
      content: createRichText('Manage your Kindard Kids account, order history, and saved items. You can reset your password or update your shipping address from your account settings.')
    },
    {
      title: 'Billing and Payments',
      slug: 'billing-and-payments',
      content: createRichText('We accept Visa, MasterCard, American Express, and PayPal. All payments are securely processed. If you have billing inquiries, please contact our support team.')
    }
  ]

  for (const a of articlesData) {
    try {
      await payload.create({
        collection: 'help-articles',
        data: {
          title: a.title,
          slug: a.slug,
          content: a.content as any,
          _status: 'published'
        }
      })
      console.log(`Created article: ${a.title}`)
    } catch (e) {
      console.error(`Error creating ${a.title}:`, e)
    }
  }

  const { docs: pages } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'help-contact' } }
  })

  if (pages.length > 0) {
    const page = pages[0]
    const layout = page.layout?.map(block => {
      if (block.blockType === 'helpCenter') {
        const updatedCards = block.cards?.map(card => {
          if (card.title === 'Frequently Asked Questions') {
            return { ...card, linkUrl: '/help-contact/blogs/faq' }
          }
          if (card.title === 'Features and Functionalities') {
            return { ...card, linkUrl: '/help-contact/blogs/features-and-functionalities' }
          }
          if (card.title === 'Users and Accounts') {
            return { ...card, linkUrl: '/help-contact/blogs/users-and-accounts' }
          }
          if (card.title === 'Billing and Payments') {
            return { ...card, linkUrl: '/help-contact/blogs/billing-and-payments' }
          }
          return card
        })
        return { ...block, cards: updatedCards }
      }
      return block
    })

    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout }
    })
    console.log('Updated help-contact page cards!')
  }
}

run().catch(console.error).finally(() => process.exit(0))
