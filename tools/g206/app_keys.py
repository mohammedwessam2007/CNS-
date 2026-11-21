"""Answer keys written by the app (v34) for DIG-206 MCQs that had no key (mostly the Zahra histology MCQs). Keys are by
position in the list of unkeyed questions at the time (the bank order is stable). Garbled or ambiguous questions are left
without a key. Applied to source/public/git206-bank.js with "keyBy": "app" so the app can say the key is not the
department's."""
import json, re, sys
K = {0:'b',1:'a',2:'b',3:'d',4:'c',5:'b',6:'c',7:'b',8:'a',9:'a',10:'d',12:'a',13:'c',14:'b',16:'a',17:'c',18:'c',19:'b',20:'b',21:'c',22:'b',23:'d',24:'c',26:'d',31:'d',33:'c',34:'c',35:'b',36:'b',37:'d',38:'c',39:'b',40:'a',41:'b',44:'c',45:'b',46:'b',47:'b',48:'a',49:'c',50:'b',51:'b',52:'a',53:'d',54:'b',55:'c',56:'c',57:'a',58:'a',59:'a',61:'d',62:'c',63:'a',64:'d',65:'a',66:'c',67:'a',68:'d',69:'c',
 70:'b',71:'b',72:'d',73:'d',74:'a',75:'d',76:'a',78:'b',79:'a',80:'d',81:'b',82:'b',83:'b',84:'d',85:'a',86:'b',87:'a',88:'c',89:'d',90:'c',91:'b',92:'a',93:'b',94:'b',95:'b',96:'b',97:'b',98:'a',99:'a',103:'a',104:'b',105:'d',108:'d',109:'a',110:'d',112:'c',113:'b',114:'c',115:'a',118:'a',119:'b',120:'b',121:'b',122:'d',123:'a',124:'b',126:'b',127:'c',129:'b',130:'b',131:'c',132:'d',134:'b',135:'c',136:'d',137:'c',138:'d',139:'b',140:'d',141:'d',143:'b',144:'d',145:'c',146:'d',147:'c',150:'c',151:'a',152:'c',153:'d',154:'d',155:'c',156:'c',157:'b',159:'d',160:'d',161:'c',162:'c',163:'d',164:'b',165:'c',166:'b',167:'c',168:'c',169:'c',170:'c',171:'a',173:'c',174:'b',175:'a',176:'d',177:'d',178:'c',179:'d',180:'b',182:'b',183:'c',184:'a',185:'d',187:'c',188:'d',190:'a'}
p = sys.argv[1]; s = open(p, encoding="utf-8").read()
i = s.index("window.IX_GIT206 = ") + len("window.IX_GIT206 = "); j = s.rindex(";")
B = json.loads(s[i:j])
un = [q for q in B["mcq"] if not q.get("answerKeys")]
if len(un) != 191: sys.exit("unexpected unkeyed count %d (already applied?)" % len(un))
n = 0
for idx, k in K.items():
    q = un[idx]
    if "unsolved" in (q.get("source") or "").lower(): continue   # unsolved past papers stay "practise with the professor"
    if k not in [o["key"] for o in q["options"]]: sys.exit("bad key %s for %d" % (k, idx))
    q["answerKeys"] = [k]; q["keyBy"] = "app"; n += 1
open(p, "w", encoding="utf-8").write(s[:i] + json.dumps(B, ensure_ascii=False, separators=(",", ":")) + s[j:])
print("keyed", n, "left", 191 - n)
