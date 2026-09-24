"""Crop the mapped department drawings out of the owner's PDFs (repo root) into an output folder.

Usage: python scripts/dept-figs/prepare.py <out_dir>   (needs pypdf + pillow)
Each figure is the PDF's own embedded image (full resolution), trimmed of white margins and
scaled to at most 1400 px on its long side. Plain JPEGs are written OUTSIDE the repo; only the
encrypted copies made by encrypt.mjs are committed.
"""
import io, json, os, sys
import pypdf
from PIL import Image, ImageChops

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MAX = 1400


def trim(im):
    bg = Image.new("RGB", im.size, (255, 255, 255))
    box = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 24 else 0).getbbox()
    if not box:
        return im
    l, t, r, b = box
    pad = 12
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def main(out):
    os.makedirs(out, exist_ok=True)
    m = json.load(open(os.path.join(os.path.dirname(__file__), "map.json"), encoding="utf8"))
    readers = {}
    for f in m["figs"]:
        r = readers.get(f["pdf"]) or readers.setdefault(f["pdf"], pypdf.PdfReader(os.path.join(ROOT, f["pdf"])))
        if "img" in f:
            page, idx = f["img"][1:].split("_")
            im = Image.open(io.BytesIO(r.pages[int(page) - 1].images[int(idx)].data)).convert("RGB")
        elif "boxf" in f:
            # a figure inside a photographed page: box given as fractions of that image
            ph = Image.open(io.BytesIO(r.pages[f["page"] - 1].images[f.get("imgIndex", 0)].data)).convert("RGB")
            x0, y0, x1, y1 = f["boxf"]
            im = ph.crop((int(x0 * ph.width), int(y0 * ph.height), int(x1 * ph.width), int(y1 * ph.height)))
        else:
            # a figure on a scanned page: the band between its title and its table (300-dpi scan pixels)
            scan = Image.open(io.BytesIO(r.pages[f["page"] - 1].images[0].data)).convert("RGB")
            im = scan.crop((0, f["y"][0], scan.width, f["y"][1]))
        im = trim(im)
        if max(im.size) > MAX:
            k = MAX / max(im.size)
            im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        im.save(os.path.join(out, f["id"] + ".jpg"), quality=82, optimize=True, progressive=True)
        print(f["id"], im.size, os.path.getsize(os.path.join(out, f["id"] + ".jpg")) // 1024, "KB")


if __name__ == "__main__":
    main(sys.argv[1])
