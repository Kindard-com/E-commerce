"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const isCatActive = (cat: string) => pathname.includes(cat) ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-title"><span>Category</span></div>
        <Link href="/new-arrivals" className={`sidebar-item ${pathname === '/' || isCatActive('new-arrivals') ? 'active' : ''}`}>New Arrivals</Link>
        <Link href="/tees" className={`sidebar-item ${isCatActive('tees')}`}>Tees</Link>
        <Link href="/hoodies" className={`sidebar-item ${isCatActive('hoodies')}`}>Hoodies</Link>
        <Link href="/shorts" className={`sidebar-item ${isCatActive('shorts')}`}>Shorts</Link>
        <Link href="/knits" className={`sidebar-item ${isCatActive('knits')}`}>Knits</Link>
        <Link href="/jackets" className={`sidebar-item ${isCatActive('jackets')}`}>Jackets</Link>
        <Link href="/accessories" className={`sidebar-item ${isCatActive('accessories')}`}>Accessories</Link>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title"><span>Size</span></div>
        <a href="#" className="sidebar-item">XS</a>
        <a href="#" className="sidebar-item">S</a>
        <a href="#" className="sidebar-item">M</a>
        <a href="#" className="sidebar-item">L</a>
        <a href="#" className="sidebar-item">XL</a>
        <a href="#" className="sidebar-item">XXL</a>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title"><span>Price</span></div>
        <a href="#" className="sidebar-item">Under $100</a>
        <a href="#" className="sidebar-item">$100 – $300</a>
        <a href="#" className="sidebar-item">$300 – $600</a>
        <a href="#" className="sidebar-item">$600+</a>
      </div>
    </aside>
  );
}
