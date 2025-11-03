const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshot(htmlFile, outputFile, name) {
  console.log(`📸 Capturing ${name}...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  const filePath = 'file://' + path.join(__dirname, htmlFile);
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: outputFile,
    type: 'jpeg',
    quality: 90,
    fullPage: false
  });

  await browser.close();
  console.log(`✅ ${name} saved to ${outputFile}`);
}

(async () => {
  try {
    await captureScreenshot(
      'mockups/dashboard-mockup.html',
      'images/portfolio/business-dashboard.jpg',
      'Business Dashboard'
    );

    await captureScreenshot(
      'mockups/sales-team-mockup.html',
      'images/portfolio/sales-team-lifestyle.jpg',
      'Sales Team Lifestyle'
    );

    console.log('\n🎉 All mockup screenshots captured successfully!');
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    process.exit(1);
  }
})();
