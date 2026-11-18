"""Build the examiner profile from the real past papers: what these examiners repeat, how they word questions,
which verbs and structures the written papers use, where the marks sit. The professor reads it in every call.
Usage: python3 -I build_profile.py <index.html> <git206-bank.js> <out.js>"""
import json, re, sys, collections
html, gitjs, out = sys.argv[1:4]
s = open(html, encoding="utf-8").read(); i = s.index("EHSAN_QBANK=") + len("EHSAN_QBANK=")
cns = json.JSONDecoder().raw_decode(s[i:])[0]["questions"]
g = open(gitjs, encoding="utf-8").read(); git = json.loads(g[g.index("= ") + 2: g.rstrip().rindex(";")])
NEG = re.compile(r"\b(except|not|false|incorrect|least|wrong)\b", re.I)
CLIN = re.compile(r"\b(year[- ]old|patient|presents?|complain|lesion|injur|damage|man|woman|child|surgeon|operation)\b", re.I)
def pct(a, b): return round(100 * a / b) if b else 0
def mcq_profile(qs, label, top=8):
    by = collections.defaultdict(list)
    for q in qs: by[(q.get("subject") or "").title()].append(q)
    lines = []
    for sub, l in sorted(by.items(), key=lambda x: -len(x[1])):
        if len(l) < 15: continue
        lines.append(f"- {sub}: {len(l)} past MCQs; {pct(sum(bool(NEG.search(q['stem'])) for q in l), len(l))}% negative stems (except/not/false), {pct(sum(bool(CLIN.search(q['stem'])) for q in l), len(l))}% clinical or lesion stems.")
    ch = collections.Counter(q.get("chapter") for q in qs).most_common(top)
    tot = len(qs)
    lines.append("- Most-asked chapters: " + "; ".join(f"{c} ({n})" for c, n in ch) + f". These {top} hold {pct(sum(n for _, n in ch), tot)}% of all {tot} questions.")
    return lines
W = [w for w in git["written"] if not w["topic"].endswith("other")]
allq = [(w["subject"], q["q"], q["years"]) for w in W for q in w["questions"]]
VERB = [("Compare (table)", r"compar|differen"), ("Explain / mechanism", r"explain|mechanism|discuss"), ("Mention / enumerate / list", r"mention|enumerat|\blist\b|give|name"), ("Describe", r"describe|account"), ("Relations", r"relation"), ("Case", r"\bcase\b|year[- ]old"), ("Development / anomalies", r"develop|anomal")]
vc = collections.Counter()
for _, q, _ in allq:
    for name, rx in VERB:
        if re.search(rx, q, re.I): vc[name] += 1; break
rep = [w for w in W if w["times"] >= 3]
top15 = W[:15]; share = pct(sum(w["times"] for w in top15), sum(w["times"] for w in W))
git_lines = ["DIG-206 EXAMINERS (from the past papers 2010–2026: 641 MCQs, 159 written questions):"] + mcq_profile([q for q in git["mcq"] if q["answerKeys"]], "GIT") + [
    "- Written verbs, most to least used: " + ", ".join(f"{k} {v}" for k, v in vc.most_common()) + ".",
    f"- They repeat: {len(rep)} written topics came back 3+ times (" + "; ".join(f"{w['topic']} {w['times']}x" for w in rep[:8]) + f"). The top 15 topics are {share}% of all written appearances.",
    "- The last paper (batch 198): physiology 4 questions (8–10 marks each: salivary secretion, swallowing, renal autoregulation, H+ buffering), anatomy 6 (6 marks each, one clinical case on the spleen), histology 4 (3–8 marks, tables: PCT vs DCT, peptic vs Paneth, liver acinus), then biochemistry MCQs.",
]
cns_lines = ["NEU-205 EXAMINERS (from 1,321 past MCQs, batches 191–198):"] + mcq_profile(cns, "CNS", 10) + [
    "- CNS written past papers are not loaded yet: use the same verbs and marking as DIG-206, and the chapters above as the likely essays.",
]
philo = [
    "HOW THESE EXAMINERS THINK (points 1-5 read from the past papers; point 6 is the usual Kasr Al Ainy rule, not measured):",
    "1. They reward the core and repeat it: a small set of topics returns every few years, often in the same words. Mastering those first is the highest marks per minute.",
    "2. A negative stem tests the boundary of a list: they pick the one item that does NOT belong, usually a look-alike from the neighbouring structure. Students lose marks by missing the word EXCEPT.",
    "3. A clinical stem tests the mechanism, not the name: the finding → the structure → the reason.",
    "4. In written papers the verb is the marking scheme: 'mention' wants an exact list, 'compare' a table, 'explain' a causal chain, 'case' every finding commented. Points outside the asked frame earn nothing; a missing item of a list loses its mark.",
    "5. They give marks for completeness and order, not elegance: numbered points, the full count, the right terms, a labelled drawing where one is expected.",
    "6. The department's own lecture wording and the department book are the standard; textbook extras are not marked.",
]
data = {"git": "\n".join(git_lines + philo), "cns": "\n".join(cns_lines + philo)}
js = "/* The examiner profile, built by tools/examiner/build_profile.py from the past papers. The professor reads it in every call. */\nwindow.IX_EXAMINER = " + json.dumps(data, ensure_ascii=False) + ";\n"
open(out, "w", encoding="utf-8").write(js)
print(data["git"]); print("----"); print(data["cns"][:900])
