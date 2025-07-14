// Shared cart functionality for all pages
// This file should be included on all pages (Main.html, faqs.html, about.html, etc.)

// Get current user ID (for cart key)
function getCurrentUserId() {
  // You should set this in localStorage on login, e.g. localStorage.setItem('current_user_id', userId)
  return localStorage.getItem('current_user_id');
}

// Get user-specific cart key
function getCartKey() {
  const userId = getCurrentUserId();
  return userId ? `kicknklean_cart_${userId}` : null;
}

// Get cart for current user
function getCart() {
  const key = getCartKey();
  if (!key) return { services: [], addons: [] };
  const cart = localStorage.getItem(key);
  if (cart) return JSON.parse(cart);
  return { services: [], addons: [] };
}

// Save cart for current user
function saveCart(cart) {
  const key = getCartKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(cart));
  updateCartBadge();
}

// Remove cart for current user
function clearCart() {
  const key = getCartKey();
  if (key) localStorage.removeItem(key);
  updateCartBadge();
}

// Update cart badge (only show if logged in and cart has items)
function updateCartBadge(animated = false) {
  let cartIcon = document.querySelector('.cart-icon');
  if (!cartIcon) return;
  
  let badge = cartIcon.querySelector('.cart-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cart-badge';
    cartIcon.appendChild(badge);
  }
  
  if (!isUserLoggedIn()) {
    badge.style.display = 'none';
    return;
  }
  
  const cart = getCart();
  const count = [...cart.services, ...cart.addons].reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count > 0 ? count : '';
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
  
  if (animated && count > 0) {
    badge.classList.remove('cart-badge-animate');
    void badge.offsetWidth;
    badge.classList.add('cart-badge-animate');
  }
}

// Check if user is logged in
function isUserLoggedIn() {
  const hasAccess = !!localStorage.getItem('access');
  const hasUserId = !!getCurrentUserId();
  
  console.log('Cart Debug - isUserLoggedIn:', {
    hasAccess,
    hasUserId,
    accessToken: localStorage.getItem('access') ? 'Present' : 'Missing',
    userId: getCurrentUserId()
  });
  
  if (hasAccess) {
    // If we have access token but no user ID, set a fallback user ID
    if (!hasUserId) {
      const fallbackUserId = 'user_' + Date.now();
      localStorage.setItem('current_user_id', fallbackUserId);
      console.log('Cart Debug - Set fallback user ID:', fallbackUserId);
    }
    return true;
  }
  
  return false;
}

// Show toast notification
function showToast(message) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.position = 'fixed';
    toast.style.top = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translate(-50%, -30px)';
    toast.style.maxWidth = '320px';
    toast.style.width = 'max-content';
    toast.style.right = '';
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
    toast.style.pointerEvents = 'none';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = 1;
  toast.style.transform = 'translate(-50%, 0)';
  toast.style.pointerEvents = 'auto';
  toast.style.zIndex = 9999;
  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = 'translate(-50%, -30px)';
    toast.style.pointerEvents = 'none';
    toast.style.zIndex = '';
  }, 1400);
}

// Render cart modal content
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

  const cartModalBody = document.getElementById('cartModalBody');
  if (cartModalBody) {
    cartModalBody.innerHTML = html;

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
        updateCartBadge(true);
      });
    });
    
    // Add checkout button event
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.onclick = function() {
        // Close cart modal
        closeCartModal();
        // Open checkout modal
        openCheckoutModal();
      };
    }
  }
}

// Open cart modal
function openCartModal() {
  console.log('Cart Debug - openCartModal called');
  console.log('Cart Debug - isUserLoggedIn:', isUserLoggedIn());
  
  if (!isUserLoggedIn()) {
    console.log('Cart Debug - User not logged in, showing toast');
    showToast('Please log in first to view your cart!');
    return;
  }
  
  console.log('Cart Debug - User is logged in, opening modal');
  const modal = document.getElementById('cartModal');
  if (!modal) {
    console.log('Cart Debug - Cart modal not found');
    return;
  }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  renderCartModal();
}

// Close cart modal
function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Override cart icon click behavior
function setupCartIconListeners() {
  document.querySelectorAll('.cart-icon').forEach(icon => {
    // Remove existing listeners to avoid duplicates
    icon.removeEventListener('click', handleCartIconClick);
    icon.addEventListener('click', handleCartIconClick);
  });
}

