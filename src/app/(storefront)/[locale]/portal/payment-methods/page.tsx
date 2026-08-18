"use client";

import { useState } from 'react';

export default function PortalPaymentMethodsPage() {
  const [payments] = useState<any[]>([]);

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', textTransform: 'uppercase', marginBottom: '8px' }}>
        Payment Methods
      </h2>
      <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
        Manage your saved payment methods for faster checkout.
      </p>

      {payments.length === 0 ? (
        <div style={{ padding: '48px 24px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '16px' }}>You have no saved payment methods.</p>
          <p style={{ color: 'var(--mid)', fontSize: '12px' }}>To save a payment method, select "Save for next time" during your next checkout.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {payments.map(payment => (
            <div key={payment.id} style={{ border: '1px solid #ddd', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontWeight: 600 }}>{payment.brand.toUpperCase()}</p>
                {payment.is_default && <span style={{ fontSize: '10px', background: '#eee', padding: '2px 6px', fontWeight: 600 }}>DEFAULT</span>}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--mid)' }}>**** **** **** {payment.last4}</p>
              <p style={{ fontSize: '12px', color: 'var(--mid)' }}>Expires {payment.exp_month}/{payment.exp_year}</p>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--red)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>REMOVE</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
