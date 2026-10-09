# Dr Sameh Doss's labelled drawings in the app (v18.7, reworked in v18.8)

Dr Sameh Doss (Kasr Al Ainy, Cairo University) is recognised for the best anatomical drawings in the Middle East. The owner uploaded his notes as three PDFs (`Sameh_Doss_Labels_Preserved_Claude_Part_1/2/3`, 44 PDF pages). They are scanned collages: each embedded image is one full page of his handwritten head-and-neck and neuroanatomy notes, with the labelled drawings among the paragraphs.

## What was done

- **283 distinct notebook pages** were found (404 images in the PDFs; the same page often appears twice). A page is "distinct" when its image bytes differ; pages are numbered in the order each first appears. Every page was looked at.
- **Only the labelled drawings were taken, not the paragraphs.** Each drawing was boxed by eye on a gridded view of its page (`box` in `scripts/dept-figs/map.json`, percent of the page), then cut out by `scripts/dept-figs/prepare_sameh.py`: long lines of handwriting running through a box are whitened (tesseract word boxes), the crop is trimmed to its ink and contrast-stretched. **492 drawings** came out of 281 pages (v18.8: every page re-boxed by hand on a gridded view, with white-out boxes (`fill`) over notes that sit inside a drawing, a smaller margin (`pad`) where notes touch it, five drawings added that had been missed, and three drawings that had been cut in two joined back into one). Three pages (notes with no drawing) gave none, and about a dozen doubtful crops (text tables, fragments) were dropped after a visual check of every crop on contact sheets.
- **Every drawing is in the LEARN lesson it teaches.** Each notebook page was first mapped by hand to its lesson sections; each drawing then takes the section(s) its own caption matches best (a score of the caption against the section text), up to three, plus one other section if it matches that far better. All 492 are in at least one section; sections show the best two first, the rest one tap away under "N more official drawings".
- **Every drawing is a candidate for the answers.** After an answer the app shows up to three drawings (two open, the third one tap away) chosen by how much of the question, the right answer and the written explanation the drawing's caption says. **v18.8: by meaning, not only the same words** (`fig-concepts-v18.js`): a nerve number gives the nerve's name (CN VI, sixth nerve → abducent), a muscle its nerve (lateral rectus → abducent; masseter → mandibular nerve, muscles of mastication), an abbreviation its full name (PICA, ICA, MLF, UMNL…), a sign or syndrome the parts it points to (Horner → cervical sympathetic; tabes dorsalis → dorsal columns; hemiplegia → pyramidal tract, internal capsule), and plurals, Latin plurals and spellings are folded together. Words only implied count half as much as words really used; words of the right answer count more. The question's own lesson section is searched first (+ a bonus); a drawing from elsewhere must match strongly. A weak match shows nothing rather than a wrong picture.
- Cards are labelled **رسمة د. سامح دوس · DR SAMEH DOSS · LABELLED DRAWING**. Tap a drawing for full screen; there tap it (or ＋) to magnify up to 3×, drag to move, ✕ or Esc to close.
- Plain JPEGs (`dept/sd-NNN[a-h].jpg`), no key, like the rest of the set (v18.6). Captions are ours, from the labels on each drawing.

## Numbers (tests `D11`–`D17`, v18.8)

| | |
|---|---|
| Drawings | 492 (from 281 notebook pages) |
| In a LEARN section | 492 / 492 |
| Practice questions that get a drawing after the answer | 823 of 1061 (was 770) |
| ... of which show one of Dr Doss's | 521 (was 484) |
| Of his drawings, shown as the answer to some question | 295 of 492 |

## Limits (honest)

- **About 200 of his drawings are never the answer to a question**: the bank has no question that their caption matches (for example fine details of skull foramina, or tract tables). They are in the lessons.
- **Placement is scored by meaning through a hand-made list of 152 rules plus cranial-nerve numbering** (names, numbers, muscles, syndromes), not by a medical AI model. The 530 picks that changed from v18.7 were read through by hand; a rare second or third picture is still only loosely related, and a concept not on the list is matched by its words only. Questions on histology, and some physiology, get none (the set has no drawing for them).
- **Crops are boxes, not outlines.** After the v18.8 page-by-page re-boxing a stray word or a tiny scrap of a heading still shows at the edge of a few drawings, and a few labels that touch the notes were whitened with them. A few text-heavy notes (tract tables) are kept because their small drawings carry the labels.
- **Captions are mine**, read from the labels; they were not checked against Dr Doss's own captions.
- **The handwritten notes' text is not in the app**, by design. Only the drawings are.
- The original PDFs are not in the repo. `prepare_sameh.py` rebuilds the JPEGs from them (needs pymupdf, pillow, numpy, opencv, tesseract). Distinct pages are numbered by first appearance across the three parts in order.

Source of truth: `scripts/dept-figs/map.json` (entries with `sameh`). Rebuild: `python scripts/dept-figs/prepare_sameh.py <PDF folder> <out>`; copy the book and department JPEGs into the same folder with their prepare scripts; `node scripts/dept-figs/publish.mjs <folder>`.
