import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
dotenv.config()

async function run() {
  const client = createClient({
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string
  })

  const articles = [
    { title: 'Frequently Asked Questions', slug: 'faq' },
    { title: 'Features and Functionalities', slug: 'features-and-functionalities' },
    { title: 'Users and Accounts', slug: 'users-and-accounts' },
    { title: 'Billing and Payments', slug: 'billing-and-payments' }
  ]

  const contentJson = JSON.stringify({
    root: {
      type: 'root', format: '', indent: 0, version: 1,
      children: [
        {
          type: 'paragraph', format: '', indent: 0, version: 1,
          children: [
            { type: 'text', format: 0, mode: 'normal', style: '', text: 'This is the auto-generated content for this article. You can edit this in the Payload Admin dashboard.', version: 1 }
          ]
        }
      ]
    }
  })

  const date = new Date().toISOString()

  for (const a of articles) {
    try {
      await client.execute({
        sql: 'INSERT INTO help_articles (title, slug, content, updated_at, created_at, _status) VALUES (?, ?, ?, ?, ?, ?)',
        args: [a.title, a.slug, contentJson, date, date, 'published']
      })
      console.log(`Inserted ${a.title}`)
    } catch(e) {
      console.error(e)
    }
  }

  // Update link_url in cards
  try {
    const { rows } = await client.execute('SELECT id, title FROM payload_pages_blocks_help_center_cards')
    for (const row of rows) {
      let slug = ''
      if (row.title === 'Frequently Asked Questions') slug = 'faq'
      if (row.title === 'Features and Functionalities') slug = 'features-and-functionalities'
      if (row.title === 'Users and Accounts') slug = 'users-and-accounts'
      if (row.title === 'Billing and Payments') slug = 'billing-and-payments'
      
      if (slug) {
        await client.execute({
          sql: 'UPDATE payload_pages_blocks_help_center_cards SET link_url = ? WHERE id = ?',
          args: [`/help-contact/blogs/${slug}`, row.id]
        })
        console.log(`Updated link for card: ${row.title}`)
      }
    }
  } catch(e) {
    console.error(e)
  }
}

run().catch(console.error).finally(() => process.exit(0))
