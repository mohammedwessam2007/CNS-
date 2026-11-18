"""Cut the 206 written model answers (department-style revision notes) into answers and attach each to a
ranked written topic, so the essay grader and the model answers are grounded in the department's content.
Usage: python3 -I build_refs.py <txt dir> <ocr dir> <rank_written.py> <out.js>"""
import json, re, sys, os, collections
D, O, RW, out = sys.argv[1:5]
src = open(RW, encoding="utf-8").read()
T = eval(src[src.index("T = [") + 4: src.index("]\ngroups") + 1])        # the topic table of rank_written.py
SOURCES = [  # (label, file, subject hint)
    ("Physiology Q&A (renal)", D + "/RENAL_٢٠٢٥١٢٣١١٦٥٨_١٠٤٧٠.txt", "Physiology"),
    ("Physiology Q&A (GIT)", D + "/GIT_٢٠٢٥١٢٣١١٧٤٨_٠٠٠٤٢.txt", "Physiology"),
    ("MHR written revision 2024", D + "/MHR_written.206 (198) (1).txt", "Physiology"),
    ("Physiology Q&A (metabolism)", D + "/4_5960739553953191936_260102_015328.txt", "Physiology"),
    ("Metabolism final written", D + "/Metabolism final written.txt", "Physiology"),
    ("Final 197 GIT, solved", O + "/Final 197 GIT solved_2.txt", "Physiology"),
    ("Jalal written revision (anatomy)", D + "/Jalal_written.206 (198).txt", "Anatomy"),
    ("Course of the gut vessels", D + "/extras 206 writeen 1 page.txt", "Anatomy"),
    ("Histology revision (Yousof Yasser)", D + "/تجميعات Histo 206 .txt", "Histology"),
    ("Zahra histology notes", D + "/zahra_206.txt", "Histology"),
]
HEAD = re.compile(r"^\s*(?:\d{1,3}\s*[.)-]\s*|Q\.\s*|➢\s*)?(Discuss|Describe|Explain|Define|Mention|Compare|Enumerate|Give|List|What|Summari[sz]e|Name|State|Outline|Classify|Differen)\b.*|^\s*Q\.\s*\S.*|^.{8,90}\?\s*$", re.I)
def clean(t): return re.sub(r"[ \t]{2,}", "  ", re.sub(r"\n{2,}", "\n", t)).strip()
segs = []
for label, path, subj in SOURCES:
    if not os.path.exists(path): print("missing", path); continue
    lines = [l for l in open(path, encoding="utf-8").read().split("\n") if l.strip() and not re.match(r"^\s*(\d+|=== PAGE.*|.*CamScanner.*)\s*$", l)]
    cur = None
    if subj == "Histology":
        # notes and tables, not questions: blocks of 30 lines, titled by their first line
        for i in range(0, len(lines), 30):
            blk = lines[i:i + 30]
            segs.append({"src": label, "subj": subj, "head": blk[0].strip()[:120], "body": [x.rstrip() for x in blk[1:]], "block": True})
        continue
    for l in lines:
        if HEAD.match(l) and len(l.strip()) < 160:
            if cur: segs.append(cur)
            cur = {"src": label, "subj": subj, "head": l.strip(), "body": []}
        elif cur: cur["body"].append(l.rstrip())
        else: cur = {"src": label, "subj": subj, "head": l.strip()[:120], "body": []}
    if cur: segs.append(cur)
refs = collections.defaultdict(list)
for sg in segs:
    body = "\n".join(sg["body"])
    if len(body) < 120: continue
    head, text = sg["head"].lower(), (sg["head"] + "\n" + body).lower()
    best, bs = None, 0
    for s, topic, rx in T:
        if s != sg["subj"]: continue
        hh = len(re.findall(rx, head))
        if not hh and not sg.get("block"): continue      # a Q&A answer must be ABOUT the topic: its heading names it
        sc = 4 * hh + min(6, len(re.findall(rx, text))) + (len(re.findall(rx, text)) if sg.get("block") else 0)
        if sc > bs: best, bs = topic, sc
    if best and bs >= (6 if sg.get("block") else 4):
        refs[best].append({"src": sg["src"], "head": sg["head"][:140], "text": clean(body)[:1800], "score": bs})
outd = {}
for topic, lst in refs.items():
    lst.sort(key=lambda x: (-x["score"], -len(x["text"])))
    seen, keep = set(), []
    for r in lst:
        k = r["head"][:40]
        if k in seen: continue
        seen.add(k); keep.append({"src": r["src"], "head": r["head"], "text": r["text"]})
        if len(keep) == 3: break
    outd[topic] = keep
js = "/* DIG-206 written reference answers, cut from the 206 revision notes the owner added (built by tools/g206/build_refs.py).\n * Used to ground the essay grader and the model answers in the department's own content. */\nwindow.IX_GIT206_REF = " + json.dumps(outd, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(out, "w", encoding="utf-8").write(js)
print(len(segs), "segments;", len(outd), "topics with references;", sum(len(v) for v in outd.values()), "answers;", len(js), "bytes")
for t in list(outd)[:60]: print(" ", t, "←", [r["src"].split(" (")[0][:18] + ": " + r["head"][:50] for r in outd[t]][:2])
