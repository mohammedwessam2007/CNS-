// Local stand-in for the Vercel host: serves deploy/vercel/dist with cleanUrls and runs the real
// api/*.js handlers (Node req/res helpers emulated) on the in-memory learner store.
// Usage: IX_MEMORY_STORE=1 node tests/vercel_host_serve.js 8790
if (process.env.IX_STANDIN_NO_CLOUD !== "1") process.env.IX_MEMORY_STORE = "1";
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../deploy/vercel");
const DIST = path.join(ROOT, "dist"), PORT = Number(process.argv[2] || 8790);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".png": "image/png" };
const handlers = {};
async function handler(name) {
  if (!handlers[name]) handlers[name] = (await import(path.join(ROOT, "api", name + ".js"))).default;
  return handlers[name];
}
const log = [];
http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  const m = /^\/api\/(state|vision)$/.exec(u.pathname);
  if (m) {
    let raw = ""; for await (const c of req) raw += c;
    req.body = raw && /json/.test(req.headers["content-type"] || "") ? JSON.parse(raw) : raw || undefined;
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(o)); return res; };
    const entry = { t: Date.now(), method: req.method, path: u.pathname, sync: (req.headers["x-ix-sync"] || "").slice(0, 4), ua: (req.headers["x-test-device"] || ""), marker: req.body && req.body.state ? req.body.state.__hostTestMarker || null : undefined, base: req.body && req.body.baseVersion, force: req.body && req.body.force };
    log.push(entry);
    try { await (await handler(m[1]))(req, res); } catch (e) { res.statusCode = 500; res.end(String(e)); }
    entry.status = res.statusCode;
    return;
  }
  if (u.pathname === "/__log") { res.setHeader("content-type", "application/json"); return res.end(JSON.stringify(log)); }
  let p = decodeURIComponent(u.pathname);
  if (p === "/") p = "/index.html";
  let f = path.join(DIST, p);
  if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html"; // cleanUrls
  if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end("not found"); }
  res.setHeader("content-type", TYPES[path.extname(f)] || "application/octet-stream");
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log("vercel-host stand-in on", PORT));
