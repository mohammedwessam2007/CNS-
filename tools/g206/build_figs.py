"""Gray's Anatomy (1918, public domain) plates on Wikimedia Commons, matched to the DIG-206 units by their Commons
captions (fetched with the Commons API; each plate's caption was read before it was placed).
Usage: python3 -I build_figs.py <gray.json> <out.js>"""
import json, sys
G = json.load(open(sys.argv[1]))
UNITS = {
 "A:Anterior abdominal wall": [392, 395, 398, 1036],
 "A:Testis and spermatic cord": [1036, 398],
 "A:Abdominal cavity and peritoneum": [1040, 1039, 1038, 1037],
 "A:Stomach": [1046, 1047, 1050, 1052],
 "A:Small intestine": [1056, 1041],
 "A:Large intestine": [1045, 1043, 1078],
 "A:Vessels of gut": [1120],
 "A:Pancreas": [1056, 1097, 1100],
 "A:Kidney, ureter and suprarenal glands": [1122, 1123, 1121, 1125],
 "A:Posterior abdominal wall": [1121, 1120],
 "A:Gut development": [1088, 1101, 1104],
 "H:Small and large intestine, appendix": [1060, 1058, 1071],
 "H:Liver, gall bladder and pancreas": [1090, 1093, 1094, 1096, 1105],
 "H:Kidney and urinary passages": [1128, 1131, 1133, 1185],
 "P:GFR, renal blood flow and its autoregulation": [1128],
 "P:Tubular transport: glucose, Na+, K+, clearance": [1128, 1131],
 "P:Urine concentration, ADH and thirst": [1131, 1128],
}
out = {}
for u, nums in UNITS.items():
    lst = []
    for n in nums:
        g = G.get("File:Gray%d.png" % n)
        if not g or not g["desc"].strip(): continue
        lst.append({"src": g["thumb"].split("?")[0], "cap": g["desc"].strip().rstrip("."), "page": g["page"], "fig": "Gray's Anatomy (1918), fig. %d" % n})
    if lst: out[u] = lst
js = "/* Drawings for the DIG-206 units: Gray's Anatomy (1918) plates, public domain, served by Wikimedia Commons; captions are\n * Commons' own (built by tools/g206/build_figs.py). */\nwindow.IX_GIT206_FIGS = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n"
open(sys.argv[2], "w", encoding="utf-8").write(js)
print(len(out), "units with drawings,", sum(len(v) for v in out.values()), "plates")
