import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/img/', '/asset/'],
        disallow: ['/api/', '/dl/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/img/', '/asset/'],
      }
    ],
    sitemap: 'https://cdn.kindardcloud.com/sitemap.xml',
  };
}
