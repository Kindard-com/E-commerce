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
  console.log("Running migration for AI Worker System tables...");

  const queries = [
    `CREATE TABLE IF NOT EXISTS worker_logs (
      id TEXT PRIMARY KEY,
      worker_name TEXT NOT NULL,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS worker_alerts (
      id TEXT PRIMARY KEY,
      worker_name TEXT NOT NULL,
      alert_type TEXT NOT NULL,
      message TEXT NOT NULL,
      is_sent BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS worker_status (
      worker_name TEXT PRIMARY KEY,
      last_run_at DATETIME,
      last_status TEXT,
      last_message TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS system_health_checks (
      id TEXT PRIMARY KEY,
      component TEXT NOT NULL,
      status TEXT NOT NULL,
      latency_ms INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS access_logs (
      id TEXT PRIMARY KEY,
      image_hash TEXT,
      domain TEXT,
      ip TEXT,
      status_code INTEGER,
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const sql of queries) {
    try {
      await db.execute(sql);
      console.log(`Executed: ${sql.split('(')[0].trim()}`);
    } catch (err: any) {
      console.error("Migration failed:", err);
    }
  }

  console.log("Worker migration complete.");
}

migrate().catch(console.error);
