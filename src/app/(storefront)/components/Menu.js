// ─────────────────────────────────────────────
//  components/Menu.js
//  Full-screen hamburger menu overlay
// ─────────────────────────────────────────────

function openMenu() {
  document.getElementById('menu-overlay').classList.add('open');
}

function closeMenu() {
  document.getElementById('menu-overlay').classList.remove('open');
}

function initMenu() {
  var closeBtn = document.querySelector('.menu-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
}
