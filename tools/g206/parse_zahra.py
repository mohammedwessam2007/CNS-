"""Zahra's histology MCQs (column-split OCR, unnumbered, no key). Kept WITHOUT a key: the app labels the
professor's answer as his. Only items with options a-d read cleanly in order are kept.
Usage: python3 -I parse_zahra.py <zahra_cols.txt> <in_ocr.json> <out_ocr.json>"""
import json, re, sys
txt, inp, outp = sys.argv[1:4]
OPT = re.compile(r"^\s*[-—~.]?\s*([a-dA-D])\s*[)\-.]\s*(\S.*)$")
lines = [l.strip() for l in open(txt, encoding="utf-8").read().split("\n")]
items, stem, opts = [], [], []
def close():
    global stem, opts
    keys = [o[0] for o in opts]
    s = re.sub(r"^[^A-Za-z]+", "", " ".join(stem)).strip()
    if opts and re.search(r"\s[eE]\)\s*\S", opts[-1][1]):   # option e printed on the same line as d
        d_txt, e_txt = re.split(r"\s[eE]\)\s*", opts[-1][1], maxsplit=1); opts[-1] = ("d", d_txt); opts.append(("e", e_txt)); keys = [o[0] for o in opts]
    # a stem that starts mid-sentence lost its beginning to the column cut: drop it rather than show half a question
    if keys in (["a", "b", "c", "d"], ["a", "b", "c", "d", "e"]) and len(s) > 20 and s[:1].isupper() and all(len(o[1]) > 1 for o in opts):
        items.append({"source": "Zahra histology MCQs (no key)", "stem": re.sub(r"\s+", " ", s), "options": [{"key": k, "text": re.sub(r"\s+", " ", t).strip()} for k, t in opts], "answerKeys": [], "ocr": True})
    stem, opts = [], []
for l in lines:
    if not l or l.startswith("=== PAGE") or "CamScanner" in l or "ZAHRA" in l: continue
    m = OPT.match(l)
    if m:
        k = m.group(1).lower()
        if opts and k == "a": close()
        opts.append((k, m.group(2))); continue
    if opts and len(opts) < 4: opts[-1] = (opts[-1][0], opts[-1][1] + " " + l); continue
    if len(opts) == 4:
        # continuation of option d, or the next stem: a capital start after d means a new question
        if l[:1].isupper() or l.endswith((":", "?")): close(); stem = [l]
        else: opts[-1] = (opts[-1][0], opts[-1][1] + " " + l)
        continue
    stem.append(l)
close()
base = json.load(open(inp, encoding="utf-8"))
json.dump(base + items, open(outp, "w"), ensure_ascii=False, indent=0)
print(len(items), "Zahra items kept")
