"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/storefront/lib/StoreContext';
import { PUBLISHABLE_KEY } from '@/storefront/lib/medusa';
import { formatMoney } from '@/storefront/lib/money';

export default function PortalOrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const token = localStorage.getItem('medusa_token');
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/customers/me/orders`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setOrders(data.orders || []);
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
    });
  }, [user]);

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', textTransform: 'uppercase', marginBottom: '8px' }}>
        Orders
      </h2>
      <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
        View and track your recent orders.
      </p>
      
      {loading ? (
        <div style={{ padding: '48px 24px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: 'var(--mid)', fontSize: '14px' }}>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '48px 24px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: 'var(--mid)', fontSize: '14px' }}>You have no orders yet.</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '16px', textDecoration: 'underline' }}>Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ddd', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '4px' }}>ORDER NUMBER</p>
                  <p style={{ fontWeight: 600 }}>#{order.display_id}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '4px' }}>DATE</p>
                  <p>{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '4px' }}>STATUS</p>
                  <p style={{ textTransform: 'capitalize' }}>{order.status}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '4px' }}>TOTAL</p>
                  <p>{formatMoney(order.total, order.currency_code || order.region?.currency_code || 'EUR')}</p>
                </div>
              </div>
              
              <div>
                <p style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '8px', fontWeight: 600 }}>ITEMS</p>
                {order.items?.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600 }}>{item.title}</p>
                      <p style={{ fontSize: '12px', color: 'var(--mid)' }}>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
