// ─────────────────────────────────────────────
//  components/Toast.js
//  Bottom cart-added notification toast
// ─────────────────────────────────────────────

var toastTimer = null;

function showToast() {
  var toast = document.getElementById('cart-toast');
  if (!toast) return;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4000);
}

function hideToast() {
  var toast = document.getElementById('cart-toast');
  if (toast) toast.classList.remove('show');
}
