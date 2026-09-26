# Sealed measurement: protocol, pre-registration and firewall

The organ measures change against items the learner has never been taught with. 52 items are sealed in
`source/public/renaissance-sealed.js` and registered here (`preregistration.json`, SHA-256 of each item).

| Form | Items | When | Feedback | Purpose |
|---|---|---|---|---|
| A (baseline) | 8 | days 0–3 (2 a day, before the day's session) and again at day 90 | none | where the learner starts; the day-90 retest |
| B (parallel) | 8 | day 30 | none | the 30-day comparison; each B item matches an A item's structure on a new surface |
| Weekly unknown | 12 problems × 2 items | days 7, 14 … 84 | after committing (used once) | orientation in a field no session teaches (§42, §121) |
| Reader questions (Karamazov) | 12 | 30 days after the trial session | none | the Reader Turing test (§12, §146): depth of possession, including parts the compiler left out |

Each reader question carries a coverage label inside its seal (`taught`, `read-whole`, `bridged`), so results show
where a summary cliff would be: a reader who possesses the work answers all three kinds; one who has only the app's
compressed version tends to fail the `bridged` ones.

## Rules

1. **Written before exposure.** Items were written and registered on 2026-09-26, before any learner answered one. The
   registration was revised twice on the same day, still before any exposure, when the tests found (a) that two items
   shared wording with lessons and (b) that the correct options were systematically the longest. Both are in git history.
2. **Any later edit fails the build.** `node tools/renaissance/seal.js verify` and `tests/renaissance_v3_test.js` (S1)
   recompute every hash.
3. **Firewall (§43, §154).** No lesson, hook, figure, model or quotation may share a run of six words with a sealed item
   (S2), except words inside a registered primary-source quotation. The sealed file carries no item text, answer,
   coverage label or atom in the clear. The learner's stored record keeps only an item's id and outcome (P2).
   Curriculum authors (human or model) must not unseal items while writing lessons.
4. **No guessing cue.** Thirteen counterfeit strategies (length, words, punctuation, hedges, jargon, absolutes, overlap
   with the question, odd length, most typical option, positive words, first and last displayed position) must stay
   within 0.12 of chance on the sealed items (S3).
5. **Missed windows are skipped, never owed** (14-day window). Measurement never runs on a short-dose day (exam week,
   late night, heavy week). The learner can switch it off: `localStorage.renaissance_probes = "off"`.

## What sealing is and is not

It is obfuscation plus pre-registration: it prevents accidental reading (view-source, logs, diffs) and makes changes
detectable. It is not secrecy against a determined reader on his own device, and the author of the lessons also wrote
the items (stated as a limit in `docs/RENAISSANCE/completion/EMPIRICAL_QUEUE.md`).
