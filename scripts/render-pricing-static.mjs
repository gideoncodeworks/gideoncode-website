#!/usr/bin/env node
/**
 * Prerender static pricing HTML into packages.html.
 *
 * Reads data/pricing.json (the dashboard-authoritative manifest) and
 * writes static markup for the WaaS tier cards, outright tier cards,
 * and add-on grid INSIDE their respective containers on packages.html.
 *
 * Why: pricing-page.js hydrates these containers at runtime by fetching
 * data/pricing.json. That's fine for Google (which renders JS), but
 * most AI crawlers and some less-sophisticated bots never see the
 * prices. This script makes the current snapshot visible as raw HTML
 * so prices are crawlable even with JS disabled.
 *
 * Idempotent: replaces content between <!-- STATIC-PRICING:start --> and
 * <!-- STATIC-PRICING:end --> markers inside each container. Run again
 * after any manifest sync.
 *
 * Usage: npm run render:pricing-static
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MANIFEST = resolve(ROOT, 'data/pricing.json')
const PACKAGES_HTML = resolve(ROOT, 'packages.html')

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf-8'))

// ─── Feature lists (match js/pricing-page.js for display consistency) ───
const WAAS_FEATURES = {
  landing_page: ['Single-page site, mobile-optimized', 'Hosting + SSL + updates included', 'Lead capture form built in', 'For launches, campaigns, or one-service businesses'],
  starter: ['5 custom pages', 'Hosting + SSL + unlimited content updates', 'AI chatbot for after-hours lead capture', 'Basic on-page SEO + schema'],
  growth: ['10 custom pages', 'Everything in Starter', 'Expanded SEO + service pages', 'Monthly performance snapshot'],
  domination: ['Unlimited pages', 'Everything in Growth', 'City-level SEO + AEO (AI answer-engine) pages', 'Priority support, same-day update turnaround'],
  enterprise: ['Unlimited pages + active management', 'Everything in Domination', 'Monthly strategy call', 'Custom integrations, A/B testing, advanced analytics'],
}
const OUTRIGHT_FEATURES = {
  starter: ['5 custom pages', 'Mobile-responsive, SEO-ready', 'Training session included'],
  growth: ['10 custom pages', 'Everything in Starter', 'Expanded SEO foundations', 'Chatbot setup (optional add-on)'],
  domination: ['Unlimited pages', 'Everything in Growth', 'City pages, schema, deep SEO prep', 'Advanced on-page optimization'],
}
const FEATURED_WAAS = new Set(['growth'])
const FEATURED_OUTRIGHT = new Set(['growth'])

const money = (n) => {
  if (n == null || Number.isNaN(n)) return ''
  const isInt = Math.round(n) === n
  return '$' + (isInt ? n.toLocaleString('en-US') : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
}
const moneyRound = (n) => '$' + Math.round(n).toLocaleString('en-US')
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))
const waasSavings24 = (t) => Math.round((t.monthly12 - t.monthly24) * 24 * 100) / 100

function hostingLabel() {
  const hp = manifest.hostingPolicy
  switch (hp.oneTime) {
    case 'included-1yr': return '1 year of hosting included'
    case 'billed-separately': return 'Hosting billed separately'
    case 'customer-managed': return 'You manage hosting post-launch'
    case 'included-then-optional': {
      const m = hp.includedMonths ?? 3
      const monthly = hp.continuationMonthly ?? 0
      return `${m} months of hosting included · then host it yourself, or stay on Gideon hosting for ${moneyRound(monthly)}/mo`
    }
    default: return 'Hosting arrangements covered in your proposal'
  }
}

function renderWaasTier(tier, termMonths = 24) {
  const monthly = termMonths === 24 ? tier.monthly24 : tier.monthly12
  const savings = termMonths === 24 ? waasSavings24(tier) : 0
  const featured = FEATURED_WAAS.has(tier.slug)
  const features = WAAS_FEATURES[tier.slug] || []
  const pages = typeof tier.pages === 'number' ? `${tier.pages} page${tier.pages > 1 ? 's' : ''}` : tier.pages
  const savingsPill = savings > 0
    ? `<span class="tier-savings">Save ${moneyRound(savings)} over 24 months</span>`
    : (termMonths === 24 ? '<span class="tier-savings" style="background: rgba(148,163,184,0.1); color: var(--text-muted);">Flat rate</span>' : '')
  const params = new URLSearchParams({ model: 'waas', tier: tier.slug, term: String(termMonths) })
  return `<div class="tier-card${featured ? ' tier-card--featured' : ''}">
  <h3>${esc(tier.name)}</h3>
  ${savingsPill}
  <div><span class="tier-price">${money(monthly)}</span><span class="tier-price-unit">/mo</span></div>
  <p class="tier-setup">+ ${money(tier.setupFee)} one-time setup &middot; ${termMonths}-month agreement</p>
  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 0.5rem 0;">${esc(pages)}</p>
  <ul class="tier-features">${features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
  <a href="get-started.html?${params.toString()}" class="btn ${featured ? 'btn-primary' : 'btn-outline'}" style="width: 100%; justify-content: center;">Request a Proposal</a>
</div>`
}

function renderOutrightTier(tier) {
  const featured = FEATURED_OUTRIGHT.has(tier.slug)
  const features = OUTRIGHT_FEATURES[tier.slug] || []
  const pages = typeof tier.pages === 'number' ? `${tier.pages} pages` : tier.pages
  const params = new URLSearchParams({ model: 'outright', tier: tier.slug })
  return `<div class="tier-card${featured ? ' tier-card--featured' : ''}">
  <h3>${esc(tier.name)}</h3>
  <div><span class="tier-price">${money(tier.price)}</span><span class="tier-price-unit"> one-time</span></div>
  <p class="tier-setup">${esc(pages)} &middot; ${tier.supportDays}-day post-launch support</p>
  <ul class="tier-features">
    <li>You own the website and source files</li>
    ${features.map(f => `<li>${esc(f)}</li>`).join('')}
  </ul>
  <a href="get-started.html?${params.toString()}" class="btn ${featured ? 'btn-primary' : 'btn-outline'}" style="width: 100%; justify-content: center;">Request a Proposal</a>
</div>`
}

function renderAddOn(a) {
  const parts = []
  if (a.monthly) parts.push(`${money(a.monthly)}/mo`)
  if (a.setup) parts.push(`+ ${money(a.setup)} setup`)
  return `<div class="service-card" style="padding: 1.1rem 1.25rem;">
  <p style="font-weight: 700; color: var(--text-primary); margin: 0 0 0.4rem 0;">${esc(a.name)}</p>
  <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">${esc(parts.join(' '))}</p>
</div>`
}

// Build static blocks
const waasBlock = manifest.waasTiers.map(t => renderWaasTier(t, 24)).join('\n')
const outrightBlock = manifest.oneTimeBuilds.map(renderOutrightTier).join('\n') +
  `\n<p style="grid-column: 1/-1; text-align: center; margin: 1rem 0 0 0; font-size: 0.875rem; color: var(--text-muted); font-style: italic;">${esc(hostingLabel())}</p>`
const addOnsBlock = manifest.addOns.map(renderAddOn).join('\n')

const MARKERS = {
  waas:     { start: '<!-- STATIC-PRICING:waas:start -->', end: '<!-- STATIC-PRICING:waas:end -->' },
  outright: { start: '<!-- STATIC-PRICING:outright:start -->', end: '<!-- STATIC-PRICING:outright:end -->' },
  addons:   { start: '<!-- STATIC-PRICING:addons:start -->', end: '<!-- STATIC-PRICING:addons:end -->' },
}

function wrap(key, inner) {
  return `${MARKERS[key].start}\n${inner}\n${MARKERS[key].end}`
}

function injectInto(html, containerIdRegex, key, inner) {
  // If markers already exist inside this container, replace between them
  const markerRe = new RegExp(`${MARKERS[key].start}[\\s\\S]*?${MARKERS[key].end}`)
  if (markerRe.test(html)) {
    return html.replace(markerRe, wrap(key, inner))
  }
  // Otherwise inject just inside the opening tag of the container
  const openRe = new RegExp(`(<div\\s+id="${containerIdRegex}"[^>]*>)`)
  return html.replace(openRe, (m) => `${m}\n${wrap(key, inner)}`)
}

let html = readFileSync(PACKAGES_HTML, 'utf-8')
html = injectInto(html, 'waas-tiers',     'waas',     waasBlock)
html = injectInto(html, 'outright-tiers', 'outright', outrightBlock)
html = injectInto(html, 'add-ons-grid',   'addons',   addOnsBlock)
writeFileSync(PACKAGES_HTML, html, 'utf-8')

console.log(`✓ prerendered pricing into packages.html`)
console.log(`  ${manifest.waasTiers.length} WaaS tier cards (24-month default)`)
console.log(`  ${manifest.oneTimeBuilds.length} one-time build cards + hosting note`)
console.log(`  ${manifest.addOns.length} add-on cards`)
console.log(`  manifest source: ${manifest.sourceRepo}@${manifest.sourceCommit.slice(0, 7)}`)
