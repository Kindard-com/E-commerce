"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/storefront/lib/StoreContext';
import { medusaClient } from '@/storefront/lib/medusa';
import { mapMedusaProduct } from '@/storefront/lib/medusa-mapper';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistPage() {
  const { user } = useStore();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [productsById, setProductsById] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist', {
          headers: { 'Authorization': `Bearer ${user.id}` }
        });
        const data = await res.json();
        console.log('[Wishlist] API response:', data);
        setWishlist(data.wishlist || []);
        const ids = Array.from(new Set((data.wishlist || []).map((item: any) => String(item.product_id))))
        const entries = await Promise.all(ids.map(async (id) => {
          try {
            const { product } = await medusaClient.store.product.retrieve(String(id))
            return [String(id), mapMedusaProduct(product)] as const
          } catch {
            return [String(id), null] as const
          }
        }))
        setProductsById(Object.fromEntries(entries.filter(([, product]) => product)))
      } catch (err) {
        console.error('[Wishlist] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleRemove = async (id: string) => {
    try {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      setWishlist(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('[Wishlist] Remove error:', err);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', minHeight: '500px' }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', textTransform: 'uppercase', marginBottom: '16px' }}>I Love (Wishlist)</h2>
        <p style={{ color: 'var(--mid)', marginBottom: '24px' }}>Please log in to view and save your favorite items.</p>
        <Link href="/login" className="btn-primary">LOG IN / REGISTER</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px 28px', minHeight: '600px' }}>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '48px', textTransform: 'uppercase', marginBottom: '8px' }}>
        I Love
      </h2>
      <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
        Your personalized wishlist of saved products.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', border: '1px dashed var(--black)' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--mid)', marginBottom: '24px' }}>Start browsing and click the heart icon to save items here.</p>
          <Link href="/new-arrivals" className="btn-primary">Browse New Arrivals</Link>
        </div>
      ) : (
        <div className="product-grid" style={{ borderTop: '1.5px solid var(--black)', borderLeft: '1.5px solid var(--black)' }}>
          {wishlist.map((item) => {
            // Fix: compare as strings since DB returns product_id as string
            const product = productsById[String(item.product_id)];

            return (
              <div key={item.id} className="product-card" style={{ position: 'relative' }}>
                {product ? (
                  <Link href={`/product/${product.medusa_id || product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={`product-img ${product.dark ? 'dark' : ''}`} style={{ position: 'relative' }}>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ fontSize: '48px' }}>{product.emoji}</span>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-brand">{product.brand || 'KINDARD'}</div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-price-row">
                        <div className="product-price">€{Number(product.price).toFixed(2)}</div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  // Fallback: product not in local list (e.g. Medusa product)
                  <div style={{ padding: '20px' }}>
                    <div className="product-brand">KINDARD</div>
                    <div className="product-name">Saved Item</div>
                    <div style={{ fontSize: '12px', color: 'var(--mid)', marginTop: '4px' }}>ID: {item.product_id}</div>
                  </div>
                )}

                <button
                  onClick={(e) => { e.preventDefault(); handleRemove(item.id); }}
                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--white)', border: '1.5px solid var(--black)', padding: '6px', cursor: 'pointer', zIndex: 2 }}
                  aria-label="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#e00' }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
