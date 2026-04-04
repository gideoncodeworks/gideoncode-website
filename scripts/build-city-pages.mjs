#!/usr/bin/env node

/**
 * City Location Page Generator
 *
 * Reads data/city-pages.json and generates static HTML pages
 * targeting "[city] web design" keywords.
 *
 * Usage: node scripts/build-city-pages.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'data', 'city-pages.json');

const cities = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));

console.log(`Generating ${cities.length} city pages...\n`);

for (const city of cities) {
  const html = generatePage(city);
  const outPath = join(ROOT, `${city.slug}.html`);
  writeFileSync(outPath, html);
  console.log(`  ✓ ${city.slug}.html — ${city.city}, ${city.stateAbbr}`);
}

// Update sitemap
updateSitemap(cities);
console.log(`\n  ✓ sitemap.xml updated with ${cities.length} city pages`);
console.log(`\nDone! ${cities.length} pages generated.`);

function generatePage(c) {
  const faqItems = [
    {
      question: `How much does a website cost for a ${c.city} small business?`,
      answer: `Our monthly plans start at $212.50/month with a $497 setup fee on a 24-month contract. That includes design, hosting, updates, security, and support. We also offer one-time builds from $2,497 to $4,997 if you prefer to own it outright. Every plan includes a 24/7 AI chatbot at no extra charge. Most ${c.city} businesses choose our Growth plan at $252.50/month because it includes up to 10 pages, blog setup, and priority support.`
    },
    {
      question: `Do you work with ${c.city} businesses remotely?`,
      answer: `Yes. We work with businesses across ${c.state} and nationwide. Everything is handled remotely — consultations, design reviews, revisions, and ongoing support. You'll have direct access to your developer, not a call center. Most of our ${c.city} clients never need an in-person meeting because our process is streamlined and transparent.`
    },
    {
      question: `How long does it take to build a website for my ${c.city} business?`,
      answer: `Most websites are live within 2-3 weeks from kickoff. Complex projects with custom features or e-commerce may take 4-6 weeks. We prioritize getting your site live quickly because every day without a professional website is a day your ${c.city} competitors are getting the customers you should be getting.`
    },
    {
      question: `Do you offer SEO for ${c.city} businesses?`,
      answer: `Yes. All our websites are built SEO-ready with proper structure, meta tags, schema markup, and fast load times. For businesses that want active SEO management — keyword tracking, Google Business Profile optimization, content strategy, and rank monitoring — we offer SEO + AEO plans starting at $297/month. AEO (Answer Engine Optimization) ensures your business also shows up in AI search results from tools like ChatGPT and Google AI Overviews.`
    },
    {
      question: `What if I already have a website but it's not working?`,
      answer: `We do full redesigns all the time. If your current site is slow, outdated, or not bringing in customers, we'll rebuild it from scratch on our modern platform. You'll get a faster, better-looking, SEO-optimized site with ongoing support. We can usually have your new site live within 2-3 weeks while keeping your existing site running until the switch.`
    }
  ];

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": { "@type": "Answer", "text": item.answer }
    }))
  }, null, 2);

  const localSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Gideon Codeworks - ${c.city}`,
    "image": "https://gideoncode.com/images/logo.png",
    "url": `https://gideoncode.com/${c.slug}`,
    "telephone": c.phone,
    "priceRange": "$$",
    "description": `Professional website design for small businesses in ${c.city}, ${c.state}. Affordable monthly plans with hosting and support included.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": c.city,
      "addressRegion": c.stateAbbr,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": c.lat,
      "longitude": c.lng
    },
    "areaServed": c.suburbs.slice(0, 8).map(s => ({ "@type": "City", "name": s }))
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gideoncode.com/" },
      { "@type": "ListItem", "position": 2, "name": `${c.city} Web Design` }
    ]
  }, null, 2);

  const suburbGrid = c.suburbs.map(s => `        <div class="cyber-card py-6">
          <p class="text-white font-bold">${s}</p>
        </div>`).join('\n');

  const faqHTML = faqItems.map(item => `          <div class="cyber-card p-6 mb-4">
            <h3 class="text-lg font-bold text-cyan-400 mb-3">${item.question}</h3>
            <p class="text-gray-300 leading-relaxed">${item.answer}</p>
          </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="google-site-verification" content="iNLOfAUD-SpV-McgX3bLDUMPkUKaXrbN5YLc8vPrUnA">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-DF9QHH6T3S"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-DF9QHH6T3S');
  </script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${c.city} Web Design for Small Businesses | Gideon Codeworks</title>
  <meta name="description" content="Professional website design for small businesses in ${c.city}, ${c.state}. Custom sites with hosting, updates, and support from $212.50/month. Free consultation.">
  <meta name="keywords" content="${c.keywords}">
  <meta name="author" content="Gideon Codeworks">
  <link rel="canonical" href="https://gideoncode.com/${c.slug}.html">
  <link rel="apple-touch-icon" href="images/gcw-g-icon.png">

  <meta property="og:title" content="${c.city} Web Design for Small Businesses | Gideon Codeworks">
  <meta property="og:description" content="Professional websites for ${c.city} small businesses. Free consultation, no obligation.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://gideoncode.com/${c.slug}">
  <meta property="og:image" content="https://gideoncode.com/images/og-image.jpg">
  <meta property="og:site_name" content="Gideon Codeworks">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${c.city} Web Design | Gideon Codeworks">
  <meta name="twitter:description" content="Professional websites for ${c.city} small businesses. Free consultation.">
  <meta name="twitter:image" content="https://gideoncode.com/images/og-image.jpg">

  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="css/professional-dark.css">

  <script type="application/ld+json">
  ${localSchema}
  </script>

  <script type="application/ld+json">
  ${faqSchema}
  </script>

  <script type="application/ld+json">
  ${breadcrumbSchema}
  </script>

  <link rel="stylesheet" href="css/chatbot.css">
</head>
<body>

  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-container">
      <a href="index.html" class="nav-brand">
        <img src="images/gcw-logo-horizontal.png" alt="Gideon Codeworks">
      </a>
      <div class="nav-links">
        <a href="services.html" class="nav-link">Services</a>
        <a href="portfolio.html" class="nav-link">Portfolio</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="faq.html" class="nav-link">FAQ</a>
        <a href="blog.html" class="nav-link">Blog</a>
        <a href="tel:+12164632648" class="nav-link" style="color: var(--primary); font-weight: 600;">216-463-2648</a>
        <a href="get-started.html" class="btn btn-primary" style="padding: 0.625rem 1.25rem; font-size: 0.875rem;">Free Consultation</a>
      </div>
      <button class="nav-mobile-toggle" id="mobile-menu-btn">
        <div class="hamburger"><span></span><span></span><span></span></div>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      <a href="services.html">Services</a>
      <a href="portfolio.html">Portfolio</a>
      <a href="about.html">About</a>
      <a href="faq.html">FAQ</a>
      <a href="blog.html">Blog</a>
      <a href="tel:+12164632648" style="color: var(--primary); font-weight: 600;">216-463-2648</a>
      <a href="get-started.html" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Free Consultation</a>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero-section min-h-[100dvh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto w-full">
      <div class="text-center space-y-8">
        <p class="text-sm uppercase tracking-[0.4em] text-cyan-300">${c.label}</p>
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
          <span class="gradient-text">Web Design for ${c.city} Small Businesses</span>
        </h1>
        <p class="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          ${c.localAngle}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" class="neon-button">Get a Free Consultation</a>
          <a href="services.html" class="neon-button neon-button-outline">See Pricing</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Section -->
  <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-cyan-950/20">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
        <span class="gradient-text">Why ${c.city} Businesses Choose Gideon</span>
      </h2>
      <div class="grid md:grid-cols-2 gap-8 mb-16">
        <div class="cyber-card">
          <h3 class="text-xl font-bold text-cyan-400 mb-4">Professional Design, Not Templates</h3>
          <p class="text-gray-300">Every ${c.city} business is different. We build custom websites that reflect your brand and convert visitors into customers. No cookie-cutter templates. No drag-and-drop builders.</p>
        </div>
        <div class="cyber-card">
          <h3 class="text-xl font-bold text-cyan-400 mb-4">Local SEO Built In</h3>
          <p class="text-gray-300">When someone in ${c.suburbs[0]} or ${c.suburbs[1]} searches for your service, we make sure your business shows up. Every site is built with local SEO, schema markup, and Google Business Profile optimization in mind.</p>
        </div>
        <div class="cyber-card">
          <h3 class="text-xl font-bold text-cyan-400 mb-4">We Handle Everything</h3>
          <p class="text-gray-300">Design, hosting, updates, security, support — all included in your monthly plan. You focus on running your ${c.city} business. We keep your website fast, secure, and working.</p>
        </div>
        <div class="cyber-card">
          <h3 class="text-xl font-bold text-cyan-400 mb-4">Affordable Monthly Plans</h3>
          <p class="text-gray-300">Professional websites from $212.50/month. No $10,000 upfront bills. No surprise invoices. One monthly fee covers everything — and you get a real developer, not a chatbot.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Areas We Serve -->
  <section class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">
        <span class="gradient-text">Serving the ${c.city} Metro Area</span>
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
${suburbGrid}
      </div>
      <p class="text-gray-500 text-center mt-8">Don't see your area? We serve the entire ${c.city} metro and beyond. <a href="get-started.html" class="text-cyan-400 hover:underline">Contact us</a>.</p>
    </div>
  </section>

  <!-- Industries -->
  <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cyan-950/20 to-black">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-4">
        <span class="gradient-text">${c.city} Businesses We Work With</span>
      </h2>
      <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        We've built websites for dozens of industries. If you serve customers in ${c.city}, we can help.
      </p>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="cyber-card text-center py-8">
          <div class="text-4xl mb-4">🔧</div>
          <h3 class="text-lg font-bold text-white mb-2">Home Services</h3>
          <p class="text-gray-400 text-sm">Plumbers, electricians, HVAC, roofers, landscapers</p>
        </div>
        <div class="cyber-card text-center py-8">
          <div class="text-4xl mb-4">🍽️</div>
          <h3 class="text-lg font-bold text-white mb-2">Restaurants & Food</h3>
          <p class="text-gray-400 text-sm">Restaurants, food trucks, catering, bakeries</p>
        </div>
        <div class="cyber-card text-center py-8">
          <div class="text-4xl mb-4">💇</div>
          <h3 class="text-lg font-bold text-white mb-2">Beauty & Wellness</h3>
          <p class="text-gray-400 text-sm">Salons, spas, barbershops, fitness studios</p>
        </div>
        <div class="cyber-card text-center py-8">
          <div class="text-4xl mb-4">⚖️</div>
          <h3 class="text-lg font-bold text-white mb-2">Professional Services</h3>
          <p class="text-gray-400 text-sm">Lawyers, accountants, consultants, agencies</p>
        </div>
        <div class="cyber-card text-center py-8">
          <div class="text-4xl mb-4">🏥</div>
          <h3 class="text-lg font-bold text-white mb-2">Healthcare</h3>
          <p class="text-gray-400 text-sm">Dentists, chiropractors, therapists, clinics</p>
        </div>
        <div class="cyber-card text-center py-8">
          <div class="text-4xl mb-4">🏪</div>
          <h3 class="text-lg font-bold text-white mb-2">Retail & Local Shops</h3>
          <p class="text-gray-400 text-sm">Boutiques, pet stores, specialty shops, e-commerce</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">
        <span class="gradient-text">Frequently Asked Questions</span>
      </h2>
      <div>
${faqHTML}
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 to-magenta-900/20">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          <span class="gradient-text">Ready to Get Your ${c.city} Business Online?</span>
        </h2>
        <p class="text-xl text-gray-300">Free consultation. No obligation. Let's talk about what your business needs.</p>
      </div>
      <div class="cyber-card border-2 border-cyan-500 p-8">
        <form name="${c.slug}-contact" method="POST" action="/api/form-submit">
          <input type="hidden" name="territory" value="${c.city}">
          <div class="hidden"><label>Don't fill this out if you're human: <input name="bot-field"></label></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="name" class="block text-cyan-400 font-semibold mb-2">Name *</label>
              <input type="text" id="name" name="name" required class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
            </div>
            <div>
              <label for="phone" class="block text-cyan-400 font-semibold mb-2">Phone *</label>
              <input type="tel" id="phone" name="phone" required class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
            </div>
          </div>
          <div class="mb-6">
            <label for="email" class="block text-cyan-400 font-semibold mb-2">Email *</label>
            <input type="email" id="email" name="email" required class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
          </div>
          <div class="mb-6">
            <label for="business" class="block text-cyan-400 font-semibold mb-2">Business Name</label>
            <input type="text" id="business" name="business" class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
          </div>
          <div class="mb-8">
            <label for="message" class="block text-cyan-400 font-semibold mb-2">Tell us about your project</label>
            <textarea id="message" name="message" rows="4" class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" placeholder="What does your business do? What are you looking for in a website?"></textarea>
          </div>
          <button type="submit" class="neon-button w-full text-lg py-4">Get My Free Consultation</button>
        </form>
      </div>
      <p class="text-gray-500 mt-6 text-center">Or call directly: <a href="tel:+12164632648" class="text-cyan-400 hover:underline">216-463-2648</a></p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div style="font-size: 1.25rem; font-weight: 700; color: #f1f5f9;">Gideon Codeworks</div>
          <p>Professional websites for small businesses. Simple pricing, full service, real support.</p>
        </div>
        <div>
          <h4>Services</h4>
          <ul class="footer-links">
            <li><a href="services/web-design.html">Website Design</a></li>
            <li><a href="services/seo.html">SEO + AEO</a></li>
            <li><a href="services/google-ads.html">Google Ads</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul class="footer-links">
            <li><a href="about.html">About Us</a></li>
            <li><a href="portfolio.html">Portfolio</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="careers.html">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="footer-links">
            <li><a href="tel:+12164632648">216-463-2648</a></li>
            <li><a href="mailto:josh@gideoncode.com">josh@gideoncode.com</a></li>
            <li><a href="get-started.html">Free Consultation</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Gideon Codeworks. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script>
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburger = mobileBtn.querySelector('.hamburger');
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  </script>
  <script src="js/chatbot.js"></script>
</body>
</html>`;
}

function updateSitemap(cities) {
  const sitemapPath = join(ROOT, 'sitemap.xml');
  let sitemap = readFileSync(sitemapPath, 'utf-8');

  // Remove old city page entries between markers (if they exist)
  const startMarker = '<!-- CITY PAGES START -->';
  const endMarker = '<!-- CITY PAGES END -->';

  if (sitemap.includes(startMarker)) {
    const before = sitemap.substring(0, sitemap.indexOf(startMarker));
    const after = sitemap.substring(sitemap.indexOf(endMarker) + endMarker.length);
    sitemap = before + after;
  }

  // Generate new entries
  const today = new Date().toISOString().split('T')[0];
  const entries = cities.map(c => `  <url>
    <loc>https://gideoncode.com/${c.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  // Insert before closing </urlset>
  const newBlock = `\n${startMarker}\n${entries}\n${endMarker}\n`;
  sitemap = sitemap.replace('</urlset>', `${newBlock}</urlset>`);

  writeFileSync(sitemapPath, sitemap);
}
