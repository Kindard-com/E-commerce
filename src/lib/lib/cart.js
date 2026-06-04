// ─────────────────────────────────────────────
//  lib/cart.js
//  Cart state + add / remove / qty / coupon
// ─────────────────────────────────────────────

var cart = [
  Object.assign({}, products[3], { qty: 1, size: 'M', color: '#1a2a4a' }),
  Object.assign({}, products[4], { qty: 1, size: 'S', color: '#8b6f47' }),
  Object.assign({}, products[5], { qty: 1, size: 'M', color: '#f0ede8' }),
];

var couponApplied = false;

function getCartTotals() {
  var subtotal = cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  var disc = couponApplied ? Math.round(subtotal * 0.2) : 0;
  return { subtotal: subtotal, disc: disc, total: subtotal - disc };
}

function cartAddItem(product, size, color) {
  var existing = cart.find(function (i) {
    return i.id === product.id && i.size === size && i.color === color;
  });
  if (existing) {
    existing.qty++;
  } else {
    cart.push(Object.assign({}, product, { qty: 1, size: size, color: color }));
  }
}

function cartChangeQty(idx, delta) {
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
}

function cartRemoveItem(idx) {
  cart.splice(idx, 1);
}

function cartApplyCoupon(code) {
  couponApplied = (code.trim().toUpperCase() === 'KIND20');
}

function cartItemCount() {
  return cart.reduce(function (s, i) { return s + i.qty; }, 0);
}
