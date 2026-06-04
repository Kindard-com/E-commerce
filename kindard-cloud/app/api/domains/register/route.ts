import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/lib/auth";
import { RegisterDomainSchema } from "@/lib/validation";
import { generateUUID } from "@/lib/hash";
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
    const parsed = RegisterDomainSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.issues }, { status: 400 });
    }

    const { domain } = parsed.data;
    const id = generateUUID();

    try {
      await db.execute({
        sql: "INSERT INTO domains (id, domain) VALUES (?, ?)",
        args: [id, domain],
      });
    } catch (dbErr: any) {
      // Handle unique constraint failure
      if (dbErr.message?.includes("UNIQUE constraint failed") || dbErr.message?.includes("SQLITE_CONSTRAINT")) {
        return NextResponse.json({ error: "Domain already exists" }, { status: 409 });
      }
      throw dbErr;
    }

    return NextResponse.json({ message: "Domain registered successfully", id, domain }, { status: 201 });
  } catch (error) {
    console.error("Domain registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
