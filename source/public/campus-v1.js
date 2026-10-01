/* RENAISSANCE CAMPUS v1 · read-only curriculum map */
(function(){
"use strict";
const TRACKS=[
 {id:"boot",title:"I · Cognitive Bootloader",desc:"The 12 reusable thinking tools every later session can call on.",ids:["commit","select","base","loop","proxy","falsify","bottleneck","question","snow","double","taste","boss"]},
 {id:"letters",title:"II · Literature, Philosophy & Language",desc:"Primary text, argument, interpretation, cultural possession and linguistic register.",ids:["km1","km2","km3","ozy","names"]},
 {id:"science",title:"III · Mathematics, Science & Measurement",desc:"Abstraction, conservation, number systems, measurement and orientation under uncertainty.",ids:["euler","willow","zero","samarkand","wayfinding","maya"]},
 {id:"arts",title:"IV · Art, Music, Film & Built Worlds",desc:"Learn to see generative rules, expectation, editing, structure and physical forces.",ids:["pattern","cadence","cut","arch","angkor"]},
 {id:"civil",title:"V · Civilisation & Social Intelligence",desc:"Knowledge transmission, archives, conversation, hosting and institutions.",ids:["wisdom","timbuktu","salon","host"]}
];
let current=null,currentTab="lesson";
const $=(s)=>document.querySelector(s);
const E=(s)=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function md(t){
 let x=E(t||"");
 x=x.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,'<strong>$2</strong>');
 x=x.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
 return x.split(/\n{2,}/).map(p=>'<p>'+p.replace(/\n/g,'<br>')+'</p>').join("");
}
const seasons=()=>window.RENAISSANCE_SEASONS||[];
const sessions=()=>seasons().flatMap(z=>z.sessions||[]);
function session(id){return sessions().find(s=>s.id===id)||null;}
function seasonFor(id){return seasons().find(z=>(z.sessions||[]).some(s=>s.id===id))||null;}
function lookup(id,kind,sid){
 const own=seasonFor(sid)?.[kind]?.[id];if(own)return own;
 for(const z of seasons())if(z[kind]?.[id])return z[kind][id];
 return null;
}
function state(){try{return window.RENAISSANCE?.state?.()||{sessions:{}};}catch(e){return {sessions:{}};}}
function recommended(){try{return window.RENAISSANCE?.compile?.(new Date())?.sid||null;}catch(e){return null;}}
function statusOf(s,st,next){
 if(st.sessions?.[s.id]?.done)return "complete";
 if(next===s.id)return "recommended";
 if((s.requires||[]).some(id=>!st.sessions?.[id]?.done))return "prerequisite";
 return "available";
}
function totalMin(xs){return xs.reduce((n,s)=>n+(+s.minutes||0),0);}
function trackFor(id){return TRACKS.find(t=>t.ids.includes(id))||null;}
function render(){
 const host=$("#rcHost");if(!host)return;
 const all=sessions(),st=state(),next=recommended(),done=all.filter(s=>st.sessions?.[s.id]?.done).length,mins=totalMin(all);
 host.innerHTML='<section class="rcShell"><div class="rcHead"><div class="rcHeadRow"><div><p class="rsEyebrow">RENAISSANCE CAMPUS · COURSE MAP</p><h2>Everything has a door.</h2><p>Browse the complete authored curriculum without changing your evidence record. Search any lesson, open every step, inspect primary passages and provenance, then return to the evidence-bearing Study path when you want the system to count learning.</p></div><button class="rcResume" data-rc="study">RESUME LEARNING</button></div><div class="rcStats"><div class="rcStat"><b>'+done+' / '+all.length+'</b><span>sessions complete</span></div><div class="rcStat"><b>'+mins+'m</b><span>authored content</span></div><div class="rcStat"><b>'+TRACKS.length+'</b><span>curriculum tracks</span></div><div class="rcStat"><b>'+E(session(next)?.title||"Review")+'</b><span>compiler pick</span></div></div></div><div class="rcToolbar"><input id="rcSearch" class="rcSearch" type="search" placeholder="Search lessons, domains, capabilities, works, regions…"><button class="rcFilter on" data-rc="filter" data-filter="all">ALL</button><button class="rcFilter" data-rc="filter" data-filter="unfinished">UNFINISHED</button><button class="rcFilter" data-rc="filter" data-filter="done">COMPLETE</button></div><div id="rcBody" class="rcBody"></div></section>';
 renderTracks("","all");
 $("#rcSearch").addEventListener("input",e=>renderTracks(e.target.value,$(".rcFilter.on")?.dataset.filter||"all"));
}
function renderTracks(query,filter){
 const body=$("#rcBody");if(!body)return;
 const q=(query||"").trim().toLocaleLowerCase(),st=state(),next=recommended();
 let html="";
 for(const t of TRACKS){
  const xs=t.ids.map(session).filter(Boolean);
  const visible=xs.filter(s=>{
   const stat=statusOf(s,st,next);
   if(filter==="done"&&stat!=="complete")return false;
   if(filter==="unfinished"&&stat==="complete")return false;
   if(!q)return true;
   const hay=[s.title,s.hook,s.why,s.capability,s.stakes,s.domain,s.region,s.primitive,(s.atoms||[]).join(" "),(s.works||[]).join(" ")].join(" ").toLocaleLowerCase();
   return hay.includes(q);
  });
  if(!visible.length)continue;
  const d=xs.filter(s=>st.sessions?.[s.id]?.done).length,p=Math.round(100*d/Math.max(1,xs.length));
  html+='<section class="rcTrack"><div class="rcTrackHead"><div><h3>'+E(t.title)+'</h3><p>'+E(t.desc)+' · '+totalMin(xs)+' min</p></div><div class="rcTrackProgress">'+d+' / '+xs.length+' complete<i style="--p:'+p+'%"></i></div></div><div class="rcLessons">'+visible.map((s)=>{
   const stat=statusOf(s,st,next),n=sessions().findIndex(x=>x.id===s.id)+1;
   return '<button class="rcLesson '+(stat==="complete"?"done ":stat==="recommended"?"next ":"")+(s.deep?"deep":"")+'" data-rc="open" data-id="'+E(s.id)+'"><span class="rcNum">SESSION '+n+'</span><strong>'+E(s.title)+'</strong><p>'+E(s.hook||s.capability||"")+'</p><div class="rcLessonMeta"><span>'+(s.minutes||"?")+' min</span><span>'+E(s.domain||s.primitive||"core")+'</span><span class="rcState">'+E(stat)+'</span></div></button>';
  }).join("")+'</div></section>';
 }
 html+='<section class="rcTrack"><div class="rcTrackHead"><div><h3>VI · Reader OS Library</h3><p>Your imported books, papers, articles and notes become a living personal course shelf.</p></div></div><div id="rcReaderTrack" class="rcReaderTrack"><div class="rcEmpty">Loading your local Reader library…</div></div></section>';
 body.innerHTML=html||'<div class="rcEmpty">Nothing matches this view.</div>';
 renderReaderTrack(q);
}
async function renderReaderTrack(q){
 const box=$("#rcReaderTrack"),R=window.RENAISSANCE_READER;if(!box)return;
 if(!R?.library){box.innerHTML='<div class="rcEmpty">Reader OS is not available.</div>';return;}
 try{
  const list=(await R.library()).filter(r=>!q||(r.title+" "+(r.compiled?.terms||[]).map(x=>x.term).join(" ")).toLocaleLowerCase().includes(q));
  if(!list.length){box.innerHTML='<div class="rcEmpty">No Reader sources'+(q?" match the search":" yet. Import a source in Reader OS and it will appear here automatically")+'.</div>';return;}
  box.innerHTML='<div class="rcReaderCards">'+list.map(r=>'<button class="rcReaderCard" data-rc="reader" data-id="'+E(r.id)+'"><b>'+E(r.title)+'</b><small>'+((r.compiled?.words||0).toLocaleString())+' words · '+E(r.compiled?.type||"source")+' · '+E(R.mastery?.(r)?.label||"not proven")+'</small></button>').join("")+'</div>';
 }catch(e){box.innerHTML='<div class="rcEmpty">Reader library unavailable: '+E(e.message)+'</div>';}
}
function quote(id,sid){return lookup(id,"quotes",sid);}
function repHTML(rep,sid){
 if(!rep)return "";
 let visual="";
 if(rep.svg) visual='<div class="rcPill">interactive visual: '+E(typeof rep.svg==="string"?rep.svg:"embedded")+'</div>';
 return '<div class="rcBox"><b>'+E(rep.label||rep.kind||"Representation")+'</b>'+md(rep.body||"")+visual+'</div>';
}
function qHTML(q,key){
 if(!q)return "";
 const id="rcq-"+E(key);
 return '<div class="rcChoices">'+(q.options||[]).map((o,i)=>'<div class="rcChoice" data-choice="'+i+'">'+E(o.t)+'</div>').join("")+'</div><button class="rcReveal" data-rc="answer" data-q="'+id+'">REVEAL EXPLANATION</button><div id="'+id+'" class="rcAnswer" hidden>'+((q.options||[]).map((o,i)=>'<div class="rcChoice '+(o.ok?"ok":"bad")+'"><strong>'+(o.ok?"✓ ":"") + E(o.t)+'</strong>'+(o.why?'<br>'+E(o.why):"")+'</div>').join(""))+(q.after?md(q.after):"")+'</div>';
}
function stepHTML(x,sid,i){
 const title=x.title||x.label||({q:"Question",scene:"Explanation",model:"Interactive model",contrast:"Compare",passage:"Primary text",forge:"Forge",reality:"Reality check",close:"Close"}[x.type]||x.type||"Step");
 let inner="";
 if(x.type==="q"){inner+=md(x.stem||"")+qHTML(x,sid+"-"+x.id);}
 else if(x.type==="contrast"){
   inner+=md(x.body||"");
   inner+='<div class="rcPair"><div><h4>'+E(x.left?.title||"A")+'</h4>'+md(x.left?.body||"")+'</div><div><h4>'+E(x.right?.title||"B")+'</h4>'+md(x.right?.body||"")+'</div></div>';
   if(x.q)inner+=md(x.q.stem||"")+qHTML(x.q,sid+"-"+x.id);
 } else if(x.type==="passage"){
   inner+=md(x.body||"");
   for(const qid of x.quotes||[]){const q=quote(qid,sid);if(q)inner+='<figure class="rcQuote"><blockquote>'+E(q.text||"").replace(/\n/g,"<br>")+'</blockquote><small>'+E([q.speaker,q.work,q.where,q.translator&&("tr. "+q.translator)].filter(Boolean).join(" · "))+'</small></figure>';}
   if(x.after)inner+=md(x.after);
 } else if(x.type==="model"){
   inner+=md(x.body||"")+md(x.ask||"")+'<div class="rcBox"><b>INTERACTIVE MODEL</b><p>The live controls are preserved in Study mode so browsing cannot write experimental evidence or alter model-use telemetry.</p><div class="rcPills"><span class="rcPill">'+E(x.model||"model")+'</span></div></div>';
 } else if(x.type==="forge"){
   inner+=md(x.body||x.prompt||x.stem||"");
   if(x.q)inner+=md(x.q.stem||"")+qHTML(x.q,sid+"-"+x.id+"-forge");
   if(x.critique)inner+='<div class="rcBox"><b>CRITIQUE LAYER</b>'+md(typeof x.critique==="string"?x.critique:(x.critique.body||x.critique.stem||"Available in Study mode."))+'</div>';
 } else {
   inner+=md(x.body||x.stem||x.after||"");
   if(x.reps?.length)inner+='<div class="rcOverview">'+x.reps.map(r=>repHTML(r,sid)).join("")+'</div>';
   if(x.options)inner+=qHTML(x,sid+"-"+x.id);
 }
 const meta=[x.stage,x.kind,x.min&&x.min+" min"].filter(Boolean).join(" · ");
 return '<article class="rcStep"><div class="rcStepHead"><b>'+(i+1)+'. '+E(title)+'</b><span>'+E(meta)+'</span></div>'+inner+(x.terms?.length?'<div class="rcPills">'+x.terms.map(t=>'<span class="rcPill">'+E(t)+'</span>').join("")+'</div>':"")+'</article>';
}
function renderModal(){
 if(!current)return;
 const s=current,st=state(),t=trackFor(s.id),status=statusOf(s,st,recommended());
 $("#rcTitle").textContent=s.title;
 $("#rcKicker").textContent=(t?.title||"Renaissance")+" · "+status;
 $("#rcOverview").innerHTML='<div class="rcBox"><b>WHY THIS EXISTS</b>'+md(s.why||s.hook||"")+'</div><div class="rcBox"><b>CAPABILITY</b>'+md(s.capability||"")+'</div><div class="rcBox"><b>STAKES</b>'+md(s.stakes||"")+'</div><div class="rcBox"><b>CONNECTION</b>'+md(s.connection||s.bridge||"")+'</div>';
 $("#rcMeta").innerHTML=[(s.minutes||"?")+" min",s.domain||s.primitive,s.region,(s.atoms||[]).join(" · "),(s.works||[]).join(" · ")].filter(Boolean).map(x=>'<span class="rcPill">'+E(x)+'</span>').join("");
 showTab(currentTab);
}
function showTab(tab){
 currentTab=tab;
 document.querySelectorAll(".rcTab").forEach(b=>b.classList.toggle("on",b.dataset.tab===tab));
 const v=$("#rcView"),s=current;if(!v||!s)return;
 if(tab==="lesson"){
   let h='<div class="rcSteps">'+(s.steps||[]).map((x,i)=>stepHTML(x,s.id,i)).join("")+'</div>';
   if(s.challenge)h+='<h3>Challenge</h3><article class="rcStep">'+md(s.challenge.stem||s.challenge.body||"")+qHTML(s.challenge,s.id+"-challenge")+'</article>';
   if(s.deeper?.length)h+='<h3>Go deeper</h3><div class="rcSteps">'+s.deeper.map((x,i)=>'<article class="rcStep"><div class="rcStepHead"><b>'+E(x.title||("Depth "+(i+1)))+'</b></div>'+md(x.body||"")+'</article>').join("")+'</div>';
   v.innerHTML=h;return;
 }
 if(tab==="vocab"){
   const vs=s.vocab||{};v.innerHTML='<div class="rcVocab">'+Object.entries(vs).map(([k,x])=>'<div class="rcVocabCard"><b>'+E(x.name||k)+'</b><p>'+E(x.h||"")+'</p>'+(x.s?'<p class="rcArabic">'+E(x.s)+'</p>':"")+(x.t?'<p>'+E(x.t)+'</p>':"")+'</div>').join("")+'</div>';return;
 }
 if(tab==="sources"){
   v.innerHTML='<div class="rcSources">'+(s.provenance||[]).map(x=>'<article class="rcSource"><span class="rcGrade">'+E(x.grade||"?")+'</span> <b>'+E(x.id||"source")+'</b><p>'+E(x.claim||"")+'</p><p><strong>'+E(x.source||"")+'</strong>'+(x.year?" · "+E(x.year):"")+(x.kind?" · "+E(x.kind):"")+(x.license?" · "+E(x.license):"")+'</p>'+(x.note?'<p>'+E(x.note)+'</p>':"")+(x.contested?'<p><strong>Contested:</strong> '+E(x.contested)+'</p>':"")+'</article>').join("")+'</div>';return;
 }
 if(tab==="map"){
   v.innerHTML='<div class="rcBox"><b>SESSION POSITION</b><p>'+E((trackFor(s.id)?.title||"Curriculum")+" · Session "+(sessions().findIndex(x=>x.id===s.id)+1)+" of "+sessions().length)+'</p><div class="rcPills">'+(s.requires||[]).map(id=>'<span class="rcPill">requires '+E(session(id)?.title||id)+'</span>').join("")+'</div></div><div class="rcBox"><b>HOOK</b>'+md(s.hook||"")+'</div><div class="rcBox"><b>BRIDGE</b>'+md(s.bridge||"")+'</div>';return;
 }
}
function openSession(id){
 current=session(id);if(!current)return;
 currentTab="lesson";const m=$("#rcModal");m.hidden=false;document.body.style.overflow="hidden";renderModal();
}
function close(){current=null;$("#rcModal").hidden=true;document.body.style.overflow="";}
function study(){
 const R=window.RENAISSANCE;if(!R)return;
 const g=R.open();
 if(g&&!g.open){const el=$("#rcStudyMsg");if(el)el.textContent=g.msg||"The life governor is resting this session right now.";}
}
function mount(){
 const host=document.createElement("div");host.id="rcHost";
 const today=document.querySelector(".rsStats");(today?.parentNode||document.querySelector("main"))?.insertBefore(host,today?.nextSibling||null);
 const modal=document.createElement("div");modal.id="rcModal";modal.className="rcModal";modal.hidden=true;modal.innerHTML='<div class="rcPanel" role="dialog" aria-modal="true" aria-labelledby="rcTitle"><div class="rcTop"><div><small id="rcKicker">RENAISSANCE CAMPUS</small><h2 id="rcTitle"></h2></div><button class="rcClose" data-rc="close" aria-label="Close">×</button></div><div class="rcDetail"><div id="rcOverview" class="rcOverview"></div><div id="rcMeta" class="rcPills"></div><div class="rcTabs"><button class="rcTab on" data-rc="tab" data-tab="lesson">LESSON</button><button class="rcTab" data-rc="tab" data-tab="vocab">VOCABULARY</button><button class="rcTab" data-rc="tab" data-tab="sources">SOURCES</button><button class="rcTab" data-rc="tab" data-tab="map">MAP</button></div><div id="rcView"></div></div><div class="rcStudyBar"><span id="rcStudyMsg">Browse mode writes no mastery evidence. Study mode preserves predictions, retrieval and experimental integrity.</span><button class="rcStudyBtn" data-rc="study">RESUME EVIDENCE-BEARING STUDY</button></div></div>';
 document.body.appendChild(modal);
 document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-rc]");if(!b)return;
  const a=b.dataset.rc;
  if(a==="open")return openSession(b.dataset.id);
  if(a==="close")return close();
  if(a==="tab")return showTab(b.dataset.tab);
  if(a==="answer"){const el=document.getElementById(b.dataset.q);if(el)el.hidden=!el.hidden;return;}
  if(a==="study")return study();
  if(a==="filter"){document.querySelectorAll(".rcFilter").forEach(x=>x.classList.remove("on"));b.classList.add("on");return renderTracks($("#rcSearch")?.value||"",b.dataset.filter);}
  if(a==="reader"){if(window.RENAISSANCE_READER?.open)await window.RENAISSANCE_READER.open(b.dataset.id);return;}
 });
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#rcModal").hidden)close();});
 render();
}
window.RENAISSANCE_CAMPUS={version:"1.0",tracks:()=>JSON.parse(JSON.stringify(TRACKS)),open:openSession,doctor:()=>{const xs=sessions(),ids=TRACKS.flatMap(t=>t.ids),miss=xs.filter(s=>!ids.includes(s.id)).map(s=>s.id),dup=ids.filter((x,i)=>ids.indexOf(x)!==i);return {ok:xs.length===32&&ids.length===32&&!miss.length&&!dup.length,metrics:{sessions:xs.length,mapped:ids.length,tracks:TRACKS.length},failures:[...(miss.length?["unmapped "+miss.join(",")]:[]),...(dup.length?["duplicate "+dup.join(",")]:[])]};}};
document.addEventListener("DOMContentLoaded",mount);
})();