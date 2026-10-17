"""Build the Great Books Hour texts (owner, 17 Oct 2026: "1 hour a day ... genuinely world class").

Reads public-domain Project Gutenberg plain-text files (folder given as argv[1]), keeps only the work itself
(no Gutenberg header/licence, no editor's introduction or appendix), splits it into chapters and then into
daily sittings of about 9,000-11,000 words (about 50-60 minutes at a calm reading pace), always at a chapter
boundary unless one chapter is too long. Writes source/public/books/<id>.json and prints a summary.
The Project Gutenberg name and licence are removed, as its licence allows for public-domain texts."""
import json, re, sys, os

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "source", "public", "books")
os.makedirs(OUT, exist_ok=True)

ROMAN = r"[IVXLC]+"
BOOKS = [
    # id, file, title, author, translator, start marker (line regex), end marker, heading regex
    ("underground", "600.txt", "Notes from Underground", "Fyodor Dostoevsky", "Constance Garnett",
     r"^PART I$", r"^\*\*\* END OF", rf"^(PART {ROMAN}|{ROMAN}|[IVX]+\. .*|Apropos of the Wet Snow|Underground)$"),
    ("apology", "1656.txt", "The Apology of Socrates", "Plato", "Benjamin Jowett",
     r"^APOLOGY$", r"^\*\*\* END OF", r"^$^"),
    ("phaedo", "1658.txt", "Phaedo", "Plato", "Benjamin Jowett",
     r"^PERSONS OF THE DIALOGUE", r"^\*\*\* END OF", r"^$^"),
    ("meditations", "15877.txt", "Meditations", "Marcus Aurelius", "George Long",
     r"^I\.$", r"^INDEXES\.$", rf"^{ROMAN}\.$"),
    ("zarathustra", "1998.txt", "Thus Spake Zarathustra", "Friedrich Nietzsche", "Thomas Common",
     r"^FIRST PART\. ZARATHUSTRA", r"^APPENDIX\.$", rf"^((FIRST|SECOND|THIRD|FOURTH AND LAST) PART.*|ZARATHUSTRA’S PROLOGUE\.|{ROMAN}\. [A-Z].*)$"),
    ("crime", "2554.txt", "Crime and Punishment", "Fyodor Dostoevsky", "Constance Garnett",
     r"^PART I$", r"^\*\*\* END OF", rf"^(PART {ROMAN}|CHAPTER {ROMAN}|EPILOGUE)$"),
    ("karamazov", "28054.txt", "The Brothers Karamazov", "Fyodor Dostoevsky", "Constance Garnett",
     r"^PART I$", r"^FOOTNOTES$", rf"^(PART {ROMAN}|Book {ROMAN}\..*|Chapter {ROMAN}\..*|Epilogue|EPILOGUE)$"),
    ("anna", "1399.txt", "Anna Karenina", "Leo Tolstoy", "Constance Garnett",
     r"^PART ONE$", r"^\*\*\* END OF", r"^(PART [A-Z]+|Chapter \d+)$"),
]
LO, HI = 8500, 12500

def blocks(lines):
    out, cur = [], []
    for ln in lines + [""]:
        if ln.strip() == "":
            if cur:
                out.append(cur)
                cur = []
        else:
            cur.append(ln)
    return out

def build(bid, fn, title, author, tr, start, end, head):
    raw = open(os.path.join(SRC, fn), encoding="utf-8").read().replace("\r", "")
    lines = raw.split("\n")
    i0 = next(i for i, l in enumerate(lines) if re.match(start, l))
    i1 = next(i for i, l in enumerate(lines) if i > i0 and re.match(end, l.strip()))
    chapters, cur = [], {"h": "", "p": []}
    for b in blocks(lines[i0:i1]):
        first = b[0].strip()
        if all(re.match(head, x.strip()) for x in b) and len(b) > 2:  # a table of contents
            continue
        if len(b) <= 2 and re.match(head, first) and (len(b) == 1 or len(b[1].split()) <= 12):
            h = " · ".join(x.strip() for x in b)
            if cur["p"]:
                chapters.append(cur)
                cur = {"h": h, "p": []}
            else:
                cur["h"] = (cur["h"] + " · " + h).strip(" ·")
            continue
        if b[0].startswith("    [") or re.match(r"^\[[A-Z0-9]+\]", first):  # editor's footnotes
            continue
        txt = " ".join(x.strip() for x in b)
        txt = re.sub(r"\[[A-Z]\]", "", txt)  # footnote markers
        txt = re.sub(r"_([^_]+)_", r"\1", txt)  # Gutenberg italics markers
        if re.fullmatch(r"[*\s.]+", txt):
            continue
        cur["p"].append(txt)
    if cur["p"]:
        chapters.append(cur)
    wc = lambda ps: sum(len(p.split()) for p in ps if isinstance(p, str))
    sittings, s = [], {"heads": [], "p": []}
    def close():
        nonlocal s
        if s["p"]:
            sittings.append(s)
        s = {"heads": [], "p": []}
    for ch in chapters:
        n = wc(ch["p"])
        if wc(s["p"]) and wc(s["p"]) + n > HI:
            close()
        if n > HI:  # one long chapter: split by paragraphs
            part = []
            for p in ch["p"]:
                part.append(p)
                if wc(part) >= 10000:
                    first = not any(ch["h"] in x["heads"] for x in sittings)
                    s["heads"].append(ch["h"]); s["p"].append({"h": ch["h"] + ("" if first else " (continued)")}); s["p"].extend(part); part = []; close()
            if part:
                s["heads"].append(ch["h"]); s["p"].append({"h": ch["h"] + " (continued)"}); s["p"].extend(part)
        else:
            s["heads"].append(ch["h"]); s["p"].append({"h": ch["h"]}); s["p"].extend(ch["p"])
        if wc([x for x in s["p"] if isinstance(x, str)]) >= LO:
            close()
    close()
    # a short tail joins the previous sitting
    if len(sittings) > 1 and wc([x for x in sittings[-1]["p"] if isinstance(x, str)]) < 3500:
        sittings[-2]["p"] += sittings[-1]["p"]; sittings[-2]["heads"] += sittings[-1]["heads"]; sittings.pop()
    out = {"id": bid, "title": title, "author": author, "translator": tr, "source": "Project Gutenberg (public domain)",
           "sittings": [{"n": k + 1, "from": (x["heads"] or [""])[0], "to": (x["heads"] or [""])[-1],
                         "words": wc([p for p in x["p"] if isinstance(p, str)]),
                         "body": [p if isinstance(p, str) else "## " + p["h"] for p in x["p"] if isinstance(p, str) or p["h"]]}
                        for k, x in enumerate(sittings)]}
    json.dump(out, open(os.path.join(OUT, bid + ".json"), "w"), ensure_ascii=False, separators=(",", ":"))
    ws = [x["words"] for x in out["sittings"]]
    print(f"{bid:12} chapters={len(chapters):4} sittings={len(ws):3} words={sum(ws):7} min/max={min(ws)}/{max(ws)} first='{out['sittings'][0]['body'][0][:50]}'")

for b in BOOKS:
    build(*b)
