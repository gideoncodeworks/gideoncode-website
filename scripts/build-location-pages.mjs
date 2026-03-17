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
    `              <li style="padding: 0.5rem 0; display: flex; align-items: flex-start; gap: 0.75rem;">
                <span style="color: #ef4444; font-size: 1.125rem;">&#10007;</span>
                <span>${escapeHtml(p)}</span>
              </li>`
  ).join('\n');

  const faqHtml = page.faqItems.map((item, i) =>
    `            <div class="service-card" style="cursor: pointer;" onclick="toggleFaq(${i})">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.125rem; color: var(--primary); padding-right: 1rem;">${escapeHtml(item.question)}</h3>
                <span id="faq-icon-${i}" style="color: var(--primary); font-size: 1.5rem; flex-shrink: 0; transition: transform 0.2s;">+</span>
              </div>
              <div id="faq-answer-${i}" style="display: none; margin-top: 1rem;">
                <p style="color: var(--text-secondary); line-height: 1.7;">${escapeHtml(item.answer)}</p>
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
  <link rel="apple-touch-icon" href="/images/gcw-g-icon.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/css/professional-dark.css">
  <link rel="stylesheet" href="/css/chatbot.css">

  <script type="application/ld+json">
  ${generateServiceSchema(page)}
  </script>

  <script type="application/ld+json">
  ${generateFAQSchema(page.faqItems)}
  </script>
</head>
<body>

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
        <a href="/faq.html" class="nav-link">FAQ</a>
        <a href="/blog.html" class="nav-link">Blog</a>
        <a href="tel:+12164632648" class="nav-link" style="color: var(--primary); font-weight: 600;">216-463-2648</a>
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
      <a href="/faq.html">FAQ</a>
      <a href="/blog.html">Blog</a>
      <a href="tel:+12164632648" style="color: var(--primary); font-weight: 600;">216-463-2648</a>
      <a href="/get-started.html" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Free Consultation</a>
    </div>
  </nav>

  <main>

    <!-- Hero Section -->
    <section class="hero" style="padding-top: 8rem; padding-bottom: 4rem;">
      <div class="hero-container" style="display: block; text-align: center;">
        <div class="hero-badge" style="margin: 0 auto 1.5rem;">
          ${escapeHtml(page.service)} &bull; ${escapeHtml(page.city)}, ${escapeHtml(page.stateAbbr)}
        </div>
        <h1 style="margin-bottom: 1.5rem;">
          <span class="text-gradient">${escapeHtml(page.heroHeadline)}</span>
        </h1>
        <p style="max-width: 700px; margin: 0 auto 2rem; font-size: 1.25rem;">
          ${escapeHtml(page.heroSubheadline)}
        </p>
        <div class="hero-buttons" style="justify-content: center;">
          <a href="#contact" class="btn btn-primary">Get Your Free Website Audit</a>
          <a href="tel:+12164632648" class="btn btn-outline">Call: (216) 463-2648</a>
        </div>
      </div>
    </section>

    <!-- Trust Bar -->
    <section class="trust-bar">
      <div class="trust-container">
        <div class="trust-item"><span class="trust-icon">&#10003;</span><span>Custom Code</span></div>
        <div class="trust-item"><span class="trust-icon">&#10003;</span><span>No Templates</span></div>
        <div class="trust-item"><span class="trust-icon">&#10003;</span><span>Hosting Included</span></div>
        <div class="trust-item"><span class="trust-icon">&#10003;</span><span>One Point of Contact</span></div>
        <div class="trust-item"><span class="trust-icon">&#10003;</span><span>Real Support</span></div>
      </div>
    </section>

    <!-- Problem / Local Angle Section -->
    <section class="section">
      <div class="section-container">
        <div class="section-header">
          <h2>The ${escapeHtml(page.city)} ${escapeHtml(page.trade)} Problem</h2>
        </div>

        <div style="max-width: 750px; margin: 0 auto 3rem;">
          <p style="font-size: 1.125rem; line-height: 1.8; color: var(--text-secondary);">
            ${escapeHtml(page.localAngle)}
          </p>
        </div>

        <!-- Pain Points -->
        <div class="service-card" style="max-width: 750px; margin: 0 auto 3rem; border: 2px solid var(--border);">
          <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Sound familiar?</h3>
          <ul style="list-style: none; padding: 0; margin: 0; color: var(--text-secondary);">
${painPointsHtml}
          </ul>
        </div>

        <!-- Stats -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; max-width: 800px; margin: 0 auto;">
          <div class="service-card" style="text-align: center; padding: 1.25rem;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${escapeHtml(page.stats.searchVolume)}</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">monthly searches for<br>"${escapeHtml(page.stats.searchTerm)}"</p>
          </div>
          <div class="service-card" style="text-align: center; padding: 1.25rem;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${escapeHtml(page.stats.avgResponseTime)}</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">avg response time<br>to new leads</p>
          </div>
          <div class="service-card" style="text-align: center; padding: 1.25rem;">
            <div style="font-size: 1.5rem; font-weight: 700; color: #ef4444;">${escapeHtml(page.stats.missedCallRate)}</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">of calls go<br>unanswered</p>
          </div>
          <div class="service-card" style="text-align: center; padding: 1.25rem;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">78%</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">of local searches lead<br>to in-store visits</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Overview -->
    <section class="section section-alt">
      <div class="section-container">
        <div class="section-header">
          <h2>What We Do for ${escapeHtml(page.trade)} in ${escapeHtml(page.city)}</h2>
          <p>No templates. No outsourcing. Custom code, one point of contact, real results.</p>
        </div>

        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">&#127760;</div>
            <h3>Custom Website</h3>
            <p>A fast, mobile-first website built to convert visitors into phone calls. Not a template — built specifically for ${escapeHtml(page.tradeSlug)} in ${escapeHtml(page.city)}.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">&#128269;</div>
            <h3>Local SEO</h3>
            <p>Show up when ${escapeHtml(page.city)} homeowners search for ${escapeHtml(page.tradeSlug)}. Google Business Profile optimization, local citations, and review management.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">&#128200;</div>
            <h3>Google Ads</h3>
            <p>Targeted ads that put you at the top of search results immediately. We manage your budget so you get calls, not wasted clicks.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">&#128241;</div>
            <h3>Social Media</h3>
            <p>Professional presence on Facebook and Instagram. Before/after project photos, reviews, and content that builds trust with homeowners.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">&#129302;</div>
            <h3>AI Chatbot</h3>
            <p>Never miss a lead — even at 2am. Our AI chatbot answers questions, captures contact info, and books appointments while you sleep.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">&#9733;</div>
            <h3>Review Management</h3>
            <p>Automated review requests after every job. More 5-star Google reviews = more trust = more calls. Simple as that.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Leaky Bucket Section -->
    <section class="section">
      <div class="section-container">
        <div class="section-header">
          <h2>You Don't Need More Advertising</h2>
          <p>You need to stop losing the leads you already get.</p>
        </div>

        <div class="features-grid" style="max-width: 900px; margin: 0 auto 3rem;">
          <div class="service-card" style="border: 2px solid rgba(239, 68, 68, 0.3);">
            <h3 style="color: #ef4444; margin-bottom: 1rem;">The Leaky Bucket</h3>
            <ul style="list-style: none; padding: 0; color: var(--text-secondary); line-height: 2.2;">
              <li>&#10007; Slow website that loses mobile visitors</li>
              <li>&#10007; No online booking or easy way to call</li>
              <li>&#10007; Missed calls going to voicemail</li>
              <li>&#10007; No follow-up on inquiries</li>
              <li>&#10007; Few or outdated Google reviews</li>
            </ul>
          </div>
          <div class="service-card" style="border: 2px solid rgba(16, 185, 129, 0.3);">
            <h3 style="color: var(--success); margin-bottom: 1rem;">The Fix</h3>
            <ul style="list-style: none; padding: 0; color: var(--text-secondary); line-height: 2.2;">
              <li>&#10003; Fast site that loads in under 2 seconds</li>
              <li>&#10003; Click-to-call and online scheduling</li>
              <li>&#10003; AI chatbot catches every lead 24/7</li>
              <li>&#10003; Automated follow-up sequences</li>
              <li>&#10003; Review requests after every completed job</li>
            </ul>
          </div>
        </div>

        <div style="text-align: center;">
          <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 1.5rem;">This isn't an additional expense — it's <strong style="color: var(--primary);">revenue recovery</strong>.</p>
          <a href="#contact" class="btn btn-primary">Find Out What You're Losing</a>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="section section-alt">
      <div class="section-container" style="text-align: center;">
        <div class="section-header">
          <h2>Trusted by Contractors Across the Country</h2>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 600px; margin: 0 auto 2rem;">
          <div class="service-card" style="text-align: center; padding: 1.5rem;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">50+</div>
            <p style="color: var(--text-muted); font-size: 0.875rem;">Websites Built</p>
          </div>
          <div class="service-card" style="text-align: center; padding: 1.5rem;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">31</div>
            <p style="color: var(--text-muted); font-size: 0.875rem;">Industry Templates</p>
          </div>
          <div class="service-card" style="text-align: center; padding: 1.5rem;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">24/7</div>
            <p style="color: var(--text-muted); font-size: 0.875rem;">AI Lead Capture</p>
          </div>
        </div>
        <p style="color: var(--text-muted); font-style: italic;">"We're adding testimonials from ${escapeHtml(page.city)} contractors as we grow in this market. In the meantime, ask us for references."</p>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section">
      <div class="section-container" style="max-width: 750px;">
        <div class="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
${faqHtml}
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section id="contact" class="section section-alt">
      <div class="section-container" style="max-width: 700px;">
        <div class="section-header">
          <h2>Ready to Stop Leaving Money on the Table?</h2>
          <p>Free website audit for ${escapeHtml(page.city)} ${escapeHtml(page.tradeSlug)}. No obligation. No sales pitch. Just an honest look at where you're losing leads.</p>
        </div>

        <div class="service-card" style="border: 2px solid var(--primary); padding: 2rem;">
          <form name="location-contact" method="POST" action="/api/form-submit">
            <input type="hidden" name="_redirect" value="/form-success.html">
            <input type="hidden" name="source-page" value="${escapeHtml(page.slug)}">
            <input type="hidden" name="territory" value="${escapeHtml(page.city)}, ${escapeHtml(page.stateAbbr)}">
            <div style="display: none;">
              <label>Don't fill this out if you're human: <input name="bot-field"></label>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label for="name" style="display: block; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Name *</label>
                <input type="text" id="name" name="name" required style="width: 100%; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem 1rem; color: var(--text-primary);">
              </div>
              <div>
                <label for="phone" style="display: block; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Phone *</label>
                <input type="tel" id="phone" name="phone" required style="width: 100%; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem 1rem; color: var(--text-primary);">
              </div>
            </div>

            <div style="margin-bottom: 1rem;">
              <label for="email" style="display: block; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Email *</label>
              <input type="email" id="email" name="email" required style="width: 100%; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem 1rem; color: var(--text-primary);">
            </div>

            <div style="margin-bottom: 1rem;">
              <label for="company" style="display: block; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Company Name</label>
              <input type="text" id="company" name="company" style="width: 100%; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem 1rem; color: var(--text-primary);">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label for="service-interest" style="display: block; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">What do you need?</label>
                <select id="service-interest" name="service-interest" style="width: 100%; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem 1rem; color: var(--text-primary);">
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
                <label for="trade" style="display: block; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Your Trade</label>
                <select id="trade" name="trade" style="width: 100%; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem 1rem; color: var(--text-primary);">
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

            <div style="margin-bottom: 1.5rem;">
              <label for="message" style="display: block; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Tell us about your business</label>
              <textarea id="message" name="message" rows="4" placeholder="What does your business do? Do you have a current website?" style="width: 100%; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem 1rem; color: var(--text-primary); resize: vertical;"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.125rem;">
              Get My Free Website Audit
            </button>
          </form>
        </div>

        <p style="text-align: center; color: var(--text-muted); font-size: 0.875rem; margin-top: 1.5rem;">
          Or call directly: <a href="tel:+12164632648" style="color: var(--primary);">(216) 463-2648</a> &bull; <a href="mailto:josh@gideoncode.com" style="color: var(--primary);">josh@gideoncode.com</a>
        </p>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div style="max-width: 700px; margin: 0 auto;">
        <h2>${escapeHtml(page.city)} ${escapeHtml(page.trade)} — Let's Talk</h2>
        <p>Get a professional website that brings in customers. Free consultation, no obligation.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="#contact" class="btn btn-primary">Schedule Free Consultation</a>
          <a href="tel:+12164632648" class="btn btn-outline">Call: 216-463-2648</a>
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
            <li><a href="/services/">Contractor Marketing</a></li>
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
      if (answer.style.display === 'none') {
        answer.style.display = 'block';
        icon.textContent = '−';
      } else {
        answer.style.display = 'none';
        icon.textContent = '+';
      }
    }
  </script>

  <script src="/js/chatbot.js"></script>
</body>
</html>`;
}

