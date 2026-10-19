import json,base64,sys,numpy as np
from PIL import Image, ImageDraw
d=json.load(open(sys.argv[1])); zs=[float(a) for a in sys.argv[3].split(',')]
COL=dict(muscle='#b03a40',muscle2='#e07080',bone='#d8c9a8',disc='#8fb3c9',cart='#9ed0e6',oes='#d08a60',artery='#ff3b30',vein='#4d7bff',nerve='#ffd23f',cord='#f4ead8',thyroid='#ff40a0',node='#7fd88f')
LC=dict(skin='#888888',superficial='#dddddd',investing='#f2b45a',pretracheal='#f07a95',prevertebral='#4fd1b5',carotidR='#7ea6ff',carotidL='#7ea6ff')
K=float(sys.argv[4]) if len(sys.argv)>4 else 4.0; CX=float(sys.argv[5]) if len(sys.argv)>5 else 0; CY=float(sys.argv[6]) if len(sys.argv)>6 else 15; W=int(230*4); H=int(170*4)
img=Image.new('RGB',(W*len(zs),H),'#05070c'); dr=ImageDraw.Draw(img)
M=[(m,np.frombuffer(base64.b64decode(m['p']),'<i2').reshape(-1,3)/10,np.frombuffer(base64.b64decode(m['i']),'<u2').reshape(-1,3)) for m in d['meshes']]
for col,z in enumerate(zs):
  ox=col*W
  P=lambda x,y:(ox+W/2+(x-CX)*K,H/2+(y-CY)*K)
  FC=dict(skin='#5a4038',superficial='#5a4a20',investing='#3a3020',pretracheal='#402030',prevertebral='#1a3a34',carotid='#1a2a50')
  e='top' if abs(z-d['slab'][1])<0.5 else ('bot' if abs(z-d['slab'][0])<0.5 else None)
  if e:
    for k,v in d['fills'].items():
      for poly in v[e]:
        rings=[np.frombuffer(base64.b64decode(r),'<i2').reshape(-1,2)/10 for r in poly]
        dr.polygon([P(*p) for p in rings[0]],fill=FC[k])
        for h in rings[1:]: dr.polygon([P(*p) for p in h],fill='#05070c')
  for m,V,F in M:
    T=V[F]; s=T[:,:,2]-z; cross=~((s>0).all(1)|(s<0).all(1))
    for t,ss in zip(T[cross],s[cross]):
      pts=[]
      for a,b in ((0,1),(1,2),(2,0)):
        if (ss[a]>0)!=(ss[b]>0): u=ss[a]/(ss[a]-ss[b]); pts.append(t[a]+u*(t[b]-t[a]))
      if len(pts)==2: dr.line([P(*pts[0][:2]),P(*pts[1][:2])],fill=COL[m['k']],width=3 if m['r'] else 2)
  for k,v in d['sleeves'].items():
    XY=np.frombuffer(base64.b64decode(v['p']),'<i2').reshape(v['rows'],v['n'],2)/10
    i=int(round((z-v['z0'])/v['dz']))
    if 0<=i<len(XY): r=np.vstack([XY[i],XY[i][:1]]); dr.line([P(*p) for p in r],fill=LC[k],width=2)
  dr.text((ox+10,10),'z=%g  front at top, patient right on left'%z,fill='white')
img.save(sys.argv[2])
