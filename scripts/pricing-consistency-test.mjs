#!/usr/bin/env node
/**
 * Pricing consistency test.
 *
 * Loads data/pricing.json (the authoritative manifest) and scans every
 * price-bearing HTML/JS file in the repo for dollar amounts. For each
 * amount found, it checks whether it's a value the manifest knows about
 * — WaaS setup/monthly, one-time price, or add-on price.
 *
 * Any dollar amount that doesn't match the manifest is reported as a
 * potential drift. This DOES NOT FAIL CI in Phase 2 Step 2: the UI
 * hasn't been refactored to be manifest-driven yet, so lots of drift
 * is expected right now. It's a baseline tool.
 *
 * After Step 4 lands and packages.html/pricing-tabs.js are rendering
 * directly from the manifest, the --strict flag can be flipped on and
 * this becomes a real CI gate.
 *
 * Usage:
 *   node scripts/pricing-consistency-test.mjs           (report, exit 0)
 *   node scripts/pricing-consistency-test.mjs --strict  (report + exit 1 on drift)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const STRICT = process.argv.includes('--strict')

const manifest = JSON.parse(readFileSync(join(REPO_ROOT, 'data/pricing.json'), 'utf-8'))

// Build the set of "known-good" prices from the manifest. Any $ amount in
// the HTML that matches one of these is considered sync'd.
const knownPrices = new Set()
for (const t of manifest.waasTiers) {
  knownPrices.add(t.setupFee)
  knownPrices.add(t.monthly12)
  knownPrices.add(t.monthly24)
  // Savings math — likely to appear as "$900", "$1,068" etc.
  const annualSavings = (t.monthly12 - t.monthly24) * 24
  if (annualSavings > 0) knownPrices.add(annualSavings)
}
for (const b of manifest.oneTimeBuilds) knownPrices.add(b.price)
for (const a of manifest.addOns) {
  if (a.monthly > 0) knownPrices.add(a.monthly)
  if (a.setup > 0) knownPrices.add(a.setup)
}

// Scan HTML + JS for $ amounts. Ignore blog posts (editorial content,
// not pricing surfaces) and location pages (identical templates — would
// 10x the noise).
//
// Match $X.XX, $X,XXX, $X, AND the common "$X<span>.XX</span>" split form
// used across services/*.html when the cents are rendered smaller than
// the dollars. The optional (?:<[^>]+>)? absorbs an intervening tag.
const PRICE_RE = /\$([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)(?:(?:<[^>]+>)?\.([0-9]{1,2}))?/g

// Explicit allow-list of prices that legitimately appear in editorial
// content and are NOT claims about Gideon's current pricing. Add here
// as needed — don't dilute the manifest just to silence a signal.
const EDITORIAL_WHITELIST = new Set([
  // Blog storytelling: Brie's prior vendor $300/mo (feedback story, not a Gideon price)
  300,
  // About page: "quoted $8,000" origin story (historical, not current pricing)
  8000,
  // Modern Drive / Hark SaaS pricing lives on their OWN sites — not Gideon pricing
  19, 49, 39, 89, 79, 45,
])

const SKIP_DIRS = new Set(['node_modules', '.git', 'aedocs', 'proposals', 'email-templates', 'mockups', 'templates', '_backup_old_theme', 'api', 'js'])
const SKIP_FILE_PATTERNS = [
  /^blog\//,                         // editorial
  /\.(bak|old|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/i,
  // Internal-only docs — not customer-facing
  /^(CMS_IMPLEMENTATION_GUIDE|CMS_MANAGEMENT_GUIDE|GIDEON-EMAIL-TEMPLATES|JS_GYMNASTICS_MEETING_PREP|SENDGRID-SETUP|README)\.md$/i,
  // Location pages: identical templates. One sample is enough.
  /^(amarillo|athens-ga|atlanta|austin|auto-demo|bentonville|boise|boston|bowling-green|cape-coral|castle-rock|charlotte|chattanooga|chicago|clarksville|colorado-springs|columbus|contractor-demo|crm-demo|dallas|denver|detroit|dodge-city|ecommerce-demo|education-demo|farmington|fayetteville|findlay|fitness-demo|fort-mill|gatlinburg|gillette|havelock|houston|huntsville|indianapolis|jacksonville|johns-creek|kalamazoo|kansas-city|killeen|lawton|los-angeles|meridian|miami|minneapolis|moab|moses-lake|musician-demo|myrtle-beach|nashville|new-business|nogales|ocala|orlando|palm-coast|pensacola|phoenix|pittsburgh|port-st-lucie|portland|prescott|professional-demo|property-demo|prosper|raleigh|restaurant-demo|salon-demo|san-antonio|san-diego|san-jose|san-marcos|savannah|scottsbluff|seattle|sierra-vista|software-free|spokane|st-george|tampa|toledo|waco|williston)\.html$/,
]

function shouldSkip(relPath) {
  for (const re of SKIP_FILE_PATTERNS) if (re.test(relPath)) return true
  return false
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const rel = relative(REPO_ROOT, full)
    if (SKIP_DIRS.has(entry)) continue
    const s = statSync(full)
    if (s.isDirectory()) walk(full, acc)
    else if (/\.(html|js|md)$/.test(entry) && !shouldSkip(rel)) acc.push(full)
  }
  return acc
}

const files = walk(REPO_ROOT)
const drifts = []

for (const f of files) {
  const rel = relative(REPO_ROOT, f)
  const content = readFileSync(f, 'utf-8')
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    PRICE_RE.lastIndex = 0
    let m
    while ((m = PRICE_RE.exec(line))) {
      const dollars = parseInt(m[1].replace(/,/g, ''), 10)
      const cents = m[2] ? parseFloat('0.' + m[2].padEnd(2, '0')) : 0
      const value = dollars + cents
      if (knownPrices.has(value)) continue
      if (EDITORIAL_WHITELIST.has(value)) continue
      drifts.push({ file: rel, line: i + 1, match: m[0], value })
    }
  }
}

// Summary
console.log(`Scanned ${files.length} files against manifest ${manifest.sourceRepo}@${manifest.sourceCommit.slice(0, 7)}`)
console.log(`Known manifest prices: ${[...knownPrices].sort((a,b)=>a-b).map(v => '$' + v).join(', ')}`)
console.log('')

if (drifts.length === 0) {
  console.log('[32m✓ no price drift detected[0m')
  process.exit(0)
}

// Group by file for readability
const byFile = new Map()
for (const d of drifts) {
  if (!byFile.has(d.file)) byFile.set(d.file, [])
  byFile.get(d.file).push(d)
}

console.log(`[33m⚠ Found ${drifts.length} dollar amount(s) in ${byFile.size} file(s) not represented in the manifest:[0m`)
console.log('')
for (const [file, items] of [...byFile.entries()].sort()) {
  console.log(`  ${file}`)
  for (const d of items) console.log(`    L${d.line.toString().padStart(4)}: ${d.match}`)
}

console.log('')
if (STRICT) {
  console.error('[31m✗ strict mode: failing due to pricing drift[0m')
  process.exit(1)
} else {
  console.log('[33m(info-only mode — rerun with --strict to fail CI on drift)[0m')
  process.exit(0)
}
