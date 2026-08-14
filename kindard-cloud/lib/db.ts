import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || "file:./kindard-cloud.db";

export const db = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
