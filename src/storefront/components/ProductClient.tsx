"use client";

import { useState, useEffect } from 'react';
import { useStore } from '../lib/StoreContext';
import { useRouter } from 'next/navigation';
import { findVariantId } from '../lib/variants';
import { Product } from '../lib/products';
import { SizeGuideModal } from './SizeGuideModal';

export function ProductClient({ product }: { product: Product }) {
  const { addToCart, user } = useStore();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.avail?.[0] || product.sizes[0] || null);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const router = useRouter();

  const [viewers, setViewers] = useState<number>(0);
  const [sold, setSold] = useState<number>(0);
  const [aiText, setAiText] = useState("");

  useEffect(() => {
    // Fetch "real" real-time stats
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/stats?id=${product.id}`);
        const data = await res.json();
        if (data.viewers) setViewers(Math.max(1, data.viewers)); // guarantee at least 1 (the current user)
        if (data.sold) setSold(data.sold);
      } catch (err) {
        console.error("Stats error", err);
      }
    };
    
    fetchStats();
    // Poll every 10 seconds for live viewers
    const interval = setInterval(fetchStats, 10000);

    const aiSuggestions = [
      `✨ TREND INSIGHT: Unmatched comfort meets undeniable drip. The bold silhouette of the ${product.name} screams main-character energy. Made for the little ones who start trends, this pairs flawlessly with distressed denim and chunky sneakers.`,
      `✨ STYLE CHECK: Premium kidswear re-defined. Elevate the playground aesthetic—the ${product.name} isn't just a layer, it's a statement piece. Throw it on over a ribbed tee and let the playful energy do the talking.`,
      `✨ THE ALGORITHM SAYS: High-demand streetwear staple. The ${product.colors[0] || 'main'} colorway is flying right now. Pair this with oversized cargo pants for a look that sets the standard rather than following it.`
    ];
    setAiText(aiSuggestions[String(product.id).length % aiSuggestions.length]);

    return () => clearInterval(interval);
  }, [product]);

  const handleAdd = () => {
    if (selectedSize && selectedColor) {
      addToCart({
        product,
        qty: 1,
        color: selectedColor,
        size: selectedSize,
        variantId: findVariantId(product, selectedSize, selectedColor) || undefined,
      });
    }
  };

  const handleWishlist = async () => {
    if (!user) { router.push('/login'); return; }
    if (wishLoading || wishlisted) return;
    setWishLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: product.id }),
      });
      if (res.ok) setWishlisted(true);
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <div className="product-client-details">
      <div className="detail-brand">{product.brand}</div>
      <h1 className="detail-name" style={{ fontSize: '42px', marginBottom: '16px' }}>{product.name}</h1>
      <div className="detail-price" style={{ fontSize: '28px', marginBottom: '32px' }}>${product.price}</div>
      
      <div className="detail-section-label"><span>COLOR</span></div>
      <div className="colors-row" style={{ marginBottom: '32px' }}>
        {product.colors.map(c => (
          <div 
            key={c}
            className={`color-swatch ${selectedColor === c ? 'selected' : ''}`}
            style={{ background: c, width: '36px', height: '36px' }}
            onClick={() => setSelectedColor(c)}
          />
        ))}
      </div>

      <div className="detail-section-label">
        <span>SIZE (INTERNATIONAL)</span>
        <span className="size-guide" onClick={() => setSizeGuideOpen(true)} style={{ cursor: 'pointer' }}>SIZE GUIDELINES ↗</span>
      </div>
      <div className="sizes-row" style={{ marginBottom: '32px' }}>
        {product.sizes.map(sz => {
          const isAvail = product.avail.includes(sz);
          return (
            <button 
              key={sz}
              disabled={!isAvail}
              className={`size-btn ${!isAvail ? 'unavail' : ''} ${selectedSize === sz ? 'selected' : ''}`}
              onClick={() => setSelectedSize(sz)}
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              {sz}
            </button>
          )
        })}
      </div>

      <div className="stock-urgency" style={{ marginBottom: '16px' }}>
        <div className="stock-dot"></div>
        HIGH DEMAND — SELLING FAST
      </div>

      <div className="social-proof-banner" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', padding: '16px', background: '#f5f5f5', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', animation: 'pulse 2s infinite' }}></span>
          {viewers} {viewers === 1 ? 'person is' : 'people are'} viewing this right now
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔥</span> {sold} sold in the last 24 hours
        </div>
      </div>

      <button 
        className="add-bag-btn" 
        disabled={!selectedSize}
        onClick={handleAdd}
        style={{ padding: '24px', fontSize: '16px', marginBottom: '16px' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        {selectedSize ? "ADD TO BAG — SECURE CHECKOUT" : "SELECT A SIZE"}
      </button>

      <div className="trust-badges-row" style={{ marginBottom: '24px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 256-BIT ENCRYPTION</span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg> 30-DAY RETURNS</span>
      </div>

      <button
        className="btn-ghost"
        onClick={handleWishlist}
        disabled={wishLoading}
        style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', opacity: wishLoading ? 0.5 : 1 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {wishlisted ? 'SAVED ✓' : wishLoading ? 'SAVING...' : 'SAVE TO WISHLIST'}
      </button>

      <div style={{ marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <div className="detail-section-label"><span>MATERIALS & CARE</span></div>
        <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#444' }}>
          <p style={{ marginBottom: '16px' }}><strong>Composition:</strong> 100% Organic Heavyweight Cotton. Safe for sensitive skin and incredibly durable for playground wear.</p>
          <p><strong>Care Instructions:</strong> Machine wash cold with like colors. Tumble dry low or hang dry to preserve the oversized fit. Do not iron directly on graphics.</p>
        </div>
      </div>

      <div className="ai-style-guide" style={{ marginTop: '32px', padding: '24px', background: 'var(--black)', color: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
        <div className="ai-bg-glow" style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(232,255,0,0.1) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>
        <p style={{ fontSize: '15px', lineHeight: 1.6, position: 'relative', color: '#e0e0e0', fontStyle: 'italic' }}>{aiText}</p>
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
