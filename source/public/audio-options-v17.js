/* INTELLECTUALITY v17.2 · Commute mode and the read-aloud voice are OPTIONAL. Owner, 25 Sep 2026: "Allow the
 * commute mode optional; also the AI-generated voice is bad."
 * - Off by default: the Sunday/Tuesday/Thursday "START TRIP · 25 MIN HANDS-FREE" button, the professor's
 *   "READ IT TO ME" button and the commute screens are hidden, and the app never enters commute mode by itself.
 * - One switch turns it on (Tools → "🚗 Commute mode", or the progress panel's settings). Off again hides it all
 *   and stops any speech at once.
 * - When it is on, speech uses the best voice the device has (Premium / Enhanced / Siri voices first, never
 *   the novelty ones), or the one picked in the voice menu, at a chosen speed.
 */
(function () {
  "use strict";
  const VERSION = "17.2";
  const E = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  function safe(f, fb) {
    try {
      return f();
    } catch (e) {
      console.warn("[audio]", e);
      return fb;
    }
  }
  const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  const persist = () => safe(() => typeof save === "function" && save());
  function A() {
    if (typeof S === "undefined" || !S) return { commute: false, voice: "", rate: 0 };
    let a = S.audio;
    if (!isObj(a)) a = S.audio = {};
    a.commute = a.commute === true;
    a.voice = typeof a.voice === "string" ? a.voice : "";
    a.rate = Number.isFinite(+a.rate) && +a.rate >= 0.6 && +a.rate <= 1.4 ? +a.rate : 0;
    return a;
  }
  const on = () => A().commute;

  /* ───────────── the best voice on this device ───────────── */
  const NOVELTY = /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|ralph|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley/i;
  function voices() {
    return safe(() => (window.speechSynthesis ? speechSynthesis.getVoices() : []), []) || [];
  }
  function score(v) {
    const n = v.name || "",
      lang = String(v.lang || "");
    if (!/^en/i.test(lang)) return -1000;
    let s = 0;
    if (NOVELTY.test(n)) s -= 500;
    if (/premium/i.test(n)) s += 60;
    if (/enhanced|neural|natural/i.test(n)) s += 45;
    if (/siri/i.test(n)) s += 35;
    if (/google|microsoft/i.test(n)) s += 20;
    if (/ava|samantha|daniel|karen|moira|tessa|serena|zoe|evan|nathan|allison|susan|aria|jenny|guy|libby|sonia|ryan/i.test(n)) s += 10;
    if (/en[-_](US|GB)/i.test(lang)) s += 4;
    if (v.default) s += 2;
    return s;
  }
  function best() {
    const vs = voices().filter((v) => score(v) > -100);
    const picked = A().voice && vs.find((v) => v.voiceURI === A().voice || v.name === A().voice);
    if (picked) return picked;
    return vs.sort((a, b) => score(b) - score(a))[0] || null;
  }
  // every utterance the app speaks goes through here
  function patchSpeech() {
    const ss = window.speechSynthesis;
    if (!ss || ss.__ixPatched) return;
    const speak = ss.speak.bind(ss);
    ss.speak = function (u) {
      if (!on()) {
        ss.cancel();
        return;
      }
      safe(() => {
        const v = best();
        if (v) u.voice = v;
      });
      safe(() => {
        if (A().rate) u.rate = A().rate;
      });
      return speak(u);
    };
    ss.__ixPatched = true;
  }

  /* ───────────── the switch ───────────── */
  function setOn(v) {
    const a = A();
    a.commute = !!v;
    if (!a.commute) {
      S.commute = false;
      safe(() => window.speechSynthesis && speechSynthesis.cancel());
    }
    persist();
    apply();
    safe(() => render());
  }
  const DRIVE = /^(Sunday|Tuesday|Thursday)$/;
  function apply() {
    if (!document.body) return;
    document.body.classList.toggle("ixAudioOn", on());
    const b = document.getElementById("commuteBtn");
    if (!b) return;
    const driveDay = safe(() => DRIVE.test(day().weekday), false);
    if (!on()) b.textContent = "🚗 Commute mode: OFF · tap to turn on";
    else if (!(driveDay && /Drive audio/.test(b.textContent))) b.textContent = "🚗 Commute mode: ON · tap to " + (S.commute ? "close" : "open");
  }
  function voiceRow() {
    const vs = voices().filter((v) => score(v) > -100).sort((a, b) => score(b) - score(a)),
      cur = best();
    return (
      '<div class="ixAudioRow"><label>🎙 Voice <select data-ixau="voice">' +
      '<option value="">Best on this device' + (cur && !A().voice ? " (" + E(cur.name) + ")" : "") + "</option>" +
      vs.map((v) => '<option value="' + E(v.voiceURI) + '"' + (A().voice === v.voiceURI ? " selected" : "") + ">" + E(v.name) + " · " + E(v.lang) + "</option>").join("") +
      '</select></label><label>Speed <select data-ixau="rate">' +
      [["", "normal"], ["0.85", "slower"], ["1.1", "faster"], ["1.25", "fast"]].map(([v, t]) => '<option value="' + v + '"' + (String(A().rate || "") === v ? " selected" : "") + ">" + t + "</option>").join("") +
      '</select></label><button type="button" class="ixAudioBtn" data-ixau="test">▶ Test</button><button type="button" class="ixAudioBtn ghost" data-ixau="off">Turn commute mode off</button></div>' +
      '<div class="ixAudioTip">The voice is your device\'s own. On iPad the best ones are free: Settings → Accessibility → Spoken Content → Voices → English → download a <b>Premium</b> or <b>Enhanced</b> voice (e.g. Ava, Evan, Zoe), then pick it here.</div>'
    );
  }
  function decorate() {
    const p = document.getElementById("player");
    if (!p || !on() || !S.commute) return;
    const box = p.querySelector(".drivebox, .stage");
    if (box && !box.querySelector(".ixAudioRow")) box.insertAdjacentHTML("beforeend", voiceRow());
  }
  document.addEventListener(
    "click",
    (ev) => {
      const t = ev.target && ev.target.closest ? ev.target : null;
      if (!t) return;
      const cb = t.closest("#commuteBtn");
      if (cb && !on()) {
        // while it is off, the Tools button turns it on and opens the commute screen (voice picker + off switch
        // are there); once on, the button keeps its old job: open / close the commute screen
        ev.stopImmediatePropagation();
        ev.preventDefault();
        A().commute = true;
        S.commute = true;
        persist();
        apply();
        safe(() => render());
        return;
      }
      const b = t.closest("[data-ixau]");
      if (!b || b.tagName === "SELECT") return;
      if (b.dataset.ixau === "test") {
        const u = new SpeechSynthesisUtterance("Brown-Séquard: the right half of the cord is cut. Same side: vibration and movement are lost. Opposite side: pain and temperature.");
        safe(() => speechSynthesis.cancel());
        safe(() => speechSynthesis.speak(u));
      } else if (b.dataset.ixau === "off") setOn(false);
    },
    true,
  );
  document.addEventListener("change", (ev) => {
    const t = ev.target;
    if (!t || !t.dataset) return;
    if (t.dataset.ixau === "voice") {
      A().voice = t.value;
      persist();
    } else if (t.dataset.ixau === "rate") {
      A().rate = t.value ? +t.value : 0;
      persist();
    } else if (t.dataset.ixauOpt === "commute") setOn(t.checked);
  });

  function boot() {
    if (window.INTELLECTUALITY_AUDIO_BOOTED) return;
    if (typeof nextAction !== "function" || typeof render !== "function" || typeof S === "undefined" || !document.body) return void setTimeout(boot, 60);
    window.INTELLECTUALITY_AUDIO_BOOTED = true;
    A();
    patchSpeech();
    safe(() => window.speechSynthesis && speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", () => {}));
    // commute mode only when it is switched on
    const base = nextAction;
    nextAction = function () {
      if (!on() && S.commute) S.commute = false;
      return base.apply(this, arguments);
    };
    const baseRender = render;
    render = function () {
      const out = baseRender.apply(this, arguments);
      safe(apply);
      safe(decorate);
      return out;
    };
    apply();
    if (!on() && S.commute) {
      S.commute = false;
      persist();
    }
    safe(() => render());
  }
  window.INTELLECTUALITY_AUDIO = { version: VERSION, on, set: setOn, best: () => safe(() => best()?.name || null, null), score };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
