import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function run() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "home_page" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "hero_title" text,
        "hero_subtitle" text,
        "hero_cta_text" text,
        "hero_cta_url" text,
        "hero_image_url" text,
        "features_section_title" text,
        "features_section_subtitle" text,
        "faq_section_title" text,
        "faq_section_subtitle" text,
        "cta_section_title" text,
        "cta_section_subtitle" text,
        "cta_section_button_text" text,
        "cta_section_button_url" text,
        "updated_at" text,
        "created_at" text
      );
    `);
    console.log('Created home_page table');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "home_page_features_section_features" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" text PRIMARY KEY NOT NULL,
        "title" text,
        "description" text,
        "image_url" text,
        FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON UPDATE no action ON DELETE cascade
      );
    `);
    console.log('Created home_page_features_section_features table');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "home_page_faq_section_faqs" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" text PRIMARY KEY NOT NULL,
        "question" text,
        "answer" text,
        FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON UPDATE no action ON DELETE cascade
      );
    `);
    console.log('Created home_page_faq_section_faqs table');
    
    // Also create subscribers table just in case!
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "subscribers" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "email" text,
        "updated_at" text,
        "created_at" text
      );
    `);
    console.log('Created subscribers table');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