function handleCartIconClick(e) {
  e.preventDefault();
  if (!isUserLoggedIn()) {
    showToast('Please log in first to view your cart!');
    return;
  }
  openCartModal();
}

// Setup cart modal listeners
function setupCartModalListeners() {
  // Close modal on close button or overlay click
  document.body.addEventListener('click', function(e) {
    if (e.target.id === 'closeCartModal' || (e.target.id === 'cartModal' && e.target.classList.contains('modal-overlay'))) {
      closeCartModal();
    }
  });
}

// Add to cart function (call this from your service/add-on buttons)
window.addToCart = function(type, item) {
  console.log('Cart Debug - addToCart called:', { type, item });
  console.log('Cart Debug - isUserLoggedIn:', isUserLoggedIn());
  
  if (!isUserLoggedIn()) {
    console.log('Cart Debug - User not logged in, showing toast');
    showToast('Please log in to add items to cart.');
    return;
  }
  
  console.log('Cart Debug - User is logged in, adding to cart');
  const cart = getCart();
  let arr = type === 'service' ? cart.services : cart.addons;
  const existing = arr.find(i => i.id === item.id);
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    arr.push({...item, qty: item.qty || 1});
  }
  saveCart(cart);
  updateCartBadge(true);
  openCartModal();
};

// Call this on login with the userId
function handleUserLogin(userId) {
  localStorage.setItem('current_user_id', userId);
  updateCartBadge();
}

// Call this on logout
function handleUserLogout() {
  localStorage.removeItem('current_user_id');
  clearCart();
  updateCartBadge();
}

// Initialize cart system
function initializeCart() {
  // Load cart modal if not already present
  if (!document.getElementById('cartModal')) {
    fetch('cart-modal.html')
      .then(res => res.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        setupCartModalListeners();
      })
      .catch(err => {
        console.error('Failed to load cart modal:', err);
      });
  } else {
    setupCartModalListeners();
  }
  
  setupCartIconListeners();
  updateCartBadge();
  
  // If user is logged in but no user ID is set, set one
  if (isUserLoggedIn() && !getCurrentUserId()) {
    const fallbackUserId = 'user_' + Date.now();
    localStorage.setItem('current_user_id', fallbackUserId);
  }
  
  if (!isUserLoggedIn()) {
    clearCart();
    updateCartBadge();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeCart();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCart);
} else {
  initializeCart();
}

// Open checkout modal
function openCheckoutModal() {
  // Load modal if not present
  if (!document.getElementById('checkoutModal')) {
    fetch('checkout-modal.html')
      .then(res => res.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        setupCheckoutModalListeners();
        renderCheckoutOrderSummary();
        autofillCheckoutForm();
        showCheckoutModal();
      });
  } else {
    renderCheckoutOrderSummary();
    autofillCheckoutForm();
    showCheckoutModal();
  }
}

function showCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Fill order summary in checkout modal
function renderCheckoutOrderSummary() {
  const cart = getCart();
  const summaryDiv = document.getElementById('checkoutOrderSummary');
  if (!summaryDiv) return;
  let html = '';
  // Services
  cart.services.forEach(item => {
    html += `<div class='summary-row'><span>${item.name} x ${item.qty}</span><span>₱${item.price * item.qty}</span></div>`;
  });
  // Add-ons
  if (cart.addons.length > 0) {
    html += `<div class='summary-addons'>Add-ons</div>`;
    cart.addons.forEach(item => {
      html += `<div class='summary-row'><span>${item.name} x ${item.qty}</span><span>₱${item.price * item.qty}</span></div>`;
    });
  }
  // Total
  const total = [...cart.services, ...cart.addons].reduce((sum, item) => sum + item.price * item.qty, 0);
  html += `<div class='summary-total'><span>Total</span><span>₱${total}</span></div>`;
  summaryDiv.innerHTML = html;
}

