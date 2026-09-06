#!/usr/bin/env node
// Capture live-site screenshots for the gideoncode.com portfolio.
// Uses system Chrome via puppeteer.

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "..", "images", "portfolio");

const SITES = [
  { url: "https://www.designerconcretecle.com", out: "designer-concrete.jpg", label: "Designer Concrete" },
  { url: "https://www.rollpullers.com",         out: "roll-pullers.jpg",       label: "GAC Roll Pullers" },
  { url: "https://www.infinitycaulking-resto.com", out: "infinity-caulking.jpg", label: "Infinity Caulking" },
  { url: "https://www.buygeogrid.com",          out: "buygeogrid.jpg",         label: "BuyGeogrid" },
  { url: "https://www.themoderndrive.com",      out: "modern-drive.jpg",       label: "The Modern Drive" },
  { url: "https://www.ksmasonryrestoration.com",out: "ks-masonry.jpg",         label: "KS Masonry" },
  { url: "https://www.goodcattery.com",         out: "good-cattery.jpg",       label: "GoodCattery" },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const site of SITES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    try {
      console.log(`→ ${site.label}: ${site.url}`);
      await page.goto(site.url, { waitUntil: "networkidle2", timeout: 30000 });
      await new Promise((r) => setTimeout(r, 2500));
      const dest = path.join(OUT, site.out);
      await page.screenshot({ path: dest, type: "jpeg", quality: 88, fullPage: false });
      console.log(`  ✓ saved ${site.out}`);
    } catch (e) {
      console.error(`  ✗ ${site.label} failed: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("done.");
})();
