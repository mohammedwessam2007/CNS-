/* RENAISSANCE EXPERIENCE v1.0
 * Presentation-only adapter. It changes language, never evidence semantics.
 */
(function(){
"use strict";
const $=s=>document.querySelector(s);
function patchCampus(){
 const host=$("#rcHost");if(host){
  host.querySelectorAll(".rsEyebrow").forEach(x=>{if(/COURSE MAP/i.test(x.textContent||""))x.textContent="RENAISSANCE CAMPUS · WORLDS & WORKS";});
  host.querySelectorAll("h2").forEach(x=>{if((x.textContent||"").trim()==="Everything has a door.")x.textContent="Every world has a door.";});
  host.querySelectorAll(".rcResume").forEach(x=>x.textContent="CONTINUE RENAISSANCE");
  host.querySelectorAll(".rcNum").forEach(x=>x.textContent=(x.textContent||"").replace(/^SESSION\s+/i,"ENCOUNTER "));
  const q=$("#rcSearch");if(q)q.placeholder="Search works, ideas, people, places, media and worlds…";
  host.querySelectorAll(".rcFilter").forEach(x=>{if(x.dataset.filter==="unfinished")x.textContent="UNVISITED";if(x.dataset.filter==="done")x.textContent="VISITED";});
  const boot=[...host.querySelectorAll(".rcTrack")].find(t=>/Cognitive Bootloader/i.test(t.textContent||""));
  if(boot){boot.classList.add("rvInternalTrack");boot.setAttribute("aria-hidden","true");}
 }
 patchModal();
}
function patchModal(){
 const modal=$("#rcModal");if(!modal)return;
 const labels={lesson:"ENCOUNTER",retrieval:"REMEMBER",vocab:"LANGUAGE",sources:"SOURCES",map:"CONNECTIONS"};
 modal.querySelectorAll(".rcTab").forEach(b=>{if(labels[b.dataset.tab])b.textContent=labels[b.dataset.tab];});
 const msg=$("#rcStudyMsg");if(msg)msg.textContent="Browse freely. Entering an encounter quietly preserves memory evidence underneath.";
 modal.querySelectorAll(".rcStudyBtn").forEach(b=>{if(b.dataset.rc==="study")b.textContent="CONTINUE";if(b.dataset.rc==="studythis")b.textContent="ENTER THIS WORLD";});
 modal.querySelectorAll(".rcReveal").forEach(b=>{if(/REVEAL EXPLANATION/i.test(b.textContent||""))b.textContent="OPEN EXPLANATION";});
 modal.querySelectorAll("h3").forEach(x=>{if((x.textContent||"").trim()==="Challenge")x.textContent="A question worth carrying";});
 modal.querySelectorAll("small").forEach(x=>{if(/error family:/i.test(x.textContent||""))x.textContent=(x.textContent||"").replace(/error family:/i,"tempting mistake:");});
}
function boot(){patchCampus();const host=$("#rcHost"),modal=$("#rcModal");if(host)new MutationObserver(patchCampus).observe(host,{childList:true,subtree:true});if(modal)new MutationObserver(patchModal).observe(modal,{childList:true,subtree:true});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
window.RENAISSANCE_EXPERIENCE={version:"1.0",doctor:()=>({ok:!!$("#rvHost"),failures:$("#rvHost")?[]:["civilization host missing"]})};
})();
