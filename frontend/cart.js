// Cart data structure example
// { services: [{id, name, price, qty}], addons: [{id, name, price, qty}] }
const CART_KEY = 'kicknklean_cart';

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  if (cart) return JSON.parse(cart);
  return { services: [], addons: [] };
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Clear cart completely
function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem('current_user_id');
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }
  // Force update cart modal if it's open
  if (document.getElementById('cartModalBody')) {
    renderCartModal();
  }
}

// Check if user is logged in
function isUserLoggedIn() {
  return !!localStorage.getItem('access');
}

// Get current user ID (you can modify this based on your user data structure)
function getCurrentUserId() {
  const token = localStorage.getItem('access');
  if (!token) return null;
  
  // You can decode the JWT token to get user info, or store user ID separately
  // For now, we'll use a simple approach - you can enhance this later
  return localStorage.getItem('current_user_id') || 'default_user';
}

// Set current user ID
function setCurrentUserId(userId) {
  localStorage.setItem('current_user_id', userId);
}

// Clear cart when user logs out
function handleUserLogout() {
  console.log('User logging out, clearing cart...');
  clearCart();
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }
  // Close cart modal if open
  closeCartModal();
}

// Clear cart when different user logs in
function handleUserLogin(userId) {
  console.log('User logging in:', userId);
  const currentUserId = getCurrentUserId();
  if (currentUserId && currentUserId !== userId) {
    console.log('Different user detected, clearing previous cart...');
    clearCart();
  }
  setCurrentUserId(userId);
}

// Check cart ownership on page load
function checkCartOwnership() {
  if (!isUserLoggedIn()) {
    console.log('User not logged in, clearing any existing cart...');
    clearCart();
  }
}

function renderCartModal() {
  const cart = getCart();
  let html = `<h2 style="text-align:center; font-weight:800; margin-bottom:18px;">Your Selection</h2>`;
  html += `<div style="margin-bottom:18px;">
    <div style="font-weight:700; margin-bottom:6px;">Booked Service/s</div>
    <table style="width:100%; font-size:1rem; margin-bottom:8px;">
      <thead><tr><th style='width:80px;'>QUANTITY</th><th>SERVICE</th><th style='text-align:right;'>PRICE</th></tr></thead><tbody>`;
  if (cart.services.length === 0) {
    html += `<tr><td colspan='3' style='text-align:center; color:#aaa;'>No services selected</td></tr>`;
  } else {
    cart.services.forEach((item, idx) => {
      html += `<tr>
        <td style='text-align:center;'>
          <div class='qty-controls'>
            <button class='cart-qty-btn' data-type='service' data-idx='${idx}' data-action='dec'>−</button>
          <span class='cart-qty'>${item.qty}</span>
          <button class='cart-qty-btn' data-type='service' data-idx='${idx}' data-action='inc'>+</button>
          </div>
        </td>
        <td>${item.name}</td>
        <td style='text-align:right;'>₱${item.price * item.qty}</td>
      </tr>`;
    });
  }
  html += `</tbody></table></div>`;

  html += `<hr style='margin:12px 0;' />`;
  html += `<div style="margin-bottom:18px;">
    <div style="font-weight:700; margin-bottom:6px;">Add-Ons & Essentials</div>
    <table style="width:100%; font-size:1rem; margin-bottom:8px;">
      <thead><tr><th style='width:80px;'>QUANTITY</th><th>SERVICE</th><th style='text-align:right;'>PRICE</th></tr></thead><tbody>`;
  if (cart.addons.length === 0) {
    html += `<tr><td colspan='3' style='text-align:center; color:#aaa;'>No add-ons selected</td></tr>`;
  } else {
    cart.addons.forEach((item, idx) => {
      html += `<tr>
        <td style='text-align:center;'>
          <div class='qty-controls'>
            <button class='cart-qty-btn' data-type='addon' data-idx='${idx}' data-action='dec'>−</button>
          <span class='cart-qty'>${item.qty}</span>
          <button class='cart-qty-btn' data-type='addon' data-idx='${idx}' data-action='inc'>+</button>
          </div>
        </td>
        <td>${item.name}</td>
        <td style='text-align:right;'>₱${item.price * item.qty}</td>
      </tr>`;
    });
  }
  html += `</tbody></table></div>`;

  const total = [...cart.services, ...cart.addons].reduce((sum, item) => sum + item.price * item.qty, 0);
  html += `<div style='display:flex; justify-content:space-between; font-weight:700; font-size:1.1rem; margin:18px 0 8px 0;'><span>TOTAL</span><span>₱${total}</span></div>`;
  html += `<button id='cartCheckoutBtn' style='width:100%; background:#232323; color:#fff; font-weight:700; border:none; border-radius:6px; padding:12px 0; font-size:1rem; margin-top:8px; cursor:pointer;'>CHECKOUT</button>`;

  document.getElementById('cartModalBody').innerHTML = html;

  // Add event listeners for quantity buttons
  document.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = btn.getAttribute('data-type');
      const idx = parseInt(btn.getAttribute('data-idx'));
      const action = btn.getAttribute('data-action');
      let cart = getCart();
      let arr = type === 'service' ? cart.services : cart.addons;
      
      if (action === 'inc') {
        arr[idx].qty++;
      } else if (action === 'dec') {
        if (arr[idx].qty > 1) {
          arr[idx].qty--;
        } else {
          // Remove item when quantity reaches 0
          arr.splice(idx, 1);
        }
      }
      
      saveCart(cart);
      renderCartModal();
      
      // Update cart badge if the function exists
      if (typeof updateCartBadge === 'function') {
        updateCartBadge();
      }
    });
  });
  
  // Add checkout button event
  document.getElementById('cartCheckoutBtn').onclick = function() {
    alert('Checkout not implemented.');
  };
}

