(function(){
const E=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const V=[
 {id:'6XtPzcXAqBc',by:'Ninja Nerd',title:'Gross Anatomy of the Spinal Cord',terms:['spinal cord','dorsal root','ventral root','gray matter','white matter','cauda equina','filum terminale','meninges']},
 {id:'ADAOsuaOSCk',by:'Ninja Nerd',title:'Brainstem orientation',terms:['brainstem','brain stem','pons','medulla','midbrain','cranial nerve nuclei']},
 {id:'NVsrexn3pT8',by:'Ninja Nerd',title:'Cerebellum anatomy & function',terms:['cerebellum','cerebellar','fourth ventricle','ataxia']},
 {id:'hxvep2Y8ShI',by:'Ninja Nerd',title:'Basal ganglia direct / indirect pathways',terms:['basal ganglia','basal nuclei','direct pathway','indirect pathway','parkinson','chorea']},
 {id:'FnCiLD4gARI',by:'Ninja Nerd',title:'Visual system & optic pathway',terms:['vision','visual pathway','optic nerve','optic tract','retina','visual field','phototransduction']},
 {id:'V8AZ6QygeYs',by:'Ninja Nerd',title:'Auditory pathway / CN VIII',terms:['auditory','hearing','cochlea','vestibulocochlear','cn viii']},
 {id:'MXARAn1avCk',by:'Dr Matt & Dr Mike',title:'The Spinal Cord',terms:['spinal cord','sensory tract','motor tract','spinothalamic','corticospinal','brown sequard','upper motor','lower motor']},
 {id:'xXk5BOAO7rc',by:'Dr Matt & Dr Mike',title:'Overview of the Brain',terms:['brain','cerebrum','cortex','thalamus','hypothalamus','basal ganglia','brainstem','cerebellum']},
 {id:'N3DyeW0Dh30',by:'Dr Matt & Dr Mike',title:'Introduction to the Nervous System',terms:['nervous system','neuron','glia','afferent','efferent','sensory receptor']},
 {id:'fhiJo1QYGtA',by:'Dr Matt & Dr Mike',title:'Synaptic Transmission',terms:['synapse','synaptic','neurotransmitter','glutamate','gaba','calcium channel','epsp','ipsp']},
 {id:'D1zkVBHPh5c',by:'AnatomyZone',title:'Basic Parts of the Brain · 3D',terms:['brain','brainstem','cerebellum','thalamus','basal ganglia','ventricle','cortex','lobes','internal capsule']},
 {id:'8hC6NGQReL4',by:'AnatomyZone',title:'Basic Parts of the Brain · Part 2',terms:['brain','basal ganglia','internal capsule','ventricle','white matter']},
 {id:'xXWsQrl1N7s',by:'AnatomyZone',title:'Spinal Cord External Anatomy · 3D',terms:['spinal cord','cauda equina','filum terminale','dorsal root','ventral root','spinal nerve']},
 {id:'vFp_qNifHzw',by:'AnatomyZone',title:'Cranial Nerves Basics · 3D',terms:['cranial nerve','trigeminal','facial nerve','vagus','glossopharyngeal','hypoglossal','accessory','oculomotor','trochlear','abducens']},
 {id:'tRbctv7JNDc',by:'Sam Webster',title:'Nervous system anatomy introduction',terms:['nervous system','neuroanatomy','brainstem','spinal cord','cranial nerves']},
 {id:'6ACHDdalgk0',by:'Sam Webster',title:'Cerebellum anatomy',terms:['cerebellum','cerebellar','ataxia']},
 {id:'vitc1_JjGxo',by:'Sam Webster',title:'Histology of the retina',terms:['retina','retinal','photoreceptor','histology eye']},
 {id:'KCVXUOMgt-E',by:'Kenhub',title:'Structure of the spinal cord',terms:['spinal cord','conus medullaris','spinal nerves','spinal dura','gray matter','white matter']},
 {id:'fbt3H3JxRMA',by:'2-Minute Neuroscience',title:'Spinal Cord Cross-section',terms:['spinal cord','gray matter','white matter','posterior horn','anterior horn','funiculi']},
 {id:'nQfRUehU4zQ',by:'2-Minute Neuroscience',title:'Dorsal Columns · Medial Lemniscus',terms:['dorsal column','medial lemniscus','fine touch','vibration','proprioception']},
 {id:'OD2KPSGZ1No',by:'2-Minute Neuroscience',title:'Basal Ganglia',terms:['basal ganglia','direct pathway','indirect pathway','caudate','putamen','globus pallidus']},
 {id:'Fir-v6EoZNE',by:'2-Minute Neuroscience',title:'Cerebellum',terms:['cerebellum','cerebellar','peduncle','vermis','flocculonodular']},
 {id:'uMMMqkVZAhk',by:'2-Minute Neuroscience',title:'Blood Supply of the Brain',terms:['blood supply','circle of willis','cerebral artery','carotid','vertebral artery','basilar']},
 {id:'P3aYqxGesqs',by:'2-Minute Neuroscience',title:'Vestibular System',terms:['vestibular','semicircular','utricle','saccule','equilibrium','balance']},
 {id:'fZDAwXh54is',by:'2-Minute Neuroscience',title:'The Retina',terms:['retina','rod','cone','fovea','photoreceptor','optic disc']},
 {id:'CIkgQcmv0Xs',by:'2-Minute Neuroscience',title:'The Meninges',terms:['meninges','dura','arachnoid','pia','subarachnoid','lumbar cistern']},
 {id:'qJXZD2gaLMU',by:'Dr Matt & Dr Mike',title:'Neurotransmitters',terms:['neurotransmitter','acetylcholine','gaba','glutamate','dopamine']},
 {id:'AG7Ev2hJGFk',by:'Dr Matt & Dr Mike',title:'Types of Sensory Receptors',terms:['sensory receptor','mechanoreceptor','thermoreceptor','nociceptor','afferent']},
 {id:'cG5ZuK0_qtc',by:'Armando Hasudungan',title:'Visual Field Pathway and Defects',terms:['visual pathway','visual field','hemianopia','optic nerve','optic chiasm','optic tract']},
 {id:'NEenJCk3EIE',by:'Armando Hasudungan',title:'Cranial Nerves · Functions and Disorders',terms:['cranial nerve','facial nerve','trigeminal','vagus','glossopharyngeal','hypoglossal','accessory']}
];
const CONCEPTS=[
 [/dorsal root|ventral root|root ganglion|spinal nerve/i,'spinal nerve dorsal root ganglion anatomy'],
 [/spinal cord|gray matter|white matter|funicul|horn/i,'spinal cord cross section anatomy'],
 [/mening|dura|arachnoid|pia|subarachnoid|lumbar cistern/i,'spinal meninges anatomy'],
 [/synap|neurotrans|vesicle|glutamate|gaba|epsp|ipsp|calcium channel/i,'chemical synapse diagram'],
 [/neuron|dendrite|axon hillock|myelin/i,'neuron anatomy diagram'],
 [/astrocy|oligodendro|microglia|ependym|neuroglia/i,'neuroglia histology'],
 [/dorsal column|medial lemniscus|proprioception|fine touch/i,'dorsal column medial lemniscus pathway'],
 [/spinothalam|pain|temperature|referred pain/i,'spinothalamic tract pain pathway'],
 [/corticospinal|pyramidal|upper motor|lower motor|umn|lmn/i,'corticospinal tract motor pathway'],
 [/cerebell/i,'human cerebellum anatomy'],
 [/brainstem|midbrain|pons|medulla/i,'human brainstem anatomy'],
 [/ventric|csf|aqueduct|choroid plexus/i,'brain ventricular system csf anatomy'],
 [/circle of willis|cerebral arter|blood supply|carotid/i,'cerebral arteries circle of Willis anatomy'],
 [/basal gang|caudate|putamen|globus|subthalam|substantia nigra/i,'basal ganglia anatomy coronal'],
 [/thalam|hypothalam/i,'thalamus hypothalamus anatomy'],
 [/motor cortex|sensory cortex|homunculus/i,'motor sensory homunculus brain'],
 [/corpus callos|commissur|association fibre|projection fibre|internal capsule/i,'brain white matter tracts internal capsule'],
 [/retina|photoreceptor|rod|cone|macula|fovea/i,'human retina histology'],
 [/cornea|sclera|lens|iris|uvea/i,'human eye histology cornea retina'],
 [/optic|visual field|hemianop/i,'visual pathway optic tract diagram'],
 [/cochlea|organ of corti|hair cell/i,'organ of Corti cochlea histology'],
 [/vestibul|semicircular|equilibrium/i,'vestibular apparatus inner ear anatomy'],
 [/auditory|hearing/i,'auditory pathway anatomy'],
 [/cranial nerve|trigeminal|facial nerve|vagus|glossopharyngeal|hypoglossal|accessory nerve/i,'cranial nerves brainstem anatomy'],
 [/parotid/i,'parotid gland facial nerve anatomy'],
 [/temporomandibular|tmj/i,'temporomandibular joint anatomy'],
 [/pterygopalatine|maxillary nerve|v2/i,'pterygopalatine fossa maxillary nerve anatomy'],
 [/mandibular nerve|v3|otic ganglion/i,'mandibular nerve v3 anatomy'],
 [/orbit|extraocular|oculomotor|trochlear|abducens/i,'orbit extraocular muscles cranial nerves anatomy'],
 [/larynx|vocal fold|cricoid|thyroid cartilage/i,'larynx anatomy vocal folds'],
 [/pharynx|soft palate/i,'pharynx soft palate anatomy'],
 [/tongue|oral cavity/i,'tongue oral cavity anatomy'],
 [/thyroid gland/i,'thyroid gland neck anatomy'],
 [/submandibular/i,'submandibular gland lingual nerve anatomy'],
 [/scalp|face muscles|facial expression/i,'face muscles facial nerve anatomy'],
 [/neck triangle|sternocleidomastoid|cervical plexus|scalene/i,'neck triangles cervical plexus anatomy'],
 [/embry|neural tube|neural crest|pharyngeal arch|palate development/i,'embryology neural tube pharyngeal arches diagram'],
 [/sleep|eeg|alpha wave|beta wave|rem/i,'EEG sleep stages diagram'],
 [/speech|aphasia|broca|wernicke/i,'language areas brain Broca Wernicke anatomy'],
 [/memory|hippocamp/i,'hippocampus memory anatomy']
];
function lessonById(id){for(const d of window.COURSE?.days||[]){const l=(d.lessons||[]).find(x=>x.id===id);if(l)return l}return null}
function findLessonFromNode(node){
 const host=node.closest('[data-lesson-id]');if(host)return lessonById(host.dataset.lessonId);
 const h2=node.closest('.stage')?.querySelector('h2')?.textContent?.trim();
 if(h2){for(const d of window.COURSE?.days||[]){const l=(d.lessons||[]).find(x=>x.topic===h2);if(l)return l}}
 return null;
}
function findQ(text){
 const n=norm(text);if(!n)return null;
 return (window.EHSAN_QBANK?.questions||[]).find(q=>{const s=norm(q.stem);return s===n||n.includes(s)||s.includes(n)})||null;
}
function queryFor(text,l){
 const t=String(text||'');
 for(const [re,q] of CONCEPTS)if(re.test(t+' '+(l?.topic||'')))return q;
 if(l?.subject==='HISTOLOGY')return (l.topic||'nervous tissue')+' histology micrograph';
 if(l?.subject==='PHYSIOLOGY')return (l.topic||'nervous system')+' physiology diagram neuroanatomy';
 return (l?.topic||'human neuroanatomy')+' anatomy';
}
function videoScore(v,text,l){
 const hay=norm((l?.topic||'')+' '+text);let s=0;
 for(const term of v.terms){if(hay.includes(norm(term)))s+=4}
 if(l?.video?.id===v.id)s+=10;
 if(l?.subject==='ANATOMY'&&/AnatomyZone|Sam Webster|Kenhub/.test(v.by))s+=2;
 if(l?.subject==='PHYSIOLOGY'&&/Ninja Nerd|Dr Matt/.test(v.by))s+=2;
 if(l?.subject==='HISTOLOGY'&&/Sam Webster|Kenhub/.test(v.by))s+=2;
 return s;
}
function bestVideos(text,l,n=2){
 const x=[...V];
 if(l?.video?.id&&!x.some(v=>v.id===l.video.id))x.push({id:l.video.id,by:'Course routed video',title:l.video.title||l.topic,terms:[l.topic]});
 return x.map(v=>({v,s:videoScore(v,text,l)})).filter(x=>x.s>=4).sort((a,b)=>b.s-a.s).slice(0,n).map(x=>x.v);
}
function ytStart(v,l){return l?.video?.id===v.id?(l.video.start||0):0}
function ytEnd(v,l){return l?.video?.id===v.id?(l.video.end||0):0}
function ytHref(v,l){const start=ytStart(v,l);return 'https://www.youtube.com/watch?v='+encodeURIComponent(v.id)+(start?'&t='+start+'s':'')}
function ytCard(v,l,mini=false){
 const start=ytStart(v,l),end=ytEnd(v,l);
 return '<a class="ctxVideo '+(mini?'mini':'')+'" href="'+ytHref(v,l)+'" data-ctx-video="'+E(v.id)+'" data-ctx-start="'+start+'" data-ctx-end="'+end+'" data-ctx-title="'+E(v.title)+'"><div class="ctxThumb"><img src="https://i.ytimg.com/vi/'+E(v.id)+'/hqdefault.jpg" alt="'+E(v.title)+'" loading="lazy"><span>▶</span></div><div class="ctxVideoMeta"><b>'+E(v.by)+'</b><small>'+E(v.title)+(end>start?' · '+Math.max(1,Math.round((end-start)/60))+' min routed window':'')+'</small></div></a>';
}
function openVideo(id,start,title,end=0){
 let m=document.querySelector('#ctxVideoModal');
 if(!m){m=document.createElement('div');m.id='ctxVideoModal';m.className='ctxModal';m.innerHTML='<div class="ctxModalCard"><button class="ctxModalClose" aria-label="Close">✕</button><div class="ctxModalTitle"></div><div class="ctxModalFrame"></div></div>';document.body.appendChild(m);m.querySelector('.ctxModalClose').onclick=()=>closeVideo();m.onclick=e=>{if(e.target===m)closeVideo()}}
 m.querySelector('.ctxModalTitle').textContent=title||'Visual teacher';
 const s=Number(start)||0,e=Number(end)||0,windowEnd=e>s?'&end='+e:'';
 m.querySelector('.ctxModalFrame').innerHTML='<iframe src="https://www.youtube.com/embed/'+E(id)+'?start='+s+windowEnd+'&rel=0&playsinline=1&autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
 m.classList.add('open');document.body.style.overflow='hidden';
}
function closeVideo(){const m=document.querySelector('#ctxVideoModal');if(!m)return;m.classList.remove('open');const f=m.querySelector('.ctxModalFrame');if(f)f.innerHTML='';document.body.style.overflow=''}
function wireVideos(root=document){
 root.querySelectorAll('[data-ctx-video]').forEach(a=>{if(a.dataset.ctxVideoWired)return;a.dataset.ctxVideoWired='1';a.addEventListener('click',e=>{e.preventDefault();openVideo(a.dataset.ctxVideo,a.dataset.ctxStart,a.dataset.ctxTitle,a.dataset.ctxEnd)})});
}
function companion(node,l,kind){
 const text=(node.innerText||node.textContent||'').replace(/\s+/g,' ').trim();
 if(text.length<18)return null;
 const q=findQ(text),query=queryFor((q?.stem||'')+' '+(q?.answerText||'')+' '+text,l),vids=bestVideos(text,l,1);
 const shell=document.createElement('div');shell.className='ctxCompanion';shell.dataset.ctxQuery=query;shell.dataset.ctxKind=kind||'explain';
 if(q?.visualData){
   shell.innerHTML='<div class="ctxImage source"><img src="'+q.visualData+'" alt="Actual source-bank visual" loading="lazy"><div class="ctxSource">ACTUAL SOURCE-BANK FIGURE · p.'+E(q.page||'—')+'</div></div>'+(vids[0]?ytCard(vids[0],l,true):'');
 }else{
   shell.innerHTML='<div class="ctxImage commons"><div class="ctxLoading">visualizing…</div></div>'+(vids[0]?ytCard(vids[0],l,true):'');
 }
 return shell;
}
const cache=new Map();
async function commonsOne(query){
 if(cache.has(query))return cache.get(query);
 try{
  const u='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(query)+'&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=700&format=json&origin=*';
  const r=await fetch(u),j=await r.json();
  const rows=Object.values(j.query?.pages||{}).map(p=>{const ii=p.imageinfo?.[0]||{};return{title:p.title||'',thumb:ii.thumburl,url:ii.descriptionurl||'',license:ii.extmetadata?.LicenseShortName?.value||'Commons',mime:ii.mime||''}}).filter(x=>x.thumb&&/^image\/(jpeg|png|webp|svg\+xml)/.test(x.mime)&&!/logo|flag|coat of arms|icon|portrait/i.test(x.title));
  const hit=rows[0]||null;cache.set(query,hit);return hit;
 }catch(_){cache.set(query,null);return null}
}
async function hydrate(shell){
 if(shell.dataset.ctxLoaded)return;shell.dataset.ctxLoaded='1';
 const box=shell.querySelector('.ctxImage.commons');if(!box)return;
 const hit=await commonsOne(shell.dataset.ctxQuery||'human neuroanatomy');
 if(!hit){box.innerHTML='<div class="ctxMissing">No useful real image found</div>';return}
 box.innerHTML='<a href="'+E(hit.url)+'" target="_blank" rel="noopener"><img src="'+E(hit.thumb)+'" alt="'+E(hit.title.replace(/^File:/,''))+'" loading="lazy"><span>'+E(hit.title.replace(/^File:/,'').replace(/_/g,' '))+'</span></a>';
}
let ctxObserver=null;
function scheduleHydrate(shell){
 if(shell.dataset.ctxScheduled)return;shell.dataset.ctxScheduled='1';
 if(!('IntersectionObserver'in window)){hydrate(shell);return}
 if(!ctxObserver)ctxObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){ctxObserver.unobserve(e.target);hydrate(e.target)}}),{rootMargin:'420px 0px'});
 ctxObserver.observe(shell);
}
function wrapTarget(node,l,kind){
 if(node.dataset.ctxWrapped||node.closest('.ctxCompanion'))return;
 node.dataset.ctxWrapped='1';
 const parent=node.parentNode;if(!parent)return;
 const row=document.createElement('div');row.className='ctxRow';row.dataset.lessonId=l?.id||'';
 parent.insertBefore(row,node);row.appendChild(node);
 const c=companion(node,l,kind);if(c){row.appendChild(c);scheduleHydrate(c)}
}
function questionTargets(root){
 const out=[...root.querySelectorAll('.mockQ h3,.sourcePrompt')];
 root.querySelectorAll('.stage > h3').forEach(h=>{const st=h.closest('.stage');if(st?.querySelector('.confidence,.mockOpt,[data-act*="choice"]'))out.push(h)});
 root.querySelectorAll('.stage > h2').forEach(h=>{const st=h.closest('.stage');if(st?.querySelector('.writtenBoss')&&h.textContent.trim().length>18)out.push(h)});
 return [...new Set(out)];
}
function visibleExplainTargets(root){
 return [...root.querySelectorAll('.spoonFact,.spoonCard,.kasrMove,.professorLead,.professorModel,.professorExam,.professorTrap,.professorVisual,.professorCheck,.mental,.repair,.writtenBoss,.practicalBoss')].filter(x=>!x.closest('.deepOptional'));
}
function deepTargets(details){return [...details.querySelectorAll('.pstep,.professorLead,.professorModel,.professorExam,.professorTrap,.professorVisual,.professorCheck')]}
function lecturerStrip(root){
 const host=root.querySelector('.spoonShell');if(!host||root.querySelector('.lecturerStrip'))return;
 const l=findLessonFromNode(host)||(()=>{const h=root.querySelector('.stage h2')?.textContent;for(const d of window.COURSE?.days||[]){const x=(d.lessons||[]).find(z=>z.topic===h);if(x)return x}})();
 if(!l)return;const vids=bestVideos(l.topic,l,3);if(!vids.length)return;
 const strip=document.createElement('div');strip.className='lecturerStrip';strip.dataset.lessonId=l.id;
 strip.innerHTML='<div class="lecturerTitle">REAL VISUAL TEACHERS · pick only if the professor feed needs another angle</div><div class="lecturerGrid">'+vids.map(v=>ytCard(v,l,false)).join('')+'</div>';
 host.parentNode.insertBefore(strip,host.nextSibling);
}
window.INTELLECTUALITY_CONTEXT_VISUALS=function(root=document){
 const scope=root.querySelector?.('#player')||root;
 visibleExplainTargets(scope).forEach(n=>wrapTarget(n,findLessonFromNode(n),'explain'));
 questionTargets(scope).forEach(n=>{
   const q=findQ(n.textContent||'');let l=q?.lessonIds?.[0]?lessonById(q.lessonIds[0]):findLessonFromNode(n);
   wrapTarget(n,l,'question');
 });
 lecturerStrip(scope);
 wireVideos(scope);
 scope.querySelectorAll('.deepOptional').forEach(d=>{
   if(d.dataset.ctxHook)return;d.dataset.ctxHook='1';
   d.addEventListener('toggle',()=>{if(d.open){deepTargets(d).forEach(n=>wrapTarget(n,findLessonFromNode(d)||findLessonFromNode(n),'deep'));wireVideos(d)}});
   if(d.open){deepTargets(d).forEach(n=>wrapTarget(n,findLessonFromNode(d)||findLessonFromNode(n),'deep'));wireVideos(d)};
 });
};
})();