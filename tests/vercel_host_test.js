// End-to-end test of the Vercel host adapter (deploy/vercel) against tests/vercel_host_serve.js:
// sync code, first cloud save, batched saves, save-on-hide, second device via link, conflicts,
// sync page, and no page errors. Run the stand-in on :8790 first.
process.env.APP_URL = process.env.APP_URL || "http://127.0.0.1:8790/";
const fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const { open, tick } = require("./harness");
const BASE = process.env.APP_URL;
const results = [];
function check(id, name, ok, ev) {
  results.push({ id, name, ok: !!ok, ev });
  console.log((ok ? "PASS " : "FAIL ") + id.padEnd(4) + " " + name + "  · " + JSON.stringify(ev).slice(0, 220));
}
async function api(code, method = "GET", body) {
  const r = await fetch(BASE + "api/state", { method, headers: { "x-ix-sync": code, "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, j: await r.json() };
}
const T = "2026-09-22T10:00:00+03:00";
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const errors = [];
  // ── Device A: fresh learner
  const A = await open({ browser, time: T, state: null, settle: 1200, localStorage: { intellectuality_sync_gap_ms: "3000" } });
  A.page.on("pageerror", (e) => errors.push("A:" + e));
  const tag = (pg, id) => pg.context().route("**/api/state", (route) => route.continue({ headers: { ...route.request().headers(), "x-test-device": id } }));
  await tag(A.page, "A");
  await tick(A.page, 2500);
  const a0 = await A.page.evaluate(() => ({ code: window.INTELLECTUALITY_SYNC && INTELLECTUALITY_SYNC.code(), btn: (document.getElementById("cloudBtn") || {}).textContent, link: !!document.getElementById("ixSyncLink"), title: document.title }));
  check("H1", "Fresh device gets a private 26-char sync code and a session", /^[A-Z2-7]{26}$/.test(a0.code || ""), a0);
  const code = a0.code;
  let s1 = await api(code);
  check("H2", "First cloud save happens automatically (no sign-in step)", s1.status === 200 && s1.j.exists && s1.j.stateVersion >= 1, { status: s1.status, v: s1.j.stateVersion, btn: a0.btn });
  check("H3", "Cloud button shows sync state; sync-code link is offered under it", /SYNC|SAVED/.test(a0.btn || "") && a0.link, { btn: a0.btn, link: a0.link });

  // ── Progress: a real state change is saved on device at once and reaches the cloud within the batch window
  await A.page.evaluate(() => { S.__hostTestMarker = "A-1"; save(); });
  const local1 = await A.page.evaluate(() => JSON.parse(localStorage.getItem("intellectuality_v41_launch_state")).__hostTestMarker);
  await tick(A.page, 600);
  const midCloud = (await api(code)).j.state.__hostTestMarker || null;
  await tick(A.page, 3500);
  await A.page.waitForTimeout(300);
  const s2 = await api(code);
  check("H4", "Every action saves on the device immediately", local1 === "A-1", { local1 });
  check("H5", "Cloud writes are batched, then land (≤ gap)", midCloud !== "A-1" && s2.j.state.__hostTestMarker === "A-1", { beforeGap: midCloud, afterGap: s2.j.state.__hostTestMarker, v: s2.j.stateVersion });

  // ── Save when the app is hidden (iPad home button / tab switch)
  await A.page.evaluate(() => { S.__hostTestMarker = "A-hide"; save(); Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await A.page.waitForTimeout(400);
  const s3 = await api(code);
  check("H6", "Hiding the app saves to the cloud immediately", s3.j.state.__hostTestMarker === "A-hide", { v: s3.j.stateVersion });
  await A.page.evaluate(() => { Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true }); });

  // ── Device B opens the link → gets A's progress
  const B = await open({ browser, time: T, state: null, settle: 800, path: "#sync=" + code });
  B.page.on("pageerror", (e) => errors.push("B:" + e));
  await tag(B.page, "B");
  await B.page.waitForTimeout(2500);
  const b0 = await B.page.evaluate(() => ({ code: INTELLECTUALITY_SYNC.code(), marker: S.__hostTestMarker || null, hash: location.hash }));
  check("H7", "Second device via link restores the same progress; code removed from the URL", b0.code === code && b0.marker === "A-hide" && !b0.hash, b0);

  // ── Conflicts are decided by cloud version + real learning, never by device clocks.
  // (Each browser context here has its own fake clock started at the same instant, so B's clock runs
  //  behind A's — exactly the skew that breaks timestamp-based sync.)
  const learn = (pg, marker, xp) => pg.evaluate(([mk, dx]) => { S.__hostTestMarker = mk; S.xp = (S.xp || 0) + dx; S.answers = S.answers || {}; S.answers["host-test-" + mk] = { ok: true }; save(); return INTELLECTUALITY_SYNC.flush(); }, [marker, xp]);
  const peek = (pg) => pg.evaluate(() => ({ marker: S.__hostTestMarker || null, xp: S.xp || 0, v: INTELLECTUALITY_SYNC.status().stateVersion }));
  await learn(B.page, "B-learned", 30);
  await B.page.waitForTimeout(600);
  const vB = (await api(code)).j;
  check("H8", "Device B studies; its progress reaches the cloud", vB.state.__hostTestMarker === "B-learned", { v: vB.stateVersion, xp: vB.state.xp });

  // A has been idle since B studied. Reopening A must LOAD B's progress, not overwrite it with A's older copy
  // (A's page load re-saves with a fresh timestamp, which would make it look newest).
  const navA = A.page.waitForNavigation({ timeout: 8000 }).catch(() => null);
  await A.page.reload();
  await navA;
  await A.page.waitForTimeout(2500);
  const aNow = await peek(A.page).catch(() => null);
  const vA = (await api(code)).j;
  check("H9", "An idle device reopening later loads the newer progress and never overwrites it", aNow && aNow.marker === "B-learned" && vA.state.__hostTestMarker === "B-learned" && vA.state.xp === vB.state.xp, { aNow, cloud: vA.state.__hostTestMarker, cloudXp: vA.state.xp });

  // Housekeeping-only cloud change (another device just opened) must not beat real study on this device.
  await api(code, "POST", { state: { ...vA.state, __hostTestMarker: "housekeeping-bump" }, baseVersion: vA.stateVersion, clientUpdatedAt: "2099-01-01T00:00:00.000Z" });
  await learn(B.page, "B-learned-2", 20);
  await B.page.waitForTimeout(900);
  const vF = (await api(code)).j;
  check("H10", "A device that studied keeps its progress over a housekeeping-only cloud change", vF.state.__hostTestMarker === "B-learned-2" && vF.state.xp === vB.state.xp + 20, { v: vF.stateVersion, xp: vF.state.xp });

  // Both devices studied while apart: more learning wins; the other copy is kept as a local backup.
  await A.page.evaluate(() => INTELLECTUALITY_SYNC.status());
  const navA2 = A.page.waitForNavigation({ timeout: 8000 }).catch(() => null);
  await learn(A.page, "A-small", 5); // A's base version is stale → 409 → both learned → B (more) wins on A
  await navA2;
  await A.page.waitForTimeout(1500);
  const aAfter = await A.page.evaluate(() => ({ marker: S.__hostTestMarker, backup: (INTELLECTUALITY_SYNC.backup() || {}).reason || null }));
  const vG = (await api(code)).j;
  check("H14", "Both studied: the copy with more learning wins, the other is kept as a backup", aAfter.marker === "B-learned-2" && vG.state.__hostTestMarker === "B-learned-2" && aAfter.backup === "newer-cloud-copy", { aAfter, cloud: vG.state.__hostTestMarker });

  // ── Sync page
  const P = await open({ browser, time: T, settle: 600, path: "login?next=/", localStorage: { intellectuality_sync_code_v1: code } });
  P.page.on("pageerror", (e) => errors.push("P:" + e));
  const p0 = await P.page.evaluate(() => ({ shown: document.querySelector("#code").textContent, title: document.title }));
  await P.page.fill("#other", "not-a-code");
  await P.page.click("#use");
  const perr = await P.page.textContent("#err");
  check("H11", "Sync page shows the code formatted and rejects an invalid code", p0.shown.replace(/-/g, "") === code && /not a valid/.test(perr), { shown: p0.shown, perr });

  // ── Server guards
  const bad = await fetch(BASE + "api/state").then((r) => r.status);
  const big = await api(code, "POST", { state: { blob: "x".repeat(1600000) }, baseVersion: 0, force: true });
  const vis = await fetch(BASE + "api/vision", { method: "POST" }).then(async (r) => ({ s: r.status, j: await r.json() }));
  check("H12", "Server: no code → 401, oversize → 413, vision → graceful 503", bad === 401 && big.status === 413 && vis.s === 503, { bad, big: big.status, vis: vis.s });

  check("H13", "No page errors on either device or the sync page", errors.length === 0, errors);
  await A.close(); await B.close(); await P.close(); await browser.close();
  const pass = results.filter((r) => r.ok).length;
  console.log(`\n${pass}/${results.length} host checks passed`);
  fs.writeFileSync(process.argv[2] || require("path").join(__dirname, "out", "vercel_host_test.json"), JSON.stringify({ pass, total: results.length, results }, null, 1));
  process.exit(pass === results.length ? 0 : 1);
})();
