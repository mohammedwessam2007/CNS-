// Shared Playwright harness for INTELLECTUALITY certification probes.
// - Frozen clock in Africa/Cairo (Playwright clock API)
// - Wikimedia Commons API mocked deterministically (egress to Wikimedia is blocked
//   in the certification sandbox); every query is recorded for leak auditing.
// - Remote images (upload.wikimedia.org, i.ytimg.com) answered with a 1x1 PNG.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const BASE = process.env.APP_URL || 'http://127.0.0.1:8787/';

function mockCommonsRows(query, n = 8) {
  // Deterministic synthetic candidates whose titles echo the query so relevance
  // filters behave like a keyword search engine would.
  const words = String(query || '').replace(/incategory:/g, ' ').replace(/["']/g, ' ').replace(/-/g, ' ').split(/\s+/).filter(Boolean);
  const rows = {};
  for (let i = 0; i < n; i++) {
    const w = words.slice(i % Math.max(1, words.length)).concat(words).slice(0, 4).join(' ');
    const title = `File:${w} ${['diagram', 'specimen', 'section', 'micrograph', 'illustration', 'labeled', 'photo', 'schema'][i % 8]} ${i + 1}.jpg`;
    rows[String(-(i + 1))] = { title, imageinfo: [{ thumburl: 'https://upload.wikimedia.org/mock/' + encodeURIComponent(title), descriptionurl: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(title), mime: 'image/jpeg', width: 1200, height: 900, extmetadata: { LicenseShortName: { value: 'CC BY-SA 4.0' }, Artist: { value: 'Mock author' } } }] };
  }
  return rows;
}
function mockExactFile(titles) {
  const pages = {};
  String(titles).split('|').forEach((t, i) => {
    pages[String(-(i + 1))] = { title: t, imageinfo: [{ thumburl: 'https://upload.wikimedia.org/mock/' + encodeURIComponent(t), descriptionurl: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(t), mime: /\.svg$/i.test(t) ? 'image/svg+xml' : 'image/png', width: 1400, height: 1000, extmetadata: { LicenseShortName: { value: 'Public domain' }, Artist: { value: 'Mock atlas' } } }] };
  });
  return pages;
}

async function open(opts = {}) {
  const browser = opts.browser || await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const context = await browser.newContext({
    viewport: opts.viewport || { width: 1280, height: 900 },
    timezoneId: opts.timezoneId || 'Africa/Cairo',
    locale: 'en-GB',
    deviceScaleFactor: 1,
    hasTouch: !!opts.touch,
    // the app registers a service worker (v15.3); probes keep it off unless a test asks for it
    serviceWorkers: opts.sw ? 'allow' : 'block',
  });
  const log = { errors: [], console: [], commons: [], requests: 0 };
  if (opts.time) await context.clock.install({ time: new Date(opts.time) });
  await context.route(/commons\.wikimedia\.org\/w\/api\.php/, async (route) => {
    const u = new URL(route.request().url());
    const gs = u.searchParams.get('gsrsearch'), titles = u.searchParams.get('titles');
    log.commons.push({ gsrsearch: gs, titles, at: log.commons.length });
    log.inflight = (log.inflight || 0) + 1; log.maxInflight = Math.max(log.maxInflight || 0, log.inflight);
    try {
    if (opts.commonsFail) { log.inflight--; return route.abort('failed'); }
    if (opts.commonsDelayMs) await new Promise(r => setTimeout(r, opts.commonsDelayMs));
    const pages = gs ? mockCommonsRows(gs) : mockExactFile(titles || '');
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ query: { pages } }) });
    } finally { log.inflight--; }
  });
  // Wikipedia (v15 exact-words pictures): the article for a title exists unless it contains "Nosuch";
  // its media list holds a lead diagram and a micrograph whose captions echo the title.
  await context.route(/en\.wikipedia\.org\//, async (route) => {
    const u = new URL(route.request().url());
    log.wiki = log.wiki || [];
    log.wiki.push(u.pathname + '?' + (u.searchParams.get('titles') || u.searchParams.get('srsearch') || ''));
    if (opts.wikiFail) return route.abort('failed');
    const cap = (t) => t.replace(/_/g, ' ');
    if (/\/page\/media-list\//.test(u.pathname)) {
      const t = cap(decodeURIComponent(u.pathname.split('/media-list/')[1]));
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ items: [
        { title: 'File:' + t + ' labeled diagram.svg', type: 'image', leadImage: true, caption: { text: t + ', labeled diagram' } },
        { title: 'File:' + t + ' histology micrograph.jpg', type: 'image', leadImage: false, caption: { text: 'Micrograph of ' + t } },
        { title: 'File:Commons-logo.svg', type: 'image', leadImage: false, caption: { text: '' } } ] }) });
    }
    const titles = u.searchParams.get('titles'), sr = u.searchParams.get('srsearch');
    if (titles) {
      const miss = /nosuch/i.test(titles);
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ query: { pages: [miss ? { title: titles, missing: true } : { title: titles, pageimage: titles.replace(/ /g, '_') + '_labeled_diagram.svg' }] } }) });
    }
    if (sr) {
      const words = sr.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3).slice(0, 2);
      const t = words.map((w, i) => (i ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join(' ');
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ query: { search: t ? [{ title: t }] : [] } }) });
    }
    return route.fulfill({ contentType: 'application/json', body: '{}' });
  });
  await context.route(/(upload\.wikimedia\.org|i\.ytimg\.com)/, (route) => route.fulfill({ contentType: 'image/png', body: PNG }));
  await context.route(/(youtube\.com|youtube-nocookie\.com)/, (route) => route.fulfill({ contentType: 'text/html', body: '<html><body>video</body></html>' }));
  // IX_TEST_LOCALSTORAGE='{"k":"v"}' seeds every page (e.g. the owner's drawings key, to run a suite as the owner's device)
  if (process.env.IX_TEST_LOCALSTORAGE) opts.localStorage = Object.assign(JSON.parse(process.env.IX_TEST_LOCALSTORAGE), opts.localStorage || {});
  if (opts.state !== undefined || opts.localStorage) {
    await context.addInitScript(([state, extra]) => {
      if (!sessionStorage.getItem('__seeded')) {
        sessionStorage.setItem('__seeded', '1');
        if (state === null) localStorage.clear();
        else if (state) localStorage.setItem('intellectuality_v41_launch_state', JSON.stringify(state));
        for (const [k, v] of Object.entries(extra || {})) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      }
    }, [opts.state === undefined ? undefined : opts.state, opts.localStorage || null]);
  }
  // v16 MCQ focus is the app's default. The v9–v15 suites certify the full flow (written, practical,
  // reconstruct, v14 primer), so they run with focus "ALL" unless a probe asks for v16 (opts.v16).
  if (!opts.v16) await context.addInitScript(() => { window.INTELLECTUALITY_V16_FOCUS = 'ALL'; });
  const page = await context.newPage();
  page.on('pageerror', (e) => log.errors.push(String(e && e.stack || e)));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.console.push(m.type() + ': ' + m.text()); });
  page.on('request', () => log.requests++);
  if (opts.init) await context.addInitScript(opts.init);
  await page.goto(opts.url || BASE + (opts.path || ''), { waitUntil: 'load' });
  await page.waitForTimeout(opts.settle || 400);
  return { browser, context, page, log, close: async () => { await context.close(); if (!opts.browser) await browser.close(); } };
}
async function tick(page, ms = 300) {
  try { await page.clock.runFor(ms); } catch (_) { await page.waitForTimeout(ms); }
}
module.exports = { open, tick, BASE };
