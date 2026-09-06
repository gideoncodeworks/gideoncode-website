const puppeteer = require("puppeteer");

const EMAIL = process.env.ITRACKER_EMAIL;
const PW = process.env.ITRACKER_PW;
if (!EMAIL || !PW) { console.error("missing env"); process.exit(1); }

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log("→ loading");
  await page.goto("https://itrackerafs.com/", { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2500));

  // Inspect fields available
  const fields = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll("input"));
    return inputs.map(i => ({
      type: i.type,
      name: i.name,
      id: i.id,
      placeholder: i.placeholder,
      visible: !!(i.offsetParent),
    }));
  });
  console.log("fields:", JSON.stringify(fields));

  const emailInput = await page.$('input[type="email"]');
  if (!emailInput) { console.error("no email input"); await browser.close(); process.exit(2); }
  const pwInput = await page.$('input[type="password"]');

  await emailInput.click({ clickCount: 3 });
  await page.keyboard.type(EMAIL, { delay: 40 });
  await pwInput.click({ clickCount: 3 });
  await page.keyboard.type(PW, { delay: 40 });

  // Log the buttons available
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("button")).map(b => ({
      text: (b.textContent || "").trim().slice(0, 40),
      type: b.type,
    }));
  });
  console.log("buttons:", JSON.stringify(btns));

  // Click the Log In button
  await Promise.all([
    page.evaluate(() => {
      const b = Array.from(document.querySelectorAll("button")).find(x => /^\s*log\s*in\s*$/i.test(x.textContent || ""));
      if (b) b.click();
    }),
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 20000 }).catch((e) => console.log("nav wait:", e.message)),
  ]);

  await new Promise((r) => setTimeout(r, 3000));
  const afterUrl = page.url();
  console.log("after login url:", afterUrl);

  // Debug shot
  await page.screenshot({ path: "/tmp/it-debug.png" });

  // Now capture
  const shots = [
    { url: "https://itrackerafs.com/",       out: "itracker-inventory.jpg" },
    { url: "https://itrackerafs.com/admin",  out: "itracker-admin.jpg" },
  ];

  for (const s of shots) {
    try {
      await page.goto(s.url, { waitUntil: "networkidle2", timeout: 30000 });
      await new Promise((r) => setTimeout(r, 3500));
      const dest = `/Users/joshuastone/Desktop/gideoncode-website/images/portfolio/${s.out}`;
      await page.screenshot({ path: dest, type: "jpeg", quality: 88 });
      console.log(`  ✓ ${s.out}  (url now: ${page.url()})`);
    } catch (e) {
      console.error(`  ✗ ${s.url}: ${e.message}`);
    }
  }

  await browser.close();
})();
