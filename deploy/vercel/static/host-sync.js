/* INTELLECTUALITY · host adapter for non-Hatchable hosts (Vercel).
 *
 * The app's cloud path (index.html) expects window.hatchable.auth and a same-origin /api/state.
 * Here identity is a private 128-bit SYNC CODE kept on the device (and by the learner). It is sent
 * as the x-ix-sync header, and the server stores progress under a hash of it: no email, no cookies.
 * A link with #sync=CODE carries it to another device.
 *
 * Saving: the device copy (localStorage) updates on every action, exactly as before. Cloud writes
 * are batched to at most one per MIN_GAP while studying, plus an immediate write when the app is
 * hidden/closed or the cloud button is tapped.
 *
 * Which copy wins is decided by CLOUD VERSION and LEARNING, never by device clocks. Every page load
 * re-saves with a fresh timestamp, so timestamps alone let an idle device overwrite newer progress,
 * and a device whose clock runs behind could reload forever:
 *   - the cloud has a version this device has not seen, and the device learned nothing since its
 *     last sync → the cloud copy loads;
 *   - the device learned something and the cloud only has housekeeping changes → the device's copy
 *     is saved;
 *   - both learned → the copy with more learning wins, and the other is kept as a local backup.
 */
(function () {
  "use strict";
  if (window.hatchable && window.hatchable.auth) return; // real Hatchable host: nothing to do

  var CODE_KEY = "intellectuality_sync_code_v1",
    STATE_KEY = "intellectuality_v41_launch_state",
    APP_META_KEY = "intellectuality_cloud_meta_v1", // the app's own sync meta (kept in step)
    META_KEY = "intellectuality_sync_meta_v1", // {version, key, lastSync}: last copy both sides agreed on
    BACKUP_KEY = "intellectuality_state_backup_before_link",
    ADOPT_KEY = "intellectuality_sync_adopt_pending",
    GAP_KEY = "intellectuality_sync_gap_ms", // test hook; bounded below
    A32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    EPOCH = "1970-01-01T00:00:00.000Z";
  var MIN_GAP = 120000;
  try {
    var g = Number(localStorage.getItem(GAP_KEY));
    if (g >= 1000 && g <= 600000) MIN_GAP = g;
  } catch (_) {}

  function ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch (_) {}
    return null;
  }
  function jget(k) {
    try {
      return JSON.parse(ls(k) || "null");
    } catch (_) {
      return null;
    }
  }
  function clean(c) {
    return String(c || "").toUpperCase().replace(/[^A-Z2-7]/g, "");
  }
  function valid(c) {
    return /^[A-Z2-7]{26}$/.test(c);
  }
  function generate() {
    var b = new Uint8Array(17),
      bits = "",
      out = "";
    crypto.getRandomValues(b);
    for (var i = 0; i < b.length; i++) bits += ("00000000" + b[i].toString(2)).slice(-8);
    for (var j = 0; j < 26; j++) out += A32[parseInt(bits.substr(j * 5, 5), 2)];
    return out;
  }
  function formatted(c) {
    return (c || "").replace(/(.{4})(?=.)/g, "$1-");
  }
  function hhmm(d) {
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }

  /* ───────── learning fingerprint (counters that only move when the learner studies) ───────── */
  function n(o) {
    return o && typeof o === "object" ? Object.keys(o).length : 0;
  }
  function a(x) {
    return Array.isArray(x) ? x.length : 0;
  }
  function learnKey(s) {
    if (!s) return "";
    return [s.day || 0, n(s.segments), n(s.answers), n(s.errors), n(s.reviews), a(s.doneDays), a(s.mockHistory), n(s.qbank && s.qbank.results), s.xp || 0, a(s.v12 && s.v12.evidence)].join(".");
  }
  function learnMass(s) {
    if (!s) return 0;
    return n(s.segments) * 3 + n(s.answers) * 2 + n(s.errors) + n(s.reviews) + a(s.doneDays) * 10 + a(s.mockHistory) * 5 + n(s.qbank && s.qbank.results) * 2 + (s.xp || 0) / 10 + a(s.v12 && s.v12.evidence);
  }
  function localState() {
    return jget(STATE_KEY);
  }
  var meta = jget(META_KEY) || { version: Number((jget(APP_META_KEY) || {}).stateVersion) || 0, key: null, lastSync: null };
  function agree(version, state) {
    meta = { version: Number(version) || 0, key: learnKey(state), lastSync: new Date().toISOString(), pushedAt: (state && state._clientUpdatedAt) || null };
    ls(META_KEY, JSON.stringify(meta));
    ls(APP_META_KEY, JSON.stringify({ stateVersion: meta.version, lastSync: meta.lastSync }));
  }
  // "cloud" when the cloud copy should replace this device's copy, else "local".
  function decide(cloudState) {
    var local = localState(),
      localLearned = learnKey(local) !== meta.key,
      cloudLearned = learnKey(cloudState) !== meta.key;
    if (!local) return "cloud";
    if (!localLearned) return "cloud";
    if (!cloudLearned) return "local";
    return learnMass(cloudState) > learnMass(local) ? "cloud" : "local";
  }

  /* ───────── code ───────── */
  var code = clean(ls(CODE_KEY)),
    linkedFromUrl = false,
    restoring = false,
    cloudOff = false; // the host has no cloud store connected: device-only saving, no retries
  function adoptCode(c) {
    // Linking this device to an existing code: that code's cloud copy loads on the next read.
    // What is on this device now is kept as a local backup first.
    var cur = ls(STATE_KEY);
    if (cur) ls(BACKUP_KEY, JSON.stringify({ savedAt: new Date().toISOString(), reason: "linked-to-another-code", previousCode: code || null, state: cur }));
    meta = { version: 0, key: null, lastSync: null };
    ls(META_KEY, null);
    ls(APP_META_KEY, null);
    ls(ADOPT_KEY, "1");
    code = c;
    ls(CODE_KEY, c);
  }
  var m = /(?:^|[#&])sync=([A-Za-z2-7-]{26,40})/.exec(location.hash || "");
  if (m && valid(clean(m[1]))) {
    var incoming = clean(m[1]);
    if (incoming !== code) {
      adoptCode(incoming);
      linkedFromUrl = true;
    }
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch (_) {}
  }
  if (!valid(code)) {
    code = generate();
    ls(CODE_KEY, code);
  }
  try {
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  } catch (_) {}

  // Stand-in for window.hatchable.auth: the sync code is the session.
  window.hatchable = window.hatchable || {};
  window.hatchable.auth = {
    getSession: function () {
      return Promise.resolve({ user: { id: "sync-" + code.slice(0, 6).toLowerCase(), provider: "sync-code" } });
    },
    supportsPasskeys: function () {
      return false;
    },
  };

  /* ───────── cloud I/O ───────── */
  var nativeFetch = window.fetch.bind(window),
    dirty = false,
    force = false,
    inflight = false,
    timer = null,
    lastFlush = 0,
    status = { text: "", at: 0 };

  function label(t, good) {
    status = { text: t, at: Date.now(), good: !!good };
    var b = document.getElementById("cloudBtn");
    if (!b) return;
    b.textContent = t;
    b.style.borderColor = good ? "#365d45" : "";
    b.style.color = good ? "#a8f1bc" : "";
  }
  function isStateUrl(input) {
    var u = typeof input === "string" ? input : (input && input.url) || "";
    try {
      u = new URL(u, location.href);
      return u.origin === location.origin && u.pathname === "/api/state";
    } catch (_) {
      return false;
    }
  }
  function headers(extra) {
    var h = { "x-ix-sync": code };
    for (var k in extra || {}) h[k] = extra[k];
    return h;
  }
  function restore(cloudState, version, reason) {
    // Load the cloud copy on this device (keeping the device copy as a backup) and restart the page.
    restoring = true;
    var cur = ls(STATE_KEY);
    if (cur && reason !== "link") ls(BACKUP_KEY, JSON.stringify({ savedAt: new Date().toISOString(), reason: reason, state: cur }));
    ls(STATE_KEY, JSON.stringify(cloudState));
    agree(version, cloudState);
    label("☁ RESTORED", true);
    location.reload();
  }
  function localAhead() {
    var st = localState();
    return !!(st && st._clientUpdatedAt && st._clientUpdatedAt !== meta.pushedAt);
  }
  function schedule() {
    if (timer) return;
    var wait = Math.max(1500, lastFlush + MIN_GAP - Date.now());
    timer = setTimeout(function () {
      timer = null;
      flush("timer");
    }, wait);
  }
  function flush(reason) {
    if (timer && reason !== "timer") {
      clearTimeout(timer);
      timer = null;
    }
    if (reason !== "timer" && reason !== "conflict" && localAhead()) dirty = true; // e.g. hidden before the app's own save debounce
    if (cloudOff || restoring || !dirty || inflight || ls(ADOPT_KEY) === "1") return Promise.resolve(false);
    var state = localState();
    if (!state) return Promise.resolve(false);
    var bodyText = JSON.stringify({ state: state, baseVersion: meta.version, clientUpdatedAt: state._clientUpdatedAt || new Date().toISOString(), force: force }),
      wasForce = force;
    dirty = false;
    force = false;
    inflight = true;
    lastFlush = Date.now();
    label("☁ SYNCING…");
    var opts = { method: "POST", headers: headers({ "content-type": "application/json" }), body: bodyText };
    if (reason === "hide" && bodyText.length < 60000) opts.keepalive = true;
    return nativeFetch("/api/state", opts)
      .then(function (r) {
        return r
          .json()
          .catch(function () {
            return {};
          })
          .then(function (j) {
            return handle(r, j, wasForce, state);
          });
      })
      .catch(function () {
        dirty = true;
        label("☁ SAVED ON DEVICE · CLOUD RETRY");
        return false;
      })
      .then(function (ok) {
        inflight = false;
        if (dirty && !restoring) schedule();
        return ok;
      });
  }
  function handle(r, j, wasForce, sent) {
    if (r.ok) {
      agree(j.stateVersion, sent);
      label("☁ SYNCED " + hhmm(new Date()), true);
      return true;
    }
    if (r.status === 409 && j && j.state) {
      if (decide(j.state) === "cloud") {
        restore(j.state, j.stateVersion, "newer-cloud-copy");
        return true;
      }
      if (!wasForce) {
        dirty = true;
        force = true;
        inflight = false;
        return flush("conflict");
      }
    }
    if (r.status === 413) {
      label("☁ TOO LARGE FOR CLOUD · SAVED ON DEVICE");
      return false;
    }
    if (j && j.error === "cloud_not_configured") {
      cloudOff = true;
      dirty = false;
      label("☁ SAVED ON THIS DEVICE");
      return false;
    }
    dirty = true;
    label("☁ SAVED ON DEVICE · CLOUD RETRY");
    return false;
  }
  function jsonResponse(obj, status) {
    return new Response(JSON.stringify(obj), { status: status || 200, headers: { "content-type": "application/json" } });
  }

  window.fetch = function (input, init) {
    if (!isStateUrl(input)) return nativeFetch(input, init);
    init = init || {};
    var method = String(init.method || (input && input.method) || "GET").toUpperCase();
    if (method === "GET") {
      // The app's startup read. The decision is made here (by version and learning); the app only
      // ever sees a timestamp that makes it keep its copy and save.
      return nativeFetch("/api/state", { method: "GET", headers: headers(), cache: "no-store" }).then(function (r) {
        return r
          .clone()
          .json()
          .catch(function () {
            return null;
          })
          .then(function (j) {
            if (j && j.error === "cloud_not_configured") {
              cloudOff = true;
              [60, 400].forEach(function (ms) {
                setTimeout(function () {
                  label("☁ SAVED ON THIS DEVICE");
                }, ms);
              });
              return r;
            }
            if (!r.ok || !j) return r;
            var adopting = ls(ADOPT_KEY) === "1";
            if (adopting) ls(ADOPT_KEY, null);
            if (!j.exists) return r;
            var v = Number(j.stateVersion) || 0;
            if (adopting || (v !== meta.version && decide(j.state) === "cloud")) {
              restore(j.state, v, adopting ? "link" : "newer-cloud-copy");
              return new Promise(function () {}); // the reload takes over
            }
            if (v !== meta.version) force = true; // keep this device's copy over a housekeeping-only cloud change
            var out = {};
            for (var k in j) out[k] = j[k];
            out.clientUpdatedAt = EPOCH;
            return jsonResponse(out, 200);
          });
      });
    }
    // POST from the app: queue it and answer at once with the agreed version. The app labels the button
    // after reading this answer, so the honest label is applied a moment later.
    function relabel() {
      if (cloudOff) label("☁ SAVED ON THIS DEVICE");
      else if (dirty && !inflight && !restoring) label("☁ SAVED ON DEVICE · CLOUD ≤" + Math.max(1, Math.round(MIN_GAP / 60000)) + " MIN");
    }
    setTimeout(relabel, 60);
    setTimeout(relabel, 400);
    if (cloudOff) return Promise.resolve(jsonResponse({ error: "cloud_not_configured" }, 503));
    try {
      if (JSON.parse(init.body || "{}").force) force = true;
    } catch (_) {}
    dirty = true;
    schedule();
    return Promise.resolve(jsonResponse({ ok: true, queued: true, stateVersion: meta.version }, 200));
  };

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush("hide");
  });
  window.addEventListener("pagehide", function () {
    flush("hide");
  });
  window.addEventListener("online", function () {
    if (dirty) flush("online");
  });
  // Tapping the cloud button means "save to cloud now".
  document.addEventListener(
    "click",
    function (e) {
      var t = e.target && e.target.closest ? e.target.closest("#cloudBtn") : null;
      if (t)
        setTimeout(function () {
          flush("manual");
        }, 60);
    },
    true
  );

  // A small, calm entry point to the sync-code page, under the cloud button.
  function addSyncLink() {
    var b = document.getElementById("cloudBtn");
    if (!b || document.getElementById("ixSyncLink")) return;
    var el = document.createElement("a");
    el.id = "ixSyncLink";
    el.href = "/login?next=/";
    el.textContent = "🔑 Your sync code · continue on another device";
    el.style.cssText = "display:block;margin:6px 2px 0;font-size:12px;color:#9ba9bc;text-decoration:underline;text-underline-offset:3px";
    b.insertAdjacentElement("afterend", el);
  }
  new MutationObserver(addSyncLink).observe(document.documentElement, { childList: true, subtree: true });

  window.INTELLECTUALITY_SYNC = {
    host: "sync-code",
    code: function () {
      return code;
    },
    formatted: function () {
      return formatted(code);
    },
    link: function () {
      return location.origin + "/#sync=" + code;
    },
    linkedFromUrl: linkedFromUrl,
    useCode: function (c) {
      c = clean(c);
      if (!valid(c)) return false;
      if (c !== code) adoptCode(c);
      return true;
    },
    flush: function () {
      if (localState()) dirty = true;
      return flush("manual");
    },
    status: function () {
      return { text: status.text, pending: dirty, inflight: inflight, stateVersion: meta.version, lastSync: meta.lastSync, gapMs: MIN_GAP, cloud: cloudOff ? "not-configured" : "on" };
    },
    backup: function () {
      return jget(BACKUP_KEY);
    },
    _learnKey: learnKey,
  };
})();
