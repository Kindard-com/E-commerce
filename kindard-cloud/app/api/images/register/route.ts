import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/lib/auth";
import { RegisterImageSchema } from "@/lib/validation";
import { generateUUID, generateHash } from "@/lib/hash";
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
    const parsed = RegisterImageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.issues }, { status: 400 });
    }

    const { original_url, mime_type, size_bytes, is_public } = parsed.data;
    const imageId = generateUUID();
    const hash = generateHash(16);
    
    await db.execute({
      sql: `INSERT INTO images (id, original_url, hash, mime_type, size_bytes, is_public) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [imageId, original_url, hash, mime_type || null, size_bytes || null, is_public ? 1 : 0],
    });

    const cdnBaseUrl = process.env.CDN_BASE_URL || "http://localhost:3000";
    const cdn_url = `${cdnBaseUrl}/img/${hash}`;

    return NextResponse.json({ 
      message: "Image registered successfully", 
      id: imageId, 
      hash, 
      cdn_url 
    }, { status: 201 });
  } catch (error) {
    console.error("Image registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
