# Gideon Code Website & CRM Improvements

## Tracking Legend
- **Status**: TODO | In Progress | Done
- **Source**: Josh | Claude | Codex

## Open Items
| Status | Area | Description | Source | Owner |
|--------|------|-------------|--------|-------|
| Status | Area | Description | Source | Owner |
|--------|------|-------------|--------|-------|
| Done | Services | Netlify redirects (`/services`, `/portfolio`) keep nav from hitting 404s. | Claude | Codex |
| Done | Portfolio | Case studies restored; CRM showcase updated with live imagery. | Claude | Codex |
| Done | Forms | Contact + careers forms post to Netlify Forms with honeypot + thank-you page. | Claude | Codex |
| Done | Hero | Gideon hero rebuilt with video + simplified funnel CTAs and click-to-call. | Codex | Codex |
| Done | Pricing | Package builder now reflects accurate pricing from services.html. | Claude | Codex |
| Done | Navigation | “More” dropdown hover/click UX needs cleanup across pages. | Josh | Codex |
| Done | CRM Demo | Added Gideon video + “Back to GideonCode.com” link on crm-demo.html. | Josh | Codex |
| Done | Gideon Concierge | Replace retired AI flows with Gideon avatar presence across site. | Josh | Codex |
| TODO | Mobile QA | Full device pass on new hero + CRM sections; confirm no overflow. | Claude | Codex |
| TODO | Accessibility | Add skip links, focus states, and contrast audit post-refresh. | Codex | Codex |
| TODO | Pipeline Nudges | Lives in CRM repo (not marketing site). Coordinate with CRM team. | Josh |  |

## Completed
| Date | Item | Notes |
|------|------|-------|
| 2025-11-06 | Services Page | Created services.html to replace 404; pricing copy pending audit. |
| 2025-11-06 | Portfolio Page | Restored portfolio.html with active proof points. |
| 2025-11-06 | Forms → Netlify | Contact + careers forms wired to Netlify Forms with honeypot + success page. |
| 2025-11-07 | Gideon Hero | Replaced Vision Gate with Gideon hero video + funnel CTAs. |
| 2025-11-07 | CRM Command Center | Added AI CRM section with screenshot + capability blurbs. |
| 2025-11-07 | CRM Demo Refresh | Embedded Gideon video and back-to-home link. |
| 2025-11-07 | Form Validation | Client-side validation feedback + error styling. |
| 2025-11-07 | Netlify Rewrites | Added `/services` and `/portfolio` clean URLs. |
| 2025-11-07 | Footer Copyright | Updated to 2025 across all templates. |
| 2025-11-08 | Navigation Accessibility | Synced header + dropdown behaviour across marketing pages and CRM demo. |
| 2025-11-08 | Gideon Concierge | Reintroduced Gideon-branded concierge powered by Anthropic/OpenAI gateway. |
| 2025-11-08 | Gideon Plan Wizard | Plan selector now routes responses through the Gideon AI gateway with narrative output. |
| 2025-11-08 | Package Builder Launch | New `package-builder.html` + cart funnel feeds custom checkout with legal disclaimers. |
| 2025-11-08 | Navigation Unification | Standardized header across all 33 pages with consistent dropdown behavior. |
| 2025-11-08 | Gideon Refactor | Consolidated ai-suite.js (883 lines) into main.js (496 lines) - 44% smaller. |
| 2025-11-08 | Video Avatar | Added gideon-lives.mp4 (3MB) for animated concierge presence. |
| 2025-11-08 | Code Cleanup | Deleted ai-suite-loader.js, simplified injection logic. |
| 2025-11-08 | Package Builder Pricing Fix | Replaced GPT's hallucinated pricing with real services from services.html. |
| 2025-11-08 | Gideon AI Product Launch | Full product launch: ai-chatbot.html landing page, 3 pricing tiers ($99-599/mo), package builder integration, email templates. |
| 2025-11-08 | Package Builder UX Rebuild | Accordion-style guided flow: either/or logic (one-time OR monthly), expandable tiers with 12/24-month options, conditional add-ons. |
