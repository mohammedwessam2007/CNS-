// Minimal static server for local certification: serves a Hatchable public/ dir
// and emulates /api/state (in-memory) so cloud paths can be exercised offline.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..', 'source', 'public'));
const PORT = Number(process.argv[3] || 8787);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.json': 'application/json' };
let cloud = null, version = 0;
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/state') {
    if (req.method === 'GET') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(cloud ? { exists: true, ...cloud, stateVersion: version } : { exists: false, stateVersion: 0 })); }
    let body = ''; req.on('data', c => body += c); req.on('end', () => { try { const j = JSON.parse(body); version++; cloud = { state: j.state, clientUpdatedAt: j.clientUpdatedAt }; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ ok: true, stateVersion: version, bytes: body.length })); } catch (e) { res.statusCode = 400; res.end('{}'); } });
    return;
  }
  let p = decodeURIComponent(u.pathname); if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end('not found'); }
  res.setHeader('content-type', TYPES[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log('serving', ROOT, 'on', PORT));
