/* INTELLECTUALITY v34 · the revision kit: everything a complete course has besides lessons.
 *  - 📇 Flashcards: every 🤔 question of the 50 lessons becomes a card; a lesson's cards join your deck when you finish
 *    it; spaced repetition (1, 3, 7, 16, 35 days); "Again" brings it back tomorrow. The daily review step uses them.
 *  - 🔎 Search: lessons, reference answers, past-paper questions, drawings, at once
 *  - 📄 One-pagers: each unit on one page (the "Say it back" lines + the classic confusions), printable
 *  - 🔢 Numbers: the physiology values the exam asks for
 *  - 🧠 Mnemonics: the course's memory hooks in one place */
(function () {
  "use strict";
  if (window.IX_KIT) return;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const L = () => window.IX_LESSON, TXT = () => window.IX_LESSON_TEXT || {};
  const FC = "ix_fc_v1", STEPS = [1, 3, 7, 16, 35], DAY = 864e5;
  const get = () => { try { return JSON.parse(localStorage.getItem(FC) || "{}") || {}; } catch (e) { return {}; } };
  const put = (o) => { try { localStorage.setItem(FC, JSON.stringify(o)); } catch (e) {} };
  const sections = (t) => { const out = {}; let k = null; String(t || "").split("\n").forEach((l) => { if (/^##\s/.test(l)) { k = l.replace(/^##\s+(\d+\.\s*)?/, ""); out[k] = []; } else if (k) out[k].push(l); }); return out; };

  /* ── cards from the lessons ── */
  function cards() {
    const out = [];
    (L() ? L().all() : []).forEach((les) => {
      const t = TXT()[les.key]; if (!t) return;
      let n = 0;
      String(t).replace(/🤔 Think:\s*(.+?)\s*\|\|(.+?)\|\|/g, (m, q, a) => { out.push({ id: les.key + "#" + n++, lesson: les.key, unit: les.unit, subject: les.subject, title: les.title, q: q.trim().replace(/^./, (x) => x.toUpperCase()), a: a.trim().replace(/^./, (x) => x.toUpperCase()) }); return m; });
    });
    return out;
  }
  const deckOf = () => { const S = get(), done = (k) => L() && L().isDone(k); return cards().filter((c) => S[c.id] || done(c.lesson)); };
  // a finished lesson's cards first come back the next day (spacing), never on the day it was learned
  const doneAt = (k) => { try { const d = JSON.parse(localStorage.getItem("ix_lesson_done_v1") || "{}")[k]; return typeof d === "number" ? d : d ? Date.now() - DAY : 0; } catch (e) { return 0; } };
  const startOfTomorrow = (t) => { const d = new Date(t); d.setHours(24, 0, 0, 0); return d.getTime(); };
  function due(now) { now = now || Date.now(); const S = get(); return deckOf().filter((c) => (S[c.id] ? S[c.id].due : startOfTomorrow(doneAt(c.lesson))) <= now); }
  function grade(id, g) {
    const S = get(), s = S[id] || { step: -1, due: 0 };
    if (g === "again") { s.step = -1; s.due = Date.now() + 10 * 60e3; }
    else { s.step = Math.min(STEPS.length - 1, s.step + (g === "easy" ? 2 : 1)); s.due = Date.now() + STEPS[s.step] * DAY * (g === "hard" ? 0.6 : 1); }
    S[id] = s; put(S); return s;
  }

  /* ── numbers and mnemonics ── */
  const NUMBERS = [
    ["Saliva", "1–1.5 L/day; hypotonic; ↑ K+ and HCO3-, ↓ Na+ and Cl- (more plasma-like at high flow)"],
    ["Gastric juice", "~2 L/day; pH 1–2; pepsin active below pH 3"],
    ["Pancreatic juice", "~1.5 L/day; pH ~8; HCO3- up to ~140 mmol/L at high flow"],
    ["Bile", "~600 ml/day; gall bladder concentrates 5–10×; bile salt pool ~3 g, recycled 6–10×/day; 95% reabsorbed in the terminal ileum"],
    ["Fluid into the gut", "~9 L/day (2 oral + 7 secretions); ~1.5 L reaches the colon; ~100–200 ml in faeces"],
    ["Slow waves", "stomach 3/min; duodenum 12/min; ileum 8/min"],
    ["MMC", "every ~90 min in fasting (motilin)"],
    ["Small-intestinal transit", "3–5 h; peristalsis ~1 cm/min"],
    ["Renal blood flow", "~1.2 L/min = 20–25% of cardiac output; RPF ~650 ml/min; cortex 90%"],
    ["GFR", "~125 ml/min = 180 L/day; filtration fraction ~20%"],
    ["Glomerular pressures", "P glom ~60, P Bowman ~18, π glom ~32 mmHg → net ~10 mmHg"],
    ["Autoregulation", "mean BP 80–180 mmHg"],
    ["Na+ reabsorption", "PCT 65% · TAL 25% · DCT 5% · CD ~3%"],
    ["Glucose", "renal threshold ~180 mg/dl; Tm ~375 mg/min"],
    ["Medullary osmolality", "300 (cortex) → 1200 mOsm/kg (papilla); urea ~half at the papilla"],
    ["Urine", "1–1.5 L/day; osmolality 50–1200 mOsm/kg; obligatory volume ~500 ml"],
    ["Acid-base", "pH 7.35–7.45; HCO3- 24 mmol/L; PCO2 40 mmHg; ratio 20:1; pKa 6.1"],
    ["BMR", "~40 kcal/m²/h (≈1600–1800 kcal/day adult); 1 L O2 ≈ 4.8 kcal"],
    ["RQ", "carbohydrate 1.0 · protein 0.8 · fat 0.7 · mixed 0.82"],
    ["SDA", "protein ~30% · carbohydrate ~6% · fat ~4%"],
    ["Temperature", "core ~37 °C; fever raises BMR ~13% per °C; heat stroke > 40.5 °C"],
    ["Levels (anatomy)", "coeliac T12 · SMA L1 · renal L1–2 · gonadal L2 · IMA L3 · aortic bifurcation L4 · IVC formed L5 · IVC through diaphragm T8 · oesophagus T10 · aorta T12"],
    ["Small intestine", "~6 m; duodenum 25 cm; jejunum 2/5, ileum 3/5; colon 1.5 m"],
    ["Inguinal canal", "4 cm; deep ring 1.25 cm above the mid-inguinal point"],
    ["Bile duct", "~7.5 cm; four parts; ampulla in the 2nd part of the duodenum ~10 cm from the pylorus"],
  ];
  const MNEMONICS = [
    ["Walls of the inguinal canal", "MALT: roof Muscles, Anterior Aponeurosis, floor Ligament, posterior Transversalis (2 M, 2 A, 2 L, 2 T with the second structure each)"],
    ["Meckel's diverticulum", "Rule of 2: 2 inches long, 2 feet from the ileocaecal valve, 2% of people, 2 types of ectopic tissue, symptomatic before 2 years"],
    ["Porta hepatis, front to back", "D-A-V: Duct, Artery, Vein"],
    ["Renal hilum, front to back", "V-A-P: Vein, Artery, Pelvis"],
    ["Spermatic cord", "3 arteries (testicular, cremasteric, to the vas), 3 nerves (genital br. of genitofemoral, sympathetics, ilioinguinal alongside), 3 others (vas, pampiniform plexus, lymphatics)"],
    ["Spleen", "1 × 3 × 5 inches, 7 oz, ribs 9 to 11 (the odd numbers 1-3-5-7-9-11)"],
    ["Fibre direction", "External oblique = hands in your front pockets (down and in); internal oblique at right angles; transversus horizontal"],
    ["Portosystemic sites", "Oesophagus, umbilicus, anal canal, retroperitoneum, bare area: 'varices up, medusa middle, piles down'"],
    ["GI hormones", "Secretin = Sodium bicarbonate (S for S); CCK = Cholecystokinin = Contracts the gall bladder + enzymes; Gastrin = G cells, Gives acid"],
    ["Diuretic sites", "Furosemide on the 'loop' (L for loop and Lasix), Thiazide on the 'Twisted' DCT, Spironolactone on the collecting duct (Sodium-sparing)"],
    ["Salivary glands", "Parotid = Pure serous; Submandibular = mixed but mainly Serous; Sublingual = mixed but mainly Slimy (mucous)"],
    ["Lumbar plexus around psoas", "Lateral: iliohypogastric, ilioinguinal, lateral cutaneous, femoral · Medial: obturator, lumbosacral trunk · Anterior: genitofemoral"],
    ["RQ", "Carbs = 1 (one sugar), Protein 0.8, Fat 0.7 (fat is 'lower')"],
    ["Hypothalamus and eating", "Lateral = Lunch (hunger); Ventromedial = 'Very full' (satiety)"],
    ["Midgut rotation", "270° anticlockwise around the SMA: 90 in the cord, 180 on the way home"],
  ];

  /* ── search ── */
  function search(q) {
    q = String(q || "").trim().toLowerCase(); if (q.length < 3) return [];
    const words = q.split(/\s+/).filter(Boolean), hit = (t) => { t = String(t || "").toLowerCase(); return words.every((w) => t.indexOf(w) >= 0); };
    const out = [];
    (L() ? L().all() : []).forEach((les) => { const t = TXT()[les.key] || ""; const S = sections(t); Object.keys(S).forEach((h, i) => { const body = S[h].join(" "); if (hit(les.title + " " + h + " " + body)) out.push({ kind: "Lesson", title: les.title + " · " + h, snip: body, open: () => L().open(les.key, i) }); }); });
    const R = window.IX_GIT206_REF || {}; Object.keys(R).forEach((topic) => R[topic].forEach((r) => { if (hit(topic + " " + r.head + " " + r.text)) out.push({ kind: "Reference answer", title: r.head, snip: r.text, ref: r }); }));
    ((window.IX_GIT206 || {}).mcq || []).forEach((m) => { const opts = m.options.map((o) => o.text).join(" "); if (hit(m.stem + " " + opts)) out.push({ kind: "Past-paper MCQ", title: m.stem, snip: (m.answerKeys || []).length ? "Key: " + m.options.filter((o) => m.answerKeys.includes(o.key)).map((o) => o.text).join(" / ") + (m.keyBy === "app" ? " (app key)" : "") : "No key", mcq: m }); });
    if (window.IX_DRAW) IX_DRAW.ids().forEach((id) => { const d = IX_DRAW.get(id); if (hit(d.title + " " + d.steps.map((s) => s[0]).join(" "))) out.push({ kind: "Exam drawing", title: d.title, snip: d.steps.map((s) => s[0]).join(" "), open: () => IX_DRAW.open(id) }); });
    (window.IX_CNS_WRITTEN || []).forEach((x, i) => { if (hit(x.q + " " + x.ch + " " + x.skel)) out.push({ kind: "CNS written (likely)", title: x.q, snip: x.skel, open: () => IX_CNS.quick(IX_CNS_WRITTEN.map((y) => y.q), i) }); });
    NUMBERS.concat(MNEMONICS).forEach((n) => { if (hit(n[0] + " " + n[1])) out.push({ kind: "Revision fact", title: n[0], snip: n[1] }); });
    const head = (r) => (hit(r.title) ? 0 : 1) + (r.kind === "Lesson" ? 0 : r.kind === "Reference answer" ? 0.2 : 0.5);
    return out.map((r, i) => [head(r), i, r]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[2]).slice(0, 60);
  }
  const snip = (t, q) => { t = String(t).replace(/[#>*|]/g, " ").replace(/\s+/g, " "); const i = Math.max(0, t.toLowerCase().indexOf(String(q).toLowerCase().split(/\s+/)[0]) - 60); return (i ? "…" : "") + t.slice(i, i + 220) + "…"; };

  /* ── one-pagers ── */
  function onePager(unitId) {
    const ls = L() ? L().lessonsOf(unitId) : []; let html = "";
    ls.forEach((les) => { const S = sections(TXT()[les.key]); const say = S["Say it back"] || [], conf = S["Where people get confused"] || []; html += "<h3>" + E(les.title) + "</h3><ol>" + say.filter((x) => /^\d+\./.test(x.trim())).map((x) => "<li>" + E(x.replace(/^\s*\d+\.\s*/, "")) + "</li>").join("") + "</ol>" + (conf.length ? "<p class='ixKconf'><b>Don't mix up:</b> " + conf.filter((x) => x.trim()).map((x) => E(x.replace(/^\s*-\s*/, "").replace(/\*\*/g, ""))).join(" · ") + "</p>" : ""); });
    return html;
  }

  /* ── the overlay ── */
  let root = null, body = null, tab = "cards";
  function shell() {
    if (root) return;
    root = document.createElement("div"); root.className = "ixK"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Revision kit");
    root.innerHTML = '<div class="ixKin"><div class="ixKtop"><button type="button" class="ixKx" data-k="close" aria-label="Close">✕</button><div><small>Everything for revision</small><b>Revision kit</b></div></div><div class="ixKtabs">' +
      [["cards", "📇 Flashcards"], ["search", "🔎 Search"], ["one", "📄 One-pagers"], ["num", "🔢 Numbers"], ["mnem", "🧠 Mnemonics"]].map((t) => '<button type="button" data-tab="' + t[0] + '">' + t[1] + "</button>").join("") + '</div><div class="ixKbody" id="ixKbody"></div></div>';
    document.body.appendChild(root); body = root.querySelector("#ixKbody");
    root.addEventListener("click", (e) => { const b = e.target.closest("[data-k], [data-tab]"); if (!b) return; if (b.dataset.k === "close") close(); if (b.dataset.tab) open(b.dataset.tab); });
  }
  function close() { if (root) root.classList.remove("on"); document.documentElement.classList.remove("ixKon"); }
  function open(t, arg) {
    shell(); tab = t || tab; root.classList.add("on"); document.documentElement.classList.add("ixKon");
    root.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    if (tab === "cards") return review();
    if (tab === "search") { body.innerHTML = '<input type="search" class="ixKq" id="ixKq" placeholder="Search everything: e.g. porta hepatis, parietal cell, GFR" autocomplete="off"><div id="ixKres"></div>'; const inp = body.querySelector("#ixKq"); if (arg) inp.value = arg; const run = () => { const q = inp.value, R = search(q), box = body.querySelector("#ixKres"); box.innerHTML = q.trim().length < 3 ? "<p class='ixKsmall'>Type at least 3 letters.</p>" : R.length ? R.map((r, i) => '<button type="button" class="ixKr" data-r="' + i + '"><small>' + E(r.kind) + "</small><b>" + E(r.title.slice(0, 120)) + "</b><span>" + E(snip(r.snip, q)) + "</span></button>").join("") : "<p class='ixKsmall'>Nothing found.</p>"; box.querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => { const r = R[+b.dataset.r]; if (r.open) { close(); r.open(); } else { b.querySelector("span").textContent = r.snip; b.classList.add("full"); } })); }; inp.oninput = run; run(); setTimeout(() => inp.focus(), 50); return; }
    if (tab === "one") { const U = (window.IX_PLAN ? IX_PLAN.units() : []); body.innerHTML = "<p class='ixKsmall'>Each unit on one page: the lines to say back and the look-alikes. Tap a unit; use your phone's print/share to save it as PDF.</p>" + U.map((u) => '<details class="ixKone"><summary><b>' + E(u.name) + "</b><small>" + E(u.subject) + "</small></summary>" + onePager(u.id) + "</details>").join(""); return; }
    if (tab === "num") { body.innerHTML = "<p class='ixKsmall'>The numbers examiners ask for.</p><div class='ixKtab'>" + NUMBERS.map((n) => "<div><b>" + E(n[0]) + "</b><span>" + E(n[1]) + "</span></div>").join("") + "</div>"; return; }
    if (tab === "mnem") { body.innerHTML = "<p class='ixKsmall'>Use them only after you understand the topic.</p><div class='ixKtab'>" + MNEMONICS.map((n) => "<div><b>" + E(n[0]) + "</b><span>" + E(n[1]) + "</span></div>").join("") + "</div>"; return; }
  }
  function review() {
    const D = due(), deck = deckOf().length, all = cards().length;
    if (!D.length) { body.innerHTML = "<div class='ixKempty'><b>" + (deck ? "Nothing due. 🌿" : "Your deck is empty.") + "</b><p>" + (deck ? deck + " cards in your deck; the next ones come back on their day." : "Each lesson you finish adds its 🤔 questions here (" + all + " cards in the course).") + "</p><button type='button' class='ixKmain' data-add>Add every lesson's cards now (" + all + ")</button></div>"; body.querySelector("[data-add]").onclick = () => { const S = get(); cards().forEach((c) => { if (!S[c.id]) S[c.id] = { step: -1, due: 0 }; }); put(S); review(); }; return; }
    const c = D[0];
    body.innerHTML = "<div class='ixKcard'><small>" + E(c.subject + " · " + c.title) + " · " + D.length + " due</small><p class='ixKq2'>" + E(c.q) + "</p><button type='button' class='ixKmain' data-show>Show the answer</button><div class='ixKa' hidden><p>" + E(c.a) + "</p><div class='ixKg'><button type='button' data-g='again'>Again</button><button type='button' data-g='hard'>Hard</button><button type='button' data-g='good'>Good</button><button type='button' data-g='easy'>Easy</button></div></div></div>";
    body.querySelector("[data-show]").onclick = (e) => { e.target.hidden = true; body.querySelector(".ixKa").hidden = false; };
    body.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { grade(c.id, b.dataset.g); if (!due().length) document.dispatchEvent(new CustomEvent("ix:done", { detail: { kind: "review" } })); review(); }));
  }
  document.addEventListener("click", (e) => { const b = e.target.closest && e.target.closest("[data-kit]"); if (b) { e.preventDefault(); e.stopPropagation(); open(b.dataset.kit); } }, true);
  window.IX_KIT = { open, close, cards, due, deck: deckOf, grade, search, onePager, NUMBERS, MNEMONICS };
})();
