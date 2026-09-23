/* INTELLECTUALITY v15 · LEARN FIRST + EXACT-WORDS PICTURES
 *
 * 1. LEARN IT: the lesson's "teach" step becomes a paginated lecture built from the chapter notes
 *    (learn-notes-v15.js). Each section: exact-term picture(s) → the facts → why → Kasr trap →
 *    recall without options. Sections you could not recall come back once before practice.
 * 2. Exact-words pictures: a picture is chosen for the EXACT structure named (a note heading, an
 *    MCQ option, the correct answer, the chosen distractor), not for the topic. Search order:
 *    the Wikipedia article whose title is that exact term (its own images, ranked by caption match),
 *    then Commons files titled with the term. Only freely licensed Commons files are shown, with
 *    license and author. "Search everywhere" links open Google Images / Radiopaedia / Kenhub for
 *    the same exact words.
 * 3. After an answer: "From your notes" re-opens the note section that teaches that question.
 *
 * Nothing here runs before an MCQ answer is chosen (no pre-answer leak), and held-out mock items
 * are never touched.
 */
(function () {
  "use strict";
  const VERSION = "15.0";
  const E = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const SP = [[/fibre/g, "fiber"], [/\bgrey/g, "gray"], [/centre/g, "center"], [/haem/g, "hem"], [/oesoph/g, "esoph"], [/oedema/g, "edema"], [/ambiguous/g, "ambiguus"], [/leminisc/g, "lemnisc"], [/mamill/g, "mammill"], [/lentiform/g, "lenticular"], [/\b1st\b/g, "first"], [/\b2nd\b/g, "second"], [/\b3rd\b/g, "third"], [/\b4th\b/g, "fourth"], [/\b5th\b/g, "fifth"], [/\b6th\b/g, "sixth"], [/\b7th\b/g, "seventh"], [/\b8th\b/g, "eighth"]];
  const norm = (s) => SP.reduce((z, [a, b]) => z.replace(a, b), String(s || "").toLowerCase()).replace(/[^a-z0-9]+/g, " ").trim();
  const safe = (f) => {
    try {
      return f();
    } catch (e) {
      console.warn("[v15]", e);
    }
  };
  // **bold** and _term_ markup in the notes → HTML (after escaping)
  const md = (s) => E(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[\s(])[*_]([^*_]+?)[*_](?=[\s.,;:)]|$)/g, "$1<i>$2</i>");

  const STOP = new Set(
    "the of and a an to in is are by for with from on at as or its it this that which be into than their his her all following one true false not except correct statement statements regarding concerning about choose select best answer mark only both each other these those may can will does do has have been being was were more most less least also very what where when how why who whom whose there here they them then because due called known found present seen".split(
      " ",
    ),
  );
  const GENERIC_T = new Set(["human", "anatomy", "the", "of", "and", "system", "physiology", "histology"]);
  function stem(w) {
    if (w.length > 4) w = w.replace(/ies$/, "y").replace(/(ae|es|s|um|us|on|a|i|e)$/, "");
    else if (w.length === 4 && /[^su]s$/.test(w)) w = w.slice(0, -1);
    // long compound words keep more letters ("vestibulocochlear" ≠ "vestibulocerebellum")
    return w.slice(0, Math.max(7, w.length - 3));
  }
  const toks = (t) =>
    norm(t)
      .split(" ")
      .filter((w) => w.length > 2 && !STOP.has(w))
      .map(stem);

  /* ───────────────────────── notes index ───────────────────────── */
  let IDX = null;
  function notes() {
    return window.INTELLECTUALITY_LEARN_NOTES || { chapters: [] };
  }
  function index() {
    if (IDX) return IDX;
    const byLesson = {},
      byChapter = {},
      lexicon = new Map(),
      all = [];
    for (const ch of notes().chapters || []) {
      const key = ch.subject + " · " + ch.chapter,
        ls = ch.lessons || [];
      byChapter[key] = ch;
      const n = ch.s.length;
      ch.s.forEach((s, i) => {
        s.id = s.id || ch.id + "#" + i;
        s.ch = ch;
        s.i = i;
        s.lesson = s.l || ls[Math.min(ls.length - 1, Math.floor((i * ls.length) / Math.max(1, n)))] || ls[0];
        (byLesson[s.lesson] = byLesson[s.lesson] || []).push(s);
        s.tok = new Set(toks([s.h, ...(s.p || []), s.why || "", s.trap || ""].join(" ")));
        all.push(s);
        for (const t of s.pic || []) addLex(lexicon, t);
      });
      for (const t of ch.pic || []) addLex(lexicon, t);
    }
    // document frequency over sections for weighted matching
    const df = new Map();
    for (const s of all) for (const w of s.tok) df.set(w, (df.get(w) || 0) + 1);
    IDX = { byLesson, byChapter, lexicon, all, df, N: all.length };
    return IDX;
  }
  // Matching words of a term: the title without its parenthetical qualifier ("Lens (anatomy)"), and
  // without a trailing "cell(s)" ("Rod cell" is named by "rods"). Short leftovers are not trusted.
  const CLASSW = new Set(["cell", "cel"]);
  function addLex(lex, title) {
    if (lex.has(title)) return;
    const bare = title.replace(/\s*\([^)]*\)\s*/g, " ").trim();
    // a title with a short significant word ("Substance P", "Area 4") must appear as the whole phrase
    if (norm(bare).split(" ").some((w) => w.length <= 2 && !STOP.has(w) && !/^(of|to|in|on)$/.test(w))) return void lex.set(title, { phrase: " " + norm(bare) + " " });
    let t = toks(bare).filter((w) => !GENERIC_T.has(w));
    const core = t.filter((w) => !CLASSW.has(w));
    if (core.length && core.length < t.length && core.join("").length >= 3) t = core;
    if (t.length && t.join("").length >= 3) lex.set(title, t);
  }
  // the term's words must appear in order in the phrase, with at most one word between each
  function inOrder(tt, ph) {
    for (let i = 0; i < ph.length; i++) {
      if (ph[i] !== tt[0]) continue;
      let j = i, ok = true;
      for (let k = 1; k < tt.length && ok; k++) {
        const nx = ph.indexOf(tt[k], j + 1);
        ok = nx > j && nx - j <= 2;
        j = nx;
      }
      if (ok) return i;
    }
    return -1;
  }
  const sectionsForLesson = (lid) => index().byLesson[lid] || [];

  /* ───────────────────────── exact-words pictures ───────────────────────── */
  const WP = "https://en.wikipedia.org/w/api.php?format=json&formatversion=2&origin=*&";
  const WREST = "https://en.wikipedia.org/api/rest_v1/page/media-list/";
  const CAPI = "https://commons.wikimedia.org/w/api.php?";
  const II = "&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiextmetadatafilter=LicenseShortName|Artist|ImageDescription&iiurlwidth=900&format=json&origin=*";
  const JUNK = /(logo|icon|flag|coat of arms|signature|portrait|stamp|wiktionary|wikibooks|commons-logo|question book|edit-clear|ambox|symbol|padlock|disambig|nuvola|crystal clear|gnome|p medicine|stub|map of|locator)/i;
  const PATHO = /(tumou?r|carcinoma|cancer|lesion|patholog|disease|syndrome|injur|hemorrhage|haemorrhage|infarct|abscess|fracture|surgery|surgical|mri of patient|autopsy)/i;
  const OKMIME = /^image\/(jpeg|png|svg\+xml|webp|gif)/;
  const net = () => window.INTELLECTUALITY_V14_NET;
  async function getJSON(url, tf) {
    const n = net();
    if (n && n.json) return n.json(url, tf);
    const r = await fetch(url);
    if (!r.ok) throw new Error("http_" + r.status);
    const j = await r.json();
    return tf ? tf(j) : j;
  }

  // strict: every significant word of the title must be in the phrase
  function titleInPhrase(titleToks, phraseSet) {
    return titleToks.length > 0 && titleToks.every((w) => phraseSet.has(w));
  }
  // Exact terms named by a phrase, most specific first; terms that the question stem already names
  // rank after terms that are distinctive to this option.
  function termsFor(phrase, opt = {}) {
    const ph = toks(phrase),
      set = new Set(ph),
      stemSet = new Set(toks(opt.stem || "")),
      out = [];
    const np = " " + norm(phrase) + " ";
    for (const [title, entry] of index().lexicon) {
      let tt, first;
      if (entry.phrase) {
        const at = np.indexOf(entry.phrase);
        if (at < 0) continue;
        tt = toks(entry.phrase);
        first = at;
      } else {
        tt = entry;
        if (!titleInPhrase(tt, set)) continue;
        first = inOrder(tt, ph);
        if (first < 0) continue;
        // a bare short word ("face", "eye", "pons") inside a long statement is not what the option is about
        if (tt.length === 1 && tt[0].length <= 5 && ph.length > 3) continue;
      }
      const inStem = tt.every((w) => stemSet.has(w));
      // a term the question stem already names is the topic, not what this option says: no picture from it
      if (inStem && opt.stem) continue;
      out.push({ title, n: tt.length, first, inStem });
    }
    out.sort((a, b) => a.inStem - b.inStem || b.n - a.n || a.first - b.first);
    // drop terms fully contained in a longer chosen term ("Dura mater" inside "Spinal dura mater")
    const kept = [];
    for (const o of out) if (!kept.some((k) => toks(o.title).every((w) => toks(k.title).includes(w)))) kept.push(o);
    return kept.map((o) => o.title);
  }
  async function wikiArticle(title) {
    const j = await getJSON(WP + "action=query&redirects=1&prop=pageimages&piprop=name&titles=" + encodeURIComponent(title), (j) => {
      const p = (j?.query?.pages || [])[0] || {};
      return { title: p.title || title, missing: !!p.missing || !!p.invalid, lead: p.pageimage ? "File:" + p.pageimage.replace(/_/g, " ") : "" };
    });
    return j;
  }
  async function wikiSearch(q, phraseSet, stemSet) {
    const rows = await getJSON(WP + "action=query&list=search&srnamespace=0&srlimit=5&srsearch=" + encodeURIComponent(q), (j) => (j?.query?.search || []).map((x) => x.title));
    // only accept an article whose own title words are all in the phrase: the picture must be of these
    // words; and not one the question stem already names (that is the topic, not the option)
    return (
      rows.find((t) => {
        const tt = toks(t).filter((w) => !GENERIC_T.has(w));
        return titleInPhrase(tt, phraseSet) && !(stemSet && stemSet.size && tt.every((w) => stemSet.has(w)));
      }) || null
    );
  }
  async function mediaList(title) {
    return getJSON(WREST + encodeURIComponent(title.replace(/ /g, "_")), (j) =>
      (j?.items || [])
        .filter((x) => x.type === "image" && x.title)
        .slice(0, 30)
        .map((x) => [x.title.replace(/_/g, " "), String(x.caption?.text || "").slice(0, 260), !!x.leadImage]),
    );
  }
  async function commonsInfo(file) {
    return getJSON(CAPI + "action=query&titles=" + encodeURIComponent(file) + II, (j) => {
      const p = Object.values(j?.query?.pages || {})[0] || {},
        ii = p.imageinfo?.[0] || {},
        em = ii.extmetadata || {};
      const strip = (s) => String(s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      return { missing: "missing" in p || !ii.thumburl, title: p.title || file, thumb: ii.thumburl || "", page: ii.descriptionurl || "", mime: ii.mime || "", w: ii.width || 0, h: ii.height || 0, license: strip(em.LicenseShortName?.value), artist: strip(em.Artist?.value).slice(0, 70), desc: strip(em.ImageDescription?.value).slice(0, 220) };
    });
  }
  function modality(title, mime) {
    const t = norm(title);
    if (/micrograph|histolog|\bstain|\bh e\b|\bhe\b|magnif|\blm\b|\bem\b|electron/.test(t)) return "mic";
    if (/mri|\bct\b|x ray|radiograph|ultrasound|angiogra/.test(t)) return "rad";
    if (/dissect|cadaver|specimen|photo|\bjpg\b/.test(t) && !/svg/.test(mime)) return "spe";
    if (/svg/.test(mime) || /gray\d|diagram|schema|illustrat|label|drawing|blausen|openstax|^\d{4} /.test(t)) return "dia";
    return /jpe?g/.test(mime) ? "spe" : "dia";
  }
  const MOD = { mic: "MICROGRAPH", rad: "SCAN", spe: "REAL PHOTO / SPECIMEN", dia: "LABELED DIAGRAM" };
  function scoreFile(file, caption, lead, want, clinical) {
    if (JUNK.test(file)) return -99;
    const ft = new Set(toks(file.replace(/^File:/, "").replace(/\.\w+$/, "") + " " + caption));
    let s = lead ? 2 : 0,
      hit = 0;
    for (const w of want) if (ft.has(w)) hit++;
    s += hit * 1.5 + (want.length && hit === want.length ? 3 : 0);
    if (!clinical && PATHO.test(file + " " + caption)) s -= 3;
    return s;
  }
  // Picture for one exact term (a Wikipedia article title). `phrase` supplies the extra words
  // used to pick among the article's images by caption.
  async function pictureForTerm(term, phrase, opt = {}) {
    const avoid = opt.avoid || new Set();
    let art = await wikiArticle(term).catch(() => null);
    if (!art || art.missing) {
      const t = await wikiSearch(term, new Set(toks(phrase + " " + term))).catch(() => null);
      art = t ? await wikiArticle(t).catch(() => null) : null;
    }
    const want = [...new Set(toks(term + " " + (opt.focus || "")))].filter((w) => !GENERIC_T.has(w)),
      clinical = /lesion|palsy|paralys|syndrome|injur|damage|clinical|block|loss/i.test(phrase);
    const cands = [];
    if (art && !art.missing) {
      const items = await mediaList(art.title).catch(() => []);
      for (const [file, cap, lead] of items) cands.push({ file, cap, lead, s: scoreFile(file, cap, lead, want, clinical), via: "Wikipedia · " + art.title });
      if (art.lead && !items.some((x) => x[0] === art.lead)) cands.push({ file: art.lead, cap: "", lead: true, s: scoreFile(art.lead, "", true, want, clinical), via: "Wikipedia · " + art.title });
    }
    // Commons files whose TITLE carries the exact term
    if (!cands.some((c) => c.s >= 4)) {
      const rows = await getJSON(CAPI + "action=query&list=search&srnamespace=6&srlimit=8&srsearch=" + encodeURIComponent('intitle:"' + term.replace(/"/g, "") + '"') + "&format=json&origin=*", (j) => (j?.query?.search || []).map((x) => x.title)).catch(() => []);
      for (const f of rows) cands.push({ file: f, cap: "", lead: false, s: scoreFile(f, "", false, want, clinical) - 0.5, via: "Wikimedia Commons · exact title" });
    }
    cands.sort((a, b) => b.s - a.s);
    for (const c of cands.slice(0, 5)) {
      if (c.s < 1 || avoid.has(c.file)) continue;
      const info = await commonsInfo(c.file).catch(() => null);
      // local (non-Commons) Wikipedia files are often non-free: never shown
      if (!info || info.missing || !OKMIME.test(info.mime)) continue;
      if (Math.min(info.w, info.h) && Math.min(info.w, info.h) < 180) continue;
      return { key: "exact:" + info.title, title: info.title, thumb: info.thumb, page: info.page, license: info.license, artist: info.artist, mime: info.mime, modality: modality(info.title, info.mime), caption: c.cap || info.desc || "", via: c.via, term, exact: c.s >= 4, origin: "exact", concept: "" };
    }
    return null;
  }
  // Picture for a free phrase (an MCQ option, an answer): exact term → picture.
  async function pic(phrase, opt = {}) {
    // Only curated medical terms (the note pictures' exact Wikipedia titles) are trusted for an option
    // or an answer; a free-text search could land on a non-medical article. No term → the caller falls
    // back to the v14 look-alike logic or an honest "no picture" note.
    const terms = termsFor(phrase, opt);
    for (const t of terms.slice(0, 2)) {
      const r = await pictureForTerm(t, phrase, opt).catch(() => null);
      if (r) return r;
    }
    return null;
  }
  function searchLinks(term, subject) {
    const hint = subject === "HISTOLOGY" ? " histology" : subject === "PHYSIOLOGY" ? " diagram" : " anatomy";
    const q = encodeURIComponent(term + hint);
    return (
      '<span class="v15Links">🔎 ' +
      '<a href="https://www.google.com/search?tbm=isch&q=' + q + '" target="_blank" rel="noopener">Google Images</a>' +
      (subject === "ANATOMY" ? ' · <a href="https://radiopaedia.org/search?q=' + encodeURIComponent(term) + '" target="_blank" rel="noopener">Radiopaedia</a>' : "") +
      ' · <a href="https://www.google.com/search?q=' + encodeURIComponent("site:kenhub.com " + term) + '" target="_blank" rel="noopener">Kenhub</a></span>'
    );
  }
  function picHTML(r, label) {
    return (
      '<a class="v15Fig" href="' + E(r.page) + '" target="_blank" rel="noopener" data-v15-key="' + E(r.key) + '">' +
      '<span class="v15Img"><img src="' + E(r.thumb) + '" alt="' + E(r.term) + '" loading="lazy" decoding="async"></span>' +
      '<span class="v15Cap"><b>' + E(label || r.term) + " · " + E(MOD[r.modality] || "") + "</b>" +
      (r.caption ? "<i>" + E(r.caption) + "</i>" : "") +
      "<small>" + E(r.license || "license on file page") + (r.artist ? " · " + E(r.artist) : "") + " · " + E(r.via || "Wikimedia Commons") + " ↗</small></span></a>"
    );
  }
  const missingHTML = (term, subject, why) =>
    '<div class="v15NoPic"><b>' + E(why || "No free picture found for exactly “" + term + "”.") + "</b>" + searchLinks(term, subject) + "</div>";

  /* ───────────────────────── state ───────────────────────── */
  const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  function V() {
    if (!isObj(S.v15)) S.v15 = {};
    const v = S.v15;
    if (v.schema !== 1) {
      for (const k of Object.keys(v)) delete v[k];
      Object.assign(v, { schema: 1, version: VERSION, pos: {}, miss: {}, rec: {} });
    }
    for (const k of ["pos", "miss", "rec"]) if (!isObj(v[k])) v[k] = {};
    return v;
  }
  const persist = () => safe(() => save());

  /* ───────────────────────── LEARN view ───────────────────────── */
  const CMD = [
    [/histolog|stain|cell|micro|layer|epitheli|tissue|fib(re|er)s?\b/i, "فرّق النسيج", "Read the tissue"],
    [/lesion|palsy|paralys|injur|damage|syndrome|sign|clinical|applied/i, "حدّد الإصابة", "Localize the lesion"],
    [/arter|vein|venous|sinus|blood|supply|drain/i, "مين بيغذّيه؟", "Find the supply"],
    [/nerve supply|innervat|nerve|branch/i, "مين معصّبه؟", "Find the nerve"],
    [/pathway|tract|route|course|circuit|reflex arc|projection/i, "امشي المسار", "Walk the pathway"],
    [/mechanism|potential|transmission|receptor|channel|regulat|control|function|how|role|physiolog/i, "شغّل الميكانيزم", "Run the mechanism"],
    [/relation|boundar|wall|surface|border|content|opening|communicat/i, "شوف علاقته بإيه", "Map the relations"],
  ];
  function cmdFor(s) {
    if (s.c) return s.c;
    const t = s.h + " " + (s.ch?.chapter || "");
    for (const [re, ar, en] of CMD) if (re.test(t)) return [ar, en];
    return ["كوّن الصورة", "Build the picture"];
  }
  function pagesFor(a) {
    const secs = sectionsForLesson(a.l.id),
      v = V(),
      miss = (v.miss[a.key] || []).map((id) => secs.find((s) => s.id === id)).filter(Boolean);
    return { secs, miss };
  }
  function learnView(a) {
    const { secs, miss } = pagesFor(a),
      v = V(),
      n = secs.length,
      i = Math.max(0, Math.min(n + (miss.length ? 1 : 0) - 1, Number(v.pos[a.key]) || 0));
    const dots = secs.map((s, k) => '<span class="' + (k < i ? "done" : k === i ? "now" : "") + '"></span>').join("") + (miss.length ? '<span class="' + (i === n ? "now" : "") + '"></span>' : "");
    let body = "";
    if (i < n) {
      const s = secs[i],
        first = i === 0 || secs[i - 1].ch !== s.ch,
        [ar, en] = cmdFor(s);
      body =
        (first
          ? '<div class="v15Big"><div class="v15Kicker">THE WHOLE PICTURE · ' + E(s.ch.chapter.toUpperCase()) + "</div><p>" + md(s.ch.big || "") + "</p></div>"
          : "") +
        '<div class="v15Sec" data-v15-sec="' + E(s.id) + '">' +
        '<div class="v15Head"><h3>' + md(s.h) + '</h3><span class="v15Cmd"><span lang="ar" dir="rtl">' + E(ar) + "</span><small>" + E(en) + "</small></span></div>" +
        '<div class="v15Pics">' +
        (s.pic || [])
          .slice(0, 2)
          .map((t) => '<figure class="v15Pic" data-v15-term="' + E(t) + '" data-v15-focus="' + E(s.h) + '" data-v15-subj="' + E(s.ch.subject) + '"><div class="v14Skeleton"><span></span></div></figure>')
          .join("") +
        "</div>" +
        '<ul class="v15Pts">' + (s.p || []).map((x) => "<li>" + md(x) + "</li>").join("") + "</ul>" +
        (s.why ? '<div class="v15Why"><b lang="ar" dir="rtl">ليه؟</b> <b>Why it works</b><p>' + md(s.why) + "</p></div>" : "") +
        (s.trap ? '<div class="v15Trap"><b lang="ar" dir="rtl">امسك الفرق</b> <b>Kasr trap</b><p>' + md(s.trap) + "</p></div>" : "") +
        recallHTML(s, a.key) +
        "</div>";
    } else {
      body =
        '<div class="v15Sec v15Again"><div class="v15Head"><h3>One more pass on what did not come back</h3><span class="v15Cmd"><span lang="ar" dir="rtl">رجّعها من دماغك</span><small>Pull it from memory</small></span></div>' +
        miss.map((s) => recallHTML(s, a.key, true)).join("") +
        "</div>";
    }
    const last = i >= n - 1 + (miss.length ? 1 : 0);
    const nav =
      '<div class="v15Nav">' +
      (i > 0 ? '<button class="v15Prev" data-act="v15-prev" data-key="' + E(a.key) + '" aria-label="Previous section">‹ BACK</button>' : "") +
      (last
        ? '<button class="primary bigAction" data-act="finish-segment" data-key="' + E(a.key) + '" data-method="learn_v15"><span class="v15Ar" lang="ar" dir="rtl">فهمت الدرس → يلا نحل</span><span>LESSON LEARNED → PRACTICE</span></button>'
        : '<button class="primary bigAction" data-act="v15-next" data-key="' + E(a.key) + '"><span class="v15Ar" lang="ar" dir="rtl">فهمتها → اللي بعدها</span><span>GOT IT → NEXT SECTION</span></button>') +
      "</div>";
    const mins = Math.max(1, Math.round((secs.reduce((z, s) => z + (s.p || []).join(" ").split(/\s+/).length, 0) / 130) + secs.length * 0.6));
    return (
      '<div class="stage v15Stage"><div class="chips"><span class="chip">' + E(a.l.subject) + '</span><span class="chip good">LEARN FIRST · LECTURE REPLACEMENT</span><span class="chip">~' + mins + " min</span></div>" +
      "<h2>" + E(a.l.topic) + "</h2>" +
      '<div class="v15Learn"><div class="v15Top"><span>' + (i < n ? "SECTION " + (i + 1) + " / " + n : "FINAL RECALL") + '</span><span class="v15Dots">' + dots + "</span></div>" +
      body + nav + "</div></div>"
    );
  }
  function recallHTML(s, segKey, again) {
    if (!s.q) return "";
    const r = V().rec[s.id];
    return (
      '<div class="v15Recall" data-v15-rsec="' + E(s.id) + '" data-key="' + E(segKey) + '">' +
      '<div class="v15RHead"><b lang="ar" dir="rtl">رجّعها من دماغك</b><span>COVER IT · ANSWER IN YOUR HEAD · NO OPTIONS</span></div>' +
      (again ? '<div class="v15RFrom">' + md(s.h) + "</div>" : "") +
      '<p class="v15RQ">' + md(s.q[0]) + "</p>" +
      '<button class="v15Show" data-act="v15-show">Show the answer</button>' +
      '<div class="v15RA" hidden><p>' + md(s.q[1]) + '</p><div class="v15Rate"><button data-act="v15-rate" data-ok="1">عرفتها ✓ I had it</button><button data-act="v15-rate" data-ok="0">ما جتش ✗ Not yet</button></div></div>' +
      (r ? '<small class="v15RPrev">Last time: ' + (r[0] ? "✓" : "✗") + "</small>" : "") +
      "</div>"
    );
  }

  /* ───────────────────────── post-answer: the note that teaches this question ───────────────────────── */
  function bestSection(q) {
    const I = index(),
      key = (q.options || []).filter((o) => (q.answerKeys || []).includes(o.key)).map((o) => o.text).join(" "),
      want = new Set(toks(q.stem + " " + key)),
      keyT = new Set(toks(key)),
      ch = I.byChapter[q.subject + " · " + q.chapter];
    const pool = ch ? ch.s : I.all.filter((s) => s.ch.subject === q.subject);
    let best = null;
    for (const s of pool) {
      let sc = 0;
      for (const w of want) if (s.tok.has(w)) sc += Math.log(1 + I.N / (I.df.get(w) || 1)) * (keyT.has(w) ? 1.6 : 1);
      if (!best || sc > best.sc) best = { s, sc };
    }
    return best && best.sc > 3 ? best.s : null;
  }
  function noteCardHTML(s) {
    return (
      '<details class="v15Note"><summary><b lang="ar" dir="rtl">ارجع للنوتة</b> 📖 FROM YOUR NOTES · ' + md(s.h) + "</summary>" +
      '<div class="v15Pics">' + (s.pic || []).slice(0, 1).map((t) => '<figure class="v15Pic" data-v15-term="' + E(t) + '" data-v15-focus="' + E(s.h) + '" data-v15-subj="' + E(s.ch.subject) + '"><div class="v14Skeleton"><span></span></div></figure>').join("") + "</div>" +
      '<ul class="v15Pts">' + (s.p || []).map((x) => "<li>" + md(x) + "</li>").join("") + "</ul>" +
      (s.trap ? '<div class="v15Trap"><b>Kasr trap</b><p>' + md(s.trap) + "</p></div>" : "") +
      "</details>"
    );
  }
  function decoratePost() {
    // correct-answer "why" block and the wrong-answer autopsy: attach the teaching note
    const spots = [];
    document.querySelectorAll("#player [data-v14-why]").forEach((el) => spots.push([el, el.dataset.v14Why]));
    document.querySelectorAll("#player .v14Autopsy[data-v14-autopsy]").forEach((el) => spots.push([el, el.dataset.v14Autopsy]));
    for (const [el, qid] of spots) {
      if (el.dataset.v15Note) continue;
      el.dataset.v15Note = "1";
      const q = (window.EHSAN_QBANK?.questions || []).find((x) => x.id === qid);
      if (!q || q.split !== "practice") continue;
      const s = bestSection(q);
      if (!s) continue;
      el.insertAdjacentHTML("afterend", noteCardHTML(s));
    }
  }

  /* ───────────────────────── hydration ───────────────────────── */
  function hydratePics(root = document) {
    const onPage = new Set([...root.querySelectorAll("#player [data-v15-key], #player [data-v14-vkey]")].map((a) => (a.dataset.v15Key || a.dataset.v14Vkey || "").replace(/^exact:/, "")));
    root.querySelectorAll("#player figure.v15Pic:not([data-v15-done])").forEach((fig) => {
      fig.dataset.v15Done = "1";
      const term = fig.dataset.v15Term,
        subj = fig.dataset.v15Subj;
      const load = async () => {
        const r = await pictureForTerm(term, fig.dataset.v15Focus || term, { avoid: onPage, focus: fig.dataset.v15Focus }).catch(() => null);
        if (!fig.isConnected) return;
        if (r) {
          onPage.add(r.title);
          fig.innerHTML = picHTML(r, r.term) + searchLinks(term, subj);
        } else fig.innerHTML = missingHTML(term, subj, navigator.onLine === false ? "Offline: the picture of “" + term + "” loads when you are back online." : "");
        const img = fig.querySelector("img");
        if (img) img.onerror = () => (fig.innerHTML = missingHTML(term, subj, "The picture of “" + term + "” did not load."));
      };
      // details (closed) and off-screen figures load when opened / near the viewport
      const det = fig.closest("details");
      if (det && !det.open) det.addEventListener("toggle", () => det.open && load(), { once: true });
      else load();
    });
  }
  function prefetchNext(a) {
    const { secs } = pagesFor(a),
      i = Number(V().pos[a.key]) || 0,
      s = secs[i + 1];
    if (s) (s.pic || []).slice(0, 2).forEach((t) => setTimeout(() => pictureForTerm(t, s.h, { focus: s.h }).catch(() => null), 1200));
  }

  /* ───────────────────────── wiring ───────────────────────── */
  function onClick(ev) {
    const b = ev.target.closest("[data-act^='v15-']");
    if (!b || !b.closest("#player")) return;
    const act = b.dataset.act,
      v = V();
    if (act === "v15-next" || act === "v15-prev") {
      const k = b.dataset.key;
      v.pos[k] = Math.max(0, (Number(v.pos[k]) || 0) + (act === "v15-next" ? 1 : -1));
      persist();
      render();
      const top = document.querySelector("#player .v15Stage");
      if (top && top.scrollIntoView) top.scrollIntoView({ block: "start" });
    } else if (act === "v15-show") {
      const box = b.closest(".v15Recall");
      box.querySelector(".v15RA").hidden = false;
      b.hidden = true;
    } else if (act === "v15-rate") {
      const box = b.closest(".v15Recall"),
        id = box.dataset.v15Rsec,
        k = box.dataset.key,
        ok = b.dataset.ok === "1",
        prev = v.rec[id] || [0, 0, 0];
      v.rec[id] = [ok ? 1 : 0, (prev[1] || 0) + 1, Date.now()];
      const m = new Set(v.miss[k] || []);
      if (ok) m.delete(id);
      else m.add(id);
      v.miss[k] = [...m];
      box.querySelector(".v15Rate").innerHTML = ok ? '<span class="v15Ok">✓ Locked in.</span>' : '<span class="v15No">✗ It comes back once before practice.</span>';
      persist();
    }
  }

  /* ───────────────────────── teach before test ───────────────────────── */
  // A practice question is served only after the lesson whose note teaches it has been learned,
  // whenever the pool still has other questions (never an empty slot, never a held-out item).
  let taughtMemo = null;
  function taughtLessons() {
    const k = Object.keys(S.segments || {}).length;
    if (taughtMemo && taughtMemo.k === k) return taughtMemo.set;
    const set = new Set();
    for (const d of (window.COURSE || {}).days || [])
      for (const l of d.lessons || [])
        (l.segments || []).forEach((sg, i) => {
          if (sg.type === "teach" && S.segments[segmentKey(d, l, i)]) set.add(l.id);
        });
    taughtMemo = { k, set };
    return set;
  }
  const secMemo = new Map();
  function teachingLesson(q) {
    if (!secMemo.has(q.id)) secMemo.set(q.id, bestSection(q)?.lesson || null);
    return secMemo.get(q.id);
  }
  function teachFirst(pool, l) {
    if (!Array.isArray(pool) || pool.length < 2) return pool;
    const taught = taughtLessons();
    const ok = pool.filter((q) => {
      const tl = teachingLesson(q);
      return !tl || tl === l?.id || taught.has(tl);
    });
    return ok.length ? ok : pool;
  }

  function install() {
    V();
    if (typeof qbankPoolForLesson === "function") {
      const basePool = qbankPoolForLesson;
      qbankPoolForLesson = function (l, d, split) {
        const pool = basePool.apply(this, arguments);
        return split === "practice" || split === undefined ? safe(() => teachFirst(pool, l)) || pool : pool;
      };
    }
    const base = segmentView;
    segmentView = function (a) {
      if (a && a.seg && a.seg.type === "teach" && a.l && sectionsForLesson(a.l.id).length) return learnView(a);
      return base.apply(this, arguments);
    };
    const oldRender = render;
    render = function () {
      const out = oldRender.apply(this, arguments);
      setTimeout(
        () =>
          safe(() => {
            const st = document.querySelector("#player .v15Stage");
            // topic wallpaper does not belong on a note page: pictures there are exact-term only
            if (st) st.querySelectorAll(".ctxCompanion,.realVisualBank,.v14Visuals").forEach((x) => x.remove());
            decoratePost();
            hydratePics();
            const a = typeof nextAction === "function" ? nextAction() : null;
            if (st && a && a.kind === "SEGMENT") prefetchNext(a);
          }),
        60,
      );
      return out;
    };
    document.addEventListener("click", onClick);
    window.INTELLECTUALITY_V15 = {
      version: VERSION,
      sectionsForLesson: (lid) => sectionsForLesson(lid).map((s) => ({ id: s.id, h: s.h, pic: s.pic || [], chapter: s.ch.chapter })),
      chapters: () => (notes().chapters || []).map((c) => ({ id: c.id, subject: c.subject, chapter: c.chapter, lessons: c.lessons, sections: c.s.length })),
      termsFor,
      teachingLesson: (qid) => {
        const q = (window.EHSAN_QBANK?.questions || []).find((x) => x.id === qid);
        return q ? teachingLesson(q) : null;
      },
      bestSection: (qid) => {
        const q = (window.EHSAN_QBANK?.questions || []).find((x) => x.id === qid);
        const s = q && bestSection(q);
        return s ? { id: s.id, h: s.h } : null;
      },
      noteText: (chKey) => {
        const c = index().byChapter[chKey];
        return c ? [c.big, ...c.s.flatMap((s) => [s.h, ...(s.p || []), s.why || "", s.trap || "", ...(s.q || [])])].join(" ") : "";
      },
    };
    // exact-words picture service used by the v14 option gallery and autopsy
    window.INTELLECTUALITY_EXACT = { pic, pictureForTerm, termsFor, searchLinks };
  }
  function boot() {
    if (window.INTELLECTUALITY_V15_INSTALLED) return;
    if (typeof segmentView !== "function" || typeof render !== "function" || typeof S === "undefined") return void setTimeout(boot, 50);
    window.INTELLECTUALITY_V15_INSTALLED = true;
    try {
      install();
      render();
    } catch (e) {
      console.error("[v15 init fail-safe]", e);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
