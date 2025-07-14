// Show username in header if logged in
function showUserUIOnHeader() {
  const userInfo = document.getElementById("user-info");
  const token = localStorage.getItem("access");
  if (token) {
    fetch("http://127.0.0.1:8000/api/profile/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        userInfo.textContent = `Welcome, ${data.username}`;
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

// Make toast function globally available
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
  const userId = localStorage.getItem('current_user_id');
  
  console.log('Checking if user is logged in. Token:', token ? 'exists' : 'not found');
  console.log('User ID:', userId);
  
  // If no access token, clear any invalid user data
  if (!token) {
    localStorage.removeItem('current_user_id');
    localStorage.removeItem('cached_username');
    console.log('Cleared invalid user data');
  }
  
  return !!token;
}

// Login form is handled by account.js - no need to duplicate here

// Note: menuIcon and userIcon event listeners are handled in menu.js and account.js
// No need to duplicate them here to avoid conflicts

// --- Cart Badge and Toast Notification ---
// Cart functionality is now handled by shared-cart.js
// These functions are provided by the shared cart system

// The shared-cart.js already handles addToCart functionality
// No need to patch it here since shared-cart.js provides the complete implementation

// Cart data management is now handled by shared-cart.js
// No need for separate cart functions here

// Fetch and render services dynamically
async function fetchAndRenderServices() {
  try {
    console.log('=== TESTING API CONNECTION ===');
    console.log('Fetching services from API...');
    
    // Test the API endpoint
    const testResponse = await fetch('http://127.0.0.1:8000/api/services/');
    console.log('Response status:', testResponse.status);
    console.log('Response ok:', testResponse.ok);
    
    if (!testResponse.ok) {
      throw new Error(`Failed to fetch services: ${testResponse.status} ${testResponse.statusText}`);
    }
    
    const services = await testResponse.json();
    console.log('Services loaded:', services);
    console.log('Number of services:', services.length);
    
    if (services.length === 0) {
      console.warn('⚠️ No services found in database!');
    }
    
    const servicesList = document.querySelector('.services-list');
    if (!servicesList) {
      console.error('❌ Services list element not found!');
      return;
    }
    
    // Clear existing service rows
    servicesList.innerHTML = '';
    console.log('Cleared existing services');
    
    // Create service rows dynamically
    services.forEach((service, index) => {
      console.log(`Creating service row ${index + 1}:`, service);
      const serviceRow = document.createElement('div');
      serviceRow.className = 'service-row';
      
      // Determine icon based on service name
      let iconSrc = './images/basic.png'; // default
      if (service.name.toLowerCase().includes('deep')) {
        iconSrc = './images/deep.png';
      } else if (service.name.toLowerCase().includes('suede') || service.name.toLowerCase().includes('nubuck')) {
        iconSrc = './images/suedenubuck.png';
      } else if (service.name.toLowerCase().includes('premium') && service.name.toLowerCase().includes('essential')) {
        iconSrc = './images/premium_essential.png';
      } else if (service.name.toLowerCase().includes('premium') && (service.name.toLowerCase().includes('suede') || service.name.toLowerCase().includes('nubuck'))) {
        iconSrc = './images/premium_sn.png';
      }
      
      serviceRow.innerHTML = `
        <div class="service-icon">
          <img src="${iconSrc}" alt="${service.name}" />
        </div>
        <div class="service-info">
          <h3 class="service-title">${service.name.toUpperCase()}</h3>
          <p class="service-desc">${service.description}</p>
        </div>
        <button class="add-cart-btn" 
          data-service-id="${service.id}" 
          data-service-name="${service.name}" 
          data-service-price="${service.price}">
          ADD TO KLEAN CART
        </button>
      `;
      
      servicesList.appendChild(serviceRow);
      console.log(`✅ Service row ${index + 1} added with data:`, {
          id: service.id,
          name: service.name,
        price: service.price
      });
    });
    
    // Add divider after first 3 services (if there are more than 3)
    if (services.length > 3) {
      const divider = document.createElement('hr');
      divider.className = 'service-divider';
      servicesList.appendChild(divider);
    }
    
    console.log(`✅ Successfully rendered ${services.length} services`);
    console.log('=== END SERVICES TEST ===');
    
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    console.error('Full error details:', error.message);
  }
}

// Fetch and render add-ons dynamically
async function fetchAndRenderAddons() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/addons/');
    if (!response.ok) {
      throw new Error('Failed to fetch add-ons');
    }
    const addons = await response.json();
    console.log('Add-ons loaded:', addons);
    
    const addonsList = document.querySelector('.addons-list');
    if (!addonsList) return;
    
    // Clear existing add-ons
    addonsList.innerHTML = '';
    
    // Create add-ons dynamically
    addons.forEach(addon => {
      const addonItem = document.createElement('li');
      addonItem.innerHTML = `
        <span class="bullet-title"><span class="bullet">•</span> <b>${addon.name.toUpperCase()}</b></span><br />
        ${addon.description}
        <button class="add-btn" 
          data-addon-id="${addon.id}" 
          data-addon-name="${addon.name}" 
          data-addon-price="${addon.price}">
          ADD
        </button>
      `;
      addonsList.appendChild(addonItem);
    });
    
  } catch (error) {
    console.error('Error fetching add-ons:', error);
  }
}

