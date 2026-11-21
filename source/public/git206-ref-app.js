/* v34 · reference answers written by the app for the 10 DIG-206 written topics that had none in the department notes.
 * Same shape as git206-ref.js; marked src "App reference" so the grader and the student know where they came from. */
(function () {
  const R = (window.IX_GIT206_REF = window.IX_GIT206_REF || {});
  const add = (topic, head, text) => { (R[topic] = R[topic] || []).push({ src: "App reference (v34)", head, text }); };

  add("Kidney: relations, surface anatomy, development", "Kidney: relations, surface anatomy and development", `1. Position: retroperitoneal on the posterior abdominal wall, T12–L3; right kidney ~1.25 cm lower (liver).
2. Surface anatomy (back): Morris' parallelogram — two vertical lines 2.5 cm and 9 cm from the midline, two horizontal lines at T11 and L3 spines. Hilum at L1, 5 cm from the midline (front: transpyloric plane, just medial to the tip of the 9th costal cartilage).
3. Coverings: fibrous capsule → perirenal fat → renal fascia (Gerota) → pararenal fat.
4. Anterior relations:
 • Right: suprarenal (upper pole), liver (hepatorenal pouch), 2nd part of duodenum (medial), hepatic flexure (lower lateral), small intestine (lower medial).
 • Left: suprarenal, spleen (upper lateral), stomach (upper medial), pancreas tail and splenic vessels (middle), splenic flexure/descending colon (lower lateral), jejunum (lower medial).
5. Posterior relations (both): diaphragm (and costodiaphragmatic recess) above; 12th rib (left also 11th); psoas, quadratus lumborum, transversus abdominis; subcostal (T12), iliohypogastric and ilioinguinal (L1) nerves.
6. Hilum (front to back): renal vein, renal artery, renal pelvis.
7. Development: metanephros — ureteric bud (ureter, pelvis, calyces, collecting ducts) + metanephric blastema (nephrons); ascends from the pelvis to the loin and rotates (hilum turns medially).
8. Anomalies: agenesis, pelvic kidney, horseshoe kidney (caught under the IMA), polycystic kidney, duplex ureter, aberrant renal arteries.`);

  add("Pancreas: relations, development", "Pancreas: parts, relations, ducts and development", `1. Retroperitoneal across the posterior wall at L1–L2; parts: head, uncinate process, neck, body, tail.
2. Head: in the C of the duodenum. Anterior: transverse colon, small intestine. Posterior: IVC, right renal vessels, left renal vein, bile duct (in a groove or tunnel).
3. Uncinate process: behind the superior mesenteric vessels.
4. Neck: in front of the formation of the portal vein (SMV + splenic vein).
5. Body: anterior — lesser sac and stomach; posterior — aorta and SMA origin, left crus, left suprarenal, left kidney, splenic vein; splenic artery along its upper border.
6. Tail: in the splenorenal ligament, touches the hilum of the spleen.
7. Ducts: main duct (Wirsung) joins the bile duct at the hepatopancreatic ampulla (major papilla, 2nd part of duodenum); accessory duct (Santorini) at the minor papilla.
8. Blood: splenic artery branches; superior (gastroduodenal) and inferior (SMA) pancreaticoduodenal arteries.
9. Development: dorsal and ventral pancreatic buds from the foregut; the ventral bud rotates with the bile duct behind the duodenum and fuses with the dorsal bud. Ventral bud → uncinate process and lower head; main duct = ventral duct + distal dorsal duct.
10. Anomalies: annular pancreas (duodenal obstruction), pancreas divisum, ectopic pancreatic tissue.`);

  add("Porta hepatis", "Porta hepatis", `1. Definition: a transverse fissure on the visceral (inferior) surface of the liver, ~5 cm, the "crossbar of the H"; the hilum of the liver.
2. Boundaries: in front — quadrate lobe; behind — caudate process of the caudate lobe; right — gall-bladder fossa; left — fissure for ligamentum teres/venosum.
3. Contents (front to back — "D A V"): right and left hepatic ducts → common hepatic duct (front); right and left branches of the hepatic artery proper (middle); right and left branches of the portal vein (back). Also hepatic nerve plexus (sympathetic, vagus) and lymph nodes and vessels.
4. Attached to its lips: the two layers of the lesser omentum.
5. Clinical: tumours/nodes at the porta compress the hepatic ducts (obstructive jaundice); the free edge of the lesser omentum leads to it (Pringle manoeuvre).`);

  add("Spermatic cord contents", "Spermatic cord: coverings and contents", `1. Extent: from the deep inguinal ring, through the inguinal canal and superficial ring, to the posterior border of the testis.
2. Coverings: external spermatic fascia (external oblique aponeurosis), cremasteric muscle and fascia (internal oblique), internal spermatic fascia (fascia transversalis).
3. Contents ("3 arteries, 3 nerves, 3 others"):
 • Arteries: testicular artery (abdominal aorta, L2), cremasteric artery (inferior epigastric), artery to the vas deferens (superior or inferior vesical).
 • Nerves: genital branch of the genitofemoral nerve (cremaster), sympathetic plexus (testicular), and the ilioinguinal nerve (runs on the cord, not inside it).
 • Others: vas deferens, pampiniform plexus of veins (→ testicular vein: right to IVC, left to left renal vein), lymphatics (→ para-aortic nodes), remnant of the processus vaginalis.
4. Clinical: varicocele (commoner on the left), torsion, indirect hernia inside the cord, cremasteric reflex (L1–L2).`);

  add("Diaphragm: development and anomalies", "Diaphragm: development and congenital anomalies", `1. Four origins:
 • Septum transversum → central tendon.
 • Pleuroperitoneal membranes → posterolateral parts.
 • Dorsal mesentery of the oesophagus → crura.
 • Body wall muscle (3rd–5th cervical myotomes ingrowth) → peripheral muscular rim.
2. The septum transversum forms at the cervical level (C3–C5) and descends with the heart, carrying its phrenic nerve (C3, C4, C5) — explains the cervical nerve supply and shoulder-tip referred pain.
3. Anomalies:
 • Congenital diaphragmatic hernia (posterolateral, foramen of Bochdalek, usually LEFT): failure of the pleuroperitoneal membrane → gut in the chest → pulmonary hypoplasia.
 • Parasternal (Morgagni) hernia: anterior, between sternal and costal parts.
 • Congenital hiatus hernia: short oesophagus, stomach pulled up.
 • Eventration: thin muscle-deficient half (faulty muscular ingrowth).`);

  add("Acute tubular necrosis / renal failure case", "Acute tubular necrosis (ATN) — the physiology", `1. Definition: acute kidney injury from damage to tubular cells, by ischaemia (shock, haemorrhage, sepsis, surgery) or toxins (aminoglycosides, contrast, myoglobin).
2. Why tubules: PCT and thick ascending limb cells have the highest active transport and oxygen need; the outer medulla is normally borderline hypoxic.
3. Mechanisms of low GFR:
 • Tubular obstruction by casts of shed cells → ↑ Bowman's pressure → ↓ net filtration pressure.
 • Back-leak of filtrate through damaged epithelium.
 • Afferent vasoconstriction (tubuloglomerular feedback from ↑ NaCl at the macula densa, angiotensin II, endothelin).
4. Phases: initiation → oliguric/maintenance (urine < 400 ml/day; ↑ urea and creatinine; ↑ K+; metabolic acidosis; fluid overload) → diuretic/recovery phase (regenerating tubules cannot concentrate → polyuria, loss of Na+ and K+).
5. Urine: Na+ > 40 mmol/L, FENa > 2%, osmolality ~300 (isosthenuria), muddy brown casts — vs pre-renal: Na+ < 20, FENa < 1%, concentrated urine.
6. Dangers: hyperkalaemia (arrhythmia), acidosis, pulmonary oedema; management: fluid/K+ control, dialysis if needed.`);

  add("GI hormones: gastrin, CCK, secretin", "GI hormones: gastrin, CCK and secretin", `GASTRIN
• Source: G cells of the pyloric antrum (and duodenum).
• Stimuli: peptides/amino acids, distension, vagus (via GRP). Inhibited by antral pH < 2 (somatostatin).
• Actions: ↑ HCl (direct + histamine from ECL cells), ↑ pepsinogen, trophic to gastric mucosa, ↑ gastric motility, ↑ LES tone.
CCK
• Source: I cells of the duodenum and jejunum.
• Stimuli: fatty acids, monoglycerides, amino acids/peptides.
• Actions: gall-bladder contraction + relaxation of the sphincter of Oddi, ↑ pancreatic enzymes, potentiates secretin, slows gastric emptying, satiety, trophic to the exocrine pancreas.
SECRETIN
• Source: S cells of the duodenum.
• Stimulus: acid (pH < 4.5), also fatty acids.
• Actions: ↑ pancreatic and biliary HCO3- and water ("nature's antacid"), ↓ gastrin and acid, slows gastric emptying, potentiates CCK.
Families: gastrin–CCK (same C-terminal 5 amino acids); secretin–glucagon–VIP–GIP.`);

  add("Space of Disse and liver sinusoids", "Liver sinusoids and the space of Disse", `LIVER SINUSOIDS
• Wide irregular capillaries between hepatocyte plates; receive mixed blood from portal venules and hepatic arterioles at the periphery of the lobule and drain into the central vein.
• Lining: discontinuous, fenestrated endothelium (sieve plates) with no or discontinuous basal lamina.
• Kupffer cells (macrophages from monocytes) in the lining: phagocytose old RBCs, bacteria and debris.
• Pit cells (NK lymphocytes).
SPACE OF DISSE (perisinusoidal space)
• Between the sinusoidal endothelium and the hepatocytes.
• Contains: plasma (no blood cells), hepatocyte microvilli, reticular fibres (type III collagen), Ito cells (hepatic stellate/fat-storing cells).
• Ito cells: store vitamin A in lipid droplets; in chronic injury they become myofibroblasts → collagen → cirrhosis.
• Function: free exchange between blood plasma and hepatocytes (proteins, lipoproteins); start of hepatic lymph.`);

  add("Functions of the stomach / gastrectomy", "Functions of the stomach and effects of gastrectomy", `FUNCTIONS
1. Storage (receptive relaxation) and controlled emptying.
2. Mixing and mechanical digestion (antral peristalsis) → chyme.
3. Secretion: HCl (kills bacteria, activates pepsinogen, iron absorption), pepsin (protein digestion), gastric lipase, mucus and HCO3- (protection), intrinsic factor (B12), gastrin (endocrine), ghrelin.
4. Absorption: water, alcohol, aspirin (little else).
5. Reflex functions: gastrocolic reflex; protective vomiting.
EFFECTS OF GASTRECTOMY
• Pernicious (B12-deficiency) anaemia: loss of intrinsic factor (total gastrectomy).
• Iron-deficiency anaemia: less acid and duodenal bypass.
• Dumping syndrome: rapid entry of hypertonic chyme → early (fluid shift, hypovolaemia, vasomotor symptoms) and late (reactive hypoglycaemia from insulin surge).
• Small meals needed (no reservoir); weight loss; bacterial overgrowth; bone disease (calcium/vitamin D malabsorption).`);

  add("Glomerulotubular balance and tubuloglomerular feedback", "Glomerulotubular balance vs tubuloglomerular feedback", `GLOMERULOTUBULAR BALANCE (GTB)
• Definition: the proximal tubule reabsorbs a constant FRACTION (~65%) of the filtered Na+ and water, whatever the GFR.
• Mechanism: ↑ GFR → ↑ filtration fraction → ↑ oncotic pressure and ↓ hydrostatic pressure in peritubular capillaries → more reabsorption; also ↑ filtered glucose/amino acids → more Na+ co-transport.
• Purpose: prevents changes in GFR from flooding the distal nephron with salt.
TUBULOGLOMERULAR FEEDBACK (TGF)
• Definition: the macula densa senses NaCl delivery and adjusts the GFR of the same nephron.
• ↑ GFR → ↑ NaCl at the macula densa → adenosine (and ATP) → afferent arteriolar constriction → GFR falls back; also ↓ renin.
• ↓ GFR → ↓ NaCl → afferent dilation + renin release → angiotensin II → efferent constriction → GFR rises back.
• Part of autoregulation (with the myogenic mechanism).
DIFFERENCE
• GTB adjusts REABSORPTION to the GFR (tubule follows glomerulus). TGF adjusts the GFR to the tubular load (glomerulus follows tubule).`);
})();
