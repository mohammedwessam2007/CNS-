"""v41: merge Team Ehsan's DIG-206 bank (parse_ehsan206.py output) into the app as source/public/git206-bank-ehsan.js.
MCQs: keyed only, not already in the bank (same stem), anatomy chapters renamed to the app's 13 chapters.
Written: each question joins the existing topic it matches best (same subject), else a new topic; years add to its weight.
Usage: python3 -I build_ehsan206.py <ehsan.json> <git206-bank.js> <out.js>"""
import json, re, sys, hashlib
src, bankjs, outp = sys.argv[1:4]
E = json.load(open(src, encoding="utf-8"))
raw = open(bankjs, encoding="utf-8").read()
B = json.loads(raw[raw.index("{"):raw.rindex("}") + 1])
norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower())
have = set(norm(q["stem"])[:70] for q in B["mcq"])
AN = {"anterior abdominal wall": "Anterior abdominal wall", "male external genital organs": "Testis and spermatic cord", "abdominal cavity and peritoneum": "Abdominal cavity and peritoneum",
      "stomach": "Stomach", "small intestine": "Small intestine", "large intestine": "Large intestine", "vessels of the gut": "Vessels of gut", "pancreas": "Pancreas", "spleen": "Spleen",
      "liver and biliary system": "Liver and biliary system", "kidney, ureter and suprarenal glands": "Kidney, ureter and suprarenal glands", "posterior abdominal wall": "Posterior abdominal wall", "gut development": "Gut development"}
out, dup = [], 0
for q in E["mcq"]:
    if not q["answerKeys"] or len(q["options"]) < 3: continue
    stem = re.sub(r'\s*\{([^{}]*)\}\s*$', '', q["stem"]).strip(); m = re.search(r'\{([^{}]*)\}\s*$', q["stem"])
    source = q["source"] + (" · " + m.group(1) if m and "·" not in q["source"] else "")
    k = norm(stem)[:70]
    if k in have or len(stem) < 8: dup += 1; continue
    have.add(k)
    ch = AN.get(q["chapter"].lower(), q["chapter"]) if q["subject"] == "Anatomy" else q["chapter"]
    if q["subject"] == "Anatomy" and ch not in AN.values(): continue
    out.append({"subject": q["subject"], "chapter": ch, "stem": stem[0].upper() + stem[1:], "options": [{"key": o["key"], "text": o["text"][:1].upper() + o["text"][1:]} for o in q["options"]], "answerKeys": q["answerKeys"], "source": source, "ocr": False, "id": "G206-E" + hashlib.sha1((source + stem).encode()).hexdigest()[:10]})
# an Ehsan key for a question the bank holds without an official key (Zahra's, the unsolved 197 paper, app keys)
byStem = {}
for q in E["mcq"]:
    if q["answerKeys"]:
        st = re.sub(r'\s*\{([^{}]*)\}\s*$', '', q["stem"]); kt = next((o["text"] for o in q["options"] if o["key"] == q["answerKeys"][0]), "")
        byStem[norm(st)[:70]] = norm(kt)[:40]
fix = {}
for q in B["mcq"]:
    if q["answerKeys"] and q.get("keyBy") != "app": continue
    kt = byStem.get(norm(q["stem"])[:70])
    if not kt: continue
    hit = [o["key"] for o in q["options"] if norm(o["text"])[:40] == kt or (len(kt) > 6 and norm(o["text"]).startswith(kt[:20]))]
    if len(hit) == 1: fix[q["id"]] = hit[0]
