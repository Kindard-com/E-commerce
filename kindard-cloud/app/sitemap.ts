import { MetadataRoute } from 'next';
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.CDN_BASE_URL || 'https://cdn.kindardcloud.com';

  try {
    // Fetch all public images
    const result = await db.execute(`
      SELECT hash, created_at 
      FROM images 
      WHERE is_public = 1
    `);

    return result.rows.map((row) => ({
      url: `${baseUrl}/asset/${row.hash}`,
      lastModified: new Date(row.created_at as string),
      changeFrequency: 'yearly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return [];
  }
}
