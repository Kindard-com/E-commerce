import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";

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

function generateUUID() {
  return crypto.randomUUID();
}

async function registerDomains() {
  const newDomains = [
    "kindard.com",
    "api.kindard.com",
    "ad2.kcms.kopscore.com",
    "cdn.kindardcloud.com",
    "2log.db.kcdndb.com",
    "auth.kindard.com",
    "status.kindard.com",
    "docs.kindard.com"
  ];

  console.log("Registering domains and updating permissions...");

  // Fetch all existing images
  const imagesRes = await db.execute("SELECT id FROM images");
  const imageIds = imagesRes.rows.map(r => r.id as string);
  console.log(`Found ${imageIds.length} existing images.`);

  for (const domain of newDomains) {
    let domainId = "";
    try {
      const dRes = await db.execute({ sql: "SELECT id FROM domains WHERE domain = ?", args: [domain] });
      if (dRes.rows.length > 0) {
        domainId = dRes.rows[0].id as string;
      } else {
        domainId = generateUUID();
        await db.execute({ sql: "INSERT INTO domains (id, domain) VALUES (?, ?)", args: [domainId, domain] });
      }
      console.log(`Registered domain: ${domain}`);
    } catch (e) {
      console.error(`Failed to register domain ${domain}:`, e);
      continue;
    }

    // Grant this domain access to all existing images
    for (const imageId of imageIds) {
      try {
        await db.execute({
          sql: "INSERT INTO domain_image_permissions (domain_id, image_id) VALUES (?, ?)",
          args: [domainId, imageId]
        });
      } catch (err: any) {
        // Ignore unique constraint errors
        if (!err.message?.includes("UNIQUE constraint failed") && !err.message?.includes("SQLITE_CONSTRAINT")) {
           console.error(`Failed to grant permission for image ${imageId} to domain ${domain}:`, err);
        }
      }
    }
  }

  console.log("Domain registration complete.");
}

registerDomains().catch(console.error);
