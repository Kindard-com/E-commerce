import { z } from "zod";

export const RegisterImageSchema = z.object({
  original_url: z.string().url().max(1000),
  mime_type: z.string().max(100).optional(),
  size_bytes: z.number().int().positive().max(1000000000).optional(),
  is_public: z.boolean().optional().default(true),
});

export const RegisterDomainSchema = z.object({
  domain: z.string().min(3).max(253),
});

export const ImagePermissionsSchema = z.object({
  image_hash: z.string().length(32),
  domains: z.array(z.string().min(3).max(253)).max(100),
});
