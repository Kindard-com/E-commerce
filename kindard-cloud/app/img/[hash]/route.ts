import { NextRequest } from "next/server";
import { serveAsset } from "@/lib/delivery";

// In Next.js 15, route segment params are promises.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;
  return serveAsset(request, hash);
}
