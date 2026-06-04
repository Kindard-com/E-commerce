import { neon } from "@neondatabase/serverless";

// Neon database for all data (Products, Users, Admin, etc.)
export const neonDb = neon(process.env.NEON_DATABASE_URL || "postgresql://neondb_owner:npg_0YmB1whTfKVS@ep-square-smoke-ab2qlk9c-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

