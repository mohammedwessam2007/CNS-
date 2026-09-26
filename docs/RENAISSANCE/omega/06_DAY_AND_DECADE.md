# OMEGA · 06 · One complete real day, the daily object, and ten years

Deliverables 33–35 (§164–§170). The day below is not invented: it is the plan the engine actually produced for
Thursday 8 October 2026, 20:40, with season 1 finished, two hooks due and last night's forge not yet checked
(`gate()` output, reproduced with the harness). Minute marks are the plan's budgets, not measurements.

## 1. The daily experience object (§167)

```json
{
  "date": "2026-10-08", "gate": "open", "dose": 25, "minutes": 22, "short": false, "partial": false,
  "door": "A clinic registers 30 patients an hour, its doctors see 12, its pharmacy serves 20. It hires two more receptionists. How many more patients are treated per hour?",
  "session": "bottleneck (season 2 · Three boxes)",
  "steps": [
    { "id": "reality",        "type": "reality", "stage": "warm",     "min": 0.5 },
    { "id": "hook:loop.h1",   "type": "q",       "stage": "warm",     "min": 1.5 },
    { "id": "hook:commit.h2", "type": "q",       "stage": "warm",     "min": 1.5 },
    { "id": "n1", "type": "q",        "kind": "predict",  "min": 2   },
    { "id": "n2", "type": "scene",    "stage": "reveal",  "min": 2.5 },
    { "id": "n3", "type": "q",        "kind": "predict",  "min": 1   },
    { "id": "n4", "type": "model",    "stage": "model",   "min": 3   },
    { "id": "n5", "type": "contrast", "stage": "contrast","min": 2   },
    { "id": "n6", "type": "q",        "kind": "transfer", "min": 2   },
    { "id": "n7", "type": "q",        "kind": "far",      "min": 1.5 },
    { "id": "n8", "type": "forge",    "stage": "forge",   "min": 3   },
    { "id": "close", "type": "close", "stage": "close",   "min": 1   }
  ]
}
```

Why these warm-ups: the loop hook was due with no attempts yet (sorted first), the commitment hook was due at its
7-day gap, and they come from different sessions (the interleaving rule). Nothing else was due. The select hook waits
until 12 October. The reality tap asks about the device built in "The two clinics of Vienna" last night.

## 2. The day, step by step (§169)

**20:40 · the CNS screen says STOP MEDICINE.** Under it, one card: *RENAISSANCE · TODAY · 22 MIN*, the clinic
question, CONTINUE. Nothing else from Renaissance is anywhere in the app.

| Plan min | Step | What he sees and does | What is recorded |
|---|---|---|---|
| 0–0.5 | Reality tap | "The device you built in 'The two clinics of Vienna'. Did you use it?" → Used it / Not yet / Tried it: not useful. One tap; never asked again. | reality: used/not yet/useless |
| 0.5–2 | Hook (no pictures, no helpers) | "In a system with a delay, reacting harder to each error usually…" three options, commit with SURE / THINK SO / GUESSING | hook result; gap ×2.5 if right and not guessed, else back to 1 day |
| 2–3.5 | Hook | the gym-contract question from the commitment session | same |
| 3.5–5.5 | Predict | the door question, four options (none / about 20 more / twice as many / a few more), commit with confidence before any teaching | answer, confidence, bug class if wrong; a belief if wrong and not a guess |
| 5.5–8 | Reveal | "The three boxes": draw the flow as boxes, write each box's capacity, the smallest sets the pace. The clinic figure (phone-first). SHOW ME DIFFERENTLY gives the bottleneck analogy or Goldratt's story | which representation preceded the next right answer |
| 8–9 | Predict | doctors raised to 25/h: where is the constraint now? | |
| 9–12 | Model | three sliders; throughput and the growing queue; Little's law read-out; "find a change that does nothing, and the smallest change that raises the flow" | slider use |
| 12–14 | Contrast | airport security vs a restaurant grill: what do both managers get wrong? | |
| 14–16 | Transfer | a software team: design → build → review → test; which box limits everything? | transfer result |
| 16–17.5 | Far | a café: 10 inside, 20 arriving an hour — how long does a customer stay? (Little's law) | far result; a click candidate if the morning's prediction was wrong |
| 17.5–20.5 | Forge | his own study week as a flow: pick the flow, the slowest box, the action, the check; then pick the most likely failure | the device ("Flow: learn → questions → review…") |
| 20.5–21.5 | Close | receipt: what changed (predictions revised), evidence, what comes back and when (hooks at 1, 7, 30 days), minutes | session done; hooks scheduled |

**21:02 · done.** The card now says today is done; there is nothing more to open until tomorrow. If he had pressed
DONE at minute 9, the session would resume at the model step tomorrow with no penalty and no "behind".

If he had opened it after 01:00, the card would say the organ is closed for sleep. From 13 to 15 November (the
exam day and the two days before it) it shows only a closed card; in the week before, the dose is 10 minutes and the session continues the next day
instead of rushing.

## 3. The complete user experience (§164–§165)

- **One door, one button.** CONTINUE, and six helpers that never multiply: WHY THIS?, SHOW ME DIFFERENTLY,
  I ALREADY GET THIS, THIS DIDN'T CLICK, GO DEEPER, DONE.
- **No dashboard.** Numbers appear only inside the receipt and inside WHY THIS? (the record with n, Brier calibration,
  the atoms this step trains, beliefs revised).
- **Nothing to manage.** No reading list, no deck, no backlog, no notifications, no streak.
- **Phone-first.** Every figure is readable at 360 px (R34); every button is ≥ 44 px (R24).

## 4. Ten years (§170) — what the design says should happen, and what would show it failing

Updated from `../06_LONGITUDINAL.md` for OMEGA. Every "should" is a hypothesis for his own data.

| Horizon | Behind the door | Should be true | Would show failure |
|---|---|---|---|
| Day 1 (26 Sep 2026) | season 1 opens | committed predictions sometimes wrong, transfer after teaching mostly right | all predictions right (too easy) or transfer wrong |
| Week 1 | 1-day hooks begin | unaided hook accuracy within ~15 points of in-session | hooks collapse without pictures |
| Month 1 | season 2 begins (this document's day); 7- and 30-day hooks | calibration improving; first beliefs revised | counterfeit-level accuracy on hooks (≈ 0.31) |
| Month 2 (Nov) | exam weekend shut; 10-minute doses | medicine untouched | any evening Renaissance ran instead of due medicine |
| Month 3 | season 3 (*Building models*, genome-driven); first alien-problem baseline | the 5 untrained atoms get delayed items | seasons chosen by novelty, not the genome |
| Month 6 | seasons crossbreed; boss worlds mix seasons | first verified primitive–domain pairs in medicine and his company | nothing verified outside the app |
| Year 1 | ~150 hours; ~6 seasons; representation tournament has power for keystone primitives | learning-speed series exists (minutes to 3/4 far transfer per new primitive) | later primitives take as long as the first |
| Year 3 | life cases (his logs) are the main source of bosses | second derivative estimable | still only authored seasons |
| Year 5 | he authors sessions for others; they must pass the same tests | alien-problem orientation faster than at Month 3, unaided | performance depends on the app's scaffolds |
| Year 10 | graduation by dissolution: most primitives retired | he uses primitives in decisions without opening the app (asked rarely, checked against logs) | he needs the app to think this way, or it takes more of life than at Year 1 |

The interface at Year 10 is the same card. What grows is behind it; what shrinks is the time it takes.
