/* RENAISSANCE CIVILIZATION v1.0
 * Visible product law: civilization first; testing/measurement stays underneath.
 */
(function(){
"use strict";
const GROUPS=[
 {k:"Literature · Philosophy",title:"Enter minds larger than summaries",desc:"Primary works, arguments, characters, language and interpretation. The machine may compress scaffolding; the human keeps the irreducible encounter.",ids:["km1","km2","km3","ozy","names"]},
 {k:"Art · Music · Film · Architecture",title:"Learn to see and hear structure",desc:"Composition, expectation, editing, form, force, symbolism and taste become part of perception rather than vocabulary lists.",ids:["pattern","cadence","cut","arch","angkor"]},
 {k:"Civilisations · History · Social Life",title:"Build an inner map of human worlds",desc:"Transmission, cities, archives, institutions, conversation, hosting and the ways cultures remember themselves.",ids:["wisdom","timbuktu","salon","host"]},
 {k:"Mathematics · Science · Discovery",title:"Absorb the models underneath reality",desc:"Proof, number, measurement, conservation, uncertainty and scientific discovery without turning knowledge into trivia.",ids:["euler","willow","zero","samarkand","wayfinding","maya"]}
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
 location.hash="rcHost";
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
 host.innerHTML='<section class="rvCivilization" aria-label="Renaissance civilisation"><div class="rvManifesto"><p class="rvOverline">PRIVATE CIVILIZATION · ONE LIFETIME · THE BEST OF HUMANITY</p><h2>Absorb civilisation.<br><em>Keep what cannot be compressed.</em></h2><p class="rvManifestoLead">Renaissance exists to carry the impossible administrative burden of self-education for you. It searches, compares, compresses and remembers around you, while preserving the parts a human must actually read, see, hear, argue with, make or live.</p><div class="rvLaw"><article><b>The machine eats the scaffolding.</b><span>Secondary explanation, repetitive exposition and source-hunting should not consume your life merely because books are long.</span></article><article><b>You keep the human encounter.</b><span>Great prose, poetry, paintings, music, film, proof, argument and places survive whenever compression would destroy the point.</span></article><article><b>Tests stay under the floor.</b><span>Retrieval and measurement may protect memory, but Renaissance must feel like entering worlds, not sitting an IQ examination.</span></article></div></div>'+
 (today?'<div class="rvToday"><article class="rvTodayMain"><span class="rvWorldKicker">TODAY · ONE ENCOUNTER</span><h3>'+E(today.title)+'</h3><p>'+E(today.hook||today.why||"Enter the work before the machinery explains it.")+'</p><button class="rvEnter" type="button" data-rv-open="'+E(today.id)+'">ENTER TODAY\'S WORLD</button></article><aside class="rvTodayWhy"><span class="rvWorldKicker">WHY THIS EXISTS</span><h4>'+E(workLabel(today))+'</h4><p>'+(today.why?E(today.why):'This is part of the connected civilisation Renaissance is building inside you. No streak and no score are the point.')+'</p></aside></div>':'')+
 '<div class="rvWorlds"><div class="rvWorldsTop"><div><p class="rvOverline">WORLDS & WORKS</p><h2>An inner library, museum, concert hall and laboratory.</h2></div><p>The authored collection is only the beginning. World Harvester and Reader OS are infrastructure for expanding this map without turning you into the librarian.</p></div><div class="rvWorldGrid">'+worlds+'</div></div></section>';
 host.addEventListener("click",e=>{const b=e.target.closest("[data-rv-open]");if(b)open(b.dataset.rvOpen);});
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
  if(boot){boot.classList.add("rvInternalTrack");const h=boot.querySelector("h3");if(h)h.textContent="VI · Thinking Tools · background infrastructure";const p=boot.querySelector(".rcTrackHead p");if(p)p.firstChild&&(p.firstChild.textContent="Reusable reasoning machinery. Useful, but no longer the front door to Renaissance. ");boot.parentElement?.appendChild(boot);}
 };
 patch(); new MutationObserver(patch).observe(host,{childList:true,subtree:true});
}
function polishShell(){
 const nav=[...document.querySelectorAll(".rsNav a")];
 nav.forEach(a=>{if(/COURSE MAP/i.test(a.textContent||"")){a.textContent="WORLDS";a.href="#rvHost";} if(/READER OS/i.test(a.textContent||"")){a.textContent="SOURCE LAB";a.href="#rvSourceLab";}});
 const sub=document.querySelector(".rsBrand small"); if(sub)sub.textContent="INTELLECTUALITY · PRIVATE CIVILIZATION";
 const build=$("#rsBuild"); if(build)build.dataset.civilization="1";
}
function boot(){render();civilizeCampus();polishShell();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
window.RENAISSANCE_CIVILIZATION={version:"1.0",groups:()=>JSON.parse(JSON.stringify(GROUPS)),today:()=>pickToday()?.id||null,doctor:()=>{const ids=GROUPS.flatMap(g=>g.ids),missing=ids.filter(id=>!byId(id));return{ok:!missing.length,metrics:{worlds:GROUPS.length,encounters:ids.length},failures:missing.map(id=>"missing encounter "+id)};}};
})();
