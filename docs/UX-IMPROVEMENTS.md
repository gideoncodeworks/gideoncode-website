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
| 2025-03-xx | AI CRM Command Center section | Added showcase highlighting dual AI stack + copilots. |
| 2025-03-xx | Narrative Sync | Hero/tiles/CTA/concierge now react to Vision/Scope/Reel outputs. |
