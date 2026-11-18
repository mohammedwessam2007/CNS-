/* INTELLECTUALITY v24 · the exam plan: the whole course, day by day, to the three exams the owner named
 * (17 Nov 2026): GIT MCQ 30 Dec · GIT written 5 Jan · CNS written 12 Jan.
 *
 * It applies docs/PHILOSOPHY_v21.md:
 *  1 the owner's minutes decide; topics that do not fit are dropped openly (never more minutes)
 *  2 readiness only from AI-off past-paper mocks and blind checks (four Saturdays, oldest paper first, newest last)
 *  3 confidence on every answer · 4 attempt first · 5 misses become spaced cards (reviews open every day)
 *  6 marks per minute: units ordered by weight (bank questions + 3 × written-exam appearances), subjects interleaved
 *  7 lectures first: 📝 notes / slides feed every unit · 8 the examiner's style in every explanation
 *  9 zero decisions: one list per day, one tap per step · 10 honest: what is dropped and what will fade is shown
 * Progress lives in S.examPlan (it travels with the progress file). */
(function () {
  "use strict";
  if (window.IX_PLAN) return;
  const T = () => window.IX_TUTOR, G = () => window.IX_GIT, GB = () => window.IX_GIT206 || { mcq: [], written: [] };
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const EXAMS = [
    { id: "gitmcq", name: "GIT MCQ", date: "2026-12-30" },
    { id: "gitw", name: "GIT written", date: "2027-01-05" },
    { id: "cnsw", name: "CNS written", date: "2027-01-12" },
  ];
  const DAY = 864e5, START = "2026-11-21";
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const at = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const nice = (s) => at(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  /* ── GIT units: Jalal's 13 anatomy chapters + physiology, histology and biochemistry units ── */
  const ANAT = ["Anterior abdominal wall", "Testis and spermatic cord", "Abdominal cavity and peritoneum", "Stomach", "Small intestine", "Large intestine", "Vessels of gut", "Pancreas", "Spleen", "Liver and biliary system", "Kidney, ureter and suprarenal glands", "Posterior abdominal wall", "Gut development"];
  const ANAT_W = { "Anterior abdominal wall": ["Inguinal canal", "Rectus sheath", "Spermatic cord"], "Testis and spermatic cord": ["Spermatic cord"], "Abdominal cavity and peritoneum": ["Epiploic foramen", "Mesentery"], Stomach: ["Stomach"], "Small intestine": ["Duodenum", "Mesentery"], "Large intestine": ["Caecum"], "Vessels of gut": ["Portosystemic", "Abdominal aorta"], Pancreas: ["Pancreas"], Spleen: ["Spleen"], "Liver and biliary system": ["Liver:", "Porta hepatis", "Gall bladder"], "Kidney, ureter and suprarenal glands": ["Kidney", "Suprarenal"], "Posterior abdominal wall": ["Psoas", "Quadratus", "Diaphragm"], "Gut development": ["Midgut", "Diaphragm"] };
  const OTHER = [
    { s: "Physiology", name: "Saliva, swallowing and the oesophagus", rx: /saliva|swallow|deglut|oesoph|esoph/i, w: ["Salivary secretion", "Swallowing"] },
    { s: "Physiology", name: "Stomach: acid secretion, motility, vomiting", rx: /gastric|acid secret|parietal|hcl|vomit|pylor|stomach empt/i, w: ["Gastric acid", "Functions of the stomach"] },
    { s: "Physiology", name: "Pancreas, bile and GI hormones", rx: /pancrea|bile|gall ?bladder|secretin|cck|cholecysto|gastrin/i, w: ["Pancreatic secretion", "Bile", "GI hormones"] },
    { s: "Physiology", name: "Intestinal motility, absorption, defecation", rx: /intestin|peristal|absorp|defecat|colon|mmc|migrating motor|slow wave/i, w: ["GIT motility"] },
    { s: "Physiology", name: "GFR, renal blood flow and its autoregulation", rx: /gfr|glomerul|filtration|renal blood flow|autoregul|tubuloglomerular/i, w: ["GFR", "Renal blood flow", "Glomerulotubular"] },
    { s: "Physiology", name: "Tubular transport: glucose, Na+, K+, clearance", rx: /tubul|reabsor|glucose|sodium|na\+|potassium|k\+|clearance|aldosterone/i, w: ["Tubular reabsorption", "Sodium excretion", "Acute tubular"] },
    { s: "Physiology", name: "Urine concentration, ADH and thirst", rx: /henle|countercurrent|concentrat|adh|vasopressin|thirst|osmol|diuresis/i, w: ["Urine concentration"] },
    { s: "Physiology", name: "Renal acid-base balance", rx: /acid-?base|buffer|acidosis|alkalosis|h\+|bicarbonate|hco/i, w: ["Renal acid-base"] },
    { s: "Physiology", name: "Metabolism: RQ, BMR, temperature, food intake", rx: /\brq\b|respiratory quotient|metabolic rate|bmr|temperature|fever|shiver|cold|food intake|obesity|satiety|hunger/i, w: ["Metabolism", "Temperature", "Food intake"] },
    { s: "Histology", name: "Oral cavity, tongue and salivary glands", rx: /lip|oral|tongue|papill|taste|palate|saliva|parotid|submandibular|sublingual|acin|duct/i, w: ["Tongue", "Salivary glands"] },
    { s: "Histology", name: "Oesophagus and stomach", rx: /oesoph|esoph|stomach|gastric|fundic|peptic|parietal|oxyntic|chief|pylor|cardia/i, w: ["Gastric glands", "Pyloro-duodenal", "Oesophagus"] },
    { s: "Histology", name: "Small and large intestine, appendix", rx: /intestin|villi|crypt|paneth|microfold|m cell|duoden|jejun|ileum|colon|append|brunner|goblet/i, w: ["Small intestine"] },
    { s: "Histology", name: "Liver, gall bladder and pancreas", rx: /liver|hepat|kupffer|ito|disse|sinusoid|lobule|acinus|gall|pancrea|islet/i, w: ["Hepatocytes", "Space of Disse", "Pancreas (exo"] },
    { s: "Histology", name: "Kidney and urinary passages", rx: /kidney|renal|nephron|glomerul|podocyte|mesangial|bowman|pct|dct|tubule|juxtaglomerular|macula|ureter|bladder|urethra|urothel|collecting/i, w: ["Juxtaglomerular", "PCT vs DCT", "Renal corpuscle", "Mesangial", "Collecting tubules", "Urinary passages"] },
    { s: "Biochemistry", name: "Liver biochemistry: detoxification, lipoproteins, fatty liver", rx: /./, w: [] },
  ];
  const writtenFor = (keys) => GB().written.filter((w) => keys.some((k) => w.topic.indexOf(k) === 0));
  function gitUnits() {
    const mcq = GB().mcq, units = [];
    ANAT.forEach((ch) => units.push({ id: "A:" + ch, subject: "Anatomy", name: ch, pred: (q) => q.chapter === ch, written: writtenFor(ANAT_W[ch] || []) }));
    OTHER.forEach((u) => units.push({ id: u.s[0] + ":" + u.name, subject: u.s, name: u.name, pred: (q) => q.subject === u.s && u.rx.test(q.stem + " " + q.options.map((o) => o.text).join(" ")), written: writtenFor(u.w) }));
    units.forEach((u) => { u.nMcq = mcq.filter((q) => q.answerKeys.length && u.pred(q)).length; u.wTimes = u.written.reduce((t, w) => t + w.times, 0); u.weight = u.nMcq + 3 * u.wTimes; });
    return units;
  }
  function cnsChapters() {
    const q = (window.EHSAN_QBANK && EHSAN_QBANK.questions) || [], c = {};
    q.forEach((x) => { const k = x.subject + "|" + x.chapter; c[k] = (c[k] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => { const [s, ch] = k.split("|"); return { subject: s.charAt(0) + s.slice(1).toLowerCase(), name: ch, n }; });
  }

  /* ── the schedule ── */
  function life() { return T() && T().life ? T().life() : { mins: 60, off: 5 }; }
  const isOff = (d) => life().off >= 0 && d.getDay() === life().off;
  function interleave(units) {
    const by = {}; units.slice().sort((a, b) => b.weight - a.weight).forEach((u) => (by[u.subject] = by[u.subject] || []).push(u));
    const order = ["Anatomy", "Physiology", "Histology", "Anatomy", "Biochemistry"], out = [];
    while (Object.values(by).some((l) => l.length)) for (const s of order) if (by[s] && by[s].length) out.push(by[s].shift());
    return out;
  }
  function build() {
    // the owner starts on Saturday 21 Nov 2026; before that the plan waits (nothing is due early)
    const mins = life().mins, now0 = at(iso(new Date())), start = now0 < at(START) ? at(START) : now0, days = [];
    const mcqDate = at(EXAMS[0].date), gwDate = at(EXAMS[1].date), cwDate = at(EXAMS[2].date);
    const mockPlan = ["Exam 195 (2023)", "Final 196 (2024)", "Final 197 (Jan 2025)", "EOM 2026 (198)"];
    // Phase A days (until the day before the GIT MCQ)
    const A = []; for (let d = new Date(start); d < mcqDate; d = new Date(d.getTime() + DAY)) A.push(new Date(d));
    const studyA = A.filter((d) => !isOff(d));
    const last = studyA.slice(-3);                              // weak-spot days and the light day
    const sats = studyA.filter((d) => d.getDay() === 6 && !last.includes(d)).slice(-mockPlan.length);
    const mockDays = new Map(); sats.forEach((d, i) => mockDays.set(iso(d), mockPlan[mockPlan.length - sats.length + i]));
    // the units that fit: each unit day needs reviews 10 + learn 15 + MCQs 12 + written 15 minutes
    const unitDays = studyA.filter((d) => !mockDays.has(iso(d)) && !last.includes(d));
    const perUnit = 52, perDay = Math.max(1, Math.floor((mins - 0) / perUnit)) || 1;
    // more units than days: the two lightest units share one day (shorter steps, no written step) before any
    // unit is dropped; what still does not fit is dropped openly
    const units = interleave(gitUnits()), groups = units.map((u) => [u]), cap = unitDays.length * perDay;
    while (groups.length > cap) {
      const singles = groups.filter((g) => g.length === 1).sort((a, b) => a[0].weight - b[0].weight);
      if (singles.length < 2) break;
      const [g1, g2] = singles; g1.push(g2[0]); groups.splice(groups.indexOf(g2), 1);
    }
    const fitG = groups.slice(0, cap), fit = [].concat(...fitG), dropped = [].concat(...groups.slice(cap));
    let ui = 0;
    A.forEach((d) => {
      const k = iso(d);
      if (isOff(d)) return days.push({ date: k, phase: "GIT MCQ", off: true, steps: [] });
      if (mockDays.has(k)) return days.push({ date: k, phase: "GIT MCQ", title: "Past paper as a real mock", steps: [step("review", "Reviews due (memory cards)", 10), step("mock", "Mock: " + mockDays.get(k) + " · AI off", 45, { src: mockDays.get(k) }), step("misses", "Review the misses with the professor", 15, { src: mockDays.get(k) })] });
      if (last.includes(d)) {
        const lightDay = d === last[last.length - 1];
        return days.push({ date: k, phase: "GIT MCQ", title: lightDay ? "Light day before the exam" : "Weak spots only, mixed", steps: lightDay
          ? [step("review", "Reviews due", 15), step("traps", "My traps, re-worded", 15), step("examday", "Exam-day protocol", 5), step("rest", "Stop by evening. Sleep is part of the plan.", 0)]
          : [step("review", "Reviews due", 15), step("weak", "Today's 10: misses first, all chapters mixed", 15), step("blindmix", "Blind check on your weakest chapter", 15), step("traps", "My traps, re-worded", 10)] });
      }
      const todays = [].concat(...fitG.slice(ui, ui + perDay)); ui += Math.min(perDay, Math.max(0, fitG.length - ui));
      const paired = todays.length > perDay;
      if (!todays.length) return days.push({ date: k, phase: "GIT MCQ", title: "Spare day: weak spots, mixed", steps: [step("review", "Reviews due", 15), step("weak", "Today's 10: misses first, all chapters mixed", 15), step("blindmix", "Blind check on your weakest chapter", 15)] });
      const steps = [step("review", "Reviews due (memory cards)", 10)];
      // rule 1: a small budget cuts steps, never adds minutes: written goes first (phase B covers it), then teaching
      todays.forEach((u) => {
        if (mins >= 37) steps.push(step("learn", "Learn with the professor: " + u.name, paired ? 10 : 15, { unit: u.id }));
        steps.push(u.nMcq >= 6 ? step("mcq", "10 MCQs: " + u.name, paired ? 10 : 12, { unit: u.id }) : step("blind", "Blind check (new questions, AI off): " + u.name, paired ? 10 : 12, { unit: u.id }));
        if (!paired && mins >= 52 && u.written.length) steps.push(step("written", "Write from a blank page: " + u.written[0].questions[0].q.slice(0, 90), 15, { unit: u.id, q: u.written[0].questions[0].q }));
      });
      days.push({ date: k, phase: "GIT MCQ", title: todays.map((u) => u.subject + " · " + u.name).join(" + ") || "Mixed review", steps });
    });
    days.push({ date: EXAMS[0].date, phase: "GIT MCQ", exam: EXAMS[0], steps: [step("examday", "Exam-day protocol, then go", 5)] });
    // Phase B: GIT written — the ranked topics, written from memory and marked by three examiners
    const W = GB().written.filter((w) => !/: other$/.test(w.topic));
    const B = []; for (let d = new Date(mcqDate.getTime() + DAY); d < gwDate; d = new Date(d.getTime() + DAY)) B.push(new Date(d));
    const studyB = B.filter((d) => !isOff(d)), perB = Math.max(2, Math.floor(mins / 15)), wPlan = W.slice(0, Math.max(0, studyB.length - 1) * perB);
    let wi = 0;
    B.forEach((d) => {
      const k = iso(d);
      if (isOff(d)) return days.push({ date: k, phase: "GIT written", off: true, steps: [] });
      if (d === studyB[studyB.length - 1]) return days.push({ date: k, phase: "GIT written", title: "Light day: your own one-page sheets", steps: [step("review", "Reviews due", 10), step("sheets", "Read your sheets once; rewrite only what was missing", 30), step("examday", "Written-exam protocol", 5)] });
      const t = wPlan.slice(wi, wi + perB); wi += t.length;
      days.push({ date: k, phase: "GIT written", title: t.map((w) => w.topic).join(" · "), steps: [step("review", "Reviews due", 10)].concat(t.map((w) => step("written", w.subject + ": " + w.topic + " (asked " + w.times + "×)", 15, { q: w.questions[0].q })) ) });
    });
    days.push({ date: EXAMS[1].date, phase: "GIT written", exam: EXAMS[1], steps: [step("examday", "Written-exam protocol, then go", 5)] });
    // Phase C: CNS written — chapters by weight; the professor's likely essay, then a blank page and three examiners
    const C = []; for (let d = new Date(gwDate.getTime() + DAY); d < cwDate; d = new Date(d.getTime() + DAY)) C.push(new Date(d));
    const studyC = C.filter((d) => !isOff(d)), perC = Math.max(2, Math.floor(mins / 20)), cPlan = cnsChapters().slice(0, Math.max(0, studyC.length - 1) * perC);
    let ci = 0;
    C.forEach((d) => {
      const k = iso(d);
      if (isOff(d)) return days.push({ date: k, phase: "CNS written", off: true, steps: [] });
      if (d === studyC[studyC.length - 1]) return days.push({ date: k, phase: "CNS written", title: "Light day: your CNS sheets", steps: [step("review", "Reviews due", 10), step("sheets", "Read your sheets once; rewrite only what was missing", 30), step("examday", "Written-exam protocol", 5)] });
      const t = cPlan.slice(ci, ci + perC); ci += t.length;
      days.push({ date: k, phase: "CNS written", title: t.map((c) => c.name).join(" · "), steps: [step("review", "Reviews due", 10)].concat(t.map((c) => step("cns", "CNS " + c.subject + ": " + c.name + " — likely essay, then write it", 20, { ch: c.name, sub: c.subject }))) });
    });
    days.push({ date: EXAMS[2].date, phase: "CNS written", exam: EXAMS[2], steps: [step("examday", "Written-exam protocol, then go", 5)] });
    days.forEach((d) => d.steps.forEach((s, i) => (s.id = d.date + ":" + i + ":" + s.kind)));
    return { days, dropped, unitsFit: fit.length, unitsAll: units.length, wDropped: W.slice(wPlan.length), cDropped: cnsChapters().slice(cPlan.length, cPlan.length + 12), mins };
  }
  function step(kind, label, min, x) { return Object.assign({ kind, label, min }, x || {}); }

  /* ── state ── */
  function st() { let s = null; try { s = typeof S !== "undefined" ? S : null; } catch (e) {} const h = s || (window.__ixPlanLocal = window.__ixPlanLocal || {}); h.examPlan = h.examPlan || { done: {} }; return h.examPlan; }
  function persist() { try { if (typeof save === "function") save(); } catch (e) {} }
  function today() { const P = build(), k = iso(new Date()); return { P, day: P.days.find((d) => d.date === k) || P.days.find((d) => d.date > k) }; }
  function nextStep() { const { day } = today(); if (!day || day.off || day.date !== iso(new Date())) return null; /* nothing early: before 21 Nov ▶ Today stays free */ const s = day.steps.find((x) => !st().done[x.id] && x.kind !== "rest"); return s ? { day, step: s } : null; }

  /* ── running a step ── */
  function unitById(id) { return gitUnits().find((u) => u.id === id); }
  function override(title, body) { window.IX_SCREEN_OVERRIDE = { title, eyebrow: "Exam plan", body }; }
  function runStep(s) {
    const t = T(); if (!t) return;
    st().done[s.id] = st().done[s.id] || "started"; persist();
    const u = s.unit ? unitById(s.unit) : null;
    const ctx = u ? "Unit: " + u.subject + " · " + u.name + " (DIG-206).\nHow the past papers ask it:\n" + GB().mcq.filter(u.pred).slice(0, 8).map((q) => "- " + q.stem).join("\n") + (u.written.length ? "\nWritten questions asked on it: " + u.written.map((w) => w.topic + " (" + w.years.join(", ") + ")").join("; ") : "") : "";
    if (s.kind === "review") { close(); t.open(); t.ask("Start my day: review what is due.", "review"); }
    else if (s.kind === "learn") { close(); override("GIT 206 · " + u.name, ctx); t.open(); t.ask("Teach me " + u.name + " with the full loop, one step at a time.", "loop"); }
    else if (s.kind === "mcq") { close(); override("GIT 206 · " + u.name, ctx); if (!G().startCustom(u.name, u.pred, 10)) { t.open(); t.ask("Quiz me on " + u.name + ".", "secquiz", ctx); } }
    else if (s.kind === "blind" || s.kind === "blindmix") { close(); override("GIT 206 · " + (u ? u.name : weakest()), ctx || "Chapter: " + weakest()); t.openBlind(); }
    else if (s.kind === "written") { close(); override("GIT 206 written", "Written question: " + s.q); t.openEssay(s.q); }
    else if (s.kind === "mock") { close(); G().mockPaper(s.src); }
    else if (s.kind === "misses" || s.kind === "weak") { close(); G().startCustom("Misses first, mixed", () => true, 10) || G().open("mcq"); }
    else if (s.kind === "traps") { close(); t.open(); t.ask("Drill me on my traps: the things I was sure about and got wrong.", "traps"); }
    else if (s.kind === "examday") { close(); t.open(); t.ask("Give me my exam-day protocol.", "examday"); }
    else if (s.kind === "sheets") { openSheets(); }
    else if (s.kind === "cns") { close(); override("CNS · " + s.ch, "CNS written, " + s.sub + " · " + s.ch + ". No past written list is loaded for CNS: use the course content and the MCQ bank's weight for this chapter."); t.open(); t.ask("Give me the most likely written-exam question on " + s.ch + " and the model answer, then I will write it from a blank page.", "written"); }
  }
  function weakest() {
    const g = G() && G().state ? G().state().q : {}, per = {};
    GB().mcq.forEach((q) => { const r = g[q.id]; if (!r) return; const o = per[q.chapter] || (per[q.chapter] = [0, 0]); o[0]++; if (!r.ok) o[1]++; });
    const w = Object.entries(per).filter(([, v]) => v[0] >= 3).sort((a, b) => b[1][1] / b[1][0] - a[1][1] / a[1][0])[0];
    return w ? w[0] : "Liver and biliary system";
  }

  /* ── one-page sheets the owner writes himself (the last days before each written exam are spent on them) ── */
  function sheets() { const g = st(); g.sheets = g.sheets || {}; return g.sheets; }
  function saveSheet(q, text, mark) { sheets()[q] = { text: String(text).slice(0, 6000), mark: mark || null, at: Date.now() }; persist(); }
  function openSheets() {
    if (T()) T().close(); shell(); root.classList.add("on");
    const all = Object.entries(sheets()).sort((a, b) => b[1].at - a[1].at);
    body.innerHTML = '<button type="button" data-back>← Plan</button><h3>📄 My one-page sheets (' + all.length + ")</h3>" +
      (all.length ? "<p>Read each once. Rewrite only the points the examiners said were missing.</p>" + all.map(([q, x]) => '<details class="ixHw"><summary><b>' + E(q.slice(0, 120)) + "</b><span>" + (x.mark != null ? "marked " + x.mark + "/10 · " : "") + new Date(x.at).toLocaleDateString() + "</span></summary><pre class='ixPsheet'>" + E(x.text) + "</pre></details>").join("")
        : "<p>No sheets yet. Every time you write an answer and get it marked (📝), tap “Save as my one-page sheet”.</p>");
    body.querySelector("[data-back]").onclick = () => render();
  }

  /* ── forgetting forecast: what is due before each exam if reviews stop ── */
  function forecast() {
    let cards = []; try { cards = JSON.parse(localStorage.getItem("ix_tutor_cards_v1") || "[]"); } catch (e) {}
    const g = G() && G().state ? G().state().q : {};
    return EXAMS.map((x) => { const t = at(x.date).getTime(); return { exam: x.name, cards: cards.filter((c) => c.due <= t && c.step < 3).length, misses: Object.values(g).filter((r) => !r.ok && r.due <= t).length }; });
  }

  /* ── page ── */
  let root, body;
  function shell() {
    if (root) return;
    root = document.createElement("div"); root.className = "ixH ixPlan"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Exam plan");
    root.innerHTML = '<div class="ixHbox"><div class="ixHhd"><b>📅 Exam plan</b><span class="ixHsub" id="ixPsub"></span><button type="button" data-p="close" aria-label="Close">✕</button></div><div class="ixHbody" id="ixPbody"></div></div>';
    document.body.appendChild(root); body = root.querySelector("#ixPbody");
    root.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && b.dataset.p === "close") close(); });
  }
  function open() { if (T()) T().close(); if (G()) G().close(); shell(); root.classList.add("on"); render(); }
  function close() { if (root) root.classList.remove("on"); }
  function render() {
    const { P, day } = today(), k = iso(new Date()), d = T() && T().dayState ? T().dayState() : null;
    const left = (x) => Math.round((at(x.date) - at(k)) / DAY);
    root.querySelector("#ixPsub").textContent = EXAMS.map((x) => x.name + " in " + left(x) + "d").join(" · ");
    const done = (s) => st().done[s.id] === true;
    const week = P.days.filter((x) => x.date > k).slice(0, 7);
    body.innerHTML =
      '<div class="ixPexams">' + EXAMS.map((x) => '<div><b>' + left(x) + "</b><span>days to " + E(x.name) + "<br>" + E(nice(x.date)) + "</span></div>").join("") + "</div>" +
      (d && d.gate ? '<div class="ixHgate">' + E(d.gate) + "</div>" : "") +
      (k < START ? "<p><b>The plan starts on Saturday 21 November.</b> Until then nothing is due: live. 🌿 (If you want, set your minutes and Friday off in ⏱ and add your key in ⚙︎.)</p>" : "") +
      (day ? "<h3>" + (day.date === k ? "Today" : "Next: " + E(nice(day.date))) + " · " + E(day.phase) + (day.title ? " · " + E(day.title) : "") + "</h3>" +
        (day.off ? "<p>Day off. Live. 🌿</p>" : day.exam ? "<p><b>Exam day: " + E(day.exam.name) + ".</b> Protocol, breakfast, go. Good luck, inshallah.</p>" : "") +
        '<div class="ixPsteps">' + day.steps.map((s) => '<div class="ixPstep' + (done(s) ? " done" : "") + '"><label><input type="checkbox" data-done="' + E(s.id) + '"' + (done(s) ? " checked" : "") + "></label><div><b>" + E(s.label) + "</b><span>" + (s.min ? s.min + " min" : "") + "</span></div>" + (s.kind !== "rest" ? '<button type="button" data-go="' + E(s.id) + '">' + (st().done[s.id] ? "Again" : "Start") + "</button>" : "") + "</div>").join("") + "</div>" +
        (day.steps.length ? "<p class='ixHsmall'>About " + day.steps.reduce((t, s) => t + s.min, 0) + " minutes of your " + P.mins + ". Tick a step when it is done; the day ends when the list does.</p>" : "") : "<p>All three exams are done. Rest. 🌿</p>") +
      "<h3>Next 7 days</h3><ul class='ixPweek'>" + week.map((x) => "<li><b>" + E(nice(x.date)) + "</b> " + (x.off ? "day off" : x.exam ? "🎯 " + E(x.exam.name) : E(x.title || "")) + "</li>").join("") + "</ul>" +
      "<h3>What the minutes cannot fit (dropped openly)</h3>" +
      (P.dropped.length ? "<p>GIT units: " + P.dropped.map((u) => E(u.name) + " (" + u.subject + ")").join(", ") + ". Raise the minutes in ⏱ only if you want them back; otherwise they are skimmed in the last review days.</p>" : "<p>Every GIT unit fits (" + P.unitsFit + " units).</p>") +
      (P.wDropped.length ? "<p>GIT written topics after the top " + (GB().written.filter((w) => !/: other$/.test(w.topic)).length - P.wDropped.length) + ": " + P.wDropped.slice(0, 10).map((w) => E(w.topic)).join(", ") + (P.wDropped.length > 10 ? "…" : "") + "</p>" : "") +
      "<p>CNS written: no past written list is loaded yet, so chapters are ranked by MCQ weight. Send the CNS previous written questions (Telegram) and the ranking becomes exact.</p>" +
      "<h3>Forgetting forecast</h3><ul>" + forecast().map((f) => "<li>Before " + E(f.exam) + ": " + f.cards + " memory cards and " + f.misses + " GIT misses fall due. The daily reviews keep them; skip them and they fade.</li>").join("") + "</ul>";
    body.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { const s = day.steps.find((x) => x.id === b.dataset.go); if (s) runStep(s); }));
    body.querySelectorAll("[data-done]").forEach((c) => (c.onchange = () => { st().done[c.dataset.done] = c.checked ? true : "started"; persist(); render(); }));
  }

  function install() {
    const anchor = document.getElementById("gitBtn") || document.getElementById("tutorBtn");
    if (anchor && !document.getElementById("planBtn")) { const b = anchor.cloneNode(false); b.id = "planBtn"; b.textContent = "📅 My exam plan (30 Dec · 5 Jan · 12 Jan)"; b.removeAttribute("onclick"); b.onclick = (e) => { e.preventDefault(); open(); }; anchor.before(b); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();
  setTimeout(install, 1800);
  window.IX_PLAN = { open, close, build, nextStep, runStep, forecast, exams: EXAMS, units: gitUnits, cns: cnsChapters, state: st, sheets, saveSheet, openSheets };
})();
