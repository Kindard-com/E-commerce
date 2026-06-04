import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

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

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Adding is_public column to images table...");
  try {
    await db.execute("ALTER TABLE images ADD COLUMN is_public BOOLEAN DEFAULT 1");
    console.log("Successfully added is_public column.");
  } catch (err: any) {
    if (err.message?.includes("duplicate column name") || err.message?.includes("already exists")) {
      console.log("Column is_public already exists.");
    } else {
      console.error("Migration failed:", err);
    }
  }
}

migrate().catch(console.error);
