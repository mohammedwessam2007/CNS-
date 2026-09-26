/* RENAISSANCE · Season 3 · Possession (part 1: the masterpiece and the poem).
 *
 * The masterpiece compiler's first hard case, The Brothers Karamazov, in three sessions: the family and what to read
 * whole (km1), Rebellion and the Grand Inquisitor as an argument you can take apart (km2), and the trial as a boss
 * world that needs every earlier tool (km3). Then a radically different work, Shelley's "Ozymandias", read whole.
 * Content rules (docs/RENAISSANCE/10_MASTERPIECE_COMPILER.md): every quotation is in the season's quote register with
 * translator, place in the work, rights and how the wording was checked; Constance Garnett's translation (1912) is
 * public domain; scholarship is cited, not quoted, except short registered quotations; interpretations are labelled
 * as readings; nothing is attributed to a real person that they did not write or say.
 */
(function () {
  "use strict";
  const C = { lime: "#d9ff43", cyan: "#66e9ff", pink: "#ff6e8a", green: "#5ef0a0", amber: "#ffd166", violet: "#b39cff", mut: "#8fa6c0", line: "#2f4a68", bg: "#0f1d2e", ink: "#e8eef6" };
  const svg = (w, h, inner, label) => '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (label || "") + '" class="rnSvg">' + inner + "</svg>";
  const t = (x, y, s, o) => '<text x="' + x + '" y="' + y + '" fill="' + ((o && o.c) || C.ink) + '" font-size="' + ((o && o.fs) || 12) + '" font-weight="' + ((o && o.fw) || 700) + '" text-anchor="' + ((o && o.a) || "middle") + '" font-family="Inter,system-ui,sans-serif">' + s + "</text>";
  const box = (x, y, w, h, c, fill) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="' + (fill || C.bg) + '" stroke="' + c + '" stroke-width="1.6"/>';
  const defs = '<defs><marker id="rnArr3" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="' + C.mut + '"/></marker></defs>';
  const arrow = (x1, y1, x2, y2, c) => '<path d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '" stroke="' + (c || C.mut) + '" stroke-width="2" marker-end="url(#rnArr3)" fill="none"/>';
  const line = (x1, y1, x2, y2, c, w, dash) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + "/>";
  const wrap = (str, n) => {
    const out = [];
    let cur = "";
    for (const w of String(str).split(" ")) (cur + " " + w).trim().length > n && cur ? (out.push(cur), (cur = w)) : (cur = (cur + " " + w).trim());
    if (cur) out.push(cur);
    return out;
  };
  const lines = (x, y, arr, o, dy) => arr.map((l, i) => t(x, y + i * (dy || 16), l, o)).join("");

  /* ═══════════════ the family, as positions ═══════════════ */
  const NODES = {
    fyodor: { x: 180, y: 26, n: "Fyodor (father)" },
    dmitri: { x: 46, y: 104, n: "Dmitri" },
    ivan: { x: 136, y: 104, n: "Ivan" },
    alyosha: { x: 226, y: 104, n: "Alyosha" },
    smerd: { x: 314, y: 104, n: "Smerdyakov" },
    grush: { x: 46, y: 184, n: "Grushenka" },
    katya: { x: 136, y: 184, n: "Katerina" },
    zosima: { x: 226, y: 184, n: "Zosima" },
    grigory: { x: 314, y: 184, n: "Grigory" },
  };
  const EDGES = {
    money: [["dmitri", "fyodor", "Dmitri and his father fight over his mother's inheritance, and over 3,000 roubles"], ["fyodor", "grush", "Fyodor keeps 3,000 roubles in an envelope for Grushenka, if she will come"], ["katya", "dmitri", "Katerina entrusted Dmitri with 3,000 roubles; he spent half and hid the rest"]],
    love: [["fyodor", "grush", "the father wants Grushenka"], ["dmitri", "grush", "so does his eldest son"], ["dmitri", "katya", "Dmitri is engaged to Katerina"], ["ivan", "katya", "Ivan loves Katerina"]],
    ideas: [["ivan", "smerd", "Smerdyakov listens to Ivan and takes his ideas literally"], ["zosima", "alyosha", "the elder is Alyosha's teacher"], ["ivan", "alyosha", "Ivan tests his arguments on Alyosha"]],
    care: [["grigory", "dmitri", "the old servant Grigory looked after the small boys when their father forgot them"], ["grigory", "smerd", "Grigory and his wife raised Smerdyakov"], ["alyosha", "dmitri", "Alyosha goes between everyone and judges no one"]],
  };
  const LENS = { money: C.amber, love: C.pink, ideas: C.cyan, care: C.green };
  function familyDraw(v) {
    let s = "";
    const on = Object.keys(LENS).filter((k) => v[k]);
    for (const k of on)
      for (const [a, b] of EDGES[k]) {
        const A = NODES[a],
          B = NODES[b],
          off = (Object.keys(LENS).indexOf(k) - 1.5) * 3;
        s += line(A.x + off, A.y + off, B.x + off, B.y + off, LENS[k], 2.6);
      }
    for (const [id, N] of Object.entries(NODES)) {
      const deg = on.reduce((a, k) => a + EDGES[k].filter((e) => e[0] === id || e[1] === id).length, 0);
      s += box(N.x - 42, N.y - 14, 84, 28, id === "fyodor" ? C.amber : C.line, deg >= 3 ? "#2a2410" : C.bg) + t(N.x, N.y + 5, N.n.replace(" (father)", ""), { fs: 12, c: id === "fyodor" ? C.amber : C.ink });
    }
    s += t(180, 238, on.length ? "lines: " + on.join(" · ") : "switch on a kind of line", { c: C.mut, fs: 12 });
    return svg(360, 250, s, "The Karamazov family and the people around them, as a map of relations");
  }

  /* ═══════════════ VISUALS ═══════════════ */
  const visuals = {
    // what the compiler decided for each of the novel's twelve books and the epilogue
    compileMap: () => {
      const rows = [
        ["I", "The History of a Family", "bridge", C.mut],
        ["II", "An Unfortunate Gathering", "passages", C.cyan],
        ["III", "The Sensualists", "passages", C.cyan],
        ["IV", "Lacerations", "bridge", C.mut],
        ["V", "Pro and Contra", "READ WHOLE", C.lime],
        ["VI", "The Russian Monk", "passages", C.cyan],
        ["VII", "Alyosha", "READ WHOLE", C.lime],
        ["VIII", "Mitya", "bridge", C.mut],
        ["IX", "The Preliminary Investigation", "bridge", C.mut],
        ["X", "The Boys", "bridge", C.mut],
        ["XI", "Ivan", "passages", C.cyan],
        ["XII", "A Judicial Error", "boss world", C.amber],
        ["Ep.", "Epilogue", "READ WHOLE", C.lime],
      ];
      let s = t(8, 16, "Book", { c: C.mut, fs: 12, a: "start" }) + t(300, 16, "decision", { c: C.mut, fs: 12 });
      rows.forEach(([n, title, d, c], i) => {
        const y = 38 + i * 21;
        s += t(8, y, n, { c: C.mut, fs: 12, a: "start" }) + t(40, y, title, { fs: 12, a: "start", fw: 650 }) + box(250, y - 14, 102, 19, c, d === "READ WHOLE" ? "#18240f" : C.bg) + t(301, y, d, { c, fs: 12 });
      });
      return svg(360, 312, s, "The compile decision for each book of The Brothers Karamazov");
    },
    familyMap: () => familyDraw({ money: true, love: true, ideas: true, care: true }),
    // the three temptations Christ refused, and what the Inquisitor says the church took up instead
    temptations: () => {
      const rows = [
        ["turn stones into bread", "give them bread and they follow", C.amber],
        ["throw yourself down, angels will catch you", "rule by miracle and mystery", C.cyan],
        ["all the kingdoms of the world", "take Caesar's sword: authority", C.pink],
      ];
      let s = defs + t(92, 16, "Christ refused", { c: C.mut, fs: 12 }) + t(272, 16, "the Inquisitor accepts", { c: C.mut, fs: 12 });
      rows.forEach(([a, b, c], i) => {
        const y = 30 + i * 62;
        s += box(6, y, 172, 46, C.line) + lines(92, y + 19, wrap(a, 24), { fs: 12 }, 15) + arrow(180, y + 23, 190, y + 23) + box(192, y, 162, 46, c, "#141b10") + lines(273, y + 19, wrap(b, 22), { fs: 12, c }, 15);
      });
      s += t(180, 226, "the three powers: miracle, mystery, authority", { c: C.lime, fs: 12 });
      return svg(360, 240, s, "Three temptations refused, three powers accepted");
    },
  };

  /* ═══════════════ MODELS ═══════════════ */
  const models = {
    relations: {
      toggles: [
        { id: "money", label: "Money", value: true },
        { id: "love", label: "Love and rivalry", value: false },
        { id: "ideas", label: "Ideas", value: false },
        { id: "care", label: "Care", value: false },
      ],
      draw: (v) => familyDraw(v),
      read(v) {
        const on = Object.keys(LENS).filter((k) => v[k]);
        if (!on.length) return "Switch on at least one kind of line.";
        const touch = on.reduce((a, k) => a + EDGES[k].filter((e) => e[0] === "fyodor" || e[1] === "fyodor").length, 0);
        const lines0 = on.flatMap((k) => EDGES[k].map((e) => "**" + k + ":** " + e[2] + "."));
        const ins = [];
        if (v.money && v.love) ins.push("Money and love run along the **same** lines: the father and his eldest son want the same woman and argue about the same money. That knot is where the plot tightens.");
        if (v.ideas) ins.push("The ideas line from **Ivan to Smerdyakov** is the quiet one. Keep it in mind for the trial.");
        if (v.care && !v.money) ins.push("Notice who gives care and who gives none: the father has no care line at all.");
        return lines0.join(" ") + "\n\n" + (ins.length ? ins.join(" ") + " " : "") + "Lines touching the father: **" + touch + "**.";
      },
    },
    // the Grand Inquisitor's argument as premises: switch one off and see whether the conclusion still follows
    argument: {
      toggles: [
        { id: "p1", label: "1 · People cannot bear freedom", value: true },
        { id: "p2", label: "2 · They will trade it for bread", value: true },
        { id: "p3", label: "3 · A few can carry the burden", value: true },
        { id: "p4", label: "4 · Happiness outweighs freedom", value: true },
      ],
      P: [
        ["p1", "Most people cannot bear the freedom to choose between good and evil."],
        ["p2", "Given the choice, they will trade freedom for bread and certainty."],
        ["p3", "A few can carry the burden of knowing, for the sake of the many."],
        ["p4", "The happiness of the many outweighs the freedom of all."],
      ],
      draw(v) {
        let s = defs;
        this.P.forEach(([id, txt], i) => {
          const y = 8 + i * 52,
            on = !!v[id];
          s += box(6, y, 348, 42, on ? C.cyan : C.line, on ? "#0b1a26" : "#0b1017") + lines(180, y + 17, wrap((i + 1) + ". " + txt, 52), { fs: 12, c: on ? C.ink : C.mut, fw: on ? 700 : 500 }, 15);
        });
        const ok = this.P.every(([id]) => v[id]);
        s += arrow(180, 214, 180, 226, ok ? C.lime : C.pink) + box(6, 228, 348, 44, ok ? C.lime : C.pink, ok ? "#18240f" : "#2a1119") + lines(180, 246, ok ? ["So the church was right to take up bread,", "miracle and authority, and to hide the truth."] : ["The conclusion no longer follows:", "the argument needs every premise."], { fs: 12, c: ok ? C.lime : C.pink }, 15);
        return svg(360, 280, s, "The Grand Inquisitor's argument as four premises and a conclusion");
      },
      read(v) {
        const off = this.P.filter(([id]) => !v[id]).map(([id]) => id);
        if (!off.length) return "With all four premises the argument is **valid**: if they are true, the conclusion follows. That is why readers find it hard to answer. The question is which premise is false.";
        const who = {
          p1: "Premise 1 is where the novel pushes back. Book VI, the life and teaching of the elder Zosima, answers it with a life of active love rather than an argument; Dostoevsky wrote in August 1879 that Book VI was meant as that answer.",
          p2: "Premise 2 is an empirical claim about people. History has cases both ways, which is why it cannot simply be assumed.",
          p3: "Premise 3 hides the question of who guards the guardians: the few are also tempted.",
          p4: "Premise 4 is where a liberal critic attacks: freedom is not one good among others that happiness can outbid.",
        };
        return off.map((k) => who[k]).join(" ") + " **Without " + off.map((k) => "premise " + k.slice(1)).join(" and ") + ", the conclusion no longer follows.**";
      },
    },
    // the jury's arithmetic: prior odds times the weight of each piece of evidence (teaching numbers, not the novel's)
    trial: {
      controls: [
        { id: "prior", label: "Before the evidence: chance it was Dmitri", min: 5, max: 60, step: 5, value: 25, unit: "%" },
        { id: "rel", label: "How reliable is Grigory about the door?", min: 0, max: 100, step: 10, value: 90, unit: "%" },
      ],
      toggles: [
        { id: "threat", label: "Threats and the letter", value: true },
        { id: "there", label: "In the garden with a pestle", value: true },
        { id: "money", label: "Money that night", value: true },
        { id: "env", label: "Torn envelope", value: true },
        { id: "door", label: "Grigory: the door was open", value: true },
      ],
      lr(v) {
        const r = v.rel / 100;
        return [
          ["threat", "threats and the drunken letter", 3],
          ["there", "in the garden, armed, struck Grigory", 4],
          ["money", "had money that night", 1.5],
          ["env", "torn envelope on the floor", 1],
          ["door", "Grigory says the door was open", (r * 1 + (1 - r) * 0.5) / (r * 0.1 + (1 - r) * 0.5)],
        ].filter(([id]) => v[id]);
      },
      post(v) {
        const odds0 = v.prior / (100 - v.prior);
        const odds = this.lr(v).reduce((a, x) => a * x[2], odds0);
        return odds / (1 + odds);
      },
      draw(v) {
        const L = this.lr(v),
          p = this.post(v);
        let s = t(8, 16, "weight of each piece (×)", { c: C.mut, fs: 12, a: "start" });
        L.forEach(([id, name, w], i) => {
          const y = 30 + i * 30,
            bw = Math.min(170, Math.max(6, (Math.log(w + 1e-9) / Math.log(10)) * 170));
          s += t(8, y + 13, name.length > 26 ? name.slice(0, 25) + "…" : name, { fs: 12, a: "start", fw: 600 }) + '<rect x="190" y="' + (y + 2) + '" width="' + (w <= 1.001 ? 4 : bw) + '" height="14" rx="3" fill="' + (w >= 3 ? C.amber : w > 1.2 ? C.cyan : C.mut) + '"/>' + t(354, y + 13, "×" + (Math.round(w * 10) / 10), { fs: 12, a: "end", c: w >= 3 ? C.amber : C.ink });
        });
        const y = 30 + L.length * 30 + 10;
        s += '<rect x="8" y="' + y + '" width="344" height="18" rx="4" fill="#16263a"/><rect x="8" y="' + y + '" width="' + Math.round(344 * p) + '" height="18" rx="4" fill="' + (p > 0.9 ? C.pink : C.lime) + '"/>';
        s += t(180, y + 38, "after the evidence: " + Math.round(p * 100) + "% that Dmitri did it", { fs: 13, c: p > 0.9 ? C.pink : C.lime });
        return svg(360, y + 50, s, "Prior odds multiplied by the weight of each piece of evidence");
      },
      read(v) {
        const L = this.lr(v),
          p = this.post(v),
          door = L.find((x) => x[0] === "door");
        const heavy = L.filter((x) => x[2] >= 3).map((x) => x[1]);
        return "Starting at " + v.prior + "%, the evidence you switched on leaves **" + Math.round(p * 100) + "%**. " + (heavy.length ? "The heavy pieces: " + heavy.join("; ") + ". " : "") + (door ? "Grigory's door counts ×" + Math.round(door[2] * 10) / 10 + " at " + v.rel + "% reliability; at 50% it would count about ×2.5, at 0% not at all. " : "") + "The torn envelope counts ×1: whoever took the money would leave it. *These weights are teaching numbers chosen to show the logic, not figures from the novel.*";
      },
    },
    // Ozymandias read by voice: switch on a voice and see which words are whose
    voices: {
      text: true,
      toggles: [
        { id: "poet", label: "The poet", value: true },
        { id: "trav", label: "The traveller", value: false },
        { id: "sculpt", label: "What the sculptor made", value: false },
        { id: "king", label: "The king's inscription", value: false },
      ],
      L: [
        ["poet", "I met a traveller from an antique land,"],
        ["poet", "Who said—"],
        ["trav", "“Two vast and trunkless legs of stone / Stand in the desert. . . . Near them, on the sand, / Half sunk a shattered visage lies, whose frown,"],
        ["sculpt", "And wrinkled lip, and sneer of cold command,"],
        ["trav", "Tell that its sculptor well those passions read / Which yet survive, stamped on these lifeless things, / The hand that mocked them, and the heart that fed; / And on the pedestal, these words appear:"],
        ["king", "My name is Ozymandias, King of Kings; / Look on my Works, ye Mighty, and despair!"],
        ["trav", "Nothing beside remains. Round the decay / Of that colossal Wreck, boundless and bare / The lone and level sands stretch far away.”"],
      ],
      draw(v) {
        const col = { poet: "#d9ff43", trav: "#66e9ff", sculpt: "#ffd166", king: "#ff6e8a" };
        return '<div class="rnReader">' + this.L.map(([k, txt]) => '<span class="rnLine' + (v[k] ? " on" : "") + '" style="' + (v[k] ? "border-left:3px solid " + col[k] + ";padding-left:8px" : "opacity:.55") + '">' + txt.split(" / ").join("<br>") + "</span>").join("") + "</div>";
      },
      read(v) {
        const on = ["poet", "trav", "sculpt", "king"].filter((k) => v[k]);
        const say = {
          poet: "**The poet** speaks only the first line and a half. Everything else is reported.",
          trav: "**The traveller** gives almost the whole poem, and ends it: the last three lines are his, not the poet's.",
          sculpt: "**The sculptor** never speaks. His work does: the frown and the sneer he carved are the only part of the king that still says anything true.",
          king: "**The king** speaks two lines, through stone, through a traveller, through a poet: three frames around a boast.",
        };
        return on.length ? on.map((k) => say[k]).join(" ") + (on.includes("king") && on.includes("trav") ? " Read the king's lines next to the traveller's next sentence, “Nothing beside remains”: the frame turns the boast into its own refutation." : "") : "Switch on a voice.";
      },
    },
  };

  /* ═══════════════ QUOTATIONS (the quote engine's register) ═══════════════ */
  const G = { translator: "Constance Garnett", trYear: "1912", author: "Fyodor Dostoevsky", work: "The Brothers Karamazov", rights: "public domain (Garnett's 1912 translation)", verified: "Exact-phrase web search found the same wording in several independent copies of the Garnett text; the full text could not be fetched from this build machine (egress blocked), so a scan was not compared." };
  const quotes = {
    first: Object.assign({}, G, { text: "Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a landowner well known in our district in his own day, and still remembered among us owing to his gloomy and tragic death, which happened thirteen years ago, and which I shall describe in its proper place.", speaker: "the narrator", where: "Book I, ch. 1 (the first sentence)", context: "The opening of the novel. The narrator is a man of the town, writing thirteen years after the events.", meaning: "The death of the father is announced before we meet anyone.", matters: "It moves the suspense from whether a death happens to why, and to who is guilty.", misattribution: "Low; it is rarely quoted outside the book." }),
    lie: Object.assign({}, G, { text: "Above all, don't lie to yourself. The man who lies to himself and listens to his own lie comes to such a pass that he cannot distinguish the truth within him, or around him, and so loses all respect for himself and for others. And having no respect he ceases to love, and in order to occupy and distract himself without love he gives way to passions and coarse pleasures, and sinks to bestiality in his vices, all from continual lying to other men and to himself.", speaker: "the elder Zosima, to Fyodor Pavlovitch", where: "Book II, ch. 2", context: "The family has come to the monastery to settle the quarrel between Dmitri and his father; the father has been playing the buffoon in the elder's cell.", meaning: "A chain of causes: self-deception → no sense of truth → no respect → no love → the passions that fill the gap.", matters: "It is a causal model of vice, not just a command, and the novel tests it on the man it is spoken to.", misattribution: "Often posted as Dostoevsky's own advice, without the scene. It is a character speaking to a particular man." }),
    bow: Object.assign({}, G, { text: "I bowed down yesterday to the great suffering in store for him.", speaker: "the elder Zosima, to Alyosha", where: "Book VI, ch. 1", context: "The day after the meeting at the monastery, the dying elder explains why he knelt and bowed to the ground before Dmitri.", meaning: "The bow was to what Dmitri would suffer, which the elder saw in his face.", matters: "It turns a strange gesture into the novel's first announcement of Dmitri's fate.", misattribution: "Low." }),
    beauty: Object.assign({}, G, { text: "Beauty is a terrible and awful thing! It is terrible because it has not been fathomed and never can be fathomed, for God sets us nothing but riddles. […] The awful thing is that beauty is mysterious as well as terrible. God and the devil are fighting there and the battlefield is the heart of man.", speaker: "Dmitri, to Alyosha", where: "Book III, ch. 3 “The Confession of a Passionate Heart—In Verse”", context: "Dmitri's confession opens with Schiller: stanzas from “The Eleusinian Festival” and lines of “An die Freude”, the ode Beethoven set in his Ninth Symphony. […] marks words left out between the two sentences.", meaning: "For Dmitri beauty is not calm: it pulls toward the highest and the lowest at once.", matters: "It is Dmitri's whole character in two sentences, and it is often confused with a different Dostoevsky line.", misattribution: "“Beauty will save the world” is not from this novel: it is from The Idiot, where Ippolit asks the prince, mockingly, whether he ever said it." }),
    ticket: Object.assign({}, G, { text: "It's not God that I don't accept, Alyosha, only I most respectfully return Him the ticket.", speaker: "Ivan, to Alyosha", where: "Book V, ch. 4 “Rebellion”", context: "After Ivan has told stories of cruelty to children that he collects from newspapers and says that no future harmony could be worth one child's tears.", meaning: "He does not deny God; he refuses to accept a world whose harmony is bought with that price.", matters: "It is the strongest form of the problem of innocent suffering in the novel, and Dostoevsky gives it to his most intelligent character.", misattribution: "Translations differ (“entrance ticket”, “ticket”); the gesture is the same." }),
    powers: Object.assign({}, G, { text: "There are three powers, three powers alone, able to conquer and to hold captive for ever the conscience of these impotent rebels for their happiness—those forces are miracle, mystery and authority.", speaker: "the Grand Inquisitor, to Christ (in Ivan's poem)", where: "Book V, ch. 5 “The Grand Inquisitor”", context: "Seville, the sixteenth century, at the most terrible time of the Inquisition. Christ has returned and been arrested; at night the old Inquisitor explains why the church corrected His work.", meaning: "People, the Inquisitor says, want to be relieved of freedom; three powers can make them happy by taking it.", matters: "The chapter's argument about freedom and security is why it is read as philosophy, far beyond the novel.", misattribution: "Often read as Dostoevsky's own view. It is Ivan's poem, and the novel sets Book VI against it." }),
    kiss: Object.assign({}, G, { text: "The kiss glows in his heart, but the old man adheres to his idea.", speaker: "Ivan, ending his poem", where: "Book V, ch. 5 “The Grand Inquisitor”", context: "Christ has answered the Inquisitor's whole speech with silence and a kiss; the old man opens the door and tells Him to go and never come back.", meaning: "The kiss answers the man, not the argument; it changes him without converting him.", matters: "Right after it Alyosha kisses Ivan, and Ivan calls it “plagiarism”.", misattribution: "Low." }),
    lawful: Object.assign({}, G, { text: "nothing then would be immoral, everything would be lawful, even cannibalism.", speaker: "Miusov, reporting Ivan's argument", where: "Book II, ch. 6", context: "At the monastery, Miusov summarises an argument Ivan made in company: destroy the belief in immortality and every living force of love dries up.", meaning: "Ivan's idea, second-hand: without immortality, no moral law holds.", matters: "It is the source of the most famous line Dostoevsky never wrote. Garnett's word is “lawful”; newer translations say “permitted”.", misattribution: "“If God does not exist, everything is permitted” does not appear in the novel. Sartre quoted it as Dostoevsky's in his 1945 lecture Existentialism Is a Humanism." }),
    lawful2: Object.assign({}, G, { text: "without God and immortal life? All things are lawful then, they can do what they like?", speaker: "Dmitri, telling Alyosha what he asked Rakitin", where: "Book XI, ch. 4 “A Hymn and a Secret”", context: "In prison, Dmitri recalls asking the young radical Rakitin what becomes of people without God; the phrase “all things are lawful” is also what Smerdyakov throws back at Ivan.", meaning: "Another character's question, not a thesis.", matters: "The idea circulates through several mouths; the book tests what happens when someone acts on it.", misattribution: "As for “lawful” above." }),
    hell: Object.assign({}, G, { text: "Fathers and teachers, I ponder, “What is hell?” I maintain that it is the suffering of being unable to love.", speaker: "the elder Zosima (his teachings, written down by Alyosha)", where: "Book VI, ch. 3", context: "Book VI, the novel's answer to Ivan in the form of a life.", meaning: "Hell as a state of the heart rather than a place of fire.", matters: "It is the counterweight to the Inquisitor: love as something done, not argued.", misattribution: "Low." }),
    hurrah: Object.assign({}, G, { text: "Hurrah for Karamazov!", speaker: "the schoolboy Kolya, and then all the boys", where: "Epilogue, ch. 3 “Ilusha's Funeral. The Speech at the Stone”", context: "After the funeral of the boy Ilyusha, Alyosha speaks to the boys by the stone and asks them to remember this day and one another.", meaning: "The last words of the novel belong to children, cheering a name that the trial has just disgraced.", matters: "The ending answers the trial's verdict on the name Karamazov without a word of argument.", misattribution: "Low." }),
    freud: { text: "The Brothers Karamazov is the most magnificent novel ever written; the episode of the Grand Inquisitor, one of the peaks in the literature of the world, can hardly be valued too highly.", speaker: "Sigmund Freud", author: "Sigmund Freud", work: "“Dostoevsky and Parricide”", where: "opening paragraphs", year: "1928", translator: "English translation (the German original is public domain; the translation is quoted briefly)", rights: "short quotation with citation", context: "Freud's introduction to a German scholarly volume on the novel.", meaning: "A strong admirer's verdict, from a critic with his own theory to prove (parricide and guilt).", matters: "It shows why the novel is placed so high, and by whom; it is an opinion, not a fact.", misattribution: "Low; the wording varies slightly between translations.", verified: "Exact-phrase web search found the sentence attributed to this essay in several sources." },
    nabokov: { text: "not a great writer, but a rather mediocre one", speaker: "Vladimir Nabokov", author: "Vladimir Nabokov", work: "Lectures on Russian Literature", where: "the lecture on Dostoevsky", year: "1981 (lectures given in the 1940s–50s)", rights: "short quotation with citation", context: "Nabokov goes on to grant him “flashes of excellent humor” separated by “wastelands of literary platitudes”.", meaning: "A serious, hostile verdict from a great novelist: sentimentality and melodrama over art.", matters: "Possession includes knowing why intelligent readers dislike the book.", misattribution: "Low.", verified: "Exact-phrase web search found the phrases in several sources quoting the lecture." },
    ozy: { text: "I met a traveller from an antique land,\nWho said—“Two vast and trunkless legs of stone\nStand in the desert. . . . Near them, on the sand,\nHalf sunk a shattered visage lies, whose frown,\nAnd wrinkled lip, and sneer of cold command,\nTell that its sculptor well those passions read\nWhich yet survive, stamped on these lifeless things,\nThe hand that mocked them, and the heart that fed;\nAnd on the pedestal, these words appear:\nMy name is Ozymandias, King of Kings;\nLook on my Works, ye Mighty, and despair!\nNothing beside remains. Round the decay\nOf that colossal Wreck, boundless and bare\nThe lone and level sands stretch far away.”", verse: true, speaker: "Percy Bysshe Shelley", author: "Percy Bysshe Shelley", work: "“Ozymandias”", where: "the whole sonnet", year: "1818", rights: "public domain", context: "Written in a friendly sonnet competition with Horace Smith; first printed in The Examiner on 11 January 1818. Punctuation differs slightly between printings; this is the common modern text.", meaning: "A boast carved to last, reported by a traveller, framed by a poet, surrounded by sand.", matters: "It is the whole work: nothing in it can be summarised without losing it.", misattribution: "The inscription is often quoted as a real Egyptian text. Shelley adapted it from Diodorus Siculus's report of an inscription at the Ramesseum.", verified: "The text is widely reprinted; its rhyme scheme (ABABACDC EDEFEF) and first printing were checked by web search." },
  };

  const sessions = [];

  /* ─── 13 · The Karamazovs ─── */
  sessions.push({
    id: "km1", primitive: "compile", domain: "literature", region: "Russia", works: ["karamazov"],
    atoms: ["narrative", "compress", "judgment"],
    title: "The Karamazovs",
    hook: "The first sentence of a 700-page novel tells you the father will die. Why would a writer give away the ending?",
    minutes: 27,
    why: "The Brothers Karamazov is the compiler's hardest case: long, dense with characters and arguments, and famous for passages that no summary survives. This session does two things before any reading: decides which parts deserve your hours, and gives you the family as a map, so the names never become a fog.",
    capability: "Decide which parts of a long work must be read whole, hold the Karamazov family as a map of money, love, ideas and care, and place three famous lines in their scenes.",
    stakes: "Summaries make people feel they know a book and leave them with nothing to say about it. Reading every page of every book is impossible. The skill in between is choosing what to read whole.",
    bridge: "The missing step: a summary keeps what happens and loses how it is said. Where a book's meaning lives in a voice (an argument, a confession, a sermon), the summary deletes the thing itself. Where it lives in events, a summary loses little.",
    connection: "Season 2's three boxes found the step that limits a flow. The compiler does the same for a book: find the few parts that carry the most, read those whole, bridge the rest.",
    vocab: {
      compile: { name: "non-uniform compression", h: "Reading some parts whole, some in passages, and bridging the rest, according to what each part carries.", s: "مش كل صفحة زي التانية: الحتت اللي فيها صوت اقراها كاملة، والباقي كفاية تعرف حصل إيه.", t: "Allocation of reading time by the information that would be lost in summary; the opposite of a fixed compression ratio." },
      elder: { name: "elder (starets)", h: "A monk whom others take as a guide for their inner life.", s: "زي الشيخ اللي الناس بتروح له بقلبها مش بس بأسئلتها.", t: "In Russian Orthodoxy, a spiritual director whose authority is personal rather than an office; the monastery of Optina Pustyn was famous for its elders in the 19th century." },
      chronicler: { name: "chronicler narrator", h: "A narrator who lives in the story's town and tells what he saw, heard or was told.", s: "راوي من أهل البلد، بيحكي اللي شافه واللي اتقال له.", t: "An in-world narrator with limited, sometimes hearsay knowledge; here an unnamed resident writing thirteen years after the events." },
      hindsight: { name: "hindsight bias", h: "Once you know how it ended, the path looks more obvious than it was.", s: "بعد ما تعرف النهاية، تحس إنها كانت باينة من الأول وهي ما كانتش.", t: "Outcome knowledge inflates the judged probability of that outcome and colours the reading of its causes (Fischhoff 1975)." },
    },
    provenance: [
      { id: "garnett", claim: "Constance Garnett's English translation of The Brothers Karamazov (1912) is the translation quoted in this season.", source: "Dostoevsky F., The Brothers Karamazov, tr. Constance Garnett (London: Heinemann)", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "books", claim: "The novel has twelve books and an epilogue; Book V is 'Pro and Contra' (ch. 4 'Rebellion', ch. 5 'The Grand Inquisitor'), Book VI 'The Russian Monk', Book XII 'A Judicial Error'.", source: "Garnett translation, table of contents (checked by web search)", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "life", claim: "Dostoevsky's three-year-old son Alyosha died of an epileptic seizure in May 1878; Dostoevsky then visited the Optina monastery with the philosopher Vladimir Solovyov; the novel was serialised in The Russian Messenger in 1879–80; Dostoevsky died in early 1881.", source: "Biographical standard (e.g. Frank J., Dostoevsky: The Mantle of the Prophet, 2002); death of the son and visit checked by web search", year: "1878–1881", kind: "scholarship", license: "fact", grade: "B" },
      { id: "preface", claim: "In his preface ('From the Author') Dostoevsky calls Alyosha his hero and says the main novel was to be a second one, set thirteen years later; it was never written.", source: "Garnett translation, 'From the Author' (checked by web search)", year: "1880", kind: "primary", license: "public domain", grade: "A" },
      { id: "idiot", claim: "'Beauty will save the world' comes from The Idiot, where Ippolit asks Prince Myshkin, mockingly, whether he said it.", source: "Dostoevsky F., The Idiot, Part III ch. 5 (checked by web search)", year: "1869", kind: "primary", license: "public domain", grade: "A" },
      { id: "marquez", claim: "Chronicle of a Death Foretold opens by saying Santiago Nasar will be killed that day; its narrator, a man of the town, reconstructs the killing decades later.", source: "García Márquez G., Crónica de una muerte anunciada (described, not quoted)", year: "1981", kind: "scholarship", license: "fact", grade: "A" },
      { id: "fischhoff", claim: "Outcome knowledge increases the judged likelihood of the reported outcome, and people are largely unaware of the effect.", source: "Fischhoff B., 'Hindsight ≠ foresight', Journal of Experimental Psychology: Human Perception and Performance 1:288", year: "1975", kind: "scholarship", license: "fact", grade: "A" },
      { id: "optina", claim: "Optina Pustyn was the best-known centre of the 19th-century Russian elders; Dostoevsky visited it in 1878.", source: "Standard history of Russian Orthodoxy; visit checked by web search", year: "1878", kind: "scholarship", license: "fact", grade: "B" },
      { id: "q.first", claim: "“Alexey Fyodorovitch Karamazov was the third son” — the first sentence, registered in the quote register.", source: "Garnett translation, Book I ch. 1", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.lie", claim: "“Above all, don't lie to yourself” — the elder to the father, registered in the quote register.", source: "Garnett translation, Book II ch. 2", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.bow", claim: "“I bowed down yesterday to the great suffering in store for him” — registered in the quote register.", source: "Garnett translation, Book VI ch. 1", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.beauty", claim: "“Beauty is a terrible and awful thing” — Dmitri, registered in the quote register.", source: "Garnett translation, Book III ch. 3", year: "1912", kind: "primary", license: "public domain", grade: "A" },
    ],
    steps: [
      { id: "k1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["books"], atoms: ["compress", "judgment"], poss: { karamazov: "context" }, stem: "A 700-page novel, 25 minutes a day, and a life to live. Which parts deserve to be read whole rather than summarised?", alt: "Ask of each part: what would a two-line summary of it lose?", options: [
        { t: "The chapters where characters argue or confess in their own voices", ok: true, why: "A summary keeps what happens and loses how it is said. In those chapters, how it is said is the content." },
        { t: "The murder and its investigation, because the plot is what people discuss", bug: "surface", why: "Plot survives summary well: “he was accused because of the envelope” loses little." },
        { t: "The first chapters, because beginnings decide how everything is read", bug: "surface", why: "Position is not value: a rule by page number ignores what each part carries." },
        { t: "None of it: a good summary keeps all of the book's ideas", bug: "omission", why: "A summary of an argument is a claim about the argument. It loses the force that has kept readers arguing for 140 years." },
      ] },
      { id: "k2", type: "scene", stage: "reveal", min: 2.5, src: ["books", "life", "preface"], terms: ["compile"], title: "Not every page weighs the same", body: "The masterpiece compiler read the novel's twelve books and asked of each: **what would a summary lose?** Three answers came back: read whole (the voice is the content), read passages (a few pages carry the part), or bridge (events you need to know, not to experience). The trial became something else: a problem you will solve yourself.\n\nThat is [[compile|non-uniform compression]]. The target is not a fixed number of pages. It is the most possession for the least of your life.", reps: [{ kind: "diagram", label: "The compile map", svg: "compileMap", body: "Three parts to read whole: Book V chapters 4–5 (Rebellion, The Grand Inquisitor), Book VII chapters 3–4 (An Onion, Cana of Galilee) and the Epilogue's last chapter. The rest arrives here as passages, maps and problems." }, { kind: "story", label: "Where the book came from", body: "In May 1878 Dostoevsky's three-year-old son Alyosha died after an epileptic seizure; Dostoevsky had the same illness. Weeks later he went to the Optina monastery with the young philosopher Vladimir Solovyov. The novel he then wrote gives the name Alyosha to its gentlest brother. It came out in instalments in 1879–80; he died a few months after finishing it, in early 1881." }] },
      { id: "k3", type: "passage", stage: "primary", min: 1.5, src: ["garnett", "q.first"], quotes: ["first"], terms: ["chronicler"], poss: { karamazov: "primary" }, title: "The first sentence", body: "Read it slowly. The man speaking lives in the town, and he has just told you the ending." },
      { id: "k4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["q.first"], atoms: ["narrative"], poss: { karamazov: "structure" }, stem: "Why would the narrator announce the father's death in the first sentence?", options: [
        { t: "To move your attention from whether it happens to why, and who is guilty", ok: true, why: "Once the death is certain, every scene becomes evidence. The question the book keeps open is guilt, not survival." },
        { t: "Because readers of 1879 had already followed the real case in the newspapers", bug: "authority", why: "The murder is invented. There was no famous real case to spoil." },
        { t: "To make you pity the father before you have even met him properly", bug: "inversion", why: "The next chapters do the opposite: he abandons his sons and plays the fool." },
        { t: "It is a quirk of the English translation, not of Dostoevsky", bug: "authority", why: "The Russian first sentence also announces his dark and tragic death, thirteen years before the telling." },
      ] },
      { id: "k5", type: "scene", stage: "reveal", min: 2.5, src: ["optina", "life"], terms: ["elder"], title: "A father, four sons", body: "**Fyodor Pavlovich**, the father: a buffoon, a sensualist, rich and mean with it; he forgot each of his sons as small children, and the old servant Grigory looked after them.\n\n**Dmitri**, the eldest: an officer, all passion, at war with his father over money and over a woman, Grushenka. **Ivan**: brilliant, cold, in love with Dmitri's fiancée Katerina, and in rebellion against a world where children suffer. **Alyosha**, the youngest: a novice under the [[elder|elder]] Zosima, the book's hero. **Smerdyakov**: the servant and cook, said to be the father's son by a homeless holy fool; he listens to Ivan.", reps: [{ kind: "diagram", label: "The family map", svg: "familyMap", body: "Money (amber), love (red), ideas (blue), care (green). The model next lets you switch each kind on and off." }, { kind: "analogy", label: "A common reading", body: "Many readers take the brothers as parts of one person: Dmitri the body and its passions, Ivan the mind, Alyosha the spirit, Smerdyakov the mind's ideas without a conscience. Useful for remembering; too neat for the book." }, { kind: "counterexample", label: "Where the neat reading breaks", body: "Dmitri argues about God and immortality; Ivan's passion wrecks him; Alyosha is shaken when his dead elder's body begins to smell, and spends a night of rebellion before “Cana of Galilee” (Book VII). The book gives each voice its full strength. The critic Mikhail Bakhtin called this polyphony: voices that are not the author's puppets." }] },
      { id: "k5b", type: "q", kind: "check", stage: "reveal", min: 1, src: ["optina"], atoms: ["narrative"], poss: { karamazov: "context" }, stem: "Why would a Russian novel of 1879 put a monastery elder at the centre of a murder story?", options: [
        { t: "Elders were a living institution people travelled to for guidance", ok: true, why: "Optina's elders drew visitors from all over Russia, Dostoevsky among them in 1878. The elder is the book's alternative to both the father and Ivan." },
        { t: "Censors of the time required every published novel to contain a priest", bug: "authority", why: "There was censorship, but no such rule; the elder is there by choice." },
        { t: "Monasteries were where murders were usually investigated", bug: "surface", why: "Courts and investigators handle the murder, as in any Russian town of the time." },
      ] },
      { id: "k6", type: "model", stage: "model", min: 3, model: "relations", title: "Switch the lines on", body: "Each kind of line is a force in the plot. Turn them on one at a time.", ask: "**Find two things:** where money and love run along the same lines, and which line belongs to ideas rather than people's feelings. That second line matters at the trial." },
      { id: "k7", type: "passage", stage: "primary", min: 2, src: ["q.lie", "q.bow"], quotes: ["lie", "bow"], poss: { karamazov: "primary" }, title: "What the elder saw", body: "At the monastery the father plays the fool and asks the elder what he must do. The elder answers him (first passage). At the end of the scandalous meeting, the elder kneels and bows to the ground before Dmitri. Alyosha asks why the next day (second passage)." },
      {
        id: "k8", type: "contrast", stage: "contrast", min: 2.5, src: ["marquez", "q.first"], atoms: ["narrative", "analogy"], poss: { karamazov: "compare" }, title: "Two chroniclers, one century apart",
        left: { title: "Dostoevsky, 1880", body: "The first sentence: the father died a gloomy, tragic death thirteen years ago. The narrator is a man of the town who knew these people." },
        right: { title: "García Márquez, 1981", body: "*Chronicle of a Death Foretold* opens by saying Santiago Nasar will be killed that day. The narrator is a man of the town, rebuilding the day decades later." },
        q: { stem: "What does the early reveal do in both books?", options: [
          { t: "It makes the reader ask how a town let it happen, and whose fault it was", ok: true, why: "With the outcome fixed, attention goes to causes, witnesses and responsibility: the chronicle becomes an investigation." },
          { t: "It saves the writers the effort of building suspense", bug: "omission", why: "Both build suspense, of a different kind: about why and who, not whether." },
          { t: "It shows both writers cared little about plot", bug: "moral", why: "Both plots are tightly built; they are organised around guilt instead of surprise." },
          { t: "It follows the old legal custom of court chronicles in both Russia and Colombia", bug: "surface", why: "No such custom; it is a narrative choice." },
        ] },
      },
      { id: "k9", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["idiot", "q.beauty"], atoms: ["judgment"], poss: { karamazov: "quote" }, stem: "At dinner a guest says: “As Dostoevsky wrote in The Brothers Karamazov, beauty will save the world.” What is accurate?", options: [
        { t: "That line is from The Idiot; Karamazov's Dmitri calls beauty terrible", ok: true, why: "In The Idiot, Ippolit asks the prince mockingly whether he said it. In Karamazov, Dmitri says beauty is “a terrible and awful thing” where God and the devil fight." },
        { t: "It is Zosima's line, from his teachings in Book VI", bug: "authority", why: "Zosima speaks of love and hell as the inability to love, not of beauty saving the world." },
        { t: "It is from Karamazov: Alyosha says it to the boys in his speech at the stone", bug: "surface", why: "Alyosha's speech at the stone is about remembering one another; the beauty line is from another novel." },
        { t: "Dostoevsky never wrote about beauty in his novels", bug: "omission", why: "He did, in both novels, in two very different voices." },
      ] },
      { id: "k10", type: "q", kind: "far", stage: "far", min: 1.5, src: ["fischhoff"], terms: ["hindsight"], atoms: ["narrative", "causal"], poss: { karamazov: "apply" }, stem: "At a morning meeting a doctor begins: “This patient arrested at 3 a.m. Let me tell you how we got there.” What does starting with the ending do, and what does it risk?", options: [
        { t: "It turns listeners into investigators, and risks making the path look obvious", ok: true, why: "Knowing the outcome points attention at causes, as in the novel. The cost is [[hindsight|hindsight bias]]: once you know the end, every earlier sign looks louder than it was at the time." },
        { t: "It saves time, because the history no longer matters once the end is known", bug: "inversion", why: "The history is the whole point; the ending is what makes it worth examining." },
        { t: "It protects the team, because an outcome stated first cannot be blamed on anyone", bug: "moral", why: "Stating the outcome does not assign or remove blame; it frames the search for causes." },
        { t: "Nothing: the order of a case presentation has no effect on how it is judged", bug: "omission", why: "Order matters a great deal; outcome-first framing changes how evidence is weighed." },
      ] },
      {
        id: "k11", type: "forge", stage: "forge", min: 3, title: "A compile plan for a book you keep postponing", body: "Pick the kind of book, then decide how to spend your hours on it.",
        slots: [
          { key: "kind", label: "The book is mostly", options: [{ t: "an argument in characters' voices (a novel of ideas)", grade: "good", note: "Then voice carries meaning: find the chapters where it peaks.", say: "a novel of ideas" }, { t: "a chain of facts and explanations (a textbook)", grade: "good", note: "Then structure carries it: a map and worked problems beat reading every page.", say: "a textbook" }, { t: "a book everyone mentions but you can't say what kind", grade: "weak", note: "Find out first: a two-minute look at its contents decides the plan.", say: "a book of unknown kind" }] },
          { key: "whole", label: "Read whole", options: [{ t: "the parts where a summary would lose the most", grade: "good", note: "That is the compiler's rule.", say: "the parts a summary would destroy" }, { t: "every page, in order", grade: "weak", note: "Honest but costly; most long books are not uniformly dense.", say: "every page" }, { t: "nothing: a summary video", grade: "bad", note: "You will know what happens and have nothing to say about it.", say: "nothing" }] },
          { key: "bridge", label: "For the rest", options: [{ t: "a one-page map of who and what", grade: "good", note: "A map keeps the parts connected without the hours.", say: "a one-page map" }, { t: "skip it entirely", grade: "bad", note: "The whole chapters lose their meaning without the frame.", say: "skip it" }] },
          { key: "check", label: "How you'll know you possess it", options: [{ t: "answer a real reader's question about a scene", grade: "good", note: "That is the reader test this app gives 30 days after the masterpiece.", say: "a reader's question about a scene" }, { t: "remember the plot", grade: "weak", note: "Plot is what summaries already give.", say: "remembering the plot" }] },
        ],
        template: "Book: **{kind}**. Read whole: **{whole}**. The rest: {bridge}. Check: {check}.",
        critique: { stem: "A friend watched a ten-minute summary and says he knows the novel. What would show the gap fastest?", options: [{ t: "Ask why the elder bowed to Dmitri, and what that told the reader", ok: true, why: "A scene's meaning is exactly what summaries drop; a real reader answers at once." }, { t: "Ask him who killed the father, since that is the heart of the plot", bug: "surface", why: "Summaries give that first." }, { t: "Ask how many pages the novel has", bug: "irrelevant", why: "No answer to that shows possession." }] },
      },
    ],
    challenge: { stem: "Which of these lines is Dmitri's?", options: [{ t: "“Beauty is a terrible and awful thing!”", ok: true }, { t: "“What is hell? … the suffering of being unable to love.”", bug: "authority" }, { t: "“I most respectfully return Him the ticket.”", bug: "surface" }] },
    hooks: [
      { id: "km1.h1", gap: 1, poss: { karamazov: "structure" }, q: { stem: "The first sentence of The Brothers Karamazov tells you that…", options: [{ t: "the father will die, and the narrator knew the family", ok: true }, { t: "Alyosha will become a monk and leave the town for good", bug: "surface" }, { t: "the story is a true case from the newspapers of 1879", bug: "authority" }] } },
      { id: "km1.h2", gap: 7, poss: { karamazov: "quote" }, q: { stem: "“Above all, don't lie to yourself.” Who says it, and to whom?", options: [{ t: "The elder Zosima, to the father at the monastery", ok: true }, { t: "Alyosha, to Ivan after the Grand Inquisitor", bug: "surface" }, { t: "Ivan, to Smerdyakov at their third and last meeting", bug: "authority" }] } },
      { id: "km1.h3", gap: 30, q: { stem: "Which parts of a long book lose the most in summary?", options: [{ t: "The parts whose meaning lives in a voice", ok: true }, { t: "The parts with the most events and the most characters", bug: "surface" }, { t: "The first and last chapters, always", bug: "rigid" }] } },
    ],
    deeper: [
      { title: "The novel that was never written", body: "In his preface Dostoevsky calls Alyosha the hero and says the main novel is a second one, set thirteen years later; this one is only its background. He died before writing it. The book you have is, by its author's account, the first half of a plan." },
      { title: "Two critics, opposite verdicts", body: "Freud (1928) called it “the most magnificent novel ever written”. Nabokov, who taught Russian literature in America, called Dostoevsky “not a great writer, but a rather mediocre one”. Possession means being able to say why each of them thought so." },
      { title: "Open question", body: "Is a compile plan written by someone else ever as good as your own first reading? The reader test 30 days after the trial session is one way to find out; the honest answer for one reader is a single data point." },
    ],
  });

  /* ─── 14 · Rebellion and the Grand Inquisitor ─── */
  sessions.push({
    id: "km2", primitive: "inquisitor", domain: "philosophy", region: "Russia", works: ["karamazov"], requires: ["km1"],
    atoms: ["judgment", "abstr", "strategy"],
    title: "Rebellion and the Grand Inquisitor",
    hook: "A man says he believes in God but refuses the world God made. What would have to be true for that to be a consistent position?",
    minutes: 28,
    why: "These two chapters are the ones the compiler says to read whole. This session prepares you for them: Ivan's argument about suffering, then the Inquisitor's argument about freedom, taken apart premise by premise, so that when you read them you hear an argument, not a mood.",
    capability: "State Ivan's rebellion and the Inquisitor's argument in your own words, find the premise each depends on, and recognise the same trade of freedom for comfort in medicine today.",
    stakes: "The trade between freedom and security runs through every institution you will work in: hospitals, companies, states, apps. People who can name the premises argue about the right thing.",
    bridge: "The missing step: the Inquisitor's argument is valid. If its premises are true, the conclusion follows. So the only honest way to reject it is to find a premise that is false, and say why.",
    connection: "Session 5 (proxies) showed a number replacing the goal. The Inquisitor proposes happiness replacing freedom, for everyone's good. Same shape: a substitute that is easier to deliver.",
    vocab: {
      theodicy: { name: "the problem of innocent suffering", h: "How can a good God allow children to suffer?", s: "إزاي ربنا الرحيم يسمح إن طفل بريء يتعذب؟ ده السؤال اللي إيفان مش قادر يعدّيه.", t: "Theodicy: the attempt to reconcile God's goodness and power with the existence of evil; Ivan refuses any reconciliation that uses a child's suffering as a price." },
      valid: { name: "valid argument", h: "If the premises are true, the conclusion must be true.", s: "لو المقدمات صح، النتيجة لازم تبقى صح. عشان كده تهاجم المقدمة مش النتيجة.", t: "Validity is a property of form; soundness requires, in addition, true premises." },
      paternalism: { name: "paternalism", h: "Deciding for someone, for their own good, without their consent.", s: "إنك تقرر بدل حد عشان مصلحته، من غير ما تسأله.", t: "Interference with a person's liberty justified by that person's welfare; in medicine, withholding information or choices 'for the patient's sake'." },
    },
    provenance: [
      { id: "garnett2", claim: "Book V ch. 4 'Rebellion' and ch. 5 'The Grand Inquisitor' in Garnett's translation.", source: "Dostoevsky F., The Brothers Karamazov, tr. Constance Garnett", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "setting", claim: "Ivan's 'poem' is set in Seville in the sixteenth century, during the Inquisition; Christ appears, is arrested, and the aged Grand Inquisitor explains at night why the church corrected His work; Christ answers with silence and a kiss.", source: "Garnett translation, Book V ch. 5 (summarised)", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "pobedonostsev", claim: "In a letter of August 1879 to K. P. Pobedonostsev, Dostoevsky presented Book VI (the elder Zosima) as his answer 'in artistic form' to the negative side argued in Book V.", source: "Dostoevsky's letters (as discussed in e.g. Slavic Review scholarship on Zosima); checked by web search", year: "1879", kind: "scholarship", license: "fact", grade: "B" },
      { id: "oken", claim: "In 1961, 90% of responding US physicians said they preferred not to tell a cancer patient the diagnosis.", source: "Oken D., 'What to tell cancer patients', JAMA 175:1120", year: "1961", kind: "scholarship", license: "fact", grade: "A" },
      { id: "novack", claim: "In 1979, repeating the questionnaire, 97% of respondents preferred to tell cancer patients their diagnosis.", source: "Novack D.H. et al., 'Changes in physicians' attitudes toward telling the cancer patient', JAMA 241:897", year: "1979", kind: "scholarship", license: "fact", grade: "A" },
      { id: "sartre", claim: "Sartre's 1945 lecture attributes to Dostoevsky the sentence 'If God did not exist, everything would be permitted'; no character in the novel says it.", source: "Sartre J.-P., L'existentialisme est un humanisme (1946); misattribution discussed widely (checked by web search)", year: "1945", kind: "scholarship", license: "fact", grade: "A" },
      { id: "q.ticket", claim: "“It's not God that I don't accept” — Ivan, registered in the quote register.", source: "Garnett translation, Book V ch. 4", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.powers", claim: "“miracle, mystery and authority” — the Inquisitor, registered in the quote register.", source: "Garnett translation, Book V ch. 5", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.kiss", claim: "“The kiss glows in his heart” — registered in the quote register.", source: "Garnett translation, Book V ch. 5", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.lawful", claim: "“everything would be lawful” — Miusov reporting Ivan, registered in the quote register.", source: "Garnett translation, Book II ch. 6", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "patient", claim: "The hospital and clinic cases are invented for teaching.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "g1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["garnett2"], atoms: ["judgment"], terms: ["theodicy"], poss: { karamazov: "argument" }, stem: "Ivan tells Alyosha true stories of children tortured, collected from newspapers. Then he says that even a final harmony that explained everything would not be worth one child's tears. What does he conclude?", alt: "He has just said he accepts God. So the conclusion cannot be “God does not exist”.", options: [
        { t: "He accepts God but refuses to accept a world bought at that price", ok: true, why: "He keeps God and returns “the ticket”: he will not buy harmony with a child's suffering." },
        { t: "God cannot exist, since such suffering is possible", bug: "surface", why: "He says outright that it is not God he fails to accept." },
        { t: "The suffering is justified if it leads to a greater harmony in the end", bug: "inversion", why: "That is exactly the view he rejects." },
        { t: "Newspapers exaggerate cruelty and should not be trusted", bug: "irrelevant", why: "He uses the stories because they are ordinary, reported facts." },
      ] },
      { id: "g2", type: "passage", stage: "primary", min: 1, src: ["q.ticket"], quotes: ["ticket"], poss: { karamazov: "primary" }, title: "The ticket", body: "The end of “Rebellion”. Ivan has finished his stories." },
      { id: "g3", type: "scene", stage: "reveal", min: 3, src: ["setting", "pobedonostsev"], terms: ["valid"], title: "A poem inside the novel", body: "Then Ivan tells a “poem” he has composed. Sixteenth-century Seville, the worst years of the Inquisition. Christ returns, quietly, and people know Him; the Grand Inquisitor, an old man of almost ninety, has Him arrested.\n\nAt night the Inquisitor visits the cell and talks, for pages. Fifteen centuries ago, he says, You were offered three things in the desert and refused them all, because You wanted people to follow You freely. But people cannot bear freedom. So we corrected Your work: we gave them bread, miracle and authority, and they are happy. We carry the burden of knowing.\n\nThe argument is [[valid|valid]]: grant its premises and the conclusion follows.", reps: [{ kind: "diagram", label: "Three refusals, three powers", svg: "temptations", body: "The temptations in the desert, as the Inquisitor reads them, and what the church took up instead." }, { kind: "story", label: "The author's answer", body: "Dostoevsky feared the chapter was too strong. In August 1879 he wrote to Konstantin Pobedonostsev that the next book, the life of the elder Zosima, was his answer: not a counter-argument but a life, “in artistic form”." }, { kind: "counterexample", label: "Not only about one church", body: "The Inquisitor is Catholic, and Dostoevsky was hostile to Rome. But readers have always applied the argument to any power that trades people's freedom for their comfort: a state, a party, a company. Keep both readings." }] },
      { id: "g4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["setting"], atoms: ["strategy", "narrative"], poss: { karamazov: "structure" }, stem: "The Inquisitor finishes. He wants an answer. How does Christ answer him?", options: [
        { t: "He says nothing, and kisses the old man", ok: true, why: "No counter-argument at all. The next passage shows what the kiss does, and does not do." },
        { t: "He refutes the argument one premise at a time", bug: "consistency", why: "That would make it a debate. Ivan's poem refuses Him that." },
        { t: "He performs a miracle to show His power", bug: "inversion", why: "Using a miracle would concede the Inquisitor's point." },
        { t: "He agrees that people cannot bear freedom", bug: "surface", why: "Agreement would end the poem's tension; the answer is something else." },
      ] },
      { id: "g5", type: "passage", stage: "primary", min: 1.5, src: ["q.powers", "q.kiss"], quotes: ["powers", "kiss"], poss: { karamazov: "primary" }, title: "Miracle, mystery and authority", body: "First, the heart of the Inquisitor's speech. Then the last line of Ivan's poem." },
      { id: "g6", type: "model", stage: "model", min: 3, model: "argument", src: ["pobedonostsev"], title: "Take the argument apart", body: "The Inquisitor's case as four premises. Switch any of them off.", ask: "**Find** which premise the novel's Book VI attacks, and which premise a defender of freedom would attack. Notice what the kiss attacks: none of them." },
      {
        id: "g7", type: "contrast", stage: "contrast", min: 2.5, src: ["oken", "novack", "q.powers"], terms: ["paternalism"], atoms: ["analogy", "judgment"], poss: { karamazov: "compare" }, title: "The Inquisitor and the doctor of 1961",
        left: { title: "The Inquisitor", body: "He hides the truth from the people for their happiness: they could not bear it, and he carries it for them." },
        right: { title: "US physicians, 1961", body: "90% of doctors who answered a survey said they preferred **not** to tell a patient they had cancer. When the same questionnaire was sent in 1979, 97% preferred to tell." },
        q: { stem: "What do the two share, and what changed in medicine?", options: [
          { t: "Both hide the truth for the other's comfort; medicine later chose the right to know", ok: true, why: "That is [[paternalism|paternalism]]: deciding for someone for their own good. Between the surveys, informed consent and patients' rights made withholding the diagnosis unacceptable." },
          { t: "Both lied to protect their own position and authority, not the person in front of them", bug: "moral", why: "Both claimed the other's good; that is what makes the argument hard." },
          { t: "Nothing connects them: one is a novel and the other is data", bug: "surface", why: "Different worlds, one mechanism: comfort bought with someone else's freedom." },
          { t: "Both were obeying laws that forbade telling the truth", bug: "authority", why: "No law forbade telling; it was a professional habit, justified by kindness." },
        ] },
      },
      { id: "g8", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["patient"], atoms: ["abstr", "judgment"], poss: { karamazov: "apply" }, stem: "A hospital rule says: “Don't show patients their full test results; they would only worry.” Which claim must be true for the rule to be justified?", options: [
        { t: "That patients are better off not knowing than knowing and worrying", ok: true, why: "That is the Inquisitor's first two premises in a white coat. If it is false (and the evidence since 1979 says patients generally want to know), the rule falls." },
        { t: "That test results are sometimes hard to read", bug: "irrelevant", why: "True, and an argument for explaining them, not for hiding them." },
        { t: "That doctors are busy, and explaining results properly takes a long time", bug: "irrelevant", why: "A real cost, but not the rule's stated justification." },
        { t: "That worry always makes illness worse", bug: "rigid", why: "An absolute claim no one has shown; and it would still not settle who decides." },
      ] },
      { id: "g9", type: "q", kind: "far", stage: "far", min: 1.5, src: ["sartre", "q.lawful"], atoms: ["judgment"], poss: { karamazov: "quote" }, stem: "A philosophy lecture says: “Dostoevsky wrote: if God did not exist, everything would be permitted.” What is accurate?", options: [
        { t: "No character says it; Ivan's idea is only reported, and Garnett's word is “lawful”", ok: true, why: "Miusov reports Ivan's argument (“everything would be lawful”); Dmitri asks Rakitin whether “all things are lawful”. The neat sentence is Sartre's 1945 paraphrase." },
        { t: "It is Ivan's own line, spoken to Alyosha in “Rebellion”", bug: "authority", why: "In “Rebellion” Ivan returns the ticket; he does not say that sentence." },
        { t: "It is from Nietzsche and was attributed to Dostoevsky by mistake", bug: "surface", why: "Nietzsche wrote “God is dead”; the “permitted” sentence is a paraphrase of Karamazov." },
        { t: "It is the novel's thesis, stated plainly by the narrator in the book's last chapter", bug: "surface", why: "The narrator never states it; the novel tests the idea through characters who act on it." },
      ] },
      {
        id: "g10", type: "forge", stage: "forge", min: 3, title: "Your rule for telling patients the truth", body: "You will face the Inquisitor's choice at a bedside. Build your rule now.",
        slots: [
          { key: "default", label: "By default", options: [{ t: "tell the truth the patient asks for, at their pace", grade: "good", note: "Truth on request respects both knowledge and the person.", say: "tell the truth the patient asks for, at their pace" }, { t: "decide what they can handle", grade: "bad", note: "That is the Inquisitor's move, and medicine abandoned it.", say: "decide what they can handle" }, { t: "tell everything at once, whether they want it or not", grade: "weak", note: "Honest, but it ignores that people absorb bad news in steps.", say: "tell everything at once" }] },
          { key: "who", label: "Who decides what is told", options: [{ t: "the patient", grade: "good", note: "Autonomy: it is their life.", say: "the patient" }, { t: "the family", grade: "weak", note: "Families help, but in most places the decision is the patient's.", say: "the family" }] },
          { key: "hatch", label: "Escape hatch", options: [{ t: "a patient may choose not to know the numbers", grade: "good", note: "The right to know includes the right not to.", say: "the patient may choose not to hear the numbers" }, { t: "none: rules are rules", grade: "bad", note: "Forcing knowledge on someone is also deciding for them.", say: "none" }] },
          { key: "check", label: "How you'll know it worked", options: [{ t: "ask what they understood and what they want next", grade: "good", note: "Teach-back is how clinicians check understanding.", say: "ask what they understood and what they want next" }, { t: "they stopped asking questions", grade: "bad", note: "Silence often means confusion or fear, not understanding.", say: "they stopped asking" }] },
        ],
        template: "Default: **{default}**. Decides: **{who}**. Escape hatch: {hatch}. Check: {check}.",
        critique: { stem: "A patient says: “Don't tell me the statistics, just tell me what to do.” Your rule should…", options: [{ t: "respect it, and ask again at the next visit", ok: true, why: "Choosing not to know is freedom used, not freedom taken away. Asking again keeps the door open." }, { t: "tell him anyway, because the truth always comes first", bug: "rigid", why: "That forces knowledge on him: the Inquisitor's error in reverse." }, { t: "never mention his prognosis again", bug: "cheapexit", why: "A one-time wish becomes a permanent silence he never chose." }] },
      },
    ],
    challenge: { stem: "The Inquisitor's argument is valid. What is the only honest way to reject it?", options: [{ t: "Show that one of its premises is false", ok: true }, { t: "Show that its conclusion is unpleasant", bug: "moral" }, { t: "Show that the man making it is a bad man", bug: "authority" }] },
    hooks: [
      { id: "km2.h1", gap: 1, poss: { karamazov: "argument" }, q: { stem: "Ivan's position after his stories of suffering children is that…", options: [{ t: "he accepts God but returns his ticket to this world", ok: true }, { t: "God does not exist, so nothing in the world has any meaning", bug: "surface" }, { t: "the suffering will be justified by a future harmony", bug: "inversion" }] } },
      { id: "km2.h2", gap: 7, poss: { karamazov: "quote" }, q: { stem: "The three powers the Grand Inquisitor names are…", options: [{ t: "miracle, mystery and authority", ok: true }, { t: "bread, freedom and a clear conscience", bug: "surface" }, { t: "faith, hope and love", bug: "surface" }] } },
      { id: "km2.h3", gap: 30, poss: { karamazov: "structure" }, q: { stem: "How does Christ answer the Grand Inquisitor?", options: [{ t: "With silence and a kiss; the old man lets Him go but keeps his idea", ok: true }, { t: "With a long speech that refutes the Inquisitor's argument premise by premise", bug: "consistency" }, { t: "With a miracle that frees Him from the prison", bug: "inversion" }] } },
    ],
    deeper: [
      { title: "Why Dostoevsky did not rig the argument", body: "He gave the Inquisitor his strongest case and then worried, in his letters, that Book VI might not answer it. Readers ever since have divided on whether it does. That refusal to make the opponent weak is a large part of why the chapter is read by people who have never read the novel." },
      { title: "Book VI in one line", body: "The novel's answer to the Inquisitor is a life, not a rebuttal, and its most quoted sentence is the elder's definition of hell as “the suffering of being unable to love” (Book VI, ch. 3). It describes a state of the heart rather than a place. Ask whether it answers Ivan's children at all, or changes the question.", quotes: ["hell"] },
      { title: "Read it whole this week", body: "Book V, chapters 4 and 5: about an hour and a half in two sittings, in any printing of Constance Garnett's translation (it is public domain). The reader questions 30 days after the trial session will include these chapters." },
      { title: "Open question", body: "Can a life or a gesture answer an argument? Philosophers divide: some say only arguments answer arguments; others that some questions are settled by how one lives. The novel bets on the second and knows it may lose." },
    ],
  });

  /* ─── 15 · A judicial error (boss world, deep) ─── */
  sessions.push({
    id: "km3", primitive: "trial", domain: "evidence", region: "Russia", works: ["karamazov"], requires: ["km1", "km2"], deep: true,
    atoms: ["prob", "narrative", "falsify", "causal", "question"],
    title: "A judicial error",
    hook: "A man threatened to kill his father, was in the garden with a weapon that night, and had money the next morning. The jury convicted him. Why is the last book of the novel called “A Judicial Error”?",
    minutes: 33,
    why: "The trial is the compiler's boss world: instead of a summary, a case you solve with every earlier tool (base rates, the decisive question, the filter, vivid stories, incentives). It is a weekend session because it is long, and it comes after the two sessions that make it mean something.",
    capability: "Weigh a case piece by piece, find the one piece of evidence the verdict really rests on, separate a story that fits from evidence that discriminates, and tell legal guilt from moral guilt.",
    stakes: "Doctors, juries and investors all convict on stories that fit. The novel shows exactly how an intelligent, fair-seeming court reaches a wrong verdict.",
    bridge: "The missing step: evidence counts only as much as it is more likely under one story than under its rival. A fact that fits both stories equally, however vivid, should not move you at all.",
    connection: "This is season 1's base rates and season 2's decisive question inside a novel. And the ideas line you switched on in the first Karamazov session, from Ivan to Smerdyakov, is where the book's real answer lies.",
    vocab: {
      lr: { name: "weight of evidence", h: "How much more likely a fact is if one story is true than if the other is.", s: "الدليل يستاهل قد إيه: لو هيحصل في الحكايتين زي بعض، يبقى مش دليل.", t: "The likelihood ratio P(E | H1) / P(E | H2); posterior odds = prior odds × likelihood ratios." },
      moralguilt: { name: "legal and moral guilt", h: "Who did the deed, and who made it possible or wanted it.", s: "مين اللي عمل الحاجة بإيده، ومين اللي فتح له الباب بكلامه.", t: "Legal guilt attaches to the act and intent defined by law; moral responsibility can extend to those whose words, wishes or omissions enabled it." },
    },
    provenance: [
      { id: "night", claim: "Dmitri climbed into his father's garden that night armed with a brass pestle, knowing the secret knocks; fleeing, he struck the old servant Grigory; the father was found murdered, and an envelope that had held 3,000 roubles lay torn open on the floor; Dmitri spent money freely that night at Mokroe.", source: "Garnett translation, Books VIII–IX (summarised)", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "door", claim: "At the trial Grigory maintained that the door from the house into the garden had been open; the defence got him to admit he had drunk a strong medicinal infusion that night.", source: "Garnett translation, Book XII ch. 2 'Dangerous Witnesses' (summarised; checked by web search)", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "confess", claim: "In their third and last meeting Smerdyakov tells Ivan that he killed Fyodor Pavlovich, feigning an epileptic fit, gives Ivan the money, and says Ivan's idea that 'all things are lawful' taught him; Smerdyakov hangs himself before the trial.", source: "Garnett translation, Book XI ch. 8 and ch. 10 (summarised)", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "letter", claim: "At the trial Katerina produces the letter Dmitri wrote her while drunk, saying he might kill his father; the jury convicts Dmitri, who is sentenced to twenty years' penal servitude.", source: "Garnett translation, Book XII (summarised; checked by web search)", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "becket", claim: "Four knights killed Archbishop Thomas Becket in Canterbury Cathedral in December 1170 after an outburst by Henry II; the famous 'turbulent priest' wording first appears centuries later; Henry did public penance (Avranches 1172, Canterbury 1174).", source: "Edward Grim's account and later histories; wording history checked by web search", year: "1170–1174", kind: "scholarship", license: "fact", grade: "B" },
      { id: "wells", claim: "Wells Fargo employees opened roughly two million accounts customers had not authorised under intense cross-selling targets ('eight is great'); about 5,300 employees were fired; the CEO resigned in October 2016.", source: "CFPB consent order (2016); US Department of Justice settlement (2020); press reports", year: "2016", kind: "scholarship", license: "fact", grade: "A" },
      { id: "q.lawful", claim: "“everything would be lawful” — registered in the quote register.", source: "Garnett translation, Book II ch. 6", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.lawful2", claim: "“All things are lawful then” — Dmitri reporting his question to Rakitin, registered in the quote register.", source: "Garnett translation, Book XI ch. 4", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.hurrah", claim: "“Hurrah for Karamazov!” — registered in the quote register.", source: "Garnett translation, Epilogue ch. 3", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "weights", claim: "The weights in the trial model are illustrative teaching numbers, not figures from the novel.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
      { id: "q.freud", claim: "Freud called the novel “the most magnificent novel ever written” and grouped it with Oedipus Rex and Hamlet as three masterpieces that all deal with parricide.", source: "Freud S., “Dostoevsky and Parricide” (1928), English translation; checked by exact-phrase web search", year: "1928", kind: "scholarship", license: "short quotation", grade: "A" },
      { id: "q.nabokov", claim: "In his lecture on Dostoevsky Nabokov called him “not a great writer, but a rather mediocre one”, objecting to melodrama and sentimentality.", source: "Nabokov V., Lectures on Russian Literature (1981); checked by exact-phrase web search", year: "1981", kind: "scholarship", license: "short quotation", grade: "A" },
    ],
    steps: [
      { id: "t1", type: "scene", stage: "hook", min: 3, src: ["night"], title: "What the court knew", body: "Dmitri owed Katerina 3,000 roubles and was desperate. That night he climbed into his father's garden with a brass pestle, knowing the secret knocks that told his father Grushenka had come. His father opened the window and looked out.\n\nThen Dmitri ran. The old servant Grigory, who had got up in the night, caught him on the fence; Dmitri struck him with the pestle and fled, bloodied. By morning the father lay murdered. On the floor lay a torn, empty envelope that had held 3,000 roubles, the money the father kept ready for Grushenka if she came to him. That night Dmitri spent money freely at an inn at Mokroe, where he was arrested.\n\nDmitri swore he never went into the house.", reps: [{ kind: "story", label: "The court", body: "A provincial courtroom, a jury of officials and peasants, a famous defence lawyer from Petersburg, a prosecutor with literary ambitions. Everyone expects a conviction." }] },
      { id: "t2", type: "q", kind: "alien", stage: "predict", min: 2, src: ["door"], atoms: ["question", "prob"], poss: { karamazov: "argument" }, stem: "Grigory swears that before he saw Dmitri running, the door from the house into the garden stood open. Dmitri says it was shut. Why does this one detail matter so much?", options: [
        { t: "If the door was open, someone came out of the house: the case rests on Grigory", ok: true, why: "If the door was open, Dmitri was probably inside. If Grigory is wrong, nothing puts Dmitri in the room. His reliability is the decisive question." },
        { t: "It shows Dmitri is a liar, so the rest of his story falls too", bug: "consistency", why: "It shows that one of two men is wrong about a door. Which one is the question." },
        { t: "It matters little, because the threats, the letter and the pestle already settle the case", bug: "omission", why: "Threats and presence fit a man who meant to kill and ran. They do not put him inside." },
        { t: "A servant's testimony weighs less in court than a gentleman's", bug: "authority", why: "Rank is not reliability; what matters is what he could see that night." },
      ] },
      { id: "t3", type: "q", kind: "alien", stage: "predict", min: 2, src: ["night"], atoms: ["falsify", "causal"], poss: { karamazov: "argument" }, stem: "The prosecutor says the torn envelope on the floor proves the robbery. The defence answers: “It proves someone took the money. It does not say who.” Who is right about what the envelope shows?", options: [
        { t: "The defence: anyone who took the money would leave the envelope", ok: true, why: "It is as likely under “Dmitri did it” as under “someone else did it”. Evidence equally likely under both stories has a weight of one: it should not move you." },
        { t: "The prosecutor: an empty envelope next to a body is damning", bug: "confirm", why: "It fits his story, but it fits every other robbery story just as well." },
        { t: "Neither: an envelope can never be evidence of anything", bug: "rigid", why: "It is evidence of the theft; it just cannot choose between thieves." },
        { t: "The prosecutor, because the jury of officials and peasants found it convincing", bug: "authority", why: "Being convinced is the outcome to explain, not a reason." },
      ] },
      { id: "t4", type: "q", kind: "alien", stage: "predict", min: 2, src: ["letter"], atoms: ["narrative", "prob"], stem: "The prosecutor paints a brilliant psychological portrait: a violent, jealous son who wrote that he might kill his father. The defence replies that psychology is a knife that cuts both ways. What is the defence's point?", options: [
        { t: "A story that fits the facts is not evidence against other stories that fit them", ok: true, why: "A portrait explains what happened if Dmitri did it; a different portrait explains it if he did not. Fit alone cannot choose between them." },
        { t: "Psychology is not a real science, so it should be banned from courtrooms altogether", bug: "rigid", why: "The point is narrower: fitting is not discriminating." },
        { t: "Dmitri's letter was written drunk, so it must be ignored completely", bug: "omission", why: "It raises the odds somewhat; the question is by how much." },
        { t: "The prosecutor is too clever, so he must be wrong", bug: "pretension", why: "Eloquence is neither evidence for nor against." },
      ] },
      { id: "t5", type: "model", stage: "model", min: 4, model: "trial", src: ["weights"], terms: ["lr"], title: "The jury's arithmetic", body: "Each piece of evidence multiplies the odds by its [[lr|weight]]: how much more likely it is if Dmitri did it than if someone else in the house did. Switch pieces on and off; change how much you trust Grigory.", ask: "**Find** which single piece carries the case, and what happens to it when Grigory's reliability falls to 50%." },
      { id: "t6", type: "scene", stage: "reveal", min: 3, src: ["confess", "letter"], terms: ["moralguilt"], title: "What the reader knows", body: "Before the trial, Ivan visits Smerdyakov three times. At the last meeting Smerdyakov tells him plainly: he killed the old man himself, after Dmitri had fled, while everyone believed he was lying in an epileptic fit. He gives Ivan the 3,000 roubles. And he says Ivan taught him: if there is no God, “all things are lawful”. That night Smerdyakov hangs himself.\n\nAt the trial Ivan, feverish, tells the truth and shows the money; the court takes him for a man in delirium. Then Katerina, to save Ivan, produces Dmitri's drunken letter. The jury convicts Dmitri: twenty years' penal servitude. The last book's title is the author's verdict: **A Judicial Error**.", reps: [{ kind: "story", label: "Who is guilty?", body: "Smerdyakov did the deed. Ivan gave him the idea and, by leaving town that day, the chance, which is why Ivan collapses. Dmitri wished his father dead and did not kill him; he accepts his sentence as suffering he deserves for having wanted it. The novel separates [[moralguilt|legal and moral guilt]] and gives each brother a share." }] },
      { id: "t7", type: "passage", stage: "primary", min: 1.5, src: ["q.lawful", "q.lawful2"], quotes: ["lawful", "lawful2"], poss: { karamazov: "primary" }, title: "The idea that travelled", body: "The idea goes from Ivan's mouth to a gossip at the monastery (first passage), to Rakitin and Dmitri in prison (second), and to Smerdyakov's hands." },
      {
        id: "t8", type: "contrast", stage: "contrast", min: 2.5, src: ["becket", "confess"], atoms: ["causal", "analogy"], poss: { karamazov: "compare" }, title: "Ivan and a king",
        left: { title: "Ivan and Smerdyakov, 1880", body: "Ivan talks, in company and to his servant, about a world where all things are lawful. Smerdyakov acts, and tells Ivan he was only doing what Ivan wanted." },
        right: { title: "Henry II and four knights, 1170", body: "The king rages in public against Archbishop Becket. Four knights ride to Canterbury and kill him in the cathedral. Henry later does public penance for the murder." },
        q: { stem: "What do the two cases show about guilt?", options: [
          { t: "The one who strikes is legally guilty; the one whose words licensed it, morally", ok: true, why: "Neither Ivan nor Henry held the weapon, and both came to act as guilty men: Ivan's breakdown, Henry's penance. Words that make a deed thinkable are part of its cause." },
          { t: "Only the one who strikes is guilty, because words alone can never kill anyone at all", bug: "omission", why: "Both cases turn on a listener who heard permission in words; leaving the speaker out drops a cause." },
          { t: "Only the speaker is guilty; the others just obeyed", bug: "agent", why: "The knights and Smerdyakov chose; obedience does not remove their guilt." },
          { t: "No one is guilty; these were tragic accidents", bug: "moral", why: "Both deeds were planned; calling them accidents erases every agent." },
        ] },
      },
      { id: "t9", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["weights"], atoms: ["prob", "question"], stem: "A patient with chest pain has three findings: pain after a heavy meal, anxiety, and an abnormal ECG. The resident's story (“stress after a big dinner”) fits all three. What should he ask before accepting it?", options: [
        { t: "How much more likely is each finding under the rival story, a heart attack?", ok: true, why: "A heavy meal and anxiety fit both stories, so they weigh little. The ECG is far more likely if it is the heart. The story that fits is not the story that discriminates." },
        { t: "Does the story explain every finding?", bug: "confirm", why: "It does, and so does the dangerous rival. Fit is the prosecutor's mistake." },
        { t: "How confident does the patient feel about the cause?", bug: "authority", why: "Useful context, but not a test between two causes of chest pain." },
        { t: "Which of the two stories is more vivid, and easier for the patient to remember?", bug: "surface", why: "Vividness is how the jury convicted Dmitri." },
      ] },
      { id: "t10", type: "q", kind: "alien", stage: "far", min: 2, src: ["wells"], atoms: ["causal", "strategy"], stem: "A bank's leaders repeat “eight is great”: eight products per customer. Branch staff open about two million accounts customers never asked for; about 5,300 employees are fired. Where does the responsibility lie?", options: [
        { t: "With the staff who opened them, and the leaders whose targets made it expected", ok: true, why: "Legal guilt fell first on employees; the chief executive resigned and the bank later paid billions. Targets and slogans licensed the deed, as Ivan's words did." },
        { t: "Only with the employees, since no leader ever told anyone to break the law directly", bug: "omission", why: "No one had to: targets that can only be met by cheating are an instruction in themselves (session 5)." },
        { t: "Only with the leaders, since employees had no choice", bug: "agent", why: "Many employees refused; choice was constrained, not absent." },
        { t: "With the customers, who should have checked their statements", bug: "moral", why: "Victims noticing late does not make them the cause." },
      ] },
      { id: "t12", type: "passage", stage: "primary", min: 1, src: ["q.freud", "q.nabokov"], quotes: ["freud", "nabokov"], label: "TWO VERDICTS", poss: { karamazov: "criticism" }, title: "Two great readers, opposite verdicts", body: "Freud, in 1928, set the novel beside Oedipus Rex and Hamlet: three masterpieces, he wrote, about the killing of a father, and he read all three through his own theory of guilt. Nabokov, lecturing on Russian literature in America, found Dostoevsky melodramatic and sentimental. Both were serious readers, and both had something to prove. Read the two verdicts." },
      { id: "t13", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["q.nabokov", "q.freud"], atoms: ["judgment", "narrative"], poss: { karamazov: "discuss" }, stem: "At dinner a friend says: “Nabokov called Dostoevsky ‘not a great writer, but a rather mediocre one’, so that book is overrated.” What keeps the conversation worth having?", options: [
        { t: "Ask which part his charge fits, the melodrama or the arguments", ok: true, why: "A verdict is answered by its reasons. The melodrama is real (scandals, fits, a murder plot); whether it touches Ivan's argument is the interesting question, and it keeps the talk open." },
        { t: "Answer that Freud called it the most magnificent novel ever written", bug: "authority", why: "One great name against another settles nothing; both men had a theory or a taste to defend." },
        { t: "Agree: a great novelist's verdict on another novelist settles it", bug: "authority", why: "Nabokov's verdict is evidence about his taste as well as about the book; it has to be weighed, not obeyed." },
        { t: "Say he misread it, having only read it in English translation", bug: "irrelevant", why: "Nabokov was a native Russian speaker. And a verdict is answered by its reasons, not by guesses about its reader." },
      ] },
      {
        id: "t11", type: "forge", stage: "forge", min: 3.5, title: "Your rule against a judicial error", body: "You will judge stories every day on the wards. Build your rule.",
        slots: [
          { key: "first", label: "First question", options: [{ t: "what else would explain all of this?", grade: "good", note: "Name the rival before weighing anything.", say: "what else would explain all of this" }, { t: "does my story fit everything?", grade: "bad", note: "Every good wrong story fits everything.", say: "does my story fit everything" }] },
          { key: "weigh", label: "Weigh each fact by", options: [{ t: "how much more likely it is under my story than the rival", grade: "good", note: "The weight of evidence.", say: "how much more likely it is under my story than the rival" }, { t: "how striking it is", grade: "bad", note: "The envelope was striking and weighed nothing.", say: "how striking it is" }] },
          { key: "witness", label: "For a witness, ask", options: [{ t: "could he see it, then and there?", grade: "good", note: "Grigory's door: sight, light and what he had drunk.", say: "could they see it, then and there" }, { t: "how sure he sounds", grade: "weak", note: "Confidence and accuracy are only loosely linked in eyewitnesses.", say: "how sure they sound" }] },
          { key: "stop", label: "Stop when", options: [{ t: "the rival has been made unlikely, not just my story likely", grade: "good", note: "That is the difference between the verdict and the truth here.", say: "the rival is unlikely" }, { t: "the story is complete", grade: "bad", note: "Complete stories are the easiest to believe and to get wrong.", say: "the story is complete" }] },
        ],
        template: "Ask: **{first}**. Weigh by {weigh}. Witnesses: {witness}. Stop when {stop}.",
        critique: { stem: "Your story fits every fact and you feel certain. What must you still do?", options: [{ t: "Check that the rival story fits the facts clearly worse", ok: true, why: "Certainty from fit is the prosecutor's feeling. Only a comparison discriminates." }, { t: "Nothing: fitting every fact is proof", bug: "confirm", why: "That is how Dmitri was convicted." }, { t: "Find one more fact that fits your story, to make it airtight", bug: "confirm", why: "More fitting facts add little if they fit the rival as well." }] },
      },
    ],
    challenge: { stem: "A fact is exactly as likely if your story is true as if the rival is true. How much should it change your mind?", options: [{ t: "Not at all", ok: true }, { t: "A little, since it does fit your story", bug: "confirm" }, { t: "A lot, if it is vivid", bug: "surface" }] },
    hooks: [
      { id: "km3.h1", gap: 1, q: { stem: "In the trial, “psychology cuts both ways” means…", options: [{ t: "fitting the facts doesn't count against rivals that fit them too", ok: true }, { t: "psychological evidence is always false in court", bug: "rigid" }, { t: "the defence and the prosecution were equally clever and equally persuasive", bug: "surface" }] } },
      { id: "km3.h2", gap: 7, poss: { karamazov: "structure" }, q: { stem: "Who killed Fyodor Pavlovich, and who was convicted?", options: [{ t: "Smerdyakov killed him; Dmitri was convicted", ok: true }, { t: "Dmitri killed him and was convicted", bug: "confirm" }, { t: "Ivan killed him, and Smerdyakov was convicted in his place", bug: "agent" }] } },
      { id: "km3.h3", gap: 30, q: { stem: "The torn envelope on the floor had a weight of about one because…", options: [{ t: "anyone who took the money would have left it", ok: true }, { t: "it was found by a servant, not by the police investigators", bug: "authority" }, { t: "envelopes are never evidence", bug: "rigid" }] } },
    ],
    deeper: [
      { title: "The defence's own trick", body: "The famous defence lawyer wins the argument about the evidence and then overreaches: he suggests that a father who never behaved as a father is not really one, so even parricide would not be parricide. Book XII, chapter 13 is titled “A Corrupter of Thought”. Many readers think this, as much as the evidence, is why the jury of officials and peasants stood firm (chapter 14)." },
      { title: "The ending you did not see", body: "After the verdict: Ivan lies ill; the escape to America with Grushenka that Ivan planned for Dmitri is discussed between Katerina and Alyosha; and the boy Ilyusha, whose father Dmitri once humiliated, dies. At the funeral Alyosha asks the boys to remember this day and one another. The last words are theirs: “Hurrah for Karamazov!” Read the Epilogue's last chapter whole.", quotes: ["hurrah"] },
      { title: "Open question", body: "Is Ivan guilty? He neither struck nor ordered. The book lets him feel guilty and lets the reader decide. The courts of most countries would acquit him; most readers do not." },
    ],
  });

  /* ─── 16 · Ozymandias ─── */
  sessions.push({
    id: "ozy", primitive: "frame", domain: "poetry", region: "England and Egypt", works: ["ozymandias"],
    atoms: ["narrative", "taste", "abstr"],
    title: "A boast in the sand",
    hook: "Fourteen lines about a broken statue in the desert have outlived every empire of their century. What does the poem do that a summary of it cannot?",
    minutes: 24,
    why: "The masterpiece compiler must not overfit to long novels. A sonnet is the opposite case: the compiler's decision is “read 100%, many times”. The skill here is close reading: who speaks, what one word does, how a frame turns a boast against itself. And the king is Egyptian.",
    capability: "Read a short poem whole, find who is speaking each line, see how nested frames change the meaning of the words inside them, and say what a poem does instead of what it is “about”.",
    stakes: "“It's about the transience of power” is the sentence every summary gives. It is true and it is nothing. Possession is being able to point at the line that does it.",
    bridge: "The missing step: the king's words were carved to mean “despair of ever equalling me”. Put the same words in a desert, quoted by a traveller, quoted by a poet, and they mean “despair: this is what becomes of all works”. The frame changes the meaning without changing a letter.",
    connection: "The Karamazov chronicle and this sonnet share a device: a narrator who reports what others said. In both, the frame is where the meaning turns.",
    vocab: {
      sonnet: { name: "sonnet", h: "A 14-line poem with a strict pattern of rhymes and a turn in the middle.", s: "قصيدة من ١٤ سطر، ليها نظام قافية، وفي النص بتلف وتغيّر الاتجاه.", t: "A fourteen-line lyric in iambic pentameter; Petrarchan (octave + sestet) and Shakespearean (three quatrains + couplet) are the main forms. Ozymandias rhymes ABABACDC EDEFEF, fitting neither." },
      frame: { name: "frame narrative", h: "A story told inside another story, by someone inside it.", s: "حكاية جوه حكاية: حد بيحكي عن حد حكى له.", t: "An embedding of narration levels; each level can qualify, ironise or authenticate the one inside it." },
      irony: { name: "dramatic irony", h: "When the reader understands words differently from the person who says them.", s: "لما إنت فاهم الكلام بمعنى، واللي قاله كان قاصد معنى تاني خالص.", t: "A discrepancy between a speaker's intended meaning and the meaning available to the audience, often produced by later knowledge." },
      mock: { name: "to mock (older sense)", h: "To imitate, and to ridicule.", s: "قلّد وتريق في نفس الوقت، زي النحّات اللي نقل الغرور على الحجر.", t: "In earlier English 'mock' could mean to imitate or represent; Shelley's line keeps both senses active." },
    },
    provenance: [
      { id: "shelley", claim: "Shelley's 'Ozymandias' was first printed in The Examiner on 11 January 1818, written in a friendly sonnet competition with Horace Smith, whose sonnet on the same subject appeared there on 1 February 1818.", source: "Standard publication history (checked by web search)", year: "1818", kind: "primary", license: "public domain", grade: "A" },
      { id: "diodorus", claim: "Both poets drew on Diodorus Siculus's report of an inscription at the tomb of 'Osymandyas' at Thebes: roughly, 'King of Kings am I; if anyone would know how great I am, let him surpass one of my works.' Ozymandias is a Greek form of a throne name of Ramesses II.", source: "Diodorus Siculus, Bibliotheca historica I.47 (paraphrased)", year: "1st c. BCE", kind: "primary", license: "public domain (paraphrased)", grade: "A" },
      { id: "rhyme", claim: "The rhyme scheme is ABABACDC EDEFEF, which follows neither the Petrarchan nor the Shakespearean pattern.", source: "Standard analysis (checked by web search)", year: "—", kind: "scholarship", license: "fact", grade: "A" },
      { id: "smith", claim: "Horace Smith's sonnet on the same statue ends by imagining a hunter in the wilderness where London once stood, wondering what race lived there.", source: "Smith H., 'Ozymandias' (paraphrased, not quoted)", year: "1818", kind: "primary", license: "public domain (paraphrased)", grade: "A" },
      { id: "ramesseum", claim: "The Ramesseum, Ramesses II's mortuary temple on the west bank at Luxor (ancient Thebes), contains the fallen fragments of a colossal statue of the king.", source: "Standard Egyptology; visible on site", year: "13th c. BCE", kind: "scholarship", license: "fact", grade: "A" },
      { id: "q.ozy", claim: "“I met a traveller from an antique land” — the whole poem, registered in the quote register.", source: "Shelley P.B., 'Ozymandias'", year: "1818", kind: "primary", license: "public domain", grade: "A" },
      { id: "startup", claim: "The company and news cases are invented for teaching.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "o1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["q.ozy"], atoms: ["narrative"], terms: ["frame"], poss: { ozymandias: "structure" }, stem: "Before you read it: a 14-line poem about a ruined statue of a king. How many voices do you expect to speak in it?", alt: "Count who says something, not who is described.", options: [
        { t: "Three: the poet, a traveller, and the king's inscription", ok: true, why: "The poet speaks a line and a half, the traveller nearly all the rest, and the king two lines, through stone. The sculptor is present but silent." },
        { t: "One: the poet, describing a ruin he visited", bug: "omission", why: "Shelley never saw it; he gives the description to a traveller." },
        { t: "Two: the poet and the king", bug: "omission", why: "That leaves out the voice that speaks most of the poem." },
        { t: "Four: the sculptor also speaks to us, in his own words, near the end", bug: "surface", why: "The sculptor's work speaks; he says nothing himself." },
      ] },
      { id: "o2", type: "passage", stage: "primary", min: 2.5, src: ["q.ozy", "shelley"], quotes: ["ozy"], poss: { ozymandias: "primary" }, label: "READ IT WHOLE, TWICE", title: "“Ozymandias”", body: "Read it once for what happens and once aloud, slowly, for who is speaking." },
      { id: "o3", type: "q", kind: "predict", stage: "predict", min: 2, src: ["q.ozy"], terms: ["mock"], atoms: ["narrative", "taste"], poss: { ozymandias: "argument" }, stem: "“The hand that mocked them, and the heart that fed.” Whose hand, whose heart, and what are “them”?", options: [
        { t: "The sculptor's hand copied the king's passions; the king's heart fed them", ok: true, why: "“Them” are the passions: frown, sneer, cold command. The sculptor's hand [[mock|mocked]] them, which meant both imitated and ridiculed; the king's heart nourished them. Both are dust; the passions survive in stone." },
        { t: "The traveller's hand drew the statue; the poet's heart felt pity", bug: "agent", why: "Neither is in these lines; the survivors are the passions, outliving the people who made and felt them." },
        { t: "The king's hand mocked his many enemies; the sculptor's heart fed his fear of him", bug: "inversion", why: "The roles are swapped: the hand belongs to the maker, the heart to the king." },
        { t: "Time's hand destroyed the statue; the desert's heart swallowed it", bug: "surface", why: "A tempting image, but time and desert come later, in the last lines." },
      ] },
      { id: "o4", type: "scene", stage: "reveal", min: 2.5, src: ["diodorus", "rhyme", "ramesseum"], terms: ["irony", "sonnet"], title: "Three frames around a boast", body: "Ozymandias is the Greek form of a name of **Ramesses II**, who ruled Egypt in the 13th century BCE and built more than almost any pharaoh. The Greek historian Diodorus reported an inscription at his tomb at Thebes: roughly, if anyone would know how great I am, let him surpass one of my works.\n\nShelley puts that boast inside three frames: stone, a traveller, a poet. Then he places one sentence after it: **Nothing beside remains.** The king's “despair” was meant as: you will never equal me. Framed by the sand, it now means: this is what becomes of everything. That is [[irony|dramatic irony]], made by the frame, not by changing a word.", reps: [{ kind: "diagram", label: "Look at it on the page", body: "The poem is a [[sonnet|sonnet]] with a rhyme scheme that fits neither standard form (ABABACDC EDEFEF): the rhymes slide into one another like sand. The turn comes at line 9, “And on the pedestal”: from the face to the words." }, { kind: "story", label: "In Luxor", body: "The Ramesseum, Ramesses II's temple on Luxor's west bank, still has the fallen fragments of his colossal statue. Shelley never saw it; you can." }] },
      { id: "o5", type: "model", stage: "model", min: 3, model: "voices", title: "Read by voice", body: "Switch each voice on and see which words are whose.", ask: "**Find** who speaks the last three lines, and read the king's two lines next to the sentence that follows them." },
      {
        id: "o6", type: "contrast", stage: "contrast", min: 2.5, src: ["smith", "shelley"], atoms: ["taste", "analogy"], poss: { ozymandias: "compare" }, title: "Same statue, same week, two poets",
        left: { title: "Shelley", body: "Leaves the king's words standing in the sand and adds one flat sentence: nothing beside remains. He never states a moral." },
        right: { title: "Horace Smith", body: "Describes the same giant leg, then turns to London and imagines a hunter one day crossing the wilderness where the city stood, wondering what race once lived there." },
        q: { stem: "Both poems make the same point. Why is Shelley's the one people still quote?", options: [
          { t: "Shelley lets the king's own words carry the irony; Smith states the lesson himself", ok: true, why: "A reader who draws the conclusion owns it. Smith's version tells you what to feel; Shelley's makes you feel it. (A judgment most critics share, not a law.)" },
          { t: "Shelley was already the more famous poet, so his version simply won by reputation", bug: "authority", why: "Reputation helps, but both appeared in the same paper; readers kept choosing one text." },
          { t: "Smith's poem is about London, so it is less universal", bug: "inversion", why: "Smith's turn to London is his most universal move; the difference is how the lesson is delivered." },
          { t: "Shelley's poem is shorter, and short poems are remembered better", bug: "surface", why: "Both are sonnets: fourteen lines each." },
        ] },
      },
      { id: "o7", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["startup"], atoms: ["abstr", "narrative"], poss: { ozymandias: "apply" }, stem: "A founder's slide from 2015 reads “We will be the last platform anyone needs.” In 2026 it appears in an article about the company's bankruptcy. What happened to the words?", options: [
        { t: "A new frame reverses them: the boast now proves what it denied", ok: true, why: "The Ozymandias mechanism: the words are unchanged; the frame (bankruptcy, a journalist, a reader in 2026) turns a boast into its own refutation." },
        { t: "They were false from the start, so nothing about them changed", bug: "omission", why: "Their meaning changed with the frame; that is the mechanism to see." },
        { t: "The journalist edited the quote to make it look foolish", bug: "agent", why: "The words are the founder's, exactly; only the setting is new." },
        { t: "Nothing: company slides are a genre readers never take seriously", bug: "surface", why: "Investors did, in 2015." },
      ] },
      { id: "o8", type: "q", kind: "far", stage: "far", min: 1.5, src: ["startup"], atoms: ["abstr", "info"], terms: ["frame"], stem: "A report says: a reporter was told by a witness that a ministry spokesman said “our forces never retreat.” Which statement is the report actually evidence for?", options: [
        { t: "That the witness says the spokesman said it", ok: true, why: "Each frame adds a layer to trust. The report is evidence about the outermost speaker; the innermost claim is three frames away, like the king's boast." },
        { t: "That the forces never retreat", bug: "surface", why: "That is the innermost claim; three frames stand between you and it." },
        { t: "That the spokesman is lying", bug: "confirm", why: "Nothing in the report shows that, only that the claim came through several mouths." },
        { t: "Nothing at all, because second-hand reports are worthless", bug: "rigid", why: "They are evidence, of something smaller than the headline." },
      ] },
      {
        id: "o9", type: "forge", stage: "forge", min: 3, title: "How you will read the next short poem", body: "A protocol for any poem short enough to read whole.",
        slots: [
          { key: "read", label: "First", options: [{ t: "read it whole, then again aloud", grade: "good", note: "Sound carries half the meaning of a poem.", say: "read it whole, then aloud" }, { t: "read a summary of what it's about", grade: "bad", note: "The summary is the one thing a poem is not.", say: "read a summary" }] },
          { key: "voices", label: "Then", options: [{ t: "mark who speaks each line", grade: "good", note: "The frames are where the meaning turns.", say: "mark who speaks each line" }, { t: "find the moral", grade: "weak", note: "Good poems often refuse to state one.", say: "find the moral" }] },
          { key: "word", label: "Look for", options: [{ t: "one word doing two jobs (like “mocked”)", grade: "good", note: "Double meanings are where poems compress.", say: "one word doing two jobs" }, { t: "the poet's dates", grade: "weak", note: "Useful context, not the poem.", say: "the poet's dates" }] },
          { key: "keep", label: "Keep", options: [{ t: "one line, with who says it and where", grade: "good", note: "A quotation in context, not a fridge magnet.", say: "one line, with who says it and where" }, { t: "the whole poem by heart, today", grade: "weak", note: "Admirable; the hooks will bring the lines back anyway.", say: "the whole poem by heart" }] },
        ],
        template: "First: **{read}**. Then: {voices}. Look for: {word}. Keep: {keep}.",
        critique: { stem: "Someone asks what “Ozymandias” is about. Which answer shows possession rather than summary?", options: [{ t: "“A king's boast, quoted in the sand, now proves the opposite of what it meant.”", ok: true, why: "It names the mechanism and the line that carries it." }, { t: "“It explores the transience of power and the timeless vanity of all human ambition.”", bug: "pretension", why: "True of a hundred poems, and says nothing about this one." }, { t: "“It's a sonnet by Shelley, written in 1818.”", bug: "surface", why: "Facts about the poem, not the poem." }] },
      },
    ],
    challenge: { stem: "In “Ozymandias”, who speaks “Nothing beside remains”?", options: [{ t: "The traveller", ok: true }, { t: "The king, on the pedestal", bug: "agent" }, { t: "The poet, in his own voice", bug: "agent" }] },
    hooks: [
      { id: "ozy.h1", gap: 1, poss: { ozymandias: "quote" }, q: { stem: "“Look on my Works, ye Mighty, and despair!” Whose words are these, and how do they reach us?", options: [{ t: "The king's inscription, reported by a traveller, told by the poet", ok: true }, { t: "The poet's own warning to the powerful men of his own day, in his own voice", bug: "agent" }, { t: "The sculptor's signature on the pedestal", bug: "agent" }] } },
      { id: "ozy.h2", gap: 7, poss: { ozymandias: "argument" }, q: { stem: "In “the hand that mocked them”, mocked means…", options: [{ t: "imitated and ridiculed at once", ok: true }, { t: "destroyed and broken into pieces", bug: "surface" }, { t: "worshipped as a god", bug: "inversion" }] } },
      { id: "ozy.h3", gap: 30, poss: { ozymandias: "context" }, q: { stem: "Ozymandias is a Greek form of the name of…", options: [{ t: "Ramesses II", ok: true }, { t: "Tutankhamun", bug: "surface" }, { t: "Alexander the Great", bug: "surface" }] } },
    ],
    deeper: [
      { title: "Why this counts as possession", body: "The compiler's decision for a sonnet is to read 100%: nothing in it can be removed. What the session adds is the frame, the double word and the historical king, so that the next reading sees more. Knowing the poem by heart is optional; knowing who speaks each line is not." },
      { title: "The competition", body: "Shelley and the banker-poet Horace Smith wrote their sonnets on the same subject as a friendly contest in the winter of 1817–18. Both were printed in The Examiner within three weeks of each other." },
      { title: "Open question", body: "Did a particular statue in London (the “Younger Memnon”, a head of Ramesses II that reached the British Museum around this time) prompt the poem? Scholars disagree, and the poem does not need it." },
    ],
  });

  const season3 = { id: "s3", domain: "culture", title: "Season 3 · Possession", sessions, visuals, models, quotes };
  const S = (window.RENAISSANCE_SEASONS = window.RENAISSANCE_SEASONS || []);
  if (!S.some((z) => z.id === "s3")) S.push(season3);
  else {
    const z = S.find((y) => y.id === "s3");
    z.sessions.unshift(...sessions);
    Object.assign(z.visuals, visuals);
    Object.assign(z.models, models);
    Object.assign(z.quotes = z.quotes || {}, quotes);
  }
})();
