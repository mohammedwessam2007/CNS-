// Reader OS hostile/invariant gate. No browser required.
// Vercel must run this before publishing the standalone Renaissance artifact.
const fs=require("fs"),path=require("path"),vm=require("vm");
const src=fs.readFileSync(path.join(__dirname,"../source/public/reader-v1.js"),"utf8");
// A minimal in-memory IndexedDB with the semantics that matter: a request's `result` is set when it completes and is undefined for a missing key.
// (Reader OS 2.0 shipped with a helper that returned the request object itself for a missing key, so every new source looked like a duplicate
// and nothing was ever saved. The hostile gate had no storage at all, so nothing caught it.)
function fakeIndexedDB(){
 const stores=new Map();
 return {open(){
  const r={};
  setTimeout(()=>{
   const db={objectStoreNames:{contains:n=>stores.has(n)},createObjectStore(n,o){stores.set(n,{key:o.keyPath,rows:new Map()});},
    transaction(n){const st=stores.get(n),t={oncomplete:null,onerror:null};let pending=0;
     const wrap=(fn)=>{const q={};pending++;setTimeout(()=>{q.result=fn();pending--;if(!pending)setTimeout(()=>t.oncomplete&&t.oncomplete(),0);},0);return q;};
     t.objectStore=()=>({getAll:()=>wrap(()=>[...st.rows.values()]),get:(k)=>wrap(()=>st.rows.get(k)),put:(x)=>wrap(()=>{st.rows.set(x[st.key],x);return x[st.key];}),delete:(k)=>wrap(()=>{st.rows.delete(k);})});
     return t;}};
   r.result=db;if(!stores.size&&r.onupgradeneeded)r.onupgradeneeded();r.onsuccess&&r.onsuccess();
  },0);
  return r;}};
}
const failures=[],check=(name,ok,detail)=>{if(!ok)failures.push({name,detail});console.log((ok?"PASS ":"FAIL ")+name+(ok?"":" "+JSON.stringify(detail).slice(0,500)));};
const sandbox={
  console,TextEncoder,TextDecoder,Blob,URL,crypto:globalThis.crypto,
  document:{addEventListener(){},querySelector(){return null;}},
  navigator:{storage:{}},location:{protocol:"https:"},
  setTimeout,clearTimeout,
  indexedDB:fakeIndexedDB()
};
sandbox.window=sandbox;sandbox.globalThis=sandbox;
vm.createContext(sandbox);
try{vm.runInContext(src,sandbox,{filename:"reader-v1.js"});}catch(e){console.error(e);process.exit(1);}
const R=sandbox.RENAISSANCE_READER;
check("reader version",R&&R.version==="2.0",R&&R.version);
const doctor=R&&R.doctor&&R.doctor();
check("behavioral doctor",doctor&&doctor.ok,doctor);

const research=[
 "A hospital measured a queue before changing it. Registration took four minutes, while laboratory turnaround took seventy-four minutes.",
 "Because laboratory turnaround was the constraint, optimizing registration alone could not materially raise total throughput.",
 "However, staffing also increased during the study period, so the before-and-after result cannot identify batching as the only cause.",
 "In 1,240 visits before the intervention and 1,310 after it, median total visit time fell from 182 minutes to 139 minutes.",
 "The team changed specimen batching from hourly to every fifteen minutes and recorded the result.",
 "The practical claim is that the constraint should be measured before a visible but non-limiting step is optimized."
].join("\n\n");
const C=R.compile(research,"Hostile research source","research");
check("extractive claims",C.keys.every(k=>research.includes(k.text)),C.keys);
check("deep prompts",C.questions.filter(q=>q.kind&&q.kind!=="cloze").length>=3,C.questions.map(q=>q.kind||"cloze"));
check("research candidate gates",C.verdict&&C.verdict.pass&&C.verdict.label==="REPLACEMENT CANDIDATE",C.verdict);