// Autofill checkout form with user data
function autofillCheckoutForm() {
  const token = localStorage.getItem('access');
  if (!token) return;
  
  fetch(`${window.API_BASE_URL}/api/profile/`, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(data => {
    // Fill first name and last name
    const firstNameInput = document.getElementById('checkoutFirstName');
    const lastNameInput = document.getElementById('checkoutLastName');
    const emailInput = document.getElementById('checkoutEmail');
    
    if (firstNameInput && data.first_name) {
      firstNameInput.value = data.first_name;
    }
    if (lastNameInput && data.last_name) {
      lastNameInput.value = data.last_name;
    }
    if (emailInput && data.email) {
      emailInput.value = data.email;
    }
  })
  .catch(err => {
    console.error('Failed to autofill checkout form:', err);
  });
}

// Handle order confirmation
function handleOrderConfirmation() {
  const token = localStorage.getItem('access');
  if (!token) {
    showToast('Please log in to place an order.');
    return;
  }
  
  // Get form data
  const firstName = document.getElementById('checkoutFirstName').value;
  const lastName = document.getElementById('checkoutLastName').value;
  const email = document.getElementById('checkoutEmail').value;
  const paymentMethod = document.querySelector('input[name="checkoutPayment"]:checked').value;
  const dropoffDate = document.getElementById('checkoutDate').value;
  const dropoffTime = document.getElementById('checkoutTime').value;
  
  // Validate required fields
  if (!firstName || !lastName || !email || !dropoffDate || !dropoffTime) {
    showToast('Please fill in all required fields.');
    return;
  }
  
  // Get cart data
  const cart = getCart();
  if (cart.services.length === 0 && cart.addons.length === 0) {
    showToast('Your cart is empty.');
    return;
  }
  
  // Create order summary
  let orderSummary = '';
  let total = 0;
  
  // Add services
  cart.services.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    orderSummary += `${item.name} x ${item.qty} - ₱${itemTotal}\n`;
  });
  
  // Add add-ons
  if (cart.addons.length > 0) {
    orderSummary += '\nAdd-ons:\n';
    cart.addons.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      orderSummary += `${item.name} x ${item.qty} - ₱${itemTotal}\n`;
    });
  }
  
  orderSummary += `\nTotal: ₱${total}`;
  
  // Prepare order data
  const orderData = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    payment_method: paymentMethod,
    dropoff_date: dropoffDate,
    dropoff_time: dropoffTime,
    order_summary: orderSummary,
    total_amount: total
  };
  
  // Submit order
  fetch(`${window.API_BASE_URL}/api/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(orderData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      showOrderSuccessModal();
      clearCart();
      // closeCheckoutModal(); // Don't close immediately, let user close success modal
    } else {
      showToast('Failed to place order: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(err => {
    console.error('Order submission error:', err);
    showToast('Failed to place order. Please try again.');
  });
}

// Attach close modal on overlay click
function setupCheckoutModalListeners() {
  document.body.addEventListener('click', function(e) {
    if (e.target.id === 'closeCheckoutModal' || (e.target.id === 'checkoutModal' && e.target.classList.contains('modal-overlay'))) {
      closeCheckoutModal();
    }
    if (e.target.id === 'checkoutConfirmBtn') {
      e.preventDefault(); // Prevent form submission or page reload
      handleOrderConfirmation();
    }
  });
  
  // Set minimum date to today
  const dateInput = document.getElementById('checkoutDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
  
  // Add validation for date and time
  const timeSelect = document.getElementById('checkoutTime');
  if (timeSelect) {
    timeSelect.addEventListener('change', function() {
      const selectedTime = this.value;
      const selectedDate = dateInput ? dateInput.value : '';
      
      if (selectedTime && selectedDate) {
        console.log('Selected date/time:', selectedDate, selectedTime);
      }
    });
  }
}

// Export functions to global scope
window.showToast = showToast;
window.isUserLoggedIn = isUserLoggedIn;
window.updateCartBadge = updateCartBadge;
window.getCart = getCart;
window.saveCart = saveCart;
window.clearCart = clearCart;
window.getCartKey = getCartKey;
window.getCurrentUserId = getCurrentUserId;
window.handleUserLogin = handleUserLogin;
window.handleUserLogout = handleUserLogout;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.renderCartModal = renderCartModal;
window.addToCart = addToCart; 
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.renderCheckoutOrderSummary = renderCheckoutOrderSummary;
window.autofillCheckoutForm = autofillCheckoutForm;
window.handleOrderConfirmation = handleOrderConfirmation;
window.setupCheckoutModalListeners = setupCheckoutModalListeners; 

function showOrderSuccessModal() {
  const modal = document.getElementById('orderSuccessModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('closeOrderSuccessModal');
    if (closeBtn) {
      closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      };
    }
  }
}
window.showOrderSuccessModal = showOrderSuccessModal; 
