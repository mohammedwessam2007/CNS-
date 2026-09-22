#!/usr/bin/env bash
set -euo pipefail
BASE="https://intellectuality-cns-0nts.hatchable.site"
OUT="${1:-live-v53}"
mkdir -p "$OUT/public"

echo "Fetching public v53 source layers..."
mkdir -p "$OUT/$(dirname 'public/index.html')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/index.html" -o "$OUT/public/index.html"
mkdir -p "$OUT/$(dirname 'public/professor.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/professor.js" -o "$OUT/public/professor.js"
mkdir -p "$OUT/$(dirname 'public/deep-01.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/deep-01.js" -o "$OUT/public/deep-01.js"
mkdir -p "$OUT/$(dirname 'public/deep-02.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/deep-02.js" -o "$OUT/public/deep-02.js"
mkdir -p "$OUT/$(dirname 'public/deep-03.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/deep-03.js" -o "$OUT/public/deep-03.js"
mkdir -p "$OUT/$(dirname 'public/deep-04.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/deep-04.js" -o "$OUT/public/deep-04.js"
mkdir -p "$OUT/$(dirname 'public/deep-05.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/deep-05.js" -o "$OUT/public/deep-05.js"
mkdir -p "$OUT/$(dirname 'public/deep-06.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/deep-06.js" -o "$OUT/public/deep-06.js"
mkdir -p "$OUT/$(dirname 'public/visuals-v5.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/visuals-v5.js" -o "$OUT/public/visuals-v5.js"
mkdir -p "$OUT/$(dirname 'public/login.html')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/login.html" -o "$OUT/public/login.html"
mkdir -p "$OUT/$(dirname 'public/real-visuals-v9.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/real-visuals-v9.js" -o "$OUT/public/real-visuals-v9.js"
mkdir -p "$OUT/$(dirname 'public/context-visuals-v10.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/context-visuals-v10.js" -o "$OUT/public/context-visuals-v10.js"
mkdir -p "$OUT/$(dirname 'public/course-ui-v11.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/course-ui-v11.js" -o "$OUT/public/course-ui-v11.js"
mkdir -p "$OUT/$(dirname 'public/course-ui-v11.css')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/course-ui-v11.css" -o "$OUT/public/course-ui-v11.css"
mkdir -p "$OUT/$(dirname 'public/intellectuality-v12.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/intellectuality-v12.js" -o "$OUT/public/intellectuality-v12.js"
mkdir -p "$OUT/$(dirname 'public/intellectuality-v12.css')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/intellectuality-v12.css" -o "$OUT/public/intellectuality-v12.css"
mkdir -p "$OUT/$(dirname 'public/twin-core-v13.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/twin-core-v13.js" -o "$OUT/public/twin-core-v13.js"
mkdir -p "$OUT/$(dirname 'public/twin-runtime-v13.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/twin-runtime-v13.js" -o "$OUT/public/twin-runtime-v13.js"
mkdir -p "$OUT/$(dirname 'public/twin-ui-v13.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/twin-ui-v13.js" -o "$OUT/public/twin-ui-v13.js"
mkdir -p "$OUT/$(dirname 'public/twin-v13.css')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/twin-v13.css" -o "$OUT/public/twin-v13.css"
mkdir -p "$OUT/$(dirname 'public/intellectuality-v14.js')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/intellectuality-v14.js" -o "$OUT/public/intellectuality-v14.js"
mkdir -p "$OUT/$(dirname 'public/intellectuality-v14.css')"
curl -fL --retry 3 --connect-timeout 15 "$BASE/intellectuality-v14.css" -o "$OUT/public/intellectuality-v14.css"

echo "Verifying public SHA-256 hashes against handoff manifest..."
python3 - <<'PY'
from pathlib import Path
import hashlib, json, sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('live-v53')
manifest=json.loads(Path('manifests/V53_DEPLOYMENT_MANIFEST.json').read_text())
bad=[]
for f in manifest['files']:
    if not f['path'].startswith('public/'): continue
    p=root/f['path']
    if not p.exists(): bad.append((f['path'],'MISSING',f['hash'])); continue
    h=hashlib.sha256(p.read_bytes()).hexdigest()
    if h!=f['hash']: bad.append((f['path'],h,f['hash']))
if bad:
    print('HASH MISMATCHES:')
    [print(x) for x in bad]
    raise SystemExit(2)
print('PUBLIC V53 HASH VERIFICATION PASSED')
PY
"$OUT"
