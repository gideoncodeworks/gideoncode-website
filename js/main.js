// Gideon Code Works - Main JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideMenu = mobileMenu.contains(event.target);
      const isClickOnButton = mobileMenuButton.contains(event.target);

      if (!isClickInsideMenu && !isClickOnButton && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }

  // Scroll Animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Form Submission Handlers
  const contactForm = document.getElementById('contact-form');
  const careersForm = document.getElementById('careers-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // You can integrate with a backend service here
      console.log('Contact Form Submission:', data);

      // Show success message
      alert('Thank you for your message! We\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  if (careersForm) {
    careersForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(careersForm);
      const data = Object.fromEntries(formData);

      // You can integrate with a backend service here
      console.log('Careers Form Submission:', data);

      // Show success message
      alert('Thank you for your application! We\'ll review it and get back to you soon.');
      careersForm.reset();
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add glitch effect data attribute
  document.querySelectorAll('.glitch').forEach(el => {
    el.setAttribute('data-text', el.textContent);
  });
});

// Pricing Calculator (optional enhancement)
function calculateMonthly(setupFee, monthlyFee, months) {
  const total = setupFee + (monthlyFee * months);
  const avgMonthly = total / months;
  return {
    total: total,
    avgMonthly: avgMonthly,
    savings: (monthlyFee - avgMonthly) * months
  };
}

// Commission Calculator for Careers Page
function calculateCommission(clients, tier = 'ae') {
  const setupAvg = 200; // Average setup commission
  const monthlyAvg = 55; // Average monthly commission per client

  const setupTotal = clients * setupAvg;
  const monthlyRecurring = clients * monthlyAvg;

  if (tier === 'ae') {
    return {
      setupCommission: setupTotal,
      monthlyRecurring: monthlyRecurring,
      sixMonthTotal: monthlyRecurring * 6
    };
  }

  // Add team leader and regional director calculations as needed
  return null;
}
