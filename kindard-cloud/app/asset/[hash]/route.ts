import { NextRequest } from "next/server";
import { serveAsset } from "@/lib/delivery";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;
  return serveAsset(request, hash);
}
