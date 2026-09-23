# Known Limitations (v14.2)

v14.2 is **not** "100% perfect". This file lists what is unproven, what is heuristic, and what could still go wrong. The evidence lives in `docs/V14_CERTIFICATION_RECEIPT.md` and `docs/VISUAL_QBANK_AUDIT.md`.

## 1. Deployment and live verification (blocking)

| Limitation | Consequence | What closes it |
|---|---|---|
| **Not deployed.** This build session has no Hatchable MCP connector, and its network policy blocks `*.hatchable.site`. The 403s were reported, not retried or routed around. | Live is still **v53** ("INTELLECTUALITY CNS v14 · UNDERSTAND FIRST"). None of the v14.2 behaviour reaches the iPad until someone deploys. | Follow the deploy procedure in `docs/V14_CERTIFICATION_RECEIPT.md` from a Hatchable-connected session. |
| **No live test, no production logs.** | Zero-new-errors in production is unverified. | `view_logs` after deploy, plus the live checklist in the receipt. |
| **No cache-busting on script URLs** (same as v53). | An iPad may keep old JS for a while after deploy. | Confirm the tab title reads **v14.2**; hard-refresh if not. |

## 2. Visuals

- **Real Commons content is unmeasured.** The sandbox blocks Wikimedia, so certification mocked the Commons API.
  - All 86 curated files are real pages: 48 search-verified this session, 38 used in production v53.
  - All 108 categories are real names: 32 search-verified, 76 used in v53. Seven names that did not resolve were replaced or dropped.
  - What those categories actually return (quality, labels, off-topic uploads) was **not** seen here.
  - Run `await INTELLECTUALITY_V14.audit({n:60})` on the live site and review `rows[].primary` by hand.
- **Relevance is 86% strong, 14% weak by manual review** (0 irrelevant of 115). "Weak" means the right region or family but not the exact point, e.g. habituation → hippocampus, pterion → maxillary artery.
- **4 of 120 items are withheld.** No question-specific concept, or every candidate would have leaked the answer, so no visual is shown.
- **Labeled diagrams can show the answer.** Pre-answer captions hide the file title, and titles containing key words are demoted. But a labeled diagram of the region (e.g. the base-of-brain view) may still print the answer's label on the image itself. This is the trade-off of teaching the picture before the question; held-out mock items get no images at all.
- **Distinct look-alike image for the chosen distractor: 2 of 22 in the benchmark.** An image counts only when its title names the chosen side. The other 20 autopsies say "no trustworthy distinct visual exists" and rely on the text discriminator. The real rate with live titles is unknown.
- **Concept routing is pattern-based** (54 hand-written concepts with stem triggers and `not` guards). New or unusual stems can route to a neighbour concept or to none.

## 3. Teaching text and autopsy

- **Leak safety is lexical.** 0/921 texts contain the key phrase or ≥ half of the key-distinctive words unmasked, and 0 Commons queries use them. A reader can still *reason* to the answer from the model paragraph; that is the intent of understanding-first, not a leak.
- **Model-paragraph quality is unreviewed at scale.** The primer picks the best-scoring paragraph from the professor/deep corpus: IDF-weighted and answer-blind. Every item gets one (`noModel = 0`), but relevance was spot-checked on the benchmark items, not all 921.
- **The discriminator library is hand-built** (72 contrasts). The 22-item benchmark scored 22/22 after five fixes, but topics outside the library fall back to:
  1. a corpus sentence about the key;
  2. a structural "words that decide it" line (weakest).
- **Medical correctness of new contrast texts is author-reviewed only.** This covers sternomastoid action, pigment epithelium, basal nuclei parts, DCML vs spinocerebellar, and the refraction near/far point. The texts follow standard anatomy and physiology teaching (Snell/Guyton level) but have had no second clinical reviewer.
- **The Egyptian micro-commands were written in this build**, following `docs/EGYPTIAN_MICRO_COMMANDS.md`. No native-speaker medical educator has reviewed them.
- **Negation handling is keyword-based** (EXCEPT/NOT/false/incorrect). An oddly phrased negative stem could miss the polarity explanation.

## 4. Learning loop

- **Changed retest** picks a similar practice item: concept match, stem Jaccard < 0.7, pinned per retest index. Thin topics may offer only weakly related items.
- **The loop guard parks an error after 3 changed misses.** Its return depends on the existing v12/v13 spaced-repair scheduling, which v14 feeds but does not change.
- **Personalization thresholds** (a modality/command preference needs ≥ 6–8 observations) were tested only with synthetic sessions, not real longitudinal data.
- **The fast lane is stricter.** A concept counts as owned only with ≥ 4 answers, posterior ≥ 0.82, ≥ 3 memory reviews and no high-priority open error. Some genuinely mastered topics will stay on the full primer longer than necessary.

## 5. Platform and device

- **Only Chromium was used** (Playwright device emulation at 390×844, 820×1180, 1024×1366, 1180×820). No WebKit/Safari engine is installed here. The code avoids regex lookbehind and uses only features available on iPadOS ≥ 13.4 (optional chaining, `Intl` time zones, IntersectionObserver), but real Safari performance, memory and touch feel are unmeasured.
- **The date comes from the device clock** (converted to Africa/Cairo). A wrong device clock gives a wrong day; there is no server time source.
- **Cloud state** was exercised only against the in-memory `/api/state` emulator. The payload-size bound passed (27 KB total, v14 slice ≈ 1.4 KB), but the real Postgres round trip is untested.
- **Professor Vision** (`/api/vision`) is unchanged from v53 and was not called.
- **`index.html` is 2.9 MB**, with course content inlined as in v53. v14 added only a `<script>` tag, the title, the feed predict-reveal wrapper and the fast-lane guard.

## 6. Research

- Several research sources could not be fetched (egress policy), so their claims rest on search-result evidence. `docs/RESEARCH_RECEIPTS.md` grades every claim STRONG / MODERATE / HEURISTIC / INSPIRATION and ties each capability to that grade.

## Rollback

Live v53 is untouched. The exact v53 files are commit `6e3ebec` (`python3 scripts/verify_exact_source.py`). `tests/rollback_probe.js` shows that v53 loads v14.2 state without errors, and that returning to v14.2 keeps progress.
