// Gideon Package Builder - Guided Service Selection
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    activeCategory: 'web',
    websiteType: null, // 'onetime' or 'monthly'
    websiteTier: null, // 'starter', 'growth', 'domination'
    contractLength: null, // '12' or '24'
    cart: [],
    expandedAccordion: null
  };

  const servicesList = document.getElementById('service-list');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartDeposit = document.getElementById('cart-deposit');
  const cartBalance = document.getElementById('cart-balance');
  const checkoutButton = document.getElementById('checkout-builder');
  const clearCartButton = document.getElementById('clear-cart');

  // Debug: Check if elements exist
  if (!servicesList || !cartItems || !checkoutButton || !clearCartButton) {
    console.error('Package builder elements not found:', {
      servicesList: !!servicesList,
      cartItems: !!cartItems,
      checkoutButton: !!checkoutButton,
      clearCartButton: !!clearCartButton
    });
    return;
  }

  // Tab switching
  document.querySelectorAll('.builder-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      state.activeCategory = category;

      // Update active tab styling
      document.querySelectorAll('.builder-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      renderServices();
    });
  });

  clearCartButton.addEventListener('click', () => {
    console.log('Clear cart clicked');
    state.cart = [];
    state.websiteType = null;
    state.websiteTier = null;
    state.contractLength = null;
    state.expandedAccordion = null;
    renderServices();
    renderCart();
  });
  console.log('Clear cart button listener attached');

  checkoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Checkout button clicked', state.cart);

    if (!state.cart.length) {
      console.log('Cart is empty, aborting');
      return;
    }

    const total = calculateTotal();
    console.log('Total calculated:', total);

    const names = state.cart.map(item => encodeURIComponent(item.name));
    const prices = state.cart.map(item => item.price);
    const summary = state.cart.map(item => {
      const priceLabel = item.kind === 'monthly' ? `${formatCurrency(item.price)}/mo` : formatCurrency(item.price);
      return `${item.name} (${priceLabel})`;
    });

    const checkoutUrl = new URL('checkout.html', window.location.origin);
    checkoutUrl.searchParams.set('plan', 'custom-package');
    checkoutUrl.searchParams.set('customPlanName', 'Gideon Custom Build');
    checkoutUrl.searchParams.set('addons', names.join(','));
    checkoutUrl.searchParams.set('addonPrices', prices.join(','));
    checkoutUrl.searchParams.set('totalPrice', Math.round(total));
    checkoutUrl.searchParams.set('customSummary', summary.join('|'));
    checkoutUrl.searchParams.set('source', 'package-builder');

    console.log('Navigating to:', checkoutUrl.toString());
    window.location.href = checkoutUrl.toString();
  });

  function renderServices() {
    const websiteInCart = state.cart.some(item => item.category === 'website');

    // Render based on active category
    if (state.activeCategory !== 'web') {
      servicesList.innerHTML = `
        <div class="cyber-card text-center py-12">
          <h3 class="text-2xl font-bold text-white mb-4">Coming Soon</h3>
          <p class="text-gray-400">The ${state.activeCategory} category is under construction. For now, check out our Web + SEO services!</p>
        </div>
      `;
      return;
    }

    servicesList.innerHTML = `
      <!-- ONE-TIME BUILDS -->
      <div class="mb-12">
        <h3 class="text-2xl font-bold text-white mb-2">One-Time Website Builds</h3>
        <p class="text-sm text-gray-400 mb-6">Complete website delivered once. Can add Gideon AI Chatbot. (No ongoing hosting/management)</p>

        <div class="space-y-4">
          ${renderOneTimeOption('starter', 'Starter Website', 2497, 'Up to 5 pages, mobile responsive, contact form, basic SEO, 1-year hosting included')}
          ${renderOneTimeOption('growth', 'Growth Website', 3497, 'Up to 10 pages, advanced forms, enhanced SEO, blog, 1-year hosting included')}
          ${renderOneTimeOption('domination', 'Domination Website', 4997, 'Unlimited pages, custom features, premium SEO, e-commerce ready, 1-year hosting included')}
        </div>
      </div>

      <!-- WEBSITE-AS-A-SERVICE -->
      <div class="mb-12">
        <h3 class="text-2xl font-bold text-white mb-2">Website-as-a-Service</h3>
        <p class="text-sm text-gray-400 mb-6">Ongoing website management with hosting, updates, and support. Choose your tier, then pick contract length.</p>

        <div class="space-y-4">
          ${renderMonthlyAccordion('starter', 'Starter', 497, 250, 212.50, 900, 'Up to 5 pages, monthly updates, security monitoring, managed hosting')}
          ${renderMonthlyAccordion('growth', 'Growth', 697, 250, 212.50, 900, 'Up to 10 pages, weekly updates, advanced forms, enhanced SEO, priority support')}
          ${renderMonthlyAccordion('domination', 'Domination', 997, 297, 252.50, 1068, 'Unlimited pages, daily monitoring, custom features, premium SEO, 24/7 support')}
        </div>
      </div>

      <!-- ADD-ONS (only show if website selected) -->
      ${websiteInCart ? renderAddOns() : ''}
    `;

    attachEventListeners();
  }

  function renderOneTimeOption(tier, name, price, description) {
    const selected = state.websiteType === 'onetime' && state.websiteTier === tier;
    const disabled = state.websiteType === 'monthly';

    return `
      <div class="cyber-card ${selected ? 'border-2 border-cyan-500' : ''} ${disabled ? 'opacity-50' : ''}">
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1">
            <h4 class="text-xl font-semibold text-white mb-1">${name}</h4>
            <p class="text-sm text-gray-400">${description}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-cyan-300">${formatCurrency(price)}</p>
            <p class="text-xs text-gray-500 mt-1">ONE-TIME</p>
          </div>
        </div>
        <div class="mt-4">
          <button
            class="builder-toggle ${selected ? 'is-active' : ''}"
            data-action="select-onetime"
            data-tier="${tier}"
            data-name="${name}"
            data-price="${price}"
            ${disabled ? 'disabled' : ''}
          >
            ${selected ? 'Selected' : 'Select This Build'}
          </button>
        </div>
      </div>
    `;
  }

  function renderMonthlyAccordion(tier, name, setupFee, price12mo, price24mo, savings, description) {
    const isExpanded = state.expandedAccordion === tier;
    const selected = state.websiteType === 'monthly' && state.websiteTier === tier;
    const disabled = state.websiteType === 'onetime';

    return `
      <div class="cyber-card ${selected ? 'border-2 border-cyan-500' : ''} ${disabled ? 'opacity-50' : ''}">
        <button
          class="w-full text-left flex justify-between items-start gap-4"
          data-action="toggle-accordion"
          data-tier="${tier}"
          ${disabled ? 'disabled' : ''}
        >
          <div class="flex-1">
            <h4 class="text-xl font-semibold text-white mb-1">${name} Web-as-a-Service</h4>
            <p class="text-sm text-gray-400">${description}</p>
            <p class="text-xs text-yellow-400 mt-2">$${setupFee} setup fee • Choose contract length below</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-cyan-300">From ${formatCurrency(price24mo)}<span class="text-sm text-gray-400">/mo</span></p>
            <p class="text-xs text-gray-500 mt-1">${isExpanded ? '▼ EXPANDED' : '► CLICK TO EXPAND'}</p>
          </div>
        </button>

        ${isExpanded ? `
          <div class="mt-6 pt-6 border-t border-gray-800 space-y-4">
            <!-- 12-Month Option -->
            <div class="bg-black/40 rounded-lg p-4 border ${state.contractLength === '12' && selected ? 'border-cyan-500' : 'border-gray-800'}">
              <div class="flex justify-between items-center mb-3">
                <div>
                  <p class="font-semibold text-white">12-Month Contract</p>
                  <p class="text-sm text-gray-400">Standard commitment</p>
                </div>
                <div class="text-right">
                  <p class="text-xl font-bold text-white">${formatCurrency(price12mo)}<span class="text-sm text-gray-400">/mo</span></p>
                </div>
              </div>
              <button
                class="builder-toggle ${state.contractLength === '12' && selected ? 'is-active' : ''}"
                data-action="select-monthly"
                data-tier="${tier}"
                data-contract="12"
                data-name="${name} Web-as-a-Service (12-Month)"
                data-price="${price12mo}"
                data-setup="${setupFee}"
              >
                ${state.contractLength === '12' && selected ? 'Selected' : 'Select 12-Month'}
              </button>
            </div>

            <!-- 24-Month Option (BEST VALUE) -->
            <div class="bg-black/40 rounded-lg p-4 border ${state.contractLength === '24' && selected ? 'border-cyan-500' : 'border-green-500/30'}">
              <div class="flex justify-between items-center mb-3">
                <div>
                  <p class="font-semibold text-white">24-Month Contract <span class="inline-block bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full ml-2">SAVE $${savings}</span></p>
                  <p class="text-sm text-gray-400">Best value - longer commitment</p>
                </div>
                <div class="text-right">
                  <p class="text-xl font-bold text-green-400">${formatCurrency(price24mo)}<span class="text-sm text-gray-400">/mo</span></p>
                  <p class="text-xs line-through text-gray-500">${formatCurrency(price12mo)}/mo</p>
                </div>
              </div>
              <button
                class="builder-toggle ${state.contractLength === '24' && selected ? 'is-active' : ''}"
                data-action="select-monthly"
                data-tier="${tier}"
                data-contract="24"
                data-name="${name} Web-as-a-Service (24-Month)"
                data-price="${price24mo}"
                data-setup="${setupFee}"
                data-savings="${savings}"
              >
                ${state.contractLength === '24' && selected ? 'Selected' : 'Select 24-Month'}
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderAddOns() {
    const canAddFull = state.websiteType === 'monthly'; // Only monthly gets full add-ons
    const canAddGideon = state.websiteType === 'onetime' || state.websiteType === 'monthly'; // Both get Gideon

    return `
      <div class="mb-12">
        <h3 class="text-2xl font-bold text-white mb-2">Add-On Services</h3>
        <p class="text-sm text-gray-400 mb-6">${canAddFull ? 'Available add-ons for your website package:' : 'Available add-on for one-time builds:'}</p>

        <div class="space-y-4">
          ${canAddGideon ? renderAddOn('gideon-ai-basic', 'Gideon AI Chatbot (Basic)', 99, 497, '500 AI conversations/month, lead capture, email support') : ''}
          ${canAddGideon ? renderAddOn('gideon-ai-pro', 'Gideon AI Chatbot (Professional)', 299, 997, '2,000 conversations/month, custom persona, action system, priority support') : ''}
          ${canAddFull ? renderAddOn('social-media', 'Social Media Management', 250, 0, '12 posts/month, content creation, scheduling, engagement (Facebook/Instagram/LinkedIn)') : ''}
          ${canAddFull ? renderAddOn('google-ads', 'Google Ads Setup & Management', 297, 0, 'Campaign setup, ad copy, optimization, reporting (ad budget paid separately)') : ''}
          ${canAddFull ? renderAddOn('seo-starter', 'SEO Starter Package', 497, 0, 'Keyword research, on-page optimization, technical audit, monthly reports') : ''}
          ${canAddFull ? renderAddOn('seo-growth', 'SEO Growth Package', 997, 0, 'Everything in Starter + content creation, competitive analysis, advanced link building') : ''}
        </div>
      </div>
    `;
  }

  function renderAddOn(id, name, price, setupFee, description) {
    const inCart = state.cart.some(item => item.id === id);

    return `
      <div class="cyber-card ${inCart ? 'border-2 border-magenta-500' : ''}">
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1">
            <h4 class="text-lg font-semibold text-white mb-1">${name}</h4>
            <p class="text-sm text-gray-400">${description}</p>
            ${setupFee > 0 ? `<p class="text-xs text-yellow-400 mt-1">+ $${setupFee} setup fee</p>` : ''}
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-cyan-300">${formatCurrency(price)}<span class="text-sm text-gray-400">/mo</span></p>
          </div>
        </div>
        <div class="mt-4">
          <button
            class="builder-toggle ${inCart ? 'is-active' : ''}"
            data-action="toggle-addon"
            data-id="${id}"
            data-name="${name}"
            data-price="${price}"
            data-setup="${setupFee || 0}"
          >
            ${inCart ? 'Remove' : 'Add to Build'}
          </button>
        </div>
      </div>
    `;
  }

  function attachEventListeners() {
    servicesList.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const action = button.dataset.action;

        if (action === 'toggle-accordion') {
          const tier = button.dataset.tier;
          state.expandedAccordion = state.expandedAccordion === tier ? null : tier;
          renderServices();
        }
        else if (action === 'select-onetime') {
          selectOneTime(button.dataset);
        }
        else if (action === 'select-monthly') {
          selectMonthly(button.dataset);
        }
        else if (action === 'toggle-addon') {
          toggleAddOn(button.dataset);
        }
      });
    });
  }

  function selectOneTime(data) {
    const { tier, name, price } = data;

    // Remove existing website from cart
    state.cart = state.cart.filter(item => item.category !== 'website');

    // Remove all add-ons except Gideon
    state.cart = state.cart.filter(item => item.category === 'addon-gideon');

    // Set state
    state.websiteType = 'onetime';
    state.websiteTier = tier;
    state.contractLength = null;

    // Add to cart
    state.cart.push({
      id: `onetime-${tier}`,
      category: 'website',
      name: name,
      price: parseFloat(price),
      kind: 'one-time',
      setupFee: 0
    });

    renderServices();
    renderCart();
  }

  function selectMonthly(data) {
    const { tier, contract, name, price, setup, savings } = data;

    // Remove existing website from cart
    state.cart = state.cart.filter(item => item.category !== 'website');

    // Set state
    state.websiteType = 'monthly';
    state.websiteTier = tier;
    state.contractLength = contract;
    state.expandedAccordion = tier;

    // Add to cart
    state.cart.push({
      id: `monthly-${tier}-${contract}`,
      category: 'website',
      name: name,
      price: parseFloat(price),
      kind: 'monthly',
      setupFee: parseFloat(setup),
      contractLength: `${contract} months`,
      savings: savings ? parseFloat(savings) : 0
    });

    renderServices();
    renderCart();
  }

  function toggleAddOn(data) {
    const { id, name, price, setup } = data;
    const index = state.cart.findIndex(item => item.id === id);

    if (index >= 0) {
      state.cart.splice(index, 1);
    } else {
      const category = id.includes('gideon') ? 'addon-gideon' : 'addon-other';
      state.cart.push({
        id: id,
        category: category,
        name: name,
        price: parseFloat(price),
        kind: 'monthly',
        setupFee: parseFloat(setup)
      });
    }

    renderServices();
    renderCart();
  }

  function renderCart() {
    if (!state.cart.length) {
      cartItems.innerHTML = `
        <div class="bg-black/40 border border-dashed border-cyan-500/30 rounded-lg p-4 text-sm text-gray-400">
          Nothing selected yet. Choose your website option above to get started.
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
      const contractNote = item.contractLength ? `<p class="text-xs text-gray-500">${item.contractLength}</p>` : '';
      const savingsNote = item.savings ? `<p class="text-xs text-green-400">Saves $${item.savings}</p>` : '';

      return `
        <div class="bg-black/40 border border-cyan-500/40 rounded-lg p-4">
          <div class="flex justify-between gap-4">
            <div>
              <p class="font-semibold text-white">${item.name}</p>
              <p class="text-xs uppercase tracking-[0.35em] text-gray-400 mt-1">${item.kind === 'monthly' ? 'Recurring' : 'One-Time'}</p>
              ${contractNote}
              ${savingsNote}
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-cyan-300">${formatCurrency(item.price)}${item.kind === 'monthly' ? '<span class="text-xs text-gray-400">/mo</span>' : ''}</p>
              ${setupFeeNote}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const total = calculateTotal();
    const deposit = total * 0.5;
    const balance = total - deposit;

    cartTotal.textContent = formatCurrency(total);
    cartDeposit.textContent = formatCurrency(deposit);
    cartBalance.textContent = formatCurrency(balance);
    checkoutButton.disabled = false;
  }

  function calculateTotal() {
    return state.cart.reduce((sum, item) => {
      const basePrice = item.price;
      const setupFee = item.setupFee || 0;
      // For deposit calculation: one-time items are full price, monthly items are first month
      return sum + basePrice + setupFee;
    }, 0);
  }

  function formatCurrency(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return '$0';
    return amount % 1 === 0
      ? `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  console.log('Package builder initialized');
  renderServices();
  renderCart();
  console.log('Initial render complete');
});
