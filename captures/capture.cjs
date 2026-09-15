const { chromium } = require('playwright');
(async () => {
  const [url, out, prefix = 'reference', only] = process.argv.slice(2);
  const widths = only ? [Number(only)] : [390, 820, 1440];
  const browser = await chromium.launch({ channel: 'chrome' });
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(5000);
    for (const sel of ['button:has-text("Accept")', 'button:has-text("Accept cookies")', '[data-testid="cookie-banner"] button']) {
      try { const b = page.locator(sel).first(); if (await b.isVisible({ timeout: 600 })) { await b.click({ timeout: 1200 }); await page.waitForTimeout(600); } } catch {}
    }
    // Scroll the tallest inner scroller, not just the document.
    const info = await page.evaluate(async () => {
      const all = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 200 && /auto|scroll/.test(getComputedStyle(e).overflowY));
      const el = all.sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
      const target = el || document.scrollingElement;
      for (let y = 0; y < target.scrollHeight; y += 500) { target.scrollTop = y; await new Promise(r => setTimeout(r, 120)); }
      target.scrollTop = 0;
      return { tag: target.tagName + '.' + (target.className || '').toString().slice(0, 24), h: target.scrollHeight, inner: !!el };
    });
    await page.waitForTimeout(1500);
    // Grow the viewport to the scroller's height so one shot captures it all.
    if (info.inner) {
      await page.setViewportSize({ width: w, height: Math.min(info.h + 100, 6000) });
      await page.waitForTimeout(1500);
    }
    await page.screenshot({ path: `${out}/${prefix}-${w}.png`, fullPage: !info.inner });
    console.log(w, JSON.stringify(info), '|', (await page.title()).slice(0, 60));
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
