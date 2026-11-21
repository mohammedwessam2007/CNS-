/* DIG-206 lessons, written into the app (v34): physiology 2 — renal physiology, acid-base, metabolism. */
window.IX_LESSON_TEXT = Object.assign(window.IX_LESSON_TEXT || {}, {

"intro-to-renal-physiology-renal-blood-flow-gfr-1": `## 1. Why you should care
A patient bleeds heavily in a crash; his urine output drops to almost nothing within an hour. His kidneys are not failing yet; they are protecting his blood pressure. Understanding renal blood flow and filtration lets you read urine output like a monitor.
> 🤔 Think: why does urine output fall early in shock? ||Sympathetic constriction of afferent arterioles and low pressure reduce GFR, saving volume||

## 2. The big picture
The kidneys get **~1.2 L/min (≈ 20–25% of cardiac output)** though they are 0.5% of body weight, because their job is to **filter** the plasma, not to feed themselves. Of ~650 ml/min plasma, **~125 ml/min is filtered (GFR, 180 L/day)**: the **filtration fraction ≈ 20%**. Almost all is reabsorbed.
[[fig:os25_9]]
[[fig:os25_10]]
✏️ Draw it yourself: afferent arteriole → glomerulus → efferent arteriole → peritubular capillaries (and vasa recta for juxtamedullary nephrons). Two capillary beds in series.

## 3. Two capillary beds in series
- **Glomerular capillaries**: high pressure (~60 mmHg) → **filtration**.
- **Peritubular capillaries**: low pressure, high oncotic pressure (after filtration concentrates proteins) → **reabsorption**.
The **efferent arteriole** sits between them as a resistance, keeping glomerular pressure high.
> 🤔 Think: why is the oncotic pressure high in the peritubular capillaries? ||20% of the plasma water was filtered out, concentrating plasma proteins that stayed in the blood||

## 4. Distribution and measurement of RBF
- **Cortex** gets ~90%, medulla ~10% (low medullary flow protects the concentration gradient).
- RBF is measured from **PAH clearance** (effective renal plasma flow, ~650 ml/min) then RBF = RPF / (1 – haematocrit).
- GFR is measured by **inulin clearance** (filtered, not reabsorbed or secreted); clinically **creatinine clearance**.

## 5. The filtration barrier
Fenestrated endothelium → glomerular **basement membrane** (negative charge) → **podocyte** filtration slits. Filtration depends on **size** (< 7–8 nm passes freely) and **charge** (negative molecules like albumin are repelled).
[[fig:os25_11]]
> 🤔 Think: why does albumin appear in urine in some kidney diseases even without large pores? ||Loss of the negative charge on the barrier lets negatively charged albumin pass||

## Where people get confused
- Filtration fraction = **GFR / RPF ≈ 20%**.
- PAH measures **plasma flow**; inulin measures **GFR**.
- Most flow goes to the **cortex**.

## How it links
- Starling forces and GFR regulation (next lecture); histology of the renal corpuscle.

## What the exam does with it
- MCQ: values (RBF, GFR, FF); clearance markers; barrier charge.
- Written: "Peculiarities of renal circulation."

## Say it back
1. Kidneys get 20–25% of cardiac output to filter it.
2. GFR 125 ml/min; filtration fraction about 20%.
3. Two capillary beds in series: filtration then reabsorption.
4. PAH clearance = plasma flow; inulin = GFR.
5. The barrier filters by size and charge.`,

"glomerular-filtration-2": `## 1. Why you should care
A patient on an ACE inhibitor with narrowed renal arteries suddenly loses kidney function. A drug that blocks the efferent arteriole's constriction dropped his GFR. The pressures across the glomerulus decide everything.
> 🤔 Think: why can ACE inhibitors reduce GFR in renal artery stenosis? ||Angiotensin II constricts the efferent arteriole to keep glomerular pressure up; blocking it lets the pressure, and GFR, fall||

## 2. The big picture
GFR = **Kf × net filtration pressure**.
**NFP = (P glomerular – P Bowman) – (π glomerular – π Bowman)** ≈ (60 – 18) – (32 – 0) ≈ **10 mmHg**.
[[fig:os25_16]]
✏️ Draw it yourself: a glomerular capillary with arrows: hydrostatic pressure out (60), Bowman's pressure back (18), oncotic pressure back (32); net 10 out.

## 3. Factors that change GFR
- **Glomerular hydrostatic pressure** (the main controlled one): ↑ with afferent dilation or **efferent constriction** (mild); ↓ with afferent constriction.
- **Bowman's pressure**: ↑ in urinary obstruction (stone) → ↓ GFR.
- **Plasma oncotic pressure**: ↓ in hypoproteinaemia → ↑ GFR; ↑ in dehydration → ↓ GFR.
- **Kf**: ↓ in glomerular disease; mesangial cells contract (angiotensin II) to reduce it.
> 🤔 Think: why does severe efferent constriction eventually reduce GFR? ||Renal plasma flow falls so much that oncotic pressure rises steeply along the capillary, cancelling the higher hydrostatic pressure||

## 4. Autoregulation (BP 80–180 mmHg)
RBF and GFR stay nearly constant despite BP changes:
- **Myogenic**: ↑ pressure stretches the afferent arteriole → it constricts.
- **Tubuloglomerular feedback**: ↑ GFR → more NaCl reaches the **macula densa** → it releases **adenosine** → afferent constriction → GFR back down (and less renin). ↓ GFR → the reverse + renin → angiotensin II → efferent constriction.
[[fig:os25_13]]
> 🤔 Think: why does autoregulation not stop urine output rising when BP rises? ||Autoregulation is not perfect, and raised pressure also reduces tubular reabsorption (pressure natriuresis)||

## 5. Nervous and hormonal control
- **Sympathetic**: strong stimulation constricts afferent arterioles → ↓ RBF and GFR (shock, exercise).
- **Angiotensin II**: efferent > afferent constriction (keeps GFR).
- **Prostaglandins, NO, bradykinin**: dilate (protect flow; NSAIDs remove this protection).
- **ANP**: ↑ GFR (afferent dilation).

## Where people get confused
- NFP is only ~10 mmHg.
- Efferent constriction ↑ GFR at first, ↓ RPF.
- TGF uses **NaCl at the macula densa**, not pressure.

## How it links
- Juxtaglomerular apparatus (histology); renin–angiotensin system; sodium handling.

## What the exam does with it
- Written: "Autoregulation of RBF and GFR" (very frequent); "Factors affecting GFR".
- MCQ: effect of a ureteric stone; effect of hypoproteinaemia.

## Say it back
1. GFR = Kf × NFP; NFP ≈ 10 mmHg.
2. Hydrostatic pushes out; Bowman's pressure and oncotic pressure push back.
3. Myogenic and tubuloglomerular feedback autoregulate between 80 and 180 mmHg.
4. Sympathetic cuts GFR; angiotensin II protects it via the efferent arteriole.
5. Prostaglandins keep flow; NSAIDs remove that guard.`,

"tubular-processing-na-handling-1-and-2": `## 1. Why you should care
Every diuretic works by blocking sodium reabsorption somewhere in the nephron. Learn where Na+ is reabsorbed and by which transporter, and pharmacology becomes a map.
> 🤔 Think: why do loop diuretics cause more diuresis than thiazides? ||The thick ascending limb reabsorbs ~25% of filtered Na+; the DCT reabsorbs only ~5%||

## 2. The big picture
Of ~25,000 mmol Na+ filtered daily, >99% is reabsorbed:
| Segment | % Na+ | Main transporter | Water |
|---|---|---|---|
| PCT | ~65% | Na+/H+ exchange, Na+-glucose/amino acid co-transport | follows (isosmotic) |
| Thick ascending limb | ~25% | **Na+-K+-2Cl-** (NKCC2) | impermeable |
| DCT | ~5% | **Na+-Cl-** co-transporter | impermeable |
| Collecting duct | ~3% | **ENaC** (aldosterone) | ADH-dependent |
[[fig:os25_17]]
[[fig:os25_18]]

## 3. One engine drives everything
The **Na+/K+ ATPase** on the basolateral membrane keeps cell Na+ low and the inside negative. Na+ then enters from the lumen **down its gradient** through each segment's luminal transporter, dragging other substances with it (co-transport) or swapping with them (counter-transport).
> 🤔 Think: why does glucose reabsorption stop if the Na+/K+ pump is poisoned? ||SGLT uses the Na+ gradient made by the pump; no gradient, no glucose entry||

## 4. Proximal tubule: the bulk reabsorber
Reabsorbs ~65% of Na+ and water, all filtered glucose and amino acids, most HCO3-, K+, phosphate, urea (~50%). The fluid stays **isosmotic**. **Glomerulotubular balance**: when GFR rises, the PCT reabsorbs a constant fraction (peritubular oncotic pressure rises), buffering changes in Na+ excretion.

## 5. Loop, distal tubule and collecting duct
- **Thick ascending limb**: NKCC2 (blocked by **furosemide**); water-tight → the fluid becomes **hypotonic** ("diluting segment") and the medulla salty.
- **DCT**: Na+-Cl- (blocked by **thiazides**); water-tight.
- **Principal cells** (collecting duct): ENaC + K+ secretion, increased by **aldosterone** (blocked by **amiloride / spironolactone**).
> 🤔 Think: why do loop and thiazide diuretics cause hypokalaemia but spironolactone does not? ||More Na+ reaches the principal cells, where its reabsorption drives K+ secretion; spironolactone blocks aldosterone, so K+ is retained||

## 6. Hormones that tune Na+
**Aldosterone** (↑ reabsorption, ↑ K+ secretion), **angiotensin II** (↑ PCT reabsorption), **ANP** (↓ reabsorption), sympathetic (↑).

## Where people get confused
- The PCT does the **bulk**, the distal nephron does the **fine tuning**.
- Ascending limb is **impermeable to water**.
- Glomerulotubular balance is a PCT property.

## How it links
- Countercurrent concentration; K+ handling; acid-base (Na+/H+).

## What the exam does with it
- MCQ: sites and transporters; diuretic sites; glomerulotubular balance.
- Written: "Sodium handling along the nephron."

## Say it back
1. The basolateral Na+/K+ pump powers everything.
2. PCT 65% (isosmotic), loop 25% (NKCC2), DCT 5%, collecting duct 3% (ENaC).
3. The thick ascending limb dilutes the fluid and salts the medulla.
4. Aldosterone fine-tunes Na+ and drives K+ out.
5. Diuretics: furosemide loop, thiazide DCT, spironolactone/amiloride collecting duct.`,

"handling-of-glucose-and-k-concentration-of-urine-1": `## 1. Why you should care
A diabetic's urine tastes sweet and he passes litres of it. Glucose appears in urine only when blood glucose passes a threshold, and it drags water with it. Potassium, meanwhile, can kill silently if the kidney mishandles it.
> 🤔 Think: why does glycosuria cause polyuria? ||Unreabsorbed glucose stays in the tubule and holds water osmotically (osmotic diuresis)||

## 2. The big picture
- **Glucose**: filtered freely, reabsorbed completely in the **PCT** by **SGLT2/SGLT1** (with Na+) and **GLUT** carriers, up to a **transport maximum (Tm ≈ 375 mg/min)**. Glycosuria begins at the **renal threshold** (~180 mg/dl plasma).
- **Potassium**: mostly reabsorbed early (PCT, loop); the amount excreted is set by **secretion** in the principal cells of the collecting duct.
- Then the start of **urine concentration**: the countercurrent system.

## 3. Glucose titration curve
As plasma glucose rises, filtered load rises linearly. Reabsorption equals it until carriers start to saturate (**threshold ~180 mg/dl**) and then plateaus at **Tm**. The rounded part between them is **splay** (nephrons differ).
> 🤔 Think: why does glycosuria start before the Tm is reached? ||Splay: some nephrons saturate earlier than others, and carrier affinity is not infinite||

## 4. Potassium handling
- PCT reabsorbs ~65%, thick ascending limb ~25%.
- **Principal cells secrete K+**: Na+ entry (ENaC) makes the lumen negative, K+ leaves through ROMK channels. Increased by **aldosterone**, high plasma K+, high distal flow and Na+ delivery, alkalosis.
- **Intercalated cells** reabsorb K+ (with H+ secretion) in K+ depletion.
> 🤔 Think: why does alkalosis cause hypokalaemia? ||In alkalosis, H+ leaves cells in exchange for K+ entering them, including principal cells, which then secrete more K+||

## 5. Concentrating urine 1: why we need a salty medulla
To make concentrated urine, water must leave the collecting duct into something more concentrated: the **hyperosmotic medullary interstitium** (up to **1200 mOsm/kg** at the papilla). The loop of Henle builds it by **countercurrent multiplication**.
[[fig:os25_20]]
- Descending limb: permeable to **water**, not salt → fluid concentrates going down.
- Thick ascending limb: pumps **NaCl** out, impermeable to water → fluid dilutes going up, medulla gets salty.
- The repeated "single effect" (~200 mOsm difference at each level) multiplied along the loop builds the gradient.

## Where people get confused
- Renal threshold (~180 mg/dl) ≠ Tm (375 mg/min).
- K+ excretion is controlled by **secretion**, not filtration.
- The descending limb is water-permeable; the ascending is not.

## How it links
- Concentration of urine 2 (urea, vasa recta, ADH); diabetes mellitus.

## What the exam does with it
- MCQ: renal threshold vs Tm; factors increasing K+ secretion.
- Written: "Renal handling of glucose", "Countercurrent multiplier".

## Say it back
1. Glucose is fully reabsorbed in the PCT by SGLT until its Tm.
2. Threshold ~180 mg/dl; above it glycosuria and osmotic diuresis.
3. K+ excretion is set by principal-cell secretion: aldosterone, high K+, high flow.
4. Concentrated urine needs a hyperosmotic medulla.
5. The loop builds it: water out going down, salt out coming up.`,

"concentration-of-urine-2-urea-hco3-and-h-1-and-2": `## 1. Why you should care
A patient after head injury passes 10 L of dilute urine a day: **diabetes insipidus**, no ADH. Another, with a lung tumour, cannot excrete water: **SIADH**. Water balance hinges on one hormone acting on a salty medulla.
> 🤔 Think: why can't a patient without ADH concentrate urine even with a salty medulla? ||The collecting duct stays impermeable to water, so water cannot leave it to the interstitium||

## 2. The big picture
The countercurrent multiplier (loop) makes the medulla salty; **urea recycling** adds to it; the **vasa recta** (countercurrent exchanger) keep it; **ADH** opens water channels (**aquaporin-2**) in the collecting duct so water leaves and urine concentrates. The same lecture starts **acid-base**: reabsorbing HCO3- and secreting H+.
[[fig:os25_20]]
[[fig:os25_15]]

## 3. Urea and the vasa recta
- **Urea**: ADH also makes the **inner medullary collecting duct** permeable to urea → urea diffuses into the interstitium (~half the papillary osmolality) and recycles into the loop.
- **Vasa recta**: hairpin capillaries with **slow flow**; solutes enter going down and leave going up, so they **do not wash out** the gradient (exchange, not multiplication).
> 🤔 Think: why does a high-protein diet improve concentrating ability? ||More urea is made, strengthening the medullary urea gradient||

## 4. ADH: release and action
Released from the posterior pituitary when **plasma osmolality rises** (osmoreceptors, very sensitive, ~1%) or **volume/BP falls** (baroreceptors, less sensitive but powerful). Acts on V2 receptors → cAMP → aquaporin-2 inserted → water reabsorbed. **Thirst** is triggered by the same stimuli + angiotensin II.
Free water clearance: positive = dilute urine; negative = concentrated.

## 5. HCO3- reabsorption and H+ secretion
In the PCT: H+ secreted (Na+/H+ exchanger) combines with filtered HCO3- → H2CO3 → CO2 + H2O (brush-border carbonic anhydrase) → CO2 enters the cell → regenerates HCO3- → back to the blood. **Net: filtered HCO3- is reclaimed** (~85% in the PCT).
[[fig:os25_19]]
In the distal nephron, **α-intercalated cells** secrete H+ by **H+-ATPase** (and H+/K+ ATPase) — the final acidification.
> 🤔 Think: does reabsorbing filtered HCO3- add new base to the body? ||No; it only prevents its loss. New HCO3- is made only when secreted H+ is excreted with phosphate or ammonia||

## Where people get confused
- Vasa recta **exchange**, the loop **multiplies**.
- ADH increases urea permeability in the **inner medullary** collecting duct.
- HCO3- reabsorption ≠ new HCO3- generation.

## How it links
- Acid-base (next lecture); DI and SIADH; histology of the collecting duct.

## What the exam does with it
- Written: "Role of ADH", "Countercurrent mechanism", "Mechanism of HCO3- reabsorption".
- MCQ: urea recycling; vasa recta; free water clearance.

## Say it back
1. The loop multiplies, urea adds, vasa recta preserve the salty medulla.
2. ADH inserts aquaporin-2; water leaves the collecting duct.
3. Osmolality is ADH's sensitive trigger; volume its powerful one.
4. PCT reclaims filtered HCO3- using secreted H+ and carbonic anhydrase.
5. Intercalated cells finish acidification with an H+ pump.`,

"acid-base-balance": `## 1. Why you should care
A diabetic in ketoacidosis breathes deep and fast (Kussmaul); a patient vomiting for days breathes shallowly and twitches. The body defends pH within 7.35–7.45 with three lines; when you see which line is working, you know the disorder.
> 🤔 Think: why does a patient in diabetic ketoacidosis breathe deeply? ||Acidosis stimulates the respiratory centre to blow off CO2, a respiratory compensation that raises pH||

## 2. The big picture
Three lines of defence:
1. **Buffers** (seconds): bicarbonate (main ECF), phosphate (intracellular, urine), proteins and **haemoglobin**.
2. **Lungs** (minutes): change CO2.
3. **Kidneys** (hours–days): excrete H+, make new HCO3- — the only way to **remove** acid.
**Henderson–Hasselbalch**: pH = 6.1 + log [HCO3-] / (0.03 × PCO2). Normal: HCO3- 24, PCO2 40, ratio 20:1, pH 7.4.
[[fig:os26_16]]
[[fig:os26_17]]

## 3. How the kidney makes new bicarbonate
Every H+ secreted and **excreted** (not just reclaiming filtered HCO3-) adds a new HCO3- to blood:
- **Titratable acid**: H+ + HPO4²- → H2PO4- (limited by phosphate).
- **Ammonia**: glutamine → NH3 in PCT cells; NH3 + H+ → **NH4+** trapped in urine; **adaptable** (↑ several-fold in chronic acidosis).
> 🤔 Think: why is ammonia the kidney's main tool in chronic acidosis? ||Phosphate is limited, but glutamine metabolism and ammonia production increase greatly over days||

## 4. The four disorders
| Disorder | Primary | Compensation |
|---|---|---|
| Metabolic acidosis | ↓ HCO3- | ↓ PCO2 (hyperventilation) |
| Metabolic alkalosis | ↑ HCO3- | ↑ PCO2 (hypoventilation) |
| Respiratory acidosis | ↑ PCO2 | ↑ HCO3- (renal, days) |
| Respiratory alkalosis | ↓ PCO2 | ↓ HCO3- (renal) |
Causes: metabolic acidosis (DKA, diarrhoea, renal failure, lactic), metabolic alkalosis (vomiting, diuretics), respiratory acidosis (hypoventilation, COPD), respiratory alkalosis (anxiety, altitude).

## 5. Reading a blood gas in three steps
1. pH: acidosis or alkalosis?
2. Which one moved in the same direction as pH: HCO3- (metabolic) or PCO2 (respiratory)?
3. Is the other one compensating?
> 🤔 Think: pH 7.30, HCO3- 15, PCO2 30. What is it? ||Metabolic acidosis (low HCO3-) with respiratory compensation (low PCO2)||

## Where people get confused
- Compensation never over-corrects pH.
- Respiratory compensation is fast; renal is slow.
- Only the kidney actually **removes** fixed acid.

## How it links
- H+ secretion and HCO3- reabsorption (previous lecture); vomiting and diarrhoea.

## What the exam does with it
- Written: "Role of the kidney in acid-base balance" (frequent).
- MCQ: blood gas interpretation; ammonia buffer.

## Say it back
1. Buffers in seconds, lungs in minutes, kidneys in days.
2. pH depends on HCO3-/PCO2 (20:1).
3. Kidneys make new HCO3- by excreting H+ as titratable acid and NH4+.
4. Four disorders; each compensated by the other system.
5. Read pH, find the primary, check compensation.`,

"basic-concepts-of-metabolism-and-rq": `## 1. Why you should care
A patient on a ventilator in ICU is fed too much glucose and his CO2 rises. Why? Burning carbohydrate makes more CO2 per O2 than burning fat. The **respiratory quotient** is how physiologists read what fuel the body burns.
> 🤔 Think: why can overfeeding carbohydrate raise PCO2 in a ventilated patient? ||Carbohydrate oxidation has RQ 1.0, and making fat from carbohydrate has RQ above 1, so CO2 production rises||

## 2. The big picture
- **Metabolism** = all chemical reactions: catabolism (break down, release energy) and anabolism (build, use energy). Energy is carried by **ATP**.
- **Metabolic rate** = energy released per unit time (heat + work).
- **BMR**: metabolic rate at rest, awake, 12 h fasting, comfortable temperature, mentally relaxed (~40 kcal/m²/h, ~1600–1800 kcal/day adult).
- **RQ** = CO2 produced / O2 consumed.
[[fig:os24_3]]

## 3. Respiratory quotient values
| Fuel | RQ |
|---|---|
| Carbohydrate | **1.0** |
| Protein | ~0.8 |
| Fat | ~0.7 |
| Mixed diet | ~0.82 |
| Fat synthesis from CHO | > 1 |
| Fasting / diabetes (ketosis) | ~0.7 |
> 🤔 Think: why is the RQ of fat lower than that of carbohydrate? ||Fat contains less oxygen per carbon, so more O2 must be supplied to oxidise it, relative to the CO2 produced||

## 4. Measuring metabolic rate
- **Direct calorimetry**: measure heat produced in an insulated chamber (accurate, impractical).
- **Indirect calorimetry**: measure O2 consumption; each litre of O2 ≈ **4.8 kcal** (mixed diet). Benedict–Roth spirometer.

## 5. What changes BMR
↑: thyroid hormones (most important), sympathetic/adrenaline, fever (~13% per °C), growth, pregnancy, males, body surface area, specific dynamic action of food (protein ~30%). ↓: hypothyroidism, starvation, sleep, old age.
> 🤔 Think: why does a high-protein meal increase heat production more than fat? ||Its specific dynamic action is about 30%: deamination and urea synthesis cost energy||

## Where people get confused
- BMR is **not** the minimum metabolism (sleep is lower).
- RQ of fat 0.7, protein 0.8, CHO 1.0.
- Thyroid hormone is the main BMR regulator.

## How it links
- Food intake and temperature regulation lectures; biochemistry of metabolic states.

## What the exam does with it
- MCQ: RQ values; conditions for BMR; factors affecting BMR.
- Written: "BMR: definition, measurement, factors."

## Say it back
1. Catabolism releases energy, anabolism uses it; ATP carries it.
2. BMR: resting, awake, fasting, thermoneutral.
3. RQ: carbohydrate 1, protein 0.8, fat 0.7.
4. Indirect calorimetry: litres of O2 × 4.8 kcal.
5. Thyroid hormone is the main driver of BMR; fever raises it.`,

"control-of-food-intake": `## 1. Why you should care
A tumour in the hypothalamus makes a patient eat uncontrollably and become obese; a lesion elsewhere makes another stop eating. Weight is defended by brain centres reading hormones from fat and gut.
> 🤔 Think: why do people with leptin deficiency become severely obese? ||Without leptin the hypothalamus believes fat stores are empty and keeps hunger high||

## 2. The big picture
The **hypothalamus** integrates signals:
- **Lateral hypothalamus**: **feeding (hunger) centre**; lesion → anorexia.
- **Ventromedial nucleus**: **satiety centre**; lesion → hyperphagia and obesity.
- **Arcuate nucleus**: two neuron groups — **NPY/AgRP** (stimulate eating) and **POMC/CART** (α-MSH, inhibit eating).
[[fig:os24_21]]

## 3. Short-term signals (meal to meal)
- **Ghrelin** (stomach, rises before meals): ↑ hunger.
- **CCK, PYY, GLP-1** (gut, after meals): ↓ hunger.
- **Gastric distension** (vagal afferents): satiety.
- **Glucose** (glucostatic theory): low glucose → hunger.
> 🤔 Think: why does eating slowly help you eat less? ||Satiety hormones (CCK, PYY, GLP-1) and distension signals need time to rise and reach the brain||

## 4. Long-term signals (body fat)
- **Leptin** (adipocytes): proportional to fat mass; inhibits NPY/AgRP and stimulates POMC → less eating, more energy spending (lipostatic theory).
- **Insulin**: similar central effect.
Obesity usually involves **leptin resistance**, not leptin lack.

## 5. Other influences
Higher centres (sight, smell, habits, emotions), temperature (cold ↑ intake), amygdala and limbic system.

## Where people get confused
- Lateral = **hunger**; ventromedial = **satiety**.
- Ghrelin **↑** hunger; leptin **↓** hunger.
- NPY stimulates; α-MSH inhibits.

## How it links
- Metabolic states (biochemistry); BMR and energy balance.

## What the exam does with it
- MCQ: effects of hypothalamic lesions; leptin and ghrelin.
- Written: "Regulation of food intake."

## Say it back
1. Lateral hypothalamus = hunger; ventromedial = satiety.
2. Arcuate: NPY/AgRP eat, POMC/α-MSH stop.
3. Ghrelin before meals raises hunger; CCK, PYY, GLP-1 after meals lower it.
4. Leptin from fat reports long-term stores.
5. Obesity is usually leptin resistance.`,

"body-temperature-regulation": `## 1. Why you should care
A runner collapses in summer heat, hot and dry: **heat stroke**. A patient with infection shivers while his temperature climbs: **fever**. Both are about a thermostat in the hypothalamus — broken in one, reset in the other.
> 🤔 Think: why do patients shiver at the start of a fever? ||The set point has been raised by pyrogens, so the normal body temperature now feels "too cold" and heat-gain mechanisms switch on||

## 2. The big picture
Core temperature (~37 °C) is kept by balancing **heat production** and **heat loss**, controlled by the **hypothalamus**: the **anterior (preoptic)** part handles heat loss; the **posterior** part heat gain and conservation.
[[fig:os24_23]]

## 3. Heat loss mechanisms
**Radiation** (~60% at rest), **conduction and convection**, **evaporation** (sweat; the only way when air is hotter than skin). Controlled by **skin blood flow** (vasodilation) and **sweating** (sympathetic cholinergic fibres).
> 🤔 Think: why is heat stroke more likely in humid weather? ||Sweat cannot evaporate into humid air, and evaporation is the only cooling route when the air is hot||

## 4. Heat gain and conservation
**Vasoconstriction** of skin vessels, **piloerection**, **shivering** (posterior hypothalamus, up to 4–5× heat production), **non-shivering thermogenesis** (sympathetic, thyroid; brown fat in infants), behaviour (clothes, shelter).

## 5. Fever
Bacteria and toxins → **pyrogens (IL-1, IL-6, TNF)** → hypothalamus makes **prostaglandin E2** → set point ↑ → vasoconstriction, shivering → temperature rises to the new set point. When the cause ends, the set point falls → **sweating and vasodilation** (crisis/defervescence). Aspirin works by blocking PGE2.
> 🤔 Think: why does aspirin lower fever but not normal body temperature? ||It blocks PGE2, which raised the set point; it does not change the normal set point||

## 6. Disorders
**Heat stroke** (failure of heat loss, > 40.5 °C, CNS dysfunction, hot dry skin), **heat exhaustion** (salt and water loss), **hypothermia** (< 35 °C).

## Where people get confused
- Anterior hypothalamus = heat **loss**; posterior = heat **gain**.
- In fever the set point is raised; in heat stroke it is normal but overwhelmed.

## How it links
- BMR (fever raises it ~13%/°C); sympathetic nervous system.

## What the exam does with it
- Written: "Regulation of body temperature" / "Fever".
- MCQ: heat loss routes; effects of hypothalamic lesions.

## Say it back
1. The hypothalamus balances heat production and loss around 37 °C.
2. Loss: radiation, conduction, convection, evaporation.
3. Gain: vasoconstriction, shivering, non-shivering thermogenesis.
4. Fever: pyrogens → PGE2 → higher set point.
5. Heat stroke: heat loss fails; humidity blocks evaporation.`,

});
