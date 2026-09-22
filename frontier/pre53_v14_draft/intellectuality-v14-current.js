(function(){
'use strict';
const VERSION='14.0';
const E=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const safe=(fn,f=null)=>{try{return fn()}catch(e){console.warn('[v14]',e);return f}};
const STOP=new Set(('what which where when why how whose whom is are was were be been being a an the of in on at by for from to with without and or not except following true false incorrect correct best most least regarding about into through during between among as than this that these those it its their his her can could would should may might do does did has have had all any each one two three four five patient patients nerve nerves artery arteries muscle muscles').split(' '));
let visualObserver=null;const exactVisualCache=new Map(),searchVisualCache=new Map();
function V(){
 S.v14=S.v14||{version:VERSION,primed:{},visualAssignments:{},visualUsed:{},calendar:{},stats:{primersSeen:0,visualsAssigned:0}};
 const v=S.v14;v.version=VERSION;v.primed=v.primed||{};v.visualAssignments=v.visualAssignments||{};v.visualUsed=v.visualUsed||{};v.calendar=v.calendar||{};v.stats=v.stats||{primersSeen:0,visualsAssigned:0};return v
}
function localYMD(d=new Date()){const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())}
function fmtDate(d=new Date()){return new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short'}).format(d)}
function planDayForDate(ymd=localYMD()){
 const exact=(C.days||[]).find(d=>d.date===ymd);if(exact)return exact.day;
 const start=C.protocol?.start||C.days?.[0]?.date,end=C.protocol?.end||C.days?.at(-1)?.date;
 if(ymd<start)return 1;if(ymd>end)return C.days.length;
 let best=1;for(const d of C.days||[]){if(d.date<=ymd)best=d.day;else break}return best
}
function trulyFresh(){
 const seg=Object.keys(S.segments||{}).filter(k=>S.segments[k]).length,q=Object.keys(S.qbank?.results||{}).length;
 return !(S.doneDays||[]).length&&seg===0&&q===0&&(S.xp||0)===0
}
function syncCalendar(){
 const v=V(),today=localYMD(),target=planDayForDate(today),before=S.day;
 v.calendar={today,targetDay:target,currentDay:S.day,planDate:C.days?.[target-1]?.date||'',syncedAt:new Date().toISOString(),autoAligned:false};
 if(target>S.day&&(trulyFresh()||(S.doneDays||[]).includes(S.day))){
   S.day=target;v.calendar.currentDay=S.day;v.calendar.autoAligned=true;safe(()=>save())
 }
 v.calendar.debt=Math.max(0,target-S.day);v.calendar.ahead=Math.max(0,S.day-target);
 return {before,after:S.day,...v.calendar}
}
function decorateCalendar(){
 const c=syncCalendar(),d=safe(()=>day(),null),top=document.querySelector('.courseTopbar');if(!top)return;
 let chip=document.querySelector('#v14Calendar');if(!chip){chip=document.createElement('div');chip.id='v14Calendar';chip.className='v14Calendar';const crumb=top.querySelector('.courseCrumb');crumb?.insertAdjacentElement('afterend',chip)}
 const actual=fmtDate(new Date()),scheduled=d?.date?new Date(d.date+'T12:00:00'):null;
 let status='TODAY · '+actual.toUpperCase();
 if(c.debt>0)status+=' · '+c.debt+' DAY'+(c.debt===1?'':'S')+' CARRYOVER';
 else if(c.ahead>0)status+=' · AHEAD';
 chip.textContent=status;
 chip.classList.toggle('behind',c.debt>0);
 const ey=document.querySelector('#eyebrow');
 if(ey&&d?.date){const plan=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'}).format(scheduled);ey.textContent='REAL DATE '+actual.toUpperCase()+(c.debt>0?' · FINISHING '+plan.toUpperCase()+' CARRYOVER':' · PLAN DAY '+d.day)}
 const stage=document.querySelector('#player .stage');
 if(stage&&c.debt>0&&!stage.querySelector('.v14Carryover')){
   const b=document.createElement('div');b.className='v14Carryover';b.innerHTML='<b>CALENDAR AWARE</b><span>Today is '+E(actual)+'. This is unfinished '+E(new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short'}).format(scheduled))+' work, carried forward deliberately. It will not pretend today is yesterday.</span>';stage.prepend(b)
 }
}
function qAnswer(q){return q?.answerText||safe(()=>correctOptionText(q),'')||q?.options?.find(o=>q.answerKeys?.includes(o.key))?.text||''}
function lessonById14(id){for(const d of C.days||[]){const l=(d.lessons||[]).find(x=>x.id===id);if(l)return l}return null}
function lessonFit(l,q){
 const target=(q?.stem||'')+' '+qAnswer(q)+' '+(q?.chapter||''),p=professor(l),text=(l?.topic||'')+' '+(l?.mental||'')+' '+(l?.facts||[]).flat().join(' ')+' '+(p.teach||[]).join(' ')+' '+(p.mental||'');
 return overlap(text,target)*4+overlap(l?.topic||'',target)*6
}
function bestLessonForQ(q,fallback=null){
 const ls=(q?.lessonIds||[]).map(lessonById14).filter(Boolean);if(!ls.length)return fallback;
 return ls.sort((a,b)=>lessonFit(b,q)-lessonFit(a,q))[0]||fallback
}
function tokens(s){return [...new Set(norm(s).split(' ').filter(w=>w.length>3&&!STOP.has(w)&&!/^[a-d]$/.test(w)))].slice(0,24)}
function overlap(text,target){const set=new Set(tokens(target));return tokens(text).reduce((n,w)=>n+(set.has(w)?1:0),0)}
function professor(l){return window.INTELLECTUALITY_PROFESSOR?.[l?.id]||{}}
function deep(l){return window.INTELLECTUALITY_DEEP?.[l?.id]?.deep||[]}
function relevantFact(l,q){
 const target=(q?.stem||'')+' '+qAnswer(q);const rows=(l?.facts||[]).map(x=>({q:x[0],a:x[1],s:overlap(x[0]+' '+x[1],target)})).sort((a,b)=>b.s-a.s);return rows[0]||null
}
function relevantDeep(l,q){
 const target=(q?.stem||'')+' '+qAnswer(q);return deep(l).map(x=>({text:x,s:overlap(x,target)})).sort((a,b)=>b.s-a.s)[0]?.text||''
}
function mentalModel(l,q){
 l=bestLessonForQ(q,l);const p=professor(l),f=relevantFact(l,q),d=relevantDeep(l,q);
 const model=p.mental||l?.mental||p.seed?.minimumModel||'';
 return {fact:f,deep:d,model,draw:l?.draw||p.draw||'',exam:l?.exam||p.examGrammar||'',subject:l?.subject||q?.subject||''}
}
function cleanQueryWords(q,l){
 const ans=qAnswer(q),base=tokens((q?.stem||'')+' '+ans).slice(0,8),topic=tokens(l?.topic||q?.chapter||'').slice(0,5);
 return [...new Set([...base,...topic])].slice(0,10).join(' ')
}
function conceptAlias(q,l){
 if(q?._visualAlias)return String(q._visualAlias).trim();
 const qtext=norm((q?.stem||'')+' '+qAnswer(q)+' '+(q?.chapter||'')),context=norm(qtext+' '+(l?.topic||''));
 const rules=[
  [/\bionotropic\b|\bmetabotropic\b|ligand gated|synaptic cleft|v snare|t snare/,'chemical synapse ionotropic receptor'],
  [/peripheral nerve|perineur|epineur|endoneur|sheath of henle/,'peripheral nerve histology'],
  [/tendon spindle|golgi tendon/,'golgi tendon organ muscle spindle'],
  [/muscle spindle|intrafusal/,'muscle spindle histology'],
  [/ruffini|pacinian|meissner|free nerve ending/,'cutaneous sensory receptor histology'],
  [/mening|\bdura\b|arachnoid|pia mater|denticulate/,'spinal cord meninges pia arachnoid dura'],
  [/dorsal root ganglion|ventral root|spinal nerve|nerve root/,'spinal nerve dorsal root ganglion'],
  [/spinal cord|gray matter|grey matter|dorsal horn|ventral horn|funicul/,'spinal cord cross section anatomy'],
  [/spinothalam|pain pathway|anterolateral/,'spinothalamic tract pathway'],
  [/dorsal column|medial lemnisc/,'dorsal column medial lemniscus pathway'],
  [/corticospinal|pyramidal tract/,'corticospinal tract pathway'],
  [/brainstem|midbrain|\bpons\b|medulla/,'human brainstem anatomy'],
  [/cerebell/,'human cerebellum anatomy'],
  [/basal gangl|caudate|putamen|globus pallidus/,'basal ganglia anatomy'],
  [/internal capsule/,'internal capsule neuroanatomy'],
  [/thalam|hypothalam/,'thalamus hypothalamus anatomy'],
  [/ventric|\bcsf\b|cerebrospinal/,'ventricular system cerebrospinal fluid anatomy'],
  [/circle of willis|cerebral arter|blood supply|middle cerebral|anterior cerebral|posterior cerebral/,'circle of Willis cerebral arteries'],
  [/\bretina\b|photoreceptor|\brods?\b|\bcones?\b/,'retina histology photoreceptors'],
  [/optic|visual pathway|hemianop|visual field/,'visual pathway optic chiasm'],
  [/cochlea|organ of corti|hair cell/,'organ of Corti cochlea anatomy'],
  [/vestibul|semicircular|utricle|saccule/,'vestibular apparatus anatomy'],
  [/facial nerve|cranial nerve vii/,'facial nerve anatomy'],
  [/trigeminal|mandibular nerve|\bv3\b|maxillary nerve|\bv2\b/,'trigeminal nerve anatomy'],
  [/glossopharyngeal|vagus|hypoglossal|accessory nerve/,'cranial nerves anatomy'],
  [/parotid|submandibular|salivary/,'salivary glands anatomy'],
  [/orbit|extraocular|oculomotor|trochlear|abducens/,'orbit extraocular muscles anatomy'],
  [/larynx|vocal cord|recurrent laryngeal/,'larynx anatomy'],
  [/pharynx|soft palate/,'pharynx anatomy'],
  [/tongue|lingual/,'tongue anatomy'],
  [/thyroid/,'thyroid gland anatomy'],
  [/synap|neurotransmitter|\bepsp\b|\bipsp\b/,'chemical synapse diagram'],
  [/reflex|muscle spindle|golgi tendon/,'stretch reflex muscle spindle diagram'],
  [/neuron|neuroglia|astrocyte|oligodendrocyte|microglia/,'nervous tissue histology'],
  [/embry|neural tube|neural crest/,'neural tube embryology'],
  [/sleep|\beeg\b/,'sleep EEG stages diagram'],
  [/memory|hippocamp/,'hippocampus memory anatomy']
 ];
 for(const [re,x] of rules)if(re.test(qtext))return x;
 for(const [re,x] of rules)if(re.test(context))return x;
 return''
}
const CONCEPT_FILES={
 'spinal cord cross section anatomy':['Spinal_Cord_Sectional_Anatomy.png','Cross-section_through_the_spinal_cord.jpg','Spinal_cord_tracts_-_English.svg'],
 'spinal cord meninges pia arachnoid dura':['Spinal cord and roots and dural tube which covers them. Wellcome L0002010.jpg','Spinal_Cord_Sectional_Anatomy.png'],
 'chemical synapse ionotropic receptor':['Ion-Channel Receptor.svg','LGIC.png','Chemical synapse schema.jpg','Synapse Illustration2 tweaked.svg'],
 'chemical synapse diagram':['Chemical synapse schema.jpg','Synapse Illustration2 tweaked.svg','LGIC.png'],
 'peripheral nerve histology':['1319 Nerve StructureN EU.jpg','Epineuro, Perineuro, Endoneuro..png','Поперечний нерв.jpg','Diagrammatic representation of uninjured and injured nerve.jpg'],
 'golgi tendon organ muscle spindle':['Gray938.png','Tendon organ model.jpg','Muscle spindle model.jpg','Muscle Spindle LM HE stain.jpg'],
 'muscle spindle histology':['Muscle Spindle LM HE stain.jpg','Muscle spindle (01).jpg','Muscle spindle model without labels.jpg','Muscle spindle Diagrammatic-representation-of-muscle-spindle.png'],
 'human brainstem anatomy':['Human_brainstem_anterior_view_2_description.JPG','Human_caudal_brainstem_posterior_view_description.JPG'],
 'human cerebellum anatomy':['Human_cerebellum_anterior_view.JPG','Sobo_1909_658.png','Human_cerebellum_under_a_microscope.jpg'],
 'basal ganglia anatomy':['Basal-ganglia-coronal-sections-large.png','Anatomy_of_the_basal_ganglia.jpg','Basal_ganglia_circuits.svg'],
 'circle of Willis cerebral arteries':['Circle_of_Willis_en.svg'],
 'visual pathway optic chiasm':['Diagram_of_the_visual_pathway.png','Optic_pathway.png','Hemianopsia_en.jpg'],
 'organ of Corti cochlea anatomy':['Structure_of_the_cochlea_and_organ_of_Corti.png','Organ_of_corti.png','Organ_of_corti_in_cross_section.svg','Organ_of_Corti_unlabeled.svg'],
 'facial nerve anatomy':['Schematic_drawing_of_the_facial_nerve.png','VIIth_Nerve.jpg'],
 'salivary glands anatomy':['Salivary_glands_numbered.svg','Schematic_drawing_of_the_facial_nerve.png']
};
function curatedFilesFor(q,l){return CONCEPT_FILES[conceptAlias(q,bestLessonForQ(q,l))]||[]}
function queriesFor(q,l){
 l=bestLessonForQ(q,l);const full=cleanQueryWords(q,l)||norm(l?.topic||q?.chapter||'human nervous system'),words=full.split(' '),short=words.slice(0,5).join(' '),tiny=words.slice(0,3).join(' ');
 const sub=l?.subject||q?.subject||'',topic=String(l?.topic||q?.chapter||'').replace(/\b(I|II|and|with|of|the|from|to|versus)\b/gi,' ').replace(/\s+/g,' ').trim(),alias=conceptAlias(q,l);
 let qs=[];
 if(sub==='HISTOLOGY')qs=[alias&&(alias+' histology micrograph'),topic+' histology micrograph',short+' histology',tiny+' microscopy'];
 else if(sub==='PHYSIOLOGY')qs=[alias&&(alias+' physiology diagram'),topic+' physiology diagram',short+' neurophysiology',tiny+' neuroscience diagram'];
 else qs=[alias,topic+' anatomy',short+' anatomy',tiny+' anatomy diagram',topic+' dissection'];
 return [...new Set(qs.map(x=>x.trim()).filter(x=>x&&x.length>5))].slice(0,6)
}
function visualRole(q,l){
 const s=norm((q?.stem||'')+' '+(q?.failureType||'')+' '+(q?.dimension||'')),sub=l?.subject||q?.subject||'';
 if(sub==='HISTOLOGY')return'MICROGRAPH → 3 DISCRIMINATORS → REJECT LOOK-ALIKE';
 if(/lesion|injury|deficit|syndrome|damage/.test(s))return'LOCALIZE → DAMAGED STRUCTURE → PREDICT DEFICIT';
 if(/arter|vein|supply|blood/.test(s))return'TRACE THE VESSEL → TERRITORY → CONSEQUENCE';
 if(/tract|pathway|cross|decussat/.test(s))return'TRACE → SYNAPSE → CROSSING → DESTINATION';
 if(sub==='PHYSIOLOGY')return'INPUT → MECHANISM → OUTPUT → PERTURBATION';
 return'ORIENT → RELATIONS → ROUTE / SUPPLY / INNERVATION → APPLY'
}
function egyptianCommand(q,l,wrong=false){
 const s=norm((q?.stem||'')+' '+qAnswer(q)+' '+(q?.failureType||'')+' '+(q?.dimension||'')),sub=l?.subject||q?.subject||'';
 if(sub==='HISTOLOGY'||/look alike|differentiat|distinguish|identify|microscop|histolog/.test(s))return{ar:'طلّع شبيهه برّه',en:'Kill the look-alike',cue:'امسك العلامة الفاصلة قبل ما تبص للاختيارات.'};
 if(/lesion|injury|deficit|syndrome|damage|paralysis/.test(s))return{ar:'حدّد الإصابة',en:'Localize the lesion',cue:'مكان الإصابة الأول، وبعدها توقّع اللي هيبوظ.'};
 if(/tract|pathway|cross|decussat|course|passes through/.test(s))return{ar:'امشي المسار',en:'Trace the route',cue:'ابدأ من الأول وامشي محطة محطة، وفين بيكروس؟'};
 if(/arter|vein|blood supply|vascular|territory/.test(s))return{ar:'مين بيغذّيه؟',en:'Trace the supply',cue:'الشريان → المنطقة → لو اتسد هيحصل إيه؟'};
 if(/innerv|cranial nerve|motor nerve|sensory nerve/.test(s))return{ar:'مين معصّبه؟',en:'Find the nerve',cue:'العصب جاي منين، ماشي فين، وبيعمل إيه؟'};
 if(sub==='PHYSIOLOGY'||/increase|decrease|mechanism|receptor|reflex|stimulat|inhibit|excite/.test(s))return{ar:'شغّل الميكانيزم',en:'Run the mechanism',cue:'مين بدأ؟ مين رد؟ ولو غيّرنا خطوة، الباقي يحصل له إيه؟'};
 if(/relation|anterior|posterior|medial|lateral|superior|inferior|foramen|triangle/.test(s))return{ar:'شوف علاقته بإيه',en:'Map the relations',cue:'ظبّط الاتجاه، وبعدها حطّ اللي حواليه في الصورة.'};
 return{ar:wrong?'امسك الفرق':'كوّن الصورة',en:wrong?'Catch the difference':'Build the picture',cue:wrong?'حط الصح والغلط جنب بعض وامسك فرق واحد قاطع.':'ما تحفظش الجملة. شوفها في دماغك الأول.'}
}
function commandChip(q,l,wrong=false){
 const c=egyptianCommand(q,l,wrong);return '<div class="v14Command"><span>'+E(c.ar)+'</span><b>'+E(c.en)+'</b><small>'+E(c.cue)+'</small></div>'
}
function academicReference(l){
 const sub=l?.subject||'';
 if(sub==='HISTOLOGY')return '<a class="v14AcademicRef" href="https://secondlook.med.umich.edu/histology" target="_blank" rel="noopener"><b>ACADEMIC VISUAL ATLAS</b><span>University of Michigan Medical School · Histology SecondLook</span></a>';
 if(sub==='ANATOMY')return '<a class="v14AcademicRef" href="https://secondlook.med.umich.edu/neuroanatomy" target="_blank" rel="noopener"><b>ACADEMIC VISUAL ATLAS</b><span>University of Michigan Medical School · Neuroanatomy SecondLook</span></a>';
 return''
}
function sourceVisualHTML(q){
 if(!q?.visualData)return'';
 return '<div class="v14SourceVisual"><img src="'+E(q.visualData)+'" alt="Actual source-bank figure" loading="lazy"><span>ACTUAL SOURCE-BANK FIGURE · p.'+E(q.page||'—')+'</span></div>'
}
function visualBankHTML(q,l,mode='learning'){
 l=bestLessonForQ(q,l);const source=sourceVisualHTML(q),qs=queriesFor(q,l).join('|||');
 return '<div class="v14VisualGenome" data-v14-qid="'+E(q.id)+'" data-v14-queries="'+E(qs)+'" data-v14-subject="'+E(l?.subject||q.subject||'')+'">'+
   '<div class="v14VisualHead"><b>VISUAL MEMORY ANCHOR</b><span>'+E(visualRole(q,l))+'</span></div>'+
   commandChip(q,l,false)+
   source+
   '<div class="v14VisualGrid" data-v14-dynamic><div class="v14VisualLoading">Finding the clearest real medical visual for this exact question…</div></div>'+
   (l?.video?.id?'<a class="v14Teacher" href="https://www.youtube.com/watch?v='+E(l.video.id)+'&t='+(l.video.start||0)+'s" data-ctx-video="'+E(l.video.id)+'" data-ctx-start="'+(l.video.start||0)+'" data-ctx-end="'+(l.video.end||0)+'" data-ctx-title="'+E(l.video.title||l.topic)+'"><img src="https://i.ytimg.com/vi/'+E(l.video.id)+'/hqdefault.jpg" alt="'+E(l.video.title||l.topic)+'" loading="lazy"><span><b>REAL TEACHER CLIP</b>'+E(l.video.title||l.topic)+'</span></a>':'')+
   academicReference(l)+
   '<div class="v14SourceLaw">No generated anatomy. Source figure first; otherwise open-license real diagrams/specimens/micrographs. Every question gets its own stable visual assignment when the library can support it.</div>'+
 '</div>'
}
function primerHTML(d,l,q,k,conf){
 l=bestLessonForQ(q,l);const m=mentalModel(l,q),f=m.fact,dv=m.deep,p=professor(l),subject=m.subject,answer=qAnswer(q);
 const look=subject==='HISTOLOGY'?'Before reading any option, identify the tissue pattern and the three features that separate it from its nearest look-alike.':subject==='PHYSIOLOGY'?'Run the mechanism forward once, then perturb one variable and predict what moves next.':'Orient the structure first. Do not memorize the sentence. Place it in space, trace its relations/course, then predict the clinical effect.';
 const conceptLabel=subject==='HISTOLOGY'?'The visual feature this item is testing':subject==='PHYSIOLOGY'?'The mechanism / relationship this item is testing':'The anatomical relationship this item is testing';
 const why='<b>'+E(conceptLabel)+'</b><span>'+E(m.model||p.teach?.[0]||l?.objective||'Build the concept from the visual before seeing answer choices.')+'</span>'+(f&&norm(f.a)!==norm(answer)?'<small>Connect it to the broader rule: '+E(f.q)+'</small>':'');
 const detail=dv?E(dv):E((p.teach||[]).join(' '));
 return '<div class="v14Primer" data-v14-primer="'+E(q.id)+'">'+
   '<div class="v14PrimerFlag">UNDERSTAND FIRST · OPTIONS LOCKED</div>'+
   '<h3>'+E(q.chapter||l.topic)+'</h3>'+
   visualBankHTML(q,l,'learning')+
   '<div class="v14TeachGrid">'+
    '<div class="v14TeachCard"><b>1 · SEE IT</b><p>'+E(look)+'</p><strong>'+E(m.model)+'</strong></div>'+
    '<div class="v14TeachCard"><b>2 · UNDERSTAND IT</b><p>'+why+'</p></div>'+
    '<div class="v14TeachCard"><b>3 · BUILD THE MOVIE</b><p>'+detail+'</p></div>'+
    '<div class="v14TeachCard"><b>4 · EXAM CONVERSION</b><p>'+E(m.exam||visualRole(q,l))+'</p><small>Predict the answer in your own words before seeing choices.</small></div>'+
   '</div>'+
   '<button class="primary bigAction" data-v14-reveal="'+E(q.id)+'">I CAN PICTURE IT → ASK ME THE MCQ</button>'+
   '<div class="v14Tiny">This teaching card is tutor synthesis from the mapped lesson/professor corpus. It does not alter the source-bank stem or key.</div>'+
 '</div>'
}
function selectedOption(q,a){return q?.options?.find(o=>o.key===a?.selected)||null}
function wrongPseudo(q,a){
 const o=selectedOption(q,a),txt=o?.text||String(a?.selected||'wrong option');
 return {...q,id:q.id+'__wrong__'+String(a?.selected||'x'),stem:txt,answerText:txt,chapter:txt,_visualAlias:tokens(txt).slice(0,7).join(' ')}
}
function wrongAutopsyHTML(l,q,a){
 l=bestLessonForQ(q,l);const m=mentalModel(l,q),correct=qAnswer(q),chosen=selectedOption(q,a)?.text||String(a?.selected||'Your choice'),cmd=egyptianCommand(q,l,true),wrong=wrongPseudo(q,a);
 return '<div class="v14Autopsy" data-v14-autopsy="'+E(q.id)+'" data-v14-choice="'+E(a?.selected||'')+'">'+
   '<div class="v14AutopsyHead"><div><b>ليه إجابتك غلط بصريًا؟</b><span>Visual wrong-answer autopsy</span></div>'+commandChip(q,l,true)+'</div>'+
   '<div class="v14Compare">'+
     '<div class="v14CompareSide correct"><b>اللقطة الصح</b><div class="v14AutopsyVisual" data-v14-correct="'+E(q.id)+'"><div class="v14VisualLoading">Loading the correct visual anchor…</div></div><strong>'+E(correct)+'</strong></div>'+
     '<div class="v14CompareSide wrong"><b>إنت خدت شبيهها / البديل الغلط</b><div class="v14AutopsyVisual" data-v14-wrong="'+E(wrong.id)+'" data-v14-parent="'+E(q.id)+'"><div class="v14VisualLoading">Finding a real visual for your chosen alternative…</div></div><strong>'+E(chosen)+'</strong></div>'+
   '</div>'+
   '<div class="v14Difference"><b>الفرق الفاصل</b><p>'+E(cmd.cue)+' '+E(m.model||m.fact?.a||'Rebuild the concept before looking at options again.')+'</p></div>'+
   '<div class="v14Recall"><b>من غير اختيارات دلوقتي:</b><span>'+E(q.stem||'Say the correct concept aloud and explain why your old choice cannot fit.')+'</span><small>قول الإجابة والمنطق بصوتك قبل ما تدوس Repair.</small></div>'+
 '</div>'
}
function feedbackHTML(l,q,a){
 l=bestLessonForQ(q,l);const m=mentalModel(l,q),ans=qAnswer(q),f=m.fact;
 return '<div class="v14Why">'+
   '<b>WHY THIS ANSWER MAKES SENSE</b>'+
   '<div class="v14WhyAnswer">'+E(ans)+'</div>'+
   '<p>'+(f?E(f.a):E(m.model))+'</p>'+
   (m.deep?'<details><summary>Rebuild the full picture</summary><p>'+E(m.deep)+'</p></details>':'')+
   '<div class="v14Tiny">Tutor explanation, separate from the preserved source answer key.</div>'+
 '</div>'+(a?.ok===false?wrongAutopsyHTML(l,q,a):'')
}
function canFastLane(l){
 const r=S.v12?.mastery?.[l?.topic],p=window.INTELLECTUALITY_V12?.posterior?.(l?.topic)||0,mem=S.memory?.[l?.topic];
 return !!(r&&r.n>=4&&p>=.82&&mem&&mem.n>=3)
}
function medicalTerms(q,l){
 const alias=conceptAlias(q,l),topic=l?.topic||q?.chapter||'',generic=new Set(['human','anatomy','physiology','diagram','medical','nervous','system','tissue','labeled','micrograph','histology']);
 return [...new Set(tokens(alias||topic).filter(w=>!generic.has(w)))].slice(0,10)
}
function candidateRelevant(x,q,l){
 const t=norm(x.title),terms=medicalTerms(q,l),s=norm((q?.stem||'')+' '+qAnswer(q)+' '+(q?.chapter||''));
 if(/logo|flag|portrait|statue|coat of arms|icon|malacolog|chiton|insect|mollusc|mollusk|veterinary|horse|canine|dog |cat |fish |avian|botan|plant /.test(t))return false;
 if(!/retina|visual|eye|optic|photoreceptor/.test(s)&&/retina| eye |ocular/.test(' '+t+' '))return false;
 if(!/cochlea|auditory|ear|vestibul/.test(s)&&/cochlea|organ of corti| inner ear /.test(' '+t+' '))return false;
 if(/synap|neurotransmitter|epsp|ipsp/.test(s)&&!/synap|neuron|neurotrans|junction|vesicle|receptor/.test(t))return false;
 if((l?.subject||q?.subject)==='HISTOLOGY'&&!/histolog|micrograph|microscop|neuron|nerve|brain|spinal|ganglion|retina|cerebell|cortex/.test(t))return false;
 return !terms.length||terms.some(w=>t.includes(w))||overlap(t,(q?.stem||'')+' '+qAnswer(q))>=1
}
function rankCandidate(x,q,l){
 const target=tokens(cleanQueryWords(q,l)),strong=medicalTerms(q,l),t=norm(x.title);let s=0;
 for(const w of target)if(t.includes(w))s+=3;for(const w of strong)if(t.includes(w))s+=6;
 if(l?.subject==='HISTOLOGY'&&/histolog|micrograph|microscop|section/.test(t))s+=7;
 if(l?.subject==='ANATOMY'&&/anatom|dissect|section|nerve|arter|brain|cord|skull|orbit|ear|eye|mening|ganglion/.test(t))s+=4;
 if(l?.subject==='PHYSIOLOGY'&&/diagram|pathway|circuit|reflex|receptor|synap|tract|neuron/.test(t))s+=5;
 if((x.width||0)>=900&&(x.height||0)>=600)s+=2;if((x.width||0)&&Math.min(x.width,x.height)<240)s-=8;
 const used=V().visualUsed[x.title]||0;s-=used*4;return s
}
async function fetchCommons(q){
 if(searchVisualCache.has(q))return searchVisualCache.get(q);
 const task=(async()=>{const u='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(q)+'&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=900&format=json&origin=*';
 const r=await fetch(u),j=await r.json();
 return Object.values(j.query?.pages||{}).map(p=>{const ii=p.imageinfo?.[0]||{};return{title:p.title||'',thumb:ii.thumburl||'',page:ii.descriptionurl||'',license:ii.extmetadata?.LicenseShortName?.value||'Wikimedia Commons',mime:ii.mime||'',width:ii.width||0,height:ii.height||0}}).filter(x=>x.thumb&&/^image\/(jpeg|png|webp|svg\+xml)/.test(x.mime))})();searchVisualCache.set(q,task);return task
}
async function fetchExactFile(file){
 if(exactVisualCache.has(file))return exactVisualCache.get(file);
 const task=(async()=>{const u='https://commons.wikimedia.org/w/api.php?action=query&titles='+encodeURIComponent('File:'+file)+'&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=900&format=json&origin=*';
 const r=await fetch(u),j=await r.json(),p=Object.values(j.query?.pages||{})[0],ii=p?.imageinfo?.[0];
 if(!ii?.thumburl||!/^image\/(jpeg|png|webp|svg\+xml)/.test(ii.mime||''))return null;
 return{title:p.title||('File:'+file),thumb:ii.thumburl,page:ii.descriptionurl||'',license:ii.extmetadata?.LicenseShortName?.value||'Wikimedia Commons',mime:ii.mime||'',width:ii.width||0,height:ii.height||0,curated:true}})();exactVisualCache.set(file,task);return task
}
async function assignVisuals(q,l,key=q.id){
 l=bestLessonForQ(q,l);const v=V(),existing=v.visualAssignments[key];if(existing?.length&&existing.every(x=>x.curated||candidateRelevant(x,q,l)))return existing;
 if(existing?.length)delete v.visualAssignments[key];
 const curated=(await Promise.all(curatedFilesFor(q,l).map(file=>fetchExactFile(file).catch(()=>null)))).filter(Boolean).sort((a,b)=>(v.visualUsed[a.title]||0)-(v.visualUsed[b.title]||0));
 const chosen=[];
 if(curated.length>=2){chosen.push(curated[0],curated[1])}
 else{
   if(curated[0])chosen.push(curated[0]);
   const queryRows=await Promise.all(queriesFor(q,l).slice(0,4).map(query=>fetchCommons(query).catch(()=>[])));
   const all=queryRows.flat(),map=new Map();for(const x of all)if(!map.has(x.title))map.set(x.title,x);
   const ranked=[...map.values()].filter(x=>candidateRelevant(x,q,l)).sort((a,b)=>rankCandidate(b,q,l)-rankCandidate(a,q,l));
   for(const x of ranked){if(chosen.length>=2)break;if(chosen.some(y=>y.title===x.title))continue;chosen.push(x)}
   for(const x of curated){if(chosen.length>=2)break;if(chosen.some(y=>y.title===x.title))continue;chosen.push(x)}
 }
 if(chosen.length){v.visualAssignments[key]=chosen;for(const x of chosen)v.visualUsed[x.title]=(v.visualUsed[x.title]||0)+1;v.stats.visualsAssigned=(v.stats.visualsAssigned||0)+1;safe(()=>save())}
 return chosen
}
function lessonForQ(q){return bestLessonForQ(q,null)}
async function hydrateVisual(el){
 if(el.dataset.v14Loaded)return;el.dataset.v14Loaded='1';const qid=el.dataset.v14Qid,q=(QB.questions||[]).find(x=>x.id===qid);if(!q)return;
 const l=lessonForQ(q),box=el.querySelector('[data-v14-dynamic]');if(!box)return;
 const rows=await assignVisuals(q,l);
 if(!rows.length){
   const canonical=safe(()=>window.INTELLECTUALITY_TOPIC_VISUAL?.(l,professor(l)),'');
   if(canonical){box.innerHTML='<div class="v14CanonicalNote"><b>CANONICAL FALLBACK</b> Exact-question atlas image unavailable, so this uses the best real topic visual instead of fake filler.</div>'+canonical;setTimeout(()=>window.INTELLECTUALITY_REAL_VISUAL_HYDRATE?.(box),0)}
   else box.innerHTML='<div class="v14VisualMissing">No trustworthy real image found for this exact question. No generated substitute shown.</div>';
   return
 }
 box.innerHTML=rows.map((x,i)=>'<a class="v14Visual '+(i===0?'primary':'')+'" href="'+E(x.page)+'" target="_blank" rel="noopener"><img src="'+E(x.thumb)+'" alt="'+E(x.title.replace(/^File:/,''))+'" loading="'+(i===0?'eager':'lazy')+'"><span><b>'+(x.curated?'CURATED ATLAS':(i===0?'QUESTION-SPECIFIC':'SECOND ANGLE'))+'</b>'+E(x.title.replace(/^File:/,'').replace(/_/g,' '))+'<small>'+E(x.license)+'</small></span></a>').join('')
}
function visualCard(x,label){
 return '<a class="v14Visual primary" href="'+E(x.page)+'" target="_blank" rel="noopener"><img src="'+E(x.thumb)+'" alt="'+E(x.title.replace(/^File:/,''))+'" loading="eager"><span><b>'+E(label)+'</b>'+E(x.title.replace(/^File:/,'').replace(/_/g,' '))+'<small>'+E(x.license)+'</small></span></a>'
}
async function hydrateAutopsy(box){
 if(box.dataset.v14AutopsyLoaded)return;box.dataset.v14AutopsyLoaded='1';
 const qid=box.dataset.v14Correct||box.dataset.v14Parent,q=(QB.questions||[]).find(x=>x.id===qid);if(!q)return;
 const l=lessonForQ(q),isWrong=!!box.dataset.v14Wrong;
 if(!isWrong){
   const rows=await assignVisuals(q,l);const x=rows[0];
   box.innerHTML=x?visualCard(x,'CORRECT ANCHOR'):'<div class="v14VisualMissing">Use the source/topic visual above. No fake substitute.</div>';return
 }
 const parent=box.closest('.v14Autopsy'),choice=parent?.dataset.choice||'',a={selected:choice},pseudo=wrongPseudo(q,a),key='wrong::'+q.id+'::'+choice;
 let rows=await assignVisuals(pseudo,l,key),correct=V().visualAssignments[q.id]?.[0];
 if(correct)rows=rows.filter(x=>x.title!==correct.title);
 const x=rows[0];
 box.innerHTML=x?visualCard(x,'YOUR CHOICE / LOOK-ALIKE'):'<div class="v14VisualMissing">No trustworthy distinct visual exists for this distractor. Use the decisive difference below, not a fabricated picture.</div>'
}
function scheduleVisual(el){
 if(el.dataset.v14Scheduled)return;el.dataset.v14Scheduled='1';
 const fn=el.classList.contains('v14AutopsyVisual')?hydrateAutopsy:hydrateVisual;
 if(!('IntersectionObserver'in window)){fn(el);return}
 if(!visualObserver)visualObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){visualObserver.unobserve(e.target);(e.target.classList.contains('v14AutopsyVisual')?hydrateAutopsy:hydrateVisual)(e.target)}}),{rootMargin:'500px 0px'});
 visualObserver.observe(el)
}
function enhanceQuestionCompanions(){
 document.querySelectorAll('.ctxCompanion[data-ctx-kind="question"]').forEach(c=>{
   if(c.dataset.v14Upgraded)return;c.dataset.v14Upgraded='1';const row=c.closest('.ctxRow'),stage=row?.closest('.stage,.mockQ'),qid=stage?.querySelector?.('[data-qid]')?.dataset.qid;
   const q=(QB.questions||[]).find(x=>x.id===qid);if(!q)return;const l=lessonForQ(q);
   c.innerHTML=visualBankHTML(q,l,'question');c.classList.add('v14Companion');c.querySelectorAll('.v14VisualGenome').forEach(scheduleVisual)
 })
}
function wrapQbank(){
 if(qbankQuestionView.__v14)return;const old=qbankQuestionView;
 qbankQuestionView=function(d,l,q,k,conf){
   const a=S.answers[k];
   if(!a?.answered&&!V().primed[q.id])return primerHTML(d,l,q,k,conf);
   let h=old(d,l,q,k,conf);
   if(a?.answered)h+=feedbackHTML(l,q,a);
   return h
 };qbankQuestionView.__v14=true
}
function wrapQuestionView(){
 if(questionView.__v14)return;const old=questionView;
 questionView=function(d,l,q,k,conf){
   const a=S.answers[k],fakeQ={...q,stem:q.prompt,answerText:q.answer,answerKeys:[],options:[]};
   if(!a?.ok&&!a?.revealed&&!V().primed[q.id])return primerHTML(d,l,fakeQ,k,conf);
   let h=old(d,l,q,k,conf);if(a?.ok!==undefined)h+=feedbackHTML(l,fakeQ,a);return h
 };questionView.__v14=true
}
function wireV14(){
 document.querySelectorAll('[data-v14-reveal]').forEach(b=>{if(b.dataset.v14Wired)return;b.dataset.v14Wired='1';b.onclick=()=>{V().primed[b.dataset.v14Reveal]=true;V().stats.primersSeen=(V().stats.primersSeen||0)+1;save();render()}})
 document.querySelectorAll('.v14VisualGenome,.v14AutopsyVisual').forEach(scheduleVisual)
}
function decorate(){decorateCalendar();enhanceQuestionCompanions();wireV14()}
function install(){
 V();syncCalendar();wrapQbank();wrapQuestionView();
 const oldRender=render;render=function(...args){const out=oldRender(...args);setTimeout(()=>safe(()=>decorate()),20);return out};
 const oldWire=wire;wire=function(){oldWire();wireV14()};
 window.INTELLECTUALITY_V14={version:VERSION,canFastLane,syncCalendar,queriesFor,visualRole,mentalModel,assignVisuals,visualPlanCount:()=>QB.questions?.length||0};
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncCalendar();decorateCalendar()}});
 setInterval(()=>{if(localYMD()!==V().calendar.today){syncCalendar();safe(()=>render())}},600000);
 decorate();save()
}
window.INTELLECTUALITY_V14_INIT=function(){try{install()}catch(e){console.error('[v14 init fail-safe]',e)}};
})();