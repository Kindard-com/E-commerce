import { getPayload } from 'payload'
import configPromise from '../payload.config'

const createTextNode = (text: string, format = 0) => ({
  type: 'text',
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const createHeading = (text: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  format: '',
  indent: 0,
  version: 1,
  children: [createTextNode(text)]
})

const createParagraph = (text: string) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  children: [createTextNode(text)]
})

const createList = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  format: '',
  indent: 0,
  version: 1,
  children: items.map(text => ({
    type: 'listitem',
    format: '',
    indent: 0,
    version: 1,
    children: [createTextNode(text)],
    value: 1
  }))
})

const createLexicalRoot = (children: any[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children
  }
})

async function run() {
  const payload = await getPayload({ config: configPromise })

  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'returns-exchanges' } }
    })

    if (docs.length === 0) {
      console.error('returns-exchanges page not found in CMS!')
      return
    }

    const page = docs[0]

    const richTextNodes = [
      createParagraph('We want you and your little ones to be completely happy with your Kindard Kids purchase. If something isn’t quite right, we’re here to help.'),
      createHeading('Returns Policy'),
      createParagraph('You may return unworn, unwashed, and unaltered items within 30 days of receiving your order for a full refund to your original payment method. Please ensure all original tags are attached.'),
      createHeading('How to Start a Return', 'h3'),
      createParagraph('To initiate a return, simply head over to our Returns Portal. You will need your order number and the email address used for the purchase. Once approved, you will receive a prepaid return shipping label.'),
      createHeading('Exchanges'),
      createParagraph('Need a different size or color? The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.'),
      createHeading('Condition of Returned Items', 'h3'),
      createList([
        'Items must be unworn and unwashed.',
        'Original tags must be attached.',
        'Shoes must be returned in their original shoebox.',
        'Final sale items are not eligible for return.'
      ]),
      createHeading('Refund Processing Time'),
      createParagraph('Once we receive your return at our warehouse, please allow 5-7 business days for your refund to be processed. You will receive an email confirmation once your refund has been issued.'),
      createHeading('Non-Returnable Items'),
      createParagraph('For hygiene and safety reasons, certain items such as undergarments, swimwear without the protective strip, and pierced jewelry cannot be returned. Gift cards are also non-refundable.')
    ]

    const updatedLayout = [
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: createLexicalRoot(richTextNodes) as any
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

    console.log('Successfully updated returns-exchanges page with comprehensive policy!')
  } catch (e) {
    console.error('Error updating returns-exchanges:', e)
  }
}

run().catch(console.error).finally(() => process.exit(0))
