"""Collect DIG-206 previous written questions with the years they were asked.
Usage: python3 -I parse_written.py <txt dir> <out.json>"""
import json, re, sys, os
D, out = sys.argv[1], sys.argv[2]
items = []
def add(subject, q, years, topic="", src=""):
    q = re.sub(r"\s+", " ", q).strip(" -–—•")
    if len(q) > 12: items.append({"subject": subject, "topic": topic, "q": q, "years": sorted(set(years)), "src": src})

# 1) the anatomy archive (2010-2024): "<question> — 2012, 2015, [Final 196]" under 🔹 topic headings
t = open(os.path.join(D, "DIG 206 Anatomy previous questions.txt"), encoding="utf-8").read()
topic, buf = "", ""
for l in t.split("\n"):
    s = l.strip()
    m = re.match(r"^\W*\s*\d+\.\s*(.+)$", s) if "\U0001f539" in s else None
    if m: topic = m.group(1).strip(); continue
    if s.startswith("\uf0b7"): buf = s[1:].strip()
    elif buf and s: buf += " " + s
    else: continue
    m = re.match(r"^(.*?)\s+—\s+(.+)$", buf)
    if m and re.search(r"(19|20)\d\d|Final\s*\d+", m.group(2)) and not re.search(r"[a-z]{4,}\s*$", m.group(2).replace("Final", "")):
        yrs = re.findall(r"(?:19|20)\d\d", m.group(2)) + ["Final " + x for x in re.findall(r"Final\s*(\d+)", m.group(2))]
        add("Anatomy", m.group(1), yrs, topic, "archive 2010-2024"); buf = ""

# 2) the by-year files for anatomy, physiology, histology
for subj in ["Anatomy", "Physiology", "Histology"]:
    t = open(os.path.join(D, subj + " Pervious Written Ques [DIG 206].txt"), encoding="utf-8").read()
    year, cur = None, None
    for l in t.split("\n"):
        m = re.search(r"written Ques\s*((?:19|20)\d\d)", l, re.I)
        if m:
            if cur: add(subj, cur, [year], src="by-year file")
            year, cur = m.group(1), None; continue
        if year is None or re.match(r"^\s*~\d+~\s*$", l): continue
        mq = re.match(r"^\s*(\d{1,2})\s*[-.)]\s*(.*)$", l)
        if mq:
            if cur: add(subj, cur, [year], src="by-year file")
            cur = mq.group(2)
        elif cur is not None and l.strip():
            cur += " " + l.strip()
    if cur: add(subj, cur, [year], src="by-year file")

# 3) the latest paper, batch 198 (read by hand from the exam PDF; marks as printed)
for subj, q in [
    ("Physiology", "Explain mechanism of salivary secretion {8 marks}"),
    ("Physiology", "Explain the involuntary pharyngeal stage of swallowing {6} and mechanism of protection of air passages during swallowing {2}"),
    ("Physiology", "Summarize two mechanisms of autoregulation of renal blood flow {10 marks}"),
    ("Physiology", "Mention factors affecting acid secretion {2} and mechanism of buffering of hydrogen in the distal tubule and collecting duct {6}"),
    ("Anatomy", "Mention attachment, action and nerve supply of quadratus lumborum {6 marks}"),
    ("Anatomy", "Mention sites of portosystemic anastomosis {6 marks}"),
    ("Anatomy", "Mention contents of the mesentery of the small intestine {6 marks}"),
    ("Anatomy", "Mention definition, site and contents of porta hepatis {6 marks}"),
    ("Anatomy", "Explain development of the stomach {6 marks}"),
    ("Anatomy", "Case: enlarged spleen descending downwards and medially: surface anatomy, ligaments, surfaces, blood supply of the spleen"),
    ("Histology", "Enumerate components of the juxtaglomerular apparatus and the histological changes in its component acting as osmoreceptor {4 marks}"),
    ("Histology", "Compare between PCT and DCT (table) {3 marks}"),
    ("Histology", "Compare between oxyntic (peptic) cell and Paneth cell (table) {8 marks}"),
    ("Histology", "Liver acinus: definition and significance (table)"),
]: add(subj, q, ["Final 198"], src="EOY 198 paper")
json.dump(items, open(out, "w"), ensure_ascii=False, indent=0)
import collections
print(len(items), "written questions;", collections.Counter(i["subject"] for i in items))
