/**
 * Pricing manifest helper for the public gideoncode.com pricing UI.
 *
 * Fetches /data/pricing.json at page load, exposes typed accessors,
 * and provides formatting helpers used by the Package Builder and the
 * manifest-driven pricing cards on packages.html.
 *
 * The manifest itself is authoritative — this helper does NOT define
 * any prices. It only parses, validates, and renders.
 *
 * Usage:
 *   const pricing = await GideonPricing.load();
 *   pricing.getWaasTier('starter')
 *   pricing.getOneTimeBuild('growth')
 *   pricing.waasSavings24('domination')   // -> 1200
 *   pricing.formatMoney(212.50)           // -> "$212.50"
 *   pricing.formatMoneyRounded(1068)      // -> "$1,068"
 */
window.GideonPricing = (function () {
  'use strict'

  const MANIFEST_URL = '/data/pricing.json'
  const EXPECTED_VERSION = 1

  let cached = null

  async function load() {
    if (cached) return cached

    const resp = await fetch(MANIFEST_URL, { cache: 'no-cache' })
    if (!resp.ok) {
      throw new Error(
        'Pricing manifest fetch failed: HTTP ' + resp.status +
        '. Pricing UI cannot render without data/pricing.json.'
      )
    }

    const raw = await resp.json()

    if (raw.manifestVersion !== EXPECTED_VERSION) {
      throw new Error(
        'Pricing manifest version mismatch: expected ' + EXPECTED_VERSION +
        ', got ' + raw.manifestVersion +
        '. The site code needs an update before accepting this manifest.'
      )
    }

    cached = buildApi(raw)
    return cached
  }

  function buildApi(m) {
    const waasBySlug = {}
    for (const t of m.waasTiers) waasBySlug[t.slug] = t
    const oneTimeBySlug = {}
    for (const b of m.oneTimeBuilds) oneTimeBySlug[b.slug] = b
    const addOnBySlug = {}
    for (const a of m.addOns) addOnBySlug[a.slug] = a

    function getWaasTier(slug) {
      const t = waasBySlug[slug]
      if (!t) throw new Error('Unknown WaaS tier slug: ' + slug)
      return t
    }

    function getOneTimeBuild(slug) {
      const b = oneTimeBySlug[slug]
      if (!b) throw new Error('Unknown one-time build slug: ' + slug)
      return b
    }

    function getAddOn(slug) {
      const a = addOnBySlug[slug]
      if (!a) throw new Error('Unknown add-on slug: ' + slug)
      return a
    }

    // Savings calculated dynamically from the manifest, NEVER hardcoded.
    // Compares the total cost of 24 months at the 24-month rate against
    // the same 24 months at the 12-month rate — matching Josh's rule
    // "do not compare a 24-month contract against the cost of only 12
    // months and call that the savings."
    function waasSavings24(slug) {
      const t = getWaasTier(slug)
      const diff = t.monthly12 - t.monthly24
      return Math.round(diff * 24 * 100) / 100
    }

    function waasMonthly(slug, termMonths) {
      const t = getWaasTier(slug)
      return termMonths === 24 ? t.monthly24 : t.monthly12
    }

    function formatMoney(n) {
      if (n == null || Number.isNaN(n)) return ''
      // Preserve decimals if present ($212.50, $49.99); strip them if clean integer
      const isInt = Math.round(n) === n
      return '$' + (isInt
        ? n.toLocaleString('en-US')
        : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    function formatMoneyRounded(n) {
      if (n == null || Number.isNaN(n)) return ''
      return '$' + Math.round(n).toLocaleString('en-US')
    }

    function hostingPolicyLabel() {
      const hp = m.hostingPolicy
      switch (hp.oneTime) {
        case 'included-1yr': return '1 year of hosting included'
        case 'billed-separately': return 'Hosting billed separately'
        case 'customer-managed': return 'You manage hosting post-launch'
        case 'included-then-optional': {
          const months = hp.includedMonths || 3
          const monthly = hp.continuationMonthly || 0
          const monthlyFmt = monthly > 0 ? formatMoneyRounded(monthly) : ''
          return `${months} months of hosting included · then host it yourself, or stay on Gideon hosting for ${monthlyFmt}/mo`
        }
        case 'pending':
        default: return 'Hosting arrangements covered in your proposal'
      }
    }

    return {
      // Raw access when callers need it
      raw: m,
      source: { commit: m.sourceCommit, generatedAt: m.generatedAt },

      // Collections
      waasTiers: m.waasTiers,
      oneTimeBuilds: m.oneTimeBuilds,
      addOns: m.addOns,

      // Lookups
      getWaasTier,
      getOneTimeBuild,
      getAddOn,

      // Pricing math (dynamic, never cached)
      waasMonthly,
      waasSavings24,

      // Display helpers
      formatMoney,
      formatMoneyRounded,
      hostingPolicyLabel,
    }
  }

  return { load }
})()
