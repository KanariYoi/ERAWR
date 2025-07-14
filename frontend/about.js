// About page fade-in on load
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.about-desc > *').forEach((el, i) => {
    setTimeout(() => el.classList.add('fade-in'), 100 + i * 80);
  });
});

// Show username in header if logged in
function showUserUIOnHeader() {
  const userInfo = document.getElementById('user-info');
  const token = localStorage.getItem('access');
  if (token) {
    fetch('http://127.0.0.1:8000/api/profile/', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
      userInfo.textContent = `Welcome, ${data.username}`;
    });
  } else {
    userInfo.textContent = '';
  }
}

showUserUIOnHeader(); 