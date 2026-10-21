import json, base64, os, sys
NEO = '../neo/'; DEPT = sys.argv[1]
h = open(NEO + 'head.part').read(); sc = open(NEO + 'scene.part').read()
link = open('link.part').read(); les = open('lesson.part').read(); css = open('extra.css').read()
def rep(s, a, b, n=1):
    assert s.count(a) == n, (a[:70], s.count(a)); return s.replace(a, b)
# page
h = rep(h, '<title>Neck in Layers</title>', '<title>Neck and Doss</title>')
h = rep(h, '/* Layout: an app screen. A live 3D stage of the neck (C3 to C7) fills the left;', '/* Layout: an app screen. A live 3D stage of a real neck slab (C6 and C7), with Dr Doss\'s page pinned on it, fills the left;')
h = rep(h, 'aria-label="3D model of a slab of the neck at C5 and C6"', 'aria-label="3D model of a slab of the neck at C6 and C7, with Dr Sameh Doss\'s drawing linked to it"')
h = rep(h, 'Neck slab, C5 to C6<br>', 'Neck slab, C6 to C7<br>')
h = rep(h, 'NEU-205 · Anatomy · Day 29', 'NEU-205 · Day 29 · T057')
h = rep(h, '.steps { display: grid; grid-template-columns: repeat(3, 1fr);', '.steps { display: grid; grid-template-columns: repeat(4, 1fr);')
h = rep(h, '<i id="s3"></i></div>', '<i id="s3"></i><i id="s4"></i></div>')
h = rep(h, 'Section 1 of 3', 'Section 1 of 4')
h = rep(h, '.hud.bl { left: 20px; bottom: 64px; display: grid; gap: 3px; }', '.hud.bl { left: 20px; bottom: 64px; display: grid; gap: 3px; }\n.credit { position: absolute; z-index: 4; left: 20px; bottom: 16px; max-width: calc(100% - 330px); font: 400 10.5px/1.35 var(--sans); color: var(--text-3); }\n.credit a { color: inherit; }')
h = rep(h, '  .hud.bl { display: none; }', '  .hud.bl { display: none; }\n  .credit { max-width: calc(100% - 290px); }')
h = rep(h, '  .hud.tr { display: none; }', '  .hud.tr { display: none; }\n  .credit { left: 14px; bottom: 64px; max-width: calc(100% - 28px); font-size: 9.5px; }\n  .credit .cl { display: none; }')
h = rep(h, '</style>', css + '</style>')
h = rep(h, '    <div class="tools">',
  '    <figure class="sketch" id="sketch" data-size="mini"><figcaption class="sk-hd"><span class="sk-who"><b>Dr Sameh Doss</b><span lang="ar" dir="rtl">رسمة د. سامح دوس</span></span><button type="button" class="sk-size" id="sk-size" aria-label="Enlarge or shrink his drawing">⤢</button></figcaption><div class="sk-wrap" id="sk-wrap"><img id="sk-img" alt=""><div class="sk-spots" id="sk-spots"></div></div><p class="sk-cap" id="sk-cap"></p></figure>\n'
  '    <div class="credit">Anatomy from <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/" target="_blank" rel="noopener">BodyParts3D</a>, © The Database Center for Life Science, CC BY-SA 2.1 JP. Drawings: Dr Sameh Doss, Kasr Al Ainy. <span class="cl">Thyroid, branches and nerves modelled to fit.</span></div>\n    <div class="tools">')
h = rep(h, '</aside>\n</div>', '</aside>\n</div>\n<svg id="thread" aria-hidden="true"><path id="th-path"/><path id="th-flow"/><circle id="th-ring" r="6"/><circle id="th-dot" r="5"/></svg><div id="th-tag" aria-live="polite"></div>')
# data: the neck and his drawings
spots = json.load(open('spots.json'))
figs = {}
for k, v in spots.items():
    raw = open(os.path.join(DEPT, k + '.jpg'), 'rb').read()
    figs[k] = dict(v, src='data:image/jpeg;base64,' + base64.b64encode(raw).decode())
data = open('../build/scene.json').read(); assert '</' not in data
i = h.index('<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js">')
h = h[:i] + '<script type="application/json" id="neck-data">' + data + '</script>\n<script>window.DOSS_FIGS=' + json.dumps(figs, separators=(',', ':')) + ';</script>\n' + h[i:]
# scene
sc = rep(sc, 'var G = {}, PICK = [], RAW = [];', 'var G = {}, PICK = [], RAW = [], BYNAME = {};')
sc = rep(sc, '    RAW.push({ n: m.n, l: m.l, P: P });\n', '    RAW.push({ n: m.n, l: m.l, P: P });\n    for (var sx0 = 0, q0 = 0; q0 < P.length; q0 += 3) sx0 += P[q0];\n    (BYNAME[m.n] = BYNAME[m.n] || []).push({ front: front, cap: cap, layer: m.l, side: sx0 > 0 ? 1 : -1, P: P });\n')
sc = rep(sc, '  /* ───── render loop ───── */', link + '  /* ───── render loop ───── */')
sc = rep(sc, '    down = null;\n    var r = canvas.getBoundingClientRect();', '    down = null;\n    stopTour(); if (LINK) unlink();\n    var r = canvas.getBoundingClientRect();')
sc = rep(sc, 'var show = tg.stage.indexOf(stage) >= 0 && introDone &&', 'var show = tg.stage.indexOf(stage) >= 0 && introDone && !LINK &&')
sc = rep(sc, '    var az = THREE.MathUtils.radToDeg', '    drawThread();\n    var az = THREE.MathUtils.radToDeg')
out = h + sc + les
open('neck-doss.html', 'w').write(out)
print(len(out) // 1024, 'KB')
