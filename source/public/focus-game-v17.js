/* INTELLECTUALITY v17 · ADHD-friendly game layer. Owner, 24 Sep 2026: "I have ADHD so gamify it, but don't
 * amputate or ruin it. Research what works best for someone with ADHD and build it in."
 * Evidence and design: docs/ADHD_RESEARCH.md. In short:
 * - Every answer pays at once (delay aversion; continuous beats partial reinforcement): XP on the verdict,
 *   a combo counter, the sprint dots fill in the same frame. A wrong answer still earns XP. Nothing is ever
 *   taken away (no response cost, no lives, no "streak lost").
 * - Time and progress you can see (Barkley: externalise at the point of performance): a bar at the bottom
 *   with the level, today's quests, the streak and the current sprint of 8 with its clock.
 * - Short sprints of 8 with a clear end, then an optional 2-minute move break (acute exercise improves
 *   inhibitory control). Offered, never forced, so hyperfocus is never cut off.
 * - Three daily quests tied to what moves the grade (learn, answer, fix mistakes); a forgiving streak with
 *   freezes; ranks named after the nervous system; the sealed mock is the boss.
 * Nothing here changes the schedule, the questions, the mocks or the minutes. XP earned here is kept in
 * S.game.xp (the app's own S.xp is left alone: v14 reads it). During a sealed mock the bar shows no score.
 */
