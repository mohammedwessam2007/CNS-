"""Neck scene builder. Real BodyParts3D meshes around C6-C7, plus the structures the database lacks at this
level, rebuilt in the free space between the real ones. Output: scene.json for neck-3d.html.
Coordinates are millimetres: x (patient's left +), y = y_bp3d + 90 (posterior +), z = z_bp3d - 1392 (up +)."""
import json, re, sys, base64, os
import numpy as np
from scipy.spatial import cKDTree

SRC = sys.argv[1]          # bp3d folder (have.json, obj/)
OUT = sys.argv[2]          # scene.json
SB, ST = -24.0, 16.0       # the slab: bottom and top cut, mm
have = json.load(open(os.path.join(SRC, 'have.json')))


def kind_layer(n):
    if 'intervertebral' in n: return 'disc', 'prevertebral'
    if 'vertebral artery' in n: return 'artery', 'prevertebral'
    if 'platysma' in n: return 'muscle2', 'superficial'
    if re.search('sternocleidomastoid|trapezius', n): return 'muscle', 'investing'
    if re.search('sternohyoid|sternothyroid|omohyoid|thyrohyoid|cricothyroid', n): return 'muscle2', 'pretracheal'
    if re.search('trachea|thyroid cartilage|cricoid|hyoid', n): return 'cart', 'pretracheal'
    if 'esophagus' in n: return 'oes', 'pretracheal'
    if re.search('scalenus|longus|levator|splenius|semispinalis', n): return 'muscle', 'prevertebral'
    if 'vertebra' in n: return 'bone', 'prevertebral'
    if re.search('common carotid|internal carotid', n): return 'artery', 'carotid'
    if 'internal jugular' in n: return 'vein', 'carotid'
    return None, None


SKIP = re.compile(r'clavicle|manubrium|first rib|subclavian|ascending part|transverse part|semispinalis thoracis|spinal cord')
PRETTY = {
    'esophagus': 'Oesophagus', 'trachea': 'Trachea', 'cricoid cartilage': 'Cricoid cartilage', 'thyroid cartilage': 'Thyroid cartilage',
    'hyoid bone': 'Hyoid bone', 'intervertebral disc': 'Intervertebral disc', 'vertebral artery': 'Vertebral artery',
    'common carotid artery': 'Common carotid artery', 'internal carotid artery': 'Internal carotid artery',
}


def pretty(n):
    if n in PRETTY: return PRETTY[n]
    if re.search('cervical vertebra|thoracic vertebra', n):
        return {'third': 'C3', 'fourth': 'C4', 'fifth': 'C5', 'sixth': 'C6', 'seventh': 'C7', 'first': 'T1'}[n.split()[0]] + ' vertebra'
    n = re.sub(r'^(left|right) ', '', n)
    n = re.sub(r' of (left|right) ', ' of ', n)
    n = n.replace('descending part of ', '').replace('internal jugular vein', 'Internal jugular vein')
    rename = {'sternocleidomastoid': 'Sternocleidomastoid', 'trapezius': 'Trapezius', 'platysma': 'Platysma', 'levator scapulae': 'Levator scapulae',
              'longus capitis': 'Longus capitis', 'scalenus anterior': 'Scalenus anterior', 'scalenus medius': 'Scalenus medius',
              'scalenus posterior': 'Scalenus posterior', 'semispinalis capitis': 'Semispinalis capitis', 'semispinalis cervicis': 'Semispinalis cervicis',
              'splenius capitis': 'Splenius capitis', 'splenius cervicis': 'Splenius cervicis', 'sternohyoid': 'Sternohyoid', 'sternothyroid': 'Sternothyroid',
              'omohyoid': 'Omohyoid', 'thyrohyoid': 'Thyrohyoid'}
    if n in rename: return rename[n]
    if 'longus colli' in n: return 'Longus colli'
    if 'cricothyroid' in n: return 'Cricothyroid'
    return n[0].upper() + n[1:]


def load_obj(fj):
    V, F = [], []
    for line in open(os.path.join(SRC, 'obj', fj + '.obj'), encoding='latin-1'):
        if line.startswith('v '):
            a = line.split(); V.append((float(a[1]), float(a[2]) + 90.0, float(a[3]) - 1392.0))
        elif line.startswith('f '):
            ids = [int(t.split('/')[0]) - 1 for t in line.split()[1:]]
            for i in range(1, len(ids) - 1): F.append((ids[0], ids[i], ids[i + 1]))
    return np.array(V, float), np.array(F, int)


def vnormals(V, F):
    N = np.zeros_like(V)
    fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    for k in range(3): np.add.at(N, F[:, k], fn)
    N /= np.maximum(1e-9, np.linalg.norm(N, axis=1))[:, None]
    return N


