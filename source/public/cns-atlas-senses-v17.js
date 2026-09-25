/* INTELLECTUALITY v17 · CNS atlas: hearing, balance, the retina, and the facial nerve.
 * Cochlea with a pitch and loudness slider (place theory), the cochlear duct and organ of Corti, the
 * horizontal canals during rotation (endolymph lag, firing, nystagmus), the ten retinal layers, rod
 * phototransduction in the dark and in light, and facial nerve lesions with the face they produce.
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { E, md, smooth } = A;
  const { T, pf, ps, fl, box, leg } = A.kit;
  const bl = (pts) => smooth(pts, true);
  const RUN = new WeakMap();
  const raf = (card, fn) => {
    if (RUN.has(card)) return;
    RUN.set(card, true);
    const tick = (t) => {
      if (!card.isConnected) return RUN.delete(card);
      fn(t);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ═══════════════ COCHLEA (uncoiled): the travelling wave and place theory ═══════════════ */
  (function () {
    const X0 = 70,
      X1 = 440,
      YM = 150;
    const wBM = (x) => 3 + ((x - X0) / (X1 - X0)) * 14; // basilar membrane: narrow at the base, wide at the apex
    const posOf = (f) => X0 + 8 + (1 - Math.log(f / 20) / Math.log(1000)) * (X1 - X0 - 24);
    const svg = () =>
      '<text class="ttl" x="250" y="16" text-anchor="middle">COCHLEA, UNCOILED · BASE → APEX</text>' +
      pf("sv", "M" + X0 + " 88 L" + X1 + " 112 L" + X1 + " " + (YM - 6) + " L" + X0 + " " + (YM - 2) + " Z", "#66e9ff", "#132b44") +
      pf("st", "M" + X0 + " " + (YM + 2) + " L" + X1 + " " + (YM + 6) + " L" + X1 + " 188 L" + X0 + " 212 Z", "#66e9ff", "#10243a") +
      pf("bm", "M" + X0 + " " + (YM - 1.5) + " L" + X1 + " " + (YM - 8.5) + " L" + X1 + " " + (YM + 8.5) + " L" + X0 + " " + (YM + 1.5) + " Z", "#d9ff43", "#e9d9a8") +
      pf("hel", "M" + X1 + " 112 C" + (X1 + 26) + " 112 " + (X1 + 26) + " 188 " + X1 + ' 188 L' + X1 + " 170 C" + (X1 + 10) + " 170 " + (X1 + 10) + " 130 " + X1 + " 130 Z", "#66e9ff", "#1b3a5a") +
      pf("ow", "M" + (X0 - 6) + " 96 L" + X0 + " 96 L" + X0 + " 132 L" + (X0 - 6) + " 132 Z", "#ffd166", "#e8c36a") +
      pf("rw", "M" + (X0 - 6) + " 168 L" + X0 + " 168 L" + X0 + " 204 L" + (X0 - 6) + " 204 Z", "#66e9ff", "#9ec1dd") +
      '<g class="stapes"><path d="M' + (X0 - 8) + " 114 L" + (X0 - 40) + " 104 L" + (X0 - 40) + " 124 Z" + '" fill="#e8dcc8" stroke="#bda98c"/></g>' +
      '<path class="wave" d="" fill="none" stroke="#ff5d8f" stroke-width="2.6"/>' +
      '<path class="env" d="" fill="#ff5d8f22" stroke="#ff5d8f66" stroke-width="1" stroke-dasharray="3 3"/>' +
      '<g class="pk"><line x1="0" x2="0" y1="96" y2="206" stroke="#d9ff43" stroke-width="1.4" stroke-dasharray="4 3"/><text class="lab sm" x="0" y="228" text-anchor="middle">peak</text></g>' +
      T(X0 - 24, 92, "oval window + stapes", "sm", "start") + T(X0 - 24, 222, "round window", "sm", "start") + T(X1 + 24, 150, "helicotrema", "sm", "end") +
      T(X0 + 110, 104, "scala vestibuli", "sm mut") + T(X0 + 110, 200, "scala tympani", "sm mut") +
      T(X0 + 10, 262, "BASE: narrow, stiff, short fibres → HIGH pitch", "sm", "start") + T(X1, 282, "APEX: wide, floppy, long fibres → LOW pitch", "sm", "end") +
      '<g class="ov" data-x="dead"><path d="M' + (X0 + 2) + " " + (YM - 12) + " L" + (X0 + 80) + " " + (YM - 14) + " L" + (X0 + 80) + " " + (YM + 14) + " L" + (X0 + 2) + " " + (YM + 12) + 'Z" fill="url(#ixHatch)" stroke="#ff5d7a"/></g>';
    const live = (card, sim) => {
      const st = RUN.get(card) ? card._coch : (card._coch = { f: 1000, amp: 1 });
      if (sim) {
        if (sim.f) st.f = sim.f;
        if (sim.amp) st.amp = sim.amp;
      }
      const info = card.querySelector(".ixAInfo");
      if (!info.querySelector(".ixARange")) {
        info.insertAdjacentHTML(
          "beforeend",
          '<div class="ixARow"><label style="flex:1;min-width:220px;font-size:13px;color:#cfe0f4">Pitch <b class="fv"></b><input class="ixARange fr" type="range" min="0" max="1000" step="1"></label><label style="flex:1;min-width:160px;font-size:13px;color:#cfe0f4">Loudness <b class="av"></b><input class="ixARange ar" type="range" min="30" max="160" step="1"></label></div>',
        );
        const fr = info.querySelector(".fr"),
          ar = info.querySelector(".ar");
        const sync = () => {
          fr.value = Math.round((Math.log(st.f / 20) / Math.log(1000)) * 1000);
          ar.value = Math.round(st.amp * 100);
          info.querySelector(".fv").textContent = st.f >= 1000 ? (st.f / 1000).toFixed(st.f >= 10000 ? 0 : 1) + " kHz" : Math.round(st.f) + " Hz";
          info.querySelector(".av").textContent = st.amp > 1.2 ? "loud" : st.amp < 0.7 ? "soft" : "normal";
        };
        fr.addEventListener("input", () => {
          st.f = 20 * Math.pow(1000, fr.value / 1000);
          sync();
        });
        ar.addEventListener("input", () => {
          st.amp = ar.value / 100;
          sync();
        });
        sync();
      }
      raf(card, (t) => {
        const xp = posOf(st.f),
          wave = card.querySelector(".wave"),
          env = card.querySelector(".env"),
          pk = card.querySelector(".pk");
        if (!wave) return;
        const still = !!card.querySelector(".ixStill");
        let d = "",
          e1 = "",
          e2 = "";
        for (let x = X0 + 2; x <= X1; x += 3) {
          const rel = (x - X0) / (xp - X0 + 1e-6);
          // grows slowly towards the peak, then dies out quickly beyond it
          const a = (x <= xp ? Math.pow(Math.max(0, rel), 2.2) : Math.exp(-Math.pow((x - xp) / 16, 2))) * 22 * st.amp * (1 + (x - X0) / 900);
          const k = 0.03 + (1 - (x - X0) / (X1 - X0)) * 0.04 + 0.1 * Math.max(0, rel - 0.6);
          const y = YM + a * Math.sin(k * (x - X0) * 3 - (still ? 0 : t / 180));
          d += (d ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
          e1 += (e1 ? " L" : "M") + x.toFixed(1) + " " + (YM - a).toFixed(1);
          e2 = " L" + x.toFixed(1) + " " + (YM + a).toFixed(1) + e2;
        }
        wave.setAttribute("d", d);
        env.setAttribute("d", e1 + e2.replace(/^ L/, " L") + " Z");
        pk.setAttribute("transform", "translate(" + xp.toFixed(1) + " 0)");
      });
    };
    A.scene("cochlea", {
      title: "Cochlea · slide the pitch, watch where the membrane peaks",
      vb: "20 0 460 292",
      svg,
      intro: "The stapes pushes the **oval window** → a **travelling wave** runs from base to apex → it peaks at one **place** → that place is the **pitch**. The **round window** bulges out as the pressure-relief valve.",
      parts: {
        bm: ["Basilar membrane", "**Narrow and stiff at the base** (short, thick fibres), **wide and flexible at the apex**. Fibres decrease in diameter base → apex. Carries the organ of Corti."],
        ow: ["Oval window", "The **stapes** footplate sits here."],
        rw: ["Round window", "The **pressure-relief valve**: bulges out when the stapes pushes in."],
        sv: ["Scala vestibuli", "Perilymph (high Na⁺)."],
        st: ["Scala tympani", "Perilymph; ends at the round window."],
        hel: ["Helicotrema", "At the apex, where the two scalae meet: the **low**-frequency end."],
      },
      drill: ["bm", "ow", "rw", "sv", "st", "hel"],
      sims: [
        { id: "high", f: 8000, amp: 1, label: "High pitch", info: "**High frequency** peaks near the **base**, close to the oval window. So high-frequency hearing loss = damage **closest to the oval window**." },
        { id: "low", f: 150, amp: 1, label: "Low pitch", info: "**Low frequency** peaks near the **apex** (helicotrema) and stimulates a **larger** stretch of the membrane." },
        { id: "loud", f: 1000, amp: 1.55, label: "Loud", info: "**Loudness** = a larger **amplitude** of basilar-membrane vibration → more hair cells excited and **faster** firing. Very loud sound spreads the stimulated area." },
        { id: "noise", f: 6000, amp: 1, label: "Noise damage", show: ["dead"], info: "Noise and ageing kill hair cells at the **base** first → **high-frequency** loss while low tones are still heard." },
      ],
      live,
      secs: { "ph-inner-ear#1": "high", "ph-middle-ear#0": "loud", "ph-middle-ear#1": "" },
      rules: [
        [/high.?frequen|high.?pitch|oval window/i, "high"],
        [/low.?frequen|low.?pitch|helicotrema|apex/i, "low"],
        [/loud|amplitude|decibel/i, "loud"],
        [/basilar membrane|place (theory|principle)|travell?ing wave|round window/i, ""],
      ],
    });
  })();

  /* ═══════════════ COCHLEAR DUCT AND THE ORGAN OF CORTI ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">COCHLEAR DUCT IN SECTION · MODIOLUS ON THE LEFT</text>' +
      pf("sv", "M60 40 L440 40 L440 118 L130 118 Z", "#66e9ff", "#132b44") + T(300, 64, "scala vestibuli · perilymph (Na⁺)", "sm") +
      pf("sm", "M130 120 L420 120 L420 236 L150 236 Z", "#d9ff43", "#1d3a2c") + T(380, 150, "scala media · ENDOLYMPH", "sm") + T(380, 164, "high K⁺ · +80 mV", "sm") +
      pf("st", "M60 240 L440 240 L440 330 L60 330 Z", "#66e9ff", "#10243a") + T(300, 314, "scala tympani · perilymph (Na⁺)", "sm") +
      '<path class="ps" data-p="rm" d="M130 120 L420 120" style="--c:#66e9ff;--r:#9ec1dd;--w:2.4"/>' + T(262, 114, "vestibular (Reissner's) membrane", "sm") +
      pf("sva", "M420 118 L446 118 L446 242 L420 242 Z", "#ff5d7a", "#b54a5c") + T(414, 208, "stria", "sm", "end") + T(414, 220, "vascularis", "sm", "end") +
      pf("lim", "M60 100 C100 100 130 108 150 132 L150 236 L60 236 Z", "#ffb86b", "#34465c") + T(96, 160, "spiral", "sm", "middle") + T(96, 172, "limbus", "sm", "middle") +
      '<g class="org" style="transition:transform .5s">' +
      '<path class="ps" data-p="bm" d="M150 238 L420 238" style="--c:#d9ff43;--r:#e9d9a8;--w:4"/>' +
      pf("tun", "M214 236 L232 188 L250 236 Z", "#66e9ff", "#0b1828") +
      pf("pil", "M212 236 L230 186 L234 186 L218 236 Z M252 236 L234 186 L238 186 L256 236 Z", "#ffd166", "#d6c49a") +
      pf("iph", bl([[178, 236], [180, 200], [196, 194], [206, 204], [206, 236]]), "#b39cff", "#b8a8c9") +
      '<path class="pf" data-p="ihc" d="M184 196 C182 184 196 178 200 190 C202 200 194 208 186 204Z" style="--c:#ff5d8f;--r:#e98aa8"/>' +
      [262, 284, 306].map((x) => '<rect class="pf" data-p="ohc" x="' + x + '" y="178" width="12" height="30" rx="5" style="--c:#ff9f43;--r:#e6a77a"/>' + '<rect class="pf" data-p="dei" x="' + (x - 1) + '" y="208" width="14" height="28" rx="3" style="--c:#b39cff;--r:#b8a8c9"/>').join("") +
      pf("hen", bl([[322, 236], [326, 190], [352, 196], [372, 218], [376, 236]]), "#7bed9f", "#b9cfbe") +
      // stereocilia and the tectorial membrane
      '<g class="cilia"><path d="M188 180 l-2 -8 M192 179 l0 -9 M196 180 l2 -8" stroke="#fff" stroke-width="1.4"/>' + [268, 290, 312].map((x) => '<path d="M' + (x - 3) + " 177 l-1 -9 M" + x + " 176 l0 -10 M" + (x + 3) + ' 177 l1 -9" stroke="#fff" stroke-width="1.4"/>').join("") + "</g>" +
      '<path class="pf" data-p="tm" d="M138 150 C180 150 260 158 330 162 C340 163 342 170 330 170 C260 170 190 170 150 164 C138 160 134 152 138 150Z" style="--c:#66e9ff;--r:#9ec1dd"/>' +
      "</g>" +
      // modiolus with the spiral ganglion and cochlear nerve fibres
      '<rect x="20" y="40" width="40" height="290" fill="#0e1a2a" stroke="#223a55" pointer-events="none"/>' +
      '<ellipse class="pf" data-p="sg" cx="40" cy="250" rx="16" ry="22" style="--c:#66e9ff;--r:#6f8aa8"/>' + T(40, 284, "spiral", "sm") + T(40, 296, "ganglion", "sm") +
      '<path class="ps" data-p="aff" d="M56 250 C100 250 150 226 188 206 M56 256 C120 260 200 230 268 210" style="--c:#66e9ff;--r:#6f8aa8;--w:1.6"/>' +
      T(190, 230, "IHC", "sm dk") + T(290, 172, "OHCs", "sm") + T(232, 232, "tunnel", "sm") + T(348, 226, "Hensen", "sm dk") + T(214, 156, "tectorial membrane", "sm dk") + T(286, 256, "basilar membrane", "sm") +
      fl("kin", "M300 128 L300 170 M190 128 L190 172", "#ffd166", 3, "1.2s") + '<g class="ov" data-x="kin">' + T(245, 136, "K⁺ in from endolymph", "sm") + "</g>";
    const live = (card, sim) => {
      const g = card.querySelector(".org");
      if (g) g.style.transform = sim && sim.id === "up" ? "translateY(-7px)" : sim && sim.id === "down" ? "translateY(6px)" : "";
    };
    A.scene("duct", {
      title: "Cochlear duct · where sound becomes a nerve signal",
      vb: "10 0 470 340",
      svg,
      intro: "A triangle of **endolymph**: roof = Reissner's membrane, floor = **basilar membrane** with the organ of Corti, outer wall = **stria vascularis**. Hair-cell tops sit in endolymph; their bases in perilymph.",
      parts: {
        sv: ["Scala vestibuli", "Perilymph: high Na⁺, low K⁺ (like extracellular fluid)."],
        st: ["Scala tympani", "Perilymph."],
        sm: ["Scala media (cochlear duct)", "**Endolymph**: high K⁺, low Na⁺ (like intracellular fluid), **+80 mV**. The receptor for **hearing** (not balance)."],
        rm: ["Vestibular (Reissner's) membrane", "The roof of the duct."],
        sva: ["Stria vascularis", "**Makes endolymph** and the **+80 mV endocochlear potential**. Hair cells are −70 mV inside → ~150 mV drives K⁺ in."],
        bm: ["Basilar membrane", "The floor; carries the organ of Corti."],
        ihc: ["Inner hair cell", "**One row**, flask-shaped, **completely surrounded by inner phalangeal cells**. ~3,500 cells but **~90–95% of the afferent** fibres: hearing is sent mainly by them."],
        ohc: ["Outer hair cells", "**3–4 rows**, cylindrical, ~12,000. Receive most **efferents**. **Motile** (prestin): shorten when depolarized → **amplify and sharpen** basilar-membrane movement."],
        pil: ["Pillar cells", "Inner and outer pillars form the **tunnel of Corti**; contain **keratin** bundles; **not** in direct contact with the hair cells."],
        tun: ["Tunnel of Corti", "Formed by the pillar cells."],
        iph: ["Inner phalangeal cells", "One row; surround the inner hair cells completely."],
        dei: ["Outer phalangeal (Deiters') cells", "Support the outer hair cells at their bases: **phalangeal cells give direct support**."],
        hen: ["Hensen's cells", "Support the outer edge."],
        tm: ["Tectorial membrane", "Covers the hair cells; **no calcium carbonate** (unlike otolithic membranes)."],
        sg: ["Spiral ganglion", "In the modiolus: cell bodies of the cochlear nerve fibres (not the brainstem nuclei)."],
        aff: ["Cochlear nerve fibres", "Most come from the inner hair cells."],
        lim: ["Spiral limbus", ""],
      },
      drill: ["ihc", "ohc", "pil", "tun", "dei", "hen", "tm", "sva", "rm", "bm", "sg", "sm"],
      sims: [
        { id: "k", label: "K⁺ and +80 mV", on: ["sm", "sva", "ihc", "ohc"], show: ["kin"], info: "The **stria vascularis** pumps K⁺ into the endolymph (+80 mV). When the stereocilia bend, channels open and **K⁺ flows in** from the endolymph → depolarization." },
        { id: "up", label: "Membrane up", on: ["bm", "ihc", "ohc", "tm"], info: "**Upward** movement (towards the scala vestibuli) bends the stereocilia **away from the modiolus** against the tectorial membrane → **depolarization**. Downward → hyperpolarization." },
        { id: "ohc", label: "Outer = amplifier", on: ["ohc", "dei"], info: "Outer hair cells **shorten when depolarized** (prestin) and so **modify the movements of the basilar membrane**. Damage → they **fail to shorten** → lost sensitivity." },
        { id: "ihc", label: "Inner = messenger", on: ["ihc", "aff", "sg", "iph"], info: "Few inner hair cells, but they carry **~95% of the afferent** signal to the spiral ganglion." },
      ],
      live,
      secs: { "ph-inner-ear#0": "k", "ph-inner-ear#2": "ohc", "hi-ear#3": "", "hi-ear#2": "" },
      rules: [
        [/endolymph|stria vascularis|endocochlear|\+80/i, "k"],
        [/outer hair|prestin|motile/i, "ohc"],
        [/inner hair|spiral ganglion/i, "ihc"],
        [/pillar|phalangeal|deiters|hensen|tectorial|organ of corti/i, ""],
      ],
    });
  })();

  /* ═══════════════ SEMICIRCULAR CANALS: turning, endolymph lag, nystagmus ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">HEAD FROM ABOVE · THE TWO HORIZONTAL CANALS</text>' +
      '<g class="head" style="transform-origin:240px 150px;transition:transform .6s"><ellipse cx="240" cy="150" rx="118" ry="124" fill="#1b2d44" stroke="#3a5b80" stroke-width="2"/><path d="M228 30 L240 14 L252 30" fill="#3a5b80"/>' + T(240, 44, "nose", "sm mut") +
      '<circle class="ps" data-p="can.R" cx="150" cy="160" r="44" style="--c:#66e9ff;--r:#4f7fa8;--w:8"/><circle class="ps" data-p="can.L" cx="330" cy="160" r="44" style="--c:#66e9ff;--r:#4f7fa8;--w:8"/>' +
      '<ellipse class="pf" data-p="amp.R" cx="172" cy="120" rx="12" ry="10" style="--c:#d9ff43;--r:#7fa6c9"/><ellipse class="pf" data-p="amp.L" cx="308" cy="120" rx="12" ry="10" style="--c:#d9ff43;--r:#7fa6c9"/>' +
      '<path class="cup" data-side="R" d="M172 112 L172 128" stroke="#fff" stroke-width="3" stroke-linecap="round" style="transform-origin:172px 128px;transition:transform .4s"/>' +
      '<path class="cup" data-side="L" d="M308 112 L308 128" stroke="#fff" stroke-width="3" stroke-linecap="round" style="transform-origin:308px 128px;transition:transform .4s"/>' +
      '<g class="endo" data-side="R"></g><g class="endo" data-side="L"></g>' +
      "</g>" +
      T(150, 226, "RIGHT canal", "sm") + T(330, 226, "LEFT canal", "sm") + T(240, 250, "yellow = endolymph relative to the canal", "sm mut") +
      // firing rates and eyes
      '<g transform="translate(0 290)">' + T(66, 12, "R nerve", "sm", "end") + '<rect x="72" y="2" width="130" height="12" rx="6" fill="#0b1828" stroke="#2a4260"/><rect class="rate" data-side="R" x="74" y="4" width="63" height="8" rx="4" fill="#5ef0a0" style="transition:width .4s"/>' +
      T(290, 12, "L nerve", "sm", "end") + '<rect x="296" y="2" width="130" height="12" rx="6" fill="#0b1828" stroke="#2a4260"/><rect class="rate" data-side="L" x="298" y="4" width="63" height="8" rx="4" fill="#5ef0a0" style="transition:width .4s"/></g>' +
      '<g transform="translate(0 316)"><ellipse cx="206" cy="16" rx="22" ry="12" fill="#f4f7fb"/><ellipse cx="274" cy="16" rx="22" ry="12" fill="#f4f7fb"/><circle class="eyeb" cx="206" cy="16" r="7" fill="#4f86b5" style="transition:transform .3s"/><circle class="eyeb" cx="274" cy="16" r="7" fill="#4f86b5" style="transition:transform .3s"/><text class="nys lab sm" x="240" y="42" text-anchor="middle"></text></g>' +
      '<g class="turn"></g>';
    const PH = {
      start: { head: 1, endo: -1, R: 1, L: -1, eye: "slow ← · fast →", nys: "nystagmus to the RIGHT (named by the fast phase)" },
      const: { head: 1, endo: 0, R: 0, L: 0, eye: "none", nys: "no nystagmus: the endolymph has caught up" },
      stop: { head: 0, endo: 1, R: -1, L: 1, eye: "slow → · fast ←", nys: "post-rotational nystagmus to the LEFT; feels like turning left" },
    };
    // endolymph drawn along the lower part of each canal: dir < 0 = counter-clockwise (seen from above), > 0 = clockwise
    const arc = (cx, dir) =>
      dir < 0
        ? '<path d="M' + (cx - 38) + " 182 A44 44 0 0 0 " + (cx + 38) + ' 182" fill="none" stroke="#ffd166" stroke-width="3" marker-end="url(#ixArr)"/>'
        : '<path d="M' + (cx + 38) + " 182 A44 44 0 0 1 " + (cx - 38) + ' 182" fill="none" stroke="#ffd166" stroke-width="3" marker-end="url(#ixArr)"/>';
    const live = (card, sim) => {
      const p = PH[sim ? sim.id : ""] || null,
        still = !!card.querySelector(".ixStill");
      card.querySelectorAll(".cup").forEach((c) => (c.style.transform = p && p.endo ? "rotate(" + (p.endo * (c.dataset.side === "R" ? -1 : 1) * 28) + "deg)" : ""));
      card.querySelectorAll(".endo").forEach((g) => {
        const cx = g.dataset.side === "R" ? 150 : 330;
        g.innerHTML = p && p.endo ? arc(cx, p.endo) : "";
      });
      card.querySelectorAll(".rate").forEach((r) => {
        const v = p ? p[r.dataset.side] : 0;
        r.setAttribute("width", v > 0 ? 122 : v < 0 ? 18 : 63);
        r.setAttribute("fill", v > 0 ? "#5ef0a0" : v < 0 ? "#ff6e8a" : "#5ef0a0");
      });
      const head = card.querySelector(".head");
      if (head) head.style.animation = "none";
      const turn = card.querySelector(".turn");
      if (turn) turn.innerHTML = p && p.head ? '<path d="M340 40 A120 120 0 0 1 380 90" fill="none" stroke="#d9ff43" stroke-width="3" marker-end="url(#ixArr)"/>' + T(400, 36, "turning RIGHT", "sm", "end") : p ? T(400, 36, "stopped", "sm", "end") : "";
      card.querySelectorAll(".eyeb").forEach((e) => (e.style.animation = p && p.endo && !still ? (p.endo < 0 ? "ixNysR 1.1s linear infinite" : "ixNysL 1.1s linear infinite") : "none"));
      const n = card.querySelector(".nys");
      if (n) n.textContent = p ? p.nys : "";
    };
    A.scene("vest", {
      title: "Semicircular canals · start, spin, stop",
      vb: "20 0 440 372",
      svg,
      intro: "The canals sense **angular acceleration** (a change in the speed of turning), not steady turning. Pick a phase and watch the endolymph lag, the firing and the eyes.",
      parts: {
        can: ["Horizontal (lateral) canal", "The two horizontal canals are a **coplanar pair** (and each anterior canal with the opposite posterior canal)."],
        amp: ["Ampulla with its crista and cupula", "The jelly **cupula** is pushed by the endolymph; hair cells fire more when the stereocilia bend **towards the kinocilium** (K⁺ in → depolarize)."],
      },
      drill: ["can", "amp"],
      sims: [
        { id: "start", label: "▶ Start turning right", info: "Start of rotation to the **right**: the endolymph **lags**, moving **left** relative to the canal → the **right** crista bends towards the kinocilium → **right nerve fires more**, left less. Eyes: **slow** drift **left** (keeps the image steady), **fast** flick **right** = nystagmus to the right." },
        { id: "const", label: "⟳ Constant speed", info: "At **constant speed** the endolymph catches up, the cupulae return upright, the discharge is **symmetrical** again: **no stimulation, no nystagmus**." },
        { id: "stop", label: "■ Stop", info: "On **stopping**, the endolymph keeps moving → the **opposite (left)** canal is excited → you feel turning to the left; **post-rotational** nystagmus, past-pointing, falling, and **tone changes** come from the canals **opposite** to the rotation." },
      ],
      live,
      secs: { "ph-vestibular#0": "start", "ph-vestibular#2": "start", "ph-vestibular#3": "stop", "hi-ear#4": "" },
      rules: [
        [/post-?rotat|stop/i, "stop"],
        [/constant (speed|velocity|rotation)/i, "const"],
        [/nystagmus|rotat|semicircular|endolymph.{0,40}(lag|move)|ampull|cupula|kinocili/i, "start"],
      ],
    });
  })();

  /* ═══════════════ RETINA: the ten layers and the path of light and signal ═══════════════ */
  (function () {
    const LY = [
      ["l10", "Inner limiting membrane", 34, 6, "Müller end-feet + basal lamina."],
      ["l9", "Nerve fibre layer", 40, 16, "**Unmyelinated** ganglion-cell axons (myelinated only behind the eye) → optic nerve."],
      ["l8", "Ganglion cell layer", 56, 30, "Ganglion cells: the **only** retinal cells that fire **action potentials**; they fire even in the dark."],
      ["l7", "Inner plexiform layer", 86, 22, "Synapses: **bipolar → amacrine → ganglion**."],
      ["l6", "Inner nuclear layer", 108, 44, "Nuclei of **bipolar, horizontal, amacrine and Müller** cells."],
      ["l5", "Outer plexiform layer", 152, 20, "Synapses: **rods and cones → bipolar and horizontal** cells."],
      ["l4", "Outer nuclear layer", 172, 40, "Nuclei of the **rods and cones**."],
      ["l3", "Outer limiting membrane", 212, 5, "Junctions between **photoreceptors and Müller cells**."],
      ["l2", "Rods and cones", 217, 52, "Inner and **outer segments** (the photopigment is in the outer segment)."],
      ["l1", "Pigment epithelium", 269, 22, "**Melanin** stops light scattering; stores **vitamin A**; recycles retinal; eats old discs. The outermost layer."],
    ];
    const svg = () =>
      '<text class="ttl" x="200" y="16" text-anchor="middle">RETINA · LIGHT COMES FROM THE VITREOUS (TOP)</text>' +
      LY.map(([id, , y, h], i) => '<rect class="pf" data-p="' + id + '" x="60" y="' + y + '" width="280" height="' + h + '" style="--c:#d9ff43;--r:' + (i % 2 ? "#152a42" : "#11233a") + ';--rs:#1f3550"/>').join("") +
      LY.map(([id, name, y, h], i) => T(348, y + h / 2 + 3, 10 - i + " · " + name, "sm", "start")).join("") +
      '<rect x="60" y="291" width="280" height="24" fill="#3a1f2c" pointer-events="none"/>' + T(200, 307, "choroid", "sm mut") +
      // photoreceptors: rods (long thin) and cones (short, tapered)
      [80, 104, 152, 176, 224, 248, 296, 320].map((x) => '<path class="pf" data-p="rod" d="M' + (x - 3) + " 218 L" + (x + 3) + " 218 L" + (x + 3) + " 266 L" + (x - 3) + ' 266 Z" style="--c:#66e9ff;--r:#7fa6c9"/><circle cx="' + x + '" cy="188" r="5" fill="#5b7894" pointer-events="none"/><path d="M' + x + " 193 L" + x + ' 216" stroke="#5b7894" stroke-width="1.2" pointer-events="none"/>').join("") +
      [128, 200, 272].map((x) => '<path class="pf" data-p="cone" d="M' + (x - 6) + " 218 L" + (x + 6) + " 218 L" + (x + 3) + " 250 L" + (x - 3) + ' 250 Z" style="--c:#ff9f43;--r:#d99b6a"/><circle cx="' + x + '" cy="200" r="6" fill="#8a6b52" pointer-events="none"/><path d="M' + x + " 206 L" + x + ' 216" stroke="#8a6b52" stroke-width="1.4" pointer-events="none"/>').join("") +
      // bipolar, horizontal, amacrine, ganglion cells, Müller cell
      [110, 200, 290].map((x) => '<ellipse class="pf" data-p="bp" cx="' + x + '" cy="128" rx="6" ry="8" style="--c:#7bed9f;--r:#6aa885"/><path class="ps" data-p="bp" d="M' + x + " 136 L" + x + " 160 M" + x + " 120 L" + x + ' 94" style="--c:#7bed9f;--r:#6aa885;--w:1.6"/>').join("") +
      '<ellipse class="pf" data-p="hz" cx="160" cy="146" rx="8" ry="5" style="--c:#ffd166;--r:#b8a26a"/><path class="ps" data-p="hz" d="M120 158 L200 158" style="--c:#ffd166;--r:#b8a26a;--w:1.4"/>' +
      '<ellipse class="pf" data-p="am" cx="250" cy="112" rx="8" ry="5" style="--c:#b39cff;--r:#8f7fc1"/><path class="ps" data-p="am" d="M220 96 L280 96" style="--c:#b39cff;--r:#8f7fc1;--w:1.4"/>' +
      [120, 210, 300].map((x) => '<circle class="pf" data-p="gc" cx="' + x + '" cy="70" r="9" style="--c:#ff5d8f;--r:#b36a8a"/><path class="ps" data-p="gc" d="M' + x + " 61 L" + x + " 50 L" + (x + 40) + ' 48" style="--c:#ff5d8f;--r:#b36a8a;--w:1.6"/>').join("") +
      '<path class="ps" data-p="mu" d="M334 34 L334 214 M328 34 L340 34 M328 212 L340 212" style="--c:#66e9ff;--r:#6f8aa8;--w:2.4"/>' + '<ellipse cx="334" cy="128" rx="4" ry="7" fill="#6f8aa8" pointer-events="none"/>' +
      fl("light", "M200 0 L200 262", "#fff6b0", 5, "1.6s") + fl("sig", "M176 250 L176 196 L176 160 L200 136 L200 96 L210 78 L210 50 L250 48", "#5ef0a0", 3, "2s");
    A.scene("retina", {
      title: "Retina · ten layers, light in, signal out",
      vb: "40 0 440 318",
      svg,
      intro: "Light crosses the whole retina to reach the **photoreceptors** at the back; the signal travels **forwards**: photoreceptor → **bipolar** → **ganglion** → optic nerve. Tap any layer or cell.",
      parts: Object.assign(Object.fromEntries(LY.map(([id, n, , , t]) => [id, [n, t]])), {
        rod: ["Rod", "**Rhodopsin**, dim light (scotopic), no colour, peripheral; many rods share one ganglion cell (low acuity). Dark-adapts more but more slowly."],
        cone: ["Cone", "Three photopsins; bright light, **colour and fine detail**; packed in the **fovea**."],
        bp: ["Bipolar cell", "Photoreceptors synapse on bipolar and horizontal cells, **never directly** on ganglion cells."],
        hz: ["Horizontal cell", "**Lateral inhibition** → enhanced **contrast** (edges)."],
        am: ["Amacrine cell", "Shapes timing and movement signals in the inner plexiform layer."],
        gc: ["Ganglion cell", "Fires **action potentials** (the others give graded potentials). Axons → **lateral geniculate** (and superior colliculus, pretectum)."],
        mu: ["Müller cell", "**Glial**, spans the whole retina; nucleus in the **inner nuclear layer**; forms **both** limiting membranes."],
      }),
      drill: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "rod", "cone", "bp", "hz", "gc", "mu"],
      sims: [
        { id: "path", label: "▶ Light and signal", show: ["light", "sig"], on: ["rod", "cone", "bp", "gc"], info: "Light (yellow) passes inwards → outwards to the photoreceptors; the signal (green) comes back: photoreceptor → **bipolar** → **ganglion** → nerve fibre layer." },
        { id: "muller", label: "Müller cell", on: ["mu", "l10", "l3", "l6"], info: "**Müller cells** are glia. Their nuclei are in the **inner nuclear** layer; their end-feet make the **inner** limiting membrane; their junctions with photoreceptors make the **outer** limiting membrane." },
        { id: "nuclei", label: "Which nuclei where", on: ["l4", "l6", "l8"], info: "**Outer nuclear** = rods and cones. **Inner nuclear** = bipolar, horizontal, amacrine, Müller. **Ganglion cell layer** = ganglion cells." },
        { id: "synapse", label: "Which synapses where", on: ["l5", "l7"], info: "**Outer plexiform**: photoreceptors → bipolar + horizontal. **Inner plexiform**: bipolar + amacrine → ganglion." },
      ],
      secs: { "ph-retina#0": "path", "ph-retina#1": "path", "hi-eye#4": "", "hi-eye#5": "nuclei", "hi-eye#6": "" },
      rules: [
        [/m[uü]ller|limiting membrane/i, "muller"],
        [/nuclear layer|nuclei of/i, "nuclei"],
        [/plexiform/i, "synapse"],
        [/retina|bipolar|ganglion cell|horizontal cell|amacrine|pigment epith/i, "path"],
      ],
    });
  })();

  /* ═══════════════ ROD: dark current and phototransduction ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">ROD · DARK vs LIGHT</text>' +
      pf("os", "M160 30 L220 30 L220 160 L160 160 Z", "#66e9ff", "#18324d") +
      Array.from({ length: 11 }, (_, i) => '<rect class="pf" data-p="disc" x="166" y="' + (36 + i * 11) + '" width="48" height="6" rx="3" style="--c:#b39cff;--r:#6d5a99"/>').join("") +
      pf("is", "M166 164 L214 164 L210 214 L170 214 Z", "#ffb86b", "#6b5642") + '<path d="M190 160 L190 166" stroke="#9fb4cc" stroke-width="3"/>' +
      pf("nuc", "M190 218 C206 218 212 230 212 242 C212 256 204 264 190 264 C176 264 168 256 168 242 C168 230 174 218 190 218Z", "#8fd3ff", "#3b556f") +
      '<path d="M190 264 L190 292" stroke="#6f8aa8" stroke-width="4"/>' + pf("syn", "M170 292 L210 292 L204 306 L176 306 Z", "#5ef0a0", "#3f6f58") +
      '<rect x="160" y="316" width="60" height="10" rx="4" fill="#2a3f58"/>' + T(190, 338, "bipolar cell", "sm mut") +
      '<rect class="pf" data-p="cng" x="152" y="70" width="10" height="16" rx="3" style="--c:#ff5d8f;--r:#a86a86"/><rect class="pf" data-p="cng" x="218" y="100" width="10" height="16" rx="3" style="--c:#ff5d8f;--r:#a86a86"/>' +
      T(150, 66, "cGMP-gated Na⁺ channel", "sm", "end") + T(150, 150, "discs with rhodopsin", "sm", "end") + T(232, 190, "inner segment", "sm", "start") + T(232, 246, "nucleus", "sm", "start") + T(232, 300, "synaptic terminal", "sm", "start") +
      // dark state
      '<g class="ov" data-x="dark">' + [[140, 78], [132, 78], [246, 108], [254, 108]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3.4" fill="#ffd166" class="blink"/>').join("") + '<path d="M128 78 L150 78 M258 108 L230 108" stroke="#ffd166" stroke-width="1.6" marker-end="url(#ixArr)"/>' +
      Array.from({ length: 10 }, (_, i) => '<circle cx="' + (172 + (i % 5) * 9) + '" cy="' + (48 + Math.floor(i / 5) * 60) + '" r="2.6" fill="#d9ff43"/>').join("") +
      Array.from({ length: 9 }, (_, i) => '<circle cx="' + (176 + (i % 3) * 14) + '" cy="' + (310 + Math.floor(i / 3) * 4) + '" r="2.2" fill="#5ef0a0"/>').join("") +
      T(92, 110, "Na⁺ IN = dark current", "sm", "middle") + T(92, 124, "cGMP high", "sm", "middle") + T(92, 246, "−40 mV (depolarized)", "sm", "middle") + T(92, 302, "glutamate ↑", "sm", "middle") + "</g>" +
      // light state
      '<g class="ov" data-x="lit"><path d="M300 30 L226 78" stroke="#fff6b0" stroke-width="4" marker-end="url(#ixArr)"/>' + T(304, 30, "photon", "sm", "start") +
      '<g transform="translate(300 60)">' + [["11-cis → all-trans retinal", "#b39cff"], ["metarhodopsin II", "#b39cff"], ["→ transducin (G protein)", "#66e9ff"], ["→ phosphodiesterase", "#66e9ff"], ["→ cGMP ↓", "#ff5d8f"], ["→ Na⁺ channels CLOSE", "#ff5d8f"], ["→ −70 mV hyperpolarized", "#ff9f43"], ["→ glutamate ↓", "#5ef0a0"]].map(([t, c], i) => '<text x="0" y="' + i * 17 + '" font-size="10.5" font-weight="850" fill="' + c + '">' + E(t) + "</text>").join("") + "</g>" +
      '<path d="M140 78 L152 78" stroke="#ff5d7a" stroke-width="3"/><path d="M232 108 L244 108" stroke="#ff5d7a" stroke-width="3"/>' + "</g>";
    A.scene("rod", {
      title: "Rod · why light makes it go quiet",
      vb: "40 0 440 346",
      svg,
      intro: "Switch between **dark** and **light**. In the dark the rod is **depolarized** and releasing transmitter; light **hyperpolarizes** it and **cuts** the release.",
      parts: {
        os: ["Outer segment", "Stacked discs full of **rhodopsin** (scotopsin + **11-cis retinal**)."],
        disc: ["Disc with rhodopsin", "Light isomerizes **11-cis → all-trans** retinal → **metarhodopsin II** → activates transducin."],
        cng: ["cGMP-gated Na⁺ channel", "Open in the dark (**dark current**, Na⁺ in); closes when cGMP falls."],
        is: ["Inner segment", "Mitochondria; K⁺ leaks out here."],
        nuc: ["Nucleus", "In the outer nuclear layer."],
        syn: ["Synaptic terminal", "Releases **glutamate**, most in the **dark**."],
      },
      drill: ["os", "disc", "cng", "is", "nuc", "syn"],
      sims: [
        { id: "dark", label: "🌙 Dark", show: ["dark"], on: ["cng", "syn"], info: "**Dark current**: cGMP is high → **cGMP-gated Na⁺ channels open** → Na⁺ flows **in** → the rod sits at about **−40 mV** → glutamate released continuously. Rhodopsin **regenerates in the dark** (isomerase in the pigment epithelium; no light needed)." },
        { id: "light", label: "☀️ Light", show: ["lit"], on: ["disc", "os"], lost: ["cng"], info: "Light: **11-cis → all-trans** retinal → **metarhodopsin II** → **transducin** → **phosphodiesterase** → **cGMP falls** → Na⁺ channels **close** → **Na⁺ permeability of the outer segment decreases** → **hyperpolarization** → **less glutamate**." },
      ],
      secs: { "ph-retina#2": "light", "ph-retina#3": "dark" },
      rules: [
        [/dark current|dark adapt|regenerat/i, "dark"],
        [/rhodopsin|retinal|transducin|metarhodopsin|phototransduction|cgmp/i, "light"],
      ],
    });
  })();

  /* ═══════════════ FACIAL NERVE: localise the lesion by the symptoms ═══════════════ */
  (function () {
    const SITES = [
      ["umn", 172, 44, "cortex / capsule"],
      ["iam", 118, 130, "internal acoustic meatus"],
      ["gen", 150, 160, "geniculate ganglion"],
      ["stap", 176, 196, "nerve to stapedius"],
      ["chorda", 192, 228, "chorda tympani"],
      ["bell", 204, 262, "stylomastoid foramen"],
    ];
    const face = () =>
      '<g transform="translate(336 60) scale(.8)">' +
      '<ellipse cx="80" cy="130" rx="74" ry="98" fill="#e2b898" stroke="#b98b6c" stroke-width="1.4"/>' +
      '<path class="fz" data-z="fh.R" d="M80 34 C40 36 14 62 10 96 L80 96 Z" fill="#0000"/><path class="fz" data-z="fh.L" d="M80 34 C120 36 146 62 150 96 L80 96 Z" fill="#0000"/>' +
      '<path class="fz" data-z="lf.R" d="M80 150 L8 150 C12 190 40 224 80 228 Z" fill="#0000"/><path class="fz" data-z="lf.L" d="M80 150 L152 150 C148 190 120 224 80 228 Z" fill="#0000"/>' +
      '<path d="M20 70 C40 64 58 64 70 70 M24 80 C40 76 56 76 68 80 M90 70 C102 64 120 64 140 70 M92 80 C104 76 120 76 136 80" stroke="#c79a78" stroke-width="1.4" fill="none" class="wr"/>' +
      '<path class="brow" data-s="R" d="M26 98 Q46 88 66 98" stroke="#6b4a33" stroke-width="4" fill="none" stroke-linecap="round"/><path class="brow" data-s="L" d="M94 98 Q114 88 134 98" stroke="#6b4a33" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="46" cy="116" rx="14" ry="7" fill="#fff"/><ellipse cx="114" cy="116" rx="14" ry="7" fill="#fff"/><circle cx="46" cy="116" r="4.5" fill="#4f86b5"/><circle cx="114" cy="116" r="4.5" fill="#4f86b5"/>' +
      '<path d="M80 124 L74 156 L86 156" stroke="#b98b6c" stroke-width="1.6" fill="none"/>' +
      '<path class="mouth" d="M50 184 Q80 196 110 184" stroke="#9b4a4a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<text x="12" y="244" font-size="9" font-weight="900" fill="#9fb4cc">patient R</text><text x="148" y="244" font-size="9" font-weight="900" fill="#9fb4cc" text-anchor="end">L</text></g>';
    const svg = () =>
      '<text class="ttl" x="240" y="14" text-anchor="middle">FACIAL NERVE (RIGHT) · COURSE AND FACE</text>' +
      '<rect x="40" y="26" width="140" height="36" rx="10" fill="#15283f" stroke="#3a5b80"/>' + T(104, 48, "motor cortex", "sm") +
      '<rect x="60" y="92" width="100" height="30" rx="10" fill="#15283f" stroke="#3a5b80"/>' + T(110, 111, "facial nucleus (pons)", "sm") +
      ps("upper", "M84 62 C80 72 82 82 84 92", "#66e9ff", "#6f8aa8", 2) + ps("cross", "M136 62 C150 76 160 90 170 98", "#66e9ff", "#6f8aa8", 2) + T(172, 86, "to the other side", "sm", "start") + T(38, 80, "upper face: both cortices", "sm", "start") +
      ps("n7", "M110 122 L118 130 C130 140 142 150 150 160 C160 172 170 186 176 196 C184 210 190 220 192 228 C196 240 200 250 204 262 C210 276 226 292 250 300", "#d9ff43", "#c9b98f", 4) +
      ps("n8", "M104 122 C98 130 90 140 80 150", "#66e9ff", "#6f8aa8", 3) + T(76, 160, "VIII", "sm", "end") +
      ps("gpn", "M150 160 C164 150 180 146 196 140", "#66e9ff", "#6f8aa8", 1.6) + T(200, 138, "greater petrosal (tears)", "sm", "start") +
      ps("stn", "M176 196 L200 190", "#ffd166", "#8a7f5a", 1.6) + T(204, 190, "stapedius", "sm", "start") +
      ps("ct", "M192 228 C212 226 232 228 250 236", "#ff9f43", "#8a6b52", 1.6) + T(254, 240, "chorda tympani", "sm", "start") + T(254, 252, "(taste ant. ⅔, saliva)", "sm mut", "start") +
      ps("br", "M250 300 L276 280 M250 300 L282 292 M250 300 L282 304 M250 300 L278 316 M250 300 L268 326", "#d9ff43", "#c9b98f", 2) + T(246, 330, "5 branches (parotid)", "sm", "end") +
      SITES.map(([id, x, y]) => '<g class="site" data-ixa-act="' + id + '" style="cursor:pointer"><circle cx="' + x + '" cy="' + y + '" r="9" fill="#10223a" stroke="#ff5d7a" stroke-width="1.6"/><text x="' + x + '" y="' + (y + 3.5) + '" text-anchor="middle" font-size="9" font-weight="900" fill="#ff8fa3">✕</text></g>').join("") +
      face();
    const DX = {
      umn: { z: ["lf.L"], same: [], opp: ["Lower face weak on the **left** (UMN): the forehead is **spared** (both cortices supply it)."] },
      iam: { z: ["fh.R", "lf.R"], same: ["Whole right face paralysed (forehead too)", "**Hearing loss** (VIII)", "**Loss of taste**, anterior ⅔", "**Drooling**; ± dry eye", "Typical cause: **acoustic neuroma**"] },
      gen: { z: ["fh.R", "lf.R"], same: ["Whole right face", "**Dry eye** (greater petrosal)", "**Hyperacusis**", "**Loss of taste**, anterior ⅔"] },
      stap: { z: ["fh.R", "lf.R"], same: ["Whole right face", "**Hyperacusis** (loud sounds hurt: stapedius cannot damp the stapes)", "**Loss of taste**, anterior ⅔"] },
      chorda: { z: ["fh.R", "lf.R"], same: ["Whole right face", "**Loss of taste**, anterior ⅔", "Less **submandibular** saliva"] },
      bell: { z: ["fh.R", "lf.R"], same: ["All muscles of facial expression on the right; **taste and hearing normal**", "**Masseter** still works (V)", "= **Bell's palsy** at the stylomastoid foramen"] },
    };
    const live = (card, sim) => {
      const k = card.dataset.site || (sim ? sim.id : "");
      const d = DX[k];
      card.querySelectorAll(".fz").forEach((z) => z.setAttribute("fill", d && d.z.includes(z.dataset.z) ? "url(#ixHatch)" : "#0000"));
      card.querySelectorAll(".site circle").forEach((c) => c.setAttribute("fill", c.parentNode.dataset.ixaAct === k ? "#ff5d7a" : "#10223a"));
      const m = card.querySelector(".mouth"),
        droopR = d && d.z.includes("lf.R"),
        droopL = d && d.z.includes("lf.L");
      if (m) m.setAttribute("d", "M50 " + (droopR ? 194 : 184) + " Q80 196 110 " + (droopL ? 194 : 184));
      card.querySelectorAll(".brow").forEach((b) => b.setAttribute("transform", d && d.z.includes("fh." + b.dataset.s) ? "translate(0 5)" : ""));
      const info = card.querySelector(".ixAInfo");
      if (d) {
        const old = info.querySelector(".ixARes2");
        if (old) old.remove();
        info.insertAdjacentHTML("beforeend", '<div class="ixARes2">' + (d.same.length ? box("Right side (the lesion side)", d.same) : "") + (d.opp ? box("Opposite side", d.opp) : "") + "</div>");
      }
    };
    A.scene("facial", {
      title: "Facial nerve · find the lesion from the symptoms",
      vb: "20 0 450 340",
      svg,
      intro: "Tap a **✕** on the nerve's course. The further up the lesion, the more branches are lost: stylomastoid → face only; + chorda → **taste**; + stapedius → **hyperacusis**; + geniculate → **dry eye**; meatus → + **hearing** (VIII).",
      parts: {
        n7: ["Facial nerve (VII)", "Nucleus in the pons → internal acoustic meatus (with VIII) → facial canal → stylomastoid foramen → parotid → 5 branches."],
        n8: ["Vestibulocochlear (VIII)", "Travels with VII in the internal acoustic meatus."],
        gpn: ["Greater petrosal nerve", "From the **geniculate ganglion**: secretomotor to the **lacrimal gland** (via the pterygopalatine ganglion)."],
        stn: ["Nerve to stapedius", "Damps the stapes; its loss → **hyperacusis**."],
        ct: ["Chorda tympani", "**Taste** from the **anterior ⅔** of the tongue (sugar on the tip = **facial**, not maxillary, IX or vagus) + secretomotor to the submandibular and sublingual glands."],
        br: ["Terminal branches", "Temporal, zygomatic, buccal, marginal mandibular, cervical: muscles of facial expression."],
        upper: ["Corticonuclear fibres to the upper face", "Come from **both** cortices."],
        cross: ["Corticonuclear fibres to the lower face", "Only from the **opposite** cortex: why a UMN lesion spares the forehead."],
      },
      drill: ["n7", "n8", "gpn", "stn", "ct", "br"],
      sims: [
        { id: "umn", label: "UMN (cortex)", info: "A lesion of the **right** corticonuclear tract (cortex/capsule) paralyses the **lower half of the LEFT face**; the forehead still wrinkles." },
        { id: "iam", label: "Meatus (neuroma)", info: "**Internal acoustic meatus** (acoustic neuroma): VII and VIII together → hearing loss + facial palsy + loss of taste + drooling on that side." },
        { id: "stap", label: "Above stapedius", info: "Proximal to the **nerve to stapedius**: facial palsy + **hyperacusis** + loss of taste." },
        { id: "chorda", label: "Above chorda", info: "In the facial canal **above the chorda tympani**: facial palsy + **loss of taste** (anterior ⅔) + less submandibular saliva." },
        { id: "bell", label: "Bell's palsy", info: "**Stylomastoid foramen** (Bell's palsy): all facial expression muscles on that side; taste and hearing normal; the masseter works." },
      ],
      act: (card, a) => {
        card.dataset.site = a;
        const sim = A.def("facial").sims.find((x) => x.id === a) || null;
        A.apply(card, sim ? sim.id : "");
        card.dataset.site = a;
        live(card, sim);
      },
      live: (card, sim) => {
        if (sim) card.dataset.site = sim.id;
        else delete card.dataset.site;
        live(card, sim);
      },
      secs: { "an-cranial-nerves#0": "", "an-cranial-nerves#1": "iam", "an-face#1": "bell" },
      rules: [
        [/acoustic neuroma|internal (acoustic|auditory) meatus|hearing loss.{0,60}taste|taste.{0,60}hearing/i, "iam"],
        [/hyperacusis|stapedius|loud sounds/i, "stap"],
        [/chorda tympani|taste.{0,40}anterior/i, "chorda"],
        [/bell'?s palsy|stylomastoid/i, "bell"],
        [/upper motor neuron facial|lower half of the (left|right) face|forehead/i, "umn"],
      ],
    });
  })();
})();
