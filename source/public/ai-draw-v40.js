/* INTELLECTUALITY v40 · the professor explains EVERY option and draws EVERY answer (powered by the owner's OpenRouter key).
 *  - explain(q): one call per question → why the key is right, why each other option is wrong, the examiner's trap, and a
 *    labelled SVG drawing made for that exact question. Started in the background as soon as the question appears
 *    (it is shown only after you answer), cached forever in IndexedDB, so each question costs once.
 *  - topic(lesson): one labelled SVG drawing of the lesson's topic, shown in its big-picture part, cached the same way.
 *  - Safety: sealed (held-out) questions are never sent before their mock is taken; mocks never call the AI; the key is
 *    sent only to openrouter.ai; the weekly spending cap stops automatic calls; every SVG is sanitised (no scripts,
 *    no event handlers, no external links or images) before it is shown. */
(function () {
  "use strict";
  if (window.IX_AIX) return;
  const T = () => window.IX_TUTOR;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const KEYN = "ix_tutor_key_v1", PRO = "ix_tutor_model_pro_v1", DEF = "google/gemini-3.8-flash";

  /* ── a tiny IndexedDB cache (localStorage is too small for hundreds of drawings) ── */
  const mem = {};
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res) => { try { const r = indexedDB.open("ix_ai_v1", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => res(null); } catch (e) { res(null); } });
    return dbp;
  }
  async function get(k) { if (k in mem) return mem[k]; const d = await db(); if (!d) return null; return new Promise((res) => { try { const r = d.transaction("kv").objectStore("kv").get(k); r.onsuccess = () => res((mem[k] = r.result || null)); r.onerror = () => res(null); } catch (e) { res(null); } }); }
  async function put(k, v) { mem[k] = v; const d = await db(); if (!d) return; try { d.transaction("kv", "readwrite").objectStore("kv").put(v, k); } catch (e) {} }

  /* ── SVG sanitiser: only drawing elements survive ── */
  const OK_EL = new Set("svg g defs marker path line polyline polygon rect circle ellipse text tspan title desc lineargradient radialgradient stop pattern clippath use".split(" "));
  function cleanSvg(src) {
    try {
      const m = String(src || "").match(/<svg[\s\S]*<\/svg>/i); if (!m) return null;
      const doc = new DOMParser().parseFromString(m[0], "image/svg+xml");
      if (doc.querySelector("parsererror")) return null;
      const svg = doc.documentElement; if (!svg || svg.nodeName.toLowerCase() !== "svg") return null;
      const walk = (el) => {
        [...el.children].forEach((c) => { if (!OK_EL.has(c.nodeName.toLowerCase())) c.remove(); else walk(c); });
        [...el.attributes].forEach((a) => {
          const n = a.name.toLowerCase(), v = a.value;
          if (n.startsWith("on") || n === "style" && /url\(|expression|javascript/i.test(v)) el.removeAttribute(a.name);
          else if ((n === "href" || n === "xlink:href") && !/^#/.test(v)) el.removeAttribute(a.name);
          else if (/javascript:|data:/i.test(v)) el.removeAttribute(a.name);
        });
      };
      walk(svg);
      if (!svg.getAttribute("viewBox")) { const w = parseFloat(svg.getAttribute("width")) || 640, h = parseFloat(svg.getAttribute("height")) || 400; svg.setAttribute("viewBox", "0 0 " + w + " " + h); }
      svg.removeAttribute("width"); svg.removeAttribute("height");
      svg.setAttribute("role", "img"); svg.setAttribute("class", "ixAxSvg");
      if (svg.querySelectorAll("text").length < 2) return null;   // a drawing without labels does not teach
      return new XMLSerializer().serializeToString(svg);
    } catch (e) { return null; }
  }

  /* ── the call ── */
  function canCall(auto) {
    const t = T(); if (!t || !t.hasKey || !t.hasKey()) return false;
    if (auto) { try { const s = t.spend(), c = t.cap(); if (s && c && s.usd >= c) return false; } catch (e) {} }
    return true;
  }
  async function call(system, user, maxTokens) {
    const key = localStorage.getItem(KEYN); if (!key) throw new Error("no key");
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
      body: JSON.stringify({ model: localStorage.getItem(PRO) || DEF, max_tokens: maxTokens, usage: { include: true }, messages: [{ role: "system", content: system }, { role: "user", content: user }] }) });
    if (!r.ok) throw new Error(r.status === 402 ? "no credit left on OpenRouter" : r.status === 401 ? "the key was refused" : r.status === 429 ? "too many requests, try again in a minute" : "OpenRouter answered " + r.status);
    const j = await r.json(); try { if (j.usage && j.usage.cost && T()._addSpend) T()._addSpend(j.usage.cost); } catch (e) {}
    const out = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || ""; if (!out.trim()) throw new Error("nothing came back");
    return out;
  }
  const SVG_RULES = "SVG rules: one <svg> with viewBox=\"0 0 640 420\"; first a <rect width=\"640\" height=\"420\" fill=\"#fbf8f1\"/> (paper); clean anatomical/physiological schematic in the style of a good textbook line drawing (smooth paths, soft fills #f3d6c9 #d9e8f5 #e6f0d8 #f6e7b8, outlines #44403c 1.5–2px); EVERY structure labelled with <text> (font-family Arial, font-size 20–24 so it reads on a phone, fill #1c1917) and thin leader lines, at most 10 labels, labels never overlapping; the structure or step that is the correct answer in bold red #c2255c; arrows for flow or direction (use a marker); a short title at the top; no <image>, no <foreignObject>, no scripts, no external links; under 7000 characters.";
  // PART 1 is the JSON before the drawing, PART 2 the <svg> itself (an SVG inside a JSON string breaks too easily)
  function split(raw) {
    raw = String(raw || "").replace(/```(?:json|svg|xml)?/g, "");
    const at = raw.search(/<svg[\s>]/i), head = at >= 0 ? raw.slice(0, at) : raw;
    let j = null; const a = head.indexOf("{"), b = head.lastIndexOf("}");
    if (a >= 0 && b > a) { try { j = JSON.parse(head.slice(a, b + 1)); } catch (e) {} }
    return { j, svg: at >= 0 ? raw.slice(at) : (j && typeof j.svg === "string" ? j.svg : "") };
  }
  const sealed = (q) => { try { const G = window.IX_GIT; const s = G && G.sealedOf && G.sealedOf(q); return !!(s && !G.mocked(s)); } catch (e) { return false; } };
  const inflight = {};
  function explain(q, opts) {
    opts = opts || {};
    if (!q || !q.id || sealed(q)) return Promise.resolve(null);
    if (inflight[q.id]) return inflight[q.id];
    const p = (async () => {
      const hit = await get("q:" + q.id); if (hit) return hit;
      if (!canCall(opts.auto)) return null;
      const keyed = q.answerKeys && q.answerKeys.length;
      const user = "QUESTION (DIG-206 " + q.subject + " · " + q.chapter + "):\n" + q.stem + "\n" + q.options.map((o) => o.key + ") " + o.text).join("\n") +
        (keyed ? "\nKEY: " + q.answerKeys.join(", ") + (q.keyBy === "app" ? " (written by an app, not official: if it is wrong, say so in \"dispute\")" : " (official)") : "\nKEY: none (unsolved paper: give YOUR answer and say it is yours)");
      const sys = "You are a Kasr Al Ainy professor of anatomy, physiology, histology and biochemistry teaching a 2nd-year student (DIG-206: GIT, renal, metabolism) who must understand, not memorise. Answer with two parts and nothing else, no code fences. PART 1, one JSON object: " +
        '{"answer":"<letter>","why":"why the key is right: the mechanism or relation in 2-3 short sentences","options":{"a":"…","b":"…"},"trap":"the examiner\'s trap in one line","memory":"one memory hook","dispute":"","caption":"what the drawing shows, one line"}. PART 2, on the next line: the drawing as one raw <svg>…</svg> element (not inside the JSON). ' +
        "In \"options\" give EVERY option letter: for a wrong one say exactly why it is wrong (what it really is / where it really is / what it really does); for the right one say why it is right. Keep each to 1-2 sentences. Follow Kasr Al Ainy and Snell/Guyton/Junqueira facts. " +
        "The drawing must be made for THIS question: show the structures named in the stem and the options in their true relations, so a student sees why the key is right and the others are wrong. " + SVG_RULES;
      const raw = await call(sys, user, 3200);
      const { j, svg } = split(raw);
      if (!j || !j.options) throw new Error("the professor's answer could not be read");
      const out = { answer: String(j.answer || "").toLowerCase().slice(0, 1), why: String(j.why || ""), options: j.options, trap: String(j.trap || ""), memory: String(j.memory || ""), dispute: String(j.dispute || ""), caption: String(j.caption || ""), svg: cleanSvg(svg), at: Date.now() };
      await put("q:" + q.id, out); return out;
    })();
    inflight[q.id] = p; p.catch(() => {}).finally(() => { setTimeout(() => { delete inflight[q.id]; }, 0); });
    return p;
  }
  function topic(les, text, opts) {
    opts = opts || {};
    const k = "t:" + les.key;
    if (inflight[k]) return inflight[k];
    const p = (async () => {
      const hit = await get(k); if (hit) return hit;
      if (!canCall(opts.auto)) return null;
      const sys = "You draw teaching diagrams for a Kasr Al Ainy 2nd-year medical student (DIG-206). Answer with two parts and nothing else, no code fences. PART 1, one JSON object: {\"caption\":\"one line\",\"steps\":[\"how to draw it yourself, 4-6 short steps\"]}. PART 2, on the next line: the drawing as one raw <svg>…</svg> element. " +
        "The drawing is THE one diagram an examiner expects for this topic (relations, layers, a pathway or a mechanism), complete and accurate. " + SVG_RULES;
      const raw = await call(sys, "TOPIC: " + les.title + " (" + les.subject + ")\nLESSON SUMMARY:\n" + String(text || "").slice(0, 2500), 3000);
      const sp = split(raw), j = sp.j || {}, svg = cleanSvg(sp.svg); if (!svg) throw new Error("the drawing could not be read");
      const out = { svg, caption: String(j.caption || les.title), steps: Array.isArray(j.steps) ? j.steps.slice(0, 6).map(String) : [], at: Date.now() };
      await put(k, out); return out;
    })();
    inflight[k] = p; p.catch(() => {}).finally(() => { setTimeout(() => { delete inflight[k]; }, 0); });
    return p;
  }

  /* ── rendering ── */
  const md = (s) => (window.IX_HY && IX_HY.md ? IX_HY.md(s) : E(s));
  const figure = (svg, cap, who) => '<figure class="ixAxFig"><div class="ixAxDraw">' + svg + '</div><figcaption>✏️ ' + E(cap || "") + ' <small>' + who + "</small></figcaption></figure>";
  function renderExplain(host, q, sel, x) {
    const key = (q.answerKeys && q.answerKeys[0]) || x.answer;
    host.innerHTML = '<div class="ixAx">' + (x.svg ? figure(x.svg, x.caption || "Drawn for this question", "drawn for this question by the professor (AI): check the labels against your book") : "") +
      '<p class="ixAxWhy"><b>Why ' + E(String(key || "").toUpperCase()) + ":</b> " + md(x.why).replace(/^<p>|<\/p>$/g, "") + "</p>" +
      '<ol class="ixAxOpts">' + q.options.map((o) => { const right = (q.answerKeys || []).includes(o.key) || (!(q.answerKeys || []).length && o.key === x.answer); return '<li class="' + (right ? "ok" : "no") + (o.key === sel ? " mine" : "") + '"><b>' + (right ? "✓ " : "✗ ") + E(o.key.toUpperCase()) + ") " + E(o.text) + "</b>" + (o.key === sel ? ' <span class="ixAxYou">your answer</span>' : "") + "<span>" + E((x.options || {})[o.key] || (x.options || {})[o.key.toUpperCase()] || "") + "</span></li>"; }).join("") + "</ol>" +
      (x.trap ? '<p class="ixAxTrap">⚠️ <b>Trap:</b> ' + E(x.trap) + "</p>" : "") + (x.memory ? '<p class="ixAxMem">🧠 ' + E(x.memory) + "</p>" : "") +
      (x.dispute ? '<p class="ixAxDis">⚑ The professor questions this key: ' + E(x.dispute) + "</p>" : "") + "</div>";
  }
  function mountExplain(host, q, sel) {
    if (!host || !q) return;
    if (sealed(q)) return;
    if (!T() || !T().hasKey || !T().hasKey()) {
      host.innerHTML = '<div class="ixAx ixAxOff"><p>🔑 Connect your OpenRouter key and every answer gets <b>its own drawing</b> and <b>why each option is right or wrong</b>, written by the professor.</p><button type="button" class="ixHlink" data-axsetup>Connect the key</button></div>';
      const b = host.querySelector("[data-axsetup]"); if (b) b.onclick = async () => { if (window.IX_KEY && IX_KEY.ask) { const r = await IX_KEY.ask(); if (IX_KEY.has()) mountExplain(host, q, sel); return r; } try { T().openSetup ? T().openSetup("Connect your key: every answer gets its own drawing and every option explained.") : T().open(); } catch (e) {} };
      return;
    }
    host.innerHTML = '<div class="ixAx ixAxWait"><span class="ixAxSpin" aria-hidden="true"></span> The professor is drawing this answer and explaining every option…</div>';
    explain(q).then((x) => { if (!host.isConnected) return; if (x) renderExplain(host, q, sel, x); else host.innerHTML = '<div class="ixAx ixAxOff"><p>Your weekly AI budget is used up, so the drawing and the option-by-option explanation were not made. Raise the cap in the professor\'s settings.</p></div>'; })
      .catch((e) => { if (!host.isConnected) return; host.innerHTML = '<div class="ixAx ixAxOff"><p>Could not explain this one: ' + E(e.message) + '</p><button type="button" class="ixHlink" data-axretry>Try again</button></div>'; host.querySelector("[data-axretry]").onclick = () => mountExplain(host, q, sel); });
  }
  function mountTopic(host, les, text) {
    if (!host || !les) return;
    const draw = (x) => { host.innerHTML = figure(x.svg, x.caption, "the professor's drawing of this topic (AI)") + (x.steps && x.steps.length ? '<details class="ixAxSteps"><summary>✏️ Draw it yourself, step by step</summary><ol>' + x.steps.map((s) => "<li>" + E(s) + "</li>").join("") + "</ol></details>" : ""); };
    get("t:" + les.key).then((hit) => {
      if (hit) return draw(hit);
      if (!T() || !T().hasKey || !T().hasKey()) { host.innerHTML = ""; return; }
      host.innerHTML = '<div class="ixAx ixAxWait"><span class="ixAxSpin" aria-hidden="true"></span> The professor is drawing this topic…</div>';
      topic(les, text, { auto: true }).then((x) => { if (!host.isConnected) return; if (x) draw(x); else host.innerHTML = ""; })
        .catch((e) => { if (!host.isConnected) return; host.innerHTML = '<div class="ixAx ixAxOff"><p>The topic drawing could not be made: ' + E(e.message) + '</p><button type="button" class="ixHlink" data-axt>Try again</button></div>'; host.querySelector("[data-axt]").onclick = () => mountTopic(host, les, text); });
    });
  }
  // tap a drawing: full screen (pinch to zoom on a phone); tap again or Escape to close
  document.addEventListener("click", (e) => { const d = e.target.closest && e.target.closest(".ixAxDraw"); if (!d) return; d.classList.toggle("ixAxFull"); document.documentElement.classList.toggle("ixAxFullOn", d.classList.contains("ixAxFull")); });
  document.addEventListener("keydown", (e) => { if (e.key !== "Escape") return; document.querySelectorAll(".ixAxFull").forEach((d) => d.classList.remove("ixAxFull")); document.documentElement.classList.remove("ixAxFullOn"); });
  window.IX_AIX = { explain, topic, mountExplain, mountTopic, cleanSvg, prefetch: (q) => { if (q && !sealed(q) && canCall(true)) explain(q, { auto: true }).catch(() => {}); }, _get: get, _put: put, _sealed: sealed };
})();
