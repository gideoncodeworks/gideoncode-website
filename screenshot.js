#!/usr/bin/env node

/**
 * Automated Screenshot Tool for Portfolio Pages
 * Uses Puppeteer to capture high-quality screenshots of demo pages
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration
const VIEWPORT = {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 2, // Retina display quality
};

const SCREENSHOTS = [
  {
    url: 'file://' + path.join(__dirname, 'index.html'),
    output: 'images/portfolio/gcw-site.jpg',
    name: 'Gideon Code Works Homepage',
    waitFor: 2000,
  },
  {
    url: 'file://' + path.join(__dirname, 'services.html'),
    output: 'images/portfolio/services-page.jpg',
    name: 'Services Page',
    waitFor: 1500,
  },
  {
    url: 'file://' + path.join(__dirname, 'careers.html'),
    output: 'images/portfolio/careers-page.jpg',
    name: 'Careers Page',
    waitFor: 1500,
  },
  {
    url: 'file://' + path.join(__dirname, 'contractor-demo.html'),
    output: 'images/portfolio/contractor-demo.jpg',
    name: 'Contractor Portfolio Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'crm-demo.html'),
    output: 'images/portfolio/crm-demo.jpg',
    name: 'CRM Platform Demo',
    waitFor: 1500,
  },
  {
    url: 'file://' + path.join(__dirname, 'restaurant-demo.html'),
    output: 'images/portfolio/restaurant-demo.jpg',
    name: 'Restaurant Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'fitness-demo.html'),
    output: 'images/portfolio/fitness-demo.jpg',
    name: 'Fitness Gym Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'property-demo.html'),
    output: 'images/portfolio/property-demo.jpg',
    name: 'Property Management Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'musician-demo.html'),
    output: 'images/portfolio/musician-demo.jpg',
    name: 'Musician Portfolio Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'education-demo.html'),
    output: 'images/portfolio/education-demo.jpg',
    name: 'Educational Library Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'ecommerce-demo.html'),
    output: 'images/portfolio/ecommerce-demo.jpg',
    name: 'E-commerce Shop Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'professional-demo.html'),
    output: 'images/portfolio/professional-demo.jpg',
    name: 'Professional Services Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'auto-demo.html'),
    output: 'images/portfolio/auto-demo.jpg',
    name: 'Auto Services Demo',
    waitFor: 1000,
  },
  {
    url: 'file://' + path.join(__dirname, 'salon-demo.html'),
    output: 'images/portfolio/salon-demo.jpg',
    name: 'Salon Demo',
    waitFor: 1000,
  },
];

async function takeScreenshot(page, config) {
  console.log(`📸 Capturing: ${config.name}`);

  try {
    await page.goto(config.url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for any animations or lazy-loaded content
    await page.waitForTimeout(config.waitFor);

    // Ensure output directory exists
    const outputDir = path.dirname(config.output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Take the screenshot
    await page.screenshot({
      path: config.output,
      type: 'jpeg',
      quality: 90,
      fullPage: false, // Just capture above the fold
    });

    console.log(`   ✅ Saved to: ${config.output}`);
  } catch (error) {
    console.error(`   ❌ Error capturing ${config.name}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting automated screenshot capture...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Take all screenshots
  for (const config of SCREENSHOTS) {
    await takeScreenshot(page, config);
  }

  await browser.close();

  console.log('\n✨ Screenshot capture complete!');
  console.log(`📁 Check the images/portfolio/ directory for your screenshots`);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