def signed_volume(V, F):
    return np.einsum('ij,ij->i', V[F[:, 0]], np.cross(V[F[:, 1]], V[F[:, 2]])).sum() / 6


# ───────── real meshes ─────────
real, seen = [], set()
for fj, n in sorted(have.items(), key=lambda x: x[1]):
    if SKIP.search(n): continue
    k, l = kind_layer(n)
    if not k: continue
    V, F = load_obj(fj)
    sig = (len(V), round(V[:, 0].min(), 2), round(V[:, 2].max(), 2))
    if sig in seen: continue          # the database lists a few parts twice
    seen.add(sig)
    if signed_volume(V, F) < 0: F = F[:, ::-1]
    # a part named for one side sometimes carries a sliver of its twin
    cx = V[F].mean(axis=1)[:, 0]
    if re.search(r'\bright\b', n): F = F[cx < 1.0]
    elif re.search(r'\bleft\b', n): F = F[cx > -1.0]
    side = 1 if V[np.unique(F)][:, 0].mean() > 0 else -1
    # the database's common carotid and jugular sit in front of the trachea; move them back and out to where
    # textbooks and CT place them (beside the trachea, behind the thyroid lobe)
    if re.search('common carotid', n): V = V + [8.0 * side, 8.0, 0]
    if 'internal jugular' in n: V = V + [8.0 * side, 11.0, 0]
    nm = 'Intervertebral disc' if k == 'disc' else pretty(n)
    real.append(dict(n=nm, raw=n, k=k, l=l, V=V, F=F, side=side))

# ───────── obstacles: every surface point with its outward normal ─────────
class Obstacles:
    def __init__(self): self.P = []; self.N = []; self.ids = []
    def add(self, V, F, oid):
        self.P.append(V); self.N.append(vnormals(V, F)); self.ids.append(np.full(len(V), oid))
    def tree(self, exclude=()):
        P = np.concatenate(self.P); N = np.concatenate(self.N); I = np.concatenate(self.ids)
        keep = ~np.isin(I, list(exclude))
        return Free(P[keep], N[keep])


class Free:
    def __init__(self, P, N): self.P, self.N, self.t = P, N, cKDTree(P)
    def clearance(self, X):
        d, i = self.t.query(X, k=1)
        inside = np.einsum('ij,ij->i', X - self.P[i], self.N[i]) < 0
        return np.where(inside, -d, d)


OB = Obstacles()
for i, m in enumerate(real):
    m['id'] = i; OB.add(m['V'], m['F'], i)
gen = []          # rebuilt structures


def add_gen(name, k, l, V, F, oid_tag, note=None):
    oid = 1000 + len(gen)
    gen.append(dict(n=name, k=k, l=l, V=V, F=F, id=oid, tag=oid_tag))
    OB.add(V, F, oid)
    return oid


def ids_where(pred): return [m['id'] for m in real if pred(m)] + [g['id'] for g in gen if pred(g)]


# ───────── helpers: centrelines, paths, tubes, blobs ─────────
def centre(m, z, band=1.6):
    V = m['V'][np.unique(m['F'])]
    s = V[np.abs(V[:, 2] - z) < band]
    while len(s) < 6 and band < 7: band *= 1.5; s = V[np.abs(V[:, 2] - z) < band]
    if len(s) < 4: return None
    c = s.mean(axis=0); r = np.linalg.norm((s - c)[:, :2], axis=1).mean()
    return np.array([c[0], c[1], z]), r


def find(raw_re, side):
    return [m for m in real if re.search(raw_re, m['raw']) and m['side'] == side][0]


