// ─────────────────────────────────────────────
//  components/ProductGrid.js
//  Renders the product grid from filtered data
// ─────────────────────────────────────────────

function renderProducts() {
  var grid = document.getElementById('product-grid');
  var list = getFilteredSorted();

  // Update result count
  var countEl = document.getElementById('result-count');
  if (countEl) countEl.textContent = list.length + ' item' + (list.length !== 1 ? 's' : '');

  if (list.length === 0) {
    grid.innerHTML =
      '<div style="grid-column:1/-1;padding:80px 40px;text-align:center;' +
      'font-family:\'Barlow Condensed\',sans-serif;font-size:16px;' +
      'letter-spacing:.12em;text-transform:uppercase;color:var(--mid)">' +
      'No products match your filters</div>';
    return;
  }

  grid.innerHTML = list.map(function (p) {
    var saleBadge  = p.discount ? '<div class="deal-badge">Deal</div>' : '';
    var soldBadge  = p.sold    ? '<div class="sold-badge">Sold Out!</div>' : '';
    var newBadge   = (p.isNew && !p.sold) ? '<div class="new-badge">New</div>' : '';
    var origPrice  = p.orig ? '<span class="product-price-original">$' + p.orig.toLocaleString() + '</span>' : '';
    var discTag    = p.discount ? '<span class="discount-tag">-' + p.discount + '%</span>' : '';
    var sizesDots  = p.sizes.map(function (s) {
      return '<span class="size-dot ' + (p.avail.indexOf(s) !== -1 ? 'avail' : '') + '">' + s + '</span>';
    }).join('');

    return (
      '<div class="product-card" onclick="openDetail(' + p.id + ')">' +
        '<div class="product-img ' + (p.dark ? 'dark' : '') + '">' +
          '<button class="wish-btn" onclick="event.stopPropagation()">♡</button>' +
          '<span>' + p.emoji + '</span>' +
          saleBadge + soldBadge + newBadge +
        '</div>' +
        '<div class="product-info">' +
          '<div class="product-brand">' + p.brand + '</div>' +
          '<div class="product-name">'  + p.name  + '</div>' +
          '<div class="product-price-row">' + origPrice + '<span class="product-price">$' + p.price.toLocaleString() + '</span>' + discTag + '</div>' +
          '<div class="product-rating">★ ' + p.rating.toFixed(1) + '</div>' +
          '<div class="product-sizes">' + sizesDots + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}
