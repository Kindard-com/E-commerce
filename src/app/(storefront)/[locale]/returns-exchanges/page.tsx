"use client";

import { useState, FormEvent } from 'react';
import { Link } from '@/i18n/navigation';

export default function ReturnsExchangesPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleLookupSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  return (
    <div className="returns-page" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '48px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: "'Barlow Condensed', sans-serif", textAlign: 'center' }}>
        Returns & Exchanges
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--mid)', lineHeight: 1.6, textAlign: 'center', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px auto' }}>
        Not quite right? No problem. Enter your order details below to start a return or exchange within 30 days of delivery.
      </p>

      {step === 1 ? (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form onSubmit={handleLookupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>ORDER NUMBER</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. KIN-100293"
                value={orderNumber} 
                onChange={e => setOrderNumber(e.target.value)} 
                style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '0', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>EMAIL ADDRESS OR ZIP CODE</label>
              <input 
                type="text" 
                required 
                placeholder="Email used for the order"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '0', fontSize: '16px' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: 'var(--black)', 
                color: 'var(--white)', 
                border: 'none', 
                fontWeight: 700, 
                letterSpacing: '1px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                textTransform: 'uppercase',
                transition: 'opacity 0.2s ease'
              }}
            >
              {loading ? 'Finding Order...' : 'Start Return'}
            </button>
          </form>

          <div style={{ marginTop: '48px', borderTop: '1px solid #eee', paddingTop: '32px' }}>
            <h3 style={{ fontSize: '18px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', marginBottom: '16px' }}>Return Policy Highlights</h3>
            <ul style={{ paddingLeft: '20px', color: 'var(--mid)', fontSize: '14px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Items must be returned within 30 days of delivery.</li>
              <li>Items must be unworn, unwashed, and have original tags attached.</li>
              <li>Refunds will be issued to the original payment method.</li>
              <li>Exchanges are free. Returns for a refund incur a $5.00 restocking fee.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div style={{ border: '1px solid #ddd', padding: '32px', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '24px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', marginBottom: '4px' }}>Order #{orderNumber || 'KIN-100293'}</h2>
              <p style={{ fontSize: '14px', color: 'var(--mid)', margin: 0 }}>Placed on June 10, 2026</p>
            </div>
            <button 
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px', color: 'var(--mid)' }}
            >
              Change Order
            </button>
          </div>
          
          <h3 style={{ fontSize: '18px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', marginBottom: '16px' }}>Select items to return</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {/* Mock Item 1 */}
            <div style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid #eee', background: '#fff', alignItems: 'center' }}>
              <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <div style={{ width: '80px', height: '80px', background: '#eee', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>Mini Explorer Hoodie</h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--mid)' }}>Color: Sand | Size: 4T</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>$45.00</p>
              </div>
            </div>

            {/* Mock Item 2 */}
            <div style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid #eee', background: '#fff', alignItems: 'center' }}>
              <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <div style={{ width: '80px', height: '80px', background: '#eee', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>Classic Denim Overalls</h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--mid)' }}>Color: Blue | Size: 4T</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>$55.00</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
             <button 
              style={{ 
                padding: '16px 32px', 
                background: 'var(--black)', 
                color: 'var(--white)', 
                border: 'none', 
                fontWeight: 700, 
                letterSpacing: '1px', 
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
              onClick={() => alert('This would proceed to the reason for return step.')}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '48px', fontSize: '14px' }}>
        <p style={{ color: 'var(--mid)', marginBottom: '8px' }}>Need help with your return?</p>
        <Link href="/help-contact" style={{ color: 'var(--black)', fontWeight: 700, textDecoration: 'underline' }}>CONTACT SUPPORT</Link>
      </div>
    </div>
  );
}
