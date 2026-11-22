"""v41: parse Team Ehsan's DIG-206 MCQ & SAQ banks (pdftotext -layout output) into MCQs with keys and written questions.
Usage: python3 -I parse_ehsan206.py <out.json> <Subject>=<file.txt> ..."""
import json, re, sys
out = {"mcq": [], "written": []}
Q = re.compile(r'^\s*(\d{1,3})\s*[.\-)]\s+(\S.*)$')
O = re.compile(r'^\s*\(?([a-eA-E])\s*[.\-)]\s*(\S.*)$')
K = re.compile(r'^\s*(\d{1,3})\s{2,}([a-eA-E])\s*$')
SRC = re.compile(r'\(([^()]*(?:\d{2,4}|Dep|DEP|Department|EOM|EOY|Final)[^()]*)\)\s*:?\s*$')
for arg in sys.argv[2:]:
    subj, path = arg.split("=", 1)
    lines = open(path, encoding="utf-8").read().replace("\f", "\n").split("\n")
    # table of contents: "Topic name     page"
    toc = []
    end = next((i for i, l in enumerate(lines) if Q.match(l) and i > 20), 200)
    tocEnd = max([i for i, l in enumerate(lines[:end]) if re.search(r'\s{2,}\d{1,3}\s*$', l)] or [0])
    for l in lines[:end]:
        if re.search(r'[\u0600-\u06FF\u202b]', l): continue
        for seg in re.split(r'\s{2,}', l.strip()):
            seg = seg.strip().rstrip(":")
            if re.fullmatch(r"[A-Z][A-Za-z0-9 ,;&()+/'-]{3,70}", seg) and seg.upper() not in ("TOPIC", "PAGE", "CHAPTER", "MCQ & SAQ BANK") and not re.search(r'Team Ehsan|Medical Physiology|ANATOMY 206|HISTOLOGY|BIOCHEMISTRY', seg): toc.append(seg)
    tocset = {t.lower(): t for t in toc}
    chapter, qs, keys, mode, cur, opt = None, [], {}, "q", None, None
    def flush():
        global qs, keys
        for q in qs:
            k = keys.get(q["n"])
            if k and len(q["options"]) >= 3:
                q["answerKeys"] = [k]
            out["mcq"].append(q)
        qs, keys = [], {}
    started = False
    for i_line, raw in enumerate(lines):
        l = raw.rstrip()
        s = l.strip()
        if not s or re.fullmatch(r'\d{1,3}', s): continue
        if "‫" in l or re.search(r'[؀-ۿ]', l): continue
        low = s.lower()
        if low in tocset and (started or i_line > tocEnd):
            started = True
            flush(); chapter, mode, cur, opt = tocset[low], "q", None, None; continue
        if not started: continue
        if re.match(r'^model answer', low):
            mode = "matching" if "matching" in low else "key"; continue
        if re.search(r'written questions|^saq|short answer', low):
            mode = "w"; continue
        if mode == "key":
            for m in re.finditer(r'(\d{1,3})\s{2,}([a-eA-E])\b', l): keys[int(m.group(1))] = m.group(2).lower()
            if K.match(l) or re.search(r'question number|correct option', low): continue
            if Q.match(l): mode = "q"; flush()   # a new block of questions: the keys above belong to the block before
            else: continue
        if mode == "matching": continue
        if mode == "w":
            if Q.match(l) and not O.match(l): mode = "q"   # numbered questions again: the MCQs resumed
            elif O.match(l):
                # an unnumbered MCQ stem was taken for a written question: give it back as an MCQ
                if out["written"] and out["written"][-1]["_open"] and out["written"][-1].get("subject") == subj:
                    w0 = out["written"].pop(); cur = {"subject": subj, "chapter": chapter, "n": -1, "stem": w0["q"], "options": [], "answerKeys": []}; qs.append(cur)
                mode = "q"
            else:
              if len(s) > 15:
                if out["written"] and out["written"][-1]["_open"] and not re.match(r'^[A-Z0-9]', s) :
                    out["written"][-1]["q"] += " " + s
                else:
                    out["written"].append({"subject": subj, "chapter": chapter, "q": s, "_open": True})
              continue
        m = Q.match(l); o = O.match(l)
        if m and not (o and cur and len(cur["options"]) < 5 and not re.match(r'^\s*\d', l)):
            if int(m.group(1)) == 1 and any(x["n"] > 1 for x in qs): flush()   # numbering restarts: a new block
            cur = {"subject": subj, "chapter": chapter, "n": int(m.group(1)), "stem": m.group(2), "options": [], "answerKeys": []}; qs.append(cur); opt = None; continue
        if o and cur is not None:
            opt = {"key": o.group(1).lower(), "text": o.group(2)}; cur["options"].append(opt); continue
        if cur is not None:
            if opt is None: cur["stem"] += " " + s
            elif len(cur["options"]) < 6: opt["text"] += " " + s
    flush()
for q in out["mcq"]:
    m = SRC.search(q["stem"])
    q["source"] = ("Ehsan 206 · " + m.group(1).strip()) if m else "Ehsan 206"
    if m: q["stem"] = q["stem"][:m.start()].strip()
    q["stem"] = re.sub(r'\s+', ' ', q["stem"]).strip(" :")
    for o in q["options"]: o["text"] = re.sub(r'\s+', ' ', o["text"]).strip(" .;")
for w in out["written"]:
    w.pop("_open", None); w["q"] = re.sub(r'\s+', ' ', w["q"]).strip()
    m = re.search(r'\(([^()]*\d[^()]*)\)\s*$', w["q"]); w["src"] = m.group(1) if m else ""
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, indent=0)
mk = [q for q in out["mcq"] if q["answerKeys"]]
print("mcq", len(out["mcq"]), "keyed", len(mk), "written", len(out["written"]))
from collections import Counter
print(Counter((q["subject"], q["chapter"]) for q in mk))
