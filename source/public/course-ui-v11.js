(function(){
const E=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
let railOpen=false;
function stepLabel(seg,i){
 const names={visual:'Visual map',teach:'Professor feed',video:'Visual teacher',reconstruct:'Recall from memory',question:i>0?'Transfer check':'Source check'};
 return names[seg.type]||seg.title||seg.type;
}
function currentContext(){
 try{
  const d=day(), cur=currentLessonSegment?.();
  return {d,cur};
 }catch(_){return {d:null,cur:null}}
}
function ensureShell(){
 const aside=document.querySelector('aside'), main=document.querySelector('main'), hero=document.querySelector('.hero');
 if(!aside||!main||!hero)return;
 document.body.classList.add('courseUx');
 if(!document.querySelector('#courseTopbar')){
   const top=document.createElement('div');top.id='courseTopbar';top.className='courseTopbar';
   top.innerHTML='<button id="railToggle" class="railToggle" aria-label="Open course outline">☰</button><div class="courseCrumb"><span>NEU-205</span><b id="courseCrumbTitle">CNS</b></div><div class="courseTopProgress"><span id="courseTopPct">0%</span><div class="courseTopBar"><i id="courseTopFill"></i></div></div>';
   main.insertBefore(top,hero);
   top.querySelector('#railToggle').onclick=()=>toggleRail();
 }
 if(!document.querySelector('#railToday')){
   const anchor=aside.querySelector('#continueBtn');
   const nav=document.createElement('div');nav.id='railToday';nav.className='railToday';
   if(anchor)aside.insertBefore(nav,anchor);else aside.appendChild(nav);
 }
 if(!document.querySelector('#railFooter')){
   const foot=document.createElement('div');foot.id='railFooter';foot.className='railFooter';
   const cloud=document.querySelector('#cloudBtn'),tools=document.querySelector('#toolsBtn');
   if(cloud)foot.appendChild(cloud);
   if(tools)foot.appendChild(tools);
   aside.appendChild(foot);
 }
 if(!document.querySelector('#railScrim')){
   const scrim=document.createElement('button');scrim.id='railScrim';scrim.className='railScrim';scrim.setAttribute('aria-label','Close course outline');scrim.onclick=()=>toggleRail(false);document.body.appendChild(scrim);
 }
 const brand=aside.querySelector('.brand');if(brand)brand.innerHTML='INTELLECTUALITY <span>• CNS</span>';
 const sub=aside.querySelector('.sub');if(sub)sub.textContent='NEU-205 · Guided course';
 const cb=document.querySelector('#continueBtn');if(cb){cb.textContent='Resume learning';cb.classList.remove('pulse')}
}
function toggleRail(force){
 railOpen=force===undefined?!railOpen:!!force;
 document.body.classList.toggle('railOpen',railOpen);
 const b=document.querySelector('#railToggle');if(b)b.setAttribute('aria-expanded',railOpen?'true':'false');
}
function itemDone(d,l,i){try{return !!S.segments[segmentKey(d,l,i)]}catch(_){return false}}
function renderRail(){
 ensureShell();
 const {d,cur}=currentContext();if(!d)return;
 const nav=document.querySelector('#railToday');if(!nav)return;
 let done=0,total=0;
 const groups=(d.lessons||[]).map((l,li)=>{
   const steps=(l.segments||[]).map((seg,i)=>{
     total++;const yes=itemDone(d,l,i);if(yes)done++;
     const active=cur?.l?.id===l.id&&cur?.si===i;
     return '<div class="railStep '+(yes?'done ':'')+(active?'active':'')+'"><span class="railDot">'+(yes?'✓':active?'•':'')+'</span><span><b>'+E(stepLabel(seg,i))+'</b><small>'+E(seg.minutes||0)+' min</small></span></div>';
   }).join('');
   const activeLesson=cur?.l?.id===l.id;
   return '<section class="railLesson '+(activeLesson?'active':'')+'"><div class="railLessonHead"><span class="railSubject">'+E(l.subject)+'</span><strong>'+E(l.topic)+'</strong></div><div class="railSteps">'+steps+'</div></section>';
 }).join('');
 const continuity=!(d.lessons||[]).length?'<section class="railLesson active"><div class="railLessonHead"><span class="railSubject">'+E(d.mode)+'</span><strong>'+E(d.title||'Adaptive review')+'</strong></div><div class="railSteps"><div class="railStep active"><span class="railDot">•</span><span><b>Today’s adaptive mission</b><small>'+E(d.estimatedMinutes||0)+' min ceiling</small></span></div></div></section>':'';
 nav.innerHTML='<div class="railLabel">TODAY · DAY '+d.day+'</div><div class="railDayTitle">'+E(d.title||'CNS')+'</div>'+groups+continuity;
 const pct=typeof dayProgress==='function'?dayProgress(d):Math.round(done/Math.max(1,total)*100);
 const cp=typeof courseProgress==='function'?courseProgress():0;
 const topPct=document.querySelector('#courseTopPct'),fill=document.querySelector('#courseTopFill');
 if(topPct)topPct.textContent=pct+'% today';
 if(fill)fill.style.width=pct+'%';
 const crumb=document.querySelector('#courseCrumbTitle');
 if(crumb)crumb.textContent=(cur?.l?.topic||d.title||'Today');
 const sideToday=document.querySelector('#sideDay');if(sideToday)sideToday.textContent=pct+'%';
 const sideCourse=document.querySelector('#sideCourse');if(sideCourse)sideCourse.textContent=cp+'%';
}
window.INTELLECTUALITY_COURSE_UI=function(){renderRail();};
window.addEventListener('resize',()=>{if(innerWidth>900&&railOpen)toggleRail(false)},{passive:true});
})();