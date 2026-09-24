# v16.2–16.3 Receipt: the department's own drawings, the real Nov 2024 paper, Applied Anatomy, the department book, and full notes coverage

Source material: the 14 files the owner uploaded from the batch-198 channel on 24 Sep (see `docs/TELEGRAM_198_INDEX.md`). The goal is unchanged: the most marks per minute in the NEU-205 MCQ exam, not a perfect score.

## What changed for the learner

- **Neck lessons open with the department's drawings.** 40 line drawings from the department notes (cervical fascia, sternomastoid, posterior triangle veins, cervical plexus, subclavian and vertebral arteries, carotid system, IJV, submandibular region, glands, tongue and styloid apparatus, nerves VII, IX, X, XI, XII, cervical sympathetic) appear first in the lesson section they belong to: 2 open, the rest one tap away. After a neck question, the one drawing that best fits it is shown. Tapping a drawing opens it full screen.
- **CNS levels, as the exam draws them.** The department histology book's 9 "CNS levels" figures (4 spinal cord, 2 medulla, pons, 2 midbrain) are taught in the histology CNS lesson with the book's answers. They are then drilled as **45 figure questions** (5 labels each), in the same format as the exam's figure MCQs and its 5-mark matching section. The Nov 2024 paper's own Section B figure (figure C, spinal cord) is drilled the same way: **5 more**, with the answers marked on the owner's answered copy. Before answering, the figure is shown without the answers; afterwards, with all 5.
- **The real Nov 2024 paper is fully covered.** All 115 of its MCQs were matched to the bank: **107 were already in.** Their keys agree with the answer sheet except three: Q29 (the sheet marked glossopharyngeal, with a question mark; the bank keeps auriculotemporal, the standard answer), and Q31 and Q72, where the app now accepts both answers. The 8 it lacked are now practice items (submental triangle; five "which area?" cases; convergence; facilitation), each taught in the notes first. Four explanations now say what changed on that paper during the exam (NOSE #31 asked "deep"; CAROTID #6 was corrected to "external laryngeal"; sternomastoid #2, where the sheet chose transverse cervical; tabes #7, where the sheet's answer is now also accepted).
- **Department self-assessments.** 6 nervous-tissue items with the department's 2025 model answers, and 7 CNS/eye/ear items (that paper has no key; each explanation says the key is the standard answer). 3 more were left out because the sealed mock already asks them.
- **Applied Anatomy** (Dr Hanan: "important, some came in the exam"): every box was checked against the notes. The ~15 facts the notes lacked (CSF 135 cc and 100 mm water, scalp septa, parotitis signs, TMJ reduction, trephine, EJV air embolism, central line, retrosternal goitre and parathyroids, laryngeal-nerve voices, tracheostomy at rings 2–3, submandibular stones, vasovagal and uvula, accessory-nerve biopsy injury, tongue hemiatrophy, tic douloureux, pituitary tumours) are now in their sections.
- **Special embryology:** every circled in-scope item was already in the bank, with the book's key. Eye and ear embryology stays out, as the channel said.

## Privacy: how the department drawings stay the owner's

The site is public, and so is the GitHub repository. The drawings are therefore shipped **encrypted** (AES-256-GCM, one random IV per file, `source/public/dept/*.bin`). The key is **not** in the repository or on the site. It reaches the owner's app once, through a link whose `#` part never leaves the browser, or by pasting that link into the app: every locked section that has drawings shows one "paste your unlock link" line. The paste matters on an iPad, where an app added to the Home Screen keeps its own storage, apart from Safari. The app then keeps it on the device and in the learner state that syncs under the owner's private sync code. A second device restored with the sync code shows the drawings too. Without the key, nothing is shown and the files are unreadable. A wrong link is refused. The pipeline is `scripts/dept-figs/` (map → crop → encrypt).

The 50 figure questions are meaningless without their figures, so they exist only on a device that holds the key.

**Open issue for the owner:** the uploaded PDFs sit at the root of the public GitHub repository, so anyone can download them from there. Making the repository private closes that; Vercel keeps deploying from a private repository.

## Evidence

| Check | Result |
|---|---|
| Nov 2024 paper vs bank | 115/115 matched. 107 in the bank: 104 with the sheet's key (Q96 and Q107 only after the sheet's handwritten corrections; Q17 and Q20 match the bank's wording, which the exam corrected during the paper, as the explanations now say), Q31 and Q72 both answers accepted, Q29 kept on the standard answer. 8 missing, now added |
| Drawings test (`tests/dept_figs_test.js`, with the key) | **16/16** on the source and on the Vercel build: locked site shows nothing and serves only sealed files; wrong link refused; owner link unlocks, saves to device and synced state, and clears the address bar; lesson section shows its drawings first; the IJV question gets the IJV drawing; zoom; all 50 files decrypt to pictures; a second device via sync shows them; 50 drill items explained and tied to 10 figures; figure shown before answering without answers, and after answering with them; a locked section offers the paste line, and pasting unlocks in place |
| Strict notes coverage | Every new practice item is taught in its section (0 of the 21 missed). Overall 785/940 practice items pass the strict word test |
| v16 suite, public site (no key) | **25/25**. Full course: **942/942** practice past papers answered by day 47, **399/399** held-out used in 14 mocks, 109 min/day on average, **142** at most, saved progress 872 KB |
| v16 suite, as the owner's device (key present, all 50 figure items in the bank) | **25/25**. Full course: **992/992** practice past papers by day 47 (the figure drill included), 399/399 held-out, **109** min/day on average, **142** at most, 885 KB. The drill adds no day above the 2.5 h cap |
| Build | "38 app scripts/styles present"; the new scripts and all 50 encrypted drawings are in `dist` |
| Other suites (final pass, `receipts/v16_2/all_suites_final.txt`) | certify **62/62** · spread **23/23** · LEARN **17/17** · hostile **26/26** · v15.3 **10/10** · Vercel host **14/14** · options gallery **7/7** · leak audit **0** text or query leaks over 942 texts · rollback to v53 and back: **pass** |

## v16.3: the department book's answer tables, and every practice fact taught first

The owner asked for flawless without waiting for more files. Two things were still improvable from what we had.

- **Every department histology key checked against the department's own answer tables.** The book `HISTOLOGY MCQ 2nd Year.pdf` prints official answers for its nervous tissue, CNS, eye and ear sections. The bank's 106 "Department" histology items come from it, and **all 106 keys agree** (nervous tissue 28/28, CNS 32/32, eye 23/23, ear 22/22). Two differ only because the bank reorders the options (CNS #32 and eye #16); CNS #32's explanation now quotes the book's wording.
- **69 new department-book items** from the book's problem-solving and matching sections, with its answers: nervous tissue 26, CNS 10, eye 14, ear 19. 7 more were left out because they would repeat a sealed-mock question almost word for word, and explanations never name those pairings. For the 5 CNS problem-solving items the book's printed answer row does not fit (only 1 of 5 matches the questions); those use the standard answer, and each explanation says so.
- **Strict notes coverage is now 100%.** Every practice question's fact is taught in its own lesson section before the question is asked: **1009/1009**, up from 762/919 at the start of the day. About 200 note lines were added, each written from a practice item only; held-out items were never used to write notes. One item has a doubtful bank key (LMN lesion "with clonus"): the notes name it with ⚠ and teach the standard fact.

**v16.3 final pass** (`receipts/v16_2/all_suites_final_v16_3.txt`, on the final files):

| Check | Result |
|---|---|
| v16 suite, public site | **25/25**. Full course: **1011/1011** practice past papers by day 47, 399/399 held-out in 14 mocks, **109** min/day on average, **140** at most, 888 KB |
| v16 suite, owner's device (drawings key present) | **25/25**. **1061/1061** practice past papers (the 50 figure items included) by day 47, **109** min/day on average, **141** at most, 897 KB |
| Strict notes coverage | practice **1009/1009 (100%)** |
| Drawings | **16/16** on the source and on the Vercel build |
| Other suites | certify **62/62** · spread **23/23** · LEARN **17/17** · hostile **26/26** · v15.3 **10/10** · Vercel host **14/14** · options gallery **7/7** · leak audit **0** leaks · rollback to v53 and back **pass** |

## Honest limits of this round

- **The Nov 2024 figure C answers** are the ones marked on the owner's answered copy, not an official key; they agree with standard cord anatomy.
- **The CNS-levels label names** come from the book's answer key; the structure names in the explanations are ours. For figure 7, label 4 the book's answer is "continues as septomarginal tract", and the explanation repeats it without naming the bundle, because we could not confirm which bundle that is.
- **The formative paper has no key.** Its 7 items use standard histology answers. The lateral corticobulbar item follows the department's medial (3, 4, 6) versus lateral split.
- **The special-senses PDF's figures** are generic web images and were not used. The tutor (MR) sets have no answers, so they could not settle any doubtful key.
- **A drawing can only be seen after the owner opens the key link once.** On a brand-new device the drawings appear after the synced state arrives, and the figure questions after the next reload.
