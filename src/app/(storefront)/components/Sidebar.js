// ─────────────────────────────────────────────
//  components/Sidebar.js
//  Sidebar filter event wiring + active sync
// ─────────────────────────────────────────────

function syncSidebarActive() {
  document.querySelectorAll('[data-cat]').forEach(function (el) {
    el.classList.toggle('active', el.dataset.cat === filterState.activeSidebarCategory);
  });
  document.querySelectorAll('[data-size]').forEach(function (el) {
    el.classList.toggle('active', el.dataset.size === filterState.activeSidebarSize);
  });
  document.querySelectorAll('[data-price]').forEach(function (el) {
    el.classList.toggle('active', el.dataset.price === filterState.activeSidebarPrice);
  });
}

function initSidebar() {
  // ── Category ──
  document.querySelectorAll('[data-cat]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      filterState.activeSidebarCategory = el.dataset.cat;
      // Reset chip filter to 'all' when using sidebar
      filterState.activeChip = 'all';
      document.querySelectorAll('.filter-chip').forEach(function (b) { b.classList.remove('active'); });
      var allChip = document.querySelector('.filter-chip[data-filter="all"]');
      if (allChip) allChip.classList.add('active');
      syncSidebarActive();
      renderProducts();
    });
  });

  // ── Size (toggleable) ──
  document.querySelectorAll('[data-size]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      filterState.activeSidebarSize = (filterState.activeSidebarSize === el.dataset.size)
        ? null
        : el.dataset.size;
      syncSidebarActive();
      renderProducts();
    });
  });

  // ── Price (toggleable) ──
  document.querySelectorAll('[data-price]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      filterState.activeSidebarPrice = (filterState.activeSidebarPrice === el.dataset.price)
        ? null
        : el.dataset.price;
      syncSidebarActive();
      renderProducts();
    });
  });
}
