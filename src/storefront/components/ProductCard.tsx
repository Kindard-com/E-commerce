"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../lib/products';
import { useStore } from '../lib/StoreContext';

export function ProductCard({ product }: { product: Product }) {
  const { setSelectedProduct, setDetailOpen, user } = useStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const handleOpenDetail = () => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (wishLoading) return;
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
    <div className="product-card" onClick={handleOpenDetail}>
      <div className={`product-img ${product.dark ? 'dark' : ''}`}>
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: 'cover' }} 
          />
        ) : (
          product.emoji
        )}
        {product.discount && (
          <div className="deal-badge">Deal</div>
        )}
        {product.sold && (
          <div className="sold-badge">Sold Out</div>
        )}
        {product.isNew && !product.sold && !product.discount && (
          <div className="new-badge">New In</div>
        )}
        <button
          className="wish-btn"
          aria-label="Save to wishlist"
          onClick={handleWishlist}
          style={{ opacity: wishLoading ? 0.5 : 1 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price-row">
          <div className="product-price">${product.price}</div>
          {product.orig && (
            <div className="product-price-original">${product.orig}</div>
          )}
          {product.discount && (
            <div className="discount-tag">-{product.discount}%</div>
          )}
        </div>
        <div className="product-sizes">
          {product.sizes.map((sz) => (
            <span key={sz} className={`size-dot ${product.avail.includes(sz) ? 'avail' : ''}`}>
              {sz}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
