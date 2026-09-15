const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2];
  const browser = await chromium.launch({ channel: 'chrome' });
  const out = {};
  for (const w of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(4000);
    for (const sel of ['[role="dialog"] button:has-text("Got it")', '[role="dialog"] button[aria-label="Close"]']) { try { const b = page.locator(sel).first(); if (await b.isVisible({ timeout: 500 })) await b.click({ timeout: 1000 }); } catch {} }
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 600) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    out[w] = await page.evaluate(() => {
      const cs = e => getComputedStyle(e);
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4 && cs(e).visibility !== 'hidden'; };
      const box = e => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };

      // 1. Every visibly bordered or shadowed container: the card vocabulary.
      const cards = [];
      for (const e of document.querySelectorAll('body *')) {
        if (!vis(e)) continue;
        const s = cs(e);
        const hasBorder = s.borderTopStyle !== 'none' && s.borderTopWidth !== '0px' && s.borderTopColor !== 'rgba(0, 0, 0, 0)';
        const hasShadow = s.boxShadow !== 'none';
        const hasRadius = parseFloat(s.borderRadius) >= 4;
        if (!(hasBorder || hasShadow) || !hasRadius) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 80 || r.height < 40) continue;
        cards.push({ tag: e.tagName, text: (e.textContent || '').trim().slice(0, 34), ...box(e), radius: s.borderRadius, border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`, shadow: s.boxShadow.slice(0, 60), padding: s.padding, bg: s.backgroundColor });
      }
      // dedupe by signature
      const seen = new Set(); const uniqCards = [];
      for (const c of cards) { const k = `${c.radius}|${c.border}|${c.shadow}|${c.padding}`; if (seen.has(k)) continue; seen.add(k); uniqCards.push(c); }

      // 2. Radius histogram over all visible elements
      const radii = new Map();
      for (const e of document.querySelectorAll('body *')) { if (!vis(e)) continue; const r = cs(e).borderRadius; if (r === '0px') continue; radii.set(r, (radii.get(r) || 0) + 1); }

      // 3. Typography by semantic role, sampled from named text
      const role = (label, re, tag) => {
        const els = [...document.querySelectorAll(tag || 'h1,h2,h3,h4,span,p,div,button,a,li,b,strong')].filter(e => vis(e) && e.children.length === 0 && re.test((e.textContent || '').trim()));
        if (!els.length) return null;
        const e = els[0]; const s = cs(e);
        return { label, text: (e.textContent || '').trim().slice(0, 30), font: `${s.fontWeight} ${s.fontSize}/${s.lineHeight}`, ls: s.letterSpacing, color: s.color, family: s.fontFamily.split(',')[0].replace(/"/g, '') };
      };
      const roles = [
        role('title', /^Luxury Catskills/), role('summaryLine', /^Entire cabin in/),
        role('capacity', /guests\s*·|·\s*\d+ bedroom/), role('badgeScore', /^4\.99$/),
        role('badgeLabel', /^Guest favorite$/), role('reviewCount', /^159$/),
        role('reviewsWord', /^Reviews$/i), role('hostName', /^Hosted by/),
        role('hostSub', /Superhost.*hosting|years hosting/), role('sectionH2', /^Where you.ll sleep$/),
        role('amenity', /^Wifi$|^Kitchen$/), role('highlightTitle', /^Top 5% of homes$/),
        role('highlightBody', /loved homes|Guests say/), role('prose', /^Nestled in|^Cozy!/),
        role('reviewBody', /house matched the listing|If you.re searching/),
        role('reviewerName', /^Tyler$|^Lori$|^Taylor$/), role('reviewerMeta', /New York, New York|ago ·/),
        role('categoryLabel', /^Cleanliness$/), role('categoryScore', /^5\.0$/),
        role('bedTitle', /^Bedroom 1$/), role('bedSub', /queen bed|king bed/),
        role('mapTown', /New York, United States/), role('mapNote', /Exact location/),
        role('rulesH', /^House rules$/), role('rulesLine', /Check-in:|Checkout/),
        role('learnMore', /^Learn more$/), role('chip', /^Hot tub \d|^Hospitality/),
        role('calMonth', /^September 2026$/), role('calDow', /^S$|^M$/),
        role('priceNote', /^Add dates for prices$/), role('fieldLabel', /^CHECK-IN$/),
      ].filter(Boolean);

      // 4. Accents: star, laurel, icons, the badge card, avatars
      const svgs = [...document.querySelectorAll('svg')].filter(vis).slice(0, 14).map(e => { const r = e.getBoundingClientRect(); const s = cs(e); return { w: Math.round(r.width), h: Math.round(r.height), fill: s.fill, near: (e.parentElement?.textContent || '').trim().slice(0, 28) }; });
      const imgs = [...document.querySelectorAll('img')].filter(vis).slice(0, 10).map(e => { const s = cs(e); const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), radius: s.borderRadius, alt: (e.alt || '').slice(0, 24) }; });

      // 5. Section rhythm: y of each h2 and the rule above it
      const rules = [...document.querySelectorAll('body *')].filter(e => vis(e) && cs(e).borderTopWidth === '1px' && e.getBoundingClientRect().width > innerWidth * 0.35).map(e => Math.round(e.getBoundingClientRect().top + scrollY));
      const h2y = [...document.querySelectorAll('h2')].filter(vis).map(e => ({ t: e.textContent.trim().slice(0, 24), y: Math.round(e.getBoundingClientRect().top + scrollY) }));

      // 6. Buttons, all of them
      const buttons = [...document.querySelectorAll('button')].filter(vis).slice(0, 14).map(e => { const s = cs(e); const r = e.getBoundingClientRect(); return { text: (e.textContent || '').trim().slice(0, 22), w: Math.round(r.width), h: Math.round(r.height), radius: s.borderRadius, bg: s.backgroundImage !== 'none' ? 'gradient' : s.backgroundColor, border: `${s.borderTopWidth} ${s.borderTopColor}`, font: `${s.fontWeight} ${s.fontSize}`, padding: s.padding };
      });
      const bseen = new Set(); const uniqBtn = buttons.filter(b => { const k = `${b.h}|${b.radius}|${b.bg}|${b.font}`; if (bseen.has(k)) return false; bseen.add(k); return true; });

      return { cards: uniqCards.slice(0, 12), radii: [...radii.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10), roles, svgs, imgs, rules: rules.slice(0, 14), h2y: h2y.slice(0, 10), buttons: uniqBtn };
    });
    await ctx.close();
  }
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
