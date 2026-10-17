"""New translations made for this app from the public-domain originals (owner, 17 Oct 2026: "the Constance
Garnett translations are awful"). Each scripts/library/fresh/<book>-<sitting>[a-z].txt holds one sitting's text
(parts are joined in name order): paragraphs separated by blank lines, "## " headings, "> " quoted verse lines with
a "— source" line. Writes source/public/books/<book>.fresh.json, which the reader uses in place of the old text.
Originals: Russian Wikisource (public domain)."""
import glob, json, os, re
from collections import defaultdict
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "..", "source", "public", "books")
SOURCES = {"karamazov": "Братья Карамазовы (1880)", "ridiculous": "Сон смешного человека (1877)", "underground": "Записки из подполья (1864)"}
parts = defaultdict(list)
for f in sorted(glob.glob(os.path.join(HERE, "fresh", "*.txt"))):
    m = re.match(r"([a-z]+)-(\d+)[a-z]?\.txt$", os.path.basename(f))
    if m:
        parts[(m.group(1), int(m.group(2)))].append(f)
books = defaultdict(dict)
for (book, n), files in sorted(parts.items()):
    text = "\n\n".join(open(f, encoding="utf-8").read().strip() for f in sorted(files))
    body = [re.sub(r"\s*\n\s*", " ", p.strip()) if not p.lstrip().startswith(">") else "\n".join(l.strip() for l in p.strip().split("\n")) for p in re.split(r"\n\s*\n", text) if p.strip()]
    words = sum(len(p.split()) for p in body if not p.startswith("## "))
    books[book][str(n)] = {"words": words, "body": body}
for book, sits in books.items():
    out = {"id": book, "translator": "a new translation made for this app from the Russian original", "original": SOURCES.get(book, ""), "sittings": sits}
    json.dump(out, open(os.path.join(OUT, book + ".fresh.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    print(book, {k: v["words"] for k, v in sits.items()})
