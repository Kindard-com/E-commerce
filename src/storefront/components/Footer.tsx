"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');
  const [btnText, setBtnText] = useState('Subscribe →');
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
    
    setBtnText('Subscribing...');
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
        setBtnText('Subscribed ✓');
        setTimeout(() => setBtnText('Subscribe →'), 3000);
      } else {
        // Handle validation errors (e.g. unique constraint failure)
        if (data?.errors?.[0]?.data?.[0]?.message === 'Value must be unique' || data?.errors?.[0]?.message?.includes('unique')) {
          setBtnText('Already Subscribed');
        } else {
          setBtnText('Error');
        }
        setTimeout(() => setBtnText('Subscribe →'), 3000);
      }
    } catch (err) {
      console.error(err);
      setBtnText('Error');
      setTimeout(() => setBtnText('Subscribe →'), 3000);
    }
  };

  return (
    <footer>
      <div className="footer-newsletter">
        <div className="footer-nl-left">
          <div className="footer-nl-tag"><span>Members only</span></div>
          <div className="footer-nl-title"><span>Get early access.</span><br/><span>Stay ahead.</span></div>
          <p className="footer-nl-sub">Drop alerts, exclusive codes, and zero spam. Join the Kindard inner circle.</p>
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
              {btnText.toUpperCase()}
            </button>
          </div>
          <p className="footer-nl-fine">By subscribing you agree to our privacy policy. Unsubscribe anytime.</p>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-brand-col">
          <div className="footer-logo"><span><img src="/img/kindard_white.svg" width="100" alt="Kindard" /></span></div>
          <p className="footer-about" style={{ whiteSpace: 'pre-wrap' }}>{settings.footer_description || "Heavy cotton. Oversized fits.\nGraphic energy. Since 2019."}</p>
          <div className="footer-socials">
            <Link href="#" className="footer-social">IG</Link>
            <Link href="#" className="footer-social">TW</Link>
            <Link href="#" className="footer-social">TK</Link>
            <Link href="#" className="footer-social">YT</Link>
            <Link href="#" className="footer-social">PT</Link>
          </div>
          <div className="footer-badges">
            <div className="footer-badge"><span>🌱 Carbon Neutral Shipping</span></div>
            <div className="footer-badge"><span>♻️ Recycled Packaging</span></div>
          </div>
        </div>

        <div className="footer-link-col">
          <div className="footer-col-title"><span>Shop</span></div>
          <Link href="/new-arrivals" className="footer-link">New Arrivals</Link>
          <Link href="/tees" className="footer-link">Tees</Link>
          <Link href="/hoodies" className="footer-link">Hoodies</Link>
          <Link href="/shorts" className="footer-link">Shorts</Link>
          <Link href="/knits" className="footer-link">Knits</Link>
          <Link href="/jackets" className="footer-link">Jackets</Link>
          <Link href="/accessories" className="footer-link">Accessories</Link>
          <Link href="/sale" className="footer-link sale-link">Sale ↘</Link>
        </div>

        <div className="footer-link-col">
          <div className="footer-col-title"><span>Help</span></div>
          <Link href="/help-contact" className="footer-link">Help &amp; Contact</Link>
          <Link href="/shipping-info" className="footer-link">Shipping Info</Link>
          <Link href="/returns-exchanges" className="footer-link">Returns &amp; Exchanges</Link>
          <Link href="/size-guide" className="footer-link">Size Guide</Link>
          <Link href="/track-order" className="footer-link">Track My Order</Link>
          <Link href="/afterpay-klarna" className="footer-link">Afterpay / Klarna</Link>
          <Link href="/gift-cards" className="footer-link">Gift Cards</Link>
        </div>

        <div className="footer-link-col">
          <div className="footer-col-title"><span>Company</span></div>
          <Link href="/about" className="footer-link">About Kindard</Link>
          <Link href="/careers" className="footer-link">Careers</Link>
          <Link href="/press" className="footer-link">Press</Link>
          <Link href="/sustainability" className="footer-link">Sustainability</Link>
          <Link href="/collaborations" className="footer-link">Collaborations</Link>
          <Link href="/affiliate-program" className="footer-link">Affiliate Program</Link>
        </div>

        <div className="footer-link-col">
          <div className="footer-col-title"><span>Stores</span></div>
          <Link href="/stores/ny-soho" className="footer-link">New York — SoHo</Link>
          <Link href="/stores/la-fairfax" className="footer-link">Los Angeles — Fairfax</Link>
          <Link href="/stores/london-carnaby" className="footer-link">London — Carnaby St.</Link>
          <Link href="/stores/tokyo-harajuku" className="footer-link">Tokyo — Harajuku</Link>
          <Link href="/stores/amsterdam-straatjes" className="footer-link">Amsterdam — 9 Straatjes</Link>
          <Link href="/find-stockist" className="footer-link">Find a Stockist</Link>
          <div className="footer-col-title" style={{ marginTop: '20px' }}><span>App</span></div>
          <a href={payloadFooter.appStoreUrl || settings.app_store_url || "https://apps.apple.com/"} target="_blank" className="footer-link" rel="noreferrer">↓ App Store</a>
          <a href={payloadFooter.googlePlayUrl || settings.play_store_url || "https://play.google.com/"} target="_blank" className="footer-link" rel="noreferrer">↓ Google Play</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <span>{settings.footer_copyright || "© 2026 Kindard. All rights reserved."}</span>
          <Link href="/privacy-policy" className="footer-legal-link">Privacy Policy</Link>
          <Link href="/terms-of-service" className="footer-legal-link">Terms of Service</Link>
          <Link href="/cookie-settings" className="footer-legal-link">Cookie Settings</Link>
        </div>
        <div className="footer-payments">
          <div className="pay-chip"><span>VISA</span></div>
          <div className="pay-chip"><span>MC</span></div>
          <div className="pay-chip"><span>AMEX</span></div>
          <div className="pay-chip"><span>PAYPAL</span></div>
          <div className="pay-chip"><span>KLARNA</span></div>
          <div className="pay-chip"><span>APPLE PAY</span></div>
          <div className="pay-chip"><span>G PAY</span></div>
        </div>
      </div>
    </footer>
  );
}
