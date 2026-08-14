import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateUUID } from "@/lib/hash";
import { checkRateLimit } from "@/lib/rate-limit";

export async function serveAsset(
  request: NextRequest,
  hash: string,
  options: { forceDownload?: boolean } = {}
) {
  // 1. Extract Origin or Referer
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  let requestingDomain = "";
  const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "unknown";

  if (!checkRateLimit(ip, 100, 60000)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  try {
    if (origin) {
      requestingDomain = new URL(origin).hostname;
    } else if (referer) {
      requestingDomain = new URL(referer).hostname;
    } else if (process.env.NODE_ENV === "development") {
      requestingDomain = "localhost"; // Bypass for local testing
    } else {
      // Missing headers (e.g. Email clients, direct browser visits). 
      // Treat them as the "public" domain so we can allow specific assets (like logos).
      requestingDomain = "public";
    }
  } catch (err) {
    return logAndReturn(hash, "", ip, 400, "Bad Request: Invalid Origin/Referer");
  }

  try {
    // 2. Fetch metadata and permissions
    // Note: We're still using the 'images' table for all assets
    let imageResult
    try {
      imageResult = await db.execute({
        sql: "SELECT id, original_url, mime_type, is_public FROM images WHERE hash = ?",
        args: [hash],
      });
    } catch {
      imageResult = await db.execute({
        sql: "SELECT id, original_url, mime_type FROM images WHERE hash = ?",
        args: [hash],
      });
    }

    if (imageResult.rows.length === 0) {
      return logAndReturn(hash, requestingDomain, ip, 404, "Asset not found");
    }

    const image = imageResult.rows[0];
    const imageId = image.id as string;
    const originalUrl = image.original_url as string;
    const mimeType = image.mime_type as string | null;
    const isPublic = image.is_public === 1 || image.is_public === true || image.is_public === "1";

    // 3. Verify Domain Permissions (Skip for public assets and local development)
    if (!isPublic && (process.env.NODE_ENV !== "development" || (requestingDomain !== "localhost" && requestingDomain !== ""))) {
      const permissionResult = await db.execute({
        sql: `
          SELECT 1 FROM domain_image_permissions dip
          JOIN domains d ON dip.domain_id = d.id
          WHERE dip.image_id = ? AND d.domain = ?
        `,
        args: [imageId, requestingDomain],
      });

      if (permissionResult.rows.length === 0) {
        return logAndReturn(hash, requestingDomain, ip, 403, `Forbidden: Domain ${requestingDomain} is not allowed to access this asset`);
      }
    }

    // 4. Proxy the asset
    let storageUrl = originalUrl;
    if (process.env.IMAGE_STORAGE_BASE_URL && !originalUrl.startsWith("http")) {
      storageUrl = `${process.env.IMAGE_STORAGE_BASE_URL.replace(/\/$/, "")}/${originalUrl.replace(/^\//, "")}`;
    } else if (!originalUrl.startsWith("http")) {
      // Fallback if IMAGE_STORAGE_BASE_URL is empty (like in local development)
      storageUrl = `${request.nextUrl.origin}/${originalUrl.replace(/^\//, "")}`;
    }

    const imageResponse = await fetch(storageUrl);

    if (!imageResponse.ok) {
      console.error(`Failed to fetch asset from storage: ${storageUrl}. Status: ${imageResponse.status}`);
      return logAndReturn(hash, requestingDomain, ip, 502, "Bad Gateway: Could not fetch asset from origin");
    }

    // Prepare headers
    const headers = new Headers();
    const finalMimeType = mimeType || imageResponse.headers.get("Content-Type") || "application/octet-stream";
    headers.set("Content-Type", finalMimeType);

    // Optimized Caching based on mime type and download intent
    if (options.forceDownload) {
      headers.set("Cache-Control", "public, max-age=86400"); // 1 day
      // Determine a reasonable filename if we don't have one
      const extension = finalMimeType.split("/")[1] || "file";
      headers.set("Content-Disposition", `attachment; filename="download_${hash}.${extension}"`);
      headers.set("X-Robots-Tag", "noindex, nofollow");
    } else {
      // For standard web assets (css, js, images) cache for 1 year immutable
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("X-Robots-Tag", "index, follow");
    }

    // Log the successful access asynchronously
    logAccess(hash, requestingDomain, ip, 200);

    return new NextResponse(imageResponse.body, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error("Asset delivery error:", error);
    return logAndReturn(hash, requestingDomain, ip, 500, "Internal Server Error");
  }
}

async function logAndReturn(hash: string, domain: string, ip: string, statusCode: number, errorMessage: string) {
  logAccess(hash, domain, ip, statusCode, errorMessage);
  return new NextResponse(errorMessage, { status: statusCode });
}

function logAccess(hash: string, domain: string, ip: string, statusCode: number, reason: string = "") {
  db.execute({
    sql: "INSERT INTO access_logs (id, image_hash, requesting_domain, ip_address, status_code) VALUES (?, ?, ?, ?, ?)",
    args: [generateUUID(), hash, domain, ip, statusCode],
  }).catch(err => {
    console.error("Failed to write access log:", err);
  });
}
