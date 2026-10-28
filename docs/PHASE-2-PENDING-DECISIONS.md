# Phase 2 — Pending business decisions

Items that could not be resolved during Phase 2 implementation because they
require your call. Nothing in this list blocks the current branches. Each
item lists the exact file + line references so a one-line edit can
complete the fix once you've decided.

## 1. One-time hosting policy

**Status:** The pricing manifest exports `hostingPolicy.oneTime: "pending"`.
The website currently shows a safe placeholder ("Hosting arrangements
covered in your proposal") on the Buy Outright pricing panel.

**Three documented options** are already wired into the manifest schema:

- `included-1yr` — "1 year of hosting included" (needs a renewal rate too)
- `billed-separately` — hosting is a line item from day one (needs the rate)
- `customer-managed` — customer self-hosts the delivered site

**Lines on the website that currently claim or contradict a policy:**

| File | Line | Current claim |
|---|---|---|
| `faq.html` | 64 | JSON-LD FAQPage: "1 year of hosting included" (with price range `$212-$297/month` that misses the `$212.50` decimal and omits Domination `$299`) |
| `faq.html` | 216 | Visible FAQ body: same "1 year of hosting included" claim |
| `faq.html` | 251 | Visible FAQ body: "For one-time builds: you get 1 year of hosting and basic support." |
| `services.html` | 328 | Contradicts the above — "Pay once, own your website. You handle hosting and updates after launch." |

**Suggested fix sequence once you've decided:**

1. Update `src/lib/one-time-builds.ts` in the dashboard with a `HOSTING_POLICY` constant
2. Update `scripts/export-pricing-manifest.ts` to emit it into `hostingPolicy.oneTime`
3. The next GitHub-Action-opened PR to the website carries the new manifest
4. Rewrite the four lines above sitewide once, so the FAQ and services page stop disagreeing

**Do NOT fix these piecemeal** — the problem is coordination. Fixing one
without the others reintroduces the contradiction in a new place.

## 2. Infinity Caulking "First call + first job sold" claim — VERIFIED 2026-10-28

**Status:** Resolved. Josh verified in-session that Jordan got his first
inbound call within 2-3 months of launch AND sold his first job from the
site. Claim restored on both the homepage portfolio card and the
portfolio.html card + JSON-LD description with the exact combined wording.
No further action needed.

## 3. Legacy `js/package-builder.js`

**Status:** Marked deprecated with a header comment at the top of the file.
Not loaded by any HTML page as of this commit. Dead code.

**Decision needed:** delete after Phase 2 sign-off, or keep as a reference.
The replacement is `js/pricing-page.js`, which is the manifest-driven
Package Builder actually in use on `packages.html`.

## 4. Packages page JSON-LD removed

**Status:** The previous Product + AggregateOffer schema on `packages.html`
described "Marketing Bundles" at `lowPrice: $459 / highPrice: $1,499`.
After restructuring the page around WaaS tiers + outright builds, that
schema no longer accurately represents the offer.

Per direction #9 ("Do not change structured-data prices without verifying
current Google guidance"), the schema was removed in the Phase 2 commit
instead of silently updated. An HTML comment on `packages.html` near the
head notes this.

**Decision needed:** reintroduce structured data when the right offer shape
is confirmed. Options: a Service schema per WaaS tier, a Product schema per
one-time build, or an aggregated OfferCatalog. Depends on which Google
rich-result surface you want to target.

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
