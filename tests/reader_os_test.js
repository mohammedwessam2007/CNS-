// Reader OS hostile/invariant gate. No browser required.
// Vercel must run this before publishing the standalone Renaissance artifact.
const fs=require("fs"),path=require("path"),vm=require("vm");
const src=fs.readFileSync(path.join(__dirname,"../source/public/reader-v1.js"),"utf8");
const failures=[],check=(name,ok,detail)=>{if(!ok)failures.push({name,detail});console.log((ok?"PASS ":"FAIL ")+name+(ok?"":" "+JSON.stringify(detail).slice(0,500)));};
const sandbox={
  console,TextEncoder,TextDecoder,Blob,URL,crypto:globalThis.crypto,
  document:{addEventListener(){},querySelector(){return null;}},
  navigator:{storage:{}},location:{protocol:"https:"},
  setTimeout,clearTimeout
};
sandbox.window=sandbox;sandbox.globalThis=sandbox;
vm.createContext(sandbox);
try{vm.runInContext(src,sandbox,{filename:"reader-v1.js"});}catch(e){console.error(e);process.exit(1);}
const R=sandbox.RENAISSANCE_READER;
check("reader version",R&&R.version==="1.9",R&&R.version);
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
const O=R.compile("[PAGE 1 OCR]\\nA scanned page explains the mechanism because pressure changes flow.\\n\\n[PAGE 2 OCR]\\nHowever, the source preserves a limitation that should be checked.\\n\\n[PAGE 3 OCR]\\nThe practical interpretation depends on the original scan.\\n\\nA fourth paragraph gives enough structure to compile.\\n\\nA fifth paragraph closes the argument with a testable claim.","OCR hostile source","nonfiction");
check("OCR compilation is explicitly trust-gated",O.audit&&O.audit.ocrDerived&&O.verdict&&O.verdict.label==="OCR CHECK REQUIRED",O.verdict);
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
const matureOCR=mature(O,true);
check("mature OCR remains blocked before original spot-check",R.mastery(matureOCR).label!=="READING REPLACEMENT PROVEN",R.mastery(matureOCR));
matureOCR.ocrVerified={t:Date.now(),pages:[1,2,3],required:3};
check("mature OCR may prove only after verification receipt",R.mastery(matureOCR).label==="READING REPLACEMENT PROVEN",R.mastery(matureOCR));
const noDeep=R.mastery(mature(C,false));
check("button-only deep prompts cannot prove replacement",noDeep.label!=="READING REPLACEMENT PROVEN",noDeep);
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


if(failures.length){console.error("\nReader OS gate failed",failures);process.exit(1);}
console.log("\nReader OS hostile gate: ALL PASS");
