import Medusa from "@medusajs/js-sdk";

const baseUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_URL ||
  "http://127.0.0.1:9000";

export const medusaServerClient = new Medusa({
  baseUrl,
  apiKey: process.env.MEDUSA_ADMIN_API_KEY || process.env.MEDUSA_SECRET_API_KEY || "",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  maxRetries: 3,
});
