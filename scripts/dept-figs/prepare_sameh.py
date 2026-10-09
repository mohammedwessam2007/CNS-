"""Cut Dr Sameh Doss's labelled drawings out of the owner's notebook-page PDFs.

Usage: python scripts/dept-figs/prepare_sameh.py <folder with the three Sameh_Doss_Labels_Preserved_*.pdf> <out_dir>
Needs pymupdf, pillow, numpy, opencv-python-headless and the tesseract binary (5.x). The PDFs are not in the repo.

The three parts are scanned collages: every embedded image is one full page of Dr Doss's handwritten head-and-neck and
neuroanatomy notes (about 1200 x 1700 px), and the same page often appears in more than one part. The DISTINCT page
images are numbered 1..283 in the order each first appears (distinct = identical image bytes); map.json's "sameh" is
that number. Each map.json entry with a "sameh" page and a "box" [x0, y0, x1, y1] (percent of the page) is one drawing:
  1. the page is flattened (grey scan background divided out) when it is not already white,
  2. long lines of recognised handwriting that run through the box are whitened (tesseract word boxes, 1600 px render,
     psm 11) so a paragraph beside a drawing does not come along; labels on the drawing are left alone,
  3. the box (plus 2.6 percent of margin) is cut out and trimmed to its ink, auto-contrasted, scaled to at most
     1100 x 1300 px and saved as a plain JPEG <id>.jpg (colour plates are kept in colour).
The boxes were drawn by looking at every page; their result was checked on contact sheets of all the crops.
"""
import csv, glob, hashlib, os, re, subprocess, sys, tempfile
import json
import cv2
import numpy as np
import pymupdf
from PIL import Image, ImageOps

MAXW, MAXH, PAD, OCRW = 1100, 1300, 2.6, 1600


def distinct_pages(folder):
    files = sorted(glob.glob(os.path.join(folder, "*Sameh*Part*.pdf")), key=lambda p: int(re.search(r"pages_(\d+)", p).group(1)))
    if len(files) != 3:
        sys.exit("expected the three Sameh_Doss_Labels_Preserved part PDFs in " + folder)
    seen, pages = {}, []
    for f in files:
        doc = pymupdf.open(f)
        for page in doc:
            for im in page.get_images(full=True):
                d = doc.extract_image(im[0])
                h = hashlib.md5(d["image"]).hexdigest()
                if h not in seen:
                    seen[h] = len(pages) + 1
                    pages.append(Image.open(__import__("io").BytesIO(d["image"])).convert("RGB"))
    return pages


