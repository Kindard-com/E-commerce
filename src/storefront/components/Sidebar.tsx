"use client";

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('sidebar');
  const tNav = useTranslations('nav');

  const isCatActive = (cat: string) => pathname.includes(cat) ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-title"><span>{t('category')}</span></div>
        <Link href="/buy" className={`sidebar-item ${pathname === '/buy' ? 'active' : ''}`}>{tNav('shop')}</Link>
        <Link href="/new-arrivals" className={`sidebar-item ${pathname === '/' || isCatActive('new-arrivals') ? 'active' : ''}`}>{tNav('newArrivals')}</Link>
        <Link href="/tees" className={`sidebar-item ${isCatActive('tees')}`}>{tNav('tees')}</Link>
        <Link href="/hoodies" className={`sidebar-item ${isCatActive('hoodies')}`}>{tNav('hoodies')}</Link>
        <Link href="/shorts" className={`sidebar-item ${isCatActive('shorts')}`}>{tNav('shorts')}</Link>
        <Link href="/knits" className={`sidebar-item ${isCatActive('knits')}`}>{tNav('knits')}</Link>
        <Link href="/jackets" className={`sidebar-item ${isCatActive('jackets')}`}>{tNav('jackets')}</Link>
        <Link href="/accessories" className={`sidebar-item ${isCatActive('accessories')}`}>{tNav('accessories')}</Link>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title"><span>{t('size')}</span></div>
        <a href="#" className="sidebar-item">2-3 Yrs (XS)</a>
        <a href="#" className="sidebar-item">4-5 Yrs (S)</a>
        <a href="#" className="sidebar-item">6-7 Yrs (M)</a>
        <a href="#" className="sidebar-item">8-9 Yrs (L)</a>
        <a href="#" className="sidebar-item">10-11 Yrs (XL)</a>
        <a href="#" className="sidebar-item">12-13 Yrs (XXL)</a>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title"><span>{t('price')}</span></div>
        <a href="#" className="sidebar-item">Under $100</a>
        <a href="#" className="sidebar-item">$100 – $300</a>
        <a href="#" className="sidebar-item">$300 – $600</a>
        <a href="#" className="sidebar-item">$600+</a>
      </div>
    </aside>
  );
}
