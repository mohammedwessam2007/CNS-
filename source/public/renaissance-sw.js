const CACHE="renaissance-campus-v3";
const CORE=[
"/","/index.html","/renaissance-v1.css","/renaissance-standalone.css","/renaissance-standalone.js","/reader-v1.css","/reader-v1.js","/campus-v1.css","/campus-v1.js",
"/renaissance-s1.js","/renaissance-s2.js","/renaissance-s3a.js","/renaissance-s3b.js","/renaissance-s3c.js",
"/renaissance-civ.js","/renaissance-genome.js","/renaissance-media.js","/renaissance-sealed.js","/renaissance-v1.js","/axis-forge-v1.js",
"/manifest.webmanifest","/vendor/pdf.mjs","/vendor/pdf.worker.mjs","/vendor/fflate.mjs"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url); if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("/"))));
});