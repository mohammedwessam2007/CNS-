# Known Limitations (v15.0)

v15.0 is **not** "100% perfect". This file lists what is unproven, what is heuristic, and what could still go wrong. The evidence lives in `docs/V14_CERTIFICATION_RECEIPT.md` and `docs/VISUAL_QBANK_AUDIT.md`.

## 0. v15 LEARN notes and exact-words pictures

- **Notes are author-written and unreviewed by a clinician.** The 240 sections follow standard teaching (Snell/Guyton/Junqueira level) and were checked against the practice answer keys (90.8% of practice answers are taught). They cover 65.3% of held-out answers by the same lexical rule.
- **About 15 bank keys look wrong or contradict each other.** The notes teach the correct fact and name the key with ⚠; the bank itself is unchanged, so the app still scores those items by the bank's key.
- **Live pictures are unverified.** The build sandbox's network policy blocks en.wikipedia.org, commons.wikimedia.org and upload.wikimedia.org, so the exact-term engine was tested only against mocks. On the iPad, pictures load live from Wikipedia/Commons. Where an article's image is off, the "search everywhere" links give the owner Google Images, Radiopaedia and Kenhub for the same words.
- **Pictures for options exist only for curated terms** (425 terms from the notes). About a third of options have one; the rest use the v14 look-alike logic or say that no trustworthy picture exists.
- **Longer lessons.** Each teach step is now a real lecture (about 3–15 min).

## 1. Deployment and live verification

| Limitation | Consequence | What closes it |
|---|---|---|
| **Live on Vercel, not Hatchable.** v14.3 is deployed to **https://intellectuality-cns.vercel.app** (READY; see `docs/DEPLOYMENT_VERCEL.md`). Hatchable could not be reached from the build session, so the Hatchable site is still v53. | Two sites exist. Progress does not move between them automatically: the Hatchable site uses email login and Postgres, the Vercel site uses sync codes and Blob. | Use the Vercel site. To bring Hatchable progress over, export or copy the saved state from the old site (not automated). |
| **Cloud backup needs one owner action.** The Vercel connector may not create storage (403). | Until a Blob store is connected, progress is saved **on each device only**; the ☁ button says so. Clearing Safari website data, or a new device, starts fresh unless a **backup file** was saved (☁ → sync page → ⬇ Download backup; restore with ⬆). | Connect a private Blob store and redeploy (4 steps in `docs/DEPLOYMENT_VERCEL.md`). |
| **The live site was not opened from the build session.** Its egress policy blocks `*.vercel.app`; the connector's fetch and log tools returned 403/404. | Proof is limited to: the READY build from the tested commit, 60/60 certification plus 14/14 host checks against the identical local build, and the build step's fail-fast checks. No live screenshot, and no production logs read. | Open the URL on the iPad (checklist in the deployment doc); Vercel → project → Logs. |
| **Sync code = the key.** No email or password. | Anyone with the code or link can read and write that progress. If every device loses it (e.g. Safari clears site data) and it was not saved, the cloud copy cannot be found. | Screenshot the code from the sync page. The code is 128-bit random and only its hash is stored. |
| **Professor Vision is off on Vercel.** It needs the Hatchable AI connection. | The Vision drawer reports it as unavailable; nothing else is affected. | Add an AI key and a Vercel `api/vision` implementation if wanted. |
| **No cache-busting on script URLs** (same as v53). | An iPad may keep old JS briefly after a new deploy. | Confirm the tab title reads **v15.0**; reload if not. |

## 2. Visuals

- **Real Commons content is unmeasured.** The sandbox blocks Wikimedia, so certification mocked the Commons API.
  - All 86 curated files are real pages: 48 search-verified this session, 38 used in production v53.
  - All 108 categories are real names: 32 search-verified, 76 used in v53. Seven names that did not resolve were replaced or dropped.
  - What those categories actually return (quality, labels, off-topic uploads) was **not** seen here.
  - Run `await INTELLECTUALITY_V14.audit({n:60})` on the live site and review `rows[].primary` by hand.
