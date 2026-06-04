// ─────────────────────────────────────────────
//  components/Nav.js
//  Navigation bar + mobile event wiring
// ─────────────────────────────────────────────

function initNav() {

  // ── DESKTOP hamburger (right side) ──
  var menuBtn = document.getElementById('menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', openMenu);

  // ── MOBILE hamburger (left side) ──
  var mobMenuBtn = document.getElementById('mob-menu-btn');
  if (mobMenuBtn) mobMenuBtn.addEventListener('click', openMenu);

  // ── Desktop cart button ──
  var cartBtn = document.getElementById('cart-btn');
  if (cartBtn) cartBtn.addEventListener('click', openCart);

  // ── Desktop search button ──
  var searchBtn = document.getElementById('search-btn');
  if (searchBtn) searchBtn.addEventListener('click', function () { window.location.href = 'search.html'; });

  // ── Desktop wishlist button ──
  var wishBtn = document.getElementById('wishlist-btn');
  if (wishBtn) wishBtn.addEventListener('click', function () { window.location.href = 'wishlist.html'; });

  // ── Desktop user/account button ──
  var userBtn = document.getElementById('user-btn');
  if (userBtn) userBtn.addEventListener('click', function () { window.location.href = 'login.html'; });

  // ── Backdrop → close everything ──
  var backdrop = document.getElementById('backdrop');
  if (backdrop) backdrop.addEventListener('click', closeAll);

  // ── Detail panel close btn ──
  var detailClose = document.querySelector('.detail-header .close-btn');
  if (detailClose) detailClose.addEventListener('click', closeDetail);

  // ── Cart panel close btn ──
  var cartClose = document.querySelector('.cart-header .close-btn');
  if (cartClose) cartClose.addEventListener('click', closeCart);

  // ── Toast "View Bag" btn ──
  var toastView = document.querySelector('.toast-view');
  if (toastView) toastView.addEventListener('click', openCart);

  // ── "Add to bag" btn inside detail panel ──
  var addBtn = document.getElementById('add-bag-btn');
  if (addBtn) addBtn.addEventListener('click', addToCart);

  // ── Apply coupon btn ──
  var couponBtn = document.querySelector('.cart-coupon button');
  if (couponBtn) couponBtn.addEventListener('click', applyCoupon);

  // ────────────────────────────────────────────
  //  MOBILE BOTTOM TAB BAR
  // ────────────────────────────────────────────

  // Home tab → scroll to top
  var tabHome = document.getElementById('mob-tab-home');
  if (tabHome) tabHome.addEventListener('click', function () {
    setMobActiveTab(tabHome);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Search tab → open search overlay
  var tabSearch = document.getElementById('mob-tab-search');
  if (tabSearch) tabSearch.addEventListener('click', function () {
    setMobActiveTab(tabSearch);
    openMobSearch();
  });

  // Wishlist tab
  var tabWishlist = document.getElementById('mob-tab-wishlist');
  if (tabWishlist) tabWishlist.addEventListener('click', function () {
    setMobActiveTab(tabWishlist);
    window.location.href = 'wishlist.html';
  });

  // Profile / User tab
  var tabUser = document.getElementById('mob-tab-user');
  if (tabUser) tabUser.addEventListener('click', function () {
    setMobActiveTab(tabUser);
    window.location.href = 'login.html';
  });

  // Bag tab → open cart
  var tabBag = document.getElementById('mob-tab-bag');
  if (tabBag) tabBag.addEventListener('click', function () {
    setMobActiveTab(tabBag);
    openCart();
  });

  // Search overlay close btn
  var mobSearchClose = document.getElementById('mob-search-close');
  if (mobSearchClose) mobSearchClose.addEventListener('click', closeMobSearch);
}

// ── Active tab helper ──
function setMobActiveTab(activeEl) {
  document.querySelectorAll('.mob-tab').forEach(function (t) { t.classList.remove('active'); });
  if (activeEl) activeEl.classList.add('active');
}

// ── Mobile search overlay ──
function openMobSearch() {
  var overlay = document.getElementById('mob-search-overlay');
  if (overlay) {
    overlay.classList.add('open');
    var input = document.getElementById('mob-search-input');
    if (input) setTimeout(function () { input.focus(); }, 50);
  }
}
function closeMobSearch() {
  var overlay = document.getElementById('mob-search-overlay');
  if (overlay) overlay.classList.remove('open');
  // Return active tab to Home
  var tabHome = document.getElementById('mob-tab-home');
  setMobActiveTab(tabHome);
}

// ── Close all panels ──
function closeAll() {
  closeDetail();
  closeCart();
  var backdrop = document.getElementById('backdrop');
  if (backdrop) backdrop.classList.remove('show');
}
