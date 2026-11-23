/* INTELLECTUALITY v50 · every AI call gets room to finish (owner, 23 Nov: "the professor writes incomplete answers").
 * Gemini 3.8 Flash (and other reasoning models) spend part of max_tokens thinking before they write, so the visible answer
 * was cut short. Every call to OpenRouter's chat endpoint now asks for brief, hidden reasoning and gets a larger answer
 * budget (max_tokens is a ceiling: you pay only for what is written). Key checks (max_tokens ≤ 20) are left alone. */
(function () {
  "use strict";
  if (window.__ixAiNet) return; window.__ixAiNet = true;
  const orig = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      const url = typeof input === "string" ? input : input && input.url;
      if (url && /openrouter\.ai\/api\/v1\/chat\/completions/.test(url) && init && typeof init.body === "string") {
        const b = JSON.parse(init.body);
        if (!(b.max_tokens <= 20)) {
          b.max_tokens = Math.min(16000, Math.max(4000, (b.max_tokens || 0) * 3));
          if (!b.reasoning) b.reasoning = { effort: "low", exclude: true };
          init = Object.assign({}, init, { body: JSON.stringify(b) });
        }
      }
    } catch (e) {}
    return orig(input, init);
  };
})();
