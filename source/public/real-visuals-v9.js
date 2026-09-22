(function(){
const E=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const enc=encodeURIComponent;
const commonsFile=f=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+enc(f)+'?width=1400';
const commonsPage=f=>'https://commons.wikimedia.org/wiki/File:'+enc(f).replace(/%20/g,'_');
const CURATED={
 T001:[
  ['Spinal_Cord_Sectional_Anatomy.png','Labeled spinal cord cross-section','BruceBlaus · CC BY-SA 4.0'],
  ['Cross-section_through_the_spinal_cord.jpg','Real spinal cord cross-section','Didkov · CC BY-SA 4.0'],
  ['Spinal_cord_tracts_-_English.svg','Ascending + descending tract map','Wikimedia Commons']
 ],
 T002:[
  ['Spinal_cord_tracts_-_English.svg','Spinal cord tract geography','Wikimedia Commons'],
  ['Spinal_Cord_Sectional_Anatomy.png','Sectional organization','BruceBlaus · CC BY-SA 4.0'],
  ['Spinal_Cord_Segments_and_body_representation.png','Segments + body representation','Nascari & Sved · CC']
 ],
 T007:[
  ['Human_brainstem_anterior_view_2_description.JPG','Real human brainstem · anterior','John A Beal · CC BY 2.5'],
  ['Human_caudal_brainstem_posterior_view_description.JPG','Real human brainstem · posterior','John A Beal · CC BY 2.5']
 ],
 T008:[
  ['Human_caudal_brainstem_posterior_view_description.JPG','Real human brainstem · posterior','John A Beal · CC BY 2.5'],
  ['Human_brainstem_anterior_view_2_description.JPG','Real human brainstem · anterior','John A Beal · CC BY 2.5']
 ],
 T010:[
  ['Sobo_1909_658.png','Cerebellar section + nuclei','Sobotta · Public domain'],
  ['Human_cerebellum_anterior_view.JPG','Real human cerebellum · anterior','Wikimedia Commons'],
  ['Human_cerebellum_under_a_microscope.jpg','Human cerebellum micrograph','Nicolò Gennari · CC BY 4.0']
 ],
 T026:[['Brain_anatomy.png','Brain + ventricle orientation','Wikimedia Commons']],
 T028:[['Human_cerebellum_under_a_microscope.jpg','Real CNS histology reference','Nicolò Gennari · CC BY 4.0']],
 T029:[['Circle_of_Willis_en.svg','Circle of Willis · labeled','Public domain']],
 T030:[['Circle_of_Willis_en.svg','Circle of Willis · labeled','Public domain']],
 T039:[
  ['Salivary_glands_numbered.svg','Major salivary gland positions','Goran tek-en · CC BY-SA 4.0'],
  ['Schematic_drawing_of_the_facial_nerve.png','Facial nerve course','Romano et al. · CC BY 4.0']
 ],
 T051:[
  ['Basal-ganglia-coronal-sections-large.png','Basal ganglia in coronal sections','Andrew Gillies · CC BY-SA'],
  ['Anatomy_of_the_basal_ganglia.jpg','Basal ganglia 3D relations','Frontiers · CC BY 3.0'],
  ['Basal_ganglia_circuits.svg','Direct / indirect circuit map','Wikimedia Commons']
 ],
 T054:[
  ['Sobo_1909_658.png','Cerebellar architecture + nuclei','Sobotta · Public domain'],
  ['Human_cerebellum_under_a_microscope.jpg','Human cerebellum micrograph','Nicolò Gennari · CC BY 4.0']
 ],
 T071:[
  ['Diagram_of_the_visual_pathway.png','Visual pathway','Firoz et al. · CC BY 4.0'],
  ['Optic_pathway.png','Optic nerve → cortex route','CC BY 4.0'],
  ['Hemianopsia_en.jpg','Visual-field lesion patterns','As eo · CC BY-SA 4.0']
 ],
 T073:[
  ['Schematic_drawing_of_the_facial_nerve.png','Facial nerve course + branches','Romano et al. · CC BY 4.0'],
  ['VIIth_Nerve.jpg','Facial nerve in the temporal bone','Public domain']
 ],
 T076:[
  ['Structure_of_the_cochlea_and_organ_of_Corti.png','Cochlea + Organ of Corti','CC BY 4.0'],
  ['Organ_of_corti.png','Organ of Corti · labeled','Bracteantha · CC BY']
 ],
 T078:[
  ['Structure_of_the_cochlea_and_organ_of_Corti.png','Cochlea + Organ of Corti','CC BY 4.0'],
  ['Organ_of_corti_in_cross_section.svg','Organ of Corti cross-section','CC BY-SA 4.0'],
  ['Organ_of_Corti_unlabeled.svg','Unlabeled practical recall','CC BY-SA 4.0']
 ],
 T082:[
  ['Structure_of_the_cochlea_and_organ_of_Corti.png','Cochlear encoding anchor','CC BY 4.0']
 ]
};
const FALLBACK_ALIAS={
 synapse:'synapse neuron electron micrograph anatomy',
 histo:'human nervous tissue histology micrograph',
 pathway:'human nervous system pathway neuroanatomy',
 brainstem:'human brainstem anatomy specimen',
 cerebellum:'human cerebellum anatomy specimen',
 brain:'human brain neuroanatomy labeled',
 ventricle:'human brain ventricular system anatomy',
 vessel:'human cerebral arteries anatomy',
 reflex:'stretch reflex muscle spindle diagram',
 embryo:'neural tube embryology human anatomy',
 headneck:'human head neck anatomy dissection',
 cranialnerve:'human cranial nerve anatomy',
 eye:'human eye anatomy histology',
 vision:'human visual pathway anatomy',
 ear:'human inner ear cochlea anatomy',
 skull:'cranial base anatomy skull foramina'
};
function yt(l){
 const v=l?.video;if(!v?.id)return '';
 const img='https://i.ytimg.com/vi/'+E(v.id)+'/hqdefault.jpg';
 const href='https://www.youtube.com/watch?v='+E(v.id)+'&t='+(v.start||0)+'s';
 return '<a class="realHero ytHero" href="'+href+'" target="_blank" rel="noopener"><div class="realBadge">YOUTUBE · ACTUAL TEACHING VISUAL</div><div class="ytPoster"><img src="'+img+'" alt="'+E(v.title||l.topic)+'" loading="lazy"><span>▶ PLAY ROUTED CLIP</span></div><div class="realCap">'+E(v.title||'Routed teaching clip')+' · starts at '+Math.floor((v.start||0)/60)+':'+String((v.start||0)%60).padStart(2,'0')+'</div></a>';
}
function curated(l){
 const arr=CURATED[l.id]||[];
 return arr.map((x,i)=>'<div class="realCuratedSlot '+(i===0?'primary':'')+'" data-commons-file="'+E(x[0])+'" data-label="'+E(x[1])+'" data-credit="'+E(x[2])+'"><div class="realLoading">Loading curated real visual…</div></div>').join('');
}
function sourceFigures(l){
 try{
  const qs=(window.EHSAN_QBANK?.questions||[]).filter(q=>q.lessonIds?.includes(l.id)&&q.visualData).slice(0,2);
  return qs.map(q=>'<div class="realImg sourceFigure"><img src="'+q.visualData+'" alt="Source-bank figure" loading="lazy"><div class="realCap"><b>ACTUAL SOURCE-BANK FIGURE</b><span>'+E(q.sourceFile||'Ketab al Qesm')+' · p.'+E(q.page||'—')+'</span></div></div>').join('');
 }catch(_){return ''}
}
function query(l){
 const alias=FALLBACK_ALIAS[l.visualType]||'human medical anatomy';
 const simple=String(l.topic||'').replace(/\b(I|II|and|with|of|the|from|to|versus)\b/gi,' ').replace(/\s+/g,' ').trim();
 let qs;
 if(l.subject==='HISTOLOGY')qs=[simple+' histology micrograph',simple+' histology',alias];
 else if(l.subject==='ANATOMY')qs=[simple+' anatomy',simple+' human anatomy',alias];
 else qs=[simple+' physiology diagram',simple+' neuroanatomy',alias];
 return [...new Set(qs.filter(Boolean))].join('|||');
}
window.INTELLECTUALITY_TOPIC_VISUAL=function(l,p){
 const c=curated(l),y=yt(l),sf=sourceFigures(l),q=query(l);
 return '<div class="realVisualBank" data-real-id="'+E(l.id)+'">'+
   '<div class="realVisualHead"><b>REAL VISUAL BANK</b><span>No generated anatomy</span></div>'+
   (y||'')+
   (sf?'<div class="realGrid">'+sf+'</div>':'')+
   (c?'<div class="realGrid curated">'+c+'</div>':'')+
   (!c?'<div class="realGrid commonsDynamic" data-commons-query="'+E(q)+'"><div class="realLoading">Loading real anatomy / histology references…</div></div>':'')+
   '<div class="realTiny">Open-license reference images are loaded from Wikimedia Commons. YouTube stays embedded from YouTube; no copied video frame files.</div>'+
 '</div>';
};
function scoreTitle(title,l){
 const t=title.toLowerCase(),topic=(l?.topic||'').toLowerCase();
 let s=0;
 for(const w of topic.split(/[^a-z]+/).filter(x=>x.length>4))if(t.includes(w))s+=3;
 if(/human|anatom|histolog|micrograph|diagram|nerve|brain|cord|ear|eye|larynx|pharynx|arter/.test(t))s+=2;
 if(/logo|flag|coat|icon|map of|portrait|statue/.test(t))s-=10;
 return s;
}
async function hydrateOne(el){
 if(el.dataset.loaded)return;el.dataset.loaded='1';
 const raw=el.dataset.commonsQuery;if(!raw)return;
 try{
  const lid=el.closest('.realVisualBank')?.dataset.realId;
  let l=null;try{for(const d of window.COURSE?.days||[]){const hit=(d.lessons||[]).find(x=>x.id===lid);if(hit){l=hit;break}}}catch(_){}
  let rows=[];
  for(const q of raw.split('|||')){
   const u='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+enc(q)+'&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=1000&format=json&origin=*';
   const r=await fetch(u),j=await r.json();
   rows=Object.values(j.query?.pages||{}).map(p=>{const ii=p.imageinfo?.[0]||{};return{title:p.title||'',thumb:ii.thumburl,url:ii.descriptionurl||('https://commons.wikimedia.org/wiki/'+encodeURIComponent(p.title)),license:ii.extmetadata?.LicenseShortName?.value||'Commons',mime:ii.mime||'',score:scoreTitle(p.title||'',l)}})
    .filter(x=>x.thumb&&/^image\/(jpeg|png|webp|svg\+xml)/.test(x.mime)).sort((a,b)=>b.score-a.score).slice(0,3);
   if(rows.length)break;
  }
  if(!rows.length)throw new Error('no_visuals');
  el.innerHTML=rows.map((x,i)=>'<a class="realImg '+(i===0&&!el.closest('.realVisualBank')?.querySelector('.realImg.primary')?'primary':'')+'" href="'+E(x.url)+'" target="_blank" rel="noopener"><img src="'+E(x.thumb)+'" alt="'+E(x.title.replace(/^File:/,''))+'" loading="lazy"><div class="realCap"><b>'+E(x.title.replace(/^File:/,''))+'</b><span>'+E(x.license)+'</span></div></a>').join('');
 }catch(e){el.innerHTML='<div class="realUnavailable">Real visual lookup unavailable right now. No generated substitute shown.</div>'}
}
async function hydrateCurated(el){
 if(el.dataset.loaded)return;el.dataset.loaded='1';
 const file=el.dataset.commonsFile,label=el.dataset.label||file,credit=el.dataset.credit||'Wikimedia Commons';
 try{
  const u='https://commons.wikimedia.org/w/api.php?action=query&titles='+enc('File:'+file)+'&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=1200&format=json&origin=*';
  const r=await fetch(u),j=await r.json(),p=Object.values(j.query?.pages||{})[0],ii=p?.imageinfo?.[0];
  if(!ii?.thumburl)throw new Error('missing');
  el.outerHTML='<a class="realImg '+(el.classList.contains('primary')?'primary':'')+'" href="'+E(ii.descriptionurl||commonsPage(file))+'" target="_blank" rel="noopener"><img src="'+E(ii.thumburl)+'" alt="'+E(label)+'" loading="lazy"><div class="realCap"><b>'+E(label)+'</b><span>'+E(credit)+'</span></div></a>';
 }catch(e){el.innerHTML='<div class="realUnavailable">Curated visual temporarily unavailable.</div>'}
}
window.INTELLECTUALITY_REAL_VISUAL_HYDRATE=function(root=document){
 root.querySelectorAll('.realCuratedSlot[data-commons-file]').forEach(hydrateCurated);
 root.querySelectorAll('.commonsDynamic[data-commons-query]').forEach(hydrateOne);
};
})();