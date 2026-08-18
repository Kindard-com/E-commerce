"use client";

import { useStore } from '@/storefront/lib/StoreContext';
import { useEffect, useState } from 'react';
import { medusaClient } from '@/storefront/lib/medusa';
import { applyCustomerToken } from '@/storefront/lib/cart';
import { formatMoney } from '@/storefront/lib/money';
import { GlobalAddressAutocomplete, AddressData } from '@/storefront/components/GlobalAddressAutocomplete';
import { Link } from '@/i18n/navigation';

function pickPaymentProvider(providers: any[]): string | null {
  const ids = (providers || []).map((provider) => provider.id || provider.provider_id)
  return (
    ids.find((id: string) => String(id).includes('mollie')) ||
    ids.find((id: string) => String(id).includes('system_default')) ||
    ids[0] ||
    null
  )
}

export default function CheckoutPage() {
  const { cart, medusaCart, medusaCartId, setMedusaCartId, user, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); 
  
  const [syncedCart, setSyncedCart] = useState<any>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [mollieCheckoutUrl, setMollieCheckoutUrl] = useState<string | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const currency = syncedCart?.region?.currency_code || medusaCart?.region?.currency_code || 'EUR'

  useEffect(() => {
    const initCart = async () => {
      setLoading(true);
      setError(null);
      applyCustomerToken()
      try {
        const cartId = medusaCartId || (typeof window !== 'undefined' ? localStorage.getItem('cart_id') : null)
        if (!cartId) {
          setError('Your bag is empty. Add a product from the shop before checking out.')
          return
        }

        const { cart: existingCart } = await medusaClient.store.cart.retrieve(cartId, {
          fields: '*items,*items.variant,*region,*shipping_methods',
        });

        if (!existingCart?.items?.length && cart.length === 0) {
          setError('Your bag is empty. Add a product from the shop before checking out.')
          return
        }

        if (user?.email && existingCart.email !== user.email) {
          const { cart: withEmail } = await medusaClient.store.cart.update(cartId, { email: user.email })
          setSyncedCart(withEmail)
          setMedusaCartId(withEmail.id)
        } else {
          setSyncedCart(existingCart)
          setMedusaCartId(existingCart.id)
        }
      } catch (err: any) {
        console.error("FULL CHECKOUT ERROR:", err);
        setError("Failed to initialize checkout: " + (err.message || err.toString()));
      } finally {
        setLoading(false);
      }
    };

    if (step === 1 && !syncedCart && !loading) {
      initCart();
    }
  }, []);

  const handleAddressSubmit = async (addressData: AddressData) => {
    const cartId = medusaCartId || syncedCart?.id
    if (!cartId) return;
    setLoading(true);
    setError(null);
    try {
      applyCustomerToken()
      const shipping = {
        first_name: addressData.first_name,
        last_name: addressData.last_name,
        company: addressData.company,
        address_1: addressData.address_1,
        address_2: addressData.address_2,
        city: addressData.city,
        province: addressData.province,
        postal_code: addressData.postal_code,
        country_code: addressData.country_code,
        phone: addressData.phone
      }
      const { cart: updatedCart } = await medusaClient.store.cart.update(cartId, {
        email: addressData.email || user?.email,
        shipping_address: shipping,
        billing_address: shipping,
      });
      setSyncedCart(updatedCart);
      
      const { shipping_options } = await medusaClient.store.fulfillment.listCartOptions({ cart_id: cartId });
      setShippingOptions(shipping_options || []);
      if (shipping_options?.length > 0) setSelectedShippingOption(shipping_options[0].id);
      
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = async () => {
    const cartId = medusaCartId || syncedCart?.id
    if (!cartId || !selectedShippingOption) return;
    setLoading(true);
    setError(null);
    try {
      applyCustomerToken()
      await medusaClient.store.cart.addShippingMethod(cartId, { option_id: selectedShippingOption });
      const { cart: cartWithShipping } = await medusaClient.store.cart.retrieve(cartId)
      setSyncedCart(cartWithShipping)

      const { payment_providers } = await medusaClient.store.payment.listPaymentProviders({
        region_id: cartWithShipping?.region_id || cartWithShipping?.region?.id,
      }).catch(() => ({ payment_providers: [] as any[] }))

      const providerId = pickPaymentProvider(payment_providers) || 'pp_system_default'
      setPaymentProvider(providerId)

      const res = await medusaClient.store.payment.initiatePaymentSession(cartWithShipping, { provider_id: providerId }).catch((e) => {
        console.error("Payment init failed:", e);
        return null;
      });

      if (res && res.payment_collection && res.payment_collection.payment_sessions) {
         const session = res.payment_collection.payment_sessions.find((s: any) => s.provider_id === providerId);
         if (session && session.data && session.data.checkout_url) {
            setMollieCheckoutUrl(session.data.checkout_url as string);
         }
      }

      const { cart: updatedCart } = await medusaClient.store.cart.retrieve(cartId)
      setSyncedCart(updatedCart)
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to add shipping method.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    const cartId = medusaCartId || syncedCart?.id
    if (!cartId) return;
    setLoading(true);
    setError(null);
    try {
      applyCustomerToken()
      if (mollieCheckoutUrl) {
         window.location.href = mollieCheckoutUrl;
         return;
      }

      const result = await medusaClient.store.cart.complete(cartId);
      if (result.type === 'order') {
        setOrderId(result.order?.id || result.order?.display_id || null)
        clearCart();
        setStep(4);
      } else {
        setError("Failed to complete order. Cart requires further action.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromo = async () => {
    const cartId = medusaCartId || syncedCart?.id
    if (!cartId || !promoCode) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      await medusaClient.store.cart.addPromotions(cartId, { promo_codes: [promoCode] });
      const { cart: updatedCart } = await medusaClient.store.cart.retrieve(cartId);
      setSyncedCart(updatedCart);
      setPromoCode('');
    } catch (err: any) {
      setPromoError(err.message || 'Invalid or expired promo code.');
    } finally {
      setPromoLoading(false);
    }
  };

  const total = syncedCart ? (syncedCart.total || 0) : cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const displayItems = syncedCart?.items?.length ? syncedCart.items : cart

  if (step === 4) {
    return (
      <div style={{ padding: '100px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', minHeight: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '48px', textTransform: 'uppercase', marginBottom: '16px' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
          Thank you for your purchase. {orderId ? `Order ${orderId} is now in Medusa.` : 'Your order is now in Medusa.'}
          {user ? ' You can view it in the portal.' : ' Create an account with the same email to track it later.'}
        </p>
        <Link href={user ? "/portal/orders" : "/"} className="btn-primary" style={{ padding: '16px 32px' }}>{user ? 'VIEW ORDER' : 'CONTINUE SHOPPING'}</Link>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      
      <div className="checkout-main">
        <div className="checkout-progress">
          <span className={`checkout-step ${step >= 1 ? 'active' : ''}`}>1. Shipping</span>
          <span className="checkout-step-separator">›</span>
          <span className={`checkout-step ${step >= 2 ? 'active' : ''}`}>2. Delivery</span>
          <span className="checkout-step-separator">›</span>
          <span className={`checkout-step ${step >= 3 ? 'active' : ''}`}>3. Payment</span>
        </div>

        {error && (
          <div style={{ background: '#ffebee', color: 'var(--red)', padding: '16px', marginBottom: '24px', border: '1.5px solid var(--red)' }}>
            {error}
          </div>
        )}

        <div className="checkout-accordion-item">
          <div className="checkout-accordion-header" onClick={() => step > 1 && setStep(1)}>
            <h2 className="checkout-accordion-title">
              <span style={{ background: step === 1 ? 'var(--black)' : '#ddd', color: step === 1 ? 'var(--white)' : '#666', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '14px' }}>1</span>
              Shipping Address
            </h2>
            {step > 1 && <span style={{ textDecoration: 'underline', fontSize: '14px', color: 'var(--mid)' }}>Edit</span>}
          </div>
          
          {step === 1 && (
            <div className="checkout-accordion-body">
              <GlobalAddressAutocomplete 
                defaultValues={{ email: user?.email, first_name: user?.first_name, last_name: user?.last_name }}
                onSubmit={() => {}} 
                onChange={(data) => {
                  const btn = document.getElementById('checkout-address-btn');
                  if (btn) btn.onclick = () => handleAddressSubmit(data);
                }}
                submitLabel="CONTINUE TO DELIVERY"
              />
              <button id="checkout-address-btn" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                {loading ? 'Processing...' : 'CONTINUE TO DELIVERY'}
              </button>
            </div>
          )}
          {step > 1 && (
            <div className="checkout-summary-box">
              {syncedCart?.email}<br />
              {syncedCart?.shipping_address?.first_name} {syncedCart?.shipping_address?.last_name}<br />
              {syncedCart?.shipping_address?.address_1}, {syncedCart?.shipping_address?.city}
            </div>
          )}
        </div>

        <div className="checkout-accordion-item" style={{ opacity: step < 2 ? 0.5 : 1, pointerEvents: step < 2 ? 'none' : 'auto' }}>
          <div className="checkout-accordion-header" onClick={() => step > 2 && setStep(2)}>
            <h2 className="checkout-accordion-title">
              <span style={{ background: step === 2 ? 'var(--black)' : '#ddd', color: step === 2 ? 'var(--white)' : '#666', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '14px' }}>2</span>
              Delivery Method
            </h2>
            {step > 2 && <span style={{ textDecoration: 'underline', fontSize: '14px', color: 'var(--mid)' }}>Edit</span>}
          </div>
          
          {step === 2 && (
            <div className="checkout-accordion-body">
              {shippingOptions.length === 0 ? <p>No shipping options available. Seed Kindard shipping in Medusa (`pnpm --prefix backend run seed:demo`).</p> : null}
              {shippingOptions.map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #eee', marginBottom: '12px', cursor: 'pointer', background: selectedShippingOption === opt.id ? '#f9f9f9' : '#fff' }}>
                  <input type="radio" name="shipping" checked={selectedShippingOption === opt.id} onChange={() => setSelectedShippingOption(opt.id)} style={{ width: '18px', height: '18px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{opt.name}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{formatMoney(opt.amount, currency)}</div>
                </label>
              ))}
              <button onClick={handleShippingSubmit} className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading || !selectedShippingOption}>
                {loading ? 'Processing...' : 'CONTINUE TO PAYMENT'}
              </button>
            </div>
          )}
          {step > 2 && syncedCart?.shipping_methods && syncedCart.shipping_methods[0] && (
            <div className="checkout-summary-box">
              {syncedCart.shipping_methods[0].shipping_option?.name || 'Shipping'} — {formatMoney(syncedCart.shipping_methods[0].amount, currency)}
            </div>
          )}
        </div>

        <div className="checkout-accordion-item" style={{ opacity: step < 3 ? 0.5 : 1, pointerEvents: step < 3 ? 'none' : 'auto' }}>
          <div className="checkout-accordion-header">
            <h2 className="checkout-accordion-title">
              <span style={{ background: step === 3 ? 'var(--black)' : '#ddd', color: step === 3 ? 'var(--white)' : '#666', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '14px' }}>3</span>
              Payment
            </h2>
          </div>
          
          {step === 3 && (
            <div className="checkout-accordion-body">
              <div style={{ padding: '16px', border: '1px solid #ddd', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <div>
                  <div style={{ fontWeight: 600 }}>{mollieCheckoutUrl ? 'Mollie hosted checkout' : 'Secure payment'}</div>
                  <div style={{ fontSize: '13px', color: 'var(--mid)' }}>
                    {mollieCheckoutUrl
                      ? 'You will be redirected to Mollie to finish payment.'
                      : paymentProvider
                        ? `Provider: ${paymentProvider}. Orders are created in the Medusa backend.`
                        : 'Add a Mollie API key in backend/.env for live payments, or use the system provider locally.'}
                  </div>
                </div>
              </div>
              
              <button onClick={handlePaymentSubmit} className="btn-primary" style={{ width: '100%', fontSize: '18px', padding: '18px' }} disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                {loading ? 'PROCESSING...' : `PAY ${formatMoney(total, currency)}`}
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="checkout-sidebar">
        
        <button className="order-summary-accordion-btn" onClick={() => setSummaryOpen(!summaryOpen)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {summaryOpen ? 'Hide' : 'Show'} Order Summary
          </span>
          <span>{formatMoney(syncedCart?.total || total, currency)}</span>
        </button>

        <div className={`checkout-sidebar-content ${summaryOpen ? 'open' : ''}`}>
          <div style={{ border: '1.5px solid var(--black)', padding: '24px', position: 'sticky', top: '24px', background: 'var(--white)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>Order Summary</h2>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px', marginBottom: '24px' }}>
              {syncedCart?.items?.map((item: any, i: number) => (
                <div key={item.id || i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ width: '64px', height: '64px', background: '#f5f5f5', border: '1px solid #eee', position: 'relative' }}>
                    {item.thumbnail && <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--mid)', color: 'var(--white)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600 }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.title}</div>
                    <div style={{ color: 'var(--mid)', fontSize: '13px' }}>{item.variant?.title}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{formatMoney(item.total, currency)}</div>
                </div>
              ))}
              {(!syncedCart?.items || syncedCart.items.length === 0) && cart.map((item, i) => (
                 <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ width: '64px', height: '64px', background: '#f5f5f5', border: '1px solid #eee', position: 'relative' }}>
                    {item.product.image && <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--mid)', color: 'var(--white)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600 }}>{item.qty}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.product.name}</div>
                    <div style={{ color: 'var(--mid)', fontSize: '13px' }}>{item.color} / {item.size}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{formatMoney(item.product.price * item.qty, currency)}</div>
                </div>
              ))}
            </div>
            
            {syncedCart && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    value={promoCode} 
                    onChange={e => setPromoCode(e.target.value)} 
                    placeholder="Promo code" 
                    style={{ flex: 1, padding: '12px', border: '1px solid #ddd' }} 
                  />
                  <button 
                    onClick={handleApplyPromo} 
                    disabled={promoLoading || !promoCode} 
                    style={{ padding: '0 24px', background: 'var(--black)', color: 'var(--white)', border: 'none', fontWeight: 600, cursor: promoLoading ? 'not-allowed' : 'pointer' }}
                  >
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {promoError && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '-8px' }}>{promoError}</div>}
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--mid)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatMoney(syncedCart.subtotal, currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--mid)' }}>Shipping</span>
                  <span style={{ fontWeight: 600 }}>{syncedCart.shipping_total != null ? formatMoney(syncedCart.shipping_total, currency) : 'Calculated next step'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--mid)' }}>Estimated Taxes</span>
                  <span style={{ fontWeight: 600 }}>{formatMoney(syncedCart.tax_total || 0, currency)}</span>
                </div>
                
                {syncedCart.discount_total > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--red)', fontWeight: 600 }}>
                    <span>Discount</span>
                    <span>-{formatMoney(syncedCart.discount_total, currency)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '24px', marginTop: '8px', paddingTop: '16px', borderTop: '1.5px solid var(--black)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <span>Total</span>
                  <span>{formatMoney(syncedCart.total || total, currency)}</span>
                </div>
              </div>
            )}

            <div className="checkout-trust-badges">
              <div className="checkout-trust-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Secure 256-bit SSL encryption.
              </div>
              <div className="checkout-trust-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                Easy 30-day return policy.
              </div>
              <div className="checkout-trust-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Need help? <Link href="/help-contact" style={{ textDecoration: 'underline' }}>Contact Support</Link>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
