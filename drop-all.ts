import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

async function dropAll() {
  const tablesResult = await client.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`);
  let tables = tablesResult.rows.map(row => row.name as string);
  console.log('Tables to drop:', tables);

  const stmts = [];
  stmts.push('PRAGMA foreign_keys = OFF;');
  
  // Also drop views to avoid dependency issues
  const viewsResult = await client.execute(`SELECT name FROM sqlite_master WHERE type='view'`);
  for (const row of viewsResult.rows) {
    stmts.push(`DROP VIEW IF EXISTS "${row.name}";`);
  }

  for (const table of tables) {
    stmts.push(`DROP TABLE IF EXISTS "${table}";`);
  }

  stmts.push('PRAGMA foreign_keys = ON;');

  try {
    await client.batch(stmts, 'write');
    console.log('All tables and views dropped!');
  } catch (e) {
    console.error('Failed to batch drop:', e);
  }
}

dropAll().catch(console.error);
