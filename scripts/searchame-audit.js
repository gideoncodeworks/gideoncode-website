const puppeteer = require("puppeteer");
(async () => {
  const b = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox"],
  });
  const p = await b.newPage();
  await p.setViewport({width: 1440, height: 900});
  await p.goto("https://www.searcha.me/", {waitUntil: "networkidle2"});
  await new Promise(r => setTimeout(r, 3000));
  const info = await p.evaluate(() => {
    const wc = document.body.innerText.split(/\s+/).length;
    const cleveland = (document.body.innerText.match(/cleveland/gi)||[]).length;
    const ohio = (document.body.innerText.match(/ohio/gi)||[]).length;
    const h1s = [...document.querySelectorAll('h1')].map(el=>el.innerText);
    const h2s = [...document.querySelectorAll('h2')].map(el=>el.innerText);
    const linkCount = document.querySelectorAll('a').length;
    const externalLinks = [...document.querySelectorAll('a[href^=http]')].map(a=>a.href).filter(h=>!h.includes('searcha.me'));
    return {wc, cleveland, ohio, h1s, h2s, linkCount, externalCount: externalLinks.length, firstFewLinks: externalLinks.slice(0,10)};
  });
  console.log(JSON.stringify(info, null, 2));
  await p.screenshot({path:'/tmp/searchame-rendered.png', fullPage:false, clip:{x:0,y:0,width:1440,height:900}});
  await b.close();
})();
