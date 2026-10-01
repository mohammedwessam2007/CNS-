/* RENAISSANCE READER OS v1
 * Local-first Reading Replacement Engine.
 * The full source remains on-device in IndexedDB. The compiler is extractive:
 * it never invents claims that are not present in the source.
 */
(function(){
"use strict";
const DB="renaissance_reader_v1",STORE="sources",VERSION=1,MAX_CHARS=12000000,MAX_FILE=100*1024*1024;
const STOP=new Set(("the a an and or but if then than of to in on at for from by with without into onto over under is are was were be been being this that these those it its as not no yes we you they he she i our your their his her who whom whose which what when where why how can could should would may might will shall do does did done have has had having about after before during through between among against because while although however therefore thus also such more most less least many much some any each every both either neither one two first second other another same own only very just still even already yet all per via et al".split(" ")));
let dbp=null,current=null,pdfmod=null;
const $=(s)=>document.querySelector(s);
const E=(s)=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const now=()=>Date.now(), dayMs=86400000;
function openDB(){
 if(dbp)return dbp;
 dbp=new Promise((resolve,reject)=>{
  const r=indexedDB.open(DB,VERSION);
  r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE,{keyPath:"id"});};
  r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
 });
 return dbp;
}
async function tx(mode,fn){
 const d=await openDB();return new Promise((resolve,reject)=>{
  const t=d.transaction(STORE,mode),s=t.objectStore(STORE);let out;
  try{out=fn(s);}catch(e){reject(e);return;}
  t.oncomplete=()=>resolve(out&&out.result!==undefined?out.result:out);t.onerror=()=>reject(t.error);
 });
}
const all=()=>tx("readonly",s=>s.getAll());
const get=(id)=>tx("readonly",s=>s.get(id));
const put=(x)=>tx("readwrite",s=>s.put(x));
const del=(id)=>tx("readwrite",s=>s.delete(id));
function normalize(t){
 return String(t||"").replace(/\r/g,"").replace(/[ \t]+\n/g,"\n").replace(/\n{4,}/g,"\n\n\n").trim();
}
function paras(t){
 return normalize(t).split(/\n\s*\n+/).map(x=>x.replace(/\s*\n\s*/g," ").trim()).filter(x=>x.length>24);
}
function sentencesFrom(p){
 const m=p.match(/[^.!?؟。！？]+[.!?؟。！？]+|[^.!?؟。！？]+$/g)||[p];
 return m.map(x=>x.trim()).filter(x=>x.split(/\s+/).length>=4);
}
function tokens(t){
 try{return (t.toLocaleLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]{1,}/gu)||[]).filter(x=>!STOP.has(x)&&!/^\d+$/.test(x));}
 catch(e){return (t.toLowerCase().match(/[a-z0-9][a-z0-9'-]{1,}/g)||[]).filter(x=>!STOP.has(x)&&!/^\d+$/.test(x));}
}
function wc(t){return (String(t||"").trim().match(/\S+/g)||[]).length;}
async function sha(t){
 const b=new TextEncoder().encode(t),h=await crypto.subtle.digest("SHA-256",b);
 return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
function inferType(text,title,chosen){
 if(chosen&&chosen!=="auto")return chosen;
 const h=(title+"\n"+text.slice(0,25000)).toLowerCase();
 if(/\babstract\b[\s\S]{0,5000}\b(methods?|materials and methods|results?|discussion|doi:)\b/.test(h))return "research";
 if(/\b(learning objectives?|chapter summary|review questions?|key terms|textbook)\b/.test(h))return "textbook";
 if(/\b(poem|novel|act [ivx]+|chapter [ivxlcdm]+|translated by|verse|stanza)\b/.test(h)&&!/\bresults?\b/.test(h))return "primary";
 return "nonfiction";
}
function replacementLaw(type,text){
 const high=/\b(dose|dosage|diagnos|treat|contraindicat|guideline|legal|law\b|tax\b|investment|surgery|prescrib|emergency)\b/i.test(text.slice(0,120000));
 if(type==="primary")return {mode:"PRIMARY EXPERIENCE",note:"Renaissance can replace orientation, commentary, memory work and most secondary reading. It deliberately keeps selected primary passages because the language, form or voice is part of what you are learning."};
 if(type==="research")return {mode:"COMPRESS + VERIFY",note:"Renaissance can replace most first-pass reading, but methods, numerical results, figures and any claim you may rely on still point back to exact source anchors."};
 if(high)return {mode:"COMPRESS + EXACT CHECK",note:"This source contains high-stakes language. The compiler can replace orientation and review, but exact claims you act on must remain source-verifiable."};
 if(type==="textbook")return {mode:"COMPRESS + RETRIEVE",note:"The compiler is designed to replace linear first-pass reading with map → explanation → retrieval → repair, while keeping exact source anchors available."};
 return {mode:"COMPRESS + CHALLENGE",note:"The compiler can replace most linear reading when the goal is usable understanding. Claims stay anchored to exact source sentences so compression never becomes invention."};
}
function frequencies(ss){
 const f=new Map();for(const s of ss)for(const w of tokens(s.text))f.set(w,(f.get(w)||0)+1);return f;
}
function sentenceRank(ss,f){
 const max=Math.max(1,...f.values());
 return ss.map(s=>{
  const ws=tokens(s.text), uniq=[...new Set(ws)],len=wc(s.text);
  let score=uniq.reduce((a,w)=>a+(f.get(w)||0)/max,0)/Math.max(1,Math.sqrt(uniq.length));
  if(/\b(because|therefore|thus|however|although|means|defined|results?|conclude|suggest|evidence|mechanism|causes?|leads? to|depends? on)\b/i.test(s.text))score+=1.15;
  if(len>=9&&len<=42)score+=.6; else if(len>75)score-=.5;
  if(s.si===0)score+=.45;
  return {...s,score:+score.toFixed(4),set:new Set(uniq)};
 }).sort((a,b)=>b.score-a.score);
}
function jac(a,b){let x=0;for(const w of a)if(b.has(w))x++;return x/Math.max(1,a.size+b.size-x);}
function diverse(ranked,n){
 const out=[];
 for(const s of ranked){if(out.every(x=>jac(x.set,s.set)<.58)){out.push(s);if(out.length>=n)break;}}
 return out.sort((a,b)=>a.gi-b.gi);
}
function termList(f,n=18){
 return [...f.entries()].filter(([w,c])=>w.length>=4&&c>=2).sort((a,b)=>b[1]-a[1]||b[0].length-a[0].length).slice(0,n).map(([term,count])=>({term,count}));
}
function mapSections(ps,ss,ranked,n=8){
 const out=[],size=Math.max(1,Math.ceil(ps.length/n));
 for(let start=0;start<ps.length;start+=size){
  const end=Math.min(ps.length,start+size);
  const cand=ranked.filter(s=>s.pi>=start&&s.pi<end)[0]||ss.find(s=>s.pi>=start&&s.pi<end);
  if(cand)out.push({from:start+1,to:end,anchor:"P"+(cand.pi+1),text:cand.text});
 }
 return out;
}
function findTerm(sentence,terms){
 const low=sentence.toLocaleLowerCase();
 return terms.find(x=>x.term.length>4&&low.includes(x.term.toLocaleLowerCase()))?.term||tokens(sentence).sort((a,b)=>b.length-a.length)[0]||null;
}
function questionSet(keys,terms){
 const qs=[];
 for(const k of keys){
  const term=findTerm(k.text,terms);if(!term)continue;
  const re=new RegExp(term.replace(/[.*+?^$()|[\]{}\\]/g,"\\$&"),"i");
  const stem=k.text.replace(re,"_____");
  if(stem===k.text)continue;
  qs.push({id:"q"+qs.length,stem,answer:term,anchor:"P"+(k.pi+1),source:k.text,due:0,interval:0,attempts:0,correct:0});
  if(qs.length>=10)break;
 }
 return qs;
}
function irreducible(type,ps,ranked){
 let count=type==="primary"?10:type==="research"?5:4;
 const chosen=[],add=(pi)=>{if(pi>=0&&pi<ps.length&&!chosen.some(x=>x.pi===pi))chosen.push({pi,text:ps[pi]});};
 if(ps.length){add(0);add(Math.floor(ps.length/2));add(ps.length-1);}
 for(const s of ranked){add(s.pi);if(chosen.length>=count)break;}
 return chosen.sort((a,b)=>a.pi-b.pi).slice(0,count);
}
function contras(ps){
 const out=[];
 ps.forEach((p,i)=>{if(/\b(however|but|although|yet|nevertheless|on the other hand|in contrast|limitation|criticism|critique|counter)\b/i.test(p))out.push({anchor:"P"+(i+1),text:p});});
 return out.slice(0,8);
}
function lexicalCoverage(keys,terms){
 const blob=keys.map(x=>x.text).join(" ").toLocaleLowerCase();
 const top=terms.slice(0,15); if(!top.length)return 1;
 return top.filter(x=>blob.includes(x.term.toLocaleLowerCase())).length/top.length;
}
function compile(text,title,chosen){
 const type=inferType(text,title,chosen),ps=paras(text);
 if(!ps.length)throw new Error("I could not find readable paragraphs in that source.");
 const ss=[];let gi=0;
 ps.forEach((p,pi)=>sentencesFrom(p).forEach((t,si)=>ss.push({text:t,pi,si,gi:gi++})));
 if(ss.length<5)throw new Error("The source is too short to compile as a reading replacement.");
 const f=frequencies(ss), ranked=sentenceRank(ss,f), terms=termList(f),keys=diverse(ranked,Math.min(24,Math.max(10,Math.ceil(ss.length*.035))));
 const map=mapSections(ps,ss,ranked,8), questions=questionSet(keys,terms), law=replacementLaw(type,text);
 const compressionWords=keys.reduce((n,x)=>n+wc(x.text),0);
 return {
  type,law,words:wc(text),paragraphs:ps.length,sentences:ss.length,
  map,keys:keys.map(({text,pi,score})=>({text,pi,anchor:"P"+(pi+1),score})),
  terms,questions,irreducible:irreducible(type,ps,ranked),counter:contras(ps),
  audit:{lexicalTopTermCoverage:+lexicalCoverage(keys,terms).toFixed(2),sectionCoverage:map.length?1:0,extractive:true},
  estimates:{sourceMinutes:Math.max(1,Math.round(wc(text)/250)),capsuleMinutes:Math.max(6,Math.round(compressionWords/220+questions.length*.75+map.length*.35))}
 };
}
async function parsePdf(file,status){
 if(!pdfmod){
  status("Loading local PDF engine…");
  pdfmod=await import("/vendor/pdf.mjs");
  pdfmod.GlobalWorkerOptions.workerSrc="/vendor/pdf.worker.mjs";
 }
 const data=new Uint8Array(await file.arrayBuffer());
 const task=pdfmod.getDocument({data,cMapUrl:"/vendor/cmaps/",cMapPacked:true,standardFontDataUrl:"/vendor/standard_fonts/",wasmUrl:"/vendor/wasm/"});
 const doc=await task.promise, pages=[];
 for(let i=1;i<=doc.numPages;i++){
  if(i===1||i%10===0||i===doc.numPages)status("Extracting PDF text · page "+i+" / "+doc.numPages);
  const p=await doc.getPage(i),tc=await p.getTextContent();
  const line=tc.items.map(x=>x.str||"").join(" ").replace(/\s+/g," ").trim();
  if(line)pages.push("[PAGE "+i+"]\n"+line);
 }
 return pages.join("\n\n");
}
async function readFile(file,status){
 if(file.size>MAX_FILE)throw new Error("This file is over 100 MB. Split it by book/part so the compiler can preserve everything without crashing your device.");
 const name=file.name.toLowerCase();
 if(file.type==="application/pdf"||name.endsWith(".pdf"))return parsePdf(file,status);
 if(/\.(txt|md|markdown|html?|csv|json|rtf)$/i.test(name)||/^text\//.test(file.type)){
  let t=await file.text();
  if(/\.html?$/i.test(name)){
   const d=new DOMParser().parseFromString(t,"text/html");d.querySelectorAll("script,style,noscript,svg").forEach(x=>x.remove());t=d.body?.innerText||d.documentElement.textContent||"";
  }
  if(/\.json$/i.test(name)){try{const o=JSON.parse(t);t=JSON.stringify(o,null,2);}catch(e){}}
  return t;
 }
 throw new Error("Unsupported file. Use PDF, TXT, Markdown, HTML, CSV, JSON or RTF, or paste the text. EPUB/DOCX stay outside v1 rather than being silently mangled.");
}
async function saveSource(text,title,type,fileName){
 text=normalize(text); if(text.length>MAX_CHARS)throw new Error("This source exceeds the 12-million-character safety ceiling. Split it into volumes/parts. Nothing was truncated or imported.");
 const id=(await sha(text)).slice(0,24),existing=await get(id);
 if(existing)return {...existing,duplicate:true};
 const compiled=compile(text,title,type);
 const rec={id,hash:await sha(text),title:(title||fileName||"Untitled source").trim(),fileName:fileName||null,text,compiled,createdAt:now(),updatedAt:now()};
 await put(rec);
 try{await navigator.storage?.persist?.();}catch(e){}
 return rec;
}
function dueText(qs){
 const due=(qs||[]).filter(q=>!q.due||q.due<=now()).length;
 return due?due+" retrieval "+(due===1?"item":"items")+" due":"retrieval clear";
}
function renderLibrary(){
 all().then(list=>{
  list.sort((a,b)=>b.updatedAt-a.updatedAt);
  const box=$("#rrCards"),count=$("#rrLibraryCount"); if(!box)return;
  count.textContent=list.length+" source"+(list.length===1?"":"s")+" · stored only on this device";
  if(!list.length){box.innerHTML='<div class="rrEmpty">No imported sources yet. Paste an article or upload a book/paper. The original text will be retained locally beside its compiled replacement.</div>';return;}
  box.innerHTML=list.map(r=>'<article class="rrCard"><b>'+E(r.title)+'</b><small>'+r.compiled.words.toLocaleString()+" words · "+r.compiled.paragraphs+" paragraphs · "+E(dueText(r.compiled.questions))+'</small><span class="rrMode">'+E(r.compiled.law.mode)+'</span><div class="rrCardActions"><button class="rrMini" data-rr="open" data-id="'+E(r.id)+'">OPEN CAPSULE</button><button class="rrMini danger" data-rr="delete" data-id="'+E(r.id)+'">DELETE</button></div></article>').join("");
 }).catch(e=>status("Library error: "+e.message,true));
}
function status(msg,bad){
 const el=$("#rrStatus");if(el){el.textContent=msg||"";el.style.color=bad?"#ff9aaa":"#66e9ff";}
}
function metrics(r){
 const c=r.compiled;
 return '<div class="rrMetrics"><div class="rrMetric"><b>'+c.words.toLocaleString()+'</b><span>source words</span></div><div class="rrMetric"><b>'+c.estimates.sourceMinutes+'m</b><span>linear read est.</span></div><div class="rrMetric"><b>'+c.estimates.capsuleMinutes+'m</b><span>capsule est.</span></div><div class="rrMetric"><b>'+Math.round(c.audit.lexicalTopTermCoverage*100)+'%</b><span>top-term coverage</span></div></div>';
}
function view(r,tab){
 const c=r.compiled;
 if(tab==="map")return '<h3>Source map</h3><p>One exact sentence is retained from every structural slice. This is orientation, not a claim of semantic completeness.</p><div class="rrMap">'+c.map.map((x,i)=>'<div class="rrMapItem"><b>SECTOR '+(i+1)+' · '+E(x.anchor)+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>';
 if(tab==="capsule")return '<h3>Compression ladder</h3><div class="rrAudit">Extractive by construction: every line below is an exact sentence from the source. Renaissance ranks and de-duplicates; it does not fabricate a substitute argument.</div><div class="rrMap">'+c.keys.map((x,i)=>'<div class="rrClaim"><b>CLAIM '+(i+1)+' · '+E(x.anchor)+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>';
 if(tab==="terms")return '<h3>Concept vocabulary</h3><p>High-frequency content words, useful for orienting and later retrieval. Frequency is not importance, so they never substitute for the anchored claims.</p><div class="rrTerms">'+c.terms.map(x=>'<span class="rrTerm"><b>'+x.count+'×</b> '+E(x.term)+'</span>').join("")+'</div>'+(c.counter.length?'<h3>Contrasts / limitations found</h3><div class="rrMap">'+c.counter.map(x=>'<div class="rrClaim"><b>'+E(x.anchor)+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>':'');
 if(tab==="primary")return '<h3>Irreducible passages</h3><p>'+E(c.type==="primary"?"These stay because the language or form is part of the object. The machine is not allowed to eat the art.":"These passages are retained as exact-source checkpoints against compression loss.")+'</p><div class="rrMap">'+c.irreducible.map(x=>'<div class="rrPassage"><b class="rrKicker">P'+(x.pi+1)+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>';
 if(tab==="practice")return '<h3>Prove the source survived compression</h3><p>Reveal only after answering from memory. “Got it” schedules a wider interval; “missed” returns tomorrow.</p><div class="rrMap">'+c.questions.map(q=>'<div class="rrQuestion" data-q="'+E(q.id)+'"><p class="rrQPrompt">'+E(q.stem)+'</p><span class="rrAnchor">'+E(q.anchor)+'</span><button class="rrReveal" data-rr="reveal" data-q="'+E(q.id)+'">REVEAL</button><div class="rrAnswer" data-a="'+E(q.id)+'" hidden><b>'+E(q.answer)+'</b><br>'+E(q.source)+'<div class="rrScore"><button class="good" data-rr="score" data-q="'+E(q.id)+'" data-ok="1">GOT IT</button><button class="miss" data-rr="score" data-q="'+E(q.id)+'" data-ok="0">MISSED</button></div></div></div>').join("")+'</div>';
 if(tab==="source")return '<h3>Full source · never amputated</h3><div class="rrSourceBox">'+E(r.text)+'</div>';
 return "";
}
function openSource(r,tab="map"){
 current=r;const m=$("#rrModal");m.hidden=false;document.body.style.overflow="hidden";
 const c=r.compiled;
 $("#rrTitle").textContent=r.title;
 $("#rrVerdict").innerHTML='<div><strong>'+E(c.law.note)+'</strong><p>'+E(c.type.toUpperCase())+' · '+c.paragraphs+' paragraphs · '+c.sentences+' sentences. Exact source is always one tab away.</p></div><div class="rrBig">'+E(c.law.mode)+'</div>';
 $("#rrMetrics").innerHTML=metrics(r);
 setTab(tab);
}
function setTab(tab){
 if(!current)return;
 document.querySelectorAll(".rrTab").forEach(b=>b.classList.toggle("on",b.dataset.tab===tab));
 $("#rrView").innerHTML=view(current,tab);
}
function close(){current=null;$("#rrModal").hidden=true;document.body.style.overflow="";}
async function score(qid,ok){
 if(!current)return;
 const r=await get(current.id),q=r.compiled.questions.find(x=>x.id===qid);if(!q)return;
 q.attempts=(q.attempts||0)+1;if(ok)q.correct=(q.correct||0)+1;
 const seq=[1,3,7,21,60,120,240],i=ok?Math.min(seq.length-1,(q.interval||0)+1):0;
 q.interval=i;q.due=now()+seq[i]*dayMs;r.updatedAt=now();await put(r);current=r;renderLibrary();
 const el=document.querySelector('[data-q="'+CSS.escape(qid)+'"] .rrScore');if(el)el.innerHTML='<span class="rrAnchor">'+(ok?"Scheduled later.":"Returns tomorrow.")+'</span>';
}
async function compileFromUI(){
 const btn=$("#rrCompile"),file=$("#rrFile")?.files?.[0],pasted=$("#rrPaste")?.value||"",title=$("#rrSourceTitle")?.value||file?.name||"",type=$("#rrType")?.value||"auto";
 btn.disabled=true;
 try{
  let text=pasted.trim();
  if(file){status("Reading "+file.name+" locally…");text=await readFile(file,(m)=>status(m));}
  if(!text)throw new Error("Paste text or choose a supported file.");
  status("Compiling structure, claims, anchors and retrieval…");
  const rec=await saveSource(text,title,type,file?.name||null);
  status(rec.duplicate?"Already in your library. Opening the existing capsule.":"Compiled locally. No source text was uploaded.");
  renderLibrary();openSource(rec);
 }catch(e){status(e.message,true);}finally{btn.disabled=false;}
}
function mount(){
 const host=$("#rrHost");if(!host)return;
 host.innerHTML='<section class="rrShell"><div class="rrHero"><div><p class="rsEyebrow">READER OS · READING REPLACEMENT ENGINE</p><h2>Replace the reading.<br><em>Keep the knowledge.</em></h2><p>Bring the source you would otherwise spend an hour, a week, or a month reading. Renaissance keeps the full text, builds an anchored compression ladder, preserves the irreducible parts, then makes you retrieve what matters until it survives without the page.</p></div><div class="rrLaw"><b>THE LAW</b><span>If reading is transport for information, compress it. If exact wording, method, evidence, style or aesthetic experience is the cargo, keep that part primary. No summary is allowed to impersonate the source.</span></div></div><div class="rrInput"><textarea id="rrPaste" class="rrPaste" placeholder="Paste an article, chapter, paper, book extract, lecture notes…"></textarea><div class="rrControls"><input id="rrSourceTitle" class="rrTitle" placeholder="Source title (optional)"><select id="rrType" class="rrSelect"><option value="auto">AUTO CLASSIFY</option><option value="nonfiction">NONFICTION / ARTICLE</option><option value="textbook">TEXTBOOK / EXPLANATORY</option><option value="research">RESEARCH PAPER</option><option value="primary">LITERATURE / PRIMARY TEXT</option></select><input id="rrFile" class="rrFile" type="file" accept=".pdf,.txt,.md,.markdown,.html,.htm,.csv,.json,.rtf,text/*,application/pdf"><button id="rrCompile" class="rrCompile" type="button">COMPILE READING</button><p class="rrHint">PDF, TXT, Markdown, HTML, CSV, JSON, RTF or pasted text. Source stays on this device in IndexedDB. v1 refuses unsupported formats rather than corrupting them.</p></div></div><div id="rrStatus" class="rrStatus" aria-live="polite"></div><div class="rrLibrary"><div class="rrLibraryTop"><h3>Your compiled library</h3><span id="rrLibraryCount"></span></div><div id="rrCards" class="rrCards"></div></div></section>';
 const modal=document.createElement("div");modal.id="rrModal";modal.className="rrModal";modal.hidden=true;modal.innerHTML='<div class="rrPanel" role="dialog" aria-modal="true" aria-labelledby="rrTitle"><div class="rrTop"><div><span class="rrKicker">RENAISSANCE READER OS</span><h2 id="rrTitle"></h2></div><button class="rrClose" data-rr="close" aria-label="Close">×</button></div><div class="rrBody"><div id="rrVerdict" class="rrVerdict"></div><div id="rrMetrics"></div><div class="rrTabs"><button class="rrTab on" data-rr="tab" data-tab="map">MAP</button><button class="rrTab" data-rr="tab" data-tab="capsule">CAPSULE</button><button class="rrTab" data-rr="tab" data-tab="terms">TERMS + CONTRASTS</button><button class="rrTab" data-rr="tab" data-tab="primary">IRREDUCIBLE</button><button class="rrTab" data-rr="tab" data-tab="practice">PROVE IT</button><button class="rrTab" data-rr="tab" data-tab="source">FULL SOURCE</button></div><div id="rrView" class="rrView"></div></div></div>';
 document.body.appendChild(modal);
 $("#rrCompile").addEventListener("click",compileFromUI);
 document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-rr]");if(!b)return;
  const a=b.dataset.rr;
  if(a==="close")return close();
  if(a==="tab")return setTab(b.dataset.tab);
  if(a==="open"){const r=await get(b.dataset.id);if(r)openSource(r);return;}
  if(a==="delete"){if(confirm("Delete this local source and its Reader OS record? This does not touch Renaissance curriculum state.")){await del(b.dataset.id);renderLibrary();}return;}
  if(a==="reveal"){const x=document.querySelector('[data-a="'+CSS.escape(b.dataset.q)+'"]');if(x)x.hidden=false;return;}
  if(a==="score")return score(b.dataset.q,b.dataset.ok==="1");
 });
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#rrModal").hidden)close();});
 renderLibrary();
}
window.RENAISSANCE_READER={compile:(text,title,type)=>compile(normalize(text),title||"Untitled",type||"auto"),library:all,get,version:"1.0"};
document.addEventListener("DOMContentLoaded",mount);
})();