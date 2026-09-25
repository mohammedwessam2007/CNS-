/* INTELLECTUALITY v17.3 · The answer figure. Owner, 25 Sep 2026: "The photos and visuals are not on point …
 * the images must include everything in the explanation."
 * After a question is answered, this finds every structure that the question's explanation names (the right
 * answer's line, every wrong option's line, and the stem), picks the diagram that holds the most of them, and
 * marks them all on it: the right answer in green, each wrong option in red with its letter, your own wrong
 * choice ringed, and every other structure the explanation mentions in blue. Options that live on another
 * diagram get their own zoomed panel. A legend under the picture says which letter is which structure.
 * Aliases below map the explanations' wording (synonyms, abbreviations, old names) to the drawn parts.
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { E, md } = A;
  function safe(f, fb) {
    try {
      return f();
    } catch (e) {
      console.warn("[answer]", e);
      return fb;
    }
  }

  /* ───────────── words → tokens (the explanations and the part names meet here) ───────────── */
  const IRREG = { nuclei: "nucleus", ganglia: "ganglion", foramina: "foramen", fasciculi: "fasciculus", rami: "ramus", sulci: "sulcus", gyri: "gyrus", villi: "villus", cilia: "cilium", lamellae: "lamella", vertebrae: "vertebra", meninges: "meninx", teeth: "tooth", cristae: "crista", maculae: "macula", conchae: "concha", cells: "cell", nerves: "nerve", fibres: "fiber", fibers: "fiber", axes: "axis", bodies: "body", arteries: "artery", veins: "vein", sinuses: "sinus", processes: "process", glands: "gland", muscles: "muscle", layers: "layer", ducts: "duct", neurons: "neuron", neurones: "neuron", neurone: "neuron", ossicles: "ossicle" };
  function norm(t) {
    return String(t || "")
      .toLowerCase()
      .replace(/\*\*|__|`/g, "")
      .replace(/α/g, " alpha ")
      .replace(/β/g, " beta ")
      .replace(/γ/g, " gamma ")
      .replace(/δ/g, " delta ")
      .replace(/μ/g, " mu ")
      .replace(/κ/g, " kappa ")
      .replace(/²⁺/g, "2+")
      .replace(/⁺/g, "+")
      .replace(/⁻/g, "-")
      .replace(/[‐-―−]/g, "-")
      .replace(/fibre/g, "fiber")
      .replace(/centre/g, "center")
      .replace(/haem/g, "hem")
      .replace(/oedem/g, "edem")
      .replace(/oesophag/g, "esophag")
      .replace(/grey/g, "gray")
      .replace(/ü/g, "u")
      .replace(/[éè]/g, "e")
      .replace(/([a-z])[’']s\b/g, "$1")
      .replace(/’|'/g, "")
      .replace(/\ba[\s-]*(alpha|beta|gamma|delta)\b/g, "a$1")
      .replace(/\b(alpha|beta|gamma|delta)\s*-\s*/g, "$1 ")
      .replace(/[^a-z0-9+]+/g, " ")
      .trim();
  }
  function stem(w) {
    if (IRREG[w]) return IRREG[w];
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 4 && /(ch|sh|x|ss)es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/(ss|us|is|ys|as)$/.test(w)) return w.slice(0, -1);
    return w;
  }
  const toks = (t) => norm(t).split(" ").filter(Boolean).map(stem);

  /* ───────────── aliases for the parts already drawn (v17 scenes) ───────────── */
  // [scene]: { part: [alias, …] }. The part's own name is always an alias too.
  const AL = {
    cord: {
      gr: ["gracile fasciculus", "fasciculus gracilis", "gracile tract", "tract of goll", "dorsal column", "posterior column", "posterior white column", "dorsal white column"],
      cu: ["cuneate fasciculus", "fasciculus cuneatus", "cuneate tract", "tract of burdach", "dorsal column", "posterior column", "posterior white column", "dorsal white column"],
      lis: ["lissauer", "dorsolateral tract", "dorsolateral fasciculus"],
      sg: ["substantia gelatinosa", "sgr", "lamina ii"],
      ph: ["posterior horn", "dorsal horn", "posterior gray horn", "dorsal gray horn", "posterior gray column", "posterior column of gray matter"],
      lh: ["lateral horn", "intermediolateral", "lateral gray horn", "lateral gray column", "intermediolateral column", "intermediolateral nucleus", "preganglionic sympathetic neuron"],
      ah: ["anterior horn", "ventral horn", "anterior horn cell", "anterior gray horn", "anterior gray column", "ventral gray column", "lower motor neuron"],
      clarke: ["clarke", "clarkes column", "clarkes nucleus", "nucleus dorsalis", "dorsal nucleus of clarke", "thoracic nucleus"],
      cc: ["central canal"],
      awc: ["anterior white commissure", "ventral white commissure", "white commissure"],
      dsc: ["dorsal spinocerebellar", "posterior spinocerebellar", "dsct"],
      vsc: ["ventral spinocerebellar", "anterior spinocerebellar", "vsct"],
      lcs: ["lateral corticospinal", "crossed corticospinal", "lateral pyramidal tract", "crossed pyramidal tract"],
      rbs: ["rubrospinal"],
      rts: ["reticulospinal"],
      lst: ["lateral spinothalamic"],
      stec: ["spinotectal"],
      os: ["olivospinal"],
      ast: ["anterior spinothalamic", "ventral spinothalamic"],
      ves: ["vestibulospinal"],
      tes: ["tectospinal"],
      acs: ["anterior corticospinal", "ventral corticospinal", "uncrossed corticospinal", "direct pyramidal tract"],
      mlf: ["sulcomarginal", "medial longitudinal fasciculus", "descending medial longitudinal"],
      drg: ["dorsal root ganglion", "spinal ganglion", "posterior root ganglion", "drg", "first order neuron", "first-order neuron"],
      dr: ["dorsal root", "posterior root", "sensory root"],
      vr: ["ventral root", "anterior root", "motor root"],
      amf: ["anterior median fissure"],
      pms: ["posterior median sulcus", "posterior median septum"],
      asa: ["anterior spinal artery"],
      psa: ["posterior spinal artery"],
    },
    vision: {
      retN: ["nasal retina", "nasal half of the retina", "nasal hemiretina", "nasal fiber", "nasal half"],
      retT: ["temporal retina", "temporal half of the retina", "temporal hemiretina", "temporal fiber", "temporal half"],
      on: ["optic nerve"],
      ch: ["optic chiasma", "optic chiasm", "chiasma", "chiasm"],
      ot: ["optic tract"],
      lgn: ["lateral geniculate", "lgb", "lgn"],
      mey: ["meyer loop", "meyers loop", "temporal radiation", "inferior optic radiation", "lower optic radiation", "optic radiation", "geniculocalcarine"],
      par: ["parietal radiation", "superior optic radiation", "upper optic radiation", "optic radiation", "geniculocalcarine"],
      v1: ["primary visual cortex", "area 17", "striate cortex", "calcarine", "visual cortex", "occipital cortex"],
      pre: ["pretectal"],
    },
    pupil: {
      aff: ["optic nerve"],
      ch: ["optic chiasma", "optic chiasm", "chiasma"],
      tr: ["optic tract"],
      pt: ["pretectal nucleus", "pretectal area", "pretectum", "pretectal"],
      pc: ["posterior commissure"],
      ew: ["edinger westphal", "accessory oculomotor nucleus"],
      cn3: ["oculomotor nerve", "third cranial nerve", "cranial nerve iii", "parasympathetic fiber of the oculomotor"],
      cg: ["ciliary ganglion", "short ciliary nerve"],
    },
    eom: {
      LR: ["lateral rectus", "abducent nerve", "abducens nerve"],
      MR: ["medial rectus"],
      SR: ["superior rectus"],
      IR: ["inferior rectus"],
      SO: ["superior oblique", "trochlear nerve"],
      IO: ["inferior oblique"],
    },
    cortex: {
      a4: ["primary motor", "area 4", "precentral gyrus", "motor cortex", "primary motor cortex", "motor area"],
      s1: ["primary somatosensory", "somatosensory area", "somatosensory cortex", "postcentral gyrus", "area 3 1 2", "areas 3 1 2", "somatic sensory area", "sensory cortex", "sensory area i"],
      a6: ["premotor", "supplementary motor", "area 6"],
      fef: ["frontal eye field", "area 8"],
      broca: ["broca", "brocas area", "area 44", "areas 44 45", "motor speech area", "inferior frontal gyrus"],
      aud: ["primary auditory", "auditory cortex", "area 41", "areas 41 42", "heschl", "transverse temporal gyrus", "auditory area"],
      wern: ["wernicke", "wernickes area", "area 22", "sensory speech area", "superior temporal gyrus"],
      ang: ["angular gyrus", "area 39"],
      v1l: ["occipital pole"],
      pcl: ["paracentral lobule"],
      v1m: ["primary visual cortex", "area 17", "calcarine sulcus", "calcarine fissure", "striate cortex", "visual cortex"],
      cing: ["cingulate gyrus", "cingulate"],
      cc: ["corpus callosum"],
    },
    willis: {
      va: ["vertebral artery"],
      ba: ["basilar artery"],
      pica: ["posterior inferior cerebellar", "pica"],
      aica: ["anterior inferior cerebellar", "aica"],
      sca: ["superior cerebellar artery"],
      pca: ["posterior cerebral artery", "pca", "posterior cerebral"],
      pcom: ["posterior communicating"],
      ica: ["internal carotid"],
      mca: ["middle cerebral artery", "mca", "middle cerebral"],
      aca: ["anterior cerebral artery", "aca", "anterior cerebral"],
      acom: ["anterior communicating"],
      asa: ["anterior spinal artery"],
      achor: ["anterior choroidal"],
      pont: ["pontine branch", "pontine artery"],
      lab: ["labyrinthine artery", "internal auditory artery"],
      cn3: ["oculomotor nerve"],
      cn4: ["trochlear nerve"],
    },
    capsule: {
      al: ["anterior limb"],
      genu: ["genu of the internal capsule", "genu"],
      pl: ["posterior limb", "internal capsule"],
      rl: ["retrolenticular", "retrolentiform", "optic radiation"],
      sl: ["sublenticular", "sublentiform", "auditory radiation"],
      cd: ["caudate", "head of the caudate", "caudate nucleus"],
      lv: ["lateral ventricle"],
      v3: ["third ventricle"],
      th: ["thalamus"],
      gp: ["globus pallidus", "pallidum", "lentiform nucleus", "lenticular nucleus"],
      pu: ["putamen", "lentiform nucleus", "lenticular nucleus"],
    },
    stem: {
      ped: ["cerebral peduncle", "crus cerebri", "basis pedunculi", "midbrain"],
      pons: ["basilar pons", "pons", "basis pontis"],
      pyr: ["pyramid", "medullary pyramid", "medulla oblongata"],
      dec: ["pyramidal decussation", "motor decussation", "decussation of the pyramid"],
      oli: ["olive", "inferior olive", "olivary"],
      n3: ["oculomotor nerve", "oculomotor", "third nerve", "cranial nerve iii"],
      n4: ["trochlear", "fourth nerve", "cranial nerve iv"],
      n5: ["trigeminal", "cranial nerve v"],
      n6: ["abducent", "abducens", "sixth nerve", "cranial nerve vi"],
      n7: ["facial nerve", "cranial nerve vii"],
      n8: ["vestibulocochlear", "eighth nerve", "auditory nerve", "cranial nerve viii"],
      n9x: ["glossopharyngeal", "vagus", "vagal", "accessory nerve", "spinal accessory", "cranial nerve ix", "cranial nerve x", "cranial nerve xi"],
      n12: ["hypoglossal", "cranial nerve xii"],
    },
    csf: {
      lv: ["lateral ventricle"],
      ivf: ["interventricular foramen", "foramen of monro", "monro"],
      v3: ["third ventricle"],
      aq: ["cerebral aqueduct", "aqueduct of sylvius", "aqueduct"],
      v4: ["fourth ventricle"],
      mag: ["foramen of magendie", "median aperture", "magendie"],
      lus: ["foramina of luschka", "foramen of luschka", "lateral aperture", "luschka"],
      cc: ["central canal"],
      sas: ["subarachnoid space", "subarachnoid"],
      ag: ["arachnoid granulation", "arachnoid villus", "pacchionian"],
      sss: ["superior sagittal sinus"],
    },
    bg: {
      snc: ["substantia nigra", "pars compacta", "nigrostriatal", "dopaminergic neuron"],
      d1: ["direct pathway", "d1 receptor", "striatum", "neostriatum", "caudate nucleus", "putamen"],
      d2: ["indirect pathway", "d2 receptor", "striatum", "neostriatum", "caudate nucleus", "putamen"],
      gpe: ["globus pallidus externa", "external globus pallidus", "external segment of the globus pallidus", "gpe", "globus pallidus external"],
      stn: ["subthalamic nucleus", "subthalamic", "nucleus of luys"],
      gpi: ["globus pallidus interna", "internal globus pallidus", "internal segment of the globus pallidus", "gpi", "pars reticulata", "globus pallidus internal"],
      th: ["ventral anterior", "ventral lateral", "va vl", "motor thalamus"],
    },
    cereb: {
      floc: ["flocculus", "flocculonodular", "vestibulocerebellum", "archicerebellum"],
      nod: ["nodule", "nodulus", "flocculonodular", "vestibulocerebellum", "archicerebellum"],
      vermis: ["vermis", "spinocerebellum", "paleocerebellum"],
      parav: ["paravermal", "intermediate zone", "intermediate part", "spinocerebellum", "paleocerebellum"],
      neo: ["lateral hemisphere", "cerebrocerebellum", "neocerebellum", "pontocerebellum", "lateral zone", "cerebellar hemisphere"],
      fast: ["fastigial"],
      int: ["interposed", "globose", "emboliform"],
      dent: ["dentate nucleus", "dentate"],
      pfis: ["primary fissure"],
      plf: ["posterolateral fissure"],
      scp: ["superior cerebellar peduncle", "brachium conjunctivum"],
      mcp: ["middle cerebellar peduncle", "brachium pontis"],
      icp: ["inferior cerebellar peduncle", "restiform body"],
    },
    cbcx: {
      mol: ["molecular layer"],
      pkl: ["purkinje cell layer", "purkinje layer"],
      grl: ["granular layer", "granule cell layer"],
      pk: ["purkinje cell", "purkinje"],
      gc: ["granule cell"],
      pf: ["parallel fiber"],
      mf: ["mossy fiber"],
      cf: ["climbing fiber", "inferior olive", "olivocerebellar"],
      bk: ["basket cell"],
      st: ["stellate cell"],
      go: ["golgi cell"],
      dn: ["deep cerebellar nucleus", "deep nucleus", "cerebellar nucleus"],
    },
    reflex: {
      sp: ["muscle spindle", "spindle", "intrafusal"],
      gto: ["golgi tendon organ", "tendon organ", "gto"],
      ia: ["ia afferent", "ia fiber", "annulospiral", "primary ending", "type ia", "group ia", "ia"],
      alpha: ["alpha motor axon", "alpha motor fiber", "aalpha", "alpha efferent"],
      gamma: ["gamma motor", "agamma", "fusimotor", "gamma efferent"],
      ib: ["ib afferent", "ib fiber", "type ib", "group ib", "ib"],
      recip: ["reciprocal inhibition", "reciprocal innervation"],
      amn: ["alpha motor neuron", "alpha motoneuron", "motor neuron of the same muscle", "agonist"],
      gmn: ["gamma motor neuron", "gamma motoneuron"],
      hmn: ["antagonist"],
      inn: ["inhibitory interneuron"],
      ibn: ["autogenic inhibition", "inverse stretch reflex", "lengthening reaction", "clasp knife"],
      drg: ["dorsal root ganglion"],
      quad: ["quadriceps", "extensor muscle"],
      ham: ["hamstring", "flexor muscle"],
    },
    synapse: {
      term: ["presynaptic knob", "presynaptic terminal", "terminal button", "synaptic knob", "bouton", "presynaptic ending", "axon terminal"],
      ves: ["synaptic vesicle", "vesicle"],
      dock: ["snare", "docking", "synaptobrevin", "syntaxin", "snap 25", "exocytosis"],
      cach: ["voltage gated calcium", "calcium channel", "ca2+ channel", "calcium influx", "calcium entry", "calcium ion"],
      cleft: ["synaptic cleft"],
      ion: ["ionotropic", "ligand gated", "postsynaptic receptor", "nicotinic"],
      gpcr: ["metabotropic", "g protein", "second messenger", "muscarinic"],
      enz: ["acetylcholinesterase", "cholinesterase"],
      reup: ["reuptake"],
    },
    path: {
      dcml: ["dorsal column", "medial lemniscus", "dcml", "gracile nucleus", "cuneate nucleus", "nucleus gracilis", "nucleus cuneatus", "internal arcuate", "sensory decussation", "dorsal column medial lemniscal", "vibration sense", "vibration", "fine touch", "position sense", "conscious proprioception", "two point discrimination"],
      stt: ["spinothalamic", "anterolateral system", "anterolateral pathway", "pain and temperature", "temperature sensation", "pain sensation", "crude touch", "polymodality", "polymodality of sensations"],
      cst: ["corticospinal", "pyramidal tract", "pyramidal pathway", "motor function", "voluntary movement", "voluntary movements"],
    },
    cochlea: {
      bm: ["basilar membrane"],
      ow: ["oval window", "fenestra vestibuli"],
      rw: ["round window", "fenestra cochleae", "secondary tympanic membrane"],
      sv: ["scala vestibuli"],
      st: ["scala tympani"],
      hel: ["helicotrema"],
    },
    duct: {
      sv: ["scala vestibuli", "perilymph"],
      st: ["scala tympani", "perilymph"],
      sm: ["scala media", "cochlear duct", "endolymph"],
      rm: ["reissner", "vestibular membrane"],
      sva: ["stria vascularis"],
      bm: ["basilar membrane"],
      ihc: ["inner hair cell"],
      ohc: ["outer hair cell"],
      pil: ["pillar cell", "rods of corti"],
      tun: ["tunnel of corti"],
      iph: ["inner phalangeal"],
      dei: ["deiters", "outer phalangeal"],
      hen: ["hensen"],
      tm: ["tectorial membrane"],
      sg: ["spiral ganglion"],
      aff: ["cochlear nerve", "auditory nerve fiber"],
      lim: ["spiral limbus", "limbus spiralis"],
    },
    vest: {
      can: ["semicircular canal", "horizontal canal", "lateral canal", "semicircular duct"],
      amp: ["ampulla", "crista ampullaris", "cupula", "crista"],
    },
    retina: {
      l10: ["inner limiting membrane", "internal limiting membrane"],
      l9: ["nerve fiber layer", "optic nerve fiber layer", "layer of optic nerve fiber"],
      l8: ["ganglion cell layer"],
      l7: ["inner plexiform"],
      l6: ["inner nuclear"],
      l5: ["outer plexiform"],
      l4: ["outer nuclear"],
      l3: ["outer limiting membrane", "external limiting membrane"],
      l2: ["rods and cones", "photoreceptor layer", "layer of rods and cones"],
      l1: ["pigment epithelium", "pigmented epithelium", "retinal pigment epithelium", "rpe", "pigmented layer"],
      rod: ["rod cell", "rod"],
      cone: ["cone cell", "cone"],
      bp: ["bipolar cell", "bipolar neuron"],
      hz: ["horizontal cell"],
      am: ["amacrine"],
      gc: ["ganglion cell"],
      mu: ["muller", "muller cell"],
    },
    rod: {
      os: ["outer segment"],
      disc: ["disc", "disk", "rhodopsin", "transducin", "phosphodiesterase", "retinal", "opsin"],
      cng: ["cgmp gated", "sodium channel", "na+ channel", "dark current", "cgmp"],
      is: ["inner segment"],
      syn: ["synaptic terminal", "synaptic body", "glutamate release"],
    },
    facial: {
      n7: ["facial nerve", "facial canal", "geniculate ganglion", "stylomastoid foramen"],
      n8: ["vestibulocochlear"],
      gpn: ["greater petrosal", "lacrimal gland"],
      stn: ["nerve to stapedius", "stapedius", "hyperacusis"],
      ct: ["chorda tympani", "taste from the anterior two thirds", "anterior two thirds of the tongue"],
      br: ["temporal branch", "zygomatic branch", "buccal branch", "marginal mandibular", "cervical branch", "terminal branch", "muscles of facial expression"],
      upper: ["upper face", "forehead"],
      cross: ["lower face", "lower half of the face"],
    },
  };
  // generic single words never used alone as an alias derived from a name
  const GENERIC = new Set("cortex nucleus tract nerve artery cell layer fiber membrane horn root area window canal duct space ventricle part body gland muscle vein branch process zone surface lobe sinus".split(" "));

  function autoAliases(name) {
    const out = new Set(),
      n = String(name || "").replace(/\*\*/g, "");
    const base = n.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
    base.split(/\s*(?:\/|·|,| – | — | or )\s*/).forEach((x) => out.add(x));
    // "Posterior (dorsal) horn" → "dorsal horn"
    const m = /^(.*?)(\S+)\s*\((\w+)\)\s*(\S.*)$/.exec(n);
    if (m && !/\d/.test(m[3]) && /^(anterior|posterior|dorsal|ventral|lateral|medial|superior|inferior|internal|external|upper|lower|deep|superficial|greater|lesser|major|minor|central|peripheral)$/i.test(m[3])) out.add((m[1] + m[3] + " " + m[4]).replace(/\s*\(.*?\)\s*/g, " "));
    // parenthetical full alternatives: "(gracile tract)", "(PICA)", "(area 4, precentral gyrus)"
    for (const p of n.match(/\((.*?)\)/g) || [])
      p.slice(1, -1)
        .split(/\s*[,;]\s*/)
        .forEach((x) => {
          // a phrase ("gracile tract"), an area ("area 4") or an abbreviation ("PICA"); never one plain word ("intermediate")
          if (/^area\s+\d/i.test(x) || (!/\d/.test(x) && !/^[ivxl]+$/i.test(x) && (/\s/.test(x.trim()) || /^[A-Z][A-Za-z]{1,5}$/.test(x) && /[A-Z].*[A-Z]/.test(x)))) out.add(x);
        });
    return [...out].filter((x) => {
      const t = toks(x);
      return t.length > 1 || (t.length === 1 && t[0].length >= 6 && !GENERIC.has(t[0]));
    });
  }

  /* ───────────── lexicon: every alias of every drawn part ───────────── */
  let LEX = null,
    LEXN = -1;
  function lexicon() {
    const ids = A.scenes();
    if (LEX && LEXN === ids.length) return LEX;
    LEXN = ids.length;
    const byFirst = new Map();
    for (const sid of ids) {
      const d = A.def(sid);
      for (const [pid, v] of Object.entries(d.parts || {})) {
        const name = Array.isArray(v) ? v[0] : (v && v.n) || "";
        const al = new Set([...autoAliases(name), ...((AL[sid] && AL[sid][pid]) || []), ...((d.al && d.al[pid]) || [])]);
        for (const a0 of al) {
          // "~alias" is weak: it counts only when the question already names something else in the same diagram
          const weak = a0.charAt(0) === "~",
            a = weak ? a0.slice(1) : a0;
          const t = toks(a);
          if (!t.length) continue;
          const e = { scene: sid, pid, t, a, weak };
          if (!byFirst.has(t[0])) byFirst.set(t[0], []);
          byFirst.get(t[0]).push(e);
        }
      }
    }
    LEX = byFirst;
    return LEX;
  }
  // every drawn part a text names: longest phrases first, no word used twice
  function match(text) {
    const tk = toks(text),
      L = lexicon(),
      found = [];
    for (let i = 0; i < tk.length; i++)
      for (const e of L.get(tk[i]) || []) {
        let ok = e.t.length <= tk.length - i;
        for (let j = 1; ok && j < e.t.length; j++) ok = tk[i + j] === e.t[j];
        if (ok) found.push({ s: i, n: e.t.length, e });
      }
    // the same words may name the same thing in several diagrams: a span is taken once, with all it names
    const spans = new Map();
    for (const f of found) {
      const k = f.s + ":" + f.n;
      if (!spans.has(k)) spans.set(k, { s: f.s, n: f.n, es: [] });
      spans.get(k).es.push(f.e);
    }
    const order = [...spans.values()].sort((a, b) => b.n - a.n || a.s - b.s),
      used = new Array(tk.length).fill(false),
      hits = [];
    for (const sp of order) {
      let free = true;
      for (let j = sp.s; j < sp.s + sp.n; j++) if (used[j]) free = false;
      if (!free) continue;
      for (let j = sp.s; j < sp.s + sp.n; j++) used[j] = true;
      const seen = new Set();
      for (const e of sp.es) {
        const k = e.scene + "|" + e.pid;
        if (seen.has(k)) continue;
        seen.add(k);
        hits.push({ scene: e.scene, pid: e.pid, at: sp.s, a: e.a, weak: !!e.weak && !sp.es.some((x) => x !== e && x.scene === e.scene && x.pid === e.pid && !x.weak) });
      }
    }
    return hits;
  }

  /* ───────────── one question → what to draw ───────────── */
  const QB = () => window.EHSAN_QBANK || { questions: [] };
  let QM = null;
  const qget = (id) => {
    if (!QM || QM.size !== (QB().questions || []).length) {
      QM = new Map();
      for (const q of QB().questions || []) QM.set(q.id, q);
    }
    return QM.get(id) || null;
  };
  function explain(q) {
    const X = window.INTELLECTUALITY_MCQ_X || {},
      m = /^(.*\D)(\d+)$/.exec(q.id),
      arr = m && X[m[1]] ? X[m[1]][m[2]] : null;
    const out = { key: "", opt: {}, flag: null, also: [] };
    if (!Array.isArray(arr)) return out;
    arr.forEach((s, i) => {
      const mm = /^([!~]?)([a-g]):\s*([\s\S]*)$/.exec(String(s));
      if (mm) {
        if (mm[1] === "!") out.flag = { k: mm[2], why: mm[3] };
        else if (mm[1] === "~") out.also.push({ k: mm[2], why: mm[3] });
        else out.opt[mm[2]] = mm[3];
      } else out.key += (i ? " " : "") + s;
    });
    return out;
  }
  const partName = (sid, pid) => {
    const v = A.def(sid)?.parts?.[pid];
    return String(Array.isArray(v) ? v[0] : (v && v.n) || pid).replace(/\*\*/g, "");
  };
  // words that make an option a value of something (how much, which way, when), not a structure of its own
  const VALUE = new Set(
    ("a an the it is are be was were becomes become remains remain not no none only very both neither either of to in at by and or than as its " +
      "increase increased increases increasing decrease decreased decreases decreasing rise rises fall falls exaggerated inhibited inhibition absent present " +
      "unchanged unaffected changed normal abnormal reduced reduction enhanced enhancement lost loss preserved spared abolished depressed stimulated excited " +
      "facilitated facilitation diminished augmented hyperactive hypoactive brisk sluggish same opposite ipsilateral contralateral bilateral unilateral bilaterally " +
      "left right upward downward up down forward backward inward outward higher lower faster slower more less greater smaller larger longer shorter high low " +
      "fast slow rapid rapidly slowly quickly gradually suddenly strong weak stronger weaker positive negative true false yes all some many few " +
      "ms msec millisecond milliseconds sec second seconds min minute minutes hour hours hr hrs day days week weeks wk month months year years mm cm m um μm nm hz khz db " +
      "mv mmhg times fold percent degree degrees c zero one two three four five six seven eight nine ten twice half double triple " +
      "depolarization hyperpolarization depolarized hyperpolarized maximal minimal maximum minimum nil constant variable continuous intermittent").split(" ")
  );
  function plan(qid, sel) {
    const q = qget(qid);
    if (!q || !(q.options || []).length) return null;
    const x = explain(q),
      keys = new Set(q.answerKeys || []);
    const good = new Set(keys);
    if (x.flag) good.add(x.flag.k);
    for (const a of x.also) good.add(a.k);
    const fq = safe(() => A.forQuestion(qid), null);
    const raw = q.options.map((o) => {
      const why = keys.has(o.key) ? x.key : x.flag && x.flag.k === o.key ? x.flag.why : (x.also.find((a) => a.k === o.key) || {}).why || x.opt[o.key] || "";
      return { o, own: match(o.text), wh: match(why) };
    });
    const stemRaw = match(q.stem);
    // weak aliases stand only where the question also names something else in that diagram
    const strong = new Set();
    for (const r of raw) for (const h of [...r.own, ...r.wh]) if (!h.weak) strong.add(h.scene);
    for (const h of stemRaw) if (!h.weak) strong.add(h.scene);
    const keep = (hs) => hs.filter((h) => !h.weak || strong.has(h.scene));
    const opts = raw.map(({ o, own: own0, wh: wh0 }) => {
      const own = keep(own0),
        wh = keep(wh0);
      const anchors = own.length ? own : wh;
      const mark = (h) => h.scene + "|" + h.pid;
      const aset = new Set(anchors.map(mark));
      return { k: o.key, text: o.text, good: good.has(o.key), mine: !!sel && o.key === sel, anchors, see: wh.filter((h) => !aset.has(mark(h))) };
    });
    // options that point at other options ("all of the above", "a & c are correct", "none of the above")
    // are pictured by what they point at
    for (const o of opts) {
      if (o.anchors.length) continue;
      const t = String(o.text).toLowerCase().trim();
      let refs = [];
      if (/(all|none) of (the )?above|all of these|all the above/.test(t)) refs = opts.filter((p) => p !== o && p.k < o.k).map((p) => p.k);
      else {
        const m = /^\(?([a-g])\)?\s*(?:,|&|and|\+)\s*\(?([a-g])\)?(?:\s*(?:,|&|and|\+)\s*\(?([a-g])\)?)?\s*(?:are|is)?\s*(?:correct|true|right)?\.?$/.exec(t);
        if (m) refs = [m[1], m[2], m[3]].filter(Boolean);
      }
      if (!refs.length) continue;
      const seen = new Set();
      for (const p of opts)
        if (refs.includes(p.k))
          for (const h of p.anchors) {
            const k = h.scene + "|" + h.pid;
            if (!seen.has(k)) {
              seen.add(k);
              o.anchors.push(h);
            }
          }
      o.refs = refs;
    }
    const stemSee = keep(stemRaw);
    // a short option that is only a value ("Exaggerated", "Is absent", "Na influx") of what the stem asks about
    // is pictured at that thing, and the legend says so
    for (const o of opts) {
      if (o.anchors.length || o.refs || !stemSee.length) continue;
      const w = String(o.text).toLowerCase().replace(/[^a-z0-9+%°\u0370-\u03ff]+/g, " ").trim().split(/\s+/).filter(Boolean);
      if (!w.length || w.length > 6 || !w.every((t) => VALUE.has(t) || /^[0-9][0-9.,/-]*(st|nd|rd|th|x|%)?$/.test(t))) continue;
      const seen = new Set();
      for (const h of stemSee) {
        const k = h.scene + "|" + h.pid;
        if (seen.has(k) || seen.size >= 4) continue;
        seen.add(k);
        o.anchors.push(h);
      }
      o.val = true;
      o.see = o.see.filter((h) => !seen.has(h.scene + "|" + h.pid));
    }
    const scenes = new Set();
    for (const o of opts) for (const h of [...o.anchors, ...o.see]) scenes.add(h.scene);
    for (const h of stemSee) scenes.add(h.scene);
    if (!scenes.size) return null;
    const score = (sid, left) => {
      let sc = 0;
      for (const o of left) if (o.anchors.some((h) => h.scene === sid)) sc += o.good ? 6 : 3;
      const see = new Set();
      for (const o of opts) for (const h of o.see) if (h.scene === sid) see.add(h.pid);
      for (const h of stemSee) if (h.scene === sid) see.add(h.pid);
      sc += Math.min(4, see.size) * 0.8;
      if (fq && fq.id === sid) sc += 1.5;
      return sc;
    };
    const pick = (left, not) => {
      let best = null,
        bs = 0;
      for (const sid of scenes) {
        if (not.has(sid)) continue;
        const sc = score(sid, left);
        if (sc > bs) {
          bs = sc;
          best = sid;
        }
      }
      return best;
    };
    const figs = [],
      used = new Set();
    let left = opts.filter((o) => o.anchors.length);
    const main = pick(left, used);
    if (!main) return null;
    figs.push(main);
    used.add(main);
    left = left.filter((o) => !o.anchors.some((h) => h.scene === main));
    // up to two zoomed panels for the options drawn on other diagrams
    while (left.length && figs.length < 3) {
      const sid = pick(left, used);
      if (!sid || !left.some((o) => o.anchors.some((h) => h.scene === sid))) break;
      figs.push(sid);
      used.add(sid);
      left = left.filter((o) => !o.anchors.some((h) => h.scene === sid));
    }
    const where = {};
    for (const o of opts) where[o.k] = figs.findIndex((sid) => o.anchors.some((h) => h.scene === sid));
    const specs = figs.map((sid, fi) => {
      const marks = new Map();
      const add = (pid, role, k, mine) => {
        const m = marks.get(pid) || { pid, role, letters: [], mine: false };
        const rank = { key: 3, bad: 2, see: 1 };
        if (rank[role] > rank[m.role]) m.role = role;
        if (k && !m.letters.includes(k)) m.letters.push(k);
        if (mine) m.mine = true;
        marks.set(pid, m);
      };
      for (const o of opts) if (where[o.k] === fi) for (const h of o.anchors) if (h.scene === sid) add(h.pid, o.good ? "key" : "bad", o.k, o.mine);
      for (const o of opts) for (const h of o.see) if (h.scene === sid) add(h.pid, "see");
      for (const h of stemSee) if (h.scene === sid) add(h.pid, "see");
      for (const m of marks.values()) m.letters.sort();
      const legend = opts.map((o) => ({
        k: o.k,
        good: o.good,
        mine: o.mine,
        here: where[o.k] === fi,
        fig: where[o.k],
        names: [...new Set(o.anchors.filter((h) => h.scene === sid).map((h) => partName(sid, h.pid)))],
        refs: o.refs || null,
        val: !!o.val,
        text: o.text,
      }));
      const see = [...marks.values()].filter((m) => m.role === "see").map((m) => partName(sid, m.pid));
      return { scene: sid, sim: fi === 0 && fq && fq.id === sid ? fq.sim || "" : "", marks: [...marks.values()], legend, see, panel: fi > 0, crop: fi > 0 };
    });
    const cover = {};
    for (const o of opts) cover[o.k] = where[o.k] >= 0;
    return { qid, specs, cover, opts: opts.map((o) => ({ k: o.k, good: o.good, anchors: o.anchors.length, see: o.see.length })) };
  }

  /* ───────────── drawing the marks ───────────── */
  const NS = "http://www.w3.org/2000/svg";
  function ptsOf(svg, el) {
    const inv = safe(() => svg.getScreenCTM().inverse(), null),
      m = safe(() => el.getScreenCTM(), null);
    if (!inv || !m) return null;
    const t = inv.multiply(m),
      P = (x, y) => {
        const p = svg.createSVGPoint();
        p.x = x;
        p.y = y;
        return p.matrixTransform(t);
      };
    // a stroked path is marked at its middle, a shape at its centre
    if (el.classList.contains("ps") && el.getTotalLength) {
      const L = safe(() => el.getTotalLength(), 0);
      if (L) {
        const q = el.getPointAtLength(L / 2);
        return { c: P(q.x, q.y), b: bbox(el, P) };
      }
    }
    const b = bbox(el, P);
    return b ? { c: { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 }, b } : null;
  }
  function bbox(el, P) {
    const r = safe(() => el.getBBox(), null);
    if (!r) return null;
    const c = [P(r.x, r.y), P(r.x + r.width, r.y), P(r.x, r.y + r.height), P(r.x + r.width, r.y + r.height)];
    return { x0: Math.min(...c.map((p) => p.x)), x1: Math.max(...c.map((p) => p.x)), y0: Math.min(...c.map((p) => p.y)), y1: Math.max(...c.map((p) => p.y)) };
  }
  function overlay(card, spec, dim) {
    const svg = card.querySelector("svg.ixASvg");
    if (!svg) return;
    const byPid = new Map(spec.marks.map((m) => [m.pid, m]));
    const els = new Map();
    card.querySelectorAll("[data-p]").forEach((el) => {
      const pid = String(el.dataset.p).split(".")[0],
        m = byPid.get(pid);
      if (m) {
        el.classList.remove("ixMute");
        el.classList.add(m.role === "key" ? "ixAnsK" : m.role === "bad" ? (m.mine ? "ixAnsM" : "ixAnsX") : "ixAnsS");
        if (!els.has(pid)) els.set(pid, []);
        els.get(pid).push(el);
      } else if (dim) el.classList.add("ixMute");
    });
    // letter badges: at each marked part, nudged apart when they would overlap
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "ixAnsB ov");
    const placed = [];
    let box = null;
    const grow = (b) => {
      if (!b) return;
      box = box ? { x0: Math.min(box.x0, b.x0), x1: Math.max(box.x1, b.x1), y0: Math.min(box.y0, b.y0), y1: Math.max(box.y1, b.y1) } : { ...b };
    };
    for (const m of spec.marks) {
      const list = els.get(m.pid) || [];
      for (const el of list) grow(safe(() => ptsOf(svg, el), null)?.b);
      if (!m.letters.length || !list.length) continue;
      const at = safe(() => ptsOf(svg, list[0]), null);
      if (!at) continue;
      let x = at.c.x,
        y = at.c.y;
      const w = 12 + (m.letters.length - 1) * 9;
      for (let i = 0; i < 12 && placed.some((p) => Math.abs(p.x - x) < (p.w + w) / 2 + 2 && Math.abs(p.y - y) < 17); i++) {
        x += i % 2 ? -(w + 4) * (i + 1) * 0.5 : 0;
        y += i % 2 ? 0 : 17;
      }
      placed.push({ x, y, w });
      const cls = m.role === "key" ? "k" : m.mine ? "m" : "x";
      const t = m.letters.map((l) => l.toUpperCase()).join("·");
      g.insertAdjacentHTML(
        "beforeend",
        '<g class="ixAnsBd ' + cls + '" transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ')"><rect x="' + (-w / 2 - 2).toFixed(1) + '" y="-9" width="' + (w + 4).toFixed(1) + '" height="18" rx="9"/><text y="3.6" text-anchor="middle">' + E(t) + "</text></g>",
      );
    }
    svg.appendChild(g);
    // a panel is zoomed to what it marks
    if (spec.crop && box) {
      const vb = (svg.dataset.vb0 || svg.getAttribute("viewBox")).split(/\s+/).map(Number);
      svg.dataset.vb0 = vb.join(" ");
      const cx = (box.x0 + box.x1) / 2,
        cy = (box.y0 + box.y1) / 2,
        w = Math.min(vb[2], Math.max(170, (box.x1 - box.x0) * 1.9)),
        h = Math.min(vb[3], Math.max(120, (box.y1 - box.y0) * 1.9, w * 0.62));
      const x0 = Math.max(vb[0], Math.min(vb[0] + vb[2] - w, cx - w / 2)),
        y0 = Math.max(vb[1], Math.min(vb[1] + vb[3] - h, cy - h / 2));
      svg.setAttribute("viewBox", [x0, y0, w, h].map((v) => v.toFixed(1)).join(" "));
    }
    const info = card.querySelector(".ixAInfo");
    if (info) info.innerHTML = legendHTML(spec);
  }
  function legendHTML(spec) {
    const rows = spec.legend
      .map((o) => {
        const cls = o.good ? "k" : o.mine ? "m" : "x",
          mark = o.good ? "✓" : "✗",
          name = (o.refs ? "= " + o.refs.map((r) => r.toUpperCase()).join(" + ") + (o.here ? ": " : "") : "") + (o.val ? "“" + E(o.text) + "”, about " : "") + (o.here ? o.names.map((n) => md(n)).join(" + ") : o.fig > 0 ? "on panel " + (o.fig + 1) + " below" : o.fig === 0 ? "on the first picture" : ""),
          tail = o.good ? " <em>right answer</em>" : o.mine ? " <em>your answer</em>" : "";
        if (!o.here && o.fig < 0) return '<div class="ixAnsRow no"><span class="ixAnsDot">' + E(o.k.toUpperCase()) + "</span><span>" + E(o.text) + "</span></div>";
        return '<div class="ixAnsRow ' + (o.here ? "" : "else ") + cls + '"' + (o.here ? ' data-ixans-k="' + E(o.k) + '"' : "") + '><span class="ixAnsDot ' + cls + '">' + E(o.k.toUpperCase()) + '</span><span><b>' + mark + "</b> " + name + tail + "</span></div>";
      })
      .join("");
    const see = spec.see.length ? '<div class="ixAnsSee"><span class="ixAnsDot s">i</span><span>Also in the explanation: ' + spec.see.map((n) => md(n)).join(" · ") + "</span></div>" : "";
    return '<div class="ixAnsLeg">' + rows + see + '<p class="ixAHint">Green = right answer · red = wrong options · blue = also named in the explanation. Tap a letter row to show only that option.</p></div>';
  }
  // tap a legend row: only that option's structures stay lit
  document.addEventListener("click", (ev) => {
    const row = ev.target && ev.target.closest ? ev.target.closest("[data-ixans-k]") : null;
    if (!row) return;
    const card = row.closest(".ixA"),
      spec = card && A.getAns(card.dataset.ixaAns);
    if (!spec) return;
    const k = row.dataset.ixansK,
      pids = new Set(spec.marks.filter((m) => m.letters.includes(k)).map((m) => m.pid)),
      on = row.classList.toggle("on");
    card.querySelectorAll(".ixAnsRow.on").forEach((r) => r !== row && r.classList.remove("on"));
    card.querySelectorAll("[data-p]").forEach((el) => {
      const pid = String(el.dataset.p).split(".")[0];
      el.classList.toggle("ixAnsFade", on && !pids.has(pid) && (el.classList.contains("ixAnsK") || el.classList.contains("ixAnsX") || el.classList.contains("ixAnsM") || el.classList.contains("ixAnsS")));
    });
    card.querySelectorAll(".ixAnsBd").forEach((b) => b.classList.toggle("ixAnsFade", on && !b.textContent.toLowerCase().split("·").includes(k)));
  });

  /* ───────────── under an answered question ───────────── */
  function mount(el, put) {
    const qid = el.dataset.qid,
      mine = el.querySelector(".v16Row.mine .v16L, .v16Row.mine .v16Letter");
    const sel = mine ? mine.textContent.trim().charAt(0).toLowerCase() : "";
    const P = plan(qid, sel);
    if (!P || !P.specs.length) return false;
    const box = document.createElement("div");
    box.className = "ixAWrap ixAnsWrap";
    box.innerHTML = P.specs
      .map((spec, i) => {
        const k = A.putAns(spec);
        return (i ? '<div class="ixAnsPanelHd">Panel ' + (i + 1) + " · the options drawn on another diagram</div>" : "") + A.html(spec.scene, "__ans", { compact: true, ans: k });
      })
      .join("");
    put(box);
    box.querySelectorAll(".ixA").forEach((c, i) => {
      if (i) c.classList.add("ixAPanel");
      A.apply(c, "__ans");
    });
    return true;
  }

  window.IX_ANSWER = { version: "17.3", plan, match, toks, mount, overlay, aliases: AL };
})();
