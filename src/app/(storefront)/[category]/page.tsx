import { neonDb } from '@/storefront/lib/db';
import { fallbackProducts, Product } from '@/storefront/lib/products';
import { Sidebar } from '@/storefront/components/Sidebar';
import { ProductGrid } from '@/storefront/components/ProductGrid';
import { FilterBar } from '@/storefront/components/FilterBar';
import { medusaServerClient } from '@/storefront/lib/medusa-server';
import { mapMedusaProduct } from '@/storefront/lib/medusa-mapper';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { RenderBlocks } from '@/blocks/RenderBlocks';

const SHOP_CATEGORIES = [
  'new-arrivals',
  'tees',
  'hoodies',
  'shorts',
  'knits',
  'jackets',
  'accessories',
  'sale',
];

const STATIC_PAGES = [
  'privacy-policy',
  'terms-of-service',
  'cookie-settings',
  'help-contact',
  'shipping-info',
  'returns-exchanges',
  'size-guide',
  'track-order',
  'afterpay-klarna',
  'gift-cards',
  'about',
  'careers',
  'press',
  'sustainability',
  'collaborations',
  'affiliate-program',
  'stores/ny-soho',
  'stores/la-fairfax',
  'stores/london-carnaby',
  'stores/tokyo-harajuku',
  'stores/amsterdam-straatjes',
  'find-stockist',
];

export function generateStaticParams() {
  const shopParams = SHOP_CATEGORIES.map((c) => ({ category: c }));
  const staticParams = STATIC_PAGES.filter(p => !p.includes('/')).map((p) => ({ category: p }));
  return [...shopParams, ...staticParams];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = category.replace(/-/g, ' ');
  const formattedTitle = title.replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: formattedTitle
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  
  const isShopCategory = SHOP_CATEGORIES.includes(category);

  if (!isShopCategory) {
    const payload = await getPayload({ config: configPromise });
    
    // Query payload for the page by slug
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: category
        }
      },
      limit: 1,
    });
    
    const page = docs[0];
    
    if (page) {
      const isHelpContact = page.slug === 'help-contact';
      
      if (isHelpContact) {
        return (
          <div className="payload-page-wrapper w-full">
            {page.layout && <RenderBlocks blocks={page.layout} />}
          </div>
        );
      }

      return (
        <div className="payload-page-wrapper" style={{ padding: '40px 0', minHeight: '50vh' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            {/* If there's a hero we can render it here, or just the title */}
            <h1 style={{ fontSize: '48px', textTransform: 'uppercase', marginBottom: '40px', fontFamily: "'Barlow Condensed', sans-serif" }}>
              {page.title}
            </h1>
            
            {/* Render the Blocks from Payload */}
            {page.layout && <RenderBlocks blocks={page.layout} />}
          </div>
        </div>
      );
    }

    // Fallback if not found in Payload, query original DB temporarily
    const pageType = category.replace(/-/g, '_');
    const res = await neonDb`
      SELECT title, content FROM legal_pages WHERE page_type = ${pageType} AND status = 'published'
    `;
    
    let pageTitle = category.replace(/-/g, ' ');
    let pageContent = `This is the official ${pageTitle.toLowerCase()} page for Kindard. The detailed content for this section will be updated shortly.`;
    
    if (res.length > 0) {
      pageTitle = String(res[0].title);
      pageContent = String(res[0].content);
    }

    return (
      <div className="info-page" style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '50vh' }}>
        <h1 style={{ fontSize: '48px', textTransform: 'uppercase', marginBottom: '24px', fontFamily: "'Barlow Condensed', sans-serif" }}>
          {pageTitle}
        </h1>
        <div style={{ fontSize: '16px', color: 'var(--mid)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {pageContent}
        </div>
      </div>
    );
  }

  // Render Shop Layout
  let allProducts: Product[] = [];
  try {
    const { products: storeProducts } = await medusaServerClient.admin.product.list({ limit: 100 });
    allProducts = storeProducts.map(mapMedusaProduct);
    if (allProducts.length === 0) allProducts = fallbackProducts;
  } catch (err) {
    allProducts = fallbackProducts;
  }

  let filteredProducts = allProducts;
  
  if (category !== 'new-arrivals' && category !== 'sale') {
    filteredProducts = allProducts.filter(p => p.category === category);
  } else if (category === 'new-arrivals') {
    filteredProducts = allProducts.filter(p => p.isNew);
  } else if (category === 'sale') {
    filteredProducts = allProducts.filter(p => p.discount);
  }

  return (
    <>
      <div style={{
        padding: '40px 28px',
        borderBottom: '1.5px solid var(--black)'
      }}>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '48px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '.02em'
        }}>
          {category.replace('-', ' ')}
        </h1>
      </div>
      
      {/* ════════════════════════════════════
           FILTER BAR
           ════════════════════════════════════ */}
      <FilterBar resultCount={filteredProducts.length} />

      {/* ════════════════════════════════════
           SHOP LAYOUT — Sidebar + Grid
           ════════════════════════════════════ */}
      <div className="shop-layout">
        <Sidebar />
        <ProductGrid products={filteredProducts} />
      </div>
    </>
  );
}
