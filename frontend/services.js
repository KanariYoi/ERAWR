// IMPORTANT: Make sure <script src="shared-cart.js"></script> is loaded BEFORE this script in your HTML!

// Helper: fetch with Authorization header if logged in
function authFetch(url, options = {}) {
  const token = localStorage.getItem('access');
  if (token) {
    options.headers = {
      ...(options.headers || {}),
      'Authorization': 'Bearer ' + token,
    };
  }
  return fetch(url, options);
}

// Show username in header if logged in
function showUserUIOnHeader() {
  const userInfo = document.getElementById("user-info");
  const token = localStorage.getItem("access");
  if (token) {
    fetch(`${window.API_BASE_URL}/api/profile/`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        userInfo.textContent = `Welcome, ${data.username}`;
      })
      .catch((err) => {
        console.error('Failed to fetch user profile:', err);
        userInfo.textContent = "";
      });
  } else {
    userInfo.textContent = "";
  }
}
showUserUIOnHeader();

// Toast notification function
function showToast(message, duration = 3000) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #232323;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.style.transform = 'translateX(0)', 10);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}
window.showToast = showToast;

// Clear all user data (for debugging)
function clearUserData() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('current_user_id');
  localStorage.removeItem('cached_username');
  console.log('All user data cleared');
}

// Check if user is logged in
function isUserLoggedIn() {
  const token = localStorage.getItem('access');
  if (!token) {
    localStorage.removeItem('current_user_id');
    localStorage.removeItem('cached_username');
    return false;
  }
  return true;
}

// Fetch and render services dynamically
async function fetchAndRenderServices() {
  try {
    const response = await authFetch(`${window.API_BASE_URL}/api/services/`);
    if (!response.ok) throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
    const services = await response.json();
    const servicesList = document.querySelector('.services-list');
    if (!servicesList) {
      console.error('❌ Services list element not found!');
      return;
    }
    servicesList.innerHTML = '';
    services.forEach((service, index) => {
      let iconSrc = './images/basic.png';
      const name = service.name ? service.name.toLowerCase() : '';
      if (name.includes('deep')) iconSrc = './images/deep.png';
      else if (name.includes('suede') || name.includes('nubuck')) iconSrc = './images/suedenubuck.png';
      else if (name.includes('premium') && name.includes('essential')) iconSrc = './images/premium_essential.png';
      else if (name.includes('premium') && (name.includes('suede') || name.includes('nubuck'))) iconSrc = './images/premium_sn.png';
      const serviceRow = document.createElement('div');
      serviceRow.className = 'service-row';
      serviceRow.innerHTML = `
        <div class="service-icon">
          <img src="${iconSrc}" alt="${service.name || ''}" />
        </div>
        <div class="service-info">
          <h3 class="service-title">${service.name ? service.name.toUpperCase() : ''}</h3>
          <p class="service-desc">${service.description || ''}</p>
        </div>
        <button class="add-cart-btn" 
          data-service-id="${service.id ?? ''}" 
          data-service-name="${service.name ?? ''}" 
          data-service-price="${service.price ?? ''}">
          ADD TO KLEAN CART
        </button>
      `;
      servicesList.appendChild(serviceRow);
      if (index === 2 && services.length > 3) {
        const divider = document.createElement('hr');
        divider.className = 'service-divider';
        servicesList.appendChild(divider);
      }
    });
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    if (window.showToast) window.showToast('Failed to load services. Please try again later.');
  }
}

// Fetch and render add-ons dynamically
async function fetchAndRenderAddons() {
  try {
    const response = await authFetch(`${window.API_BASE_URL}/api/addons/`);
    if (!response.ok) throw new Error('Failed to fetch add-ons');
    const addons = await response.json();
    const addonsList = document.querySelector('.addons-list');
    if (!addonsList) return;
    addonsList.innerHTML = '';
    addons.forEach(addon => {
      const addonItem = document.createElement('li');
      addonItem.innerHTML = `
        <span class="bullet-title"><span class="bullet">•</span> <b>${addon.name ? addon.name.toUpperCase() : ''}</b></span><br />
        ${addon.description || ''}
        <button class="add-btn" 
          data-addon-id="${addon.id ?? ''}" 
          data-addon-name="${addon.name ?? ''}" 
          data-addon-price="${addon.price ?? ''}">
          ADD
        </button>
      `;
      addonsList.appendChild(addonItem);
    });
  } catch (error) {
    console.error('Error fetching add-ons:', error);
    if (window.showToast) window.showToast('Failed to load add-ons. Please try again later.');
  }
}

