# Capability Tournament — v14 certified upgrade

North star: **economic learning value = (reliable marks + understanding + retention + transfer + free minutes returned) / (occupied cognitive minutes + friction + risk)**.

## Rubric

Each candidate was scored 0–3 on:

- **Value** (sum, 0–18): U understanding · M reliable exam marks · R retention · T minutes saved · X transfer · P personalization
- **Confidence** (0–1): (E evidence strength + I implementation confidence) / 6
- **Cost** (sum, 0–18): MR medical-correctness risk · LR assessment-leak risk · CL cognitive load · UI visible UI cost · NP network/perf cost · MC maintenance cost

**Score = Value × Confidence − 0.6 × Cost.** Win at ≥ 3.0, unless vetoed (MR = 3 or LR = 3 is an automatic veto).

Evidence letters refer to docs/RESEARCH_RECEIPTS.md (L1–L14).

## Results (75 candidates)

| # | Capability | Domain | Value | Conf | Cost | Score | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Answer-blind **pre-answer visual intent** (no key/answer text in queries, lesson choice, or teaching selection) | leak / visual | 13 | 1.00 | 1 | 12.4 | **WIN** (mandatory) |
| 2 | Answer-aware **post-answer** routing (key + distractor mapping) | autopsy | 12 | 0.92 | 2 | 9.8 | **WIN** |
| 3 | Commons **category-scoped search** (`incategory:`) per concept | visual specificity | 10 | 0.75 | 2 | 6.3 | **WIN** |
| 4 | Verified exact-file registry per concept × modality | visual specificity | 10 | 0.83 | 3 | 6.5 | **WIN** |
| 5 | 16-intent taxonomy classifier (stem/archetype/subject) | visual / routing | 11 | 0.83 | 1 | 8.5 | **WIN** |
| 6 | Visual quality rubric (semantic, modality fit, human, size, authority, license, answer risk, load) | visual | 10 | 0.83 | 2 | 7.1 | **WIN** |
| 7 | Wikidata "depicts" (P180) search | visual | 8 | 0.33 | 4 | 0.2 | reject: Q-ids unverifiable offline |
| 8 | AI-generated anatomy for missing visuals | visual | 6 | 0.17 | 9 | −4.4 | **VETO** (doctrine; medical risk 3) |
| 9 | Neutral pre-answer captions (title shown only after answering) | leak | 6 | 0.92 | 1 | 4.9 | **WIN** |
| 10 | Title leak guard (answer-only tokens in title ⇒ reject pre-answer unless contrastive) | leak | 8 | 0.83 | 1 | 6.0 | **WIN** |
| 11 | Unlabeled-recall by CSS blur of raster labels | visual | 5 | 0.33 | 4 | −0.7 | reject: cannot reliably hide raster labels |
| 12 | Source-bank figure first | visual | 8 | 1.00 | 0 | 8.0 | **WIN** (kept) |
| 13 | Routed teacher-video card as visual fallback | visual | 6 | 0.83 | 2 | 3.8 | **WIN** (kept, deduped) |
| 14 | Link-only atlas card (UM SecondLook / UBC / Leeds) by subject | provenance | 4 | 0.92 | 1 | 3.1 | **WIN** (link only) |
| 15 | Global bounded exposure history across v9/v10/v14 | anti-repeat | 10 | 0.83 | 2 | 7.1 | **WIN** |
| 16 | Spec penalty model (adjacent, last-5, session, day, modality streak, cross-concept overuse) | anti-repeat | 10 | 0.83 | 1 | 7.7 | **WIN** |
| 17 | Per-screen dedupe of v10 companions (images + video cards) | anti-repeat | 11 | 0.92 | 1 | 9.5 | **WIN** (largest wallpaper fix) |
| 18 | v10 companion cap: ≤3 distinct images per screen | load (L5) | 8 | 0.92 | 1 | 6.8 | **WIN** |
| 19 | Rotation of v9 curated slots by exposure (least-recent first) | anti-repeat | 6 | 0.83 | 1 | 4.4 | **WIN** |
| 20 | Deliberate spaced-recall exception flag | anti-repeat | 4 | 0.67 | 1 | 2.1 | merged into 16 (canonical/source exceptions) |
| 21 | Segmented "movie strip" (step highlight, reduced-motion safe) | teaching (L6) | 8 | 0.75 | 2 | 4.8 | **WIN** |
| 22 | Original SVG mechanism animations (synapse, reflex, AP) | animation | 9 | 0.42 | 7 | −0.4 | reject for v14: authoring and validation cost; licensed Commons GIF/SVG used instead |
| 23 | Licensed Commons animations for physiology (e.g., AP propagation GIF) | animation | 7 | 0.67 | 3 | 2.9 | **WIN** (modality inside registry) |
| 24 | Real-specimen priority for gross anatomy intents | specimen (L8) | 7 | 0.75 | 1 | 4.7 | **WIN** (rubric bonus) |
| 25 | New spotter drill UI | practical | 6 | 0.50 | 6 | −0.6 | reject: existing practical wave kept |
| 26 | Histology look-alike pairs in autopsy | histology (L7) | 10 | 0.83 | 2 | 7.1 | **WIN** |
| 27 | Three-discriminator card for histology primers | histology | 8 | 0.75 | 2 | 4.8 | **WIN** (from contrast library) |
| 28 | Laterality / crossing discriminator rules | tract / lesion | 9 | 0.83 | 2 | 6.3 | **WIN** |
| 29 | Interactive lesion simulator | lesion | 11 | 0.33 | 9 | −1.8 | reject: medical risk and cost |
| 30 | Fix autopsy chosen-option mapping bug (`data-v14-choice`) | autopsy | 9 | 1.00 | 0 | 9.0 | **WIN** (bug) |
| 31 | Curated CNS **contrast library** (~60 exam-standard pairs) for الفرق الفاصل | autopsy | 13 | 0.83 | 3 | 9.0 | **WIN** |
| 32 | Polarity (EXCEPT/NOT) autopsy rule | autopsy | 9 | 0.92 | 1 | 7.7 | **WIN** (122 polarity items) |
| 33 | Post-answer corpus retrieval (key side / chosen side) with overlap threshold | autopsy | 8 | 0.67 | 2 | 4.2 | **WIN** |
| 34 | Structural token-diff fallback (the words that decide it) | autopsy | 6 | 0.92 | 1 | 4.9 | **WIN** |
| 35 | No-options reconstruction gate (typed or "said aloud") | autopsy (L9) | 9 | 0.83 | 2 | 6.3 | **WIN** |
| 36 | Misconception class (sibling, reversed direction, wrong level, polarity, laterality, number) | autopsy | 8 | 0.75 | 1 | 5.4 | **WIN** |
| 37 | Egyptian command router by reasoning operation (pre: intent; post: contrast type) | commands | 7 | 0.75 | 1 | 4.7 | **WIN** |
| 38 | Command effectiveness learning (bounded n ≥ 6/arm) | personalization | 5 | 0.58 | 1 | 2.3 | **WIN** (logging + gated tie-break; cheap) |
| 39 | Arabic TTS of commands | commands | 3 | 0.33 | 4 | −1.4 | reject |
| 40 | Adaptive primer depth FULL / COMPACT / TEST-FIRST | depth (L4) | 11 | 0.92 | 1 | 9.5 | **WIN** |
| 41 | Correct-answer compression (confident + fast + owned) | depth | 7 | 0.83 | 0 | 5.8 | **WIN** |
| 42 | Guess-correct ⇒ weak evidence (more explanation) | calibration (L13) | 6 | 0.75 | 0 | 4.5 | **WIN** |
| 43 | v14 learning ledger (visual modality, teacher, command, depth, latency, confidence, outcome) | personalization | 8 | 0.83 | 2 | 5.4 | **WIN** |
| 44 | Learned modality / depth preference after thresholds | personalization | 6 | 0.58 | 1 | 2.9 | **WIN** (gated; reversible) |
| 45 | Latency-aware compression | calibration | 5 | 0.67 | 0 | 3.3 | **WIN** (part of 41) |
| 46 | New forgetting model | memory | 4 | 0.50 | 5 | −1.0 | reject: v13 owns forgetting (architecture law) |
| 47 | Cairo-timezone real-date strip | calendar | 9 | 1.00 | 0 | 9.0 | **WIN** (trust primitive) |
| 48 | Distinct first-run catch-up vs carryover labels | calendar | 8 | 0.92 | 0 | 7.4 | **WIN** |
| 49 | Auto-certify fully-green past days when the clock advances | calendar | 7 | 0.92 | 1 | 5.8 | **WIN** |
| 50 | Midnight re-evaluation (focus / visibility / pageshow / 60 s tick) | calendar | 6 | 1.00 | 0 | 6.0 | **WIN** |
| 51 | Auto-skip unfinished teaching to match the calendar | calendar | 4 | 0.50 | 9 | −3.4 | **VETO** (deletes required teaching) |
| 52 | Carryover minutes remaining in banner | calendar | 4 | 0.92 | 0 | 3.7 | **WIN** |
| 53 | New fatigue model | focus | 3 | 0.42 | 4 | −1.1 | reject: v13 break logic kept |
| 54 | Concept-similar **changed retest** (same concept, different stem; near-dup avoid; pinned) | transfer (L3) | 10 | 0.83 | 1 | 7.7 | **WIN** |
| 55 | Tutor-generated probe fallback, labeled, not source evidence | transfer | 6 | 0.83 | 1 | 4.4 | **WIN** (label on existing generated retest) |
| 56 | Repair-loop guard (3 misses ⇒ park to spaced review) | transfer / ROI | 7 | 0.83 | 1 | 5.2 | **WIN** |
| 57 | Commute / oral recall expansion | audio | 4 | 0.50 | 3 | 0.2 | reject: keep existing |
| 58 | `lang="ar" dir="rtl"` on Arabic cues | accessibility | 3 | 1.00 | 0 | 3.0 | **WIN** |
| 59 | ≥ 44 px tap targets for gates on iPad | accessibility | 4 | 1.00 | 0 | 4.0 | **WIN** |
| 60 | `prefers-reduced-motion` for the movie strip | accessibility | 3 | 1.00 | 0 | 3.0 | **WIN** |
| 61 | Network queue: ≤ 2 in flight, 7 s abort, graceful fallback | performance | 7 | 0.92 | 0 | 6.4 | **WIN** |
| 62 | Local metadata cache (LRU 160, 14-day TTL, outside cloud state) | performance | 6 | 0.92 | 0 | 5.5 | **WIN** |
| 63 | Service-worker offline cache | offline | 5 | 0.42 | 5 | −0.9 | reject: stale-asset risk on Hatchable |
| 64 | Provenance registry doc + runtime license/author display | provenance | 5 | 1.00 | 0 | 5.0 | **WIN** |
| 65 | License presence check at runtime (reject unknown) | licensing | 4 | 0.92 | 0 | 3.7 | **WIN** |
| 66 | Mock firewall: no companions / primers / cues / answer-derived queries pre-answer | integrity | 12 | 1.00 | 0 | 12.0 | **WIN** (mandatory; live bug) |
| 67 | Retest isolation (practice-only, never held-out) | integrity | 8 | 1.00 | 0 | 8.0 | **WIN** (verified / kept) |
| 68 | Leak audit script re-run after selection changes | integrity | 6 | 1.00 | 0 | 6.0 | **WIN** |
| 69 | **Pin the served question per segment** (fixes the correct-answer loop) | qbank | 12 | 1.00 | 0 | 12.0 | **WIN** (critical live bug) |
| 70 | Spoon-feed source Q→A ⇒ predict-then-reveal, excluded from same-day MCQ | anti-contamination (L1, L2) | 11 | 0.92 | 1 | 9.5 | **WIN** (Defect B) |
| 71 | Fast-lane eligibility hardening at the action level (not CSS) | integrity | 8 | 1.00 | 0 | 8.0 | **WIN** |
| 72 | v9 Commons fetch cache (duplicate lookups per render) | performance | 4 | 1.00 | 0 | 4.0 | **WIN** |
| 73 | v14 double-install guard | robustness | 5 | 1.00 | 0 | 5.0 | **WIN** |
| 74 | Compact visual assignments in cloud state (keys only, LRU 600) | state | 6 | 0.92 | 0 | 5.5 | **WIN** |
| 75 | Hidden on-device visual audit (`INTELLECTUALITY_V14.audit()`) for real-Commons metrics | certification | 5 | 0.92 | 0 | 4.6 | **WIN** (the sandbox cannot reach Commons) |

