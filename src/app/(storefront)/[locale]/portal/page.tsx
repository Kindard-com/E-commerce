"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/storefront/lib/StoreContext';
import { Link } from '@/i18n/navigation';
import { PUBLISHABLE_KEY } from '@/storefront/lib/medusa';
import { formatMoney } from '@/storefront/lib/money';

export default function PortalOverviewPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [address, setAddress] = useState<any | null>(null)

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('medusa_token')
    const headers = {
      'x-publishable-api-key': PUBLISHABLE_KEY,
      'Authorization': `Bearer ${token}`
    }
    const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000'
    fetch(`${base}/store/customers/me/orders`, { headers })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
    fetch(`${base}/store/customers/me`, { headers })
      .then((res) => res.json())
      .then((data) => setAddress(data.customer?.addresses?.[0] || null))
      .catch(() => setAddress(null))
  }, [user])

  const latest = orders[0]

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', textTransform: 'uppercase', marginBottom: '8px' }}>
        Overview
      </h2>
      <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
        Welcome back, {user?.first_name || user?.email || 'Pal'}.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        
        <div style={{ padding: '24px', border: '1px solid #ddd' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>Recent Orders</h3>
          {latest ? (
            <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '16px' }}>
              #{latest.display_id} — {formatMoney(latest.total, latest.currency_code || 'EUR')}
            </p>
          ) : (
            <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '16px' }}>You have no recent orders.</p>
          )}
          <Link href="/portal/orders" style={{ textDecoration: 'underline', fontSize: '14px' }}>View all orders</Link>
        </div>

        <div style={{ padding: '24px', border: '1px solid #ddd' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>Default Address</h3>
          <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '16px' }}>
            {address ? `${address.address_1}, ${address.city}` : 'No default address set.'}
          </p>
          <Link href="/portal/addresses" style={{ textDecoration: 'underline', fontSize: '14px' }}>Manage addresses</Link>
        </div>

        <div style={{ padding: '24px', border: '1px solid #ddd' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>Payment Methods</h3>
          <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '16px' }}>Cards are stored by your payment provider (Mollie) when enabled.</p>
          <Link href="/portal/payment-methods" style={{ textDecoration: 'underline', fontSize: '14px' }}>Manage payments</Link>
        </div>

      </div>
    </div>
  );
}
