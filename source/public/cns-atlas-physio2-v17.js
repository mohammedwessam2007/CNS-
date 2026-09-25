/* INTELLECTUALITY v17.3 · Physiology close-ups, part 2: pain (nociceptors, the two pathways, the analgesia system
 * and the gate), visceral and referred pain with headache, synaptic potentials, and the properties of synaptic
 * transmission. Drawn from Guyton-level physiology in the notes' wording (ph-pain, ph-pain-control,
 * ph-synaptic-potentials, ph-synapse-properties, ph-synapse-mechanism).
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { smooth } = A;
  const { T, pf, ps, fl } = A.kit;
  const blob = (pts) => smooth(pts, true);
  const ld = (x1, y1, x2, y2) => '<path class="ld" d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '"/>';
  const arr = (d, c) => '<path d="' + d + '" stroke="' + (c || "#d9ff43") + '" stroke-width="1.6" fill="none" marker-end="url(#ixArr)" pointer-events="none"/>';
  const cell = (id, x, y, w, h, lines, c, r) =>
    '<rect class="pf" data-p="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="--c:' + (c || "#d9ff43") + ";--r:" + (r || "#13263c") + ';--rs:#2f4a68"/>' +
    lines.map((t, i) => T(x + w / 2, y + 11 + i * 10, t, "sm")).join("");
  const blobAt = (id, x, y, rx, ry, c, r) => '<ellipse class="pf" data-p="' + id + '" cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" style="--c:' + c + ";--r:" + r + '"/>';

  /* ═══════════════ 1. PAIN: nociceptors → two pathways → cortex; the analgesia system; the gate ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">PAIN · FROM NOCICEPTOR TO CORTEX, AND THE BRAKES</text>' +
      // brain level
      '<path class="pf" data-p="ctx" d="M170 24 L350 24 L346 42 L174 42 Z" style="--c:#66e9ff;--r:#24384f"/>' + T(260, 36, "somatosensory cortex: WHERE", "sm") +
      blobAt("vpl", 214, 74, 24, 12, "#66e9ff", "#2a4a6a") + T(214, 77, "VPL", "sm") +
      blobAt("ilt", 290, 74, 30, 12, "#ff9f43", "#5a4030") + T(290, 77, "intralaminar", "sm") + T(252, 98, "thalamus: crude pain felt here", "sm mut") +
      blobAt("rf", 300, 128, 34, 12, "#ff9f43", "#5a4030") + T(300, 131, "reticular form.", "sm") + T(338, 131, "← keeps you awake", "sm mut", "start") +
      blobAt("pag", 452, 60, 38, 13, "#5ef0a0", "#1e4a36") + T(452, 63, "PAG (midbrain)", "sm") + T(452, 84, "periaqueductal grey", "sm mut") +
      blobAt("nrm", 452, 124, 38, 13, "#5ef0a0", "#1e4a36") + T(452, 127, "raphe magnus", "sm") + T(452, 148, "lower pons / upper medulla", "sm mut") +
      arr("M452 74 L452 110", "#5ef0a0") +
      // cord with the left dorsal horn's laminae
      '<ellipse cx="262" cy="236" rx="74" ry="50" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>' +
      '<path d="M246 196 L252 222 L244 252 L256 272 M278 196 L272 222 L280 252 L268 272" stroke="#5a4a6a" stroke-width="14" fill="none" stroke-linecap="round" opacity=".6" pointer-events="none"/>' +
      '<path class="pf" data-p="lam1" d="M232 190 C238 184 250 184 254 192 L250 198 C244 194 238 194 234 198 Z" style="--c:#ffd166;--r:#8a7a66"/>' +
      '<path class="pf" data-p="sg" d="M234 200 C240 196 248 196 252 202 L250 216 C244 214 238 214 234 216 Z" style="--c:#ff9f43;--r:#7a5a40"/>' +
      '<circle class="pf" data-p="enk" cx="264" cy="206" r="5.5" style="--c:#5ef0a0;--r:#2f8a5c"/>' + T(272, 196, "enkephalin cell", "sm", "start") +
      T(226, 186, "lamina I", "sm", "end") + T(228, 212, "subst. gelatinosa", "sm", "end") + T(228, 222, "(II–III)", "sm", "end") +
      // ascending tracts: cross, then up the right side
      ps("neo", "M254 192 L282 256 L300 262 C340 240 344 150 238 86", "#66e9ff", "#4a6f9a", 2.4) +
      ps("paleo", "M250 210 L284 262 L304 266 C352 244 360 180 318 140 M330 150 C320 116 304 96 296 86", "#ff9f43", "#8a6a4a", 1.8) +
      T(352, 190, "neospinothalamic", "sm", "start") + T(352, 200, "(fast)", "sm mut", "start") + T(362, 224, "paleospinothalamic", "sm", "start") + T(362, 234, "(slow)", "sm mut", "start") +
      // descending brake
      ps("desc", "M488 130 C504 190 470 250 400 250 C340 250 290 226 268 210", "#5ef0a0", "#2f8a5c", 2) + T(442, 264, "serotonin fibres descend", "sm") +
      // skin, nociceptors and the chemicals (left)
      '<text class="ttl" x="70" y="118" text-anchor="middle">IN THE TISSUE</text>' + T(70, 132, "red = stimulate · yellow = sensitize", "sm mut") +
      cell("bk", 8, 140, 60, 18, ["bradykinin"], "#ff5d7a") + cell("kp", 72, 140, 60, 18, ["K⁺ ↑"], "#ff5d7a") +
      cell("his", 8, 162, 60, 18, ["histamine"], "#ff5d7a") + cell("acid", 72, 162, 60, 18, ["H⁺ / acid"], "#ff5d7a") +
      cell("pg", 8, 184, 60, 18, ["prostaglandin"], "#ffd166") + cell("sp", 72, 184, 60, 18, ["substance P"], "#ffd166") +
      cell("isch", 8, 206, 124, 28, ["ISCHAEMIC pain: O₂ ↓,", "lactic acid, K⁺ (claudication)"], "#ff9f43") +
      '<rect x="8" y="260" width="124" height="36" rx="6" fill="#3a2530" pointer-events="none"/>' + T(70, 306, "injured skin", "sm mut") +
      ps("noc", "M34 282 L28 266 M34 282 L38 264 M34 282 L44 270 M88 282 L82 266 M88 282 L92 264 M88 282 L98 270", "#ff5d7a", "#b87a5c", 1.6) +
      // fibres into the dorsal horn
      ps("ad", "M36 266 C70 236 150 200 232 192", "#66e9ff", "#6f8aa8", 2.4) +
      ps("cf", "M88 266 C120 250 170 226 234 208", "#ff9f43", "#8a6a4a", 1.6) +
      ps("abeta", "M120 286 C170 290 220 262 260 212", "#5ef0a0", "#4f8f6f", 3) +
      // legend for the three fibres
      '<path class="ps" data-p="ad" d="M12 322 L40 322" style="--c:#66e9ff;--r:#6f8aa8;--w:3"/>' + T(46, 325, "Aδ: FAST, sharp → lamina I (glutamate)", "sm", "start") +
      '<path class="ps" data-p="cf" d="M12 336 L40 336" style="--c:#ff9f43;--r:#8a6a4a;--w:2"/>' + T(46, 339, "C: SLOW, burning → substantia gelatinosa (subst. P)", "sm", "start") +
      '<path class="ps" data-p="abeta" d="M12 350 L40 350" style="--c:#5ef0a0;--r:#4f8f6f;--w:3"/>' + T(46, 353, "Aβ touch (rubbing) → closes the GATE", "sm", "start") +
      // facts
      cell("hyp1", 296, 300, 108, 28, ["1° HYPERALGESIA:", "injured skin (sunburn)"], "#ff9f43") + cell("hyp2", 408, 300, 108, 28, ["2° HYPERALGESIA:", "healthy skin around"], "#ff9f43") +
      cell("cord", 296, 332, 220, 18, ["CORDOTOMY: anterolateral cut → opposite side relief"], "#b39cff") +
      cell("thr", 8, 366, 250, 18, ["THRESHOLD = the LOWEST intensity felt as pain"], "#66e9ff") +
      cell("react", 264, 366, 252, 18, ["REACTIONS: heart rate ↑, withdrawal, depression"], "#66e9ff") +
      fl("fast", "M36 266 C70 236 150 200 232 192 L254 192 L282 256 L300 262 C340 240 344 150 238 86", "#66e9ff", 3, "1.2s") +
      fl("slow", "M88 266 C120 250 170 226 234 208 L250 210 L284 262 L304 266 C352 244 360 180 318 140", "#ff9f43", 3, "3.6s") +
      fl("brake", "M452 74 L452 110 M488 130 C504 190 470 250 400 250 C340 250 290 226 268 210", "#5ef0a0", 3, "1.8s");
    A.scene("pain", {
      title: "Pain · nociceptors, the fast and slow pathways, and the brakes",
      vb: "0 0 520 392",
      svg,
      intro: "Bottom: the injury and its chemicals, the two fibres into the dorsal horn. Top: where each pathway ends, and the **analgesia system** coming back down.",
      parts: {
        noc: ["Nociceptors (free nerve endings)", "Not encapsulated. Plentiful in skin, periosteum, arterial walls, joints and the dura; **absent in brain tissue**. **Little or no adaptation** (they may even sensitize): the warning lasts as long as the damage. **More easily stimulated in injured tissue**."],
        bk: ["Bradykinin", "The **most painful** chemical released by damaged tissue."],
        kp: ["Rise in tissue K⁺", "**A rise in local K⁺ stimulates** nociceptors."],
        his: ["Histamine", "Released in tissue damage; stimulates nociceptors."],
        acid: ["Acids (H⁺)", "Stimulate nociceptors (and the gut wall)."],
        pg: ["Prostaglandins", "**Sensitize** nociceptors (why aspirin-type drugs relieve pain)."],
        sp: ["Substance P", "Sensitizes nociceptors, and is the transmitter of the **slow (C) pain** fibres in the substantia gelatinosa: the substance most linked with pain after injury."],
        isch: ["Ischaemic pain", "Too little blood flow → lactic acid, K⁺, bradykinin accumulate (e.g. **intermittent claudication**). Muscle-spasm pain is mainly **decreased O₂ supply**. It is slow (C-fibre) pain."],
        ad: ["Aδ fibres: fast pain", "Thin myelinated, **6–30 m/s**: **sharp, pricking, well localized** (Aδ localize the stimulus); mechanical and thermal; transmitter **glutamate**; end in **lamina I**."],
        cf: ["C fibres: slow pain", "Unmyelinated, **0.5–2 m/s**: **burning, aching, poorly localized**; chemical stimuli; transmitter **substance P**; end in the **substantia gelatinosa (II–III)**."],
        abeta: ["Aβ touch fibres: the gate", "**Gate control**: rubbing excites large **Aβ** fibres whose branches drive **inhibitory interneurons** that close the gate for pain (presynaptic inhibition); TENS, acupuncture and counter-irritants may work this way."],
        lam1: ["Lamina I", "Where the fast (Aδ) fibres end."],
        sg: ["Substantia gelatinosa (laminae II–III)", "Where the slow (C) fibres end; fast and slow fibres synapse on **different** neurons."],
        enk: ["Enkephalin interneurons", "Excited by the serotonin fibres from raphe magnus: enkephalin **blocks Ca²⁺ channels in the pain fibres' central terminals** (presynaptic inhibition) → less substance P released. Opioids (β-endorphin, enkephalins, dynorphin, morphine) act on the same receptors."],
        neo: ["Neospinothalamic tract (fast)", "Crosses and ascends in the **lateral spinothalamic** tract to the **VPL** thalamus → cortex: localized pain."],
        paleo: ["Paleospinothalamic tract (slow)", "Slow, ends mostly in the **brainstem reticular formation** and **intralaminar** thalamus: diffuse pain, suffering, arousal."],
        vpl: ["VPL thalamus", "Relays fast pain to the cortex. Crude pain is already felt at the thalamus."],
        ilt: ["Intralaminar thalamus", "Receives the slow pathway."],
        rf: ["Reticular formation", "Pain excites it → the **waking state** is maintained: pain keeps you awake."],
        ctx: ["Somatosensory cortex", "Localizes the pain (needs the fast pathway)."],
        pag: ["Periaqueductal grey (PAG)", "In the **midbrain** (and periventricular areas): the top of the **analgesia system**; electrical stimulation relieves pain. Turned on by pain itself (the bank's key), stress, emotion and opiates."],
        nrm: ["Nucleus raphe magnus", "Midline of the **lower pons / upper medulla** (not the dorsal horn): its fibres descend and release **serotonin** onto enkephalin interneurons."],
        desc: ["Descending serotonin fibres", "From raphe magnus to the dorsal horn."],
        cord: ["Anterolateral cordotomy", "Cutting the anterolateral quadrant interrupts the lateral spinothalamic tract: pain relief on the **opposite** side below the cut."],
        hyp1: ["Primary hyperalgesia", "In the **injured skin itself** (e.g. **sunburn**): inflammatory mediators (bradykinin, prostaglandins, histamine) **lower** the pain threshold."],
        hyp2: ["Secondary hyperalgesia", "In the **healthy skin around** the injury (around the flare): **central** facilitation in the cord (also in thalamic syndrome)."],
        thr: ["Pain threshold", "The **lowest** intensity of a stimulus that causes pain: about the same in everyone (the **reaction** differs); lowered by inflammation."],
        react: ["Reactions to pain", "Withdrawal reflexes, **raised heart rate**, emotional **depression**, and switching on the analgesia system. Nociceptors keep firing in chronic pain."],
      },
      al: {
        noc: ["nociceptor", "pain receptor", "free nerve ending", "little or no adaptation", "exhibit little", "quick to adapt", "injured tissue"],
        bk: ["bradykinin", "bradykinins"],
        kp: ["tissue k+", "k+ concentration", "rise in the local tissue k+", "potassium"],
        his: ["histamine"],
        acid: ["acid", "acids", "h+", "acid fluid"],
        pg: ["prostaglandin", "prostaglandins"],
        sp: ["substance p"],
        isch: ["ischemic pain", "ischaemic pain", "ischemia", "decreased oxygen", "oxygen supply", "claudication", "lactic acid", "muscle spasm"],
        ad: ["adelta", "fast pain", "sharp in character", "sharp", "pricking", "glutamate", "localization of a pain", "well localized"],
        cf: ["c fiber", "slow pain", "burning", "aching", "throbbing", "poorly localized"],
        abeta: ["abeta", "type a beta", "gate control", "gate theory", "rubbing", "tactile stimulation", "tens", "acupuncture", "counter irritant", "irritant to skin", "irritant"],
        lam1: ["lamina i"],
        sg: ["substantia gelatinosa", "lamina ii", "laminae ii iii"],
        enk: ["enkephalin", "endorphin", "opioid", "morphine", "opiate", "dynorphin", "presynaptic inhibition", "block transmission of pain"],
        neo: ["neospinothalamic", "lateral spinothalamic"],
        paleo: ["paleospinothalamic"],
        vpl: ["thalamus", "ventral posterolateral", "vpl"],
        ilt: ["intralaminar"],
        rf: ["reticular formation", "reticular activating", "waking state", "wakefulness", "keeps you awake"],
        ctx: ["somatosensory cortex", "perceived", "cerebral cortex"],
        pag: ["periaqueductal", "periaqueductal gray", "periaqueductal grey", "periventricular", "analgesia system", "analgesic system", "electrical stimulation"],
        nrm: ["raphe magnus", "nucleus raphe magnus", "serotonin", "paragigantocellularis"],
        desc: ["descending"],
        cord: ["cordotomy", "anterolateral cordotomy"],
        hyp1: ["primary hyperalgesia", "hyperalgesia", "sunburn", "sun burn", "inflammatory mediators"],
        hyp2: ["secondary hyperalgesia", "surrounding the flare", "healthy area", "central facilitation", "thalamic syndrome"],
        thr: ["pain threshold", "threshold", "lowest intensity", "highest intensity"],
        react: ["reactions to pain", "reaction to pain", "pain reactions"],
      },
      drill: ["noc", "bk", "kp", "pg", "ad", "cf", "lam1", "sg", "neo", "paleo", "rf", "pag", "nrm", "enk", "abeta"],
      sims: [
        { id: "fast", label: "▶ Fast pain", show: ["fast"], on: ["noc", "ad", "lam1", "neo", "vpl", "ctx"], info: "**Fast pain**: Aδ → **lamina I** (glutamate) → crosses → **neospinothalamic** → **VPL** → cortex: sharp, well localized." },
        { id: "slow", label: "▶ Slow pain", show: ["slow"], on: ["noc", "cf", "sg", "paleo", "rf", "ilt", "sp"], info: "**Slow pain**: C → **substantia gelatinosa** (substance P) → **paleospinothalamic** → reticular formation + intralaminar thalamus: burning, poorly localized, keeps you awake." },
        { id: "brake", label: "▶ Analgesia system", show: ["brake"], on: ["pag", "nrm", "desc", "enk"], info: "**PAG** (midbrain) → **raphe magnus** (lower pons/upper medulla) → **serotonin** fibres → dorsal-horn **enkephalin** interneurons → block Ca²⁺ channels of the pain fibre terminals → less substance P → pain transmission blocked." },
        { id: "gate", label: "Gate control", on: ["abeta", "enk", "sg"], info: "Rubbing: **Aβ** fibres excite inhibitory interneurons → the gate closes for the C fibres." },
        { id: "chem", label: "Chemicals", on: ["bk", "kp", "his", "acid", "pg", "sp", "isch", "noc"], info: "Tissue damage releases **bradykinin** (the most painful), **K⁺**, histamine, acids, serotonin; **prostaglandins** and substance P **sensitize**. Ischaemia adds lactic acid." },
      ],
      secs: { "ph-pain#0": "chem", "ph-pain#1": "fast", "ph-pain#2": "slow", "ph-pain#4": "chem", "ph-pain-control#0": "brake", "ph-pain-control#1": "gate" },
      rules: [
        [/raphe|periaqueductal|enkephalin|endorphin|opi|analgesi|serotonin/i, "brake"],
        [/gate|rubbing|tactile stimulation|counter/i, "gate"],
        [/bradykinin|prostaglandin|k\+|histamine|chemical|hyperalgesia|threshold/i, "chem"],
        [/slow pain|c fib|substance p|ischemi|burning|paleo/i, "slow"],
        [/fast pain|aδ|a[\s-]?delta|sharp|neo|locali/i, "fast"],
      ],
    });
  })();

  /* ═══════════════ 2. VISCERAL AND REFERRED PAIN · WHAT CAN HURT INSIDE THE SKULL ═══════════════ */
  (function () {
    const body =
      '<text class="ttl" x="120" y="14" text-anchor="middle">REFERRED PAIN · SAME DORSAL ROOT</text>' +
      '<circle cx="120" cy="42" r="18" fill="#2a3444" pointer-events="none"/>' +
      '<path d="M88 64 L152 64 L162 190 L78 190 Z" fill="#2a3444" pointer-events="none"/><path d="M88 66 L58 150 M152 66 L182 150 M96 190 L92 280 M144 190 L148 280" stroke="#2a3444" stroke-width="16" stroke-linecap="round" pointer-events="none"/>' +
      '<path class="pf" data-p="ref_heart" d="M86 74 L110 80 L108 108 L84 104 Z M70 96 L58 150 L66 152 L78 100 Z" style="--c:#ff5d7a;--r:#6d3a4a"/>' +
      '<path class="pf" data-p="ref_gb" d="M148 62 L164 62 L166 76 L150 76 Z" style="--c:#ffd166;--r:#6a5a3a"/>' +
      '<circle class="pf" data-p="ref_app" cx="120" cy="150" r="10" style="--c:#5ef0a0;--r:#2f5a46"/>' +
      '<path class="pf" data-p="ref_kid" d="M140 160 L156 170 L148 196 L132 188 Z" style="--c:#66e9ff;--r:#2a4a6a"/>' +
      '<path class="pf" data-p="ref_stom" d="M104 112 L136 112 L134 130 L106 130 Z" style="--c:#ff9f43;--r:#5a4030"/>' +
      T(36, 120, "heart → left", "sm", "middle") + T(36, 130, "chest + arm", "sm", "middle") + T(200, 60, "gallbladder →", "sm", "middle") + T(200, 70, "right shoulder", "sm", "middle") +
      T(60, 162, "appendix →", "sm", "middle") + T(60, 172, "umbilicus", "sm", "middle") + T(196, 182, "kidney/ureter", "sm", "middle") + T(196, 192, "→ loin, groin", "sm", "middle") + T(120, 104, "stomach → epigastrium", "sm", "middle") +
      cell("conv", 8, 206, 226, 30, ["visceral + skin afferents CONVERGE on the same", "dorsal-horn neurons: skin REMOTE from the organ"], "#d9ff43") +
      cell("vis", 8, 242, 226, 40, ["VISCERAL PAIN: poorly localized, C fibres with", "autonomic (sympathetic) afferents; nausea, VOMITING,", "sweating, BP/HR fall, reflex GUARDING of muscles"], "#b39cff") +
      '<text class="ttl" x="120" y="298" text-anchor="middle">WHAT HURTS A VISCUS</text>' +
      cell("dist", 8, 304, 72, 18, ["distension"], "#ff5d7a") + cell("colic", 84, 304, 72, 18, ["colic (spasm)"], "#ff5d7a") + cell("visch", 160, 304, 74, 18, ["ischaemia"], "#ff5d7a") +
      cell("vinf", 8, 326, 72, 18, ["inflammation"], "#ff5d7a") + cell("vacid", 84, 326, 72, 18, ["acid, chemicals"], "#ff5d7a") + cell("cut", 160, 326, 74, 18, ["CUTTING: no pain"], "#66e9ff", "#10263b");
    const head =
      '<text class="ttl" x="370" y="14" text-anchor="middle">HEADACHE · WHAT CAN HURT</text>' +
      '<path d="M270 150 C270 70 320 34 372 34 C430 34 470 76 470 140 C470 190 446 214 420 224 L330 224 C296 214 270 196 270 150 Z" fill="none" stroke="#e9e4da" stroke-width="5" pointer-events="none"/>' +
      '<path class="pf" data-p="dura" d="M282 150 C282 82 326 46 372 46 C424 46 458 82 458 140 L452 140 C452 88 420 54 372 54 C330 54 290 86 290 150 Z" style="--c:#ff5d7a;--r:#8a6a5a"/>' +
      '<path class="pf" data-p="brain" d="M300 150 C300 96 336 66 372 66 C414 66 446 98 446 140 C446 170 420 186 372 186 C330 186 300 176 300 150 Z" style="--c:#66e9ff;--r:#4a4a60"/>' + T(372, 124, "BRAIN TISSUE:", "sm") + T(372, 136, "insensitive to pain", "sm") +
      '<path class="pf" data-p="sinus" d="M340 50 L404 50 L404 58 L340 58 Z M448 150 L462 150 L462 176 L448 176 Z" style="--c:#b39cff;--r:#5a4a8a"/>' + T(372, 44, "venous sinuses", "sm") +
      '<path class="ps" data-p="mma" d="M296 176 C306 150 320 120 344 96" style="--c:#ff5d7a;--r:#c44b5f;--w:2.4"/>' + T(262, 104, "middle", "sm", "start") + T(262, 114, "meningeal a.", "sm", "start") +
      '<path class="ps" data-p="art" d="M340 196 C356 190 388 190 404 196" style="--c:#ff5d7a;--r:#c44b5f;--w:3"/>' + T(372, 206, "arteries at the base", "sm") +
      '<path class="pf" data-p="tent" d="M404 170 L448 178 L446 186 L402 180 Z" style="--c:#ffd166;--r:#8a7a66"/>' + T(466, 196, "tentorium", "sm", "end") +
      '<path class="ps" data-p="scalp" d="M268 90 C290 40 350 22 400 26 C440 30 470 60 478 100" style="--c:#ff9f43;--r:#b8646f;--w:4"/>' + T(252, 70, "scalp muscles", "sm", "start") +
      '<ellipse class="pf" data-p="nsin" cx="286" cy="200" rx="12" ry="9" style="--c:#ff9f43;--r:#3a4c63"/>' + T(262, 224, "nasal sinuses", "sm", "start") +
      cell("intra", 250, 236, 226, 40, ["INTRACRANIAL: meningitis, LOW CSF pressure (after", "LP), tumour, DILATED arteries (migraine, alcohol),", "distended sinuses, pressure on the tentorium"], "#ff5d7a") +
      cell("extra", 250, 282, 226, 30, ["EXTRACRANIAL: SPASM OF SCALP / NECK MUSCLES", "(tension), sinusitis, eye strain"], "#ff9f43");
    A.scene("visc", {
      title: "Visceral and referred pain · and what can hurt inside the skull",
      vb: "0 0 480 350",
      svg: () => body + head,
      intro: "Left: where each organ's pain is felt, and why. Right: the brain itself cannot hurt; its coverings and vessels can.",
      parts: {
        ref_heart: ["Heart → left chest and inner arm", "Cardiac afferents enter T1–T5; pain is felt in the skin of those segments."],
        ref_gb: ["Gallbladder → right shoulder tip", "Diaphragmatic irritation shares C3–C5 (phrenic) with the shoulder skin."],
        ref_app: ["Appendix → umbilicus (early)", "T10 visceral afferents."],
        ref_kid: ["Kidney / ureter → loin to groin", "T10–L1."],
        ref_stom: ["Stomach → epigastrium", "T6–T9."],
        conv: ["Why pain is referred", "Visceral and skin afferents **converge on the same dorsal-horn neurons** (same dorsal root), and the brain projects the pain to the **skin areas remote from the diseased viscus** that share its segment."],
        vis: ["Visceral pain", "**Poorly localized**; C fibres running with autonomic (mainly sympathetic) afferents; causes **nausea and reflex vomiting**, sweating, a fall in heart rate and BP, and **reflex contraction of the overlying skeletal muscle** (guarding). Adapts slowly; a counter-irritant on the skin may relieve it."],
        dist: ["Distension", "The typical visceral stimulus."],
        colic: ["Very strong contractions behind an obstruction", "Colic."],
        visch: ["Ischaemia", "E.g. angina."],
        vinf: ["Inflammation of the wall", "Sensitizes the visceral nociceptors."],
        vacid: ["Acid and chemicals", "Acid fluid stimulates them."],
        cut: ["Cutting with a sharp scalpel", "Does **not** hurt the gut (nor does crushing): viscera are insensitive to cutting."],
        dura: ["Dura (at the base), falx", "**Pain-sensitive**; low CSF pressure after lumbar puncture lets the brain sag and pull on it."],
        brain: ["Brain tissue", "**Insensitive to pain**: it has no nociceptors."],
        sinus: ["Venous sinuses and big veins", "Pain-sensitive walls; **distension** of the big sinuses causes headache."],
        mma: ["Middle meningeal artery", "Pain-sensitive."],
        art: ["Arteries at the base (circle of Willis)", "Pain-sensitive: **dilatation** of the cerebral arteries (migraine, **alcohol hangover**) causes headache."],
        tent: ["Tentorium cerebelli", "Pain-sensitive; pressure on it causes headache."],
        scalp: ["Scalp and neck muscles", "Their **spasm** gives **extracranial** (tension) headache."],
        nsin: ["Nasal sinuses", "Sinusitis gives **extracranial** headache."],
        intra: ["Intracranial causes of headache", "Meningitis, **decreased CSF pressure**, **brain tumours**, **dilated cerebral arteries** (migraine, alcohol), **distended venous sinuses**, **pressure on the tentorium**."],
        extra: ["Extracranial causes of headache", "**Spasm of the scalp and neck muscles**, **sinusitis**, eye strain, nasal congestion."],
      },
      al: {
        ref_heart: ["left arm", "heart", "angina", "cardiac"],
        ref_gb: ["shoulder", "gallbladder", "gall bladder"],
        ref_app: ["umbilicus", "appendix", "appendicitis"],
        ref_kid: ["groin", "kidney", "ureter", "loin"],
        ref_stom: ["epigastrium", "stomach"],
        conv: ["referred pain", "referred", "skin areas remote", "remote from the diseased viscera", "same dorsal root", "same segment", "converge", "convergence", "skin areas that just overlie", "overlie the diseased viscera", "deeply in the diseased viscera", "deep tissues close to the diseased viscera"],
        vis: ["visceral pain", "poorly localized", "reflex vomiting", "vomiting", "reflex contraction of overlying skeletal muscle", "guarding", "depressor", "pleura", "peritoneum", "parietal pain", "prolonged stimulation of touch receptors"],
        dist: ["distention", "distension"],
        colic: ["colicky pain", "colic", "very strong contractions", "obstruction"],
        visch: ["ischemia", "angina"],
        vinf: ["inflammation of the wall"],
        vacid: ["acid fluid"],
        cut: ["cutting", "sharp scalpel", "cutting stimuli", "cutting through their wall", "crushing"],
        dura: ["dura", "dura lining the brain", "falx"],
        brain: ["brain tissue", "brain itself"],
        sinus: ["venous sinuses", "big venous sinuses", "intracranial veins", "big intracranial veins", "distension of big venous sinuses"],
        mma: ["middle meningeal artery"],
        art: ["dilatation of the cerebral arteries", "cerebral arteries", "migraine", "alcohol intoxication", "alcohol"],
        tent: ["tentorium", "tentorium cerebelli", "pressure upon tentorium"],
        scalp: ["scalp muscles", "spasm of scalp muscles", "tension headache", "neck muscles"],
        nsin: ["nasal sinuses", "sinusitis"],
        intra: ["intracranial headache", "meningitis", "decreased csf pressure", "csf pressure", "brain tumors", "brain tumour", "lumbar puncture"],
        extra: ["extracranial", "eye strain"],
      },
      drill: ["ref_heart", "ref_gb", "ref_app", "conv", "vis", "cut", "brain", "dura", "sinus", "art", "scalp"],
      sims: [
        { id: "ref", label: "Referred pain", on: ["ref_heart", "ref_gb", "ref_app", "ref_kid", "ref_stom", "conv"], info: "Pain is felt in **skin remote from the organ that shares its dorsal root**, because visceral and skin afferents converge on the same dorsal-horn neurons." },
        { id: "gut", label: "What hurts a viscus", on: ["dist", "colic", "visch", "vinf", "vacid", "vis"], lost: ["cut"], info: "Viscera hurt with **distension**, **colic**, **ischaemia**, **inflammation** and **acid**; **cutting with a scalpel does not hurt**." },
        { id: "head", label: "Headache", on: ["dura", "sinus", "mma", "art", "tent", "intra", "extra", "scalp"], lost: ["brain"], info: "Pain-sensitive: dura at the base, venous sinuses, middle meningeal and basal arteries, tentorium; **brain tissue is insensitive**. Scalp-muscle spasm and sinusitis give **extracranial** headache." },
      ],
      secs: { "ph-pain#3": "ref", "ph-pain#5": "head" },
      rules: [
        [/headache|intracranial|brain tissue|dura|tentorium|scalp/i, "head"],
        [/cutting|distension|distention|gut|git|urinary|viscus/i, "gut"],
        [/referred|visceral/i, "ref"],
      ],
    });
  })();

  /* ═══════════════ 3. SYNAPTIC POTENTIALS: EPSP, IPSP, summation, presynaptic inhibition ═══════════════ */
  (function () {
    const Y = (mv) => 80 - mv * 1.45; // +30 → 36.5; 0 → 80; −65 → 174; −70 → 181.5
    const x0 = 40;
    const svg = () =>
      '<text class="ttl" x="160" y="14" text-anchor="middle">POSTSYNAPTIC MEMBRANE POTENTIAL</text>' +
      '<path d="M' + x0 + " 28 L" + x0 + " 214 L284 214" + '" stroke="#6f8aa8" stroke-width="1.4" fill="none" pointer-events="none"/>' +
      [30, 0, -50, -65, -80].map((v) => T(x0 - 4, Y(v) + 3, v + "", "sm mut", "end")).join("") + T(14, 24, "mV", "sm mut", "start") + T(170, 228, "time →", "sm mut") +
      '<path class="ps" data-p="rmp" d="M' + x0 + " " + Y(-65) + " L284 " + Y(-65) + '" style="--c:#66e9ff;--r:#4a6f9a;--w:1.2" stroke-dasharray="4 3"/>' + T(286, Y(-65) + 3, "rest", "sm", "start") +
      '<path class="ps" data-p="thr" d="M' + x0 + " " + Y(-50) + " L284 " + Y(-50) + '" style="--c:#ffd166;--r:#a88a4e;--w:1.2" stroke-dasharray="4 3"/>' + T(286, Y(-50) + 3, "thresh.", "sm", "start") +
      // single EPSP (subthreshold), two summed EPSPs that fire, an IPSP
      '<path class="ps" data-p="epsp" d="M50 ' + Y(-65) + " L70 " + Y(-65) + " C74 " + Y(-55) + " 80 " + Y(-55) + " 90 " + Y(-60) + " C96 " + Y(-63) + " 104 " + Y(-65) + " 110 " + Y(-65) + '" style="--c:#5ef0a0;--r:#5ef0a0;--w:2.2"/>' + T(80, Y(-50) - 6, "EPSP +10 mV", "sm") +
      '<path class="ps" data-p="tsum" d="M120 ' + Y(-65) + " L130 " + Y(-65) + " C134 " + Y(-58) + " 138 " + Y(-58) + " 142 " + Y(-60) + " C146 " + Y(-52) + " 150 " + Y(-50) + ' 154 ' + Y(-50) + '" style="--c:#5ef0a0;--r:#5ef0a0;--w:2.2"/>' +
      '<path class="ps" data-p="ap" d="M154 ' + Y(-50) + " L160 " + Y(30) + " L168 " + Y(-78) + " C174 " + Y(-72) + " 180 " + Y(-66) + " 190 " + Y(-65) + '" style="--c:#ff9f43;--r:#ff9f43;--w:2.2"/>' + T(160, Y(30) - 4, "action potential (all-or-none)", "sm") + T(136, Y(-40) + 3, "summation", "sm", "end") +
      '<path class="ps" data-p="ipsp" d="M210 ' + Y(-65) + " L226 " + Y(-65) + " C230 " + Y(-73) + " 236 " + Y(-73) + " 246 " + Y(-70) + " C254 " + Y(-67) + " 262 " + Y(-65) + ' 280 ' + Y(-65) + '" style="--c:#ff5d7a;--r:#ff5d7a;--w:2.2"/>' + T(240, Y(-78) + 2, "IPSP: away from", "sm") + T(240, Y(-78) + 12, "threshold", "sm");
    const right =
      cell("epsp_m", 328, 22, 148, 58, ["EPSP: ligand-gated CATION", "channels (Na⁺ in) → local,", "PARTIAL depolarization. Graded,", "no all-or-none, not propagated,", "CAN summate"], "#5ef0a0") +
      cell("ipsp_m", 328, 86, 148, 38, ["IPSP: GABA / glycine open Cl⁻", "(in) or K⁺ (out) channels →", "HYPERpolarization"], "#ff5d7a") +
      cell("gpsp", 328, 130, 148, 38, ["GRAND PSP = algebraic sum:", "EPSP > IPSP → more excitable;", "EPSP + IPSP → depends on the sum"], "#ffd166") +
      cell("rec", 328, 174, 148, 28, ["the RECEPTOR decides excite", "or inhibit (ACh: muscle vs heart)"], "#66e9ff");
    // presynaptic inhibition: axo-axonic GABA synapse on the terminal
    const pre =
      '<text class="ttl" x="160" y="250" text-anchor="middle">PRESYNAPTIC INHIBITION (AXO-AXONIC)</text>' +
      '<path d="M40 290 L120 290" stroke="#c9b8a8" stroke-width="4" pointer-events="none"/>' + '<circle class="pf" data-p="pinh" cx="128" cy="290" r="12" style="--c:#ff5d7a;--r:#a86a4a"/>' + T(128, 314, "terminal", "sm") +
      '<rect x="146" y="272" width="60" height="36" rx="8" fill="#4b3b5c" pointer-events="none"/>' + T(176, 322, "postsynaptic", "sm") +
      '<path d="M128 240 L128 262" stroke="#ff5d7a" stroke-width="3" pointer-events="none"/><circle class="pf" data-p="pinh" cx="128" cy="266" r="5" style="--c:#ff5d7a;--r:#ff5d7a"/>' + T(136, 262, "3rd neuron: GABA", "sm", "start") +
      T(228, 282, "→ less Ca²⁺ in", "sm", "start") + T(228, 294, "→ LESS transmitter", "sm", "start") + T(228, 306, "(post NOT hyperpol.)", "sm", "start") +
      cell("pfac", 328, 250, 148, 38, ["PRESYNAPTIC FACILITATION:", "excitatory 3rd neuron (serotonin)", "→ longer spike, more Ca²⁺"], "#5ef0a0") +
      cell("gatec", 328, 294, 148, 28, ["used in the GATE theory", "of pain control"], "#ffd166");
    A.scene("psp", {
      title: "Synaptic potentials · EPSP, IPSP, summation, presynaptic inhibition",
      vb: "0 0 480 334",
      svg: () => svg() + right + pre,
      intro: "The trace shows one EPSP that fails, two that **summate** and fire, and an IPSP that moves **away** from threshold.",
      parts: {
        rmp: ["Resting membrane potential", "About −65 to −70 mV. Na⁺ and Cl⁻ are higher **outside**, K⁺ higher **inside**; the K⁺ gradient pushes K⁺ out. A more negative RMP makes the neuron **less** excitable."],
        thr: ["Threshold (firing level)", "When summed EPSPs reach it at the axon hillock, voltage-gated Na⁺ channels open and an action potential fires."],
        epsp: ["EPSP", "A **local, partial depolarization**: e.g. **−65 → −55 mV = an EPSP of +10 mV**. Graded, no reversal of polarity, not propagated, outlasts the presynaptic spike."],
        tsum: ["Summation", "**Temporal**: repetitive stimulation of one presynaptic neuron; **spatial**: many at once. Summed EPSPs can reach threshold."],
        ap: ["Action potential", "All-or-none, propagated, with overshoot: what an EPSP is **not**."],
        ipsp: ["IPSP", "A **hyperpolarization** that moves the potential **away from threshold**. IPSPs can summate too."],
        epsp_m: ["How an EPSP is made", "The transmitter opens **ligand-gated** cation (mainly Na⁺) channels; Na⁺ and K⁺ currents flow together, net depolarization. (One bank key says voltage-gated; standard teaching is ligand-gated.)"],
        ipsp_m: ["How an IPSP is made", "**GABA** or **glycine** open ligand-gated **Cl⁻** channels (Cl⁻ in) or **K⁺** channels (K⁺ out): opening ligand-gated Cl⁻ channels **inhibits**."],
        gpsp: ["Grand postsynaptic potential", "The **algebraic sum** of all EPSPs and IPSPs at a moment: EPSP > IPSP → more excitable; IPSP > EPSP → less; EPSP and IPSP together → the result depends on their summation."],
        rec: ["The receptor decides", "Whether a transmitter excites or inhibits depends on the **function of its postsynaptic receptor**, not the molecule."],
        pinh: ["Presynaptic inhibition", "A **third (inhibitory) neuron** releases **GABA** onto **GABA receptors in the presynaptic terminal** → fewer Ca²⁺ channels open → **less transmitter released**. The postsynaptic membrane is not hyperpolarized."],
        pfac: ["Presynaptic facilitation", "An **excitatory third neuron** (e.g. **serotonin**) prolongs the presynaptic spike → more Ca²⁺ → more release."],
        gatec: ["Gate control uses presynaptic inhibition", "The Aβ-driven interneurons close the pain gate by presynaptic inhibition."],
      },
      al: {
        rmp: ["resting membrane", "rmp", "resting", "neuronal membrane at rest", "more negative value"],
        thr: ["threshold", "firing level", "firing"],
        epsp: ["epsp", "excitatory postsynaptic", "excitatory post synaptic", "partial depolarization", "state of partial depolarization", "depolarization", "+10", "65mv to 55mv"],
        tsum: ["summation", "summated", "temporal summation", "spatial summation", "temporarily summated", "repetitive presynaptic stimulation", "repetitive of a single"],
        ap: ["action potential", "all or none", "propagated", "reversal of polarity", "initiation of an action potential", "initiates an action potential"],
        ipsp: ["ipsp", "inhibitory postsynaptic", "inhibitory post synaptic", "hyperpolarization", "hyperpolarized", "away from threshold"],
        epsp_m: ["ligand gated", "na+ channels", "cation channel", "graded", "graded potential", "voltage gated"],
        ipsp_m: ["cl- channels", "chloride", "k+ channels", "opening of k+", "ligand gated cl", "gaba", "glycine"],
        gpsp: ["grand post synaptic", "grand postsynaptic", "algebraic", "epsp and ipsp", "simultaneously", "summation of their effects"],
        rec: ["post synaptic receptor", "postsynaptic receptor", "function of its post synaptic receptor", "excitatory or inhibitory action"],
        pinh: ["presynaptic inhibition", "axoaxonic", "axo axonic", "third neuron", "3rd neuron", "inhibitory 3rd neuron", "gaba receptors in the presynaptic", "decreased release", "decrease in the release", "release of neurotransmitters"],
        pfac: ["presynaptic facilitation", "excitatory presynaptic", "excitatory 3rd neuron", "serotonin"],
        gatec: ["gate theory", "gate control"],
      },
      drill: ["rmp", "thr", "epsp", "tsum", "ap", "ipsp", "pinh", "pfac", "gpsp"],
      sims: [
        { id: "ep", label: "EPSP", on: ["epsp", "epsp_m", "tsum"], info: "**EPSP**: ligand-gated cation channels → local partial depolarization (−65 → −55 = +10 mV). Graded, not propagated, **summates**." },
        { id: "ip", label: "IPSP", on: ["ipsp", "ipsp_m"], info: "**IPSP**: GABA/glycine → Cl⁻ in or K⁺ out → hyperpolarization, **away** from threshold." },
        { id: "pre", label: "Presynaptic inhibition", on: ["pinh", "gatec"], info: "A 3rd neuron's **GABA** on the presynaptic terminal → less Ca²⁺ → **less transmitter**. Used in the gate control of pain." },
      ],
      secs: { "ph-synaptic-potentials#0": "ep", "ph-synaptic-potentials#1": "ip", "ph-synaptic-potentials#2": "pre" },
      rules: [
        [/presynaptic|axo-?axonic|third neuron|3rd neuron/i, "pre"],
        [/ipsp|inhibitory post|hyperpolar|cl- channel|chloride/i, "ip"],
        [/epsp|excitatory post|depolariz|summat/i, "ep"],
      ],
    });
  })();

  /* ═══════════════ 4. SYNAPTIC TRANSMISSION: properties, factors, toxins, termination ═══════════════ */
  (function () {
    const pool =
      '<text class="ttl" x="120" y="14" text-anchor="middle">NEURONAL POOLS</text>' +
      '<circle cx="40" cy="60" r="8" fill="#ff9f43"/>' + ['M48 60 L100 34', 'M48 60 L100 60', 'M48 60 L100 86'].map((d) => '<path d="' + d + '" stroke="#ff9f43" stroke-width="2" pointer-events="none"/>').join("") + [34, 60, 86].map((y) => '<circle cx="106" cy="' + y + '" r="6" fill="#4a6f9a"/>').join("") +
      '<rect class="pf" data-p="div" x="20" y="96" width="100" height="18" rx="6" style="--c:#ff9f43;--r:#13263c;--rs:#2f4a68"/>' + T(70, 108, "DIVERGENCE: spreads", "sm") +
      [34, 60, 86].map((y) => '<circle cx="150" cy="' + y + '" r="6" fill="#4a6f9a"/><path d="M156 ' + y + ' L208 60" stroke="#5ef0a0" stroke-width="2"/>').join("") + '<circle cx="214" cy="60" r="8" fill="#5ef0a0"/>' +
      '<rect class="pf" data-p="conv" x="132" y="96" width="100" height="18" rx="6" style="--c:#5ef0a0;--r:#13263c;--rs:#2f4a68"/>' + T(182, 108, "CONVERGENCE: selects", "sm");
    const board =
      cell("oneway", 8, 124, 110, 38, ["ONE-WAY: pre → post only", "(transmitter only from", "the knob)"], "#66e9ff") +
      cell("delay", 124, 124, 110, 38, ["SYNAPTIC DELAY:", "minimum ≈ 0.5 ms in the", "CNS (release → channels)"], "#66e9ff") +
      cell("fatigue", 8, 168, 110, 38, ["FATIGUE: transmitter runs", "out: synthesis < release", "(limits epileptic fits)"], "#66e9ff") +
      cell("ptp", 124, 168, 110, 38, ["POST-TETANIC", "POTENTIATION: repetitive", "stimulation → more Ca²⁺"], "#66e9ff") +
      cell("facil", 8, 212, 110, 38, ["FACILITATION: inputs", "apart (fringes overlap);", "OCCLUSION: inputs close"], "#66e9ff") +
      cell("plast", 124, 212, 110, 38, ["PLASTICITY: changes with", "the body's needs", "(learning, memory)"], "#66e9ff") +
      cell("term", 8, 256, 226, 30, ["ENDING IT: enzymes (acetylcholinesterase), REUPTAKE", "into the PRESYNAPTIC terminal, diffusion"], "#b39cff") +
      cell("rest", 8, 292, 226, 40, ["RESTING MEMBRANE: Na⁺ and Cl⁻ HIGH OUTSIDE,", "K⁺ HIGH INSIDE; the K⁺ gradient pushes K⁺ OUT;", "more negative RMP → LESS excitable"], "#b39cff");
    const right =
      '<text class="ttl" x="360" y="14" text-anchor="middle">WHAT CHANGES TRANSMISSION</text>' +
      cell("up", 246, 22, 228, 50, ["↑ EXCITABILITY: ALKALOSIS (overbreathing → fits),", "HYPOCALCAEMIA (tetany), caffeine, theophylline,", "STRYCHNINE (blocks glycine receptors →", "convulsions)"], "#5ef0a0") +
      cell("down", 246, 78, 228, 50, ["↓ TRANSMISSION: ACIDOSIS (diabetic coma),", "HYPOXIA (seconds → unconscious),", "HYPOGLYCAEMIA, HYPERCALCAEMIA, anaesthetics,", "botulinum"], "#ff5d7a") +
      '<text class="ttl" x="360" y="146" text-anchor="middle">TOXINS</text>' +
      cell("tet", 246, 154, 228, 40, ["TETANUS toxin: blocks RELEASE of the inhibitory", "transmitters GABA and glycine → SPASTIC", "paralysis, lockjaw, convulsions"], "#ff9f43") +
      cell("bot", 246, 200, 228, 30, ["BOTULINUM toxin: blocks RELEASE of ACh at the", "neuromuscular junction → FLACCID paralysis"], "#ff9f43") +
      cell("stry", 246, 236, 228, 30, ["STRYCHNINE: blocks glycine RECEPTORS", "(competitive) → convulsions"], "#ff9f43") +
      cell("link", 246, 272, 228, 30, ["CNS–PNS links: somatic motor, preganglionic, sensory;", "NOT postganglionic autonomic fibres"], "#66e9ff") +
      cell("mict", 246, 308, 228, 30, ["MICTURITION reflex: bladder stretch, brainstem", "centres, cortex (NO voluntary brainstem control)"], "#66e9ff");
    A.scene("synprop", {
      title: "Synaptic transmission · its properties, what speeds it up or depresses it, and the toxins",
      vb: "0 0 480 342",
      svg: () => pool + board + right,
      intro: "A one-page map of how a synapse behaves. Tap a card for the detail.",
      parts: {
        div: ["Divergence", "One fibre to many neurons: **spreads (distributes)** a signal."],
        conv: ["Convergence", "Many fibres onto one neuron: spatial summation; it **helps select important signals and ignore unimportant ones**."],
        oneway: ["One-way conduction", "Impulses pass only **pre → post**: transmitter is released only from the knob; the receptors are postsynaptic."],
        delay: ["Synaptic delay", "Minimum **≈ 0.5 ms** in the CNS: Ca²⁺ entry, release, diffusion, binding and channel opening; not set by the transmitter type or receptor number."],
        fatigue: ["Synaptic fatigue", "With repetitive stimulation the store runs out: an **imbalance between the rates of synthesis and release**. It limits the spread of epileptic fits."],
        ptp: ["Post-tetanic potentiation", "Repetitive stimulation leaves the terminal with more Ca²⁺ → bigger responses."],
        facil: ["Facilitation vs occlusion", "Two inputs whose discharge zones are **apart**: their subliminal fringes overlap → more neurons fire than the sum = **facilitation**. Two inputs **close together**: overlapping zones → fewer than the sum = occlusion."],
        plast: ["Plasticity", "Transmission **can be changed according to body needs**: the basis of learning and memory."],
        term: ["Termination", "**Degradation by enzymes** (acetylcholinesterase), **reuptake into the presynaptic terminal** (noradrenaline, serotonin), diffusion. Not by receptor block, not by uptake into the postsynaptic neuron."],
        rest: ["Resting membrane", "**Na⁺ higher outside**, **K⁺ higher inside**, **Cl⁻ higher outside**; the **K⁺ gradient pushes K⁺ out**. Hyperpolarization (more negative) → **less** excitable."],
        up: ["What raises excitability", "**Alkalosis** (overbreathing can cause convulsions), **hypocalcaemia** (tetany), caffeine, theophylline, **strychnine**. So 'alkalosis depresses transmission' is false."],
        down: ["What depresses transmission", "**Acidosis** (diabetic coma), **hypoxia** (seconds), **hypoglycaemia**, **hypercalcaemia**, anaesthetics, botulinum toxin."],
        tet: ["Tetanus toxin", "Enters the CNS and **blocks release of the inhibitory transmitters GABA and glycine** → unopposed motor neurons → **spastic** paralysis, lockjaw, convulsions. It does not compete at receptors."],
        bot: ["Botulinum toxin", "**Blocks ACh release** at the neuromuscular junction → **flaccid** paralysis."],
        stry: ["Strychnine", "**Blocks glycine receptors** (competitive) → convulsions."],
        link: ["What links the CNS to the periphery", "Somatic motor, **preganglionic** autonomic and sensory fibres. **Postganglionic** autonomic fibres run from a peripheral ganglion to the organ: they do **not** connect the CNS."],
        mict: ["Micturition reflex", "Shaped by bladder-wall stretch receptors, facilitatory and inhibitory **brainstem** centres, and **voluntary control from the cortex**; there is no voluntary control from the brainstem."],
      },
      al: {
        div: ["divergence", "one neuron stimulates many"],
        conv: ["convergence", "neuronal pool", "selection of important signals"],
        oneway: ["one direction", "one way", "one-way conduction", "from pre to post", "pre to post synaptic"],
        delay: ["synaptic delay", "delay", "0 5 millisecond", "0 5 msec", "minimal delay"],
        fatigue: ["fatigue", "synaptic fatigue", "synthesis and release", "depletion"],
        ptp: ["potentiation", "post tetanic", "repetitive stimulation", "synaptic potentiation"],
        facil: ["facilitation", "occlusion", "subliminal fringe", "away from each other"],
        plast: ["plasticity", "body needs", "according to body needs"],
        term: ["terminated", "termination", "acetylcholinesterase", "reuptake", "enzyme", "degradation"],
        rest: ["resting membrane", "extracellular na+", "intracellular", "concentration of cl", "k+ tends to move out", "concentration gradient for k+", "extracellular ca2+"],
        up: ["alkalosis", "hypocalcemia", "hypocalcaemia", "caffeine", "theophylline", "increases the synaptic transmission", "stimulated by"],
        down: ["acidosis", "hypoxia", "hypoglycemia", "hypoglycaemia", "hypercalcemia", "hypercalcaemia", "anesthetic", "depression", "depresses"],
        tet: ["tetanus toxin", "tetanus", "lockjaw", "spastic paralysis"],
        bot: ["botulinum", "botulin", "botulism", "flaccid paralysis"],
        stry: ["strychnine", "glycine receptor", "competitive inhibition", "convulsions"],
        link: ["post ganglionic autonomic", "postganglionic autonomic", "preganglionic", "autonomic sensory", "connected to the peripheral nervous system"],
        mict: ["micturition", "micturition reflex", "voluntary control"],
      },
      drill: ["oneway", "delay", "fatigue", "ptp", "facil", "term", "rest", "up", "down", "tet", "bot", "stry", "conv", "div"],
      sims: [
        { id: "factors", label: "Speeds up vs depresses", on: ["up", "down"], info: "**Alkalosis**, hypocalcaemia, caffeine, strychnine **raise** excitability; **acidosis**, hypoxia, hypoglycaemia, hypercalcaemia, anaesthetics **depress** it." },
        { id: "toxins", label: "Toxins", on: ["tet", "bot", "stry"], info: "**Tetanus**: no inhibitory transmitter released → **spastic**. **Botulinum**: no ACh released → **flaccid**. **Strychnine**: glycine receptors blocked → convulsions." },
        { id: "props", label: "Properties", on: ["oneway", "delay", "fatigue", "ptp", "facil", "plast", "conv", "div"], info: "One-way conduction, **0.5 ms** delay, fatigue (synthesis < release), summation, potentiation, facilitation/occlusion, convergence and divergence, plasticity." },
      ],
      secs: { "ph-synapse-properties#0": "props", "ph-synapse-properties#1": "factors", "ph-synapse-properties#2": "toxins", "ph-synapse-mechanism#3": "" },
      rules: [
        [/tetanus|botul|strychnine|toxin/i, "toxins"],
        [/alkalosis|acidosis|hypoxia|hypoglyc|hypercalc|hypocalc|caffeine|depress|increases the synaptic/i, "factors"],
        [/delay|fatigue|one direction|potentiation|facilitation|convergence|divergence/i, "props"],
      ],
    });
  })();
})();
