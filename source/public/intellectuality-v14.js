/* INTELLECTUALITY v14.4 · UNDERSTAND FIRST
 *
 * Understanding-first practice MCQs, calendar truth (Africa/Cairo), the question visual genome
 * (answer-blind pre-answer routing, answer-aware post-answer routing), one anti-repeat governor
 * shared by v9/v10/v14, Egyptian micro-commands, the visual wrong-answer autopsy with a
 * reconstruction gate, the retest law, fast-lane hardening and Learning-Twin attribution.
 *
 * Architecture law: wraps backbone functions (no second calendar, mastery model or render loop).
 * All new state is namespaced in S.v14, bounded, and migrated from the v53 v14 schema without
 * reset. Held-out mocks get no primer, cue, companion or answer-derived query before submission.
 */
(function () {
  "use strict";
  if (window.INTELLECTUALITY_V14_LOADED) return;
  window.INTELLECTUALITY_V14_LOADED = true;

  const VERSION = "14.5";
  const TZ = "Africa/Cairo";
  const REG = () => window.INTELLECTUALITY_V14_REGISTRY || { commands: {}, concepts: [], contrasts: [], atlas: {} };
  const E = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const GREEK = { "α": " alpha ", "β": " beta ", "γ": " gamma ", "δ": " delta ", "κ": " kappa ", "μ": " mu ", "θ": " theta ", "ε": " epsilon " };
  const norm = (s) =>
    String(s || "")
      .replace(/[αβγδκμθε]/g, (c) => GREEK[c])
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const safe = (fn, f = null) => {
    try {
      return fn();
    } catch (e) {
      console.warn("[v14]", e);
      return f;
    }
  };
  const STOP = new Set(
    "what which where when why how whose whom is are was were be been being a an the of in on at by for from to with without and or not except following true false incorrect correct best most least regarding about into through during between among as than this that these those it its their his her can could would should may might do does did has have had all any each one two three four five statement statements select choose concerning show shows also its".split(" "),
  );
  const GENERIC = new Set("cell cells fiber fibers fibre fibres structure structures part parts area areas region regions tissue type types form forms formed called known found present located lies contain contains containing human body nerve nerves level".split(" "));
  const SHORT_OK = /^(i[ab]|ii|iv|vi|v[123]|[ctls]\d{1,2}|\d+)$/;
  // Verbs/prepositions that almost never carry the answer; excluded from the leak/mask token sets.
  const MASK_STOP = new Set("around send give take form forme formed attach attache attached pass passe passing lie run reach end begin carry carrie make lead contain include arise arising between through within along near into onto upon over under via only both either same other than then also well very more less".split(" "));
  const lite = (w) => (w.length > 4 ? w.replace(/ies$/, "y").replace(/([^s])s$/, "$1") : w);
  function tokens(s, keepGeneric = true) {
    return [...new Set(norm(s).split(" ").filter((w) => w && (w.length > 2 || SHORT_OK.test(w)) && !STOP.has(w) && (keepGeneric || !GENERIC.has(w))))];
  }
  const liteSet = (arr) => new Set(arr.map(lite));
  function overlapN(arr, set) {
    let n = 0;
    for (const w of arr) if (set.has(w) || set.has(lite(w))) n++;
    return n;
  }
  function sentences(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .replace(/([.!?])\s+(?=[A-Z0-9(“"'])/g, "$1\u0001")
      .split("\u0001")
      .map((x) => x.trim())
      .filter((x) => x.length >= 25);
  }
  function short(s, n = 170) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    if (s.length <= n) return s;
    const cut = s.slice(0, n);
    const i = Math.max(cut.lastIndexOf("; "), cut.lastIndexOf(", "), cut.lastIndexOf(" — "));
    return (i > n * 0.55 ? cut.slice(0, i) : cut.replace(/\s+\S*$/, "")) + "…";
  }
  function capMap(m, n, by) {
    const ks = Object.keys(m || {});
    if (ks.length <= n) return;
    ks.sort((a, b) => by(m[a]) - by(m[b]))
      .slice(0, ks.length - n)
      .forEach((k) => delete m[k]);
  }
  const gkey = (t) => String(t || "").replace(/^File:/i, "").replace(/_/g, " ").trim().toLowerCase();
  const cleanTitle = (t) => String(t || "").replace(/^File:/i, "").replace(/_/g, " ").replace(/\.(png|jpe?g|svg|gif|webp|tiff?)$/i, "");

  /* ───────────────────────── state ───────────────────────── */
  let saveTimer = null;
  function persistSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => safe(() => save()), 450);
  }
  const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  const SHAPE = { primed: {}, pins: {}, qa: {}, vh: [], vc: {}, feed: {}, calendar: {}, ledger: [], vstats: {}, preds: {}, parked: [], auto: [] };
  const checked = new WeakSet();
  function sanitize(v) {
    // A hand-edited, truncated or foreign-version slice must never crash teaching: reset only the
    // fields whose type is wrong, keep everything that is well-formed.
    for (const [k, d] of Object.entries(SHAPE)) if (Array.isArray(d) ? !Array.isArray(v[k]) : !isObj(v[k])) v[k] = Array.isArray(d) ? [] : {};
    if (!isObj(v.stats)) v.stats = {};
    for (const k of ["mod", "cmd", "depth", "teacher", "repairCmd"]) if (!isObj(v.stats[k])) v.stats[k] = {};
    if (!Number.isFinite(v.seq)) v.seq = 1;
    checked.add(v);
  }
  function V() {
    if (!isObj(S.v14)) S.v14 = {};
    const v = S.v14;
    if (v.schema !== 2) migrate(v);
    else if (v.visualAssignments) {
      // A rollback to v53 and back re-adds its answer-derived assignment fields; drop them again.
      delete v.visualAssignments;
      delete v.visualUsed;
      delete v.visualRecent;
      v.version = VERSION;
    }
    if (!checked.has(v)) sanitize(v);
    return v;
  }
  function migrate(v) {
    // v53 frontier schema → schema 2. Evidence lives in v12/v13 and is untouched. Legacy visual
    // assignments were answer-derived (pre-answer leakage) and bulky, so they are dropped; recent-use
    // signals are carried into the governor so anti-repeat has continuity.
    const primed = {};
    for (const [k, x] of Object.entries(isObj(v.primed) ? v.primed : {})) primed[k] = typeof x === "number" ? x : 0;
    const vc = {};
    Object.entries(isObj(v.visualUsed) ? v.visualUsed : {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 150)
      .forEach(([t, n]) => (vc[gkey(t)] = { n: Math.min(10, Number(n) || 1), cs: [], l: 0 }));
    const vh = (Array.isArray(v.visualRecent) ? v.visualRecent : []).slice(-14).map((t) => [gkey(t), 0, "legacy", "", "", ""]);
    const legacy = { from: v.version || "14.0", droppedAssignments: Object.keys(isObj(v.visualAssignments) ? v.visualAssignments : {}).length, primersSeen: v.stats?.primersSeen || 0, migratedAt: new Date().toISOString() };
    for (const k of Object.keys(v)) delete v[k];
    Object.assign(v, {
      version: VERSION,
      schema: 2,
      primed,
      pins: {},
      qa: {},
      vh,
      vc,
      seq: 1,
      feed: {},
      calendar: {},
      ledger: [],
      stats: { mod: {}, cmd: {}, depth: {}, teacher: {}, repairCmd: {} },
      vstats: {},
      preds: {},
      parked: [],
      auto: [],
      legacy,
    });
  }

  /* ───────────────────────── calendar truth ───────────────────────── */
  const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const WD = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  function cairoYMD(d = new Date()) {
    try {
      const p = {};
      for (const x of new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d)) p[x.type] = x.value;
      if (p.year && p.month && p.day) return p.year + "-" + p.month + "-" + p.day;
    } catch (_) {}
    const z = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  }
  function fmtDay(ymd, title = false) {
    const [y, m, d] = String(ymd).split("-").map(Number);
    if (!y || !m || !d) return String(ymd || "");
    const wd = WD[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
    const cap = (s) => s.charAt(0) + s.slice(1).toLowerCase();
    return title ? cap(wd) + " " + d + " " + cap(MON[m - 1]) : wd + " " + d + " " + MON[m - 1];
  }
  function planDayFor(ymd) {
    const days = C.days || [];
    if (!days.length) return 1;
    if (ymd < days[0].date) return 0;
    let best = 1;
    for (const d of days) {
      if (d.date <= ymd) best = d.day;
      else break;
    }
    return best;
  }
  function trulyFresh() {
    const segs = Object.values(S.segments || {}).filter(Boolean).length;
    return !(S.doneDays || []).length && !segs && !Object.keys(S.qbank?.results || {}).length && !(S.xp > 0) && !Object.keys(S.errors || {}).length;
  }
  function dayGreen(d) {
    return !!d && safe(() => dayProgress(d), 0) >= 100 && !(safe(() => unresolved(), []) || []).some((e) => e.day <= d.day);
  }
  function syncCalendar() {
    const v = V(),
      cal = v.calendar || (v.calendar = {}),
      today = cairoYMD(),
      plan = planDayFor(today);
    if (!cal.firstRun && trulyFresh()) cal.firstRun = { date: today, planDay: Math.max(1, plan), atDay: S.day };
    // The clock may move the plan; it may never delete teaching. Advance only through days that are
    // already certified or whose required evidence is fully green (the same gate as CERTIFY).
    let moved = false,
      guard = 0;
    while (plan > S.day && S.day < C.days.length && guard++ < 200) {
      const d = C.days[S.day - 1];
      if ((S.doneDays || []).includes(S.day)) {
        S.day++;
        moved = true;
        continue;
      }
      if (dayGreen(d)) {
        S.doneDays.push(S.day);
        S.day++;
        S.xp = (S.xp || 0) + 20;
        S.blockStart = Date.now();
        (v.auto || (v.auto = [])).push({ day: d.day, at: new Date().toISOString() });
        v.auto = v.auto.slice(-30);
        moved = true;
        continue;
      }
      break;
    }
    const debt = plan > 0 ? Math.max(0, plan - S.day) : 0,
      ahead = plan > 0 ? Math.max(0, S.day - plan) : 0,
      fr = cal.firstRun,
      catchUp = !!(fr && debt > 0 && fr.planDay > (fr.atDay || 1) && S.day < fr.planDay);
    Object.assign(cal, {
      today,
      planDay: plan,
      workDay: S.day,
      debt,
      ahead,
      mode: plan === 0 ? "precourse" : debt > 0 ? (catchUp ? "catchup" : "carryover") : ahead > 0 ? "ahead" : "today",
      syncedAt: new Date().toISOString(),
    });
    if (moved) persistSoon();
    return cal;
  }
  function chipText(cal) {
    const base = "TODAY · " + fmtDay(cal.today),
      s = (n) => (n === 1 ? "" : "S");
    if (cal.mode === "carryover") return base + " · " + cal.debt + " DAY" + s(cal.debt) + " CARRYOVER";
    if (cal.mode === "catchup") return base + " · FIRST-RUN CATCH-UP";
    if (cal.mode === "ahead") return base + " · " + cal.ahead + " DAY" + s(cal.ahead) + " AHEAD";
    if (cal.mode === "precourse") return base + " · COURSE STARTS " + fmtDay(C.days[0].date);
    return base;
  }
  function calendarBannerHTML(cal) {
    const d = safe(() => day(), null);
    if (!d || !(cal.mode === "carryover" || cal.mode === "catchup")) return "";
    const mins = safe(() => remainingMinutes(d), null),
      work = fmtDay(d.date, true),
      today = fmtDay(cal.today, true);
    const txt =
      cal.mode === "catchup"
        ? "Today is " + today + ". The course plan began " + fmtDay(C.days[0].date, true) + "; you are starting today, so Day " + d.day + " (" + work + ") runs first as deliberate catch-up — nothing is skipped — and Day " + cal.planDay + " follows."
        : "Today is " + today + ". This is unfinished " + work + " work, carried forward deliberately" + (cal.debt > 1 ? " (" + cal.debt + " days behind plan)" : "") + ".";
    return (
      '<div class="v14Carryover" role="status"><b>' +
      (cal.mode === "catchup" ? "FIRST-RUN CATCH-UP · REAL DATE KEPT" : "CARRYOVER · REAL DATE KEPT") +
      "</b><span>" +
      E(txt) +
      (Number.isFinite(mins) ? " <em>~" + mins + " planned min in unfinished Day " + d.day + " steps.</em>" : "") +
      "</span></div>"
    );
  }
  function dateTick() {
    if (cairoYMD() !== V().calendar?.today) {
      syncCalendar();
      safe(() => render());
    }
  }

  /* ───────────────────────── corpus & question model ───────────────────────── */
  const qCache = new Map();
  function lessonById(id) {
    for (const d of C.days || []) for (const l of d.lessons || []) if (l.id === id) return l;
    return null;
  }
  const prof = (l) => window.INTELLECTUALITY_PROFESSOR?.[l?.id] || {};
  const deep = (l) => window.INTELLECTUALITY_DEEP?.[l?.id]?.deep || [];
  const lessonTok = new Map();
  function lessonTokens(l) {
    if (!l) return new Set();
    if (!lessonTok.has(l.id)) {
      const p = prof(l);
      lessonTok.set(l.id, liteSet(tokens([l.topic, l.mental, (l.facts || []).map((f) => f.join(" ")).join(" "), (p.teach || []).join(" "), p.mental, deep(l).join(" ")].join(" "))));
    }
    return lessonTok.get(l.id);
  }
  function lessonForQ(q, fallback = null) {
    // Answer-blind: stem + chapter only.
    const ls = [...new Set(q?.lessonIds || [])].map(lessonById).filter(Boolean);
    if (!ls.length) return fallback;
    if (ls.length === 1) return ls[0];
    const t = tokens((q.stem || "") + " " + (q.chapter || ""));
    return ls.map((l) => ({ l, s: overlapN(t, lessonTokens(l)) * 3 + overlapN(tokens(l.topic), liteSet(t)) * 5 })).sort((a, b) => b.s - a.s)[0].l;
  }
  function findQ(id) {
    if (!id) return null;
    if (qCache.has(id)) return qCache.get(id);
    let q = (QB.questions || []).find((x) => x.id === id) || null;
    if (!q)
      for (const d of C.days || [])
        for (const l of d.lessons || []) {
          const g = (l.questions || []).find((x) => x.id === id);
          if (g) q = genQ(g, l);
        }
    qCache.set(id, q);
    return q;
  }
  function genQ(g, l) {
    const opts = (g.choices || []).map((t, i) => ({ key: "abcdefgh"[i], text: t }));
    const k = opts.find((o) => o.text === g.answer)?.key;
    return { id: g.id, stem: g.prompt, subject: l.subject, chapter: l.topic, courseTopic: l.topic, lessonIds: [l.id], options: opts, answerKeys: k ? [k] : [], answerText: g.answer, dimension: g.dimension, failureType: g.failureType, generated: true, split: g.heldOut ? "heldout" : "practice" };
  }
  const keyText = (q) => (q?.answerKeys || []).map((k) => q.options?.find((o) => o.key === k)?.text || "").join(" ").trim() || q?.answerText || "";
  const optText = (q, k) => q?.options?.find((o) => o.key === k)?.text || "";
  const peMeta = (q) => window.NEU205_PATTERN?.questionMeta?.[q?.id] || {};
  function isNegation(q) {
    const m = peMeta(q);
    if (typeof m.negation === "boolean" && !q?.generated) return m.negation;
    return /\bexcept\b|\ball (of )?the following\b.*\bexcept\b|\bfalse\b|\bincorrect\b|\bnot (true|correct)\b|\bwrong\b/i.test(q?.stem || "");
  }
  function guardModel(q) {
    // The key is used ONLY as a negative filter (mask/demote), never to query, select or rank up.
    const stemT = liteSet(tokens(q?.stem || ""));
    const keyT = tokens(keyText(q), false).map(lite);
    const dist = (q?.options || []).filter((o) => !(q.answerKeys || []).includes(o.key)).map((o) => o.text);
    const distT = liteSet(dist.flatMap((t) => tokens(t, false)));
    const A = new Set(keyT.filter((w) => !stemT.has(w) && !distT.has(w) && !MASK_STOP.has(w)));
    return {
      A,
      aNeed: Math.max(1, Math.ceil(A.size * 0.5)),
      D: new Set([...distT].filter((w) => !stemT.has(w) && !keyT.includes(w) && !MASK_STOP.has(w))),
      stemT,
      keyNorm: norm(keyText(q)),
      negation: isNegation(q),
    };
  }
  function aHits(text, g) {
    let n = 0;
    for (const w of new Set(tokens(text).map(lite))) if (g.A.has(w)) n++;
    return n;
  }
  function leaks(text, g) {
    // A text leaks when it carries at least half of the key's distinctive words, or the exact key phrase.
    if (!g || !text) return false;
    if (g.A.size && aHits(text, g) >= g.aNeed) return true;
    return g.keyNorm.split(" ").length >= 2 && norm(text).includes(g.keyNorm);
  }
  function maskPhrase(text, g) {
    const words = g.keyNorm.split(" ").filter(Boolean);
    if (words.length < 2 || !norm(text).includes(g.keyNorm)) return null;
    const re = new RegExp(words.map((w) => w.replace(/[^a-z0-9]/g, "")).join("[^A-Za-z0-9]+"), "i");
    const out = String(text).replace(re, "▢▢▢");
    return out === text ? null : { text: out, masked: 1 };
  }
  function maskText(text, g, label = false) {
    // Cloze: answer-distinctive words become a prediction gap. Returns null when too little is left.
    if (!g) return { text, masked: 0 };
    const ph = maskPhrase(text, g);
    if (ph) text = ph.text;
    if (!g.A.size) return { text, masked: ph ? 1 : 0 };
    let masked = 0,
      content = 0;
    const out = String(text)
      .split(/(\s+)/)
      .map((w) => {
        const parts = norm(w).split(" ").filter(Boolean);
        if (!parts.length) return w;
        if (parts.some((x) => g.A.has(lite(x)) && !MASK_STOP.has(lite(x)))) {
          masked++;
          const m = w.match(/^([^A-Za-z0-9αβγδκμθε]*)[\s\S]*?([^A-Za-z0-9αβγδκμθε]*)$/);
          return (m ? m[1] : "") + "▢▢▢" + (m ? m[2] : "");
        }
        if (parts.some((x) => x.length > 2)) content++;
        return w;
      })
      .join("")
      .replace(/▢▢▢(\s+▢▢▢)+/g, "▢▢▢");
    if (!label && masked && content < masked * 1.5) return null;
    return { text: out, masked: masked + (ph ? 1 : 0) };
  }

  /* ───────────────────────── intents, concepts, commands ───────────────────────── */
  const INTENTS = {
    identify: { label: "IDENTIFY THE STRUCTURE", look: "Find the structure first, then name the one feature that makes it unmistakable.", cmd: "build", fam: "ana" },
    orient: { label: "ORIENT · LEVEL · SURFACE", look: "Orient before naming: anterior/posterior, superior/inferior, which level.", cmd: "orient", fam: "ana" },
    relation: { label: "RELATIONS", look: "Trace what surrounds it: in front, behind, medial, lateral.", cmd: "relations", fam: "ana" },
    route: { label: "ROUTE · COURSE", look: "Follow the course: origin → opening or passage → destination.", cmd: "route", fam: "ana" },
    blood: { label: "BLOOD SUPPLY", look: "Trace the vessel: trunk → branch → territory.", cmd: "supply", fam: "ana" },
    innervation: { label: "INNERVATION", look: "Trace the nerve: nucleus/root → course → target.", cmd: "nerve", fam: "ana" },
    tract: { label: "TRACT · CROSSING", look: "Walk the pathway: first neuron → synapse → crossing → destination.", cmd: "path", fam: "tract" },
    lesion: { label: "LESION LOCALIZATION", look: "Mark the damaged spot, then shade what it disconnects.", cmd: "lesion", fam: "ana" },
    territory: { label: "TERRITORY · DEFICIT", look: "Shade the territory this vessel feeds, then predict what goes dark.", cmd: "deficit", fam: "ana" },
    histo: { label: "HISTOLOGIC RECOGNITION", look: "Silhouette → architecture → the three features you would point at.", cmd: "tissue", fam: "histo" },
    histo_lookalike: { label: "HISTOLOGIC LOOK-ALIKE", look: "Put it beside its nearest mimic: which single feature separates them?", cmd: "lookalike", fam: "histo" },
    mechanism: { label: "PHYSIOLOGY MECHANISM", look: "Run it: what starts it, what carries it, what comes out.", cmd: "mech", fam: "phys" },
    graph: { label: "VARIABLE CHANGE", look: "Read the variables: what rises, what falls, and what flips the direction.", cmd: "perturb", fam: "phys" },
    receptor: { label: "RECEPTOR · TRANSDUCTION", look: "Stimulus → receptor → signal: where is energy converted?", cmd: "start", fam: "phys" },
    embryo: { label: "EMBRYOLOGIC SEQUENCE", look: "Sequence first: what forms, from what, and in which order.", cmd: "build", fam: "ana" },
    spotter: { label: "PRACTICAL SPOTTER", look: "Orient the image, then decide from one visible structure.", cmd: "giveaway", fam: "ana" },
  };
  function classifyIntent(q, l) {
    const s = norm((q?.stem || "") + " " + (q?.chapter || "")),
      sub = q?.subject || l?.subject,
      m = peMeta(q);
    if (q?.visualData || q?.requiresVisual) return "spotter";
    if (/embryo|\bdevelopment(al)?\b|neural tube|neural crest|derived from|derivative|embryologic(al)? origin|\balar\b|basal plate|brain vesicle|primary vesicle|secondary vesicle/.test(s)) return "embryo";
    if (/lesion|injur|damage|\bcut\b|transect|hemisect|syndrome|paraly|palsy|deficit|loss of|hemipleg|parapleg|ataxia|aphasi|blindness|hemianop|deaf|anosmia|compress|tumou?r|infarct|occlu|thromb|haemorrh|hemorrh/.test(s))
      return /arter|infarct|occlu|thromb|haemorrh|hemorrh|supply/.test(s) ? "territory" : "lesion";
    if (/tract|pathway|lemnisc|decussat|\bcross|fascicul|column|ascend|descend|relay/.test(s)) return "tract";
    if (sub === "HISTOLOGY") return /differ|distinguish|versus|\bvs\b|unlike|compared|except|characteri[sz]ed|all of the following/.test(s) || m.archetype === "structural-discrimination" ? "histo_lookalike" : "histo";
    if (/arter|\bvein|venous|blood supply|supplied by|drain|sinus|capillar/.test(s)) return "blood";
    if (/innervat|nerve supply|supplied by .*nerve|motor supply|sensory supply|branch of|secretomotor/.test(s)) return "innervation";
    if (sub === "PHYSIOLOGY") {
      if (/receptor|transduc|adapt|stimulus|generator|receptor potential/.test(s)) return "receptor";
      if (/increase|decrease|\brise|\bfall|curve|graph|amplitude|frequenc|velocity|\brate\b|summation|potential|wave|\beeg\b/.test(s)) return "graph";
      return "mechanism";
    }
    if (/course|passes|pass through|travers|exit|enter|foram|leaves|emerg|pierc|runs|opens into|through/.test(s)) return "route";
    if (/relation|related|anterior to|posterior to|medial to|lateral to|deep to|superficial to|between|separat|content|boundar|contain|bounded/.test(s)) return "relation";
    if (/surface|section|aspect|level|border|situated|position|extend|ends? at|terminat|lies at/.test(s)) return "orient";
    return "identify";
  }
  const VISUALTYPE_CONCEPT = { spinal: "spinal_xs", synapse: "synapse", brainstem: "brainstem", pathway: "tract_sensory", reflex: "reflexes", vision: "visual_path", eye: "eye_globe", ear: "cochlea", cerebellum: "cerebellum", ventricle: "ventricles_csf", brain: "cortex_surface", cranialnerve: "cranial_nerves", skull: "cranial_base", headneck: "neck", vessel: "cerebral_arteries", embryo: "embryo_neural" };
  let conceptsPrepared = false;
  function prepConcepts() {
    if (conceptsPrepared) return;
    for (const c of REG().concepts) {
      c.reg = new RegExp(c.re.source, "g");
      c.tok = liteSet(tokens(c.label + " " + (c.kw || []).join(" "), false));
      // Optional triggers: a curated file or category can name the stems it is for ([name, mod, trigger] / [name, trigger]).
      c._files = (c.files || []).map((f) => ({ f: f[0], m: f[1], re: f[2] ? new RegExp(f[2]) : null }));
      c._cats = (c.cats || []).map((x) => (Array.isArray(x) ? { name: x[0], re: new RegExp(x[1]) } : { name: x, re: null }));
      c._not = c.not ? new RegExp(c.not) : null; // stems that share a word but belong elsewhere (e.g. micturition "reflex")
    }
    conceptsPrepared = true;
  }
  function detectConcepts(text, subject, chapter = "") {
    // Stem hits count double over chapter hits; longer (more specific) phrase matches weigh more.
    prepConcepts();
    const t = norm(text),
      ch = norm(chapter),
      out = [];
    const score = (m, w) => (m || []).reduce((z, x) => z + w * (1 + Math.min(20, x.length) / 20), 0);
    for (const c of REG().concepts) {
      if (c.subj && subject && !c.subj.includes(subject)) continue;
      const s = 2 * score(t.match(c.reg), c.w || 1) + (ch ? score(ch.match(c.reg), c.w || 1) : 0);
      if (s) out.push({ c, s });
    }
    return out.sort((a, b) => b.s - a.s).map((x) => x.c);
  }
  function conceptsForQ(q, l, strict = false) {
    // Pre-answer and post-answer both start answer-blind (stem + chapter → lesson topic → lesson visual type).
    // strict (question visuals): a multi-topic lesson title is only used when it names ONE concept, and the
    // coarse lesson visual type is not used — no question-specific concept means no question visual.
    const sub = q?.subject || l?.subject,
      ns = norm(q?.stem || ""),
      ok = (c) => !c._not || !c._not.test(ns);
    let list = detectConcepts(q?.stem || "", sub, q?.chapter || "").filter(ok);
    if (!list.length && l) {
      const tl = detectConcepts(l.topic, sub).filter(ok);
      if (!strict || tl.length === 1) list = tl;
    }
    if (!list.length && l?.visualType && !strict) {
      const c = REG().concepts.find((x) => x.k === VISUALTYPE_CONCEPT[l.visualType]);
      if (c && ok(c)) list = [c];
    }
    return list;
  }
  function command(id, overrideCue) {
    const c = REG().commands[id] || REG().commands.build || { ar: "كوّن الصورة", en: "Build the picture", cue: "" };
    return { id, ar: c.ar, en: c.en, cue: overrideCue || c.cue };
  }
  function preCommand(q, l) {
    if (isNegation(q)) return command("core", "السؤال بيقول EXCEPT/NOT: اختبر كل اختيار عالموديل، واللي مايمشيش هو الإجابة.");
    return command(INTENTS[classifyIntent(q, l)]?.cmd || "build");
  }
  function commandHTML(c, extra = "") {
    return '<div class="v14Command ' + extra + '" data-v14-cmd="' + E(c.id) + '"><span class="v14Ar" lang="ar" dir="rtl">' + E(c.ar) + "</span><b>" + E(c.en) + '</b><small class="v14Cue" lang="ar" dir="rtl">' + E(c.cue) + "</small></div>";
  }
  const EXAM_MOVES = {
    "polarity-exception": "Kasr flips polarity here: lock the EXCEPT/NOT first, then test every option against the model — the one that breaks it is the answer.",
    "supply-innervation-branch": "They swap sibling branches: name the parent trunk → the branch → its territory, then reject the siblings.",
    "clinical-localization": "They give a deficit: localize first (side → level → structure), then predict the whole picture.",
    "clinical-perturbation": "They perturb one step: translate the vignette into the mechanism, then follow the chain to the sign.",
    "relations-contents-route": "They test position: orient, then place each option relative to the landmark.",
    "structural-discrimination": "They offer look-alikes: hold the one decisive discriminator before you read the options.",
    "mechanism-causality": "They test direction: input → mechanism → output; watch increase/decrease and excite/inhibit.",
    "direct-function-property": "One function or property: derive it from what the structure is built to do, not from sentence memory.",
    "direct-structure-fact": "One anatomical fact: place it on the map (level, side, relation) before answering.",
    "layer-lining-relation": "Layers and linings: build them in order from outside in, then name the one asked.",
    "visual-identification": "Identify from the image: orient, then use the decisive visible feature.",
    "structure-function": "Structure ↔ function: say what the structure is built to do.",
  };
  function examMove(q) {
    const m = peMeta(q);
    if (isNegation(q)) return EXAM_MOVES["polarity-exception"];
    return EXAM_MOVES[m.archetype] || (q?.subject === "PHYSIOLOGY" ? EXAM_MOVES["mechanism-causality"] : q?.subject === "HISTOLOGY" ? EXAM_MOVES["structural-discrimination"] : EXAM_MOVES["direct-structure-fact"]);
  }
  const MOVIES = {
    ANATOMY: [
      ["ORIENT", /orient|posterior|anterior|surface|level|lies|located|position|extend|section|vertebra|cross section|foramen magnum/i, "Place it: anterior/posterior, superior/inferior, which level."],
      ["RELATIONS", /relat|between|surround|contain|bound|medial|lateral|adjacent|deep|superficial|continuous|around/i, "Name what surrounds it on each side."],
      ["ROUTE · SUPPLY · NERVE", /arter|suppl|nerve|innervat|drain|branch|pass|course|foram|root|vein|sinus/i, "Trace its supply and nerve, or what passes through it."],
      ["LESION", /lesion|injur|damage|deficit|loss|palsy|syndrome|paraly|weak|clinical|puncture|block|compress/i, "Cut one link: what fails, on which side?"],
    ],
    PHYSIOLOGY: [
      ["INPUT → SENSOR", /stimul|receptor|input|sensor|detect|afferent|transduc|signal|arriv/i, "What starts it, and what senses it?"],
      ["MECHANISM", /channel|\bion|release|bind|depolari|mechanism|conduct|synap|messenger|calcium|potential|current/i, "Which step converts the input into a response?"],
      ["OUTPUT → FEEDBACK", /output|response|effect|feedback|inhibit|contract|result|efferent|motor/i, "What comes out, and what switches it off?"],
      ["PERTURB IT", /\bif\b|\bwhen\b|lesion|block|drug|increase|decrease|loss|disease|damage|without/i, "Change one variable: what moves next?"],
    ],
    HISTOLOGY: [
      ["SILHOUETTE", /shape|large|small|round|star|flask|pseudounipolar|multipolar|appear|look|size/i, "Overall shape and size at low power."],
      ["ARCHITECTURE", /layer|arrang|surround|sheath|capsule|fascic|cluster|\brow|lamina|lined|wrap/i, "How the cells are arranged and wrapped."],
      ["3 DISCRIMINATORS", /unlike|whereas|versus|distinguish|contrast|while|\bbut\b|instead|characteristic|\bonly\b|each/i, "Three features you would point at."],
      ["LOOK-ALIKE → FUNCTION", /function|role|serve|support|produc|secret|myelinat|barrier|protect|guide|remov/i, "Reject the nearest mimic, then state the function."],
    ],
    TRACT: [
      ["START", /receptor|origin|arise|cell bod|first order|ganglion|cortex|afferent/i, "Where does the first neuron start?"],
      ["SYNAPSE", /synap|relay|nucle|second order|third order|dorsal horn|thalam/i, "Where is the first synapse?"],
      ["CROSSING", /cross|decussat|commissure|contralateral|ipsilateral|arcuate/i, "Where does it cross?"],
      ["DESTINATION → LESION", /cortex|terminat|destination|lesion|loss|deficit|ends/i, "Where does it end, and which side fails after a lesion?"],
    ],
  };

  /* ───────────────────────── mastery tier, fast lane ───────────────────────── */
  function topicOf(l, q) {
    return l?.topic || q?.courseTopic || "";
  }
  function posterior(topic) {
    return safe(() => window.INTELLECTUALITY_V12?.posterior?.(topic), 0) || 0;
  }
  function highPriorityOpen(topic) {
    return (safe(() => unresolved(), []) || []).some((e) => e.topic === topic && (e.confidence === "confident" || (e.priority || 0) >= 2));
  }
  function tier(l, q) {
    const topic = topicOf(l, q),
      r = S.v12?.mastery?.[topic],
      p = posterior(topic),
      mem = S.memory?.[topic];
    if (r && r.n >= 4 && p >= 0.82 && mem && mem.n >= 3 && !highPriorityOpen(topic)) return "owned";
    if (r && r.n >= 2 && p >= 0.6) return "developing";
    return "fresh";
  }
  function primerDepth(l, q) {
    const t = tier(l, q);
    if (t === "owned") return "T";
    if (t === "developing") {
      const st = V().stats.depth,
        F = st.F,
        Cc = st.C;
      // Evidence-gated: only reverse the default when this learner's own data says deeper helps.
      if (F && Cc && F.n >= 8 && Cc.n >= 8 && (F.ok + 1) / (F.n + 2) - (Cc.ok + 1) / (Cc.n + 2) >= 0.15) return "F";
      return "C";
    }
    return "F";
  }
  function lessonSeenBefore(l) {
    if (!l) return false;
    const re = new RegExp("^d(\\d+):" + l.id + ":s\\d+$");
    for (const [k, v] of Object.entries(S.segments || {})) {
      const m = v && k.match(re);
      if (m && Number(m[1]) !== S.day) return true;
    }
    const today = cairoYMD();
    return (S.v12?.evidence || []).some((ev) => ev.topic === l.topic && ev.at && cairoYMD(new Date(ev.at)) < today);
  }
  function canFastLane(l) {
    if (!l) return false;
    const r = S.v12?.mastery?.[l.topic],
      mem = S.memory?.[l.topic];
    return !!(r && r.n >= 4 && posterior(l.topic) >= 0.82 && mem && mem.n >= 3 && !highPriorityOpen(l.topic) && lessonSeenBefore(l) && !S.mock?.active);
  }

  /* ───────────────────────── network: queue, timeouts, caches ───────────────────────── */
  const NET = { active: 0, max: 2, wait: [], mem: new Map() };
  const LS_KEY = "intellectuality_v14_vcache_v1",
    LS_TTL = 14 * 864e5,
    LS_MAX = 160;
  let lsCache = null,
    lsTimer = null;
  function lsLoad() {
    if (lsCache) return lsCache;
    try {
      lsCache = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    } catch (_) {}
    if (!lsCache || typeof lsCache !== "object") lsCache = {};
    return lsCache;
  }
  function lsGet(k) {
    const c = lsLoad(),
      x = c[k];
    if (!x) return null;
    if (Date.now() - x.t > LS_TTL) {
      delete c[k];
      return null;
    }
    return x.d;
  }
  function lsPut(k, d) {
    const c = lsLoad();
    c[k] = { t: Date.now(), d };
    const ks = Object.keys(c);
    if (ks.length > LS_MAX)
      ks.sort((a, b) => c[a].t - c[b].t)
        .slice(0, ks.length - LS_MAX)
        .forEach((x) => delete c[x]);
    clearTimeout(lsTimer);
    lsTimer = setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(c));
      } catch (_) {}
    }, 800);
  }
  function netData(url, transform = (x) => x) {
    // Global concurrency cap (2), 7 s abort, in-memory promise cache, compact local cache.
    if (NET.mem.has(url)) return NET.mem.get(url);
    const hit = lsGet(url);
    if (hit) {
      const p = Promise.resolve(hit);
      NET.mem.set(url, p);
      return p;
    }
    const p = new Promise((resolve, reject) => {
      const run = async () => {
        NET.active++;
        const ac = typeof AbortController !== "undefined" ? new AbortController() : null,
          t = setTimeout(() => ac && ac.abort(), 7000);
        try {
          const r = await fetch(url, ac ? { signal: ac.signal } : undefined);
          if (!r.ok) throw new Error("http_" + r.status);
          const d = transform(await r.json());
          lsPut(url, d);
          resolve(d);
        } catch (e) {
          NET.mem.delete(url);
          reject(e);
        } finally {
          clearTimeout(t);
          NET.active--;
          const n = NET.wait.shift();
          if (n) n();
        }
      };
      if (NET.active < NET.max) run();
      else NET.wait.push(run);
    });
    NET.mem.set(url, p);
    return p;
  }
  const API = "https://commons.wikimedia.org/w/api.php?";
  const II = "&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiextmetadatafilter=LicenseShortName|Artist&iiurlwidth=900&format=json&origin=*";
  const urlFiles = (files) => API + "action=query&titles=" + encodeURIComponent(files.map((f) => "File:" + f).join("|")) + II;
  const urlSearch = (q, n = 12) => API + "action=query&generator=search&gsrsearch=" + encodeURIComponent(q) + "&gsrnamespace=6&gsrlimit=" + n + II;
  const stripTags = (s) => String(s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  function commonsRows(j) {
    return Object.values(j?.query?.pages || {})
      .map((p) => {
        const ii = p.imageinfo?.[0] || {},
          em = ii.extmetadata || {};
        return { title: p.title || "", thumb: ii.thumburl || "", page: ii.descriptionurl || "", license: stripTags(em.LicenseShortName?.value), artist: stripTags(em.Artist?.value).slice(0, 70), mime: ii.mime || "", w: ii.width || 0, h: ii.height || 0, missing: "missing" in p || !ii.thumburl };
      })
      .filter((x) => x.title);
  }
  // Shared adapter so v9/v10 lookups join the same queue and cache.
  window.INTELLECTUALITY_V14_NET = { json: (url) => netData(url), rows: (url) => netData(url, commonsRows) };

  /* ───────────────────────── anti-repeat governor (v9 + v10 + v14) ───────────────────────── */
  const G = (function () {
    let screenKey = "",
      seq = 0,
      shown = new Set(),
      v10count = 0,
      v10fetch = 0,
      videos = new Set();
    const session = Date.now().toString(36);
    const hist = () => V().vh || (V().vh = []);
    function beginRender(key) {
      shown = new Set();
      v10count = 0;
      v10fetch = 0;
      videos = new Set();
      const v = V();
      if (key !== screenKey) {
        screenKey = key;
        v.seq = (v.seq || 0) + 1;
      }
      seq = v.seq || 1;
    }
    function penalty(k, ctx = {}) {
      if (!k || ctx.source) return 0;
      if (shown.has(k)) return 1e4;
      let p = 0;
      const today = cairoYMD();
      for (const e of hist()) {
        if (e[0] !== k) continue;
        const ds = seq - e[1];
        if (ds === 0) continue;
        if (ds === 1) p += 100;
        else if (ds <= 5) p += 40;
        if (e[2] === session) p += 25;
        else if (e[3] === today) p += 12;
      }
      const vc = V().vc?.[k];
      if (vc) {
        if ((vc.cs || []).filter((c) => c && c !== ctx.concept).length >= 2) p += 30;
        p += Math.min(10, vc.n || 0);
      }
      const last = hist().slice(-3).map((e) => e[4]);
      if (ctx.modality && last.length === 3 && last.every((m) => m === ctx.modality)) p += 10;
      return p;
    }
    function prevOther(k, concept) {
      return hist().some((e) => e[0] === k && seq - e[1] === 1 && e[5] && e[5] !== concept);
    }
    function note(k, ctx = {}) {
      if (!k) return;
      shown.add(k);
      const h = hist();
      if (h.some((e) => e[0] === k && e[1] === seq)) return;
      h.push([k, seq, session, cairoYMD(), ctx.modality || "", ctx.concept || ""]);
      if (h.length > 80) h.splice(0, h.length - 80);
      const vc = V().vc || (V().vc = {}),
        x = vc[k] || (vc[k] = { n: 0, cs: [], l: 0 });
      x.n++;
      x.l = seq;
      if (ctx.concept && !x.cs.includes(ctx.concept)) x.cs = x.cs.concat(ctx.concept).slice(-4);
      capMap(vc, 300, (y) => y.l || 0);
      persistSoon();
    }
    function pick(rows, ctx = {}) {
      let best = null,
        bestS = -Infinity;
      rows.forEach((r, i) => {
        const k = r.key || gkey(r.title);
        if (shown.has(k)) return;
        const s = (r.score != null ? r.score : 10 - i * 2) - penalty(k, ctx);
        if (s > bestS) {
          best = r;
          bestS = s;
        }
      });
      return best && bestS > 0 ? best : null;
    }
    function order(keys, ctx = {}) {
      return keys
        .map((k, i) => ({ k, i, p: penalty(gkey(k), ctx) }))
        .sort((a, b) => a.p - b.p || a.i - b.i)
        .map((x) => x.k);
    }
    const allowV10 = () => v10count < 3;
    const claimV10 = () => v10count++;
    const allowFetch = () => v10fetch++ < 5;
    function allowVideo(id) {
      if (!id || videos.has(id)) return false;
      videos.add(id);
      return true;
    }
    function snapshot() {
      return { vh: JSON.stringify(V().vh || []), vc: JSON.stringify(V().vc || {}), seq: V().seq, shown: new Set(shown), screenKey };
    }
    function restore(s) {
      V().vh = JSON.parse(s.vh);
      V().vc = JSON.parse(s.vc);
      V().seq = s.seq;
      seq = s.seq;
      shown = s.shown;
      screenKey = s.screenKey;
    }
    return { beginRender, penalty, prevOther, note, pick, order, allowV10, claimV10, allowFetch, allowVideo, snapshot, restore, gkey, session, get seq() { return seq; }, isShown: (k) => shown.has(k) };
  })();
  window.INTELLECTUALITY_VISUAL_GOVERNOR = G;

  /* ───────────────────────── visual genome: candidates, rubric, plans ───────────────────────── */
  const REJECT_T = /\blogo\b|\bflag\b|coat of arms|\bicon\b|portrait|\bstamp\b|statue|sculpture|poster|book ?cover|signature|\bmap of\b|locator|\bbuilding\b|museum|church|painting|cartoon|emoji|tattoo|costume|\btoy\b|mug shot|selfie|wikipedia screenshot/;
  const ANIMAL_T = /\b(rat|rats|mouse|mice|murine|cat|dog|canine|feline|monkey|macaque|pig|porcine|bovine|cow|sheep|ovine|horse|equine|rabbit|chicken|chick|avian|bird|fish|zebrafish|frog|xenopus|drosophila|insect|worm|elegans|squid|octopus|lamprey|shark|reptile|lizard|snake|turtle|mollus\w*|chiton|bat|bats|veterinar\w*)\b/;
  const FIT = {
    ana: { spe: 6, dia: 5, sec: 5, unl: 2, mic: -1, gra: -4, ani: 1 },
    tract: { dia: 7, sec: 4, spe: 1, ani: 3, unl: 1, mic: -3, gra: -3 },
    histo: { mic: 9, dia: 4, sec: 2, unl: 2, spe: -3, gra: -5, ani: -2 },
    phys: { dia: 6, gra: 6, ani: 6, sec: 0, spe: -6, mic: -2, unl: 0 },
  };
  function guessMod(r) {
    const t = norm(r.title),
      mime = r.mime || "";
    if (/gif/.test(mime) || /\.gif$/i.test(r.title)) return "ani";
    if (/unlabel|without label|no label|blank/.test(t)) return "unl";
    if (/micrograph|histolog|\bh e\b|\bhe\b stain|stain|high mag|low mag|microscop|\blm\b|\bx\d{2,3}\b|nissl|silver/.test(t)) return "mic";
    if (/graph|curve|\beeg\b|hypnogram|plot|chart|wave/.test(t)) return "gra";
    if (/cross section|coronal|sagittal|axial|transverse|\bsection\b/.test(t)) return /svg|diagram|gray\d/.test(t + " " + mime) ? "dia" : "sec";
    if (/svg/.test(mime) || /diagram|schema|illustration|label|drawing|gray\d|blausen|openstax|^\d{4} /.test(t)) return "dia";
    if (/jpe?g/.test(mime)) return "spe";
    return "dia";
  }
  function personalModalityBonus(mod) {
    const st = V().stats.mod,
      arms = Object.entries(st).filter(([, x]) => x.n >= 6);
    if (arms.length < 2) return 0;
    const acc = (x) => (x.ok + 1) / (x.n + 2);
    arms.sort((a, b) => acc(b[1]) - acc(a[1]));
    return arms[0][0] === mod && acc(arms[0][1]) - acc(arms[arms.length - 1][1]) >= 0.15 ? 3 : 0;
  }
  function rubric(c, ctx) {
    const t = norm(c.title);
    if (c.missing || !c.thumb || REJECT_T.test(t) || ANIMAL_T.test(t) || !c.license) return -999;
    const mn = Math.min(c.w || 0, c.h || 0);
    if (mn && mn < (/svg/.test(c.mime) ? 180 : 250)) return -999;
    let s = c.origin === "file" ? 12 : c.origin === "cat" ? 7 : c.origin === "side" ? 6 : 2;
    const tt = tokens(c.title);
    s += Math.min(12, overlapN(tt, ctx.conceptTok || new Set()) * 3) + Math.min(8, overlapN(tt, ctx.stemTok || new Set()) * 2);
    s += (FIT[INTENTS[ctx.intent]?.fam || "ana"] || FIT.ana)[c.modality] || 0;
    if (/\bhuman\b/.test(t)) s += 2;
    if ((c.w >= 900 && c.h >= 600) || /svg/.test(c.mime)) s += 2;
    if (/label|description|\ben\b|diagram|schema/.test(t)) s += 2;
    if (/gray\d|blausen|openstax|^\d{4} |sobo|wellcome|lynch|beal/.test(t)) s += 2;
    if (c.modality === "ani" && INTENTS[ctx.intent]?.fam !== "phys") s -= 3;
    s += personalModalityBonus(c.modality);
    if (ctx.phase === "pre" && ctx.guard && leaks(cleanTitle(c.title), ctx.guard) && !tt.some((w) => ctx.guard.D.has(lite(w)))) s -= 25;
    return s;
  }
  const FLOOR = { file: 14, cat: 12, kw: 14, side: 12 };
  async function candidatesFor(concept, subject, text = "") {
    prepConcepts();
    const out = [],
      t = norm(text);
    // With stem text, a triggered file/category is used only when its trigger fires (answer-blind: stem + chapter).
    const files = (concept._files || []).filter((x) => !t || !x.re || x.re.test(t));
    const catScore = (x) => (x.re ? (x.re.test(t) ? 3 : 0) : 1);
    const ranked = t ? [...(concept._cats || [])].sort((a, b) => catScore(b) - catScore(a)) : concept._cats || [];
    // When every category is triggered and none fires, use none: the curated files (and keyword) carry the concept.
    const cats = (t ? ranked.filter((x) => catScore(x) > 0) : ranked).slice(0, 2).map((x) => x.name);
    if (files.length) {
      try {
        const rows = await netData(urlFiles(files.map((x) => x.f)), commonsRows);
        for (const r of rows) {
          if (r.missing) continue;
          const hit = files.find((x) => gkey(x.f) === gkey(r.title));
          out.push({ ...r, key: gkey(r.title), origin: "file", modality: hit?.m || guessMod(r), concept: concept.k });
        }
      } catch (_) {}
    }
    for (const cat of cats) {
      try {
        const rows = await netData(urlSearch('incategory:"' + String(cat).replace(/"/g, "") + '"', 12), commonsRows);
        rows.forEach((r) => !r.missing && out.push({ ...r, key: gkey(r.title), origin: "cat", modality: guessMod(r), concept: concept.k }));
      } catch (_) {}
    }
    if (out.length < 3)
      for (const kw of (concept.kw || []).slice(0, 1)) {
        try {
          const rows = await netData(urlSearch(kw + (subject === "HISTOLOGY" && !/histolog/.test(kw) ? " histology" : ""), 10), commonsRows);
          rows.forEach((r) => !r.missing && out.push({ ...r, key: gkey(r.title), origin: "kw", modality: guessMod(r), concept: concept.k }));
        } catch (_) {}
      }
    const seen = new Set();
    return out.filter((x) => x.thumb && !seen.has(x.key) && seen.add(x.key));
  }
  const planMem = new Map();
  async function planVisuals(q, phase = "pre", opts = {}) {
    const l = lessonForQ(q, opts.lesson || null),
      subject = q.subject || l?.subject,
      intent = classifyIntent(q, l),
      list = conceptsForQ(q, l, true),
      concept = list[0] || null,
      g = guardModel(q);
    const plan = {
      qid: q.id,
      lessonId: l?.id || "",
      topic: topicOf(l, q),
      intent,
      concept: concept?.k || "",
      conceptLabel: concept?.label || "",
      phase,
      source: q.visualData ? { src: q.visualData, page: q.page, file: q.sourceFile } : null,
      primary: null,
      secondary: null,
      recall: null,
      video: l?.video?.id ? { id: l.video.id, start: l.video.start || 0, end: l.video.end || 0, title: l.video.title || l.topic } : null,
      reason: "",
      provenance: [],
    };
    if (!concept) {
      plan.reason = plan.source ? "Exact source-bank figure." : "No registry concept matched this stem; an answer-derived search is not allowed, so no visual is invented.";
      return plan;
    }
    const qText = (q.stem || "") + " " + (q.chapter || "");
    let cands = await candidatesFor(concept, subject, qText);
    if (list[1] && cands.length < 4) cands = cands.concat((await candidatesFor(list[1], subject, qText)).filter((c) => !cands.some((x) => x.key === c.key)));
    const ctx = { phase, intent, subject, concept: concept.k, conceptTok: concept.tok || new Set(), stemTok: g.stemT, guard: g };
    cands.forEach((c) => (c.score = rubric(c, ctx)));
    const ok = cands.filter((c) => c.score >= (FLOOR[c.origin] || 14)).sort((a, b) => b.score - a.score);
    const qa = !opts.sandbox && V().qa[q.id];
    if (qa?.p) {
      plan.primary = ok.find((c) => c.key === qa.p) || null;
      if (plan.primary && qa.s) plan.secondary = ok.find((c) => c.key === qa.s) || null;
      if (plan.primary) plan.reason = "Stable assignment for this question (same visual each time you meet it).";
    }
    if (!plan.primary) {
      const ranked = ok.map((c) => ({ c, f: c.score - G.penalty(c.key, { concept: concept.k, modality: c.modality }) })).sort((a, b) => b.f - a.f);
      let best = ranked.find((x) => x.f >= 0) || null;
      if (!best && ranked.length && !G.prevOther(ranked[0].c.key, concept.k)) best = ranked[0]; // canonical exception
      if (best) {
        plan.primary = best.c;
        plan.reason = (best.f < 0 ? "Canonical plate (no legitimate alternative); " : "") + "best " + ({ file: "verified registry file", cat: "Commons category match", kw: "keyword match" }[best.c.origin] || "match") + " for " + concept.label + " · " + best.c.modality + " fits intent " + intent + ".";
        const sec = ranked.find((x) => x.c !== best.c && x.c.modality !== best.c.modality && x.f >= 0);
        if (sec) plan.secondary = sec.c;
      }
      if (plan.primary && !opts.sandbox) {
        V().qa[q.id] = { p: plan.primary.key, s: plan.secondary?.key || "", c: concept.k, i: intent, t: Date.now() };
        capMap(V().qa, 600, (x) => x.t || 0);
        persistSoon();
      }
    }
    plan.recall = ok.find((c) => c.modality === "unl" && c !== plan.primary) || null;
    plan.provenance = [plan.primary, plan.secondary].filter(Boolean).map((c) => ({ title: cleanTitle(c.title), license: c.license, artist: c.artist, page: c.page, origin: c.origin }));
    if (!plan.primary && !plan.reason) plan.reason = "No candidate passed the relevance, license, human-anatomy and answer-leak checks. No substitute shown.";
    return plan;
  }
  // Structure pictures found by exact name must show normal human anatomy, not a disease or a scan.
  const PATHO_T = /\b(\w{3,}omas?|carcinoma|tumou?rs?|cancer|metasta\w*|patient|palsy|paralysis|surgery|surgical|operation|injur\w*|lesion|syndrome|disease|\bmri\b|\bct\b|x ?ray|radiograph\w*|angiogra\w*|ultrasound|sonograph\w*|endoscop\w*|pathology|infect\w*)\b/;
  function termOf(label) {
    const t = String(label || "").replace(/\([^)]*\)/g, " ").split(/[\/·;:]/)[0].replace(/[^A-Za-z' -]/g, " ").replace(/\s+/g, " ").trim();
    return t.length >= 4 && t.length <= 40 && t.split(" ").length <= 5 ? t : "";
  }
  async function sideVisual(sideRe, conceptKey, excludeKey, q, ctxBase, term) {
    // Post-answer look-alike visual: only a candidate whose title names this side counts as trustworthy.
    const concept = REG().concepts.find((c) => c.k === conceptKey);
    if (!concept) return null;
    prepConcepts();
    let cands = await candidatesFor(concept, q.subject);
    if (!cands.some((c) => sideRe.test(norm(c.title)))) {
      const cat = (concept._cats || []).map((x) => x.name).find((x) => sideRe.test(norm(x)));
      if (cat)
        try {
          const rows = await netData(urlSearch('incategory:"' + String(cat).replace(/"/g, "") + '"', 12), commonsRows);
          cands = cands.concat(rows.filter((r) => !r.missing).map((r) => ({ ...r, key: gkey(r.title), origin: "side", modality: guessMod(r), concept: concept.k })));
        } catch (_) {}
    }
    // Last resort: files whose TITLE carries the structure's exact name (e.g. "Cavernous sinus"), healthy anatomy only.
    term = termOf(term);
    if (term && !cands.some((c) => sideRe.test(norm(c.title)) && !(excludeKey instanceof Set ? excludeKey.has(c.key) : c.key === excludeKey)))
      try {
        const rows = await netData(urlSearch('intitle:"' + term.replace(/"/g, "") + '"', 10), commonsRows);
        cands = cands.concat(rows.filter((r) => !r.missing && /^image\/(jpeg|png|svg|webp)/.test(r.mime) && !PATHO_T.test(norm(r.title))).map((r) => ({ ...r, key: gkey(r.title), origin: "side", modality: guessMod(r), concept: concept.k })));
      } catch (_) {}
    const ctx = { ...ctxBase, phase: "post", concept: concept.k, conceptTok: concept.tok };
    return (
      cands
        .filter((c) => !(excludeKey instanceof Set ? excludeKey.has(c.key) : c.key === excludeKey) && sideRe.test(norm(c.title)))
        .map((c) => ({ ...c, origin: c.origin === "file" ? "file" : "side", score: rubric({ ...c, origin: c.origin === "file" ? "file" : "side" }, ctx) }))
        .filter((c) => c.score >= FLOOR.side)
        .sort((a, b) => b.score - a.score - (G.penalty(b.key, {}) - G.penalty(a.key, {})) * 0.2)[0] || null
    );
  }

  /* ───────────────────────── rendering helpers ───────────────────────── */
  const MOD_LABEL = { spe: "REAL SPECIMEN", mic: "MICROGRAPH", dia: "LABELED DIAGRAM", sec: "SECTION", ani: "ANIMATION", gra: "GRAPH", unl: "UNLABELED RECALL" };
  function visualCardHTML(c, label, phase, extra = "") {
    const title = cleanTitle(c.title);
    return (
      '<a class="v14Visual ' + extra + '" href="' + E(c.page) + '" target="_blank" rel="noopener" data-v14-vkey="' + E(c.key) + '">' +
      '<span class="v14Img"><img src="' + E(c.thumb) + '" alt="' + (phase === "pre" ? "Question visual — title hidden until you answer" : E(title)) + '" loading="lazy" decoding="async"></span>' +
      '<span class="v14Cap"><b>' + E(label) + (c.modality ? " · " + E(MOD_LABEL[c.modality] || "") : "") + "</b>" +
      (phase === "pre" ? "" : "<i>" + E(title) + "</i>") +
      "<small>" + E(c.license || "license on file page") + (c.artist ? " · " + E(c.artist) : "") + " · Wikimedia Commons ↗</small></span></a>"
    );
  }
  function sourceFigureHTML(src) {
    return '<figure class="v14Visual v14Src"><span class="v14Img"><img src="' + E(src.src) + '" alt="Actual source-bank figure" loading="lazy"></span><span class="v14Cap"><b>ACTUAL SOURCE-BANK FIGURE</b><small>' + E(src.file || "Ketab al Qesm") + " · p." + E(src.page || "—") + "</small></span></figure>";
  }
  const MENINGES_Q = new Set(["EHSAN-ANAT-SPINAL-CORD-MCQ-20", "EHSAN-ANAT-SPINAL-CORD-MCQ-24"]);
  function meningesMapHTML(compact = false) {
    return '<div class="v14MeningesMap' + (compact ? ' compact' : '') + '" role="img" aria-label="From spinal cord outward: pia, CSF-filled subarachnoid space, arachnoid, dura. The denticulate ligament begins in pia, crosses the arachnoid and attaches to dura. Dura also sleeves the exiting spinal nerve root.">' +
      '<div class="v14LayerLine"><span>CORD</span><span>PIA</span><span>CSF SPACE</span><span>ARACHNOID</span><span>DURA</span></div>' +
      '<div class="v14LigamentLine"><b>دَوّر عالطرف</b><span>DENTICULATE LIGAMENT · PIA → DURA</span></div>' +
      '<div class="v14MeningesClue"><span>✕ Arachnoid is crossed; it is not the final attachment.</span><span>✓ Dura forms a sleeve around a spinal nerve root.</span></div></div>';
  }
  function meningesHeroHTML() {
    return '<figure class="v14MeningesHero"><img src="/assets/spinal-meninges-axial-ai-v2.webp" alt="Illustrative transverse view: dorsal sensory root and ganglion above, ventral motor root below, pia on cord, blue subarachnoid CSF space, arachnoid, dura and lateral denticulate attachment" loading="lazy" decoding="async"><figcaption><span>↑ POSTERIOR · dorsal root + ganglion</span><span>BLUE · CSF-filled subarachnoid space</span><span>↓ ANTERIOR · ventral root</span><small>AI-assisted schematic, not to scale. Use the relationship map below for exact attachments. <a href="https://www.ncbi.nlm.nih.gov/books/NBK547755/" target="_blank" rel="noopener">Anatomy reference ↗</a></small></figcaption></figure>';
  }
  function teacherHTML(v) {
    return (
      '<a class="v14Teacher" href="https://www.youtube.com/watch?v=' + E(v.id) + "&t=" + (v.start || 0) + 's" data-ctx-video="' + E(v.id) + '" data-ctx-start="' + (v.start || 0) + '" data-ctx-end="' + (v.end || 0) + '" data-ctx-title="' + E(v.title) + '">' +
      '<img src="https://i.ytimg.com/vi/' + E(v.id) + '/mqdefault.jpg" alt="" loading="lazy"><span><b>▶ TEACHER CLIP · ROUTED WINDOW</b>' + E(v.title) + "</span></a>"
    );
  }
  function atlasHTML(subject) {
    const a = (REG().atlas?.[subject] || [])[0];
    return a ? '<a class="v14AcademicRef" href="' + E(a.href) + '" target="_blank" rel="noopener"><b>ACADEMIC ATLAS · LINK ONLY</b><span>' + E(a.label) + " · " + E(a.terms) + "</span></a>" : "";
  }
  function noVisualHTML(plan) {
    return '<div class="v14VisualMissing"><b>No trustworthy real image for this exact concept yet.</b> The model below carries it — no generated substitute is shown.' + (plan?.reason ? '<small>' + E(plan.reason) + "</small>" : "") + "</div>";
  }
  function attachImgFallback(root) {
    root.querySelectorAll(".v14Visual img").forEach((img) => {
      if (img.dataset.v14Err) return;
      img.dataset.v14Err = "1";
      img.addEventListener(
        "error",
        () => {
          const a = img.closest(".v14Visual");
          if (a) a.outerHTML = '<div class="v14VisualMissing"><b>Image host unavailable right now.</b> The text model carries this step.</div>';
        },
        { once: true },
      );
    });
  }

  /* ───────────────────────── primer (pre-answer, answer-blind) ───────────────────────── */
  const shownCtx = new Map();
  let GP = null;
  function globalCorpus() {
    if (GP) return GP;
    const paras = [],
      seen = new Set();
    for (const d of C.days || [])
      for (const l of d.lessons || []) {
        if (seen.has(l.id)) continue;
        seen.add(l.id);
        const p = prof(l);
        [p.mental || l.mental, p.seed?.minimumModel, ...(p.teach || []), ...deep(l)].filter((x) => typeof x === "string" && x.length > 60).forEach((text) => paras.push({ text, lid: l.id, t: liteSet(tokens(text)) }));
      }
    const df = new Map();
    paras.forEach((x) => x.t.forEach((w) => df.set(w, (df.get(w) || 0) + 1)));
    GP = { paras, df, N: paras.length || 1 };
    return GP;
  }
  function globalParagraphs(q, sig, need, lid) {
    const { paras, df, N } = globalCorpus(),
      want = sig.map(lite),
      chapT = liteSet(tokens(q.chapter || ""));
    return paras
      .filter((x) => x.lid !== lid)
      .map((x) => {
        const hit = want.filter((w) => x.t.has(w));
        const sc = hit.reduce((z, w) => z + Math.log((N + 1) / ((df.get(w) || 0) + 1)), 0) + [...chapT].filter((w) => x.t.has(w)).length * 0.3;
        return { x, n: hit.length, sc };
      })
      .filter((r) => r.n >= need && !leaks(r.x.text, guardModel(q))) // never import a paragraph that carries the key
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 3)
      .map((r) => r.x.text);
  }
  function sentencePool(l, q) {
    // Lesson corpus sentences scored answer-blind: IDF-weighted stem/concept relevance (a word used in
    // every lesson sentence, like "spinal", says little), paragraph context, and distractor coverage
    // (true facts about the look-alikes are exactly what the learner needs to discriminate).
    const p = prof(l),
      pool = [];
    let pid = 0;
    const add = (arr, src, w) =>
      (arr || []).filter(Boolean).forEach((para) => {
        const pt = tokens(para),
          pi = pid++;
        sentences(para).forEach((x, si) => pool.push({ s: x, src, w, pt, pi, si }));
      });
    add([p.mental || l?.mental], "model", 2);
    add([p.seed?.minimumModel], "model", 2);
    add(p.teach, "teach", 1);
    add(deep(l), "deep", 1);
    add((l?.facts || []).map((f) => f[1]), "fact", 0.5);
    // Bank-wide fallback: when no lesson paragraph addresses the stem's distinctive words (e.g. a vocal-cord
    // item routed to a nose lesson), bring in the best-matching paragraphs from the whole professor corpus.
    const g0 = guardModel(q),
      sig = [...g0.stemT].filter((w) => w.length >= 4 && !GENERIC.has(w)),
      need = sig.length >= 3 ? 2 : 1,
      localBest = Math.max(0, ...[...new Set(pool.map((x) => x.pi))].map((pi) => { const x = pool.find((y) => y.pi === pi); return overlapN(x.pt, new Set(sig)); }));
    if (sig.length && localBest < need)
      globalParagraphs(q, sig, need, l?.id).forEach((para) => {
        const pt = tokens(para),
          pi = pid++;
        sentences(para).forEach((x, si) => pool.push({ s: x, src: "global", w: 1.5, pt, pi, si }));
      });
    const g = g0,
      chapT = liteSet(tokens(q.chapter || "")),
      conT = conceptsForQ(q, l)[0]?.tok || new Set();
    const seen = new Set(),
      uniq = pool.filter((x) => !seen.has(norm(x.s)) && seen.add(norm(x.s)));
    uniq.forEach((x) => (x.t = tokens(x.s)));
    const df = new Map();
    uniq.forEach((x) => new Set(x.t.map(lite)).forEach((w) => df.set(w, (df.get(w) || 0) + 1)));
    const N = uniq.length || 1,
      idf = (w) => Math.log((N + 1) / ((df.get(lite(w)) || 0) + 1)) + 0.3;
    const wsum = (arr, set) => arr.reduce((z, w) => z + (set.has(w) || set.has(lite(w)) ? idf(w) : 0), 0);
    return {
      g,
      pool: uniq
        .map((x) => {
          const dh = x.t.filter((w) => g.D.has(lite(w))).length;
          const score = wsum(x.t, g.stemT) * 3 + wsum(x.pt, g.stemT) * 0.8 + wsum(x.t, conT) * 1.2 + wsum(x.t, chapT) * 0.8 + Math.min(3, dh) * 0.9 + x.w;
          return { ...x, score, stemHit: overlapN(x.t, g.stemT) + (overlapN(x.pt, g.stemT) ? 0.5 : 0), leak: leaks(x.s, g), contrast: dh > 0 };
        })
        .sort((a, b) => b.score - a.score),
    };
  }
  function contrastFrame(q, g) {
    const s = norm(q.stem);
    const hits = REG()
      .contrasts.filter((c) => c.frame && c.frame.test(s))
      .map((c) => ({ c, n: (s.match(new RegExp(c.frame.source, "g")) || []).reduce((z, m) => z + m.length, 0) }))
      .sort((a, b) => b.n - a.n);
    for (const { c } of hits) {
      const d = maskText(c.d, g),
        la = maskText(c.a.label, g, true),
        lb = maskText(c.b.label, g, true);
      if (d && la && lb) return { c, d: d.text, la: la.text, lb: lb.text, masked: d.masked + la.masked + lb.masked };
    }
    return null;
  }
  function primerContent(q, l) {
    const { g, pool } = sentencePool(l, q),
      used = new Set();
    // UNDERSTAND IT = the most relevant coherent paragraph (answer-blind scoring). Sentences that carry
    // the key are masked inline as the prediction gap; anything unmaskable is dropped.
    const byPara = new Map();
    for (const x of pool) (byPara.get(x.pi) || byPara.set(x.pi, []).get(x.pi)).push(x);
    let best = null,
      bestS = -1;
    for (const arr of byPara.values()) {
      const sc = arr.map((x) => x.score).sort((a, b) => b - a);
      const s = sc[0] + 0.3 * sc.slice(1, 4).reduce((z, v) => z + v, 0) + (arr.some((x) => x.stemHit >= 1) ? 2 : 0);
      if (s > bestS) {
        bestS = s;
        best = arr;
      }
    }
    const lines = [];
    let gaps = 0,
      len = 0;
    for (const x of (best || []).slice().sort((a, b) => a.si - b.si)) {
      if (lines.length >= 3 || len > 240) break;
      let t = x.s;
      if (x.leak) {
        const m = maskText(t, g);
        if (!m || !m.masked) continue;
        t = m.text;
        gaps++;
      }
      used.add(x.s);
      lines.push(t);
      len += t.length;
    }
    const clean = pool.filter((x) => !x.leak);
    const model = lines.length ? short(lines.join(" "), 300) : short((clean[0] || {}).s || "", 220);
    const subject = q.subject || l?.subject || "ANATOMY",
      intent = classifyIntent(q, l),
      tpl = INTENTS[intent]?.fam === "tract" ? MOVIES.TRACT : MOVIES[subject] || MOVIES.ANATOMY;
    const steps = tpl.map(([label, re, fb]) => {
      const hit = clean.find((x) => !used.has(x.s) && re.test(x.s));
      if (hit) used.add(hit.s);
      return { label, text: hit ? short(hit.s, 115) : fb, filled: !!hit };
    });
    return { g, model, gaps, steps, frame: contrastFrame(q, g), intent, look: INTENTS[intent]?.look || "", exam: examMove(q), cmd: preCommand(q, l) };
  }
  function primerHTML(d, l, q, k, depth, generated = false) {
    l = lessonForQ(q, l) || l;
    const pc = primerContent(q, l),
      it = INTENTS[pc.intent] || INTENTS.identify;
    shownCtx.set(q.id, { depth, cmd: pc.cmd.id, intent: pc.intent, at: Date.now() });
    const vis = '<div class="v14Visuals" data-v14-plan="' + E(q.id) + '" data-v14-phase="pre"><div class="v14Skeleton"><span></span><span></span></div></div>';
    const frame = pc.frame
      ? '<div class="v14Frame"><div class="v14FrameSides"><span>' + E(pc.frame.la) + "</span><em>vs</em><span>" + E(pc.frame.lb) + "</span></div><p>" + E(pc.frame.d) + "</p>" + (pc.frame.masked ? "<small>▢▢▢ = your prediction gap. Fill it in your head before the options.</small>" : "") + "</div>"
      : "";
    const understand =
      '<p class="v14ModelLine">' + E(pc.model || l?.mental || "Build the model from the visual before the options.") + "</p>" + (pc.gaps && !pc.frame ? '<p class="v14Cloze"><b>▢▢▢ = your prediction gap.</b> Fill it in your head before the options.</p>' : "") + frame;
    const movie =
      '<div class="v14Movie" data-v14-movie>' +
      pc.steps.map((s, i) => '<button type="button" class="v14MovieStep' + (i === 0 ? " on" : "") + (s.filled ? "" : " prompt") + '" data-v14-step="' + i + '"><b>' + (i + 1) + " · " + E(s.label) + "</b><span>" + E(s.text) + "</span></button>").join("") +
      "</div>";
    const full = depth === "F";
    return (
      '<div class="v14Primer" data-v14-primer="' + E(q.id) + '" data-depth="' + depth + '">' +
      '<div class="v14PrimerTop"><span class="v14PrimerFlag">UNDERSTAND FIRST · OPTIONS LOCKED</span><span class="v14Intent">' + E(it.label) + (full ? "" : " · COMPACT") + "</span></div>" +
      '<div class="v14Hero">' + vis + commandHTML(pc.cmd) + "</div>" +
      '<ol class="v14Steps">' +
      '<li><b>1 · SEE IT · كوّن الصورة</b><p>' + E(pc.look) + "</p></li>" +
      "<li><b>2 · UNDERSTAND IT</b>" + understand + "</li>" +
      (full ? "<li><b>3 · BUILD THE MOVIE</b>" + movie + "</li><li><b>4 · EXAM CONVERSION</b><p>" + E(pc.exam) + "</p></li>" : "") +
      "</ol>" +
      '<label class="v14Predict"><span><b lang="ar" dir="rtl">توقّع قبل الاختيارات</b> · predict it in your own words before the options</span><input type="text" data-v14-pred="' + E(q.id) + '" maxlength="140" autocomplete="off" placeholder="e.g. the structure, the side, the direction…" value="' + E(V().preds[q.id] || "") + '"></label>' +
      '<button class="primary bigAction v14Gate" data-v14-reveal="' + E(q.id) + '"><span class="v14GateAr" lang="ar" dir="rtl">أنا شايفها → هات السؤال</span><span class="v14GateEn">I CAN PICTURE IT → ASK ME THE MCQ</span></button>' +
      '<div class="v14Tiny">Tutor synthesis from the mapped lesson corpus. The exact source stem, options and key are untouched and stay hidden until you ask.' + (generated ? " This lesson has no mapped source item; the check below is tutor-generated." : "") + "</div>" +
      "</div>"
    );
  }
  function testFirstNote() {
    return '<div class="v14TestFirst"><b>OWNED CONCEPT · TEST FIRST</b><span lang="ar" dir="rtl">رجّعها من دماغك</span> Answer from memory — the explanation compresses when you prove it.</div>';
  }

  /* ───────────────────────── post-answer: why, autopsy, discriminator ───────────────────────── */
  function findContrast(q, keyT, chosenT) {
    const nk = norm(keyT),
      nc = norm(chosenT),
      s = norm((q?.stem || "") + " " + (q?.chapter || "")),
      qc = conceptsForQ(q, lessonForQ(q))[0]?.k;
    let best = null;
    const ctxText = norm((q?.stem || "") + " " + keyT + " " + chosenT);
    for (const c of REG().contrasts) {
      if (c.frame && !c.frame.test(ctxText)) continue; // context gate: generic side words alone never fire a contrast
      const ka = c.a.re.test(nk),
        kb = c.b.re.test(nk),
        ca = c.a.re.test(nc),
        cb = c.b.re.test(nc);
      let keySide = null;
      if (ka && !kb && cb && !ca) keySide = "a";
      else if (kb && !ka && ca && !cb) keySide = "b";
      if (!keySide) continue;
      const score = 3 + (c.frame && c.frame.test(s) ? 2 : 0) + (qc && (c.a.concept === qc || c.b.concept === qc) ? 1 : 0);
      if (!best || score > best.score) best = { c, keySide, score };
    }
    // Families: the key and the chosen option each name exactly one (different) member.
    const nstem = norm(q?.stem || "");
    for (const f of REG().families || []) {
      if (f.frame && !f.frame.test(f.stemFrame ? s : ctxText)) continue;
      if (f.subj && q?.subject && !f.subj.includes(q.subject)) continue;
      const one = (t) => {
        if (f.exclude && f.exclude.test(t)) return -1;
        const hits = f.members.map((m, i) => (m.re.test(t) ? i : -1)).filter((i) => i >= 0);
        return hits.length === 1 ? hits[0] : -1;
      };
      const mk = one(nk),
        mc = one(nc);
      if (mk < 0 || mc < 0 || mk === mc) continue;
      // If the stem names members, the key must be one of them ("which is a COMMISSURAL fibre?" → corpus callosum);
      // otherwise the question is ABOUT one member and the options are statements, not rivals.
      const inStem = f.members.map((m, i) => (m.re.test(nstem) ? i : -1)).filter((i) => i >= 0);
      if (inStem.length && !inStem.includes(mk)) continue;
      const km = f.members[mk],
        cm = f.members[mc];
      const c = { id: f.id + ":" + mk + "-" + mc, family: f.id, type: f.type, cmd: f.cmd, frame: f.frame, a: km, b: cm, d: f.intro + " " + km.label + ": " + km.line + " " + cm.label + ": " + cm.line };
      const score = 2.5 + (f.frame.test(s) ? 2 : 0) + (qc && (km.concept === qc || cm.concept === qc) ? 1 : 0);
      if (!best || score > best.score) best = { c, keySide: "a", score };
    }
    if (!best) return null;
    const k = best.keySide === "a" ? best.c.a : best.c.b,
      o = best.keySide === "a" ? best.c.b : best.c.a;
    return { ...best, key: k, other: o };
  }
  function nearestLookalike(q) {
    const keyT = keyText(q);
    for (const o of q.options || []) {
      if ((q.answerKeys || []).includes(o.key)) continue;
      const m = findContrast(q, keyT, o.text);
      if (m) return { ...m, option: o };
    }
    return null;
  }
  function corpusSentence(l, q, wantTokens, avoidSet, minHit = 1) {
    const { pool } = sentencePool(l, q);
    const want = liteSet(wantTokens);
    let best = null,
      bestS = 0;
    for (const x of pool) {
      if (avoidSet && avoidSet.has(x.s)) continue;
      const hit = overlapN(x.t, want);
      if (hit < minHit) continue;
      const s = hit * 3 + overlapN(x.t, guardModel(q).stemT);
      if (s > bestS) {
        best = x.s;
        bestS = s;
      }
    }
    return best;
  }
  const FELT = {
    lookalike: "It is the nearest look-alike: same family, one different feature.",
    crossing: "Right pathway family, wrong crossing point.",
    laterality: "Right structure, wrong side.",
    lesion: "The deficit pattern overlaps; the localization decides.",
    number: "Right structure, neighbouring level.",
    direction: "Right variable, reversed direction.",
    route: "Right region, wrong route or opening.",
    territory: "A neighbouring vascular territory.",
  };
  function autopsyAnalysis(q, sel) {
    const l = lessonForQ(q),
      key = keyText(q),
      chosen = optText(q, sel),
      nk = norm(key),
      nc = norm(chosen),
      g = guardModel(q);
    if (g.negation)
      return {
        cls: "polarity",
        cmd: command("core"),
        d: "This item asked for the statement that is NOT true. “" + chosen + "” is a true statement, so it cannot be the exception; the false one is “" + key + "”. Read the polarity word first, then test each option against the model.",
        felt: "You answered the topic, not the question's polarity.",
      };
    const c = findContrast(q, key, chosen);
    if (c) return { cls: c.c.type, cmd: command(c.c.cmd), d: c.c.d, contrast: c, felt: FELT[c.c.type] || FELT.lookalike };
    const same = /\b(same|ipsilateral|homolateral)\b/,
      opp = /\b(opposite|contralateral|other side|crossed)\b/;
    const hint = corpusSentence(l, q, tokens(key, false).concat([...g.stemT]), null);
    if ((same.test(nk) && opp.test(nc)) || (opp.test(nk) && same.test(nc)))
      return { cls: "laterality", cmd: command("side"), d: "Side decides this one: the key says " + (same.test(nk) ? "SAME side (ipsilateral)" : "OPPOSITE side (contralateral)") + ", you chose the other. " + (/\b(tract|lesion|pathway|lemnisc|decussat|hemi\w*|cortex|capsule|nucleus|nuclei|cord)\b/.test(norm(q.stem + " " + key + " " + chosen)) ? "Find where the pathway crosses, then read the side off the map." : "Picture the structure from its attachments and watch which way it pulls or points.") + (hint ? " " + short(hint, 170) : ""), felt: FELT.laterality };
    const nums = (s) => (s.match(/\b([ctls]\d{1,2}|\d+(st|nd|rd|th)?)\b/g) || []).join("/");
    if (nums(nk) && nums(nc) && nums(nk) !== nums(nc))
      return { cls: "number", cmd: command("orient"), d: "The level/number decides it: key " + nums(nk).toUpperCase() + " vs your " + nums(nc).toUpperCase() + "." + (hint ? " " + short(hint, 170) : ""), felt: FELT.number };
    const up = /increas|\brise|elevat|higher|\bmore\b|enhanc|facilitat|stimulat|excit|depolari|contract|dilat|\bopen/,
      down = /decreas|\bfall|reduc|lower|\bless\b|inhibit|suppress|hyperpolari|relax|constrict|\bclos/;
    if ((up.test(nk) && down.test(nc)) || (down.test(nk) && up.test(nc)))
      return { cls: "direction", cmd: command("perturb"), d: "Direction decides it: the key goes " + (up.test(nk) ? "UP / excitatory" : "DOWN / inhibitory") + "; your choice runs the other way. Run the chain forward once." + (hint ? " " + short(hint, 170) : ""), felt: FELT.direction };
    // Frame fallback. Evidence from the CHOSEN option dominates (both poles named = the confusion itself;
    // the frame firing on the option = its topic); stem/key hits give context; longer matches break ties.
    const ns = norm(q.stem),
      len = (c, t) => (t.match(new RegExp(c.frame.source, "g")) || []).join("").length;
    const fr =
      REG()
        .contrasts.filter((c) => c.frame && (c.frame.test(nc) || c.frame.test(nk) || c.frame.test(ns)))
        .map((c) => {
          const inC = c.frame.test(nc),
            inS = c.frame.test(ns),
            inK = c.frame.test(nk),
            poles = inC || inS || inK ? (c.a.re.test(nc) ? 1 : 0) + (c.b.re.test(nc) ? 1 : 0) : 0,
            chosenEv = (inC ? 3 : 0) + (poles === 2 ? 8 : poles ? 1.5 : 0);
          return { c, s: 1.6 * chosenEv + Math.min(3, (inS ? 2.5 : 0) + (inK ? 2.5 : 0)) + Math.min(1, (2 * len(c, nc) + len(c, ns) + len(c, nk)) / 30) };
        })
        .sort((a, b) => b.s - a.s)[0]?.c || null;
    if (fr) return { cls: "sibling", cmd: command(fr.cmd || "diff"), d: fr.d + " Check each word of your option against this map: one detail is swapped.", felt: "A true-sounding statement about a neighbouring structure with one detail swapped.", frame: fr };
    const keyT = tokens(key, false).filter((w) => !GENERIC.has(w)),
      ks = corpusSentence(l, q, keyT, null, Math.max(2, Math.ceil(keyT.length * 0.5))),
      cs = ks ? corpusSentence(l, q, tokens(chosen, false).filter((w) => !g.stemT.has(lite(w)) && !GENERIC.has(w)), new Set([ks]), 2) : null;
    if (ks) return { cls: "sibling", cmd: command("diff"), d: "Key: " + short(ks, 200) + (cs ? " — your option belongs to a different fact: " + short(cs, 150) : ""), felt: "A neighbouring fact from the same topic." };
    const kd = [...g.A].slice(0, 4).join(", "),
      cd = tokens(chosen, false).filter((w) => !g.stemT.has(lite(w)) && !g.A.has(lite(w))).slice(0, 4).join(", ");
    return { cls: "retrieval", cmd: command("diff"), d: "The words that decide it — key: " + (kd || short(key, 60)) + "; yours: " + (cd || short(chosen, 60)) + ". Rebuild the model: " + short(prof(l).mental || l?.mental || "", 170), felt: "Retrieval gap: the model was not there yet." };
  }
  function whyHTML(l, q, a) {
    l = lessonForQ(q, l) || l;
    const key = keyText(q),
      t = tier(l, q),
      conf = a?.confidence || "unsure",
      lat = latencyFor(q.id),
      fast = Number.isFinite(lat) && lat < 20000;
    const reason = corpusSentence(l, q, tokens(key, false).concat([...guardModel(q).stemT]), null) || prof(l).mental || l?.mental || "";
    if (t === "owned" && conf === "confident" && fast)
      return '<div class="v14Why compact" data-v14-why="' + E(q.id) + '"><b>✓ OWNED</b> ' + E(key) + " — " + E(short(reason, 120)) + '<details class="v14OptMore"><summary>See every option pictured</summary>' + optionsGalleryHTML(q, a?.selected || "", "all") + "</details></div>";
    const near = nearestLookalike(q),
      guess = conf === "guess";
    return (
      '<div class="v14Why" data-v14-why="' + E(q.id) + '"><b>WHY THIS MAKES SENSE</b><div class="v14WhyAnswer">' + E(key) + "</div>" +
      "<p>" + E(short(reason, 260)) + "</p>" +
      (near ? '<p class="v14Near"><b>vs ' + E(near.option.text) + ":</b> " + E(short(near.c.d, guess ? 320 : 200)) + "</p>" : "") +
      (guess ? '<p class="v14Guess"><b lang="ar" dir="rtl">ما تحفظش الاختيار</b> <b>Guess-correct = weak evidence.</b> Say why the nearest look-alike is wrong before moving on; this concept stays on the spaced list.</p>' : "") +
      '<div class="v14Visuals mini" data-v14-plan="' + E(q.id) + '" data-v14-phase="post"></div>' +
      optionsGalleryHTML(q, a?.selected || "", "all") +
      '<div class="v14Tiny">Tutor explanation, separate from the preserved source key.</div></div>'
    );
  }
  function autopsyHTML(l, q, a, opts = {}) {
    l = lessonForQ(q, l) || l;
    const sel = a?.selected || "",
      an = autopsyAnalysis(q, sel),
      key = keyText(q),
      chosen = optText(q, sel) || String(sel || "your choice");
    if (opts.errorId && S.errors?.[opts.errorId]) S.errors[opts.errorId].v14Cmd = an.cmd.id;
    const e = opts.errorId ? S.errors?.[opts.errorId] : null,
      done = !!e?.v14Recon;
    const gate = opts.gate ? reconGateHTML(q, e, opts.errorId) : "";
    return (
      '<div class="v14Autopsy" data-v14-autopsy="' + E(q.id) + '" data-v14-choice="' + E(sel) + '">' +
      '<div class="v14AutopsyHead"><div><b lang="ar" dir="rtl">ليه إجابتك غلط بصريًا؟</b><span>VISUAL WRONG-ANSWER AUTOPSY</span></div>' + commandHTML(an.cmd, "post") + "</div>" +
      '<div class="v14CompareHead" lang="ar" dir="rtl">حطّهم جنب بعض</div><div class="v14Compare">' +
      '<div class="v14CompareSide correct"><b lang="ar" dir="rtl">اللقطة الصح</b><div class="v14AutopsyVisual" data-v14-side="correct" data-v14-qid="' + E(q.id) + '" data-v14-sel="' + E(sel) + '"><div class="v14Skeleton"><span></span></div></div><strong>' + E(key) + "</strong></div>" +
      '<div class="v14CompareSide wrong"><b lang="ar" dir="rtl">إنت خدت شبيهها / البديل الغلط</b><div class="v14AutopsyVisual" data-v14-side="wrong" data-v14-qid="' + E(q.id) + '" data-v14-sel="' + E(sel) + '"><div class="v14Skeleton"><span></span></div></div><strong>' + E(chosen) + "</strong></div>" +
      "</div>" +
      '<div class="v14Difference"><b lang="ar" dir="rtl">الفرق الفاصل</b><p class="v14ModelLine">' + E(an.d) + "</p><small>Why it felt right: " + E(an.felt) + "</small></div>" +
      optionsGalleryHTML(q, sel, "others") +
      (opts.inlineGate ? gate : "") +
      "</div>"
    );
  }
  function reconGateHTML(q, e, errorId) {
    const done = !!e?.v14Recon;
    return (
      '<div class="v14Recall" data-v14-recall="' + E(errorId) + '"><b lang="ar" dir="rtl">رجّعها من دماغك · من غير اختيارات</b><span>' + E(q.stem) + "</span>" +
        '<textarea data-v14-recon="' + E(errorId) + '" rows="2" maxlength="200" placeholder="One line: the answer + the one reason (no options).">' + E(e?.v14Recon?.t || "") + "</textarea>" +
        '<div class="v14RecallRow"><button type="button" class="v14Aloud' + (done ? " done" : "") + '" data-v14-aloud="' + E(errorId) + '"><span lang="ar" dir="rtl">قلتها بصوتي</span> ' + (done ? "✓" : "") + '</button><small lang="ar" dir="rtl">قول الإجابة والمنطق من غير ما تبص للاختيارات، وبعدين كمّل.</small></div></div>'
    );
  }
  async function hydrateAutopsySide(box) {
    if (box.dataset.v14Done) return;
    box.dataset.v14Done = "1";
    const q = findQ(box.dataset.v14Qid),
      sel = box.dataset.v14Sel,
      side = box.dataset.v14Side;
    if (!q) return;
    const an = autopsyAnalysis(q, sel);
    if (an.contrast?.c?.family && (REG().families || []).find((f) => f.id === an.contrast.c.family)?.novis) an.novis = true;
    let pre = null;
    try {
      pre = await planVisuals(q, "pre");
    } catch (_) {}
    const conceptKey = pre?.concept,
      ctx = { intent: pre?.intent || "identify", guard: null, stemTok: guardModel(q).stemT };
    if (side === "correct") {
      let c = null;
      if (an.contrast && !an.novis) c = await sideVisual(an.contrast.key.re, an.contrast.key.concept || conceptKey, "", q, ctx, an.contrast.key.label).catch(() => null);
      c = c || pre?.primary || null;
      box.innerHTML = c ? visualCardHTML(c, "CORRECT ANCHOR", "post") : pre?.source ? sourceFigureHTML(pre.source) : '<div class="v14VisualMissing">Use the model text: no trustworthy image for the key concept.</div>';
      if (c) G.note(c.key, { concept: conceptKey, modality: c.modality });
      box.dataset.v14Key = c?.key || "";
    } else {
      let c = null,
        why = "";
      if (an.cls === "polarity") why = "Your choice was a TRUE statement — the trap was polarity, not a look-alike, so no distractor image is shown.";
      else if (an.novis) why = "This confusion is about chemistry/physiology, not a structure, so there is no honest picture of your choice; the difference below is the fix.";
      else if (an.contrast) {
        const correctKey = box.closest(".v14Compare")?.querySelector('[data-v14-side="correct"]')?.dataset.v14Key || pre?.primary?.key || "";
        c = await sideVisual(an.contrast.other.re, an.contrast.other.concept || conceptKey, correctKey, q, ctx, an.contrast.other.label).catch(() => null);
      }
      // Without a matched look-alike contrast the distractor is not a distinct depictable structure;
      // an honest note beats a keyword-similar picture.
      box.innerHTML = q.id === "EHSAN-ANAT-SPINAL-CORD-MCQ-24" && sel.toLowerCase() === "a"
        ? meningesMapHTML(true)
        : c ? visualCardHTML(c, "YOUR CHOICE · LOOK-ALIKE", "post", "wrong") : '<div class="v14VisualMissing"><b>No trustworthy distinct visual exists for this distractor.</b> ' + E(why || "Use the decisive reasoning difference below.") + "</div>";
      if (c) G.note(c.key, { concept: c.concept, modality: c.modality });
    }
    attachImgFallback(box);
  }

  /* ───────────────────────── every option, pictured (post-answer only) ───────────────────────── */
  // After the answer every option gets its own picture. An image counts only if its title names that
  // option (or a matched look-alike contrast pole does); otherwise the card says so. No image is reused
  // across options. Never rendered before the answer, so it cannot leak the key.
  function optionsGalleryHTML(q, sel, which) {
    const keys = q.answerKeys || [],
      list = (q.options || []).filter((o) => which !== "others" || (!keys.includes(o.key) && o.key !== sel));
    if (list.length < (which === "others" ? 1 : 2)) return "";
    const cells = list
      .map((o) => {
        const isKey = keys.includes(o.key),
          role = isKey ? "key" : o.key === sel ? "pick" : "other",
          tag = isKey ? "✓ CORRECT" : o.key === sel ? "✗ YOUR PICK" : "✗";
        return '<div class="v14OptCell ' + role + '" data-v14-opt="' + E(o.key) + '"><div class="v14OptTop"><span class="v14OptTag">' + tag + "</span><b>" + E(String(o.key).toUpperCase()) + ".</b> " + E(o.text) + '</div><div class="v14OptPic"><div class="v14Skeleton"><span></span></div></div></div>';
      })
      .join("");
    return (
      '<div class="v14OptGallery" data-v14-opts="' + E(q.id) + '" data-v14-sel="' + E(sel) + '" data-v14-which="' + which + '">' +
      '<div class="v14OptHead"><b lang="ar" dir="rtl">شوف كل اختيار</b><span>' + (which === "others" ? "THE OTHER OPTIONS, PICTURED" : "EVERY OPTION, PICTURED") + "</span></div>" +
      '<div class="v14OptGrid">' + cells + "</div></div>"
    );
  }
  const CLASS_NOUN = /^(neurons?|neurones?|nerves?|arter(y|ies)|veins?|muscles?|cells?|fib(er|re)s?|nucle(us|i)|sinus(es)?|areas?|tracts?|layers?|glands?|bones?|gangli(on|a)|membranes?|lobes?|gyr(us|i)|sulc(us|i)|receptors?|sensations?|organs?|system|parts?|regions?|sides?|branch(es)?|groups?|fossa|surface|border|ends?|body|bodies|type|types|corpuscles?|endings?|roots?)$/;
  const POSITION = /^(anterior|posterior|middle|superior|inferior|medial|lateral|left|right|upper|lower|deep|superficial|internal|external|same|opposite|greater|lesser|major|minor|first|second|third|fourth|primary|secondary|main|common|proper|central|peripheral|dorsal|ventral|rostral|caudal|outer|inner|small|large|long|short)$/;
  function optionSideRe(q, o) {
    const stemT = guardModel(q).stemT;
    let toks = tokens(o.text, false).filter((w) => w.length >= 4 && !GENERIC.has(w) && !stemT.has(lite(w)) && !/^\d+$/.test(w));
    // A picture must name what is distinctive about the option, not just its class ("neurons", "sinuses").
    const specific = toks.filter((w) => !CLASS_NOUN.test(w) && !POSITION.test(w)),
      named = toks.filter((w) => !POSITION.test(w));
    toks = specific.length ? specific : named.length ? named : toks;
    if (!toks.length) return null;
    const esc = (w) => w.slice(0, Math.max(5, w.length - 2)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("\\b(" + toks.slice(0, 4).map(esc).join("|") + ")");
  }
  async function optionVisual(q, o, used, pre, ctx) {
    const no = norm(o.text),
      nq = norm(q.stem + " " + (q.chapter || ""));
    // 1) a look-alike contrast pole that this option names (and not its opposite pole); the contrast must
    //    fit the QUESTION ("crista galli" must not pull in the inner-ear crista contrast)
    let tried = 0;
    for (const c of REG().contrasts) {
      if (tried >= 2) break;
      if (!c.frame || !c.frame.test(nq)) continue;
      const pa = c.a.re.test(no),
        pb = c.b.re.test(no);
      if (pa === pb) continue;
      tried++;
      const pole = pa ? c.a : c.b;
      const hit = await sideVisual(pole.re, pole.concept || pre?.concept, used, q, ctx, pole.label).catch(() => null);
      if (hit) return { c: hit, how: pole.label };
    }
    // 1b) a contrast-family member that this option names (family frame must fit the question)
    for (const f of REG().families || []) {
      if (f.novis || !f.frame.test(nq)) continue;
      const hits = f.members.filter((m) => m.re.test(no));
      if (hits.length !== 1) continue;
      const m = hits[0];
      const hit = await sideVisual(m.re, m.concept || pre?.concept, used, q, ctx, m.label).catch(() => null);
      if (hit) return { c: hit, how: termOf(m.label) || m.label };
      break;
    }
    // 2) the option's own concept, or the question's concept, with a title that names the option
    const re = optionSideRe(q, o);
    if (!re) return null;
    const qConcepts = conceptsForQ(q, lessonForQ(q)).slice(0, 4).map((c) => c.k),
      oc = detectConcepts(o.text, q.subject)[0],
      ocHits = oc ? no.match(new RegExp(oc.re.source, "g")) || [] : [],
      ocOk = oc && (qConcepts.includes(oc.k) || new Set(ocHits).size >= 2 || ocHits.some((h) => h.includes(" ")));
    const concepts = [...new Set([ocOk ? oc.k : null, pre?.concept, ...qConcepts.slice(0, 2)].filter(Boolean))];
    // a short option that names a structure ("Trochlear nerve.") may be searched by its own name
    const phrase = o.text.split(/\s+/).length <= 4 && !/\d/.test(o.text) ? o.text : "";
    for (const k of concepts) {
      const hit = await sideVisual(re, k, used, q, ctx, k === concepts[0] ? phrase : "").catch(() => null);
      if (hit) return { c: hit, how: "" };
    }
    return null;
  }
  async function hydrateOptions(box) {
    if (box.dataset.v14Done) return;
    box.dataset.v14Done = "1";
    const q = findQ(box.dataset.v14Opts);
    if (!q) return;
    let pre = null;
    try {
      pre = await planVisuals(q, "pre");
    } catch (_) {}
    const ctx = { intent: pre?.intent || "identify", guard: null, stemTok: guardModel(q).stemT },
      used = new Set([pre?.primary?.key].filter(Boolean));
    // images already on screen in this autopsy (correct anchor / look-alike) are not repeated
    const aut = box.closest(".v14Autopsy");
    for (let i = 0; aut && i < 40 && aut.querySelector(".v14AutopsyVisual .v14Skeleton"); i++) await new Promise((r) => setTimeout(r, 100));
    aut?.querySelectorAll(".v14AutopsyVisual [data-v14-vkey]").forEach((a) => used.add(a.dataset.v14Vkey));
    for (const cell of box.querySelectorAll("[data-v14-opt]")) {
      const o = (q.options || []).find((x) => x.key === cell.dataset.v14Opt),
        pic = cell.querySelector(".v14OptPic");
      if (!o || !pic) continue;
      const r = await optionVisual(q, o, used, pre, ctx).catch(() => null);
      if (!box.isConnected) return;
      if (r && r.c) {
        used.add(r.c.key);
        pic.innerHTML = visualCardHTML(r.c, r.how ? r.how.toUpperCase() : "THIS OPTION", "post", "opt");
        G.note(r.c.key, { concept: r.c.concept, modality: r.c.modality });
      } else pic.innerHTML = '<div class="v14VisualMissing opt">No trustworthy picture of this exact option. It is a word/number choice, or no licensed image names it.</div>';
    }
    attachImgFallback(box);
  }

  /* ───────────────────────── visual hydration (lazy, near viewport) ───────────────────────── */
  let io = null;
  function schedule(el, fn) {
    if (el.dataset.v14Sched) return;
    el.dataset.v14Sched = "1";
    if (!("IntersectionObserver" in window)) return void fn(el);
    if (!io)
      io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            const f = e.target.__v14fn;
            if (f) f(e.target);
          }),
        { rootMargin: "450px 0px" },
      );
    el.__v14fn = fn;
    io.observe(el);
  }
  async function hydratePlan(box) {
    if (box.dataset.v14Done) return;
    box.dataset.v14Done = "1";
    const q = findQ(box.dataset.v14Plan),
      phase = box.dataset.v14Phase || "pre";
    if (!q) return;
    let plan = null;
    try {
      plan = await planVisuals(q, "pre");
    } catch (e) {
      console.warn("[v14 visual]", e);
    }
    if (!box.isConnected) return;
    const mini = box.classList.contains("mini") || box.dataset.v14Compact;
    if (!plan) {
      box.innerHTML = mini ? "" : noVisualHTML(null);
      return;
    }
    const intentLabel = (INTENTS[plan.intent] || INTENTS.identify).label;
    let h = "";
    if (plan.source) h += sourceFigureHTML(plan.source);
    const meningeal = MENINGES_Q.has(q.id);
    if (meningeal && !mini) h += meningesHeroHTML() + meningesMapHTML();
    const onScreen = (k) => [...document.querySelectorAll(".v14Visual[data-v14-vkey]")].some((a) => a.dataset.v14Vkey === k && !box.contains(a));
    if (meningeal && mini) h += meningesMapHTML(true);
    if (!meningeal && plan.primary && !(mini && onScreen(plan.primary.key))) {
      h += visualCardHTML(plan.primary, mini ? "SAME ANCHOR" : "SEE IT · " + intentLabel, phase, "v14Main");
      G.note(plan.primary.key, { concept: plan.concept, modality: plan.primary.modality });
    }
    if (!meningeal && !mini && plan.secondary && !plan.source) {
      h += visualCardHTML(plan.secondary, "SECOND ANGLE", phase);
      G.note(plan.secondary.key, { concept: plan.concept, modality: plan.secondary.modality });
    }
    if (!h) h = mini ? "" : noVisualHTML(plan);
    if (!mini) {
      if (plan.video && G.allowVideo(plan.video.id)) h += teacherHTML(plan.video);
      h += atlasHTML(q.subject);
    }
    box.innerHTML = h;
    box.classList.toggle("empty", !h);
    const ctx = shownCtx.get(q.id);
    if (ctx) Object.assign(ctx, { vk: plan.primary?.key || (plan.source ? "source" : ""), mod: plan.source ? "src" : plan.primary?.modality || "none", tv: plan.video?.id || "" });
    attachImgFallback(box);
    safe(() => wireCtxVideos(box));
  }
  function wireCtxVideos(root) {
    root.querySelectorAll(".v14Teacher[data-ctx-video]").forEach((a) => {
      if (a.dataset.v14Wired) return;
      a.dataset.v14Wired = "1";
      a.addEventListener("click", (e) => {
        const modalOpen = window.INTELLECTUALITY_CONTEXT_VISUALS && document.querySelector("#ctxVideoModal");
        if (!modalOpen) return;
        e.preventDefault();
        const m = document.querySelector("#ctxVideoModal"),
          s = Number(a.dataset.ctxStart) || 0,
          en = Number(a.dataset.ctxEnd) || 0;
        m.querySelector(".ctxModalTitle").textContent = a.dataset.ctxTitle || "Teacher clip";
        m.querySelector(".ctxModalFrame").innerHTML = '<iframe src="https://www.youtube.com/embed/' + E(a.dataset.ctxVideo) + "?start=" + s + (en > s ? "&end=" + en : "") + '&rel=0&playsinline=1&autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
        m.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
  }

  /* ───────────────────────── ledger & personal learning (feeds v13, never bypasses it) ───────────────────────── */
  function latencyFor(qid) {
    const ev = (S.v12?.evidence || []).slice(-12).reverse().find((x) => x.qid === qid);
    return ev && Number.isFinite(ev.latencyMs) ? ev.latencyMs : null;
  }
  function bump(map, k, ok) {
    if (!k) return;
    const x = map[k] || (map[k] = { n: 0, ok: 0 });
    x.n++;
    if (ok) x.ok++;
  }
  function recordOutcome(qid, mode, extra = {}) {
    const q = findQ(qid),
      r = S.qbank?.results?.[qid];
    if (!q || !r) return;
    const ctx = shownCtx.get(qid) || {},
      v = V(),
      ok = !!r.ok;
    const row = { q: qid, t: q.courseTopic || "", s: q.subject || "", i: ctx.intent || "", d: ctx.depth || "", m: ctx.mod || "", vk: (ctx.vk || "").slice(0, 60), cmd: extra.cmd || ctx.cmd || "", tv: ctx.tv || "", c: r.confidence || "", ok, lat: latencyFor(qid), mode, at: new Date().toISOString() };
    v.ledger.push(row);
    if (v.ledger.length > 150) v.ledger.splice(0, v.ledger.length - 150);
    if (mode === "p") {
      bump(v.stats.mod, row.m, ok);
      bump(v.stats.cmd, row.cmd, ok);
      bump(v.stats.depth, row.d, ok);
      bump(v.stats.teacher, row.tv, ok);
      if (ctx.vk) {
        bump(v.vstats, ctx.vk, ok);
        capMap(v.vstats, 300, (x) => x.n);
      }
    }
    if (mode === "r") bump(v.stats.repairCmd, row.cmd, ok);
    persistSoon();
  }

  /* ───────────────────────── retest law ───────────────────────── */
  function retestPick(e, src) {
    const PE = window.NEU205_PATTERN || {},
      near = new Set([...(PE.nearAvoid?.[src.id] || [])]);
    const srcStem = liteSet(tokens(src.stem)),
      srcAll = liteSet(tokens(src.stem + " " + keyText(src))),
      srcConcept = conceptsForQ(src, lessonForQ(src))[0]?.k;
    const retestList = new Set(PE.retest?.[src.id] || []);
    const pool = (QB.questions || []).filter(
      (q) => q.split === "practice" && q.autoScore && !q.requiresVisual && q.id !== src.id && !S.qbank.used[q.id] && !near.has(q.id) && !(PE.nearAvoid?.[q.id] || []).includes(src.id) && (q.subject === src.subject || (q.lessonIds || []).some((id) => (src.lessonIds || []).includes(id))),
    );
    let best = null,
      bestS = 0;
    for (const q of pool) {
      const st = tokens(q.stem),
        jac = overlapN(st, srcStem) / Math.max(1, new Set([...st.map(lite), ...srcStem]).size);
      if (jac > 0.7 || norm(q.stem) === norm(src.stem)) continue; // trivial wording mutation
      let s = overlapN(tokens(q.stem + " " + (q.options || []).map((o) => o.text).join(" ")), srcAll) * 2;
      if (q.chapter === src.chapter) s += 3;
      if ((q.lessonIds || []).some((id) => (src.lessonIds || []).includes(id))) s += 2;
      if (retestList.has(q.id)) s += 3;
      if (srcConcept && conceptsForQ(q, lessonForQ(q))[0]?.k === srcConcept) s += 4;
      s += (PE.qScore?.[q.id] || 0) / 60;
      if (s > bestS) {
        best = q;
        bestS = s;
      }
    }
    return bestS >= 5 ? best : null;
  }

  /* ───────────────────────── decorate after each render ───────────────────────── */
  let parkedShown = 0;
  function decorate() {
    const cal = V().calendar?.today ? V().calendar : syncCalendar();
    const top = document.querySelector(".courseTopbar");
    if (top) {
      let chip = document.querySelector("#v14Calendar");
      if (!chip) {
        chip = document.createElement("div");
        chip.id = "v14Calendar";
        chip.className = "v14Calendar";
        const crumb = top.querySelector(".courseCrumb");
        if (crumb) crumb.appendChild(chip);
        else top.appendChild(chip);
      }
      chip.textContent = chipText(cal);
      chip.classList.toggle("behind", cal.debt > 0);
    }
    const stage = document.querySelector("#player .stage");
    // A completed step is a navigation event, not proof of mastery or elapsed study time.
    const kind = safe(() => nextAction()?.kind, "");
    if (stage && kind !== "MOCK" && !stage.querySelector(".v14ProgressTruth")) stage.insertAdjacentHTML("afterbegin", '<div class="v14ProgressTruth">Progress counts planned steps; it is not study time or proven mastery. The minute figures are estimates.</div>');
    if (stage && kind !== "MOCK" && !stage.querySelector(".v14Carryover")) {
      const b = calendarBannerHTML(cal);
      const bs = cal.banner && cal.banner.date === cal.today ? cal.banner : (cal.banner = { date: cal.today, seqs: [] });
      if (b && (bs.seqs.includes(G.seq) || bs.seqs.length < 3)) {
        if (!bs.seqs.includes(G.seq)) bs.seqs.push(G.seq);
        stage.insertAdjacentHTML("afterbegin", b);
      }
    }
    const note = V().notice;
    if (stage && note && note.kind === "parked" && parkedShown !== note.at) {
      parkedShown = note.at;
      stage.insertAdjacentHTML("afterbegin", '<div class="v14Carryover parked"><b>PARKED FOR SPACED REPAIR</b><span>' + E(note.topic) + ": three changed items in a row still missed. More drilling now has low yield — it returns as spaced repair tomorrow.</span></div>");
      delete V().notice;
      persistSoon();
    }
    document.querySelectorAll("[data-v14-feed]").forEach((el) => {
      const id = el.dataset.v14Feed,
        v = V();
      if (id && v.feed[id] !== S.day) {
        v.feed[id] = S.day;
        capMap(v.feed, 200, (x) => x);
        persistSoon();
      }
    });
    companions();
    wireThumbnailFallback();
    wireV14();
  }
  let thumbnailErrorsWired = false;
  function wireThumbnailFallback() {
    const fail = (img) => {
      const parent = img.closest(".v14Teacher,.ytPoster");
      if (parent) parent.classList.add("thumbUnavailable");
      img.hidden = true;
    };
    if (!thumbnailErrorsWired) {
      thumbnailErrorsWired = true;
      document.addEventListener("error", (event) => {
        const img = event.target;
        if (img instanceof HTMLImageElement && img.src.includes("i.ytimg.com/")) fail(img);
      }, true);
    }
    document.querySelectorAll('img[src*="i.ytimg.com/"]').forEach((img) => {
      if (img.complete && !img.naturalWidth) fail(img);
    });
  }
  function assessmentContext(node) {
    const st = node.closest(".stage,.mockQ");
    return !!(node.closest(".mockQ") || st?.querySelector('[data-act="mock-qbank"],[data-act="mock-choice"],[data-act="mock-reveal"],[data-act="retest-qbank"],[data-act="retest-mcq"],[data-act="retest-reveal"],[data-act="practical-source-choice"],[data-fast-choice]'));
  }
  function companions() {
    document.querySelectorAll('#player .ctxCompanion[data-ctx-kind="question"]').forEach((c) => {
      if (c.dataset.v14Handled) return;
      c.dataset.v14Handled = "1";
      const row = c.closest(".ctxRow");
      if (assessmentContext(c)) {
        c.remove();
        row?.classList.add("v14Solo");
        return;
      }
      const stage = c.closest(".stage"),
        qid = stage?.querySelector('[data-act="qbank-choice"]')?.dataset.qid || stage?.querySelector('[data-act="finish-qbank"]') && stage.querySelector("[data-v14-why]")?.dataset.v14Why;
      const q = findQ(qid);
      if (!q || tier(lessonForQ(q), q) === "owned") {
        c.remove();
        row?.classList.add("v14Solo");
        return;
      }
      c.className = "ctxCompanion v14Anchor";
      c.innerHTML = '<div class="v14Visuals mini" data-v14-plan="' + E(q.id) + '" data-v14-phase="' + (S.answers && Object.values(S.answers).some((a) => a?.sourceQuestionId === q.id && a.answered) ? "post" : "pre") + '" data-v14-compact="1"></div>';
    });
  }
  function wireV14() {
    document.querySelectorAll("[data-v14-reveal]").forEach((b) => {
      if (b.dataset.v14Wired) return;
      b.dataset.v14Wired = "1";
      b.onclick = () => {
        const id = b.dataset.v14Reveal,
          v = V(),
          inp = document.querySelector('[data-v14-pred="' + CSS.escape(id) + '"]');
        v.primed[id] = S.day;
        capMap(v.primed, 400, (x) => x);
        const t = (inp?.value || "").trim().slice(0, 140);
        if (t) {
          v.preds[id] = t;
          capMap(v.preds, 100, () => 0);
        }
        safe(() => save());
        render();
      };
    });
    document.querySelectorAll("[data-v14-pred]").forEach((inp) => {
      if (inp.dataset.v14Wired) return;
      inp.dataset.v14Wired = "1";
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") document.querySelector('[data-v14-reveal="' + CSS.escape(inp.dataset.v14Pred) + '"]')?.click();
      });
    });
    document.querySelectorAll("[data-v14-recon]").forEach((ta) => {
      if (ta.dataset.v14Wired) return;
      ta.dataset.v14Wired = "1";
      ta.addEventListener("input", () => {
        const e = S.errors?.[ta.dataset.v14Recon],
          val = ta.value.trim();
        if (!e) return;
        if (val.length >= 3) {
          e.v14Recon = { m: "typed", t: val.slice(0, 160), at: new Date().toISOString() };
          unlockRepair(e.id);
          persistSoon();
        }
      });
    });
    document.querySelectorAll("[data-v14-aloud]").forEach((b) => {
      if (b.dataset.v14Wired) return;
      b.dataset.v14Wired = "1";
      b.onclick = () => {
        const e = S.errors?.[b.dataset.v14Aloud];
        if (!e) return;
        e.v14Recon = e.v14Recon?.t ? e.v14Recon : { m: "aloud", at: new Date().toISOString() };
        b.classList.add("done");
        if (!/✓/.test(b.textContent)) b.insertAdjacentText("beforeend", " ✓");
        unlockRepair(e.id);
        persistSoon();
      };
    });
    document.querySelectorAll("[data-v14-movie]").forEach((m) => {
      if (m.dataset.v14Wired) return;
      m.dataset.v14Wired = "1";
      m.addEventListener("click", (e) => {
        const b = e.target.closest("[data-v14-step]");
        if (!b) return;
        m.querySelectorAll("[data-v14-step]").forEach((x) => x.classList.toggle("on", x === b));
      });
    });
    document.querySelectorAll("[data-v14-plan]").forEach((el) => schedule(el, hydratePlan));
    document.querySelectorAll(".v14AutopsyVisual").forEach((el) => schedule(el, hydrateAutopsySide));
    document.querySelectorAll("[data-v14-opts]").forEach((el) => schedule(el, hydrateOptions));
  }
  function unlockRepair(id) {
    document.querySelectorAll('[data-act="repair"][data-v14-gate="' + CSS.escape(id) + '"]').forEach((b) => {
      b.disabled = false;
      b.classList.remove("v14Locked");
    });
  }

  /* ───────────────────────── wrappers ───────────────────────── */
  function screenKey() {
    const a = safe(() => nextAction(), {}) || {};
    return [S.day, a.kind, a.l?.id, a.si, a.e?.id, a.e?.retestIndex, S.mock?.active ? S.mock.i : "", a.kind === "MOCK" ? "m" : ""].join(":");
  }
  function install() {
    V();
    prepConcepts();
    syncCalendar();

    // Pin the served question per (day, lesson, slot) so answering never swaps the item underneath
    // the learner; avoid same-day recognition of items shown in the professor feed.
    const oldQFor = qbankForLesson;
    qbankForLesson = function (l, d, slot = 0) {
      const v = V(),
        pk = d.day + ":" + l.id + ":" + slot,
        pinned = v.pins[pk] ? findQ(v.pins[pk]) : null;
      if (pinned && pinned.split === "practice" && !pinned.generated) return pinned;
      let q = oldQFor(l, d, slot);
      if (q && v.feed[q.id] === d.day) {
        const others = new Set(Object.values(v.pins)),
          PE = window.NEU205_PATTERN || {};
        let pool = qbankPoolForLesson(l, d, "practice").filter((x) => x.id !== q.id && !S.qbank.used[x.id] && v.feed[x.id] !== d.day && !others.has(x.id));
        const fresh = pool.filter((x) => !(PE.nearAvoid?.[x.id] || []).some((id) => S.qbank.used[id]));
        if (fresh.length) pool = fresh;
        pool.sort((a, b) => (PE.qScore?.[b.id] || 0) - (PE.qScore?.[a.id] || 0) + (hash01(pk + ":" + a.id) - hash01(pk + ":" + b.id)) * 7);
        if (pool[0]) q = pool[0];
      }
      if (q) {
        v.pins[pk] = q.id;
        for (const k of Object.keys(v.pins)) {
          const dd = Number(k.split(":")[0]);
          if (dd < S.day - 2 || dd > S.day + 2) delete v.pins[k];
        }
        persistSoon();
      }
      return q;
    };

    const oldQV = qbankQuestionView;
    qbankQuestionView = function (d, l, q, k, conf) {
      const a = S.answers[k],
        depth = primerDepth(lessonForQ(q, l), q);
      if (!a?.answered && depth !== "T" && V().primed[q.id] !== S.day) return primerHTML(d, l, q, k, depth);
      if (!shownCtx.has(q.id)) shownCtx.set(q.id, { depth, cmd: preCommand(q, lessonForQ(q, l)).id, intent: classifyIntent(q, l), at: Date.now() });
      let h = oldQV(d, l, q, k, conf);
      if (!a?.answered && depth === "T") h = testFirstNote() + h;
      if (a?.answered && a.ok) {
        const marker = '<button class="primary bigAction" data-act="finish-qbank"';
        const why = whyHTML(l, q, a);
        h = h.indexOf(marker) >= 0 ? h.replace(marker, why + marker) : h + why;
      }
      if (V().preds[q.id] && a?.answered) h = h.replace('<div class="sourceFeedback', '<div class="v14YourPred"><b>Your prediction:</b> ' + E(V().preds[q.id]) + '</div><div class="sourceFeedback');
      return h;
    };

    const oldQuestionView = questionView;
    questionView = function (d, l, q, k, conf) {
      const a = S.answers[k],
        gq = findQ(q.id) || genQ(q, l),
        depth = primerDepth(l, gq);
      if (!a?.revealed && a?.ok === undefined && depth !== "T" && V().primed[q.id] !== S.day) return primerHTML(d, l, gq, k, depth, true);
      let h = oldQuestionView(d, l, q, k, conf);
      if (a?.ok === true) h += whyHTML(l, gq, { confidence: a.confidence });
      return h;
    };

    const oldRepair = repairView;
    repairView = function (e) {
      const qid = e?.v14LastMissQuestionId || e?.sourceQuestionId,
        q = findQ(qid),
        sel = e?.v14LastMissSelected || e?.selected,
        autopsy = !!(q && sel && q.options?.length);
      let h;
      if (autopsy) {
        const keep = window.INTELLECTUALITY_TOPIC_VISUAL;
        window.INTELLECTUALITY_TOPIC_VISUAL = () => "";
        try {
          h = oldRepair(e);
        } finally {
          window.INTELLECTUALITY_TOPIC_VISUAL = keep;
        }
      } else h = oldRepair(e);
      const marker = '<button class="primary bigAction" data-act="repair"';
      const l = lessonById(e.lessonId);
      if (autopsy) {
        const card = autopsyHTML(l, q, { selected: sel, confidence: e.confidence }, { gate: true, errorId: e.id });
        h = h.replace('<div class="stage">', '<div class="stage" data-v14-noctx="1">');
        const at = h.indexOf('<div class="repair"><b>');
        h = at >= 0 ? h.slice(0, at) + card + h.slice(at) : h.replace(marker, card + marker);
      }
      const card = autopsy
        ? reconGateHTML(q, e, e.id)
        : '<div class="v14Recall" data-v14-recall="' + E(e.id) + '"><b lang="ar" dir="rtl">رجّعها من دماغك</b><span>' + E(l?.draw || "Rebuild the model without looking.") + '</span><textarea data-v14-recon="' + E(e.id) + '" rows="2" maxlength="200" placeholder="One line: the model in your own words.">' + E(e.v14Recon?.t || "") + '</textarea><div class="v14RecallRow"><button type="button" class="v14Aloud' + (e.v14Recon ? " done" : "") + '" data-v14-aloud="' + E(e.id) + '"><span lang="ar" dir="rtl">قلتها بصوتي</span>' + (e.v14Recon ? " ✓" : "") + "</button></div></div>";
      const gated = e.v14Recon ? marker + ' data-v14-gate="' + E(e.id) + '"' : marker + ' data-v14-gate="' + E(e.id) + '" disabled';
      return h.indexOf(marker) >= 0 ? h.replace(marker, card + gated.replace(marker, marker)) : h + card;
    };

    const oldRetestView = retestView;
    retestView = function (e) {
      let h = oldRetestView(e);
      if (/data-act="retest-(mcq|reveal|grade)"/.test(h)) h = h.replace('<span class="chip warn">CHANGED RETEST</span>', '<span class="chip warn">CHANGED RETEST</span><span class="chip">TUTOR-GENERATED PROBE · NOT SOURCE-BANK EVIDENCE</span>');
      return h;
    };

    const oldRetestFor = qbankRetestForError;
    qbankRetestForError = function (e) {
      const idx = e.retestIndex || 0,
        src = findQ(e.sourceQuestionId);
      if (e.v14Retest && e.v14Retest.i === idx) {
        const q = findQ(e.v14Retest.q);
        if (q && q.split === "practice") return q;
      }
      let q = src && !src.generated ? retestPick(e, src) : null;
      if (!q) q = oldRetestFor(e);
      if (q && q.split !== "practice") q = null; // firewall: a held-out item is never a repair item
      if (q) e.v14Retest = { i: idx, q: q.id };
      return q;
    };

    const oldMockResult = mockResultView;
    mockResultView = function (m) {
      let h = oldMockResult(m);
      const cards = m.items
        .map((q, i) => ({ q, a: m.answers[i] }))
        .filter((x) => x.a?.ok === false && x.q?.answerKeys && x.a.selected)
        .map((x, i) => '<details class="v14MockAutopsy"' + (i === 0 ? " open" : "") + "><summary>Miss " + (i + 1) + " · " + E(x.q.chapter || x.q.courseTopic || "MCQ") + "</summary>" + autopsyHTML(null, x.q, x.a, {}) + "</details>")
        .join("");
      const marker = '<button class="primary bigAction" data-act="finish-mock"';
      return cards && h.indexOf(marker) >= 0 ? h.replace(marker, '<h3 class="v14H">Visual autopsies · consumed items only</h3>' + cards + marker) : h;
    };

    const oldNext = nextAction;
    nextAction = function () {
      if (S.mock?.active) return { kind: "MOCK" };
      return oldNext();
    };

    const oldHUD = renderHUD;
    renderHUD = function () {
      safe(syncCalendar);
      const out = oldHUD.apply(this, arguments);
      safe(() => {
        const cal = V().calendar,
          d = day(),
          ey = document.querySelector("#eyebrow");
        if (ey) ey.textContent = "DAY " + d.day + "/" + C.days.length + " · " + phaseLabel(d) + " · " + (cal.debt > 0 ? "WORK " + fmtDay(d.date) + " · TODAY " + fmtDay(cal.today) : fmtDay(cal.today));
      });
      return out;
    };

    const oldUI = window.INTELLECTUALITY_COURSE_UI;
    window.INTELLECTUALITY_COURSE_UI = function () {
      const out = oldUI ? oldUI.apply(this, arguments) : undefined;
      safe(() => {
        const cal = V().calendar,
          d = day(),
          lab = document.querySelector("#railToday .railLabel");
        if (lab) lab.textContent = cal.debt > 0 ? "WORK DAY " + d.day + " · " + fmtDay(d.date) + " · " + (cal.mode === "catchup" ? "CATCH-UP" : "CARRYOVER") : "TODAY · DAY " + d.day + " · " + fmtDay(cal.today);
      });
      return out;
    };

    const oldAct = act;
    act = function (b) {
      const kind = b?.dataset?.act,
        qid = b?.dataset?.qid,
        id = b?.dataset?.id,
        choice = b?.dataset?.choice,
        cur = safe(() => currentLessonSegment(), null);
      if (kind === "repair") {
        const e = S.errors?.[id];
        if (e && !e.v14Recon) return; // reconstruction gate (defence in depth beyond the disabled button)
      }
      const before = kind === "retest-qbank" || kind === "retest-mcq" || kind === "retest-grade" ? S.errors?.[id] : null,
        cmdAtRetest = before?.v14Cmd || "";
      const out = oldAct(b);
      if (kind === "qbank-choice" && qid) {
        const r = S.qbank?.results?.[qid];
        if (r?.ok === true && cur?.key && cur.seg?.type === "question") {
          S.segments[cur.key] = false; // keep the answered item on screen for "why", pinned; NEXT completes it
          safe(() => save());
          render();
        }
        setTimeout(() => safe(() => recordOutcome(qid, "p")), 260);
      }
      if ((kind === "retest-qbank" || kind === "retest-mcq" || kind === "retest-grade") && before) {
        const e = S.errors?.[id];
        if (kind === "retest-qbank" && qid) {
          const r = S.qbank?.results?.[qid];
          if (e && r?.ok === false) {
            e.v14LastMissQuestionId = qid;
            e.v14LastMissSelected = choice;
            e.v14Recon = null;
          }
          setTimeout(() => safe(() => recordOutcome(qid, "r", { cmd: cmdAtRetest })), 260);
        } else if (e && !e.resolved) e.v14Recon = null;
        if (e && !e.resolved && (e.retestIndex || 0) >= 3) {
          // Loop guard: three changed items missed → park to spaced repair instead of an endless loop.
          e.resolved = true;
          e.readyRetest = false;
          e.v14Parked = new Date().toISOString();
          const m = S.memory?.[e.topic];
          if (m) m.halfLife = Math.min(m.halfLife || 1, 1);
          V().parked.push({ id: e.id, topic: e.topic, at: e.v14Parked });
          V().parked = V().parked.slice(-40);
          V().notice = { kind: "parked", topic: e.topic, at: Date.now() };
        }
        safe(() => save());
        render();
      }
      if (kind === "certify") safe(syncCalendar);
      return out;
    };

    const oldRender = render;
    render = function () {
      safe(() => G.beginRender(screenKey()));
      const out = oldRender.apply(this, arguments);
      setTimeout(() => safe(decorate), 20);
      return out;
    };

    const oldWire = wire;
    wire = function () {
      const out = oldWire.apply(this, arguments);
      safe(wireV14);
      return out;
    };

    window.INTELLECTUALITY_V14 = {
      version: VERSION,
      canFastLane,
      tier,
      primerDepth,
      syncCalendar,
      cairoYMD,
      chipText: () => chipText(V().calendar?.today ? V().calendar : syncCalendar()),
      classifyIntent,
      conceptsForQ: (id) => (findQ(id) ? conceptsForQ(findQ(id), lessonForQ(findQ(id))).map((c) => c.k) : []),
      plan: (id, phase = "pre") => (findQ(id) ? planVisuals(findQ(id), phase, { sandbox: true }) : Promise.resolve(null)),
      primerContent: (id) => (findQ(id) ? primerContent(findQ(id), lessonForQ(findQ(id))) : null),
      autopsy: (id, sel) => (findQ(id) ? autopsyAnalysis(findQ(id), sel) : null),
      retestFor: (errorId) => (S.errors?.[errorId] ? qbankRetestForError(S.errors[errorId]) : null),
      preCommand: (id) => (findQ(id) ? preCommand(findQ(id), lessonForQ(findQ(id))) : null),
      guard: (id) => (findQ(id) ? guardModel(findQ(id)) : null),
      leaks: (text, id) => leaks(text, guardModel(findQ(id))),
      audit,
      governor: G,
      visualPlanCount: () => (QB.questions || []).length,
      optionsGallery: (id, sel, which) => (findQ(id) ? optionsGalleryHTML(findQ(id), sel || "", which || "all") : ""),
      hydrateOptions: (el) => (el ? hydrateOptions(el) : Promise.resolve()),
    };

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) dateTick();
    });
    window.addEventListener("focus", dateTick);
    window.addEventListener("pageshow", dateTick);
    setInterval(dateTick, 60000);
    persistSoon();
  }

  /* ───────────────────────── on-device visual diversity audit ───────────────────────── */
  async function audit(opts = {}) {
    // Simulates a study session over a systematic sample of practice items through the real
    // governor and live Commons, without persisting assignments or history.
    const n = opts.n || 60,
      pool = (QB.questions || []).filter((q) => q.split === "practice" && q.autoScore),
      per = { ANATOMY: Math.round(n * 0.4), PHYSIOLOGY: Math.round(n * 0.4) };
    per.HISTOLOGY = n - per.ANATOMY - per.PHYSIOLOGY;
    const bySub = {};
    for (const s of Object.keys(per)) {
      const arr = pool.filter((q) => q.subject === s),
        step = Math.max(1, Math.floor(arr.length / per[s]));
      bySub[s] = [];
      for (let i = opts.offset || 0; i < arr.length && bySub[s].length < per[s]; i += step) bySub[s].push(arr[i]);
    }
    let sample = [];
    for (let i = 0; sample.length < n && i < n; i++) for (const s of ["ANATOMY", "PHYSIOLOGY", "HISTOLOGY"]) if (bySub[s][i]) sample.push(bySub[s][i]);
    // an explicit id list (e.g. consecutive items in course order) replaces the systematic sample
    if (Array.isArray(opts.ids)) sample = opts.ids.map((id) => pool.find((q) => q.id === id)).filter(Boolean);
    const snap = G.snapshot(),
      rows = [],
      firstSeen = new Map();
    try {
      for (let i = 0; i < sample.length; i++) {
        const q = sample[i];
        G.beginRender("audit:" + i);
        const plan = await planVisuals(q, "pre", { sandbox: true });
        const k = plan.primary?.key || (plan.source ? "source:" + q.id : "");
        if (plan.primary) G.note(plan.primary.key, { concept: plan.concept, modality: plan.primary.modality });
        const dist = k && firstSeen.has(k) ? i - firstSeen.get(k) : null;
        if (k && !firstSeen.has(k)) firstSeen.set(k, i);
        else if (k) firstSeen.set(k, i);
        rows.push({ i, qid: q.id, subject: q.subject, topic: q.courseTopic, intent: plan.intent, concept: plan.concept, primary: plan.primary ? cleanTitle(plan.primary.title) : plan.source ? "SOURCE FIGURE" : "", origin: plan.primary?.origin || (plan.source ? "source" : ""), modality: plan.primary?.modality || "", license: plan.primary?.license || "", sourceFigure: !!plan.source, repeatDistance: dist, reason: plan.reason });
      }
    } finally {
      G.restore(snap);
    }
    const withV = rows.filter((r) => r.primary),
      keys = withV.map((r) => r.primary),
      uniq = new Set(keys).size;
    const exact = withV.filter((r) => r.repeatDistance != null).length,
      adj = withV.filter((r) => r.repeatDistance === 1).length;
    const metrics = {
      n: rows.length,
      primaryCoveragePct: +((withV.length / Math.max(1, rows.length)) * 100).toFixed(1),
      uniqueVisualPct: +((uniq / Math.max(1, withV.length)) * 100).toFixed(1),
      exactRepeatPct: +((exact / Math.max(1, withV.length)) * 100).toFixed(1),
      adjacentRepeatPct: +((adj / Math.max(1, withV.length)) * 100).toFixed(1),
      noVisualPct: +(((rows.length - withV.length) / Math.max(1, rows.length)) * 100).toFixed(1),
      irrelevantPct: "requires human review of rows[].primary",
    };
    return { metrics, rows };
  }

  window.INTELLECTUALITY_V14_INIT = function () {
    if (window.INTELLECTUALITY_V14_INSTALLED) return;
    window.INTELLECTUALITY_V14_INSTALLED = true;
    try {
      install();
    } catch (e) {
      console.error("[v14 init fail-safe]", e);
    }
  };
})();