def catmull(P, per=6):
    P = np.asarray(P, float); P = np.vstack([P[0] * 2 - P[1], P, P[-1] * 2 - P[-2]]); out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for t in np.linspace(0, 1, per, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(P[-2]); return np.array(out)


def settle(points, free, need, reach=10.0, step=0.75):
    """move each control point, within its own horizontal plane, to the nearest spot with room for the structure"""
    g = np.arange(-reach, reach + 1e-9, step); GX, GY = np.meshgrid(g, g); off = np.stack([GX.ravel(), GY.ravel(), 0 * GX.ravel()], 1)
    off = off[np.linalg.norm(off, axis=1) <= reach]; off = off[np.argsort(np.linalg.norm(off, axis=1))]
    out = []
    for p, nd in zip(points, need):
        c = free.clearance(p + off); ok = np.where(c >= nd)[0]
        out.append(p + off[ok[0]] if len(ok) else p + off[np.argmax(c)])
    return np.array(out)


def frames(P):
    T = np.gradient(P, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    a = np.array([1.0, 0, 0]) if abs(T[0][0]) < 0.9 else np.array([0, 1.0, 0])
    N = [np.cross(T[0], a)]; N[0] /= np.linalg.norm(N[0])
    for i in range(1, len(P)):
        n = N[-1] - np.dot(N[-1], T[i]) * T[i]; N.append(n / np.linalg.norm(n))
    N = np.array(N); B = np.cross(T, N); return T, N, B


def tube(P, R, seg=18, ell=None):
    P = np.asarray(P); R = np.broadcast_to(np.asarray(R, float), (len(P),))
    T, N, B = frames(P); V, F = [], []
    ang = np.linspace(0, 2 * np.pi, seg, endpoint=False); ex, ey = (1, 1) if ell is None else ell
    for i in range(len(P)):
        for a in ang: V.append(P[i] + R[i] * (ex * np.cos(a) * N[i] + ey * np.sin(a) * B[i]))
    for i in range(len(P) - 1):
        for j in range(seg):
            a, b, c, d = i * seg + j, i * seg + (j + 1) % seg, (i + 1) * seg + (j + 1) % seg, (i + 1) * seg + j
            F += [(a, b, c), (a, c, d)]
    s0 = len(V); V.append(P[0]); s1 = len(V); V.append(P[-1]); last = (len(P) - 1) * seg
    for j in range(seg):
        F.append((s0, (j + 1) % seg, j)); F.append((s1, last + j, last + (j + 1) % seg))
    V = np.array(V); F = np.array(F)
    if signed_volume(V, F) < 0: F = F[:, ::-1]
    return V, F


def icosphere(sub=3):
    t = (1 + 5 ** 0.5) / 2
    V = [(-1, t, 0), (1, t, 0), (-1, -t, 0), (1, -t, 0), (0, -1, t), (0, 1, t), (0, -1, -t), (0, 1, -t), (t, 0, -1), (t, 0, 1), (-t, 0, -1), (-t, 0, 1)]
    F = [(0, 11, 5), (0, 5, 1), (0, 1, 7), (0, 7, 10), (0, 10, 11), (1, 5, 9), (5, 11, 4), (11, 10, 2), (10, 7, 6), (7, 1, 8), (3, 9, 4), (3, 4, 2), (3, 2, 6), (3, 6, 8), (3, 8, 9), (4, 9, 5), (2, 4, 11), (6, 2, 10), (8, 6, 7), (9, 8, 1)]
    V = [np.array(v, float) / np.linalg.norm(v) for v in V]
    for _ in range(sub):
        cache = {}; F2 = []
        def mid(a, b):
            k = (min(a, b), max(a, b))
            if k not in cache: m = V[a] + V[b]; V.append(m / np.linalg.norm(m)); cache[k] = len(V) - 1
            return cache[k]
        for a, b, c in F:
            ab, bc, ca = mid(a, b), mid(b, c), mid(c, a); F2 += [(a, ab, ca), (b, bc, ab), (c, ca, bc), (ab, bc, ca)]
        F = F2
    return np.array(V), np.array(F)


def neighbours(F, n):
    nb = [set() for _ in range(n)]
    for a, b, c in F: nb[a] |= {b, c}; nb[b] |= {a, c}; nb[c] |= {a, b}
    return [list(s) for s in nb]


def blob(c, radii, free, need=0.8, sub=3, shape=None, smooth=6):
    """inflate an ellipsoid from its centre until it meets its neighbours: it fills its own space and no more"""
    D, F = icosphere(sub); c = np.asarray(c, float)
    tgt = D * radii
    if shape: tgt = shape(D, tgt)
    steps = np.linspace(0.04, 1.0, 60)
    X = c + steps[None, :, None] * tgt[:, None, :]
    ok = free.clearance(X.reshape(-1, 3)).reshape(len(D), len(steps)) >= need
    bad = ~ok; first = np.where(bad.any(axis=1), bad.argmax(axis=1), len(steps))
    s = np.where(first > 0, steps[np.maximum(first - 1, 0)], 0.04)
    nb = neighbours(F, len(D)); s0 = s.copy()
    for _ in range(smooth): s = np.minimum(s0, np.array([0.5 * s[i] + 0.5 * np.mean(s[nb[i]]) for i in range(len(D))]))
    V = c + s[:, None] * tgt
    for _ in range(3):   # Taubin-style relax, keeps the volume
        L = np.array([V[nb[i]].mean(axis=0) for i in range(len(V))]) - V; V = V + 0.5 * L
        L = np.array([V[nb[i]].mean(axis=0) for i in range(len(V))]) - V; V = V - 0.53 * L
    if signed_volume(V, F) < 0: F = F[:, ::-1]
    return V, F


carotid_ids = lambda: ids_where(lambda m: m['l'] == 'carotid')
ANCH = {}
for side in (-1, 1):
    S = 'R' if side < 0 else 'L'
    cca, ica, ijv = find('common carotid', side), find('internal carotid', side), find('internal jugular', side)
    zc_top = cca['V'][np.unique(cca['F'])][:, 2].max(); zi_bot = ica['V'][np.unique(ica['F'])][:, 2].min()
    c_lo, rc = centre(cca, zc_top - 9)
    c_hi, _ = centre(cca, zc_top - 3)
    i_lo, ri = centre(ica, zi_bot + 3)
    i_hi, _ = centre(ica, zi_bot + 9)
    # ── common carotid up to its split at the upper border of the thyroid cartilage, the bulb, and the internal carotid onward
    free = OB.tree([cca['id'], ica['id']])
    B = np.array([c_hi[0] * 0.55 + i_lo[0] * 0.45, c_hi[1] * 0.5 + i_lo[1] * 0.5, 34.0])
    ctrl = [c_lo, c_hi]
    for z in (-6.0, 6.0, 18.0, 27.0): f = (z - c_hi[2]) / (B[2] - c_hi[2]); ctrl.append(c_hi + f * (B - c_hi))
    ctrl += [B, i_lo, i_hi]
    ctrl = np.array(ctrl)
    need = [rc + 0.6] * len(ctrl); need[-1] = need[-2] = ri + 0.4; need[0] = need[1] = 0
    mid = settle(ctrl[2:-2], free, need[2:-2], reach=9)
    ctrl = np.vstack([ctrl[:2], mid, ctrl[-2:]])
    P = catmull(ctrl, 8)
    z = P[:, 2]
    R = np.interp(z, [c_lo[2], 24, 31, 37, 41, i_lo[2], i_hi[2]], [rc * 0.97, rc, rc * 1.12, rc * 1.22, ri * 1.35, ri * 0.98, ri * 0.97])
    V, F = tube(P, R, 20)
    add_gen('Common carotid artery', 'artery', 'carotid', V, F, 'cca' + S)
    ANCH['split' + S] = B.tolist()
    # ── external carotid: leaves the sheath at the split, forward and inward, then up
    free = OB.tree(ids_where(lambda m: m.get('tag') == 'cca' + S))
    ec = [B + [0, 0, 1], B + [-side * 3.0, -4.0, 8], B + [-side * 4.5, -8.0, 24], B + [-side * 3.5, -10.0, 44], B + [-side * 1.0, -9.0, 66], B + [side * 2.0, -6.0, 86]]
    ec = np.vstack([ec[:2], settle(np.array(ec[2:]), free, [3.0] * 4, reach=8)])
    P = catmull(ec, 8); R = np.interp(P[:, 2], [B[2], B[2] + 10, B[2] + 80], [rc * 0.72, ri * 0.95, ri * 0.8])
    V, F = tube(P, R, 16); add_gen('External carotid artery', 'artery', 'carotid', V, F, 'eca' + S)
    ANCH['eca' + S] = P[int(len(P) * 0.55)].tolist()
    # ── internal jugular vein: lateral to the arteries, up to the skull base
    j_lo, rj = centre(ijv, -24); j_hi, _ = centre(ijv, -14)
    free = OB.tree([ijv['id'], ica['id']])
    art = gen[-2]['V']
    def art_at(z):
        a = art[np.abs(art[:, 2] - z) < 2.0]; return a.mean(axis=0) if len(a) else None
    ctrl = [j_lo, j_hi]
    for z in (0.0, 14.0, 28.0, 44.0, 60.0, 80.0, 100.0, 120.0, 140.0):
        a = art_at(z) if z < 50 else (centre(ica, z) or centre(ica, z - 4))[0]
        if a is None: a = centre(ica, 136)[0]
        k = min(1.0, max(0.0, (z - 10) / 110))
        ctrl.append(np.array([a[0] + side * (9.0 - 3 * k), a[1] + 2.0 + 8 * k, z]))
    ctrl = np.array(ctrl)
    need = [0, 0] + [rj * 1.15 + 0.6] * (len(ctrl) - 2)
    ctrl = np.vstack([ctrl[:2], settle(ctrl[2:], free, need[2:], reach=11)])
    P = catmull(ctrl, 8); R = np.interp(P[:, 2], [j_lo[2], -8, 20, 90, 140], [rj * 0.97, rj * 1.05, rj * 1.18, rj * 1.15, rj * 1.3])
    V, F = tube(P, R, 22, ell=(1.12, 0.88)); add_gen('Internal jugular vein', 'vein', 'carotid', V, F, 'ijv' + S)
    vein_gen = V
    # ── vagus: between the artery and the vein, and behind them, the whole length
    free = OB.tree([])
    def vein_at(z):
        a = np.concatenate([ijv['V'], vein_gen]); a = a[np.abs(a[:, 2] - z) < 2.0]; return a.mean(axis=0)
    def artery(z):
        for f in ((lambda: art_at(z)) if z < 46 else None, lambda: centre(ica, z), lambda: centre(cca, z)):
            if f is None: continue
            r = f()
            if r is not None: return r[0] if isinstance(r, tuple) else r
        return None
    ctrl = []
    for z in np.arange(-50.0, 137.0, 12.0):
        a = artery(z); v = vein_at(z)
        if a is None or np.isnan(v).any(): continue
        ctrl.append(np.array([(a[0] + v[0]) / 2, max(a[1], v[1]) + 4.5, z]))
    ctrl = settle(np.array(ctrl), free, [1.9] * len(ctrl), reach=8, step=0.5)
    P = catmull(ctrl, 6); V, F = tube(P, 1.25, 12); add_gen('Vagus nerve', 'nerve', 'carotid', V, F, 'vag' + S)
    # ── sympathetic trunk: on the prevertebral fascia, behind the sheath, with its middle ganglion near C6
    lc = [m for m in real if re.search('longus', m['raw']) and m['side'] == side]
    LC = np.concatenate([m['V'][np.unique(m['F'])] for m in lc])
    ctrl = []
    for z in np.arange(-50.0, 101.0, 12.0):
        s = LC[(np.abs(LC[:, 2] - z) < 2.5) & (np.abs(LC[:, 0] - side * 19) < 5)]
        y = s[:, 1].min() - 1.6 if len(s) else 0.0
        ctrl.append(np.array([side * 19.0, y, z]))
    ctrl = settle(np.array(ctrl), free, [1.5] * len(ctrl), reach=7, step=0.5)
    P = catmull(ctrl, 6); R = 0.95 + 1.1 * np.exp(-((P[:, 2] - 2) / 5.5) ** 2) + 1.3 * np.exp(-((P[:, 2] - 86) / 12) ** 2)
    V, F = tube(P, R, 12); add_gen('Sympathetic trunk', 'nerve', 'carotid', V, F, 'sym' + S)
    ANCH['sym' + S] = P[np.argmin(np.abs(P[:, 2] - 2))].tolist()
    # ── ansa cervicalis: a loop lying in the front wall of the sheath
    ctrl = []
    for z in (60.0, 40.0, 20.0, 4.0, -10.0):
        a = artery(z); r = rc * 1.15 if z < 46 else ri
        ctrl.append(np.array([a[0], a[1] - r - 1.8, z]))
    a = art_at(-17); v = vein_at(-17)
    ctrl.append(np.array([(a[0] + v[0]) / 2, min(a[1], v[1]) - rc - 1.2, -18.0]))
    for z in (-10.0, 6.0, 24.0, 42.0):
        v = vein_at(z); ctrl.append(np.array([v[0], v[1] - rj * 1.15 - 1.6, z]))
    P = catmull(np.array(ctrl), 6); V, F = tube(P, 0.75, 10); add_gen('Ansa cervicalis', 'nerve', 'carotid', V, F, 'ans' + S)
    ANCH['ansa' + S] = ctrl[4].tolist()
    # ── deep cervical lymph nodes along the vein
    free = OB.tree([])
    for z, r in ((-28.0, 3.2), (-6.0, 3.8), (12.0, 3.4), (40.0, 4.6)):
        v = vein_at(z); c0 = np.array([v[0] + side * 5.5, v[1] - 3.5, z])
        c0 = settle(np.array([c0]), free, [2.6], reach=7, step=0.5)[0]
        V, F = blob(c0, np.array([r, r * 0.75, r * 1.3]), free, need=0.6, sub=2)
        add_gen('Deep cervical lymph node', 'node', 'carotid', V, F, 'ln' + S)
    ANCH['node' + S] = vein_at(-6).tolist()

# ───────── pretracheal: the thyroid gland ─────────
free = OB.tree([])
tr = [m for m in real if m['raw'] == 'trachea'][0]
for side in (-1, 1):
    S = 'R' if side < 0 else 'L'
    c0 = settle(np.array([[side * 15.5, -9.0, -14.0]]), free, [3.0], reach=6, step=0.5)[0]
    def pear(D, T):
        T = T.copy(); low = D[:, 2] < 0; T[low, :2] *= 1.0 + 0.25 * (-D[low, 2])[:, None]; return T
    V, F = blob(c0, np.array([9.0, 10.0, 27.0]), free, need=0.7, sub=4, shape=pear)
    add_gen('Thyroid gland', 'thyroid', 'pretracheal', V, F, 'thy' + S)
    ANCH['thy' + S] = c0.tolist()
free = OB.tree([])
tc = centre(tr, -12)[0]
ist = settle(np.array([[tc[0], tc[1] - 13.0, -12.0]]), free, [2.0], reach=5, step=0.5)[0]
V, F = blob(ist, np.array([13.0, 4.0, 6.5]), free, need=0.5, sub=4)
add_gen('Thyroid gland', 'thyroid', 'pretracheal', V, F, 'thyI')
ANCH['isthmus'] = ist.tolist()

# ───────── prevertebral: the spinal cord in its canal, phrenic nerves, plexus roots ─────────
verts = [m for m in real if m['k'] == 'bone']
VB = np.concatenate([m['V'][np.unique(m['F'])] for m in verts])
freeB = Free(np.concatenate([m['V'] for m in verts]), np.concatenate([vnormals(m['V'], m['F']) for m in verts]))
ctrl = []
for z in np.arange(-56.0, 31.0, 8.0):
    g = np.array([[x, y, z] for x in np.arange(-4, 4.1, 1.0) for y in np.arange(12, 50, 1.0)])
    c = freeB.clearance(g); ctrl.append(g[np.argmax(c)])
ctrl = np.array(ctrl); ctrl[:, 0] = 0.0
for _ in range(2): ctrl[1:-1] = 0.25 * ctrl[:-2] + 0.5 * ctrl[1:-1] + 0.25 * ctrl[2:]
P = catmull(ctrl, 6)
V, F = tube(P, 4.3, 22, ell=(1.45, 1.0)); add_gen('Spinal cord', 'cord', 'prevertebral', V, F, 'cord')
ANCH['cord'] = P[np.argmin(np.abs(P[:, 2] - ST))].tolist()
free = OB.tree([])
for side in (-1, 1):
    S = 'R' if side < 0 else 'L'
    sa = find('scalenus anterior', side); A = sa['V'][np.unique(sa['F'])]
    ctrl = []
    for z in np.arange(30.0, -60.0, -10.0):
        s = A[np.abs(A[:, 2] - z) < 2.5]
        if len(s) < 5: continue
        cx = s[:, 0].mean(); s2 = s[np.abs(s[:, 0] - cx) < 3]
        ctrl.append(np.array([cx, s2[:, 1].min() - 1.5, z]))
    ctrl = settle(np.array(ctrl), free, [1.3] * len(ctrl), reach=5, step=0.5)
    P = catmull(ctrl, 6); V, F = tube(P, 0.9, 10); add_gen('Phrenic nerve', 'nerve', 'prevertebral', V, F, 'phr' + S)
    for zr in (18.0, 4.0, -10.0, -24.0):
        ctrl = np.array([[side * 24.0, 10.0, zr], [side * 36.0, 8.5, zr - 7], [side * 52.0, 9.0, zr - 18], [side * 72.0, 11.0, zr - 34]])
        ctrl = settle(ctrl, free, [2.2] * 4, reach=5, step=0.5)
        P = catmull(ctrl, 8); V, F = tube(P, 2.0, 12); add_gen('Roots of the brachial plexus', 'nerve', 'prevertebral', V, F, 'bp' + S)
    ANCH['plexus' + S] = [side * 56.0, 9.0, -6.0]

# ───────── superficial: external jugular veins; investing: accessory nerves ─────────
free = OB.tree([])
for side in (-1, 1):
    S = 'R' if side < 0 else 'L'
    scm = find('sternocleidomastoid', side); A = scm['V'][np.unique(scm['F'])]; NA = vnormals(scm['V'], scm['F'])[np.unique(scm['F'])]
    ctrl = []
    for z in np.arange(60.0, -55.0, -10.0):
        s = np.abs(A[:, 2] - z) < 2.5
        if s.sum() < 5: continue
        k = (60 - z) / 115; d = np.array([side * (0.25 + 0.7 * k), -(0.95 - 0.6 * k), 0]); d /= np.linalg.norm(d)
        j = np.argmax(A[s] @ d); ctrl.append(A[s][j] + NA[s][j] * 3.4)
    ctrl = settle(np.array(ctrl), free, [2.4] * len(ctrl), reach=4, step=0.5)
    P = catmull(ctrl, 6); V, F = tube(P, 2.1, 14); add_gen('External jugular vein', 'vein', 'superficial', V, F, 'ejv' + S)
    ANCH['ejv' + S] = P[np.argmin(np.abs(P[:, 2] - ST))].tolist()
    # accessory nerve: from behind the sternomastoid, across the posterior triangle to the trapezius
    tz = find('trapezius', side); T = tz['V'][np.unique(tz['F'])]
    sA = A[np.abs(A[:, 2] - 36) < 2.5]; p0 = sA[np.argmax(sA[:, 1])] + [0, 2.5, 0]
    tA = T[(np.abs(T[:, 2] + 30) < 3)]; p2 = tA[np.argmin(tA[:, 1] - 0.3 * side * tA[:, 0])] + [0, -2.0, 0]
    p1 = (p0 + p2) / 2 + [side * 6, 2, 0]
    ctrl = settle(np.array([p0, (p0 + p1) / 2, p1, (p1 + p2) / 2, p2]), free, [1.4] * 5, reach=6, step=0.5)
    P = catmull(ctrl, 8); V, F = tube(P, 1.0, 10); add_gen('Accessory nerve', 'nerve', 'investing', V, F, 'acc' + S)
    ANCH['acc' + S] = P[np.argmin(np.abs(P[:, 2] - ST))].tolist()

# ───────── fascial sleeves: traced around their contents, slice by slice ─────────
NA_ = 96
ANG = np.linspace(-np.pi, np.pi, NA_, endpoint=False)


def polar_ring(pts, c, off):
    d = pts[:, :2] - c; a = np.arctan2(d[:, 1], d[:, 0]); r = np.hypot(d[:, 0], d[:, 1])
    b = ((a + np.pi) / (2 * np.pi) * NA_).astype(int) % NA_
    R = np.full(NA_, np.nan)
    for i in range(NA_):
        s = r[b == i]
        if len(s): R[i] = s.max()
    ok = ~np.isnan(R)
    if ok.sum() < 3: return None
    idx = np.arange(NA_); R = np.interp(idx, np.concatenate([idx[ok] - NA_, idx[ok], idx[ok] + NA_]), np.tile(R[ok], 3))
    for _ in range(3): R = np.maximum(R, 0.25 * np.roll(R, 1) + 0.5 * R + 0.25 * np.roll(R, -1))   # round off, never cut in
    for _ in range(2): R = 0.25 * np.roll(R, 1) + 0.5 * R + 0.25 * np.roll(R, -1)
    return R + off


def cloud(members):
    return np.concatenate([m['V'][np.unique(m['F'])] for m in members])


def sleeve(members, z0, z1, off, dz=2.0):
    P = cloud(members); zs = np.arange(z0, z1 + 1e-6, dz); rings, cs = [], []
    for z in zs:
        s = P[np.abs(P[:, 2] - z) < 2.0]
        if len(s) < 10: rings.append(None); cs.append(None); continue
        c = 0.5 * (s[:, :2].min(axis=0) + s[:, :2].max(axis=0)); cs.append(c); rings.append(polar_ring(s, c, off))
    good = [i for i, r in enumerate(rings) if r is not None]
    for i in range(len(zs)):
        if rings[i] is None: j = min(good, key=lambda g: abs(g - i)); rings[i], cs[i] = rings[j], cs[j]
    R = np.array(rings); C = np.array(cs)
    for _ in range(3):
        R[1:-1] = 0.25 * R[:-2] + 0.5 * R[1:-1] + 0.25 * R[2:]; C[1:-1] = 0.25 * C[:-2] + 0.5 * C[1:-1] + 0.25 * C[2:]
    XY = C[:, None, :] + R[:, :, None] * np.stack([np.cos(ANG), np.sin(ANG)], 1)[None]
    return dict(z0=float(zs[0]), dz=dz, n=NA_, xy=XY)


allm = real + gen
L = lambda *ls: [m for m in allm if m['l'] in ls]
lo, hi = SB - 7, ST + 7
SLEEVES = {
    'skin': sleeve(allm, lo, hi, 3.4),
    'superficial': sleeve(allm, lo, hi, 1.9),
    'investing': sleeve([m for m in allm if m['l'] != 'superficial'], lo, hi, 1.4),
    'pretracheal': sleeve([m for m in allm if m['l'] == 'pretracheal' and not re.search('Omohyoid', m['n'])], lo, hi, 1.3),
    'prevertebral': sleeve([m for m in allm if m['l'] == 'prevertebral' and m['n'] not in ('Roots of the brachial plexus',)], lo, hi, 1.3),
}
for side in (-1, 1):
    S = 'R' if side < 0 else 'L'
    mem = [g for g in gen if g.get('tag') in ('cca' + S, 'ijv' + S, 'vag' + S)] + [m for m in real if m['l'] == 'carotid' and m['side'] == side]
    SLEEVES['carotid' + S] = sleeve(mem, lo, 140, 1.4)

# ───────── cut faces: the tissue between the structures, layer by layer ─────────
from shapely.geometry import Polygon, LineString, MultiPolygon
from shapely.ops import polygonize, unary_union


def section(V, F, z):
    T = V[F]; s = T[:, :, 2] - z; cross = ~((s > 0).all(1) | (s < 0).all(1)); lines = []
    for t, ss in zip(T[cross], s[cross]):
        pts = []
        for a, b in ((0, 1), (1, 2), (2, 0)):
            if (ss[a] > 0) != (ss[b] > 0):
                lo, hi = (a, b) if tuple(t[a]) < tuple(t[b]) else (b, a)     # same edge, same point, from either side
                u = ss[lo] / (ss[lo] - ss[hi]); p = t[lo] + u * (t[hi] - t[lo]); pts.append((round(p[0], 3), round(p[1], 3)))
        if len(pts) == 2 and pts[0] != pts[1]: lines.append(LineString(pts))
    if not lines: return None
    faces = list(polygonize(lines))
    if not faces: return None
    return unary_union([Polygon(f.exterior) for f in faces]).buffer(0)


def ring_poly(key, z):
    v = SLEEVES[key]; f = (z - v['z0']) / v['dz']; i = int(np.floor(f)); u = f - i
    r = v['xy'][i] * (1 - u) + v['xy'][min(i + 1, len(v['xy']) - 1)] * u
    return Polygon(r).buffer(0)


def polys_out(g):
    if g.is_empty: return []
    out = []
    for p in (g.geoms if hasattr(g, 'geoms') else [g]):
        if not isinstance(p, Polygon) or p.area < 2.0: continue
        p = p.simplify(0.12)
        out.append([np.array(p.exterior.coords[:-1])] + [np.array(h.coords[:-1]) for h in p.interiors if Polygon(h).area > 0.5])
    return out


FILLS = {}
GAP = 0.55
for z in (SB, ST):
    secs = [section(m['V'], m['F'], z) for m in allm]
    secs = [p for p in secs if p is not None and not p.is_empty]
    solid = unary_union(secs)
    car = unary_union([ring_poly('carotidR', z), ring_poly('carotidL', z)])
    pre, pv, inv, sup, skin = (ring_poly(k, z) for k in ('pretracheal', 'prevertebral', 'investing', 'superficial', 'skin'))
    regions = {
        'carotid': car.buffer(-0.3),
        'pretracheal': pre.buffer(-0.3).difference(car.buffer(GAP)),
        'prevertebral': pv.buffer(-0.3).difference(car.buffer(GAP)).difference(pre.buffer(GAP)),
        'investing': inv.buffer(-0.3).difference(unary_union([car, pre, pv]).buffer(GAP)),
        'superficial': sup.buffer(-0.3).difference(inv.buffer(GAP)),
        'skin': skin.buffer(-0.2).difference(sup.buffer(0.35)),
    }
    if z == ST:   # the laryngeal airway, a slit behind the thyroid laminae
        th = [m for m in real if m['raw'] == 'thyroid cartilage'][0]; hs = section(th['V'], th['F'], z)
        if hs is not None:
            c = hs.convex_hull.centroid; from shapely import affinity
            airway = affinity.scale(Polygon([(np.cos(a), np.sin(a)) for a in np.linspace(0, 2 * np.pi, 40, endpoint=False)]), 3.2, 7.5, origin=(0, 0))
            regions['pretracheal'] = regions['pretracheal'].difference(affinity.translate(airway, c.x, c.y + 2.5))
    for k, reg in regions.items():
        FILLS.setdefault(k, {})['top' if z == ST else 'bot'] = polys_out(reg.difference(solid))
    print('cut at', z, {k: round(r.difference(solid).area) for k, r in regions.items()}, 'solid', round(solid.area))

# ───────── pack ─────────
def b64(a, fmt): return base64.b64encode(np.asarray(a).astype(fmt).tobytes()).decode()


def crop(V, F, zlo, zhi):
    keep = ((V[F][:, :, 2] >= zlo) & (V[F][:, :, 2] <= zhi)).any(axis=1); F = F[keep]
    used = np.unique(F); remap = -np.ones(len(V), int); remap[used] = np.arange(len(used))
    return V[used], remap[F]


meshes = []; tv = tt = 0
for m in real + gen:
    tall = m['l'] == 'carotid'
    V, F = crop(m['V'], m['F'], SB - 12, (150 if tall else ST + 12))
    if not len(F): continue
    if len(V) > 65535: raise SystemExit('too many vertices in ' + m['n'])
    meshes.append(dict(n=m['n'], k=m['k'], l=m['l'], r=1 if m['id'] >= 1000 else 0, p=b64(np.round(V * 10), '<i2'), i=b64(F.ravel(), '<u2')))
    tv += len(V); tt += len(F)
sl = {k: dict(z0=v['z0'], dz=v['dz'], n=v['n'], rows=len(v['xy']), p=b64(np.round(v['xy'] * 10).ravel(), '<i2')) for k, v in SLEEVES.items()}
fl = {k: {e: [[b64(np.round(ring * 10).ravel(), '<i2') for ring in poly] for poly in v[e]] for e in v} for k, v in FILLS.items()}
json.dump(dict(slab=[SB, ST], meshes=meshes, sleeves=sl, fills=fl, anchors={k: [round(x, 1) for x in v] for k, v in ANCH.items()}), open(OUT, 'w'), separators=(',', ':'))
print(len(meshes), 'meshes', tv, 'verts', tt, 'tris', os.path.getsize(OUT) // 1024, 'KB; rebuilt:', len(gen))
