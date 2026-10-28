# Pricing Sync — Dashboard → Website

This document explains how gideoncode.com stays in sync with the authoritative pricing defined inside `gideon-dashboard`.

## Architecture

```
┌──────────────────────────────────┐          ┌─────────────────────────────────┐
│  gideon-dashboard                │          │  gideoncode-website             │
│  ────────────────                │          │  ───────────────────            │
│                                  │          │                                 │
│  src/lib/pricing-tiers.ts        │          │  data/pricing.json  (committed) │
│  src/lib/one-time-builds.ts      │  PR via  │  data/pricing.schema.json       │
│          │                       │─────────▶│  scripts/validate-pricing.mjs   │
│          ▼                       │  GitHub  │  scripts/pricing-consistency-   │
│  scripts/export-pricing-         │  Action  │     test.mjs                    │
│    manifest.ts                   │          │                                 │
│          │                       │          │  Pricing UI reads the manifest  │
│          ▼                       │          │  at runtime (static JSON fetch) │
│  pricing.json  (artifact)        │          │                                 │
└──────────────────────────────────┘          └─────────────────────────────────┘
```

### Key properties

- **Dashboard is authoritative.** `WAAS_TIERS`, `ADD_ONS`, and `ONE_TIME_BUILDS` live in the dashboard repo. The website never defines pricing.
- **No runtime dependency.** The website reads a committed JSON file. If the dashboard is down, the website still renders correct pricing.
- **No private data exposed.** The exporter emits only fields safe for public consumption. No DB IDs, user info, commission percentages, or Stripe plan IDs.
- **PR-gated, not push.** The GitHub Action opens a PR on the website repo instead of pushing to `main`. A human reviews before pricing changes go live.
- **Fail-loud validation.** The validator runs locally and in CI, failing the build on any malformed manifest.
- **Source-tracked.** Every manifest records the dashboard commit SHA it was generated from, for audit and rollback.

## Publishing a pricing change

### On the dashboard side

1. Edit `src/lib/pricing-tiers.ts` or `src/lib/one-time-builds.ts` on a feature branch.
2. Run the exporter locally to sanity-check output:
   ```bash
   npx tsx scripts/export-pricing-manifest.ts /tmp/pricing.json
   ```
3. PR into `main` as usual. Vercel builds the dashboard.
4. On merge to `main`, the `export-pricing-manifest.yml` workflow fires. It:
   - Runs the exporter
   - Opens a PR against `gideoncodeworks/gideoncode-website` on branch `pricing-manifest-sync`
   - Labels it `pricing-sync` + `needs-review`

### On the website side

1. Open the auto-generated PR.
2. Review the `data/pricing.json` diff — confirm the price changes match what you intended.
3. CI runs `npm run validate:pricing` and `npm run test:pricing-consistency`.
4. Merge the PR.
5. Vercel deploys the website. The new pricing is live after the deploy settles.

### Manual / emergency sync

If the GitHub Action is unavailable or you need an off-cycle update:

```bash
cd ~/Desktop/gideon-dashboard
npx tsx scripts/export-pricing-manifest.ts > /tmp/pricing.json

cd ~/Desktop/gideoncode-website
cp /tmp/pricing.json data/pricing.json
node scripts/validate-pricing.mjs
git checkout -b pricing-manifest-emergency-sync
git add data/pricing.json
git commit -m "Emergency pricing sync — <reason>"
# open PR, review, merge
```

## Pending business decisions

The manifest exposes a `hostingPolicy.oneTime` field. Current value: **`"pending"`**.

Three documented options are already baked into the schema:

- `"included-1yr"` — "1 year of hosting included" with a renewal rate to disclose
- `"billed-separately"` — hosting is a line item from day one
- `"customer-managed"` — the customer hosts the delivered site themselves

Until the policy is set, the pricing UI should render a safe placeholder (e.g., "Hosting arrangements covered in your proposal") rather than claim either way.

To change the policy:

1. Edit `src/lib/one-time-builds.ts` — add an exported `HOSTING_POLICY` constant
2. Update the exporter to emit it into `hostingPolicy.oneTime`
3. Update the schema `enum` if a new value is introduced
4. Let the sync PR flow handle the rest

## Services not represented in the manifest

The dashboard currently models fixed prices only for WaaS tiers, one-time builds, and the standard add-on catalog (SEO/ads/social/ecommerce). Other legitimate Gideon Codeworks offerings — custom software, mobile apps, branding packages, AI chatbot variants beyond the bundled one — are intentionally **not** in the manifest.

These are presented on the public site as **"Request a Custom Quote"** services. If / when they graduate to fixed-price offerings, add them to the dashboard first, then let the manifest sync.

## Running the validator and consistency check

```bash
# Validate manifest shape and invariants
npm run validate:pricing

# Scan the site for $ amounts not covered by the manifest
npm run test:pricing-consistency

# Fail CI on any drift (use once UI is manifest-driven)
node scripts/pricing-consistency-test.mjs --strict
```

## Rollback

Pricing manifest is just a committed JSON file. To roll back:

```bash
git log --oneline data/pricing.json          # find prior commit
git checkout <sha>^ -- data/pricing.json     # restore prior
git commit -m "Revert pricing manifest to <sha>"
```

Then push + merge normally. The next automated sync from the dashboard will re-propose the forward change.
