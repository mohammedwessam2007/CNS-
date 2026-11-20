"""Builds source/public/git206-ostx.js + fig/ostx/*.webp: OpenStax Anatomy & Physiology 2e figures (CC BY 4.0),
curated per DIG-206 unit and per NEU-205 chapter. Input: figs.json from the OpenStax section pages (slug, num, cap,
alt, src). Images are downloaded once, resized to 1200 px wide at most and saved as WebP."""
import json, os, re, subprocess, sys, io, hashlib
from PIL import Image
SRC, OUT = sys.argv[1], sys.argv[2]
F = {f['num']: f for f in json.load(open(SRC))}
UNITS = {
 "A:Anterior abdominal wall": ["11.16"],
 "A:Testis and spermatic cord": ["27.3", "27.4", "27.2"],
 "A:Abdominal cavity and peritoneum": ["23.4", "23.2"],
 "A:Stomach": ["23.15", "23.4"],
 "A:Small intestine": ["23.18", "23.4"],
 "A:Large intestine": ["23.21", "23.23"],
 "A:Vessels of gut": ["20.28", "20.29", "20.43", "20.36", "20.40"],
 "A:Pancreas": ["23.26", "23.24"],
 "A:Spleen": ["21.9"],
 "A:Liver and biliary system": ["23.24", "23.27", "20.43"],
 "A:Kidney, ureter and suprarenal glands": ["25.7", "25.8", "25.9", "25.6", "17.17"],
 "A:Posterior abdominal wall": ["20.28", "20.36", "11.29", "13.24", "21.4"],
 "A:Gut development": ["28.14", "28.9", "28.10"],
 "P:Saliva, swallowing and the oesophagus": ["23.9", "23.14", "23.12", "23.13"],
 "P:Stomach: acid secretion, motility, vomiting": ["23.17", "23.16", "23.5"],
 "P:Pancreas, bile and GI hormones": ["23.26", "23.27", "23.32", "23.29", "23.30"],
 "P:Intestinal motility, absorption, defecation": ["23.20", "23.5", "23.28", "23.32", "23.33"],
 "P:GFR, renal blood flow and its autoregulation": ["25.16", "25.10", "25.9", "25.13", "25.21", "25.14"],
 "P:Tubular transport: glucose, Na+, K+, clearance": ["25.17", "25.18", "25.15"],
 "P:Urine concentration, ADH and thirst": ["25.20", "25.15"],
 "P:Renal acid-base balance": ["25.19", "26.17", "26.16", "26.15"],
 "P:Metabolism: RQ, BMR, temperature, food intake": ["24.23", "24.3", "24.21", "24.22"],
 "H:Oral cavity, tongue and salivary glands": ["23.7", "23.8", "14.3", "23.9", "23.11", "21.10"],
 "H:Oesophagus and stomach": ["23.16", "23.3", "23.13"],
 "H:Small and large intestine, appendix": ["23.19", "23.22", "23.3", "21.11"],
 "H:Liver, gall bladder and pancreas": ["23.25", "23.26", "23.27"],
 "H:Kidney and urinary passages": ["25.10", "25.11", "25.13", "25.12", "25.4", "25.6", "25.3"],
 "B:Liver biochemistry: detoxification, lipoproteins, fatty liver": ["24.12", "24.16", "24.13", "24.14", "24.15", "23.29", "23.31", "23.33"],
}
# NEU-205 chapters (the CNS written): matched by chapter name
CNS = {
 "Central Nervous System": ["13.14", "12.11", "13.9"], "Nervous Tissue": ["12.8", "12.9", "12.11", "12.12", "12.13", "13.21"],
 "Spinal reflexes": ["12.14", "13.14"], "Spinal cord": ["13.14", "13.19", "13.20", "14.19", "14.28"],
 "Eye": ["14.15", "14.13", "14.16"], "Retina": ["14.16", "14.17", "14.18", "14.15"], "Refractive": ["14.15"], "Uveal": ["14.15"], "Fluid system of the eye": ["14.15"],
 "Color vision and visual pathway": ["14.22", "14.24", "14.18", "12.5"], "Physiologic optics": ["14.15", "14.25"], "Orbit": ["14.13", "14.14"],
 "Ear": ["14.5", "14.7", "14.9"], "Sound": ["14.6", "14.10", "14.20"], "Inner ear": ["14.7", "14.8", "14.10", "14.11", "14.12"],
 "Equilibrium": ["14.11", "14.12", "14.21"], "Nose": ["14.4"], "Pain": ["14.19", "14.2"], "Sensory receptors": ["14.2"],
 "Somatic sensory pathways": ["14.19", "14.23"], "Sensory Code": ["14.2", "14.23"], "Lesions of the sensory system": ["14.19"],
 "Brain stem": ["13.12", "13.23"], "Trigeminal": ["13.23"], "Cranial Nerves": ["13.23", "14.21"], "Cranial cavity": ["13.16", "13.17"],
 "Cerebral hemisphere": ["13.6", "13.7", "13.8", "13.9"], "Sulci": ["13.6", "13.7", "13.8"], "Arterial and venous supply of brain": ["13.15", "20.27", "13.16"],
 "cerebellum": ["13.13"], "Cerebellum": ["13.13"], "Basal ganglia": ["13.9", "13.10"], "Diencephalon": ["13.11"], "Third ventricle": ["13.11", "13.18"],
 "Fourth ventricle": ["13.18", "13.12"], "Lateral ventricle": ["13.18"], "Cerebrospinal fluid": ["13.18", "13.17"], "Meninges": ["13.17", "13.16"],
 "Embryology": ["13.2", "13.3", "28.13", "13.5"], "Base of brain": ["13.23", "13.15"], "Motor Cortex": ["14.28", "13.8"], "Control of voluntary movement": ["14.28", "13.10"],
 "Upper and Lower Motor Neuron": ["14.28"], "synap": ["12.27", "12.28", "12.26"], "Synaptic": ["12.26", "12.27"], "Memory": ["13.8"], "Speech": ["13.8"],
 "Arousal": ["13.12"], "Sleep": ["13.12"], "Face": ["20.37", "20.26"], "Carotid triangle": ["20.26"], "Subclavian": ["20.31", "20.26"],
 "Oral Cavity": ["23.7", "23.8"], "Pharynx": ["23.12"], "Parotid": ["23.9"], "Submandibular": ["23.9"], "Muscular triangle": ["20.26"], "Scalp": ["20.37"],
 "Cervical plexus": ["13.24"], "Posterior triangle": ["20.37"], "Maxillary artery": ["20.26"],
}
os.makedirs(OUT, exist_ok=True)
figs = {}
need = sorted({n for v in list(UNITS.values()) + list(CNS.values()) for n in v})
for n in need:
    f = F.get(n)
    if not f: print("missing", n); continue
    fid = "os" + n.replace(".", "_"); fp = os.path.join(OUT, fid + ".webp")
    if not os.path.exists(fp):
        raw = subprocess.run(["curl", "-s", "--max-time", "60", "https://openstax.org" + f["src"]], capture_output=True).stdout
        im = Image.open(io.BytesIO(raw)); im = im.convert("RGB") if im.mode not in ("RGB",) else im
        if im.width > 1200: im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
        im.save(fp, "WEBP", quality=82, method=6)
    im = Image.open(fp)
    m = re.match(r"(.+?)\s{1,}(?=[A-Z(])", f["cap"]); title = f["cap"].split("  ")[0]
    cr = re.findall(r"\((?:credit|Micrograph)[^)]*\)", f["cap"])
    cap = re.sub(r"\s*\((?:credit|Micrograph)[^)]*\)\s*", " ", f["cap"]).strip()
    body = re.sub(r"\s*\((?:credit|Micrograph)[^)]*\)\s*", " ", f.get("body") or "").strip()
    figs[fid] = {"src": "fig/ostx/" + fid + ".webp", "num": n, "title": (f.get("title") or "").strip(), "body": body[:400], "cap": cap[:420], "credit": " ".join(cr)[:200], "alt": f["alt"][:400], "w": im.width, "h": im.height,
                 "page": "https://openstax.org/books/anatomy-and-physiology-2e/pages/" + f["slug"]}
units = {u: ["os" + n.replace(".", "_") for n in v if "os" + n.replace(".", "_") in figs] for u, v in UNITS.items()}
cns = {k: ["os" + n.replace(".", "_") for n in v if "os" + n.replace(".", "_") in figs] for k, v in CNS.items()}
js = ("/* OpenStax Anatomy & Physiology 2e figures (Betts et al., OpenStax, CC BY 4.0, https://openstax.org/details/books/anatomy-and-physiology-2e),\n"
      " * curated per DIG-206 unit and NEU-205 chapter (built by tools/g206/build_ostx.py). */\n"
      "window.IX_OSTX = " + json.dumps({"figs": figs, "units": units, "cns": cns, "credit": "OpenStax Anatomy & Physiology 2e, CC BY 4.0"}, ensure_ascii=False, separators=(",", ":")) + ";\n")
open(os.path.join(os.path.dirname(OUT.rstrip("/")), "..", "git206-ostx.js") if False else sys.argv[3], "w").write(js)
print(len(figs), "figures;", sum(os.path.getsize(os.path.join(OUT, x)) for x in os.listdir(OUT)) // 1024, "KB")
