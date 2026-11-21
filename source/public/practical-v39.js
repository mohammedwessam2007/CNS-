/* INTELLECTUALITY v39 · 🔬 Practical room for DIG-206 (histology slides, physiology department diagrams, calculations, spot).
 *  - Slides: name the slide from its features (4 choices), then recall what identifies it; misses become cards.
 *  - Diagrams: the physiology department's diagrams (the owner's "Physio department_diagrams.pdf"), by caption only — the
 *    pictures stay private. Draw it on paper from memory, then tick the labels you drew; missed labels become cards.
 *  - Calculations: clearance, GFR, filtration fraction, Tm, free water, acid-base, RQ… type the number, see the working.
 *  - Spot: the course's drawings with names hidden (IX_HY.spot).
 * Everything works offline; progress in localStorage ix_pract_v1; missed items join the flashcards (ix_fc_custom_v1). */
(function () {
  "use strict";
  if (window.IX_PRACT) return;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const KEY = "ix_pract_v1", CUSTOM = "ix_fc_custom_v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function card(id, q, a) {
    let C = {}; try { C = JSON.parse(localStorage.getItem(CUSTOM) || "{}"); } catch (e) {}
    C["pract#" + id] = { id: "pract#" + id, lesson: "practical", unit: "practical", subject: "Practical", title: "Practical", q, a, at: Date.now() };
    try { localStorage.setItem(CUSTOM, JSON.stringify(C)); } catch (e) {}
  }

  /* ── histology slides of DIG-206: what identifies each, and what it is confused with ── */
  const SLIDES = [
    ["Tongue (anterior two-thirds)", ["Filiform papillae (keratinised) and fungiform papillae on the dorsum", "Core of skeletal muscle in three planes (longitudinal, transverse, vertical)", "Stratified squamous epithelium"], "Lip (skin on one side, mucosa on the other, no papillae)"],
    ["Circumvallate papilla", ["Large papilla sunk in a circular trench (moat)", "Taste buds on its lateral wall", "Von Ebner's serous glands opening into the trench"], "Foliate papilla (side of the tongue, parallel folds)"],
    ["Parotid gland", ["Purely serous acini", "Many striated and intercalated ducts", "Fat cells increase with age; facial nerve may be seen"], "Pancreas (no striated ducts, centro-acinar cells, islets)"],
    ["Submandibular gland", ["Mixed gland, mostly serous with some mucous acini", "Serous demilunes capping mucous acini", "Long striated ducts"], "Sublingual (mostly mucous, short striated ducts)"],
    ["Sublingual gland", ["Mostly mucous acini (pale, flat basal nuclei)", "Serous demilunes", "Few, short striated ducts"], "Submandibular (mostly serous)"],
    ["Oesophagus", ["Non-keratinised stratified squamous epithelium", "Oesophageal glands in the submucosa", "Thick muscularis mucosae; muscularis externa skeletal above, smooth below"], "Vagina (no glands, no muscularis mucosae)"],
    ["Gastro-oesophageal junction", ["Abrupt change from stratified squamous to simple columnar mucus-secreting epithelium", "Cardiac glands appear in the lamina propria", "Oesophageal submucosal glands end"], "Recto-anal junction (columnar to stratified squamous the other way)"],
    ["Fundus / body of stomach", ["Simple columnar mucus-secreting surface epithelium, short gastric pits", "Long straight fundic glands filling the mucosa", "Parietal (pink, upper) and chief (basophilic, lower) cells"], "Pylorus (deep pits, short coiled mucous glands)"],
    ["Pylorus", ["Deep gastric pits (half the mucosa)", "Short coiled mucous pyloric glands, G cells", "Thick circular muscle forming the pyloric sphincter"], "Fundus (short pits, long glands with parietal cells)"],
    ["Duodenum", ["Villi (leaf-shaped) and crypts of Lieberkühn", "Brunner's glands in the submucosa (diagnostic)", "Simple columnar with goblet cells and brush border"], "Jejunum (no submucosal glands)"],
    ["Jejunum", ["Long finger-like villi, many plicae circulares", "No Brunner's glands, no Peyer's patches", "Paneth cells at crypt bases"], "Ileum (Peyer's patches, shorter villi, more goblet cells)"],
    ["Ileum", ["Peyer's patches (aggregated lymphoid follicles) in mucosa and submucosa, antimesenteric", "Short villi, many goblet cells", "Paneth cells at crypt bases"], "Appendix (no villi, lymphoid follicles all round)"],
    ["Colon", ["No villi; straight tubular crypts packed with goblet cells", "Teniae coli: outer longitudinal muscle in three bands", "Lymphoid follicles in the mucosa"], "Rectum (deeper crypts, complete outer longitudinal coat)"],
    ["Appendix", ["Small lumen, often irregular or with debris", "Lymphoid follicles forming a complete ring in the mucosa and submucosa", "Few, short crypts; no villi; no teniae"], "Ileum (villi, Peyer's patches on one side only)"],
    ["Recto-anal junction", ["Simple columnar (rectum) changing to stratified squamous (anal canal)", "Anal columns and sinuses", "Internal anal sphincter = thickened circular smooth muscle"], "Gastro-oesophageal junction"],
    ["Liver", ["Hexagonal classic lobules around a central vein", "Portal tracts: branch of portal vein, hepatic artery, bile ductule (+ lymphatic)", "Radiating hepatocyte plates with sinusoids, Kupffer cells"], "Pancreas (acini, islets, no portal triads)"],
    ["Gall bladder", ["Mucosa thrown into folds; tall simple columnar epithelium with no goblet cells", "No muscularis mucosae, no submucosa", "Rokitansky-Aschoff sinuses may dip into the muscle"], "Intestine (goblet cells, muscularis mucosae, submucosa)"],
    ["Pancreas", ["Serous acini with centro-acinar cells (diagnostic)", "Islets of Langerhans: pale endocrine clusters", "No striated ducts"], "Parotid (striated ducts, no islets, no centro-acinar cells)"],
    ["Kidney cortex", ["Renal corpuscles: glomerulus inside Bowman's capsule", "PCT: pink, cuboidal, brush border, few nuclei, fuzzy lumen", "DCT: paler, more nuclei, clear lumen; macula densa beside the vascular pole"], "Spleen (white pulp follicles, no tubules)"],
    ["Kidney medulla", ["Parallel straight tubules, no corpuscles", "Thin limbs of Henle (simple squamous) beside vasa recta", "Collecting ducts: pale cuboidal to columnar cells with clear borders"], "Cortex (corpuscles, convoluted tubules)"],
    ["Ureter", ["Star-shaped lumen", "Transitional epithelium (urothelium) with dome cells", "Muscle: inner longitudinal, outer circular (+ outer longitudinal in lower third)"], "Vas deferens (pseudostratified columnar, very thick 3-layer muscle)"],
    ["Urinary bladder", ["Transitional epithelium with dome (umbrella) cells", "Thick, interlacing muscle bundles (detrusor) in three layers", "Folded mucosa when empty"], "Ureter (star lumen, thinner muscle)"],
  ];

  /* ── the physiology department's diagrams (captions from the owner's PDF; the pictures stay private) ── */
  const DIAGRAMS = [
    ["Formation and secretion of saliva by a salivary gland", ["Acinus secreting a primary, plasma-like (isotonic) fluid", "Duct cells reabsorb Na+ and Cl−", "Duct cells secrete K+ and HCO3−", "Ducts impermeable to water → final saliva hypotonic", "Faster flow → less time to modify → saliva closer to isotonic"]],
    ["HCl secretion by the parietal cell", ["CO2 + H2O → H2CO3 by carbonic anhydrase → H+ + HCO3−", "H+/K+ ATPase pumps H+ into the canaliculus in exchange for K+", "Cl− follows through apical Cl− channels; K+ recycles", "HCO3− leaves to the blood in exchange for Cl− (alkaline tide)", "Water follows osmotically"]],
    ["Mechanism of action of stimuli on the parietal cell", ["Acetylcholine on M3 receptors → Ca2+", "Gastrin on CCK-B receptors → Ca2+", "Histamine on H2 receptors → cAMP", "Second messengers activate the H+/K+ ATPase", "Potentiation: histamine amplifies ACh and gastrin (why H2 blockers work so well)"]],
    ["Autoregulation of renal blood flow and GFR", ["X axis: mean arterial pressure; Y axes: RBF and GFR", "Plateau between ~80 and ~180 mmHg", "Myogenic mechanism of the afferent arteriole", "Tubuloglomerular feedback via the macula densa", "Outside the range, flow follows pressure"]],
    ["Macula densa feedback when arterial pressure RISES", ["↑ GFR → ↑ NaCl delivery to the macula densa", "Macula densa releases adenosine", "Afferent arteriole constricts", "↓ glomerular pressure → GFR back to normal", "Negative feedback loop"]],
    ["Macula densa feedback when arterial pressure FALLS", ["↓ GFR → ↓ NaCl at the macula densa", "Afferent arteriole dilates", "Renin release from JG cells → angiotensin II", "Efferent arteriole constricts → glomerular pressure restored", "GFR returns toward normal"]],
    ["Selective permeability of the glomerular membrane by charge", ["X axis: effective molecular diameter; Y axis: fractional clearance", "Cationic molecules pass most easily", "Neutral intermediate", "Anionic molecules pass least (negative basement membrane and podocyte coat)", "Albumin (anionic, ~6 nm) is held back"]],
    ["Forces across the peritubular capillaries", ["Low capillary hydrostatic pressure (~13 mmHg)", "High capillary oncotic pressure (~32 mmHg)", "Interstitial hydrostatic and oncotic pressures", "Net reabsorptive pressure ~10 mmHg into the capillary", "Bulk flow of water and Na+ from interstitium to blood"]],
    ["Primary active transport of Na+ in the PCT", ["Basolateral Na+/K+ ATPase: 3 Na+ out, 2 K+ in", "Low intracellular Na+ (and −70 mV inside)", "Na+ enters passively across the brush border", "Lumen slightly negative (−3 mV) early PCT", "Tight junctions and lateral intercellular space"]],
    ["Na+ reabsorption in the first half of the PCT", ["Na+ co-transported with glucose", "with amino acids", "with phosphate, lactate, citrate", "Na+/H+ exchange → HCO3− reabsorbed", "Na+/K+ ATPase on the basolateral side drives it all"]],
    ["H+ secretion accompanied by HCO3− reabsorption", ["Na+/H+ counter-transport at the luminal membrane", "H+ + filtered HCO3− → H2CO3 → CO2 + H2O (brush-border carbonic anhydrase)", "CO2 enters the cell, re-forms HCO3− inside", "HCO3− leaves basolaterally to the blood", "Net: one HCO3− reabsorbed for each H+ secreted"]],
    ["Counter-transport of Na+ and H+ across the tubular membrane", ["Na+ moves down its gradient into the cell", "H+ moves out into the lumen", "Gradient made by the basolateral Na+/K+ ATPase", "Cell interior −70 mV", "Secondary active transport"]],
    ["Na+ reabsorption in the thick ascending limb of Henle", ["Na+-K+-2Cl− co-transporter (NKCC2) on the luminal side", "K+ leaks back to the lumen → lumen +8 mV", "Positive lumen drives paracellular Na+, K+, Mg2+, Ca2+", "Impermeable to water (diluting segment)", "Loop diuretics (furosemide) block NKCC2"]],
    ["Na+ reabsorption by principal cells under hormonal control", ["Aldosterone enters, binds its cytoplasmic receptor", "More ENaC channels on the luminal side", "More Na+/K+ ATPase basolaterally", "K+ secreted through ROMK channels", "Amiloride blocks ENaC; spironolactone blocks the receptor"]],
    ["Hormonal control of Na+ excretion", ["Aldosterone ↑ Na+ reabsorption", "ANP → cGMP → ↓ Na+ reabsorption (natriuresis)", "Endothelin, IL-1, PGE2 ↓ reabsorption", "Ouabain-like factor inhibits Na+/K+ ATPase", "Balance of these sets daily Na+ excretion"]],
    ["K+ reabsorption by intercalated cells", ["Luminal H+/K+ ATPase: H+ out, K+ in", "K+ leaves basolaterally to the blood", "Active in K+ depletion", "Also secretes H+ (acid-base link)", "Type A intercalated cell"]],
    ["K+ secretion by principal cells", ["Na+/K+ ATPase loads the cell with K+", "K+ exits to the lumen through ROMK channels", "Na+ entry through ENaC makes the lumen negative → drives K+ out", "↑ by aldosterone, ↑ plasma K+, ↑ tubular flow", "Explains K+ loss with diuretics"]],
    ["Glucose reabsorption in the PCT", ["SGLT2: Na+-glucose co-transport at the luminal side (early PCT)", "SGLT1 in the late PCT", "GLUT2 facilitated exit basolaterally", "Na+/K+ ATPase keeps intracellular Na+ low", "Secondary active transport"]],
    ["Tubular transport maximum (Tm) for glucose", ["Filtered load rises linearly with plasma glucose", "Reabsorbed line plateaus at Tm (~375 mg/min)", "Excreted line starts at the threshold (~200 mg/dl)", "Splay: nephrons differ in their Tm", "Glucose appears in urine above threshold (diabetes mellitus)"]],
    ["Effect of ADH on urine osmolarity along the tubule", ["Isotonic (300) at the end of the PCT", "Hypotonic (~100) leaving the thick ascending limb", "With ADH: water leaves the collecting duct → urine up to 1200 mOsm/L", "Without ADH: dilute urine (~50 mOsm/L)", "Medullary interstitium hyperosmotic (cortex 300 → papilla 1200)"]],
    ["Vasa recta as a countercurrent exchanger", ["Hairpin capillaries beside the loop of Henle", "Descending limb: takes in solute, loses water", "Ascending limb: loses solute, takes in water", "Low, sluggish blood flow", "Keeps the medullary gradient from being washed out"]],
    ["Urea deposition in the inner medulla", ["Cortex and outer medullary collecting duct impermeable to urea", "Water reabsorbed there (ADH) → urea concentrated", "Inner medullary collecting duct permeable to urea (UT-A, ↑ by ADH)", "Urea diffuses into the interstitium (~40% of its osmolarity)", "Urea recycles into the thin limbs"]],
    ["Formation of dilute urine when ADH is very low", ["Isotonic fluid leaves the PCT", "Thick ascending limb removes NaCl, not water", "Distal tubule and collecting duct keep removing NaCl", "No ADH → collecting duct impermeable to water", "Urine down to ~50 mOsm/L, large volume"]],
    ["H+ secretion and HCO3− reabsorption by the PCT", ["Na+/H+ exchanger (secondary active)", "Luminal carbonic anhydrase", "CO2 diffuses into the cell", "HCO3− with Na+ to the blood", "Reabsorbs ~85% of filtered HCO3−"]],
    ["H+ secretion and HCO3− reabsorption by the DCT and collecting ducts", ["Intercalated cells: primary active H+ ATPase", "and H+/K+ ATPase", "Cl−/HCO3− exchange basolaterally", "Stimulated by aldosterone", "Can acidify urine down to pH ~4.5"]],
    ["Buffering of H+ by phosphate", ["Filtered Na2HPO4 in the lumen", "Secreted H+ + HPO4 2− → H2PO4− (titratable acid)", "Na+ reabsorbed with a NEW HCO3− to the blood", "Phosphate buffer works best at pH ~6.8", "Measured as titratable acidity"]],
    ["Buffering of H+ by ammonia (NH3)", ["Glutamine metabolised in the tubular cell → NH3 (+ new HCO3−)", "NH3 diffuses into the lumen", "NH3 + H+ → NH4+ trapped (cannot diffuse back)", "Excreted with Cl− as NH4Cl", "Rises greatly in chronic acidosis"]],
  ];

  /* ── calculations: type the number, then see the working ── */
  const CALC = [
    ["Inulin: urine 30 mg/ml, plasma 0.5 mg/ml, urine flow 2 ml/min. GFR?", 120, "ml/min", "GFR = U×V/P = 30 × 2 / 0.5 = 120 ml/min (inulin is filtered, not reabsorbed or secreted)."],
    ["PAH clearance 600 ml/min, haematocrit 45%. Renal BLOOD flow?", 1091, "ml/min", "RPF ≈ PAH clearance = 600. RBF = RPF / (1 − Hct) = 600 / 0.55 ≈ 1091 ml/min."],
    ["GFR 125 ml/min, renal plasma flow 625 ml/min. Filtration fraction (%)?", 20, "%", "FF = GFR / RPF = 125 / 625 = 0.20 = 20%."],
    ["Glucose Tm 375 mg/min, GFR 125 ml/min. Plasma glucose (mg/ml) at which ALL nephrons are saturated (ideal threshold)?", 3, "mg/ml", "Filtered load = GFR × P. Saturation when 125 × P = 375 → P = 3 mg/ml (300 mg/dl). Real threshold is lower (~200 mg/dl) because of splay."],
    ["Urine 600 mOsm/L, plasma 300 mOsm/L, urine flow 2 ml/min. Free-water clearance?", -2, "ml/min", "Cosm = 600 × 2 / 300 = 4 ml/min. CH2O = V − Cosm = 2 − 4 = −2 ml/min (concentrated urine: water is being kept)."],
    ["Glomerular capillary pressure 60, Bowman's pressure 18, glomerular oncotic 32 mmHg. Net filtration pressure?", 10, "mmHg", "NFP = 60 − 18 − 32 = 10 mmHg."],
    ["Na 140, Cl 104, HCO3 24 mEq/L. Anion gap?", 12, "mEq/L", "AG = Na − (Cl + HCO3) = 140 − 128 = 12 mEq/L (normal 8–16)."],
    ["A subject produces 200 ml CO2 and uses 250 ml O2 per minute. RQ?", 0.8, "", "RQ = CO2 produced / O2 consumed = 200 / 250 = 0.8 (mixed diet)."],
    ["Creatinine: urine 100 mg/dl, plasma 1 mg/dl, urine 1.44 L/day. Creatinine clearance?", 100, "ml/min", "V = 1440 ml / 1440 min = 1 ml/min. C = 100 × 1 / 1 = 100 ml/min (slightly overestimates GFR: a little creatinine is secreted)."],
    ["Substance X: clearance 60 ml/min, GFR 120 ml/min. Clearance ratio, and what does the tubule do with X?", 0.5, "", "Ratio = 60 / 120 = 0.5 < 1 → X is net reabsorbed (or filtered only in part). >1 would mean net secretion."],
  ];

  let root = null, body = null;
  function shell(tab) {
    if (!root) { root = document.createElement("div"); root.className = "ixPr"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Practical room"); document.body.appendChild(root); }
    root.innerHTML = '<div class="ixPrbox"><div class="ixPrhd"><b>🔬 Practical room · DIG-206</b><button type="button" data-p="close" aria-label="Close">✕</button></div><div class="ixPrtabs">' +
      [["slides", "Slides"], ["diagrams", "Diagrams"], ["calc", "Calculations"], ["spot", "Spot"]].map((t) => '<button type="button" data-tab="' + t[0] + '"' + (t[0] === tab ? ' aria-pressed="true"' : "") + ">" + t[1] + "</button>").join("") + '</div><div class="ixPrbody"></div></div>';
    root.classList.add("on"); document.documentElement.classList.add("ixPrOpen");
    body = root.querySelector(".ixPrbody");
    root.querySelector("[data-p=close]").onclick = close;
    root.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => open(b.dataset.tab)));
  }
  function close() { if (root) root.classList.remove("on"); document.documentElement.classList.remove("ixPrOpen"); try { document.dispatchEvent(new CustomEvent("ix:done", { detail: { kind: "practical" } })); } catch (e) {} }
  function open(tab, unitName) {
    tab = tab || "slides"; only = unitName ? diagramsFor(unitName) : null;
    if (tab === "spot") { close(); if (window.IX_HY && IX_HY.spot) IX_HY.spot(6); return; }
    shell(tab);
    ({ slides, diagrams, calc })[tab](0, null);
  }
  const done = (kind, id, ok) => { const s = load(); (s[kind] = s[kind] || {})[id] = { ok, at: Date.now() }; save(s); };
  const order = (kind, list) => { const s = load()[kind] || {}; return shuffle(list.map((x, i) => i)).sort((a, b) => (s[a] ? (s[a].ok ? 2 : 0) : 1) - (s[b] ? (s[b].ok ? 2 : 0) : 1)); };

  function slides(k, seq) {
    seq = seq || order("slides", SLIDES).slice(0, 8);
    if (k >= seq.length) return end("slides", seq.length);
    const i = seq[k], [name, feats, conf] = SLIDES[i];
    const opts = shuffle([i].concat(shuffle(SLIDES.map((x, j) => j).filter((j) => j !== i)).slice(0, 3)));
    body.innerHTML = '<p class="ixPrsmall">Slide ' + (k + 1) + " of " + seq.length + ' · name the slide from what you see</p><ul class="ixPrfeat">' + feats.map((f) => "<li>" + E(f) + "</li>").join("") + '</ul><div class="ixPropts">' +
      opts.map((j) => '<button type="button" data-o="' + j + '">' + E(SLIDES[j][0]) + "</button>").join("") + "</div>";
    body.querySelectorAll("[data-o]").forEach((b) => (b.onclick = () => {
      const ok = +b.dataset.o === i; done("slides", i, ok);
      body.querySelectorAll("[data-o]").forEach((x) => { x.disabled = true; if (+x.dataset.o === i) x.classList.add("good"); else if (x === b) x.classList.add("bad"); });
      if (!ok) card("slide" + i, "Histology slide: what identifies the " + name + "?", feats.join(" · ") + ". Don't confuse with: " + conf);
      const fb = document.createElement("div"); fb.className = "ixPrfb";
      fb.innerHTML = "<p>" + (ok ? "✓ " : "✗ It is the ") + "<b>" + E(name) + "</b>.</p><p class='ixPrsmall'>Don't confuse with: " + E(conf) + "</p><button type='button' class='ixPrmain' data-n>Next →</button>";
      body.appendChild(fb); fb.querySelector("[data-n]").onclick = () => slides(k + 1, seq);
    }));
  }
  // the department diagrams that belong to a physiology unit (by its name), for the plan's unit days
  const GROUPS = [[/saliva|gastric|stomach|hcl|parietal|secretion/i, /saliva|hcl|parietal/i], [/gfr|renal blood|autoregul|filtration/i, /autoregulation|macula densa|glomerular membrane|peritubular/i],
    [/tubular|glucose|na\+|k\+|clearance|transport/i, /na\+|k\+|glucose|counter-transport|tm\)/i], [/concentrat|adh|thirst|urine|urea|dilut/i, /adh|vasa recta|urea|dilute/i], [/acid|base|h\+|hco3|buffer/i, /h\+|hco3|buffering/i]];
  function diagramsFor(name) { const g = GROUPS.find((x) => x[0].test(name || "")); return g ? DIAGRAMS.map((d, i) => i).filter((i) => g[1].test(DIAGRAMS[i][0])) : []; }
  let only = null;
  function diagrams(k, seq) {
    const base = only && only.length ? order("diagrams", DIAGRAMS).filter((i) => only.includes(i)) : order("diagrams", DIAGRAMS);
    seq = seq || base.slice(0, only && only.length ? 3 : 4);
    if (k >= seq.length) return end("diagrams", seq.length);
    const i = seq[k], [title, labels] = DIAGRAMS[i];
    body.innerHTML = '<p class="ixPrsmall">Diagram ' + (k + 1) + " of " + seq.length + " · physiology department diagram</p><h3>✏️ " + E(title) + '</h3><p>Draw it on paper from memory, fully labelled (about 3 minutes). Then show the checklist.</p><button type="button" class="ixPrmain" data-show>I drew it · show the labels</button><div class="ixPrchk" hidden>' +
      labels.map((l, j) => '<label class="ixPrtick"><input type="checkbox" data-l="' + j + '"><span>' + E(l) + "</span></label>").join("") + '<button type="button" class="ixPrmain" data-score>Score it</button></div>';
    body.querySelector("[data-show]").onclick = (e) => { e.target.hidden = true; body.querySelector(".ixPrchk").hidden = false; };
    body.querySelector("[data-score]").onclick = (e) => {
      const t = [...body.querySelectorAll("[data-l]")], got = t.filter((x) => x.checked).length; done("diagrams", i, got === t.length);
      t.forEach((x) => { if (!x.checked) card("dia" + i + "_" + x.dataset.l, "Diagram \"" + title + "\": which label is missing? (" + (+x.dataset.l + 1) + " of " + labels.length + ")", labels[+x.dataset.l]); });
      e.target.outerHTML = "<p class='ixPrfb'>" + got + " / " + t.length + " labels. " + (got === t.length ? "Exam-ready." : "The missed labels are flashcards for tomorrow; this diagram comes back first next time.") + "</p><button type='button' class='ixPrmain' data-n>Next →</button>";
      body.querySelector("[data-n]").onclick = () => diagrams(k + 1, seq);
    };
  }
  function calc(k, seq) {
    seq = seq || order("calc", CALC).slice(0, 4);
    if (k >= seq.length) return end("calc", seq.length);
    const i = seq[k], [q, ans, unit, work] = CALC[i];
    body.innerHTML = '<p class="ixPrsmall">Problem ' + (k + 1) + " of " + seq.length + "</p><h3>" + E(q) + '</h3><div class="ixPrrow"><input type="text" inputmode="decimal" data-a placeholder="Your answer"><span>' + E(unit) + '</span><button type="button" class="ixPrmain" data-c>Check</button></div>';
    const chk = () => {
      const v = parseFloat(String(body.querySelector("[data-a]").value).replace(",", ".").replace("−", "-"));
      const ok = isFinite(v) && Math.abs(v - ans) <= Math.max(0.05 * Math.abs(ans), 0.02); done("calc", i, ok);
      if (!ok) card("calc" + i, q, work);
      const fb = document.createElement("div"); fb.className = "ixPrfb";
      fb.innerHTML = "<p>" + (ok ? "✓ Right" : "✗ The answer is <b>" + ans + " " + E(unit) + "</b>") + "</p><p>" + E(work) + "</p><button type='button' class='ixPrmain' data-n>Next →</button>";
      body.querySelector("[data-c]").disabled = true; body.appendChild(fb); fb.querySelector("[data-n]").onclick = () => calc(k + 1, seq);
    };
    body.querySelector("[data-c]").onclick = chk;
    body.querySelector("[data-a]").onkeydown = (e) => { if (e.key === "Enter") chk(); };
  }
  function end(kind, n) {
    const s = load()[kind] || {}, list = { slides: SLIDES, diagrams: DIAGRAMS, calc: CALC }[kind], ok = Object.values(s).filter((x) => x.ok).length;
    body.innerHTML = "<div class='ixPrend'><p class='ixPrbig'>✓ " + n + " done</p><p>Solid so far: <b>" + ok + " of " + list.length + "</b>. Misses are flashcards for tomorrow and come back first here.</p><div class='ixPrrow'><button type='button' class='ixPrmain' data-more>Another round</button><button type='button' data-x>Close</button></div></div>";
    body.querySelector("[data-more]").onclick = () => open(kind);
    body.querySelector("[data-x]").onclick = close;
  }
  document.addEventListener("click", (e) => { const b = e.target.closest && e.target.closest("[data-pract]"); if (b) { e.preventDefault(); e.stopPropagation(); open(b.dataset.pract || "slides"); } }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && root && root.classList.contains("on")) close(); });
  window.IX_PRACT = { open, close, SLIDES, DIAGRAMS, CALC, progress: load, diagramsFor };
})();
