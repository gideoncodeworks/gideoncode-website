/**
 * packages.html runtime:
 *   - Model tabs (Managed / Outright) with URL anchor sync
 *   - 12/24 term toggle (Managed only)
 *   - Tier card renderer, reads from the pricing manifest
 *   - Add-on grid renderer
 *   - Package Builder (Model, Tier, Term, Add-ons, Contact → /api/form-submit)
 *
 * Pricing values are read live from /data/pricing.json via the
 * GideonPricing helper. No prices are hardcoded here.
 *
 * The "Request My Proposal" form POSTs to the same /api/form-submit
 * endpoint used by get-started.html — carrying the builder's
 * selections into the message / project-details fields so the lead
 * lands in Josh's dashboard with full context. No online checkout.
 */
(function () {
  'use strict'

  // Which tiers show the "Most Popular" visual callout. Keep this short.
  const FEATURED_WAAS = new Set(['growth'])
  const FEATURED_OUTRIGHT = new Set(['growth'])

  // Feature bullet lists per tier. Kept in JS (not manifest) because they
  // describe UX, not pricing. Dashboard owns prices; website owns copy.
  const WAAS_FEATURES = {
    landing_page: [
      'Single-page site, mobile-optimized',
      'Hosting + SSL + updates included',
      'Lead capture form built in',
      'For launches, campaigns, or one-service businesses',
    ],
    starter: [
      '5 custom pages',
      'Hosting + SSL + unlimited content updates',
      'AI chatbot for after-hours lead capture',
      'Basic on-page SEO + schema',
    ],
    growth: [
      '10 custom pages',
      'Everything in Starter',
      'Expanded SEO + service pages',
      'Monthly performance snapshot',
    ],
    domination: [
      'Unlimited pages',
      'Everything in Growth',
      'City-level SEO + AEO (AI answer-engine) pages',
      'Priority support, same-day update turnaround',
    ],
    enterprise: [
      'Unlimited pages + active management',
      'Everything in Domination',
      'Monthly strategy call',
      'Custom integrations, A/B testing, advanced analytics',
    ],
  }

  // Note: "You own the website and source files" is injected first for
  // every outright tier by the renderer, so it is NOT repeated here.
  const OUTRIGHT_FEATURES = {
    starter: [
      '5 custom pages',
      'Mobile-responsive, SEO-ready',
      'Training session included',
    ],
    growth: [
      '10 custom pages',
      'Everything in Starter',
      'Expanded SEO foundations',
      'Chatbot setup (optional add-on)',
    ],
    domination: [
      'Unlimited pages',
      'Everything in Growth',
      'City pages, schema, deep SEO prep',
      'Advanced on-page optimization',
    ],
  }

  // ──────────────────────────────────────────────────────────────────
  // Boot
  // ──────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', async () => {
    let pricing
    try {
      pricing = await GideonPricing.load()
    } catch (err) {
      console.error('[pricing-page] manifest load failed:', err)
      renderManifestError(err)
      return
    }

    wireModelTabs()
    wireTermToggle(pricing)
    renderWaasTiers(pricing, 24)
    renderOutrightTiers(pricing)
    renderAddOns(pricing)
    renderHostingNote(pricing)

    wireBuilder(pricing)

    // Deep-link anchors #managed / #outright / #builder from the homepage
    openPanelFromHash()
    window.addEventListener('hashchange', openPanelFromHash)
  })

  function renderManifestError(err) {
    const panels = ['waas-tiers', 'outright-tiers', 'add-ons-grid']
    for (const id of panels) {
      const el = document.getElementById(id)
      if (!el) continue
      el.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 1.5rem; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; color: var(--text-primary);">
          <p style="font-weight: 700; margin-bottom: 0.5rem;">Pricing unavailable</p>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">The pricing manifest didn't load. Please <a href="get-started.html" style="color: var(--primary); font-weight: 600;">request a proposal</a> and we'll send you current pricing by email.</p>
        </div>`
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // Model tabs (Managed / Outright)
  // ──────────────────────────────────────────────────────────────────

  function wireModelTabs() {
    const tabManaged = document.getElementById('tab-managed')
    const tabOutright = document.getElementById('tab-outright')
    const panelManaged = document.getElementById('managed')
    const panelOutright = document.getElementById('outright')

    function activate(which) {
      const managed = which === 'managed'
      tabManaged.setAttribute('aria-selected', String(managed))
      tabOutright.setAttribute('aria-selected', String(!managed))
      tabManaged.classList.toggle('model-tab--active', managed)
      tabOutright.classList.toggle('model-tab--active', !managed)
      panelManaged.hidden = !managed
      panelOutright.hidden = managed
    }

    tabManaged.addEventListener('click', () => activate('managed'))
    tabOutright.addEventListener('click', () => activate('outright'))
    window.__activatePricingTab = activate
  }

  function openPanelFromHash() {
    const h = window.location.hash
    if (h === '#outright') window.__activatePricingTab && window.__activatePricingTab('outright')
    else if (h === '#managed') window.__activatePricingTab && window.__activatePricingTab('managed')
  }

  // ──────────────────────────────────────────────────────────────────
  // Term toggle (12 / 24)
  // ──────────────────────────────────────────────────────────────────

  function wireTermToggle(pricing) {
    const buttons = document.querySelectorAll('.term-tab')
    const callout = document.getElementById('term-savings-callout')
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const term = parseInt(btn.dataset.term, 10)
        buttons.forEach(b => {
          const active = b === btn
          b.classList.toggle('term-tab--active', active)
          b.setAttribute('aria-checked', String(active))
        })
        renderWaasTiers(pricing, term)
        if (callout) {
          callout.textContent = term === 24
            ? '24-month agreement selected — savings shown on each card.'
            : '12-month agreement selected — switch to 24-month to see discounted pricing.'
        }
      })
    })
  }

  // ──────────────────────────────────────────────────────────────────
  // Tier card renderers
  // ──────────────────────────────────────────────────────────────────

  function renderWaasTiers(pricing, termMonths) {
    const container = document.getElementById('waas-tiers')
    if (!container) return

    container.innerHTML = pricing.waasTiers.map(tier => {
      const monthly = pricing.waasMonthly(tier.slug, termMonths)
      const savings = termMonths === 24 ? pricing.waasSavings24(tier.slug) : 0
      const featured = FEATURED_WAAS.has(tier.slug)
      const features = WAAS_FEATURES[tier.slug] || []

      const savingsPill = savings > 0
        ? `<span class="tier-savings">Save ${pricing.formatMoneyRounded(savings)} over 24 months</span>`
        : (termMonths === 24 ? '<span class="tier-savings" style="background: rgba(148,163,184,0.1); color: var(--text-muted);">Flat rate</span>' : '')

      const pages = typeof tier.pages === 'number' ? `${tier.pages} page${tier.pages > 1 ? 's' : ''}` : tier.pages

      const proposalParams = new URLSearchParams({
        model: 'waas',
        tier: tier.slug,
        term: String(termMonths),
      })

      return `
        <div class="tier-card${featured ? ' tier-card--featured' : ''}">
          <h3>${escapeHtml(tier.name)}</h3>
          ${savingsPill}
          <div><span class="tier-price">${pricing.formatMoney(monthly)}</span><span class="tier-price-unit">/mo</span></div>
          <p class="tier-setup">+ ${pricing.formatMoney(tier.setupFee)} one-time setup &middot; ${termMonths}-month agreement</p>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 0.5rem 0;">${escapeHtml(pages)}</p>
          <ul class="tier-features">${features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
          <a href="get-started.html?${proposalParams.toString()}" class="btn ${featured ? 'btn-primary' : 'btn-outline'}" style="width: 100%; justify-content: center;">
            Request a Proposal
          </a>
        </div>`
    }).join('')
  }

  function renderOutrightTiers(pricing) {
    const container = document.getElementById('outright-tiers')
    if (!container) return

    container.innerHTML = pricing.oneTimeBuilds.map(tier => {
      const featured = FEATURED_OUTRIGHT.has(tier.slug)
      const features = OUTRIGHT_FEATURES[tier.slug] || []
      const pages = typeof tier.pages === 'number' ? `${tier.pages} pages` : tier.pages
      const proposalParams = new URLSearchParams({ model: 'outright', tier: tier.slug })

      return `
        <div class="tier-card${featured ? ' tier-card--featured' : ''}">
          <h3>${escapeHtml(tier.name)}</h3>
          <div><span class="tier-price">${pricing.formatMoney(tier.price)}</span><span class="tier-price-unit"> one-time</span></div>
          <p class="tier-setup">${escapeHtml(pages)} &middot; ${tier.supportDays}-day post-launch support</p>
          <ul class="tier-features">
            <li>You own the website and source files</li>
            ${features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
          </ul>
          <a href="get-started.html?${proposalParams.toString()}" class="btn ${featured ? 'btn-primary' : 'btn-outline'}" style="width: 100%; justify-content: center;">
            Request a Proposal
          </a>
        </div>`
    }).join('')
  }

  function renderAddOns(pricing) {
    const container = document.getElementById('add-ons-grid')
    if (!container) return

    container.innerHTML = pricing.addOns.map(a => {
      const parts = []
      if (a.monthly) parts.push(`${pricing.formatMoney(a.monthly)}/mo`)
      if (a.setup) parts.push(`+ ${pricing.formatMoney(a.setup)} setup`)
      return `
        <div class="service-card" style="padding: 1.1rem 1.25rem;">
          <p style="font-weight: 700; color: var(--text-primary); margin: 0 0 0.4rem 0;">${escapeHtml(a.name)}</p>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">${parts.join(' ')}</p>
        </div>`
    }).join('')
  }

  function renderHostingNote(pricing) {
    const el = document.getElementById('hosting-note')
    if (!el) return
    el.textContent = pricing.hostingPolicyLabel()
    if (pricing.raw.hostingPolicy.oneTime === 'pending') {
      el.style.fontStyle = 'italic'
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // Package Builder
  // ──────────────────────────────────────────────────────────────────

  function wireBuilder(pricing) {
    const root = document.getElementById('builder-root')
    if (!root) return

    const state = {
      model: 'waas',
      tier: null,
      term: 24,
      addons: new Set(),
    }

    const tierList = document.getElementById('builder-tier-list')
    const addonsEl = document.getElementById('builder-addons')
    const termFs = document.getElementById('builder-term-fieldset')

    function renderTierList() {
      const tiers = state.model === 'waas' ? pricing.waasTiers : pricing.oneTimeBuilds
      // If current tier isn't available in this model, reset
      if (state.tier && !tiers.find(t => t.slug === state.tier)) state.tier = null

      tierList.innerHTML = tiers.map(t => {
        const price = state.model === 'waas'
          ? `${pricing.formatMoney(pricing.waasMonthly(t.slug, state.term))}/mo + ${pricing.formatMoney(t.setupFee)} setup`
          : `${pricing.formatMoney(t.price)} one-time`
        const checked = state.tier === t.slug ? 'checked' : ''
        return `
          <label class="builder-choice">
            <input type="radio" name="builder-tier" value="${t.slug}" ${checked}>
            <span class="builder-choice-title">${escapeHtml(t.name)}</span>
            <span class="builder-choice-sub">${price}</span>
          </label>`
      }).join('')
      tierList.querySelectorAll('input').forEach(i => {
        i.addEventListener('change', () => {
          state.tier = i.value
          renderSummary()
        })
      })
      // Managed add-ons apply to any WaaS tier
      renderAddons()
      termFs.style.display = state.model === 'waas' ? '' : 'none'
    }

    function renderAddons() {
      if (state.model !== 'waas') {
        addonsEl.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Add-ons apply to managed plans. For one-time builds, additional services are quoted after launch.</p>'
        state.addons.clear()
        return
      }
      addonsEl.innerHTML = pricing.addOns.map(a => {
        const parts = []
        if (a.monthly) parts.push(`${pricing.formatMoney(a.monthly)}/mo`)
        if (a.setup) parts.push(`+ ${pricing.formatMoney(a.setup)} setup`)
        const checked = state.addons.has(a.slug) ? 'checked' : ''
        return `
          <label class="addon-item">
            <input type="checkbox" value="${a.slug}" ${checked}>
            <div>
              <span class="addon-item-name">${escapeHtml(a.name)}</span>
              <span class="addon-item-price">${parts.join(' ')}</span>
            </div>
          </label>`
      }).join('')
      addonsEl.querySelectorAll('input').forEach(i => {
        i.addEventListener('change', () => {
          if (i.checked) state.addons.add(i.value); else state.addons.delete(i.value)
          renderSummary()
        })
      })
    }

    function renderSummary() {
      const body = document.getElementById('builder-summary-body')
      if (!state.tier) {
        body.textContent = 'Choose a package above to see pricing.'
        return
      }

      const lines = []
      if (state.model === 'waas') {
        const t = pricing.getWaasTier(state.tier)
        const monthly = pricing.waasMonthly(state.tier, state.term)
        lines.push(`<strong>${escapeHtml(t.name)}</strong> — Website-as-a-Service, ${state.term}-month agreement`)
        lines.push(`<strong>${pricing.formatMoney(monthly)}/mo</strong> + ${pricing.formatMoney(t.setupFee)} one-time setup`)
        if (state.term === 24) {
          const savings = pricing.waasSavings24(state.tier)
          if (savings > 0) lines.push(`<em style="color: #22c55e;">Save ${pricing.formatMoneyRounded(savings)} over 24 months vs 12-month rate</em>`)
        }
        if (state.addons.size > 0) {
          let addonMonthly = 0, addonSetup = 0
          const names = []
          for (const slug of state.addons) {
            const a = pricing.getAddOn(slug)
            addonMonthly += a.monthly
            addonSetup += a.setup
            names.push(a.name)
          }
          lines.push(`Add-ons: ${names.map(escapeHtml).join(', ')}`)
          lines.push(`Add-ons total: <strong>${pricing.formatMoney(addonMonthly)}/mo</strong>${addonSetup ? ` + ${pricing.formatMoney(addonSetup)} setup` : ''}`)
          const totalMonthly = monthly + addonMonthly
          const totalSetup = t.setupFee + addonSetup
          lines.push(`<span style="font-size: 1.05rem; color: var(--text-primary);">Monthly total: <strong>${pricing.formatMoney(totalMonthly)}</strong> &middot; Setup total: <strong>${pricing.formatMoney(totalSetup)}</strong></span>`)
        }
      } else {
        const b = pricing.getOneTimeBuild(state.tier)
        lines.push(`<strong>${escapeHtml(b.name)}</strong> — one-time build, you own the site`)
        lines.push(`<strong>${pricing.formatMoney(b.price)}</strong> one-time &middot; ${b.supportDays}-day post-launch support`)
        lines.push(`<em style="color: var(--text-muted); font-size: 0.9rem;">${pricing.hostingPolicyLabel()}</em>`)
      }
      body.innerHTML = lines.map(l => `<p style="margin: 0 0 0.5rem 0;">${l}</p>`).join('')
    }

    // Wire model radio
    root.querySelectorAll('input[name="builder-model"]').forEach(i => {
      i.addEventListener('change', () => {
        state.model = i.value
        renderTierList()
        renderSummary()
      })
    })

    // Wire term radio
    root.querySelectorAll('input[name="builder-term"]').forEach(i => {
      i.addEventListener('change', () => {
        state.term = parseInt(i.value, 10)
        renderTierList()
        renderSummary()
      })
    })

    renderTierList()
    renderSummary()

    // Form submit — populate hidden fields with full package summary
    const form = document.getElementById('builder-form')
    form.addEventListener('submit', (e) => {
      if (!state.tier) {
        e.preventDefault()
        alert('Please pick a package before requesting your proposal.')
        return
      }
      document.getElementById('builder-project-details').value = buildProjectDetailsText(pricing, state)
    })
  }

  function buildProjectDetailsText(pricing, state) {
    const lines = ['[Submitted via Package Builder on packages.html]', '']
    if (state.model === 'waas') {
      const t = pricing.getWaasTier(state.tier)
      const monthly = pricing.waasMonthly(state.tier, state.term)
      lines.push(`Model: Website-as-a-Service (managed)`)
      lines.push(`Tier: ${t.name}`)
      lines.push(`Term: ${state.term}-month agreement`)
      lines.push(`Displayed monthly: ${pricing.formatMoney(monthly)}`)
      lines.push(`Displayed setup fee: ${pricing.formatMoney(t.setupFee)}`)
      if (state.term === 24) {
        const sav = pricing.waasSavings24(state.tier)
        if (sav > 0) lines.push(`Displayed 24-month savings: ${pricing.formatMoneyRounded(sav)}`)
      }
      if (state.addons.size > 0) {
        lines.push('')
        lines.push('Selected add-ons:')
        for (const slug of state.addons) {
          const a = pricing.getAddOn(slug)
          const bits = []
          if (a.monthly) bits.push(`${pricing.formatMoney(a.monthly)}/mo`)
          if (a.setup) bits.push(`+ ${pricing.formatMoney(a.setup)} setup`)
          lines.push(`  - ${a.name}  (${bits.join(' ')})`)
        }
      }
    } else {
      const b = pricing.getOneTimeBuild(state.tier)
      lines.push(`Model: One-time build (buy outright)`)
      lines.push(`Tier: ${b.name}`)
      lines.push(`Displayed price: ${pricing.formatMoney(b.price)}`)
      lines.push(`Post-launch support: ${b.supportDays} days`)
      lines.push(`Hosting policy at request time: ${pricing.hostingPolicyLabel()}`)
    }
    lines.push('')
    lines.push(`Manifest source: ${pricing.source.commit.slice(0, 7)} (generated ${pricing.source.generatedAt})`)
    return lines.join('\n')
  }

  function escapeHtml(s) {
    if (s == null) return ''
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
  }
})()
