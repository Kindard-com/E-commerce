import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

const neonUrl = process.env.NEON_DATABASE_URL;

const missingNeon = (async () => []) as NeonQueryFunction<false, false>;

// Neon is optional for local development. Pages that query it fall back to empty results.
export const neonDb: NeonQueryFunction<false, false> = neonUrl
  ? neon(neonUrl)
  : (Object.assign(missingNeon, { unsafe: async () => [] }) as NeonQueryFunction<false, false>);

