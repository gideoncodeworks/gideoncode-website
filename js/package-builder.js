// Gideon Package Builder
document.addEventListener('DOMContentLoaded', () => {
  const categories = {
    web: {
      description: 'Websites, funnels, SEO, and revenue enablement modules for your digital presence.',
      services: [
        {
          id: 'web-launch',
          name: 'Launch Website Sprint',
          price: 2497,
          kind: 'one-time',
          timeline: '21 days',
          summary: 'Strategy, wireframes, copy polish, high-converting design, and launch support.',
          details: ['Up to 8 pages', 'Conversion-focused UX', 'On-page SEO + analytics', '30-day optimization window']
        },
        {
          id: 'web-monthly',
          name: 'Web-as-a-Service Subscription',
          price: 212.5,
          kind: 'monthly',
          timeline: 'ONGOING',
          summary: 'Our team keeps the site sprinting—design updates, CRO experiments, security, hosting.',
          details: ['Unlimited updates', 'A/B testing + analytics', 'Managed hosting & security', 'Quarterly growth sprints']
        },
        {
          id: 'seo-demand',
          name: 'Demand Capture SEO Engine',
          price: 1800,
          kind: 'monthly',
          timeline: '90 day ramp',
          summary: 'Technical SEO, content ops, local + maps, backlink velocity tied to pipeline goals.',
          details: ['Quarterly technical audits', '2-3 articles/mo', 'Citation + backlink campaigns', 'Conversion tracking dashboards']
        },
        {
          id: 'video-reel',
          name: 'Cinematic Offer Reel',
          price: 1800,
          kind: 'one-time',
          timeline: '3 weeks',
          summary: 'Motion + script package for ads, social, and outbound sequences. Gideon handles the creative brief.',
          details: ['Storyboard + script', 'Animated + live action mix', 'Social + vertical formats', 'Launch copy + CTAs']
        },
        {
          id: 'outbound-kit',
          name: 'Outbound Weapons Kit',
          price: 3200,
          kind: 'one-time',
          timeline: '2 weeks',
          summary: 'Landing page, email flows, Loom pitch, and call script wired to Gideon CRM.',
          details: ['Offer landing page', '6-step email + SMS cadence', 'Video pitch script + deck', 'CRM automations pre-configured']
        }
      ]
    },
    apps: {
      description: 'Automation, portals, and apps that Gideon orchestrates for internal and customer-facing operations.',
      services: [
        {
          id: 'crm-portal',
          name: 'Client or Partner Portal',
          price: 11997,
          kind: 'one-time',
          timeline: '8-10 weeks',
          summary: 'Secure portal for clients, vendors, or franchisees with dashboards, file delivery, and ticketing.',
          details: ['Role-based access', 'Document + asset hub', 'Automated onboarding flows', 'Stripe or ACH integrations']
        },
        {
          id: 'custom-saas',
          name: 'Custom SaaS / Dashboard App',
          price: 19997,
          kind: 'one-time',
          timeline: '12-14 weeks',
          summary: 'Full-stack web application with multi-tenant architecture, analytics, and billing.',
          details: ['Auth + user management', 'Postgres + Prisma data layer', 'API + webhook suite', 'Usage + billing instrumentation']
        },
        {
          id: 'workflow-automation',
          name: 'Workflow Automation Mesh',
          price: 6400,
          kind: 'one-time',
          timeline: '4 weeks',
          summary: 'Zapier/Make + serverless automations that glue CRMs, forms, fulfillment, and alerts together.',
          details: ['Process mapping workshop', 'Automation build + QA', 'Runbook + ownership docs', '30-day monitoring']
        },
        {
          id: 'mobile-app',
          name: 'React Native Mobile App',
          price: 14997,
          kind: 'one-time',
          timeline: '10-12 weeks',
          summary: 'iOS + Android app with offline sync, push notifications, and API integrations.',
          details: ['Cross-platform build', 'App Store + Play Store launch', 'Design system + brand polish', 'Backend integration']
        },
        {
          id: 'ai-copilot',
          name: 'AI Copilot & Knowledge Base',
          price: 7600,
          kind: 'one-time',
          timeline: '5 weeks',
          summary: 'Claude/OpenAI co-pilot, embedded knowledge base, and tone-tuned assistant wired to your data.',
          details: ['Secure data ingestion', 'Intent + workflow design', 'Playbook + prompt library', 'Ongoing training scripts']
        }
      ]
    }
  };

  const state = {
    activeCategory: 'web',
    cart: []
  };

  const categoryButtons = Array.from(document.querySelectorAll('.builder-tab'));
  const servicesList = document.getElementById('service-list');
  const subCopy = document.getElementById('builder-subcopy');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartDeposit = document.getElementById('cart-deposit');
  const cartBalance = document.getElementById('cart-balance');
  const checkoutButton = document.getElementById('checkout-builder');
  const clearCartButton = document.getElementById('clear-cart');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.category;
      if (target === state.activeCategory) return;

      state.activeCategory = target;
      categoryButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.category === target));
      renderServices();
    });
  });

  clearCartButton.addEventListener('click', () => {
    state.cart = [];
    renderCart();
  });

  checkoutButton.addEventListener('click', () => {
    if (!state.cart.length) return;
    const total = calculateTotal();
    const names = state.cart.map(item => {
      const displayName = item.kind === 'monthly' ? `${item.name} (Monthly)` : item.name;
      return encodeURIComponent(displayName);
    });
    const prices = state.cart.map(item => item.price);
    const summary = state.cart.map(item => {
      const priceLabel = item.kind === 'monthly' ? `${formatCurrency(item.price)}/mo` : formatCurrency(item.price);
      const displayName = item.kind === 'monthly' ? `${item.name} (Monthly)` : item.name;
      return `${displayName} (${priceLabel})`;
    });

    const checkoutUrl = new URL('checkout.html', window.location.origin);
    checkoutUrl.searchParams.set('plan', 'custom-package');
    checkoutUrl.searchParams.set('customPlanName', 'Gideon Custom Build');
    checkoutUrl.searchParams.set('addons', names.join(','));
    checkoutUrl.searchParams.set('addonPrices', prices.join(','));
    checkoutUrl.searchParams.set('totalPrice', Math.round(total));
    checkoutUrl.searchParams.set('customSummary', summary.join('|'));
    checkoutUrl.searchParams.set('source', 'package-builder');

    window.location.href = checkoutUrl.toString();
  });

  function renderServices() {
    const category = categories[state.activeCategory];
    if (!category) return;

    subCopy.textContent = category.description;
    servicesList.innerHTML = category.services.map(service => {
      const inCart = state.cart.some(item => item.id === service.id);
      return `
        <article class="cyber-card builder-service ${inCart ? 'selected' : ''}" data-service-id="${service.id}">
          <div class="flex justify-between items-start gap-4 mb-4">
            <div>
              <h3 class="text-xl font-semibold text-white">${service.name}</h3>
              <p class="text-sm text-gray-400 mt-1">${service.summary}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-cyan-300">${formatCurrency(service.price)}${service.kind === 'monthly' ? '<span class="text-sm text-gray-400">/mo</span>' : ''}</p>
              <p class="text-xs uppercase tracking-[0.3em] text-gray-500 mt-1">${service.kind === 'monthly' ? 'Managed' : 'Project'} · ${service.timeline}</p>
            </div>
          </div>
          <ul class="grid sm:grid-cols-2 gap-2 text-sm text-gray-400 mb-4">
            ${service.details.map(detail => `<li class="flex items-start gap-2"><span class="text-cyan-400 mt-1">◎</span><span>${detail}</span></li>`).join('')}
          </ul>
          <div class="flex justify-between items-center">
            <button class="builder-toggle ${inCart ? 'is-active' : ''}" type="button" data-service-id="${service.id}">
              ${inCart ? 'Remove' : 'Add to Build'}
            </button>
            <span class="text-xs uppercase tracking-[0.35em] text-gray-500">Gideon ready</span>
          </div>
        </article>
      `;
    }).join('');

    servicesList.querySelectorAll('.builder-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.serviceId;
        toggleService(id);
      });
    });
  }

  function toggleService(id) {
    const category = categories[state.activeCategory];
    if (!category) return;

    const service = category.services.find(item => item.id === id) ||
      Object.values(categories).flatMap(cat => cat.services).find(item => item.id === id);

    if (!service) return;

    const index = state.cart.findIndex(item => item.id === id);
    if (index >= 0) {
      state.cart.splice(index, 1);
    } else {
      state.cart.push(service);
    }

    renderServices();
    renderCart();
  }

  function renderCart() {
    if (!state.cart.length) {
      cartItems.innerHTML = `
        <div class="bg-black/40 border border-dashed border-cyan-500/30 rounded-lg p-4 text-sm text-gray-400">
          Nothing selected yet. Add modules from the left and Gideon will stack them into one project.
        </div>
      `;
      cartTotal.textContent = '$0';
      cartDeposit.textContent = '$0';
      cartBalance.textContent = '$0';
      checkoutButton.disabled = true;
      return;
    }

    cartItems.innerHTML = state.cart.map(item => `
      <div class="bg-black/40 border border-cyan-500/40 rounded-lg p-4 flex justify-between gap-4">
        <div>
          <p class="font-semibold text-white">${item.name}</p>
          <p class="text-xs uppercase tracking-[0.35em] text-gray-400 mt-1">${item.kind === 'monthly' ? 'Managed' : 'Project'} · ${item.timeline}</p>
          <p class="text-sm text-gray-400 mt-2">${item.summary}</p>
        </div>
        <div class="text-right min-w-[120px]">
          <p class="text-lg font-bold text-cyan-300">${formatCurrency(item.price)}${item.kind === 'monthly' ? '<span class="text-xs text-gray-400">/mo</span>' : ''}</p>
          <button class="text-xs text-magenta-300 hover:text-magenta-200 mt-2 remove-item" data-service-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join('');

    cartItems.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => toggleService(button.dataset.serviceId));
    });

    const total = calculateTotal();
    const deposit = total * 0.5;
    const balance = total - deposit;

    cartTotal.textContent = formatCurrency(total);
    cartDeposit.textContent = formatCurrency(deposit);
    cartBalance.textContent = formatCurrency(balance);
    checkoutButton.disabled = false;
  }

  function calculateTotal() {
    return state.cart
      .filter(item => item.kind !== 'monthly')
      .reduce((sum, item) => sum + item.price, 0);
  }

  function formatCurrency(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) {
      return '$0';
    }
    return amount % 1 === 0
      ? `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  renderServices();
  renderCart();
});

// Tab styling helper
document.addEventListener('click', (event) => {
  if (!event.target.classList.contains('builder-tab')) return;
  document.querySelectorAll('.builder-tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
});
