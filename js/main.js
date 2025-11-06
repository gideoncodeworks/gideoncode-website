// Gideon Code Works - Main JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
  const dropdownControllers = [];

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
      if (shouldOpen === true) {
        dropdownControllers.forEach(controller => controller.setState(false));
      }
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

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    });
  }

  // Desktop dropdown menus
  document.querySelectorAll('[data-dropdown]').forEach(container => {
    const toggleButton = container.querySelector('[data-dropdown-button]');
    const menu = container.querySelector('[data-dropdown-menu]');

    if (!toggleButton || !menu) {
      return;
    }

    const setState = (isOpen) => {
      container.classList.toggle('open', isOpen);
      menu.classList.toggle('open', isOpen);
      toggleButton.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-hidden', String(!isOpen));
    };

    dropdownControllers.push({ container, setState });

    toggleButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !container.classList.contains('open');
      dropdownControllers.forEach(controller => controller.setState(false));
      setState(willOpen);
    });

    toggleButton.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setState(false);
        toggleButton.blur();
      }
    });

    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setState(false);
        toggleButton.focus();
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setState(false));
    });
  });

  document.addEventListener('click', (event) => {
    dropdownControllers.forEach(({ container, setState }) => {
      if (!container.contains(event.target)) {
        setState(false);
      }
    });
  });

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

  // Form validation feedback
  const showFieldError = (field) => {
    field.classList.add('input-error');
    let message = field.parentElement?.querySelector('.input-error-message');
    if (!message && field.parentElement) {
      message = document.createElement('p');
      message.className = 'input-error-message text-xs text-red-400 mt-1';
      field.parentElement.appendChild(message);
    }
    if (message) {
      message.textContent = field.validationMessage || 'This field is required.';
      message.classList.remove('hidden');
    }
  };

  const clearFieldError = (field) => {
    field.classList.remove('input-error');
    const message = field.parentElement?.querySelector('.input-error-message');
    if (message) {
      message.classList.add('hidden');
    }
  };

  document.querySelectorAll('form input, form select, form textarea').forEach(field => {
    field.addEventListener('invalid', (event) => {
      event.preventDefault();
      showFieldError(field);
    });

    field.addEventListener('input', () => clearFieldError(field));
  });

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
