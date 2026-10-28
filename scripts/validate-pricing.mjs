#!/usr/bin/env node
/**
 * Validate data/pricing.json against the manifest schema.
 *
 * Intended to run:
 *   - locally:  node scripts/validate-pricing.mjs
 *   - in CI:    before any deploy
 *
 * Fails loudly on missing/invalid manifest. No silent fallbacks.
 *
 * Zero deps — the website is a static site and we don't want to add
 * a JSON Schema library just for this. The validator inline-implements
 * the subset we need.
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const MANIFEST_PATH = resolve(REPO_ROOT, 'data/pricing.json')

function fail(msg) {
  console.error(`[31m✗ pricing manifest invalid:[0m ${msg}`)
  process.exit(1)
}

function ok(msg) {
  console.log(`[32m✓[0m ${msg}`)
}

if (!existsSync(MANIFEST_PATH)) {
  fail(`data/pricing.json not found. The website build cannot proceed without a pricing manifest. Expected at: ${MANIFEST_PATH}`)
}

let manifest
try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
} catch (e) {
  fail(`data/pricing.json is not valid JSON: ${e.message}`)
}

// Required top-level fields
const requiredTop = ['manifestVersion', 'generatedAt', 'sourceCommit', 'sourceRepo', 'waasTiers', 'oneTimeBuilds', 'addOns', 'hostingPolicy']
for (const k of requiredTop) {
  if (!(k in manifest)) fail(`missing required field "${k}"`)
}

if (manifest.manifestVersion !== 1) {
  fail(`unsupported manifestVersion ${manifest.manifestVersion} (expected 1). The site code may need an update before accepting a newer schema.`)
}

if (typeof manifest.generatedAt !== 'string' || Number.isNaN(Date.parse(manifest.generatedAt))) {
  fail('generatedAt must be an ISO-8601 date-time string')
}

if (typeof manifest.sourceCommit !== 'string' || manifest.sourceCommit.length < 7) {
  fail('sourceCommit must be a non-empty string (minimum 7 chars)')
}

if (!Array.isArray(manifest.waasTiers) || manifest.waasTiers.length === 0) {
  fail('waasTiers must be a non-empty array')
}

// Dashboard business invariant: 24-month rate must not be higher than 12-month rate
for (const t of manifest.waasTiers) {
  for (const field of ['slug', 'name']) {
    if (typeof t[field] !== 'string' || t[field].length === 0) fail(`waas tier missing ${field}: ${JSON.stringify(t)}`)
  }
  for (const field of ['setupFee', 'monthly12', 'monthly24']) {
    if (typeof t[field] !== 'number' || t[field] < 0) fail(`waas "${t.slug}" has invalid ${field}: ${t[field]}`)
  }
  if (t.monthly24 > t.monthly12) {
    fail(`waas "${t.slug}" has monthly24 (${t.monthly24}) > monthly12 (${t.monthly12}). The 24-month discounted rate should always be <= the 12-month rate.`)
  }
  if (!('pages' in t)) fail(`waas "${t.slug}" missing pages`)
}

if (!Array.isArray(manifest.oneTimeBuilds) || manifest.oneTimeBuilds.length === 0) {
  fail('oneTimeBuilds must be a non-empty array')
}
for (const b of manifest.oneTimeBuilds) {
  for (const field of ['slug', 'name']) {
    if (typeof b[field] !== 'string' || b[field].length === 0) fail(`one-time build missing ${field}: ${JSON.stringify(b)}`)
  }
  if (typeof b.price !== 'number' || b.price <= 0) fail(`one-time "${b.slug}" has invalid price: ${b.price}`)
  if (typeof b.supportDays !== 'number' || b.supportDays <= 0) fail(`one-time "${b.slug}" has invalid supportDays: ${b.supportDays}`)
  if (!('pages' in b)) fail(`one-time "${b.slug}" missing pages`)
}

if (!Array.isArray(manifest.addOns)) fail('addOns must be an array')
for (const a of manifest.addOns) {
  for (const field of ['slug', 'name']) {
    if (typeof a[field] !== 'string' || a[field].length === 0) fail(`add-on missing ${field}: ${JSON.stringify(a)}`)
  }
  for (const field of ['monthly', 'setup']) {
    if (typeof a[field] !== 'number' || a[field] < 0) fail(`add-on "${a.slug}" has invalid ${field}: ${a[field]}`)
  }
}

if (typeof manifest.hostingPolicy !== 'object' || manifest.hostingPolicy === null) {
  fail('hostingPolicy must be an object')
}
const validHostingValues = ['pending', 'included-1yr', 'billed-separately', 'customer-managed']
if (!validHostingValues.includes(manifest.hostingPolicy.oneTime)) {
  fail(`hostingPolicy.oneTime must be one of: ${validHostingValues.join(', ')} (got "${manifest.hostingPolicy.oneTime}")`)
}

ok(`manifest valid — ${manifest.waasTiers.length} WaaS tiers, ${manifest.oneTimeBuilds.length} one-time builds, ${manifest.addOns.length} add-ons`)
ok(`source: ${manifest.sourceRepo}@${manifest.sourceCommit.slice(0, 7)}`)
ok(`generated: ${manifest.generatedAt}`)
if (manifest.hostingPolicy.oneTime === 'pending') {
  console.log(`[33m⚠[0m  hosting policy for one-time builds is PENDING — pricing UI will show a safe placeholder until this is resolved.`)
}
