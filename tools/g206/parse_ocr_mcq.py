"""Parse MCQs from OCR text of solved DIG-206 papers. The solver's circle hides the option letter, so OCR reads it
as '@', '©', '®', a capital, or nothing. An item is kept only when exactly ONE option looks circled and the other
options read cleanly as a-/b-/c-/d-/e-; anything ambiguous is dropped (better no item than a wrong key).
Usage: python3 -I parse_ocr_mcq.py <out.json> <source label>=<ocr.txt> ..."""
import json, re, sys
out, srcs = sys.argv[1], sys.argv[2:]
CLEAN = re.compile(r"^\s*([a-eA-E])\s*[-.)]\s*(\S.*)$")
CIRC = re.compile(r"^\s*(?:[@©®]|\(\w\)|[Oo0Q]\)|[A-E]\s*[-}\]]|[A-E]\))\s*-?\s*(\S.*)$")
QH = re.compile(r"^\s*(\d{1,3})\s*[.\-)]\s*(\S.*)$|^\s*[.\-]\s+(Regarding|Which|The|A |An |All|One|In|Concerning|What)(.*)$")
items, stats = [], {}
for spec in srcs:
    label, path = spec.split("=", 1)
    lines = [l for l in open(path, encoding="utf-8").read().split("\n") if l.strip() and not l.startswith("=== PAGE")]
    q, kept, seen = None, 0, 0
    def close():
        global kept, seen
        if not q: return
        seen += 1
        opts, marks = q["opts"], [i for i, o in enumerate(q["opts"]) if o[0] == "*"]
        if len(opts) in (4, 5) and not marks and all(o[0] == "abcde"[i] for i, o in enumerate(opts)):
            # no circle read (an unsolved paper, or the mark was not seen): kept WITHOUT a key; the app labels the
            # professor's answer as the professor's, not the official one
            items.append({"source": label, "stem": re.sub(r"\s+", " ", q["stem"]).strip(), "options": [{"key": o[0], "text": re.sub(r"\s+", " ", o[1]).strip()} for o in opts], "answerKeys": [], "ocr": True})
            kept += 1
        if len(opts) in (4, 5) and len(marks) == 1:
            keys = "abcde"[: len(opts)]
            # clean letters must sit in order around the circled one
            clean_ok = all(o[0] == keys[i] for i, o in enumerate(opts) if o[0] != "*")
            if clean_ok:
                items.append({"source": label, "stem": re.sub(r"\s+", " ", q["stem"]).strip(), "options": [{"key": keys[i], "text": re.sub(r"\s+", " ", o[1]).strip()} for i, o in enumerate(opts)], "answerKeys": [keys[marks[0]]], "ocr": True})
                kept += 1
    for l in lines:
        l = re.sub(r"^[\s|{}“”\"'/\\]+", "", l).replace("¢", "")   # OCR debris at the line start
        if not l.strip(): continue
        mq = QH.match(l)
        if mq and (q is None or len(q["opts"]) >= 4) and not CLEAN.match(l):
            close(); q = {"stem": (mq.group(2) or (mq.group(3) + mq.group(4))), "opts": []}; continue
        if q is None: continue
        mc, mx = CLEAN.match(l), CIRC.match(l)
        if mc and mc.group(1).islower() and len(q["opts"]) < 5: q["opts"].append((mc.group(1), mc.group(2))); continue
        if mx and len(q["opts"]) < 5 and (q["opts"] or q["stem"].rstrip().endswith((":", "?"))): q["opts"].append(("*", mx.group(1))); continue
        if q["opts"]:
            # a line with no letter where an option is due: the circle swallowed the letter
            if len(q["opts"]) < 4 and len(l.strip()) > 3 and l.strip()[0].isupper(): q["opts"].append(("*", l.strip())); continue
            q["opts"][-1] = (q["opts"][-1][0], q["opts"][-1][1] + " " + l.strip())
        else: q["stem"] += " " + l.strip()
    close()
    stats[label] = (kept, seen)
json.dump(items, open(out, "w"), ensure_ascii=False, indent=0)
print(stats, len(items))
