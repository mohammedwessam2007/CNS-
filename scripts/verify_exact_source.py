#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, sys
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'source'
MAN = ROOT / 'manifests' / 'CURRENT_EXACT_SOURCE_MANIFEST.json'
data = json.loads(MAN.read_text(encoding='utf-8'))
errors=[]
for item in data['files']:
    p=SRC/item['path']
    if not p.exists():
        errors.append(f"MISSING {item['path']}")
        continue
    b=p.read_bytes()
    h=hashlib.sha256(b).hexdigest()
    if len(b)!=item['size'] or h!=item['sha256']:
        errors.append(f"MISMATCH {item['path']} size={len(b)} sha256={h}")
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f"OK: {len(data['files'])} exact source files verified for v{data['deployment_version']}")