const primary=[
 "Chapter one. The voice of the narrator changes what the scene means.",
 "Chapter two. The rhythm of the words is part of the experience itself.",
 "A third passage carries the conflict through style rather than exposition.",
 "A fourth passage changes speaker and therefore changes the reader's position.",
 "A fifth passage closes the scene by changing the cadence rather than stating a thesis."
].join("\n\n");
const ocrSource=[
 "[PAGE 1 OCR] The system works because pressure changes flow through the constrained path.",
 "[PAGE 2 OCR] However, a competing mechanism remains possible and must be checked against the original evidence.",
 "[PAGE 3 OCR] In 240 observations, measured output increased from 31 to 47 units.",
 "A fourth paragraph explains that a hidden constraint changes the mechanism.",
 "A fifth paragraph preserves a limitation on generalization.",
 "A sixth paragraph describes a falsifying test."
].join("\n\n");
const O=R.compile(ocrSource,"OCR hostile source","research");
check("OCR compile carries trust lock",O.audit?.ocrDerived&&O.audit?.ocrPages===3&&O.verdict?.label==="OCR CHECK REQUIRED",O.verdict);

const P=R.compile(primary,"Primary hostile source","primary");
check("primary never replacement candidate",P.verdict&&P.verdict.label==="BRIDGE, DO NOT REPLACE",P.verdict);

const visual=[
 "Figure 1 shows the network architecture and its three branches.",
 "Table 1 compares the measured outputs across groups.",
 "The diagram in Figure 2 is required to distinguish the pathways.",
 "Figure 3 shows where the two pathways cross.",
 "The prose explains why the first branch is upstream of the second."
].join("\n\n");
const V=R.compile(visual,"Visual hostile source","textbook");
check("visual original-window gate",V.verdict&&V.verdict.label==="ORIGINAL-WINDOW REQUIRED"&&!V.verdict.pass,V.verdict);

const math=[
 "The theorem follows from the matrix representation of the linear map.",
 "The proof uses the vector basis and the matrix equation.",
 "The integral is then evaluated under the stated boundary condition.",
 "The derivative changes sign at the critical point.",
 "The final equation preserves the quantity under the transformation."
].join("\n\n");
const M=R.compile(math,"Notation hostile source","textbook");
check("notation original-window gate",M.verdict&&M.verdict.label==="ORIGINAL-WINDOW REQUIRED"&&!M.verdict.pass,M.verdict);

function mature(compiled,deepResponses=true){
 const c=JSON.parse(JSON.stringify(compiled)),now=Date.now(),d=86400000;
 for(const q of c.questions){
   q.history=[{t:now-35*d,ok:true},{t:now-1*d,ok:true}];
   q.attempts=2;q.correct=2;q.due=now+7*d;q.interval=3;
   if(q.kind&&q.kind!=="cloze"&&deepResponses)q.responses=[{t:now-36*d,text:"A committed reconstruction long enough to count as an answer."}];
 }
 return {compiled:c,createdAt:now-40*d,updatedAt:now};
}
const noDeep=R.mastery(mature(C,false));
check("button-only deep prompts cannot prove replacement",noDeep.label!=="READING REPLACEMENT PROVEN",noDeep);
const matureOcrBase=mature(O,true);
const matureOcrBefore=R.mastery({...matureOcrBase,binary:{sha256:"source-file-hash"},ocrVerified:null});
check("OCR mature record remains blocked before original spot-check",matureOcrBefore.label==="OCR ORIGINAL CHECK REQUIRED"&&matureOcrBefore.score<1,matureOcrBefore);
const matureOcrWrongHash=R.mastery({...matureOcrBase,binary:{sha256:"source-file-hash"},ocrVerified:{t:Date.now(),pages:[1,2,3],required:3,binarySha256:"different-file"}});
check("OCR receipt cannot authorize a different original binary",matureOcrWrongHash.label==="OCR ORIGINAL CHECK REQUIRED"&&matureOcrWrongHash.score<1,matureOcrWrongHash);
const matureOcrAfter=R.mastery({...matureOcrBase,binary:{sha256:"source-file-hash"},ocrVerified:{t:Date.now(),pages:[1,2,3],required:3,binarySha256:"source-file-hash"}});
check("OCR mature record unlocks only after original spot-check receipt",matureOcrAfter.label==="READING REPLACEMENT PROVEN"&&matureOcrAfter.score===1,matureOcrAfter);