// Fetch and render essentials dynamically (using bundles data)
async function fetchAndRenderEssentials() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/bundles/');
    if (!response.ok) {
      throw new Error('Failed to fetch bundles');
    }
    const bundles = await response.json();
    console.log('Bundles loaded:', bundles);
    
    const essentialsList = document.querySelector('.essentials-list');
    if (!essentialsList) return;
    
    // Clear existing essentials
    essentialsList.innerHTML = '';
    
    // Create essentials dynamically from bundles
    bundles.forEach(bundle => {
      const essentialItem = document.createElement('li');
      essentialItem.innerHTML = `
        <span class="bullet-title"><span class="bullet">•</span> <b>${bundle.name.toUpperCase()}</b></span><br />
        ${bundle.description}
        <button class="add-btn" 
          data-bundle-id="${bundle.id}" 
          data-bundle-name="${bundle.name}" 
          data-bundle-price="${bundle.price}">
          ADD
        </button>
      `;
      essentialsList.appendChild(essentialItem);
    });
    
  } catch (error) {
    console.error('Error fetching bundles:', error);
  }
}

// Initialize cart functionality with dynamic data
function initializeCartButtons() {
  console.log('Initializing cart buttons...');
  
  // Add event listeners to service buttons
  document.addEventListener('click', function(e) {
    console.log('Click detected on:', e.target);
    
    if (e.target.classList.contains('add-cart-btn')) {
      console.log('Service button clicked!');
      
      // Check if user is logged in
      if (!isUserLoggedIn()) {
        console.log('User not logged in, showing login prompt');
        console.log('showToast function exists:', typeof window.showToast);
        if (window.showToast) {
          window.showToast('Please log in to add items to cart.');
        } else {
          console.error('showToast function not found!');
          alert('Please log in to add items to cart.');
        }
        return;
      }
      
      const serviceId = e.target.getAttribute('data-service-id');
      const serviceName = e.target.getAttribute('data-service-name');
      const servicePrice = parseFloat(e.target.getAttribute('data-service-price'));
      
      console.log('Service data:', { serviceId, serviceName, servicePrice });
      
      if (serviceId && serviceName && servicePrice) {
        const serviceData = {
          id: serviceId,
          name: serviceName,
          price: servicePrice,
          description: e.target.closest('.service-row').querySelector('.service-desc').textContent
        };
        
        console.log('Adding service to cart:', serviceData);
        
        if (typeof window.addToCart === 'function') {
          window.addToCart('service', serviceData);
        } else {
          console.error('addToCart function not found! Shared cart system not loaded.');
        }
      } else {
        console.error('Missing service data:', { serviceId, serviceName, servicePrice });
      }
    }
    
    if (e.target.classList.contains('add-btn')) {
      console.log('Add-on/Essential button clicked!');
      
      // Check if user is logged in
      if (!isUserLoggedIn()) {
        console.log('User not logged in, showing login prompt');
        console.log('showToast function exists:', typeof window.showToast);
        if (window.showToast) {
          window.showToast('Please log in to add items to cart.');
        } else {
          console.error('showToast function not found!');
          alert('Please log in to add items to cart.');
        }
        return;
      }
      
      const addonId = e.target.getAttribute('data-addon-id');
      const addonName = e.target.getAttribute('data-addon-name');
      const addonPrice = parseFloat(e.target.getAttribute('data-addon-price'));
      
      const bundleId = e.target.getAttribute('data-bundle-id');
      const bundleName = e.target.getAttribute('data-bundle-name');
      const bundlePrice = parseFloat(e.target.getAttribute('data-bundle-price'));
      
      console.log('Add-on/Bundle data:', { addonId, addonName, addonPrice, bundleId, bundleName, bundlePrice });
      
      if (addonId && addonName && addonPrice) {
        const addonData = {
          id: addonId,
          name: addonName,
          price: addonPrice,
          description: e.target.parentElement.textContent.replace(e.target.textContent, '').trim()
        };
        
        console.log('Adding add-on to cart:', addonData);
        
        if (typeof window.addToCart === 'function') {
          window.addToCart('addon', addonData);
        } else {
          console.error('addToCart function not found! Shared cart system not loaded.');
        }
      } else if (bundleId && bundleName && bundlePrice) {
        const bundleData = {
          id: bundleId,
          name: bundleName,
          price: bundlePrice,
          description: e.target.parentElement.textContent.replace(e.target.textContent, '').trim()
        };
        
        console.log('Adding bundle to cart:', bundleData);
        
        if (typeof window.addToCart === 'function') {
          window.addToCart('addon', bundleData);
        } else {
          console.error('addToCart function not found! Shared cart system not loaded.');
        }
      } else {
        console.error('Missing add-on/bundle data');
      }
    }
  });
  
  console.log('Cart buttons initialized');
}

// Add login/logout handlers
function setupLoginLogoutHandlers() {
  // Listen for login events (you can trigger this from your login success)
  window.handleUserLogin = function(userId) {
    console.log('Services page: User login handler called with userId:', userId);
    // Update cart badge if available
    if (typeof window.updateCartBadge === 'function') {
      window.updateCartBadge();
    }
  };
  
  // Listen for logout events (you can trigger this from your logout)
  window.handleUserLogout = function() {
    console.log('Services page: User logout handler called');
    // Clear cart badge if available
    if (typeof window.updateCartBadge === 'function') {
      window.updateCartBadge();
    }
  };
}

// Initialize everything
async function initializeServicesPage() {
  // Setup login/logout handlers
  setupLoginLogoutHandlers();
  
  // Fetch and render all data
  await Promise.all([
    fetchAndRenderServices(),
    fetchAndRenderAddons(),
    fetchAndRenderEssentials()
  ]);
  
  // Initialize cart buttons
  initializeCartButtons();
}

// On page load
window.addEventListener('DOMContentLoaded', initializeServicesPage);