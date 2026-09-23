(function(){
'use strict';
const VERSION='12.0';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const safe=(fn,fallback=null)=>{try{return fn()}catch(e){console.warn('[v12]',e);return fallback}};
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const esc12=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
let started=new Map(),lastVisualByTopic=new Map(),stationTimer=null;
function V(){return S.v12}
function lessonById(id){for(const d of C.days||[]){const l=(d.lessons||[]).find(x=>x.id===id);if(l)return l}return null}
function qBy(id){return (QB.questions||[]).find(q=>q.id===id)||null}
function qTopic(q){return q?.courseTopic||lessonById(q?.lessonIds?.[0])?.topic||q?.chapter||'Unknown'}
function ensure(){
 if(!S.v12){
   try{if(!localStorage.getItem('intellectuality_pre_v12_backup'))localStorage.setItem('intellectuality_pre_v12_backup',JSON.stringify(S))}catch(_){}
   S.v12={version:VERSION,createdAt:new Date().toISOString(),mastery:{},evidence:[],errorGenome:{},visualGenome:{},twin:{},scheduler:{},graph:{nodes:{},edges:{}},mutations:{},examMode:{},outcomes:[],vision:{uses:0},telemetry:{},flags:{}};
 }
 const v=S.v12;
 v.version=VERSION;v.mastery=v.mastery||{};v.evidence=v.evidence||[];v.errorGenome=v.errorGenome||{};v.visualGenome=v.visualGenome||{};v.twin=v.twin||{};v.scheduler=v.scheduler||{};v.graph=v.graph||{nodes:{},edges:{}};v.graph.nodes=v.graph.nodes||{};v.graph.edges=v.graph.edges||{};v.mutations=v.mutations||{};v.examMode=v.examMode||{};v.outcomes=v.outcomes||[];v.vision=v.vision||{uses:0};v.telemetry=v.telemetry||{};v.flags={mastery:true,roi:true,twin:true,visualGenome:true,frameVideo:true,errorGenome:true,mutation:true,practical:true,vision:true,autopilot:true,stop:true,counterfactual:true,knowledgeGraph:true,examDay:true,outcomes:true};
}
function topicRecord(topic){
 ensure();return V().mastery[topic]||(V().mastery[topic]={alpha:2,beta:2,n:0,last:null,latencies:[],transfer:0,heldout:0,visual:0,written:0});
}
function confidenceWeight(c){return c==='confident'?1.18:c==='guess'?.72:1}
function evidenceWeight(meta){
 let w=meta.mock?2.15:meta.practical?1.55:meta.retest?.85:meta.self?.35:1;
 if(meta.heldout)w=Math.max(w,2.15);
 return w*confidenceWeight(meta.confidence);
}
function recordEvidence(topic,ok,meta={}){
 if(!topic)return;
 const r=topicRecord(topic),w=evidenceWeight(meta);
 if(ok)r.alpha+=w;else r.beta+=w*(meta.confidence==='confident'?1.35:1);
 r.n++;r.last=new Date().toISOString();
 if(Number.isFinite(meta.latencyMs)){r.latencies.push(Math.round(meta.latencyMs));r.latencies=r.latencies.slice(-18)}
 if(meta.transfer)r.transfer++;if(meta.mock||meta.heldout)r.heldout++;if(meta.practical)r.visual++;if(meta.written)r.written++;
 V().evidence.push({at:r.last,topic,ok:!!ok,w:+w.toFixed(2),qid:meta.qid||'',confidence:meta.confidence||'',latencyMs:meta.latencyMs||null,mode:meta.mode||''});
 V().evidence=V().evidence.slice(-700);
 const visual=lastVisualByTopic.get(topic);
 if(visual){const z=V().visualGenome[visual.key]||(V().visualGenome[visual.key]={n:0,ok:0,topics:{}});z.n++;if(ok)z.ok++;z.topics[topic]=(z.topics[topic]||0)+1}
}
function posterior(topic){
 const r=topicRecord(topic),raw=r.alpha/(r.alpha+r.beta),ret=safe(()=>retention(topic),0);
 const evidence=Math.min(1,r.n/8),speed=r.latencies.length?clamp(45000/(mean(r.latencies)||45000),.65,1.15):1;
 const transferBoost=Math.min(.07,r.transfer*.012),heldBoost=Math.min(.06,r.heldout*.015);
 return clamp((raw*(.78+.08*evidence)+ret*.14)*speed+transferBoost+heldBoost,.03,.995);
}
function uncertainty(topic){const r=topicRecord(topic),n=r.alpha+r.beta;return clamp(1/Math.sqrt(n),.05,.5)}
function chapterInfo(q){
 const PE=window.NEU205_PATTERN||{};
 return PE.chapters?.[(q?.subject||'')+'||'+(q?.chapter||'')]||null;
}
function lessonExamWeight(l){
 const PE=window.NEU205_PATTERN||{};
 const qs=(QB.questions||[]).filter(q=>q.lessonIds?.includes(l.id));
 if(!qs.length)return 1;
 const scores=qs.map(q=>{const c=chapterInfo(q);return 1+(c?.score||0)/80+(PE.qScore?.[q.id]||0)/150});
 return clamp(mean(scores),.8,2.6);
}
function roiFor(x){
 const l=x?.l||lessonById(x?.lessonId);if(!l)return 0;
 const p=posterior(l.topic),r=safe(()=>retention(l.topic),0),exam=lessonExamWeight(l);
 const unresolvedBoost=(safe(()=>unresolved(),[])||[]).some(e=>e.lessonId===l.id&&!e.resolved)?1.35:1;
 const transferNeed=topicRecord(l.topic).transfer?1:1.12;
 const examBoost=V().examMode?.active?1.22:1;
 const mins=Math.max(1,x?.minutes||3);
 return ((1-p)*.55+(1-r)*.45)*exam*unresolvedBoost*transferNeed*examBoost/mins;
}
function buildTwin(){
 const PE=window.NEU205_PATTERN||{},ar={},sub={},chap={};
 for(const q of QB.questions||[]){
   const m=PE.questionMeta?.[q.id]||{},a=m.archetype||q.failureType||'direct',s=q.subject||'OTHER',k=s+'||'+q.chapter;
   ar[a]=(ar[a]||0)+1;sub[s]=(sub[s]||0)+1;chap[k]=(chap[k]||0)+1;
 }
 const total=Math.max(1,Object.values(ar).reduce((a,b)=>a+b,0));
 V().twin={builtAt:new Date().toISOString(),archetypes:Object.fromEntries(Object.entries(ar).map(([k,n])=>[k,{n,share:n/total}])),subjects:sub,chapters:chap,cleanHeldout:PE.corpus?.cleanHeldout||0,leakExcluded:(PE.corpus?.exactLeak||0)+(PE.corpus?.nearLeak||0)};
 return V().twin;
}
function errorClass(q,result,latencyMs){
 const m=window.NEU205_PATTERN?.questionMeta?.[q?.id]||{},stem=norm(q?.stem),dim=q?.dimension||q?.failureType||'retrieval';
 if(result?.confidence==='confident'&&!result?.ok)return'confident misconception';
 if(/except|false|not true|incorrect/.test(stem))return'polarity trap';
 if(/cross|decussat|contralateral|ipsilateral/.test(stem))return'crossing / laterality';
 if(q?.requiresVisual||result?.practical||/identify|image|figure/.test(stem))return'visual recognition';
 if(dim==='spatial'||/relation|content|foramen|triangle|surface/.test(stem))return'spatial relation';
 if(dim==='discrimination'||m.archetype==='lookalike')return'look-alike discrimination';
 if(dim==='causal'||/increase|decrease|inhibit|excite|mechanism/.test(stem))return'mechanism direction';
 if(Number.isFinite(latencyMs)&&latencyMs<5000&&!result?.ok)return'fast careless read';
 return'retrieval lapse';
}
function logError(q,result,latencyMs){
 if(!q||result?.ok)return;
 const k=errorClass(q,result,latencyMs),g=V().errorGenome[k]||(V().errorGenome[k]={n:0,confidentWrong:0,questions:[],last:null});
 g.n++;if(result.confidence==='confident')g.confidentWrong++;g.last=new Date().toISOString();if(!g.questions.includes(q.id))g.questions.push(q.id);g.questions=g.questions.slice(-20);
}
function evidenceFromAction(before){
 const q=before.qid?qBy(before.qid):null;if(!q)return;
 const r=S.qbank.results?.[q.id];if(!r)return;
 const key=before.timerKey,latency=key&&started.has(key)?Date.now()-started.get(key):null;if(key)started.delete(key);
 const meta={qid:q.id,confidence:r.confidence||before.confidence||'unsure',latencyMs:latency,mock:!!r.mock,heldout:q.split==='heldout',retest:!!r.retest,practical:!!r.practical,transfer:!!r.retest||!!r.mock,mode:r.mock?'mock':r.retest?'retest':r.practical?'practical':'practice'};
 recordEvidence(qTopic(q),!!r.ok,meta);logError(q,r,latency);
}
function questionTimerKey(qid,mode='q'){return mode+':'+qid}
function armTimers(){
 document.querySelectorAll('[data-qid]').forEach(b=>{
   const qid=b.dataset.qid;if(!qid)return;
   let mode=b.dataset.act?.includes('mock')?'mock':b.dataset.act?.includes('retest')?'retest':b.dataset.act?.includes('practical')?'practical':'q';
   const k=questionTimerKey(qid,mode);if(!started.has(k))started.set(k,Date.now());
 });
}
function buildGraph(){
 const g={nodes:{},edges:{}};
 const addNode=l=>{g.nodes[l.id]=g.nodes[l.id]||{id:l.id,topic:l.topic,subject:l.subject,neighbors:{}}};
 const edge=(a,b,w,why)=>{if(!a||!b||a===b)return;const k=[a,b].sort().join('::');const e=g.edges[k]||(g.edges[k]={a,b,w:0,reasons:[]});e.w+=w;if(!e.reasons.includes(why))e.reasons.push(why)};
 for(const d of C.days||[])for(const l of d.lessons||[])addNode(l);
 for(const q of QB.questions||[]){const ids=[...new Set(q.lessonIds||[])];for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)edge(ids[i],ids[j],3,'shared source question')}
 const lessons=Object.values(g.nodes);
 for(let i=0;i<lessons.length;i++)for(let j=i+1;j<lessons.length;j++){
   if(lessons[i].subject!==lessons[j].subject)continue;
   const A=new Set(norm(lessons[i].topic).split(' ').filter(x=>x.length>4)),B=new Set(norm(lessons[j].topic).split(' ').filter(x=>x.length>4));
   const shared=[...A].filter(x=>B.has(x));if(shared.length)edge(lessons[i].id,lessons[j].id,Math.min(2,shared.length*.7),'topic overlap');
 }
 for(const e of Object.values(g.edges)){g.nodes[e.a]?.neighbors&&(g.nodes[e.a].neighbors[e.b]=e.w);g.nodes[e.b]?.neighbors&&(g.nodes[e.b].neighbors[e.a]=e.w)}
 V().graph=g;return g;
}
function connectedLessons(lid){
 const g=V().graph?.nodes?.[lid]?.neighbors||{};
 return Object.entries(g).sort((a,b)=>b[1]-a[1]).map(([id,w])=>({l:lessonById(id),w})).filter(x=>x.l);
}
function mutationCandidate(q){
 const PE=window.NEU205_PATTERN||{},m=PE.questionMeta?.[q.id]||{},near=new Set(PE.nearAvoid?.[q.id]||[]);
 const pool=(QB.questions||[]).filter(x=>x.id!==q.id&&x.split==='practice'&&x.autoScore&&!x.requiresVisual&&!near.has(x.id)&&(x.chapter===q.chapter||x.lessonIds?.some(id=>q.lessonIds?.includes(id))));
 return pool.map(x=>{const xm=PE.questionMeta?.[x.id]||{};let s=(xm.archetype&&xm.archetype!==m.archetype?4:0)+(x.failureType&&x.failureType!==q.failureType?2:0)+(PE.qScore?.[x.id]||0)/50;return{x,s}}).sort((a,b)=>b.s-a.s)[0]?.x||null;
}
function refreshCounterfactual(){
 const rows=(safe(()=>dueReviews(),[])||[]).slice(0,12).map(x=>({id:x.l.id,topic:x.l.topic,roi:roiFor({...x,minutes:3}),mastery:posterior(x.l.topic),retention:safe(()=>retention(x.l.topic),0),minutes:3})).sort((a,b)=>b.roi-a.roi);
 V().scheduler.counterfactual=rows.slice(0,5);V().scheduler.lastAt=new Date().toISOString();return rows;
}
function examMode(){
 const d=safe(()=>day(),null),active=!!d&&(d.day>=45||(C.days?.[46]?.date&&((new Date(C.days[46].date+'T12:00:00')-new Date())/86400000)<=3&&((new Date(C.days[46].date+'T12:00:00')-new Date())/86400000)>=-1));
 V().examMode={active,day:d?.day||0,updatedAt:new Date().toISOString(),doctrine:active?'unstable high-yield evidence only; no panic expansion':'normal adaptive learning'};
 return active;
}
function predictedScore(){
 const topics=Object.values(V().mastery||{});if(!topics.length)return null;
 const ps=Object.keys(V().mastery).map(t=>posterior(t));
 let p=mean(ps),mock=S.mockHistory?.slice(-3)||[];
 if(mock.length)p=.55*p+.45*mean(mock.map(x=>x.pct/100));
 const outs=V().outcomes||[];if(outs.length){const bias=mean(outs.map(o=>(o.actualPct-(o.predictedPct||o.actualPct))/100));p+=bias*.35}
 return clamp(p,.05,.98);
}
function shouldStopExtra(){
 const mandatory=safe(()=>nextAction(),null);if(mandatory?.kind!=='STOP')return false;
 const rows=refreshCounterfactual(),top=rows[0];return !top||top.roi<.12;
}
function masterySnapshot(){
 const rows=[];
 for(const d of C.days||[])for(const l of d.lessons||[])if(S.memory?.[l.topic]||V().mastery[l.topic])rows.push({id:l.id,topic:l.topic,p:posterior(l.topic),u:uncertainty(l.topic),ret:safe(()=>retention(l.topic),0),roi:roiFor({l,minutes:3})});
 return rows.sort((a,b)=>a.p-b.p);
}
function brainHTML(){
 const pred=predictedScore(),weak=masterySnapshot().slice(0,7),errors=Object.entries(V().errorGenome).sort((a,b)=>b[1].n-a[1].n).slice(0,6),cf=refreshCounterfactual(),twin=V().twin||buildTwin();
 return '<div class="v12Panel"><div class="v12Hero"><div><small>PERSONAL MASTERY BRAIN</small><b>'+(pred==null?'Learning…':Math.round(pred*100)+'%')+'</b></div><div><small>Evidence atoms</small><b>'+V().evidence.length+'</b></div><div><small>Mode</small><b>'+(examMode()?'EXAM':'NORMAL')+'</b></div></div>'+
 '<h3>Lowest-confidence concepts</h3>'+(weak.length?weak.map(x=>'<div class="v12Row"><span>'+esc12(x.topic)+'</span><b>'+Math.round(x.p*100)+'%</b><small>±'+Math.round(x.u*100)+' · retention '+Math.round(x.ret*100)+'%</small></div>').join(''):'<div class="source">Use the course. The model will calibrate from real evidence.</div>')+
 '<h3>Error genome</h3>'+(errors.length?errors.map(([k,x])=>'<div class="v12Row"><span>'+esc12(k)+'</span><b>'+x.n+'</b><small>'+x.confidentWrong+' confident wrong</small></div>').join(''):'<div class="source">No error lineage yet.</div>')+
 '<h3>Counterfactual scheduler</h3>'+(cf.length?cf.slice(0,4).map((x,i)=>'<div class="v12Row"><span>'+(i+1)+'. '+esc12(x.topic)+'</span><b>'+x.roi.toFixed(2)+'</b><small>mark-gain/min proxy</small></div>').join(''):'<div class="source">No review debt worth buying.</div>')+
 '<h3>Exam digital twin</h3><div class="source">'+Object.entries(twin.archetypes||{}).sort((a,b)=>b[1].n-a[1].n).slice(0,5).map(([k,v])=>esc12(k)+' '+Math.round(v.share*100)+'%').join(' · ')+'</div>'+
 (window.INTELLECTUALITY_V13_UI?.brainAddonHTML?.()||'')+
 '<div class="v12Actions"><button data-v12="vision">📷 Vision mode</button><button data-v12="outcome">📈 Calibrate after exam</button></div></div>';
}
function openBrain(){
 if(typeof openDrawer==='function'){openDrawer('Autopilot Brain',brainHTML());setTimeout(wireV12,0)}
}
function modalBase(id,title,body){
 let m=document.querySelector('#'+id);if(!m){m=document.createElement('div');m.id=id;m.className='v12Modal';document.body.appendChild(m)}
 m.innerHTML='<div class="v12ModalCard"><button class="v12Close" data-v12-close="'+id+'">✕</button><h2>'+esc12(title)+'</h2>'+body+'</div>';m.classList.add('open');wireV12(m);return m
}
function openVision(){
 const ctx=safe(()=>currentLessonSegment()?.l,null)||safe(()=>allCoveredLessons().at(-1)?.l,null);
 modalBase('v12Vision','Professor Vision','<p class="v12Muted">Point the iPad camera at a slide, cadaver, histology field, diagram or handwritten sketch. I will tell you where to look and map it to the current CNS concept. Nothing is stored by this tool.</p><input id="v12VisionFile" type="file" accept="image/*" capture="environment"><div id="v12VisionPreview"></div><button id="v12VisionAnalyze" class="primary" disabled>ANALYZE THIS VISUAL</button><div id="v12VisionResult"></div><input id="v12VisionTopic" type="hidden" value="'+esc12(ctx?.topic||'CNS')+'">');
 const inp=document.querySelector('#v12VisionFile'),btn=document.querySelector('#v12VisionAnalyze');let dataUrl='';
 inp.onchange=async()=>{const f=inp.files?.[0];if(!f)return;dataUrl=await resizeImage(f,1280,.82);document.querySelector('#v12VisionPreview').innerHTML='<img src="'+dataUrl+'" alt="Vision input">';btn.disabled=false};
 btn.onclick=async()=>{if(!dataUrl)return;btn.disabled=true;btn.textContent='PROFESSOR IS LOOKING…';const out=document.querySelector('#v12VisionResult');out.innerHTML='<div class="v12Muted">Analyzing structure and exam relevance…</div>';try{const l=ctx,context={topic:l?.topic||'CNS',subject:l?.subject||'',facts:(l?.facts||[]).slice(0,4),exam:l?.exam||'',practical:l?.practical||''};const r=await fetch('/api/vision',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({imageDataUrl:dataUrl,context})});const j=await r.json();if(!r.ok)throw new Error(j.message||j.error||'Vision unavailable');V().vision.uses=(V().vision.uses||0)+1;save();out.innerHTML=visionResultHTML(j)}catch(e){out.innerHTML='<div class="repair"><b>Vision mode unavailable.</b><br>'+esc12(e.message)+'<div class="tiny">The normal course is unaffected.</div></div>'}finally{btn.disabled=false;btn.textContent='ANALYZE THIS VISUAL'}};
}
function resizeImage(file,max=1280,q=.82){return new Promise((resolve,reject)=>{const rd=new FileReader();rd.onerror=reject;rd.onload=()=>{const im=new Image();im.onload=()=>{let w=im.width,h=im.height,s=Math.min(1,max/Math.max(w,h));const c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',q))};im.onerror=reject;im.src=rd.result};rd.readAsDataURL(file)})}
function visionResultHTML(j){
 return '<div class="v12VisionAnswer"><h3>👁 Look here</h3><p>'+esc12(j.look||j.what||'')+'</p><h3>🧠 Say this</h3><p>'+esc12(j.model||'')+'</p><h3>🎯 Exam moves</h3><ul>'+(j.examMoves||[]).map(x=>'<li>'+esc12(x)+'</li>').join('')+'</ul><h3>⚠️ Trap</h3><p>'+esc12(j.trap||'')+'</p><div class="tiny">Image interpretation is tutor assistance, not an official Kasr marking key.</div></div>';
}
function openOutcome(){
 const pred=predictedScore();
 modalBase('v12Outcome','Post-exam calibration','<p class="v12Muted">After the real exam, this teaches INTELLECTUALITY whether it was over- or under-confident.</p><label>Actual exam percentage<input id="v12Actual" type="number" min="0" max="100" step="0.1" placeholder="e.g. 81"></label><label>What surprised you?<textarea id="v12Surprise" maxlength="800" placeholder="Unexpected practical emphasis, wording, topics…"></textarea></label><button id="v12SaveOutcome" class="primary">CALIBRATE THE BRAIN</button><div class="tiny">Current pre-exam prediction snapshot: '+(pred==null?'not enough evidence':Math.round(pred*100)+'%')+'</div>');
 document.querySelector('#v12SaveOutcome').onclick=()=>{const actual=Number(document.querySelector('#v12Actual').value);if(!Number.isFinite(actual)||actual<0||actual>100)return;V().outcomes.push({at:new Date().toISOString(),actualPct:actual,predictedPct:pred==null?null:pred*100,note:document.querySelector('#v12Surprise').value.trim()});save();document.querySelector('#v12Outcome').classList.remove('open')};
}
function wireV12(root=document){
 root.querySelectorAll('[data-v12]').forEach(b=>{if(b.dataset.v12Wired)return;b.dataset.v12Wired='1';b.onclick=()=>{if(b.dataset.v12==='brain')openBrain();if(b.dataset.v12==='vision')openVision();if(b.dataset.v12==='outcome')openOutcome()}});
 root.querySelectorAll('[data-v12-close]').forEach(b=>b.onclick=()=>document.querySelector('#'+b.dataset.v12Close)?.classList.remove('open'));
}
function decorate(){
 ensure();armTimers();wireV12();
 const foot=document.querySelector('#railFooter');
 if(foot&&!document.querySelector('#v12BrainBtn')){const b=document.createElement('button');b.id='v12BrainBtn';b.dataset.v12='brain';b.textContent='🧠 Autopilot brain';foot.prepend(b);const v=document.createElement('button');v.id='v12VisionBtn';v.dataset.v12='vision';v.textContent='📷 Professor vision';foot.insertBefore(v,b.nextSibling);wireV12(foot)}
 const top=document.querySelector('.courseCrumb');if(top&&!document.querySelector('#v12Pulse')){const p=document.createElement('span');p.id='v12Pulse';p.className='v12Pulse';p.title='Personal optimizer active';p.textContent='●';top.prepend(p)}
 rankVisuals();startStationClock();
}
function trackVisualClick(el){
 const topic=currentTopic(),key=el.dataset.ctxVideo?'video:'+el.dataset.ctxVideo:'visual:'+(el.getAttribute('href')||el.querySelector('img')?.src||'unknown').slice(0,180);
 if(topic){lastVisualByTopic.set(topic,{key,at:Date.now()});const z=V().visualGenome[key]||(V().visualGenome[key]={n:0,ok:0,clicks:0,topics:{}});z.clicks=(z.clicks||0)+1}
}
function installVisualDelegation(){
 if(document.documentElement.dataset.v12VisualDelegation)return;
 document.documentElement.dataset.v12VisualDelegation='1';
 document.addEventListener('click',e=>{const el=e.target.closest?.('.realImg,.ctxImage a,[data-ctx-video]');if(el)trackVisualClick(el)},true);
}
function rankVisuals(){
 document.querySelectorAll('.lecturerGrid').forEach(g=>{
   const cards=[...g.querySelectorAll('[data-ctx-video]')];cards.sort((a,b)=>visualUtility(b.dataset.ctxVideo)-visualUtility(a.dataset.ctxVideo)).forEach(x=>g.appendChild(x));
 });
 installVisualDelegation();
}
function visualUtility(id){const z=V().visualGenome['video:'+id];return z?.n?(z.ok+1)/(z.n+2):.5}
function currentTopic(){return document.querySelector('#courseCrumbTitle')?.textContent?.trim()||safe(()=>currentLessonSegment()?.l?.topic,'')}
function startStationClock(){
 const stage=document.querySelector('.stage');if(!stage||!(/PRACTICAL WAVE|VISUAL BOSS/.test(stage.innerText||''))){clearInterval(stationTimer);stationTimer=null;return}
 if(stage.querySelector('.v12Station'))return;
 const timer=document.createElement('div');timer.className='v12Station';let seconds=/PRACTICAL WAVE/.test(stage.innerText)?45:60;timer.textContent='STATION · '+seconds+'s';stage.prepend(timer);
 clearInterval(stationTimer);stationTimer=setInterval(()=>{seconds--;timer.textContent='STATION · '+Math.max(0,seconds)+'s';if(seconds<=0){clearInterval(stationTimer);timer.classList.add('expired');timer.textContent='TIME · ANSWER NOW'}},1000)
}
function beforeAction(b){
 const a=b.dataset.act||'',qid=b.dataset.qid||'';
 let mode=a.includes('mock')?'mock':a.includes('retest')?'retest':a.includes('practical')?'practical':'q';
 return {a,qid,mode,timerKey:qid?questionTimerKey(qid,mode):null,confidence:(S.mock?.confidence||S.answers?.[b.dataset.qkey]?.confidence||'unsure'),topic:b.dataset.topic||'',lid:b.dataset.lid||'',ok:b.dataset.ok};
}
function afterAction(x){
 if(['qbank-choice','retest-qbank','mock-qbank','practical-source-choice'].includes(x.a))evidenceFromAction(x);
 else if(['boss-visual','boss-written-grade','written-wave-grade','practical-grade','review','grade','mock-grade','retest-grade','retest-mcq'].includes(x.a)){
   const ok=x.ok==='1',l=lessonById(x.lid),topic=x.topic||l?.topic||currentTopic();if(topic)recordEvidence(topic,ok,{self:true,confidence:ok?'confident':'unsure',visual:x.a.includes('visual')||x.a.includes('practical'),written:x.a.includes('written'),mode:x.a});
 }
 refreshCounterfactual();save();
}
function install(){
 ensure();buildTwin();buildGraph();examMode();
 const oldDue=dueReviews;dueReviews=function(){const rows=oldDue();return rows.map(x=>({...x,v12roi:roiFor({...x,minutes:3})})).sort((a,b)=>(b.v12roi||0)-(a.v12roi||0))};
 const oldRetest=qbankRetestForError;qbankRetestForError=function(e){const base=oldRetest(e),src=qBy(e.sourceQuestionId),mut=src?mutationCandidate(src):null;if(mut&&!S.qbank.used[mut.id]){V().mutations[e.id]={from:src.id,to:mut.id,at:new Date().toISOString()};return mut}return base};
 const oldQFor=qbankForLesson;qbankForLesson=function(l,d,slot=0){const base=oldQFor(l,d,slot);if(slot>0&&base&&posterior(l.topic)>.65){const mut=mutationCandidate(base);if(mut&&!S.qbank.used[mut.id])return mut}return base};
 const oldRead=readiness;readiness=function(){const r=oldRead(),p=predictedScore(),rows=masterySnapshot();return{...r,personalPredicted:p,uncertainty:rows.length?mean(rows.map(x=>x.u)):null,v12Evidence:V().evidence.length}};
 const oldNext=nextAction;nextAction=function(){const a=oldNext();V().telemetry.lastAutopilotDecision={at:new Date().toISOString(),day:S.day,kind:a?.kind||'UNKNOWN',topic:a?.l?.topic||a?.e?.topic||''};return a};
 const oldStop=stopView;stopView=function(d){let h=oldStop(d);const rows=refreshCounterfactual(),top=rows[0],msg=shouldStopExtra()?'Marginal mark-gain is now low. Stop studying.':'Required evidence is green; optional review remains lower priority than protecting your time.';return h.replace('<p>Today\'s required evidence is green. Unused minutes return to your life.</p>','<p>Today\'s required evidence is green. Unused minutes return to your life.</p><div class="v12Stop"><b>STOP-STUDY INTELLIGENCE:</b> '+esc12(msg)+(top?' Best optional review: '+esc12(top.topic)+' ('+top.roi.toFixed(2)+' ROI proxy).':'')+'</div>')};
 const oldPractical=practicalWaveView;practicalWaveView=function(d){return oldPractical(d).replace('<div class="stage">','<div class="stage v12PracticalStage">')};
 const oldAct=act;act=function(b){const x=beforeAction(b);const out=oldAct(b);setTimeout(()=>safe(()=>afterAction(x)),0);return out};
 const oldRender=render;render=function(...args){const out=oldRender(...args);setTimeout(()=>safe(()=>decorate()),0);return out};
 const oldUi=window.INTELLECTUALITY_COURSE_UI;window.INTELLECTUALITY_COURSE_UI=function(){oldUi?.();decorate()};
 window.INTELLECTUALITY_V12={posterior,roiFor,brainHTML,buildTwin,buildGraph,mutationCandidate,predictedScore,openVision,openBrain,refreshCounterfactual,examMode,recordEvidence,logError,qTopic};
 decorate();refreshCounterfactual();save();
}
window.INTELLECTUALITY_V12_INIT=function(){try{install()}catch(e){console.error('[v12 init fail-safe]',e)}};
})();