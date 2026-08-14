import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

const neonUrl = process.env.NEON_DATABASE_URL;
const missingNeon = (async () => []) as NeonQueryFunction<false, false>;

export const neonDb: NeonQueryFunction<false, false> = neonUrl
  ? neon(neonUrl)
  : (Object.assign(missingNeon, { unsafe: async () => [] }) as NeonQueryFunction<false, false>);
