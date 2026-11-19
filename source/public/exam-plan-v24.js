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
  const cut = (t, n) => { t = String(t || "").replace(/\s+/g, " ").trim(); if (t.length <= n) return t; const c = t.slice(0, n); return c.slice(0, Math.max(c.lastIndexOf(" "), n - 20)).replace(/[,:;(\s]+$/, "") + "…"; };
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

  /* ── the official IPKA timetable for DIG 206 (lectures only; labs left out). [date, subject, title, units] ── */
  const LECT = [
    ["2026-11-17", "Anatomy", "Skin, fascia and muscles of the anterolateral abdominal wall", ["A:Anterior abdominal wall"]],
    ["2026-11-17", "Physiology", "Intro + nervous regulation of GIT function", ["P:Pancreas, bile and GI hormones"]],
    ["2026-11-17", "Histology", "Oral cavity, palate, pharynx", ["H:Oral cavity, tongue and salivary glands"]],
    ["2026-11-18", "Anatomy", "Fascia transversalis, rectus abdominis, pyramidalis, rectus sheath", ["A:Anterior abdominal wall"]],
    ["2026-11-18", "Physiology", "Hormonal regulation of GIT function", ["P:Pancreas, bile and GI hormones"]],
    ["2026-11-18", "Histology", "Oesophagus and stomach", ["H:Oesophagus and stomach"]],
    ["2026-11-19", "Histology", "Small intestine", ["H:Small and large intestine, appendix"]],
    ["2026-11-19", "Physiology", "Salivary secretion + gastric secretion 1", ["P:Saliva, swallowing and the oesophagus", "P:Stomach: acid secretion, motility, vomiting"]],
    ["2026-11-19", "Anatomy", "Blood, nerve supply and lymph of the anterolateral abdominal wall", ["A:Anterior abdominal wall"]],
    ["2026-11-22", "Anatomy", "Inguinal region (groin)", ["A:Anterior abdominal wall"]],
    ["2026-11-22", "Physiology", "Gastric secretion 2", ["P:Stomach: acid secretion, motility, vomiting"]],
    ["2026-11-22", "Histology", "Large intestine and anal canal", ["H:Small and large intestine, appendix"]],
    ["2026-11-23", "Physiology", "Pancreatic and small intestinal secretions", ["P:Pancreas, bile and GI hormones"]],
    ["2026-11-23", "Biochemistry", "Digestion and absorption of carbohydrates, lipids and protein 1", []],
    ["2026-11-23", "Histology", "Salivary glands", ["H:Oral cavity, tongue and salivary glands"]],
    ["2026-11-26", "Anatomy", "Male genitalia", ["A:Testis and spermatic cord"]],
    ["2026-11-26", "Physiology", "Liver and biliary system + GIT motility", ["P:Pancreas, bile and GI hormones", "P:Intestinal motility, absorption, defecation"]],
    ["2026-11-26", "Histology", "Pancreas", ["H:Liver, gall bladder and pancreas"]],
    ["2026-11-26", "Biochemistry", "Digestion and absorption 2", []],
    ["2026-11-30", "Physiology", "Deglutition and oesophagus + gastric motility 1", ["P:Saliva, swallowing and the oesophagus", "P:Stomach: acid secretion, motility, vomiting"]],
    ["2026-11-30", "Anatomy", "Abdominal regions, peritoneum", ["A:Abdominal cavity and peritoneum"]],
    ["2026-11-30", "Histology", "Liver and gall bladder", ["H:Liver, gall bladder and pancreas"]],
    ["2026-11-30", "Biochemistry", "Biochemistry of the large intestine", []],
    ["2026-12-02", "Physiology", "Gastric motility 2 + small intestinal motility", ["P:Stomach: acid secretion, motility, vomiting", "P:Intestinal motility, absorption, defecation"]],
    ["2026-12-02", "Anatomy", "Stomach, peritoneal folds of the stomach", ["A:Stomach"]],
    ["2026-12-02", "Histology", "Intro to the kidney, renal corpuscle", ["H:Kidney and urinary passages"]],
    ["2026-12-03", "Physiology", "Colon and rectum", ["P:Intestinal motility, absorption, defecation"]],
    ["2026-12-03", "Histology", "Convoluted tubules, loop of Henle, collecting tubules", ["H:Kidney and urinary passages"]],
    ["2026-12-03", "Anatomy", "Duodenum, jejunum, ileum", ["A:Small intestine"]],
    ["2026-12-06", "Physiology", "Basic concepts of metabolism and RQ", ["P:Metabolism: RQ, BMR, temperature, food intake"]],
    ["2026-12-07", "Biochemistry", "Liver metabolism and fatty liver", ["B:Liver biochemistry: detoxification, lipoproteins, fatty liver"]],
    ["2026-12-07", "Physiology", "Control of food intake", ["P:Metabolism: RQ, BMR, temperature, food intake"]],
    ["2026-12-07", "Anatomy", "Large intestine: caecum, appendix, colon, peritoneal relations", ["A:Large intestine"]],
    ["2026-12-09", "Anatomy", "Liver I and II, subphrenic spaces, biliary passages, gall bladder", ["A:Liver and biliary system"]],
    ["2026-12-09", "Physiology", "Body temperature regulation", ["P:Metabolism: RQ, BMR, temperature, food intake"]],
    ["2026-12-09", "Histology", "Juxtaglomerular apparatus, blood supply, urinary passages", ["H:Kidney and urinary passages"]],
    ["2026-12-10", "Physiology", "Intro to renal physiology, renal blood flow, GFR 1", ["P:GFR, renal blood flow and its autoregulation"]],
    ["2026-12-10", "Anatomy", "Arteries of the gut, portal vein, portosystemic anastomosis", ["A:Vessels of gut"]],
    ["2026-12-13", "Physiology", "Glomerular filtration 2", ["P:GFR, renal blood flow and its autoregulation"]],
    ["2026-12-14", "Anatomy", "Pancreas, spleen, kidney, abdominal ureter", ["A:Pancreas", "A:Spleen", "A:Kidney, ureter and suprarenal glands"]],
    ["2026-12-14", "Physiology", "Tubular processing + Na handling 1 and 2", ["P:Tubular transport: glucose, Na+, K+, clearance"]],
    ["2026-12-15", "Anatomy", "Suprarenal, psoas, quadratus lumborum, lumbar fascia", ["A:Kidney, ureter and suprarenal glands", "A:Posterior abdominal wall"]],
    ["2026-12-16", "Anatomy", "Abdominal aorta, iliac arteries, IVC, lumbar plexus", ["A:Posterior abdominal wall"]],
    ["2026-12-16", "Physiology", "Handling of glucose and K+, concentration of urine 1", ["P:Tubular transport: glucose, Na+, K+, clearance", "P:Urine concentration, ADH and thirst"]],
    ["2026-12-17", "Anatomy", "Lumbar sympathetic chain, plexuses, lymph; development of foregut, liver, biliary system", ["A:Posterior abdominal wall", "A:Gut development"]],
    ["2026-12-17", "Physiology", "Concentration of urine 2, urea, HCO3- and H+ 1 and 2", ["P:Urine concentration, ADH and thirst", "P:Renal acid-base balance"]],
    ["2026-12-21", "Anatomy", "Development of midgut and hindgut", ["A:Gut development"]],
    ["2026-12-22", "Physiology", "Acid-base balance", ["P:Renal acid-base balance"]],
    ["2026-12-22", "Anatomy", "Development of kidney, ureter, testis, external genitalia", ["A:Gut development"]],
    ["2026-12-23", "College", "Revision: histology, anatomy 1, physiology 1, biochemistry", []],
    ["2026-12-24", "College", "Revision: anatomy 2 and 3, physiology 2 and 3", []],
    ["2027-01-02", "College", "Final revision: histology, anatomy, biochemistry, physiology", []],
    ["2027-01-13", "College", "Practical revision: physiology, anatomy, histology labs", []],
    ["2027-01-14", "College", "Practical revision: physiology, anatomy, biochemistry, histology labs", []],
  ];
  function lectureSpan() {
    const o = {};
    LECT.forEach(([d, , , us]) => us.forEach((u) => { const x = o[u] || (o[u] = { first: d, last: d }); if (d < x.first) x.first = d; if (d > x.last) x.last = d; }));
    return o;
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
    // the schedule is FIXED from the start date (21 Nov): ticks are tied to dates, and missed work is carried forward
    // by the pacing engine (paced()), never by re-planning from today (that would lose what was already done)
    const mins = life().mins, start = at(START), days = [];
    const mcqDate = at(EXAMS[0].date), gwDate = at(EXAMS[1].date), cwDate = at(EXAMS[2].date);
    // Phase A follows the official IPKA timetable: a unit is studied the day after its last lecture
    // (the lecture is the first exposure, the app the second); full past papers only once the lectures are done
    const A = []; for (let d = new Date(start); d < mcqDate; d = new Date(d.getTime() + DAY)) A.push(new Date(d));
    const FULL = { "2026-12-19": ["Exam 195 (2023)", "Final 196 (2024)"], "2026-12-26": ["Final 197 (Jan 2025)"], "2026-12-28": ["EOM 2026 (198)"] };
    const CHECKS = ["2026-11-28", "2026-12-05", "2026-12-12"];
    const WEAK = ["2026-12-27"], LIGHT = "2026-12-29";
    const units = interleave(gitUnits()), span = lectureSpan(), plan = new Map();
    const free = (d) => !isOff(d) && !FULL[iso(d)] && !CHECKS.includes(iso(d)) && !WEAK.includes(iso(d)) && iso(d) !== LIGHT;
    const left = units.slice();
    A.filter(free).forEach((d) => {
      const k = iso(d), ready = (u) => span[u.id] && span[u.id].last < k, started = (u) => span[u.id] && span[u.id].first < k;
      // the unit whose lectures finished longest ago goes first (closest to its lecture); weight breaks ties
      let pick = left.filter(ready).sort((a, b) => (span[a.id].last < span[b.id].last ? -1 : span[a.id].last > span[b.id].last ? 1 : b.weight - a.weight))[0], partial = false;
      if (!pick) { pick = left.filter(started).sort((a, b) => b.weight - a.weight)[0]; partial = !!pick; }
      if (pick) { left.splice(left.indexOf(pick), 1); plan.set(k, { units: [pick], partial }); }
    });
    // anything left (late lectures) shares a day with the lightest unit already placed after its lectures
    left.slice().forEach((u) => {
      const k0 = span[u.id] ? span[u.id].last : "";
      const slot = Array.from(plan.entries()).filter(([k, v]) => k > k0 && v.units.length === 1).sort((a, b) => a[1].units[0].weight - b[1].units[0].weight)[0];
      if (slot) { slot[1].units.push(u); left.splice(left.indexOf(u), 1); }
    });
    const dropped = left, fit = [].concat(...Array.from(plan.values()).map((v) => v.units));
    A.forEach((d) => {
      const k = iso(d), lec = LECT.filter((l) => l[0] === k);
      const lecSteps = lec.length ? [step("notes", "📝 2 min after the lectures: what the doctors stressed (" + lec.map((l) => l[2]).slice(0, 2).join("; ").slice(0, 70) + ")", 2, { lect: k })] : [];
      const base = { date: k, phase: "GIT MCQ", lectures: lec.map((l) => l[1] + ": " + l[2]) };
      if (isOff(d)) return days.push(Object.assign(base, { off: true, steps: [] }));
      if (FULL[k]) return days.push(Object.assign(base, { title: "Full past paper" + (FULL[k].length > 1 ? "s" : "") + " as a real mock", steps: [step("review", "Reviews due (memory cards)", 10)].concat(FULL[k].map((src) => step("mock", "Mock: " + src + " · AI off", 30, { src })), [step("misses", "Review the misses with the professor", 15)]) }));
      if (CHECKS.includes(k)) return days.push(Object.assign(base, { title: "Weekly check on what was lectured so far (AI off)", steps: [step("review", "Reviews due (memory cards)", 10), step("week", "Today's 10 from this week's units, misses first", 15), step("blindmix", "Blind check on your weakest unit", 15), step("traps", "My traps, re-worded", 10), step("outline", "⚡ 3-minute outlines due (written)", 10)] }));
      if (WEAK.includes(k)) return days.push(Object.assign(base, { title: "Weak spots only, mixed", steps: [step("review", "Reviews due", 15), step("weak", "Today's 10: misses first, all chapters mixed", 15), step("blindmix", "Blind check on your weakest chapter", 15), step("traps", "My traps, re-worded", 10)] }));
      if (k === LIGHT) return days.push(Object.assign(base, { title: "Light day before the exam", steps: [step("review", "Reviews due", 15), step("traps", "My traps, re-worded", 15), step("examday", "Exam-day protocol", 5), step("rest", "Stop by evening. Sleep is part of the plan.", 0)] }));
      const pl = plan.get(k);
      if (!pl) return days.push(Object.assign(base, { title: "Review day (nothing new is ready from the lectures)", steps: lecSteps.concat([step("review", "Reviews due", 15), step("weak", "Today's 10: misses first, all chapters taught so far", 15)]) }));
      const paired = pl.units.length > 1, steps = lecSteps.concat([step("review", "Reviews due (memory cards)", 10)]);
      // rule 1: a small budget cuts steps, never adds minutes: written goes first (phase B covers it), then teaching
      pl.units.forEach((u) => {
        if (mins >= 37) steps.push(step("learn", "📘 High-yield sheet, then learn with the professor: " + u.name, paired ? 10 : 15, { unit: u.id }));
        steps.push(u.nMcq >= 6 ? step("mcq", "10 MCQs: " + u.name, paired ? 10 : 12, { unit: u.id }) : step("blind", "Blind check (new questions, AI off): " + u.name, paired ? 10 : 12, { unit: u.id }));
        if (!paired && mins >= 52 && u.written.length) steps.push(step("written", "Write from a blank page: " + cut(u.written[0].questions[0].q, 80), 15, { unit: u.id, q: u.written[0].questions[0].q }));
      });
      days.push(Object.assign(base, { title: pl.units.map((u) => u.subject + " · " + u.name).join(" + ") + (pl.partial ? " (its lectures are still running)" : ""), steps }));
    });
    days.push({ date: EXAMS[0].date, phase: "GIT MCQ", exam: EXAMS[0], steps: [step("examday", "Exam-day protocol, then go", 5)] });
    // Phase B: GIT written — the ranked topics, written from memory and marked by three examiners
    const W = GB().written.filter((w) => !/: other$/.test(w.topic));
    const B = []; for (let d = new Date(mcqDate.getTime() + DAY); d < gwDate; d = new Date(d.getTime() + DAY)) B.push(new Date(d));
    const studyB = B.filter((d) => !isOff(d)), perB = Math.max(2, Math.floor((mins - 15) / 15)), wPlan = W.slice(0, Math.max(0, studyB.length - 1) * perB);
    let wi = 0;
    B.forEach((d) => {
      const k = iso(d);
      if (isOff(d)) return days.push({ date: k, phase: "GIT written", off: true, steps: [] });
      if (d === studyB[studyB.length - 1]) return days.push({ date: k, phase: "GIT written", title: "Light day: your own one-page sheets", steps: [step("review", "Reviews due", 10), step("sheets", "Read your sheets once; rewrite only what was missing", 30), step("examday", "Written-exam protocol", 5)] });
      if (k === "2027-01-03") return days.push({ date: k, phase: "GIT written", title: "GIT written mock (AI off) + outlines", steps: [step("wmock", "🧪 GIT written mock: 6 real questions, 45 min, AI off, then 3 examiners", 45, { exam: "git" }), step("outline", "⚡ 3-minute outlines due", 10)] });
      const t = wPlan.slice(wi, wi + perB); wi += t.length;
      const col = LECT.filter((l) => l[0] === k && l[1] === "College");
      if (col.length) return days.push({ date: k, phase: "GIT written", title: "College final revision + " + t.slice(0, 2).map((w) => w.topic).join(" · "), lectures: col.map((l) => l[2]), steps: [step("college", "Attend: " + col[0][2], 0), step("review", "Reviews due", 10)].concat(t.slice(0, 2).map((w) => step("written", w.subject + ": " + w.topic + " (asked " + w.times + "×)", 15, { q: w.questions[0].q }))) });
      days.push({ date: k, phase: "GIT written", title: t.map((w) => w.topic).join(" · "), steps: [step("review", "Reviews due", 10)].concat(t.map((w) => step("written", w.subject + ": " + w.topic + " (asked " + w.times + "×)", 15, { q: w.questions[0].q })), [step("outline", "⚡ 3-minute outlines due", 10)]) });
    });
    days.push({ date: EXAMS[1].date, phase: "GIT written", exam: EXAMS[1], steps: [step("examday", "Written-exam protocol, then go", 5)] });
    // Phase C: CNS written — chapters by weight; the professor's likely essay, then a blank page and three examiners
    const C = []; for (let d = new Date(gwDate.getTime() + DAY); d < cwDate; d = new Date(d.getTime() + DAY)) C.push(new Date(d));
    const studyC = C.filter((d) => !isOff(d)), perC = Math.max(2, Math.floor((mins - 15) / 20)), cPlan = cnsChapters().slice(0, Math.max(0, studyC.length - 1) * perC);
    let ci = 0;
    C.forEach((d) => {
      const k = iso(d);
      if (isOff(d)) return days.push({ date: k, phase: "CNS written", off: true, steps: [] });
      if (d === studyC[studyC.length - 1]) return days.push({ date: k, phase: "CNS written", title: "Light day: your CNS sheets", steps: [step("review", "Reviews due", 10), step("sheets", "Read your sheets once; rewrite only what was missing", 30), step("examday", "Written-exam protocol", 5)] });
      if (k === "2027-01-10") return days.push({ date: k, phase: "CNS written", title: "CNS written mock (AI off) + outlines", steps: [step("wmock", "🧪 CNS written mock: 6 likely questions, 45 min, AI off, then 3 examiners", 45, { exam: "cns" }), step("outline", "⚡ 3-minute outlines due", 10)] });
      const t = cPlan.slice(ci, ci + perC); ci += t.length;
      days.push({ date: k, phase: "CNS written", title: t.map((c) => c.name).join(" · "), steps: [step("review", "Reviews due", 10)].concat(t.map((c) => step("cns", "CNS " + c.subject + ": " + c.name + " — likely essay, then write it", 20, { ch: c.name, sub: c.subject })), [step("outline", "⚡ 3-minute outlines due", 10)]) });
    });
    days.push({ date: EXAMS[2].date, phase: "CNS written", exam: EXAMS[2], steps: [step("examday", "Written-exam protocol, then go", 5)] });
    // Phase D: practical revision at college (13-14 Jan); the practical's own date is not announced yet
    [["2027-01-13", "GIT"], ["2027-01-14", "CNS"]].forEach(([k, x]) => days.push({ date: k, phase: "Practical", title: "Practical revision at college + spot drill", steps: [step("college", "Attend the practical revision at college (" + x + " focus)", 0), step("spot", "🎯 Spot drill: 6 drawings, name each, then the professor quizzes you", 20), step("review", "Reviews due", 10)] }));
    // rule 1, enforced at the end: a day over the owner's minutes shortens its review step (to 5 at least)
    days.forEach((d) => { const tot = d.steps.reduce((t, x) => t + x.min, 0), r = d.steps.find((x) => x.kind === "review"); if (r && tot > mins) r.min = Math.max(5, r.min - (tot - mins)); });
    days.forEach((d) => d.steps.forEach((s, i) => (s.id = d.date + ":" + i + ":" + s.kind)));
    return { days, dropped, unitsFit: fit.length, unitsAll: units.length, wDropped: W.slice(wPlan.length), cDropped: cnsChapters().slice(cPlan.length, cPlan.length + 12), mins };
  }
  function step(kind, label, min, x) { return Object.assign({ kind, label, min }, x || {}); }

  /* ── state ── */
  function st() { let s = null; try { s = typeof S !== "undefined" ? S : null; } catch (e) {} const h = s || (window.__ixPlanLocal = window.__ixPlanLocal || {}); h.examPlan = h.examPlan || { done: {} }; return h.examPlan; }
  function persist() { try { if (typeof save === "function") save(); } catch (e) {} }
  /* ── v28 pacing: nothing is lost and nothing piles up. A unit step (learn, MCQs, blind check) or a mock from a past
     day that was not done comes first today, oldest first; today still fits the owner's minutes; what does not fit
     moves to tomorrow and is listed. A step that was started counts as done. Days off stay off. ── */
  const doneish = (id) => !!st().done[id];
  function owed(P, k) {
    const out = [];
    P.days.forEach((d) => { if (d.date >= k || d.off || d.exam) return; d.steps.forEach((x) => { if ((x.unit && (x.kind === "learn" || x.kind === "mcq" || x.kind === "blind")) || x.kind === "mock" || x.kind === "wmock") { if (!doneish(x.id)) out.push(Object.assign({}, x, { from: d.date })); } }); });
    return out;
  }
  function paced(P, day, k) {
    if (!day || day.date !== k || day.off || day.exam) return { day, moved: [], carried: [] };
    const o = owed(P, k); if (!o.length) return { day, moved: [], carried: [] };
    const mins = P.mins, review = day.steps.filter((x) => x.kind === "review" || x.kind === "notes" || x.kind === "college");
    const rest = day.steps.filter((x) => !review.includes(x));
    // carried steps are shortened (no written step travels; phase B covers it) and come first, oldest first
    const carried = o.map((x) => Object.assign({}, x, { label: "↩ from " + new Date(x.from + "T12:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + ": " + x.label, min: x.kind === "mock" || x.kind === "wmock" ? x.min : Math.min(x.min, 10), carried: true }));
    const out = review.slice(), moved = []; let used = review.reduce((t, x) => t + x.min, 0);
    carried.concat(rest).forEach((x) => { if (used + x.min <= mins || x.kind === "rest") { out.push(x); used += x.min; } else moved.push(x); });
    return { day: Object.assign({}, day, { steps: out, behind: o.length, moved: moved.map((x) => x.label) }), moved, carried };
  }
  function today() { const P = build(), k = iso(new Date()), raw = P.days.find((d) => d.date === k) || P.days.find((d) => d.date > k); return { P, day: paced(P, raw, k).day }; }
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
    else if (s.kind === "learn") { close(); override("GIT 206 · " + u.name, ctx); if (window.IX_HY) IX_HY.open(u.id); else { t.open(); t.ask("Teach me " + u.name + " with the full loop, one step at a time.", "loop"); } }
    else if (s.kind === "mcq") { close(); override("GIT 206 · " + u.name, ctx); if (!G().startCustom(u.name, u.pred, 10)) { t.open(); t.ask("Quiz me on " + u.name + ".", "secquiz", ctx); } }
    else if (s.kind === "blind" || s.kind === "blindmix") { close(); override("GIT 206 · " + (u ? u.name : weakest()), ctx || "Chapter: " + weakest()); t.openBlind(); }
    else if (s.kind === "written") { close(); override("GIT 206 written", "Written question: " + s.q); t.openEssay(s.q); }
    else if (s.kind === "mock") { close(); G().mockPaper(s.src); }
    else if (s.kind === "misses" || s.kind === "weak") { close(); G().startCustom("Misses first, mixed", () => true, 10) || G().open("mcq"); }
    else if (s.kind === "notes") {
      // the notes are keyed by the screen title, the same title the learn step uses, so what the doctor stressed
      // reaches the professor when the unit is studied
      const l = LECT.find((x) => x[0] === s.lect && x[3].length), un = l ? unitById(l[3][0]) : null;
      close(); override(un ? "GIT 206 · " + un.name : "GIT 206 · lectures " + s.lect, "Lectures today: " + LECT.filter((x) => x[0] === s.lect).map((x) => x[1] + ": " + x[2]).join("; ")); t.openNotes();
    }
    else if (s.kind === "week") { const span = lectureSpan(), k = iso(new Date()), done = gitUnits().filter((u) => span[u.id] && span[u.id].first < k); close(); G().startCustom("This week's check", (q) => done.some((u) => u.pred(q)), 10) || G().open("mcq"); }
    else if (s.kind === "outline") { close(); window.IX_WRITTEN && IX_WRITTEN.openDue(); }
    else if (s.kind === "wmock") { close(); window.IX_WRITTEN && IX_WRITTEN.openMock(s.exam); }
    else if (s.kind === "traps") { close(); t.open(); t.ask("Drill me on my traps: the things I was sure about and got wrong.", "traps"); }
    else if (s.kind === "examday") { close(); t.open(); t.ask("Give me my exam-day protocol.", "examday"); }
    else if (s.kind === "sheets") { openSheets(); }
    else if (s.kind === "spot" && window.IX_HY) { close(); IX_HY.spot(6); }
    else if (s.kind === "cns" && window.IX_HY) { close(); override("CNS · " + s.ch, "CNS written, " + s.sub + " · " + s.ch); IX_HY.open("CNS:" + s.ch); }
    else if (s.kind === "cns") { close(); override("CNS · " + s.ch, "CNS written, " + s.sub + " · " + s.ch + ". No past written list is loaded for CNS: use the course content and the MCQ bank's weight for this chapter."); t.open(); t.ask("Give me the most likely written-exam question on " + s.ch + " and the model answer, then I will write it from a blank page.", "written"); }
  }
  function weakest() {
    const g = G() && G().state ? G().state().q : {}, per = {};
    GB().mcq.forEach((q) => { const r = g[q.id]; if (!r) return; const o = per[q.chapter] || (per[q.chapter] = [0, 0]); o[0]++; if (!r.ok) o[1]++; });
    const w = Object.entries(per).filter(([, v]) => v[0] >= 3).sort((a, b) => b[1][1] / b[1][0] - a[1][1] / a[1][0])[0];
    return w ? w[0] : "Liver and biliary system";
  }

  /* ── v28 the full map: every day to the last exam, with its status; any day opens (read ahead allowed) ── */
  function dayStatus(d, k) {
    if (d.off) return ["off", "🌿 off"]; if (d.exam) return ["exam", "🎯 exam"];
    const real = d.steps.filter((x) => x.kind !== "rest" && x.kind !== "college");
    const n = real.filter((x) => doneish(x.id)).length;
    if (d.date === k) return ["today", "● today"];
    if (d.date > k) return [n ? "part" : "ahead", n ? "◐ started" : "ahead"];
    return n === real.length ? ["done", "✓ done"] : n ? ["part", "◐ partly"] : ["behind", "↩ carried"];
  }
  function openMap() {
    shell(); root.classList.add("on");
    const P = build(), k = iso(new Date()), body = document.getElementById("ixPbody");
    const weeks = []; P.days.forEach((d) => { const dt = new Date(d.date + "T12:00"), wk = Math.floor((dt - new Date("2026-11-21T12:00")) / (7 * DAY)); (weeks[wk] = weeks[wk] || []).push(d); });
    body.innerHTML = '<div class="ixHrow"><button type="button" data-back>← Today</button></div><h3>🗺️ The whole course, day by day</h3><p class="ixHsmall">Tap a day to open it. Past days that were not done are carried to today automatically.</p>' +
      weeks.filter(Boolean).map((w, i) => "<div class='ixPwk'><b>Week " + (i + 1) + " · " + E(w[0].phase) + "</b>" + w.map((d) => { const [cls, lab] = dayStatus(d, k); return '<button type="button" class="ixPday ' + cls + '" data-day="' + d.date + '"><span class="d">' + E(nice(d.date)) + '</span><span class="t">' + E(d.off ? "Day off" : d.exam ? d.exam.name : (d.title || "").replace(/ \(its lectures are still running\)/, "")) + (d.lectures && d.lectures.length ? " <small>· " + d.lectures.length + " lectures</small>" : "") + '</span><span class="s">' + lab + "</span></button>"; }).join("") + "</div>").join("");
    body.querySelector("[data-back]").onclick = () => render();
    body.querySelectorAll("[data-day]").forEach((b) => (b.onclick = () => openDay(b.dataset.day)));
  }
  function openDay(date) {
    shell(); root.classList.add("on");
    const P = build(), k = iso(new Date()), d0 = P.days.find((x) => x.date === date); if (!d0) return openMap();
    const d = date === k ? paced(P, d0, k).day : d0, body = document.getElementById("ixPbody");
    body.innerHTML = '<div class="ixHrow"><button type="button" data-map>← Map</button></div><h3>' + E(nice(date)) + " · " + E(d.phase) + (d.title ? " · " + E(d.title) : "") + "</h3>" +
      (d.lectures && d.lectures.length ? "<p class='ixHsmall'>📚 Lectures: " + d.lectures.map(E).join(" · ") + "</p>" : "") +
      (d.off ? "<p>Day off. Live. 🌿</p>" : d.exam ? "<p><b>Exam day: " + E(d.exam.name) + ".</b></p>" : "") +
      (date > k && d.steps.length ? "<p class='ixHsmall'>Reading ahead is fine: anything you do now counts, and that day will be lighter.</p>" : "") +
      '<div class="ixPsteps ixZsteps">' + d.steps.map((x, i) => '<div class="ixPstep' + (st().done[x.id] === true ? " done" : "") + '"><label class="ixZchk"><input type="checkbox" data-done="' + E(x.id) + '"' + (st().done[x.id] === true ? " checked" : "") + "><span>" + (st().done[x.id] === true ? "✓" : i + 1) + "</span></label><div><b>" + E(x.label) + "</b><span>" + (x.min ? x.min + " min" : "") + "</span></div>" + (x.kind !== "rest" && x.kind !== "college" ? '<button type="button" data-go="' + E(x.id) + '">' + (st().done[x.id] ? "Again" : "Start") + "</button>" : "") + "</div>").join("") + "</div>";
    body.querySelector("[data-map]").onclick = openMap;
    body.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { const x = d.steps.find((y) => y.id === b.dataset.go); if (x) runStep(x); }));
    body.querySelectorAll("[data-done]").forEach((c) => (c.onchange = () => { st().done[c.dataset.done] = c.checked ? true : "started"; persist(); openDay(date); }));
  }

  /* ── readiness: only AI-off results count (GIT past-paper mocks, written mocks, blind checks) ── */
  function readinessHTML() {
    const rows = [];
    const g = window.IX_GIT && IX_GIT.readiness ? IX_GIT.readiness() : null;
    rows.push("GIT MCQ (past papers, AI off): " + (g ? "<b>" + Math.round(g.p * 100) + "%</b> (" + Math.round(g.lo * 100) + "–" + Math.round(g.hi * 100) + "%) on " + g.n + " questions" : "after your first full paper (19 Dec)"));
    const W = window.IX_WRITTEN ? IX_WRITTEN.history() : [];
    ["git", "cns"].forEach((x) => { const m = W.filter((y) => y.exam === x).pop(); rows.push((x === "git" ? "GIT" : "CNS") + " written (mock, AI off): " + (m ? "<b>" + Math.round((100 * m.total) / m.out) + "%</b> (examiners " + Math.round((100 * m.lo) / m.out) + "–" + Math.round((100 * m.hi) / m.out) + "%)" : "after the mock on " + (x === "git" ? "3 Jan" : "10 Jan"))); });
    const b = T() && T().blindRange ? T().blindRange() : null;
    if (b && b.p != null) rows.push("Blind checks (new questions, AI off): <b>" + Math.round(b.p * 100) + "%</b> (" + Math.round(b.lo * 100) + "–" + Math.round(b.hi * 100) + "%)");
    return "<h3>Readiness (only AI-off results count)</h3><ul>" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ul>";
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
  // render into the overlay, or into any element (the home screen mounts it there)
  function render(target) {
    const body = target || (shell(), document.getElementById("ixPbody"));
    const { P, day } = today(), k = iso(new Date()), d = T() && T().dayState ? T().dayState() : null;
    const left = (x) => Math.round((at(x.date) - at(k)) / DAY);
    if (!target) root.querySelector("#ixPsub").textContent = EXAMS.map((x) => x.name + " in " + left(x) + "d").join(" · ");
    const done = (s) => st().done[s.id] === true;
    const week = P.days.filter((x) => x.date > k).slice(0, 7);
    body.innerHTML =
      '<div class="ixPexams">' + EXAMS.map((x) => '<div><b>' + left(x) + "</b><span>days to " + E(x.name) + "<br>" + E(nice(x.date)) + "</span></div>").join("") + "</div>" +
      (d && d.gate ? '<div class="ixHgate">' + E(d.gate) + "</div>" : "") +
      (k < START ? "<p><b>The plan starts on Saturday 21 November.</b> Until then nothing is due: live. 🌿 (If you want, set your minutes and Friday off in ⏱ and add your key in ⚙︎.)</p>" : "") +
      (day ? "<h3>" + (day.date === k ? "Today" : "Next: " + E(nice(day.date))) + " · " + E(day.phase) + (day.title ? " · " + E(day.title) : "") + "</h3>" +
        (day.behind ? "<div class='ixHgate'>↩ " + day.behind + " step" + (day.behind > 1 ? "s" : "") + " from earlier days come first today, oldest first. Nothing is lost." + (day.moved && day.moved.length ? " Moved to tomorrow to keep your minutes: " + day.moved.map(E).join("; ") + "." : "") + "</div>" : "") +
      (day.lectures && day.lectures.length ? "<p class='ixHsmall'>📚 Lectures " + (day.date === k ? "today" : "that day") + ": " + day.lectures.map(E).join(" · ") + "</p>" : "") +
        (day.off ? "<p>Day off. Live. 🌿</p>" : day.exam ? "<p><b>Exam day: " + E(day.exam.name) + ".</b> Protocol, breakfast, go. Good luck, inshallah.</p>" : "") +
        '<div class="ixPsteps">' + day.steps.map((s) => '<div class="ixPstep' + (done(s) ? " done" : "") + '"><label><input type="checkbox" data-done="' + E(s.id) + '"' + (done(s) ? " checked" : "") + "></label><div><b>" + E(s.label) + "</b><span>" + (s.min ? s.min + " min" : "") + "</span></div>" + (s.kind !== "rest" ? '<button type="button" data-go="' + E(s.id) + '">' + (st().done[s.id] ? "Again" : "Start") + "</button>" : "") + "</div>").join("") + "</div>" +
        (day.steps.length ? "<p class='ixHsmall'>About " + day.steps.reduce((t, s) => t + s.min, 0) + " minutes of your " + P.mins + ". Tick a step when it is done; the day ends when the list does.</p>" : "") : "<p>All three exams are done. Rest. 🌿</p>") +
      readinessHTML() +
      "<div class='ixHrow'><button type='button' class='primary' data-openmap>🗺️ The whole course, day by day</button></div>" +
      "<h3>Next 7 days</h3><ul class='ixPweek'>" + week.map((x) => "<li data-day='" + x.date + "'><b>" + E(nice(x.date)) + "</b> " + (x.off ? "day off" : x.exam ? "🎯 " + E(x.exam.name) : E(x.title || "")) + (x.lectures && x.lectures.length ? " <small>· " + x.lectures.length + " lectures</small>" : "") + "</li>").join("") + "</ul>" +
      "<h3>What the minutes cannot fit (dropped openly)</h3>" +
      (P.dropped.length ? "<p>GIT units: " + P.dropped.map((u) => E(u.name) + " (" + u.subject + ")").join(", ") + ". Raise the minutes in ⏱ only if you want them back; otherwise they are skimmed in the last review days.</p>" : "<p>Every GIT unit fits (" + P.unitsFit + " units).</p>") +
      (P.wDropped.length ? "<p>GIT written topics after the top " + (GB().written.filter((w) => !/: other$/.test(w.topic)).length - P.wDropped.length) + ": " + P.wDropped.slice(0, 10).map((w) => E(w.topic)).join(", ") + (P.wDropped.length > 10 ? "…" : "") + "</p>" : "") +
      "<p>CNS written: no past written list is loaded yet, so chapters are ranked by MCQ weight. Send the CNS previous written questions (Telegram) and the ranking becomes exact.</p>" +
      "<h3>Forgetting forecast</h3><ul>" + forecast().map((f) => "<li>Before " + E(f.exam) + ": " + f.cards + " memory cards and " + f.misses + " GIT misses fall due. The daily reviews keep them; skip them and they fade.</li>").join("") + "</ul>";
    body.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { const s = day.steps.find((x) => x.id === b.dataset.go); if (s) runStep(s); }));
    const om = body.querySelector("[data-openmap]"); if (om) om.onclick = openMap;
    body.querySelectorAll(".ixPweek [data-day]").forEach((li) => (li.onclick = () => openDay(li.dataset.day)));
    body.querySelectorAll("[data-done]").forEach((c) => (c.onchange = () => { st().done[c.dataset.done] = c.checked ? true : "started"; persist(); render(target); if (target && typeof window.render === "function") window.render(); }));
  }

  /* v30 · the home screen, built for a phone: one hero card (where you are + the next step), three countdown chips,
   * today's checklist, the next days, two buttons; the planning details fold away */
  function home(el) {
    const { P, day } = today(), k = iso(new Date()), pre = k < START;
    const left = (x) => Math.round((at(x.date) - at(k)) / DAY);
    // a review with nothing due yet (no memory cards, no outlines) is shown as done instead of being the first thing to do
    const nothingDue = (() => { try { return !(T() && T().dueCards && T().dueCards().length) && !(window.IX_WRITTEN && IX_WRITTEN.due && IX_WRITTEN.due().length); } catch (e) { return false; } })();
    const empty = (s) => s.kind === "review" && nothingDue && st().done[s.id] !== true;
    const done = (s) => st().done[s.id] === true || empty(s);
    const lab = (s) => (empty(s) ? "Reviews: nothing due yet" : s.label);
    const steps = day ? day.steps.filter((s) => s.kind !== "rest") : [];
    const nd = steps.filter(done).length, mins = steps.reduce((t, s) => t + s.min, 0), minsLeft = steps.filter((s) => !done(s)).reduce((t, s) => t + s.min, 0);
    const nextS = steps.find((s) => !done(s) && s.kind !== "college");
    const dayNo = day ? P.days.filter((x) => x.date <= day.date && !x.off && !x.exam).length : 0, dayAll = P.days.filter((x) => !x.off && !x.exam).length;
    const subj = day && day.title && /^(Anatomy|Physiology|Histology|Biochemistry) · /.test(day.title) ? day.title.split(" · ")[0] : "";
    const name = day ? (day.exam ? day.exam.name + " today" : day.off ? "Day off" : subj ? day.title.slice(subj.length + 3) : day.title || "") : "All exams done";
    const week = P.days.filter((x) => x.date > (day ? day.date : k)).slice(0, 6);
    const clean = (t) => String(t || "").replace(/ \(its lectures are still running\)/, "");
    const short = (d) => at(d).toLocaleDateString("en-GB", { weekday: "short" }), dnum = (d) => at(d).getDate(), mon = (d) => at(d).toLocaleDateString("en-GB", { month: "short" });
    el.innerHTML =
      '<section class="ixZhero">' +
        '<div class="ixZkick">' + (pre ? "Starts Saturday · preview" : day && day.date === k ? "Today · " + E(nice(k)) : "Next · " + E(nice(day ? day.date : k))) + (day && !day.off && !day.exam ? " · day " + dayNo + " of " + dayAll : "") + "</div>" +
        (subj ? '<span class="ixZsubj ixZs-' + subj.toLowerCase() + '">' + E(subj) + "</span>" : day ? '<span class="ixZsubj">' + E(day.phase) + "</span>" : "") +
        '<h2 class="ixZname">' + E(clean(name)) + "</h2>" +
        (day && day.lectures && day.lectures.length ? '<div class="ixZlect">📚 ' + E(day.lectures.length + " lecture" + (day.lectures.length > 1 ? "s" : "") + " " + (day.date === k ? "today" : "that day")) + "</div>" : "") +
        (day && day.off ? '<p class="ixZcalm">Nothing to do. Live. 🌿</p>' : day && day.exam ? '<p class="ixZcalm">Protocol, breakfast, go. Good luck, inshallah.</p>' : steps.length ?
          '<div class="ixZbar"><i style="width:' + Math.round((100 * nd) / steps.length) + '%"></i></div><div class="ixZbarT"><span>' + nd + " of " + steps.length + " done</span><span>" + (nd === steps.length ? "Done for today 🌿" : "~" + minsLeft + " min left") + "</span></div>" +
          (nextS ? '<button type="button" class="ixZgo" data-go="' + E(nextS.id) + '"><small>' + (pre ? "Saturday's session · try it now" : steps.some((x) => st().done[x.id] === true) ? "Continue today's session" : "Start today's session") + " · " + (steps.length - nd) + " step" + (steps.length - nd > 1 ? "s" : "") + " · ~" + minsLeft + " min</small>▶ " + E(nextS.label) + "</button>" : "") : "") +
      "</section>" +
      (day && day.behind ? '<div class="ixZnote">↩ ' + day.behind + " step" + (day.behind > 1 ? "s" : "") + " from earlier days are in today's list. Nothing is lost.</div>" : "") +
      '<div class="ixZexams">' + EXAMS.map((x) => '<div class="ixZex' + (left(x) <= 7 ? " soon" : "") + '"><b>' + Math.max(0, left(x)) + "</b><span>days</span><em>" + E(x.name) + "</em><small>" + E(nice(x.date)) + "</small></div>").join("") + "</div>" +
      (steps.length ? '<h3 class="ixZh">' + (pre ? "Saturday's steps" : "Today's steps") + " <small>" + mins + " of your " + P.mins + " min</small></h3>" +
        '<div class="ixPsteps ixZsteps">' + steps.map((s, i) => '<div class="ixPstep' + (done(s) ? " done" : "") + '"><label class="ixZchk"><input type="checkbox" data-done="' + E(s.id) + '"' + (done(s) ? " checked" : "") + '><span>' + (done(s) ? "✓" : i + 1) + "</span></label><div><b>" + E(lab(s)) + "</b><span>" + (empty(s) ? "✓ nothing to review today" : s.min ? s.min + " min" : "at college") + "</span></div>" + (s.kind !== "college" && !empty(s) ? '<button type="button" data-go="' + E(s.id) + '">' + (done(s) ? "Again" : "Start") + "</button>" : "") + "</div>").join("") + "</div>" : "") +
      '<h3 class="ixZh">Coming up</h3><div class="ixZweek">' + week.map((x) => '<button type="button" class="ixZday' + (x.off ? " off" : x.exam ? " exam" : "") + '" data-day="' + x.date + '"><span class="ixZd"><small>' + E(short(x.date)) + "</small><b>" + dnum(x.date) + "</b><small>" + E(mon(x.date)) + '</small></span><span class="ixZt">' + E(x.off ? "Day off 🌿" : x.exam ? "🎯 " + x.exam.name : clean(x.title)) + "</span></button>").join("") + "</div>" +
      '<div class="ixZbtns"><button type="button" data-openmap>🗺️ Whole plan</button><button type="button" data-life>⏱ My minutes</button><button type="button" data-hy>📘 Sheets</button><button type="button" data-git>🫃 GIT 206</button></div>' +
      '<details class="ixZmore"><summary>Plan details (readiness, what does not fit)</summary>' + readinessHTML() +
        (P.dropped.length ? "<p>GIT units that do not fit your minutes: " + P.dropped.map((u) => E(u.name)).join(", ") + ".</p>" : "<p>Every GIT unit fits (" + P.unitsFit + " units).</p>") +
        (P.wDropped.length ? "<p>GIT written topics after the top ones: " + P.wDropped.slice(0, 8).map((w) => E(w.topic)).join(", ") + (P.wDropped.length > 8 ? "…" : "") + "</p>" : "") +
        "<p>CNS written: chapters are ranked by MCQ weight until the CNS previous written questions are added.</p></details>";
    el.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { const s = day.steps.find((x) => x.id === b.dataset.go); if (s) runStep(s); }));
    el.querySelectorAll("[data-day]").forEach((b) => (b.onclick = () => openDay(b.dataset.day)));
    el.querySelector("[data-openmap]").onclick = openMap;
    el.querySelector("[data-life]").onclick = () => T() && T().openLife && T().openLife();
    el.querySelector("[data-hy]").onclick = () => window.IX_HY && IX_HY.list();
    el.querySelector("[data-git]").onclick = () => G() && G().open();
    el.querySelectorAll("[data-done]").forEach((c) => (c.onchange = () => { st().done[c.dataset.done] = c.checked ? true : "started"; persist(); home(el); if (typeof window.render === "function") window.render(); }));
  }

  function install() {
    const anchor = document.getElementById("gitBtn") || document.getElementById("tutorBtn");
    if (anchor && !document.getElementById("planBtn")) { const b = anchor.cloneNode(false); b.id = "planBtn"; b.textContent = "📅 My exam plan (30 Dec · 5 Jan · 12 Jan)"; b.removeAttribute("onclick"); b.onclick = (e) => { e.preventDefault(); open(); }; anchor.before(b); }
    if (anchor && !document.getElementById("hyBtn")) { const b = anchor.cloneNode(false); b.id = "hyBtn"; b.textContent = "📘 High-yield sheets (every unit)"; b.removeAttribute("onclick"); b.onclick = (e) => { e.preventDefault(); window.IX_HY && IX_HY.list(); }; anchor.before(b); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();
  setTimeout(install, 1800);
  window.IX_PLAN = { open, close, build, nextStep, runStep, forecast, exams: EXAMS, units: gitUnits, cns: cnsChapters, state: st, sheets, saveSheet, openSheets, span: lectureSpan, lectures: LECT, mount: (el) => home(el), renderInto: (el) => render(el), today, START, openMap, openDay, owed: () => { const P = build(); return owed(P, iso(new Date())); } };
})();
