// Gideon Package Builder - Real Pricing from Services
document.addEventListener('DOMContentLoaded', () => {
  const categories = {
    web: {
      description: 'Websites, SEO, and ongoing management to fuel your digital presence.',
      services: [
        {
          id: 'web-starter-onetime',
          name: 'Starter Website (One-Time)',
          price: 2497,
          kind: 'one-time',
          timeline: '3-4 weeks',
          summary: 'Professional 5-page website with mobile responsive design, contact form, and basic SEO.',
          details: ['Up to 5 pages', 'Mobile responsive', 'Contact form', 'Basic SEO setup', 'Hosting included (1 year)', '60 days support']
        },
        {
          id: 'web-growth-onetime',
          name: 'Growth Website (One-Time)',
          price: 3497,
          kind: 'one-time',
          timeline: '4-6 weeks',
          summary: 'Expanded 10-page website with blog, advanced forms, and enhanced SEO optimization.',
          details: ['Up to 10 pages', 'Mobile responsive', 'Advanced forms', 'Enhanced SEO', 'Blog setup', 'Hosting included (1 year)', '90 days support']
        },
        {
          id: 'web-domination-onetime',
          name: 'Domination Website (One-Time)',
          price: 4997,
          kind: 'one-time',
          timeline: '6-8 weeks',
          summary: 'Unlimited pages with custom features, e-commerce ready, premium SEO, and 24/7 support.',
          details: ['Unlimited pages', 'Custom features', 'Premium SEO', 'E-commerce ready', 'Blog + CMS', 'Hosting included (1 year)', '120 days priority support']
        },
        {
          id: 'web-starter-monthly',
          name: 'Starter Web-as-a-Service',
          price: 212.50,
          setupFee: 497,
          kind: 'monthly',
          timeline: 'ONGOING',
          summary: 'Monthly managed website with hosting, updates, security monitoring, and ongoing support.',
          details: ['Up to 5 pages', 'Monthly updates', 'Security monitoring', 'Managed hosting', 'Ongoing support', '$497 setup fee', '24-month contract: $212.50/mo']
        },
        {
          id: 'web-growth-monthly',
          name: 'Growth Web-as-a-Service',
          price: 212.50,
          setupFee: 697,
          kind: 'monthly',
          timeline: 'ONGOING',
          summary: 'Expanded managed site with weekly updates, priority support, and growth optimization.',
          details: ['Up to 10 pages', 'Weekly updates', 'Advanced forms', 'Enhanced SEO', 'Priority support', '$697 setup fee', '24-month contract: $212.50/mo']
        },
        {
          id: 'web-domination-monthly',
          name: 'Domination Web-as-a-Service',
          price: 252.50,
          setupFee: 997,
          kind: 'monthly',
          timeline: 'ONGOING',
          summary: 'Enterprise managed website with daily monitoring, 24/7 support, and unlimited updates.',
          details: ['Unlimited pages', 'Daily monitoring', 'Custom features', 'Premium SEO', '24/7 support', '$997 setup fee', '24-month contract: $252.50/mo']
        },
        {
          id: 'seo-starter',
          name: 'Starter SEO Package',
          price: 497,
          kind: 'monthly',
          timeline: '90 day ramp',
          summary: 'Essential SEO with keyword research, on-page optimization, and monthly reporting.',
          details: ['Keyword research', 'On-page optimization', 'Technical SEO audit', 'Monthly reports', 'Basic link building']
        },
        {
          id: 'seo-growth',
          name: 'Growth SEO Package',
          price: 997,
          kind: 'monthly',
          timeline: '90 day ramp',
          summary: 'Advanced SEO with content creation, competitive analysis, and aggressive link building.',
          details: ['Everything in Starter', 'Content creation (2-3 posts/mo)', 'Competitive analysis', 'Advanced link building', 'Local SEO optimization', 'Conversion tracking']
        }
      ]
    },
    apps: {
      description: 'Custom mobile apps, web applications, and internal tools built for your business.',
      services: [
        {
          id: 'mobile-basic',
          name: 'Basic Mobile App',
          price: 14997,
          kind: 'one-time',
          timeline: '8-10 weeks',
          summary: 'Single-platform mobile app (iOS OR Android) with up to 5 screens and basic features.',
          details: ['iOS OR Android (single platform)', 'Up to 5 screens/views', 'User authentication', 'Basic API integration', 'Push notifications', 'App store submission', '60 days support']
        },
        {
          id: 'mobile-pro',
          name: 'Pro Mobile App',
          price: 24997,
          kind: 'one-time',
          timeline: '12-14 weeks',
          summary: 'Cross-platform app (iOS AND Android) with custom backend, advanced features, and 90 days support.',
          details: ['iOS AND Android (both platforms)', 'Up to 10 screens/views', 'User authentication & profiles', 'Custom backend/database', 'Advanced API integrations', 'In-app purchases (optional)', 'App store submission', '90 days support']
        },
        {
          id: 'app-maintenance-basic',
          name: 'App Maintenance (Basic)',
          price: 497,
          kind: 'monthly',
          timeline: 'ONGOING',
          summary: 'Basic mobile app maintenance with bug fixes, minor updates, and security patches.',
          details: ['Bug fixes', 'Security updates', 'Performance monitoring', 'App store compliance', 'Email support']
        },
        {
          id: 'app-maintenance-full',
          name: 'App Maintenance (Full)',
          price: 997,
          kind: 'monthly',
          timeline: 'ONGOING',
          summary: 'Full app support with feature development, priority support, and ongoing optimization.',
          details: ['Everything in Basic', 'Feature development', 'Priority support', 'Analytics & reporting', 'User feedback management', 'Quarterly roadmap planning']
        },
        {
          id: 'saas-dashboard',
          name: 'SaaS / Dashboard Platform',
          price: 19997,
          kind: 'one-time',
          timeline: '12-16 weeks',
          summary: 'Custom SaaS platform with user dashboards, data visualization, and subscription billing.',
          details: ['Custom user dashboards', 'Data visualization & reporting', 'User authentication & roles', 'Database design & setup', 'API development', 'Responsive web design', '90 days support']
        },
        {
          id: 'crm-internal-tools',
          name: 'CRM / Internal Tools',
          price: 14997,
          kind: 'one-time',
          timeline: '10-12 weeks',
          summary: 'Custom CRM or internal tool with workflow automation, pipeline management, and reporting.',
          details: ['Custom workflow automation', 'Sales pipeline management', 'Contact & lead tracking', 'Reporting & analytics', 'Email integrations', 'User permissions & security', '90 days support']
        }
      ]
    },
    branding: {
      description: 'Professional brand identity systems that make your business stand out.',
      services: [
        {
          id: 'logo-design',
          name: 'Logo Design',
          price: 997,
          kind: 'one-time',
          timeline: '1-2 weeks',
          summary: 'Professional logo with 3 concepts, 2 revision rounds, and all file formats.',
          details: ['3 logo concepts', '2 revision rounds', 'Final files (PNG, SVG, PDF)', 'Black & white versions', 'Social media formats']
        },
        {
          id: 'brand-identity',
          name: 'Brand Identity Kit',
          price: 2497,
          kind: 'one-time',
          timeline: '2-3 weeks',
          summary: 'Complete brand identity with logo, color palette, typography, style guide, and templates.',
          details: ['Custom logo design', 'Color palette (5-7 colors)', 'Typography system', 'Brand style guide (PDF)', 'Business card design', 'Social media templates', 'All file formats', '3 revision rounds']
        },
        {
          id: 'brand-system',
          name: 'Complete Brand System',
          price: 4997,
          kind: 'one-time',
          timeline: '3-4 weeks',
          summary: 'Enterprise brand system with comprehensive guidelines, marketing materials, and unlimited revisions.',
          details: ['Everything in Identity Kit', 'Comprehensive brand guidelines', 'Marketing materials (flyers, brochures)', 'Email signature templates', 'PowerPoint/Keynote templates', 'Social media brand kit', 'Icon & graphic library', 'Unlimited revisions']
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
      const setupFeeNote = service.setupFee ? `<p class="text-xs text-yellow-400 mt-1">+ $${service.setupFee} setup fee</p>` : '';

      return `
        <article class="cyber-card builder-service ${inCart ? 'selected' : ''}" data-service-id="${service.id}">
          <div class="flex justify-between items-start gap-4 mb-4">
            <div>
              <h3 class="text-xl font-semibold text-white">${service.name}</h3>
              <p class="text-sm text-gray-400 mt-1">${service.summary}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-cyan-300">${formatCurrency(service.price)}${service.kind === 'monthly' ? '<span class="text-sm text-gray-400">/mo</span>' : ''}</p>
              ${setupFeeNote}
              <p class="text-xs uppercase tracking-[0.3em] text-gray-500 mt-1">${service.kind === 'monthly' ? 'Recurring' : 'One-Time'} · ${service.timeline}</p>
            </div>
          </div>
          <ul class="grid sm:grid-cols-2 gap-2 text-sm text-gray-400 mb-4">
            ${service.details.map(detail => `<li class="flex items-start gap-2"><span class="text-cyan-400 mt-1">✓</span><span>${detail}</span></li>`).join('')}
          </ul>
          <div class="flex justify-between items-center">
            <button class="builder-toggle ${inCart ? 'is-active' : ''}" type="button" data-service-id="${service.id}">
              ${inCart ? 'Remove' : 'Add to Build'}
            </button>
            <span class="text-xs uppercase tracking-[0.35em] text-gray-500">Real pricing</span>
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

    cartItems.innerHTML = state.cart.map(item => {
      const setupFeeNote = item.setupFee ? `<p class="text-xs text-yellow-400 mt-1">+ $${item.setupFee} setup</p>` : '';
      return `
        <div class="bg-black/40 border border-cyan-500/40 rounded-lg p-4 flex justify-between gap-4">
          <div>
            <p class="font-semibold text-white">${item.name}</p>
            <p class="text-xs uppercase tracking-[0.35em] text-gray-400 mt-1">${item.kind === 'monthly' ? 'Recurring' : 'One-Time'} · ${item.timeline}</p>
            <p class="text-sm text-gray-400 mt-2">${item.summary}</p>
          </div>
          <div class="text-right min-w-[120px]">
            <p class="text-lg font-bold text-cyan-300">${formatCurrency(item.price)}${item.kind === 'monthly' ? '<span class="text-xs text-gray-400">/mo</span>' : ''}</p>
            ${setupFeeNote}
            <button class="text-xs text-magenta-300 hover:text-magenta-200 mt-2 remove-item" data-service-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
    }).join('');

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
      .reduce((sum, item) => {
        const basePrice = item.price;
        const setupFee = item.setupFee || 0;
        return sum + basePrice + setupFee;
      }, 0);
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
