import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = [
  "https://kindard.com",
  "https://api.kindard.com",
  "https://ad2.kcms.kopscore.com",
  "https://cdn.kindardcloud.com",
  "http://localhost:3000",
];

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");

  if (isApiRoute) {
    // Handle Preflight OPTIONS requests
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.headers.set("Access-Control-Max-Age", "86400");
      }
      return response;
    }

    // Handle actual requests
    const response = NextResponse.next();
    if (origin) {
      if (allowedOrigins.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
      } else {
        // Reject unauthorized cross-origin API requests
        return new NextResponse(JSON.stringify({ error: "CORS Error: Origin not allowed" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
