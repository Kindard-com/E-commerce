"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const [email, setEmail] = useState('');
  const [btnText, setBtnText] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [payloadFooter, setPayloadFooter] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(console.error);

    fetch('/api/globals/footer')
      .then(res => res.json())
      .then(data => {
        if (data) setPayloadFooter(data);
      })
      .catch(console.error);
  }, []);

  const handleSubscribe = async () => {
    if (!email) return;
    
    setBtnText(t('subscribing'));
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setEmail('');
        setBtnText(t('subscribed'));
        setTimeout(() => setBtnText(null), 3000);
      } else {
        // Handle validation errors (e.g. unique constraint failure)
        if (data?.errors?.[0]?.data?.[0]?.message === 'Value must be unique' || data?.errors?.[0]?.message?.includes('unique')) {
          setBtnText(t('alreadySubscribed'));
        } else {
          setBtnText(t('subscribeError'));
        }
        setTimeout(() => setBtnText(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setBtnText(t('subscribeError'));
      setTimeout(() => setBtnText(null), 3000);
    }
  };

  return (
    <footer>
      <div className="footer-newsletter">
        <div className="footer-nl-left">
          <div className="footer-nl-tag"><span>{t('membersOnly')}</span></div>
          <div className="footer-nl-title"><span>{t('newsletterTitle1')}</span><br/><span>{t('newsletterTitle2')}</span></div>
          <p className="footer-nl-sub">{t('newsletterSub')}</p>
        </div>
        <div className="footer-nl-right">
          <div className="footer-nl-form">
            <input 
              type="email" 
              className="footer-nl-input" 
              id="nl-email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="footer-nl-btn" id="nl-submit" onClick={handleSubscribe} style={{ fontWeight: 900, letterSpacing: '.1em', background: 'var(--accent)', color: 'var(--black)' }}>
              {(btnText ?? t('subscribe')).toUpperCase()}
            </button>
          </div>
          <p className="footer-nl-fine">{t('finePrint')}</p>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-brand-col">
          <div className="footer-logo"><span><img src="/img/kindard_white.svg" width="100" alt="Kindard" /></span></div>
          <p className="footer-about" style={{ whiteSpace: 'pre-wrap' }}>{settings.footer_description || "Heavy cotton. Oversized fits.\nGraphic energy. Since 2019."}</p>
          <div className="footer-socials">
            <a href="#" className="footer-social">IG</a>
            <a href="#" className="footer-social">TW</a>
            <a href="#" className="footer-social">TK</a>
            <a href="#" className="footer-social">YT</a>
            <a href="#" className="footer-social">PT</a>
          </div>
          <div className="footer-badges">
            <div className="footer-badge"><span>🌱 Carbon Neutral Shipping</span></div>
            <div className="footer-badge"><span>♻️ Recycled Packaging</span></div>
          </div>
        </div>

        <div className="footer-link-col">
          <div className="footer-col-title"><span>{t('shop')}</span></div>
          <Link href="/buy" className="footer-link">{t('shop')}</Link>
          <Link href="/new-arrivals" className="footer-link">{tNav('newArrivals')}</Link>
          <Link href="/tees" className="footer-link">{tNav('tees')}</Link>
          <Link href="/hoodies" className="footer-link">{tNav('hoodies')}</Link>
          <Link href="/shorts" className="footer-link">{tNav('shorts')}</Link>
          <Link href="/knits" className="footer-link">{tNav('knits')}</Link>
          <Link href="/jackets" className="footer-link">{tNav('jackets')}</Link>
          <Link href="/accessories" className="footer-link">{tNav('accessories')}</Link>
          <Link href="/sale" className="footer-link sale-link">{t('sale')}</Link>
        </div>

        <div className="footer-link-col">
          <div className="footer-col-title"><span>{t('help')}</span></div>
          <Link href="/help-contact" className="footer-link">{t('helpContact')}</Link>
          <Link href="/shipping-info" className="footer-link">{t('shippingInfo')}</Link>
          <Link href="/returns-exchanges" className="footer-link">{t('returnsExchanges')}</Link>
          <Link href="/size-guide" className="footer-link">{t('sizeGuide')}</Link>
          <Link href="/track-order" className="footer-link">{t('trackOrder')}</Link>
          <Link href="/afterpay-klarna" className="footer-link">Afterpay / Klarna</Link>
          <Link href="/gift-cards" className="footer-link">{t('giftCards')}</Link>
        </div>

        <div className="footer-link-col">
          <div className="footer-col-title"><span>{t('company')}</span></div>
          <Link href="/about" className="footer-link">{t('about')}</Link>
          <Link href="/careers" className="footer-link">{t('careers')}</Link>
          <Link href="/press" className="footer-link">{t('press')}</Link>
          <Link href="/sustainability" className="footer-link">{t('sustainability')}</Link>
          <Link href="/collaborations" className="footer-link">{t('collaborations')}</Link>
          <Link href="/affiliate-program" className="footer-link">{t('affiliate')}</Link>
        </div>

        <div className="footer-link-col">
          <div className="footer-col-title"><span>{t('stores')}</span></div>
          <Link href="/stores/ny-soho" className="footer-link">New York — SoHo</Link>
          <Link href="/stores/la-fairfax" className="footer-link">Los Angeles — Fairfax</Link>
          <Link href="/stores/london-carnaby" className="footer-link">London — Carnaby St.</Link>
          <Link href="/stores/tokyo-harajuku" className="footer-link">Tokyo — Harajuku</Link>
          <Link href="/stores/amsterdam-straatjes" className="footer-link">Amsterdam — 9 Straatjes</Link>
          <Link href="/find-stockist" className="footer-link">{t('findStockist')}</Link>
          <div className="footer-col-title" style={{ marginTop: '20px' }}><span>App</span></div>
          <a href={payloadFooter.appStoreUrl || settings.app_store_url || "https://apps.apple.com/"} target="_blank" className="footer-link" rel="noreferrer">↓ App Store</a>
          <a href={payloadFooter.googlePlayUrl || settings.play_store_url || "https://play.google.com/"} target="_blank" className="footer-link" rel="noreferrer">↓ Google Play</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <span>{settings.footer_copyright || "© 2026 Kindard. All rights reserved."}</span>
          <Link href="/privacy-policy" className="footer-legal-link">{t('privacy')}</Link>
          <Link href="/terms-of-service" className="footer-legal-link">{t('terms')}</Link>
          <Link href="/cookie-settings" className="footer-legal-link">{t('cookies')}</Link>
        </div>
        <div className="footer-payments" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mid)', fontSize: '12px' }}>
            <span>{t('securePayments')}</span>
            <img src="/img/payment/mollie-logo.svg" alt="Mollie" style={{ height: '14px', marginTop: '2px' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <img src="/img/payment/ideal.svg" alt="iDEAL" style={{ height: '24px' }} />
            <img src="/img/payment/bancontact.svg" alt="Bancontact" style={{ height: '24px' }} />
            <img src="/img/payment/visa.svg" alt="Visa" style={{ height: '24px' }} />
            <img src="/img/payment/mastercard.svg" alt="Mastercard" style={{ height: '24px' }} />
            <img src="/img/payment/amex.svg" alt="Amex" style={{ height: '24px' }} />
            <img src="/img/payment/klarna.svg" alt="Klarna" style={{ height: '24px' }} />
            <img src="/img/payment/apple-pay.svg" alt="Apple Pay" style={{ height: '24px' }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
