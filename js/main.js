// Gideon Code Works - Main JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

  if (mobileMenuButton && mobileMenu) {
    let mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    if (!mobileMenuOverlay) {
      mobileMenuOverlay = document.createElement('div');
      mobileMenuOverlay.id = 'mobile-menu-overlay';
      document.body.appendChild(mobileMenuOverlay);
    }

    const setMobileMenuState = (shouldOpen) => {
      mobileMenu.classList.toggle('active', shouldOpen);
      if (hamburger) {
        hamburger.classList.toggle('active', shouldOpen);
      }
      document.body.classList.toggle('menu-open', shouldOpen);
    };

    const closeMobileMenu = () => setMobileMenuState(false);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    mobileMenuButton.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.contains('active');
      setMobileMenuState(!isOpen);
    });

    // Close mobile menu when clicking a link
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMobileMenu();
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideMenu = mobileMenu.contains(event.target);
      const isClickOnButton = mobileMenuButton.contains(event.target);

      if (!isClickInsideMenu && !isClickOnButton && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
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
  const isCareersFamily = currentPage.startsWith('careers');
  const isWebFamily = currentPage === 'services.html' || currentPage.endsWith('-demo.html');

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('http')) {
      return;
    }
    const baseHref = (href.split('#')[0] || href) || '';
    const matchesPage = baseHref === currentPage || (currentPage === '' && baseHref === 'index.html');
    const matchesCareers = isCareersFamily && baseHref === 'careers.html';
    const matchesWeb = isWebFamily && baseHref === 'services.html';
    if (matchesPage || matchesCareers || matchesWeb) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
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

  // Apply glow interaction to standard buttons site-wide
  document.querySelectorAll('button').forEach(button => {
    if (
      !button.classList.contains('neon-button') &&
      !button.classList.contains('neon-button-magenta') &&
      !button.classList.contains('neon-button-outline')
    ) {
      button.classList.add('glow-button');
    }
  });

  const laneLinks = Array.from(document.querySelectorAll('.floating-cta__link'));
  const laneSections = Array.from(document.querySelectorAll('[data-lane]'));

  if (laneLinks.length && laneSections.length) {
    const setActiveLane = (laneId) => {
      laneLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.laneTarget === laneId);
      });
    };

    laneLinks.forEach(link => {
      link.addEventListener('click', () => {
        setActiveLane(link.dataset.laneTarget);
      });
    });

    const laneObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLane(entry.target.dataset.lane);
        }
      });
    }, { threshold: 0.45, rootMargin: '-10% 0px -10% 0px' });

    laneSections.forEach(section => laneObserver.observe(section));
  }
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