def ocr_lines(im, scale, n=None):
    cache = os.environ.get("SAMEH_OCR_DIR")
    if cache and n and os.path.exists(os.path.join(cache, "p%03d.tsv" % n)):
        return read_lines(os.path.join(cache, "p%03d.tsv" % n), scale)
    g = im.convert("L")
    h = round(g.height * OCRW / g.width)
    with tempfile.TemporaryDirectory() as td:
        png = os.path.join(td, "p.png")
        g.resize((OCRW, h), Image.LANCZOS).save(png)
        env = dict(os.environ, OMP_THREAD_LIMIT="1")
        subprocess.run(["tesseract", png, os.path.join(td, "p"), "--psm", "11", "tsv"], check=True, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return read_lines(os.path.join(td, "p.tsv"), scale)


def read_lines(tsv, scale):
    """OCR word boxes grouped into lines: bounding box, word count, mean confidence, letters"""
    if True:
        out = {}
        for r in csv.reader(open(tsv, encoding="utf8"), delimiter="\t", quoting=csv.QUOTE_NONE):
            if len(r) < 12 or r[0] != "5" or not r[11].strip():
                continue
            try:
                l, t, w, hh = [float(v) * scale for v in r[6:10]]
                c = float(r[10])
            except ValueError:
                continue
            d = out.setdefault((r[2], r[3], r[4]), dict(x0=l, y0=t, x1=l + w, y1=t + hh, n=0, conf=0.0, letters=0))
            d["x0"] = min(d["x0"], l); d["y0"] = min(d["y0"], t); d["x1"] = max(d["x1"], l + w); d["y1"] = max(d["y1"], t + hh)
            d["n"] += 1; d["conf"] += c; d["letters"] += sum(ch.isalpha() for ch in r[11])
    res = []
    for d in out.values():
        d["conf"] /= max(1, d["n"])
        res.append(d)
    return res


def whiten_text(im, lines, box, W):
    X0, Y0, X1, Y1 = box
    arr = np.asarray(im).copy()
    cw = X1 - X0
    for d in lines:
        hh = d["y1"] - d["y0"]
        if d["n"] < 3 or d["conf"] < 45 or d["letters"] < 10 or hh < 10 or hh > 110 / OCRW * W * 0.9 + 60:
            continue
        if d["x1"] < X0 or d["x0"] > X1 or d["y1"] < Y0 or d["y0"] > Y1:
            continue
        cut = d["x0"] < X0 - 6 or d["x1"] > X1 + 6
        long_ = d["n"] >= 6 and (d["x1"] - d["x0"]) >= 0.5 * cw
        if cut or long_:
            xa, xb = int(max(X0, d["x0"] - 3)), int(min(X1, d["x1"] + 3))
            ya, yb = int(max(Y0, d["y0"] - 2)), int(min(Y1, d["y1"] + 2))
            arr[ya:yb, xa:xb] = (255, 255, 255)
    return Image.fromarray(arr)


def clear_edges(crop):
    """A scrap of a neighbouring line that the crop's edge cuts (half a word, the tail of a heading) is removed: a small,
    line-high group of ink that touches the edge. Only those pixels are whitened, never a rectangle, so a drawing that
    runs off the edge keeps its strokes (they belong to a big group)."""
    rgb = np.asarray(crop.convert("RGB")).copy()
    g = np.asarray(crop.convert("L"))
    H, W = g.shape
    ink = (g < 160).astype(np.uint8)
    grp = cv2.dilate(ink, np.ones((5, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(grp, connectivity=8)
    for i in range(1, n):
        x, y, w, h, _ = st[i]
        edge = x <= 4 or y <= 4 or x + w >= W - 4 or y + h >= H - 4
        if edge and h <= max(40, min(70, 0.07 * H)) and w <= 0.6 * W:
            rgb[(lab == i) & (ink > 0)] = 255
    return Image.fromarray(rgb)


def colourful(im):
    """a drawing printed in colour (red arteries, blue veins): more than 1.5% of its pixels clearly coloured"""
    hsv = np.asarray(im.convert("HSV")).astype(int)
    return ((hsv[..., 1] > 90) & (hsv[..., 2] > 60)).mean() > 0.015


def main(folder, out):
    os.makedirs(out, exist_ok=True)
    m = json.load(open(os.path.join(os.path.dirname(__file__), "map.json"), encoding="utf8"))
    wanted = {}
    for f in m["figs"]:
        if "sameh" in f:
            wanted.setdefault(f["sameh"], []).append(f)
    pages = distinct_pages(folder)
    if len(pages) != 283:
        sys.exit("expected 283 distinct notebook pages, found %d" % len(pages))
    done = 0
    for n, figs in sorted(wanted.items()):
        im = pages[n - 1]
        W, H = im.size
        hsv = np.asarray(im.convert("HSV")).astype(int)
        colour = ((hsv[..., 1] > 90) & (hsv[..., 2] > 60)).mean() > 0.3  # a colour plate (a notes page with a coloured drawing is not)
        lines = [] if colour else ocr_lines(im, W / OCRW, n)
        orig = im
        if not colour:
            g0 = np.asarray(im.convert("L"))
            if np.median(g0) < 228:
                k = max(31, int(W * 0.07)) | 1
                bg = cv2.GaussianBlur(cv2.dilate(g0, np.ones((k, k), np.uint8)), (0, 0), k / 3)
                nrm = np.clip(g0.astype(np.float32) / np.maximum(bg.astype(np.float32), 1) * 255, 0, 255).astype(np.uint8)
                im = Image.fromarray(nrm).convert("RGB")
        for f in figs:
            x0, y0, x1, y1 = f["box"]
            pad = f.get("pad", PAD)  # a smaller margin where notes sit right against the drawing
            X0, X1 = max(0, int((x0 - pad) / 100 * W)), min(W, int((x1 + pad) / 100 * W))
            Y0, Y1 = max(0, int((y0 - pad) / 100 * H)), min(H, int((y1 + pad) / 100 * H))
            tint = colour or colourful(orig.crop((X0, Y0, X1, Y1)))  # a colour plate, or a coloured drawing on a notes page
            base = orig if tint else im
            src = base if colour else whiten_text(base, lines, (X0, Y0, X1, Y1), W)
            if f.get("fill"):
                arr = np.asarray(src).copy()
                for fx0, fy0, fx1, fy1 in f["fill"]:
                    arr[int(fy0 / 100 * H):int(fy1 / 100 * H), int(fx0 / 100 * W):int(fx1 / 100 * W)] = 255
                src = Image.fromarray(arr)
            crop = src.crop((X0, Y0, X1, Y1))
            if not colour:
                crop = clear_edges(crop)
                mk = (np.asarray(crop.convert("L")) < 150).astype(np.uint8)
                mk[:5, :] = 0; mk[-5:, :] = 0; mk[:, :5] = 0; mk[:, -5:] = 0
                mk = cv2.morphologyEx(mk, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
                # trim to the ink, but never through a label: only specks (a few pixels) are ignored, not the thin
                # strokes of a small label at the edge (a percentile cut shaved those off)
                n_, lab, st, _ = cv2.connectedComponentsWithStats(mk, connectivity=8)
                keep = np.isin(lab, [i for i in range(1, n_) if st[i][4] >= 12])
                ys, xs = np.where(keep)
                if len(xs) > 50:
                    tx0, tx1 = xs.min(), xs.max()
                    ty0, ty1 = ys.min(), ys.max()
                    mg = 14
                    crop = crop.crop((max(0, int(tx0) - mg), max(0, int(ty0) - mg), min(crop.width, int(tx1) + mg), min(crop.height, int(ty1) + mg)))
                crop = ImageOps.autocontrast(crop if tint else crop.convert("L"), cutoff=1)
            k = min(1.0, MAXW / crop.width, MAXH / crop.height)
            if k < 1.0:
                crop = crop.resize((max(1, int(crop.width * k)), max(1, int(crop.height * k))), Image.LANCZOS)
            crop.save(os.path.join(out, f["id"] + ".jpg"), quality=74, optimize=True, progressive=True)
            done += 1
    print("wrote", done, "Dr Sameh Doss drawings to", out)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
