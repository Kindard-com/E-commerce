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

function generateHash(length = 16) {
  return crypto.randomBytes(length).toString("hex");
}
function generateUUID() {
  return crypto.randomUUID();
}

async function uploadImages() {
  const publicDir = path.join(process.cwd(), "public");
  const files = fs.readdirSync(publicDir);

  const images = files.filter(f => /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(f));
  
  // 1. Register the domain if it doesn't exist
  const domain = "www.kindardcloud.com";
  let domainId = "";
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
  }

  const results = [];

  for (const file of images) {
    const hash = generateHash(16);
    const id = generateUUID();
    const ext = path.extname(file).toLowerCase();
    
    let mime = "application/octet-stream";
    if (ext === ".png") mime = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
    else if (ext === ".svg") mime = "image/svg+xml";
    else if (ext === ".ico") mime = "image/x-icon";
    else if (ext === ".webp") mime = "image/webp";

    const originalUrl = `/${file}`;
    const stats = fs.statSync(path.join(publicDir, file));

    await db.execute({
      sql: `INSERT INTO images (id, hash, original_url, mime_type, size_bytes) VALUES (?, ?, ?, ?, ?)`,
      args: [id, hash, originalUrl, mime, stats.size]
    });

    await db.execute({
      sql: `INSERT INTO domain_image_permissions (domain_id, image_id) VALUES (?, ?)`,
      args: [domainId, id]
    });

    results.push({ file, hash, url: `https://www.kindardcloud.com/img/${hash}` });
  }

  // Write the results to a markdown file in the root for easy access
  const mdContent = `# Registered Public Images\n\n| File | Hash | CDN URL |\n|---|---|---|\n` +
    results.map(r => `| ${r.file} | \`${r.hash}\` | [${r.url}](${r.url}) |`).join('\n');
    
  fs.writeFileSync(path.join(process.cwd(), "public-images-hashes.md"), mdContent);
  console.log("=== UPLOAD COMPLETE ===");
  console.log(`Registered ${results.length} images. Results written to public-images-hashes.md`);
}

uploadImages().catch(console.error);
