import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.NEON_DATABASE_URL);

async function run() {
  try {
    console.log("Creating customer_addresses...");
    await sql`
      CREATE TABLE IF NOT EXISTS customer_addresses (
        id VARCHAR(255) PRIMARY KEY,
        customer_number VARCHAR(255),
        type VARCHAR(50),
        street VARCHAR(255),
        house_number VARCHAR(50),
        postal_code VARCHAR(50),
        city VARCHAR(100),
        country VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating customer_payment_methods...");
    await sql`
      CREATE TABLE IF NOT EXISTS customer_payment_methods (
        id VARCHAR(255) PRIMARY KEY,
        customer_number VARCHAR(255),
        provider VARCHAR(100),
        secure_token VARCHAR(255),
        last4 VARCHAR(10),
        expiry VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating wishlists...");
    await sql`
      CREATE TABLE IF NOT EXISTS wishlists (
        id VARCHAR(255) PRIMARY KEY,
        customer_number VARCHAR(255),
        product_id VARCHAR(255),
        size VARCHAR(50),
        color VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating custom_invoices...");
    await sql`
      CREATE TABLE IF NOT EXISTS custom_invoices (
        id VARCHAR(255) PRIMARY KEY,
        customer_number VARCHAR(255),
        amount DECIMAL(10, 2),
        status VARCHAR(50),
        date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log("Tables created successfully.");
  } catch (e) {
    console.error(e);
  }
}

run();
