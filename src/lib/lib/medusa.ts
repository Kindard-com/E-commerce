import Medusa from "@medusajs/js-sdk";

export const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || (typeof window !== 'undefined' ? `${window.location.origin}/medusa` : 'http://127.0.0.1:9000'),
  publishableKey: PUBLISHABLE_KEY || undefined,
  maxRetries: 3,
});

export const SALES_CHANNEL_ID = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID || "";
