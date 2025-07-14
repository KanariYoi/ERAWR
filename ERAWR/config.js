// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://127.0.0.1:8000' 
  : 'https://your-backend-url.railway.app'; // Replace with your actual backend URL

// Export for use in other files
window.API_BASE_URL = API_BASE_URL; 