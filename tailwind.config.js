/**
 * Tailwind production build config.
 *
 * Replaces the CDN script (cdn.tailwindcss.com) on 150+ pages. Produces
 * css/tailwind.min.css which is linked from every page alongside the
 * existing custom css/professional-dark.css.
 *
 * The content scan has to be broad — this site is static HTML across
 * the repo root, services/, blog/, and 70+ city landing pages, with
 * utility classes everywhere. If a page gets missed here, its utility
 * classes get purged from the build and the page breaks visually.
 */
module.exports = {
  content: [
    './*.html',
    './services/**/*.html',
    './blog/**/*.html',
    './case-studies/**/*.html',
    './js/**/*.js',
    './api/**/*.ts',
  ],
  // The site predates design-token discipline; a lot of classes are
  // built up string-wise in JS (e.g., pricing-page.js, package-builder.js
  // in the past). Safelist the most common dynamic patterns so a build
  // can't accidentally strip them.
  safelist: [
    { pattern: /^(bg|text|border|from|to|via)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-(50|100|200|300|400|500|600|700|800|900|950)$/ },
    { pattern: /^(p|m|w|h|gap|space-x|space-y)-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/, variants: ['sm', 'md', 'lg', 'xl', '2xl', 'hover', 'focus'] },
    { pattern: /^(grid-cols|col-span|row-span)-(1|2|3|4|5|6|7|8|9|10|11|12)$/, variants: ['sm', 'md', 'lg', 'xl'] },
    { pattern: /^(text|font)-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|bold|semibold|medium|light|normal)$/, variants: ['sm', 'md', 'lg'] },
    'bg-opacity-95', 'bg-opacity-90', 'bg-opacity-80',
    'bg-clip-text', 'bg-gradient-to-r', 'bg-gradient-to-br', 'bg-gradient-to-b',
    'rounded-full', 'rounded-xl', 'rounded-2xl', 'rounded-3xl',
    'shadow-lg', 'shadow-xl', 'shadow-2xl',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // Keep because we already have custom base styles in professional-dark.css
  },
  plugins: [],
}
