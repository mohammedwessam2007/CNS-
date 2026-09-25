/* INTELLECTUALITY v17.3 · CNS histology board: grey and white matter, the meninges and the blood–brain barrier,
 * the ependyma and choroid plexus, the closed and open medulla with the four lemnisci, and the department's
 * nervous-tissue matching facts. Drawn from the notes' wording (hi-cns, hi-nervous-tissue) and the department book.
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { T, ps } = A.kit;
  const cell = (id, x, y, w, h, lines, c, r) =>
    '<rect class="pf" data-p="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="--c:' + (c || "#d9ff43") + ";--r:" + (r || "#13263c") + ';--rs:#2f4a68"/>' +
    lines.map((t, i) => T(x + w / 2, y + 11 + i * 10, t, "sm")).join("");
  const box = (x, y, w, h) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="#0f1d2e" stroke="#26405e" pointer-events="none"/>';
  const G = "#5ef0a0",
    GR = "#1e4a36",
    B = "#66e9ff",
    BR = "#1d3a55",
    Y = "#ffd166",
    YR = "#4a4030",
    O = "#ff9f43",
    OR = "#4a3020",
    P = "#b39cff",
    PR = "#3a3060",
    R = "#ff5d7a",
    RR = "#5a3040";

  const svg = () => {
    let s = '<text class="ttl" x="270" y="14" text-anchor="middle">CNS HISTOLOGY · GREY/WHITE, MENINGES, BARRIER, EPENDYMA, MEDULLA</text>';
    // A. grey and white matter
    s += box(4, 22, 176, 222) + T(92, 36, "GREY vs WHITE MATTER", "sm mut");
    s += '<ellipse class="pf" data-p="wm" cx="92" cy="84" rx="62" ry="38" style="--c:#e8eef5;--r:#3a4a5e"/>';
    s += '<path class="pf" data-p="gm" d="M60 66 L78 76 L86 70 L98 70 L106 76 L124 66 L118 84 L126 102 L106 94 L98 100 L86 100 L78 94 L58 102 L66 84 Z" style="--c:#b39cff;--r:#5a4a7a"/>';
    s += T(92, 136, "grey (H) inside, white outside", "sm mut");
    s += cell("gm_c", 10, 142, 164, 26, ["GREY: nerve cells, neuroglia,", "UNmyelinated fibres"], P, PR);
    s += cell("wm_c", 10, 172, 164, 26, ["WHITE: MYELINATED fibres", "(oligodendrocytes), neuroglia"], "#cfd8e3", "#3a4a5e");
    s += cell("soft", 10, 202, 80, 38, ["CNS SOFT:", "NO connective", "tissue inside"], Y, YR);
    s += cell("myel", 94, 202, 80, 38, ["pattern", "follows", "MYELIN"], Y, YR);
    // B. meninges and blood–brain barrier
    s += box(184, 22, 176, 222) + T(272, 36, "MENINGES AND THE BARRIER", "sm mut");
    s += '<rect x="190" y="42" width="164" height="10" fill="#cfd8e3" opacity=".45" pointer-events="none"/>' + T(272, 50, "skull", "sm mut");
    s += '<rect class="pf" data-p="dura" x="190" y="54" width="164" height="14" style="--c:#ff9f43;--r:#5a3a20"/>' + T(272, 64, "DURA: dense CT", "sm");
    s += '<rect class="pf" data-p="arach" x="190" y="70" width="164" height="8" style="--c:#66e9ff;--r:#24384f"/>';
    s += '<rect class="pf" data-p="sas" x="190" y="80" width="164" height="20" style="--c:#2a6a9a;--r:#14304a"/>';
    s += '<path d="M204 78 L208 100 M232 78 L226 100 M262 78 L266 100 M300 78 L296 100 M334 78 L338 100" stroke="#66e9ff" stroke-width="1.2" pointer-events="none"/>';
    s += T(272, 94, "subarachnoid space: CSF", "sm");
    s += '<path class="pf" data-p="pia" d="M190 102 L354 102 L354 106 C320 104 300 116 272 108 C244 116 224 104 190 106 Z" style="--c:#5ef0a0;--r:#2f6a4c"/>';
    s += '<rect x="190" y="108" width="164" height="16" fill="#3a3050" opacity=".7" pointer-events="none"/>' + T(272, 120, "brain", "sm mut");
    s += T(356, 76, "arachnoid", "sm", "end");
    // capillary with tight junctions and astrocyte feet
    s += '<circle class="pf" data-p="endo" cx="236" cy="174" r="20" style="--c:#ff5d7a;--r:#6a3040"/>' + '<circle cx="236" cy="174" r="11" fill="#2a1520" pointer-events="none"/>';
    s += '<path class="ps" data-p="tj" d="M236 154 L236 162 M236 186 L236 194" style="--c:#d9ff43;--r:#6a7a3a;--w:3"/>';
    s += '<circle class="ps" data-p="bl" cx="236" cy="174" r="23" style="--c:#cfd8e3;--r:#5a6a7a;--w:1.4" fill="none"/>';
    s += '<path class="pf" data-p="feet" d="M258 160 C270 150 290 150 300 140 C306 150 300 160 290 164 C284 170 272 172 262 172 Z M258 188 C270 196 290 198 300 210 C306 200 300 190 290 186 C284 180 272 178 262 178 Z" style="--c:#b39cff;--r:#5a4a7a"/>';
    s += '<circle cx="312" cy="176" r="10" fill="#5a4a7a" pointer-events="none"/>' + T(312, 196, "astrocyte", "sm") + T(214, 206, "capillary", "sm");
    s += T(236, 146, "tight junctions", "sm");
    s += cell("bbb", 190, 214, 164, 26, ["lipid-soluble pass; penicillin barely", "— unless meninges are INFLAMED"], R, RR);
    // C. ependyma and choroid plexus
    s += box(364, 22, 172, 222) + T(450, 36, "EPENDYMA AND CHOROID PLEXUS", "sm mut");
    let ep = "";
    for (let i = 0; i < 7; i++) ep += "M" + (374 + i * 22) + " 58 l20 0 l0 22 l-20 0 Z ";
    s += '<path class="pf" data-p="epen" d="' + ep + '" style="--c:#66e9ff;--r:#24384f"/>';
    s += '<path d="' + [0, 1, 2, 3, 4, 5, 6].map((i) => "M" + (380 + i * 22) + " 58 l-2 -8 M" + (386 + i * 22) + " 58 l0 -8 M" + (392 + i * 22) + " 58 l2 -8").join(" ") + '" stroke="#d9ff43" stroke-width="1" pointer-events="none"/>';
    s += T(450, 46, "cilia → canal / ventricle", "sm") + T(450, 94, "ependyma: cuboidal–columnar, ciliated", "sm");
    s += '<path class="pf" data-p="chp" d="M394 176 C384 146 400 112 424 110 C432 100 454 100 460 112 C486 112 500 146 488 176 Z" style="--c:#5ef0a0;--r:#2f6a4c"/>';
    s += '<path d="M410 172 C404 150 418 128 440 126 C462 128 478 150 470 172" stroke="#ff5d7a" stroke-width="3" fill="none" pointer-events="none"/>';
    s += T(441, 150, "capillary core", "sm") + T(441, 190, "choroid plexus → CSF", "sm");
    s += cell("epen_c", 370, 198, 160, 18, ["central canal = EPENDYMA"], B, BR);
    s += cell("chp_c", 370, 220, 160, 18, ["plexus: cuboidal epithelium"], G, GR);
    // D. medulla
    s += box(4, 250, 532, 118) + T(270, 264, "THE MEDULLA ON SECTION, AND THE FOUR LEMNISCI", "sm mut");
    // closed medulla: gracile/cuneate nuclei behind, internal arcuate fibres crossing, pyramids in front
    s += '<ellipse cx="66" cy="316" rx="50" ry="40" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>' + '<circle cx="66" cy="318" r="3" fill="#0b1522" stroke="#6f8aa8" pointer-events="none"/>';
    s += '<ellipse class="pf" data-p="grn" cx="54" cy="286" rx="9" ry="7" style="--c:#5ef0a0;--r:#2f6a4c"/><ellipse class="pf" data-p="grn" cx="78" cy="286" rx="9" ry="7" style="--c:#5ef0a0;--r:#2f6a4c"/>';
    s += '<path class="ps" data-p="iaf" d="M48 292 C40 312 56 330 74 338 M84 292 C92 312 76 330 58 338" style="--c:#ffd166;--r:#6a5a30;--w:1.8"/>';
    s += '<path class="pf" data-p="pyr" d="M44 344 C52 356 64 356 66 350 C68 356 80 356 88 344 Z" style="--c:#66e9ff;--r:#24384f"/>';
    s += T(66, 274, "CLOSED medulla", "sm");
    // open medulla
    s += '<path d="M150 290 C150 336 176 358 206 358 C236 358 262 336 262 290 L230 290 L206 308 L182 290 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>';
    s += '<path class="pf" data-p="v4" d="M182 290 L206 308 L230 290 Z" style="--c:#2a6a9a;--r:#14304a"/>';
    s += '<ellipse class="pf" data-p="oli" cx="164" cy="324" rx="10" ry="16" style="--c:#ff9f43;--r:#5a3a20"/><ellipse class="pf" data-p="oli" cx="248" cy="324" rx="10" ry="16" style="--c:#ff9f43;--r:#5a3a20"/>';
    s += '<path class="pf" data-p="arcn" d="M186 350 C196 358 216 358 226 350 L222 346 C212 352 200 352 190 346 Z" style="--c:#b39cff;--r:#3a3060"/>';
    s += T(206, 274, "OPEN medulla", "sm") + T(206, 302, "IV", "sm");
    s += cell("closed", 272, 272, 128, 44, ["CLOSED: lower = MOTOR", "decussation; upper =", "SENSORY decussation", "(internal arcuate fibres)"], Y, YR);
    s += cell("open", 272, 320, 128, 44, ["OPEN: floor of the 4th", "ventricle, olive,", "ARCUATE nuclei on the", "pyramid (external arcuate)"], O, OR);
    s += cell("ml", 404, 272, 128, 22, ["MEDIAL lemniscus: DCML,", "OPPOSITE side"], G, GR);
    s += cell("sl", 404, 296, 128, 22, ["SPINAL lemniscus: pain,", "temp, crude touch, opposite"], R, RR);
    s += cell("tl", 404, 320, 128, 22, ["TRIGEMINAL lemniscus: face,", "opposite; PONS + MIDBRAIN"], P, PR);
    s += cell("ll", 404, 344, 128, 22, ["LATERAL lemniscus: hearing,", "both ears, mainly OPPOSITE"], B, BR);
    // E. department matching facts
    s += '<text class="ttl" x="270" y="386" text-anchor="middle">NERVOUS TISSUE · THE DEPARTMENT\'S MATCHING FACTS</text>';
    const mf = [
      ["m_mel", ["MELANIN →", "substantia nigra"]],
      ["m_purk", ["PURKINJE cells →", "cerebellum"]],
      ["m_pyr", ["PYRAMIDAL cells →", "cerebral cortex"]],
      ["m_sat", ["SATELLITE cells →", "spinal ganglia"]],
      ["m_symp", ["SYMPATHETIC ganglia:", "thin non-myelinated"]],
      ["m_regen", ["REGENERATION:", "Schwann proliferate"]],
      ["m_cent", ["CENTRIOLES in", "neurons: ABSENT"]],
      ["m_astro", ["ASTROCYTES: star", "shaped, processes"]],
      ["m_cleft", ["synaptic CLEFT: fine", "fibres or granules"]],
      ["m_golgi", ["GOLGI apparatus:", "SILVER stain"]],
      ["m_nissl", ["NISSL: rER + ribo-", "somes, basophilic"]],
      ["m_axon", ["AXON: UNIFORM", "diameter, no Nissl"]],
      ["m_gfap", ["glioma marker: GFAP", "(not cytokeratin)"]],
      ["m_ger", ["neurons CAN'T divide:", "tumours are glial"]],
    ];
    mf.forEach(([id, lines], i) => {
      const x = 4 + (i % 5) * 107,
        y = 394 + Math.floor(i / 5) * 32;
      s += cell(id, x, y, 104, 28, lines, i % 2 ? B : G, i % 2 ? BR : GR);
    });
    return s;
  };

  A.scene("cnshist", {
    title: "CNS histology · grey and white matter, meninges and the blood–brain barrier, ependyma, the medulla, nervous-tissue facts",
    vb: "0 0 540 492",
    svg,
    intro: "Top: **grey vs white** matter, the **meninges** with the **blood–brain barrier**, the **ependyma** and **choroid plexus**. Middle: the **closed and open medulla** and the **four lemnisci**. Bottom: the department's matching facts.",
    parts: {
      gm: ["Grey matter", "Nerve cells, neuroglia and **unmyelinated** fibres."],
      wm: ["White matter", "**Myelinated** fibres (myelinated by oligodendrocytes, **without Schwann cells**) and neuroglia; no nerve cell bodies."],
      gm_c: ["What grey matter holds", "**Nerve cells**, **neuroglial cells** and unmyelinated fibres. Myelinated fibres are what grey matter lacks."],
      wm_c: ["What white matter holds", "Myelinated nerve fibres without Schwann cells (oligodendrocytes make the myelin) and neuroglia."],
      soft: ["Why the CNS is soft", "It **does not contain connective tissue** inside it: neurons are held by **glia**. CT is limited to the meninges and vessels. It is not rich in CT cells, and not hard."],
      myel: ["What sets the grey/white pattern", "The distribution of **myelin** (white = myelinated fibres), not blood vessels or pigments."],
      dura: ["Dura mater", "Tough **dense fibrous CT**: an outer periosteal and an inner meningeal layer; the venous sinuses lie between them."],
      arach: ["Arachnoid mater", "Avascular: an outer layer of **border cells** and inner **trabecular** cells bridging the subarachnoid space: **more than a single layer** of modified fibroblasts."],
      sas: ["Subarachnoid space", "Between the arachnoid and the **pia**; holds **CSF** and the trabeculae."],
      pia: ["Pia mater", "Delicate, vascular, follows every sulcus."],
      endo: ["Brain capillary endothelium", "**Continuous, non-fenestrated** endothelium: the main barrier."],
      tj: ["Tight junctions", "Seal the endothelial cells together: the heart of the **blood–brain barrier**."],
      bl: ["Basal lamina", "Surrounds the endothelium."],
      feet: ["Astrocyte end-feet", "Perivascular feet of astrocytes wrap the capillary and induce the barrier."],
      bbb: ["What crosses the blood–brain barrier", "Lipid-soluble substances pass; **penicillin barely crosses the normal barrier**, but **inflamed meninges** in meningitis become **more permeable**, so it reaches useful levels in the CSF."],
      epen: ["Ependyma", "Lines the **central canal** and the ventricles: **simple cuboidal to columnar, partly ciliated** epithelium (not squamous, not stratified)."],
      chp: ["Choroid plexus", "Tufts of vascular pia covered by **simple cuboidal** epithelium (modified ependyma): it secretes **CSF**."],
      epen_c: ["Central canal lining", "Ependyma: **simple cuboidal (to columnar) ciliated**."],
      chp_c: ["Choroid plexus epithelium", "Simple cuboidal epithelium over a capillary core."],
      grn: ["Gracile and cuneate nuclei", "In the **closed** medulla: they give the internal arcuate fibres."],
      iaf: ["Internal arcuate fibres", "From the gracile and cuneate nuclei, they cross (**sensory decussation**) in the **upper closed medulla** to form the **medial lemniscus**."],
      pyr: ["Pyramids", "Corticospinal fibres; they cross in the **lower** closed medulla (motor decussation)."],
      v4: ["Fourth ventricle", "Its floor makes the **open** (upper) medulla."],
      oli: ["Olive (inferior olivary nucleus)", "Bulges on the **open** medulla."],
      arcn: ["Arcuate nuclei", "On the front of the pyramids in the open medulla; their fibres are the external arcuate fibres."],
      closed: ["Closed medulla", "Has the central canal. **Lower**: the pyramidal (motor) decussation. **Upper**: the **sensory decussation** of the **internal arcuate fibres**."],
      open: ["Open medulla", "The upper part, whose back is the **floor of the 4th ventricle**: olive, arcuate nuclei; internal arcuate fibres are **not** here."],
      ml: ["Medial lemniscus", "Dorsal-column fibres after the sensory decussation: fine touch, vibration and proprioception from the **opposite** side. The **gracile tract** carries the **lower** half of the body, the cuneate the upper."],
      sl: ["Spinal lemniscus", "Union of the **lateral and ventral spinothalamic** tracts: pain, temperature and crude touch from the **opposite** side."],
      tl: ["Trigeminal lemniscus", "Pain, temperature, touch and proprioception from the face and scalp of the **opposite** side, to the VPM thalamus; seen in the **pons and midbrain**."],
      ll: ["Lateral lemniscus", "Hearing from **both** ears, **mainly the opposite** one (not mainly the same side)."],
      m_mel: ["Melanin pigment", "Seen in the neurons of the **substantia nigra**."],
      m_purk: ["Purkinje cells", "Found in the **cerebellar** cortex."],
      m_pyr: ["Pyramidal cells", "The typical neurons of the **cerebral cortex**."],
      m_sat: ["Satellite cells", "Small cells **around nerve cells in ganglia**: abundant (a complete capsule) in **spinal ganglia**."],
      m_symp: ["Sympathetic ganglia", "Their nerve fibres are **thin non-myelinated**."],
      m_regen: ["In regeneration", "**Schwann cells proliferate** and form bands that guide the new axon; the neurolemmal sheath and apposed ends are needed (why peripheral nerves regenerate)."],
      m_cent: ["Centrioles in neurons", "**Absent** in mature neurons, so they cannot divide (neuroglia keep theirs)."],
      m_astro: ["Astrocytes", "**Star shaped with multiple processes**; ectodermal. Microglia are **mesodermal**; oligodendrocytes make CNS myelin; Schwann cells are peripheral."],
      m_cleft: ["The synaptic cleft", "**Shows delicate fibres or granules** of intercellular material. The postsynaptic membrane carries the transmitter (ACh) receptors."],
      m_golgi: ["Golgi apparatus of neurons", "Demonstrated by **silver** impregnation as a network around the nucleus."],
      m_nissl: ["Nissl bodies", "Stacks of **rER with polyribosomes**: **basophilic** (toluidine blue), **not PAS-positive**; characteristic of neurons (not glycogen). Chromatolysis (Nissl dispersal) is the first change after axon injury."],
      m_axon: ["Axon", "**Uniform diameter** (dendrites taper); the axon and axon hillock are **devoid of Nissl granules**. 'Nerve fibres' are axons with their sheaths (not actin)."],
      m_gfap: ["Glioma marker", "Astrocytes' intermediate filament **GFAP**. Neurofilaments are neuronal, **cytokeratins epithelial**, vimentin mesenchymal."],
      m_ger: ["Brain tumours in children", "Mostly **gliomas**: a proliferation of macroglia (astrocytes). Mature neurons cannot divide, so there is no neuronal hyperplasia."],
    },
    al: {
      gm: ["gray matter"],
      wm: ["white matter"],
      gm_c: ["not present in gray matter", "~nerve cells", "~neuroglial cells", "gray and white matter"],
      wm_c: ["myelinated nerve fibers without schwann cells", "myelinated fibers"],
      soft: ["connective tissue", "c t", "is soft", "rich in c t cells", "hard like", "neurons joined by connective tissue", "does not contain c t"],
      myel: ["distribution of gray and white matter", "pigments"],
      dura: ["dura mater"],
      arach: ["arachnoid", "arachnoid mater", "arachnoid matter", "single layer of modified fibroblasts", "modified fibroblasts", "border cells", "trabecular cells"],
      sas: ["subarachnoid space"],
      pia: ["pia mater"],
      endo: ["non fenestrated", "continuous endothelium"],
      tj: ["tight junctions", "tight junction"],
      feet: ["astrocyte end feet", "perivascular feet", "end feet"],
      bbb: ["blood brain barrier", "b b b", "bbb", "antibiotics", "penicillin", "meningitis"],
      epen: ["ependyma", "ependymal cells", "central canal", "simple cuboidal ciliated"],
      chp: ["choroid plexus"],
      iaf: ["internal arcuate", "internal arcuate fibers", "sensory decussation", "decussation of internal arcuate"],
      grn: ["gracile nucleus", "cuneate nucleus"],
      v4: ["fourth ventricle", "4th ventricle"],
      oli: ["olive", "olivary nucleus"],
      arcn: ["arcuate nucleus", "arcuate nuclei", "arcuate nucleus of same side", "arcuate nucleus of opposite side", "external arcuate"],
      closed: ["closed medulla"],
      open: ["open medulla"],
      ml: ["medial lemniscus", "gracile tract", "lower half of the body", "upper half of the body"],
      sl: ["spinal lemniscus"],
      tl: ["trigeminal lemniscus"],
      ll: ["lateral lemniscus", "lateral leminiscus"],
      m_mel: ["melanin", "melanin pigment"],
      m_purk: ["purkinje cells are found in", "~cerebellum"],
      m_pyr: ["pyramidal cells", "~cerebral cortex"],
      m_sat: ["satellite cells", "around nerve cells in ganglia", "spinal ganglion", "spinal ganglia"],
      m_symp: ["sympathetic ganglia", "thin non myelinated"],
      m_regen: ["in regeneration", "proliferation of schwann cells", "neurolemmal sheath"],
      m_cent: ["centrioles", "centrioles in neurons", "~are absent"],
      m_astro: ["star shaped", "star shaped with multiple processes", "astrocytes"],
      m_cleft: ["synaptic cleft", "delicate fibers or granules", "shows delicate fibers"],
      m_golgi: ["golgi apparatus", "silver stain", "stained by silver"],
      m_nissl: ["nissl", "nissl bodies", "nissl granules", "chromatolysis", "glycogen", "pas", "stained with pas"],
      m_axon: ["uniform diameter", "nerve fibers refers", "actin"],
      m_gfap: ["gfap", "glial fibrillary acidic protein", "cytokeratins", "cytokeratin", "neurofilaments", "intermediate filament"],
      m_ger: ["glioma", "hyperplasia of neurons", "degenerated neurons", "proliferation of macroglia"],
    },
    drill: ["gm_c", "wm_c", "soft", "arach", "tj", "feet", "bbb", "epen", "chp", "iaf", "closed", "open", "ml", "sl", "tl", "ll", "m_mel", "m_sat", "m_cent", "m_gfap"],
    sims: [
      { id: "gw", label: "Grey vs white", on: ["gm", "wm", "gm_c", "wm_c", "soft", "myel"], info: "**Grey**: nerve cells, glia, unmyelinated fibres. **White**: myelinated fibres (oligodendrocytes). The CNS is soft: **no connective tissue** inside." },
      { id: "bbb", label: "Meninges and barrier", on: ["dura", "arach", "sas", "pia", "endo", "tj", "bl", "feet", "bbb"], info: "Dura (dense CT), arachnoid (border + trabecular cells), CSF, pia. Barrier: **tight junctions** of non-fenestrated endothelium + basal lamina + **astrocyte feet**." },
      { id: "med", label: "Medulla and lemnisci", on: ["grn", "iaf", "pyr", "v4", "oli", "arcn", "closed", "open", "ml", "sl", "tl", "ll"], info: "**Internal arcuate** fibres cross in the **upper closed** medulla; the open medulla has the 4th ventricle floor and the olive. **Trigeminal lemniscus**: pons and midbrain." },
      { id: "table", label: "Matching facts", on: ["m_mel", "m_purk", "m_pyr", "m_sat", "m_symp", "m_regen", "m_cent", "m_astro", "m_cleft", "m_golgi", "m_nissl", "m_axon", "m_gfap", "m_ger"], info: "The department's pairs: melanin → substantia nigra, Purkinje → cerebellum, satellite cells → ganglia, centrioles absent, Schwann cells proliferate in regeneration…" },
    ],
    secs: { "hi-cns#0": "gw", "hi-cns#4": "bbb", "hi-cns#2": "med" },
    rules: [
      [/blood.?brain|b\.?b\.?b|meningitis|arachnoid|meninges/i, "bbb"],
      [/arcuate|lemniscus|medulla/i, "med"],
      [/gr[ae]y matter|white matter|central nervous system is soft|central canal/i, "gw"],
      [/→ \?$/, "table"],
    ],
  });
})();
