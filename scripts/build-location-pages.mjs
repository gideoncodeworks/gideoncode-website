#!/usr/bin/env node

/**
 * Location Page Generator
 *
 * Reads data/location-pages.json and generates static HTML pages
 * in the /services/ directory.
 *
 * Usage: node scripts/build-location-pages.mjs
 *
 * To add a new page: add an entry to data/location-pages.json and re-run.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'data', 'location-pages.json');
const OUTPUT_DIR = join(ROOT, 'services');

// Read location data
const pages = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

function generateFAQSchema(faqItems) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
  return JSON.stringify(schema, null, 2);
}

function generateServiceSchema(page) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `Gideon Codeworks - ${page.service} for ${page.trade} in ${page.city}`,
    "url": `https://gideoncode.com/services/${page.slug}.html`,
    "telephone": "+12164632648",
    "email": "josh@gideoncode.com",
    "priceRange": "$$",
    "description": page.metaDescription,
    "areaServed": {
      "@type": "City",
      "name": page.city,
      "containedInPlace": {
        "@type": "State",
        "name": page.state
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "Gideon Codeworks",
      "url": "https://gideoncode.com"
    }
  };
  return JSON.stringify(schema, null, 2);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generatePage(page) {
  const painPointsHtml = page.painPoints.map(p =>
    `            <li class="flex items-start gap-3">
              <span class="text-red-400 text-xl mt-0.5">&#10007;</span>
              <span class="text-gray-300">${escapeHtml(p)}</span>
            </li>`
  ).join('\n');

  const faqHtml = page.faqItems.map((item, i) =>
    `          <div class="cyber-card">
            <button onclick="toggleFaq(${i})" class="w-full text-left flex justify-between items-center">
              <h3 class="text-lg font-bold text-cyan-400 pr-4">${escapeHtml(item.question)}</h3>
              <span id="faq-icon-${i}" class="text-cyan-400 text-2xl flex-shrink-0 transition-transform">+</span>
            </button>
            <div id="faq-answer-${i}" class="hidden mt-4">
              <p class="text-gray-300 leading-relaxed">${escapeHtml(item.answer)}</p>
            </div>
          </div>`
  ).join('\n');

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
  <title>${escapeHtml(page.metaTitle)}</title>
  <meta name="description" content="${escapeHtml(page.metaDescription)}">
  <link rel="canonical" href="https://gideoncode.com/services/${page.slug}.html">

  <meta property="og:title" content="${escapeHtml(page.metaTitle)}">
  <meta property="og:description" content="${escapeHtml(page.metaDescription)}">
  <meta property="og:url" content="https://gideoncode.com/services/${page.slug}.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://gideoncode.com/images/gcw-og-image.png">

  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/css/professional-dark.css">
  <link rel="stylesheet" href="/css/chatbot.css">

  <script type="application/ld+json">
  ${generateServiceSchema(page)}
  </script>

  <script type="application/ld+json">
  ${generateFAQSchema(page.faqItems)}
  </script>

  <style>
    .gradient-text {
      background: linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .cyber-card {
      background: rgba(0, 255, 255, 0.05);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 0.5rem;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }
    .cyber-card:hover {
      border-color: #00FFFF;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
    }
    .neon-button {
      display: inline-block;
      border: 2px solid #00FFFF;
      color: #00FFFF;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: 1rem 2rem;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      transition: all 0.3s ease;
      text-align: center;
    }
    .neon-button:hover {
      background: rgba(0, 255, 255, 0.1);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
    }
    .neon-button-outline {
      border-color: rgba(0, 255, 255, 0.5);
      color: rgba(0, 255, 255, 0.8);
    }
    .stat-card {
      background: rgba(0, 255, 255, 0.08);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: center;
    }
  </style>
</head>
<body class="bg-black text-white">

  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-container">
      <a href="/index.html" class="nav-brand">
        <img src="/images/gcw-logo-horizontal.png" alt="Gideon Codeworks">
      </a>

      <div class="nav-links">
        <a href="/services.html" class="nav-link">Services</a>
        <a href="/portfolio.html" class="nav-link">Portfolio</a>
        <a href="/about.html" class="nav-link">About</a>
        <a href="/team.html" class="nav-link">Team</a>
        <a href="/careers.html" class="nav-link">Careers</a>
        <a href="/faq.html" class="nav-link">FAQ</a>
        <a href="/blog.html" class="nav-link">Blog</a>
        <a href="/get-started.html" class="btn btn-primary" style="padding: 0.625rem 1.25rem; font-size: 0.875rem;">
          Free Consultation
        </a>
      </div>

      <button class="nav-mobile-toggle" id="mobile-menu-btn">
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>

    <div class="mobile-menu" id="mobile-menu">
      <a href="/services.html">Services</a>
      <a href="/portfolio.html">Portfolio</a>
      <a href="/about.html">About</a>
      <a href="/team.html">Team</a>
      <a href="/careers.html">Careers</a>
      <a href="/faq.html">FAQ</a>
      <a href="/blog.html">Blog</a>
      <a href="/get-started.html" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Free Consultation</a>
    </div>
  </nav>

  <main>

    <!-- Hero Section -->
    <section class="min-h-[80dvh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-cyan-950/10 to-black">
      <div class="max-w-4xl mx-auto text-center space-y-8">
        <p class="text-sm uppercase tracking-[0.4em] text-cyan-300">${escapeHtml(page.service)} &bull; ${escapeHtml(page.city)}, ${escapeHtml(page.stateAbbr)}</p>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          <span class="gradient-text">${escapeHtml(page.heroHeadline)}</span>
        </h1>
        <p class="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          ${escapeHtml(page.heroSubheadline)}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" class="neon-button">Get Your Free Website Audit</a>
          <a href="tel:+12164632648" class="neon-button neon-button-outline">Call Now: (216) 463-2648</a>
        </div>
      </div>
    </section>

    <!-- Problem / Local Angle Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-cyan-950/20">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
          <span class="gradient-text">The ${escapeHtml(page.city)} ${escapeHtml(page.trade)} Problem</span>
        </h2>

        <div class="max-w-3xl mx-auto mb-12">
          <p class="text-lg text-gray-300 leading-relaxed">
            ${escapeHtml(page.localAngle)}
          </p>
        </div>

        <!-- Pain Points -->
        <div class="cyber-card max-w-3xl mx-auto mb-12">
          <h3 class="text-xl font-bold text-white mb-6">Sound familiar?</h3>
          <ul class="space-y-4">
${painPointsHtml}
          </ul>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div class="stat-card">
            <p class="text-2xl font-bold text-cyan-400">${escapeHtml(page.stats.searchVolume)}</p>
            <p class="text-gray-400 text-sm mt-1">monthly searches for<br>"${escapeHtml(page.stats.searchTerm)}"</p>
          </div>
          <div class="stat-card">
            <p class="text-2xl font-bold text-cyan-400">${escapeHtml(page.stats.avgResponseTime)}</p>
            <p class="text-gray-400 text-sm mt-1">avg response time<br>to new leads</p>
          </div>
          <div class="stat-card">
            <p class="text-2xl font-bold text-red-400">${escapeHtml(page.stats.missedCallRate)}</p>
            <p class="text-gray-400 text-sm mt-1">of calls go<br>unanswered</p>
          </div>
          <div class="stat-card">
            <p class="text-2xl font-bold text-green-400">78%</p>
            <p class="text-gray-400 text-sm mt-1">of local searches lead<br>to in-store visits</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Overview -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          <span class="gradient-text">What We Do for ${escapeHtml(page.trade)} in ${escapeHtml(page.city)}</span>
        </h2>
        <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          No templates. No outsourcing. Custom code, one point of contact, real results.
        </p>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="cyber-card">
            <div class="text-3xl mb-3">&#127760;</div>
            <h3 class="text-lg font-bold text-cyan-400 mb-2">Custom Website</h3>
            <p class="text-gray-300 text-sm">A fast, mobile-first website built to convert visitors into phone calls. Not a template — built specifically for ${escapeHtml(page.tradeSlug)} in ${escapeHtml(page.city)}.</p>
          </div>
          <div class="cyber-card">
            <div class="text-3xl mb-3">&#128269;</div>
            <h3 class="text-lg font-bold text-cyan-400 mb-2">Local SEO</h3>
            <p class="text-gray-300 text-sm">Show up when ${escapeHtml(page.city)} homeowners search for ${escapeHtml(page.tradeSlug)}. Google Business Profile optimization, local citations, and review management.</p>
          </div>
          <div class="cyber-card">
            <div class="text-3xl mb-3">&#128200;</div>
            <h3 class="text-lg font-bold text-cyan-400 mb-2">Google Ads</h3>
            <p class="text-gray-300 text-sm">Targeted ads that put you at the top of search results immediately. We manage your budget so you get calls, not wasted clicks.</p>
          </div>
          <div class="cyber-card">
            <div class="text-3xl mb-3">&#128241;</div>
            <h3 class="text-lg font-bold text-cyan-400 mb-2">Social Media</h3>
            <p class="text-gray-300 text-sm">Professional presence on Facebook and Instagram. Before/after project photos, reviews, and content that builds trust with homeowners.</p>
          </div>
          <div class="cyber-card">
            <div class="text-3xl mb-3">&#129302;</div>
            <h3 class="text-lg font-bold text-cyan-400 mb-2">AI Chatbot</h3>
            <p class="text-gray-300 text-sm">Never miss a lead — even at 2am. Our AI chatbot answers questions, captures contact info, and books appointments while you sleep.</p>
          </div>
          <div class="cyber-card">
            <div class="text-3xl mb-3">&#9733;</div>
            <h3 class="text-lg font-bold text-cyan-400 mb-2">Review Management</h3>
            <p class="text-gray-300 text-sm">Automated review requests after every job. More 5-star Google reviews = more trust = more calls. Simple as that.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Leaky Bucket Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cyan-950/20 to-black">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-8">
          <span class="gradient-text">You Don't Need More Advertising</span>
        </h2>
        <h3 class="text-xl text-gray-300 text-center mb-12">You need to stop losing the leads you already get.</h3>

        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <div class="cyber-card border-red-500/30">
            <h4 class="text-lg font-bold text-red-400 mb-4">The Leaky Bucket</h4>
            <ul class="space-y-3 text-gray-300">
              <li class="flex items-start gap-2"><span class="text-red-400">&#10007;</span> Slow website that loses mobile visitors</li>
              <li class="flex items-start gap-2"><span class="text-red-400">&#10007;</span> No online booking or easy way to call</li>
              <li class="flex items-start gap-2"><span class="text-red-400">&#10007;</span> Missed calls going to voicemail</li>
              <li class="flex items-start gap-2"><span class="text-red-400">&#10007;</span> No follow-up on inquiries</li>
              <li class="flex items-start gap-2"><span class="text-red-400">&#10007;</span> Few or outdated Google reviews</li>
            </ul>
          </div>
          <div class="cyber-card border-green-500/30">
            <h4 class="text-lg font-bold text-green-400 mb-4">The Fix</h4>
            <ul class="space-y-3 text-gray-300">
              <li class="flex items-start gap-2"><span class="text-green-400">&#10003;</span> Fast site that loads in under 2 seconds</li>
              <li class="flex items-start gap-2"><span class="text-green-400">&#10003;</span> Click-to-call and online scheduling</li>
              <li class="flex items-start gap-2"><span class="text-green-400">&#10003;</span> AI chatbot catches every lead 24/7</li>
              <li class="flex items-start gap-2"><span class="text-green-400">&#10003;</span> Automated follow-up sequences</li>
              <li class="flex items-start gap-2"><span class="text-green-400">&#10003;</span> Review requests after every completed job</li>
            </ul>
          </div>
        </div>

        <div class="text-center">
          <p class="text-xl text-gray-300 mb-6">This isn't an additional expense — it's <strong class="text-cyan-400">revenue recovery</strong>.</p>
          <a href="#contact" class="neon-button">Find Out What You're Losing</a>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-8">
          <span class="gradient-text">Trusted by Contractors Across the Country</span>
        </h2>
        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <div class="stat-card">
            <p class="text-3xl font-bold text-cyan-400">50+</p>
            <p class="text-gray-400 mt-1">Websites Built</p>
          </div>
          <div class="stat-card">
            <p class="text-3xl font-bold text-cyan-400">31</p>
            <p class="text-gray-400 mt-1">Industry Templates</p>
          </div>
          <div class="stat-card">
            <p class="text-3xl font-bold text-cyan-400">24/7</p>
            <p class="text-gray-400 mt-1">AI Lead Capture</p>
          </div>
        </div>
        <p class="text-gray-400 italic">"We're adding testimonials from ${escapeHtml(page.city)} contractors as we grow in this market. In the meantime, ask us for references."</p>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-cyan-950/20">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">
          <span class="gradient-text">Frequently Asked Questions</span>
        </h2>
        <div class="space-y-4">
${faqHtml}
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section id="contact" class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            <span class="gradient-text">Ready to Stop Leaving Money on the Table?</span>
          </h2>
          <p class="text-xl text-gray-300">
            Free website audit for ${escapeHtml(page.city)} ${escapeHtml(page.tradeSlug)}. No obligation. No sales pitch. Just an honest look at where you're losing leads.
          </p>
        </div>

        <div class="cyber-card border-2 border-cyan-500 p-8">
          <form name="location-contact" method="POST" action="/api/form-submit">
            <input type="hidden" name="_redirect" value="/form-success.html">
            <input type="hidden" name="source-page" value="${escapeHtml(page.slug)}">
            <input type="hidden" name="territory" value="${escapeHtml(page.city)}, ${escapeHtml(page.stateAbbr)}">
            <div class="hidden">
              <label>Don't fill this out if you're human: <input name="bot-field"></label>
            </div>

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
              <label for="company" class="block text-cyan-400 font-semibold mb-2">Company Name</label>
              <input type="text" id="company" name="company" class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="service-interest" class="block text-cyan-400 font-semibold mb-2">What do you need?</label>
                <select id="service-interest" name="service-interest" class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
                  <option value="">Select one...</option>
                  <option value="website">Website</option>
                  <option value="seo">SEO</option>
                  <option value="google-ads">Google Ads</option>
                  <option value="social-media">Social Media</option>
                  <option value="full-package">Full Package</option>
                  <option value="not-sure">Not Sure</option>
                </select>
              </div>
              <div>
                <label for="trade" class="block text-cyan-400 font-semibold mb-2">Your Trade</label>
                <select id="trade" name="trade" class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
                  <option value="">Select one...</option>
                  <option value="plumber"${page.tradeSlug === 'plumbers' ? ' selected' : ''}>Plumber</option>
                  <option value="roofer"${page.tradeSlug === 'roofers' ? ' selected' : ''}>Roofer</option>
                  <option value="hvac"${page.tradeSlug === 'hvac-contractors' ? ' selected' : ''}>HVAC</option>
                  <option value="electrician"${page.tradeSlug === 'electricians' ? ' selected' : ''}>Electrician</option>
                  <option value="mason"${page.tradeSlug === 'masonry-companies' ? ' selected' : ''}>Mason / Concrete</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div class="mb-8">
              <label for="message" class="block text-cyan-400 font-semibold mb-2">Tell us about your business</label>
              <textarea id="message" name="message" rows="4" class="w-full bg-black/60 border border-cyan-500/40 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" placeholder="What does your business do? Do you have a current website?"></textarea>
            </div>

            <button type="submit" class="neon-button w-full text-lg py-4">
              Get My Free Website Audit
            </button>
          </form>
        </div>

        <p class="text-gray-500 mt-6 text-center">Or call directly: <a href="tel:+12164632648" class="text-cyan-400 hover:underline">(216) 463-2648</a> &bull; <a href="mailto:josh@gideoncode.com" class="text-cyan-400 hover:underline">josh@gideoncode.com</a></p>
      </div>
    </section>

  </main>

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
            <li><a href="/services.html">Website Design</a></li>
            <li><a href="/services.html#seo">SEO Services</a></li>
            <li><a href="/services.html">Hosting & Support</a></li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul class="footer-links">
            <li><a href="/about.html">About Us</a></li>
            <li><a href="/portfolio.html">Portfolio</a></li>
            <li><a href="/blog.html">Blog</a></li>
            <li><a href="/careers.html">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul class="footer-links">
            <li><a href="tel:+12164632648">216-463-2648</a></li>
            <li><a href="mailto:josh@gideoncode.com">josh@gideoncode.com</a></li>
            <li><a href="/get-started.html">Free Consultation</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Gideon Codeworks. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <!-- Mobile Menu Script -->
  <script>
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburger = mobileBtn.querySelector('.hamburger');

    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    function toggleFaq(index) {
      const answer = document.getElementById('faq-answer-' + index);
      const icon = document.getElementById('faq-icon-' + index);
      answer.classList.toggle('hidden');
      icon.textContent = answer.classList.contains('hidden') ? '+' : '−';
    }
  </script>

  <script src="/js/chatbot.js"></script>
</body>
</html>`;
}

// Generate the services index page
function generateIndexPage(pages) {
  // Group by city, trade, service
  const cities = [...new Set(pages.map(p => p.city))].sort();
  const trades = [...new Set(pages.map(p => p.trade))].sort();
  const services = [...new Set(pages.map(p => p.service))].sort();

  const pageLinks = pages.map(p =>
    `          <a href="/services/${p.slug}.html" class="cyber-card block hover:border-cyan-400">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-bold text-cyan-400">${escapeHtml(p.service)} for ${escapeHtml(p.trade)}</h3>
              <span class="text-xs text-gray-500 whitespace-nowrap ml-4">${escapeHtml(p.city)}, ${escapeHtml(p.stateAbbr)}</span>
            </div>
            <p class="text-gray-400 text-sm">${escapeHtml(p.metaDescription)}</p>
          </a>`
  ).join('\n');

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
  <title>Digital Marketing for Contractors — All Cities | Gideon Codeworks</title>
  <meta name="description" content="Custom websites, SEO, and Google Ads for plumbers, roofers, HVAC, electricians, and masonry companies across the United States.">
  <link rel="canonical" href="https://gideoncode.com/services/">

  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/css/professional-dark.css">
  <link rel="stylesheet" href="/css/chatbot.css">

  <style>
    .gradient-text {
      background: linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .cyber-card {
      background: rgba(0, 255, 255, 0.05);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 0.5rem;
      padding: 1.5rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .cyber-card:hover {
      border-color: #00FFFF;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
    }
    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 2rem;
      color: rgba(0, 255, 255, 0.7);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      background: transparent;
    }
    .filter-btn:hover, .filter-btn.active {
      background: rgba(0, 255, 255, 0.15);
      border-color: #00FFFF;
      color: #00FFFF;
    }
  </style>
</head>
<body class="bg-black text-white">

  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-container">
      <a href="/index.html" class="nav-brand">
        <img src="/images/gcw-logo-horizontal.png" alt="Gideon Codeworks">
      </a>
      <div class="nav-links">
        <a href="/services.html" class="nav-link">Services</a>
        <a href="/portfolio.html" class="nav-link">Portfolio</a>
        <a href="/about.html" class="nav-link">About</a>
        <a href="/team.html" class="nav-link">Team</a>
        <a href="/careers.html" class="nav-link">Careers</a>
        <a href="/faq.html" class="nav-link">FAQ</a>
        <a href="/blog.html" class="nav-link">Blog</a>
        <a href="/get-started.html" class="btn btn-primary" style="padding: 0.625rem 1.25rem; font-size: 0.875rem;">Free Consultation</a>
      </div>
      <button class="nav-mobile-toggle" id="mobile-menu-btn">
        <div class="hamburger"><span></span><span></span><span></span></div>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      <a href="/services.html">Services</a>
      <a href="/portfolio.html">Portfolio</a>
      <a href="/about.html">About</a>
      <a href="/team.html">Team</a>
      <a href="/careers.html">Careers</a>
      <a href="/faq.html">FAQ</a>
      <a href="/blog.html">Blog</a>
      <a href="/get-started.html" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Free Consultation</a>
    </div>
  </nav>

  <main>
    <section class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <p class="text-sm uppercase tracking-[0.4em] text-cyan-300 mb-4">Nationwide Service</p>
          <h1 class="text-4xl sm:text-5xl font-bold mb-4">
            <span class="gradient-text">Digital Marketing for Contractors</span>
          </h1>
          <p class="text-xl text-gray-300">Websites, SEO, and Google Ads built for home services companies. Find your city below.</p>
        </div>

        <!-- Filters -->
        <div class="mb-8">
          <div class="mb-4">
            <p class="text-gray-400 text-sm mb-2 font-semibold">Filter by City:</p>
            <div class="flex flex-wrap gap-2">
              <button class="filter-btn active" onclick="filterPages('all', 'city', this)">All</button>
${cities.map(c => `              <button class="filter-btn" onclick="filterPages('${c}', 'city', this)">${c}</button>`).join('\n')}
            </div>
          </div>
          <div class="mb-4">
            <p class="text-gray-400 text-sm mb-2 font-semibold">Filter by Trade:</p>
            <div class="flex flex-wrap gap-2">
              <button class="filter-btn active" onclick="filterPages('all', 'trade', this)">All</button>
${trades.map(t => `              <button class="filter-btn" onclick="filterPages('${t}', 'trade', this)">${t}</button>`).join('\n')}
            </div>
          </div>
          <div>
            <p class="text-gray-400 text-sm mb-2 font-semibold">Filter by Service:</p>
            <div class="flex flex-wrap gap-2">
              <button class="filter-btn active" onclick="filterPages('all', 'service', this)">All</button>
${services.map(s => `              <button class="filter-btn" onclick="filterPages('${s}', 'service', this)">${s}</button>`).join('\n')}
            </div>
          </div>
        </div>

        <!-- Page Listing -->
        <div id="page-list" class="space-y-4">
${pageLinks}
        </div>
      </div>
    </section>
  </main>

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
            <li><a href="/services.html">Website Design</a></li>
            <li><a href="/services.html#seo">SEO Services</a></li>
            <li><a href="/services.html">Hosting & Support</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul class="footer-links">
            <li><a href="/about.html">About Us</a></li>
            <li><a href="/portfolio.html">Portfolio</a></li>
            <li><a href="/blog.html">Blog</a></li>
            <li><a href="/careers.html">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="footer-links">
            <li><a href="tel:+12164632648">216-463-2648</a></li>
            <li><a href="mailto:josh@gideoncode.com">josh@gideoncode.com</a></li>
            <li><a href="/get-started.html">Free Consultation</a></li>
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

    const filters = { city: 'all', trade: 'all', service: 'all' };
    const pageData = ${JSON.stringify(pages.map(p => ({ slug: p.slug, city: p.city, trade: p.trade, service: p.service })))};

    function filterPages(value, type, btn) {
      filters[type] = value;
      // Update active button
      btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Filter cards
      const cards = document.querySelectorAll('#page-list > a');
      cards.forEach((card, i) => {
        const p = pageData[i];
        const show = (filters.city === 'all' || p.city === filters.city)
          && (filters.trade === 'all' || p.trade === filters.trade)
          && (filters.service === 'all' || p.service === filters.service);
        card.style.display = show ? '' : 'none';
      });
    }
  </script>

  <script src="/js/chatbot.js"></script>
</body>
</html>`;
}

// Build all pages
console.log(`Building ${pages.length} location pages...`);

for (const page of pages) {
  const html = generatePage(page);
  const filePath = join(OUTPUT_DIR, `${page.slug}.html`);
  writeFileSync(filePath, html);
  console.log(`  ✓ ${page.slug}.html`);
}

// Build index page
const indexHtml = generateIndexPage(pages);
writeFileSync(join(OUTPUT_DIR, 'index.html'), indexHtml);
console.log(`  ✓ services/index.html (listing page)`);

// Update sitemap
const sitemapPath = join(ROOT, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  let sitemap = readFileSync(sitemapPath, 'utf-8');

  // Remove any previously generated location page entries
  sitemap = sitemap.replace(/\s*<!-- LOCATION PAGES START -->[\s\S]*?<!-- LOCATION PAGES END -->\s*/g, '');

  // Generate new entries
  const today = new Date().toISOString().split('T')[0];
  const locationEntries = pages.map(p =>
    `  <url>\n    <loc>https://gideoncode.com/services/${p.slug}.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  ).join('\n');

  const indexEntry = `  <url>\n    <loc>https://gideoncode.com/services/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;

  const block = `\n  <!-- LOCATION PAGES START -->\n${indexEntry}\n${locationEntries}\n  <!-- LOCATION PAGES END -->`;

  // Insert before closing </urlset>
  sitemap = sitemap.replace('</urlset>', `${block}\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
  console.log(`  ✓ sitemap.xml updated`);
}

console.log(`\nDone! ${pages.length} pages generated in /services/`);
console.log(`\nTo add a new page:\n  1. Add an entry to data/location-pages.json\n  2. Run: node scripts/build-location-pages.mjs`);