## Locked minimal architecture

1. **v14 rewrite** in place (`intellectuality-v14.js`, same public API, idempotent install), plus a data file `visual-registry-v14.js` (concepts, verified files, categories, contrast library, command dictionary).
2. **Surgical backbone edits only where the defect lives:**
   - index.html spoon-feed: predict-then-reveal
   - index.html fast-lane action guard
   - index.html registry script tag
   - v10 companion firewall + governor hooks
   - v9 fetch cache + governor rotation
   - v13 snippet selector (so v14 cues feed teaching-language memory)
3. **One anti-repeat governor** (`window.INTELLECTUALITY_VISUAL_GOVERNOR`) owned by v14 and consulted by v9, v10 and v14. No second calendar, mastery model, or render loop.
4. **All new state** stays under `S.v14`: bounded, compacted, and migrated from the v53 v14 schema without reset.

## v14.2 addendum: second round, driven by benchmark failures

Five failures from the 120-item visual review and the 22-item autopsy benchmark (`docs/VISUAL_QBANK_AUDIT.md`) were re-entered as candidates and scored with the same rubric.

| # | Capability | Trigger (measured failure) | Value | Conf | Cost | Score | Verdict |
|---|---|---|---|---|---|---|---|
| 76 | Stem hits ×2 over chapter hits, phrase-length weighting in concept detection | "corneal reflex" → optics; "cervical lymph nodes" → nose | 9 | 0.92 | 1 | 7.7 | **WIN** |
| 77 | Per-file / per-category **stem triggers** in the registry | scalp artery → facial-nerve drawing; only the first two categories were ever searched | 9 | 0.92 | 1 | 7.7 | **WIN** |
| 78 | Concept `not` guards (shared word, different topic) | micturition "reflex" → reflex arc; "basal ganglia" → neuroglia | 6 | 0.92 | 0 | 5.5 | **WIN** |
| 79 | Strict concepts for question visuals (no multi-topic lesson-title guessing) | "CNS is soft" → BBB; "Border cells" → BBB | 7 | 0.92 | 1 | 5.8 | **WIN** (coverage 100% → 96.7%, irrelevant 8 → 0) |
| 80 | Chosen-option-first frame scoring for the autopsy fallback | stretch reflex "spindles sense tension" → inverse-stretch frame | 8 | 0.83 | 0 | 6.6 | **WIN** |
| 81 | Neuro-context requirement on the hemisection frame | sternomastoid "same side" → Brown-Séquard text | 7 | 1.00 | 0 | 7.0 | **WIN** |
| 82 | Four new contrasts (SCM action, RPE vs photoreceptor, basal nuclei parts, DCML vs spinocerebellar) | 4 mis-framed autopsies | 7 | 0.83 | 1 | 5.2 | **WIN** (medical text author-reviewed; see KNOWN_LIMITATIONS §3) |
| 83 | Search-verify every registry category; replace names that do not resolve | 7 category names not found on Commons | 6 | 0.92 | 0 | 5.5 | **WIN** |
| 84 | Drop v53's re-added answer-derived fields after a rollback round trip | rollback probe | 4 | 1.00 | 0 | 4.0 | **WIN** |
| 85 | Lookbehind regexes to exclude "basal ganglia" from *ganglia* | — | 4 | 0.83 | 3 | 1.5 | reject: throws on iPadOS < 16.4; replaced by `not` guards |
| 86 | Always show *some* visual (topic fallback) for coverage | — | 4 | 0.50 | 6 | −1.6 | reject: "never fill a blank card", and it measurably produced irrelevant images |
