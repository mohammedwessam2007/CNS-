/* RENAISSANCE READER OS v1
 * Local-first Reading Replacement Engine.
 * The full source remains on-device in IndexedDB. The compiler is extractive:
 * it never invents claims that are not present in the source.
 */
(function(){
"use strict";
const DB="renaissance_reader_v1",STORE="sources",VERSION=1,MAX_CHARS=12000000,MAX_FILE=100*1024*1024;
const STOP=new Set(("the a an and or but if then than of to in on at for from by with without into onto over under is are was were be been being this that these those it its as not no yes we you they he she i our your their his her who whom whose which what when where why how can could should would may might will shall do does did done have has had having about after before during through between among against because while although however therefore thus also such more most less least many much some any each every both either neither one two first second other another same own only very just still even already yet all per via et al der die das den dem des ein eine einer eines und oder aber wenn dann als von zu im in am auf für mit ohne ist sind war waren sein gewesen diese dieser dieses es wir ihr sie er ich unser eure ihre sein ihr wer was wann wo warum wie kann könnte sollte würde haben hat hatte nicht noch schon auch sehr nur durch über unter aus bei sowie zum zur einen einem einer sich dass weil während jedoch daher mehr weniger alle jeder jede jedes عربي العربية في من على إلى عن هو هي هذا هذه ذلك تلك كان كانت يكون تكون مع بدون أو و ثم لكن إذا إن أن ما لا نعم كل بعض أي بين عند حتى حيث الذي التي الذين هناك هنا كما لقد لم لن قد قبل بعد أثناء خلال ضمن الى على من عن في der die das den dem des ein eine einen einem einer eines und oder aber wenn dann als von zu im in am auf für mit ohne ist sind war waren sein gewesen diese dieser dieses es wir ihr sie er ich unser eure ihre sein ihr wer was wann wo warum wie kann könnte sollte würde haben hat hatte nicht noch schon auch sehr nur durch über unter aus bei sowie zum zur sich dass weil während jedoch daher mehr weniger alle jeder jede jedes".split(/\\s+/)));
let dbp=null,current=null,pdfmod=null,zipmod=null,ocrmod=null,pdfDocs=new Map(),flow=null,dueMode=false;
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
  t.oncomplete=()=>resolve(out&&typeof out==='object'&&'result' in out?out.result:out);// a request's result, even when it is undefined (a missing key): returning the request object itself made every new source look like a duplicatet.onerror=()=>reject(t.error);
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
async function shaBlob(blob){
 const h=await crypto.subtle.digest("SHA-256",await blob.arrayBuffer());
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
function questionSet(keys,terms,target=10){
 const qs=[];
 for(const k of keys){
  const term=findTerm(k.text,terms);if(!term)continue;
  const re=new RegExp(term.replace(/[.*+?^$()|[\]{}\\]/g,"\\$&"),"i");
  const stem=k.text.replace(re,"_____");
  if(stem===k.text)continue;
  qs.push({id:"q"+qs.length,kind:"cloze",stem,answer:term,anchor:"P"+(k.pi+1),source:k.text,due:0,interval:0,attempts:0,correct:0,history:[]});
  if(qs.length>=target)break;
 }
 return qs;
}
function probeRequirement(words){
 if(words<1000)return 6;
 if(words<5000)return 10;
 if(words<20000)return 16;
 if(words<50000)return 24;
 return 32;
}
function deepQuestionSet(keys,counter,verify,terms){
 const out=[];
 const add=(kind,stem,answer,anchor,source)=>{if(stem&&answer&&!out.some(x=>x.stem===stem))out.push({id:"d"+out.length,kind,stem,answer,anchor,source,due:0,interval:0,attempts:0,correct:0,history:[]});};
 const causal=keys.filter(k=>/\b(because|therefore|thus|leads? to|causes?|results? in|depends? on|mechanism|explains?)\b/i.test(k.text));
 for(const k of causal.slice(0,3))add("argument","Reconstruct the reasoning in this source claim without looking. What relation connects the cause/reason to the conclusion?",k.text,"P"+(k.pi+1),k.text);
 for(const x of (counter||[]).slice(0,3))add("counter","What limitation, contrast, exception or counter-position does the source preserve here?",x.text,x.anchor,x.text);
 for(const x of (verify||[]).slice(0,3))add("evidence","Before checking the source, reconstruct the exact method/number/evidence claim anchored here.",x.text,x.anchor,x.text);
 const top=(terms||[]).slice(0,4).map(x=>x.term);
 if(keys.length>=2)add("synthesis","Explain how two major claims in this source fit together, then check both anchors.",keys.slice(0,2).map(x=>x.text).join(" | "),keys.slice(0,2).map(x=>"P"+(x.pi+1)).join(" + "),keys.slice(0,2).map(x=>x.text).join(" | "));
 if(top.length>=2)add("transfer","Give a new example or case where the relationship between "+top[0]+" and "+top[1]+" would matter. Then compare your reasoning with the source anchors.","Open transfer: there is no single source sentence answer. Use the full source/capsule to audit whether your example preserves the source's relationships.","TRANSFER","Transfer prompt generated from source vocabulary; score only after self-audit.");
 return out.slice(0,10);
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
function verificationAnchors(ss){
 const out=[];
 for(const s of ss){
  const t=s.text;
  if(/\d|%|\bp\s*[<=>]|\bCI\b|confidence interval|odds ratio|risk ratio|hazard ratio|sample|participants?|subjects?|methods?|randomi[sz]|limitation|excluded?|included?|measured?|estimated?|mean|median|standard deviation|\bfig(?:ure)?\.?\s*\d|\btable\s*\d|equation|theorem|proof|diagram|shown in/i.test(t)) out.push({text:t,pi:s.pi,anchor:"P"+(s.pi+1)});
  if(out.length>=36)break;
 }
 return out;
}
function modalityRisk(ss){
 const text=ss.map(x=>x.text).join("\n");
 const visual=(text.match(/\b(fig(?:ure)?\.?|table|diagram|panel|image|graph|chart|shown in|see (?:fig|table))/gi)||[]).length;
 const math=(text.match(/[∑∫√∞≈≠≤≥±×÷]|\b(equation|theorem|lemma|proof|matrix|derivative|integral|vector|tensor)\b/gi)||[]).length;
 return {visualSignals:visual,mathSignals:math,visualDependencyRisk:visual>=3,notationRisk:math>=4};
}
function auditCompression(ss,map,keys,terms,counter,verify){
 const topCoverage=lexicalCoverage(keys,terms);
 const sourceNumeric=ss.filter(s=>/\d|%/.test(s.text)).length;
 const verifyNumeric=verify.filter(s=>/\d|%/.test(s.text)).length;
 const sourceContrast=ss.filter(s=>/\b(however|but|although|yet|nevertheless|in contrast|limitation|counter)\b/i.test(s.text)).length;
 return {
  extractive:true,
  sectionCoverage:map.length?1:0,
  lexicalTopTermCoverage:+topCoverage.toFixed(2),
  numericEvidenceCaptured:sourceNumeric?Math.min(1,verifyNumeric/Math.min(sourceNumeric,28)):1,
  contrastAnchors:counter.length,
  contrastSignalsInSource:sourceContrast,
  verificationAnchors:verify.length,
  noGeneratedClaims:true,
  ...modalityRisk(ss)
 };
}
function replacementVerdict(type,audit,questions,words){
 const gates=[],required=probeRequirement(words);
 const add=(name,ok,why)=>gates.push({name,ok,why});
 add("source retained",true,"Full normalized source is stored beside the capsule.");
 add("extractive claims",audit.extractive===true&&audit.noGeneratedClaims===true,"Capsule claims must remain exact source sentences.");
 add("structure mapped",audit.sectionCoverage>=.99,"Every structural slice must have an exact anchor.");
 add("concept coverage",audit.lexicalTopTermCoverage>=.72,"At least 72% of the top content vocabulary must survive the claim capsule.");
 add("retrieval set",questions.length>=required,"Probe floor scales with source size: this source requires at least "+required+" source-grounded prompts.");
 add("deep retrieval",audit.deepRetrievalPrompts>=3,"Replacement requires argument/evidence/contrast or transfer prompts, not cloze memory alone.");
 if(type==="research") add("numeric/method audit",audit.numericEvidenceCaptured>=.75,"Research compression must retain a bounded audit set of numbers/method-like claims.");
 if(audit.visualDependencyRisk) add("visual layer",false,"Figure/table density is high enough that the original visual windows must be checked; text extraction cannot replace them.");
 if(audit.notationRisk) add("notation layer",false,"Mathematical notation density is high enough that the original notation must be checked; generic extraction is not trusted to preserve it.");
 if(type==="primary") add("primary experience preserved",true,"Primary literature is bridged, never declared fully replaceable.");
 const pass=gates.every(x=>x.ok),modality=audit.visualDependencyRisk||audit.notationRisk;
 const label=type==="primary"?"BRIDGE, DO NOT REPLACE":audit.ocrDerived?"OCR CHECK REQUIRED":modality?"ORIGINAL-WINDOW REQUIRED":pass?"REPLACEMENT CANDIDATE":"READ / RECOMPILE";
 return {pass,required,label,gates};
}
function relationScore(a,b){
 const A=new Set((a.compiled?.terms||[]).slice(0,18).map(x=>x.term.toLocaleLowerCase()));
 const B=new Set((b.compiled?.terms||[]).slice(0,18).map(x=>x.term.toLocaleLowerCase()));
 if(!A.size||!B.size)return 0;let hit=0;for(const x of A)if(B.has(x))hit++;
 return +(hit/Math.max(1,A.size+B.size-hit)).toFixed(3);
}
function masteryState(r){
 const qs=r.compiled?.questions||[],hist=qs.flatMap(q=>q.history||[]);
 const rv=r.compiled?.verdict||replacementVerdict(r.compiled?.type,r.compiled?.audit||{},qs,r.compiled?.words||0);
 const required=rv.required||probeRequirement(r.compiled?.words||0);
 if(!qs.length)return {label:"NO RETRIEVAL SET",score:0,due:0,delayed:0,required,total:0};
 const deep=qs.filter(q=>q.kind&&q.kind!=="cloze");
 const deepSeen=deep.filter(q=>(q.history||[]).length||(q.attempts||0)>0).length;
 const deepCommitted=deep.filter(q=>(q.responses||[]).some(x=>String(x.text||"").trim().length>=12)).length;
 const deepRight=deep.reduce((n,q)=>n+(q.correct||0),0),deepAttempts=deep.reduce((n,q)=>n+(q.attempts||0),0),deepAcc=deepAttempts?deepRight/deepAttempts:0;
 const attempts=hist.length||qs.reduce((n,q)=>n+(q.attempts||0),0);
 const right=hist.filter(x=>x.ok).length||qs.reduce((n,q)=>n+(q.correct||0),0);
 const due=qs.filter(q=>!q.due||q.due<=now()).length;
 const delayed=qs.filter(q=>{
  const h=q.history||[]; if(h.length<2)return false;
  return h.some((x,i)=>x.ok&&h.some((y,j)=>j<i&&y.ok&&x.t-y.t>=6*dayMs));
 }).length;
 const acc=attempts?right/attempts:0,age=(now()-(r.createdAt||now()))/dayMs;
 const seen=qs.filter(q=>(q.history||[]).length||(q.attempts||0)>0).length;
 if(!rv.pass)return {label:"RECOMPILE BEFORE REPLACEMENT",score:.08,due,delayed,accuracy:+acc.toFixed(2),attempts,seen,total:qs.length,required,deepSeen,deepCommitted,deepTotal:deep.length,deepAccuracy:+deepAcc.toFixed(2)};
 let label="NOT PROVEN",score=0;
 if(seen){label="ACTIVE RETRIEVAL";score=.25;}
 if(seen>=required&&acc>=.8&&deepSeen===deep.length&&deepCommitted===deep.length&&deepAcc>=.75){label="PROVISIONAL";score=.55;}
 if(age>=7&&delayed>=Math.ceil(required*.6)&&acc>=.8&&deepSeen===deep.length&&deepCommitted===deep.length&&deepAcc>=.8){label="DURABLE";score=.82;}
 if(age>=30&&delayed>=Math.ceil(required*.85)&&acc>=.85&&deepSeen===deep.length&&deepCommitted===deep.length&&deepAcc>=.85){
   label=r.compiled.type==="primary"?"SECONDARY LAYER POSSESSED":"READING REPLACEMENT PROVEN";score=1;
 }
 const ocrReceiptValid=!!(r.ocrVerified&&r.binary?.sha256&&r.ocrVerified.binarySha256===r.binary.sha256);
 const ocrPending=!!(r.compiled?.audit?.ocrDerived&&!ocrReceiptValid);
 if(ocrPending&&score>=1){label="OCR ORIGINAL CHECK REQUIRED";score=.82;}
 return {label,score:+score.toFixed(2),due,delayed,accuracy:+acc.toFixed(2),attempts,seen,total:qs.length,required,deepSeen,deepTotal:deep.length,deepAccuracy:+deepAcc.toFixed(2),ocrPending,ocrVerified:ocrReceiptValid};
}
function compile(text,title,chosen){
 const type=inferType(text,title,chosen),ps=paras(text);
 if(!ps.length)throw new Error("I could not find readable paragraphs in that source.");
 const ss=[];let gi=0;
 ps.forEach((p,pi)=>sentencesFrom(p).forEach((t,si)=>ss.push({text:t,pi,si,gi:gi++})));
 if(ss.length<5)throw new Error("The source is too short to compile as a reading replacement.");
 const words=wc(text),requiredProbes=probeRequirement(words),probeTarget=Math.min(40,Math.max(requiredProbes,10));
 const f=frequencies(ss),ranked=sentenceRank(ss,f),terms=termList(f);
 const keys=diverse(ranked,Math.min(56,Math.max(requiredProbes+8,Math.ceil(ss.length*.05))));
 const map=mapSections(ps,ss,ranked,Math.min(16,Math.max(6,Math.ceil(Math.sqrt(ps.length))))),law=replacementLaw(type,text);
 const counter=contras(ps),verify=verificationAnchors(ss);
 const questions=questionSet(keys,terms,probeTarget),deepQuestions=deepQuestionSet(keys,counter,verify,terms);
 const compressionWords=keys.reduce((n,x)=>n+wc(x.text),0);
 questions.push(...deepQuestions);
 const audit=auditCompression(ss,map,keys,terms,counter,verify);
 audit.deepRetrievalPrompts=deepQuestions.length;
 const ocrText=String(text).toUpperCase();
 audit.ocrDerived=ocrText.includes("[PAGE ")&&ocrText.includes(" OCR]");
 audit.ocrPages=audit.ocrDerived?Math.max(1,ocrText.split(" OCR]").length-1):0;
 const verdict=replacementVerdict(type,audit,questions,words);
 return {
  type,law,words,paragraphs:ps.length,sentences:ss.length,
  map,keys:keys.map(({text,pi,score})=>({text,pi,anchor:"P"+(pi+1),score})),
  terms,questions,irreducible:irreducible(type,ps,ranked),counter,verify,
  audit,verdict,
  estimates:{sourceMinutes:Math.max(1,Math.round(words/250)),capsuleMinutes:Math.max(6,Math.round(compressionWords/220+questions.length*.9+map.length*.4+verify.length*.08))}
 };
}
async function ocrPdf(doc,status){
 if(doc.numPages>250)throw new Error("This scanned PDF has more than 250 pages. Split it into volumes so local OCR stays reliable and your device does not become a space heater.");
 if(!ocrmod)ocrmod=await import("/vendor/tesseract/tesseract.esm.min.js");
 status("Loading local English + Arabic OCR models…");
 const worker=await ocrmod.createWorker(["eng","ara"],1,{
   workerPath:"/vendor/tesseract/worker.min.js",
   corePath:"/vendor/tesseract-core/",
   langPath:"/vendor/tessdata/",
   gzip:true
 });
 const out=[];let words=0;
 try{
  for(let i=1;i<=doc.numPages;i++){
   status("OCR · page "+i+" / "+doc.numPages+" · source stays on this device");
   const page=await doc.getPage(i),v0=page.getViewport({scale:1}),target=Math.min(1800,Math.max(1100,v0.width*1.55)),scale=target/v0.width,vp=page.getViewport({scale});
   const canvas=document.createElement("canvas");canvas.width=Math.ceil(vp.width);canvas.height=Math.ceil(vp.height);
   const ctx=canvas.getContext("2d",{alpha:false});await page.render({canvasContext:ctx,viewport:vp}).promise;
   const ret=await worker.recognize(canvas),line=normalize(ret?.data?.text||"");
   words+=wc(line);out.push("[PAGE "+i+" OCR]\n"+line);
   canvas.width=1;canvas.height=1;
  }
 }finally{try{await worker.terminate();}catch(e){}}
 if(words<Math.max(30,doc.numPages*5))throw new Error("Local OCR ran, but produced too little usable text. Reader OS refused to pretend the scan was understood.");
 return out.join("\n\n");
}
async function parsePdf(file,status){
 if(!pdfmod){
  status("Loading local PDF engine…");
  pdfmod=await import("/vendor/pdf.mjs");
  pdfmod.GlobalWorkerOptions.workerSrc="/vendor/pdf.worker.mjs";
 }
 const data=new Uint8Array(await file.arrayBuffer());
 const task=pdfmod.getDocument({data,cMapUrl:"/vendor/cmaps/",cMapPacked:true,standardFontDataUrl:"/vendor/standard_fonts/",wasmUrl:"/vendor/wasm/"});
 const doc=await task.promise,pages=[]; let extractedWords=0;
 for(let i=1;i<=doc.numPages;i++){
  if(i===1||i%10===0||i===doc.numPages)status("Extracting PDF text · page "+i+" / "+doc.numPages);
  const p=await doc.getPage(i),tc=await p.getTextContent();
  const line=tc.items.map(x=>x.str||"").join(" ").replace(/\s+/g," ").trim();
  extractedWords+=wc(line);
  pages.push("[PAGE "+i+"]\n"+line);
 }
 if(extractedWords<Math.max(30,doc.numPages*3)){
  status("No usable text layer found. Switching to local OCR…");
  return ocrPdf(doc,status);
 }
 return pages.join("\n\n");
}
async function loadZip(){
 if(!zipmod)zipmod=await import("/vendor/fflate.mjs");
 return zipmod;
}
function decodeBytes(b){return new TextDecoder("utf-8",{fatal:false}).decode(b);}
function xmlDoc(t){return new DOMParser().parseFromString(t,"application/xml");}
function localEls(root,name){
 try{return [...root.getElementsByTagNameNS("*",name)];}catch(e){return [...root.getElementsByTagName(name)];}
}
function attrLocal(el,name){
 if(!el||!el.attributes)return null;
 for(const a of [...el.attributes])if(a.localName===name||a.name===name||a.name.endsWith(":"+name))return a.value;
 return null;
}
function zipPreflight(data){
 const dv=new DataView(data.buffer,data.byteOffset,data.byteLength),n=data.byteLength;
 let eocd=-1;
 for(let i=n-22;i>=Math.max(0,n-66000);i--)if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}
 if(eocd<0)throw new Error("ZIP container is malformed or unsupported.");
 const entries=dv.getUint16(eocd+10,true),cdSize=dv.getUint32(eocd+12,true),cdOff=dv.getUint32(eocd+16,true);
 if(entries===0xffff||cdSize===0xffffffff||cdOff===0xffffffff)throw new Error("ZIP64 containers are not accepted in this local parser yet.");
 if(entries>5000)throw new Error("Archive contains too many internal files.");
 let p=cdOff,totalU=0,totalC=0,seen=0;
 while(p+46<=n&&p<cdOff+cdSize&&dv.getUint32(p,true)===0x02014b50){
  const cs=dv.getUint32(p+20,true),us=dv.getUint32(p+24,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true);
  if(cs===0xffffffff||us===0xffffffff)throw new Error("ZIP64 entry rejected.");
  totalU+=us;totalC+=cs;seen++;p+=46+nl+xl+cl;
 }
 if(seen!==entries&&entries!==0)throw new Error("ZIP central directory did not reconcile.");
 if(totalU>220*1024*1024)throw new Error("Archive expands beyond the 220 MB safety ceiling.");
 if(totalC>0&&totalU/Math.max(1,totalC)>120)throw new Error("Archive expansion ratio is suspicious; import blocked as a possible ZIP bomb.");
 return {entries,totalU,totalC};
}
function unzipSafe(data){
 zipPreflight(data);
 return loadZip().then(z=>z.unzipSync(data));
}
function zipPath(base,href){
 const parts=(base?base.split("/").slice(0,-1):[]).concat(String(href||"").split("/")),out=[];
 for(const x of parts){if(!x||x===".")continue;if(x==="..")out.pop();else out.push(x);}
 return out.join("/");
}
function htmlToText(t,label){
 const d=new DOMParser().parseFromString(t,"text/html");
 d.querySelectorAll("script,style,noscript,svg,canvas").forEach(x=>x.remove());
 const body=d.body||d.documentElement,out=[];
 const els=body.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,pre,figcaption,tr");
 if(els.length){
  els.forEach(el=>{const x=(el.innerText||el.textContent||"").replace(/\s+/g," ").trim();if(x)out.push(/^H[1-6]$/.test(el.tagName)?"[HEADING] "+x:el.tagName==="TR"?"[TABLE ROW] "+[...el.querySelectorAll("th,td")].map(z=>(z.innerText||z.textContent||"").replace(/\\s+/g," ").trim()).filter(Boolean).join(" | "):x);});
 }else{
  const x=(body.innerText||body.textContent||"").replace(/\s+/g," ").trim();if(x)out.push(x);
 }
 return (label?"["+label+"]\n":"")+out.join("\n\n");
}
async function parseDocx(file,status){
 status("Opening DOCX locally…");
 const data=new Uint8Array(await file.arrayBuffer()),zip=await unzipSafe(data);
 const names=Object.keys(zip).filter(n=>/^word\/(document|footnotes|endnotes|comments|header\d+|footer\d+)\.xml$/i.test(n))
  .sort((a,b)=>(a==="word/document.xml"?-1:b==="word/document.xml"?1:a.localeCompare(b)));
 if(!names.includes("word/document.xml"))throw new Error("DOCX has no word/document.xml.");
 const out=[];
 for(const name of names){
  const d=xmlDoc(decodeBytes(zip[name]));
  for(const p of localEls(d,"p")){
   const parts=[];
   for(const node of [...p.getElementsByTagName("*")]){
    if(node.localName==="t")parts.push(node.textContent||"");
    else if(node.localName==="tab")parts.push(" ");
    else if(node.localName==="br")parts.push("\n");
   }
   let line=parts.join("").replace(/[ \t]+/g," ").trim();if(!line)continue;
   const pStyle=localEls(p,"pStyle")[0],style=(attrLocal(pStyle,"val")||"").toLowerCase();
   if(style.includes("heading")||style.includes("title"))line="[HEADING] "+line;
   out.push(line);
  }
 }
 if(!out.length)throw new Error("DOCX contained no extractable text.");
 return out.join("\n\n");
}
async function parseEpub(file,status){
 status("Opening EPUB locally…");
 const data=new Uint8Array(await file.arrayBuffer()),zip=await unzipSafe(data),dec=(n)=>zip[n]?decodeBytes(zip[n]):"";
 const container=xmlDoc(dec("META-INF/container.xml")),root=localEls(container,"rootfile")[0],opf=attrLocal(root,"full-path");
 if(!opf||!zip[opf])throw new Error("EPUB package document could not be located.");
 const packageDoc=xmlDoc(dec(opf)),manifest=new Map();
 for(const item of localEls(packageDoc,"item")){
  const id=attrLocal(item,"id"),href=attrLocal(item,"href"),media=attrLocal(item,"media-type")||"";
  if(id&&href)manifest.set(id,{path:zipPath(opf,href),media});
 }
 const spine=[];
 for(const it of localEls(packageDoc,"itemref")){const id=attrLocal(it,"idref"),m=manifest.get(id);if(m)spine.push(m);}
 const ordered=spine.length?spine:[...manifest.values()].filter(x=>/html|xhtml/i.test(x.media)||/\.x?html?$/i.test(x.path));
 const out=[];let i=0;
 for(const item of ordered){
  if(!zip[item.path])continue;i++;if(i===1||i%10===0)status("Extracting EPUB section "+i+" / "+ordered.length);
  const x=htmlToText(dec(item.path),"EPUB SECTION "+i);if(x.trim())out.push(x);
 }
 if(!out.length)throw new Error("EPUB contained no readable spine text.");
 return out.join("\n\n");
}
function stripRtf(t){
 return String(t||"").replace(/\\'([0-9a-fA-F]{2})/g,(_,h)=>String.fromCharCode(parseInt(h,16)))
  .replace(/\\par[d]?\b/g,"\n\n").replace(/\\tab\b/g," ")
  .replace(/\\[a-zA-Z]+-?\d* ?/g,"").replace(/[{}]/g,"").replace(/\n{3,}/g,"\n\n");
}
async function readFile(file,status){
 if(file.size>MAX_FILE)throw new Error("This file is over 100 MB. Split it by book/part so the compiler can preserve everything without crashing your device.");
 const name=file.name.toLowerCase();
 if(file.type==="application/pdf"||name.endsWith(".pdf"))return parsePdf(file,status);
 if(name.endsWith(".docx"))return parseDocx(file,status);
 if(name.endsWith(".epub"))return parseEpub(file,status);
 if(/\.(txt|md|markdown|html?|csv|json|rtf)$/i.test(name)||/^text\//.test(file.type)){
  let t=await file.text();
  if(/\.html?$/i.test(name))t=htmlToText(t,"HTML");
  if(/\.rtf$/i.test(name))t=stripRtf(t);
  if(/\.json$/i.test(name)){try{const o=JSON.parse(t);t=JSON.stringify(o,null,2);}catch(e){}}
  return t;
 }
 throw new Error("Unsupported file. Use PDF, EPUB, DOCX, TXT, Markdown, HTML, CSV, JSON or RTF, or paste the text. Unsupported formats are refused rather than silently mangled.");
}
async function saveSource(text,title,type,fileName,originalFile,origin){
 text=normalize(text); if(text.length>MAX_CHARS)throw new Error("This source exceeds the 12-million-character safety ceiling. Split it into volumes/parts. Nothing was truncated or imported.");
 const fullHash=await sha(text),id=fullHash.slice(0,24),existing=await get(id);
 if(existing)return {...existing,duplicate:true};
 if(originalFile&&navigator.storage?.estimate){
  try{
   const est=await navigator.storage.estimate(),free=(est.quota||0)-(est.usage||0),need=originalFile.size+new Blob([text]).size;
   if(est.quota&&free<need*1.25)throw new Error("Not enough browser storage to preserve the original file safely. Free space or import a smaller source; Reader OS refused to store a lossy copy.");
  }catch(e){if(/Not enough browser storage/.test(e.message))throw e;}
 }
 const compiled=compile(text,title,type);
 const binary=originalFile?{blob:originalFile,name:originalFile.name,type:originalFile.type||"application/octet-stream",size:originalFile.size,sha256:await shaBlob(originalFile)}:null;
 const rec={id,hash:fullHash,title:(title||fileName||"Untitled source").trim(),fileName:fileName||null,text,binary,compiled,origin:origin||null,createdAt:now(),updatedAt:now()};
 await put(rec);try{await navigator.storage?.persist?.();}catch(e){}
 return rec;
}
function dueText(qs){
 const due=(qs||[]).filter(q=>!q.due||q.due<=now()).length;
 return due?due+" retrieval "+(due===1?"item":"items")+" due":"retrieval clear";
}
async function dueQueue(){
 const list=await all(),rows=[];
 for(const r of list)for(const q of r.compiled?.questions||[]){
   if(!q.due||q.due<=now()){
     const h=q.history||[],last=h[h.length-1],deep=!!(q.kind&&q.kind!=="cloze");
     rows.push({sourceId:r.id,title:r.title,qid:q.id,kind:q.kind||"cloze",deep,miss:last?last.ok===false:false,due:q.due||0});
   }
 }
 return rows.sort((a,b)=>(b.miss-a.miss)||(b.deep-a.deep)||((a.due||0)-(b.due||0))||a.title.localeCompare(b.title));
}
function renderReaderTodayFromList(list){
 const host=$("#rrToday");if(!host)return;
 const rows=[];
 for(const r of list)for(const q of r.compiled?.questions||[])if(!q.due||q.due<=now())rows.push({r,q});
 const sources=new Set(rows.map(x=>x.r.id)).size,deep=rows.filter(x=>x.q.kind&&x.q.kind!=="cloze").length;
 host.innerHTML='<div class="rrTodayCopy"><span class="rsEyebrow">READER TODAY</span><b>'+(rows.length?rows.length+" retrieval "+(rows.length===1?"item":"items")+" due":"Memory queue clear")+'</b><small>'+(rows.length?(sources+" source"+(sources===1?"":"s")+" · "+deep+" deep reconstruction"+(deep===1?"":"s")):"Nothing is owed. New reading or future spacing will reopen the queue.")+'</small></div><button class="rrFlowStart" data-rr="due" '+(rows.length?"":"disabled")+'>RUN DUE RETRIEVAL</button>';
}
async function runDue(){
 const rows=await dueQueue();
 if(!rows.length){dueMode=false;renderLibrary();status("Reader Today is clear. Nothing is owed.");return false;}
 const r=await get(rows[0].sourceId);if(!r)return false;
 await openSource(r,"map");dueMode=true;flow=null;setTab("practice");
 return true;
}
function safeName(s){return String(s||"source").replace(/[^a-z0-9._-]+/gi,"-").replace(/^-+|-+$/g,"").slice(0,80)||"source";}
function downloadJSON(name,obj){
 const blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
async function exportSource(id){
 const r=await get(id);if(!r)return;
 const {_relations,binary,...portable}=r;
 downloadJSON(safeName(r.title)+".reader.json",{schema:"renaissance.reader-source/1",exportedAt:new Date().toISOString(),binaryOmitted:!!binary,record:portable});
}
async function downloadOriginal(id){
 const r=await get(id);if(!r?.binary?.blob)return;
 const url=URL.createObjectURL(r.binary.blob),a=document.createElement("a");
 a.href=url;a.download=r.binary.name||r.fileName||"source";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
async function pdfDocument(r){
 if(!r?.binary?.blob)return null;if(pdfDocs.has(r.id))return pdfDocs.get(r.id);
 if(!pdfmod){pdfmod=await import("/vendor/pdf.mjs");pdfmod.GlobalWorkerOptions.workerSrc="/vendor/pdf.worker.mjs";}
 const data=new Uint8Array(await r.binary.blob.arrayBuffer());
 const doc=await pdfmod.getDocument({data,cMapUrl:"/vendor/cmaps/",cMapPacked:true,standardFontDataUrl:"/vendor/standard_fonts/",wasmUrl:"/vendor/wasm/"}).promise;
 pdfDocs.set(r.id,doc);return doc;
}
function ocrRequiredPages(total){return Math.max(1,Math.min(3,Number(total)||1));}
async function recordOcrPageView(r,page,total){
 if(!r?.compiled?.audit?.ocrDerived)return r;
 const rec=await get(r.id);if(!rec)return r;
 rec.ocrPagesViewed=[...new Set([...(rec.ocrPagesViewed||[]),Number(page)])].filter(x=>Number.isFinite(x)&&x>=1).sort((a,b)=>a-b);
 rec.ocrPageTotal=Number(total)||rec.ocrPageTotal||null;rec.updatedAt=now();await put(rec);return rec;
}
function ocrTrustHTML(r,total){
 if(!r?.compiled?.audit?.ocrDerived)return "";
 const seen=(r.ocrPagesViewed||[]),need=ocrRequiredPages(total||r.ocrPageTotal||r.compiled.audit.ocrPages||1),ok=seen.length>=need;
 const receiptValid=!!(r.ocrVerified&&r.binary?.sha256&&r.ocrVerified.binarySha256===r.binary.sha256);
 if(receiptValid)return '<div class="rrAudit"><b>OCR SPOT-CHECK RECORDED</b><br>Confirmed '+new Date(r.ocrVerified.t).toLocaleString()+' after inspecting original pages '+E((r.ocrVerified.pages||[]).join(", "))+'. Receipt bound to original-file SHA-256 '+E(r.binary.sha256.slice(0,16))+'…. This is a spot-check receipt, not a claim of character-perfect OCR.</div>';
 return '<div class="rrAudit"><b>OCR TRUST LOCK</b><br>Original pages inspected: '+seen.length+' / '+need+(seen.length?' · '+E(seen.join(", ")):'')+'. Browse distinct pages above, compare the visible page with the extracted text, then confirm the spot-check.'+(ok?'<br><button class="rrFlowStart" data-rr="ocrok">I CHECKED THESE OCR PAGES AGAINST THE ORIGINAL</button>':'')+'</div>';
}
async function renderOriginalPage(r,pageNo=1){
 const host=$("#rrOriginal");if(!host)return;
 if(!r?.binary?.blob){host.innerHTML='<div class="rrEmpty">'+(r?.origin?'This text was fetched by the World Harvester; the exact fetched text (SHA-256 recorded above) is the canonical copy stored here. The linked page may change; the revision above does not.':'This source was pasted as text, so the exact extracted source is the canonical original stored here.')+'</div>';return;}
 if(!/pdf/i.test(r.binary.type||"")&&!/\.pdf$/i.test(r.binary.name||"")){
  host.innerHTML='<div class="rrAudit">The original '+E(r.binary.name||"file")+' is preserved locally. Browser-native rendering is not claimed for this format.</div><button class="rrMini" data-rr="original" data-id="'+E(r.id)+'">DOWNLOAD ORIGINAL</button>';return;
 }
 host.innerHTML='<div class="rrEmpty">Rendering original PDF page locally…</div>';
 try{
  const doc=await pdfDocument(r),n=Math.max(1,Math.min(doc.numPages,Number(pageNo)||1)),page=await doc.getPage(n),v0=page.getViewport({scale:1});
  const width=Math.min(860,Math.max(280,host.clientWidth-12)),scale=Math.min(2.2,width/v0.width),vp=page.getViewport({scale});
  host.innerHTML='<div class="rrPdfNav"><button class="rrMini" data-rr="pdfpage" data-page="'+Math.max(1,n-1)+'">←</button><b>PAGE '+n+' / '+doc.numPages+'</b><button class="rrMini" data-rr="pdfpage" data-page="'+Math.min(doc.numPages,n+1)+'">→</button><button class="rrMini" data-rr="original" data-id="'+E(r.id)+'">DOWNLOAD PDF</button></div><canvas id="rrPdfCanvas" class="rrPdfCanvas"></canvas>';
  const canvas=$("#rrPdfCanvas"),ctx=canvas.getContext("2d",{alpha:false});canvas.width=Math.ceil(vp.width);canvas.height=Math.ceil(vp.height);
  await page.render({canvasContext:ctx,viewport:vp}).promise;
  if(r.compiled?.audit?.ocrDerived){
    const rec=await recordOcrPageView(r,n,doc.numPages);current={...rec,_relations:current?._relations};host.insertAdjacentHTML("beforeend",ocrTrustHTML(rec,doc.numPages));
  }
 }catch(e){host.innerHTML='<div class="rrAudit">Original PDF preserved, but page rendering failed: '+E(e.message)+'</div>';}

}
async function importBackup(file){
 const x=JSON.parse(await file.text());
 if(x?.schema!=="renaissance.reader-source/1"||!x.record?.text)throw new Error("Not a Renaissance Reader source backup.");
 const original=x.record,text=normalize(original.text),h=await sha(text);
 if(original.hash&&original.hash!==h)throw new Error("Backup source hash does not match its text.");
 const compiled=compile(text,original.title||file.name,original.compiled?.type||"auto");
 const oldQ=new Map((original.compiled?.questions||[]).map(q=>[q.id,q]));
 compiled.questions.forEach(q=>{
  const old=oldQ.get(q.id);if(old){q.history=Array.isArray(old.history)?old.history.slice(-100):[];q.attempts=old.attempts||q.history.length;q.correct=old.correct||q.history.filter(x=>x.ok).length;q.due=old.due||0;q.interval=old.interval||0;}
 });
 const rec={
   id:h.slice(0,24),hash:h,title:original.title||file.name,fileName:original.fileName||file.name,text,compiled,
   createdAt:original.createdAt||now(),updatedAt:now(),
   historicalOcrReceipt:original.ocrVerified||original.historicalOcrReceipt||null,
   ocrVerified:null,ocrPagesViewed:[],ocrPageTotal:original.ocrPageTotal||compiled.audit?.ocrPages||null
 };
 await put(rec);return rec;
}
function related(r,list){
 return list.filter(x=>x.id!==r.id).map(x=>({r:x,score:relationScore(r,x)})).filter(x=>x.score>=.08).sort((a,b)=>b.score-a.score).slice(0,6);
}
function renderLibrary(){
 all().then(list=>{
  list.sort((a,b)=>b.updatedAt-a.updatedAt);
  renderReaderTodayFromList(list);
  const box=$("#rrCards"),count=$("#rrLibraryCount");if(!box)return;
  const q=($("#rrSearch")?.value||"").trim().toLocaleLowerCase();
  const visible=!q?list:list.filter(r=>(r.title+" "+(r.fileName||"")+" "+(r.compiled?.terms||[]).map(x=>x.term).join(" ")).toLocaleLowerCase().includes(q));
  count.textContent=list.length+" source"+(list.length===1?"":"s")+" · "+visible.length+" shown · device-local";
  if(!visible.length){box.innerHTML='<div class="rrEmpty">'+(list.length?"Nothing matches that search.":"No imported sources yet. Paste an article or upload a book, paper, EPUB or DOCX. The original text will stay locally beside its compiled replacement.")+'</div>';return;}
  box.innerHTML=visible.map(r=>{
   const m=masteryState(r),rels=related(r,list),cls=m.score>=.82?"rrMastered":m.due?"rrDue":"";
   return '<article class="rrCard"><b>'+E(r.title)+'</b><small>'+r.compiled.words.toLocaleString()+" words · "+r.compiled.paragraphs+" paragraphs · "+E(dueText(r.compiled.questions))+'</small><span class="rrMode">'+E(r.compiled.law.mode)+'</span><small class="'+cls+'">'+E(m.label)+(m.accuracy!=null?" · "+Math.round(m.accuracy*100)+"% retrieval":"")+'</small><div class="rrGauge" aria-label="replacement evidence"><i style="width:'+Math.round(m.score*100)+'%"></i></div>'+(rels.length?'<small>connects: '+rels.slice(0,2).map(x=>E(x.r.title)).join(" · ")+'</small>':"")+'<div class="rrCardActions"><button class="rrFlowStart" data-rr="run" data-id="'+E(r.id)+'">RUN REPLACEMENT</button><button class="rrMini" data-rr="open" data-id="'+E(r.id)+'">BROWSE</button><button class="rrMini" data-rr="export" data-id="'+E(r.id)+'">EXPORT</button><button class="rrMini danger" data-rr="delete" data-id="'+E(r.id)+'">DELETE</button></div></article>';
  }).join("");
 }).catch(e=>status("Library error: "+e.message,true));
}
function status(msg,bad){
 const el=$("#rrStatus");if(el){el.textContent=msg||"";el.style.color=bad?"#ff9aaa":"#66e9ff";}
}
function metrics(r){
 const c=r.compiled,m=masteryState(r),saved=Math.max(0,c.estimates.sourceMinutes-c.estimates.capsuleMinutes);
 return '<div class="rrMetrics"><div class="rrMetric"><b>'+c.words.toLocaleString()+'</b><span>source words</span></div><div class="rrMetric"><b>'+c.estimates.sourceMinutes+'m</b><span>linear read est.</span></div><div class="rrMetric"><b>'+c.estimates.capsuleMinutes+'m</b><span>capsule est.</span></div><div class="rrMetric"><b>'+saved+'m</b><span>candidate minutes saved</span></div><div class="rrMetric"><b>'+Math.round(m.score*100)+'%</b><span>replacement evidence</span></div></div>';
}
function searchSource(r,q){
 const Q=[...new Set(tokens(q))];if(!Q.length)return [];
 const ps=paras(r.text);
 return ps.map((text,i)=>{
  const T=tokens(text),set=new Set(T),hits=Q.filter(x=>set.has(x)),phrase=String(text).toLocaleLowerCase().includes(String(q).toLocaleLowerCase());
  const score=hits.length/Math.max(1,Q.length)+(phrase?1.5:0)+hits.reduce((n,x)=>n+(T.filter(y=>y===x).length>1?.08:0),0);
  return {text,anchor:"P"+(i+1),score:+score.toFixed(3),hits};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,12);
}
function verifyCard(r,x,i){
 const m=/^P(\d+)$/.exec(x.anchor||""),isPdf=!!(r.binary&&(/pdf/i.test(r.binary.type||"")||/\.pdf$/i.test(r.binary.name||"")));
 const jump=isPdf&&m?'<button class="rrMini" data-rr="jumporiginal" data-page="'+m[1]+'">VIEW ORIGINAL PAGE '+m[1]+'</button>':"";
 return '<div class="rrClaim"><b>VERIFY '+(i+1)+' · '+E(x.anchor)+'</b><p class="rrExact">'+E(x.text)+'</p>'+jump+'</div>';
}
function questionCard(q){
 const due=!q.due||q.due<=now(),deep=!!(q.kind&&q.kind!=="cloze"),responses=q.responses||[],history=q.history||[];
 const lastResponse=responses.length?responses[responses.length-1].t:0,lastScore=history.length?history[history.length-1].t:0,responseReady=!deep||lastResponse>lastScore;
 const commit=deep?'<div class="rrResponseBox"><textarea class="rrResponse" data-response="'+E(q.id)+'" placeholder="Commit your reconstruction before reveal. Minimum 12 characters."></textarea><button class="rrMini" data-rr="commitresponse" data-q="'+E(q.id)+'">COMMIT RESPONSE</button><span class="rrAnchor">'+(responseReady?"response committed":"reveal locked until you commit")+'</span></div>':"";
 return '<div class="rrQuestion" data-q="'+E(q.id)+'"><p class="rrQPrompt">'+E(q.stem)+'</p><span class="rrAnchor">'+E(q.anchor)+(due?" · DUE":" · scheduled")+(deep?" · "+E(q.kind.toUpperCase()):"")+'</span>'+commit+'<button class="rrReveal" data-rr="reveal" data-q="'+E(q.id)+'" '+(responseReady?"":"disabled")+'>REVEAL</button><div class="rrAnswer" data-a="'+E(q.id)+'" hidden><b>'+E(q.answer)+'</b><br>'+E(q.source)+'<div class="rrScore"><button class="good" data-rr="score" data-q="'+E(q.id)+'" data-ok="1">GOT IT</button><button class="miss" data-rr="score" data-q="'+E(q.id)+'" data-ok="0">MISSED</button></div></div></div>';
}
function originBox(r){
 const o=r&&r.origin;if(!o)return "";
 return '<div class="rrAudit"><b>FOUND AND VERIFIED BY THE WORLD HARVESTER</b><br>'+E(o.title||r.title)+(o.url?' · <span>'+E(o.url)+'</span>':'')+'<br>Licence: '+E(o.license||"unknown")+(o.attribution?' · '+E(o.attribution):'')+(o.revision?' · revision '+E(String(o.revision)):'')+'<br>Fetched '+E(o.retrievedAt||"")+' · content SHA-256 '+E(String(o.contentSha256).slice(0,16))+'…<br>Why it was chosen: '+E(o.whyChosen||"not recorded")+'</div>';
}
function view(r,tab){
 const c=r.compiled,m=masteryState(r);
 if(tab==="map")return '<h3>Source map</h3><p>Every structural slice keeps an exact-source anchor. This is orientation, not a claim that one sentence equals a whole section.</p><div class="rrMap">'+c.map.map((x,i)=>'<div class="rrMapItem"><b>SECTOR '+(i+1)+' · '+E(x.anchor)+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>';
 if(tab==="capsule"){const v=c.verdict||replacementVerdict(c.type,c.audit,c.questions,c.words);return '<h3>Compression ladder</h3><div class="rrAudit"><b>'+E(v.label)+'</b><br>'+v.gates.map(x=>(x.ok?'✓ ':'✕ ')+E(x.name)+' · '+E(x.why)).join('<br>')+'</div><p>Every claim below is an exact sentence from the source. Renaissance ranks and de-duplicates; it does not fabricate a substitute argument.</p><div class="rrMap">'+c.keys.map((x,i)=>'<div class="rrClaim"><b>CLAIM '+(i+1)+' · '+E(x.anchor)+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>';}
 if(tab==="terms")return '<h3>Concept vocabulary</h3><p>High-frequency content terms orient the source. Frequency is not importance, so these never substitute for the anchored claims.</p><div class="rrTerms">'+c.terms.map(x=>'<span class="rrTerm"><b>'+x.count+'×</b> '+E(x.term)+'</span>').join("")+'</div>'+(c.counter.length?'<h3>Contrasts / limitations found</h3><div class="rrMap">'+c.counter.map(x=>'<div class="rrClaim"><b>'+E(x.anchor)+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>':'');
 if(tab==="verify")return '<h3>Verification anchors</h3><div class="rrAudit">Methods, numbers, results, limitations, figure/table references and notation-sensitive claims are deliberately retained for exact checking. PDF anchors can jump to the preserved original page.</div><div class="rrMap">'+(c.verify||[]).map((x,i)=>verifyCard(r,x,i)).join("")+'</div><h3>Compression audit</h3><div class="rrMap"><div class="rrRelation"><b>EXTRACTIVE</b><p>'+E(String(c.audit.extractive))+' · no generated claims: '+E(String(c.audit.noGeneratedClaims))+'</p></div><div class="rrRelation"><b>TOP-TERM COVERAGE</b><p>'+Math.round(c.audit.lexicalTopTermCoverage*100)+'%</p></div><div class="rrRelation"><b>NUMERIC EVIDENCE CAPTURE</b><p>'+Math.round((c.audit.numericEvidenceCaptured||0)*100)+'% of the bounded numeric audit set</p></div><div class="rrRelation"><b>VISUAL DEPENDENCY</b><p>'+(c.audit.visualDependencyRisk?"ORIGINAL WINDOW REQUIRED":"low by current heuristic")+' · signals: '+(c.audit.visualSignals||0)+'</p></div><div class="rrRelation"><b>NOTATION RISK</b><p>'+(c.audit.notationRisk?"ORIGINAL WINDOW REQUIRED":"low by current heuristic")+' · signals: '+(c.audit.mathSignals||0)+'</p></div><div class="rrRelation"><b>SOURCE HASH</b><p class="rrExact">'+E(r.hash)+'</p></div></div>';
 if(tab==="primary")return '<h3>Irreducible passages</h3><p>'+E(c.type==="primary"?"These stay because language, form, voice or sequence is part of the object. The machine is not allowed to eat the art.":"These passages are retained as exact-source checkpoints against compression loss.")+'</p><div class="rrMap">'+c.irreducible.map(x=>'<div class="rrPassage"><b class="rrKicker">P'+(x.pi+1)+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>';
 if(tab==="practice"){const qs=(dueMode?c.questions.filter(q=>!q.due||q.due<=now()):c.questions),mode=dueMode?" · Reader Today queue":"";
  return '<h3>Prove the source survived compression'+mode+'</h3><div class="rrAudit">'+E(m.label)+' · '+m.seen+'/'+m.total+' prompts attempted · '+m.delayed+' passed after a ≥6-day separation · '+(m.deepCommitted||0)+'/'+(m.deepTotal||0)+' deep prompts have a committed written answer. Uploading or button-tapping earns no replacement proof.</div><p>Deep prompts lock reveal until you commit your own reconstruction. A miss returns tomorrow; repeated success increases spacing. Stored responses can later be graded independently.</p><div class="rrMap">'+(qs.length?qs.map(questionCard).join(""):'<div class="rrEmpty">This source is clear for now.</div>')+'</div>';}

 if(tab==="connections")return '<h3>Cross-source connections</h3><p>Connections are lexical candidates, not claims of agreement. They tell you where to compare sources, not what conclusion to adopt.</p><div class="rrMap">'+((r._relations||[]).length?r._relations.map(x=>'<div class="rrRelation"><b>'+Math.round(x.score*100)+'% OVERLAP</b><p>'+E(x.r.title)+'</p><button class="rrMini" data-rr="open" data-id="'+E(x.r.id)+'">OPEN SOURCE</button></div>').join(""):'<div class="rrEmpty">No strong cross-source overlap yet.</div>')+'</div>';
 if(tab==="original")return originBox(r)+'<h3>Original source</h3><p>For PDFs, this is the actual preserved file rendered locally, not reconstructed text. Other uploaded originals remain downloadable byte-for-byte from local storage.</p>'+(c.audit?.ocrDerived?'<div class="rrAudit"><b>OCR-DERIVED TEXT</b><br>The extracted text came from local English + Arabic OCR. Inspect at least three original pages (or every page if the PDF is shorter) before confirming the OCR spot-check. This confirmation does not certify every character; it only removes the final OCR trust lock.</div>':'')+'<div id="rrOriginal"></div>';
 if(tab==="search"){
  const q=r._searchQuery||"",res=r._searchResults||[];
  return '<h3>Evidence search</h3><p>Ask with keywords or a natural-language question. Reader OS returns the closest exact passages; it does not invent an answer between them.</p><div class="rrLibraryTools"><input id="rrEvidenceQuery" class="rrSearch" placeholder="e.g. What evidence supports the mechanism?" value="'+E(q)+'"><button class="rrMini" data-rr="sourcesearch">SEARCH EXACT SOURCE</button></div>'+(q?(res.length?'<div class="rrMap">'+res.map(x=>'<div class="rrClaim"><b>'+E(x.anchor)+' · score '+x.score+'</b><p class="rrExact">'+E(x.text)+'</p></div>').join("")+'</div>':'<div class="rrEmpty">No passage matched strongly enough. Try fewer or more concrete terms.</div>'):'');
 }
 if(tab==="source")return '<h3>Full extracted source · never amputated</h3><div class="rrAudit">SHA-256 of extracted text: '+E(r.hash)+' · imported '+new Date(r.createdAt).toLocaleString()+'. '+(r.binary?"Original binary preserved locally.":"Text itself is the original imported payload.")+'</div><div class="rrSourceBox">'+E(r.text)+'</div>';
 return "";
}
function guidedSequence(r){
 const c=r?.compiled||{},risk=!!(c.audit?.visualDependencyRisk||c.audit?.notationRisk||c.audit?.ocrDerived),seq=[];
 const add=(x)=>{if(x&&!seq.includes(x))seq.push(x);};
 add("map");
 if(c.type==="primary"){add("primary");add("capsule");add("verify");if(r?.binary) add("original");add("practice");}
 else {add("capsule");add("verify");if(risk&&r?.binary)add("original");if((c.irreducible||[]).length)add("primary");add("practice");}
 return seq;
}
function flowLabel(tab){
 return ({map:"ORIENT",capsule:"COMPRESS",verify:"VERIFY",original:"CHECK ORIGINAL",primary:"KEEP IRREDUCIBLE",practice:"PROVE IT"})[tab]||String(tab||"").toUpperCase();
}
function renderFlow(){
 const el=$("#rrFlow");if(!el)return;
 if(!current){el.innerHTML="";return;}
 if(!flow){
   el.innerHTML='<div class="rrFlowIntro"><div><b>ONE-DOOR REPLACEMENT</b><span>Reader chooses the safe order for this source. It cannot award mastery.</span></div><button class="rrFlowStart" data-rr="startflow">RUN REPLACEMENT SESSION</button></div>';
   return;
 }
 const seq=flow.seq,i=flow.i,tab=seq[i];
 el.innerHTML='<div class="rrFlowHead"><div><b>STEP '+(i+1)+' / '+seq.length+' · '+E(flowLabel(tab))+'</b><span>'+seq.map((x,k)=>'<i class="'+(k<i?"done":k===i?"now":"")+'">'+(k+1)+'</i>').join("")+'</span></div><div class="rrFlowActions"><button class="rrMini" data-rr="flowprev" '+(i===0?"disabled":"")+'>← BACK</button><button class="rrFlowStart" data-rr="flownext">'+(i===seq.length-1?"FINISH SESSION":"NEXT →")+'</button></div></div>';
}
function startFlow(){
 if(!current)return;
 flow={seq:guidedSequence(current),i:0};
 setTab(flow.seq[0],true);
}
function moveFlow(delta){
 if(!flow||!current)return;
 const next=flow.i+delta;
 if(next<0)return;
 if(next>=flow.seq.length){flow=null;renderFlow();setTab("practice");return;}
 flow.i=next;setTab(flow.seq[flow.i],true);
}
async function openSource(r,tab="map"){
 const list=await all();r._relations=related(r,list);current=r;flow=null;
 const m=$("#rrModal");m.hidden=false;document.body.style.overflow="hidden";
 const c=r.compiled,ms=masteryState(r);
 $("#rrTitle").textContent=r.title;
 const rv=c.verdict||replacementVerdict(c.type,c.audit,c.questions,c.words),displayLabel=c.audit?.ocrDerived&&!r.ocrVerified?"OCR CHECK REQUIRED":rv.label;
 $("#rrVerdict").innerHTML='<div><strong>'+E(c.law.note)+'</strong><p>'+E(c.type.toUpperCase())+' · '+c.paragraphs+' paragraphs · '+c.sentences+' sentences · evidence state: '+E(ms.label)+'. Exact source is always one tab away.</p></div><div class="rrBig">'+E(displayLabel)+'</div>';
 $("#rrMetrics").innerHTML=metrics(r);setTab(tab);renderFlow();
}
function setTab(tab,fromFlow){
 if(!current)return;
 if(flow&&!fromFlow){const k=flow.seq.indexOf(tab);if(k>=0)flow.i=k;}
 document.querySelectorAll(".rrTab").forEach(b=>b.classList.toggle("on",b.dataset.tab===tab));
 $("#rrView").innerHTML=view(current,tab);
 if(tab==="original")renderOriginalPage(current,1);
 renderFlow();
}
function close(){current=null;flow=null;dueMode=false;$("#rrModal").hidden=true;document.body.style.overflow="";renderLibrary();}
async function score(qid,ok){
 if(!current)return;
 const r=await get(current.id),q=r.compiled.questions.find(x=>x.id===qid);if(!q)return;
 q.history=Array.isArray(q.history)?q.history:[];q.history.push({t:now(),ok:!!ok});if(q.history.length>100)q.history.splice(0,q.history.length-100);
 q.attempts=(q.attempts||0)+1;if(ok)q.correct=(q.correct||0)+1;
 const seq=[1,3,7,21,60,120,240],i=ok?Math.min(seq.length-1,(q.interval||0)+1):0;
 q.interval=i;q.due=now()+seq[i]*dayMs;r.updatedAt=now();await put(r);current={...r,_relations:current._relations};renderLibrary();
 const el=document.querySelector('[data-q="'+CSS.escape(qid)+'"] .rrScore');if(el)el.innerHTML='<span class="rrAnchor">'+(ok?"Scheduled later.":"Returns tomorrow.")+'</span>';
 $("#rrMetrics").innerHTML=metrics(current);
 if(dueMode){
   const left=current.compiled.questions.filter(x=>!x.due||x.due<=now());
   if(left.length)setTab("practice");else await runDue();
 }
}
async function compileFromUI(){
 const btn=$("#rrCompile"),file=$("#rrFile")?.files?.[0],pasted=$("#rrPaste")?.value||"",title=$("#rrSourceTitle")?.value||file?.name||"",type=$("#rrType")?.value||"auto";
 btn.disabled=true;
 try{
  if(file&&file.name.toLowerCase().endsWith(".reader.json")){
    status("Verifying Reader backup hash…");const rec=await importBackup(file);status("Reader backup verified and restored locally.");renderLibrary();await openSource(rec);return;
  }
  let text=pasted.trim();
  if(file){status("Reading "+file.name+" locally…");text=await readFile(file,(m)=>status(m));}
  if(!text)throw new Error("Paste text or choose a supported file.");
  status("Compiling structure, claims, verification anchors and retrieval…");
  const rec=await saveSource(text,title,type,file?.name||null,file||null);
  status(rec.duplicate?"Already in your library. Starting its replacement protocol.":"Compiled locally. No source text was uploaded. Starting the replacement protocol.");
  renderLibrary();await openSource(rec);startFlow();
 }catch(e){status(e.message,true);}finally{btn.disabled=false;}
}
function mount(){
 const host=$("#rrHost");if(!host)return;
 host.innerHTML='<section class="rrShell"><div class="rrHero"><div><p class="rsEyebrow">READER OS · READING REPLACEMENT ENGINE</p><h2>Replace the reading.<br><em>Keep the knowledge.</em></h2><p>Bring the source you would otherwise spend an hour, a week, or a month reading. Renaissance keeps the entire extractable text, builds an anchored compression ladder, preserves irreducible passages, isolates evidence that deserves exact checking, and schedules retrieval until the source survives without the page.</p></div><div class="rrLaw"><b>THE LAW</b><span>If reading is transport for information, compress it. If exact wording, methods, evidence, style or aesthetic experience is the cargo, keep that part primary. No summary is allowed to impersonate the source, and no upload is allowed to impersonate mastery.</span></div></div><div class="rrInput"><textarea id="rrPaste" class="rrPaste" placeholder="Paste an article, chapter, paper, book extract, lecture notes…"></textarea><div class="rrControls"><input id="rrSourceTitle" class="rrTitle" placeholder="Source title (optional)"><select id="rrType" class="rrSelect"><option value="auto">AUTO CLASSIFY</option><option value="nonfiction">NONFICTION / ARTICLE</option><option value="textbook">TEXTBOOK / EXPLANATORY</option><option value="research">RESEARCH PAPER</option><option value="primary">LITERATURE / PRIMARY TEXT</option></select><input id="rrFile" class="rrFile" type="file" accept=".pdf,.epub,.docx,.txt,.md,.markdown,.html,.htm,.csv,.json,.rtf,.reader.json,text/*,application/pdf"><button id="rrCompile" class="rrCompile" type="button">COMPILE READING</button><p class="rrHint">PDF, EPUB, DOCX, TXT, Markdown, HTML, CSV, JSON, RTF or pasted text. Source stays on this device. Searchable PDFs use their text layer first; scanned PDFs fall back to local English + Arabic OCR and require an original-page spot-check. Unknown formats fail loudly instead of producing fake understanding.</p></div></div><div id="rrStatus" class="rrStatus" aria-live="polite"></div><div id="rrToday" class="rrToday"></div><div class="rrLibrary"><div class="rrLibraryTop"><h3>Your compiled library</h3><span id="rrLibraryCount"></span></div><div class="rrLibraryTools"><input id="rrSearch" class="rrSearch" type="search" placeholder="Search titles and concepts"><span class="rrHint">Each source can be exported as a hash-verified Reader backup.</span></div><div id="rrCards" class="rrCards"></div></div></section>';
 const modal=document.createElement("div");modal.id="rrModal";modal.className="rrModal";modal.hidden=true;modal.innerHTML='<div class="rrPanel" role="dialog" aria-modal="true" aria-labelledby="rrTitle"><div class="rrTop"><div><span class="rrKicker">RENAISSANCE READER OS</span><h2 id="rrTitle"></h2></div><button class="rrClose" data-rr="close" aria-label="Close">×</button></div><div class="rrBody"><div id="rrVerdict" class="rrVerdict"></div><div id="rrMetrics"></div><div id="rrFlow" class="rrFlow"></div><div class="rrTabs"><button class="rrTab on" data-rr="tab" data-tab="map">MAP</button><button class="rrTab" data-rr="tab" data-tab="capsule">CAPSULE</button><button class="rrTab" data-rr="tab" data-tab="verify">VERIFY</button><button class="rrTab" data-rr="tab" data-tab="terms">TERMS + CONTRASTS</button><button class="rrTab" data-rr="tab" data-tab="primary">IRREDUCIBLE</button><button class="rrTab" data-rr="tab" data-tab="practice">PROVE IT</button><button class="rrTab" data-rr="tab" data-tab="connections">CONNECTIONS</button><button class="rrTab" data-rr="tab" data-tab="search">EVIDENCE SEARCH</button><button class="rrTab" data-rr="tab" data-tab="original">ORIGINAL</button><button class="rrTab" data-rr="tab" data-tab="source">EXTRACTED SOURCE</button></div><div id="rrView" class="rrView"></div></div></div>';
 document.body.appendChild(modal);
 $("#rrCompile").addEventListener("click",compileFromUI);$("#rrSearch").addEventListener("input",renderLibrary);
 document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-rr]");if(!b)return;const a=b.dataset.rr;
  if(a==="close")return close();if(a==="tab")return setTab(b.dataset.tab);if(a==="startflow")return startFlow();if(a==="flownext")return moveFlow(1);if(a==="flowprev")return moveFlow(-1);if(a==="due")return runDue();
  if(a==="open"){const r=await get(b.dataset.id);if(r)await openSource(r);return;}
  if(a==="run"){const r=await get(b.dataset.id);if(r){await openSource(r);startFlow();}return;}
  if(a==="export"){await exportSource(b.dataset.id);return;}
  if(a==="original"){await downloadOriginal(b.dataset.id);return;}
  if(a==="pdfpage"){await renderOriginalPage(current,Number(b.dataset.page)||1);return;}
  if(a==="ocrok"){
    if(!current?.compiled?.audit?.ocrDerived)return;
    const r=await get(current.id);if(!r)return;
    const need=ocrRequiredPages(r.ocrPageTotal||r.compiled.audit.ocrPages||1),pages=[...new Set(r.ocrPagesViewed||[])];
    if(pages.length<need)return;
    if(!r.binary?.sha256)return;
    r.ocrVerified={t:now(),pages:pages.slice(),required:need,binarySha256:r.binary.sha256,statement:"human spot-check against preserved original PDF"};
    r.updatedAt=now();await put(r);current={...r,_relations:current._relations};$("#rrMetrics").innerHTML=metrics(current);setTab("original");renderLibrary();return;
  }
  if(a==="jumporiginal"){setTab("original");await renderOriginalPage(current,Number(b.dataset.page)||1);return;}
  if(a==="sourcesearch"){
    const q=$("#rrEvidenceQuery")?.value||"";if(!current)return;
    current._searchQuery=q;current._searchResults=searchSource(current,q);setTab("search");return;
  }
  if(a==="delete"){if(confirm("Delete this local source and its Reader OS record? This does not touch Renaissance curriculum state.")){await del(b.dataset.id);renderLibrary();}return;}
  if(a==="commitresponse"){
    if(!current)return;const id=b.dataset.q,box=b.closest(".rrQuestion"),ta=box?.querySelector("[data-response]"),answer=String(ta?.value||"").trim();
    if(answer.length<12){ta?.focus();return;}
    const r=await get(current.id),q=r.compiled.questions.find(x=>x.id===id);if(!q)return;
    q.responses=Array.isArray(q.responses)?q.responses:[];q.responses.push({t:now(),text:answer});if(q.responses.length>50)q.responses.splice(0,q.responses.length-50);
    r.updatedAt=now();await put(r);current={...r,_relations:current._relations};setTab("practice");renderLibrary();return;
  }
  if(a==="reveal"){const x=document.querySelector('[data-a="'+CSS.escape(b.dataset.q)+'"]');if(x)x.hidden=false;return;}
  if(a==="score")return score(b.dataset.q,b.dataset.ok==="1");
 });
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#rrModal").hidden)close();});
 renderLibrary();
}
function doctor(){
 const sample=[
  "A system has a visible step and a hidden constraint. The visible step takes four minutes, but the hidden step takes seventy minutes.",
  "Because the hidden step limits throughput, optimizing the visible step cannot materially increase total flow.",
  "However, a second system without that constraint may respond differently, so the mechanism should not be generalized blindly.",
  "In a sample of 1,240 cases, median delay fell from 182 minutes to 139 minutes after the intervention.",
  "Staffing also changed during the period, which limits a causal interpretation of the before-and-after comparison.",
  "The practical decision is to measure the constraint, test a discriminating intervention, and preserve the limitation beside the result."
 ].join("\n\n");
 try{
  const x=compile(sample,"Reader OS doctor","research"),claims=x.keys.every(k=>sample.includes(k.text)),deep=x.questions.filter(q=>q.kind&&q.kind!=="cloze").length;
  const primary=compile("Chapter one. The voice of the narrator changes the meaning of the scene.\n\nChapter two. The rhythm of the words is part of the experience.\n\nA third passage carries the conflict through style.\n\nA fourth passage changes the speaker.\n\nA fifth passage closes the scene.","Primary doctor","primary");
  const visual=compile("Figure 1 shows the network architecture and its three branches.\n\nTable 1 compares the measured outputs across groups.\n\nThe diagram in Figure 2 is required to distinguish the pathways.\n\nThe text explains why the first branch is upstream of the second.\n\nA final paragraph states the practical interpretation of the chart.","Visual doctor","textbook");
  const ocr=compile("[PAGE 1 OCR] A scanned source explains a mechanism because pressure changes flow.\n\n[PAGE 2 OCR] However, an alternative explanation remains possible.\n\n[PAGE 3 OCR] In 240 observations, output rose from 31 to 47 units.\n\nA fourth paragraph preserves a limitation.\n\nA fifth paragraph states a falsifiable prediction.","OCR doctor","nonfiction");
  const failures=[];
  if(!claims)failures.push("non-extractive claim");
  if(!x.verdict?.pass)failures.push("research replacement gates fail");
  if(deep<3)failures.push("deep retrieval missing");
  if((x.verify||[]).length<2)failures.push("verification anchors missing");
  if(primary.verdict?.label!=="BRIDGE, DO NOT REPLACE")failures.push("primary-text protection failed");
  if(visual.verdict?.label!=="ORIGINAL-WINDOW REQUIRED")failures.push("visual dependency protection failed");
  if(!ocr.audit?.ocrDerived||ocr.verdict?.label!=="OCR CHECK REQUIRED")failures.push("OCR trust gate failed");
  const gResearch=guidedSequence({compiled:x,binary:null}),gPrimary=guidedSequence({compiled:primary,binary:null});
  if(gResearch[0]!=="map"||gResearch[gResearch.length-1]!=="practice"||!gResearch.includes("verify"))failures.push("guided research sequence failed");
  if(gPrimary[0]!=="map"||gPrimary[1]!=="primary"||gPrimary[gPrimary.length-1]!=="practice")failures.push("guided primary sequence failed");
  return {ok:!failures.length,failures,metrics:{claims:x.keys.length,deep,verify:x.verify.length,research:x.verdict?.label,primary:primary.verdict?.label,visual:visual.verdict?.label,ocr:ocr.verdict?.label,guided:gResearch.join(">")}};
 }catch(e){return {ok:false,failures:[e.message],metrics:{}};}
}
// Internal digestion entry (v2.0, additive): the World Harvester hands Reader OS a source it found and verified, with its origin
// (url, revision, licence, content hash). The same compile, gates and evidence lifecycle apply as for a manual import; manual import is unchanged.
async function digest(text,title,type,origin){
 if(!origin||typeof origin!=="object"||!origin.via||!origin.contentSha256)throw new Error("digest needs an origin with via and contentSha256, so provenance is never lost");
 if(await sha(normalize(text))!==origin.contentSha256)throw new Error("digest refused: the text does not match the recorded content hash");
 const rec=await saveSource(text,title,type,null,null,{...origin,digestedAt:now()});
 return {id:rec.id,duplicate:!!rec.duplicate,title:rec.title,verdict:rec.compiled?.verdict||null,origin:rec.origin};
}
window.RENAISSANCE_READER={digest,compile:(text,title,type)=>compile(normalize(text),title||"Untitled",type||"auto"),library:all,get,open:async(id)=>{const r=await get(id);if(r)await openSource(r);return !!r;},run:async(id)=>{const r=await get(id);if(!r)return false;dueMode=false;await openSource(r);startFlow();return true;},due:dueQueue,runDue,mastery:masteryState,relationScore,doctor,version:"2.0",digestApi:1};
document.addEventListener("DOMContentLoaded",mount);
})();