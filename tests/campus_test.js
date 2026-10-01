// Renaissance Campus invariant gate. Runs before Vercel publishes the standalone artifact.
const fs=require("fs"),path=require("path"),vm=require("vm");
const ROOT=path.join(__dirname,"../source/public");
const failures=[],check=(name,ok,detail)=>{if(!ok)failures.push({name,detail});console.log((ok?"PASS ":"FAIL ")+name+(ok?"":" "+JSON.stringify(detail).slice(0,500)));};
const sandbox={
 console,
 document:{
  addEventListener(){},querySelector(){return null;},querySelectorAll(){return[];},
  createElement(){return {style:{},addEventListener(){},classList:{add(){},remove(){}}}},
  body:{appendChild(){},style:{}}
 },
 localStorage:{getItem(){return null},setItem(){},removeItem(){}},
 location:{search:""},MutationObserver:class{observe(){}},requestAnimationFrame:f=>f(),
 RENAISSANCE_READER:{run:async()=>true,version:"2.0"}
};
sandbox.window=sandbox;sandbox.globalThis=sandbox;
vm.createContext(sandbox);
for(const name of ["renaissance-s1.js","renaissance-s2.js","renaissance-s3a.js","renaissance-s3b.js","renaissance-s3c.js"]){
 vm.runInContext(fs.readFileSync(path.join(ROOT,name),"utf8"),sandbox,{filename:name});
}
const campusSrc=fs.readFileSync(path.join(ROOT,"campus-v1.js"),"utf8");
try{vm.runInContext(campusSrc,sandbox,{filename:"campus-v1.js"});}catch(e){console.error(e);process.exit(1);}
const C=sandbox.RENAISSANCE_CAMPUS,doctor=C&&C.doctor&&C.doctor();
check("campus version",C&&C.version==="1.2",C&&C.version);
check("campus doctor",doctor&&doctor.ok,doctor);
check("exact 32 session mapping",doctor?.metrics?.sessions===32&&doctor?.metrics?.mapped===32,doctor?.metrics);
check("five authored tracks",doctor?.metrics?.tracks===5,doctor?.metrics);
check("all 96 delayed retrieval hooks exposed",doctor?.metrics?.hooks===96,doctor?.metrics);
check("rich authored step fields exposed",/function authoredExtras/.test(campusSrc)&&/data-tab="retrieval"/.test(campusSrc),doctor?.metrics);
const ids=C.tracks().flatMap(t=>t.ids);
check("map ids unique",new Set(ids).size===ids.length,ids);
check("core bootloader preserved",JSON.stringify(C.tracks()[0].ids)===JSON.stringify(["commit","select","base","loop","proxy","falsify","bottleneck","question","snow","double","taste","boss"]),C.tracks()[0].ids);
check("reader bridge present",doctor?.metrics?.readerRun===true,doctor?.metrics);
check("browse map has no direct medical assets",!(/mcq-v16|learn-v15|cns-atlas|dept-fig/.test(campusSrc)),null);
if(failures.length){console.error("\nCampus gate failed",failures);process.exit(1);}
console.log("\nRenaissance Campus gate: ALL PASS");
