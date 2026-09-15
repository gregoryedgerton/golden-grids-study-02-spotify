// Stills of the dial at chosen depths: `node captures/dial.cjs <url> <outDir> [depths]`
const { chromium } = require('playwright');
(async () => {
  const [url, out, depthArg = '0,3.5,8,14'] = process.argv.slice(2);
  const depths = depthArg.split(',').map(Number);
  const browser = await chromium.launch({ channel: 'chrome' });
  for (const w of [390, 820, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    for (const d of depths) {
      await page.evaluate(async (d) => {
        const b = document.querySelector('.dial');
        window.scrollTo(0, b.getBoundingClientRect().top + scrollY + d * window.innerHeight);
        await new Promise(r => setTimeout(r, 500));
      }, d);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${out}/dial-${w}-d${String(d).replace('.', '_')}.png` });
    }
    console.log(w, 'done');
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
