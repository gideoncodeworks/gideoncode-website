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

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    });
  }

  // Desktop "More" dropdown accessibility + toggle
  const dropdownContainers = Array.from(document.querySelectorAll('.nav-dropdown-container'));
  const dropdownHoverTimers = new WeakMap();

  const openDropdown = (container) => {
    const toggle = container.querySelector('.nav-dropdown-toggle');
    const menu = container.querySelector('.nav-dropdown');
    container.classList.add('is-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }
    if (menu) {
      menu.setAttribute('aria-hidden', 'false');
    }
  };

  const closeDropdown = (container) => {
    container.classList.remove('is-open');
    const toggle = container.querySelector('.nav-dropdown-toggle');
    const menu = container.querySelector('.nav-dropdown');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (menu) {
      menu.setAttribute('aria-hidden', 'true');
    }
  };

  dropdownContainers.forEach(container => {
    const toggle = container.querySelector('.nav-dropdown-toggle');
    const menu = container.querySelector('.nav-dropdown');
    if (!toggle || !menu) {
      return;
    }

    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = container.classList.contains('is-open');
      dropdownContainers.forEach(other => {
        if (other !== container) {
          closeDropdown(other);
        }
      });
      if (isOpen) {
        closeDropdown(container);
      } else {
        openDropdown(container);
        menu.querySelector('a')?.focus();
      }
    });

    container.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDropdown(container);
        toggle.focus();
      }
    });

    // Hover support with delay to prevent flicker
    const registerHover = (el) => {
      el.addEventListener('mouseenter', () => {
        clearTimeout(dropdownHoverTimers.get(container));
        openDropdown(container);
      });
      el.addEventListener('mouseleave', () => {
        const timer = setTimeout(() => closeDropdown(container), 250);
        dropdownHoverTimers.set(container, timer);
      });
    };

    registerHover(container);
    registerHover(toggle);
    registerHover(menu);
  });

  if (dropdownContainers.length) {
    document.addEventListener('click', (event) => {
      dropdownContainers.forEach(container => {
        if (!container.contains(event.target)) {
          closeDropdown(container);
        }
      });
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

  initGideonConcierge();
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

function initGideonConcierge() {
  console.log('initGideonConcierge called');

  // Allow pages to disable concierge
  if (window.DISABLE_GIDEON_CONCIERGE) {
    console.log('Gideon disabled by flag');
    return;
  }

  if (document.querySelector('[data-gideon-concierge]')) {
    console.log('Gideon already exists');
    return;
  }

  console.log('Creating Gideon button...');
  const container = document.createElement('div');
  container.className = 'gideon-concierge';
  container.setAttribute('data-gideon-concierge', 'true');
  container.innerHTML = `
    <button type="button" class="gideon-concierge__button" data-toggle aria-expanded="false" aria-controls="gideon-concierge-panel">
      <video autoplay muted loop playsinline style="width: 120%; height: 120%; object-fit: cover; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: transparent;">
        <source src="/media/gideon-lives.mp4" type="video/mp4">
      </video>
    </button>
    <section class="gideon-concierge__panel" id="gideon-concierge-panel" role="dialog" aria-modal="true" aria-label="Gideon concierge" data-panel>
      <header class="gideon-concierge__header">
        <div class="gideon-concierge__avatar">
          <video src="media/gideon-lives.mp4" autoplay muted loop playsinline poster="images/portfolio/crm-platform.jpg"></video>
        </div>
        <div>
          <p class="gideon-concierge__title">Gideon</p>
          <p class="gideon-concierge__subtitle">Dual-brain AI concierge</p>
        </div>
        <button type="button" class="gideon-concierge__close" data-close aria-label="Close Gideon concierge">
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      <div class="gideon-concierge__messages" data-messages role="log" aria-live="polite"></div>
      <div class="gideon-concierge__quick" data-quick></div>
      <div class="gideon-concierge__typing hidden" data-typing>
        <span>Gideon thinking</span>
        <span class="gideon-concierge__typing-dot"></span>
        <span class="gideon-concierge__typing-dot"></span>
        <span class="gideon-concierge__typing-dot"></span>
      </div>
      <div class="gideon-concierge__composer">
        <input type="text" class="gideon-concierge__input" data-input placeholder="Ask Gideon anything…" autocomplete="off" aria-label="Ask Gideon a question">
        <button type="button" class="gideon-concierge__send" data-send>
          <span>Send</span>
        </button>
      </div>
    </section>
  `;

  document.body.appendChild(container);
  console.log('Gideon button appended to body');

  const panel = container.querySelector('[data-panel]');
  const toggleButton = container.querySelector('[data-toggle]');
  const closeButton = container.querySelector('[data-close]');
  const messagesArea = container.querySelector('[data-messages]');
  const quickContainer = container.querySelector('[data-quick]');
  const typingIndicator = container.querySelector('[data-typing]');
  const inputField = container.querySelector('[data-input]');
  const sendButton = container.querySelector('[data-send]');

  const quickActions = [
    { label: 'Pricing & Plans', prompt: 'Walk me through your pricing and revenue packages.' },
    { label: 'Launch Timeline', prompt: 'How fast can you launch a new website and CRM for me?' },
    { label: 'CRM Power', prompt: 'What can the Gideon CRM do for my sales team?' },
    { label: 'Book a Call', prompt: 'Help me schedule a call with the Gideon Code Works team.' }
  ];

  quickActions.forEach(action => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    button.setAttribute('data-prompt', action.prompt);
    button.addEventListener('click', () => {
      openPanel();
      handleUserPrompt(action.prompt);
    });
    quickContainer.appendChild(button);
  });

  const appendMessage = (author, text) => {
    const bubble = document.createElement('div');
    bubble.className = `gideon-concierge__bubble ${author === 'gideon' ? 'gideon-concierge__bubble--gideon' : 'gideon-concierge__bubble--user'}`;

    const safeText = escapeHTML(String(text || '')).replace(/\n/g, '<br>');

    if (author === 'gideon') {
      bubble.innerHTML = `<div class="gideon-concierge__meta-line">Gideon</div>${safeText}`;
    } else {
      bubble.innerHTML = safeText;
    }

    messagesArea.appendChild(bubble);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  };

  const setLoading = (isLoading) => {
    typingIndicator.classList.toggle('hidden', !isLoading);
    sendButton.disabled = isLoading;
  };

  const buildContext = () => {
    const path = window.location.pathname || '/';
    const title = document.title || 'Gideon Code Works';
    const hero = document.querySelector('#hero-heading')?.textContent?.trim();
    const state = window.gcAIState ? JSON.stringify(window.gcAIState) : 'No stored mission.';

    const activePlan = document.querySelector('[data-plan-selected-name]')?.textContent?.trim();
    const cartInfo = document.querySelector('#plan-name')?.textContent?.trim();

    return [
      `Page: ${path}`,
      `Title: ${title}`,
      hero ? `Hero: ${hero}` : null,
      window.gcAIState ? `Dynamic narrative: ${state}` : null,
      activePlan ? `Active plan: ${activePlan}` : null,
      cartInfo && cartInfo !== activePlan ? `Cart selection: ${cartInfo}` : null
    ].filter(Boolean).join(' | ');
  };

  const requestGideon = async (prompt) => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/ai-gateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          kind: 'concierge',
          payload: {
            question: prompt,
            context: buildContext()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gateway ${response.status}`);
      }

      const data = await response.json();
      const message = data.message || 'Pipeline mapped. Let\'s move.';

      // Check if booking is needed
      if (data.needsBooking) {
        const bookingLink = '<br><br><a href="https://calendly.com/gideoncode/30min" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;padding:8px 16px;background:linear-gradient(135deg, rgba(34,211,238,0.9), rgba(236,72,153,0.85));color:#0f172a;border-radius:8px;text-decoration:none;font-weight:600;">📅 Book a Call Now</a>';
        appendMessage('gideon', message + bookingLink);
      } else {
        appendMessage('gideon', message);
      }
    } catch (error) {
      console.error('Concierge error:', error);
      appendMessage('gideon', 'Signal jammed? Call 1-216-463-2648 or email josh@gideoncode.com and we\'ll mobilize the team.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserPrompt = (prompt) => {
    const trimmed = (prompt || '').trim();
    if (!trimmed) {
      return;
    }

    appendMessage('user', trimmed);
    inputField.value = '';
    requestGideon(trimmed);
  };

  const openPanel = () => {
    panel.classList.add('is-open');
    toggleButton.setAttribute('aria-expanded', 'true');
    setTimeout(() => inputField.focus(), 150);
  };

  const closePanel = () => {
    panel.classList.remove('is-open');
    toggleButton.setAttribute('aria-expanded', 'false');
  };

  toggleButton.addEventListener('click', () => {
    if (panel.classList.contains('is-open')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeButton.addEventListener('click', closePanel);

  sendButton.addEventListener('click', () => {
    handleUserPrompt(inputField.value);
  });

  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleUserPrompt(inputField.value);
    }
  });

  document.addEventListener('click', (event) => {
    if (!container.contains(event.target) && panel.classList.contains('is-open')) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel();
      toggleButton.focus();
    }
  });

  appendMessage('gideon', 'Gideon here. Tell me the revenue play you want and I’ll map the path.');
}

function escapeHTML(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
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
