import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/lib/auth";
import { ImagePermissionsSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip, 20, 60000)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = ImagePermissionsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.issues }, { status: 400 });
    }

    const { image_hash, domains } = parsed.data;

    // Get image id
    const imageResult = await db.execute({
      sql: "SELECT id FROM images WHERE hash = ?",
      args: [image_hash],
    });

    if (imageResult.rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    const imageId = imageResult.rows[0].id;

    const addedDomains = [];

    for (const domain of domains) {
      // Get domain id
      const domainResult = await db.execute({
        sql: "SELECT id FROM domains WHERE domain = ?",
        args: [domain],
      });

      if (domainResult.rows.length === 0) {
        // Option: skip or error. Let's return an error if a domain is unknown.
        return NextResponse.json({ error: `Domain not found: ${domain}` }, { status: 404 });
      }
      const domainId = domainResult.rows[0].id;

      try {
        await db.execute({
          sql: "INSERT INTO domain_image_permissions (domain_id, image_id) VALUES (?, ?)",
          args: [domainId, imageId],
        });
        addedDomains.push(domain);
      } catch (err: any) {
        if (!err.message?.includes("UNIQUE constraint failed") && !err.message?.includes("SQLITE_CONSTRAINT")) {
           throw err;
        }
      }
    }

    return NextResponse.json({ 
      message: "Permissions updated successfully", 
      image_hash, 
      domains_added: addedDomains 
    }, { status: 200 });
  } catch (error) {
    console.error("Image permissions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
