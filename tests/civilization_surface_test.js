"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm"),root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const index=read("source/public/index.html"),js=read("source/public/renaissance-civilization.js"),xp=read("source/public/renaissance-experience.js"),css=read("source/public/renaissance-civilization.css"),build=read("deploy/vercel/build.mjs"),sw=read("source/public/renaissance-sw.js");
let n=0;function ok(name,cond){if(!cond)throw Error(name);console.log("PASS",++n,name);}
function parses(name,src){try{new vm.Script(src,{filename:name});return true;}catch(e){console.error(e);return false;}}
ok("civilization javascript parses",parses("renaissance-civilization.js",js));
ok("experience javascript parses",parses("renaissance-experience.js",xp));
for(const a of ["renaissance-civilization.css","renaissance-civilization.js","renaissance-experience.js"]){ok(a+" loaded",index.includes("/"+a));ok(a+" shipped",build.includes('"'+a+'"'));ok(a+" cached",sw.includes('"/'+a+'"'));}
ok("civilization precedes source lab",index.indexOf('id="rvHost"')<index.indexOf('id="rvSourceLab"'));
const surface=index+"\n"+js+"\n"+xp+"\n"+css;
for(const re of [/\bIQ\b/i,/genius score/i,/capability atoms/i,/sealed probes completed/i,/answers recorded/i])ok("forbidden visible framing absent "+re,!re.test(surface));
for(const s of ["Absorb civilisation","Keep what cannot be compressed","The machine eats the scaffolding","You keep the human encounter","Never summarize away the reason a masterpiece matters"])ok("doctrine present: "+s,js.includes(s));
for(const s of ["ENCOUNTER","REMEMBER","LANGUAGE","CONNECTIONS","ENTER THIS WORLD","OPEN EXPLANATION"])ok("encounter language present: "+s,xp.includes(s));
ok("legacy dashboard hidden",css.includes(".rsHero,.rsStats,#player{display:none!important}"));
ok("bootloader hidden from front door",css.includes(".rvInternalTrack{display:none!important}"));
ok("engine room collapsed",index.includes('class="rvInfrastructure"'));
ok("source lab optional",index.includes('class="rvSourceLab"'));
ok("today reads canonical life governor",js.includes("window.RENAISSANCE?.gate?.(new Date())"));
ok("today launches canonical study path",js.includes("R.open(new Date())"));
ok("today has no parallel calendar rotation",!js.includes("Date.UTC")&&!js.includes("day%pool.length"));
ok("rest state is visible without backlog debt",js.includes("Nothing is owed today.")&&js.includes("There is no backlog debt."));
ok("civilization home refreshes when study dialog closes",js.includes("function watchStudyRoot()")&&js.includes("attributeFilter:[\"hidden\"]")&&js.includes("if(r.hidden)render()"));
ok("canonical study faults are fail-visible",js.includes("canonical study path threw while opening today's encounter")&&js.includes("CIVILIZATION INTEGRITY FAILED"));
ok("canonical study faults do not silently browse",!js.includes("catch(e){}const t=todayState().session"));
ok("experience doctor checks civilization and campus",xp.includes("window.RENAISSANCE_CIVILIZATION")&&xp.includes("window.RENAISSANCE_CAMPUS")&&xp.includes("function doctor()"));
ok("runtime cannot paint false green",xp.includes("civilization integrity error")&&xp.includes("new MutationObserver(enforce)"));
for(const x of ["mcq-v16.js","learn-v15.js","cns-atlas-v17.js"])ok("medical asset excluded "+x,!build.includes(x));
ok("offline cache advanced",sw.includes("renaissance-civilization-reader2-campus12-v8"));
console.log("CIVILIZATION SURFACE: ALL PASS",n);
