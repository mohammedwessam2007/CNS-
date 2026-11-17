"""Merge the parsed DIG-206 MCQs and ranked written topics into source/public/git206-bank.js.
Usage: python3 -I build_bank.py <jalal.json> <ocr_mcq.json> <written_ranked.json> <out.js>"""
import json, re, sys, hashlib
jal, ocr, wr, out = sys.argv[1:5]
def clean(t):
    t = re.sub(r"https?://\S+|HTTPS?://\S+|Scanned with|CamScanner|T\.ME/\S+", " ", t)
    t = re.sub(r"[|~‘’'`]+\s*$", "", t)
    t = re.sub(r"\s+[a-eA-E]\s*$", "", t)      # a stray option letter left at the end of a line
    return re.sub(r"\s+", " ", t).strip(" .;,")
SUBJ = [("Histology", r"\bcells?\b.*(lining|epitheli)|histolog|microvill|acin|duct of|gland|paneth|peptic cell|oxyntic|podocyte|mesangial|macula densa|ito cell|kupffer|lamina propria|epitheli|brush border|goblet"),
        ("Biochemistry", r"enzyme|cytochrome|glyco|lipoprotein|cholesterol|xenobiotic|fatty liver|vitamin|urea cycle|bilirubin|heme|amino acid|transamin|ketone"),
        ("Physiology", r"secretion|gfr|filtration|clearance|reabsorb|hormone|gastrin|secretin|cck|motility|peristal|swallow|vomit|acid|bicarbonate|hco|renin|aldosterone|adh|osmol|fever|temperature|shiver|metabolic|bmr|rq\b|glucose|sodium|potassium|tubul|countercurrent|diuresis|thirst|satiety|bile salt|absorption"),
        ("Anatomy", r".")]
def subject(t):
    t = t.lower()
    return next(s for s, rx in SUBJ if re.search(rx, t))
def norm(t): return re.sub(r"[^a-z0-9]", "", t.lower())[:80]
mcq, seen = [], set()
for it in json.load(open(jal, encoding="utf-8")):
    k = norm(it["stem"]); seen.add(k)
    mcq.append({"subject": "Anatomy", "chapter": it["chapter"], "stem": clean(it["stem"]), "options": [{"key": o["key"], "text": clean(o["text"])} for o in it["options"]], "answerKeys": it["answerKeys"], "source": it.get("source") or "Jalal", "ocr": False})
dup = 0
for it in json.load(open(ocr, encoding="utf-8")):
    k = norm(it["stem"])
    if k in seen: dup += 1; continue
    seen.add(k)
    st = clean(it["stem"]); opts = [{"key": o["key"], "text": clean(o["text"])} for o in it["options"]]
    if len(st) < 12 or any(len(o["text"]) < 2 for o in opts): continue
    s = "Histology" if "Zahra" in it["source"] else subject(st + " " + " ".join(o["text"] for o in opts))
    mcq.append({"subject": s, "chapter": ("Histology · Zahra MCQs" if "Zahra" in it["source"] else s + " · past papers"), "stem": st, "options": opts, "answerKeys": [] if "unsolved" in it["source"].lower() else it["answerKeys"], "source": it["source"], "ocr": True})
used = set()
for m in mcq:
    base = "G206-" + hashlib.sha1((m["source"] + m.get("chapter", "") + m["stem"]).encode()).hexdigest()[:10]
    i, mid = 1, base
    while mid in used: i += 1; mid = base + "-" + str(i)   # the same question printed twice
    used.add(mid); m["id"] = mid
written = json.load(open(wr, encoding="utf-8"))
data = {"version": "206-v1", "built": "2026-11-17", "mcq": mcq, "written": written}
js = "/* DIG-206 (GIT, renal, metabolism) bank, built by tools/g206/build_bank.py from the owner's 206 material.\n * MCQs: Jalal's anatomy compilation (answer keys from its key pages) + solved past papers read by OCR\n * (kept only when exactly one circled option was read; flagged ocr:true). Written: previous questions ranked by\n * how often and how recently they were asked. */\nwindow.IX_GIT206 = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(out, "w", encoding="utf-8").write(js)
import collections
print(len(mcq), "MCQs", collections.Counter(m["subject"] for m in mcq), "ocr dups", dup, "| written topics", len(written), "| bytes", len(js))
