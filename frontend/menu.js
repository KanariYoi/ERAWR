document.addEventListener('DOMContentLoaded', function () {
  const menuIcon = document.querySelector('.menu-icon');
  const sideMenu = document.getElementById('sideMenu');
  const sideMenuOverlay = document.getElementById('sideMenuOverlay');
  const header = document.querySelector('header');
  const headerSpacer = document.querySelector('.header-spacer');

  // Hide menu by default
  sideMenu.classList.remove('open');
  sideMenuOverlay.classList.remove('open');

  function isLoggedIn() {
    const token = localStorage.getItem('access');
    const userInfo = document.getElementById('user-info');
    return !!token && userInfo && userInfo.textContent.trim() !== '';
  }



  menuIcon.addEventListener('click', function (event) {
    event.preventDefault();
    const isOpen = sideMenu.classList.contains('open');
    if (isOpen) {
      sideMenu.classList.remove('open');
      sideMenuOverlay.classList.remove('open');
      header.classList.remove('dimmed');
      if (headerSpacer) headerSpacer.classList.remove('hide-when-menu');
    } else {
      sideMenu.classList.add('open');
      sideMenuOverlay.classList.add('open');
      header.classList.add('dimmed');
      if (headerSpacer) headerSpacer.classList.add('hide-when-menu');
    }
  });
  sideMenuOverlay.addEventListener('click', function () {
    sideMenu.classList.remove('open');
    sideMenuOverlay.classList.remove('open');
    header.classList.remove('dimmed');
    if (headerSpacer) headerSpacer.classList.remove('hide-when-menu');
  });



  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('header-transparent');
    } else {
      header.classList.remove('header-transparent');
    }
  });



  // Modal 
  const userIcon = document.querySelector('.user-icon');
  const accountModal = document.getElementById('accountModal');
  const closeAccountModal = document.getElementById('closeAccountModal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const passwordInput = document.getElementById('modal-password');
  const passwordToggle = document.querySelector('.modal-password-toggle');
  const showLoginModal = document.getElementById('showLoginModal');
  const loginModal = document.getElementById('loginModal');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const showRegisterModal = document.getElementById('showRegisterModal');

  function openModal() {
    // Close any other modals first
    if (loginModal) loginModal.style.display = 'none';
    if (editUserModal) editUserModal.style.display = 'none';
    
    accountModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-blur');
    document.documentElement.classList.add('modal-blur');
    accountModal.classList.add('modal-fade-in');
    accountModal.querySelector('.modal-content').classList.add('modal-fade-in');
  }
  function closeModal() {
    accountModal.classList.remove('modal-fade-in');
    accountModal.querySelector('.modal-content').classList.remove('modal-fade-in');
    accountModal.style.display = 'none';
    document.body.style.overflow = '';
    document.body.classList.remove('modal-blur');
    document.documentElement.classList.remove('modal-blur');
  }
  function openLoginModal() {
    // Close any other modals first
    if (accountModal) accountModal.style.display = 'none';
    if (editUserModal) editUserModal.style.display = 'none';
    
    loginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-blur');
    document.documentElement.classList.add('modal-blur');
    loginModal.classList.add('modal-fade-in');
    loginModal.querySelector('.modal-content').classList.add('modal-fade-in');
  }
  function closeLogin() {
    loginModal.classList.remove('modal-fade-in');
    loginModal.querySelector('.modal-content').classList.remove('modal-fade-in');
    loginModal.style.display = 'none';
    document.body.style.overflow = '';
    document.body.classList.remove('modal-blur');
    document.documentElement.classList.remove('modal-blur');
  }

  if (userIcon) {
    userIcon.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  }
  if (closeAccountModal) {
    closeAccountModal.addEventListener('click', closeModal);
  }
  if (closeLoginModal) {
    closeLoginModal.addEventListener('click', closeLogin);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  
  // Close login modal when clicking on the blurry background
  if (loginModal) {
    loginModal.addEventListener('click', function (e) {
      if (e.target === loginModal) {
        closeLogin();
      }
    });
  }
  
  // Close account modal when clicking on the blurry background
  if (accountModal) {
    accountModal.addEventListener('click', function (e) {
      if (e.target === accountModal) {
        closeModal();
      }
    });
  }
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', function () {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.innerHTML = '&#128064;';
      } else {
        passwordInput.type = 'password';
        passwordToggle.innerHTML = '&#128065;';
      }
    });
  }
  if (showLoginModal) {
    showLoginModal.addEventListener('click', function(e) {
      e.preventDefault();

      const content = accountModal.querySelector('.modal-content');
      content.classList.add('deck-shuffle-out');
      setTimeout(function() {
        accountModal.style.display = 'none';
        content.classList.remove('deck-shuffle-out');

        loginModal.style.display = 'flex';
        const loginContent = loginModal.querySelector('.modal-content');
        loginContent.classList.add('deck-shuffle-in');
        setTimeout(function() {
          loginContent.classList.remove('deck-shuffle-in');
        }, 600);
      }, 400);
    });
  }
  if (showRegisterModal) {
    showRegisterModal.addEventListener('click', function(e) {
      e.preventDefault();

      const loginContent = loginModal.querySelector('.modal-content');
      loginContent.classList.add('deck-shuffle-out');
      setTimeout(function() {
        loginModal.style.display = 'none';
        loginContent.classList.remove('deck-shuffle-out');

        accountModal.style.display = 'flex';
        const content = accountModal.querySelector('.modal-content');
        content.classList.add('deck-shuffle-in');
        setTimeout(function() {
          content.classList.remove('deck-shuffle-in');
        }, 600);
      }, 400);
    });
  }


  setTimeout(function() {
    var leftDesc = document.querySelector('.left-section p');
    if (leftDesc) leftDesc.classList.add('fade-in');
    var leftHeading = document.querySelector('.left-section h1');
    if (leftHeading) leftHeading.classList.add('fade-in');
  }, 200);


  var materialImgs = document.querySelectorAll('.material-image img');
  if ('IntersectionObserver' in window && materialImgs.length > 0) {
    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('fade-in');
          }, i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    materialImgs.forEach(function(img) {
      observer.observe(img);
    });
  } else {

    materialImgs.forEach(function(img) {
      img.classList.add('fade-in');
    });
  }



  var careGuideImgs = document.querySelectorAll('.care-guide-img');
  if ('IntersectionObserver' in window && careGuideImgs.length > 0) {
    var cgObserver = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('fade-in');
          }, i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    careGuideImgs.forEach(function(img) {
      cgObserver.observe(img);
    });
  } else {
    careGuideImgs.forEach(function(img) {
      img.classList.add('fade-in');
    });
  }


  document.querySelectorAll('.modal-password-toggle').forEach(function(toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var input = toggleBtn.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.innerHTML = '&#128064;';
      } else {
        input.type = 'password';
        toggleBtn.innerHTML = '&#128065;';
      }
    });
  });

  // Fade in service images on scroll
  var serviceImgs = document.querySelectorAll('.service-img');
  if ('IntersectionObserver' in window && serviceImgs.length > 0) {
    var serviceImgObserver = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('fade-in');
          }, i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    serviceImgs.forEach(function(img) {
      serviceImgObserver.observe(img);
    });
  } else {
    serviceImgs.forEach(function(img) {
      img.classList.add('fade-in');
    });
  }
}); 