# written
STOP = set("the and of in to a an its with on by for from or as at mention describe discuss explain enumerate list compare between give account short notes note write about what how why which role factors".split())
terms = lambda t: set(w for w in re.findall(r'[a-z][a-z0-9+]{2,}', t.lower()) if w not in STOP)
ROUTE = [(r"alkaline tide|acid tide", "Gastric acid secretion and its control"), (r"choleretic|cholagogue", "GI hormones: gastrin, CCK, secretin"), (r"mesonephric|paramesonephric", "Kidney: relations, surface anatomy, development"), (r"\bna\b", "Sodium excretion and its hormonal control"), (r"saliva", "Salivary secretion"), (r"motilin|somatostatin|gastrin|secretin|cck|cholecystokinin|hormone", "GI hormones: gastrin, CCK, secretin"),
         (r"gastric (acid|secretion)|hcl|parietal|pepsin", "Gastric acid secretion and its control"), (r"pancrea", "Pancreatic secretion and pancreatitis"),
         (r"swallow|deglut|oesoph|esoph", "Swallowing (deglutition)"), (r"vomit|evacuation|emptying|gastrectomy|stomach", "Functions of the stomach / gastrectomy"),
         (r"defecat|mmc|migrating|motility|peristal|colon", "Functions of the stomach / gastrectomy"),
         (r"sodium|na\+|natriur|angiotensin|aldosterone", "Sodium excretion and its hormonal control"), (r"diuresis|water reabsorption|adh|concentrat", "Urine concentration (loop of Henle, countercurrent, ADH)"),
         (r"glucos|threshold|splay|clearance|tm\b", "Tubular reabsorption (glucose, clearance)"), (r"gfr|filtration|hydrostatic|glomerul", "GFR and its regulation"),
         (r"renal blood flow|endocrine functions of the kidney|anemia|anaemia", "Renal blood flow autoregulation"), (r"heat|temperature|fever|cold", "Temperature regulation and fever"),
         (r"juxta", "Juxtaglomerular apparatus and macula densa"), (r"kidney|renal|ureter|suprarenal", "Kidney: relations, surface anatomy, development"),
         (r"stomach", "Stomach: arteries, veins, ligaments, development"), (r"liver|bile duct|hepat|porta", "Liver: surface anatomy, bare areas, relations"),
         (r"mesenteric|colon|ivc|vena cava|aorta", "Abdominal aorta and IVC"), (r"inguinal|oblique|rectus", "Inguinal canal (boundaries, rings, contents, hernia)"),
         (r"testis|spermatic", "Spermatic cord contents"), (r"caec|appendix", "Caecum and appendix"), (r"develop", "Midgut development and anomalies")]
add = []
for w in E["written"]:
    q = w["q"]
    if len(q) < 25 or not re.search(r'[a-z]{4}', q) or re.search(r'diagram|figure|label in|^enumerate its', q, re.I): continue
    yrs = [y.strip() for y in re.split(r'[-,&]| and ', w.get("src") or "") if re.search(r'\d{2,4}|dep', y, re.I)] or ["Ehsan bank"]
    qt = terms(q)
    best, bs = None, 0
    for t in B["written"]:
        if t["subject"] != w["subject"] or t["topic"].endswith(": other"): continue
        sc = len(qt & terms(t["topic"] + " " + " ".join(x["q"] for x in t["questions"][:4])))
        if sc > bs: best, bs = t, sc
    topic = best["topic"] if best and bs >= 3 else None
    if not topic:   # by keyword, to the topic the department examines it under
        for rx, tp in ROUTE:
            if re.search(rx, q, re.I) and any(t["topic"] == tp for t in B["written"]): topic = tp; break
    if not topic and best and bs >= 2: topic = best["topic"]
    add.append({"subject": w["subject"], "topic": topic or (w["subject"] + ": " + (w["chapter"] or "other")), "q": q, "years": yrs})
js = "/* v41 · Team Ehsan's DIG-206 MCQ & SAQ bank (the owner's \"Ehsan [DIG-206]\" files, batch 199 upload): " + str(len(out)) + " keyed MCQs not already in the bank\n * and " + str(len(add)) + " previous written questions joined to their topics. Built by tools/g206/build_ehsan206.py. Non-commercial, as Team Ehsan asks. */\n(function () {\n  const B = window.IX_GIT206; if (!B || !B.mcq) return;\n  const have = new Set(B.mcq.map((q) => q.id));\n  const FIX = " + json.dumps(fix) + ";\n  B.mcq.forEach((q) => { const k = FIX[q.id]; if (k) { if (q.keyBy === \"app\" && q.answerKeys[0] !== k) q.appKeyWas = q.answerKeys[0]; q.answerKeys = [k]; delete q.keyBy; q.keyFrom = \"Ehsan\"; } });\n  " + json.dumps(out, ensure_ascii=False) + ".forEach((q) => { if (!have.has(q.id)) B.mcq.push(q); });\n  " + json.dumps(add, ensure_ascii=False) + """.forEach((w) => {
    let t = B.written.find((x) => x.topic === w.topic);
    if (!t) { t = { subject: w.subject, topic: w.topic, times: 0, years: [], last: "", score: 0, questions: [] }; B.written.push(t); }
    if (t.questions.some((x) => x.q === w.q)) return;
    t.questions.push({ q: w.q, years: w.years, src: "Ehsan" });
    w.years.forEach((y) => { if (!t.years.includes(y)) { t.years.push(y); t.times++; t.score++; } });
  });
  B.written.sort((a, b) => b.score - a.score || b.times - a.times);
})();
"""
open(outp, "w", encoding="utf-8").write(js)
from collections import Counter
print("keys fixed", len(fix), "changed app keys", sum(1 for q in B["mcq"] if q["id"] in fix and q.get("keyBy") == "app" and q["answerKeys"][0] != fix[q["id"]])); print("mcq added", len(out), "dup", dup, Counter(q["subject"] for q in out)); print("written", len(add), "new topics", len(set(a["topic"] for a in add if ":" in a["topic"] and a["topic"].split(":")[0] in ("Anatomy","Physiology","Histology","Biochemistry"))))
