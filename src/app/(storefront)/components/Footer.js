// ─────────────────────────────────────────────
//  components/Footer.js
//  Footer HTML injection + newsletter wiring
// ─────────────────────────────────────────────

var FOOTER_HTML = [
  '<div class="footer-newsletter">',
    '<div class="footer-nl-left">',
      '<div class="footer-nl-tag"><span>Members only</span></div>',
      '<div class="footer-nl-title"><span>Get early access.</span><br><span>Stay ahead.</span></div>',
      '<p class="footer-nl-sub">Drop alerts, exclusive codes, and zero spam. Join the Kindard inner circle.</p>',
    '</div>',
    '<div class="footer-nl-right">',
      '<div class="footer-nl-form">',
        '<input type="email" class="footer-nl-input" id="nl-email" placeholder="your@email.com">',
        '<button class="footer-nl-btn" id="nl-submit">Subscribe →</button>',
      '</div>',
      '<p class="footer-nl-fine">By subscribing you agree to our privacy policy. Unsubscribe anytime.</p>',
    '</div>',
  '</div>',

  '<div class="footer-main">',
    '<div class="footer-brand-col">',
      '<div class="footer-logo"><span><img src="public/img/kindard_white.svg" width="100" alt="Kindard"></span></div>',
      '<p class="footer-about">Heavy cotton. Oversized fits.<br>Graphic energy. Since 2019.</p>',
      '<div class="footer-socials">',
        '<a href="#" class="footer-social">IG</a>',
        '<a href="#" class="footer-social">TW</a>',
        '<a href="#" class="footer-social">TK</a>',
        '<a href="#" class="footer-social">YT</a>',
        '<a href="#" class="footer-social">PT</a>',
      '</div>',
      '<div class="footer-badges">',
        '<div class="footer-badge"><span>🌱 Carbon Neutral Shipping</span></div>',
        '<div class="footer-badge"><span>♻️ Recycled Packaging</span></div>',
      '</div>',
    '</div>',

    '<div class="footer-link-col">',
      '<div class="footer-col-title"><span>Shop</span></div>',
      '<a href="#" class="footer-link">New Arrivals</a>',
      '<a href="#" class="footer-link">Tees</a>',
      '<a href="#" class="footer-link">Hoodies</a>',
      '<a href="#" class="footer-link">Shorts</a>',
      '<a href="#" class="footer-link">Knits</a>',
      '<a href="#" class="footer-link">Jackets</a>',
      '<a href="#" class="footer-link">Accessories</a>',
      '<a href="#" class="footer-link sale-link">Sale ↘</a>',
    '</div>',

    '<div class="footer-link-col">',
      '<div class="footer-col-title"><span>Help</span></div>',
      '<a href="help-contact.html" class="footer-link">Help &amp; Contact</a>',
      '<a href="shipping-info.html" class="footer-link">Shipping Info</a>',
      '<a href="returns-exchanges.html" class="footer-link">Returns &amp; Exchanges</a>',
      '<a href="size-guide.html" class="footer-link">Size Guide</a>',
      '<a href="track-order.html" class="footer-link">Track My Order</a>',
      '<a href="afterpay-klarna.html" class="footer-link">Afterpay / Klarna</a>',
      '<a href="gift-cards.html" class="footer-link">Gift Cards</a>',
    '</div>',

    '<div class="footer-link-col">',
      '<div class="footer-col-title"><span>Company</span></div>',
      '<a href="about.html" class="footer-link">About Kindard</a>',
      '<a href="careers.html" class="footer-link">Careers</a>',
      '<a href="press.html" class="footer-link">Press</a>',
      '<a href="sustainability.html" class="footer-link">Sustainability</a>',
      '<a href="collaborations.html" class="footer-link">Collaborations</a>',
      '<a href="affiliate-program.html" class="footer-link">Affiliate Program</a>',
    '</div>',

    '<div class="footer-link-col">',
      '<div class="footer-col-title"><span>Stores</span></div>',
      '<a href="ny-soho.html" class="footer-link">New York — SoHo</a>',
      '<a href="la-fairfax.html" class="footer-link">Los Angeles — Fairfax</a>',
      '<a href="london-carnaby.html" class="footer-link">London — Carnaby St.</a>',
      '<a href="tokyo-harajuku.html" class="footer-link">Tokyo — Harajuku</a>',
      '<a href="amsterdam-straatjes.html" class="footer-link">Amsterdam — 9 Straatjes</a>',
      '<a href="find-stockist.html" class="footer-link">Find a Stockist</a>',
      '<div class="footer-col-title" style="margin-top:20px"><span>App</span></div>',
      '<a href="https://apps.apple.com/" target="_blank" class="footer-link">↓ App Store</a>',
      '<a href="https://play.google.com/" target="_blank" class="footer-link">↓ Google Play</a>',
    '</div>',
  '</div>',

  '<div class="footer-bottom">',
    '<div class="footer-legal">',
      '<span>© 2026 Kindard. All rights reserved.</span>',
      '<a href="privacy-policy.html" class="footer-legal-link">Privacy Policy</a>',
      '<a href="terms-of-service.html" class="footer-legal-link">Terms of Service</a>',
      '<a href="cookie-settings.html" class="footer-legal-link">Cookie Settings</a>',
    '</div>',
    '<div class="footer-payments">',
      '<div class="pay-chip"><span>VISA</span></div>',
      '<div class="pay-chip"><span>MC</span></div>',
      '<div class="pay-chip"><span>AMEX</span></div>',
      '<div class="pay-chip"><span>PAYPAL</span></div>',
      '<div class="pay-chip"><span>KLARNA</span></div>',
      '<div class="pay-chip"><span>APPLE PAY</span></div>',
      '<div class="pay-chip"><span>G PAY</span></div>',
    '</div>',
  '</div>',
].join('');

function initFooter() {
  var footer = document.querySelector('footer');
  if (footer) footer.innerHTML = FOOTER_HTML;

  // Newsletter subscribe button
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'nl-submit') {
      var emailEl = document.getElementById('nl-email');
      if (emailEl && emailEl.value) {
        emailEl.value = '';
        e.target.textContent = 'Subscribed ✓';
        setTimeout(function () { e.target.textContent = 'Subscribe →'; }, 3000);
      }
    }
  });
}
