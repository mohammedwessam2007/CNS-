/* INTELLECTUALITY v17 · CNS atlas: the eye. Visual pathway with a field-defect simulator, the pupillary
 * light reflex with a torch you can move, and eye movements with III / IV / VI palsies.
 * Visual pathway and light reflex are seen FROM ABOVE (nose up), so the patient's LEFT is on the
 * viewer's LEFT. Eye movements are seen FACING the patient, so the patient's RIGHT eye is on the left.
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { E } = A;
  const { T, pf, ps, fl, box, leg } = A.kit;
  const BLUE = "#4cc9f0", ORANGE = "#ff9f43";

  /* ───────── visual fields: what each eye still sees ───────── */
  // lost: { L: [...quadrants], R: [...] } with quadrants "ts","ti","ns","ni"; spare = macula kept
  function fields(lost, spare) {
    const eye = (cx, side) => {
      // temporal = the outer half: left for the left eye, right for the right eye
      const tx = side === "L" ? -1 : 1,
        r = 34,
        seg = (h, v) => {
          const x = cx + h * r,
            y = 46 + v * r;
          return "M" + cx + " 46 L" + cx + " " + (46 + v * r) + " A" + r + " " + r + " 0 0 " + (h * v > 0 ? 0 : 1) + " " + x + " 46 Z";
        };
      const parts = { ts: seg(tx, -1), ti: seg(tx, 1), ns: seg(-tx, -1), ni: seg(-tx, 1) };
      const L = lost[side] || [];
      return (
        Object.entries(parts).map(([k, d]) => '<path d="' + d + '" fill="' + (L.includes(k) ? "#05080d" : "#f2f6fb") + '" stroke="#5a7390" stroke-width=".8"/>').join("") +
        (spare && L.length ? '<circle cx="' + cx + '" cy="46" r="7" fill="#f2f6fb" stroke="#5ef0a0" stroke-width="1.2"/>' : "") +
        '<circle cx="' + cx + '" cy="46" r="1.6" fill="#ff5d7a"/>' +
        '<text x="' + cx + '" y="94" text-anchor="middle" font-size="8.5" font-weight="900" fill="#9fb4cc">' + (side === "L" ? "LEFT EYE" : "RIGHT EYE") + "</text>" +
        '<text x="' + (cx + tx * 24) + '" y="50" text-anchor="middle" font-size="9" font-weight="900" fill="#8aa2bd" opacity=".75">T</text><text x="' + (cx - tx * 24) + '" y="50" text-anchor="middle" font-size="9" font-weight="900" fill="#8aa2bd" opacity=".75">N</text>'
      );
    };
    return '<div class="ixABox"><h5>What the patient sees (black = blind)</h5><svg viewBox="0 0 200 100" role="img" aria-label="Visual fields">' + eye(52, "L") + eye(148, "R") + "</svg></div>";
  }

  /* ═══════════════ VISUAL PATHWAY ═══════════════ */
  (function () {
    const eL = [150, 74],
      eR = [330, 74],
      r = 36;
    const arc = (c, a0, a1, rr) => {
      const p = (a) => [c[0] + rr * Math.cos((a * Math.PI) / 180), c[1] + rr * Math.sin((a * Math.PI) / 180)];
      const [x0, y0] = p(a0),
        [x1, y1] = p(a1);
      return "M" + x0.toFixed(1) + " " + y0.toFixed(1) + " A" + rr + " " + rr + " 0 0 1 " + x1.toFixed(1) + " " + y1.toFixed(1);
    };
    // fibre routes (patient's left on the viewer's left). Blue = LEFT visual field, orange = RIGHT field.
    const P = {
      // left eye: temporal retina (lateral, viewer-left) sees the RIGHT field → orange, stays left
      lT: "M126.7 97.3 Q136 107 147 111 C157 129 187 151 223 174 L221 184 C199 204 177 226 161 244",
      // left eye: nasal retina (medial) sees the LEFT field → blue, crosses
      lN: "M173.3 97.3 Q163 107 153 110 C163 128 193 150 229 171 L255 185 C277 205 299 227 315 245",
      // right eye: nasal retina (medial, viewer-left side of that eye) sees the RIGHT field → orange, crosses
      rN: "M306.7 97.3 Q317 107 327 110 C317 128 287 150 251 171 L225 185 C203 205 181 227 165 245",
      // right eye: temporal retina (lateral) sees the LEFT field → blue, stays right
      rT: "M353.3 97.3 Q344 107 333 111 C323 129 293 151 257 174 L259 184 C281 204 303 226 319 244",
    };
    const rad = {
      // from each LGN: upper (parietal) fibres straight back; lower fibres loop forward (Meyer's loop) into the temporal lobe
      parL: "M156 258 C160 300 174 340 196 382",
      meyL: "M150 262 C112 258 96 244 100 272 C104 314 150 360 186 396",
      parR: "M324 258 C320 300 306 340 284 382",
      meyR: "M330 262 C368 258 384 244 380 272 C376 314 330 360 294 396",
    };
    const lobe = (x, flip) => {
      const k = flip ? -1 : 1;
      return "M" + (x - 34 * k) + " 368 C" + (x - 40 * k) + " 392 " + (x - 20 * k) + " 418 " + (x + 4 * k) + " 420 C" + (x + 30 * k) + " 420 " + (x + 38 * k) + " 404 " + (x + 36 * k) + " 384 C" + (x + 34 * k) + " 370 " + (x + 20 * k) + " 362 " + x + " 360 C" + (x - 14 * k) + " 358 " + (x - 30 * k) + " 360 " + (x - 34 * k) + " 368Z";
    };
    const X = (id, x, y, n) => '<g class="ov" data-x="' + id + '"><circle cx="' + x + '" cy="' + y + '" r="11" fill="#ff5d7a" stroke="#fff" stroke-width="1.6"/><path d="M' + (x - 5) + " " + (y - 5) + " L" + (x + 5) + " " + (y + 5) + " M" + (x + 5) + " " + (y - 5) + " L" + (x - 5) + " " + (y + 5) + '" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>' + (n ? "" : "");
    const eye = (c, id) =>
      '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + r + '" fill="#f4f7fb" stroke="#9fb3cb" stroke-width="1.2"/>' +
      '<ellipse cx="' + c[0] + '" cy="' + (c[1] - r + 7) + '" rx="15" ry="6" fill="#bfe6ff" stroke="#7fb3d9"/>' +
      '<circle cx="' + c[0] + '" cy="' + (c[1] - r + 1) + '" r="5" fill="#0b1726"/>' +
      '<ellipse cx="' + c[0] + '" cy="' + (c[1] - 14) + '" rx="10" ry="5" fill="#dfe9f5" stroke="#9fb3cb" stroke-width=".7"/>' +
      '<circle cx="' + c[0] + '" cy="' + (c[1] + r - 7) + '" r="3" fill="#ffd166" opacity=".9"/>';
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">SEEN FROM ABOVE · NOSE UP</text>' +
      '<text class="ttl" x="14" y="200">LEFT</text><text class="ttl" x="466" y="200" text-anchor="end">RIGHT</text>' +
      // the two hemispheres, faint, for orientation (frontal up, occipital down)
      '<path d="M236 128 C180 120 96 150 78 236 C64 310 104 400 166 428 C196 440 226 436 236 424 Z" fill="#ffffff07" stroke="#ffffff1c" stroke-width="1.2" pointer-events="none"/>' +
      '<path d="M244 128 C300 120 384 150 402 236 C416 310 376 400 314 428 C284 440 254 436 244 424 Z" fill="#ffffff07" stroke="#ffffff1c" stroke-width="1.2" pointer-events="none"/>' +
      T(92, 350, "temporal lobe", "sm mut", "start") + T(388, 350, "temporal lobe", "sm mut", "end") +
      eye(eL) + eye(eR) +
      // retinae: nasal and temporal halves, coloured by the half-field they see
      ps("retT.L", arc(eL, 90, 180, r - 3), ORANGE, "#e2a36a", 5) +
      ps("retN.L", arc(eL, 0, 90, r - 3), BLUE, "#6fb7d6", 5) +
      ps("retN.R", arc(eR, 90, 180, r - 3), ORANGE, "#e2a36a", 5) +
      ps("retT.R", arc(eR, 0, 90, r - 3), BLUE, "#6fb7d6", 5) +
      // nerves → chiasm → tracts (the fibres themselves)
      ps("on.L", "M150 110 C160 128 190 150 226 172", "#d9ff43", "#8aa2bd", 9) +
      ps("on.R", "M330 110 C320 128 290 150 254 172", "#d9ff43", "#8aa2bd", 9) +
      '<ellipse class="pf" data-p="ch" cx="240" cy="178" rx="24" ry="9" style="--c:#d9ff43;--r:#8aa2bd"/>' +
      ps("ot.L", "M222 184 C200 204 178 226 162 244", "#d9ff43", "#8aa2bd", 9) +
      ps("ot.R", "M258 184 C280 204 302 226 318 244", "#d9ff43", "#8aa2bd", 9) +
      '<path d="' + P.lT + '" stroke="' + ORANGE + '" stroke-width="2" fill="none" opacity=".9" pointer-events="none"/>' +
      '<path d="' + P.rN + '" stroke="' + ORANGE + '" stroke-width="2" fill="none" opacity=".9" pointer-events="none"/>' +
      '<path d="' + P.lN + '" stroke="' + BLUE + '" stroke-width="2" fill="none" opacity=".9" pointer-events="none"/>' +
      '<path d="' + P.rT + '" stroke="' + BLUE + '" stroke-width="2" fill="none" opacity=".9" pointer-events="none"/>' +
      // pretectal branch (light reflex): leaves the tract before the LGN
      ps("pre.L", "M184 222 C200 232 212 240 222 250", "#ffd166", "#6d819a", 2.2, ' stroke-dasharray="3 3"') +
      ps("pre.R", "M296 222 C280 232 268 240 258 250", "#ffd166", "#6d819a", 2.2, ' stroke-dasharray="3 3"') +
      '<circle cx="226" cy="254" r="5" fill="#2b4058" stroke="#6d819a"/><circle cx="254" cy="254" r="5" fill="#2b4058" stroke="#6d819a"/>' +
      '<ellipse class="pf" data-p="lgn.L" cx="156" cy="254" rx="15" ry="10" style="--c:#d9ff43;--r:#c6b3c9"/>' +
      '<ellipse class="pf" data-p="lgn.R" cx="324" cy="254" rx="15" ry="10" style="--c:#d9ff43;--r:#c6b3c9"/>' +
      // radiations
      ps("par.L", rad.parL, ORANGE, "#b88457", 5) + ps("mey.L", rad.meyL, ORANGE, "#b88457", 5) +
      ps("par.R", rad.parR, BLUE, "#4f8fab", 5) + ps("mey.R", rad.meyR, BLUE, "#4f8fab", 5) +
      // occipital lobes with the calcarine sulcus
      '<path class="pf" data-p="v1.L" d="' + lobe(194, false) + '" style="--c:#ffe8a3;--r:#e7dde8"/>' +
      '<path class="pf" data-p="v1.R" d="' + lobe(286, true) + '" style="--c:#ffe8a3;--r:#e7dde8"/>' +
      '<path d="M166 390 C184 386 200 388 222 392" stroke="#7d5c78" stroke-width="1.6" fill="none" pointer-events="none"/><path d="M314 390 C296 386 280 388 258 392" stroke="#7d5c78" stroke-width="1.6" fill="none" pointer-events="none"/>' +
      '<circle cx="200" cy="418" r="4" fill="#ffd166" pointer-events="none"/><circle cx="280" cy="418" r="4" fill="#ffd166" pointer-events="none"/>' +
      // labels
      T(82, 70, "left eye", "sm", "end") + T(398, 70, "right eye", "sm", "start") +
      T(114, 136, "optic nerve", "sm", "end") + T(240, 162, "chiasma", "sm") + T(152, 214, "optic tract", "sm", "end") +
      T(134, 256, "LGB", "sm", "end") + T(240, 272, "pretectal n. (light reflex)", "sm") + T(92, 302, "Meyer's loop", "sm", "end") + T(222, 330, "parietal fibres", "sm", "start") +
      T(240, 436, "V1 · calcarine cortex · macula at the pole ●", "sm") +
      // lesion markers
      X("x1", 172, 132) + X("x2", 240, 178) + X("x3", 302, 222) + X("x4", 384, 262) + X("x5", 306, 316) + X("x6", 286, 396) + X("x7", 222, 180) +
      // moving signal (blue = left field, orange = right field)
      fl("flow", P.lN, BLUE, 2.8) + fl("flow", P.rT, BLUE, 2.8) + fl("flow", P.lT, ORANGE, 2.8) + fl("flow", P.rN, ORANGE, 2.8);
    const S = (id, label, x, lostL, lostR, spare, info, extra) => ({ id, label, show: [x], lost: extra, info, res: () => '<div class="ixARes2">' + fields({ L: lostL, R: lostR }, spare) + "</div>" });
    const all = ["ts", "ti", "ns", "ni"],
      T2 = ["ts", "ti"],
      N2 = ["ns", "ni"];
    A.scene("vision", {
      title: "Visual pathway · lesion → field defect",
      vb: "0 0 480 446",
      svg,
      intro: "**Blue** fibres carry the **left** half of the visual field, **orange** the **right** half. Nasal fibres cross at the chiasma. Pick a lesion and see the patient's fields.",
      parts: {
        retN: ["Nasal retina", "Sees the **temporal** field. Its fibres **cross** at the chiasma."],
        retT: ["Temporal retina", "Sees the **nasal** field. Its fibres stay on the **same** side."],
        on: ["Optic nerve", "All the fibres of one eye. Cut → **total blindness of that eye** (temporal and nasal fields)."],
        ch: ["Optic chiasma", "Only the **nasal** fibres cross here. A central lesion (e.g. a **pituitary tumour**) → **bitemporal hemianopia**."],
        ot: ["Optic tract", "Carries the **opposite** half-field from **both** eyes. **Right** tract cut → **left homonymous hemianopia**. Some fibres leave for the **pretectal nucleus** (light reflex)."],
        lgn: ["Lateral geniculate body", "Thalamic relay to the cortex. **Not** part of the light reflex."],
        mey: ["Meyer's loop (lower optic radiation)", "Swings forward into the **temporal** lobe; carries the **upper** quadrant of the opposite field. Temporal lesion → **superior quadrantanopia** ('pie in the sky')."],
        par: ["Upper (parietal) optic radiation", "Carries the **lower** quadrant of the opposite field. The radiation passes through the **retrolenticular** part of the internal capsule."],
        v1: ["Primary visual cortex (area 17)", "Calcarine sulcus, **posterior cerebral artery** territory. Occlusion → opposite homonymous hemianopia **with macular sparing**."],
        pre: ["To the pretectal nucleus", "Light-reflex fibres leave the tract **before** the LGB → pretectal nucleus → both Edinger–Westphal nuclei."],
      },
      drill: ["on", "ch", "ot", "lgn", "mey", "par", "v1", "retN", "retT"],
      sims: [
        { id: "flow", label: "▶ Fibres", show: ["flow"], info: "Light from the **left** half of the world lands on the **left eye's nasal** retina and the **right eye's temporal** retina. Both end in the **right** occipital cortex. Each hemisphere sees the **opposite** half of the world.", res: () => '<div class="ixARes">' + leg([[BLUE, "left visual field"], [ORANGE, "right visual field"]]) + "</div>" },
        S("nerve", "① Optic nerve", "x1", all, [], false, "**Left optic nerve** cut → the **left eye is blind**: its temporal and nasal fields. The right eye is normal."),
        S("chiasm", "② Chiasma", "x2", T2, T2, false, "**Central chiasma** (pituitary tumour) cuts the **crossing nasal** fibres → **bitemporal hemianopia**: the temporal field of both eyes is lost."),
        S("tract", "③ Optic tract", "x3", T2, N2, false, "**Right optic tract** → **left homonymous hemianopia**: the **left** field of both eyes (left eye's **temporal**, right eye's **nasal** field)."),
        S("meyer", "④ Meyer's loop", "x4", ["ts"], ["ns"], false, "**Right temporal lobe** (Meyer's loop) → **left superior quadrantanopia**, 'pie in the sky'."),
        S("parietal", "⑤ Parietal radiation", "x5", ["ti"], ["ni"], false, "**Right parietal** radiation → **left inferior quadrantanopia**."),
        S("cortex", "⑥ Visual cortex", "x6", T2, N2, true, "**Right visual cortex** (posterior cerebral artery occlusion) → **left homonymous hemianopia with macular sparing**: the pole also gets MCA blood."),
        S("lat", "⑦ Side of chiasma", "x7", N2, [], false, "Pressure on the **left side** of the chiasma (e.g. an internal carotid aneurysm) hits the **uncrossed temporal** fibres of the left eye → **left nasal hemianopia**."),
      ],
      secs: { "ph-color-vision#1": "flow", "an-brain-blood#4": "cortex" },
      rules: [
        [/bitemporal|pituitary|chiasm/i, "chiasm"],
        [/homonymous.*macul|macul.*spar|calcarine|visual cortex|occipital/i, "cortex"],
        [/optic tract|homonymous/i, "tract"],
        [/quadrant|meyer|temporal lobe/i, "meyer"],
        [/optic nerve|blind(ness)? (of|in) (the )?(left|right|one) eye/i, "nerve"],
      ],
    });
  })();

  /* ═══════════════ PUPILLARY LIGHT REFLEX ═══════════════ */
  (function () {
    const aff = { L: "M150 100 C156 130 206 150 236 162", R: "M330 100 C324 130 274 150 244 162" };
    const tr = { L: "M236 168 C230 186 224 204 222 219", R: "M244 168 C250 186 256 204 258 219" };
    const cross = "M226 230 C240 236 246 244 256 254 M254 230 C240 236 234 244 224 254";
    const same = "M222 233 L224 252 M258 233 L256 252";
    const eff = { L: "M222 262 C200 250 160 200 128 150 C120 130 126 116 138 104", R: "M258 262 C280 250 320 200 352 150 C360 130 354 116 342 104" };
    const eye = (x, id) =>
      '<g><circle cx="' + x + '" cy="70" r="30" fill="#f4f7fb" stroke="#9fb3cb" stroke-width="1.2"/><circle cx="' + x + '" cy="70" r="17" fill="#5b8fb9"/><circle class="pup" data-pup="' + id + '" cx="' + x + '" cy="70" r="9" fill="#05080d" style="transition:r .45s"/><circle cx="' + (x - 5) + '" cy="64" r="2.4" fill="#fff" opacity=".85"/></g>';
    const torch = (id, x) => '<g class="ov" data-x="torch' + id + '"><path d="M' + x + " 6 L" + (x - 16) + " 36 L" + (x + 16) + ' 36Z" fill="#fff6b0" opacity=".55"/><rect x="' + (x - 6) + '" y="-6" width="12" height="14" rx="3" fill="#ffd166"/></g>';
    const svg = () =>
      '<text class="ttl" x="12" y="302">SEEN FROM ABOVE</text>' +
      '<text class="ttl" x="14" y="160">LEFT</text><text class="ttl" x="466" y="160" text-anchor="end">RIGHT</text>' +
      torch("L", 150) + torch("R", 330) + eye(150, "L") + eye(330, "R") +
      ps("aff.L", aff.L, "#66e9ff", "#6f8aa8", 3.4) + ps("aff.R", aff.R, "#66e9ff", "#6f8aa8", 3.4) +
      '<ellipse class="pf" data-p="ch" cx="240" cy="165" rx="11" ry="5" style="--c:#66e9ff;--r:#8aa2bd"/>' +
      ps("tr.L", tr.L, "#66e9ff", "#6f8aa8", 3) + ps("tr.R", tr.R, "#66e9ff", "#6f8aa8", 3) +
      '<circle class="pf" data-p="pt.L" cx="222" cy="226" r="7" style="--c:#66e9ff;--r:#9fb0c7"/><circle class="pf" data-p="pt.R" cx="258" cy="226" r="7" style="--c:#66e9ff;--r:#9fb0c7"/>' +
      ps("pc", cross, "#66e9ff", "#6f8aa8", 2) + '<path d="' + same + '" stroke="#6f8aa8" stroke-width="2" fill="none" pointer-events="none"/>' +
      '<circle class="pf" data-p="ew.L" cx="224" cy="260" r="8" style="--c:#ff5d8f;--r:#c9a3b8"/><circle class="pf" data-p="ew.R" cx="256" cy="260" r="8" style="--c:#ff5d8f;--r:#c9a3b8"/>' +
      ps("cn3.L", eff.L, "#ff5d8f", "#a6758e", 3.4) + ps("cn3.R", eff.R, "#ff5d8f", "#a6758e", 3.4) +
      '<circle class="pf" data-p="cg.L" cx="128" cy="150" r="7" style="--c:#ff5d8f;--r:#e2c9d6"/><circle class="pf" data-p="cg.R" cx="352" cy="150" r="7" style="--c:#ff5d8f;--r:#e2c9d6"/>' +
      '<path d="M160 268 L320 268 L320 300 C300 312 180 312 160 300Z" fill="#132338" stroke="#2c4561" pointer-events="none"/>' +
      T(240, 292, "MIDBRAIN (level of superior colliculus)", "sm mut") +
      T(272, 229, "pretectal", "sm", "start") + T(212, 264, "EW", "sm", "end") + T(116, 154, "ciliary g.", "sm", "end") + T(200, 128, "II", "sm") + T(150, 196, "III", "sm") + T(262, 160, "chiasma", "sm", "start") +
      fl("faL", aff.L + " " + tr.L.replace("M236 168", "L236 168") , "#66e9ff", 3) + fl("faL", "M240 164 " + tr.R.replace("M244 168", "L244 168"), "#66e9ff", 3) +
      fl("faR", aff.R + " " + tr.R.replace("M244 168", "L244 168"), "#66e9ff", 3) + fl("faR", "M240 164 " + tr.L.replace("M236 168", "L236 168"), "#66e9ff", 3) +
      fl("fc", cross, "#66e9ff", 2.6) + fl("fc", same, "#66e9ff", 2.6) + fl("feL", eff.L, "#ff5d8f", 3) + fl("feR", eff.R, "#ff5d8f", 3) +
      '<g class="ov" data-x="xON"><circle cx="176" cy="136" r="10" fill="#ff5d7a"/><path d="M171 131 l10 10 m0 -10 l-10 10" stroke="#fff" stroke-width="2.2"/></g>' +
      '<g class="ov" data-x="xIII"><circle cx="176" cy="206" r="10" fill="#ff5d7a"/><path d="M171 201 l10 10 m0 -10 l-10 10" stroke="#fff" stroke-width="2.2"/></g>' +
      '<g class="ov" data-x="xPT"><rect x="208" y="214" width="64" height="24" rx="8" fill="#ff5d7a55" stroke="#ff5d7a" stroke-width="2"/></g>';
    // which pupils constrict: [lightLeft → [L, R], lightRight → [L, R]]
    const R_ = {
      normal: [[1, 1], [1, 1]],
      afferent: [[0, 0], [1, 1]],
      efferent: [[0, 1], [0, 1]],
      argyll: [[0, 0], [0, 0]],
    };
    const grid = (sim) => {
      const g = R_[sim] || R_.normal,
        p = (on, x, y) => '<circle cx="' + x + '" cy="' + y + '" r="13" fill="#5b8fb9"/><circle cx="' + x + '" cy="' + y + '" r="' + (on ? 4 : 9.5) + '" fill="#05080d"/>';
      return (
        '<div class="ixABox"><h5>Torch test (left pupil · right pupil)</h5><svg viewBox="0 0 200 92" role="img" aria-label="Pupils">' +
        '<text x="4" y="30" font-size="8" font-weight="900" fill="#ffd166">light LEFT</text>' + p(g[0][0], 100, 26) + p(g[0][1], 150, 26) +
        '<text x="4" y="72" font-size="8" font-weight="900" fill="#ffd166">light RIGHT</text>' + p(g[1][0], 100, 68) + p(g[1][1], 150, 68) +
        "</svg></div>"
      );
    };
    const live = (card, sim) => {
      const s = sim ? sim.id : "",
        eyeLit = card.dataset.eye || "L",
        g = (R_[s] || R_.normal)[eyeLit === "L" ? 0 : 1];
      card.querySelectorAll(".pup").forEach((c) => c.setAttribute("r", g[c.dataset.pup === "L" ? 0 : 1] ? 4 : 9.5));
      card.querySelectorAll('[data-x="torchL"],[data-x="torchR"]').forEach((t) => t.classList.toggle("ixShow", t.dataset.x === "torch" + eyeLit));
      const blockA = s === "afferent" && eyeLit === "L",
        want = { ["fa" + eyeLit]: !blockA, fc: !blockA && s !== "argyll", feL: !blockA && s !== "argyll" && s !== "efferent", feR: !blockA && s !== "argyll" };
      card.querySelectorAll('[data-x="faL"],[data-x="faR"],[data-x="fc"],[data-x="feL"],[data-x="feR"]').forEach((t) => t.classList.toggle("ixShow", !!want[t.dataset.x]));
      const info = card.querySelector(".ixAInfo");
      if (!info.querySelector(".ixARow"))
        info.insertAdjacentHTML("afterbegin", '<div class="ixARow"><button type="button" class="ixAAct' + (eyeLit === "L" ? " on" : "") + '" data-ixa-act="L">🔦 Light in LEFT eye</button><button type="button" class="ixAAct' + (eyeLit === "R" ? " on" : "") + '" data-ixa-act="R">🔦 Light in RIGHT eye</button></div>');
    };
    A.scene("pupil", {
      title: "Pupillary light reflex · move the torch",
      vb: "0 -8 480 320",
      svg,
      intro: "Retina → optic nerve → tract → **pretectal nucleus** (not the LGB) → **both** Edinger–Westphal nuclei → **III** → **ciliary ganglion** → sphincter pupillae. Light in one eye constricts **both** pupils.",
      parts: {
        aff: ["Afferent limb: optic nerve (II)", "Carries the light signal back from the retina."],
        ch: ["Optic chiasma", "Half the fibres cross, so each optic tract carries both eyes."],
        tr: ["Optic tract → pretectal nucleus", "Light-reflex fibres leave the tract **before** the lateral geniculate body."],
        pt: ["Pretectal nucleus", "**The centre of the light reflex.** Each one sends fibres to **both** Edinger–Westphal nuclei (via the posterior commissure), so the reflex is **direct + consensual**. Damage here (neurosyphilis) → **Argyll Robertson pupil**."],
        pc: ["Crossing through the posterior commissure", "Why light in one eye constricts the **other** pupil too (consensual reflex)."],
        ew: ["Edinger–Westphal nucleus", "Parasympathetic part of the III nucleus. Needed for **both** the light and the near reflex."],
        cn3: ["Oculomotor nerve (III)", "Efferent limb: preganglionic parasympathetic fibres to the **ciliary ganglion**."],
        cg: ["Ciliary ganglion", "Postganglionic fibres (short ciliary nerves) → **sphincter pupillae** (and ciliary muscle)."],
      },
      drill: ["pt", "ew", "cg", "cn3", "aff", "ch"],
      sims: [
        { id: "normal", label: "Normal", info: "Light in either eye → **both** pupils constrict (direct + consensual).", res: () => '<div class="ixARes2">' + grid("normal") + box("Clinical uses", ["**Brain death** and the depth of **coma**.", "**Stages (depth) of anaesthesia**.", "Integrity of the **oculomotor** nerve."]) + "</div>" },
        { id: "afferent", label: "✂ Left optic nerve", show: ["xON"], info: "**Afferent** defect (left II): light in the **left** eye → **neither** pupil reacts; light in the **right** eye → **both** constrict (the left pupil still obeys its intact III).", res: () => '<div class="ixARes2">' + grid("afferent") + box("Rule", ["Afferent lesion: the **consensual** response from the good eye is **kept**.", "The blind eye's pupil still constricts when the **other** eye is lit."]) + "</div>" },
        { id: "efferent", label: "✂ Left III nerve", show: ["xIII"], info: "**Efferent** defect (left III): the **left** pupil is **dilated and fixed** whatever eye is lit; the right pupil constricts to light in **either** eye.", res: () => '<div class="ixARes2">' + grid("efferent") + box("With it", ["**Ptosis** (levator), eye **down and out**.", "Unopposed sympathetic dilator → big pupil."]) + "</div>" },
        { id: "argyll", label: "🦠 Argyll Robertson", show: ["xPT"], info: "**Pretectal** lesion (**neurosyphilis**): light reflex **lost**, **near response (accommodation) kept**, because the near response runs through the cortex. **Not** an Edinger–Westphal lesion (EW is needed for both).", res: () => '<div class="ixARes2">' + grid("argyll") + box("Compare", ["Light reflex present but accommodation **absent** → lesion in the **visual cortex**.", "The **LGB** is not in the light reflex."]) + "</div>" },
      ],
      act: (card, a) => {
        card.dataset.eye = a;
        const info = card.querySelector(".ixAInfo .ixARow");
        if (info) info.remove();
        const sim = A.def("pupil").sims.find((x) => x.id === card.dataset.ixaSim) || null;
        live(card, sim);
      },
      live,
      secs: { "ph-uveal#0": "normal", "ph-refraction#1": "normal" },
      rules: [
        [/argyll|pretectal|neurosyphilis/i, "argyll"],
        [/light reflex|consensual|edinger|ciliary ganglion|pupillary/i, "normal"],
      ],
    });
  })();

  /* ═══════════════ EYE MOVEMENTS AND PALSIES (facing the patient) ═══════════════ */
  (function () {
    // gaze: dx,dy in the viewer's frame (dx -1 = viewer's left = patient's RIGHT)
    const G = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    // muscle tested for each eye in each direction (clinical H test)
    const M = {
      R: { "-1,0": "LR", "1,0": "MR", "-1,-1": "SR", "-1,1": "IR", "1,-1": "IO", "1,1": "SO" },
      L: { "1,0": "LR", "-1,0": "MR", "1,-1": "SR", "1,1": "IR", "-1,-1": "IO", "-1,1": "SO" },
    };
    const NERVE = { LR: "VI", SO: "IV", SR: "III", IR: "III", MR: "III", IO: "III" };
    const NAME = { LR: "lateral rectus", MR: "medial rectus", SR: "superior rectus", IR: "inferior rectus", SO: "superior oblique", IO: "inferior oblique" };
    function pos(eye, g, palsy) {
      // returns [dx, dy, lidDrop, pupilBig]
      let [x, y] = g;
      const abd = eye === "R" ? -1 : 1; // abduction direction for this eye (viewer frame)
      if (palsy && palsy.eye === eye) {
        if (palsy.n === "VI") {
          if (x === abd) x = 0;
          else if (x === 0) x = -abd * 0.35;
        } else if (palsy.n === "III") {
          // only LR (and SO) left: rests down and out, abducts further
          x = x === abd ? abd * 1.05 : abd * 0.7;
          y = 0.55;
          return [x, y, 1, 1];
        } else if (palsy.n === "IV") {
          if (y === 1 && x === -abd) y = -0.1;
          else if (y === 0) y = -0.28;
        } else if (palsy.n === "horner") return [x, y, 0.4, -1];
      }
      return [x, y, 0, 0];
    }
    let U = 0;
    const eyeSVG = (id, cx, u) => {
      const alm = "M" + (cx - 58) + " 120 Q" + cx + " 76 " + (cx + 58) + " 120 Q" + cx + " 164 " + (cx - 58) + " 120Z";
      return (
        '<clipPath id="ixEye' + u + id + '"><path d="' + alm + '"/></clipPath>' +
        '<path d="' + alm + '" fill="#f6f8fb" stroke="#8e6a55" stroke-width="1.4"/>' +
        '<g clip-path="url(#ixEye' + u + id + ')"><g class="iris" data-eye="' + id + '" style="transition:transform .35s"><circle cx="' + cx + '" cy="120" r="19" fill="#4f86b5"/><circle cx="' + cx + '" cy="120" r="19" fill="none" stroke="#2c5577" stroke-width="2"/><circle class="pupil" cx="' + cx + '" cy="120" r="7" fill="#05080d"/><circle cx="' + (cx - 6) + '" cy="113" r="3" fill="#fff" opacity=".8"/></g>' +
        '<path class="lid" data-eye="' + id + '" data-cx="' + cx + '" d="M' + (cx - 60) + " 120 Q" + cx + " 76 " + (cx + 60) + " 120 Q" + cx + " 76 " + (cx - 60) + ' 120Z" fill="#d9ab8c" stroke="#9b6f55" stroke-width="1.2"/></g>' +
        '<path d="M' + (cx - 58) + " 120 Q" + cx + " 76 " + (cx + 58) + ' 120" fill="none" stroke="#6b4a33" stroke-width="1.6"/>'
      );
    };
    const btn = ([dx, dy]) => {
      const x = 240 + dx * 64,
        y = 232 + dy * 30;
      return '<g class="gz" data-ixa-act="' + dx + "," + dy + '" style="cursor:pointer"><circle cx="' + x + '" cy="' + y + '" r="13" fill="#10223a" stroke="#3a5b80" stroke-width="1.2"/><circle cx="' + x + '" cy="' + y + '" r="4" fill="#66e9ff"/></g>';
    };
    // H pattern of the muscles around the grid, for the patient's right eye (left side) and left eye (right side)
    const hLab = (eye, cx) =>
      Object.entries(M[eye])
        .map(([k, m]) => {
          const [dx, dy] = k.split(",").map(Number);
          return '<text class="lab sm mlab" data-p="' + m + "." + eye + '" x="' + (cx + dx * 38) + '" y="' + (232 + dy * 26 + 3) + '" text-anchor="middle" style="pointer-events:auto;cursor:pointer">' + m + "</text>";
        })
        .join("");
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">FACING THE PATIENT</text>' +
      '<path d="M96 70 C96 30 150 26 240 26 C330 26 384 30 384 70 L384 150 C384 176 360 186 240 186 C120 186 96 176 96 150Z" fill="#e2b898" stroke="#b98b6c" stroke-width="1.2"/>' +
      '<path d="M146 60 Q180 48 214 60" stroke="#6b4a33" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M266 60 Q300 48 334 60" stroke="#6b4a33" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      ((U = (U + 1) % 1e6), eyeSVG("R", 170, U) + eyeSVG("L", 310, U)) +
      T(170, 176, "patient's RIGHT eye", "sm dk") + T(310, 176, "patient's LEFT eye", "sm dk") +
      '<rect x="150" y="192" width="180" height="80" rx="14" fill="#0b1828" stroke="#233a55"/>' + G.filter((g) => g[0] || g[1]).map(btn).join("") + '<g class="gz" data-ixa-act="0,0" style="cursor:pointer"><circle cx="240" cy="232" r="10" fill="#10223a" stroke="#3a5b80"/><text x="240" y="235.5" text-anchor="middle" font-size="9" fill="#9fb4cc">●</text></g>' +
      '<g opacity=".95">' + hLab("R", 72) + hLab("L", 408) + "</g>" +
      T(72, 290, "right eye: H test", "sm mut") + T(408, 290, "left eye: H test", "sm mut");
    const live = (card, sim) => {
      const palsy = sim ? { eye: "R", n: sim.n } : null,
        g = (card.dataset.gaze || "0,0").split(",").map(Number);
      for (const eye of ["R", "L"]) {
        const [x, y, lid, big] = pos(eye, g, palsy);
        const ir = card.querySelector('.iris[data-eye="' + eye + '"]'),
          li = card.querySelector('.lid[data-eye="' + eye + '"]');
        if (ir) {
          ir.setAttribute("transform", "translate(" + (x * 26).toFixed(1) + " " + (y * 11).toFixed(1) + ")");
          ir.querySelector(".pupil").setAttribute("r", big > 0 ? 11.5 : big < 0 ? 4 : 7);
        }
        if (li) {
          const c = +li.dataset.cx,
            yq = 76 + (lid >= 1 ? 82 : lid ? 26 : 0);
          li.setAttribute("d", "M" + (c - 60) + " 120 Q" + c + " " + yq + " " + (c + 60) + " 120 Q" + c + " 76 " + (c - 60) + " 120Z");
        }
      }
      card.querySelectorAll(".gz circle:first-child").forEach((c) => c.setAttribute("fill", "#10223a"));
      const b = card.querySelector('.gz[data-ixa-act="' + g.join(",") + '"] circle');
      if (b) b.setAttribute("fill", "#d9ff43");
      const k = g.join(","),
        mR = M.R[k],
        mL = M.L[k];
      card.querySelectorAll(".mlab").forEach((t) => t.setAttribute("fill", t.dataset.p === mR + ".R" || t.dataset.p === mL + ".L" ? "#d9ff43" : "#eaf2fc"));
      const info = card.querySelector(".ixAInfo");
      const line =
        mR && mL
          ? "Looking this way tests: right eye <b>" + NAME[mR] + "</b> (" + NERVE[mR] + ") · left eye <b>" + NAME[mL] + "</b> (" + NERVE[mL] + ")."
          : "Tap a gaze dot. Up or down while turned <b>out</b> tests the <b>recti</b>; up or down while turned <b>in</b> tests the <b>obliques</b>.";
      const old = info.querySelector(".ixAGaze");
      if (old) old.remove();
      info.insertAdjacentHTML("beforeend", '<p class="ixASub ixAGaze">' + line + "</p>");
    };
    A.scene("eom", {
      title: "Eye movements · the H test and III / IV / VI palsies",
      vb: "0 0 480 300",
      svg,
      intro: "**LR6 SO4, rest 3.** Tap a gaze dot to move both eyes; the muscle tested lights up in each H. Then pick a palsy.",
      parts: {
        LR: ["Lateral rectus (VI)", "**Abducts**. VI palsy → **medial squint**, cannot look out."],
        MR: ["Medial rectus (III)", "Adducts."],
        SR: ["Superior rectus (III)", "Elevates, adducts, rotates medially. Tested looking **up and out**."],
        IR: ["Inferior rectus (III)", "Depresses, adducts, rotates laterally. Tested looking **down and out**."],
        SO: ["Superior oblique (IV)", "Through the **trochlea**: **depresses, abducts, intorts**, the 'down and out' muscle. Tested looking **down and in** (going down stairs)."],
        IO: ["Inferior oblique (III)", "Elevates, abducts, rotates laterally. Tested looking **up and in**."],
      },
      drill: ["LR", "MR", "SR", "IR", "SO", "IO"],
      sims: [
        { id: "vi", n: "VI", label: "Right VI palsy", info: "**Abducent (VI) palsy**: the right eye rests turned **in** (**medial squint**) and cannot look **out**. Double vision worst looking to the right. In the pons with a contralateral hemiplegia = **medial pontine** syndrome." },
        { id: "iii", n: "III", label: "Right III palsy", info: "**Oculomotor (III) palsy**: complete **ptosis**, the eye **down and out** (LR and SO unopposed), a **dilated** pupil, no light or near response. In the midbrain with a contralateral hemiplegia = **Weber** syndrome." },
        { id: "iv", n: "IV", label: "Right IV palsy", info: "**Trochlear (IV) palsy**: the right eye sits slightly **high** and cannot look **down when turned in** (stairs, reading). The SCA runs beside IV round the midbrain." },
        { id: "horner", n: "horner", label: "Right Horner", info: "**Horner** (cervical sympathetic): **partial** ptosis (superior tarsal muscle), **miosis**, anhidrosis, apparent enophthalmos. Movements are normal." },
      ],
      act: (card, a) => {
        card.dataset.gaze = a;
        const sim = A.def("eom").sims.find((x) => x.id === card.dataset.ixaSim) || null;
        live(card, sim);
      },
      live,
      secs: { "an-orbit#0": "", "an-orbit#1": "iii" },
      rules: [
        [/abducent|abducens|lateral rectus|medial squint/i, "vi"],
        [/trochlear|superior oblique/i, "iv"],
        [/oculomotor|ptosis|down and out|lateral squint/i, "iii"],
        [/horner/i, "horner"],
        [/rectus|oblique|extraocular|ocular muscle/i, ""],
      ],
    });
  })();
})();
