"use client";

import { useState, FormEvent } from 'react';

export default function ShippingInfoPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrackSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsTracking(true);
    }, 1000);
  };

  return (
    <div className="info-page" style={{ padding: '80px 20px', maxWidth: '600px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '48px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: "'Barlow Condensed', sans-serif", textAlign: 'center' }}>
        Track Package
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--mid)', lineHeight: 1.6, textAlign: 'center', marginBottom: '32px' }}>
        Enter your order number and email address to follow your package's journey.
      </p>

      {!isTracking ? (
        <form onSubmit={handleTrackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>ORDER NUMBER</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. KIN-100293"
              value={orderNumber} 
              onChange={e => setOrderNumber(e.target.value)} 
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              required 
              placeholder="Your email address"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '0' }}
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
              marginTop: '8px'
            }}
          >
            {loading ? 'LOCATING PACKAGE...' : 'TRACK PACKAGE'}
          </button>
        </form>
      ) : (
        <div style={{ marginTop: '24px', border: '1px solid #ddd', padding: '24px' }}>
          <h2 style={{ fontSize: '24px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', marginBottom: '8px' }}>Order #{orderNumber || 'KIN-100293'}</h2>
          <p style={{ fontSize: '14px', color: 'var(--mid)', marginBottom: '24px' }}>Expected Delivery: <strong>Tomorrow by 8:00 PM</strong></p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', background: 'var(--black)' }}></div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--black)', border: '4px solid var(--white)', flexShrink: 0 }}></div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>Out for Delivery</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--mid)' }}>Today, 9:15 AM - Local Hub</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--mid)', border: '4px solid var(--white)', flexShrink: 0 }}></div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--mid)' }}>Arrived at Sort Facility</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--mid)' }}>Yesterday, 11:30 PM - Regional Center</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--mid)', border: '4px solid var(--white)', flexShrink: 0 }}></div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--mid)' }}>Shipped</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--mid)' }}>2 days ago, 4:00 PM - Kindard Warehouse</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--mid)', border: '4px solid var(--white)', flexShrink: 0 }}></div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--mid)' }}>Order Placed</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--mid)' }}>3 days ago</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsTracking(false)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'transparent', 
              color: 'var(--black)', 
              border: '1px solid var(--black)', 
              fontWeight: 700, 
              letterSpacing: '1px', 
              cursor: 'pointer',
              marginTop: '32px'
            }}
          >
            TRACK ANOTHER PACKAGE
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '48px', fontSize: '14px' }}>
        <p style={{ color: 'var(--mid)', marginBottom: '8px' }}>Having trouble finding your order?</p>
        <a href="/help-contact" style={{ color: 'var(--black)', fontWeight: 700, textDecoration: 'underline' }}>CONTACT SUPPORT</a>
      </div>
    </div>
  );
}
