import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = createClient({
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string
  });
  
  const res = await client.execute("SELECT * FROM payload_pages WHERE slug = 'help-contact'");
  const pageId = res.rows[0]?.id;
  if (!pageId) return console.log('Page not found');
  
  // Shift existing ticket form to order 2
  await client.execute({
    sql: "UPDATE payload_pages_blocks_ticket_form SET _order = 2 WHERE _parent_id = ?",
    args: [pageId]
  });

  // Check if help center block already exists
  const existing = await client.execute("SELECT * FROM payload_pages_blocks_help_center WHERE _parent_id = " + pageId);
  if (existing.rows.length === 0) {
    const uuid = 'help-uuid-' + Date.now();
    await client.execute({
      sql: "INSERT INTO payload_pages_blocks_help_center (_order, _parent_id, _path, id, hero_title, hero_subtitle, search_placeholder, block_name) VALUES (1, ?, 'layout', ?, 'Welcome! How can we help?', 'Search in our help center for quick answers', 'Search for questions or topics...', NULL)",
      args: [pageId, uuid]
    });
    
    // Insert cards
    const cards = [
      { icon: 'help-circle', title: 'Frequently Asked Questions', desc: 'Find answers to common questions about shopping with Kindard Kids, sizing, and our materials.' },
      { icon: 'smartphone-charging', title: 'Features and Functionalities', desc: 'Learn about our premium fabric technology, durability features, and care instructions.' },
      { icon: 'users', title: 'Users and Accounts', desc: 'Manage your Kindard Kids account, order history, and saved items.' },
      { icon: 'wallet', title: 'Billing and Payments', desc: 'Information about accepted payment methods, secure checkout, and billing inquiries.' }
    ];
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      await client.execute({
        sql: "INSERT INTO payload_pages_blocks_help_center_cards (_order, _parent_id, id, icon, title, description) VALUES (?, ?, ?, ?, ?, ?)",
        args: [i + 1, uuid, 'card-' + i + '-' + Date.now(), card.icon, card.title, card.desc]
      });
    }
    console.log('Inserted help center block and cards successfully!');
  } else {
    console.log('Help center block already exists');
  }
}
run();
