# v16.0 Receipt: the MCQ exam system

The owner's instruction (23 Sep 2026): *"Don't stop until it's minimum 9.5/10. Also MCQ only; we don't care about written and practical now."*

Target: the **NEU-205 MCQ exam**, planning anchor **Sun 15 Nov 2026**. The rubric is `docs/V16_MCQ_RUBRIC.md`.

## What a day looks like now

1. **Lesson notes** (v15 LEARN, unchanged).
2. **That lesson's past papers** right after it: up to 8 MCQs, fewer on heavy catch-up days.
   - Answer → instant verdict.
   - Why the key is right, and a reason under **every** wrong option.
   - The notes card, and the pictures for the options you mixed up.
3. **Today's MCQ round** at the end of the day:
   - yesterday's mistakes as **changed questions on the same fact**;
   - new past papers not yet reached;
   - spaced reviews (1-2-4-8-16-32 days).
4. **STOP** with a one-line summary, e.g. "Today: 34 past-paper MCQs · 68% right · 11 mistakes come back tomorrow as changed questions".
5. **Weekends and the last week: a sealed mock.**
   - Held-out past papers you have never seen, from lessons already learned.
   - One minute per question, with a timer.
   - No pictures, hints or explanations until you submit.
   - Then every question is explained, and every miss joins tomorrow's round.

With MCQ focus on (the default), the draw-from-memory step, the v14 primer, the visual and written bosses, and the written, practical and review waves are all skipped.

## What was built

| Piece | File | What it does |
|---|---|---|
| MCQ engine | `mcq-v16.js`, `mcq-v16.css` | Lesson blocks, the daily round, retest law, spaced repetition, sealed mocks, the prediction, MCQ-only routing, and migration of open v14 repairs |
| Practice explanations | `mcq-explain-anat/phys/hist-v16.js` | **921 / 921** practice past papers: the key's reason plus a line for every wrong option |
| Held-out explanations | `mcq-explain-held-v16.js` | **399 / 399** usable held-out past papers. Written **after** the notes were frozen at `a6f2cbf`, so the notes were not changed from held-out items. Shown only after the item is answered in a mock |
| Key audit | inside the explanation files | **25 doubtful keys** (17 practice, 8 held-out) show the standard answer and why. **37 more options** are also defensible (28 + 9). The app accepts both; the explanation says which answer the bank wants |
| Glued options | `mcq-v16.js` `opts()` | The source PDF merged 4 option pairs (e.g. "c) Lacerum. d· rotundum."). The v16 view shows them as separate a–d options. The bank is unchanged |
| Build check | `deploy/vercel/build.mjs` | The build fails if index.html names an app script or stylesheet that is not in the output |

### Doubtful keys (both answers accepted)

| Item | Bank key | Standard answer |
|---|---|---|
| ANAT CSF #5 | a | c: the 4th ventricle opens directly into the subarachnoid space |
| ANAT Muscles of mastication #8 *(held-out)* | d | b: temporalis |
| ANAT Oral cavity #15 *(held-out)* | c | a: left levator palati (left vagus lesion) |
| ANAT Pharynx #6 *(held-out)* | c | a: left levator palati |
| PHYS Synapse mechanism #11 | c | d: a voltage-gated Cl⁻ channel is not a transmitter receptor |
| PHYS Sensory receptors #1 *(held-out)* | a | b: a receptor potential is local, partial depolarization |
| PHYS Sensory receptors #19 *(held-out)* | a | b: specificity (the adequate stimulus) |
| PHYS Synaptic potentials #23 | a | d: none of the above |
| PHYS Spinal reflexes #44 | c | d: hyperactive flexor reflexes in the chronic stage |
| PHYS Spinal reflexes #48 | b | c: flexor withdrawal with crossed extensor |
| PHYS Spinal reflexes #54 | d | c: reflex inhibition of α efferents |
| PHYS Vestibular #18, #19 | a | b: flocculonodular lobe lesion |
| PHYS UMN/LMN #10 | d | a: poliomyelitis causes LMN lesions |
| PHYS UMN/LMN #14 | d | a: distal limb muscles of the opposite side are most affected |
| PHYS UMN/LMN #16 | d | b: UMN hemiplegia does not cause marked wasting |
| PHYS Basal ganglia #7 | a | c: chorea comes with hypotonia |
| PHYS Sleep #5 | b | d: REM has periods of atonia |
| PHYS Memory #13 | c | b: AMPA receptors do not pass Ca²⁺ |
| PHYS Memory #14 *(held-out)* | a | c: LTP comes from high-frequency stimulation |
| PHYS Memory #15 | d | c: AMPA raises Na⁺ permeability |
| PHYS Memory #16 *(held-out)* | a | c: NMDA receptors are Mg²⁺-blocked at rest |
| PHYS Intraocular pressure #5 *(held-out)* | e ("above 10 mmHg") | d: treatable with parasympathomimetics |
| PHYS Refractive media #7 | b | d: corneal touch → both eyes blink |
| PHYS Retina #30 | c (10 min) | d: about 40 min for full dark adaptation |

## Evidence

{{EVIDENCE}}

## Rating against the rubric

{{RATING}}

## What still cannot reach 10

- **No clinician has reviewed** the 1,320 explanations or the notes. They follow standard textbook teaching, and a wrong reason could still be in there.
- **The real exam grades by the department's key.** Where the app accepts both answers, the explanation says which one the bank wants. Learn that one for the paper.
- **The prediction only covers the bank.** The notes teach 68.1% of held-out answers at chapter level and 49.7% at section level, measured before held-out items were read. The real paper will contain questions outside the bank.
- **Pictures cannot be seen from the build sandbox** (Wikimedia and `*.vercel.app` are blocked by its network policy). They are chosen by rule and can be rejected in the app.
- **Real results come after 15 Nov.** They are the only true proof.
