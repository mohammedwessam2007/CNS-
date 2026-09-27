#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

let passed = 0, failed = 0;
function check(id, label, ok, detail) {
  if (ok) {
    passed++;
    console.log("PASS", id, label);
  } else {
    failed++;
    console.error("FAIL", id, label, detail || "");
  }
}

class Store {
  constructor() { this.m = new Map(); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
  clear() { this.m.clear(); }
  key(i) { return [...this.m.keys()][i] || null; }
  get length() { return this.m.size; }
}

function boot(opts = {}) {
  const localStorage = opts.store || new Store();
  const listeners = {};
  const window = {
    RENAISSANCE_GENOME: {
      atoms: {
        causal:{}, mech:{}, prob:{}, counter:{}, model:{}, scale:{}, abstr:{}, compress:{},
        analogy:{}, falsify:{}, calib:{}, predict:{}, synth:{}, represent:{}, strategy:{},
        narrative:{}, taste:{}, question:{}, recomb:{}, experiment:{}, constraint:{},
        systems:{}, info:{}, judgment:{}, selfmodel:{}, measure:{}, orient:{}, minimal:{}
      },
      compounds: [
        { id:"diagnosis", name:"diagnosis", atoms:["prob","causal","question"] },
        { id:"verdict", name:"fair verdict", atoms:["narrative","prob","falsify"] }
      ]
    },
    RENAISSANCE_SEASONS: [
      { id:"s1", domain:"primitives", sessions:[
        { id:"a", domain:"medicine" },
        { id:"b", domain:"history" },
        { id:"c", domain:"business" }
      ]}
    ],
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    dispatchStorage(key) { for (const fn of listeners.storage || []) fn({key}); }
  };
  const context = {
    window,
    localStorage,
    location:{search: opts.search || ""},
    console,
    Date,
    JSON,
    Math,
    Object,
    Array,
    String,
    Number,
    Boolean,
    RegExp,
    Set,
    Map
  };
  context.globalThis = context;
  vm.createContext(context);
  const src = fs.readFileSync(path.join(__dirname, "..", "source", "public", "axis-forge-v1.js"), "utf8");
  vm.runInContext(src, context, {filename:"axis-forge-v1.js"});
  return { AF: window.AXIS_FORGE, window, localStorage };
}

// 1. boot and storage isolation
{
  const {AF, localStorage} = boot();
  check("A1", "Axis Forge boots as an isolated observer", !!AF && AF.version === "0.1" && localStorage.getItem("renaissance_v1") === null);
}

// 2. novelty firewall: old atoms and registered compounds do not become fake new faculties
{
  const {AF} = boot();
  const one = AF.novelty(["causal"]);
  const old = AF.novelty(["causal","prob","question"]);
  const fresh = AF.novelty(["abstr","judgment"]);
  check("A2", "One existing atom is rejected as novelty", !one.ok && one.code === "ATOM", one);
  check("A3", "A registered compound cannot be renamed as a new organ", !old.ok && old.code === "KNOWN_COMPOUND", old);
  check("A4", "An unregistered combination remains only a candidate, not a novelty claim", fresh.ok && fresh.code === "COMPOUND_CANDIDATE", fresh);
}

// 3. Renaissance scan is idempotent and counts only valid evidence once
{
  const {AF, window} = boot();
  const answers = [
    {t:1,sid:"a",item:"m1",kind:"transfer",ok:true,conf:"sure",hinted:false,atoms:["abstr","judgment"]},
    {t:2,sid:"b",item:"h1",kind:"far",ok:true,conf:"sure",hinted:false,atoms:["abstr","judgment"]},
    {t:3,sid:"c",item:"b1",kind:"check",ok:true,conf:"sure",hinted:false,atoms:["abstr","judgment"]}
  ];
  window.RENAISSANCE = {state:()=>({answers})};
  const x = AF.scan(), y = AF.scan();
  const c = AF.candidate("abstr+judgment");
  check("A5", "Scan ingests each Renaissance answer once", x.added === 3 && y.added === 0 && c.evidenceSummary.n === 3, {x,y,c});
  check("A6", "Only transfer-like items count as unaided evidence", c.evidenceSummary.unaidedSuccesses === 2, c.evidenceSummary);
}

// 4. stage gates require repeated cross-domain evidence
{
  const {AF} = boot();
  const domains = ["medicine","history","business"];
  for (let i=0;i<10;i++) {
    AF.observe({
      id:"rep-"+i, source:"test", taskId:"t"+i, domain:domains[i%2],
      atoms:["abstr","judgment"], success:true, unaided:true,
      aiHelp:false, heldOut:i<2, realWorld:false
    });
  }
  let c = AF.candidate("abstr+judgment");
  check("A7", "Two-domain repeated evidence reaches REPLICATED but not transferred", c.stage === "REPLICATED", c);

  for (let i=10;i<15;i++) {
    AF.observe({
      id:"xfer-"+i, source:"test", taskId:"t"+i, domain:domains[i%3],
      atoms:["abstr","judgment"], success:true, unaided:true,
      aiHelp:false, heldOut:i<12, realWorld:i>=13
    });
  }
  c = AF.candidate("abstr+judgment");
  check("A8", "Three domains + held-out + real-world evidence reaches TRANSFERRED", c.stage === "TRANSFERRED" && c.evidenceSummary.domainCount >= 3 && c.evidenceSummary.realWorldSuccesses >= 2, c);
}

// 5. promotion never self-grants authority
{
  const {AF} = boot();
  const ds=["medicine","history","business"];
  for(let i=0;i<15;i++) AF.observe({
    id:"p-"+i, taskId:"p"+i, domain:ds[i%3], atoms:["abstr","judgment"],
    success:true, unaided:true, aiHelp:false, heldOut:i<2, realWorld:i>=13
  });
  const no = AF.promote("abstr+judgment");
  const yes = AF.promote("abstr+judgment","HUMAN_APPROVED");
  check("A9", "Promotion is denied without explicit human approval", !no.ok && /approval/.test(no.why), no);
  check("A10", "Eligible transferred hypothesis can be promoted only after approval", yes.ok && yes.candidate.stage === "PROMOTED", yes);
}

// 6. AI assistance is tracked but does not inflate unaided human evidence
{
  const {AF} = boot();
  for(let i=0;i<8;i++) AF.observe({
    id:"ai-"+i,taskId:"ai"+i,domain:i%2?"history":"medicine",
    atoms:["systems","taste"],success:true,unaided:true,aiHelp:true,heldOut:true,realWorld:true
  });
  const c=AF.candidate("systems+taste");
  check("A11", "AI-assisted successes never count as unaided or real-world human evidence", c.evidenceSummary.aiAssistedSuccesses===8 && c.evidenceSummary.unaidedSuccesses===0 && c.evidenceSummary.realWorldSuccesses===0, c.evidenceSummary);
}

// 7. future-AI allocation filter
{
  const {AF} = boot();
  const boiler=AF.aiFilter({digital:1,specified:1,verifiable:1,repeatable:1,dataRich:1});
  const body=AF.aiFilter({digital:.2,specified:.4,verifiable:.5,repeatable:.2,dataRich:.2,embodiment:.95,judgment:.6});
  const lit=AF.aiFilter({digital:.4,specified:.2,verifiable:.2,repeatable:.2,dataRich:.4,culture:.95,mindTransform:.8});
  const math=AF.aiFilter({digital:.9,specified:.8,verifiable:.9,repeatable:.8,dataRich:.9,judgment:.75,mindTransform:.9,sovereignty:.7,aiComplementarity:.95});
  check("A12", "Highly specified digital routine work is OUTSOURCE", boiler.allocation==="OUTSOURCE", boiler);
  check("A13", "Embodied capability is EMBODY", body.allocation==="EMBODY", body);
  check("A14", "Irreducible cultural transformation is EXPERIENCE", lit.allocation==="EXPERIENCE", lit);
  check("A15", "Machine-strong but mind-transforming complementary capability is COEVOLVE", math.allocation==="COEVOLVE", math);
}

// 8. probe design is explicit, unaided and cross-domain
{
  const {AF} = boot();
  for(let i=0;i<6;i++) AF.observe({
    id:"q-"+i,taskId:"q"+i,domain:i%2?"history":"medicine",
    atoms:["orient","question"],success:true,unaided:true,aiHelp:false
  });
  const p=AF.probe("orient+question");
  check("A16", "Probe prescribes a genuinely new domain and no-AI attempt", !!p && p.nextTest && p.nextTest.rules.some(x=>/No AI/.test(x)) && !p.evidence.domains.includes(p.nextTest.domain), p);
}

// 9. revocation and corrupt-state recovery are first-class
{
  const {AF} = boot();
  AF.observe({id:"r1",taskId:"r1",domain:"medicine",atoms:["orient","judgment"],success:true,unaided:true});
  const rev=AF.revoke("judgment+orient","failed later transfer");
  check("A17", "A candidate can be explicitly revoked with lineage preserved", rev.ok && AF.candidate("judgment+orient").stage==="REVOKED", AF.candidate("judgment+orient"));

  const store=new Store();
  store.setItem("axis_forge_v1","{not json");
  const b=boot({store});
  const backups=[...store.m.keys()].filter(k=>k.startsWith("axis_forge_v1_corrupt_"));
  check("A18", "Corrupt state is preserved before recovery", backups.length===1 && !!b.AF.state().corruptRecoveredAt, backups);
}

// 10. kill switch means no observation
{
  const store=new Store();
  store.setItem("axis_forge_off","1");
  const {AF}=boot({store});
  const r=AF.observe({id:"off1",domain:"medicine",atoms:["abstr","judgment"],success:true,unaided:true});
  check("A19", "Kill switch prevents evidence collection", !r.ok && r.why==="off" && AF.state().events.length===0, r);
}

// 11. export/import keeps evidence portable without overwriting local promoted authority
{
  const a=boot();
  a.AF.observe({id:"e1",domain:"medicine",atoms:["abstr","judgment"],success:true,unaided:true});
  const payload=a.AF.export();
  const b=boot();
  const imp=b.AF.import(payload);
  check("A20", "Axis Forge evidence is portable through a versioned export", imp.ok && imp.eventsAdded===1 && b.AF.state().events.length===1, imp);
}

console.log("\nAxis Forge:", passed + "/" + (passed+failed), "checks passed");
if (failed) process.exit(1);
