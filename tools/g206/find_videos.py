import re, json, time, math, urllib.parse, subprocess
exec(open('queries.py').read())
GOOD = {"Ninja Nerd": 6, "Osmosis from Elsevier": 5, "Osmosis": 5, "Armando Hasudungan": 5, "Kenhub - Learn Human Anatomy": 5, "Dr. Najeeb Lectures": 3, "Catalyst University": 3, "AnatomyZone": 5, "Lecturio Medical": 4, "Physiology Open": 3, "Dr Matt & Dr Mike": 4, "Shomu's Biology": 2, "Sam Webster": 4, "Khan Academy Medicine": 4, "Medical Histology": 2, "Rhesus Medicine": 3, "Ninja Nerd Lectures": 6, "Dirty Medicine": 3, "The Noted Anatomist": 4, "Instant Anatomy": 4, "Dr. John Campbell": 2, "Zero To Finals": 3, "Shotgun Histology": 3, "Corporis": 3, "Speed Pharmacology": 1, "Animated biology With arpan": 2, "Histology Guide": 3, "PhysioPathoPharmaco": 2, "Medicosis Perfectionalis": 3}
GEN = {'anatomy','physiology','histology','biochemistry','lecture','embryology','regulation','function','system','tutorial'}
def search(q):
    url = "https://www.youtube.com/results?hl=en&search_query=" + urllib.parse.quote(q)
    h = subprocess.run(["curl", "-s", "-H", "Accept-Language: en", url], capture_output=True, text=True).stdout
    m = re.search(r'var ytInitialData = (\{.*?\});</script>', h, re.S)
    if not m: return []
    d = json.loads(m.group(1)); out = []
    def walk(x):
        if isinstance(x, dict):
            if 'videoRenderer' in x:
                v = x['videoRenderer']
                out.append({"id": v.get('videoId'), "title": ''.join(r.get('text', '') for r in v.get('title', {}).get('runs', [])), "ch": ''.join(r.get('text', '') for r in v.get('ownerText', {}).get('runs', [])), "len": v.get('lengthText', {}).get('simpleText', ''), "views": int(re.sub(r'\D', '', v.get('viewCountText', {}).get('simpleText', '0')) or 0)})
            for k in x.values(): walk(k)
        elif isinstance(x, list):
            for k in x: walk(k)
    walk(d); return out
def mins(l):
    p = [int(x) for x in l.split(':')] if l else [0]
    return p[0] * 60 + p[1] + p[2] / 60 if len(p) == 3 else p[0] + (p[1] / 60 if len(p) > 1 else 0)
def embeddable(i):
    r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=" + i], capture_output=True, text=True).stdout
    return r == "200"
res = {}
for key, qs in Q.items():
    picks = []
    for q in qs:
        c = search(q + " lecture")
        sc = []
        for v in c:
            m = mins(v["len"])
            if not v["id"] or m < 4 or m > 75 or re.search(r'#shorts|short|tiktok|quiz only|mcq', v["title"], re.I): continue
            if re.search(r'hindi|urdu|in tamil|telugu|bangla|español|arabic', v["title"], re.I): continue
            words = [w for w in re.findall(r'[a-z]{4,}', q.lower()) if w not in GEN]
            t = v["title"].lower(); rel = sum(1 for w in words if w[:6] in t) / max(1, len(words))
            if rel < 0.5: continue
            s = GOOD.get(v["ch"], 0) * 1.2 + 8 * rel + math.log10(v["views"] + 10) + (1 if 8 <= m <= 40 else 0)
            sc.append((s, v))
        sc.sort(key=lambda x: -x[0])
        for s, v in sc:
            if any(p["id"] == v["id"] for p in picks): continue
            if embeddable(v["id"]): picks.append(dict(v, q=q)); break
        time.sleep(0.4)
    res[key] = picks
    print(key[:40], [(p["ch"][:22], p["title"][:50], p["len"]) for p in picks], flush=True)
json.dump(res, open('videos.json', 'w'), indent=0, ensure_ascii=False)
