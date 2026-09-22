(function(){
'use strict';
const T=()=>window.INTELLECTUALITY_TWIN;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function subjectHalfLife(sub){
 const t=T().twin(),vals=[];for(const d of C.days||[])for(const l of d.lessons||[])if(l.subject===sub&&t.forgetting[l.topic])vals.push(t.forgetting[l.topic].stabilityDays);
 return vals.length?T().median(vals):null
}
function addon(){
 const t=T().twin(),m=T().bestMethod(),b=T().bestBucket(),trust=T().confidenceTrust(),n=t.totals.evidence||0,acc=n?(t.totals.correct||0)/n:null,returned=t.totals.returnedMin||0;
 const subs=['ANATOMY','PHYSIOLOGY','HISTOLOGY'].map(s=>({s,h:subjectHalfLife(s)})).filter(x=>x.h),lang=Object.entries(t.language?.snippets||{}).map(([text,x])=>({text,n:x.n,acc:x.n?x.ok/x.n:0})).filter(x=>x.n>=2).sort((a,b)=>b.acc-a.acc||b.n-a.n)[0];
 return '<div class="v13Soul"><h3>Learning Twin</h3><div class="v13SoulGrid">'+
  '<div class="v13Mini"><span>Evidence learned</span><b>'+n+'</b><small>'+(acc==null?'calibrating':Math.round(acc*100)+'% observed accuracy')+'</small></div>'+
  '<div class="v13Mini"><span>Focus span</span><b>'+Math.round(t.rhythm.focusSpanMin)+' min</b><small>learned from your sessions</small></div>'+
  '<div class="v13Mini"><span>Confidence trust</span><b>'+(trust==null?'—':Math.round(trust*100)+'%')+'</b><small>when you choose confident</small></div>'+
  '<div class="v13Mini"><span>Best teaching route</span><b>'+(m?esc(m.k):'learning')+'</b><small>accuracy × speed</small></div>'+
  '<div class="v13Mini"><span>Best time window</span><b>'+(b?esc(b.k):'learning')+'</b><small>from your own attempts</small></div>'+
  '<div class="v13Mini"><span>Life ceiling</span><b>'+t.objective.dailyHardCeilingMin+' min</b><small>ceiling, never a quota</small></div>'+
  '<div class="v13Mini"><span>Time returned</span><b>'+returned+' min</b><small>vs your soft study ceiling</small></div>'+
 '</div>'+(lang?'<div class="v13Doctrine"><b>Your language:</b> “'+esc(lang.text)+'” <span class="tiny">· '+Math.round(lang.acc*100)+'% success after this cue</span></div>':'')+
 (subs.length?'<h3>Personal forgetting</h3><div class="v13SoulGrid">'+subs.map(x=>'<div class="v13Mini"><span>'+x.s+'</span><b>'+x.h.toFixed(1)+' d</b><small>learned memory half-life</small></div>').join('')+'</div>':'')+
 '<div class="v13Doctrine"><b>Portable teaching memory:</b> this stores how you learn, not only what you finished. It survives course sessions and keeps adapting as real outcomes accumulate.</div></div>'
}
window.INTELLECTUALITY_V13_UI={brainAddonHTML:addon};
})();