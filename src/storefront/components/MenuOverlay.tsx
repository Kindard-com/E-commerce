"use client";

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useStore } from '../lib/StoreContext';

export function MenuOverlay() {
  const { isMenuOpen, setMenuOpen } = useStore();
  const t = useTranslations('nav');
  const tMenu = useTranslations('menu');

  return (
    <>
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <span className="menu-logo"><img src="/img/kindard_white.svg" width="100" alt="Kindard" /></span>
          <button className="menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="menu-items">
          <Link href="/" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{tMenu('home')}</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/buy" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{t('shop')}</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/new-arrivals" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{t('newArrivals')}</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/tees" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{t('tees')}</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/hoodies" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{t('hoodies')}</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/shorts" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{t('shorts')}</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/knits" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{t('knits')}</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/jackets" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{t('jackets')}</span><span className="menu-item-arrow">→</span>
          </Link>
          <Link href="/accessories" className="menu-item" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-name">{t('accessories')}</span><span className="menu-item-arrow">→</span>
          </Link>
        </div>
        <div className="menu-footer">
          <Link href="/help-contact" onClick={() => setMenuOpen(false)}>{tMenu('help')}</Link>
          <Link href="/shipping-info" onClick={() => setMenuOpen(false)}>{tMenu('shipping')}</Link>
          <Link href="/returns-exchanges" onClick={() => setMenuOpen(false)}>{tMenu('returns')}</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>{tMenu('about')}</Link>
          <Link href="/privacy-policy" onClick={() => setMenuOpen(false)}>{tMenu('privacy')}</Link>
        </div>
      </div>
      <div 
        className={`backdrop ${isMenuOpen ? 'show' : ''}`} 
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
