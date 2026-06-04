import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { RenderBlocks } from '@/blocks/RenderBlocks';

export function generateStaticParams() {
  return [
    { location: 'ny-soho' },
    { location: 'la-fairfax' },
    { location: 'london-carnaby' },
    { location: 'tokyo-harajuku' },
    { location: 'amsterdam-straatjes' },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const title = location.replace(/-/g, ' ');
  const formattedTitle = title.replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: formattedTitle
  };
}

export default async function StorePage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const title = location.replace(/-/g, ' ');
  
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: `stores/${location}`
      }
    },
    limit: 1,
  });

  const page = docs[0];

  if (page) {
    return (
      <div className="payload-page-wrapper" style={{ padding: '40px 0', minHeight: '50vh' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '48px', textTransform: 'uppercase', marginBottom: '40px', fontFamily: "'Barlow Condensed', sans-serif" }}>
            {page.title}
          </h1>
          {page.layout && <RenderBlocks blocks={page.layout} />}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="info-page" style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '50vh' }}>
      <h1 style={{ fontSize: '48px', textTransform: 'uppercase', marginBottom: '24px', fontFamily: "'Barlow Condensed', sans-serif" }}>
        {title}
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--mid)', lineHeight: 1.6 }}>
        This is the official {title.toLowerCase()} location page for Kindard. The detailed content for this section will be updated shortly.
      </p>
    </div>
  );
}
