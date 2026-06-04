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

async function makePublic() {
  const domain = "public";
  let domainId = "";

  console.log("Registering 'public' domain for email clients...");

  try {
    const dRes = await db.execute({ sql: "SELECT id FROM domains WHERE domain = ?", args: [domain] });
    if (dRes.rows.length > 0) {
      domainId = dRes.rows[0].id as string;
    } else {
      domainId = generateUUID();
      await db.execute({ sql: "INSERT INTO domains (id, domain) VALUES (?, ?)", args: [domainId, domain] });
    }
  } catch (e) {
    console.error(e);
    return;
  }

  // The hashes used in the email templates
  const hashesToMakePublic = [
    "fea8c82ade91d395b084c6e991a712b4", // kindard.svg
    "757384df49f09a7b753572039751d50f"  // movement_clothing.png
  ];

  for (const hash of hashesToMakePublic) {
    try {
      const imageResult = await db.execute({
        sql: "SELECT id FROM images WHERE hash = ?",
        args: [hash],
      });
      
      if (imageResult.rows.length > 0) {
        const imageId = imageResult.rows[0].id;
        await db.execute({
          sql: "INSERT INTO domain_image_permissions (domain_id, image_id) VALUES (?, ?)",
          args: [domainId, imageId]
        });
        console.log(`Granted public access to image hash: ${hash}`);
      }
    } catch (err: any) {
      if (!err.message?.includes("UNIQUE constraint failed") && !err.message?.includes("SQLITE_CONSTRAINT")) {
        console.error(err);
      }
    }
  }

  console.log("Done.");
}

makePublic().catch(console.error);
