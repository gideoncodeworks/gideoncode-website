# Gideon Code Website & CRM Improvements

## Tracking Legend
- **Status**: TODO | In Progress | Done
- **Source**: Josh | Claude | Codex

## Open Items
| Status | Area | Description | Source | Owner |
|--------|------|-------------|--------|-------|
| Done | Services | Added Netlify redirects (`/services`, `/portfolio`) so navigation stops 404ing and verified pages load. | Claude | Codex |
| Done | Portfolio | Same redirect + refreshed CRM showcase for visual proof. | Claude | Codex |
| Done | Forms | Contact + careers forms now post to Netlify Forms with honeypot + success page. | Claude | Codex |
| Done | Hero Copy | Homepage headline/subcopy rewritten, CTA area includes click-to-call + email. | Claude | Codex |
| In Progress | Pricing | Hero + CTA references now match core price points; full pricing audit (services.html) scheduled. | Claude | Codex |
| Done | Loading States | Vision/Scope/Reel statuses use new indicator classes + inline error messaging. | Claude | Codex |
| In Progress | Mobile QA | Added responsive tweaks for hero + AI sections; need full device sweep. | Claude | Codex |
| Done | AI Gateway Feedback | Inline status helper surfaces success/error + retry guidance. | Codex | Codex |
| Done | Narrative Sync Coverage | Hero CTA + footer CTA now respond to `gcAIState`. More hooks available if needed. | Codex | Codex |
| Done | CRM Proof | Added AI CRM command center section with badge cards + live screenshot. | Codex | Codex |
| In Progress | Accessibility | Added `aria-live` + focus/error styling. Need full audit (skip links, contrasts). | Codex | Codex |
| Done | Form Validation | Client forms show inline validation + highlight invalid inputs. | Codex | Codex |
| Done | Bundle Loading | New `ai-suite-loader.js` lazy-loads heavy AI bundle only on pages that need it. | Codex | Codex |
| TODO | Pipeline Nudges | Lives in CRM repo (not this site). Need coordination with CRM team. | Josh |  |

## Completed
| Date | Item | Notes |
|------|------|-------|
| 2025-11-06 | Services Page | Created services.html with full pricing (fixes 404s). Codex. |
| 2025-11-06 | Portfolio Page | Created portfolio.html with case studies (fixes 404s). Codex. |
| 2025-11-06 | Forms → Netlify | Contact + careers forms now submit via Netlify Forms with honeypot. Codex. |
| 2025-11-06 | Hero Copy | Homepage headline updated to "Websites + AI CRM That Print Revenue". Codex. |
| 2025-11-06 | Phone Number | Added 1-216-463-2648 above fold in hero. Codex. |
| 2025-11-06 | Loading States | Vision/Scope/Reel use consistent setStatusIndicator helper. Codex. |
| 2025-11-06 | AI Gateway Feedback | Inline error messages with retry guidance. Codex. |
| 2025-11-06 | Narrative CTA Updates | Hero + footer CTAs personalize based on gcAIState. Codex. |
| 2025-11-06 | CRM Showcase | Added AI CRM Command Center section with screenshot. Codex. |
| 2025-11-06 | Form Validation | Client-side validation with inline error display. Codex. |
| 2025-11-06 | Bundle Lazy Loading | Created ai-suite-loader.js to load AI bundle only when needed. Codex. |
| 2025-11-06 | Form Success Page | Created form-success.html shared redirect. Codex. |
| 2025-11-06 | Netlify Rewrites | Added /services and /portfolio clean URL redirects. Codex. |
| 2025-11-06 | Footer Copyright | Updated to 2025 across all pages. Codex. |
| 2025-11-06 | Navigation Standardization | Unified nav structure across 33 pages. Codex. |
| 2025-11-06 | AI CRM Command Center section | Added showcase highlighting dual AI stack + copilots. Claude. |
| 2025-11-06 | Narrative Sync | Hero/tiles/CTA/concierge now react to Vision/Scope/Reel outputs. Claude. |
| 2025-11-06 | Deployed to Production | All UX improvements live at gideoncode.com. Claude + Codex. |
