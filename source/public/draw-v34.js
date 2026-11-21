/* INTELLECTUALITY v34 · "Draw it with me": the diagrams Kasr Al Ainy asks you to draw, built on screen one step at a
 * time (like a teacher at a whiteboard), then drawn by you on paper, photographed and graded by the professor.
 * Hand-made SVG, labels as the course says them. IX_DRAW.open(id) · IX_DRAW.forUnit(unitId) · IX_DRAW.list() */
(function () {
  "use strict";
  if (window.IX_DRAW) return;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const C = { eo: "#e11d48", io: "#2563eb", ta: "#059669", ft: "#64748b", rect: "#f59e0b", art: "#dc2626", vein: "#2563eb", duct: "#16a34a", ink: "#0f172a", mut: "#475569", fill: "#fde68a", pale: "#fef3c7" };
  const P = (d, c, w, extra) => '<path pathLength="1" class="ixDs" d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 2) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"' + (extra || "") + "/>";
  const T = (x, y, t, a, c, s) => '<text class="ixDt" x="' + x + '" y="' + y + '" text-anchor="' + (a || "start") + '" fill="' + (c || C.ink) + '" font-size="' + (s || 10) + '">' + E(t) + "</text>";
  const L = (x1, y1, x2, y2) => P("M" + x1 + " " + y1 + "L" + x2 + " " + y2, C.mut, 0.8);   // leader line
  const R = (x, y, w, h, c, f, r) => '<rect pathLength="1" class="ixDs" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r || 6) + '" stroke="' + c + '" stroke-width="1.8" fill="' + (f || "none") + '"/>';
  const O = (x, y, r, c, f) => '<circle pathLength="1" class="ixDs" cx="' + x + '" cy="' + y + '" r="' + r + '" stroke="' + c + '" stroke-width="1.8" fill="' + (f || "none") + '"/>';

  // rectus sheath: one cross-section row; ant/post list which layers pass in front of / behind the rectus
  function sheathRow(y0, ant, post, extra) {
    const col = { eo: C.eo, io: C.io, ta: C.ta };
    let s = R(56, y0 + 22, 92, 38, C.rect, C.pale, 14) + T(102, y0 + 45, "Rectus", "middle", "#92400e", 10);
    ant.forEach((k, i) => { const y = y0 + 16 - i * 5; s += P("M30 " + y + " L150 " + y + " Q168 " + y + " 176 " + (y0 + 34 + ["eo", "io", "ta"].indexOf(k) * 9), col[k], 1.8); });
    post.forEach((k, i) => { const y = y0 + 66 + i * 5; s += P("M30 " + y + " L150 " + y + " Q168 " + y + " 176 " + (y0 + 34 + ["eo", "io", "ta"].indexOf(k) * 9), col[k], 1.8); });
    ["eo", "io", "ta"].forEach((k, i) => { const y = y0 + 34 + i * 9; s += P("M176 " + y + " L250 " + y, col[k], 1.8) + P("M250 " + y + " L344 " + y, col[k], 6.5) + T(346, y + 3, k === "eo" ? "EO" : k === "io" ? "IO" : "TA", "end", "#fff", 7); });
    s += P("M30 " + (y0 + 82) + " L344 " + (y0 + 82), C.ft, 1.2, ' stroke-dasharray="4 3"') + T(340, y0 + 92, "fascia transversalis", "end", C.ft, 8);
    s += P("M30 " + (y0 + 6) + " L30 " + (y0 + 86), C.ink, 2.2);
    return s + (extra || "");
  }

  const D = {
    sheath: { title: "Rectus sheath at three levels", units: ["A:Anterior abdominal wall"], vb: "0 0 360 330",
      steps: [
        ["Draw the midline (linea alba) and the rectus as an oval beside it, three times: one row for each level.", T(30, 12, "linea alba", "middle", C.ink, 9) + R(56, 22, 92, 38, C.rect, C.pale, 14) + R(56, 132, 92, 38, C.rect, C.pale, 14) + R(56, 242, 92, 38, C.rect, C.pale, 14)],
        ["Above the costal margin: only the external oblique aponeurosis passes in front. Behind, there is no sheath: the rectus lies on costal cartilages 5–7.", sheathRow(0, ["eo"], []) + R(60, 66, 84, 8, "#a16207", "#d6d3d1", 3) + T(150, 76, "costal cartilages", "start", "#a16207", 8) + T(176, 8, "1 · above the costal margin", "start", C.ink, 10)],
        ["Middle part (costal margin to the arcuate line): the internal oblique aponeurosis SPLITS: one layer in front with the external oblique, one behind with the transversus.", sheathRow(110, ["eo", "io"], ["io", "ta"]) + T(176, 118, "2 · costal margin → arcuate line", "start", C.ink, 10)],
        ["Below the arcuate line: all three aponeuroses pass IN FRONT. Behind the rectus: only fascia transversalis.", sheathRow(220, ["eo", "io", "ta"], []) + T(176, 228, "3 · below the arcuate line", "start", C.ink, 10)],
        ["Label the key facts: the arcuate line is where the posterior wall ends; the inferior epigastric vessels enter the sheath there.", T(180, 318, "arcuate line: the posterior wall ends here", "middle", C.art, 9) + P("M102 302 L102 284", C.art, 1.4)],
      ] },
    inguinal: { title: "Inguinal canal and Hesselbach's triangle", units: ["A:Anterior abdominal wall", "A:Testis and spermatic cord"], vb: "0 0 360 250",
      steps: [
        ["Draw the inguinal ligament from the ASIS (up, lateral) to the pubic tubercle (down, medial).", P("M330 60 Q200 150 60 200", C.ink, 3) + T(334, 56, "ASIS", "end") + T(56, 214, "pubic tubercle", "start") + O(60, 200, 4, C.ink, C.ink)],
        ["Deep ring: an opening in fascia transversalis just above the midpoint of the ligament.", O(205, 108, 13, C.ft, "#e2e8f0") + T(222, 100, "deep ring (fascia transversalis)", "start", C.ft, 9)],
        ["Superficial ring: a triangular gap in the external oblique aponeurosis, above and lateral to the pubic tubercle.", P("M70 168 L96 160 L82 184 Z", C.eo, 2, ' fill="#ffe4e6"') + T(20, 152, "superficial ring", "start", C.eo, 9)],
        ["The canal (4 cm) runs obliquely between the rings, above the medial half of the ligament: the spermatic cord inside.", P("M196 116 Q140 142 90 170", C.rect, 9, ' stroke-opacity=".55"') + T(168, 154, "← canal (4 cm)", "start", "#92400e", 9)],
        ["Inferior epigastric artery: rises just MEDIAL to the deep ring. Add the lateral border of the rectus.", P("M188 150 Q186 110 176 40", C.art, 2.4) + T(170, 36, "inferior epigastric a.", "end", C.art, 9) + P("M120 20 Q118 110 104 170", C.rect, 2) + T(116, 16, "lateral border of rectus", "middle", "#92400e", 9)],
        ["Hesselbach's triangle (rectus border, artery, ligament): DIRECT hernias push through it, medial to the artery. INDIRECT hernias enter the deep ring, lateral to it.", P("M118 82 L180 104 L150 156 L106 168 Z", C.art, 1.2, ' fill="rgba(220,38,38,.12)"') + T(136, 128, "Hesselbach", "middle", C.art, 9) + T(250, 140, "indirect: lateral", "start", C.ink, 9) + T(40, 120, "direct: medial", "start", C.ink, 9)],
        ["Walls (MALT): roof Muscles (IO + TA arch), anterior Aponeurosis (EO), floor Ligament, posterior Transversalis (+ conjoint tendon).", T(180, 236, "M roof · A anterior · L floor · T posterior", "middle", C.ink, 10)],
      ] },
    portal: { title: "Portal vein: formation and tributaries", units: ["A:Vessels of gut", "A:Liver and biliary system"], vb: "0 0 360 260",
      steps: [
        ["Draw the liver at the top and the neck of the pancreas below it.", R(90, 10, 180, 46, "#92400e", "#fed7aa", 22) + T(180, 38, "LIVER", "middle", "#92400e", 11) + R(140, 160, 90, 22, "#ca8a04", "#fef08a", 10) + T(185, 175, "pancreas (neck)", "middle", "#854d0e", 8)],
        ["Superior mesenteric vein comes up from the midgut, behind the neck of the pancreas.", P("M190 250 L190 170", C.vein, 4) + T(184, 236, "superior mesenteric v.", "end", C.vein, 9)],
        ["Splenic vein comes from the left (spleen) behind the pancreas; the inferior mesenteric vein usually joins it.", P("M340 168 L192 168", C.vein, 4) + T(338, 160, "splenic v.", "end", C.vein, 9) + P("M290 250 L290 168", C.vein, 2.4) + T(296, 212, "inf. mes. v.", "start", C.vein, 8)],
        ["They join behind the neck at L1–L2: the PORTAL VEIN runs up, behind the 1st part of the duodenum, in the free edge of the lesser omentum, to the porta hepatis.", P("M190 168 L190 56", C.vein, 7) + T(198, 110, "PORTAL VEIN", "start", C.vein, 11) + T(198, 124, "free edge of lesser omentum", "start", C.mut, 8)],
        ["Direct tributaries: left gastric (oesophageal branches → varices), right gastric, cystic, para-umbilical veins.", P("M190 96 L110 80", C.vein, 2.4) + T(106, 76, "left gastric v.", "end", C.vein, 9) + P("M190 120 L120 128", C.vein, 2) + T(116, 132, "right gastric v.", "end", C.vein, 8) + P("M190 80 L240 72", C.vein, 2) + T(244, 70, "cystic v.", "start", C.vein, 8)],
        ["It divides into right and left branches at the porta hepatis. Remember: no valves, so pressure spreads backwards.", P("M190 56 L150 40 M190 56 L230 40", C.vein, 3) + T(180, 252, "no valves → portal hypertension spreads back", "middle", C.art, 9)],
      ] },
    portosys: { title: "Portosystemic anastomoses", units: ["A:Vessels of gut", "A:Liver and biliary system"], vb: "0 0 360 260",
      steps: [
        ["Two columns: PORTAL on the left, SYSTEMIC on the right. Each site is a bridge between them.", T(80, 18, "PORTAL", "middle", C.vein, 12) + T(280, 18, "SYSTEMIC", "middle", C.art, 12) + P("M80 28 L80 250", C.vein, 2) + P("M280 28 L280 250", C.art, 2)],
        ["Lower oesophagus: left gastric vein ↔ oesophageal veins → azygos. Dilated: OESOPHAGEAL VARICES (bleed).", P("M80 60 C140 46 220 74 280 60", C.duct, 3) + T(76, 56, "left gastric", "end", C.vein, 9) + T(284, 56, "azygos", "start", C.art, 9) + T(180, 48, "oesophagus → varices", "middle", C.ink, 9)],
        ["Umbilicus: para-umbilical veins ↔ superficial epigastric veins. Dilated: CAPUT MEDUSAE.", P("M80 110 C140 96 220 124 280 110", C.duct, 3) + T(76, 106, "para-umbilical", "end", C.vein, 9) + T(284, 106, "sup. epigastric", "start", C.art, 9) + T(180, 98, "umbilicus → caput medusae", "middle", C.ink, 9)],
        ["Anal canal: superior rectal vein ↔ middle and inferior rectal veins. Dilated: RECTAL VARICES / haemorrhoids.", P("M80 160 C140 146 220 174 280 160", C.duct, 3) + T(76, 156, "superior rectal", "end", C.vein, 9) + T(284, 156, "mid/inf rectal", "start", C.art, 9) + T(180, 148, "anal canal", "middle", C.ink, 9)],
        ["Retroperitoneum: colic veins ↔ lumbar/renal veins. Bare area of the liver: portal radicles ↔ phrenic veins.", P("M80 210 C140 196 220 224 280 210", C.duct, 3) + T(76, 206, "colic veins", "end", C.vein, 9) + T(284, 206, "lumbar/renal", "start", C.art, 9) + T(180, 198, "retroperitoneum · bare area", "middle", C.ink, 9)],
      ] },
    parietal: { title: "Parietal cell: how HCl is made", units: ["P:Stomach: acid secretion, motility, vomiting", "P:Saliva, swallowing and the oesophagus", "H:Oesophagus and stomach"], vb: "0 0 360 240",
      steps: [
        ["Draw the cell: the LUMEN (canaliculus) on the left, BLOOD on the right.", R(90, 30, 180, 180, C.ink, "#fff7ed", 30) + T(40, 120, "LUMEN", "middle", C.ink, 11) + T(320, 120, "BLOOD", "middle", C.art, 11)],
        ["Inside: carbonic anhydrase makes H+ and HCO3- from CO2 + H2O.", T(180, 112, "CO2 + H2O", "middle", C.ink, 11) + P("M180 118 L180 134", C.ink, 1.6) + T(196, 130, "carbonic anhydrase", "start", C.mut, 8) + T(180, 150, "H+  +  HCO3-", "middle", C.ink, 11)],
        ["H+ goes into the lumen through the H+/K+ ATPase (proton pump), swapped for K+. PPIs block this pump.", O(90, 80, 11, C.io, "#dbeafe") + T(90, 84, "ATP", "middle", C.io, 7) + P("M160 148 Q120 120 104 86", C.io, 1.6) + P("M78 80 L54 80", C.io, 2) + T(50, 76, "H+", "end", C.io, 10) + P("M54 92 L78 92", C.ta, 1.6) + T(50, 98, "K+", "end", C.ta, 10) + T(104, 66, "proton pump", "start", C.io, 8)],
        ["Cl- follows into the lumen through Cl- channels: H+ + Cl- = HCl.", O(90, 170, 9, C.ta, "#dcfce7") + P("M78 170 L54 170", C.ta, 2) + T(50, 174, "Cl-", "end", C.ta, 10) + T(46, 196, "HCl", "middle", C.eo, 12)],
        ["HCO3- leaves into the blood in exchange for Cl- (which then enters the cell): the ALKALINE TIDE after meals.", O(270, 150, 10, C.eo, "#ffe4e6") + P("M200 150 L258 150", C.eo, 1.6) + P("M282 146 L310 146", C.eo, 2) + T(314, 142, "HCO3-", "start", C.eo, 9) + P("M310 160 L282 160", C.ta, 1.6) + T(314, 168, "Cl-", "start", C.ta, 9) + T(270, 196, "alkaline tide", "middle", C.eo, 9)],
        ["Stimulants on the blood side: ACh (M3, vagus), gastrin, histamine (H2) — they potentiate each other.", T(180, 228, "ACh · gastrin · histamine (H2 blockers, PPIs)", "middle", C.ink, 9)],
      ] },
    nephron: { title: "Na+ along the nephron (and the diuretics)", units: ["P:Tubular transport: glucose, Na+, K+, clearance", "P:GFR, renal blood flow and its autoregulation", "H:Kidney and urinary passages", "P:Urine concentration, ADH and thirst"], vb: "0 0 360 270",
      steps: [
        ["Draw the nephron: glomerulus, proximal tubule, loop down into the medulla and back up, distal tubule, collecting duct.", O(40, 40, 16, C.art, "#fee2e2") + P("M56 40 C90 30 90 70 110 60 L120 60 L120 230 Q135 250 150 230 L150 80 C160 60 190 60 200 80 L240 80 L240 250", C.ink, 3) + P("M20 140 L340 140", C.mut, 0.8, ' stroke-dasharray="3 3"') + T(338, 136, "cortex", "end", C.mut, 8) + T(338, 152, "medulla", "end", C.mut, 8)],
        ["PCT: 65% of Na+ (Na+/H+, Na+-glucose): isosmotic; water follows.", T(84, 22, "PCT 65%", "middle", C.io, 10) + T(84, 34, "Na+/H+, SGLT", "middle", C.mut, 8)],
        ["Thick ascending limb: 25% by Na+-K+-2Cl- (NKCC2), water-tight → dilutes the fluid. Blocked by FUROSEMIDE.", T(158, 200, "TAL 25%", "start", C.eo, 10) + T(158, 212, "NKCC2 · furosemide", "start", C.mut, 8)],
        ["DCT: 5% by Na+-Cl- co-transporter. Blocked by THIAZIDES.", T(200, 104, "DCT 5%", "middle", C.ta, 10) + T(200, 116, "NCC · thiazides", "middle", C.mut, 8)],
        ["Collecting duct: ~3% by ENaC under ALDOSTERONE (K+ secreted). Blocked by amiloride / spironolactone. ADH adds aquaporin-2 for water.", T(248, 170, "CD ~3%", "start", "#7c3aed", 10) + T(248, 182, "ENaC · aldosterone", "start", C.mut, 8) + T(248, 194, "ADH → aquaporin-2", "start", C.mut, 8) + T(248, 206, "spironolactone", "start", C.mut, 8)],
      ] },
    lobule: { title: "Classic liver lobule", units: ["H:Liver, gall bladder and pancreas", "A:Liver and biliary system", "B:Liver biochemistry: detoxification, lipoproteins, fatty liver"], vb: "0 0 360 270",
      steps: [
        ["Draw a hexagon with the CENTRAL VEIN in the middle.", P("M180 25 L295 80 L295 190 L180 245 L65 190 L65 80 Z", C.ink, 2) + O(180, 135, 12, C.vein, "#dbeafe") + T(180, 139, "CV", "middle", C.vein, 9)],
        ["Portal triads at the corners: portal vein branch (blue), hepatic artery (red), bile ductule (green).", [[180, 25], [295, 190], [65, 190]].map(([x, y]) => O(x - 8, y, 5, C.vein, "#bfdbfe") + O(x + 6, y - 5, 3, C.art, "#fecaca") + O(x + 6, y + 6, 3, C.duct, "#bbf7d0")).join("") + T(200, 18, "portal triad", "start", C.ink, 9)],
        ["Plates of hepatocytes radiate from the central vein, with SINUSOIDS between them (Kupffer cells in their lining).", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = (i * Math.PI) / 6; return P("M" + (180 + 16 * Math.cos(a)) + " " + (135 + 16 * Math.sin(a)) + " L" + (180 + 100 * Math.cos(a)) + " " + (135 + 92 * Math.sin(a)), "#d97706", 1.2); }).join("") + T(250, 128, "plates + sinusoids", "start", "#92400e", 8)],
        ["Blood flows INWARD (triad → sinusoid → central vein); bile flows OUTWARD in canaliculi to the bile ductule.", P("M100 175 L150 150", C.art, 1.6, ' marker-end="url(#ixDa)"') + T(96, 180, "blood in", "end", C.art, 8) + P("M215 110 L268 82", C.duct, 1.6, ' marker-end="url(#ixDg)"') + T(270, 76, "bile out", "start", C.duct, 8)],
        ["Zones (acinus): zone 1 near the triad (most oxygen), zone 3 near the central vein (least oxygen: dies first in shock).", T(180, 262, "zone 1 periportal · zone 3 centrilobular (hypoxia first)", "middle", C.ink, 9)],
      ] },
    villus: { title: "Intestinal villus and crypt", units: ["H:Small and large intestine, appendix", "P:Intestinal motility, absorption, defecation", "B:Liver biochemistry: detoxification, lipoproteins, fatty liver"], vb: "0 0 360 270",
      steps: [
        ["Draw a finger-shaped villus standing on the mucosa, a crypt dipping down beside it, the muscularis mucosae below.", P("M120 200 L120 60 Q150 20 180 60 L180 200", C.ink, 2.4) + P("M180 200 L200 200 L200 250 Q212 262 224 250 L224 200 L320 200", C.ink, 2.4) + P("M40 200 L120 200", C.ink, 2.4) + P("M30 262 L330 262", "#9333ea", 2.2) + T(34, 256, "muscularis mucosae", "start", "#9333ea", 8)],
        ["Line it with tall ENTEROCYTES (brush border) and scattered GOBLET cells.", [70, 100, 130, 160].map((y) => R(108, y, 10, 14, C.ink, "#fff7ed", 2) + R(182, y, 10, 14, C.ink, "#fff7ed", 2)).join("") + O(113, 145, 5, C.io, "#dbeafe") + O(187, 115, 5, C.io, "#dbeafe") + T(100, 120, "enterocytes", "end", C.ink, 9) + T(196, 148, "goblet cell", "start", C.io, 9)],
        ["In the core: a central LACTEAL (lymph, takes fat as chylomicrons) and a capillary loop (sugars, amino acids → portal vein).", P("M150 195 L150 70", "#ca8a04", 4) + T(156, 92, "lacteal", "start", "#a16207", 9) + P("M138 195 L138 60 Q150 46 162 60 L162 195", C.art, 1.4) + T(164, 180, "capillaries", "start", C.art, 8)],
        ["At the crypt base: PANETH cells (red granules, lysozyme) and STEM cells that renew the lining every 3–5 days.", O(205, 246, 4, C.eo, "#fecaca") + O(219, 246, 4, C.eo, "#fecaca") + T(232, 240, "Paneth cells", "start", C.eo, 9) + T(232, 252, "stem cells above them", "start", C.mut, 8)],
        ["Area ×600: plicae ×3 · villi ×10 · microvilli ×20. Duodenum adds Brunner's glands; ileum adds Peyer's patches.", T(180, 20, "plicae × villi × microvilli = ×600", "middle", C.ink, 10)],
      ] },
  };
  const DEFS = '<defs><marker id="ixDa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + C.art + '"/></marker><marker id="ixDg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + C.duct + '"/></marker></defs>';

  let root = null;
  function shell() {
    if (root) return;
    root = document.createElement("div"); root.className = "ixD"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Draw it with me");
    document.body.appendChild(root);
  }
  function close() { if (root) root.classList.remove("on"); document.documentElement.classList.remove("ixDon"); }
  function open(id, at) {
    const d = D[id]; if (!d) return list();
    shell(); root.classList.add("on"); document.documentElement.classList.add("ixDon");
    let i = Math.max(0, Math.min(d.steps.length - 1, at || 0));
    const show = () => {
      const last = i === d.steps.length - 1;
      root.innerHTML = '<div class="ixDin"><div class="ixDtop"><button type="button" class="ixDx" data-d="close" aria-label="Close">✕</button><div><small>Draw it with me · step ' + (i + 1) + " of " + d.steps.length + "</small><b>" + E(d.title) + "</b></div></div>" +
        '<div class="ixDprog">' + d.steps.map((_, j) => '<i class="' + (j < i ? "d" : j === i ? "c" : "") + '"></i>').join("") + "</div>" +
        '<div class="ixDcard"><svg viewBox="' + d.vb + '" role="img" aria-label="' + E(d.title) + '">' + DEFS + d.steps.slice(0, i + 1).map((s, j) => '<g class="' + (j === i ? "ixDnew" : "ixDold") + '">' + s[1] + "</g>").join("") + "</svg></div>" +
        '<p class="ixDsay">' + E(d.steps[i][0]) + "</p>" +
        '<div class="ixDnav">' + (i ? '<button type="button" data-d="back">← Back</button>' : '<button type="button" data-d="close">Later</button>') + (last ? '<button type="button" class="ixDmain" data-d="photo">📷 Now I drew it: grade my photo</button>' : '<button type="button" class="ixDmain" data-d="next">Next step →</button>') + "</div>" +
        (last ? '<input type="file" accept="image/*" capture="environment" hidden id="ixDfile"><p class="ixDsmall">Close the app, draw it on paper from memory with the labels, then photograph it. The professor checks each label and what is missing.</p>' : "") + "</div>";
      root.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => {
        const a = b.dataset.d;
        if (a === "close") close(); else if (a === "next") { i++; show(); } else if (a === "back") { i--; show(); }
        else if (a === "photo") root.querySelector("#ixDfile").click();
      }));
      const f = root.querySelector("#ixDfile");
      if (f) f.onchange = () => {
        const file = f.files && f.files[0]; if (!file || !window.IX_TUTOR) return;
        const rd = new FileReader();
        rd.onload = () => { close(); const ctx = "EXAM DRAWING: " + d.title + "\nWHAT IT MUST SHOW, STEP BY STEP:\n" + d.steps.map((s, j) => j + 1 + ". " + s[0]).join("\n"); window.IX_SCREEN_OVERRIDE = { title: "Drawing · " + d.title, eyebrow: "DIG-206", body: ctx }; IX_TUTOR.open(); IX_TUTOR.ask("Grade my drawing of \"" + d.title + "\" like a Kasr Al Ainy examiner: which labels are right, which are missing or wrong, is the layout correct, and a mark out of 10.", "picture", ctx, { images: [rd.result] }); };
        rd.readAsDataURL(file);
      };
    };
    show();
  }
  function forUnit(u) { return Object.keys(D).filter((k) => D[k].units.indexOf(u) >= 0); }
  function list() {
    shell(); root.classList.add("on"); document.documentElement.classList.add("ixDon");
    root.innerHTML = '<div class="ixDin"><div class="ixDtop"><button type="button" class="ixDx" data-d="close" aria-label="Close">✕</button><div><small>The diagrams the exam asks you to draw</small><b>✏️ Exam drawings</b></div></div><div class="ixDlist">' +
      Object.keys(D).map((k) => '<button type="button" data-open="' + k + '"><b>' + E(D[k].title) + "</b><small>" + D[k].steps.length + " steps · " + E(D[k].units.map((u) => u.replace(/^[A-Z]:/, "")).join(" · ")) + "</small></button>").join("") + "</div></div>";
    root.querySelector("[data-d=close]").onclick = close;
    root.querySelectorAll("[data-open]").forEach((b) => (b.onclick = () => open(b.dataset.open)));
    return Object.keys(D).length;
  }
  const btn = (u) => forUnit(u).map((k) => '<button type="button" class="ixDbtn" data-draw="' + k + '">✏️ Draw it with me: ' + E(D[k].title) + "</button>").join("");
  document.addEventListener("click", (e) => { const b = e.target.closest && e.target.closest("[data-draw], [data-drawlist]"); if (!b) return; e.preventDefault(); e.stopPropagation(); if (b.hasAttribute("data-drawlist")) list(); else open(b.dataset.draw); }, true);
  window.IX_DRAW = { open, close, list, forUnit, btn, ids: () => Object.keys(D), get: (id) => D[id] };
})();
