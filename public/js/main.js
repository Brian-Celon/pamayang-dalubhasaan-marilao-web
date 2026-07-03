// ============================================================
// PDM School Website — main.js
// Mobile nav, active links, scroll-reveal, form validation
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
  initScrollReveal();
  initContactForm();
});

/* --------------------------
   1. Mobile Navigation
   -------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('nav-links');
  const overlay = document.getElementById('mobile-overlay');

  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    nav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      btn.classList.remove('active');
      nav.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close menu when clicking a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      nav.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------
   2. Active Nav Highlighting
   -------------------------- */
function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Match root or index
    const isHome = (href === '/' || href === '/index.html') &&
                   (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/'));
    const isMatch = !isHome && currentPath.includes(href);

    if (isHome || isMatch) {
      link.classList.add('nav-link-active');
    }
  });
}

/* --------------------------
   3. Scroll Reveal
   -------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------
   4. Contact Form Validation
   -------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-input').forEach(input => {
      input.classList.remove('error');
    });
    form.querySelectorAll('.form-error-msg').forEach(msg => {
      msg.classList.remove('visible');
    });

    // Validate required fields
    const name = form.querySelector('#contact-name');
    const email = form.querySelector('#contact-email');
    const subject = form.querySelector('#contact-subject');
    const message = form.querySelector('#contact-message');

    if (name && !name.value.trim()) {
      showError(name, 'name-error');
      isValid = false;
    }

    if (email) {
      if (!email.value.trim()) {
        showError(email, 'email-error', 'Email address is required.');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'email-error', 'Please enter a valid email address.');
        isValid = false;
      }
    }

    if (subject && !subject.value.trim()) {
      showError(subject, 'subject-error');
      isValid = false;
    }

    if (message && !message.value.trim()) {
      showError(message, 'message-error');
      isValid = false;
    }

    if (isValid) {
      // Show success feedback
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.disabled = true;
      btn.style.background = '#22c55e';

      setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }
  });
}

function showError(input, errorId, customMsg) {
  input.classList.add('error');
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    if (customMsg) errorEl.textContent = customMsg;
    errorEl.classList.add('visible');
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
