(function(){
'use strict';
const KEY='intellectuality_learning_twin_v1';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
const median=a=>{if(!a.length)return 0;const x=[...a].sort((a,b)=>a-b),m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2};
const safe=(fn,f=null)=>{try{return fn()}catch(_){return f}};
const seed=()=>({
 schema:'intellectuality.learning-twin.v1',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
 objective:{targetBand:'very-good-with-margin',dailySoftCeilingMin:100,dailyHardCeilingMin:120,weights:{examPerformance:.46,understanding:.27,timeFreedom:.27}},
 preferences:{visualFirst:1,realVisuals:1,professorFed:1,lowText:1,oneButton:1,resourceHunting:0,planningBurden:0,deepDetailOnlyOnDemand:1,teachingLoop:'look → understand → prove → leave'},
 rhythm:{focusSpanMin:65,minBreakGapMin:45,lastBreakActiveMin:0,buckets:{morning:{n:0,ok:0,latencies:[]},afternoon:{n:0,ok:0,latencies:[]},evening:{n:0,ok:0,latencies:[]},night:{n:0,ok:0,latencies:[]}}},
 confidence:{guess:{n:0,ok:0},unsure:{n:0,ok:0},confident:{n:0,ok:0}},
 methods:{feed:{n:0,ok:0,latency:0},visual:{n:0,ok:0,latency:0},video:{n:0,ok:0,latency:0},deep:{n:0,ok:0,latency:0},audio:{n:0,ok:0,latency:0},vision:{n:0,ok:0,latency:0}},
 videoStats:{},teachingMemory:{},forgetting:{},language:{snippets:{}},processedEvidence:[],sessions:[],days:[],totals:{activeMs:0,evidence:0,correct:0}
});
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){return null}}
function normalize(t){
 const d=seed();t=t||d;t.schema=t.schema||d.schema;t.objective=Object.assign(d.objective,t.objective||{});t.preferences=Object.assign(d.preferences,t.preferences||{});
 t.rhythm=t.rhythm||d.rhythm;t.rhythm.buckets=Object.assign(d.rhythm.buckets,t.rhythm.buckets||{});
 t.confidence=Object.assign(d.confidence,t.confidence||{});t.methods=Object.assign(d.methods,t.methods||{});t.videoStats=t.videoStats||{};t.teachingMemory=t.teachingMemory||{};
 t.forgetting=t.forgetting||{};t.language=t.language||{snippets:{}};t.language.snippets=t.language.snippets||{};t.processedEvidence=t.processedEvidence||[];t.sessions=t.sessions||[];t.days=t.days||[];t.totals=t.totals||d.totals;return t
}
function ensure(){
 S.v13=S.v13||{version:'13.0',createdAt:new Date().toISOString(),history:[],flags:{}};
 const local=load(),cloud=S.v13.twin,lt=Date.parse(local?.updatedAt||0),ct=Date.parse(cloud?.updatedAt||0),chosen=ct>lt?cloud:(local||cloud);
 S.v13.version='13.0';S.v13.history=S.v13.history||[];S.v13.twin=normalize(chosen);
 S.v13.flags={learningTwin:true,teachingMemory:true,personalLanguage:true,behaviorRhythm:true,confidenceCalibration:true,personalForgetting:true,lifeBudget:true,crossSemester:true};
 persist();return S.v13.twin
}
function twin(){return S.v13?.twin||ensure()}
function persist(){if(!S.v13?.twin)return;S.v13.twin.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(S.v13.twin))}catch(_){}}
function bucket(){const h=new Date().getHours();return h<6?'night':h<12?'morning':h<18?'afternoon':h<22?'evening':'night'}
function session(force=false){
 const t=twin(),last=t.sessions.at(-1),n=Date.now(),seen=last?Date.parse(last.lastSeen||last.startedAt):0;
 if(force||!last||!last.open||n-seen>1800000){if(last)last.open=false;t.sessions.push({id:'s'+n,startedAt:new Date().toISOString(),lastSeen:new Date().toISOString(),open:true,activeMs:0,evidence:0,correct:0,wrong:0,deepOpens:0,videos:0,visualClicks:0,audio:0,vision:0,mode:bucket(),latencies:[]});t.sessions=t.sessions.slice(-80)}
 return t.sessions.at(-1)
}
function confidence(conf,ok){const c=twin().confidence[conf]||(twin().confidence[conf]={n:0,ok:0});c.n++;if(ok)c.ok++}
function timeBucket(ok,latency){const b=twin().rhythm.buckets[bucket()];b.n++;if(ok)b.ok++;if(Number.isFinite(latency)){b.latencies.push(latency);b.latencies=b.latencies.slice(-40)}}
function forgetting(topic,ok,at){
 if(!topic)return;const t=twin(),f=t.forgetting[topic]||(t.forgetting[topic]={stabilityDays:3,lastAt:null,observations:[]});
 if(f.lastAt){const gap=Math.max(.01,(Date.parse(at)-Date.parse(f.lastAt))/86400000);f.observations.push({gap:+gap.toFixed(2),ok:!!ok});f.observations=f.observations.slice(-20);if(ok&&gap>.2)f.stabilityDays=clamp(Math.max(f.stabilityDays*1.04,gap*1.55),.5,120);if(!ok)f.stabilityDays=clamp(Math.min(f.stabilityDays*.7,Math.max(.5,gap*.9)),.5,120)}
 f.lastAt=at
}
function personalRetention(topic,at=new Date()){const f=twin().forgetting[topic];if(!f?.lastAt)return safe(()=>retention(topic,at),0);const gap=Math.max(0,(new Date(at)-new Date(f.lastAt))/86400000),p=Math.exp(-Math.log(2)*gap/Math.max(.5,f.stabilityDays||3)),base=safe(()=>retention(topic,at),p);return clamp(.7*p+.3*base)}
function method(k,ok,latency){const m=twin().methods[k]||(twin().methods[k]={n:0,ok:0,latency:0});m.n++;if(ok)m.ok++;if(Number.isFinite(latency))m.latency+=latency}
function video(id,ok,latency){const m=twin().videoStats[id]||(twin().videoStats[id]={n:0,ok:0,latency:0});m.n++;if(ok)m.ok++;if(Number.isFinite(latency))m.latency+=latency}
function teaching(topic,ok,methods,snippets){
 const t=twin(),m=t.teachingMemory[topic]||(t.teachingMemory[topic]={n:0,ok:0,methods:{},last:null});m.n++;if(ok)m.ok++;m.last=new Date().toISOString();
 for(const k of methods){const z=m.methods[k]||(m.methods[k]={n:0,ok:0});z.n++;if(ok)z.ok++}
 for(const raw of snippets||[]){const s=String(raw).replace(/\s+/g,' ').trim().slice(0,240);if(s.length<18)continue;const z=t.language.snippets[s]||(t.language.snippets[s]={n:0,ok:0,topics:{}});z.n++;if(ok)z.ok++;z.topics[topic]=(z.topics[topic]||0)+1}
}
function methodUtility(k){const m=twin().methods[k];if(!m||m.n<2)return .5;const acc=(m.ok+1)/(m.n+2),speed=m.latency/m.n||45000;return acc*clamp(45000/speed,.75,1.2)}
function bestMethod(){return Object.keys(twin().methods).map(k=>({k,u:methodUtility(k),n:twin().methods[k].n})).filter(x=>x.n>=2).sort((a,b)=>b.u-a.u)[0]||null}
function bestBucket(){return Object.entries(twin().rhythm.buckets).map(([k,x])=>({k,n:x.n,score:x.n?x.ok/x.n:0,lat:median(x.latencies)})).filter(x=>x.n>=3).sort((a,b)=>b.score-a.score||(a.lat||9e9)-(b.lat||9e9))[0]||null}
function confidenceTrust(){const c=twin().confidence.confident;return c.n?c.ok/c.n:null}
function videoUtility(id){const x=twin().videoStats[id];if(!x||x.n<2)return .5;const acc=(x.ok+1)/(x.n+2),speed=x.latency/x.n||45000;return acc*clamp(45000/speed,.75,1.2)}
function bestSnippet(topic){
 const rows=Object.entries(twin().language.snippets||{}).map(([text,x])=>({text,x,topicN:x.topics?.[topic]||0,score:(x.ok+1.5)/(x.n+3)+Math.min(.08,(x.topics?.[topic]||0)*.015)})).filter(r=>r.topicN>=2&&r.x.n>=2).sort((a,b)=>b.score-a.score||b.topicN-a.topicN);
 return rows[0]||null
}
function subjectStability(){
 const out={};for(const d of C.days||[])for(const l of d.lessons||[]){const f=twin().forgetting[l.topic];if(!f)continue;(out[l.subject]||(out[l.subject]=[])).push(f.stabilityDays)}
 return Object.fromEntries(Object.entries(out).map(([k,v])=>[k,+median(v).toFixed(2)]))
}
function portableProfile(){
 const t=twin(),m=bestMethod(),b=bestBucket(),trust=confidenceTrust();
 const topLanguage=Object.entries(t.language.snippets||{}).map(([text,x])=>({text,n:x.n,accuracy:x.n?x.ok/x.n:0})).filter(x=>x.n>=2).sort((a,b)=>b.accuracy-a.accuracy||b.n-a.n).slice(0,20);
 return {schema:'intellectuality.portable-learning-profile.v1',updatedAt:new Date().toISOString(),objective:t.objective,preferences:t.preferences,focusSpanMin:+t.rhythm.focusSpanMin.toFixed(1),bestTimeWindow:b?.k||null,bestMethod:m?.k||null,confidenceTrust:trust,subjectStabilityDays:subjectStability(),topLanguage,methodStats:t.methods,videoStats:t.videoStats}
}
window.INTELLECTUALITY_TWIN={ensure,twin,persist,session,bucket,confidence,timeBucket,forgetting,personalRetention,method,video,teaching,bestMethod,bestBucket,confidenceTrust,videoUtility,bestSnippet,portableProfile,mean,median,clamp,safe};
})();