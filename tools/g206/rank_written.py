"""Group DIG-206 written questions by topic and rank by how often and how recently they were asked.
Usage: python3 -I rank_written.py <written.json> <out.json>"""
import json, re, sys
items = json.load(open(sys.argv[1], encoding="utf-8"))
T = [  # (subject, topic, regex) — first match wins, ordered specific → general
 ("Anatomy", "Inguinal canal (boundaries, rings, contents, hernia)", r"inguinal (canal|ring)|hernia"),
 ("Anatomy", "Spermatic cord contents", r"spermatic cord"),
 ("Anatomy", "Rectus sheath", r"rectus sheath"),
 ("Anatomy", "Portosystemic anastomosis", r"portosystemic|porto-systemic|portal hypertension"),
 ("Anatomy", "Porta hepatis", r"porta hepatis"),
 ("Anatomy", "Liver: surface anatomy, bare areas, relations", r"\bliver\b|bare area|subphrenic"),
 ("Anatomy", "Gall bladder", r"gall ?bladder|murphy"),
 ("Anatomy", "Spleen: surface anatomy, ligaments, relations, blood supply", r"spleen|splen"),
 ("Anatomy", "Pancreas: relations, development", r"pancrea"),
 ("Anatomy", "Stomach: arteries, veins, ligaments, development", r"stomach|gastric arter"),
 ("Anatomy", "Duodenum", r"duoden"),
 ("Anatomy", "Caecum and appendix", r"c(a)?ecum|append"),
 ("Anatomy", "Mesentery of small intestine", r"mesent(e)?ry"),
 ("Anatomy", "Epiploic foramen and lesser sac", r"epiploic|lesser sac"),
 ("Anatomy", "Diaphragm: development and anomalies", r"diaphragm"),
 ("Anatomy", "Midgut development and anomalies", r"midgut|rotation of (the )?gut"),
 ("Anatomy", "Kidney: relations, surface anatomy, development", r"kidney|renal pain|renal angle"),
 ("Anatomy", "Suprarenal glands", r"supra ?renal"),
 ("Anatomy", "Psoas major", r"psoas"),
 ("Anatomy", "Quadratus lumborum", r"quadratus"),
 ("Anatomy", "Abdominal aorta and IVC", r"aorta|vena cava|ivc"),
 ("Physiology", "Temperature regulation and fever", r"fever|thermoregul|heat stroke|cold environment"),
 ("Physiology", "Food intake and obesity", r"food intake|obesity"),
 ("Physiology", "Glomerulotubular balance and tubuloglomerular feedback", r"glomerulo-?tubular|tubulo-? ?glomerular"),
 ("Physiology", "Functions of the stomach / gastrectomy", r"functions of the stomach|gastrectomy"),
 ("Physiology", "Salivary secretion", r"saliva"),
 ("Physiology", "Swallowing (deglutition)", r"swallow|deglutit"),
 ("Physiology", "Gastric acid secretion and its control", r"acid secretion|hcl|parietal|gastric secretion|peptic ulcer"),
 ("Physiology", "GI hormones: gastrin, CCK, secretin", r"gastrin|cholecystokinin|cck|secretin"),
 ("Physiology", "Pancreatic secretion and pancreatitis", r"pancrea"),
 ("Physiology", "Bile and gall bladder emptying", r"\bbile|jaundice|gall bladder"),
 ("Physiology", "GIT motility (BER, peristalsis, vomiting, defecation)", r"slow wave|ber\b|peristal|vomit|defecat|motility|gastric emptying|intestinal movements"),
 ("Physiology", "GFR and its regulation", r"\bgfr\b|glomerular filtration"),
 ("Physiology", "Renal blood flow autoregulation", r"autoregulat|renal blood flow"),
 ("Physiology", "Urine concentration (loop of Henle, countercurrent, ADH)", r"henle|countercurrent|concentrat|adh|vasopressin"),
 ("Physiology", "Sodium excretion and its hormonal control", r"sodium|na\+"),
 ("Physiology", "Renal acid-base: H+ secretion and buffering", r"buffer|acid-?base|acidosis|alkalosis|hydrogen|h\+ secret|fate of h\+"),
 ("Physiology", "Tubular reabsorption (glucose, clearance)", r"glucose|clearance|reabsorp"),
 ("Physiology", "Acute tubular necrosis / renal failure case", r"tubular necrosis|renal failure"),
 ("Physiology", "Metabolism (RQ, BMR)", r"\brq\b|respiratory quotient|metabolic rate|bmr"),
 ("Histology", "Tongue and lingual papillae", r"papill|tongue"),
 ("Histology", "Mesangial cells and blood-renal barrier", r"mesangial|blood renal barrier|glomerular basement"),
 ("Histology", "Collecting tubules (principal and intercalated cells)", r"collecting tubule|intercalated"),
 ("Histology", "Space of Disse and liver sinusoids", r"disse"),
 ("Histology", "Juxtaglomerular apparatus and macula densa", r"juxtaglomerular|macula densa"),
 ("Histology", "PCT vs DCT", r"\bpct\b|\bdct\b|proximal|distal convoluted"),
 ("Histology", "Renal corpuscle (podocytes, filtration barrier)", r"malpighian|renal corpuscle|podocyte|bowman|filtration barrier"),
 ("Histology", "Hepatocytes, liver lobule and acinus", r"hepatocyte|liver|\bito\b|kupffer|sinusoid|acinus"),
 ("Histology", "Gastric glands (peptic, parietal, fundic cells)", r"peptic|oxyntic|parietal|fundic|chief cell|gastric gland"),
 ("Histology", "Small intestine (Paneth, M cells, villi)", r"paneth|microfold|m \(microfold\)|villi|crypt|small intestine"),
 ("Histology", "Pyloro-duodenal and other junctions", r"pyloro|junction"),
 ("Histology", "Salivary glands and serous/mucous acini", r"saliva|serous|mucous|parotid|submandibular"),
 ("Histology", "Pancreas (exocrine/endocrine)", r"pancrea|islet|exocrine secretion"),
 ("Histology", "Oesophagus, tongue, colon, appendix", r"oesoph|esoph|tongue|taste|colon|append"),
 ("Histology", "Urinary passages (ureter, bladder)", r"ureter|bladder|urothel|transitional"),
]
groups = {}
for it in items:
    q = it["q"].lower()
    topic = next((t for s, t, rx in T if s == it["subject"] and re.search(rx, q)), it["subject"] + ": other")
    g = groups.setdefault(topic, {"subject": it["subject"], "topic": topic, "years": set(), "questions": []})
    g["years"].update(it["years"]); g["questions"].append({"q": it["q"], "years": it["years"]})
def yr(y):
    m = re.search(r"Final\s*(\d+)", y)
    return 2023 + (int(m.group(1)) - 196) if m else int(y)  # batch 196 sat in 2024 (approx), 198 in 2026
out = []
for g in groups.values():
    ys = sorted(g["years"], key=yr)
    last = yr(ys[-1]) if ys else 0
    score = len(ys) + (2 if last >= 2024 else 1 if last >= 2021 else 0)
    out.append({"subject": g["subject"], "topic": g["topic"], "times": len(ys), "years": ys, "last": ys[-1] if ys else "", "score": score, "questions": g["questions"]})
out.sort(key=lambda g: (-g["score"], g["subject"], g["topic"]))
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=0)
for g in out[:40]: print(f'{g["score"]:>2} {g["subject"][:5]:5} {g["times"]}x last {g["last"]:>9}  {g["topic"]}')
print("other:", [(g["topic"], len(g["questions"])) for g in out if g["topic"].endswith("other")])
