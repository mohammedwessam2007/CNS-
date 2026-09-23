(function(){
'use strict';
let episode=null,screen=null,tick=null,lastInteraction=Date.now(),saveTick=0;
const T=()=>window.INTELLECTUALITY_TWIN;
const safe=(fn,f=null)=>{try{return fn()}catch(_){return f}};
function lessonById(id){for(const d of C.days||[]){const l=(d.lessons||[]).find(x=>x.id===id);if(l)return l}return null}
function currentLesson(){const id=document.querySelector('[data-lesson-id]')?.dataset.lessonId;return id?lessonById(id):safe(()=>currentLessonSegment()?.l,null)}
function currentTopic(){return document.querySelector('#courseCrumbTitle')?.textContent?.trim()||currentLesson()?.topic||''}
function snippets(){return [...document.querySelectorAll('.spoonCard .bigSay,.spoonFact .a,.professorLead,.professorModel,.v14ModelLine,.v14Cue')].map(x=>(x.textContent||'').replace(/\s+/g,' ').trim()).filter(x=>x.length>=18).slice(0,6)}
function beginEpisode(){const l=currentLesson();episode={started:Date.now(),topic:l?.topic||currentTopic(),lessonId:l?.id||'',subject:l?.subject||'',deep:false,videos:[],visual:false,audio:false,vision:false,snippets:snippets()}}
function methods(ep){const x=[];if(ep?.vision)x.push('vision');if(ep?.videos?.length)x.push('video');if(ep?.deep)x.push('deep');if(ep?.audio)x.push('audio');if(ep?.visual)x.push('visual');if(!x.length)x.push('feed');return [...new Set(x)]}
function observeScreen(){
 const a=safe(()=>nextAction(),null),key=[S.day,a?.kind,a?.l?.id,a?.si,a?.e?.id,S.mock?.i].join(':');if(screen?.key===key)return;
 const topic=a?.l?.topic||a?.e?.topic||currentTopic();finishScreen();screen={key,started:Date.now(),kind:a?.kind||'',topic,lessonId:a?.l?.id||a?.e?.lessonId||'',scrollMax:0};
 if(!episode||episode.topic!==topic)beginEpisode();else episode.snippets=[...new Set([...(episode.snippets||[]),...snippets()])].slice(0,10)
}
function finishScreen(){if(!screen)return;const ms=Math.min(Math.max(0,Date.now()-screen.started),1200000);S.v13.history.push({at:new Date().toISOString(),kind:screen.kind,topic:screen.topic,ms,scroll:screen.scrollMax});S.v13.history=S.v13.history.slice(-500);screen=null}
function captureScroll(){if(!screen)return;const d=document.documentElement,den=Math.max(1,d.scrollHeight-innerHeight),p=T().clamp(scrollY/den);screen.scrollMax=Math.max(screen.scrollMax||0,p)}
function trackInteraction(e){
 lastInteraction=Date.now();const s=T().session();s.lastSeen=new Date().toISOString();
 const el=e.target?.closest?.('[data-ctx-video],.realImg,.ctxImage a,.v14Visual,[data-prof-speak],[data-v12="vision"]');if(!el)return;if(!episode)beginEpisode();
 if(el.dataset.ctxVideo){if(!episode.videos.includes(el.dataset.ctxVideo))episode.videos.push(el.dataset.ctxVideo);s.videos++}
 else if(el.matches('[data-prof-speak]')){episode.audio=true;s.audio++}
 else if(el.dataset.v12==='vision'){episode.vision=true;s.vision++}
 else{episode.visual=true;s.visualClicks++}
}
function hookDeep(){
 document.querySelectorAll('.deepOptional').forEach(d=>{if(d.dataset.v13Hook)return;d.dataset.v13Hook='1';d.addEventListener('toggle',()=>{if(d.open){if(!episode)beginEpisode();episode.deep=true;T().session().deepOpens++}})})
}
function tickActive(){
 clearInterval(tick);tick=setInterval(()=>{if(document.visibilityState==='visible'&&Date.now()-lastInteraction<120000){const s=T().session();s.activeMs+=15000;s.lastSeen=new Date().toISOString();T().twin().totals.activeMs=(T().twin().totals.activeMs||0)+15000;if(Date.now()-saveTick>60000){saveTick=Date.now();T().persist()}}},15000)
}
function learnFocus(){
 const s=T().session(),r=T().twin().rhythm;if(!s||s.evidence<4)return;const acc=s.correct/Math.max(1,s.evidence),mins=s.activeMs/60000;
 if(mins>=35&&mins<=95&&acc>=.8)r.focusSpanMin=T().clamp(r.focusSpanMin*.9+mins*.1,45,85);
 if(mins>=45&&acc<.6)r.focusSpanMin=T().clamp(r.focusSpanMin*.92+Math.max(45,mins-10)*.08,45,85)
}
function evidenceKey(ev){return [ev.at||'',ev.qid||'',ev.mode||'',ev.ok?'1':'0'].join('|')}
function ingestPending(){
 const t=T().twin(),seen=new Set(t.processedEvidence||[]),rows=S.v12?.evidence||[];let learned=0;
 for(const ev of rows){const key=evidenceKey(ev);if(seen.has(key))continue;const live=Math.abs(Date.now()-Date.parse(ev.at||0))<15000,ep=live?episode:null,lat=ev.latencyMs,ks=methods(ep);
   T().confidence(ev.confidence||'unsure',ev.ok);T().timeBucket(ev.ok,lat);T().forgetting(ev.topic,ev.ok,ev.at);T().teaching(ev.topic,ev.ok,ks,ep?.snippets||[]);
   ks.forEach(k=>T().method(k,ev.ok,lat));(ep?.videos||[]).forEach(id=>T().video(id,ev.ok,lat));
   const s=T().session();s.evidence++;if(ev.ok)s.correct++;else s.wrong++;if(Number.isFinite(lat)){s.latencies.push(lat);s.latencies=s.latencies.slice(-30)}
   t.totals.evidence=(t.totals.evidence||0)+1;if(ev.ok)t.totals.correct=(t.totals.correct||0)+1;seen.add(key);learned++;learnFocus();if(live)beginEpisode()
 }
 t.processedEvidence=[...seen].slice(-1200);if(learned){S.v13.portableProfile=T().portableProfile?.()||null;T().persist()}return learned
}
function recent(n=6){return(S.v12?.evidence||[]).slice(-n)}
function breakDue(){
 const r=T().twin().rhythm,s=T().session(),since=(s.activeMs||0)/60000-(r.lastBreakActiveMin||0);if(since<r.minBreakGapMin)return false;
 const rows=recent(6),acc=rows.length>=4?rows.filter(x=>x.ok).length/rows.length:1,slow=rows.map(x=>x.latencyMs).filter(Number.isFinite),med=T().median(slow),all=(S.v12?.evidence||[]).map(x=>x.latencyMs).filter(Number.isFinite),base=T().median(all.slice(-25))||med;
 return since>=r.focusSpanMin+15||(since>=r.focusSpanMin&&(acc<.72||(med&&base&&med>base*1.3)))
}
function personalROI(x){
 const base=window.INTELLECTUALITY_V12?.roiFor?.(x)||0,l=x?.l||lessonById(x?.lessonId);if(!l)return base;
 const pr=T().personalRetention(l.topic),br=safe(()=>retention(l.topic),pr),b=T().twin().rhythm.buckets[T().bucket()],time=b?.n>=4?T().clamp((b.ok/b.n)/.75,.82,1.15):1;
 return base*T().clamp(1+(br-pr)*.7,.75,1.35)*time
}
function wrapRouting(){
 const oldDue=dueReviews;dueReviews=function(){return oldDue().map(x=>({...x,v13roi:personalROI({...x,minutes:3}),personalRetention:T().personalRetention(x.l.topic)})).sort((a,b)=>(b.v13roi||0)-(a.v13roi||0))};
 const oldNext=nextAction;nextAction=function(){const a=oldNext();if(a?.kind==='SEGMENT'&&breakDue())return{kind:'FATIGUE_RESET',v13:true};return a}
}
function personalAnchor(l){
 if(!l)return null;
 const own=T().bestSnippet?.(l.topic);if(own&&own.score>=.62)return{topic:l.topic,text:own.text,w:9,p:own.x.n?own.x.ok/own.x.n:0,kind:'learned-language'};
 if(!S.v12?.graph?.nodes?.[l.id])return null;const ns=Object.entries(S.v12.graph.nodes[l.id].neighbors||{}).sort((a,b)=>b[1]-a[1]);
 for(const [id,w] of ns){const o=lessonById(id);if(!o||o.subject!==l.subject)continue;const p=window.INTELLECTUALITY_V12?.posterior?.(o.topic)||0,m=T().twin().teachingMemory[o.topic];if(p<.78||!m||m.n<2||m.ok/Math.max(1,m.n)<.75)continue;const P=window.INTELLECTUALITY_PROFESSOR?.[o.id]||{},s=P.seed||{},text=s.minimumModel||P.mental||o.mental;if(text)return{topic:o.topic,text,w,p,kind:'transfer-anchor'}}return null
}
function injectAnchor(){
 const host=document.querySelector('[data-lesson-id] .spoonRail'),l=currentLesson();if(!host||!l||host.querySelector('.v13Anchor'))return;const a=personalAnchor(l);if(!a)return;
 const c=document.createElement('div');c.className='spoonCard v13Anchor';const lead=a.kind==='learned-language'?'This exact wording has worked for you before.':'Build from <strong>'+String(a.topic).replace(/[&<>]/g,'')+'</strong>.';c.innerHTML='<b>🧬 YOUR ANCHOR</b><div class="micro">'+lead+' '+String(a.text).replace(/[&<>]/g,'')+'</div>';host.insertBefore(c,host.children[1]||null)
}
function reorderTeachers(){document.querySelectorAll('.lecturerGrid').forEach(g=>{const cards=[...g.querySelectorAll('[data-ctx-video]')];cards.sort((a,b)=>T().videoUtility(b.dataset.ctxVideo)-T().videoUtility(a.dataset.ctxVideo)).forEach(x=>g.appendChild(x))})}
function snapshotDay(){
 const d=safe(()=>day(),null);if(!d)return;const today=new Date().toISOString().slice(0,10),key=d.day+':'+today,t=T().twin();if(t.days.some(x=>x.key===key))return;
 const ev=(S.v12?.evidence||[]).filter(x=>(x.at||'').slice(0,10)===today),sessions=(t.sessions||[]).filter(x=>(x.startedAt||'').slice(0,10)===today),activeMin=Math.round(sessions.reduce((z,x)=>z+(x.activeMs||0),0)/60000),returned=Math.max(0,Math.round((t.objective.dailySoftCeilingMin||100)-activeMin));
 t.days.push({key,day:d.day,at:new Date().toISOString(),activeMin,returnedMin:returned,evidence:ev.length,accuracy:ev.length?ev.filter(x=>x.ok).length/ev.length:null,done:dayProgress(d)});t.days=t.days.slice(-180);t.totals.returnedMin=(t.totals.returnedMin||0)+returned;S.v13.portableProfile=T().portableProfile?.()||null;T().persist()
}
function decorate(){T().ensure();ingestPending();observeScreen();hookDeep();injectAnchor();reorderTeachers();T().session()}
function install(){
 T().ensure();wrapRouting();tickActive();document.addEventListener('pointerdown',trackInteraction,true);document.addEventListener('keydown',()=>{lastInteraction=Date.now();T().session().lastSeen=new Date().toISOString()},true);document.addEventListener('scroll',captureScroll,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){finishScreen();T().persist()}else{lastInteraction=Date.now();T().session();observeScreen()}});window.addEventListener('pagehide',()=>{finishScreen();const s=T().session();s.lastSeen=new Date().toISOString();s.open=false;T().persist()});
 const oldSave=save;save=function(){T().persist();return oldSave()};
 const oldAct=act;act=function(b){const a=b.dataset.act||'';if(a==='fatigue-reset'){T().session(true);T().twin().rhythm.lastBreakActiveMin=0}const out=oldAct(b);setTimeout(()=>{try{ingestPending();delete S.v13.bridgeError}catch(e){S.v13.bridgeError={at:new Date().toISOString(),message:String(e),stack:String(e?.stack||'').slice(0,1200)};console.error('[v13 evidence reconciliation]',e)}if(a==='certify')safe(snapshotDay);safe(decorate)},160);return out};
 const oldRender=render;render=function(...args){const out=oldRender(...args);setTimeout(()=>safe(decorate),0);return out};
 window.INTELLECTUALITY_V13_RUNTIME={personalROI,personalAnchor,breakDue,snapshotDay,ingestPending};decorate()
}
window.INTELLECTUALITY_V13_INIT=function(){try{install()}catch(e){console.error('[v13 init fail-safe]',e)}};
})();