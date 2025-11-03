const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshot(htmlFile, outputFile, name) {
  let browser = null;
  try {
    console.log(`📸 Starting ${name}...`);

    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });

    const fullPath = 'file://' + path.resolve(__dirname, htmlFile);
    console.log(`📂 Loading ${fullPath}`);

    await page.goto(fullPath, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for content to render
    await page.waitForTimeout(3000);

    console.log(`💾 Saving to ${outputFile}`);
    await page.screenshot({
      path: outputFile,
      type: 'jpeg',
      quality: 90,
      fullPage: false
    });

    console.log(`✅ ${name} completed successfully!`);

  } catch (error) {
    console.error(`❌ Error with ${name}:`, error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  try {
    // Ensure output directory exists
    const outputDir = path.join(__dirname, 'images/portfolio');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Take screenshots sequentially
    await takeScreenshot(
      'mockups/dashboard-mockup.html',
      'images/portfolio/business-dashboard.jpg',
      'Business Dashboard'
    );

    console.log('\n⏳ Waiting before next screenshot...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    await takeScreenshot(
      'mockups/sales-team-mockup.html',
      'images/portfolio/sales-team-lifestyle.jpg',
      'Sales Team Lifestyle'
    );

    console.log('\n🎉 All screenshots completed successfully!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
