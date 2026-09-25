/* INTELLECTUALITY v17 · CNS atlas: movement and signalling. Basal ganglia circuit with disease switches,
 * the cerebellum (functional map and cortical circuit), the stretch reflex arc, the synapse step by step,
 * a tap-to-fire summation lab, and the three long pathways side by side (where each one crosses).
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { E, md, smooth } = A;
  const { C, T, pf, ps, fl, box, leg } = A.kit;
  const bl = (pts) => smooth(pts, true);
  const GRN = "#5ef0a0",
    RED = "#ff5d7a";

  /* ═══════════════ BASAL GANGLIA: direct and indirect pathways ═══════════════ */
  (function () {
    const node = (id, x, y, w, h, label, sub, c) =>
      '<g><rect class="pf" data-p="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" style="--c:' + c + ';--r:#15283f;--rs:#3a5b80"/>' +
      T(x + w / 2, y + h / 2 + (sub ? -1 : 3.5), label, "big") + (sub ? T(x + w / 2, y + h / 2 + 12, sub, "sm mut") : "") + "</g>";
    const AR = {
      a1: ["M240 64 L240 102", "exc", "glutamate"],
      a2: ["M122 118 L150 118", "exc", "DA (D1) +"],
      a3: ["M86 142 C92 170 250 176 290 144", "inh", "DA (D2) −"],
      a4: ["M196 142 C200 190 210 226 214 258", "inh", "GABA"],
      a5: ["M290 142 C320 160 350 170 368 184", "inh", "GABA"],
      a6: ["M384 222 L384 258", "inh", "GABA"],
      a7: ["M322 280 L294 280", "exc", "glutamate"],
      a8: ["M150 280 L124 280", "inh", "GABA"],
      a9: ["M70 258 C60 180 60 120 70 66", "exc", "to motor cortex"],
    };
    const arrow = (id, [d, k]) => '<path class="ps" data-p="' + id + '" d="' + d + '" marker-end="url(#' + (k === "exc" ? "ixArrG" : "ixBarR") + ')" style="--c:' + (k === "exc" ? GRN : RED) + ";--r:" + (k === "exc" ? "#3fae78" : "#c9475f") + ';--w:3"/>';
    const svg = () =>
      node("ctx", 40, 24, 400, 40, "CEREBRAL CORTEX", "motor and premotor", "#66e9ff") +
      node("snc", 22, 100, 100, 42, "SNc", "dopamine", "#ffd166") +
      '<g><rect class="pf" data-p="d1" x="150" y="100" width="90" height="42" rx="12" style="--c:' + GRN + ';--r:#15283f;--rs:#3a5b80"/><rect class="pf" data-p="d2" x="240" y="100" width="90" height="42" rx="12" style="--c:' + RED + ';--r:#15283f;--rs:#3a5b80"/>' +
      T(240, 96, "STRIATUM (caudate + putamen)", "sm") + T(195, 125, "D1 · direct", "sm") + T(285, 125, "D2 · indirect", "sm") + "</g>" +
      node("gpe", 330, 184, 110, 38, "GPe", "", "#ffb86b") + node("stn", 330, 258, 110, 42, "STN", "subthalamic", "#ffe16d") +
      node("gpi", 150, 258, 144, 42, "GPi / SNr", "output", "#ff8fb7") + node("th", 20, 258, 104, 42, "Thalamus", "VA / VL", "#7bed9f") +
      Object.entries(AR).map(([id, a]) => arrow(id, a)).join("") +
      T(246, 86, "glutamate +", "sm", "start") + T(214, 206, "GABA −", "sm", "end") + T(360, 158, "GABA −", "sm", "start") + T(390, 244, "GABA −", "sm", "start") + T(308, 296, "glu +", "sm") + T(137, 296, "GABA −", "sm") + T(52, 170, "+", "big") +
      '<g class="meter"><rect x="150" y="330" width="290" height="22" rx="11" fill="#0b1828" stroke="#2a4260"/><rect class="mbar" x="152" y="332" width="143" height="18" rx="9" fill="' + GRN + '" style="transition:width .5s,fill .5s"/><text class="mtxt lab sm" x="296" y="345" text-anchor="middle">movement: normal</text></g>' +
      T(144, 345, "thalamic drive →", "sm mut", "end") +
      fl("fd", "M240 64 L240 102 M196 142 C200 190 210 226 214 258 M150 280 L124 280 M70 258 C60 180 60 120 70 66", GRN, 3) +
      fl("fi", "M240 64 L240 102 M290 142 C320 160 350 170 368 184 M384 222 L384 258 M322 280 L294 280 M150 280 L124 280", RED, 3);
    // relative strength of each arrow and the thalamic drive for each state
    const ST = {
      "": { w: {}, drive: 0.5, txt: "movement: normal" },
      direct: { w: {}, drive: 0.75, txt: "direct: movement ↑" },
      indirect: { w: {}, drive: 0.3, txt: "indirect: movement ↓" },
      pd: { w: { a2: 0.3, a3: 0.3, a4: 0.5, a5: 1.8, a6: 1.8, a7: 1.8, a8: 2, a9: 0.4 }, drive: 0.14, txt: "movement ↓↓ bradykinesia" },
      hd: { w: { a5: 0.3, a6: 0.3, a7: 0.4, a8: 0.4, a9: 1.8 }, drive: 0.9, txt: "movement ↑↑ chorea" },
      hb: { w: { a7: 0.1, a8: 0.4, a9: 2 }, drive: 0.96, txt: "movement ↑↑↑ ballismus" },
      ath: { w: { a8: 0.6, a9: 1.5 }, drive: 0.78, txt: "slow writhing (athetosis)" },
    };
    const live = (card, sim) => {
      const st = ST[sim ? sim.id : ""] || ST[""];
      card.querySelectorAll('.ps[data-p^="a"]').forEach((p) => p.style.setProperty("--w", 3 * (st.w[p.dataset.p] ?? 1)));
      const bar = card.querySelector(".mbar"),
        txt = card.querySelector(".mtxt");
      if (bar) {
        bar.setAttribute("width", Math.max(8, Math.round(286 * st.drive)));
        bar.setAttribute("fill", st.drive < 0.35 ? "#ff5d7a" : st.drive > 0.7 ? "#ffd166" : GRN);
      }
      if (txt) txt.textContent = st.txt;
    };
    A.scene("bg", {
      title: "Basal ganglia · the brake and the accelerator",
      vb: "0 14 460 350",
      svg,
      intro: "Green arrows excite, red bars inhibit. **Direct** releases the thalamus (go); **indirect** brakes it (stop). Dopamine helps go and blocks stop. Flip a disease switch and watch the thalamic drive.",
      parts: {
        ctx: ["Cerebral cortex", "Input to the striatum (**glutamate**); receives the result through the thalamus."],
        snc: ["Substantia nigra pars compacta", "**Dopamine**: excites the direct pathway (D1), inhibits the indirect (D2). Its degeneration = **Parkinsonism**."],
        d1: ["Striatum, direct-pathway neurons (D1)", "GABA onto the GPi → the thalamus is **released** → movement ↑."],
        d2: ["Striatum, indirect-pathway neurons (D2)", "GABA onto the GPe. Lost in **Huntington's** (the intrastriatal **GABAergic and cholinergic** neurons) → chorea."],
        gpe: ["Globus pallidus externa", "GABA onto the subthalamic nucleus."],
        stn: ["Subthalamic nucleus", "**Releases glutamate to excite the GPi.** Lesion → **hemiballismus** (violent flinging of the **opposite** limbs)."],
        gpi: ["GPi / SN pars reticulata (output)", "**GABA** onto **VA/VL** of the thalamus. The basal ganglia project to the thalamus, **not** straight to the cortex or LMNs. The SNr uses GABA, not dopamine."],
        th: ["Thalamus (VA, VL)", "Drives the motor and premotor cortex."],
        a1: ["Cortex → striatum", "Glutamate (excitatory)."],
        a2: ["SNc → D1", "Dopamine excites the direct pathway."],
        a3: ["SNc → D2", "Dopamine inhibits the indirect pathway."],
        a4: ["D1 → GPi", "GABA."],
        a5: ["D2 → GPe", "GABA."],
        a6: ["GPe → STN", "GABA."],
        a7: ["STN → GPi", "**Glutamate** (excitatory)."],
        a8: ["GPi → thalamus", "**GABA** (inhibitory)."],
        a9: ["Thalamus → cortex", "Excitatory."],
      },
      drill: ["snc", "d1", "d2", "gpe", "stn", "gpi", "th"],
      sims: [
        { id: "direct", label: "▶ Direct", on: ["ctx", "d1", "gpi", "th", "a1", "a4", "a8", "a9"], show: ["fd"], info: "**Direct**: cortex → striatum ⊣ GPi ⊣ thalamus. Two inhibitions in a row = **release** → movement ↑." },
        { id: "indirect", label: "▶ Indirect", on: ["ctx", "d2", "gpe", "stn", "gpi", "th", "a1", "a5", "a6", "a7", "a8"], show: ["fi"], info: "**Indirect**: striatum ⊣ GPe ⊣ STN → **excites** GPi ⊣ thalamus → movement ↓." },
        { id: "pd", keep: true, label: "Parkinson", lost: ["snc"], info: "**Loss of the nigral dopamine neurons**: direct weaker, indirect stronger → GPi over-inhibits the thalamus. **Resting (pill-rolling) tremor**, **rigidity** (lead-pipe; **cogwheel** with the tremor) mainly in antigravity muscles, **bradykinesia**, mask face, slow monotonous speech, **shuffling** gait. Reflexes normal, no paralysis.", res: () => '<div class="ixARes">' + box("Not Parkinson", ["**Intention (kinetic)** tremor and **staccato** speech → cerebellum.", "**Stamping** gait → sensory ataxia (tabes).", "Hypotonia → not Parkinson."]) + "</div>" },
        { id: "hd", keep: true, label: "Huntington", lost: ["d2"], info: "**Huntington's**: loss of the intrastriatal **GABAergic and cholinergic** neurons (caudate, putamen) → the brake fails → **chorea** (quick, jerky, dance-like) with **hypotonia**, depression, irritability, dementia. Autosomal dominant (CAG)." },
        { id: "hb", keep: true, label: "Hemiballismus", lost: ["stn"], info: "**Subthalamic** lesion → GPi loses its drive → thalamus released → **violent flinging of the opposite limbs**." },
        { id: "ath", keep: true, label: "Athetosis", lost: ["gpe", "gpi"], info: "**Globus pallidus** dysfunction → **athetosis**: slow, writhing movements of the hands. (Striatum = chorea · STN = ballismus · SN = Parkinson.)" },
      ],
      live,
      secs: { "ph-basal-ganglia#0": "direct", "ph-basal-ganglia#1": "pd", "ph-basal-ganglia#2": "hd", "an-basal-ganglia#0": "" },
      rules: [
        [/parkinson|nigra|dopamin|pill|cogwheel|lead-?pipe|mask/i, "pd"],
        [/huntington|chorea/i, "hd"],
        [/ballism|subthalamic/i, "hb"],
        [/athetosis|globus pallidus/i, "ath"],
        [/basal ganglia|striatum|direct pathway|indirect pathway/i, "direct"],
      ],
    });
  })();

  /* ═══════════════ CEREBELLUM: functional map ═══════════════ */
  (function () {
    const hemi = (flip) => {
      const k = flip ? -1 : 1,
        X = (x) => 240 + k * x;
      return [[X(70), 46], [X(150), 40], [X(206), 70], [X(222), 130], [X(206), 200], [X(160), 248], [X(90), 262], [X(70), 250]];
    };
    const par = (flip) => {
      const k = flip ? -1 : 1,
        X = (x) => 240 + k * x;
      return [[X(30), 40], [X(70), 44], [X(72), 150], [X(70), 252], [X(30), 258]];
    };
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">CEREBELLUM · UNFOLDED, SEEN FROM BEHIND</text>' +
      pf("neo.L", bl(hemi(true)), "#66e9ff", "#cfe6f0") + pf("neo.R", bl(hemi(false)), "#66e9ff", "#cfe6f0") +
      pf("parav.L", bl(par(true)), "#7bed9f", "#d4efdc") + pf("parav.R", bl(par(false)), "#7bed9f", "#d4efdc") +
      pf("vermis", bl([[212, 38], [240, 34], [268, 38], [272, 150], [268, 256], [240, 262], [212, 256], [208, 150]]), "#5ef0a0", "#c3e8cf") +
      pf("floc.L", bl([[112, 286], [160, 276], [196, 290], [170, 312], [120, 310]]), "#b39cff", "#e0d6f5") + pf("floc.R", bl([[368, 286], [320, 276], [284, 290], [310, 312], [360, 310]]), "#b39cff", "#e0d6f5") +
      pf("nod", bl([[216, 276], [264, 276], [266, 304], [240, 314], [214, 304]]), "#b39cff", "#e0d6f5") +
      '<path class="ps" data-p="pfis" d="M40 118 C120 104 200 100 240 100 C280 100 360 104 440 118" style="--c:#ffd166;--r:#8a7fa0;--w:2"/>' +
      '<path class="ps" data-p="plf" d="M90 272 C160 264 200 268 240 268 C280 268 320 264 390 272" style="--c:#ffd166;--r:#8a7fa0;--w:2"/>' +
      // deep nuclei (drawn inside, as if seen through)
      '<ellipse class="pf" data-p="fast" cx="240" cy="170" rx="9" ry="12" style="--c:#ffd166;--r:#9d8aa8"/>' +
      '<ellipse class="pf" data-p="int.L" cx="213" cy="172" rx="7" ry="12" style="--c:#ffd166;--r:#9d8aa8"/><ellipse class="pf" data-p="int.R" cx="267" cy="172" rx="7" ry="12" style="--c:#ffd166;--r:#9d8aa8"/>' +
      '<path class="pf" data-p="dent.L" d="M186 150 q-10 -4 -18 4 q-10 6 -8 18 q-6 10 2 18 q6 10 18 8 q10 2 14 -8 q4 -10 -2 -16 q6 -10 -6 -24z" style="--c:#ffd166;--r:#9d8aa8"/>' +
      '<path class="pf" data-p="dent.R" d="M294 150 q10 -4 18 4 q10 6 8 18 q6 10 -2 18 q-6 10 -18 8 q-10 2 -14 -8 q-4 -10 2 -16 q-6 -10 6 -24z" style="--c:#ffd166;--r:#9d8aa8"/>' +
      T(240, 62, "vermis", "sm dk") + T(186, 62, "para-", "sm dk") + T(118, 170, "lateral hemisphere", "sm dk") + T(144, 300, "flocculus", "sm dk") + T(240, 298, "nodule", "sm dk") + T(440, 112, "primary fissure", "sm", "end") + T(440, 288, "posterolateral fissure", "sm", "end") + T(90, 90, "ANTERIOR LOBE", "sm mut") + T(90, 236, "POSTERIOR LOBE", "sm mut") +
      T(240, 196, "F", "sm dk") + T(186, 204, "D", "sm dk") +
      // peduncles (to the brainstem, drawn as a key)
      '<g transform="translate(0 6)">' +
      '<path class="ps" data-p="scp" d="M150 340 L110 340" marker-end="url(#ixArr)" style="--c:#ff5d8f;--r:#6f8aa8;--w:3"/>' + T(156, 343, "superior peduncle → midbrain (output)", "sm", "start") +
      '<path class="ps" data-p="mcp" d="M110 358 L150 358" marker-end="url(#ixArr)" style="--c:#66e9ff;--r:#6f8aa8;--w:5"/>' + T(156, 361, "middle peduncle ← pons (largest)", "sm", "start") +
      '<path class="ps" data-p="icp" d="M110 376 L150 376" marker-end="url(#ixArr)" style="--c:#7bed9f;--r:#6f8aa8;--w:3"/>' + T(156, 379, "inferior peduncle ← medulla (spinal, olive, vestibular)", "sm", "start") + "</g>";
    A.scene("cereb", {
      title: "Cerebellum · three brains in one",
      vb: "0 0 480 392",
      svg,
      intro: "**Archi** (flocculonodular) = balance. **Paleo** (vermis + paravermis) = tone and correcting movement on the go. **Neo** (lateral hemispheres) = planning and timing. Each half works on the **same** side of the body.",
      parts: {
        floc: ["Flocculus", "With the nodule = the **flocculonodular lobe**: the **archicerebellum** (vestibulocerebellum), the **oldest** part. Equilibrium and eye movements."],
        nod: ["Nodule", "Part of the flocculonodular lobe (archicerebellum)."],
        vermis: ["Vermis", "Paleocerebellum (spinocerebellum): tone, posture, **servo-correction** of ongoing movement (compares the command with the feedback)."],
        parav: ["Paravermal (intermediate) zone", "Spinocerebellum: correcting limb movements; output via the interposed nuclei."],
        neo: ["Lateral hemisphere", "**Neocerebellum** (cerebrocerebellum): **planning, timing, programming** of voluntary movement; input from the **opposite** cortex via the **pontine nuclei** (middle peduncle). Lesion → drunken gait, intention tremor."],
        fast: ["Fastigial nucleus", "Most medial: vestibular and balance output."],
        int: ["Interposed nuclei (globose + emboliform)", "Output of the paravermal zone."],
        dent: ["Dentate nucleus", "The **largest**, most lateral. Output of the neocerebellum → superior peduncle → red nucleus and **thalamus** → motor cortex."],
        pfis: ["Primary fissure", "Separates the anterior and posterior lobes."],
        plf: ["Posterolateral fissure", "Separates the flocculonodular lobe."],
        scp: ["Superior cerebellar peduncle", "To the **midbrain**: the main output. The ventral spinocerebellar tract enters this way."],
        mcp: ["Middle cerebellar peduncle", "From the **pons**: the largest; pontocerebellar fibres."],
        icp: ["Inferior cerebellar peduncle", "From the **medulla**: dorsal spinocerebellar, olivocerebellar (climbing fibres), vestibular."],
      },
      drill: ["floc", "nod", "vermis", "neo", "dent", "fast", "int", "pfis", "scp", "mcp", "icp"],
      sims: [
        { id: "archi", label: "Archi · balance", on: ["floc", "nod", "fast", "icp"], info: "**Archicerebellum = flocculonodular lobe = the oldest part.** Vestibular connections: **equilibrium** and eye movements. Lesion → truncal ataxia, wide-based gait, nystagmus." },
        { id: "paleo", label: "Paleo · tone", on: ["vermis", "parav", "int", "fast", "icp", "scp"], info: "**Paleocerebellum** (spinocerebellum): **servo-correction** of ongoing movement and posture; in this course the anterior lobe is **inhibitory to muscle tone**." },
        { id: "neo", label: "Neo · planning", on: ["neo", "dent", "mcp", "scp"], info: "**Neocerebellum**: planning, timing and programming; facilitates γ motor neurons. Cortex → **pontine nuclei** → **opposite** hemisphere (middle peduncle); back via dentate → thalamus → cortex (no direct cortical projection)." },
        { id: "lesion", label: "Lesion signs", on: ["neo.R", "dent.R"], info: "A **right** cerebellar lesion → signs on the **right** (same side): **intention (kinetic) tremor**, dysmetria and past-pointing, dysdiadochokinesia, rebound, **hypotonia**, **staccato/scanning speech**, nystagmus, **drunken** wide-based gait.", res: () => '<div class="ixARes">' + box("Tell it apart", ["Tremor **at rest** → Parkinson (basal ganglia).", "Worse with **eyes closed** (Romberg +) → sensory ataxia (tabes), not cerebellar.", "Purkinje cells are in the **cortex**, not the deep nuclei."]) + "</div>" },
      ],
      secs: { "an-cerebellum#1": "", "an-cerebellum#2": "archi", "an-cerebellum#3": "neo", "ph-cerebellum#0": "archi", "ph-cerebellum#1": "neo", "ph-cerebellum#2": "lesion" },
      rules: [
        [/archi|flocculo|oldest part/i, "archi"],
        [/paleo|vermis|spinocerebell/i, "paleo"],
        [/intention tremor|ataxi|dysmetri|staccato|past.pointing|dysdiadoch/i, "lesion"],
        [/dentate|neocerebell|cerebrocerebell|peduncle/i, "neo"],
      ],
    });
  })();

  /* ═══════════════ CEREBELLAR CORTEX: the circuit ═══════════════ */
  (function () {
    const pkTree = "M240 150 L240 118 M240 118 L200 86 M240 118 L280 86 M200 86 L180 58 M200 86 L214 54 M280 86 L266 54 M280 86 L302 58 M180 58 L170 40 M180 58 L192 38 M214 54 L208 36 M214 54 L226 36 M266 54 L256 36 M266 54 L276 36 M302 58 L292 38 M302 58 L316 40 M240 118 L240 70 M240 70 L232 40 M240 70 L250 40";
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">CEREBELLAR CORTEX · ONE FOLIUM IN SECTION</text>' +
      pf("mol", "M30 26 L450 26 L450 146 L30 146 Z", "#b39cff", "#161f3a") + pf("pkl", "M30 146 L450 146 L450 172 L30 172 Z", "#ff5d8f", "#221a33") + pf("grl", "M30 172 L450 172 L450 270 L30 270 Z", "#66e9ff", "#122338") +
      '<rect x="30" y="270" width="420" height="64" fill="#0a1422" pointer-events="none"/>' +
      T(446, 40, "MOLECULAR", "sm mut", "end") + T(446, 162, "PURKINJE", "sm mut", "end") + T(446, 186, "GRANULAR", "sm mut", "end") + T(446, 284, "WHITE MATTER", "sm mut", "end") +
      // parallel fibres
      ps("pf", [48, 62, 76, 90, 104, 118, 132].map((y) => "M36 " + y + " L444 " + y).join(" "), "#66e9ff", "#35557a", 1.2) +
      // granule cells with ascending axons that split into parallel fibres
      [120, 150, 330, 360].map((x, i) => '<circle class="pf" data-p="gc" cx="' + x + '" cy="' + (214 + (i % 2) * 18) + '" r="6" style="--c:#66e9ff;--r:#9ec1dd"/>' + '<path class="ps" data-p="gc" d="M' + x + " " + (208 + (i % 2) * 18) + " L" + x + " " + [104, 90, 76, 118][i] + '" style="--c:#66e9ff;--r:#6f93b8;--w:1.4"/>').join("") +
      // Purkinje cell: flask body, planar dendritic tree, axon to the deep nuclei
      '<path class="ps" data-p="pk" d="' + pkTree + '" style="--c:#ff5d8f;--r:#e0a3bd;--w:3"/>' +
      '<path class="pf" data-p="pk" d="M228 170 C226 156 232 146 240 146 C248 146 254 156 252 170 C250 178 230 178 228 170Z" style="--c:#ff5d8f;--r:#e0a3bd"/>' +
      '<path class="ps" data-p="pk" d="M240 178 L240 318" marker-end="url(#ixBarR)" style="--c:#ff5d8f;--r:#e0a3bd;--w:2.4"/>' +
      pf("dn", "M196 318 L284 318 L284 340 L196 340 Z", "#ffd166", "#3b3320") + T(240, 333, "deep nuclei", "sm") +
      // mossy fibre → rosette (glomerulus) on granule dendrites
      '<path class="ps" data-p="mf" d="M60 330 C70 300 90 260 116 232 M116 232 L150 236" style="--c:#7bed9f;--r:#58a878;--w:2.4"/><circle class="pf" data-p="mf" cx="118" cy="232" r="7" style="--c:#7bed9f;--r:#58a878"/>' +
      // climbing fibre from the inferior olive, climbing the Purkinje dendrites
      '<path class="ps" data-p="cf" d="M380 330 C360 290 300 230 262 190 C252 178 248 162 246 150 C250 132 246 120 244 112 C250 100 262 92 278 88 C290 80 298 68 300 60" style="--c:#ffd166;--r:#b59a4d;--w:2.2"/>' +
      // basket (lower molecular) and stellate (upper molecular) cells; Golgi cell in the granular layer
      '<circle class="pf" data-p="bk" cx="178" cy="128" r="6" style="--c:#b39cff;--r:#8f7fc1"/><path class="ps" data-p="bk" d="M178 134 C190 150 210 160 228 162" style="--c:#b39cff;--r:#8f7fc1;--w:1.6"/>' +
      '<circle class="pf" data-p="st" cx="330" cy="48" r="5" style="--c:#b39cff;--r:#8f7fc1"/><path class="ps" data-p="st" d="M330 48 L300 58" style="--c:#b39cff;--r:#8f7fc1;--w:1.4"/>' +
      '<circle class="pf" data-p="go" cx="300" cy="196" r="8" style="--c:#ffb86b;--r:#c48a57"/><path class="ps" data-p="go" d="M300 188 L292 120 M300 188 L316 60 M300 204 L286 238 M300 204 L324 240" style="--c:#ffb86b;--r:#c48a57;--w:1.4"/>' +
      T(96, 250, "mossy", "sm", "end") + T(386, 318, "climbing (olive)", "sm", "start") + T(166, 124, "basket", "sm", "end") + T(338, 46, "stellate", "sm", "start") + T(312, 200, "Golgi", "sm", "start") + T(128, 206, "granule", "sm", "end") + T(40, 58, "parallel fibres", "sm", "start") + T(262, 168, "Purkinje", "sm", "start") +
      fl("exc", "M60 330 C70 300 90 260 116 232 L150 236 M150 232 L150 90 L230 90", "#7bed9f", 2.6) + fl("exc", "M380 330 C360 290 300 230 262 190 C252 178 248 162 246 150", "#ffd166", 2.6) + fl("out", "M240 178 L240 318", "#ff5d8f", 2.6);
    A.scene("cbcx", {
      title: "Cerebellar cortex · two inputs, one inhibitory output",
      vb: "20 0 440 344",
      svg,
      intro: "Three layers: **molecular**, a single row of **Purkinje** cells, **granular**. Every input excites; the only output, the Purkinje cell, **inhibits** the deep nuclei.",
      parts: {
        mol: ["Molecular layer", "Stellate and basket cells, Purkinje dendrites, parallel fibres."],
        pkl: ["Purkinje cell layer", "A **single row** of large flask-shaped (pyriform) **multipolar** cells."],
        grl: ["Granular layer", "Granule cells, Golgi cells, and the glomeruli where mossy fibres end."],
        pk: ["Purkinje cell", "Multipolar, flask-shaped, in one row. The **only output** of the cortex, and it is **inhibitory** (GABA) to the deep nuclei."],
        gc: ["Granule cell", "Small, with **a few short, claw-like dendrites**. Its axon rises and splits into the parallel fibres."],
        pf: ["Parallel fibres", "Granule-cell axons running along the folium; each crosses many Purkinje dendrites (excitatory)."],
        mf: ["Mossy fibre", "From the **pons**, spinal cord and vestibular nuclei; ends on **granule cells** in a glomerulus (excitatory)."],
        cf: ["Climbing fibre", "From the **inferior olive** (not the pons). Synapses **directly** on a Purkinje cell and climbs its dendrites: **excitatory**, **one per Purkinje cell**."],
        bk: ["Basket cell", "Lower molecular layer; wraps the Purkinje cell body (inhibitory)."],
        st: ["Stellate cell", "Upper molecular layer; inhibits Purkinje dendrites."],
        go: ["Golgi cell", "In the granular layer; its **dendrites extend into all layers**. Inhibits granule cells."],
        dn: ["Deep cerebellar nuclei", "Receive the Purkinje inhibition; send the cerebellum's output."],
      },
      drill: ["pk", "gc", "pf", "mf", "cf", "bk", "st", "go", "mol", "grl", "pkl"],
      sims: [
        { id: "exc", label: "▶ Inputs", on: ["mf", "gc", "pf", "cf", "pk"], show: ["exc"], info: "**Mossy fibres** → granule cells → **parallel fibres** → Purkinje dendrites. **Climbing fibres** (inferior olive) → straight onto one Purkinje cell. Both **excitatory**." },
        { id: "out", label: "▶ Output", on: ["pk", "dn"], show: ["out"], info: "The Purkinje axon is the **only** way out of the cortex, and it **inhibits** the deep nuclei." },
        { id: "inh", label: "Inhibitory cells", on: ["bk", "st", "go", "pk"], info: "**Basket** and **stellate** cells inhibit Purkinje cells; **Golgi** cells inhibit granule cells. Only the granule cell is excitatory among the cortex's own neurons." },
      ],
      secs: { "hi-cns#3": "" },
      rules: [[/purkinje|granule cell|climbing fib|mossy fib|golgi cell|cerebellar cortex|basket cell|stellate/i, ""]],
    });
  })();

  /* ═══════════════ STRETCH REFLEX: spindle, α, γ, Golgi tendon organ ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">KNEE JERK · THE REFLEX ARC</text>' +
      // spinal cord segment (L2–L4)
      '<ellipse cx="360" cy="92" rx="84" ry="58" fill="url(#ixTissue)" stroke="#c9d6e6" stroke-width="1.2"/>' +
      '<path d="M360 50 C372 60 392 70 404 64 C414 76 400 92 388 96 C404 108 420 124 410 138 C392 140 378 124 366 118 L354 118 C342 124 328 140 310 138 C300 124 316 108 332 96 C320 92 306 76 316 64 C328 70 348 60 360 50Z" fill="url(#ixGrey)" stroke="#a88aa0" pointer-events="none"/>' +
      T(360, 162, "spinal cord L2–L4", "sm mut") +
      '<circle class="pf" data-p="amn" cx="390" cy="122" r="8" style="--c:#ff5d8f;--r:#9d6b84"/><circle class="pf" data-p="hmn" cx="330" cy="124" r="7" style="--c:#ff9f43;--r:#9d7b6b"/><circle class="pf" data-p="gmn" cx="404" cy="104" r="5" style="--c:#b39cff;--r:#8a7fa0"/>' +
      '<circle class="pf" data-p="inn" cx="352" cy="108" r="5" style="--c:#ff5d7a;--r:#6f5a70"/><circle class="pf" data-p="ibn" cx="374" cy="102" r="5" style="--c:#ff5d7a;--r:#6f5a70"/>' +
      '<ellipse class="pf" data-p="drg" cx="430" cy="34" rx="11" ry="8" style="--c:#66e9ff;--r:#e8dcc8"/>' +
      // the thigh: femur, quadriceps (front) and hamstrings (back), knee, leg
      '<rect x="40" y="186" width="250" height="26" rx="12" fill="#e8dcc8" stroke="#bda98c" pointer-events="none"/>' +
      pf("quad", "M44 158 C90 142 230 146 286 170 L286 186 L44 186 Z", "#ff5d8f", "#d98a8f") + pf("ham", "M44 212 L286 212 L286 226 C230 248 90 250 44 234 Z", "#ff9f43", "#c9906b") +
      '<g class="shin" style="transform-origin:300px 200px;transition:transform .3s"><path d="M286 196 L314 196 L312 350 C312 358 290 358 288 350 Z" fill="#e8dcc8" stroke="#bda98c"/><path d="M282 206 C276 250 278 300 286 340 L300 340 C296 300 294 250 298 206Z" fill="#c9906b" opacity=".85"/><path d="M288 350 L336 352 C344 354 344 366 334 366 L286 364 Z" fill="#e8dcc8" stroke="#bda98c"/><path d="M314 200 L316 236" stroke="#f2ead0" stroke-width="6" stroke-linecap="round"/></g>' +
      '<circle cx="298" cy="178" r="11" fill="#f1e6d6" stroke="#bda98c" pointer-events="none"/>' + T(298, 162, "patella", "sm", "middle") +
      '<g class="hammer"><rect x="322" y="214" width="16" height="26" rx="4" fill="#ff5d7a"/><rect x="338" y="224" width="70" height="6" rx="3" fill="#9fb4cc"/></g>' + T(322, 250, "tap the tendon", "sm", "start") +
      // spindle in the quadriceps, GTO at the tendon
      pf("sp", "M130 168 C150 160 190 160 210 168 C190 176 150 176 130 168Z", "#66e9ff", "#f7eef2") + '<path d="M150 168 C160 164 180 164 190 168" stroke="#66e9ff" stroke-width="1.6" fill="none" pointer-events="none"/>' +
      pf("gto", "M252 172 L276 168 L276 180 L252 184Z", "#7bed9f", "#f2ead0") +
      // fibres: Ia (blue), α (pink), γ (purple), Ib (green), reciprocal inhibition to hamstrings (orange)
      ps("ia", "M170 164 C190 120 300 60 430 34 C440 60 410 90 380 100 L390 116", "#66e9ff", "#6f93b8", 2.6) +
      ps("alpha", "M390 130 C380 170 330 172 250 164", "#ff5d8f", "#a86a86", 2.6) +
      ps("gamma", "M404 110 C420 150 340 150 206 166", "#b39cff", "#8a7fa0", 1.8) +
      ps("ib", "M264 172 C300 130 380 70 430 40 C432 60 400 90 376 104", "#7bed9f", "#58a878", 2) +
      ps("recip", "M352 112 L336 122 M330 132 C320 180 280 220 200 224", "#ff9f43", "#b07c50", 2) +
      T(120, 150, "spindle (Ia)", "sm", "end") + T(250, 196, "GTO (Ib)", "sm", "end") + T(66, 176, "quadriceps", "sm dk", "start") + T(66, 226, "hamstrings", "sm dk", "start") + T(446, 28, "DRG", "sm", "start") +
      fl("jerk", "M170 164 C190 120 300 60 430 34 C440 60 410 90 380 100 L390 116 L390 130 C380 170 330 172 250 164", "#66e9ff", 3, "1.6s") +
      fl("gl", "M404 110 C420 150 340 150 206 166", "#b39cff", 2.6, "1.6s") +
      fl("gt", "M264 172 C300 130 380 70 430 40 C432 60 400 90 376 104 L390 122", "#7bed9f", 2.6, "1.8s") +
      '<g class="ov" data-x="cut"><circle cx="300" cy="80" r="11" fill="#ff5d7a"/><path d="M295 75 l10 10 m0 -10 l-10 10" stroke="#fff" stroke-width="2.2"/></g>';
    const live = (card, sim) => {
      const sh = card.querySelector(".shin");
      if (!sh) return;
      const kick = sim && (sim.id === "jerk" || sim.id === "umn");
      sh.style.animation = kick && !card.querySelector(".ixStill") ? (sim.id === "umn" ? "ixKick .5s ease-in-out infinite alternate" : "ixKick 1.6s ease-in-out infinite") : "none";
    };
    A.scene("reflex", {
      title: "Stretch reflex · tap the tendon, follow the loop",
      vb: "20 0 450 372",
      svg,
      intro: "Tap the tendon → the quadriceps stretches → **spindle** fires **Ia** → **one synapse** on the **α motor neuron** → quadriceps contracts. The shortest reflex time of all.",
      parts: {
        sp: ["Muscle spindle", "In **all** skeletal muscles, 3–12 intrafusal fibres in parallel with the extrafusal fibres. Senses **length**. Nuclear **bag** fibres (Ia): **dynamic**; nuclear **chain** (Ia + II): **static**."],
        gto: ["Golgi tendon organ", "In series at the tendon. Senses **tension** (Ib) → inhibitory interneuron → relaxes the same muscle (inverse stretch reflex)."],
        ia: ["Ia afferent (annulospiral)", "From the spindle's central zone into the cord: **monosynaptic** on the α motor neuron."],
        alpha: ["α motor axon", "To the extrafusal fibres: the **final common path** of every reflex (not an interneuron)."],
        gamma: ["γ motor axon (Aγ)", "To the **polar (contractile) ends** of the intrafusal fibres, not the central zone. Keeps the spindle taut during contraction (α–γ co-activation)."],
        ib: ["Ib afferent", "From the Golgi tendon organ."],
        recip: ["Reciprocal inhibition", "An Ia collateral excites an inhibitory interneuron → the **antagonist** (hamstrings) relaxes."],
        amn: ["α motor neuron (quadriceps)", "Anterior horn."],
        gmn: ["γ motor neuron", "Anterior horn; set by descending (supraspinal) drive."],
        hmn: ["α motor neuron (hamstrings)", "Inhibited during the knee jerk."],
        inn: ["Inhibitory interneuron (reciprocal)", ""],
        ibn: ["Inhibitory interneuron (Ib)", ""],
        drg: ["Dorsal root ganglion", "Cell bodies of Ia and Ib afferents."],
        quad: ["Quadriceps (extensor)", "Knee jerk centre **L2–L4**."],
        ham: ["Hamstrings (flexor)", ""],
      },
      drill: ["sp", "gto", "ia", "alpha", "gamma", "amn", "gmn", "recip", "drg"],
      sims: [
        { id: "jerk", label: "🔨 Knee jerk", on: ["sp", "ia", "amn", "alpha", "quad", "recip", "inn"], show: ["jerk"], info: "Stretch → spindle → **Ia** → **α motor neuron** (one synapse) → quadriceps contracts; an Ia branch inhibits the hamstrings. Jerks test the **integrity of the arc and its segment**: biceps C5–6, triceps C6–7, **knee L2–4**, ankle S1–2." },
        { id: "gamma", label: "γ loop", on: ["gmn", "gamma", "sp", "ia", "amn"], show: ["gl"], info: "**γ motor neurons** contract the spindle's **poles** → the centre stretches → Ia fires → α fires. Supraspinal centres set tone through this loop; **α–γ co-activation** keeps the spindle sensitive while the muscle shortens." },
        { id: "gto", label: "Tendon organ", on: ["gto", "ib", "ibn", "amn"], show: ["gt"], info: "**Inverse stretch reflex**: high tension → **Ib** → **inhibitory** interneuron → the same muscle relaxes (protects the tendon; the clasp-knife 'give')." },
        { id: "umn", label: "UMN lesion", on: ["gmn", "gamma", "amn", "ia"], info: "**UMN lesion**: descending inhibition lost → γ drive and the arc are over-active → **hyperreflexia, clonus**, **spastic** clasp-knife hypertonia, **Babinski +**, no marked wasting." },
        { id: "lmn", label: "LMN lesion", lost: ["amn", "alpha"], show: ["cut"], info: "**LMN lesion** (arc broken, e.g. poliomyelitis, nerve injury): **flaccid**, **areflexia**, **wasting**, **fasciculations**, denervation **supersensitivity** (more ACh receptors)." },
      ],
      live,
      secs: { "ph-spinal-reflexes#0": "jerk", "ph-spinal-reflexes#1": "", "ph-spinal-reflexes#2": "gamma", "ph-spinal-reflexes#3": "jerk", "ph-spinal-reflexes#4": "gto" },
      rules: [
        [/golgi tendon|inverse stretch|\bIb\b|clasp/i, "gto"],
        [/gamma|γ|intrafusal|co-?activation|nuclear (bag|chain)|spindle/i, "gamma"],
        [/stretch reflex|knee jerk|tendon jerk|monosynaptic|jerk/i, "jerk"],
      ],
    });
  })();

  /* ═══════════════ SYNAPSE: step by step, and what the toxins break ═══════════════ */
  (function () {
    const ves = [[196, 110], [222, 96], [252, 104], [282, 96], [306, 112], [210, 136], [238, 132], [268, 134], [296, 138]];
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">CHEMICAL SYNAPSE</text>' +
      '<path d="M226 20 L254 20 L254 40 C320 44 360 90 356 140 C352 180 320 196 240 196 C160 196 128 180 124 140 C120 90 160 44 226 40Z" fill="#1c3552" stroke="#5b8fb9" stroke-width="1.6" pointer-events="none"/>' +
      pf("term", "M226 20 L254 20 L254 40 C320 44 360 90 356 140 C352 180 320 196 240 196 C160 196 128 180 124 140 C120 90 160 44 226 40Z", "#66e9ff", "#0000", ' data-h="1"') +
      '<ellipse cx="170" cy="100" rx="26" ry="13" fill="#ffb86b" stroke="#c98a4e" pointer-events="none"/><path d="M152 100 q6 -8 12 0 t12 0 t12 0" stroke="#c98a4e" fill="none" pointer-events="none"/>' + T(170, 82, "mitochondrion", "sm", "middle") +
      ves.map(([x, y]) => '<circle class="pf" data-p="ves" cx="' + x + '" cy="' + y + '" r="10" style="--c:#d9ff43;--r:#c9d7e8"/><circle cx="' + x + '" cy="' + y + '" r="2" fill="#5b3a8a"/><circle cx="' + (x + 4) + '" cy="' + (y - 3) + '" r="1.6" fill="#5b3a8a"/><circle cx="' + (x - 3) + '" cy="' + (y + 4) + '" r="1.6" fill="#5b3a8a"/>').join("") +
      // docked vesicles with SNAREs at the active zone
      [[210, 180], [240, 182], [270, 180]].map(([x, y]) => '<circle class="pf" data-p="dock" cx="' + x + '" cy="' + y + '" r="9" style="--c:#d9ff43;--r:#c9d7e8"/><path d="M' + (x - 4) + " " + (y + 8) + " l2 4 l2 -4 l2 4" + '" stroke="#ff5d8f" stroke-width="1.4" fill="none" pointer-events="none"/>').join("") +
      // voltage-gated Ca channels on the presynaptic membrane
      [[182, 192], [298, 192]].map(([x, y]) => '<rect class="pf" data-p="cach" x="' + (x - 7) + '" y="' + (y - 9) + '" width="14" height="16" rx="3" style="--c:#66e9ff;--r:#3d7fb0"/>').join("") +
      '<rect class="pf" data-p="reup" x="330" y="160" width="14" height="18" rx="3" transform="rotate(-30 337 169)" style="--c:#7bed9f;--r:#4f8f6d"/>' +
      pf("cleft", "M110 198 L370 198 L370 222 L110 222 Z", "#ffd166", "#0a1726") + T(118, 214, "cleft", "sm mut", "start") +
      '<rect x="100" y="222" width="280" height="64" rx="10" fill="#2a1f3c" stroke="#8a6fb0" stroke-width="1.4" pointer-events="none"/>' + T(240, 280, "postsynaptic neuron", "sm mut") +
      [[196, 224], [240, 224], [284, 224]].map(([x, y]) => '<path class="pf" data-p="ion" d="M' + (x - 9) + " " + y + " L" + (x - 9) + " " + (y + 22) + " L" + (x - 3) + " " + (y + 22) + " L" + (x - 3) + " " + (y + 6) + " L" + (x + 3) + " " + (y + 6) + " L" + (x + 3) + " " + (y + 22) + " L" + (x + 9) + " " + (y + 22) + " L" + (x + 9) + " " + y + 'Z" style="--c:#ff5d8f;--r:#b36a92"/>').join("") +
      '<path class="pf" data-p="gpcr" d="M318 224 q4 10 0 20 q-4 10 0 20 M326 224 q4 10 0 20 q-4 10 0 20 M334 224 q4 10 0 20 q-4 10 0 20" style="--c:#b39cff;--r:#0000;--rs:#8a6fb0;stroke-width:3;fill:none"/><circle cx="344" cy="266" r="6" fill="#b39cff" pointer-events="none"/>' +
      '<g class="pf" data-p="enz" style="--c:#ffd166;--r:#c7a64e"><path d="M146 206 l10 -6 l10 6 l-10 6z"/></g>' +
      T(196, 256, "ionotropic", "sm", "middle") + T(330, 214, "metabotropic", "sm", "middle") + T(146, 234, "AChE", "sm", "middle") + T(350, 150, "reuptake", "sm", "start") +
      // states: AP arriving, Ca2+ in, release, binding and ions, presynaptic inhibition, toxins
      fl("ap", "M240 20 L240 60 C240 120 200 150 186 186 M240 60 C240 120 280 150 294 186", "#ffe16d", 4, "1.2s") +
      '<g class="ov" data-x="ca">' + [[176, 204], [186, 208], [292, 204], [302, 208], [182, 214], [296, 214]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3.6" fill="#66e9ff" class="blink"/>').join("") + T(144, 188, "Ca²⁺ in", "sm", "end") + "</g>" +
      '<g class="ov" data-x="nt">' + Array.from({ length: 16 }, (_, i) => '<circle cx="' + (200 + ((i * 37) % 90)) + '" cy="' + (201 + ((i * 7) % 18)) + '" r="2.4" fill="#d9ff43"/>').join("") + "</g>" +
      '<g class="ov" data-x="na">' + [196, 240, 284].map((x) => '<path d="M' + x + " 206 L" + x + ' 256" stroke="#ff5d8f" stroke-width="2.4" stroke-dasharray="3 3" class="blink"/>').join("") + T(240, 300, "Na⁺ in → EPSP (or Cl⁻ in / K⁺ out → IPSP)", "sm") + "</g>" +
      '<g class="ov" data-x="axo"><path d="M60 30 C90 40 110 60 128 80" stroke="#b39cff" stroke-width="5" fill="none"/><circle cx="130" cy="84" r="12" fill="#3b2a5c" stroke="#b39cff" stroke-width="2"/>' + T(54, 24, "GABA axon", "sm", "start") + "</g>" +
      '<g class="ov" data-x="block"><path d="M180 176 L300 176" stroke="#ff5d7a" stroke-width="5" stroke-linecap="round"/>' + T(240, 170, "✕ no release", "sm") + "</g>";
    A.scene("synapse", {
      title: "Synapse · five steps, and what the toxins break",
      vb: "20 0 440 310",
      svg,
      intro: "Step through it: the action potential opens **voltage-gated Ca²⁺ channels** → Ca²⁺ in → vesicles fuse (**SNARE**) → transmitter binds → the **receptor** decides excite or inhibit.",
      parts: {
        term: ["Presynaptic knob", "Holds the vesicles, mitochondria and the active zone."],
        ves: ["Synaptic vesicles", "Quanta of transmitter, released by **exocytosis** (not diffusion)."],
        dock: ["Docked vesicles and SNAREs", "**v-SNARE** (synaptobrevin) zips with **t-SNAREs** (syntaxin, SNAP-25) to fuse."],
        cach: ["Voltage-gated Ca²⁺ channels", "Open during **depolarization** (not repolarization). Outside Ca²⁺ is ~**10,000×** inside. **Release depends on Ca²⁺ influx.**"],
        cleft: ["Synaptic cleft", ""],
        ion: ["Ionotropic receptor (ligand-gated channel)", "Fast: Na⁺ in → **EPSP**; Cl⁻ in or K⁺ out → **IPSP**."],
        gpcr: ["Metabotropic receptor (G-protein coupled)", "Slow, via second messengers."],
        enz: ["Acetylcholinesterase", "Breaks down ACh in the cleft: **termination**, nothing to do with release."],
        reup: ["Reuptake transporter", "Termination for amines and amino acids."],
      },
      drill: ["ves", "dock", "cach", "ion", "gpcr", "enz", "reup", "cleft"],
      sims: [
        { id: "s1", label: "1 · AP arrives", show: ["ap"], on: ["term"], info: "The action potential **depolarizes** the terminal." },
        { id: "s2", label: "2 · Ca²⁺ in", show: ["ca"], on: ["cach"], info: "**Voltage-gated Ca²⁺ channels** open; Ca²⁺ rushes **in** down a ~10,000× gradient. No calcium, no release." },
        { id: "s3", label: "3 · Release", show: ["ca", "nt"], on: ["dock"], info: "Ca²⁺ triggers docking and **fusion** (SNARE complex) → **exocytosis** of quanta." },
        { id: "s4", label: "4 · Receptor", show: ["nt", "na"], on: ["ion", "gpcr"], info: "The **postsynaptic receptor** decides the effect (not the molecule): Na⁺ in → **EPSP** (local, partial depolarization); Cl⁻ in / K⁺ out → **IPSP** (hyperpolarization, away from threshold)." },
        { id: "s5", label: "5 · Stop", on: ["enz", "reup"], info: "Termination: **enzymes** (AChE) and **reuptake**." },
        { id: "presyn", label: "Presynaptic inhibition", show: ["axo"], on: ["term", "cach"], info: "A **third (GABA) neuron** synapses on the **terminal** → Cl⁻ channels in the knob → fewer Ca²⁺ channels open → **less transmitter released**. The postsynaptic membrane is not hyperpolarized. Used in **gate control** of pain." },
        { id: "botox", label: "Botulinum", show: ["block"], lost: ["dock"], info: "**Botulinum toxin** blocks **ACh release** at the neuromuscular junction → **flaccid** paralysis." },
        { id: "tetanus", label: "Tetanus", show: ["block"], lost: ["dock"], info: "**Tetanus toxin** blocks release of the **inhibitory** transmitters **GABA and glycine** from inhibitory interneurons → **spastic** paralysis (lockjaw, convulsions). **Strychnine** blocks glycine **receptors** instead." },
      ],
      secs: { "ph-synapse-mechanism#0": "", "ph-synapse-mechanism#1": "s2", "ph-synapse-mechanism#2": "s4", "ph-synapse-mechanism#3": "s5", "ph-synapse-properties#2": "tetanus", "ph-synaptic-potentials#2": "presyn" },
      rules: [
        [/botulin/i, "botox"],
        [/tetanus|strychnine/i, "tetanus"],
        [/presynaptic inhibition|presynaptic facilitation/i, "presyn"],
        [/calcium|ca2|ca\+\+|exocytosis|snare/i, "s2"],
        [/ionotropic|metabotropic|receptor/i, "s4"],
      ],
    });
  })();

  /* ═══════════════ SUMMATION LAB: fire EPSPs and IPSPs, reach threshold ═══════════════ */
  (function () {
    const W = 4000,
      X0 = 60,
      X1 = 460,
      yOf = (v) => 40 + ((40 - v) / 130) * 220; // +40 mV at the top, −90 at the bottom
    const svg = () =>
      '<text class="ttl" x="260" y="16" text-anchor="middle">SUMMATION LAB · TAP TO FIRE</text>' +
      '<rect x="' + X0 + '" y="40" width="' + (X1 - X0) + '" height="220" fill="#08131f" stroke="#223a55"/>' +
      [30, 0, -30, -55, -70, -90].map((v) => '<path d="M' + X0 + " " + yOf(v) + " L" + X1 + " " + yOf(v) + '" stroke="' + (v === -55 ? "#ff5d7a" : "#1d3148") + '" stroke-width="' + (v === -55 ? 1.6 : 1) + '"' + (v === -55 ? ' stroke-dasharray="6 4"' : "") + "/>" + T(X0 - 6, yOf(v) + 3, v + "", "sm mut", "end")).join("") +
      T(X1 - 4, yOf(-55) - 5, "threshold −55 mV", "sm", "end") + T(X1 - 4, yOf(-70) + 12, "resting −70 mV", "sm mut", "end") +
      '<polyline class="trace" points="" fill="none" stroke="#d9ff43" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<text class="spike lab big" x="260" y="34" text-anchor="middle" opacity="0">⚡ ACTION POTENTIAL</text>' +
      [["A", "EPSP", 110, "#5ef0a0"], ["B", "EPSP", 230, "#5ef0a0"], ["C", "IPSP", 350, "#ff5d7a"]].map(([k, t, x, c]) => '<g data-ixa-act="' + k + '" style="cursor:pointer"><rect x="' + (x - 50) + '" y="276" width="100" height="40" rx="12" fill="#10223a" stroke="' + c + '" stroke-width="1.6"/><text x="' + x + '" y="301" text-anchor="middle" font-size="12.5" font-weight="900" fill="' + c + '">Fire ' + k + " · " + t + "</text></g>").join("");
    const LAB = new WeakMap();
    function loop(card) {
      const st = LAB.get(card);
      if (!st || !card.isConnected) return LAB.delete(card);
      const now = performance.now();
      const tau = 110;
      let v = -70;
      st.ev = st.ev.filter((e) => now - e.t < 1500);
      for (const e of st.ev) {
        const x = (now - e.t) / tau;
        v += e.a * x * Math.exp(1 - x);
      }
      if (st.spikeAt && now - st.spikeAt < 260) {
        const p = (now - st.spikeAt) / 260;
        v = p < 0.25 ? -55 + (95 * p) / 0.25 : p < 0.6 ? 40 - (125 * (p - 0.25)) / 0.35 : -85 + (15 * (p - 0.6)) / 0.4;
      } else if (v >= -55 && (!st.spikeAt || now - st.spikeAt > 500)) {
        st.spikeAt = now;
        st.ev = [];
        st.n = (st.n || 0) + 1;
        const s = card.querySelector(".spike");
        if (s) {
          s.setAttribute("opacity", "1");
          setTimeout(() => s.setAttribute("opacity", "0"), 900);
        }
        const tip = card.querySelector(".ixASum");
        if (tip) tip.innerHTML = "⚡ <b>Fired " + st.n + "×.</b> " + (st.lastGap != null && st.lastGap < 350 && st.sameKey ? "That was <b>temporal</b> summation (one input, fast repeats)." : st.lastGap != null && st.lastGap < 350 ? "That was <b>spatial</b> summation (two inputs together)." : "EPSPs added up past threshold.");
        safeAward(card);
      }
      st.pts.push([now, v]);
      st.pts = st.pts.filter((p) => now - p[0] < W);
      const pl = card.querySelector(".trace");
      if (pl) pl.setAttribute("points", st.pts.map(([t, vv]) => (X1 - ((now - t) / W) * (X1 - X0)).toFixed(1) + "," + yOf(Math.max(-90, Math.min(40, vv))).toFixed(1)).join(" "));
      st.raf = requestAnimationFrame(() => loop(card));
    }
    function safeAward(card) {
      try {
        window.IX_GAME?.award?.("spike", 2);
      } catch (_) {}
      void card;
    }
    A.scene("sum", {
      title: "Summation lab · make the neuron fire",
      vb: "20 0 460 324",
      svg,
      intro: "One EPSP (+9 mV) is not enough. Tap **A** twice fast (**temporal** summation) or **A + B** together (**spatial**). **C** fires an IPSP: it pulls the potential **away** from threshold.",
      parts: {},
      sims: [],
      live: (card) => {
        if (LAB.has(card)) return;
        const t0 = performance.now(),
          st = { ev: [], pts: Array.from({ length: 40 }, (_, i) => [t0 - W + (i * W) / 40, -70]), spikeAt: 0 };
        LAB.set(card, st);
        const info = card.querySelector(".ixAInfo");
        if (info && !info.querySelector(".ixASum")) info.insertAdjacentHTML("beforeend", '<p class="ixASub ixASum">The grand postsynaptic potential is the <b>algebraic sum</b> of every EPSP and IPSP.</p>');
        loop(card);
      },
      act: (card, k) => {
        const st = LAB.get(card);
        if (!st) return;
        const now = performance.now();
        st.lastGap = st.lastT ? now - st.lastT : null;
        st.sameKey = st.lastK === k;
        st.lastT = now;
        st.lastK = k;
        st.ev.push({ t: now, a: k === "C" ? -9 : 9 });
      },
      secs: { "ph-synaptic-potentials#0": "", "ph-synaptic-potentials#1": "" },
      rules: [[/epsp|ipsp|summation|grand postsynaptic|hyperpolari/i, ""]],
    });
  })();

  /* ═══════════════ THE THREE LONG PATHWAYS: where each one crosses ═══════════════ */
  (function () {
    // front view, patient's RIGHT on the viewer's LEFT. Stimulus on the RIGHT leg; movement of the RIGHT leg.
    const L = { ctx: 40, ic: 92, th: 124, mb: 168, po: 212, mu: 252, ml: 286, cc: 328, lc: 384 };
    const lvl = (y, h, label) => '<rect x="96" y="' + (y - h / 2) + '" width="288" height="' + h + '" rx="10" fill="#0d1b2c" stroke="#1f3550"/>' + T(92, y + 3, label, "sm mut", "end");
    const DC = "M60 430 L120 404 L150 394 L224 " + (L.lc - 4) + " L224 " + L.ml + " L258 " + (L.mu + 8) + " L258 " + L.mb + " L296 " + (L.th + 2) + " L308 " + L.ic + " L344 " + (L.ctx + 6);
    const ST = "M60 430 L120 404 L150 394 L206 " + (L.lc + 4) + " L240 " + (L.lc + 10) + " L292 " + L.lc + " L292 " + L.cc + " L300 " + L.mu + " L304 " + L.po + " L304 " + L.mb + " L300 " + (L.th - 2) + " L312 " + L.ic + " L350 " + (L.ctx - 2);
    const CS = "M318 " + (L.ctx + 2) + " L298 " + L.ic + " L282 " + L.mb + " L282 " + L.po + " L276 " + L.mu + " L240 " + (L.ml + 10) + " L196 " + (L.cc - 8) + " L196 " + L.lc + " L206 " + (L.lc + 12) + " L150 412 L96 440";
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">FRONT VIEW · RIGHT LEG IN, RIGHT LEG OUT</text>' +
      '<text class="ttl" x="100" y="446">← patient RIGHT</text><text class="ttl" x="384" y="446" text-anchor="end">patient LEFT →</text>' +
      lvl(L.ctx, 30, "cortex") + lvl(L.ic, 20, "int. capsule") + lvl(L.th, 26, "thalamus") + lvl(L.mb, 30, "midbrain") + lvl(L.po, 30, "pons") + lvl(L.mu, 26, "upper medulla") + lvl(L.ml, 22, "lower medulla") + lvl(L.cc, 34, "cervical cord") + lvl(L.lc, 34, "lumbar cord") +
      '<path d="M240 24 L240 402" stroke="#35557a" stroke-width="1.4" stroke-dasharray="4 4"/>' +
      ps("dcml", DC, C.dc, "#3d7fa0", 3.2) + ps("stt", ST, C.pain, "#a8703a", 3.2) + ps("cst", CS, C.mot, "#a44d6c", 3.2) +
      [[224, L.ml, "gracile n.", -1], [298, L.th, "VPL", 1], [150, 394, "DRG", -1], [206, L.lc + 12, "anterior horn", 0]].map(([x, y, t, s]) => '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#fff" pointer-events="none"/>' + (s ? T(x + s * 8, y - 5, t, "sm", s < 0 ? "end" : "start") : T(x + 4, y + 16, t, "sm"))).join("") +
      T(318, L.ctx - 20, "M1", "sm") + T(350, L.ctx - 20, "S1", "sm") +
      '<g class="ov" data-x="xd">' + T(262, L.ml + 4, "✕ internal arcuate fibres", "sm", "start") + "</g>" +
      '<g class="ov" data-x="xs">' + T(250, L.lc + 26, "✕ anterior white commissure", "sm", "start") + "</g>" +
      '<g class="ov" data-x="xc">' + T(218, L.ml + 28, "pyramidal decussation ✕", "sm", "end") + "</g>" +
      fl("fd", DC, C.dc, 3.4) + fl("fs", ST, C.pain, 3.4) + fl("fc", CS, C.mot, 3.4);
    A.scene("path", {
      title: "The three long pathways · where each one crosses",
      vb: "0 0 470 450",
      svg,
      intro: "Why a cord lesion splits the senses: the **dorsal column** crosses in the **medulla**, the **spinothalamic** crosses **in the cord at once**, the **corticospinal** crosses at the **pyramidal decussation**. Everything ends on the **opposite** cortex.",
      parts: {
        dcml: ["Dorsal column – medial lemniscus", "Fine touch, vibration, position. 1st neuron: **DRG** → up the **same** side (gracile/cuneate) → 2nd: **gracile/cuneate nuclei** → **internal arcuate fibres cross** → medial lemniscus → 3rd: **VPL** → posterior limb → **postcentral gyrus**."],
        stt: ["Spinothalamic (anterolateral)", "Pain, temperature, crude touch. DRG → **dorsal horn** → **crosses at once** (anterior white commissure) → opposite anterolateral cord → spinal lemniscus → **VPL** → S1."],
        cst: ["Corticospinal (pyramidal)", "Precentral gyrus → **posterior limb** of the internal capsule → cerebral peduncle → basilar pons → **pyramid** → **decussation** (80–90%) → lateral corticospinal tract → **anterior horn** (LMN) → muscle."],
      },
      drill: ["dcml", "stt", "cst"],
      sims: [
        { id: "all", label: "▶ All three", show: ["fd", "fs", "fc", "xd", "xs", "xc"], on: ["dcml", "stt", "cst"], info: "Three crossings at three levels: **cord** (spinothalamic), **lower medulla** (corticospinal), **upper closed medulla** (dorsal column). Above the medulla all three are on the **opposite** side of the body they serve." },
        { id: "dcml", label: "Dorsal column", show: ["fd", "xd"], on: ["dcml"], info: "**Same side** in the cord, crosses in the **medulla**. A **right gracile nucleus** lesion → less tactile discrimination of the **right** leg. Ends in the **postcentral gyrus**: the main destination of kinaesthetic signals." },
        { id: "stt", label: "Spinothalamic", show: ["fs", "xs"], on: ["stt"], info: "Crosses **in the cord** within 1–2 segments, so a **left** lateral spinothalamic lesion → loss of pain in the **right** leg. Crude awareness of pain already at the **thalamus**." },
        { id: "cst", label: "Corticospinal", show: ["fc", "xc"], on: ["cst"], info: "**Left** cortex/capsule/pons lesion → **right** hemiplegia (UMN). Below the decussation (cord) a lesion paralyses the **same** side." },
      ],
      secs: { "ph-sensory-pathways#0": "dcml", "ph-sensory-pathways#1": "stt", "ph-motor-cortex#2": "cst", "hi-cns#2": "dcml", "ph-voluntary-movement#0": "cst" },
      rules: [
        [/medial lemniscus|internal arcuate|gracile nucleus|cuneate nucleus|kinesthe|kinaesthe|dorsal column/i, "dcml"],
        [/spinothalamic|spinal lemniscus/i, "stt"],
        [/corticospinal|pyramidal (tract|decussation)|decussation/i, "cst"],
      ],
    });
  })();
})();
