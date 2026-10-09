/* v18.8: what a question or a drawing's caption is ABOUT, not only the words it uses.
   The drawings are matched to an answer by the words the caption and the question share (dept-figs-v16.js). Exact words
   miss the same thing said another way: "lateral rectus palsy" and "abducent nerve", "CN VI" and "abducent", "PICA" and
   "posterior inferior cerebellar artery", "Horner's syndrome" and "the cervical sympathetic chain", "nerves" and "nerve".
   expand(text) adds the plain anatomical words a phrase stands for (a nerve number gives the nerve's name, a muscle its
   nerve, a clinical sign the structures it points to, an abbreviation its full name); tokens(text) is then the set of
   word stems used to compare a question with a caption (plurals, Latin plurals and British/American spellings folded
   together). The same is done to both sides, so either one may use either wording. */
(function (root) {
  const CN = [null, "olfactory nerve", "optic nerve", "oculomotor nerve", "trochlear nerve", "trigeminal nerve", "abducent nerve", "facial nerve", "vestibulocochlear nerve cochlear vestibular", "glossopharyngeal nerve", "vagus nerve", "accessory nerve", "hypoglossal nerve"];
  const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10, xi: 11, xii: 12 };
  const ORD = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12 };
  const num = (s) => {
    s = String(s).toLowerCase();
    if (ROMAN[s]) return ROMAN[s];
    if (ORD[s]) return ORD[s];
    const n = parseInt(s, 10);
    return n >= 1 && n <= 12 ? n : 0;
  };
  // [pattern, the words it stands for]. Patterns are matched case-insensitively on the original text.
  const RULES = [
    // abbreviations and eponyms → full names
    [/\bICA\b/, "internal carotid artery"],
    [/\bECA\b/, "external carotid artery"],
    [/\bCCA\b/, "common carotid artery"],
    [/\bMCA\b/, "middle cerebral artery"],
    [/\bACA\b/, "anterior cerebral artery"],
    [/\bPCA\b/, "posterior cerebral artery"],
    [/\bPICA\b/, "posterior inferior cerebellar artery"],
    [/\bAICA\b/, "anterior inferior cerebellar artery"],
    [/\bSCA\b/, "superior cerebellar artery"],
    [/\bIJV\b/, "internal jugular vein"],
    [/\bEJV\b/, "external jugular vein"],
    [/\bCSF\b/, "cerebrospinal fluid"],
    [/\bUMNL?\b|upper motor neuron/i, "upper motor neuron pyramidal corticospinal tract"],
    [/\bLMNL?\b|lower motor neuron/i, "lower motor neuron anterior horn cells"],
    [/\bML[FB]\b|medial longitudinal (fasciculus|bundle)/i, "medial longitudinal bundle fasciculus"],
    [/\bVPLN?\b|ventral postero-?lateral/i, "ventral posterolateral nucleus thalamus"],
    [/\bVPMN?\b|ventral postero-?medial/i, "ventral posteromedial nucleus thalamus"],
    [/\bLGB\b|lateral geniculate/i, "lateral geniculate body"],
    [/\bMGB\b|medial geniculate/i, "medial geniculate body"],
    [/\bRAS\b|reticular activating/i, "reticular activating system reticular formation"],
    [/\bSCP\b/, "superior cerebellar peduncle"],
    [/\bMCP\b/, "middle cerebellar peduncle"],
    [/\bICP\b(?!\s*\()/, "inferior cerebellar peduncle"],
    [/\bPPRF\b|paramedian pontine/i, "paramedian pontine reticular formation abducent"],
    [/\bINO\b|internuclear ophthalmoplegia/i, "medial longitudinal bundle internuclear ophthalmoplegia"],
    [/\bNTS\b|tractus solitarius|solitary (tract|nucleus)/i, "solitary nucleus tract"],
    [/edinger.?westphal|\bE\.?W\.? nucleus/i, "edinger westphal nucleus oculomotor parasympathetic pupil"],
    [/\bEEG\b/, "electroencephalogram brain waves"],
    [/\bREM\b/, "rapid sleep"],
    [/\bGABA\b/, "gamma aminobutyric inhibitory transmitter"],
    [/\bEPSP\b/, "excitatory postsynaptic potential synapse"],
    [/\bIPSP\b/, "inhibitory postsynaptic potential synapse"],
    [/\bTMJ\b/, "temporomandibular joint"],
    [/\bIOP\b/, "intraocular pressure aqueous humour"],
    [/\bBBB\b|blood.brain barrier/i, "blood brain barrier capillary astrocyte"],
    [/circle of willis/i, "arterial circle cerebral arteries communicating"],
    [/\b(aqueduct of sylvius|sylvian aqueduct)\b/i, "cerebral aqueduct midbrain"],
    [/foram(en|ina) of monro/i, "interventricular foramen"],
    [/luschka|magendie/i, "foramina fourth ventricle median lateral"],
    [/arachnoid (villi|granulation)/i, "arachnoid granulations superior sagittal sinus"],
    [/\bbroca/i, "motor speech area inferior frontal gyrus"],
    [/wernicke/i, "sensory speech area superior temporal gyrus"],
    [/clarke'?s (column|nucleus)|nucleus dorsalis/i, "nucleus dorsalis spinocerebellar"],
    [/organ of corti/i, "spiral organ cochlea hair cells"],
    [/scarpa/i, "vestibular ganglion"],
    [/\bpurkinje/i, "purkinje cells cerebellar cortex"],
    [/(bundle|band) of baillarger|stria of gennari|line of gennari/i, "visual cortex striate area"],
    // other names for the same part
    [/abducens/i, "abducent"],
    [/(auditory|acoustic|stato.?acoustic) nerve/i, "vestibulocochlear nerve cochlear"],
    [/spinal accessory/i, "accessory nerve"],
    [/mesencephal/i, "midbrain"],
    [/rhombencephal/i, "hindbrain pons medulla cerebellum"],
    [/prosencephal/i, "forebrain"],
    [/telencephal/i, "cerebral hemisphere"],
    [/metencephal/i, "pons cerebellum"],
    [/myelencephal/i, "medulla"],
    [/lenticular nucleus|lentiform/i, "lentiform nucleus putamen globus pallidus"],
    [/pallidum|pallidus/i, "globus pallidus lentiform"],
    [/neostriatum|\bstriatum\b|corpus striatum/i, "corpus striatum caudate putamen"],
    [/hypophys/i, "pituitary"],
    [/neurohypophys/i, "posterior pituitary"],
    [/adenohypophys/i, "anterior pituitary"],
    [/epiphysis cerebri|pineal/i, "pineal body"],
    [/calcarine|area 17|striate cortex|primary visual/i, "visual area cortex occipital calcarine"],
    [/precentral gyrus|area 4\b|primary motor (area|cortex)|\bM1\b/i, "primary motor area precentral gyrus"],
    [/postcentral gyrus|areas? 3[, ]+1[, ]+(and |& )?2|somatosensory (area|cortex)|somaesthetic/i, "somatosensory area postcentral gyrus"],
    [/areas? 41|transverse temporal|heschl|primary auditory/i, "auditory area cortex superior temporal gyrus"],
    [/pyramidal (tract|system|fibres|fibers|pathway)/i, "pyramidal corticospinal tract"],
    [/corticospinal/i, "pyramidal corticospinal tract"],
    [/extrapyramidal/i, "extrapyramidal basal ganglia"],
    [/dorsal column|posterior column|fasciculus (gracilis|cuneatus)|gracile|cuneate/i, "posterior column gracile cuneate medial lemniscus"],
    [/medial lemniscus/i, "medial lemniscus posterior column"],
    [/spinothalamic|anterolateral (system|tract|pathway)/i, "spinothalamic tract pain temperature"],
    [/spinocerebellar/i, "spinocerebellar tract cerebellum"],
    [/rubrospinal|red nucleus/i, "red nucleus rubrospinal midbrain"],
    [/tectospinal|tectobulbar/i, "tectospinal superior colliculus"],
    [/vestibulospinal/i, "vestibulospinal vestibular nuclei"],
    [/reticulospinal/i, "reticulospinal reticular formation"],
    [/\bdentate nucleus|\bemboliform|\bglobose|\bfastigial/i, "cerebellar nuclei dentate"],
    [/vermis|flocculonodular|archicerebell|paleocerebell|neocerebell|spinocerebell|cerebrocerebell|vestibulocerebell/i, "cerebellum cerebellar"],
    [/hippocamp|dentate gyrus|fornix|mamillary|mammillary|cingulate|amygdal|papez|limbic/i, "limbic system"],
    [/choroid plexus/i, "choroid plexus cerebrospinal fluid ventricle"],
    [/lumbar puncture|spinal tap/i, "lumbar puncture subarachnoid space cerebrospinal fluid spinal cord ends"],
    [/chorda tympani/i, "chorda tympani facial nerve taste"],
    [/geniculate ganglion/i, "geniculate ganglion facial nerve"],
    [/greater (superficial )?petrosal/i, "greater petrosal facial nerve lacrimal"],
    [/lesser petrosal|otic ganglion/i, "otic ganglion glossopharyngeal parotid"],
    [/sphenopalatine|pterygopalatine/i, "pterygopalatine ganglion"],
    [/ciliary ganglion/i, "ciliary ganglion oculomotor"],
    [/submandibular ganglion/i, "submandibular ganglion facial chorda tympani"],
    [/nucleus ambiguus/i, "nucleus ambiguus vagus glossopharyngeal"],
    [/\bV1\b|ophthalmic (division|nerve)/i, "ophthalmic trigeminal"],
    [/\bV2\b|maxillary (division|nerve)/i, "maxillary trigeminal"],
    [/\bV3\b|mandibular (division|nerve)/i, "mandibular trigeminal"],
    [/\bLR6\b/, "lateral rectus abducent"],
    [/\bSO4\b/, "superior oblique trochlear"],
    // a muscle → its nerve
    [/lateral rectus/i, "abducent nerve lateral rectus"],
    [/superior oblique/i, "trochlear nerve superior oblique"],
    [/(medial|superior|inferior) rectus|inferior oblique|levator palpebrae/i, "oculomotor nerve"],
    [/sphincter pupillae|constrictor pupillae|ciliary muscle/i, "oculomotor parasympathetic edinger westphal ciliary ganglion"],
    [/dilator pupillae/i, "sympathetic pupil"],
    [/muscles? of mastication|masseter|temporalis|pterygoid muscle|(lateral|medial) pterygoid/i, "mandibular trigeminal mastication motor"],
    [/tensor tympani|tensor (veli )?palatini/i, "mandibular trigeminal"],
    [/muscles? of facial expression|buccinator|orbicularis|platysma|stapedius|occipitofrontalis/i, "facial nerve"],
    [/stylopharyngeus/i, "glossopharyngeal nerve"],
    [/sterno-?(cleido-?)?mastoid|trapezius/i, "accessory nerve"],
    [/genioglossus|hyoglossus|styloglossus|(muscles of|intrinsic muscles of) the tongue/i, "hypoglossal nerve tongue"],
    [/palatoglossus|levator (veli )?palatini|pharyngeal constrictor|constrictors of the pharynx|cricothyroid|intrinsic muscles of the larynx|laryngeal muscles/i, "vagus nerve pharyngeal laryngeal"],
    // a clinical sign or syndrome → the parts it points to
    [/horner/i, "horner sympathetic cervical ganglion ptosis miosis"],
    [/bell'?s palsy|facial (palsy|paralysis)/i, "facial nerve"],
    [/lateral medullary (syndrome|lesion|infarct)|wallenberg/i, "lateral medulla posterior inferior cerebellar artery"],
    [/medial medullary (syndrome|lesion|infarct)|dejerine/i, "medial medulla hypoglossal pyramid medial lemniscus anterior spinal artery"],
    [/\bweber/i, "midbrain oculomotor cerebral peduncle crus"],
    [/benedikt/i, "midbrain tegmentum red nucleus oculomotor"],
    [/parinaud/i, "superior colliculus pretectal midbrain"],
    [/brown.?s[eé]quard|hemisection/i, "spinal cord hemisection tracts"],
    [/syringomyel/i, "spinal cord central canal spinothalamic decussation"],
    [/tabes dorsalis/i, "posterior column dorsal root"],
    [/subacute combined/i, "posterior column corticospinal"],
    [/argyll.?robertson/i, "pretectal light reflex pupil"],
    [/hemiballism/i, "subthalamic nucleus"],
    [/parkinson/i, "substantia nigra basal ganglia"],
    [/chorea|huntington/i, "caudate nucleus corpus striatum basal ganglia"],
    [/athetosis/i, "basal ganglia"],
    [/intention tremor|dysmetria|dysdiadochokinesia|cerebellar (ataxia|lesion|syndrome)|past.pointing/i, "cerebellum cerebellar"],
    [/hemianop|quadrantanop|bitemporal/i, "optic pathway chiasma tract radiation visual"],
    [/aphasia|dysphasia/i, "speech area"],
    [/hydroceph/i, "cerebrospinal fluid ventricles aqueduct"],
    [/papill?oedema|papilledema/i, "optic disc retina"],
    [/extradural|epidural ha?ematoma/i, "middle meningeal artery extradural"],
    [/subdural/i, "subdural cerebral veins superior sagittal sinus"],
    [/subarachnoid ha?emorrhage|berry aneurysm/i, "arterial circle subarachnoid"],
    [/cavernous sinus/i, "cavernous sinus oculomotor trochlear abducent ophthalmic"],
    [/danger(ous)? (area|triangle)/i, "facial vein cavernous sinus"],
    [/jaw jerk/i, "mesencephalic nucleus trigeminal mandibular"],
    [/corneal (reflex|blink)/i, "corneal reflex trigeminal ophthalmic facial"],
    [/gag reflex|pharyngeal reflex/i, "glossopharyngeal vagus"],
    [/light reflex|pupillary reflex|consensual/i, "light reflex pretectal edinger westphal oculomotor"],
    [/accommodation/i, "accommodation ciliary oculomotor"],
    [/conjugate (gaze|deviation|movement)/i, "medial longitudinal bundle abducent oculomotor"],
    [/anterior two.thirds of the tongue|anterior 2\/3/i, "chorda tympani facial lingual"],
    [/posterior (one.)?third of the tongue|posterior 1\/3/i, "glossopharyngeal"],
    [/(tongue|it) (deviates|protrud)/i, "hypoglossal genioglossus"],
    [/anosmia/i, "olfactory"],
    [/deafness|hearing loss/i, "cochlear hearing"],
    [/vertigo|nystagmus/i, "vestibular"],
    [/ptosis/i, "levator palpebrae oculomotor sympathetic"],
    [/diplopia|squint|strabismus/i, "extraocular muscles"],
    [/wrist drop|claw hand|winging/i, "peripheral nerve"],
    [/decorticate|decerebrate/i, "red nucleus vestibulospinal brain stem"],
    [/hemipleg|hemipar|monopleg/i, "upper motor neuron pyramidal corticospinal internal capsule"],
    [/spinal shock|paraplegia|quadriplegia|tetraplegia/i, "spinal cord transection"],
  ];
  function expand(text) {
    const t = String(text || "");
    const add = [];
    for (const [re, words] of RULES) if (re.test(t)) add.push(words);
    // cranial nerves by number: "CN VI", "cranial nerves III, IV and VI", "6th nerve", "the seventh cranial nerve", "nerves 3, 4 & 6"
    const cn = new Set();
    const list = "(?:[ivx]{1,4}|\\d{1,2})(?:(?:\\s*,\\s*|\\s*&\\s*|\\s+and\\s+|\\s*/\\s*)(?:[ivx]{1,4}|\\d{1,2}))*";
    for (const m of t.matchAll(new RegExp("\\b(?:cn|cranial nerves?|nerves?)\\s+(" + list + ")\\b", "gi"))) for (const x of m[1].split(/[^ivx\d]+/i)) cn.add(num(x));
    for (const m of t.matchAll(/\b((?:\d{1,2}(?:st|nd|rd|th)\b(?:\s*(?:,|&|and)\s*)?)+)\s*(?:cranial\s+)?(?:nerves?\b|n\.|nuclei\b)/gi)) for (const x of m[1].match(/\d{1,2}/g)) cn.add(num(x));
    for (const m of t.matchAll(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)\s+(?:cranial\s+)?nerve/gi)) cn.add(num(m[1]));
    for (const m of t.matchAll(/\b([ivx]{1,4})(?:th)?\s+(?:cranial\s+)?nerves?\b/gi)) cn.add(num(m[1]));
    for (const n of cn) if (n) add.push(CN[n]);
    return add.length ? t + " . " + add.join(" . ") : t;
  }
  const IRREG = { nuclei: "nucleus", foramina: "foramen", ganglia: "ganglion", gyri: "gyrus", sulci: "sulcus", colliculi: "colliculus", fasciculi: "fasciculus", thalami: "thalamus", villi: "villus", corpora: "corpus", cornua: "cornu", septa: "septum", meninges: "meninx", lemnisci: "lemniscus", plexuses: "plexus", arterial: "artery", venous: "vein", fibers: "fibre", fiber: "fibre", center: "centre", centers: "centre", tumor: "tumour", color: "colour" };
  const STOP = new Set("which following these those their there about after before with from that this have been were your other more most some such only upon onto into over under each both also than then them they where when while within without around behind inside outside above below along across through during between lies lying part parts side form forms formed type types drawn drawing section sections seen shown show showing carry carri pass give receive contain cause called known found present include consist arise enter leave reach lead produce result occur become make take help mainly usually true correct statement except best answer choose regarding concerning select mark move close loss lost level right left outer inner first second function functions stimuli stop different difference input output".split(" "));
  // one root for a word's verb, noun and adjective forms ("rotates", "rotation"; "ossicles", "ossicular")
  const ROOTS = ["rotat", "ossic", "vibrat", "accommod", "degenerat", "regenerat", "innervat", "decussat", "refract", "inhibit", "excit", "adapt", "transduc", "depolari", "hyperpolari", "secret", "drain", "myelin", "demyelin", "paraly", "anaesth", "anesth", "atroph", "hypertroph", "spastic", "flaccid", "reflex", "lacrima", "olfact", "gustat", "audit", "cochlea", "vestibul"];
  function lemma(w) {
    if (IRREG[w]) return IRREG[w];
    for (const r of ROOTS) if (w.startsWith(r)) return r;
    if (w.length > 4) {
      if (w.endsWith("ies")) return w.slice(0, -3) + "y";
      if (/(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
      if (w.endsWith("ae")) return w.slice(0, -1);
      if (w.endsWith("s") && !/(ss|us|is|ys)$/.test(w)) return w.slice(0, -1);
    }
    return w;
  }
  const norm = (t) => t.toLowerCase().replace(/haem/g, "hem").replace(/aemia/g, "emia").replace(/oedem/g, "edem").replace(/oesoph/g, "esoph").replace(/aesth/g, "esth").replace(/foet/g, "fet");
  function stems(text, out, wt) {
    for (const w of norm(text).match(/[a-z]{4,}/g) || []) {
      if (STOP.has(w)) continue;
      const l = lemma(w);
      if (STOP.has(l)) continue;
      const t = l.slice(0, 6);
      if (!(out.get(t) >= wt)) out.set(t, wt);
    }
    return out;
  }
  // stem -> weight: a word the text really uses counts 1, a word only implied by it (expand) counts IMPLIED
  const IMPLIED = 0.5;
  function weighted(text) {
    const t = String(text || "");
    const out = stems(t, new Map(), 1);
    const x = expand(t);
    return x.length > t.length ? stems(x.slice(t.length), out, IMPLIED) : out;
  }
  const tokens = (text) => new Set(weighted(text).keys());
  const api = { expand, tokens, weighted, RULES };
  root.INTELLECTUALITY_FIG_CONCEPTS = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
