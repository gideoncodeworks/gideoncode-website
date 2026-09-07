const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // Older = 2024 snapshot, well before Josh's rebuild
  const url = "https://web.archive.org/web/20240416162721/https://www.ksmasonryrestoration.com/";
  console.log("→", url);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));

  // Hide the Wayback toolbar so it doesn't dominate the screenshot
  await page.evaluate(() => {
    const bar = document.getElementById("wm-ipp-base") || document.getElementById("wm-ipp");
    if (bar) bar.style.display = "none";
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({
    path: "/Users/joshuastone/Desktop/gideoncode-website/images/portfolio/ks-masonry-before.jpg",
    type: "jpeg",
    quality: 88,
  });
  console.log("✓ saved ks-masonry-before.jpg");

  await browser.close();
})();
