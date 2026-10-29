/**
 * Gideon Codeworks — lightweight GA4 event helpers.
 *
 * Fires `phone_click` when a user taps a tel: link anywhere on the page.
 * De-duplicated so repeated taps in the same session don't flood GA4.
 *
 * Does NOT fire `generate_lead` here — that event belongs on
 * /quote-success.html (confirmed form submission), where it's wired
 * inline so page-view = confirmed submission.
 *
 * gtag() is provided by the Google tag loaded on every page. If GA4
 * is blocked (ad blocker, DNT), the gtag call quietly no-ops.
 */
(function () {
  'use strict'

  if (typeof window === 'undefined') return
  const fired = new Set()

  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="tel:"]')
    if (!a) return
    const number = a.getAttribute('href').replace(/^tel:/, '').replace(/[^+\d]/g, '')
    if (fired.has(number)) return
    fired.add(number)
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'phone_click', {
          event_category: 'engagement',
          event_label: number,
          page_location: window.location.href,
        })
      }
    } catch (_) { /* no-op */ }
  }, { capture: true, passive: true })
})()
