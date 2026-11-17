"""Parse Jalal's DIG-206 anatomy MCQ compilation (pdftotext -layout output) into items with answer keys.
Usage: python3 -I parse_jalal.py <jalal_mcq.txt> <out.json>"""
import json, re, sys

src, out = sys.argv[1], sys.argv[2]
lines = open(src, encoding="utf-8").read().split("\n")
head = re.compile(r"^\s{6,}([A-Z][A-Za-z ,&()-]{3,60})\s*$")
# the key section starts at the second occurrence of the first chapter heading
heads = [(i, head.match(l).group(1).strip()) for i, l in enumerate(lines) if head.match(l)]
first = heads[0][1]
key_start = [i for i, h in heads if h == first][1]
# ---- keys
keys, cur = {}, None
for l in lines[key_start:]:
    m = head.match(l)
    if m: cur = m.group(1).strip(); keys[cur] = {}; continue
    for n, a in re.findall(r"(\d+)\s*-\s*([a-eA-E](?:\s*&\s*[a-eA-E])*)", l):
        keys[cur][int(n)] = sorted(set(x.lower() for x in re.findall(r"[a-eA-E]", a)))
# ---- questions
items, chap, q = [], None, None
qre = re.compile(r"^\s*(\d{1,3})\s*[.),-]\s*([A-Za-z(].*)$")
ore = re.compile(r"^\s*([a-eA-E])\s*[.)]\s*(\S.*)$")
def flush():
    global q
    if q and q["options"]:
        q["stem"] = re.sub(r"\s+", " ", q["stem"]).strip()
        for o in q["options"]: o["text"] = re.sub(r"\s+", " ", o["text"]).strip()
        m = re.search(r"\(([^()]*(?:19|20)\d\d[^()]*|[^()]*(?:DEP|EOM|Dep|dep)[^()]*)\)\s*[:.?]?\s*$", q["stem"])
        q["source"] = m.group(1).strip() if m else ""
        if m: q["stem"] = q["stem"][: m.start()].strip()
        items.append(q)
    q = None
def segments(lines):
    # a line can hold two options, or an option and the next question (two-column layout)
    for l in lines:
        if head.match(l): yield l; continue
        for seg in re.split(r"\s{3,}(?=(?:[a-eA-E]\s*[.)]|\d{1,3}\s*[.,)])\s*[A-Za-z(])", l.strip()) if l.strip() else [l]:
            yield seg
        for seg in []: yield seg
for l in segments(lines[:key_start]):
    m = head.match(l)
    if m: flush(); chap = m.group(1).strip(); continue
    mq, mo = qre.match(l), ore.match(l)
    if mo and q is not None and q["options"] and mo.group(1).lower() == "a" and len(q["options"]) >= 3 and False: pass
    if mq and not mo:
        flush(); q = {"chapter": chap, "n": int(mq.group(1)), "stem": mq.group(2), "options": []}; continue
    if q is None: continue
    if mo:
        # options laid out in two columns on one line: "a. Lesser sac.      b. Pancreas."
        q["options"].append({"key": mo.group(1).lower(), "text": mo.group(2)}); continue
    if l.strip() and not re.match(r"^\s*\d+\s*$", l):
        if q["options"]: q["options"][-1]["text"] += " " + l.strip()
        else: q["stem"] += " " + l.strip()
flush()
ok = 0
for it in items:
    k = keys.get(it["chapter"], {}).get(it["n"])
    it["answerKeys"] = k or []
    if k and all(x in [o["key"] for o in it["options"]] for x in k): ok += 1
before = len(items)
items = [it for it in items if len(it["options"]) >= 3 and len(it["options"]) <= 5 and it["answerKeys"] and all(x in [o["key"] for o in it["options"]] for x in it["answerKeys"]) and len({o["key"] for o in it["options"]}) == len(it["options"])]
print("dropped", before - len(items), "unreadable items")
json.dump(items, open(out, "w"), ensure_ascii=False, indent=0)
print(len(items), "items,", ok, "with a valid key;", {c: sum(1 for i in items if i["chapter"] == c) for c in keys})
