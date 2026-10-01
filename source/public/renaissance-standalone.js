/* Renaissance standalone adapter.
 * Does not modify CNS state or require the medical shell.
 * It supplies the two read-only globals Renaissance historically used as a gate,
 * then renders a standalone dashboard around the canonical engine.
 */
(function(){
  "use strict";
  const DEFAULT_EXAM="2026-11-15";
  const exam=localStorage.getItem("renaissance_exam_day");
  window.RENAISSANCE_EXAM_DAY=exam || DEFAULT_EXAM;
  window.INTELLECTUALITY_MAP_BOOTED=true;
  window.nextAction=window.nextAction||function(){return {kind:"STOP"};};
  window.render=window.render||function(){return null;};

  const $=(s)=>document.querySelector(s);
  const esc=(s)=>String(s==null?"":s).replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const dayKey=(d)=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
  const allSessions=()=>((window.RENAISSANCE_SEASONS||[]).flatMap(x=>x.sessions||[]));
  let deferredInstall=null;

  window.addEventListener("beforeinstallprompt",(ev)=>{
    ev.preventDefault(); deferredInstall=ev;
    const b=$("#rsInstall"); if(b) b.hidden=false;
  });

  function setRuntime(kind,text){
    const el=$("#rsRuntime"); if(!el)return;
    el.className="rsRuntime "+kind; el.textContent=text;
  }

  function rolling7(st){
    let total=0;
    const now=new Date();
    for(let i=0;i<7;i++) total+=Number((st.days||{})[dayKey(addDays(now,-i))]||0);
    return Math.round(total);
  }

  function gateCopy(g){
    if(!g) return "The scheduler is not ready.";
    if(g.open){
      const s=g.plan&&g.plan.sid?allSessions().find(x=>x.id===g.plan.sid):null;
      return s ? (s.hook || s.why || "Today's session is ready.") : "Retrieval from earlier sessions is ready.";
    }
    return g.msg || ({
      spent:"Today's dose is complete. Nothing else is owed.",
      sleep:"Sleep wins right now.",
      week:"The weekly life limit is protecting your time.",
      exam:"Medical exam protection is active.",
      deepwait:"A deep session is waiting for its allowed day.",
      seasondone:"Everything currently authored is complete.",
      off:"Renaissance is switched off on this device."
    }[g.why] || "Renaissance is resting.");
  }

  function renderCompiler(R){
    const box=$("#rsCompiler"); if(!box)return;
    let c=null;
    try{c=R.compile(new Date());}catch(e){}
    if(!c){box.textContent="The fixed bootloader or current gate determines today's work.";return;}
    const top=(c.ranked||[]).slice(0,3);
    if(c.mode==="boot"){
      box.innerHTML="<strong>Fixed bootloader.</strong> The first 12 sessions establish the reasoning primitives before culture becomes adaptive.";
      return;
    }
    if(!top.length){
      box.innerHTML="<strong>"+esc(c.sid||"Resume")+"</strong><br>"+esc(c.why||"Continue the current session.");
      return;
    }
    box.innerHTML="<strong>Compiler mode:</strong> "+esc(c.mode)+
      "<ol>"+top.map(x=>"<li><b>"+esc(sessionTitle(x.sid))+"</b><br><span>"+esc((x.reasons||[]).join("; "))+"</span></li>").join("")+"</ol>";
  }

  function sessionTitle(id){
    const s=allSessions().find(x=>x.id===id); return s?s.title:id;
  }

  function renderCurriculum(R,st){
    const list=$("#rsCurriculum"); if(!list)return;
    const sessions=allSessions();
    let gate=null; try{gate=R.gate();}catch(e){}
    const next=gate&&gate.plan&&gate.plan.sid;
    list.innerHTML=sessions.map((s,i)=>{
      const rec=(st.sessions||{})[s.id]||{};
      const done=!!rec.done;
      const req=(s.requires||[]);
      const locked=req.some(id=>!((st.sessions||{})[id]||{}).done);
      const cls="rsSession"+(done?" done":next===s.id?" next":locked?" locked":"");
      const tag=done?"complete":next===s.id?"today":locked?"prerequisite":"available";
      return '<div class="'+cls+'"><b>'+esc((i+1)+". "+s.title)+'</b><small>'+esc((s.domain||"primitives")+" · "+(s.minutes||"?")+" min")+'</small><span class="tag">'+tag+"</span></div>";
    }).join("");
    const n=sessions.filter(s=>((st.sessions||{})[s.id]||{}).done).length;
    $("#rsCurriculumCount").textContent=n+" / "+sessions.length;
  }

  function renderMeasure(R){
    const box=$("#rsMeasure"); if(!box)return;
    let p={done:0,due:[]},cal={n:0,brier:null},vel={};
    try{p=R.probes();}catch(e){}
    try{cal=R.calibration();}catch(e){}
    try{vel=R.velocity();}catch(e){}
    const bits=[
      "<strong>Sealed:</strong> "+(p.done||0)+" complete"+((p.due||[]).length?" · "+p.due.length+" due":""),
      "<strong>Calibration:</strong> "+(cal.brier==null?(cal.n||0)+"/5 checked forecasts before a Brier score":("Brier "+cal.brier+" over "+cal.n)),
    ];
    const keys=Object.keys(vel||{});
    if(keys.length) bits.push("<strong>Learning velocity:</strong> tracked separately by capability once enough delayed evidence exists.");
    box.innerHTML=bits.map(x=>"<p>"+x+"</p>").join("");
  }

  function integrityCheck(R){
    const sessions=allSessions();
    const steps=sessions.reduce((n,s)=>n+(s.steps||[]).length,0);
    const provenance=sessions.reduce((n,s)=>n+(s.provenance||[]).length,0);
    const hooks=sessions.flatMap(s=>s.hooks||[]);
    const failures=[];
    const unique=(xs)=>new Set(xs).size===xs.length;
    if(sessions.length!==32) failures.push("session count "+sessions.length+" != 32");
    if(steps!==287) failures.push("step count "+steps+" != 287");
    if(provenance!==208) failures.push("provenance count "+provenance+" != 208");
    if(hooks.length!==96) failures.push("hook count "+hooks.length+" != 96");
    if(!unique(sessions.map(s=>s.id))) failures.push("duplicate session id");
    if(!unique(hooks.map(h=>h.id))) failures.push("duplicate retrieval-hook id");
    for(const s of sessions){
      if(!s.id||!s.title||!s.minutes) failures.push("malformed session "+(s.id||"?"));
      if(!unique((s.steps||[]).map(x=>x.id))) failures.push("duplicate step id in "+s.id);
      for(const req of s.requires||[]) if(!sessions.some(x=>x.id===req)) failures.push("missing prerequisite "+req+" for "+s.id);
    }
    const G=window.RENAISSANCE_GENOME||{}, C=window.RENAISSANCE_CIV||{}, M=window.RENAISSANCE_MEDIA||{}, S=window.RENAISSANCE_SEALED||{};
    if(Object.keys(G.atoms||{}).length!==28) failures.push("capability atom registry mismatch");
    if((G.compounds||[]).length!==8) failures.push("capability compound registry mismatch");
    if(Object.keys(C.nodes||{}).length!==108||(C.edges||[]).length!==94) failures.push("civilisation graph mismatch");
    if((S.items||[]).length!==52) failures.push("sealed battery mismatch");
    const mediaCount=Object.keys(M.visuals||{}).length+Object.keys(M.models||{}).length+Object.keys(M.listen||{}).length+Object.keys(M.data||{}).length;
    if(mediaCount!==61) failures.push("media registry mismatch: "+mediaCount);
    for(const k of ["gate","open","queue","state","compile","sessionObject","probes","export","import"]) if(typeof R[k]!=="function") failures.push("missing engine API "+k);
    if(!window.RENAISSANCE_READER||window.RENAISSANCE_READER.version!=="2.0") failures.push("Reader OS API/version missing");
    else { const rd=window.RENAISSANCE_READER.doctor?.(); if(!rd?.ok) failures.push("Reader OS doctor: "+(rd?.failures||["missing doctor"]).join(", ")); }
    if(!window.RENAISSANCE_CAMPUS||window.RENAISSANCE_CAMPUS.version!=="1.2") failures.push("Campus API/version missing");
    else { const cd=window.RENAISSANCE_CAMPUS.doctor?.(); if(!cd?.ok) failures.push("Campus doctor: "+(cd?.failures||["missing doctor"]).join(", ")); }
    const med=[...document.scripts].map(s=>s.src).filter(src=>/mcq-v16|learn-v15|cns-atlas|dept-fig/i.test(src));
    if(med.length) failures.push("medical asset leaked into standalone shell");
    return {ok:!failures.length,failures,metrics:{sessions:sessions.length,steps,provenance,hooks:hooks.length,atoms:Object.keys(G.atoms||{}).length,compounds:(G.compounds||[]).length,civNodes:Object.keys(C.nodes||{}).length,civEdges:(C.edges||[]).length,sealed:(S.items||[]).length,media:mediaCount}};
  }

  function refresh(){
    const R=window.RENAISSANCE;
    if(!R){setRuntime("","loading engine");return;}
    try{
      const health=integrityCheck(R);
      if(!health.ok) throw new Error("integrity sentinel: "+health.failures.join("; "));
      const st=R.state();
      const sessions=allSessions();
      const done=sessions.filter(s=>((st.sessions||{})[s.id]||{}).done).length;
      const probes=R.probes();
      const g=R.gate();
      $("#rsDone").textContent=done;
      $("#rsMinutes").textContent=rolling7(st);
      $("#rsAnswers").textContent=(st.answers||[]).length;
      $("#rsProbes").textContent=probes.done||0;
      $("#rsDose").textContent=g.open?((g.plan&&g.plan.minutes)||g.dose||"")+" min":"rest";
      $("#rsGateText").textContent=gateCopy(g);
      renderCurriculum(R,st);
      renderCompiler(R);
      renderMeasure(R);
      setRuntime("ready","32/32 · reader 2.0 · campus 1.2 · green");
      $("#rsBuild").textContent="Renaissance engine "+R.version+" · "+sessions.length+" sessions · Reader OS 2.0 · Campus 1.2 · integrity green";
    }catch(e){
      setRuntime("error","engine error");
      $("#rsGateText").textContent="The engine loaded but the dashboard hit an error: "+e.message;
    }
  }

  function downloadJSON(name,obj){
    const blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function bind(){
    $("#rsExport")?.addEventListener("click",()=>{
      const R=window.RENAISSANCE;if(!R)return;
      downloadJSON("renaissance-progress-"+dayKey(new Date())+".json",R.export());
      $("#rsTransferMsg").textContent="Progress exported. Keep that file anywhere you control.";
    });
    $("#rsImport")?.addEventListener("click",()=>$("#rsImportFile")?.click());
    $("#rsImportFile")?.addEventListener("change",async(ev)=>{
      const f=ev.target.files&&ev.target.files[0]; if(!f)return;
      try{
        const obj=JSON.parse(await f.text()),res=window.RENAISSANCE.import(obj);
        $("#rsTransferMsg").textContent=res.ok?"Imported safely. "+(res.answersAdded||0)+" new answer records merged.":"Import refused: "+res.why;
        refresh();
      }catch(e){$("#rsTransferMsg").textContent="Import refused: "+e.message;}
      ev.target.value="";
    });
    const exam=$("#rsExamDate"); if(exam) exam.value=localStorage.getItem("renaissance_exam_day")||DEFAULT_EXAM;
    $("#rsSaveExam")?.addEventListener("click",()=>{
      const v=$("#rsExamDate")?.value;
      if(!/^\d{4}-\d{2}-\d{2}$/.test(v||"")){ $("#rsExamMsg").textContent="Choose a valid exam date."; return; }
      localStorage.setItem("renaissance_exam_day",v);
      $("#rsExamMsg").textContent="Saved. Reloading the life governor with "+v+".";
      setTimeout(()=>location.reload(),450);
    });
    $("#rsInstall")?.addEventListener("click",async()=>{
      if(!deferredInstall)return;
      deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall=null; $("#rsInstall").hidden=true;
    });
  }

  function watch(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(window.RENAISSANCE){
        clearInterval(timer); refresh();
        const root=document.getElementById("rnRoot");
        if(root) new MutationObserver(refresh).observe(root,{attributes:true,attributeFilter:["hidden"]});
      }else if(tries>200){
        clearInterval(timer); setRuntime("error","engine failed"); $("#rsGateText").textContent="Renaissance did not boot. Reload once; if it persists, this deployment failed its runtime contract.";
      }
    },50);
  }

  if("serviceWorker" in navigator && location.protocol==="https:"){
    window.addEventListener("load",()=>navigator.serviceWorker.register("/renaissance-sw.js").catch(()=>{}));
  }
  document.addEventListener("DOMContentLoaded",()=>{bind();watch();});
})();