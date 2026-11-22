/* INTELLECTUALITY v48 · the doctors' notes inside their lessons (owner, 22 Nov: "integrate these: histology notes and
 * physiology notes, in the right places"). Dr. Abdelwahab's DIG-206 histology notes and Dr. Fawzy's GIT physiology notes
 * (A.F. 2027) were matched page by page to the lessons. Each lesson gets one part: where its topic sits in his notes and the
 * points he stresses that the lesson did not already make, in the app's own words (the notes themselves stay his). */
(function () {
  const T = window.IX_LESSON_TEXT; if (!T) return;
  const A = "Dr. Abdelwahab's histology notes", F = "Dr. Fawzy's GIT physiology notes";
  const N = {
"oral-cavity-palate-pharynx": [A, "3–11", [
  "Lip: **three surfaces** in one section — skin (keratinised, hair follicles, sebaceous and sweat glands), the **red margin** (thin keratinised epithelium over tall vascular papillae: why lips look red) and the **mucous surface** (non-keratinised, with mixed **labial glands**); a core of **orbicularis oris** skeletal muscle.",
  "Tongue: the **dorsal** surface is rough (papillae, adherent mucosa without submucosa), the **ventral** surface smooth (thin non-keratinised mucosa with a submucosa); the muscle core runs in **three planes**, giving the mobility mastication and speech need.",
  "Taste buds are **onion-shaped, pale neuroepithelial bodies** with wide bases and narrow apices opening at the taste pore.",
  "Palate: the **oral aspect** is stratified squamous (keratinised over the hard palate), the **nasal aspect** respiratory epithelium; the soft palate has skeletal muscle and mucous glands."]],
"oesophagus-and-stomach": [A, "12–22", [
  "Name the layers as he does: **mucosa, submucosa, musculosa, adventitia/serosa**; in the stomach the lamina propria is called the **corium** — it holds the fundic glands in the fundus and the pyloric glands in the pylorus.",
  "Fundic gland, top to bottom: **isthmus** (surface mucous + stem cells), **neck** (mucous neck cells, parietal cells), **base** (chief cells, enteroendocrine cells).",
  "Six cell types to list: surface mucous, mucous neck, **parietal (oxyntic)**, **peptic (chief, central)**, **undifferentiated stem**, **enteroendocrine (argentaffin, APUD)** — argentaffin because their granules reduce **silver** salts.",
  "Chief cell EM: basal rER, **prominent supranuclear Golgi**, apical zymogen granules — the textbook protein-secreting cell.",
  "Gastro-oesophageal junction: an abrupt change from stratified squamous to simple columnar mucus-secreting epithelium."]],
"small-intestine": [A, "23–30", [
  "Enterocyte EM: microvilli with glycocalyx, terminal web, junctional complexes, **numerous mitochondria**, sER and supranuclear Golgi for fat re-esterification.",
  "The epithelium of crypts holds **undifferentiated stem cells** that renew the lining every few days, and **Paneth cells** at the base.",
  "Enteroendocrine (DNES/APUD) cells are **argentaffin** and secrete into the lamina propria capillaries.",
  "**Pyloro-duodenal junction**: pyloric glands give way to villi, and **Brunner's glands** appear in the submucosa; the circular muscle thickens into the pyloric sphincter."]],
"large-intestine-and-anal-canal": [A, "31–36", [
  "Use his comparison table small vs large intestine: villi (present / absent), plicae (present / absent), goblet cells (fewer / very many), Paneth cells (present / few or absent), outer longitudinal muscle (complete / **teniae coli**), appendices epiploicae (absent / present).",
  "Appendix: lymphoid **nodules** accumulate in the mucosa and submucosa and interrupt the muscularis mucosae.",
  "Anal canal at the level of the anal valves: the change from columnar to stratified squamous (the **squamous zone**); his clinical note is the haemorrhoidal venous plexus in the submucosa."]],
"salivary-glands": [A, "37–44", [
  "Classify by secretion: **serous** (parotid), **mucous**, **mucoserous / mixed** (submandibular, sublingual).",
  "Every gland has a **stroma** (capsule, septa dividing it into **lobes and lobules**, reticular fibres) and a **parenchyma** (acini + ducts).",
  "Serous cell EM: basal rER, supranuclear Golgi, apical zymogen granules, and **interdigitating** lateral membranes joined by junctional complexes; striated duct cells have basal infoldings with mitochondria.",
  "Learn his table of differences between the three glands (type of acini, demilunes, length of intercalated and striated ducts, fat cells)."]],
"pancreas": [A, "45–49", [
  "Stroma: a thin capsule and septa, with a **reticular** network shown by **silver** stain.",
  "**Centro-acinar cells** are the beginning of the intercalated duct **telescoped** into the acinus lumen: pale, squamous to cuboidal, inside the acinus.",
  "Islets: A (glucagon), **B (insulin, the majority, central)**, D (somatostatin, which controls A and B by paracrine action).",
  "His parotid vs pancreas table: striated ducts (many / none), centro-acinar cells (absent / present), islets (absent / present), fat cells (present / few)."]],
"liver-and-gall-bladder": [A, "50–58", [
  "Portal tract (canal): branch of the portal vein, branch of the hepatic artery, bile ductule lined by **cubical** cells, and lymphatics, in connective tissue.",
  "Hepatocyte: one or two **rounded central nuclei**, acidophilic cytoplasm; organelles — abundant rER, sER, mitochondria, Golgi, **lysosomes**, peroxisomes; inclusions — **glycogen and lipid** droplets.",
  "Three membrane surfaces: sinusoidal (microvilli into the space of Disse), canalicular (bile canaliculi), and lateral (junctions).",
  "Gall bladder wall: mucosa (tall columnar + corium), **fibromuscular** layer, perimuscular connective tissue, serosa."]],
"intro-to-the-kidney-renal-corpuscle": [A, "59–67", [
  "Gross: **cortex** (cortical labyrinth + medullary rays) and **medulla** (pyramids); cortex dipping between pyramids forms the **columns of Bertin**; papillae open into **minor calyces**, which join into **major calyces** and the pelvis.",
  "**Renal lobe** = a pyramid with its cortical cap; **renal lobule** = a medullary ray with the nephrons around it.",
  "The **uriniferous tubule** = the nephron + the collecting tubule (two different origins).",
  "Renal (**Malpighian**) corpuscle: glomerulus + Bowman's capsule; the **glomerular filtration barrier** lets through molecules below about **70,000 daltons** (albumin is at the edge) and favours cations."]],
"convoluted-tubules-loop-of-henle-collecting-tubules": [A, "68–72", [
  "PCT vs DCT in his table: diameter (larger / smaller), lumen (narrow, irregular / wide, regular), cells (cubical, ill-defined borders, deeply acidophilic / cubical, clearer borders, less acidophilic), brush border (present / absent), nuclei per section (few / more).",
  "Lateral **interdigitations** and basal mitochondria are the EM sign of active transport in both.",
  "**Connecting tubules** link the DCT to the cortical collecting tubules, which join into medullary collecting tubules and the ducts of Bellini.",
  "Principal vs intercalated cells: principal — pale, few organelles, **ADH raises their water permeability**; intercalated — dark, many mitochondria, acid–base."]],
"juxtaglomerular-apparatus-blood-supply-urinary-passages": [A, "73–79", [
  "JG cells are **modified smooth muscle cells** of the afferent arteriole with **renin** granules; macula densa cells are tall and crowded, with apical nuclei; lacis cells lie between.",
  "Urinary passages share one plan: **uroepithelium** (transitional), a lamina propria, a smooth-muscle **musculosa**, and a **fibroelastic** adventitia.",
  "Bladder: the uroepithelium thins when full; the musculosa is three interlacing layers (detrusor).",
  "Urethra: learn his table of the parts and their lining (prostatic → membranous → penile)."]],
"intro-nervous-regulation-of-git-function": [F, "1–5", [
  "The GIT supplies nutrients, water and electrolytes by three jobs: **mixing** with secretions, **moving** the meal (motility), and **absorbing** the products.",
  "Slow-wave **frequency**: about 4/min in the stomach, **12/min in the duodenum**, 8 in the distal ileum, 2 in the caecum, 6 in the sigmoid colon; none in the oesophagus and upper stomach.",
  "Stretch, acetylcholine and GI hormones **depolarise** (more excitable); **norepinephrine** hyperpolarises.",
  "Parasympathetic vs sympathetic table: excites secretion and motility, relaxes sphincters / inhibits them, contracts sphincters, constricts vessels."]],
"hormonal-regulation-of-git-function": [F, "6–7", [
  "Learn his hormone table as **site of release → stimuli that increase it → actions**.",
  "CCK and secretin **augment each other** on the pancreas; CCK contracts the gall bladder; secretin increases the volume of pancreatic and biliary juice."]],
"salivary-secretion-gastric-secretion-1": [F, "8–13", [
  "Saliva = **organics** (enzymes such as **ptyalin**, and mucin) + **inorganics** (K⁺, HCO₃⁻, Na⁺, Cl⁻).",
  "Functions he lists: protection of the oral mucosa, digestion (ptyalin), protection of the teeth, lubrication and wetting for speech and swallowing, excretion, and **taste**.",
  "Parasympathetic vs sympathetic table for the submandibular and parotid glands: copious watery saliva and vasodilation / scanty thick saliva.",
  "HCl: the parietal-cell mechanism, its receptors (M3, H2, CCK-B) and the **cephalic** phase driven by the cerebral cortex, appetite and the hypothalamus through the vagus."]],
"pancreatic-and-small-intestinal-secretions": [F, "14–16, 20–21", [
  "Proteolytic enzymes are secreted inactive; **enteropeptidase** (enterokinase) starts the cascade.",
  "Secretin → watery HCO₃⁻; **cholecystokinin** → enzymes; each potentiates the other.",
  "Small-intestinal juice: mucus from Brunner's glands and crypt fluid; most enzymes act at the brush border."]],
"liver-and-biliary-system-git-motility": [F, "17–19", [
  "The liver as a **reservoir** holds 200–400 ml of blood and releases it in haemorrhage.",
  "As a **glucostat**: glycogenesis, glycogenolysis, gluconeogenesis, and conversion of galactose and fructose to glucose.",
  "Fat: fatty-acid oxidation for energy; makes **VLDL and LDL** (HDL by liver and intestine).",
  "Protein: about **90% of plasma proteins** (albumin → oedema and ascites in liver failure; most clotting factors), **deamination** and **urea** formation, all non-essential amino acids.",
  "Storage: vitamins **A, D and B₁₂**; iron by the **apoferritin–ferritin** system, the blood iron buffer (iron binds apoferritin when high and is released when low)."]],
"deglutition-and-oesophagus-gastric-motility-1": [F, "22–25", [
  "**Mastication**: muscles of the 5th cranial nerve, rhythmic by the **chewing reflex** (bolus → jaw muscles inhibited → jaw drops → stretch reflex → jaw closes → bolus compressed again). It breaks food, mixes it with saliva, stimulates taste and smell, and helps satiety.",
  "Pharyngeal stage as a reflex arc: **stimulus** bolus, **receptors** on the tonsillar pillars, **afferent** glossopharyngeal, **centre** in the medulla and lower pons, **response** peristalsis + upper sphincter relaxation + the four protective reflexes (mouth, nose, larynx, swallowing apnoea 1–2 s).",
  "Primary vs secondary oesophageal peristalsis: the swallow-started wave vs the wave started by distension from food left behind.",
  "Stomach motor functions: **storage** (receptive relaxation), **mixing**, and **emptying**."]],
"gastric-motility-2-small-intestinal-motility": [F, "26–27", [
  "Movements of the small intestine: segmentation (mixing), peristalsis (propulsion towards the ileocaecal valve), and the fasting MMC.",
  "Distension of the terminal ileum and the gastroileal reflex control the **ileocaecal** sphincter."]],
"colon-and-rectum": [F, "28–30", [
  "Colon: haustral (mixing) contractions and mass movements started by distension or irritation of the mucosa, and after meals.",
  "Defecation is held until conditions are acceptable: the **cerebral cortex** controls the external sphincter."]],
  };
  const DONE = (window.__ixNotesDone = window.__ixNotesDone || new Set());
  Object.keys(N).forEach((key) => {
    let t = T[key]; if (!t || DONE.has(key)) return;
    const [who, pages, pts] = N[key];
    const nums = (t.match(/^## (\d+)\./gm) || []).map((x) => +x.replace(/\D/g, "")); const n = (nums.length ? Math.max(...nums) : 0) + 1;
    const block = "## " + n + ". 📒 From your doctor's notes\n**" + who + ", pages " + pages + "** cover this lesson. The points he stresses, so your answers match his:\n" + pts.map((p) => "- " + p).join("\n") + "\n\n> Open his notes at those pages once this lesson is done: you will recognise every line.";
    const at = t.search(/^## Where people get confused/m), at2 = at >= 0 ? at : t.search(/^## (How it links|What the exam|Say it back)/m);
    t = at2 >= 0 ? t.slice(0, at2) + block + "\n\n" + t.slice(at2) : t + "\n\n" + block;
    T[key] = t; DONE.add(key);
  });
  window.IX_LESSON_NOTES = Object.fromEntries(Object.entries(N).map(([k, v]) => [k, { who: v[0], pages: v[1] }]));
})();
