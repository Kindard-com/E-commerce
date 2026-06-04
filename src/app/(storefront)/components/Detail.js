// ─────────────────────────────────────────────
//  components/Detail.js
//  Product detail slide-in panel
// ─────────────────────────────────────────────

var currentProduct = null;
var selectedSize   = null;
var selectedColor  = null;

function openDetail(id) {
  currentProduct = products.find(function (p) { return p.id === id; });
  selectedSize  = null;
  selectedColor = currentProduct.colors[0];

  var panel = document.getElementById('detail-panel');
  var img   = document.getElementById('detail-img');

  img.textContent = currentProduct.emoji;
  img.style.background = currentProduct.dark ? '#1a1a1a' : '#e8e5e0';

  document.getElementById('detail-brand').textContent = currentProduct.brand;
  document.getElementById('detail-name').textContent  = currentProduct.name;
  document.getElementById('detail-price').innerHTML   = currentProduct.orig
    ? '<span style="text-decoration:line-through;color:var(--mid);font-size:14px;margin-right:8px">$' + currentProduct.orig.toLocaleString() + '</span>$' + currentProduct.price.toLocaleString()
    : '$' + currentProduct.price.toLocaleString();

  document.getElementById('detail-colors').innerHTML = currentProduct.colors.map(function (c, i) {
    return '<div class="color-swatch ' + (i === 0 ? 'selected' : '') + '" style="background:' + c + '" onclick="detailSelectColor(this,\'' + c + '\')"></div>';
  }).join('');

  document.getElementById('detail-sizes').innerHTML = currentProduct.sizes.map(function (s) {
    var unavail = currentProduct.avail.indexOf(s) === -1;
    return '<button class="size-btn ' + (unavail ? 'unavail' : '') + '" onclick="detailSelectSize(this,\'' + s + '\')" ' + (unavail ? 'disabled' : '') + '>' + s + '</button>';
  }).join('');

  var btn = document.getElementById('add-bag-btn');
  btn.disabled = !!(currentProduct.sold || currentProduct.avail.length === 0);
  btn.innerHTML = btn.disabled 
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> SOLD OUT' 
    : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> ADD TO YOUR BAG';

  panel.classList.add('open');
  document.getElementById('backdrop').classList.add('show');
}

function closeDetail() {
  document.getElementById('detail-panel').classList.remove('open');
  document.getElementById('backdrop').classList.remove('show');
}

function detailSelectSize(el, s) {
  selectedSize = s;
  document.querySelectorAll('.size-btn').forEach(function (b) { b.classList.remove('selected'); });
  el.classList.add('selected');
}

function detailSelectColor(el, c) {
  selectedColor = c;
  document.querySelectorAll('.color-swatch').forEach(function (sw) { sw.classList.remove('selected'); });
  el.classList.add('selected');
}
