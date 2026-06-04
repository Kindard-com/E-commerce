import Medusa from "@medusajs/js-sdk";

export const medusaServerClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000",
  apiKey: "sk_1c9eccccec38de3046749b29f09292146f1587ded88e1b8a359782f0f58398b2",
  maxRetries: 3,
});
