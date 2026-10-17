"""New translations made for this app from the public-domain originals (owner, 17 Oct 2026: "the Constance
Garnett translations are awful"). Each scripts/library/fresh/<book>-<sitting>[a-z].txt holds one sitting's text
(parts are joined in name order): paragraphs separated by blank lines, "## " headings, "> " quoted verse lines with
a "— source" line. Writes source/public/books/<book>.fresh.json, which the reader uses in place of the old text.
Originals: Russian Wikisource, rvb.ru and ilibrary.ru, German Projekt Gutenberg-DE (all public domain)."""
import glob, json, os, re
from collections import defaultdict
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "..", "source", "public", "books")
SOURCES = {"karamazov": "Братья Карамазовы (1880)", "ridiculous": "Сон смешного человека (1877)", "underground": "Записки из подполья (1864)",
           "ivan": "Смерть Ивана Ильича (1886)", "howmuch": "Много ли человеку земли нужно (1886)", "ladydog": "Дама с собачкой (1899)",
           "zarathustra": "Also sprach Zarathustra (1883)", "overcoat": "Шинель (1842)"}
LANG = {"zarathustra": "German"}
# v18.13: books with no older public-domain English text in the app are written out whole as <book>.json
OWN = {"ivan": ("The Death of Ivan Ilyich", "Leo Tolstoy"), "howmuch": ("How Much Land Does a Man Need?", "Leo Tolstoy")}
# where each sitting starts and ends (shown under the title)
SPAN = {"ivan": {1: ("I", "IV"), 2: ("V", "XII")}, "howmuch": {1: ("I", "IX")}}
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
    tr = "a new translation made for this app from the " + LANG.get(book, "Russian") + " original"
    if book in OWN:
        title, author = OWN[book]
        out = {"verse": False, "id": book, "title": title, "author": author, "translator": tr, "source": SOURCES[book] + ", public domain",
               "sittings": [dict(n=int(n), **{"from": SPAN[book][int(n)][0], "to": SPAN[book][int(n)][1]}, words=s["words"], body=s["body"]) for n, s in sorted(sits.items(), key=lambda x: int(x[0]))]}
        json.dump(out, open(os.path.join(OUT, book + ".json"), "w"), ensure_ascii=False, separators=(",", ":"))
    else:
        out = {"id": book, "translator": tr, "language": LANG.get(book, "Russian"), "original": SOURCES.get(book, ""), "sittings": sits}
        json.dump(out, open(os.path.join(OUT, book + ".fresh.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    print(book, {k: v["words"] for k, v in sits.items()})
