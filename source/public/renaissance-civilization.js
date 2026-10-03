/* RENAISSANCE CIVILIZATION v1.1
 * Product law: civilization is visible; measurement is infrastructure.
 * Great works are encountered, not reduced to quiz objects.
 */
(function(){
"use strict";
const GROUPS=[
 {k:"Literature · Philosophy",title:"Enter minds larger than summaries",desc:"Primary works, arguments, characters, language and interpretation. The machine compresses scaffolding; the human keeps the irreducible encounter.",ids:["km1","km2","km3","ozy","names"]},
 {k:"Art · Music · Film · Architecture",title:"Learn to see and hear structure",desc:"Composition, expectation, editing, form, force, symbolism and taste become part of perception rather than vocabulary lists.",ids:["pattern","cadence","cut","arch","angkor"]},
 {k:"Civilisations · History · Social Life",title:"Build an inner map of human worlds",desc:"Transmission, cities, archives, institutions, conversation, hosting and the ways cultures remember themselves.",ids:["wisdom","timbuktu","salon","host"]},
 {k:"Mathematics · Science · Discovery",title:"Absorb the models underneath reality",desc:"Proof, number, measurement, conservation, uncertainty and discovery without turning knowledge into trivia.",ids:["euler","willow","zero","samarkand","wayfinding","maya"]}
];
const METHOD=[
 ["ORIENT","Renaissance does the source-hunting, chronology, translation comparison and secondary reading before your attention is spent."],
 ["ENCOUNTER","You meet the irreducible thing itself: the scene, passage, poem, painting, movement, proof, argument, building or experiment."],
 ["SEE DEEPER","Context, form, symbols, rival interpretations, criticism and historical consequences become visible around the primary encounter."],
 ["CONNECT","The work joins the rest of your inner civilisation: philosophy meets literature, architecture meets mechanics, music meets mathematics, history meets institutions."],
 ["MAKE IT YOURS","Conversation, writing, drawing, explanation, creation or real-world noticing turns acquaintance into possession. Memory machinery stays mostly invisible underneath."]
];
const $=(s)=>document.querySelector(s);
const E=(s)=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sessions=()=>((window.RENAISSANCE_SEASONS||[]).flatMap(z=>z.sessions||[]));
const byId=(id)=>sessions().find(s=>s.id===id)||null;
function workLabel(s){
 const works=(s&&s.works)||[];
 return works.length?works.slice(0,2).join(" · "):(s?.domain||s?.region||s?.primitive||"Renaissance encounter");
}
function open(id){
 if(window.RENAISSANCE_CAMPUS?.open){window.RENAISSANCE_CAMPUS.open(id);return;}
 const campus=$("#rcHost"); if(campus)campus.scrollIntoView({behavior:"smooth",block:"start"});
}
function pickToday(){
 const pool=GROUPS.flatMap(g=>g.ids).map(byId).filter(Boolean);
 if(!pool.length)return null;
 const d=new Date();
 const day=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);
 return pool[((day%pool.length)+pool.length)%pool.length];
}
function render(){
 const host=$("#rvHost"); if(!host)return;
 const today=pickToday();
 const worlds=GROUPS.map(g=>{
  const cards=g.ids.map(byId).filter(Boolean).map(s=>'<button class="rvWork" type="button" data-rv-open="'+E(s.id)+'"><span><strong>'+E(s.title)+'</strong><small>'+E(workLabel(s))+(s.minutes?' · '+E(s.minutes)+' min':'')+'</small></span><i aria-hidden="true">→</i></button>').join("");
  return '<article class="rvWorld"><span class="rvWorldKicker">'+E(g.k)+'</span><h3>'+E(g.title)+'</h3><p>'+E(g.desc)+'</p><div class="rvWorks">'+cards+'</div></article>';
 }).join("");
 const method=METHOD.map(([name,desc],i)=>'<article class="rvMethodStep"><span>'+String(i+1).padStart(2,"0")+'</span><div><b>'+E(name)+'</b><p>'+E(desc)+'</p></div></article>').join("");
 host.innerHTML='<section class="rvCivilization" aria-label="Renaissance civilisation">'+
 '<div class="rvManifesto"><p class="rvOverline">PRIVATE CIVILIZATION · ONE LIFETIME · THE BEST OF HUMANITY</p><h1>Absorb civilisation.<br><em>Keep what cannot be compressed.</em></h1><p class="rvManifestoLead">Renaissance carries the impossible administrative burden of self-education for you. It searches, compares, compresses and remembers around you, while preserving the parts a human must actually read, see, hear, argue with, make or live.</p><div class="rvLaw"><article><b>The machine eats the scaffolding.</b><span>Secondary explanation, repetitive exposition and source-hunting should not consume your life merely because books are long.</span></article><article><b>You keep the human encounter.</b><span>Great prose, poetry, paintings, music, film, proof, argument and places survive whenever compression would destroy the point.</span></article><article><b>Testing stays under the floor.</b><span>Retrieval and measurement may protect memory, but Renaissance should feel like entering worlds, not sitting an examination.</span></article></div></div>'+
 (today?'<div class="rvToday"><article class="rvTodayMain"><span class="rvWorldKicker">TODAY · ONE ENCOUNTER</span><h2>'+E(today.title)+'</h2><p>'+E(today.hook||today.why||"Enter the work before the machinery explains it.")+'</p><button class="rvEnter" type="button" data-rv-open="'+E(today.id)+'">ENTER TODAY\'S WORLD</button></article><aside class="rvTodayWhy"><span class="rvWorldKicker">WHY THIS EXISTS</span><h3>'+E(workLabel(today))+'</h3><p>'+(today.why?E(today.why):'This belongs to the connected civilisation Renaissance is building inside you. No streak and no score are the point.')+'</p></aside></div>':'')+
 '<div class="rvWorlds"><div class="rvWorldsTop"><div><p class="rvOverline">WORLDS & WORKS</p><h2>An inner library, museum, concert hall and laboratory.</h2></div><p>The authored collection is the seed. World Harvester and Reader OS are infrastructure for expanding it without turning you into the librarian.</p></div><div class="rvWorldGrid">'+worlds+'</div></div>'+
 '<section class="rvMethod"><div class="rvWorldsTop"><div><p class="rvOverline">THE GREAT-WORKS LAW</p><h2>Never summarize away the reason a masterpiece matters.</h2></div><p>The treatment changes with the object. A poem may stay whole. A novel may preserve decisive scenes. A symphony must be heard. A proof must be followed. A building may need to be visited.</p></div><div class="rvMethodGrid">'+method+'</div></section>'+
 '</section>';
 host.addEventListener("click",e=>{const b=e.target.closest("[data-rv-open]");if(b)open(b.dataset.rvOpen);},{once:true});
}
function civilizeCampus(){
 const host=$("#rcHost"); if(!host)return;
 const patch=()=>{
  host.querySelectorAll(".rsEyebrow").forEach(x=>{if(/COURSE MAP/i.test(x.textContent||""))x.textContent="RENAISSANCE CAMPUS · WORLDS & WORKS";});
  host.querySelectorAll("h2").forEach(x=>{if((x.textContent||"").trim()==="Everything has a door.")x.textContent="Every world has a door.";});
  host.querySelectorAll(".rcResume").forEach(x=>{x.textContent="CONTINUE RENAISSANCE";});
  host.querySelectorAll(".rcNum").forEach(x=>{x.textContent=(x.textContent||"").replace(/^SESSION\s+/i,"ENCOUNTER ");});
  host.querySelectorAll("h3").forEach(x=>{if((x.textContent||"").trim()==="Challenge")x.textContent="A question worth carrying";});
  host.querySelectorAll("summary").forEach(x=>{if(/experience, step by step/i.test(x.textContent||""))x.textContent="Open the compiled encounter";});
  host.querySelectorAll("small").forEach(x=>{if(/error family:/i.test(x.textContent||""))x.textContent=(x.textContent||"").replace(/error family:/i,"tempting mistake:");});
  const tracks=[...host.querySelectorAll(".rcTrack")];
  const boot=tracks.find(t=>/Cognitive Bootloader/i.test(t.textContent||""));
  if(boot){boot.classList.add("rvInternalTrack");boot.setAttribute("aria-hidden","true");}
 };
 patch(); new MutationObserver(patch).observe(host,{childList:true,subtree:true});
}
function polishShell(){
 const nav=[...document.querySelectorAll(".rsNav a")];
 nav.forEach(a=>{
  if(/COURSE MAP|WORLDS/i.test(a.textContent||"")){a.textContent="WORLDS";a.href="#rvHost";}
  if(/READER OS|SOURCE LAB/i.test(a.textContent||"")){a.textContent="SOURCE LAB";a.href="#rvSourceLab";}
  if(/TODAY/i.test(a.textContent||"")){a.textContent="TODAY";a.href="#rvHost";}
 });
 const sub=document.querySelector(".rsBrand small"); if(sub)sub.textContent="INTELLECTUALITY · PRIVATE CIVILIZATION";
 const build=$("#rsBuild"); if(build)build.dataset.civilization="1";
}
function boot(){render();civilizeCampus();polishShell();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
window.RENAISSANCE_CIVILIZATION={version:"1.1",groups:()=>JSON.parse(JSON.stringify(GROUPS)),today:()=>pickToday()?.id||null,doctor:()=>{const ids=GROUPS.flatMap(g=>g.ids),missing=ids.filter(id=>!byId(id));return{ok:!missing.length,metrics:{worlds:GROUPS.length,encounters:ids.length,methodSteps:METHOD.length},failures:missing.map(id=>"missing encounter "+id)};}};
})();
