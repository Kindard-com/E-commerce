import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

const STATIC_PAGES = [
  { title: 'Privacy Policy', slug: 'privacy-policy' },
  { title: 'Terms of Service', slug: 'terms-of-service' },
  { title: 'Cookie Settings', slug: 'cookie-settings' },
  { title: 'Help & Contact', slug: 'help-contact' },
  { title: 'Shipping Info', slug: 'shipping-info' },
  { title: 'Returns & Exchanges', slug: 'returns-exchanges' },
  { title: 'Size Guide', slug: 'size-guide' },
  { title: 'Track My Order', slug: 'track-order' },
  { title: 'Afterpay / Klarna', slug: 'afterpay-klarna' },
  { title: 'Gift Cards', slug: 'gift-cards' },
  { title: 'About Kindard', slug: 'about' },
  { title: 'Careers', slug: 'careers' },
  { title: 'Press', slug: 'press' },
  { title: 'Sustainability', slug: 'sustainability' },
  { title: 'Collaborations', slug: 'collaborations' },
  { title: 'Affiliate Program', slug: 'affiliate-program' },
  { title: 'New York — SoHo', slug: 'stores/ny-soho' },
  { title: 'Los Angeles — Fairfax', slug: 'stores/la-fairfax' },
  { title: 'London — Carnaby St.', slug: 'stores/london-carnaby' },
  { title: 'Tokyo — Harajuku', slug: 'stores/tokyo-harajuku' },
  { title: 'Amsterdam — 9 Straatjes', slug: 'stores/amsterdam-straatjes' },
  { title: 'Find a Stockist', slug: 'find-stockist' },
];

async function seedPages() {
  console.log('Seeding pages into Payload CMS...');
  try {
    const payload = await getPayload({ config: configPromise });

    for (const page of STATIC_PAGES) {
      // Check if page already exists
      const existing = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: page.slug }
        }
      });

      if (existing.totalDocs > 0) {
        console.log(`Page already exists: ${page.slug}`);
        continue;
      }

      await (payload.create as any)({
        collection: 'pages',
        req: {
          context: {
            disableRevalidate: true,
          }
        } as any,
        data: {
          title: page.title,
          slug: page.slug,
          _status: 'published',
          publishedOn: new Date().toISOString(),
          layout: [
            {
              blockType: 'content',
              columns: [
                {
                  size: 'full',
                  richText: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          version: 1,
                          children: [
                            {
                              type: 'text',
                              version: 1,
                              text: `This is the official ${page.title.toLowerCase()} page for Kindard. The detailed content for this section will be updated shortly.`,
                            }
                          ]
                        }
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1
                    }
                  }
                }
              ]
            }
          ]
        }
      });
      console.log(`Created page: ${page.slug}`);
    }
    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding pages:', err);
    process.exit(1);
  }
}

seedPages();
