// ─────────────────────────────────────────────
//  lib/filters.js
//  Filter & sort state + getFilteredSorted()
// ─────────────────────────────────────────────

var filterState = {
  activeChip: 'all',
  activeSidebarCategory: 'all',
  activeSidebarSize: null,
  activeSidebarPrice: null,
  activeSort: 'new',
};

function getFilteredSorted() {
  var list = products.slice(); // copy

  // ── Sidebar: category ──
  if (filterState.activeSidebarCategory && filterState.activeSidebarCategory !== 'all') {
    list = list.filter(function (p) { return p.category === filterState.activeSidebarCategory; });
  }

  // ── Sidebar: size ──
  if (filterState.activeSidebarSize) {
    list = list.filter(function (p) { return p.avail.indexOf(filterState.activeSidebarSize) !== -1; });
  }

  // ── Sidebar: price ──
  if      (filterState.activeSidebarPrice === 'under100')  list = list.filter(function (p) { return p.price < 100; });
  else if (filterState.activeSidebarPrice === '100to300')  list = list.filter(function (p) { return p.price >= 100 && p.price <= 300; });
  else if (filterState.activeSidebarPrice === '300to600')  list = list.filter(function (p) { return p.price > 300 && p.price <= 600; });
  else if (filterState.activeSidebarPrice === '600plus')   list = list.filter(function (p) { return p.price > 600; });

  // ── Filter chips ──
  if      (filterState.activeChip === 'new')      list = list.filter(function (p) { return p.isNew; });
  else if (filterState.activeChip === 'sale')     list = list.filter(function (p) { return !!p.discount; });
  else if (filterState.activeChip === 'sizeS')    list = list.filter(function (p) { return p.avail.indexOf('S') !== -1; });
  else if (filterState.activeChip === 'sizeM')    list = list.filter(function (p) { return p.avail.indexOf('M') !== -1; });
  else if (filterState.activeChip === 'sizeL')    list = list.filter(function (p) { return p.avail.indexOf('L') !== -1; });
  else if (filterState.activeChip === 'under100') list = list.filter(function (p) { return p.price < 100; });
  else if (filterState.activeChip === '100to300') list = list.filter(function (p) { return p.price >= 100 && p.price <= 300; });

  // ── Sort ──
  if      (filterState.activeSort === 'new')       list.sort(function (a, b) { return b.id - a.id; });
  else if (filterState.activeSort === 'priceasc')  list.sort(function (a, b) { return a.price - b.price; });
  else if (filterState.activeSort === 'pricedesc') list.sort(function (a, b) { return b.price - a.price; });
  else if (filterState.activeSort === 'rating')    list.sort(function (a, b) { return b.rating - a.rating; });

  return list;
}
