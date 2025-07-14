// FAQ fade-in on load
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.faq-item').forEach((item, i) => {
    setTimeout(() => item.classList.add('faq-fade-in'), 100 + i * 80);
  });
});

// FAQ toggle logic with fade+slide animation
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(q => {
  q.addEventListener('click', function() {
    const item = this.closest('.faq-item');
    const answer = this.nextElementSibling;
    const isOpen = item.classList.contains('open');
    if (isOpen) {
      // Hide with animation
      answer.style.opacity = 0;
      answer.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        item.classList.remove('open');
        answer.style.display = 'none';
      }, 320);
    } else {
      answer.style.display = 'block';
      // Force reflow for transition
      void answer.offsetWidth;
      item.classList.add('open');
      answer.style.opacity = 1;
      answer.style.transform = 'translateY(0)';
    }
    // Toggle icon
    this.querySelector('.faq-toggle').textContent = !isOpen ? '-' : '+';
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

// User icon click
document.getElementById('user-icon').addEventListener('click', function(e) {
  e.preventDefault();
  const token = localStorage.getItem('access');
  if (token) {
    window.location.href = 'profile.html';
  } else {
    document.getElementById('accountModal').style.display = 'flex';
    document.body.classList.add('modal-blur');
    document.documentElement.classList.add('modal-blur');
  }
});

// Menu icon click
document.getElementById('menu-icon').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('sideMenu').classList.toggle('open');
  document.getElementById('sideMenuOverlay').classList.toggle('open');
}); 