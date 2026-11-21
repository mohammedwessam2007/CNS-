import json, re, hashlib, sys
d = json.load(open('med/items.json'))
bank = open(sys.argv[1], encoding='utf-8').read()
existing = set(re.sub(r'[^a-z0-9]', '', s.lower())[:60] for s in re.findall(r'"stem":"(.*?)","options"', bank))
SET = {'A7': 'a', 'A8': 'd', 'A13': 'c', 'A18': 'b', 'A22': 'c', 'A27': 'a', 'A29': 'd', 'A34': 'c', 'A41': 'd'}
APP = {'A13', 'A22'}   # the printed mark disagreed with the anatomy; the app's key, labelled
SKIP = {'A1', 'A14', 'A31', 'A38', 'B12', 'B25', 'B36'}
CH = [("Anterior abdominal wall", r"rectus|arcuate line|umbilic|inguinal|hernia|camper|scarpa|superficial fatty|colls|pyramidalis|lacunar|external oblique|local anaesthesia"),
      ("Testis and spermatic cord", r"testi|scrot|spermatic|vasectomy|dartos|cremaster|penile|penis|vas "),
      ("Gut development", r"embryo|develop|mesogastri|foregut|midgut|fetal"),
      ("Kidney, ureter and suprarenal glands", r"kidney|renal|suprarenal|adrenal|ureter"),
      ("Liver and biliary system", r"liver|hepat|gall|cbd|bile|caudate|morison"),
      ("Pancreas", r"pancrea"), ("Spleen", r"spleen|splenic l"),
      ("Stomach", r"stomach|gastric|pylor"),
      ("Large intestine", r"colon|caec|rect|append|sigmoid"),
      ("Small intestine", r"ileum|jejun|duoden"),
      ("Vessels of gut", r"mesenteric|coeliac|celiac|artery|vein"),
      ("Abdominal cavity and peritoneum", r"peritone|omentum|omental|bursa|sac"),
      ("Posterior abdominal wall", r"lumbar|psoas|arcuate ligament|subcostal|subcoastal|diaphragm|quadratus"),
      ("Anterior abdominal wall", r".")]
junk = lambda t: (lambda u: u if u else t.strip())(re.sub(r'\s+', ' ', re.sub(r'(\b[hH] t a d\b|\be \. r M D\b|(?<=[a-zA-Z.)]) [0-9]{1,2}\s*$|-{3,}|\bx\s*$)', ' ', t)).strip(' .'))
out = []
for part in 'AB':
    for q in d[part]:
        tag = part + str(q['n'])
        if tag in SKIP: continue
        key = SET.get(tag) or (q['ans'][0] if len(q['ans']) == 1 else None)
        opts = [{'key': o['key'], 'text': junk(junk(o['text']))} for o in q['options']]
        if not key or len(opts) < 4: continue
        stem = junk(junk(q['stem']))
        if re.sub(r'[^a-z0-9]', '', stem.lower())[:60] in existing: continue
        txt = (stem + ' ' + ' '.join(o['text'] for o in opts)).lower()
        ch = next(c for c, rx in CH if re.search(rx, stem.lower()) )
        it = {'subject': 'Anatomy', 'chapter': ch, 'stem': stem[0].upper() + stem[1:], 'options': opts, 'answerKeys': [key], 'source': "Dr Medhat's abdomen MCQs", 'ocr': False, 'id': 'G206-M' + hashlib.sha1(stem.encode()).hexdigest()[:9], 'tag': tag}
        if tag in APP: it['keyBy'] = 'app'
        out.append(it)
for it in out: it.pop('tag')
print(len(out), {c: sum(1 for x in out if x['chapter'] == c) for c, _ in CH})
js = "/* v39 · Dr Medhat's abdomen MCQs from the owner's 206 material (\"Dr. Medhat anatomy mcq.pdf\"), keys read from the\n * printed x marks and the red answer pages; items with no clear or a disputable key are left out; two keys the app corrected\n * are marked keyBy:\"app\". Appended to the DIG-206 bank. */\n(function () { const B = window.IX_GIT206; if (!B || !B.mcq) return; const have = new Set(B.mcq.map((q) => q.id));\n  " + json.dumps(out, ensure_ascii=False) + ".forEach((q) => { if (!have.has(q.id)) B.mcq.push(q); });\n})();\n"
open(sys.argv[2], 'w', encoding='utf-8').write(js)
