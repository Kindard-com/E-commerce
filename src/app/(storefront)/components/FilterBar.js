// ─────────────────────────────────────────────
//  components/FilterBar.js
//  Filter chips + sort select event wiring
// ─────────────────────────────────────────────

function initFilterBar() {
  // ── Filter chips ──
  document.querySelectorAll('.filter-chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-chip').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      filterState.activeChip = this.dataset.filter || 'all';

      // When a chip other than "all" is clicked, reset sidebar category
      if (filterState.activeChip !== 'all') {
        filterState.activeSidebarCategory = 'all';
        syncSidebarActive();
      }
      renderProducts();
    });
  });

  // ── Sort select ──
  var sortEl = document.querySelector('.sort-select');
  if (sortEl) {
    sortEl.addEventListener('change', function () {
      filterState.activeSort = this.value;
      renderProducts();
    });
  }
}
