(function(){
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const short=(s,n=72)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1)+'…':s};
const svg=(body,cap)=>'<div class="visualBox v5TopicVisual"><svg viewBox="0 0 760 430" role="img" aria-label="'+esc(cap)+'"><rect width="760" height="430" rx="20" fill="#f8fbff"/>'+body+'</svg><div class="tiny"><b>Visual target:</b> '+esc(cap)+'</div></div>';
const label=(x,y,t,size=15,weight=700,fill='#142033')=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-weight="'+weight+'" fill="'+fill+'" text-anchor="middle">'+esc(t)+'</text>';
const box=(x,y,w,h,t,fill='#e7f1fb',stroke='#537693')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="16" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>'+label(x+w/2,y+h/2+5,short(t,38),14,800);
const arrow=(x1,y1,x2,y2,color='#496a86')=>'<defs><marker id="a" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="'+color+'"/></marker></defs><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="4" marker-end="url(#a)"/>';
function flow(p,l){
  const steps=(p.teach||[]).slice(0,5).map(x=>short(x.split(/[.;]/)[0],52));
  while(steps.length<3)steps.push(short(p.mental||l.mental||l.topic,52));
  let b=label(380,34,l.topic,21,900);
  const xs=steps.length<=3?[70,285,500]:steps.length===4?[35,215,395,575]:[20,165,310,455,600];
  const w=steps.length<=3?190:steps.length===4?150:130;
  steps.forEach((s,i)=>{b+=box(xs[i],150,w,88,s,i%2?'#f2eafa':'#e5f4fb',i%2?'#836aa0':'#537693'); if(i<steps.length-1)b+=arrow(xs[i]+w,194,xs[i+1],194);});
  const grammar=l.subject==='ANATOMY'?'ORIENT → RELATIONS → SUPPLY / NERVE → LESION':l.subject==='HISTOLOGY'?'RECOGNIZE → DISCRIMINATE → LOOK-ALIKE → FUNCTION':'INPUT → MECHANISM → OUTPUT → PERTURB';
  b+=label(380,305,grammar,16,900,'#36536d');
  b+=label(380,350,short(p.draw||l.draw||'',92),13,700,'#596b7b');
  return svg(b,p.seed?.visualAnchor||p.imaginePrompt||p.draw||l.draw||l.topic);
}
function histo(p,l){
  const topic=(l.topic||'').toLowerCase();
  let b=label(380,32,l.topic,21,900);
  if(topic.includes('ear')||topic.includes('corti')){
    b+='<path d="M80 310 Q210 90 380 310" fill="#eaf3fb" stroke="#52728c" stroke-width="3"/><path d="M380 310 Q520 130 680 310" fill="#f3e7f0" stroke="#8b6179" stroke-width="3"/>';
    b+=box(260,230,110,55,'Organ of Corti','#fff3c7','#967b30')+box(390,120,120,55,'Scala media','#e7f6ff','#52728c')+box(105,260,120,55,'Basilar membrane','#edf5e6','#6d8655');
  }else{
    b+='<circle cx="250" cy="215" r="80" fill="#f6ddea" stroke="#8f5e78" stroke-width="3"/><circle cx="250" cy="215" r="26" fill="#b984a6"/>';
    b+='<path d="M330 215 C410 215 470 145 610 150" fill="none" stroke="#577694" stroke-width="14" stroke-linecap="round"/>';
    b+=label(250,220,'cell',16,900)+label(515,135,'process / layer',14,800);
  }
  const traps=(p.seed?.confusions||[]).slice(0,3);
  traps.forEach((t,i)=>b+=box(70+i*220,340,190,58,t,'#fff7e8','#9b7b3d'));
  return svg(b,p.seed?.visualAnchor||'Identify architecture, then distinguish the nearest look-alike.');
}
function anatomy(p,l){
 const t=(l.topic||'').toLowerCase(); let b=label(380,30,l.topic,20,900);
 if(t.includes('parotid')){b+=box(270,115,220,170,'PAROTID GLAND','#fbe3ed','#965d76');b+=box(65,145,155,55,'Facial nerve','#e6f5ff','#567c98')+arrow(220,172,270,172);b+=box(540,115,150,55,'Retromandibular v.','#e8eef7','#58718c')+arrow(540,142,490,155);b+=box(540,210,150,55,'External carotid a.','#fde8e8','#a15454')+arrow(540,237,490,220);b+=box(285,315,190,55,'Parotid duct → mouth','#fff5d7','#9c8030');}
 else if(t.includes('temporomandibular')||t.includes('tmj')){b+=box(90,135,190,65,'Mandibular condyle','#e7eef7','#58718c')+box(480,135,190,65,'Temporal articular surface','#e7eef7','#58718c');b+=box(285,205,190,50,'Articular disc','#f9e7f0','#8e6178');b+=arrow(280,167,360,210)+arrow(480,167,400,210);b+=label(380,320,'rotation → translation during opening',17,900,'#48647c');}
 else if(t.includes('infratemporal')){b+=box(245,100,270,210,'INFRATEMPORAL FOSSA','#eef4fb','#577594');b+=box(55,120,145,55,'V3 branches','#e8f7ff','#547a95')+box(560,120,145,55,'Maxillary artery','#fde8e8','#a15454')+box(55,230,145,55,'Pterygoids','#f5eadf','#947155')+box(560,230,145,55,'Pterygoid plexus','#ede8f8','#79669b');}
 else if(t.includes('pterygopalatine')){b+=box(250,105,260,195,'PTERYGOPALATINE FOSSA','#eef4fb','#577594');['V2','Pterygopalatine ganglion','Maxillary a. terminal branches'].forEach((x,i)=>b+=box(70+i*220,330,185,55,x,i===2?'#fde8e8':'#e8f7ff',i===2?'#a15454':'#547a95'));}
 else if(t.includes('maxillary artery')){const n=['ECA','mandibular part','pterygoid part','pterygopalatine part'];n.forEach((x,i)=>{b+=box(40+i*175,155,145,65,x,i===0?'#fde8e8':'#eef4fb',i===0?'#a15454':'#577594');if(i<n.length-1)b+=arrow(185+i*175,187,215+i*175,187,'#a15454')});}
 else if(t.includes('orbit')||t.includes('extraocular')){b+='<path d="M100 220 L650 90 L650 350 Z" fill="#edf4fb" stroke="#567792" stroke-width="3"/><circle cx="310" cy="220" r="80" fill="#d9ecfb" stroke="#52738f" stroke-width="3"/>';b+=label(310,225,'GLOBE',17,900);['III','IV','VI','V1','optic n.'].forEach((x,i)=>b+=label(560,135+i*45,x,14,800));}
 else if(t.includes('thyroid')){b+=box(210,115,140,210,'Right lobe','#f7dde8','#965f78')+box(410,115,140,210,'Left lobe','#f7dde8','#965f78')+box(330,185,100,65,'Isthmus','#f7dde8','#965f78');b+=label(380,365,'trachea behind · RLN in tracheoesophageal groove',14,800,'#526779');}
 else if(t.includes('submandibular')){b+=box(200,130,190,90,'Submandibular gland','#fae6c7','#98733e')+box(440,130,190,90,'Sublingual gland','#fae6c7','#98733e');b+=arrow(390,175,440,175)+box(285,285,190,60,'Lingual n. ↔ duct','#e8f4ff','#527893');}
 else if(t.includes('carotid')){b+=box(70,160,155,60,'Common carotid','#fde8e8','#a15454')+arrow(225,190,330,135,'#a15454')+arrow(225,190,330,245,'#a15454')+box(330,105,160,60,'Internal carotid','#fde8e8','#a15454')+box(330,215,160,60,'External carotid','#fde8e8','#a15454');b+=box(540,105,150,60,'Carotid sinus/body','#fff2d8','#9c7d35');}
 else if(t.includes('pharynx')){['nasopharynx','oropharynx','laryngopharynx'].forEach((x,i)=>b+=box(270,80+i*95,220,65,x,i===0?'#e7f6ff':i===1?'#f5eafb':'#e9f6e8','#577594'));b+=label(590,215,'constrictors + longitudinal muscles',13,800);}
 else if(t.includes('larynx')){b+=box(255,80,250,60,'Thyroid cartilage','#eef3fb','#577594')+box(255,165,250,60,'Vocal folds / arytenoids','#f9e4ed','#916078')+box(255,250,250,60,'Cricoid cartilage','#eef3fb','#577594');b+=label(380,350,'PCA abducts · RLN motor except cricothyroid',14,900,'#526779');}
 else if(t.includes('nose')||t.includes('sinus')){b+=box(120,95,210,230,'Nasal cavity','#e8f5ff','#527893');['frontal','ethmoid','maxillary','sphenoid'].forEach((x,i)=>b+=box(430,70+i*75,170,50,x+' sinus','#fff1d8','#9b7a32'));b+=arrow(430,95,330,150)+arrow(430,170,330,190)+arrow(430,245,330,230)+arrow(430,320,330,270);}
 else if(t.includes('lymph')){const n=['regional superficial nodes','deep cervical chain','jugular trunks'];n.forEach((x,i)=>{b+=box(80+i*230,160,190,70,x,'#e9f6e8','#648259');if(i<2)b+=arrow(270+i*230,195,310+i*230,195,'#648259')});}
 else if(t.includes('scalp')||t.includes('face')){['skin','dense C.T.','aponeurosis','loose tissue','pericranium'].forEach((x,i)=>b+=box(75+i*130,170,110,65,x,i===3?'#ffe6e6':'#eef4fb',i===3?'#a45757':'#577594'));b+=label(380,290,'SCALP layers + facial nerve motor map',15,900,'#526779');}
 else if(t.includes('cranial')||t.includes('v2')||t.includes('v3')||t.includes('facial nerve')){const n=['brainstem / skull exit','ganglion / branch point','target territory','lesion pattern'];n.forEach((x,i)=>{b+=box(40+i*180,155,150,72,x,i%2?'#f3eafb':'#e8f5ff',i%2?'#81689a':'#537693');if(i<3)b+=arrow(190+i*180,191,220+i*180,191)});}
 else if(t.includes('cerebral')||t.includes('dienceph')||t.includes('basal')||t.includes('internal capsule')){b+='<ellipse cx="380" cy="210" rx="250" ry="135" fill="#e8eff7" stroke="#587793" stroke-width="3"/><path d="M380 95 C330 145 330 275 380 325 C430 275 430 145 380 95" fill="#f5e6ef" stroke="#916078" stroke-width="3"/>';b+=label(380,215,'deep map',16,900)+label(230,125,'cortex',14,800)+label(535,125,'cortex',14,800);}
 else if(t.includes('mening')||t.includes('ventricle')||t.includes('csf')){const n=['lateral ventricles','III','aqueduct','IV','subarachnoid space'];n.forEach((x,i)=>{b+=box(40+i*140,160,115,65,x,'#e7f6ff','#527893');if(i<4)b+=arrow(155+i*140,192,180+i*140,192,'#527893')});}
 else return null;
 return svg(b,p.seed?.visualAnchor||p.imaginePrompt||p.draw||l.draw||l.topic);
}
function eye(p,l){let b=label(380,30,l.topic,20,900);b+='<circle cx="330" cy="220" r="135" fill="#e8f5ff" stroke="#527893" stroke-width="3"/><circle cx="330" cy="220" r="45" fill="#d8e8f5" stroke="#527893"/><path d="M465 220 L660 160 L660 280 Z" fill="#f4e7ef" stroke="#906078"/>';b+=label(330,225,'eye',17,900)+label(585,145,'optic pathway',13,800);return svg(b,p.seed?.visualAnchor||p.imaginePrompt||'Trace light or motor/autonomic route through the eye.')}
function ear(p,l){let b=label(380,30,l.topic,20,900);b+='<path d="M160 220 C160 120 280 100 315 190 C335 250 285 315 225 285 C180 265 155 250 160 220Z" fill="#f6e4ef" stroke="#8f6178" stroke-width="3"/><path d="M330 220 C400 100 510 110 555 190 C590 250 530 325 450 300 C390 280 360 250 330 220Z" fill="#e7f5ff" stroke="#527893" stroke-width="3"/>';b+=label(230,220,'cochlea',16,900)+label(470,220,'vestibular apparatus',16,900);return svg(b,p.seed?.visualAnchor||p.imaginePrompt||'Orient cochlear and vestibular structures before mechanism.')}
function embryo(p,l){let b=label(380,30,l.topic,20,900);const n=['prominence / plate','growth / migration','fusion / derivative','clinical defect'];n.forEach((x,i)=>{b+=box(40+i*180,155,150,70,x,i%2?'#f4eafb':'#e8f5ff',i%2?'#81689a':'#537693');if(i<3)b+=arrow(190+i*180,190,220+i*180,190)});return svg(b,p.seed?.visualAnchor||p.imaginePrompt||'Time sequence → movement/fusion → derivative → defect.')}
window.INTELLECTUALITY_TOPIC_VISUAL=function(l,p){
  p=p||{}; const t=(l.topic||'').toLowerCase();
  if(l.subject==='HISTOLOGY') return histo(p,l);
  if(l.subject==='PHYSIOLOGY'){
    if(t.includes('vision')||t.includes('eye')||t.includes('pupil')||t.includes('accommodation')) return eye(p,l);
    if(t.includes('hearing')||t.includes('equilibrium')||t.includes('vestib')||t.includes('auditory')) return ear(p,l);
    return flow(p,l);
  }
  if(t.includes('development')) return embryo(p,l);
  if(t.includes('eye')||t.includes('orbit')) return eye(p,l);
  if(t.includes('ear')) return ear(p,l);
  return anatomy(p,l)||flow(p,l);
};
})();