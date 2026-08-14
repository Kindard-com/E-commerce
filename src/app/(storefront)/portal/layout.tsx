"use client";

import { useStore } from '@/storefront/lib/StoreContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, authLoading, isAdmin, logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !user && !isAdmin) {
      router.push('/login');
    }
  }, [user, isAdmin, authLoading, router]);

  if (authLoading || (!user && !isAdmin)) {
    return (
      <div style={{ padding: '120px 20px', minHeight: '60vh', textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px' }}>
        LOADING...
      </div>
    );
  }

  const isActive = (path: string) => pathname === path ? 'active' : '';

  return (
    <div style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', display: 'flex', gap: '48px', flexDirection: 'row', flexWrap: 'wrap' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', textTransform: 'uppercase', marginBottom: '16px' }}>
          My Account
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {user && (
            <>
              <Link href="/portal" style={{ fontWeight: isActive('/portal') ? 700 : 400, textDecoration: 'none', color: 'var(--black)' }}>Overview</Link>
              <Link href="/portal/orders" style={{ fontWeight: isActive('/portal/orders') ? 700 : 400, textDecoration: 'none', color: 'var(--black)' }}>Orders</Link>
              <Link href="/portal/invoices" style={{ fontWeight: isActive('/portal/invoices') ? 700 : 400, textDecoration: 'none', color: 'var(--black)' }}>Invoices</Link>
              <Link href="/portal/payment-methods" style={{ fontWeight: isActive('/portal/payment-methods') ? 700 : 400, textDecoration: 'none', color: 'var(--black)' }}>Payment Methods</Link>
              <Link href="/portal/addresses" style={{ fontWeight: isActive('/portal/addresses') ? 700 : 400, textDecoration: 'none', color: 'var(--black)' }}>Addresses</Link>
              <Link href="/portal/settings" style={{ fontWeight: isActive('/portal/settings') ? 700 : 400, textDecoration: 'none', color: 'var(--black)' }}>Account Settings</Link>
            </>
          )}

          {isAdmin && (
            <>
              {user && <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--light)' }} />}
              <strong style={{ color: 'var(--red)', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Admin Backoffice</strong>
              <Link href="/portal/admin-settings" style={{ fontWeight: isActive('/portal/admin-settings') ? 700 : 400, textDecoration: 'none', color: 'var(--red)' }}>Site Settings</Link>
              <Link href="/portal/admin-legal" style={{ fontWeight: isActive('/portal/admin-legal') ? 700 : 400, textDecoration: 'none', color: 'var(--red)' }}>Legal Pages</Link>
              <Link href="/portal/admin-audit" style={{ fontWeight: isActive('/portal/admin-audit') ? 700 : 400, textDecoration: 'none', color: 'var(--red)' }}>Audit Logs</Link>
            </>
          )}

          <button 
            onClick={async () => {
              await logout()
              window.location.href = '/'
            }} 
            style={{ textAlign: 'left', marginTop: '24px', background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 0 }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: '3 1 600px' }}>
        {children}
      </main>

    </div>
  );
}
