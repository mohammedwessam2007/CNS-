/* INTELLECTUALITY v41 · what the 199 department books teach that the lessons did not (audit of the owner's Physiology and
 * Biochemistry DIG-206 Department Books 199 against the 50 lessons). Written in the app's own words; each block is slotted in
 * as a new numbered part of its lesson, before "Where people get confused", and its points join "Say it back". */
(function () {
  const T = window.IX_LESSON_TEXT; if (!T) return;
  const SUPP = {
    "intro-nervous-regulation-of-git-function": [
`## Electrical activity of the gut wall: slow waves and spike potentials
The gut's smooth muscle never rests electrically. Two rhythms ride on each other.

**Slow waves** (the basic electrical rhythm) are slow ups and downs of the resting potential (about −50 to −60 mV, 5–15 mV in size). They are **not action potentials** and on their own cause little contraction. They come from the **interstitial cells of Cajal**, star-shaped pacemaker cells wired to the muscle by gap junctions. Their rate sets the top speed of contraction in each segment: about **3–4/min in the stomach, 12/min in the duodenum, 8–9/min in the terminal ileum**, slower again in the colon. There are none in the oesophagus or the upper stomach.

**Spike potentials** are the true action potentials. They fire at the peaks of slow waves when the membrane is pushed above about −40 mV. The more spikes per second, the stronger the contraction. They are carried by **Ca²⁺ (calcium-sodium) channels**, so they are slow and long (10–20 ms), and the Ca²⁺ that enters drives the contraction.

Who moves the baseline? **Stretch, acetylcholine (parasympathetic) and GI hormones depolarise** it → more spikes → stronger motility. **Noradrenaline/adrenaline (sympathetic) hyperpolarise** it → fewer spikes → a quiet gut.
> 🤔 Think: why can the duodenum never contract more than about 12 times a minute? ||Contraction needs spike potentials, spikes ride only on slow-wave peaks, and the duodenal pacemaker makes about 12 slow waves a minute.||`,
`## The gut's immune system and its microbes
The gut is the body's largest contact with the outside world, so it carries the **largest immune system in the body** (lymphoid tissue in the mucosa, Peyer's patches, IgA). This mucosal immune system constantly talks with the **gut microbiota**: the trillions of bacteria in the lumen. When the balance breaks (**dysbiosis**) or mucosal immunity fails, harm can reach well beyond the gut.`],
    "control-of-food-intake": [
`## The hypothalamic centres: feeding versus satiety
Two hypothalamic areas pull against each other.

| | Feeding (hunger) centre | Satiety centre |
|---|---|---|
| Site | **Lateral** hypothalamus | **Ventromedial** nucleus |
| Stimulated | Hunger, food-seeking | Fullness |
| Lesion | Starvation (aphagia) | Overeating → obesity (hyperphagia) |

The satiety centre works by **inhibiting the feeding centre**. Signals that **inhibit feeding**: stomach and duodenal distension, **CCK**, **PYY**, **GLP-1**, insulin and, over the long term, **leptin** from fat. Signals that **stimulate feeding**: **ghrelin** from the empty stomach.
> 🤔 Think: a tumour destroys the ventromedial hypothalamus. What happens to his weight, and why? ||He overeats and becomes obese: the satiety centre that normally brakes the feeding centre is gone.||`],
    "digestion-and-absorption-2": [
`## Amino acids by the glutathione transporter (γ-glutamyl cycle)
Besides the Na⁺-linked carriers, some tissues (intestine, kidney tubule, brain) take amino acids in with **glutathione**. Membrane **γ-glutamyl transferase** moves the glutamyl group from glutathione onto the incoming amino acid, carrying it into the cell as a γ-glutamyl-amino acid. Inside, the amino acid is released and glutathione is rebuilt, which costs **3 ATP** per amino acid: an expensive but powerful pump.
> 🤔 Think: why is the γ-glutamyl cycle called "costly"? ||Rebuilding the glutathione that carried each amino acid in uses 3 ATP.||`,
`## Digestion of nucleoproteins
Nucleoproteins are split into protein + nucleic acid. The protein goes the usual way. **Pancreatic nucleases** (DNase, RNase) cut the nucleic acids into nucleotides; intestinal **nucleotidases** remove phosphate to give nucleosides; **nucleosidases/phosphorylases** split those into a **base + pentose**. Bases are mostly broken down (purines end as **uric acid**), so diet supplies little of the body's own nucleotides.`,
`## Celiac disease (gluten-sensitive enteropathy)
In genetically prone people, **gluten** (gliadin in wheat, barley, rye) triggers an immune attack on the small-intestinal mucosa: **villi flatten**, the brush border is lost, and absorption fails: diarrhoea, fatty stools, weight loss, anaemia (iron, folate), bone loss. Treatment is a **lifelong gluten-free diet**; the mucosa then recovers.
> 🤔 Think: why does a child with celiac disease often have iron-deficiency anaemia? ||Iron is absorbed in the duodenum, exactly where the villi are flattened.||`,
`## Gut microbiota: what the bacteria do for you
The colon's bacteria are an organ of their own. They **ferment fibre to short-chain fatty acids** (fuel for colonocytes), make **vitamin K and some B vitamins**, deconjugate bile acids and recycle urea and drugs, **train the immune system** to tell friend from foe, and **block pathogens** by taking their space and food. Antibiotics that wipe them out can let *C. difficile* take over.`],
    "liver-and-biliary-system-git-motility": [
`## Gallstones: why bile turns to stone
Cholesterol stays dissolved only inside **micelles** made with bile salts and lecithin. Stones form when bile is **supersaturated with cholesterol** (too much cholesterol, too little bile salt or lecithin), when water is over-absorbed in the gall bladder, or when the gall bladder empties poorly (stasis: fasting, pregnancy). A stone in the cystic duct gives biliary colic; in the common bile duct, **obstructive jaundice** with pale stools and dark urine.
> 🤔 Think: why do bile-salt losses (ileal resection) raise the risk of gallstones? ||Fewer bile salts return to the liver, so less cholesterol can be held in micelles and it crystallises.||`],
    "concentration-of-urine-2-urea-hco3-and-h-1-and-2": [
`## Micturition: how the bladder empties
The bladder fills at **low pressure** (it relaxes as it stretches) until about **300–400 ml**, when stretch receptors in its wall fire up the **pelvic nerves** to the **sacral cord (S2–S4)**. The **micturition reflex** returns along parasympathetic pelvic nerves: the **detrusor contracts** and the internal sphincter opens. The **external sphincter** (skeletal muscle, pudendal nerve) is voluntary: the cortex and the **pontine micturition centre** can hold or start voiding. Sympathetic fibres (hypogastric) relax the detrusor and tighten the internal sphincter during filling.

A **cystometrogram** shows it: pressure stays flat as volume rises, then **micturition waves** appear, and above ~400 ml they grow until the reflex wins.

**Clinical:** a spinal cord injury above the sacral segments first gives a **flaccid, overflowing bladder** (spinal shock), then an **automatic (reflex) bladder** that empties without control; destroying the sacral afferents gives an **atonic bladder** that dribbles.
> 🤔 Think: why can a baby not hold urine while an adult can? ||The reflex is sacral and works from birth; holding needs cortical and pontine control over the external sphincter, which matures later.||`,
`## Kidney function tests (the practical)
- **Urine:** volume, colour, specific gravity / osmolality (concentrating power), protein, glucose, casts and cells.
- **Blood:** **urea** and **creatinine** rise when GFR falls (creatinine is the better marker: made at a steady rate from muscle and only filtered, apart from a little secretion).
- **Clearance tests:** **creatinine clearance ≈ GFR** (normal about 100–125 ml/min); inulin is the gold standard; **PAH clearance ≈ renal plasma flow**.
- **Concentration/dilution tests:** water deprivation should raise urine osmolality; a water load should dilute it. Failure of both points to tubular disease.
> 🤔 Think: why is creatinine clearance a slight over-estimate of GFR? ||A small amount of creatinine is secreted by the tubules as well as filtered, so more appears in urine than filtration alone delivers.||`],
  };
  const SAY = {
    "intro-nervous-regulation-of-git-function": ["Slow waves (Cajal cells) set the maximum rhythm; spike potentials on their peaks make the contraction.", "The gut has the body's largest immune system, in constant talk with its microbiota."],
    "control-of-food-intake": ["Lateral hypothalamus = feeding; ventromedial = satiety (it brakes feeding); ghrelin stimulates, CCK/PYY/leptin inhibit."],
    "digestion-and-absorption-2": ["The γ-glutamyl (glutathione) cycle brings amino acids in at a cost of 3 ATP.", "Nucleases → nucleotidases → nucleosidases: nucleic acids end as bases and pentoses.", "Celiac disease: gluten flattens the villi; a lifelong gluten-free diet heals them."],
    "liver-and-biliary-system-git-motility": ["Gallstones form when bile is supersaturated with cholesterol relative to bile salts and lecithin, or stagnates."],
    "concentration-of-urine-2-urea-hco3-and-h-1-and-2": ["Micturition is a sacral (S2–S4) parasympathetic reflex that the pons and cortex control through the external sphincter.", "Creatinine clearance ≈ GFR; PAH clearance ≈ renal plasma flow."],
  };
  const DONE = (window.__ixSuppDone = window.__ixSuppDone || new Set());
  Object.keys(SUPP).forEach((key) => {
    let t = T[key]; if (!t || DONE.has(key)) return;
    const nums = (t.match(/^## (\d+)\./gm) || []).map((x) => +x.replace(/\D/g, "")); let n = nums.length ? Math.max(...nums) : 0;
    const block = SUPP[key].map((b) => b.replace(/^## /, "## " + ++n + ". ")).join("\n\n");
    const at = t.search(/^## Where people get confused/m), at2 = at >= 0 ? at : t.search(/^## (How it links|What the exam|Say it back)/m);
    t = at2 >= 0 ? t.slice(0, at2) + block + "\n\n" + t.slice(at2) : t + "\n\n" + block;
    const sb = t.search(/^## Say it back/m);
    if (sb >= 0 && SAY[key]) { const k = (t.slice(sb).match(/^\d+\./gm) || []).length; t = t.trimEnd() + "\n" + SAY[key].map((s, i) => k + i + 1 + ". " + s).join("\n") + "\n"; }
    T[key] = t; DONE.add(key);
  });
  window.IX_LESSON_SUPP = Object.keys(SUPP);
})();
