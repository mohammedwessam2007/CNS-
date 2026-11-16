# Post-mortem: NEU-205 MCQ exam, 16 Nov 2026

The owner finished the course and expects about half marks in the MCQ. The app had told him he was ready ("very good"). This is why that was wrong, and what v19 changes.

## What went wrong (from the course's own design; the exam questions are not yet in hand)

1. **The readiness number measured the bank, not the exam.** `prediction()` in `mcq-v16.js` scored the sealed mocks, but the sealed mocks are the 400 held-out items of the *same* past-paper bank (1,436 items: Department 313, Effat 245, years 191–197). Kasr repeats some questions, so a student who has drilled the bank scores well on its held-out half. The real exam asked many questions that were never in the bank, so the number was too high. I then turned that number into a grade ("very good"). That was my error.
2. **The lessons taught the bank's facts, not the lectures.** v15.3 "strict coverage" made every lesson teach the facts the practice MCQs test. Anything a lecturer taught that no old paper asked was never taught. The lectures are in the college's app (no download), so the course never saw them.
3. **Practice rewarded recognition.** An explanation came right after every answer, and a wrong item returned as the same or a near-twin item. That trains recognising an answer, which breaks on a new question about the same idea.
4. **Effort went to the wrong places.** Reading sessions, games and 3D previews took build time (mine) and study attention (his) that did not raise the exam mark.

To confirm each point the post-mortem needs the exam itself: the questions he remembers, or the paper. Then every question gets a label: not taught / taught but asked differently / known but missed.

## What v19 changes

- **AI tutor in the app** (`tutor-ai-v19.js`): the owner's own OpenRouter key, kept only on his device (never in the progress, the cloud save, the progress file or the code). It sees the open lesson or question and his lecture notes for that topic. Modes: Explain this · New exam question (questions not in the bank) · I'll explain it (teach-back, graded for understanding) · Why was I wrong? (finds the misunderstanding, then a new question on the same idea) · Written answer (model essay in the department's format). Closed while a sealed mock runs. Tests: `tests/tutor_test.js` (T1–T5).
- **Lectures come in through his notes**, legally: while watching a lecture he dictates or types what the doctor stressed into 📝, or pastes the slides' text. The tutor treats it as the first source.

## Next (in order)

1. Post-mortem against the real exam questions (needs the owner's recall or the paper).
2. Readiness measured on questions the student has never seen (tutor-generated, checked against the notes), never on the bank, and shown as a range with no grade words.
3. Written exam plan: the most likely essays per topic, with teach-back before model answers.
4. GIT block: start from lecture slides and notes, the bank second.