// Fetch and render essentials dynamically (using bundles data)
async function fetchAndRenderEssentials() {
  try {
    const response = await authFetch(`${window.API_BASE_URL}/api/bundles/`);
    if (!response.ok) throw new Error('Failed to fetch bundles');
    const bundles = await response.json();
    const essentialsList = document.querySelector('.essentials-list');
    if (!essentialsList) return;
    essentialsList.innerHTML = '';
    bundles.forEach(bundle => {
      const essentialItem = document.createElement('li');
      essentialItem.innerHTML = `
        <span class="bullet-title"><span class="bullet">•</span> <b>${bundle.name ? bundle.name.toUpperCase() : ''}</b></span><br />
        ${bundle.description || ''}
        <button class="add-btn" 
          data-bundle-id="${bundle.id ?? ''}" 
          data-bundle-name="${bundle.name ?? ''}" 
          data-bundle-price="${bundle.price ?? ''}">
          ADD
        </button>
      `;
      essentialsList.appendChild(essentialItem);
    });
  } catch (error) {
    console.error('Error fetching bundles:', error);
    if (window.showToast) window.showToast('Failed to load essentials. Please try again later.');
  }
}

// Unified event delegation for cart/add actions
function initializeCartButtons() {
  document.addEventListener('click', function(e) {
    // Service add-to-cart
    if (e.target.classList.contains('add-cart-btn')) {
      if (!isUserLoggedIn()) {
        if (window.showToast) window.showToast('Please log in to add items to cart.');
        else alert('Please log in to add items to cart.');
        return;
      }
      const serviceId = e.target.getAttribute('data-service-id');
      const serviceName = e.target.getAttribute('data-service-name');
      const servicePrice = parseFloat(e.target.getAttribute('data-service-price'));
      const descElem = e.target.closest('.service-row')?.querySelector('.service-desc');
      if (serviceId && serviceName && !isNaN(servicePrice)) {
        const serviceData = {
          id: serviceId,
          name: serviceName,
          price: servicePrice,
          description: descElem ? descElem.textContent : ''
        };
        if (typeof window.addToCart === 'function') {
          window.addToCart('service', serviceData);
          showToast('Added to cart!', 1500);
        } else {
          console.error('addToCart function not found! Shared cart system not loaded.');
          if (window.showToast) window.showToast('Cart system not loaded. Please refresh.');
        }
      } else {
        console.error('Missing or invalid service data:', { serviceId, serviceName, servicePrice });
        if (window.showToast) window.showToast('Service data missing. Please try again.');
      }
    }
    // Add-on/Essential add-to-cart
    if (e.target.classList.contains('add-btn')) {
      if (!isUserLoggedIn()) {
        if (window.showToast) window.showToast('Please log in to add items to cart.');
        else alert('Please log in to add items to cart.');
        return;
      }
      // Add-on
      const addonId = e.target.getAttribute('data-addon-id');
      const addonName = e.target.getAttribute('data-addon-name');
      const addonPrice = parseFloat(e.target.getAttribute('data-addon-price'));
      // Bundle/Essential
      const bundleId = e.target.getAttribute('data-bundle-id');
      const bundleName = e.target.getAttribute('data-bundle-name');
      const bundlePrice = parseFloat(e.target.getAttribute('data-bundle-price'));
      if (addonId && addonName && !isNaN(addonPrice)) {
        const addonData = {
          id: addonId,
          name: addonName,
          price: addonPrice,
          description: e.target.parentElement.textContent.replace(e.target.textContent, '').trim()
        };
        if (typeof window.addToCart === 'function') {
          window.addToCart('addon', addonData);
          showToast('Added to cart!', 1500);
        } else {
          console.error('addToCart function not found! Shared cart system not loaded.');
          if (window.showToast) window.showToast('Cart system not loaded. Please refresh.');
        }
      } else if (bundleId && bundleName && !isNaN(bundlePrice)) {
        const bundleData = {
          id: bundleId,
          name: bundleName,
          price: bundlePrice,
          description: e.target.parentElement.textContent.replace(e.target.textContent, '').trim()
        };
        if (typeof window.addToCart === 'function') {
          window.addToCart('addon', bundleData);
          showToast('Added to cart!', 1500);
        } else {
          console.error('addToCart function not found! Shared cart system not loaded.');
          if (window.showToast) window.showToast('Cart system not loaded. Please refresh.');
        }
      } else {
        console.error('Missing add-on/bundle data', { addonId, addonName, addonPrice, bundleId, bundleName, bundlePrice });
        if (window.showToast) window.showToast('Add-on/Essential data missing. Please try again.');
      }
    }
  });
}

// Add login/logout handlers
function setupLoginLogoutHandlers() {
  window.handleUserLogin = function(userId) {
    if (typeof window.updateCartBadge === 'function') {
      window.updateCartBadge();
    }
  };
  window.handleUserLogout = function() {
    if (typeof window.updateCartBadge === 'function') {
      window.updateCartBadge();
    }
  };
}

// Initialize everything
async function initializeServicesPage() {
  setupLoginLogoutHandlers();
  await Promise.all([
    fetchAndRenderServices(),
    fetchAndRenderAddons(),
    fetchAndRenderEssentials()
  ]);
  initializeCartButtons();
}

window.addEventListener('DOMContentLoaded', initializeServicesPage);