(function () {
  "use strict";
  const VERSION = "17.0";
  const E = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  function safe(f, fb) {
    try {
      return f();
    } catch (e) {
      console.warn("[game]", e);
      return fb;
    }
  }
  const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  const num = (x, d) => (Number.isFinite(+x) ? +x : d);
  const ymd = () => safe(() => window.INTELLECTUALITY_V14.cairoYMD(), null) || new Date().toISOString().slice(0, 10);
  const gap = (a, b) => Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 864e5);
  const persist = () => safe(() => typeof save === "function" && save());
  const SPRINT = 8;

  /* ───────────── state (small, repaired on every read) ───────────── */
  function G() {
    if (typeof S === "undefined" || !S) return null;
    let g = S.game;
    if (!isObj(g) || g.v !== 1) g = S.game = { v: 1 };
    g.xp = Math.max(0, num(g.xp, 0));
    g.opt = isObj(g.opt) ? g.opt : {};
    g.opt = { on: g.opt.on !== false, sound: g.opt.sound === true, haptic: g.opt.haptic !== false, calm: g.opt.calm === true };
    g.days = isObj(g.days) ? g.days : {};
    g.streak = isObj(g.streak) ? g.streak : {};
    g.streak = { n: num(g.streak.n, 0), best: num(g.streak.best, 0), last: typeof g.streak.last === "string" ? g.streak.last : "", freeze: Math.min(3, num(g.streak.freeze, 2)), run: num(g.streak.run, 0) };
    g.sprint = isObj(g.sprint) ? g.sprint : {};
    g.sprint = { n: num(g.sprint.n, 0), k: num(g.sprint.k, 0), xp: num(g.sprint.xp, 0), t0: num(g.sprint.t0, 0), best: num(g.sprint.best, 0), h: Array.isArray(g.sprint.h) ? g.sprint.h.slice(-SPRINT).map((x) => (x ? 1 : 0)) : [] };
    g.sprints = num(g.sprints, 0);
    g.lvl = num(g.lvl, -1);
    return g;
  }
  function D() {
    const g = G(),
      k = ymd();
    if (!isObj(g.days[k])) g.days[k] = {};
    const d = g.days[k];
    for (const f of ["a", "k", "sec", "fix", "spot", "clean", "xp", "combo", "boss", "spike", "min"]) d[f] = num(d[f], 0);
    d.qd = isObj(d.qd) ? d.qd : {};
    const keys = Object.keys(g.days).sort();
    for (const old of keys.slice(0, Math.max(0, keys.length - 21))) delete g.days[old];
    return d;
  }
  const baseXP = () => num(typeof S !== "undefined" && S ? S.xp : 0, 0);
  const totalXP = () => baseXP() + (G()?.xp || 0);
  const levelOf = (x) => Math.floor(Math.sqrt(Math.max(0, x) / 50));
  const need = (l) => 50 * l * l;
  const RANKS = ["Neuron", "Synapse", "Reflex arc", "Spinal tract", "Brainstem nucleus", "Cranial nerve", "Thalamic relay", "Basal ganglia loop", "Cerebellar circuit", "Association cortex", "Connectome"];
  const rankOf = (l) => RANKS[Math.min(RANKS.length - 1, Math.floor(Math.max(0, l - 1) / 3))];
  const inMock = () => safe(() => !!(S.v16 && S.v16.mock && !S.v16.mock.done), false);
  const on = () => !!G()?.opt.on;
  const calm = () => !!G()?.opt.calm || safe(() => matchMedia("(prefers-reduced-motion: reduce)").matches, false);

  /* ───────────── streak: study days, with freezes, never a shame screen ───────────── */
  function touch() {
    const g = G(),
      st = g.streak,
      t = ymd();
    if (st.last === t) return;
    let msg = "";
    if (!st.last) st.n = 1;
    else {
      const d = gap(st.last, t);
      if (d <= 0) return;
      if (d === 1) st.n++;
      else if (st.freeze >= d - 1) {
        st.freeze -= d - 1;
        st.n++;
        msg = "❄️ " + (d - 1) + " streak freeze" + (d - 1 > 1 ? "s" : "") + " used. Streak kept: " + st.n + " days.";
      } else {
        st.n = 1;
        st.run = 0;
        msg = "👋 Welcome back. A fresh streak starts today. Brains need breaks; this one counts.";
      }
    }
    st.run++;
    if (st.run > 0 && st.run % 7 === 0 && st.freeze < 3) {
      st.freeze++;
      msg = (msg ? msg + " " : "") + "❄️ 7 days in a row: you earned a streak freeze.";
    }
    st.best = Math.max(st.best, st.n);
    st.last = t;
    if (msg) toast(msg, "info");
  }

  /* ───────────── daily quests ───────────── */
  let MD = null;
  function mockDay() {
    const k = ymd() + ":" + safe(() => S.day, 0);
    if (!MD || MD.k !== k || Date.now() - MD.t > 30000) MD = { k, t: Date.now(), v: safe(() => window.INTELLECTUALITY_V16.mockSizeFor() > 0, false) };
    return MD.v;
  }
  function quests() {
    const d = D(),
      mode = safe(() => day().mode, "TEACHING"),
      dn = safe(() => day().day, 1),
      mock = inMock() || mockDay() || d.boss > 0;
    const q = [];
    q.push(mode === "TEACHING" ? { id: "learn", i: "📖", t: "Learn 6 lesson sections", n: d.sec, of: 6 } : { id: "clean", i: "🎯", t: "Clean-sweep a Spot-it drill (5/5)", n: d.clean, of: 1 });
    q.push(mock ? { id: "boss", i: "👾", t: "Beat today's boss: the sealed mock", n: d.boss, of: 1 } : { id: "mcq", i: "✅", t: "Answer 25 past-paper MCQs", n: d.a, of: 25 });
    const third = ["fix", "combo", mode === "TEACHING" ? "clean" : "fix"][dn % 3];
    q.push(third === "fix" ? { id: "fix", i: "⚔️", t: "Win 3 rematches (past mistakes, right this time)", n: d.fix, of: 3 } : third === "combo" ? { id: "combo", i: "🔥", t: "Hit a 5× combo", n: d.combo, of: 5 } : { id: "clean2", i: "🎯", t: "Clean-sweep a Spot-it drill (5/5)", n: d.clean, of: 1 });
    return q;
  }
  function checkQuests() {
    const d = D(),
      g = G(),
      qs = quests();
    for (const q of qs)
      if (q.n >= q.of && !d.qd[q.id]) {
        d.qd[q.id] = 1;
        g.xp += 30;
        d.xp += 30;
        toast("✅ Quest done: " + q.t + " · +30 XP", "good");
        sound("quest");
      }
    if (qs.every((q) => d.qd[q.id]) && !d.qd.chest) {
      d.qd.chest = 1;
      g.xp += 50;
      d.xp += 50;
      toast("🎁 All three quests: daily chest · +50 XP", "gold");
      confetti();
      sound("level");
    }
  }

  /* ───────────── XP, levels ───────────── */
  const CAP = { spot: 200, spotAll: 100, spike: 20, explore: 0 };
  function award(kind, xp) {
    const g = G();
    if (!g) return 0;
    const d = D();
    xp = Math.max(0, num(xp, 0));
    if (kind === "spot") d.spot++;
    if (kind === "spotAll") d.clean++;
    if (kind === "spike") d.spike++;
    if (CAP[kind] != null) {
      d.cap = isObj(d.cap) ? d.cap : {};
      const used = num(d.cap[kind], 0);
      xp = Math.max(0, Math.min(xp, CAP[kind] - used));
      d.cap[kind] = used + xp;
    }
    if (xp) {
      g.xp += xp;
      d.xp += xp;
    }
    if (kind !== "explore") touch();
    checkQuests();
    levelCheck();
    persist();
    hud();
    return xp;
  }
  function levelCheck() {
    const g = G(),
      l = levelOf(totalXP());
    if (g.lvl < 0) g.lvl = l;
    if (l > g.lvl && !inMock()) {
      g.lvl = l;
      toast('<b class="ixGLvUp">LEVEL ' + l + "</b> · " + E(rankOf(l)) + " 🧠", "gold", 4200);
      confetti();
      sound("level");
    }
  }

  /* ───────────── answers: the moment of reward ───────────── */
  let pend = null,
    sprintEnd = null;
  function beforePick(btn) {
    const qid = btn.dataset.qid;
    if (!qid || safe(() => window.INTELLECTUALITY_V16.act.current().answered, true)) return;
    const prev = safe(() => window.INTELLECTUALITY_V16.state(qid), null);
    pend = { qid, xp0: baseXP(), rematch: !!prev && (prev.r === "w" || (prev.lp || 0) > 0 || !!prev.x), t: Date.now() };
  }
  function afterPick() {
    const p = pend;
    pend = null;
    if (!p) return;
    const res = safe(() => S.qbank.results[p.qid], null);
    if (!res || Date.parse(res.at) < p.t - 2000) return;
    const ok = !!res.ok,
      gain = Math.max(0, baseXP() - p.xp0),
      g = G(),
      d = D(),
      sp = g.sprint,
      combo = num(S.combo, 0);
    d.a++;
    if (ok) d.k++;
    if (ok && p.rematch) d.fix++;
    d.combo = Math.max(d.combo, combo);
    if (!sp.n) sp.t0 = Date.now();
    sp.n++;
    if (ok) sp.k++;
    sp.xp += gain;
    sp.best = Math.max(sp.best, combo);
    sp.h.push(ok ? 1 : 0);
    touch();
    juice(ok, gain, combo, p.rematch);
    if (sp.n >= SPRINT) {
      sprintEnd = { n: sp.n, k: sp.k, xp: sp.xp, best: sp.best, mins: Math.max(1, Math.round((Date.now() - sp.t0) / 60000)) };
      g.sprints++;
      g.sprint = { n: 0, k: 0, xp: 0, t0: 0, best: 0, h: [] };
    }
    checkQuests();
    levelCheck();
    persist();
    hud();
  }
  function juice(ok, gain, combo, rematch) {
    if (!on()) return;
    const v = [...document.querySelectorAll("#player .v16Verdict")].pop();
    if (v && !v.querySelector(".ixGPop")) {
      v.insertAdjacentHTML(
        "beforeend",
        '<span class="ixGPop' + (calm() ? " still" : "") + '">+' + gain + " XP</span>" +
          (ok && combo >= 3 ? '<span class="ixGCombo">🔥 ×' + combo + "</span>" : "") +
          (ok && rematch ? '<span class="ixGRe">⚔️ rematch won</span>' : "") +
          (!ok ? '<span class="ixGTrap">🪤 trap spotted: it comes back as a rematch</span>' : ""),
      );
      if (ok && !calm()) burst(v);
    }
    if (G().opt.haptic) safe(() => navigator.vibrate && navigator.vibrate(ok ? 14 : [6, 50, 6]));
    sound(ok ? (combo >= 5 ? "combo" : "ok") : "soft");
  }

  /* ───────────── lessons, mocks ───────────── */
  function onAct(a) {
    const d = D(),
      g = G();
    if (a === "v15-next" || a === "finish-segment") {
      d.sec++;
      const x = a === "finish-segment" ? 12 : 5;
      g.xp += x;
      d.xp += x;
      touch();
      checkQuests();
      levelCheck();
      persist();
      hud();
      if (on()) toast("+" + x + " XP · " + (a === "finish-segment" ? "step done" : "section learned"), "mini", 1400);
    }
  }
  function onMockDone() {
    const d = D(),
      g = G();
    d.boss = 1;
    g.xp += 50;
    d.xp += 50;
    touch();
    toast("👾 Boss defeated · +50 XP. Every miss comes back tomorrow as a rematch.", "gold", 4200);
    confetti();
    checkQuests();
    levelCheck();
    persist();
    hud();
  }

  /* ───────────── the bar (always visible), the panel, toasts, breaks ───────────── */
  function ring(frac, size, stroke, col) {
    const r = (size - stroke) / 2,
      c = 2 * Math.PI * r;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" aria-hidden="true"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="#223a55" stroke-width="' + stroke + '"/><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + (c * Math.max(0, Math.min(1, frac))).toFixed(1) + " " + c.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')"/></svg>';
  }
  const clock = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  function hud() {
    const g = G();
    if (!g || !document.body) return;
    let bar = document.getElementById("ixGame");
    document.body.classList.toggle("ixGOn", g.opt.on);
    if (!g.opt.on) {
      if (bar) bar.hidden = true;
      return;
    }
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "ixGame";
      bar.className = "ixG";
      bar.setAttribute("role", "region");
      bar.setAttribute("aria-label", "Your progress");
      document.body.appendChild(bar);
    }
    bar.hidden = false;
    const mock = inMock();
    // a running sealed mock freezes the score shown (even after a reload), so nothing tells right from wrong
    if (mock && !Number.isFinite(g.mockXP)) g.mockXP = totalXP();
    if (!mock && g.mockXP != null) delete g.mockXP;
    const
      x = mock ? g.mockXP : totalXP(),
      l = levelOf(x),
      lo = need(l),
      hi = need(l + 1),
      frac = (x - lo) / Math.max(1, hi - lo),
      qs = quests(),
      d = D(),
      done = qs.filter((q) => d.qd[q.id]).length,
      sp = g.sprint,
      dots = Array.from({ length: SPRINT }, (_, i) => '<i class="' + (i < sp.h.length ? (sp.h[i] ? "ok" : "no") : i === sp.h.length ? "now" : "") + '"></i>').join(""),
      tSprint = sp.n && sp.t0 ? Date.now() - sp.t0 : 0;
    bar.innerHTML =
      '<button type="button" class="ixGLv" data-ixg="panel" aria-label="Level ' + l + ", open progress\">" + ring(frac, 40, 4, "#d9ff43") + "<b>" + l + "</b></button>" +
      '<div class="ixGMid"><div class="ixGRank">' + E(rankOf(l)) + (mock ? ' <small>👾 boss fight · sealed</small>' : ' <small>' + (x - lo).toLocaleString("en") + " / " + (hi - lo).toLocaleString("en") + " XP</small>") + '</div><div class="ixGXp"><i style="width:' + Math.round(frac * 100) + '%"></i></div></div>' +
      '<div class="ixGStreak" title="Study-day streak (freezes cover missed days)">🔥<b>' + g.streak.n + "</b>" + (g.streak.freeze ? "<small>❄️" + g.streak.freeze + "</small>" : "") + "</div>" +
      (mock ? "" : '<div class="ixGSprint" title="This sprint: 8 questions"><span class="ixGDots">' + dots + '</span><small data-ixg-clock>' + (tSprint ? "⏱ " + clock(tSprint) : "sprint " + (g.sprints + 1)) + "</small></div>") +
      '<button type="button" class="ixGQ' + (done === qs.length ? " all" : "") + '" data-ixg="panel" aria-label="Today\'s quests">🎯 <b>' + done + "/" + qs.length + "</b></button>";
  }
  function tickClock() {
    const el = document.querySelector("#ixGame [data-ixg-clock]"),
      g = G();
    if (!el || !g || !g.sprint.n || !g.sprint.t0) return;
    el.textContent = "⏱ " + clock(Date.now() - g.sprint.t0);
  }
  function panel() {
    closePanel();
    const g = G(),
      d = D(),
      qs = quests(),
      x = totalXP(),
      l = levelOf(x);
    const o = document.createElement("div");
    o.className = "ixGSheetWrap";
    o.innerHTML =
      '<div class="ixGSheet" role="dialog" aria-label="Progress and quests"><button type="button" class="ixGX" data-ixg="close" aria-label="Close">✕</button>' +
      '<div class="ixGHead">' + ring((x - need(l)) / Math.max(1, need(l + 1) - need(l)), 64, 6, "#d9ff43") + '<div><div class="ixGBig">Level ' + l + " · " + E(rankOf(l)) + '</div><div class="ixGSub">' + x.toLocaleString("en") + " XP · next rank at level " + (Math.floor(Math.max(0, l - 1) / 3) * 3 + 4) + " · streak " + g.streak.n + " (best " + g.streak.best + ") · ❄️ " + g.streak.freeze + "</div></div></div>" +
      "<h4>Today's quests</h4>" +
      qs.map((q) => '<div class="ixGQuest' + (d.qd[q.id] ? " done" : "") + '"><span class="ixGQi">' + q.i + '</span><div><div>' + E(q.t) + '</div><div class="ixGQBar"><i style="width:' + Math.round(Math.min(1, q.n / q.of) * 100) + '%"></i></div></div><b>' + (d.qd[q.id] ? "✓" : Math.min(q.n, q.of) + "/" + q.of) + "</b></div>").join("") +
      '<div class="ixGSub">Each quest +30 XP; all three open the daily chest (+50). Today: ' + d.a + " answered, " + d.k + " right, " + d.fix + " rematches won, " + d.xp + " bonus XP.</div>" +
      "<h4>Settings</h4>" +
      [["on", "Game layer (bar, XP pops, quests)"], ["haptic", "Vibration on answers (Android)"], ["sound", "Sounds"], ["calm", "Calm mode (no motion or confetti)"]].map(([k, t]) => '<label class="ixGOpt"><input type="checkbox" data-ixg-opt="' + k + '"' + (g.opt[k] ? " checked" : "") + "> " + E(t) + "</label>").join("") +
      (window.INTELLECTUALITY_AUDIO ? '<label class="ixGOpt"><input type="checkbox" data-ixau-opt="commute"' + (window.INTELLECTUALITY_AUDIO.on() ? " checked" : "") + '> Commute mode + read-aloud voice (off = hidden)</label>' : "") +
      '<button type="button" class="ixGBtn ghost" data-ixg="break">🏃 Take a 2-minute move break now</button>' +
      '<details class="ixGWhy"><summary>Why it works like this (ADHD research)</summary><ul>' +
      "<li><b>Reward now, not later.</b> ADHD brains discount delayed rewards steeply, and do best when every response is rewarded. So every answer pays at once, and nothing is ever taken away.</li>" +
      "<li><b>Time you can see.</b> Time-blindness is consistent in ADHD. The bar keeps the sprint, its clock and the day's goals in front of you.</li>" +
      "<li><b>Short sprints of 8,</b> then an optional move break: a few minutes of exercise improves inhibitory control.</li>" +
      "<li><b>Pictures you touch.</b> Retrieval practice works just as well with ADHD. The Spot-it drills and live diagrams turn it into play.</li>" +
      "</ul></details></div>";
    document.body.appendChild(o);
  }
  function closePanel() {
    document.querySelectorAll(".ixGSheetWrap").forEach((x) => x.remove());
  }
  let toastBox = null;
  function toast(html, kind, ms) {
    if (!on() || !document.body) return;
    if (!toastBox || !toastBox.isConnected) {
      toastBox = document.createElement("div");
      toastBox.className = "ixGToasts";
      toastBox.setAttribute("aria-live", "polite");
      document.body.appendChild(toastBox);
    }
    const t = document.createElement("div");
    t.className = "ixGToast " + (kind || "");
    t.innerHTML = html;
    toastBox.appendChild(t);
    while (toastBox.children.length > 3) toastBox.firstChild.remove();
    setTimeout(() => t.classList.add("out"), ms || 2600);
    setTimeout(() => t.remove(), (ms || 2600) + 400);
    return t;
  }
  function sprintCard(s) {
    if (!on()) return;
    const long = s.mins >= 12;
    const t = toast(
      '<div class="ixGSprintEnd"><b>🏁 Sprint cleared</b> · ' + s.k + "/" + s.n + " right · +" + s.xp + " XP" + (s.best >= 3 ? " · best combo 🔥×" + s.best : "") + " · " + s.mins + " min" +
        '<div class="ixGRow"><button type="button" class="ixGBtn" data-ixg="go">Keep going ▶</button><button type="button" class="ixGBtn ghost" data-ixg="break">🏃 2-min move break</button></div>' +
        (long ? '<div class="ixGSub">You have been going a while: a short move break sharpens focus for the next sprint.</div>' : "") + "</div>",
      "sprint",
      9000,
    );
    if (t) t.classList.add("interactive");
    confetti(10);
  }
  const MOVES = ["20 jumping jacks", "Walk to a window and back, twice", "10 squats, slowly", "Stretch both arms up, hold 10 s", "Drink a full glass of water", "Shake out your hands and shoulders", "March on the spot for 60 steps"];
  let brk = null;
  function breakOverlay() {
    endBreak();
    const o = document.createElement("div");
    o.className = "ixGBreak";
    const t0 = Date.now(),
      total = 120000,
      pick = MOVES.slice().sort(() => Math.random() - 0.5).slice(0, 3);
    o.innerHTML = '<div class="ixGBreakCard"><div class="ixGRingBig"></div><div class="ixGBig">Move break</div><ol>' + pick.map((m) => "<li>" + E(m) + "</li>").join("") + '</ol><div class="ixGRow"><button type="button" class="ixGBtn" data-ixg="endbreak">Back to it ▶</button><button type="button" class="ixGBtn ghost" data-ixg="plus">+1 min</button></div><div class="ixGSub">Short bursts of movement improve inhibitory control in ADHD. Your place is saved.</div></div>';
    document.body.appendChild(o);
    brk = { o, t0, total, iv: 0 };
    const upd = () => {
      if (!brk) return;
      const left = brk.total - (Date.now() - brk.t0),
        el = brk.o.querySelector(".ixGRingBig");
      if (el) el.innerHTML = ring(Math.max(0, left) / brk.total, 150, 10, "#66e9ff") + "<b>" + clock(Math.max(0, left)) + "</b>";
      if (left <= 0 && !brk.doneSound) {
        brk.doneSound = true;
        sound("quest");
        const b = brk.o.querySelector('[data-ixg="endbreak"]');
        if (b) b.textContent = "Ready · back to the questions ▶";
      }
    };
    upd();
    brk.iv = setInterval(upd, 500);
  }
  function endBreak() {
    if (brk) {
      clearInterval(brk.iv);
      brk.o.remove();
      brk = null;
    }
  }

  /* ───────────── small pleasures: confetti, a burst, sounds ───────────── */
  function confetti(n) {
    if (!on() || calm() || !document.body) return;
    const box = document.createElement("div");
    box.className = "ixGConf";
    const cols = ["#d9ff43", "#66e9ff", "#ff8fb7", "#ffd166", "#b99cff", "#74f0a1"];
    box.innerHTML = Array.from({ length: n || 26 }, (_, i) => '<i style="left:' + Math.round(Math.random() * 100) + "%;background:" + cols[i % cols.length] + ";animation-delay:" + Math.round(Math.random() * 250) + "ms;--dx:" + Math.round(Math.random() * 120 - 60) + 'px"></i>').join("");
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 1800);
  }
  function burst(el) {
    const b = document.createElement("span");
    b.className = "ixGBurst";
    b.innerHTML = Array.from({ length: 10 }, (_, i) => '<i style="--a:' + i * 36 + 'deg"></i>').join("");
    el.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
  let AC = null;
  function sound(kind) {
    const g = G();
    if (!g || !g.opt.on || !g.opt.sound) return;
    safe(() => {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { ok: [660, 880], combo: [660, 880, 1175], soft: [392], quest: [523, 659, 784], level: [523, 659, 784, 1047] }[kind] || [660];
      notes.forEach((f, i) => {
        const o = AC.createOscillator(),
          v = AC.createGain(),
          t = AC.currentTime + i * 0.07;
        o.type = "sine";
        o.frequency.value = f;
        v.gain.setValueAtTime(0.0001, t);
        v.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
        v.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        o.connect(v).connect(AC.destination);
        o.start(t);
        o.stop(t + 0.18);
      });
    });
  }

  /* ───────────── wiring ───────────── */
  function decorate() {
    if (!on()) return;
    const p = document.getElementById("player");
    if (!p) return;
    const start = p.querySelector('[data-v16="mock-start"]:not([data-ixg])');
    if (start) {
      start.dataset.ixg = "1";
      start.insertAdjacentHTML("beforebegin", '<div class="ixGBoss">👾 <b>BOSS FIGHT.</b> Finish it for <b>+50 XP</b>. No hints inside; every miss comes back as a rematch.</div>');
    }
  }
  document.addEventListener(
    "click",
    (ev) => {
      const t = ev.target && ev.target.closest ? ev.target : null;
      if (!t) return;
      const v16 = t.closest("[data-v16]");
      if (v16 && document.getElementById("player")?.contains(v16)) {
        const a = v16.dataset.v16;
        if (a === "pick") {
          safe(() => beforePick(v16));
          setTimeout(() => safe(afterPick), 0);
        } else if (a === "next") {
          const s = sprintEnd;
          sprintEnd = null;
          if (s) setTimeout(() => safe(() => sprintCard(s)), 0);
        } else if (a === "mock-start") {
          const g = G();
          if (g) g.mockXP = totalXP();
          setTimeout(() => safe(hud), 0);
        } else if (a === "mock-pick") {
          setTimeout(() => safe(() => {
            D().a++;
            touch();
            persist();
            hud();
          }), 0);
        } else if (a === "mock-done") setTimeout(() => safe(onMockDone), 0);
        return;
      }
      const act = t.closest("[data-act]");
      if (act && document.getElementById("player")?.contains(act)) {
        const a = act.dataset.act;
        if (a === "v15-next" || (a === "finish-segment" && act.classList.contains("bigAction"))) setTimeout(() => safe(() => onAct(a)), 0);
      }
      const g = t.closest("[data-ixg]");
      if (g) {
        const k = g.dataset.ixg;
        if (k === "panel") panel();
        else if (k === "close") closePanel();
        else if (k === "break") {
          closePanel();
          g.closest(".ixGToast")?.remove();
          breakOverlay();
        } else if (k === "endbreak") endBreak();
        else if (k === "plus" && brk) brk.total += 60000;
        else if (k === "go") g.closest(".ixGToast")?.remove();
        return;
      }
      if (t.classList && t.classList.contains("ixGSheetWrap")) closePanel();
    },
    true,
  );
  document.addEventListener("change", (ev) => {
    const k = ev.target && ev.target.dataset ? ev.target.dataset.ixgOpt : null;
    if (!k) return;
    const g = G();
    g.opt[k] = !!ev.target.checked;
    persist();
    hud();
    if (k === "on" && !g.opt.on) closePanel();
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      closePanel();
      endBreak();
    }
  });

  function boot() {
    if (window.INTELLECTUALITY_GAME_BOOTED) return;
    if (typeof S === "undefined" || !document.body) return void setTimeout(boot, 60);
    window.INTELLECTUALITY_GAME_BOOTED = true;
    safe(() => {
      G();
      levelCheck();
      hud();
    });
    const p = document.getElementById("player");
    if (p)
      new MutationObserver(() => {
        safe(decorate);
        safe(hud);
      }).observe(p, { childList: true });
    setInterval(() => safe(tickClock), 1000);
  }
  window.IX_GAME = {
    version: VERSION,
    award,
    state: () => (G() ? JSON.parse(JSON.stringify(S.game)) : null),
    level: () => levelOf(totalXP()),
    rank: () => rankOf(levelOf(totalXP())),
    totalXP,
    quests: () => quests().map((q) => ({ ...q, done: !!D().qd[q.id] })),
    touch: () => (touch(), persist(), hud()),
    opt: (k, v) => {
      const g = G();
      if (v !== undefined) {
        g.opt[k] = !!v;
        persist();
        hud();
      }
      return g.opt[k];
    },
    panel,
    breakNow: breakOverlay,
    endBreak,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