function openCartModal() {
  if (!isUserLoggedIn()) {
    if (window.showToast) {
      window.showToast('Please log in first to view your cart!');
    } else {
      alert('Please log in first to view your cart!');
    }
    // Do NOT open login/register modal
    return;
  }
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  renderCartModal();
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Attach open/close listeners after modal is loaded
function setupCartModalListeners() {
  // Open modal on cart icon click
  document.querySelectorAll('.cart-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault();
      openCartModal();
    });
  });
  // Close modal on close button or overlay click
  document.body.addEventListener('click', function(e) {
    if (e.target.id === 'closeCartModal' || (e.target.id === 'cartModal' && e.target.classList.contains('modal-overlay'))) {
      closeCartModal();
    }
  });
}

// Wait for modal to be loaded
function waitForCartModalAndInit() {
  if (document.getElementById('cartModal')) {
    setupCartModalListeners();
    // Check cart ownership on page load
    checkCartOwnership();
  } else {
    setTimeout(waitForCartModalAndInit, 100);
  }
}
waitForCartModalAndInit();

// Example: Add to cart function (call this from your service/add-on buttons)
window.addToCart = function(type, item) {
  if (!isUserLoggedIn()) {
    if (window.showToast) window.showToast('Please log in to add items to cart.');
    return;
  }
  const cart = getCart();
  let arr = type === 'service' ? cart.services : cart.addons;
  const existing = arr.find(i => i.id === item.id);
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    arr.push({...item, qty: item.qty || 1});
  }
  saveCart(cart);
  openCartModal();
};

function showToast(message) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.position = 'fixed';
    toast.style.top = '80px'; // moved lower to avoid header icons
    toast.style.right = '32px';
    toast.style.zIndex = 9999;
    toast.style.background = '#232323';
    toast.style.color = '#fff';
    toast.style.padding = '14px 28px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = '700';
    toast.style.fontSize = '1.08rem';
    toast.style.boxShadow = '0 8px 32px 0 rgba(30,30,30,0.18), 0 2px 8px 0 rgba(0,0,0,0.12)';
    toast.style.opacity = 0;
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.transform = 'translateY(-30px)';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = 1;
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = 'translateY(-30px)';
  }, 1400);
}
window.showToast = showToast; 