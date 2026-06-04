"use client";

import Link from 'next/link';
import { useStore } from '../lib/StoreContext';

export function MenuOverlay() {
  const { isMenuOpen, setMenuOpen } = useStore();

  return (
    <>
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <span className="menu-logo"><img src="/img/kindard_white.svg" width="100" alt="Kindard" /></span>
          <button className="menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="menu-items">
          <Link href="/" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">Home</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/new-arrivals" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">New Arrivals</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/tees" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">Tees</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/hoodies" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">Hoodies</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/shorts" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">Shorts</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/knits" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">Knits</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/jackets" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">Jackets</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/accessories" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">Accessories</span><span className="menu-item-arrow">→</span>
          </Link>
        </div>
        <div className="menu-footer">
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Help & Contact</Link>
          <Link href="/shipping-returns" onClick={() => setMenuOpen(false)}>Shipping</Link>
          <Link href="/shipping-returns" onClick={() => setMenuOpen(false)}>Returns</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/privacy-policy" onClick={() => setMenuOpen(false)}>Privacy Policy</Link>
        </div>
      </div>
      <div 
        className={`backdrop ${isMenuOpen ? 'show' : ''}`} 
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
