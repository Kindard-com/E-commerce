import { createClient } from "@libsql/client";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  const adminName = "Erickson Poel";
  const email = "admin@example.com";
  const role = "owner";
  const adminNumber = "KIND-ADM-000001";
  
  // Generate random password
  const tempPassword = crypto.randomBytes(12).toString("base64");
  
  // Hash password using scrypt
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(tempPassword, salt, 64).toString("hex");
  const passwordHash = `${salt}:${hash}`;
  
  const id = crypto.randomUUID();

  console.log("Inserting first admin user...");

  try {
    await client.execute({
      sql: `INSERT INTO admin_users (id, admin_number, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, adminNumber, adminName, email, passwordHash, role]
    });
    console.log("Admin inserted successfully.");
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      console.log("Admin user already exists. Skipping insertion.");
    } else {
      console.error(err);
      return;
    }
  }

  const logContent = `# Kindard Admin Setup Log

## First Admin User

Name: ${adminName}
Email: ${email}
Role: ${role}
Temporary Password: ${tempPassword}
Created At: ${new Date().toISOString()}

Important:
This temporary password must be changed after the first login.

Security note:
Do not commit this file to GitHub. Add \`admin.logs.md\` to \`.gitignore\`.
`;

  fs.writeFileSync(path.resolve(process.cwd(), "admin.logs.md"), logContent);
  console.log("admin.logs.md generated successfully.");
}

run().catch(console.error);