- **Relevance is 86% strong, 14% weak by manual review** (0 irrelevant of 115). "Weak" means the right region or family but not the exact point, e.g. habituation → hippocampus, pterion → maxillary artery.
- **4 of 120 items are withheld.** No question-specific concept, or every candidate would have leaked the answer, so no visual is shown.
- **Labeled diagrams can show the answer.** Pre-answer captions hide the file title, and titles containing key words are demoted. But a labeled diagram of the region (e.g. the base-of-brain view) may still print the answer's label on the image itself. This is the trade-off of teaching the picture before the question; held-out mock items get no images at all.
- **Distinct look-alike image for the chosen distractor: 7 of 22 in the benchmark** (v14.3: 2). An image counts only when its title names the chosen side. The new source is an exact-title Commons search (`intitle:"Pia mater"`); the mock echoes titles, so the **live rate and quality are unmeasured**. A real file whose title names two structures (e.g. "Dura and pia") could still be shown for one of them. The other 15 autopsies say "no trustworthy distinct visual exists".
- **30 consecutive items: 0 wrong-domain, 5 weak of 30** (see `docs/V14_4_RECEIPT.md` §3). Physiology is 8 of the 30, because the early course order is anatomy-heavy.
- **Concept routing is pattern-based** (54 hand-written concepts with stem triggers and `not` guards). New or unusual stems can route to a neighbour concept or to none.

## 3. Teaching text and autopsy

- **Leak safety is lexical.** 0/921 texts contain the key phrase or ≥ half of the key-distinctive words unmasked, and 0 Commons queries use them. A reader can still *reason* to the answer from the model paragraph; that is the intent of understanding-first, not a leak.
- **Model-paragraph quality is only partly reviewed.** 114 of 921 model paragraphs still share no significant stem word (v14.3: 229); a bank-wide fallback now adds a relevant paragraph when the lesson's own is weak. The primer picks the best-scoring paragraph from the professor/deep corpus: IDF-weighted and answer-blind. Every item gets one (`noModel = 0`), but relevance was spot-checked on the benchmark items, not all 921.
- **The discriminator library is hand-built**: 72 pairwise contrasts plus 28 families (135 members). About 13.9% of all wrong-option pairs in the bank get a true pairwise discriminator; the rest get a frame (polarity, direction, route…) or the retrieval fallback. The 22-item benchmark scored 22/22 after five fixes, but topics outside the library fall back to:
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
- **Cloud state** was exercised against local stand-ins only: the Hatchable `/api/state` emulator, and the real Vercel `api/state.js` handler on an in-memory store. The payload-size bound passed (27 KB total, v14 slice ≈ 1.4 KB). No real Postgres or Blob round trip has run yet: there is no Hatchable access, and no Blob store is connected.
- **Professor Vision** (`/api/vision`) is unchanged from v53 and was not called.
- **`index.html` is 2.9 MB**, with course content inlined as in v53. v14 added only a `<script>` tag, the title, the feed predict-reveal wrapper and the fast-lane guard.

## 5b. Tested only in the sandbox

- The hostile matrix (25 checks: day gaps, clocks, malformed state, rapid taps, offline, huge image, backup) and the performance probe ran in Chromium against local builds. Real iPad Safari memory and touch feel are still unmeasured.

## 6. Research

- Several research sources could not be fetched (egress policy), so their claims rest on search-result evidence. `docs/RESEARCH_RECEIPTS.md` grades every claim STRONG / MODERATE / HEURISTIC / INSPIRATION and ties each capability to that grade.

## Rollback

- **Vercel:** promote a previous deployment, or delete the project (`docs/DEPLOYMENT_VERCEL.md`).
- **Hatchable:** v53 is untouched. The exact v53 files are commit `6e3ebec` (`python3 scripts/verify_exact_source.py`). `tests/rollback_probe.js` shows that v53 loads v14.x state without errors, and that returning to v14.x keeps progress.
