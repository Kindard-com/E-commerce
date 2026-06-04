"use client";

import { useStore } from '@/storefront/lib/StoreContext';
import Link from 'next/link';

export default function PortalOverviewPage() {
  const { user } = useStore();

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
          <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '16px' }}>You have no recent orders.</p>
          <Link href="/portal/orders" style={{ textDecoration: 'underline', fontSize: '14px' }}>View all orders</Link>
        </div>

        <div style={{ padding: '24px', border: '1px solid #ddd' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>Default Address</h3>
          <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '16px' }}>No default address set.</p>
          <Link href="/portal/addresses" style={{ textDecoration: 'underline', fontSize: '14px' }}>Manage addresses</Link>
        </div>

        <div style={{ padding: '24px', border: '1px solid #ddd' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>Payment Methods</h3>
          <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '16px' }}>No payment methods saved.</p>
          <Link href="/portal/payment-methods" style={{ textDecoration: 'underline', fontSize: '14px' }}>Manage payments</Link>
        </div>

      </div>
    </div>
  );
}
