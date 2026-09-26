/* INTELLECTUALITY v17 · CNS atlas: the brain. Circle of Willis, cortical areas and arterial territories,
 * the internal capsule, crossed brainstem syndromes, and the CSF circulation.
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { E, md, smooth } = A;
  const { T, pf, ps, fl, box, leg } = A.kit;
  const bl = (pts) => smooth(pts, true);
  const ACA = "#66e9ff",
    MCA = "#ff9f43",
    PCA = "#b39cff";

  /* ═══════════════ CORTEX: areas, the homunculus strip, and arterial territories ═══════════════ */
  // lateral view (left hemisphere, frontal pole on the left) at y 0–190; medial view at y 200–390
  const LAT = "M60 120 C50 80 80 46 130 34 C180 20 250 18 300 28 C360 40 420 70 440 110 C452 136 436 160 404 166 C380 170 352 166 330 172 C300 180 250 186 214 176 C190 170 172 170 150 160 C132 152 116 150 96 150 C72 150 64 138 60 120 Z";
  const MED = "M60 330 C52 290 80 250 140 236 C200 222 280 222 330 232 C390 244 432 274 440 310 C446 336 430 356 400 360 C370 364 330 360 300 366 C260 374 220 374 190 364 C160 356 120 360 96 354 C74 350 64 344 60 330 Z";
  const TER = {
    acaL: "M64 104 C70 70 104 44 150 32 C200 22 260 18 300 28 C340 36 372 46 392 58 L382 72 C350 58 320 48 298 44 C258 36 206 38 160 50 C120 60 94 80 82 108 Z",
    pcaL: "M392 58 C420 76 444 104 446 128 C448 150 430 164 404 166 C380 170 352 166 330 172 C300 180 262 184 236 180 L248 166 C286 166 330 156 360 148 C380 140 386 112 382 72 Z",
    acaM: "M62 322 C56 288 84 250 140 236 C200 222 280 222 330 232 C350 236 366 242 380 250 L352 318 C330 312 300 306 270 306 C236 306 200 312 176 322 C150 332 120 344 96 350 C78 346 66 338 62 322 Z",
    pcaM: "M380 250 C406 262 432 284 440 310 C446 336 430 356 400 360 C370 364 330 360 300 366 C270 372 236 372 212 366 L236 340 C270 336 310 330 352 318 Z",
  };
  const AREAS = {
    a4: [[222, 26], [262, 22], [250, 52], [236, 82], [212, 108], [176, 112], [190, 84], [206, 56]],
    s1: [[262, 22], [298, 30], [282, 58], [266, 84], [250, 104], [212, 108], [236, 82], [250, 52]],
    a6: [[170, 32], [222, 26], [206, 56], [190, 84], [176, 112], [150, 114], [158, 80], [164, 52]],
    fef: [[132, 50], [160, 44], [160, 70], [138, 76]],
    broca: [[122, 114], [156, 108], [170, 122], [156, 136], [128, 134]],
    aud: [[228, 120], [260, 114], [270, 126], [244, 132]],
    wern: [[282, 116], [318, 106], [334, 122], [318, 138], [288, 136]],
    ang: [[330, 86], [362, 78], [374, 100], [346, 110], [326, 102]],
    v1l: [[410, 102], [440, 112], [440, 138], [422, 148], [404, 128]],
    pcl: [[232, 234], [300, 236], [300, 262], [236, 262]],
    v1m: [[352, 312], [436, 304], [442, 330], [356, 334]],
    cing: [[150, 282], [200, 262], [290, 262], [340, 280], [330, 290], [290, 276], [200, 276], [160, 294]],
  };
  const brainSVG = (u, mode) => {
    // mode: "areas" | "ter"
    const ter = mode === "ter";
    return (
      '<clipPath id="ixLat' + u + '"><path d="' + LAT + '"/></clipPath><clipPath id="ixMed' + u + '"><path d="' + MED + '"/></clipPath>' +
      '<path d="' + LAT + '" fill="' + (ter ? MCA + "55" : "#e9dfe6") + '" stroke="#b9a3b5" stroke-width="1.4"/>' +
      '<path d="' + MED + '" fill="#e9dfe6" stroke="#b9a3b5" stroke-width="1.4"/>' +
      (ter
        ? '<g clip-path="url(#ixLat' + u + ')"><path d="' + TER.acaL + '" fill="' + ACA + '66"/><path d="' + TER.pcaL + '" fill="' + PCA + '66"/></g>' +
          '<g clip-path="url(#ixMed' + u + ')"><path d="' + TER.acaM + '" fill="' + ACA + '66"/><path d="' + TER.pcaM + '" fill="' + PCA + '66"/></g>'
        : "") +
      // gyral texture (decorative) then the named sulci
      '<g fill="none" stroke="#cdb9c9" stroke-width="1.3" stroke-linecap="round" pointer-events="none" opacity=".9">' +
      '<path d="M96 96 C112 80 128 86 140 72 C150 60 170 64 176 50"/><path d="M84 122 C104 116 118 124 134 112"/><path d="M120 60 C132 46 150 44 160 36"/><path d="M318 44 C330 58 346 56 356 70 C364 82 380 80 392 92"/><path d="M300 62 C316 72 316 86 332 92"/><path d="M406 70 C414 88 430 94 434 110"/><path d="M190 150 C220 142 250 146 280 138 C300 134 316 138 330 130"/><path d="M204 164 C236 160 268 164 300 156 C326 152 346 156 366 150"/><path d="M356 120 C372 128 386 124 398 134"/>' +
      '<path d="M100 300 C118 282 140 290 156 272"/><path d="M92 330 C110 326 124 336 140 324"/><path d="M396 262 C410 276 424 280 432 296"/><path d="M366 336 C386 342 404 338 424 346"/><path d="M200 340 C230 334 262 340 292 332 C312 328 330 334 346 330"/>' +
      "</g>" +
      '<g fill="none" stroke="#8d7189" stroke-width="1.6" stroke-linecap="round" pointer-events="none">' +
      '<path d="M262 22 C258 44 244 70 212 108"/><path d="M140 140 C180 126 240 116 300 106 C308 104 314 100 318 94"/><path d="M222 26 C212 54 196 84 176 112" stroke-width="1" opacity=".6"/><path d="M298 30 C290 56 272 84 250 104" stroke-width="1" opacity=".6"/>' +
      '<path d="M170 300 C200 276 290 276 330 300" stroke-width="1" opacity=".6"/><path d="M380 250 C372 280 362 300 352 318"/><path d="M352 318 C380 316 410 314 440 318"/>' +
      "</g>" +
      // corpus callosum
      '<path class="pf" data-p="cc" d="M168 304 C190 276 300 272 336 300 C342 306 334 314 326 310 C300 290 196 290 180 312 C176 318 164 312 168 304Z" style="--c:#d9ff43;--r:#cbb8c8"/>' +
      (ter ? "" : Object.entries(AREAS).map(([k, pts]) => pf(k, bl(pts), COL[k], REST[k])).join("")) +
      T(250, 196, "LATERAL SURFACE (left hemisphere)", "sm mut") + T(250, 392, "MEDIAL SURFACE", "sm mut") +
      '<text class="ttl" x="54" y="16">FRONT</text><text class="ttl" x="438" y="16" text-anchor="end">BACK</text>'
    );
  };
  const COL = { a4: "#ff5d8f", s1: "#4cc9f0", a6: "#ff8fb7", fef: "#ffd166", broca: "#d9ff43", aud: "#ffb86b", wern: "#7bed9f", ang: "#b39cff", v1l: "#ffe16d", pcl: "#ff5d8f", v1m: "#ffe16d", cing: "#b39cff" };
  const REST = { a4: "#f3c7d6", s1: "#c7e6f3", a6: "#f4d9e3", fef: "#f4ead0", broca: "#e9f4c8", aud: "#f6dfc8", wern: "#d3f0dc", ang: "#e2d9f3", v1l: "#f5efc8", pcl: "#f3c7d6", v1m: "#f5efc8", cing: "#e2d9f3" };
  A.kit.brainMini = (mode, hi) => {
    // a small static copy for result boxes: territories with one of them emphasised
    const u = "m" + Math.random().toString(36).slice(2, 7),
      op = (k) => (hi && hi !== k ? "22" : "88");
    return (
      '<div class="ixABox"><h5>Territory</h5><svg viewBox="40 10 420 390" role="img" aria-label="Arterial territories">' +
      '<clipPath id="ixLat' + u + '"><path d="' + LAT + '"/></clipPath><clipPath id="ixMed' + u + '"><path d="' + MED + '"/></clipPath>' +
      '<path d="' + LAT + '" fill="' + MCA + op("mca") + '" stroke="#b9a3b5" stroke-width="2"/><path d="' + MED + '" fill="#2a3a4f" stroke="#b9a3b5" stroke-width="2"/>' +
      '<g clip-path="url(#ixLat' + u + ')"><path d="' + TER.acaL + '" fill="' + ACA + op("aca") + '"/><path d="' + TER.pcaL + '" fill="' + PCA + op("pca") + '"/></g>' +
      '<g clip-path="url(#ixMed' + u + ')"><path d="' + TER.acaM + '" fill="' + ACA + op("aca") + '"/><path d="' + TER.pcaM + '" fill="' + PCA + op("pca") + '"/></g>' +
      '<g fill="none" stroke="#e9dfe6" stroke-width="2" opacity=".5"><path d="M262 22 C258 44 244 70 212 108"/><path d="M140 140 C180 126 240 116 300 106"/><path d="M380 250 C372 280 362 300 352 318"/><path d="M352 318 C380 316 410 314 440 318"/></g>' +
      '<text x="250" y="200" text-anchor="middle" font-size="15" font-weight="900" fill="#9fb4cc">lateral</text><text x="250" y="396" text-anchor="middle" font-size="15" font-weight="900" fill="#9fb4cc">medial</text></svg>' +
      leg([[ACA, "ACA"], [MCA, "MCA"], [PCA, "PCA"]]) + "</div>"
    );
  };
  (function () {
    let u = 0;
    const svg = () => {
      u++;
      return (
        brainSVG("c" + u, "areas") +
        // territories overlay (shown by the territory states)
        '<g class="ov" data-x="ter"><g clip-path="url(#ixLatc' + u + ')"><path d="' + LAT + '" fill="' + MCA + '5a"/><path d="' + TER.acaL + '" fill="' + ACA + '70"/><path d="' + TER.pcaL + '" fill="' + PCA + '70"/></g><g clip-path="url(#ixMedc' + u + ')"><path d="' + TER.acaM + '" fill="' + ACA + '70"/><path d="' + TER.pcaM + '" fill="' + PCA + '70"/></g></g>' +
        ["aca", "mca", "pca"].map((k) => '<g class="ov" data-x="t-' + k + '"><g clip-path="url(#ixLatc' + u + ')">' + (k === "mca" ? '<path d="' + LAT + '" fill="' + MCA + 'a8"/><path d="' + TER.acaL + '" fill="#e9dfe6"/><path d="' + TER.pcaL + '" fill="#e9dfe6"/>' : '<path d="' + TER[k + "L"] + '" fill="' + (k === "aca" ? ACA : PCA) + 'b0"/>') + '</g><g clip-path="url(#ixMedc' + u + ')">' + (k === "mca" ? "" : '<path d="' + TER[k + "M"] + '" fill="' + (k === "aca" ? ACA : PCA) + 'b0"/>') + "</g></g>").join("") +
        // homunculus along the motor strip: leg on the medial surface, then trunk, arm, hand, face down to the lateral sulcus
        '<g class="ov" data-x="homo">' +
        [["leg", 250, 250], ["trunk", 250, 36], ["arm", 236, 62], ["hand", 222, 84], ["face", 202, 104], ["tongue · larynx", 192, 124]].map(([t, x, y]) => '<circle cx="' + x + '" cy="' + (y - 3) + '" r="3" fill="#07111d"/>' + T(x + 8, y, t, "sm", "start")).join("") +
        "</g>"
      );
    };
    A.scene("cortex", {
      title: "Cerebral cortex · areas, the body map, and which artery feeds what",
      vb: "40 6 420 392",
      svg,
      intro: "Tap an area. Then switch to **territories**: the leg sits on the **medial** surface (ACA), the face and arm on the **lateral** surface (MCA), vision at the back (PCA).",
      parts: {
        a4: ["Primary motor area (area 4, precentral gyrus)", "Voluntary movement of the **opposite** half of the body. About 30% of the **corticospinal** tract. The body map is upside down: face low, leg on the medial surface."],
        s1: ["Primary somatosensory area (3, 1, 2, postcentral gyrus)", "The **final destination of kinaesthetic** and touch signals (via VPL/VPM). Also gives ~40% of the corticospinal tract (with the parietal areas)."],
        a6: ["Premotor and supplementary areas (area 6)", "Planning and programming movement; about 30% of the corticospinal tract."],
        fef: ["Frontal eye field (area 8)", "Voluntary conjugate gaze to the **opposite** side."],
        broca: ["Broca's area (44, 45)", "Motor speech, dominant inferior frontal gyrus. Lesion → **motor (expressive) aphasia**: slow, effortful speech, comprehension kept. **MCA**."],
        aud: ["Primary auditory cortex (41, 42)", "Heschl's gyri, superior temporal gyrus. Hearing from **both** ears. **MCA**."],
        wern: ["Wernicke's area (22, posterior)", "Understanding language, dominant hemisphere. Lesion → **sensory (receptive) aphasia**: fluent but meaningless speech, poor comprehension. **MCA**."],
        ang: ["Angular gyrus (39)", "Reading and writing: links vision to language. **MCA**."],
        v1l: ["Visual cortex at the occipital pole", "The **macula** is represented here, at the pole, where MCA and PCA meet: why PCA strokes spare the macula."],
        pcl: ["Paracentral lobule", "Motor and sensory areas of the **opposite leg and foot**, and **bladder** control. **ACA** territory."],
        v1m: ["Primary visual cortex (area 17, calcarine sulcus)", "**PCA** territory. Lesion → opposite homonymous hemianopia with macular sparing."],
        cing: ["Cingulate gyrus", "Limbic lobe, above the corpus callosum."],
        cc: ["Corpus callosum", "Commissural fibres. **ACA** supplies all of it **except the splenium** (PCA)."],
      },
      drill: ["a4", "s1", "a6", "broca", "wern", "aud", "ang", "pcl", "v1m", "cc", "fef"],
      sims: [
        { id: "homo", label: "🧍 Body map", on: ["a4", "s1", "pcl"], show: ["homo"], info: "The motor and sensory strips map the **opposite** body upside down: **leg** on the medial surface (paracentral lobule, **ACA**), then trunk, arm, hand and a big **face** low on the lateral surface (**MCA**)." },
        { id: "ter", label: "🩸 All territories", show: ["ter"], info: "**ACA**: medial surface back to the parieto-occipital sulcus + a strip over the top. **MCA**: most of the lateral surface, insula, Broca, Wernicke, auditory. **PCA**: occipital lobe (vision), inferior temporal, splenium.", res: () => '<div class="ixARes">' + leg([[ACA, "anterior cerebral"], [MCA, "middle cerebral"], [PCA, "posterior cerebral"]]) + "</div>" },
        { id: "aca", label: "ACA stroke", show: ["t-aca"], info: "**Anterior cerebral** occlusion → paralysis and sensory loss of the **opposite leg** (paracentral lobule); bladder control. The ACA has central branches too (**Heubner**).", res: () => '<div class="ixARes2">' + A.kit.brainMini("ter", "aca") + box("Also ACA", ["All of the corpus callosum **except the splenium**.", "Medial half of the orbital surface."]) + "</div>" },
        { id: "mca", label: "MCA stroke", show: ["t-mca"], info: "**Middle cerebral** occlusion → opposite hemiplegia and hemianaesthesia, **face and arm worst** (not the leg), and on the **dominant** side **aphasia** (Broca, Wernicke).", res: () => '<div class="ixARes2">' + A.kit.brainMini("ter", "mca") + box("Also MCA", ["Insula, auditory area, angular gyrus.", "Central branches: **lenticulostriate** arteries to the internal capsule ('arteries of cerebral haemorrhage')."]) + "</div>" },
        { id: "pca", label: "PCA stroke", show: ["t-pca"], info: "**Posterior cerebral** occlusion → opposite **homonymous hemianopia with macular sparing**. Its thalamic branches → the **thalamic syndrome** (opposite hemi-sensory loss + thalamic pain).", res: () => '<div class="ixARes2">' + A.kit.brainMini("ter", "pca") + box("Not PCA", ["The insula and the main lateral surface are **MCA**.", "Visual areas are **not** ACA."]) + "</div>" },
      ],
      secs: { "ph-motor-cortex#0": "homo", "ph-motor-cortex#1": "", "ph-sensory-pathways#3": "homo", "ph-speech#0": "", "ph-speech#1": "", "an-brain-blood#2": "aca", "an-brain-blood#3": "mca", "an-sulci-gyri#0": "", "an-sulci-gyri#2": "" },
      rules: [
        [/anterior cerebral artery|\bACA\b|paracentral/i, "aca"],
        [/middle cerebral artery|\bMCA\b/i, "mca"],
        [/posterior cerebral artery|\bPCA\b/i, "pca"],
        [/broca|wernicke|aphasi|angular gyrus/i, ""],
        [/homunculus|precentral|postcentral|area 4\b|motor area/i, "homo"],
      ],
    });
  })();

  /* ═══════════════ CIRCLE OF WILLIS (seen from below, front up) ═══════════════ */
  (function () {
    const V = {
      va: ["M206 420 C208 392 214 360 236 330", "M274 420 C272 392 266 360 244 330"],
      ba: ["M240 330 L240 196"],
      pica: ["M214 372 C190 366 170 360 150 372 C136 380 132 396 140 404", "M266 372 C290 366 310 360 330 372 C344 380 348 396 340 404"],
      asa: ["M222 356 C230 372 236 390 240 418", "M258 356 C250 372 244 390 240 418"],
      aica: ["M240 300 C216 300 186 296 164 306", "M240 300 C264 300 294 296 316 306"],
      sca: ["M240 208 C214 210 184 212 160 224", "M240 208 C266 210 296 212 320 224"],
      pca: ["M240 196 C226 190 210 186 198 184 C170 184 150 196 140 226", "M240 196 C254 190 270 186 282 184 C310 184 330 196 340 226"],
      pcom: ["M198 184 L198 130", "M282 184 L282 130"],
      ica: ["M198 130 L198 118", "M282 130 L282 118"],
      mca: ["M196 120 C170 116 140 110 90 112", "M284 120 C310 116 340 110 390 112"],
      aca: ["M200 118 C212 104 222 94 234 86 L234 30", "M280 118 C268 104 258 94 246 86 L246 30"],
      acom: ["M234 84 L246 84"],
      achor: ["M196 132 C184 144 176 152 166 166", "M284 132 C296 144 304 152 314 166"],
      pont: ["M240 280 L226 280 M240 262 L254 262 M240 244 L226 244 M240 232 L254 232"],
      lab: ["M188 298 C180 290 176 284 170 280", "M292 298 C300 290 304 284 310 280"],
    };
    const W = { va: 7, ba: 7, ica: 8, mca: 6, aca: 4.6, acom: 4, pcom: 3.4, pca: 4.6, sca: 3.6, aica: 3.2, pica: 3.4, asa: 2.4, achor: 2.2, pont: 1.6, lab: 1.6 };
    const art = (id, d, i) => ps(id + (V[id].length > 1 ? (i ? ".L" : ".R") : ""), d, "#ff3d5a", "#d9485f", W[id]);
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">BASE OF THE BRAIN · SEEN FROM BELOW · FRONT UP</text>' +
      '<text class="ttl" x="12" y="200">RIGHT</text><text class="ttl" x="468" y="200" text-anchor="end">LEFT</text>' +
      // faint landmarks: optic chiasma, stalk, mammillary bodies, peduncles, pons, medulla, cerebellum
      '<g pointer-events="none" opacity=".9">' +
      '<path d="M196 62 L240 106 L284 62 M240 106 L200 150 M240 106 L280 150" stroke="#5b6f88" stroke-width="7" stroke-linecap="round" opacity=".5"/>' +
      '<ellipse cx="240" cy="128" rx="7" ry="9" fill="#3a4c63"/><circle cx="232" cy="156" r="6" fill="#3a4c63"/><circle cx="248" cy="156" r="6" fill="#3a4c63"/>' +
      '<path d="M206 168 C214 178 222 186 228 196 M274 168 C266 178 258 186 252 196" stroke="#3a4c63" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M176 200 C176 190 304 190 304 200 L306 318 C306 330 174 330 174 318 Z" fill="#26364a"/>' +
      '<path d="M210 330 L270 330 L262 420 L218 420 Z" fill="#223246"/>' +
      '<path d="M110 330 C110 300 160 330 206 360 L206 420 C160 424 110 400 110 330Z M370 330 C370 300 320 330 274 360 L274 420 C320 424 370 400 370 330Z" fill="#1c2a3c"/>' +
      "</g>" +
      Object.entries(V).map(([id, ds]) => ds.map((d, i) => art(id, d, i)).join("")).join("") +
      '<circle cx="198" cy="124" r="8.5" fill="#ff3d5a" stroke="#fff" stroke-width="1.2" pointer-events="none"/><circle cx="282" cy="124" r="8.5" fill="#ff3d5a" stroke="#fff" stroke-width="1.2" pointer-events="none"/>' +
      // cranial nerves III (between PCA and SCA) and IV (winding round the peduncle with the SCA)
      ps("cn3.R", "M226 200 C214 198 196 196 176 190", "#d9ff43", "#e8e0b0", 2.6) + ps("cn3.L", "M254 200 C266 198 284 196 304 190", "#d9ff43", "#e8e0b0", 2.6) +
      ps("cn4.R", "M182 218 C170 214 160 210 150 204", "#d9ff43", "#c8c09a", 1.6) + ps("cn4.L", "M298 218 C310 214 320 210 330 204", "#d9ff43", "#c8c09a", 1.6) +
      T(88, 106, "MCA", "sm", "end") + T(228, 32, "ACA", "sm", "end") + T(240, 78, "ACom", "sm") + T(206, 158, "PCom", "sm", "start") + T(136, 238, "PCA", "sm", "end") + T(156, 228, "SCA", "sm", "end") + T(160, 316, "AICA", "sm", "end") + T(136, 414, "PICA", "sm", "end") + T(248, 262, "basilar", "sm", "start") + T(282, 436, "vertebral", "sm", "start") + T(172, 184, "III", "sm", "end") + T(212, 110, "ICA", "sm", "end") +
      '<g class="ov" data-x="ring"><path d="M234 84 L246 84 M246 86 C258 94 268 104 280 118 L282 184 C270 186 254 190 240 196 C226 190 210 186 198 184 L198 118 C212 104 222 94 234 86" fill="none" stroke="#d9ff43" stroke-width="12" stroke-opacity=".28" stroke-linejoin="round"/></g>';
    A.scene("willis", {
      title: "Circle of Willis · who feeds what",
      vb: "0 0 480 440",
      svg,
      intro: "Tap any artery. The **middle cerebral** is the one big branch that is **not** part of the circle.",
      parts: {
        va: ["Vertebral artery", "From the **subclavian**; through the foramen magnum. Branches: anterior and posterior spinal, **PICA** (largest). The two join at the **lower border of the pons** → basilar. Its **2nd part** runs up through the foramina transversaria (C6–C1); its **3rd part** lies in the **suboccipital triangle**."],
        ba: ["Basilar artery", "Pontine, labyrinthine, **AICA**, **superior cerebellar**; ends by dividing into the two **posterior cerebral** arteries."],
        pica: ["Posterior inferior cerebellar artery (PICA)", "Branch of the **vertebral**. Lateral medulla, inferior cerebellum, choroid plexus of the 4th ventricle. Occlusion → **lateral medullary (Wallenberg)** syndrome."],
        aica: ["Anterior inferior cerebellar artery (AICA)", "Branch of the **basilar** (not the vertebral)."],
        sca: ["Superior cerebellar artery", "Winds round the midbrain with the **trochlear (IV)** nerve: a small haematoma from it hits **IV**."],
        pca: ["Posterior cerebral artery", "Terminal branch of the **basilar**: occipital lobe (vision), inferior temporal, splenium; thalamic branches."],
        pcom: ["Posterior communicating artery", "Joins the ICA to the PCA: part of the circle."],
        ica: ["Internal carotid artery (terminal part)", "Divides **lateral to the optic chiasma** into the anterior and middle cerebral arteries. Part of the circle."],
        mca: ["Middle cerebral artery", "The largest branch of the ICA, in the lateral sulcus. **NOT part of the circle.** Lenticulostriate branches to the internal capsule."],
        aca: ["Anterior cerebral artery", "Branch of the ICA, runs medially **above the optic nerve**: the major vessel next to the chiasma. Medial surface, leg area."],
        acom: ["Anterior communicating artery", "Joins the two ACAs: part of the circle."],
        asa: ["Anterior spinal artery", "One artery made from a branch of **each vertebral**; anterior 2/3 of the cord and the medial medulla."],
        achor: ["Anterior choroidal artery", "From the ICA: the lower **posterior limb** and **retrolenticular** part of the internal capsule, choroid plexus of the inferior horn."],
        pont: ["Pontine branches", "From the basilar: the pons."],
        lab: ["Labyrinthine artery", "To the inner ear (usually from AICA or the basilar)."],
        cn3: ["Oculomotor nerve (III)", "Passes **between** the posterior cerebral and superior cerebellar arteries: the classic nerve of a PCA/PCom aneurysm."],
        cn4: ["Trochlear nerve (IV)", "Winds round the cerebral peduncle **with the superior cerebellar artery**."],
      },
      drill: ["va", "ba", "pica", "aica", "sca", "pca", "pcom", "ica", "mca", "aca", "acom", "asa", "achor"],
      sims: [
        { id: "ring", label: "⭕ The circle", on: ["acom", "aca", "ica", "pcom", "pca"], show: ["ring"], info: "The circle = **anterior communicating** + both **anterior cerebral (A1)** + terminal **internal carotids** + both **posterior communicating** + both **posterior cerebral** arteries. The **middle cerebral is not in it.** Its cortical branches anastomose **before** entering the brain; inside they are **end arteries**." },
        { id: "vb", label: "Vertebrobasilar", on: ["va", "ba", "pica", "aica", "sca", "pca", "asa", "pont", "lab"], info: "Medulla: vertebral, spinal arteries, **PICA**. Pons: basilar (pontine), **AICA**, superior cerebellar. Midbrain: **posterior cerebral** and **superior cerebellar**. The MCA supplies **no** part of the brainstem." },
        { id: "sca", label: "SCA bleed → IV", on: ["sca", "cn4"], info: "A small haematoma from the **superior cerebellar artery** most likely hits the **trochlear** nerve, which winds round the midbrain beside it. The **oculomotor** passes **between** the PCA and SCA." },
        { id: "pica", label: "PICA → Wallenberg", on: ["pica"], info: "**PICA** (or vertebral) occlusion → **lateral medullary syndrome**: same-side face pain/temperature loss, Horner, hoarseness and dysphagia (nucleus ambiguus), ataxia, vertigo; **opposite** body pain/temperature loss." },
      ],
      secs: { "an-brain-blood#0": "vb", "an-brain-blood#1": "ring", "an-brain-stem#5": "vb" },
      rules: [
        [/circle of willis|circulus arteriosus|communicating arter/i, "ring"],
        [/superior cerebellar/i, "sca"],
        [/\bpica\b|posterior inferior cerebellar|wallenberg|lateral medullary/i, "pica"],
        [/basilar|vertebral arter|aica|anterior inferior cerebellar/i, "vb"],
      ],
    });
  })();

  /* ═══════════════ INTERNAL CAPSULE (horizontal section of the right hemisphere, seen from above) ═══════════════ */
  (function () {
    const P = {
      al: [[304, 184], [318, 150], [332, 118], [350, 84], [372, 90], [356, 124], [342, 156], [326, 196]],
      genu: [[304, 184], [326, 196], [326, 204], [306, 202]],
      pl: [[306, 202], [326, 204], [342, 240], [360, 276], [376, 300], [356, 308], [340, 280], [322, 244]],
      rl: [[356, 308], [376, 300], [396, 330], [382, 340]],
      cd: [[262, 78], [300, 66], [346, 80], [330, 118], [314, 150], [300, 178], [280, 172], [266, 128]],
      lv: [[244, 76], [262, 78], [266, 128], [280, 172], [258, 180], [246, 140]],
      th: [[254, 208], [302, 206], [320, 244], [338, 290], [320, 314], [282, 300], [256, 256]],
      gp: [[330, 196], [354, 144], [370, 200], [352, 256]],
      pu: [[356, 124], [376, 92], [410, 104], [430, 150], [434, 204], [424, 256], [398, 294], [378, 298], [360, 276], [342, 240], [352, 256], [370, 200], [354, 144], [342, 156]],
      v3: [[246, 206], [252, 206], [252, 300], [246, 300]],
    };
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">HORIZONTAL SECTION · RIGHT HEMISPHERE · SEEN FROM ABOVE</text>' +
      '<text class="ttl" x="250" y="34">FRONT ↑</text><text class="ttl" x="12" y="200">MIDLINE</text>' +
      '<path d="M240 40 C320 30 440 60 460 150 C474 230 450 330 380 370 C330 396 270 392 240 380 Z" fill="#efe6ea" stroke="#c7b5c3" stroke-width="1.4"/>' +
      '<path d="M442 110 C452 160 452 240 438 290" stroke="#b69caf" stroke-width="6" fill="none" pointer-events="none"/><path d="M450 120 C458 170 458 236 446 280" stroke="#d6c4d1" stroke-width="2" fill="none" pointer-events="none"/>' +
      pf("lv", bl(P.lv), "#8fd3ff", "#1b2a3d") + pf("v3", bl(P.v3), "#8fd3ff", "#1b2a3d") +
      pf("cd", bl(P.cd), "#b39cff", "#c8b1c3") + pf("th", bl(P.th), "#66e9ff", "#c3a9bf") + pf("pu", bl(P.pu), "#ffb86b", "#c8b1c3") + pf("gp", bl(P.gp), "#ffe16d", "#d9ccd6") +
      pf("al", bl(P.al), "#7bed9f", "#f7f4f6") + pf("genu", bl(P.genu), "#d9ff43", "#f7f4f6") + pf("pl", bl(P.pl), "#ff5d8f", "#f7f4f6") + pf("rl", bl(P.rl), "#ffe16d", "#f7f4f6") +
      '<path class="ps" data-p="sl" d="M340 316 C360 334 372 350 380 362" style="--c:#ffb86b;--r:#b8a7b6;--w:5" stroke-dasharray="4 4"/>' +
      T(290, 124, "caudate", "sm dk") + T(288, 262, "thalamus", "sm dk") + T(404, 200, "putamen", "sm dk") + T(356, 206, "GP", "sm dk") + T(252, 110, "LV", "sm") + T(428, 150, "insula", "sm dk", "end") +
      '<path class="ld" d="M360 104 L402 72"/>' + T(404, 70, "anterior limb", "sm", "start") +
      '<path class="ld" d="M306 194 L262 196"/>' + T(260, 190, "genu", "sm", "end") +
      '<path class="ld" d="M352 284 L400 320"/>' + T(402, 324, "posterior limb", "sm", "start") +
      '<path class="ld" d="M384 326 L420 350"/>' + T(422, 354, "retrolenticular", "sm", "start") +
      T(382, 378, "sublenticular (below)", "sm", "start") +
      // somatotopy in the capsule: face at the genu, then arm, trunk, leg backwards
      pf("cl", "M434 118 C441 156 442 212 432 268 L429 266 C438 212 437 158 431 120 Z", "#d9ff43", "#8a7a86") +
      '<rect class="pf" data-p="cl" x="10" y="252" width="222" height="44" rx="6" style="--c:#d9ff43;--r:#13263c;--rs:#2f4a68"/>' + T(121, 264, "CLAUSTRUM (thin sliver under the insula):", "sm") + T(121, 275, "grey sheet between the external and extreme", "sm") + T(121, 286, "capsules; counted among the basal nuclei", "sm") +
      '<rect class="pf" data-p="amy" x="10" y="302" width="222" height="44" rx="6" style="--c:#ff9f43;--r:#13263c;--rs:#2f4a68"/>' + T(121, 314, "AMYGDALA: below this level, at the tip of the", "sm") + T(121, 325, "INFERIOR horn (temporal lobe); the TAIL of the", "sm") + T(121, 336, "caudate ends in it; not the anterior horn", "sm") +
      '<g class="ov" data-x="soma">' + [["face", 314, 198], ["arm", 324, 226], ["trunk", 336, 254], ["leg", 350, 282]].map(([t, x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3" fill="#07111d"/>' + T(x - 8, y + 3, t, "sm", "end")).join("") + "</g>" +
      '<g class="ov" data-x="bleed"><ellipse cx="338" cy="230" rx="30" ry="42" fill="#ff1f3d66" stroke="#ff5d7a" stroke-width="2"/></g>';
    A.scene("capsule", {
      title: "Internal capsule · what runs where, and what a capsular stroke does",
      vb: "0 0 480 392",
      svg,
      intro: "The V of white matter between caudate, thalamus and lentiform nucleus. Tap each part: front to back it carries **face → arm → leg → vision → hearing**.",
      parts: {
        al: ["Anterior limb", "Between the **head of the caudate** and the **lentiform nucleus**. Frontopontine fibres and the anterior thalamic radiation (thalamocortical/**corticothalamic**). A caudate-head + putamen tumour invades it. Blood: **Heubner** (ACA) + lenticulostriate."],
        genu: ["Genu", "The bend, at the level of the interventricular foramen: **corticobulbar (corticonuclear)** fibres to the cranial motor nuclei."],
        pl: ["Posterior limb", "Between the **thalamus** and the **lentiform**: **corticospinal** fibres (arm in front, leg behind) and the superior thalamic (sensory) radiation. Blood: **lenticulostriate** (MCA), lower part **anterior choroidal**."],
        rl: ["Retrolenticular part", "The **optic radiation** (from the lateral geniculate body): part of the **visual** pathway. Blood: anterior choroidal."],
        sl: ["Sublenticular part", "Below the lentiform: the **auditory radiation** (from the medial geniculate body)."],
        cd: ["Head of the caudate nucleus", "Bulges into the lateral wall/floor of the anterior horn of the lateral ventricle."],
        lv: ["Lateral ventricle (anterior horn)", ""],
        v3: ["Third ventricle", "Between the two thalami."],
        th: ["Thalamus", "Medial to the posterior limb."],
        gp: ["Globus pallidus", "Medial part of the lentiform nucleus."],
        pu: ["Putamen", "Lateral part of the lentiform nucleus; with the caudate = the striatum."],
        cl: ["Claustrum", "A thin sheet of grey matter **lateral to the putamen**, between the external and extreme capsules, deep to the insula. Anatomically it **is** counted among the basal nuclei (with the caudate, lentiform and amygdala)."],
        amy: ["Amygdaloid nucleus (amygdala)", "In the temporal lobe at the **tip of the inferior horn** of the lateral ventricle; the **tail of the caudate** ends by joining it. It is not in the wall of the anterior horn."],
      },
      drill: ["al", "genu", "pl", "rl", "cd", "th", "gp", "pu", "lv"],
      sims: [
        { id: "fibres", label: "🧵 What runs where", on: ["al", "genu", "pl", "rl", "sl"], show: ["soma"], info: "**Anterior limb**: frontopontine + thalamic radiation. **Genu**: corticobulbar. **Posterior limb**: corticospinal (arm → trunk → leg, front to back) + sensory radiation. **Retro**lenticular: **optic** radiation. **Sub**lenticular: **auditory** radiation." },
        { id: "stroke", label: "🩸 Capsular stroke", lost: ["genu", "pl"], show: ["bleed", "soma"], info: "A bleed from the **lenticulostriate** arteries ('arteries of cerebral haemorrhage') hits the genu and posterior limb, where the pyramidal fibres are packed → **opposite hemiplegia** (lower face, arm, leg), usually with **hemianaesthesia**. Spastic, hyperreflexic, **no marked wasting**.", res: () => '<div class="ixARes2">' + A.kit.bodyBox({ L: { up: "MD", arm: "MD", low: "MD", leg: "MD" } }, 0, [["#ff5d8f", "motor"], ["#4cc9f0", "sensory"]]) + box("Rules", ["**Left** capsule → **right** hemiplegia.", "Not a monoplegia: the fibres are too crowded to hit one limb.", "Retrolenticular part too → opposite **homonymous hemianopia**."]) + "</div>" },
        { id: "blood", label: "Blood supply", on: ["al", "genu", "pl", "rl"], info: "**Lenticulostriate** (MCA): most of the capsule. **Recurrent artery of Heubner** (ACA): anterior limb and genu. **Anterior choroidal** (ICA): lower posterior limb and retrolenticular part. The **PCA does not** supply it." },
      ],
      secs: { "an-white-matter#1": "", "an-white-matter#2": "fibres", "an-white-matter#3": "stroke", "ph-umn-lmn#1": "stroke", "an-basal-ganglia#1": "" },
      rules: [
        [/internal capsule|capsular/i, "fibres"],
        [/genu|retro-?lenticular|sub-?lenticular|optic radiation|auditory radiation/i, "fibres"],
        [/lenticulostriate|heubner|anterior choroidal/i, "blood"],
      ],
    });
  })();

  /* ═══════════════ BRAINSTEM: ventral view, cranial nerves, crossed syndromes ═══════════════ */
  (function () {
    // front view: the patient's RIGHT is on the viewer's LEFT
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">BRAINSTEM · FRONT VIEW</text>' +
      '<text class="ttl" x="12" y="220">RIGHT</text><text class="ttl" x="468" y="220" text-anchor="end">LEFT</text>' +
      // midbrain peduncles, pons, medulla, upper cord
      pf("ped.R", "M194 26 L236 26 L236 104 C226 108 214 110 206 106 Z", "#ffb86b", "#dcd0d8") + pf("ped.L", "M286 26 L244 26 L244 104 C254 108 266 110 274 106 Z", "#ffb86b", "#dcd0d8") +
      '<path d="M176 118 C180 98 300 98 304 118 C314 150 314 196 304 222 C296 240 184 240 176 222 C166 196 166 150 176 118Z" fill="#e7dde4" stroke="#bfaebb" stroke-width="1.2" pointer-events="none"/>' +
      '<path d="M184 140 C220 132 260 132 296 140 M180 166 C220 158 260 158 300 166 M180 192 C220 184 260 184 300 192" stroke="#d3c5cf" stroke-width="1.2" fill="none" pointer-events="none"/>' +
      '<path d="M240 104 L240 232" stroke="#bfaebb" stroke-width="3" pointer-events="none"/>' +
      pf("pons", "M184 124 C188 108 292 108 296 124 C304 152 304 194 296 216 C288 230 192 230 184 216 C176 194 176 152 184 124Z", "#ff5d8f", "#0000", ' data-h="1"') +
      '<path d="M196 236 C192 274 200 320 210 350 L270 350 C280 320 288 274 284 236 C260 230 220 230 196 236Z" fill="#e2d6df" stroke="#bfaebb" stroke-width="1.2" pointer-events="none"/>' +
      pf("pyr.R", "M226 240 L239 240 L238 334 L230 334 Z", "#ff5d8f", "#f1c9d8") + pf("pyr.L", "M254 240 L241 240 L242 334 L250 334 Z", "#ff5d8f", "#f1c9d8") +
      pf("oli.R", "M204 252 C214 248 220 262 218 284 C216 302 204 306 200 290 C196 272 198 256 204 252Z", "#ffe16d", "#efe3c2") + pf("oli.L", "M276 252 C266 248 260 262 262 284 C264 302 276 306 280 290 C284 272 282 256 276 252Z", "#ffe16d", "#efe3c2") +
      '<path class="ps" data-p="dec" d="M232 334 L248 356 M248 334 L232 356" style="--c:#ff5d8f;--r:#d9a3b8;--w:3"/>' +
      '<path d="M210 350 L270 350 C268 380 267 400 266 420 L214 420 C213 400 212 380 210 350Z" fill="#e7dde4" stroke="#bfaebb" stroke-width="1.2" pointer-events="none"/>' +
      // cranial nerves (patient's right on the left)
      ps("n3.R", "M228 98 C220 104 206 108 190 106", "#d9ff43", "#c9b98f", 2.6) + ps("n3.L", "M252 98 C260 104 274 108 290 106", "#d9ff43", "#c9b98f", 2.6) +
      ps("n4.R", "M196 70 C186 76 176 86 170 96", "#d9ff43", "#b5a883", 1.6) + ps("n4.L", "M284 70 C294 76 304 86 310 96", "#d9ff43", "#b5a883", 1.6) +
      ps("n5.R", "M180 160 C166 158 150 154 132 150", "#d9ff43", "#c9b98f", 6) + ps("n5.L", "M300 160 C314 158 330 154 348 150", "#d9ff43", "#c9b98f", 6) +
      ps("n6.R", "M232 236 C228 244 224 250 214 254 C200 258 170 250 150 238", "#d9ff43", "#c9b98f", 2) + ps("n6.L", "M248 236 C252 244 256 250 266 254 C280 258 310 250 330 238", "#d9ff43", "#c9b98f", 2) +
      ps("n7.R", "M186 232 C170 230 150 226 134 222", "#d9ff43", "#c9b98f", 2.8) + ps("n7.L", "M294 232 C310 230 330 226 346 222", "#d9ff43", "#c9b98f", 2.8) +
      ps("n8.R", "M180 240 C164 242 144 246 126 248", "#d9ff43", "#c9b98f", 3.4) + ps("n8.L", "M300 240 C316 242 336 246 354 248", "#d9ff43", "#c9b98f", 3.4) +
      ps("n9x.R", "M198 262 L150 266 M198 272 L148 278 M198 282 L148 290 M199 292 L150 302", "#d9ff43", "#c9b98f", 1.6) + ps("n9x.L", "M282 262 L330 266 M282 272 L332 278 M282 282 L332 290 M281 292 L330 302", "#d9ff43", "#c9b98f", 1.6) +
      ps("n12.R", "M224 262 C214 270 196 312 178 326 M224 274 C214 282 198 318 182 330 M224 286 C216 294 202 324 186 334", "#d9ff43", "#c9b98f", 1.4) + ps("n12.L", "M256 262 C266 270 284 312 302 326 M256 274 C266 282 282 318 298 330 M256 286 C264 294 278 324 294 334", "#d9ff43", "#c9b98f", 1.4) +
      [["III", 186, 104], ["IV", 166, 94], ["V", 128, 148], ["VII", 130, 220], ["VIII", 122, 252], ["VI", 146, 236], ["IX X XI", 144, 286], ["XII", 174, 338]].map(([t, x, y]) => T(x, y + 3, t, "sm", "end")).join("") +
      T(240, 64, "midbrain", "sm dk") + T(240, 170, "pons", "sm dk") + T(240, 300, "medulla", "sm dk") + T(240, 372, "pyramidal decussation", "sm dk") +
      // lesion zones (patient's right side = viewer's left)
      '<g class="ov" data-x="weber"><path d="M200 60 L238 60 L238 104 C224 110 206 108 196 100 Z" fill="#ff1f3d55" stroke="#ff5d7a" stroke-width="2"/></g>' +
      '<g class="ov" data-x="mpons"><path d="M204 180 L238 180 L238 234 L204 234 Z" fill="#ff1f3d55" stroke="#ff5d7a" stroke-width="2"/></g>' +
      '<g class="ov" data-x="mmed"><path d="M222 250 L239 250 L239 320 L222 320 Z" fill="#ff1f3d55" stroke="#ff5d7a" stroke-width="2"/></g>' +
      '<g class="ov" data-x="lmed"><path d="M186 250 L204 248 L208 316 L190 318 Z" fill="#ff1f3d55" stroke="#ff5d7a" stroke-width="2"/><text x="182" y="244" font-size="7" fill="#ff8fa3" text-anchor="end" font-weight="800">(deep, behind the olive)</text></g>';
    const res = (same, opp) => '<div class="ixARes2">' + box("Same side (right)", same) + box("Opposite side (left)", opp) + "</div>";
    A.scene("stem", {
      title: "Brainstem · cranial nerves and crossed syndromes",
      vb: "0 0 480 430",
      svg,
      intro: "Rule: a brainstem lesion hits a **cranial nerve on its own side** and the **pyramidal tract before it crosses** → **opposite** hemiplegia. The nerve tells you the level.",
      parts: {
        ped: ["Cerebral peduncle (crus)", "Carries the corticospinal and corticobulbar fibres through the midbrain."],
        pons: ["Basilar pons", "Pontine nuclei and the corticospinal fibres; the **middle cerebellar peduncle** comes off its sides."],
        pyr: ["Pyramid", "The corticospinal tract in the medulla, **before** it crosses."],
        dec: ["Pyramidal (motor) decussation", "Lower medulla: 80–90% of corticospinal fibres cross → lateral corticospinal tract. Every brainstem lesion is **above** it."],
        oli: ["Olive", "Inferior olivary nucleus: climbing fibres to the cerebellum. XII leaves in **front** of it, IX–X–XI **behind** it."],
        n3: ["Oculomotor (III)", "From the **interpeduncular fossa**, medial side of the peduncle."],
        n4: ["Trochlear (IV)", "The only nerve from the **back** of the brainstem; winds round the peduncle."],
        n5: ["Trigeminal (V)", "Large root from the **lateral pons** (middle peduncle)."],
        n6: ["Abducent (VI)", "From the **pontomedullary junction**, just beside the pyramid."],
        n7: ["Facial (VII)", "At the cerebellopontine angle, medial to VIII."],
        n8: ["Vestibulocochlear (VIII)", "At the cerebellopontine angle."],
        n9x: ["Glossopharyngeal, vagus, accessory (IX, X, XI)", "Rootlets from the **post-olivary sulcus** (behind the olive)."],
        n12: ["Hypoglossal (XII)", "Rootlets from the **pre-olivary sulcus**, between pyramid and olive."],
      },
      drill: ["n3", "n4", "n5", "n6", "n7", "n8", "n9x", "n12", "pyr", "oli", "dec", "ped"],
      sims: [
        { id: "weber", label: "Weber (midbrain)", show: ["weber"], on: ["n3.R", "ped.R"], info: "**Weber syndrome** (right midbrain): the **right III** + the **right peduncle** (pyramidal fibres before crossing).", res: () => res(["**III palsy**: ptosis, eye down and out (**lateral squint**), dilated pupil."], ["**Hemiplegia** including the lower face (UMN)."]) },
        { id: "mpons", label: "Medial pons", show: ["mpons"], on: ["n6.R", "pons"], info: "**Medial pontine (Millard–Gubler)** lesion on the right: the **right VI** (± VII) + the pyramidal fibres in the basilar pons. Left hemiplegia + right medial squint → **right pons**.", res: () => res(["**VI palsy**: **medial squint**, cannot abduct.", "± **LMN facial** palsy (VII)."], ["**Hemiplegia** (UMN)."]) },
        { id: "mmed", label: "Medial medulla", show: ["mmed"], on: ["n12.R", "pyr.R"], info: "**Medial medullary (Dejerine)** syndrome, anterior spinal/vertebral artery: the **right XII** rootlets + the **right pyramid** (+ medial lemniscus). LMN XII right + UMN hemiplegia left → **right medulla**.", res: () => res(["**XII LMN**: tongue **deviates to the lesion side**, wasting, fasciculation."], ["**Hemiplegia** (spares the face).", "Lost **position and vibration** (medial lemniscus)."]) },
        { id: "lmed", label: "Lateral medulla", show: ["lmed"], on: ["n9x.R", "oli.R"], info: "**Lateral medullary (Wallenberg)** syndrome, **PICA** or vertebral: no hemiplegia (the pyramid is spared).", res: () => res(["Face: lost **pain & temperature** (spinal V).", "**Horner** (descending sympathetic).", "**Hoarseness, dysphagia** (nucleus ambiguus, IX–X).", "**Ataxia** (inferior peduncle), vertigo, nystagmus."], ["Body: lost **pain & temperature** (spinothalamic)."]) },
      ],
      secs: { "an-brain-stem#0": "", "an-brain-stem#2": "", "an-brain-stem#3": "", "an-brain-stem#4": "", "an-brain-stem#6": "mmed" },
      rules: [
        [/weber|midbrain.{0,40}(hemipleg|oculomotor)|oculomotor.{0,60}hemipleg/i, "weber"],
        [/millard|medial squint.{0,60}hemipleg|hemipleg.{0,60}medial squint|abducent.{0,60}hemipleg/i, "mpons"],
        [/hypoglossal.{0,80}hemipleg|hemipleg.{0,80}hypoglossal|medial medullary|dejerine/i, "mmed"],
        [/lateral medullary|wallenberg/i, "lmed"],
        [/pre-?olivary|post-?olivary|emerge|attached to the (brain ?stem|pons|medulla)|superficial origin/i, ""],
      ],
    });
  })();

  /* ═══════════════ CSF: made, moved, absorbed, blocked ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">CSF CIRCULATION · SIDE VIEW (VENTRICLES PROJECTED)</text>' +
      // skull, brain, subarachnoid space, sinus
      '<path d="M60 250 C50 150 120 40 250 36 C380 36 450 130 440 250 C436 300 400 330 360 336 L140 336 C96 330 64 300 60 250Z" fill="#12263b" stroke="#2c4868" stroke-width="2"/>' +
      pf("sas", "M76 250 C68 160 130 58 250 54 C372 54 432 140 424 248 C420 292 392 318 356 322 L144 322 C104 318 80 292 76 250Z", "#66e9ff", "#1a3d5c") +
      '<path d="M88 250 C82 170 138 70 250 66 C362 66 416 146 410 246 C406 286 382 308 352 312 L150 312 C112 308 92 286 88 250Z" fill="#e9dfe6" stroke="#bfaebb" stroke-width="1.2" pointer-events="none"/>' +
      '<path d="M300 300 C300 262 350 250 390 262 C416 272 416 304 396 314 C370 326 318 326 300 300Z" fill="#ddd0da" stroke="#bfaebb" pointer-events="none"/>' + T(360, 298, "cerebellum", "sm dk") +
      '<path d="M226 270 C230 300 234 340 236 400 L262 400 C262 340 266 300 272 270Z" fill="#e2d6df" stroke="#bfaebb" pointer-events="none"/>' + T(250, 392, "cord", "sm dk") +
      pf("sss", "M232 36 L268 36 L250 58 Z", "#66e9ff", "#5b8fb9") + T(276, 34, "superior sagittal sinus", "sm", "start") +
      [200, 226, 274, 300].map((x) => '<path class="pf" data-p="ag" d="M' + x + " 60 C" + (x - 6) + " 50 " + (x + 6) + " 44 " + (x + 10) + ' 56Z" style="--c:#d9ff43;--r:#9ec1dd"/>').join("") +
      // ventricles
      pf("lv", "M150 150 C160 110 230 96 300 108 C350 118 376 146 374 186 C372 214 350 232 330 244 C318 252 312 268 322 284 C308 282 296 266 300 248 C306 226 330 210 340 188 C346 164 322 146 296 142 C256 136 212 140 190 158 C178 168 172 186 180 202 C166 196 146 180 150 150Z", "#8fd3ff", "#8fd3ff") +
      pf("ivf", "M196 196 C202 190 210 190 214 196 C210 202 202 202 196 196Z", "#d9ff43", "#fff") +
      pf("v3", "M204 196 C214 186 244 184 256 196 C262 212 254 236 240 242 C224 246 208 230 204 214Z", "#8fd3ff", "#8fd3ff") +
      pf("aq", "M246 240 C252 250 260 258 268 264 L272 260 C264 252 256 244 252 236Z", "#8fd3ff", "#8fd3ff") +
      pf("v4", "M266 262 C282 262 292 276 290 290 C288 300 276 306 266 306 C262 292 260 276 266 262Z", "#8fd3ff", "#8fd3ff") +
      '<path class="pf" data-p="mag" d="M266 306 L272 318 L262 318 Z" style="--c:#d9ff43;--r:#8fd3ff"/>' + '<circle class="pf" data-p="lus" cx="292" cy="282" r="4.5" style="--c:#d9ff43;--r:#8fd3ff"/>' +
      '<path class="pf" data-p="cc" d="M248 306 L252 306 L252 390 L248 390Z" style="--c:#d9ff43;--r:#8fd3ff"/>' +
      // choroid plexus (body and inferior horn of the lateral ventricle, roofs of the 3rd and 4th)
      '<g class="cp" pointer-events="none">' + ["M214 132 q6 -6 12 0 t12 0 t12 0 t12 0", "M322 238 q5 -5 10 0 t10 0", "M214 192 q6 -5 12 0 t12 0 t12 0", "M268 270 q5 -5 10 0 t10 0"].map((d) => '<path d="' + d + '" stroke="#ff5d7a" stroke-width="2.2" fill="none"/>').join("") + "</g>" +
      T(170, 124, "lateral ventricle", "sm dk", "end") + T(214, 212, "3rd", "sm dk", "end") + T(296, 254, "aqueduct", "sm dk", "start") + T(300, 296, "4th", "sm dk", "start") + T(170, 190, "interventricular foramen", "sm dk", "end") + T(252, 330, "median aperture → cisterna magna", "sm", "start") +
      // flow and blocks
      fl("flow", "M300 124 C250 116 206 130 205 196 C220 200 236 214 246 238 C256 250 262 258 268 264 C276 276 274 296 268 312 C262 330 250 332 240 326 C170 330 90 300 84 240 C80 150 150 70 232 60 L246 52", "#66e9ff", 3.2, "5s") +
      '<g class="ov" data-x="b-ivf"><circle cx="205" cy="196" r="10" fill="#ff1f3d99" stroke="#fff" stroke-width="1.6"/></g>' +
      '<g class="ov" data-x="b-aq"><circle cx="258" cy="252" r="10" fill="#ff1f3d99" stroke="#fff" stroke-width="1.6"/></g>' +
      '<g class="ov" data-x="b-out"><circle cx="268" cy="312" r="10" fill="#ff1f3d99" stroke="#fff" stroke-width="1.6"/><circle cx="292" cy="282" r="8" fill="#ff1f3d99" stroke="#fff" stroke-width="1.4"/></g>' +
      '<g class="ov" data-x="b-abs"><path d="M226 38 L274 38 L250 64Z" fill="#ff1f3d99" stroke="#fff" stroke-width="1.6"/></g>';
    A.scene("csf", {
      title: "CSF · made, moved, absorbed, and where it gets stuck",
      vb: "40 0 420 404",
      svg,
      intro: "Made by the **choroid plexus** (red), flows lateral → **interventricular foramen** → 3rd → **aqueduct** → 4th → **Magendie + Luschka** → subarachnoid space → **arachnoid granulations** → superior sagittal sinus.",
      parts: {
        lv: ["Lateral ventricle", "Its choroid plexus (body and **inferior horn**) makes most CSF (~70%). None in the anterior or posterior horns. Between the two anterior horns is the **septum pellucidum**; a slit between its two layers is the so-called '**fifth ventricle**' (cavum septi pellucidi), not a true ventricle."],
        ivf: ["Interventricular foramen (of Monro)", "Joins the **lateral and 3rd** ventricles."],
        v3: ["Third ventricle", "Choroid plexus in its **roof**."],
        aq: ["Cerebral aqueduct", "Joins the **3rd and 4th** ventricles; the narrowest point (aqueduct stenosis in infants)."],
        v4: ["Fourth ventricle", "Choroid plexus in its **roof**; communicates **directly** with the subarachnoid space."],
        mag: ["Median aperture (Magendie)", "4th ventricle → cisterna magna."],
        lus: ["Lateral apertures (Luschka)", "Two, at the lateral recesses."],
        cc: ["Central canal", "Continues down the cord."],
        sas: ["Subarachnoid space", "Between arachnoid and pia; CSF bathes the brain and cord (down to S2)."],
        ag: ["Arachnoid granulations", "**Aggregations of arachnoid villi** along the superior sagittal sinus: they **pass CSF into venous blood**. They do not produce CSF; in old age they pit the skull."],
        sss: ["Superior sagittal sinus", "Where CSF is absorbed."],
      },
      drill: ["lv", "ivf", "v3", "aq", "v4", "mag", "ag", "sss", "sas"],
      sims: [
        { id: "flow", label: "▶ Flow", show: ["flow"], info: "About **500 ml/day** is made; about **135–150 ml** is present at any time, so it turns over ~3× a day. Pressure ≈ **100 mm water**." },
        { id: "aq", label: "Aqueduct stenosis", show: ["b-aq"], lost: ["lv", "v3", "ivf"], info: "**Non-communicating (obstructive) hydrocephalus**: flow blocked **inside** the ventricles. The ventricles **above** the block (both lateral + 3rd) dilate; the 4th stays small." },
        { id: "monro", label: "Block at Monro", show: ["b-ivf"], lost: ["lv"], info: "Blocked **interventricular foramen** → only that **lateral ventricle** dilates." },
        { id: "outlets", label: "Outlets blocked", show: ["b-out"], lost: ["lv", "v3", "aq", "v4"], info: "Magendie and Luschka blocked → **all four** ventricles dilate (still non-communicating)." },
        { id: "absorb", label: "Absorption blocked", show: ["b-abs"], lost: ["lv", "v3", "aq", "v4", "sas"], info: "**Communicating hydrocephalus**: CSF reaches the subarachnoid space but is **not absorbed** (after meningitis or SAH). **Superior sagittal sinus thrombosis** (e.g. a depressed vertex fracture) → raised ICP → loss of consciousness." },
      ],
      secs: { "an-csf#0": "", "an-csf#1": "flow", "an-csf#2": "aq", "an-third-ventricle#0": "", "an-fourth-ventricle#1": "flow", "an-lateral-ventricle#0": "" },
      rules: [
        [/aqueduct|non-?communicating|obstructive hydroceph/i, "aq"],
        [/communicating hydroceph|sagittal sinus thromb|absorption|arachnoid (villi|granulation)/i, "absorb"],
        [/magendie|luschka|aperture/i, "outlets"],
        [/choroid plexus|cerebrospinal fluid|\bcsf\b/i, "flow"],
      ],
    });
  })();
})();