const matureResearch=R.mastery(mature(C,true));
check("mature delayed research can reach proven state",matureResearch.label==="READING REPLACEMENT PROVEN",matureResearch);
const maturePrimary=R.mastery(mature(P,true));
check("mature primary ends at secondary-layer possession",maturePrimary.label==="SECONDARY LAYER POSSESSED",maturePrimary);

check("no source upload primitive",!(/\bfetch\s*\(|XMLHttpRequest|sendBeacon\s*\(/.test(src)),null);
check("no medical asset dependency",!(/mcq-v16|learn-v15|cns-atlas|dept-fig/.test(src)),null);

const build=fs.readFileSync(path.join(__dirname,"../deploy/vercel/build.mjs"),"utf8");
const pkg=JSON.parse(fs.readFileSync(path.join(__dirname,"../deploy/vercel/package.json"),"utf8"));
check("OCR source is local-only",src.includes('/vendor/tesseract/')&&src.includes('/vendor/tessdata/'),null);
check("OCR runtime is actually bundled",build.includes('node_modules/tesseract.js/dist/')&&build.includes('@tesseract.js-data/eng')&&build.includes('@tesseract.js-data/ara'),null);
check("OCR dependencies pinned",!!pkg.dependencies?.["tesseract.js"]&&!!pkg.dependencies?.["@tesseract.js-data/eng"]&&!!pkg.dependencies?.["@tesseract.js-data/ara"],pkg.dependencies);
check("OCR receipt bound to original binary SHA-256",src.includes("binarySha256")&&src.includes("shaBlob"),null);
check("restored backup cannot retain OCR authority",src.includes("historicalOcrReceipt")&&src.includes("ocrVerified:null")&&src.includes("ocrPagesViewed:[]"),null);


(async()=>{
 // storage and the internal digestion entry (the World Harvester's door into Reader OS)
 check("missing key reads as undefined, not as a request object",(await R.get("no-such-source"))===undefined,null);
 check("digestApi present, manual compile path unchanged",R.digestApi===1&&typeof R.digest==="function"&&typeof R.compile==="function"&&typeof R.library==="function",null);
 const nodeCrypto=require("crypto"),hash=t=>nodeCrypto.createHash("sha256").update(t).digest("hex"),origin={via:"world-harvester",url:"https://example.test/page?oldid=7",revision:7,license:"CC BY-SA 4.0",contentSha256:hash(research),whyChosen:"test",retrievedAt:"2026-10-02T00:00:00Z"};
 const first=await R.digest(research,"Digest probe","research",origin);
 check("a new source is saved (not mistaken for a duplicate) with its origin attached",first.duplicate===false&&(await R.library()).length===1&&(await R.get(first.id))?.origin?.via==="world-harvester"&&first.id===origin.contentSha256.slice(0,24),first);
 const second=await R.digest(research,"Digest probe","research",origin);
 check("the same source again is recognised as a duplicate and stored once",second.duplicate===true&&(await R.library()).length===1,second);
 let e1=null,e2=null;try{await R.digest(research,"x","research",{...origin,contentSha256:"0".repeat(64)});}catch(e){e1=e.message;}
 try{await R.digest(research,"x","research",null);}catch(e){e2=e.message;}
 check("digest refuses text that does not match its recorded hash, and refuses a missing origin (provenance is never lost)",/does not match the recorded content hash/.test(e1||"")&&/origin/.test(e2||"")&&(await R.library()).length===1,{e1,e2});
 if(failures.length){console.error("\nReader OS gate failed",failures);process.exit(1);}
 console.log("\nReader OS hostile gate: ALL PASS");
})();
