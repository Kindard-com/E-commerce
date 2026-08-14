"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../lib/StoreContext';

export function Nav() {
  const pathname = usePathname();
  const { cart, setMenuOpen, setCartOpen, user, isAdmin, logout } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const userName = user?.displayName?.split(' ')[0] || 'My Account';
  const profileImage = user?.metadata?.avatar_url || user?.photoURL || '/img/user.svg';

  return (
    <nav>
      {/* Mobile-only hamburger (left side on mobile, hidden on desktop) */}
      <button className="mob-hamburger" id="mob-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div className="nav-left">
        <Link href="/" className="nav-logo">
          <img src="/img/kindard.svg" width="150" alt="Kindard" />
        </Link>
      </div>

      <div className="nav-center">
        <Link href="/new-arrivals" className={isActive('/new-arrivals') || pathname === '/' ? 'active' : ''}>New Arrivals</Link>
        <Link href="/tees" className={isActive('/tees')}>Tees</Link>
        <Link href="/hoodies" className={isActive('/hoodies')}>Hoodies</Link>
        <Link href="/shorts" className={isActive('/shorts')}>Shorts</Link>
        <Link href="/knits" className={isActive('/knits')}>Knits</Link>
        <Link href="/jackets" className={isActive('/jackets')}>Jackets</Link>
        <Link href="/accessories" className={isActive('/accessories')}>Accessories</Link>
      </div>

      <div className="nav-right">
        {/* Search */}
        <div className="nav-search-wrap">
          <form action="/search" style={{ display: 'flex', width: '100%', height: '100%' }}>
            <input type="text" name="q" placeholder="What's the lowdown, pal?" aria-label="Search" />
            <button aria-label="Search" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Wishlist */}
        <Link href="/wishlist" className="icon-btn" id="wishlist-btn" aria-label="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </Link>

        {/* Cart */}
        <button className="icon-btn" id="cart-btn" aria-label="Shopping bag" onClick={() => setCartOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && <span className="badge" id="cart-count">{cartCount}</span>}
        </button>

        {/* User Dropdown */}
        <div className="nav-user-dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
          {user || isAdmin ? (
            <div className="nav-user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img src={profileImage} alt={isAdmin && !user ? 'Admin' : userName} className="nav-user-avatar" />
            </div>
          ) : (
            <Link href="/login" className="icon-btn" id="user-btn" aria-label="Login">
              <img src="/img/user.svg" alt="User account" />
            </Link>
          )}

          {(user || isAdmin) && dropdownOpen && (
            <div className="nav-dropdown-menu">
              <div className="nav-dropdown-header">
                <strong>Welcome back, {isAdmin && !user ? 'Admin' : userName} {customerNumber ? `| ${customerNumber}` : ''}</strong>
              </div>
              {user && (
                <>
                  <Link href="/portal" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>My Account</Link>
                  <Link href="/portal/orders" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>Orders</Link>
                  <Link href="/portal/invoices" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>Invoices</Link>
                  <Link href="/portal/settings" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>Account Settings</Link>
                </>
              )}
              {isAdmin && (
                <Link href="/portal/admin-settings" className="nav-dropdown-item" style={{ color: 'var(--red)', fontWeight: 'bold' }} onClick={() => setDropdownOpen(false)}>Admin Account</Link>
              )}
              <button onClick={handleLogout} className="nav-dropdown-item logout-btn">Sign Out</button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" id="menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
