import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = createClient({
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string
  });
  const res = await client.execute("SELECT * FROM payload_pages WHERE slug = 'help-contact'");
  console.log(res.rows);
  const pageId = res.rows[0]?.id;
  if (!pageId) return console.log('Page not found');
  
  const existingBlocks = await client.execute("SELECT * FROM payload_pages_blocks_ticket_form WHERE _parent_id = " + pageId);
  if (existingBlocks.rows.length === 0) {
    const uuid = 'custom-uuid-' + Date.now();
    await client.execute({
      sql: "INSERT INTO payload_pages_blocks_ticket_form (_order, _parent_id, _path, id, heading, description, success_message, block_name) VALUES (1, ?, 'layout', ?, 'Submit a Support Ticket', 'Please fill out the form below and our team will get back to you shortly.', 'Your ticket has been submitted successfully!', NULL)",
      args: [pageId, uuid]
    });
    console.log('Inserted block successfully!');
  } else {
  }
}
run();
