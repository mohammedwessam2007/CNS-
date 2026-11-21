# v39: reads "Dr. Medhat anatomy mcq.pdf" (pdftotext -bbox-layout -> med/bbox.html; pages 19-23 rendered at 100 dpi -> med/r-NN.png).
# Keys: printed x marks (pages 9-13) and red answer text (pages 19-23).
import re, json, html
from PIL import Image
src = open('med/bbox.html', encoding='utf-8').read()
pages = re.findall(r'<page[^>]*>(.*?)</page>', src, re.S)
def lines(pg):
    out = []
    for ln in re.findall(r'<line[^>]*>(.*?)</line>', pg, re.S):
        ws = [(float(a), float(b), float(c), float(d), html.unescape(t)) for a, b, c, d, t in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', ln)]
        if ws: out.append(ws)
    return out
QRE = re.compile(r'^\s*(\d{1,2})[.)]\s*(.*)')
ORE = re.compile(r'^\s*\(?([A-Ea-e])[.)]\s*(.*)')
def parse(pnums, mode):
    items, cur, opt = [], None, None
    for pn in pnums:
        img = Image.open('med/r-%02d.png' % pn).convert('RGB') if mode == 'red' else None
        L = lines(pages[pn - 1])
        xs = []  # x marks: (y)
        for ws in L:
            text = ' '.join(w[4] for w in ws)
            red = False; ratio = 0
            if img:
                s = 100 / 72; n = r = 0
                for (a, b, c, d, t) in ws:
                    for X in range(int(a * s), int(c * s), 2):
                        for Y in range(int((b + (d - b) * .3) * s), int((d - (d - b) * .3) * s) + 1):
                            R, G, B = img.getpixel((min(X, img.width - 1), min(Y, img.height - 1)))
                            if R + G + B < 600: n += 1; r += (R > 180 and R - G > 60)
                red = n > 3 and r / n > 0.3; ratio = r / n if n else 0
            m = QRE.match(text); o = ORE.match(text)
            if m and not o:
                cur = {'n': int(m.group(1)), 'stem': m.group(2), 'options': [], 'ans': []}; items.append(cur); opt = None; continue
            if o and cur is not None:
                body = o.group(2)
                mark = mode == 'x' and re.search(r'\s[xX]\s*$', body)
                body = re.sub(r'\s+[xX]\s*$', '', body).strip()
                opt = {'key': o.group(1).lower(), 'text': body, 'rr': ratio if img else 0}; cur['options'].append(opt)
                if mark: cur['ans'].append(opt['key'])
                continue
            if cur is not None:
                if mode == 'x' and text.strip() in ('x', 'X') and cur['options']:
                    # a stray x on its own line: the option at the same height
                    y = ws[0][1]
                    xs.append((y, cur)); continue
                if opt is None: cur['stem'] += ' ' + text
                else: opt['text'] += ' ' + text
    if mode == 'red':
        for q in items:
            if q['options']:
                best = max(q['options'], key=lambda o: o['rr'])
                if best['rr'] > 0.2 and sorted(o['rr'] for o in q['options'])[-2] < best['rr'] / 2: q['ans'] = [best['key']]
    return items
A = parse(range(9, 14), 'x'); B = parse(range(19, 24), 'red')
for nm, it in (('A', A), ('B', B)):
    ok = [q for q in it if len(q['ans']) == 1 and len(q['options']) >= 4]
    print(nm, len(it), 'keyed', len(ok), 'bad', [(q['n'], len(q['options']), q['ans']) for q in it if q not in ok])
json.dump({'A': A, 'B': B}, open('med/items.json', 'w'), indent=0, ensure_ascii=False)
