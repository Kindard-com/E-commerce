import { loadMedusaProductById, loadMedusaProducts } from '@/storefront/lib/load-products';
import { Product } from '@/storefront/lib/products';
import { ProductClient } from '@/storefront/components/ProductClient';
import { ProductGrid } from '@/storefront/components/ProductGrid';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.id);
  if (!product) return { title: 'Not Found' };
  return {
    title: `${product.name} | Kindard Kids`,
    description: `Buy ${product.name} at Kindard Kids.`,
  };
}

async function getProduct(rawId: string): Promise<Product | null> {
  return loadMedusaProductById(rawId);
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  const allProducts: Product[] = (await loadMedusaProducts(50)).filter(
    (p) =>
      String(p.id) !== String(product.id) &&
      String(p.medusa_id) !== String(product.id) &&
      String(p.medusa_id) !== String(product.medusa_id),
  );

  const tops = ['tees', 't-shirts', 'shirts', 'hoodies', 'jackets', 'sweaters', 'knits', 'tops'];
  const bottoms = ['shorts', 'pants', 'jeans', 'trousers', 'bottoms'];
  const accessories = ['accessories', 'socks', 'shoes', 'hats', 'beanies', 'caps', 'footwear'];

  const category = (product.category || '').toLowerCase();
  
  let targetCategories: string[] = [];

  if (tops.includes(category) || tops.some(t => category.includes(t))) {
    targetCategories = [...bottoms, ...accessories];
  } else if (bottoms.includes(category) || bottoms.some(b => category.includes(b))) {
    targetCategories = [...tops, ...accessories];
  } else {
    // If accessory or unknown, just suggest tops and bottoms
    targetCategories = [...tops, ...bottoms];
  }

  let related = allProducts.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    return targetCategories.some(t => pCat.includes(t) || t.includes(pCat));
  });

  // Sort them to get a mix
  related = related.sort(() => 0.5 - Math.random());

  // If we don't have enough related products, backfill with random other products
  if (related.length < 4) {
    const others = allProducts.filter(p => !related.find(r => r.id === p.id)).sort(() => 0.5 - Math.random());
    related = [...related, ...others];
  }

  return related.slice(0, 4);
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <div className="product-page-wrapper">
      <div className="product-page-layout">
        <div className={`product-page-image ${product.dark ? 'dark' : ''}`}>
          {product.image ? (
             <Image 
               src={product.image} 
               alt={product.name} 
               fill 
               priority
               style={{ objectFit: 'cover' }} 
               sizes="(max-width: 768px) 100vw, 50vw"
             />
          ) : (
            <div className="emoji-placeholder">{product.emoji}</div>
          )}
        </div>
        <div className="product-page-details">
          <ProductClient product={product} />
        </div>
      </div>

      <section className="cro-section" style={{ marginTop: '80px', paddingTop: '80px', borderTop: '2px solid var(--black)' }}>
        <div className="cro-header">
          <h2 className="cro-title">Complete The Look</h2>
          <p className="cro-subtitle">Trending styles to match your {product.name}</p>
        </div>
        <ProductGrid products={relatedProducts} />
      </section>
    </div>
  );
}
