// Local stand-in for Wikipedia + Wikimedia Commons, used to test the build-time picture bundler
// (deploy/vercel/pics.mjs) inside the sandbox, which cannot reach Wikimedia.
// Usage: node tests/pics_mock_server.js <port>
// Rules: an article exists unless its title contains "Nosuch"; its images are
// "<T> labeled diagram.svg" (lead) and "<T> histology micrograph.jpg"; every file exists on Commons
// (CC BY-SA 4.0) except titles containing "Localonly"; thumbnails are labelled SVGs.
const http = require('http');
const PORT = +process.argv[2] || 8799;
const base = 'http://127.0.0.1:' + PORT;
let hits = { api: 0, rest: 0, commons: 0, img: 0 };
const json = (res, o) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
const esc = (s) => String(s).replace(/[<&>"]/g, '');
http.createServer((req, res) => {
  const u = new URL(req.url, base), q = Object.fromEntries(u.searchParams);
  if (u.pathname === '/stats') return json(res, hits);
  if (u.pathname === '/w/api.php') {
    hits.api++;
    if (q.list === 'search') return json(res, { query: { search: q.srsearch.split(/\s+/).slice(0, 2).length ? [{ title: q.srsearch.replace(/"/g, '') }] : [] } });
    const t = q.titles;
    if (/Nosuch/.test(t)) return json(res, { query: { pages: [{ title: t, missing: true }] } });
    if (q.prop === 'images') return json(res, { query: { pages: [{ title: t, images: [{ title: 'File:' + t + ' labeled diagram.svg' }] }] } });
    return json(res, { query: { pages: [{ title: t, pageimage: (t + ' labeled diagram.svg').replace(/ /g, '_') }] } });
  }
  if (u.pathname.startsWith('/rest/')) {
    hits.rest++;
    const t = decodeURIComponent(u.pathname.slice(6)).replace(/_/g, ' ');
    return json(res, { items: [
      { type: 'image', title: 'File:' + t + ' labeled diagram.svg', leadImage: true, caption: { text: t + ' labeled diagram' } },
      { type: 'image', title: 'File:' + t + ' histology micrograph.jpg', leadImage: false, caption: { text: t + ' micrograph' } },
      { type: 'image', title: 'File:Commons-logo.svg', leadImage: false },
    ] });
  }
  if (u.pathname === '/commons/w/api.php') {
    hits.commons++;
    if (q.list === 'search') return json(res, { query: { search: [{ title: 'File:' + q.srsearch.replace(/intitle:|"/g, '') + ' diagram.png' }] } });
    const pages = {};
    q.titles.split('|').forEach((t, i) => {
      if (/Localonly/.test(t)) { pages[-1 - i] = { title: t, missing: '' }; return; }
      const name = t.replace(/^File:/, '').replace(/ /g, '_');
      pages[i + 1] = { title: t, imageinfo: [{ thumburl: base + '/img/' + encodeURIComponent(name) + '.svg', descriptionurl: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(t), mime: /\.jpg$/i.test(t) ? 'image/jpeg' : /\.svg$/i.test(t) ? 'image/svg+xml' : 'image/png', width: 1200, height: 900, extmetadata: { LicenseShortName: { value: 'CC BY-SA 4.0' }, Artist: { value: '<a href="#">Mock Author</a>' } } }] };
    });
    return json(res, { query: { pages } });
  }
  if (u.pathname.startsWith('/img/')) {
    hits.img++;
    const name = decodeURIComponent(u.pathname.slice(5)).replace(/\.svg$/, '').replace(/_/g, ' ');
    const hue = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
    const body = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720"><rect width="100%" height="100%" fill="hsl(${hue},55%,86%)"/><rect x="40" y="40" width="880" height="640" rx="30" fill="none" stroke="hsl(${hue},50%,40%)" stroke-width="6"/><text x="50%" y="42%" font-family="sans-serif" font-size="30" text-anchor="middle" fill="#223">BUNDLED IN THE APP</text><text x="50%" y="54%" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#334">${esc(name).slice(0, 60)}</text><text x="50%" y="64%" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#556">(test stand-in for the real Wikimedia picture)</text>${'<!-- pad -->'.repeat(160)}</svg>`;
    res.writeHead(200, { 'content-type': 'image/svg+xml' }); return res.end(body);
  }
  res.writeHead(404); res.end('nf');
}).listen(PORT, '127.0.0.1', () => console.log('pics mock on', base));
