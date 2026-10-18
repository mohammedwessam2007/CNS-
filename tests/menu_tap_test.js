// v18.14.1: every button in the course menu presses itself (owner, 18 Oct 2026: "the menu is clicking on its own").
// On a phone the pinned menu footer covered "Resume learning" and "Share my progress", so a tap pressed another button.
// M1–M3 phone, iPad and desktop: open the menu, scroll it top to bottom, and at every scroll position the centre of
// each visible button (the part above the game bar) belongs to that button · M4 no page errors.
const { open } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(4) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 400)); if (!ok) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const errors = [];
  const sizes = [['M1', 'phone', { width: 390, height: 844 }, true], ['M2', 'iPad', { width: 820, height: 1180 }, true], ['M3', 'desktop', { width: 1280, height: 800 }, false]];
  for (const [id, name, viewport, touch] of sizes) {
    const s = await open({ v16: true, time: '2026-10-18T19:00:00+03:00', state: null, settle: 2000, viewport, touch });
    const { page } = s;
    if (viewport.width <= 900) {
      const tg = await page.$eval('#railToggle', (b) => { const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await page.touchscreen.tap(tg.x, tg.y);
      await page.clock.runFor(600);
      await wait(1000); // the slide-in runs on real time
    }
    const bad = [], seen = new Set();
    for (let step = 0; step < 8; step++) {
      const r = await page.evaluate((step) => {
        const a = document.querySelector('aside');
        a.scrollTop = Math.round(((a.scrollHeight - a.clientHeight) * step) / 7);
        const name = (b) => b.id || String(b.className).slice(0, 30) || b.tagName;
        const out = { bad: [], seen: [] };
        for (const b of a.querySelectorAll('button, a')) {
          if (!b.offsetParent) continue;
          const r = b.getBoundingClientRect();
          // the part of the button on screen and above the game bar (a bar drawn over the page, in plain sight)
          const bar = document.querySelector('.ixG:not([hidden])'), floor = Math.min(innerHeight, bar && !document.body.classList.contains('railOpen') ? bar.getBoundingClientRect().top : innerHeight);
          const y0 = Math.max(0, r.top), y1 = Math.min(floor, r.bottom);
          if (y1 - y0 < 10) continue;
          const x = r.x + r.width / 2, y = (y0 + y1) / 2;
          if (x < 0 || x > innerWidth) continue;
          const top = document.elementFromPoint(x, y);
          out.seen.push(name(b));
          if (!top || !(top === b || b.contains(top))) out.bad.push(name(b) + ' → ' + (top ? name(top.closest('button,a') || top) : 'nothing'));
        }
        return out;
      }, step);
      r.seen.forEach((x) => seen.add(x));
      r.bad.forEach((x) => bad.includes(x) || bad.push(x));
    }
    const must = ['continueBtn', 'shareProgressBtn', 'cloudBtn', 'toolsBtn'].filter((x) => !seen.has(x));
    check(id, name + ': every menu button can be pressed and a tap on it presses that button', bad.length === 0 && must.length === 0, { bad, missing: must, buttons: seen.size });
    errors.push(...s.log.errors);
    await s.close();
  }
  check('M4', 'No page errors', errors.length === 0, errors.slice(0, 2));
  console.log((4 - fails) + '/4 MENU checks passed');
  process.exit(fails ? 1 : 0);
})();
