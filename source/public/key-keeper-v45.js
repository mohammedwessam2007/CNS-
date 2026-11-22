/* INTELLECTUALITY v45 · the OpenRouter key stays (owner, 22 Nov: "I put and saved the API key and the AI isn't working…
 * I'm not pasting an API key every day").
 *  - The key is kept in TWO places on this device: localStorage (what the app reads) and IndexedDB (a mirror). On every
 *    start, if localStorage lost it (storage pressure, a cleared cache), it is restored from IndexedDB at once.
 *  - The app asks the browser for persistent storage, so the system does not evict it.
 *  - A restore link: https://…/CNS-/#k=<key>. The part after # never leaves the phone (browsers do not send it to the
 *    server). Opening it saves the key and removes it from the address bar. Kept in his notes, one tap brings the key back.
 *  - The key is still sent only to openrouter.ai, and never committed, logged or put into progress files. */
(function () {
  "use strict";
  const K = "ix_tutor_key_v1", DB = "ix_keys_v1";
  const ok = (k) => typeof k === "string" && /^sk-or-[\w-]{10,}$/.test(k.trim());
  const lsGet = () => { try { return localStorage.getItem(K) || ""; } catch (e) { return ""; } };
  const lsSet = (k) => { try { localStorage.setItem(K, k); return localStorage.getItem(K) === k; } catch (e) { return false; } };
  function idb() { return new Promise((res) => { try { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => res(null); } catch (e) { res(null); } }); }
  async function idbGet() { const d = await idb(); if (!d) return ""; return new Promise((res) => { try { const q = d.transaction("kv").objectStore("kv").get(K); q.onsuccess = () => res(q.result || ""); q.onerror = () => res(""); } catch (e) { res(""); } }); }
  async function idbSet(v) { const d = await idb(); if (!d) return; try { const t = d.transaction("kv", "readwrite"); v ? t.objectStore("kv").put(v, K) : t.objectStore("kv").delete(K); } catch (e) {} }
  // when localStorage is full, make room by dropping caches the app can rebuild (never progress)
  function makeRoom() {
    ["ix_tutor_chat_v1", "intellectuality_v14_vcache_v1", "intellectuality_learning_twin_v1", "intellectuality_pre_v12_backup", "intellectuality_state_backup_before_link", "ix_hy_figs_v1"].forEach((x) => { try { localStorage.removeItem(x); } catch (e) {} });
  }
  async function save(k) {
    k = String(k || "").trim(); if (!ok(k)) return false;
    let good = lsSet(k); if (!good) { makeRoom(); good = lsSet(k); }
    await idbSet(k);
    try { document.dispatchEvent(new CustomEvent("ix:key", { detail: { on: true } })); } catch (e) {}
    return good;
  }
  async function forget() { try { localStorage.removeItem(K); } catch (e) {} await idbSet(""); }
  async function boot() {
    // 1. a restore link (#k=…): save it and wipe it from the address bar
    const m = /[#&]k=(sk-or-[\w-]+)/.exec(location.hash || "");
    if (m) { await save(m[1]); try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    // 2. mirror both ways
    const a = lsGet(), b = await idbGet();
    if (ok(a) && a !== b) await idbSet(a);
    else if (!ok(a) && ok(b)) { if (!lsSet(b)) { makeRoom(); lsSet(b); } try { document.dispatchEvent(new CustomEvent("ix:key", { detail: { on: true, restored: true } })); } catch (e) {} }
    // 3. ask the browser not to evict this app's storage
    try { if (navigator.storage && navigator.storage.persist && !(await navigator.storage.persisted())) await navigator.storage.persist(); } catch (e) {}
  }
  // keep the mirror in step when the tutor's own setup saves or forgets the key
  try {
    const set = Storage.prototype.setItem, del = Storage.prototype.removeItem;
    Storage.prototype.setItem = function (k, v) { const r = set.apply(this, arguments); if (this === window.localStorage && k === K && ok(v)) idbSet(String(v)); return r; };
    Storage.prototype.removeItem = function (k) { const r = del.apply(this, arguments); if (this === window.localStorage && k === K && !KEEP.busy) idbSet(""); return r; };
  } catch (e) {}
  const KEEP = { busy: false };
  const link = () => { const k = lsGet(); return ok(k) ? location.origin + location.pathname + "#k=" + k : ""; };
  window.IX_KEY = { save, forget, link, has: () => ok(lsGet()), ready: boot() };
})();
