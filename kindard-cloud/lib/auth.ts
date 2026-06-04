import { NextRequest } from "next/server";

export function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  
  const token = authHeader.split(" ")[1];
  return token === process.env.CDN_ADMIN_API_KEY;
}
