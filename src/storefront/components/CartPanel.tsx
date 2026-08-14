"use client";

import Image from 'next/image';
import { useStore } from '../lib/StoreContext';
import { formatMoney, cartCurrency } from '../lib/money';
import Link from 'next/link';
export function CartPanel() {
  const { cart, medusaCart, isCartOpen, setCartOpen, removeFromCart, updateQty, cartLoading, cartError } = useStore();

  const currency = cartCurrency(medusaCart)
  const subtotal = medusaCart?.subtotal ?? cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const discount = medusaCart?.discount_total || 0
  const total = medusaCart?.total ?? subtotal - discount;

  return (
    <>
      <div className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">Shop Bag {cartLoading && <span style={{ fontSize: '10px', color: 'var(--mid)', marginLeft: '8px' }}>Updating...</span>}</span>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        
        <div className="cart-items" style={{ opacity: cartLoading ? 0.5 : 1, pointerEvents: cartLoading ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          {cartError && (
            <div style={{ padding: '12px 24px', color: 'var(--red)', fontSize: '13px' }}>{cartError}</div>
          )}
          {cart.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif" }}>
              Your bag is empty.
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={item.lineItemId || i} className="cart-item">
                <div className="cart-item-img" style={{ position: 'relative' }}>
                  {item.product.image ? (
                    <Image 
                      src={item.product.image} 
                      alt={item.product.name} 
                      fill 
                      sizes="90px"
                      style={{ objectFit: 'cover' }} 
                    />
                  ) : item.product.emoji}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-brand">{item.product.brand}</div>
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-meta">
                    {item.color} / {item.size}
                  </div>
                  <div className="cart-item-bottom">
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateQty(i, item.qty - 1)}>-</button>
                      <div className="qty-num">{item.qty}</div>
                      <button className="qty-btn" onClick={() => updateQty(i, item.qty + 1)}>+</button>
                    </div>
                    <div className="cart-item-price">{formatMoney(item.product.price, currency)}</div>
                    <button className="remove-btn" onClick={() => removeFromCart(i)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-totals">
            <div className="cart-row"><span>Subtotal</span><span>{formatMoney(subtotal, currency)}</span></div>
            <div className="cart-row"><span>Discount</span><span style={{ color: 'var(--red)' }}>-{formatMoney(discount, currency)}</span></div>
            <div className="cart-row"><span>Shipping</span><span>{medusaCart?.shipping_total ? formatMoney(medusaCart.shipping_total, currency) : 'Calculated at checkout'}</span></div>
            <div className="cart-row total"><span>Total</span><span>{formatMoney(total, currency)}</span></div>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '11px', color: 'var(--mid)', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> SECURE 256-BIT ENCRYPTED CHECKOUT
          </div>

          <Link href="/checkout" className="checkout-btn" style={{ pointerEvents: cart.length === 0 ? 'none' : 'auto', opacity: cart.length === 0 ? 0.5 : 1, textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }} onClick={() => setCartOpen(false)}>
            <span>SECURE CHECKOUT</span>
            <span>{formatMoney(total, currency)}</span>
          </Link>
          
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            <div className="pay-chip"><span>VISA</span></div>
            <div className="pay-chip"><span>MC</span></div>
            <div className="pay-chip"><span>AMEX</span></div>
            <div className="pay-chip"><span>PAYPAL</span></div>
            <div className="pay-chip"><span>KLARNA</span></div>
            <div className="pay-chip"><span>APPLE PAY</span></div>
            <div className="pay-chip"><span>G PAY</span></div>
          </div>
        </div>
      </div>
      <div 
        className={`backdrop ${isCartOpen ? 'show' : ''}`} 
        onClick={() => setCartOpen(false)}
      />
    </>
  );
}
