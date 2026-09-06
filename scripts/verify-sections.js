const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto("http://localhost:8765/index.html", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  // Logo bar — screenshot the element directly (like portfolio grid below)
  const logoBar = await page.$(".client-logo-bar");
  await logoBar.screenshot({ path: "/tmp/gcw-logos.png" });

  // Portfolio grid — capture the element directly
  const el = await page.$(".portfolio-grid");
  await el.screenshot({ path: "/tmp/gcw-portfolio.png" });

  await browser.close();
  console.log("done");
})();
