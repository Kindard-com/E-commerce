import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  console.log("Updating database for Kids Retheme...");

  const queries = [
    {
      sql: `UPDATE site_settings SET setting_value = ? WHERE setting_key = 'marketing_banner_text'`,
      args: ["NEW ARRIVALS: MINI EXPLORER COLLECTION | FREE SHIPPING OVER $150 | PLAY IN STYLE | MEMBERS GET EARLY ACCESS"]
    },
    {
      sql: `UPDATE site_settings SET setting_value = ? WHERE setting_key = 'footer_description'`,
      args: ["Premium kidswear. Unmatched comfort, playful energy.\\nMade for the little ones who start trends. Since 2019."]
    },
    {
      sql: `UPDATE site_settings SET setting_value = ? WHERE setting_key = 'footer_copyright'`,
      args: ["© 2026 Kindard Kids. All rights reserved."]
    },
    {
      sql: `UPDATE legal_pages SET content = ? WHERE page_type = 'privacy_policy'`,
      args: ["# Kindard Kids Privacy Policy\n\nAt Kindard Kids, the privacy and security of you and your little ones is our top priority. We use industry-leading security to ensure your data is safe.\n\n## 1. Information We Collect\nWe collect information to help us deliver the best premium kidswear shopping experience. This includes basic account info, shipping details, and shopping preferences.\n\n## 2. How We Use It\nYour information is used strictly to process your orders, provide customer support, and, with your consent, update you on exciting new kids drops."]
    },
    {
      sql: `UPDATE legal_pages SET content = ? WHERE page_type = 'terms_of_service'`,
      args: ["# Kindard Kids Terms of Service\n\nWelcome to Kindard Kids. By using our website, you agree to these terms. Our premium streetwear for children is designed for play, durability, and style.\n\n## 1. Purchases\nAll orders are subject to availability. We reserve the right to cancel any order if an item is out of stock.\n\n## 2. Returns\nWe accept returns on unworn, unwashed children's clothing with original tags attached within 30 days of purchase."]
    }
  ];

  for (const query of queries) {
    await client.execute(query);
  }

  console.log("Update complete!");
}

run().catch(console.error);
