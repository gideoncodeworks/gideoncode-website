const puppeteer = require("puppeteer");

// Later snapshot (March 2025) — should show more of Kyle's real content
(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const url = "https://web.archive.org/web/20250330154113/https://www.ksmasonryrestoration.com/";
  console.log("→", url);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 5000));

  await page.evaluate(() => {
    const bar = document.getElementById("wm-ipp-base") || document.getElementById("wm-ipp");
    if (bar) bar.style.display = "none";
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({
    path: "/tmp/ks-before-later.jpg",
    type: "jpeg",
    quality: 88,
  });
  console.log("✓ saved /tmp/ks-before-later.jpg");

  await browser.close();
})();
