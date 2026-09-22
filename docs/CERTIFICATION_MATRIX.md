# Certification Matrix

Do not declare completion until these are executed against the deployed app.

## A. Calendar / Sep 22
1. Freeze browser time to 2026-09-22 Africa/Cairo.
2. Fresh state: verify UI says real Sep 22 and starts the intended Sep-22 plan behavior.
3. Incomplete Sep-21 state: verify no fake date. UI says `TODAY · TUE 22 SEP · 1 DAY CARRYOVER`.
4. Completed Sep-21 state: automatically move to Sep-22 plan day.
5. Ahead state: show ahead, do not regress.
6. Midnight/focus return: recompute date.
7. Existing saved v13 state survives.

## B. Fresh concept
1. Fresh learner opens a new topic.
2. Fast lane must not appear from no evidence.
3. Practice source MCQ options remain hidden until understanding primer is acknowledged.
4. Primer must teach the model, not leak the answer phrase.
5. At least one genuinely relevant real visual loads.
6. `I CAN PICTURE IT → ASK ME THE MCQ` reveals the exact source item.

## C. Correct answer
1. Exact source answer key remains intact.
2. Post-answer explanation says why it makes sense.
3. v12/v13 evidence gets recorded.
4. No duplicate or stale segment loops.

## D. Wrong answer
1. Wrong answer creates error evidence.
2. Visual autopsy appears.
3. Correct anchor visual loads.
4. Chosen distractor gets a **distinct trustworthy** look-alike visual when possible.
5. If no reliable distractor visual exists, explicitly say so rather than substituting junk.
6. `الفرق الفاصل` is a true discriminator.
7. Egyptian command matches the reasoning move.
8. No-options recall prompt appears.
9. Repair blocks ordinary progression.
10. Retest uses a changed source question where possible.

## E. Wrong retest
A second miss must produce another visual repair/autopsy. No silent collapse back to option memorization.

## F. Histology
- real micrograph / correct tissue architecture when possible
- command defaults toward `طلّع شبيهه برّه`
- 3 discriminators / nearest look-alike logic

## G. Tract
- command `امشي المسار`
- start → synapse → crossing → destination
- laterality tested

## H. Lesion
- command `حدّد الإصابة`
- localize before deficit
- correct side logic

## I. Physiology
- command `شغّل الميكانيزم`
- input → mechanism → output → perturbation
- no decorative anatomy image pretending to explain physiology

## J. Mock firewall
1. Held-out mock question gets no pre-answer primer.
2. No answer-revealing visual before submission.
3. Source key unchanged.
4. Confidence capture unchanged.
5. Post-submission wrong item may get visual autopsy.
6. No future held-out items leak into repair.

## K. Visual diversity audit
Sample at least 50 sequential practice questions.
Report:
- number of questions
- primary visual coverage
- unique primary visuals
- exact repeat count
- adjacent repeat count
- visually irrelevant count
- no-visual count
Targets:
- exact primary repeat rate <10% unless specifically justified as canonical
- adjacent unrelated exact repeats = 0
- irrelevant visuals = 0 tolerated after manual review sample

## L. Performance
- no 1,321-image prefetch
- use IntersectionObserver / lazy loading
- cache search results
- bounded recent-history state
- no duplicated click handlers
- no runaway timers
- no visible jank on iPad

## M. Responsive
Test:
- 390×844
- 820×1180
- 1024×1366
No horizontal overflow. Primer, autopsy and Arabic chips remain readable.

## N. Regression
- v9 real visual layer still works
- v10 context visuals still work
- v11 shell still works
- v12 evidence/autopilot still works
- v13 Learning Twin still learns
- cloud state works
- Professor Vision works or fails gracefully
- commute mode remains valid
- written/practical waves remain valid
- course integrity gate stays green
- production logs after deploy show zero new app errors
