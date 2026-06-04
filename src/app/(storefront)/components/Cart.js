// ─────────────────────────────────────────────
//  components/Cart.js
//  Cart slide-in panel render + open/close
// ─────────────────────────────────────────────

function renderCart() {
  var totals = getCartTotals();

  document.getElementById('cart-items').innerHTML = cart.map(function (item, idx) {
    var discTag = item.discount
      ? '<span style="font-size:10px;background:var(--black);color:var(--accent);padding:2px 5px">-' + item.discount + '%</span>'
      : '';
    return (
      '<div class="cart-item">' +
        '<div class="cart-item-img" style="background:' + (item.dark ? '#1a1a1a' : '#e8e5e0') + '">' + item.emoji + '</div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-brand">' + item.brand + '</div>' +
          '<div class="cart-item-name">'  + item.name  + '</div>' +
          '<div class="cart-item-meta">SHIPPED NOV 12TH &nbsp;·&nbsp; SIZE ' + item.size + '</div>' +
          '<div class="cart-item-bottom">' +
            '<div class="qty-ctrl">' +
              '<button class="qty-btn" onclick="cartChangeQty(' + idx + ',-1);renderCart()">−</button>' +
              '<div class="qty-num">' + item.qty + '</div>' +
              '<button class="qty-btn" onclick="cartChangeQty(' + idx + ',1);renderCart()">+</button>' +
            '</div>' +
            '<span class="cart-item-price">$' + (item.price * item.qty).toLocaleString() + ' ' + discTag + '</span>' +
            '<button class="remove-btn" onclick="cartRemoveItem(' + idx + ');renderCart()">Remove</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  document.getElementById('cart-sub').textContent   = '$' + totals.subtotal.toLocaleString();
  document.getElementById('cart-disc').textContent  = totals.disc ? '-$' + totals.disc.toLocaleString() : '-$0';
  document.getElementById('cart-total').textContent = '$' + totals.total.toLocaleString();
  document.getElementById('checkout-total').textContent = '$' + totals.total.toLocaleString();

  var count = cartItemCount();
  document.getElementById('cart-count').textContent = count;
  var mobCountEl = document.getElementById('mob-cart-count');
  if (mobCountEl) mobCountEl.textContent = count;
  document.getElementById('toast-total').textContent = '$' + totals.total.toLocaleString();
  document.getElementById('toast-text').textContent  = count + ' item' + (count !== 1 ? 's' : '') + ' in your bag';
}

function openCart() {
  closeDetail();
  document.getElementById('cart-panel').classList.add('open');
  document.getElementById('backdrop').classList.add('show');
  hideToast();
}

function closeCart() {
  document.getElementById('cart-panel').classList.remove('open');
  document.getElementById('backdrop').classList.remove('show');
}

function addToCart() {
  if (!selectedSize) { alert('Please select a size'); return; }
  cartAddItem(currentProduct, selectedSize, selectedColor);
  closeDetail();
  renderCart();
  showToast();
}

function applyCoupon() {
  var val = document.getElementById('coupon-input').value;
  cartApplyCoupon(val);
  renderCart();
}
