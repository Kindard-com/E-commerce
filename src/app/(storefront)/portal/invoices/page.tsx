"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/storefront/lib/StoreContext';
import { PUBLISHABLE_KEY } from '@/storefront/lib/medusa';

export default function PortalInvoicesPage() {
  const { user } = useStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const token = localStorage.getItem('medusa_token');
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/portal/invoices`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setInvoices(data.invoices || []);
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
    });
  }, [user]);

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', textTransform: 'uppercase', marginBottom: '8px' }}>
        Invoices
      </h2>
      <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
        View and download your past invoices.
      </p>
      
      {loading ? (
        <div style={{ padding: '48px 24px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: 'var(--mid)', fontSize: '14px' }}>Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div style={{ padding: '48px 24px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: 'var(--mid)', fontSize: '14px' }}>You have no invoices yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {invoices.map(inv => (
            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd', padding: '16px' }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>Invoice #{inv.id}</p>
                <p style={{ fontSize: '12px', color: 'var(--mid)' }}>Order: #{inv.order_id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>${inv.amount}</p>
                <p style={{ fontSize: '12px', color: 'var(--mid)' }}>{new Date(inv.date).toLocaleDateString()} - <span style={{ textTransform: 'uppercase', color: inv.status === 'paid' ? 'var(--black)' : 'var(--red)' }}>{inv.status}</span></p>
              </div>
              <div>
                <button 
                  onClick={() => alert('PDF Download Mockup')}
                  style={{ background: 'var(--black)', color: 'var(--white)', border: 'none', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: '12px', letterSpacing: '1px' }}
                >
                  DOWNLOAD
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
