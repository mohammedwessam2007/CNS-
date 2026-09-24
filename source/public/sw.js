/* INTELLECTUALITY service worker (v15.3; cache name bumped for v16): the app keeps working without internet.
 * - Pages, scripts, styles, notes: NETWORK FIRST, so a new deploy is always picked up; the last
 *   good copy is served when offline.
 * - Bundled pictures (/pics/<hash>.<ext>, content-addressed, never change): CACHE FIRST.
 * - The page can ask for the next days' pictures to be fetched ahead ({type: "precache", urls}).
 * - /api/* (cloud save) and every other origin are never touched.
 */
const SHELL = "ix-shell-16.2";
const PICS = "ix-pics";
const IMMUTABLE = /^\/pics\/[0-9a-f]{14}\.(png|jpe?g|svg|webp|gif)$/;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.add("/").catch(() => null)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith("ix-shell-") && k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin || u.pathname.startsWith("/api/")) return;
  if (IMMUTABLE.test(u.pathname)) {
    e.respondWith(
      caches.open(PICS).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const r = await fetch(req);
        if (r.ok) c.put(req, r.clone());
        return r;
      }),
    );
    return;
  }
  e.respondWith(
    fetch(req)
      .then((r) => {
        if (r.ok && r.type === "basic") {
          const copy = r.clone();
          caches.open(SHELL).then((c) => c.put(req, copy));
        }
        return r;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((m) => m || (req.mode === "navigate" ? caches.match("/") : Response.error()))),
  );
});

self.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type !== "precache" || !Array.isArray(d.urls)) return;
  const urls = d.urls.filter((x) => typeof x === "string" && IMMUTABLE.test(x)).slice(0, 160);
  e.waitUntil(
    caches.open(PICS).then(async (c) => {
      for (const url of urls) {
        if (await c.match(url)) continue;
        try {
          const r = await fetch(url);
          if (r.ok) await c.put(url, r);
        } catch (_) {}
      }
    }),
  );
});
