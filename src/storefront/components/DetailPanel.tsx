"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useStore } from '../lib/StoreContext';
import { useRouter } from 'next/navigation';
import { SizeGuideModal } from './SizeGuideModal';
import { findVariantId } from '../lib/variants';

export function DetailPanel() {
  const { isDetailOpen, setDetailOpen, selectedProduct, addToCart, user } = useStore();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const router = useRouter();

  if (!selectedProduct) return null;

  // Initialize selected color/size when opened
  if (selectedColor === null && selectedProduct.colors.length > 0) {
    setSelectedColor(selectedProduct.colors[0]);
  }

  const handleAdd = () => {
    if (selectedSize && selectedColor) {
      addToCart({
        product: selectedProduct,
        qty: 1,
        color: selectedColor,
        size: selectedSize,
        variantId: findVariantId(selectedProduct, selectedSize, selectedColor) || undefined,
      });
      setDetailOpen(false);
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
        body: JSON.stringify({ product_id: selectedProduct.id }),
      });
      if (res.ok) setWishlisted(true);
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <div className={`detail-panel ${isDetailOpen ? 'open' : ''}`}>
      <div className="detail-header">
        <span className="detail-header-title">Product Detail</span>
        <button className="close-btn" onClick={() => setDetailOpen(false)}>✕</button>
      </div>
      <div className={`detail-img ${selectedProduct.dark ? 'dark' : ''}`} style={{ background: selectedProduct.dark ? '#1a1a1a' : '#e8e5e0', padding: selectedProduct.image ? 0 : undefined, position: 'relative' }}>
        {selectedProduct.image ? (
          <Image 
            src={selectedProduct.image} 
            alt={selectedProduct.name} 
            fill 
            sizes="(max-width: 768px) 100vw, 480px"
            style={{ objectFit: 'cover' }} 
          />
        ) : (
          selectedProduct.emoji
        )}
      </div>
      <div className="detail-body">
        <div className="detail-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedProduct.brand}
          <a href={`/product/${selectedProduct.medusa_id || selectedProduct.id}`} onClick={() => setDetailOpen(false)} style={{ fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}>VIEW FULL DETAILS ↗</a>
        </div>
        <div className="detail-name">{selectedProduct.name}</div>
        <div className="detail-price">${selectedProduct.price}</div>
        
        <div className="detail-section-label"><span>COLOR</span></div>
        <div className="colors-row">
          {selectedProduct.colors.map(c => (
            <div 
              key={c}
              className={`color-swatch ${selectedColor === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setSelectedColor(c)}
            />
          ))}
        </div>

        <div className="detail-section-label">
          <span>SIZE (INTERNATIONAL)</span>
          <span className="size-guide" onClick={() => setSizeGuideOpen(true)} style={{ cursor: 'pointer' }}>SIZE GUIDELINES ↗</span>
        </div>
        <div className="sizes-row">
          {selectedProduct.sizes.map(sz => {
            const isAvail = selectedProduct.avail.includes(sz);
            return (
              <button 
                key={sz}
                disabled={!isAvail}
                className={`size-btn ${!isAvail ? 'unavail' : ''} ${selectedSize === sz ? 'selected' : ''}`}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </button>
            )
          })}
        </div>

        <div className="stock-urgency">
          <div className="stock-dot"></div>
          HIGH DEMAND — SELLING FAST
        </div>

        <button 
          className="add-bag-btn" 
          disabled={!selectedSize}
          onClick={handleAdd}
          style={{ padding: '20px', fontSize: '15px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {selectedSize ? "ADD TO BAG — SECURE CHECKOUT" : "SELECT A SIZE"}
        </button>

        <div className="trust-badges-row">
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

        <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <div className="detail-section-label"><span>MATERIALS & CARE</span></div>
          <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#444' }}>
            <p style={{ marginBottom: '12px' }}><strong>Composition:</strong> 100% Organic Heavyweight Cotton. Safe for sensitive skin and incredibly durable for playground wear.</p>
            <p><strong>Care Instructions:</strong> Machine wash cold with like colors. Tumble dry low or hang dry to preserve the oversized fit. Do not iron directly on graphics.</p>
          </div>
        </div>
      </div>
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
