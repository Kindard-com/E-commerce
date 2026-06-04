import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function init() {
  console.log("Creating database tables...");

  const queries = [
    // Drop existing tables to enforce the new schema
    `DROP TABLE IF EXISTS order_items;`,
    `DROP TABLE IF EXISTS invoices;`,
    `DROP TABLE IF EXISTS orders;`,
    `DROP TABLE IF EXISTS payment_methods;`,
    `DROP TABLE IF EXISTS addresses;`,
    `DROP TABLE IF EXISTS customer_profiles;`,
    `DROP TABLE IF EXISTS account_settings;`,
    `DROP TABLE IF EXISTS activity_logs;`,
    `DROP TABLE IF EXISTS reports;`,
    `DROP TABLE IF EXISTS customer_service_tickets;`,
    `DROP TABLE IF EXISTS users;`,

    `CREATE TABLE IF NOT EXISTS users (
      customer_number TEXT PRIMARY KEY,
      firebase_uid TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      login_provider TEXT,
      provider_user_id TEXT,
      profile_image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS customer_profiles (
      customer_number TEXT PRIMARY KEY,
      full_name TEXT,
      phone TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS account_settings (
      customer_number TEXT PRIMARY KEY,
      language TEXT DEFAULT 'en',
      email_notifications INTEGER DEFAULT 1,
      marketing_consent INTEGER DEFAULT 0,
      security_settings TEXT,
      status TEXT DEFAULT 'active',
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      customer_number TEXT NOT NULL,
      type TEXT NOT NULL, /* 'billing' or 'shipping' */
      street TEXT,
      house_number TEXT,
      postal_code TEXT,
      city TEXT,
      country TEXT,
      is_default INTEGER DEFAULT 0,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS payment_methods (
      id TEXT PRIMARY KEY,
      customer_number TEXT NOT NULL,
      provider TEXT NOT NULL, /* e.g., 'credit_card', 'paypal' */
      secure_token TEXT,
      last4 TEXT,
      expiry TEXT,
      is_default INTEGER DEFAULT 0,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_number TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'unpaid',
      shipping_status TEXT DEFAULT 'unfulfilled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoice_number TEXT UNIQUE NOT NULL,
      customer_number TEXT NOT NULL,
      order_id TEXT NOT NULL UNIQUE,
      total_amount REAL NOT NULL,
      vat_amount REAL NOT NULL,
      payment_status TEXT DEFAULT 'unpaid',
      pdf_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      customer_number TEXT NOT NULL,
      last_online DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
      login_method TEXT,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      report_number TEXT UNIQUE NOT NULL,
      customer_number TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS customer_service_tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL,
      customer_number TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'open',
      priority TEXT DEFAULT 'normal',
      staff_assigned TEXT,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_response_date DATETIME,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS search_logs (
      id TEXT PRIMARY KEY,
      customer_number TEXT,
      firebase_uid TEXT,
      session_id TEXT NOT NULL,
      search_query TEXT,
      search_filters TEXT,
      clicked_product_id TEXT,
      result_count INTEGER,
      search_type TEXT,
      is_logged_in INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS customer_search_preferences (
      id TEXT PRIMARY KEY,
      customer_number TEXT UNIQUE NOT NULL,
      firebase_uid TEXT UNIQUE NOT NULL,
      preferred_categories TEXT,
      preferred_brands TEXT,
      preferred_sizes TEXT,
      preferred_colors TEXT,
      average_price_range TEXT,
      last_search_query TEXT,
      last_clicked_product_id TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS wishlists (
      id TEXT PRIMARY KEY,
      customer_number TEXT NOT NULL,
      product_id TEXT NOT NULL,
      size TEXT,
      color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_number) REFERENCES users(customer_number) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS admin_roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    );`,

    `CREATE TABLE IF NOT EXISTS admin_permissions (
      id TEXT PRIMARY KEY,
      role_id TEXT NOT NULL,
      permission TEXT NOT NULL,
      FOREIGN KEY(role_id) REFERENCES admin_roles(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      admin_number TEXT UNIQUE NOT NULL,
      firebase_uid TEXT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      profile_image_url TEXT,
      last_login_at DATETIME,
      last_online_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT,
      setting_type TEXT,
      category TEXT,
      updated_by_admin_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS legal_pages (
      id TEXT PRIMARY KEY,
      page_type TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT,
      version INTEGER DEFAULT 1,
      status TEXT DEFAULT 'published',
      updated_by_admin_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS settings_audit_logs (
      id TEXT PRIMARY KEY,
      admin_number TEXT NOT NULL,
      action TEXT NOT NULL,
      setting_key TEXT,
      old_value TEXT,
      new_value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const query of queries) {
    await client.execute(query);
  }

  console.log("Database initialized successfully!");
}

init().catch(console.error);
