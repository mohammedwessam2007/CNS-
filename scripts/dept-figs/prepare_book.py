"""Extract the Kasr Al Ainy NEU 205 book figures that map.json uses into an output folder.

Usage: python scripts/dept-figs/prepare_book.py <folder with the book PDFs> <out_dir>   (needs pymupdf + pillow)
The owner's book comes as "205_NEU_Labeled_Drawings_and_Pictures_Part_*.pdf": one figure per page, headed
"Figure N / Source PDF page P" (N counts the figures of 205_NEU_Published.pdf). Each figure used here is that
page's embedded image, trimmed of white margins and scaled to at most 1400 px on its long side (as prepare.py
does), then cut as map.json says: "crop" [top, bottom, left, right] fractions to remove, "fill" boxes
[x0, y0, x1, y1] (fractions) painted white over stray text from a neighbouring page, "rot" degrees
counter-clockwise for figures printed sideways. Plain JPEGs are written OUTSIDE the repo; only the encrypted
copies made by encrypt.mjs are committed. The PDFs are not in the repo either.
"""
import glob, io, json, os, re, sys
import pymupdf
from PIL import Image, ImageChops, ImageDraw

MAX = 1400


def trim(im):
    bg = Image.new("RGB", im.size, (255, 255, 255))
    box = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 24 else 0).getbbox()
    if not box:
        return im
    l, t, r, b = box
    pad = 12
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def pages(folder):
    """figure number -> (document, page index), from each page's own "Figure N" heading"""
    at = {}
    for path in sorted(glob.glob(os.path.join(folder, "*205_NEU*Part*.pdf"))):
        doc = pymupdf.open(path)
        for i in range(doc.page_count):
            m = re.match(r"\s*Figure (\d+)\b", doc[i].get_text())
            if m and doc[i].get_images():
                at[int(m.group(1))] = (doc, i)
    return at


def figure(doc, i):
    xref = doc[i].get_images()[0][0]
    return Image.open(io.BytesIO(doc.extract_image(xref)["image"])).convert("RGB")


def main(folder, out):
    os.makedirs(out, exist_ok=True)
    m = json.load(open(os.path.join(os.path.dirname(__file__), "map.json"), encoding="utf8"))
    at = pages(folder)
    for f in m["figs"]:
        if "book" not in f:
            continue
        if f["book"] not in at:
            sys.exit("figure %d is not in the PDFs in %s" % (f["book"], folder))
        im = trim(figure(*at[f["book"]]))
        if max(im.size) > MAX:
            k = MAX / max(im.size)
            im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        if "crop" in f:
            t, b, l, r = f["crop"]
            im = im.crop((round(l * im.width), round(t * im.height), round(im.width * (1 - r)), round(im.height * (1 - b))))
        for x0, y0, x1, y1 in f.get("fill", []):
            ImageDraw.Draw(im).rectangle((x0 * im.width, y0 * im.height, x1 * im.width, y1 * im.height), fill="white")
        if f.get("rot"):
            im = im.rotate(f["rot"], expand=True)
        im.save(os.path.join(out, f["id"] + ".jpg"), quality=82, optimize=True, progressive=True)
        print(f["id"], im.size, os.path.getsize(os.path.join(out, f["id"] + ".jpg")) // 1024, "KB")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
