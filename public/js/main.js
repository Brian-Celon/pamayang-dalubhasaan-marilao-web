// ============================================================
// PDM School Website — main.js
// Mobile nav, active links, scroll-reveal, form validation
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
  initScrollReveal();
  initContactForm();
  initCourses();
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
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const generalMsg = document.getElementById('form-general-msg');
      
      btn.textContent = 'Sending...';
      btn.disabled = true;
      if(generalMsg) generalMsg.classList.add('hidden');

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          subject: subject.value.trim(),
          message: message.value.trim()
        })
      })
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status === 200 && body.success) {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = '#22c55e';
          
          if(generalMsg) {
            generalMsg.textContent = body.message;
            generalMsg.className = 'mb-4 p-4 rounded text-sm font-medium bg-green-100 text-green-800';
          }
          
          setTimeout(() => {
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
            if(generalMsg) generalMsg.classList.add('hidden');
          }, 5000);
        } else {
          // Validation error or server error
          throw new Error(body.errors ? body.errors[0].msg : (body.error?.message || 'Failed to send message'));
        }
      })
      .catch(err => {
        console.error('Contact form error:', err);
        btn.textContent = originalText;
        btn.disabled = false;
        if(generalMsg) {
          generalMsg.textContent = err.message;
          generalMsg.className = 'mb-4 p-4 rounded text-sm font-medium bg-red-100 text-red-800';
        }
      });
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

/* --------------------------
   5. Fetch & Render Courses
   -------------------------- */
async function initCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return; // Only run on courses page

  try {
    const response = await fetch('/api/courses');
    if (!response.ok) throw new Error('Failed to fetch courses');
    const courses = await response.json();
    
    // Clear the loading spinner
    container.innerHTML = '';
    
    // Render each course
    courses.forEach(course => {
      const card = document.createElement('div');
      card.className = `card card-accent-${course.colorTheme} p-6 text-center reveal`;
      
      card.innerHTML = `
        <div class="feature-icon feature-icon-${course.colorTheme === 'gold' ? 'brown' : course.colorTheme === 'maroon' ? 'maroon' : 'gold'} mx-auto mb-4">${course.icon}</div>
        <h3 class="font-bold text-brown text-lg mb-2 font-serif">${course.title}</h3>
        <div class="course-badge course-badge-years mb-3">${course.abbreviation} • ${course.duration}</div>
        <p class="text-gray-600 text-sm leading-relaxed">
            ${course.description}
        </p>
      `;
      container.appendChild(card);
    });

    // Initialize scroll reveal for the new dynamic elements
    initScrollReveal();

  } catch (error) {
    console.error('Error loading courses:', error);
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-12 text-red-500">
          <p>Sorry, we couldn't load the programs at this time.</p>
          <p class="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    `;
  }
}