// Generate the services index page
function generateIndexPage(pages) {
  const cities = [...new Set(pages.map(p => p.city))].sort();
  const trades = [...new Set(pages.map(p => p.trade))].sort();
  const services = [...new Set(pages.map(p => p.service))].sort();

  const pageLinks = pages.map(p =>
    `          <a href="/services/${p.slug}.html" class="service-card" style="display: block; text-decoration: none;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <h3 style="font-size: 1.125rem;">${escapeHtml(p.service)} for ${escapeHtml(p.trade)}</h3>
              <span style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; margin-left: 1rem;">${escapeHtml(p.city)}, ${escapeHtml(p.stateAbbr)}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">${escapeHtml(p.metaDescription)}</p>
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
  <link rel="apple-touch-icon" href="/images/gcw-g-icon.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/css/professional-dark.css">
  <link rel="stylesheet" href="/css/chatbot.css">

  <style>
    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border);
      border-radius: 2rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      background: transparent;
    }
    .filter-btn:hover, .filter-btn.active {
      background: rgba(59, 130, 246, 0.1);
      border-color: var(--primary);
      color: var(--primary);
    }
  </style>
</head>
<body>

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
        <a href="/faq.html" class="nav-link">FAQ</a>
        <a href="/blog.html" class="nav-link">Blog</a>
        <a href="tel:+12164632648" class="nav-link" style="color: var(--primary); font-weight: 600;">216-463-2648</a>
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
      <a href="/faq.html">FAQ</a>
      <a href="/blog.html">Blog</a>
      <a href="tel:+12164632648" style="color: var(--primary); font-weight: 600;">216-463-2648</a>
      <a href="/get-started.html" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Free Consultation</a>
    </div>
  </nav>

  <main>

    <section class="hero" style="padding-top: 8rem; padding-bottom: 4rem;">
      <div class="hero-container" style="display: block; text-align: center;">
        <div class="hero-badge" style="margin: 0 auto 1.5rem;">
          Nationwide Service
        </div>
        <h1 style="margin-bottom: 1.5rem;">
          <span class="text-gradient">Digital Marketing for Contractors</span>
        </h1>
        <p style="max-width: 700px; margin: 0 auto; font-size: 1.25rem;">
          Websites, SEO, and Google Ads built for home services companies. Find your city below.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section-container" style="max-width: 800px;">

        <!-- Filters -->
        <div style="margin-bottom: 2rem;">
          <div style="margin-bottom: 1rem;">
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem; font-weight: 600;">Filter by City:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <button class="filter-btn active" onclick="filterPages('all', 'city', this)">All</button>
${cities.map(c => `              <button class="filter-btn" onclick="filterPages('${c}', 'city', this)">${c}</button>`).join('\n')}
            </div>
          </div>
          <div style="margin-bottom: 1rem;">
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem; font-weight: 600;">Filter by Trade:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <button class="filter-btn active" onclick="filterPages('all', 'trade', this)">All</button>
${trades.map(t => `              <button class="filter-btn" onclick="filterPages('${t}', 'trade', this)">${t}</button>`).join('\n')}
            </div>
          </div>
          <div>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem; font-weight: 600;">Filter by Service:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <button class="filter-btn active" onclick="filterPages('all', 'service', this)">All</button>
${services.map(s => `              <button class="filter-btn" onclick="filterPages('${s}', 'service', this)">${s}</button>`).join('\n')}
            </div>
          </div>
        </div>

        <!-- Page Listing -->
        <div id="page-list" style="display: flex; flex-direction: column; gap: 1rem;">
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
            <li><a href="/services/">Contractor Marketing</a></li>
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
      btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
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
