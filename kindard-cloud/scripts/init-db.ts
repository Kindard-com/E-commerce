import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

// Simple .env.local loader for the script
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
         value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

if (!process.env.TURSO_DATABASE_URL) {
  console.error("TURSO_DATABASE_URL is not set.");
  process.exit(1);
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function init() {
  console.log("Initializing database...");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      hash TEXT UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      mime_type TEXT,
      size_bytes INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS domains (
      id TEXT PRIMARY KEY,
      domain TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS domain_image_permissions (
      domain_id TEXT REFERENCES domains(id),
      image_id TEXT REFERENCES images(id),
      PRIMARY KEY (domain_id, image_id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS access_logs (
      id TEXT PRIMARY KEY,
      image_hash TEXT,
      requesting_domain TEXT,
      ip_address TEXT,
      status_code INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Database initialized successfully.");
}

init().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});
