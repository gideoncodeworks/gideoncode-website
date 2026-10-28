# Phase 2 — Pending business decisions

Items that could not be resolved during Phase 2 implementation because they
require your call. Nothing in this list blocks the current branches. Each
item lists the exact file + line references so a one-line edit can
complete the fix once you've decided.

## 1. One-time hosting policy — RESOLVED 2026-10-28

**Policy:** 3 months of hosting included after launch. After that, the code
is handed off; the customer may self-host OR stay on Gideon hosting for
$50/mo.

**Changes shipped in this phase:**

- `gideon-dashboard/src/lib/one-time-builds.ts` — new `HOSTING_POLICY_ONE_TIME` constant with `policy: "included-then-optional"`, `includedMonths: 3`, `continuationMonthly: 50`
- `gideon-dashboard/scripts/export-pricing-manifest.ts` — emits the policy into the manifest
- `data/pricing.json` — regenerated; `hostingPolicy` block now contains the real values
- `data/pricing.schema.json` + `scripts/validate-pricing.mjs` — accept the new `included-then-optional` value and enforce the two numeric fields when it's active
- `js/pricing-manifest.js` — `hostingPolicyLabel()` renders the full "3 months included · then host it yourself, or stay on Gideon hosting for $50/mo" line
- `faq.html` lines 64, 216, 251 — all three rewritten with the new policy, replacing the old "1 year of hosting included" claim
- `services.html` line 328 — rewritten to match
- `docs/PRICING-REFERENCE.md` — updated

No further action needed.

## 2. Infinity Caulking "First call + first job sold" claim — VERIFIED 2026-10-28

**Status:** Resolved. Josh verified in-session that Jordan got his first
inbound call within 2-3 months of launch AND sold his first job from the
site. Claim restored on both the homepage portfolio card and the
portfolio.html card + JSON-LD description with the exact combined wording.
No further action needed.

## 3. Legacy `js/package-builder.js` — RESOLVED 2026-10-28

**Deleted.** Replaced by `js/pricing-page.js`, which is the manifest-driven
Package Builder in use on `packages.html`. Historical implementation log
preserved in `docs/PACKAGE-BUILDER-IMPLEMENTATION.md`.

## 4. Packages page JSON-LD — RESOLVED 2026-10-28 (left removed)

**Decision:** schema stays removed. The previous "Marketing Bundles"
AggregateOffer doesn't match the restructured page. Reintroducing it
would require schema that drifts the moment prices change in the
manifest. A future improvement could generate schema from the manifest
at build time; for now, no structured-data pricing on `packages.html`
is better than inaccurate structured-data pricing. The HTML comment on
`packages.html` near the head documents the removal reasoning.

## 5. Chatbot double-charging

**Status:** The dashboard contract templates mention "AI chatbot" as a
feature included in every WaaS plan. The old `js/package-builder.js` and
`docs/PRICING-REFERENCE.md` separately listed "Gideon AI Chatbot Basic
$99/mo + $497 setup" and "Pro $299/mo + $997 setup" as add-ons.

If a WaaS customer was ever quoted the chatbot as a separate line item on
top of their included-in-WaaS chatbot, they'd be charged twice for the same
service. The new `packages.html` resolves this by:

- Not listing a standalone chatbot add-on (manifest doesn't have one)
- Advertising "Advanced Chatbot & AI Features" as a **custom quote** card
  under "Services Quoted Per Project" (for cases like multi-flow /
  custom-trained chatbots that go beyond the included standard one)

**Decision needed:** confirm this split is right. If you want to keep
selling a $99 chatbot upgrade to customers who have the included one,
model that distinction in `src/lib/pricing-tiers.ts` so the manifest can
expose it, then update `docs/PRICING-REFERENCE.md`.

## 6. One-time build contract templates in the dashboard

**Status:** Separately scoped per your direction #11 — NOT a prerequisite
for this website redesign. Flagged here for tracking.

The dashboard's `src/lib/contract-templates.ts` has no template for
one-time builds. Current one-time deals are being handled with hand-written
contracts or by reusing the WaaS template.

Suggested when you decide to tackle this: a new template section in
`contract-templates.ts` that references the hosting policy once it's set
(so the manifest, the website, and the contract all speak with one voice).

## 7. Legacy Stripe pricing object in `gideon-dashboard/src/lib/stripe.ts`

**Status:** The `PRICING` object at `src/lib/stripe.ts:31-56` has stale
naming (starter/growth/professional/enterprise) and wrong prices. Phase 1
audit confirmed it's not referenced anywhere.

Per direction #13, unrelated dashboard cleanup is out of scope unless it
creates an active conflict. It doesn't. Flagged for a future housekeeping
PR.
