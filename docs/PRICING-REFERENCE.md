# Gideon Codeworks — Pricing Reference

**Last Updated:** 2026-10-28
**Source of truth:** `data/pricing.json` (generated from `gideon-dashboard/src/lib/pricing-tiers.ts` + `one-time-builds.ts`). See `docs/PRICING-SYNC.md` for the end-to-end sync architecture.
**Important:** This document is a human-readable summary. If this file disagrees with `data/pricing.json`, the manifest wins. Keep this doc updated when pricing changes land.

---

## 1. One-time website builds

Pay once, own the site. Fixed project price, defined post-launch support window.

| Package | Price | Pages | Post-launch support |
|---|---:|---|---|
| Starter | $2,497 | 5 | 30 days |
| Growth | $3,497 | 10 | 60 days |
| Domination | $4,997 | Unlimited | 90 days |

**Hosting:** policy pending — see `docs/PHASE-2-PENDING-DECISIONS.md` item #1. Current website renders a safe placeholder ("Hosting arrangements covered in your proposal") until the business decision is confirmed.

## 2. Website-as-a-Service (WaaS) — managed plans

Setup fee + monthly subscription. We host, maintain, update, support. Choose a 12-month or discounted 24-month agreement.

| Package | Setup | 12-mo monthly | 24-mo monthly | Pages |
|---|---:|---:|---:|---|
| Landing Page | $199 | $49.99 | $49.99 | 1 |
| Starter | $497 | $250 | $212.50 | 5 |
| Growth | $697 | $297 | $252.50 | 10 |
| Domination | $997 | $349 | $299 | Unlimited |
| Enterprise | $4,997 | $799 | $699 | Unlimited + active management |

### 24-month savings (vs 24 months at the 12-month rate)

- Starter: $900
- Growth: $1,068
- Domination: $1,200
- Enterprise: $2,400
- Landing Page: no discount (flat rate at both terms)

### What's included on every managed WaaS plan

- Managed hosting + SSL
- Content updates (we do them for you)
- Ongoing maintenance + security monitoring
- Standard AI chatbot for lead capture
- Technical support
- Monthly performance report

## 3. Add-on services (fixed catalog)

Attachable to any managed WaaS plan during the proposal.

| Add-on | Monthly | One-time setup |
|---|---:|---:|
| E-commerce Platform | $50 | $500 |
| Social Media Management | $250 | — |
| Google Ads Management | $297 | — |
| SEO + AEO Basic | $297 | — |
| SEO + AEO Pro | $597 | — |
| SEO + AEO Advanced | $997 | — |
| SEO + AEO Enterprise | $997 | — |

**Note on chatbots:** the standard AI chatbot is included in every WaaS plan. Advanced / custom-trained / multi-flow chatbots are quoted per project. Previously there was a $99/mo "Chatbot Basic" tier in the old builder — removed from the manifest because selling a feature that's already included would be double-charging. See `docs/PHASE-2-PENDING-DECISIONS.md` item #5.

## 4. Services quoted per project

Not on the fixed-price catalog. Scope-dependent — priced per project after a discovery call.

- **Custom software** — multi-tenant SaaS, CRM systems, client portals, business dashboards, workflow automation. Portfolio reference: The Modern Drive, HarkDog, GoodCattery.
- **Mobile apps** — iOS and Android, native or Capacitor/PWA shell.
- **Branding** — logo, type system, palette, brand guidelines delivered as a reusable system.
- **Advanced chatbot & AI features** — anything beyond the standard WaaS chatbot.

## 5. Not available

The following services are no longer offered. Any legacy references should be removed when encountered:

- Standalone "Gideon AI Chatbot Basic ($99/mo + $497 setup)" and "Pro ($299/mo + $997 setup)" tiers — superseded by the included-with-WaaS chatbot + custom-quote path (above).
- "Marketing Bundles" packages at $459–$1,499 — the pricing UI now sells WaaS tiers + add-ons separately, which composes to the same thing with clearer pricing.

## 6. Where this gets consumed

- `data/pricing.json` — authoritative manifest (synced from dashboard)
- `js/pricing-manifest.js` — browser helper for reading the manifest
- `js/pricing-page.js` — renderer for `packages.html` (tiers, add-ons, builder)
- `packages.html` — the pricing page itself
- `get-started.html` — reads `?model=…&tier=…&term=…` URL params to pre-fill the lead form with the selected package

Everything above reads prices from `data/pricing.json` at runtime. If a hardcoded $ amount shows up in a page that isn't on this list, treat it as drift — the `npm run test:pricing-consistency` script will surface it.
