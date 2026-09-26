/* RENAISSANCE · the rights-aware media registry (§134 rights classes, §135 provenance, §138 object types, §139 a
 * visual must do cognitive work).
 *
 * One entry for every visual, model and listening passage the seasons use: its type, its rights class, where its
 * content comes from, and the job it does for the reader's thinking. Quotations are registered with their full record
 * in the seasons (quotes: {…}); RENAISSANCE.media() joins them in. Nothing here is decoration: an entry must name the
 * thinking it enables, and tests/renaissance_v3_test.js fails on any media object with no entry, no job, a rights
 * class outside §134, or no step that uses it.
 */
(function () {
  "use strict";
  const ORIG = "transformative original explanation";
  const V = (type, job, source, rights) => ({ type, job, source, rights: rights || ORIG });
  const visuals = {
    sirens: V("diagram", "Separates the calm designer from the tempted self, so the reader sees that a rule binds a future self, not the temptation.", "Homer, Odyssey XII (public domain), drawn as a schematic by the project"),
    tree: V("diagram", "Turns a percentage question into counted people, so the base rate becomes visible and 9 in 98 can be read off.", "Gigerenzer's natural-frequency method, redrawn with the session's own numbers"),
    loops: V("diagram", "Makes the sign of each arrow visible so the reader can tell a self-correcting loop from a runaway one.", "Standard causal-loop notation, drawn by the project"),
    target8: V("data", "Shows reported times bunching under a target, the visible signature of a measure being gamed.", "Bevan and Hood (2006), reported finding redrawn as a schematic, not their figure"),
    semmel: V("data", "Puts two clinics on one scale over six years, so a steady difference cannot be explained by chance.", "Semmelweis (1861) yearly figures, public domain data, charted by the project"),
    semmel47: V("data", "Shows the timing of the drop against the change, the evidence that splits cause from coincidence.", "Semmelweis (1861) monthly figures for 1847, public domain data, charted by the project"),
    threeBoxes: V("diagram", "Locates the queue in front of the slowest step, so improvements elsewhere visibly change nothing.", "Illustrative clinic, drawn by the project (no real clinic's data)"),
    decisionTree: V("diagram", "Shows that only information able to move you to another branch has value.", "Standard decision-tree notation with the session's own numbers"),
    grandExp: V("map", "Puts two water supplies on the same streets, so the reader sees why this comparison removes the confounders.", "Snow (1855) house and death counts, public domain data, redrawn as a schematic street"),
    chartBad: V("data", "One half of a blind comparison: the reader feels the cost of 3D, legends and gridlines before being told.", "Illustrative numbers (not real wards), drawn by the project"),
    chartGood: V("data", "The other half of the blind comparison: common-scale sorted bars with values written on.", "Illustrative numbers (not real wards), drawn by the project"),
    labelBad: V("image", "One half of a blind comparison: every line shouted, so no line is found first.", "Invented label, drawn by the project (not a real product)"),
    labelGood: V("image", "The other half: one line first, so a tired reader finds the dose limit at once.", "Invented label, drawn by the project (not a real product)"),
    compileMap: V("diagram", "Shows the whole novel as read-whole, passage and bridge parts, so the reader sees where the hours go before spending them.", "The project's reading plan for The Brothers Karamazov (book and chapter numbers from the novel)"),
    familyMap: V("diagram", "Holds five men and their money, love, ideas and care in one view, so the names never become a fog.", "Relations stated in the novel (Garnett translation, public domain), drawn by the project"),
    temptations: V("diagram", "Pairs each refused temptation with the power the Inquisitor took up, the structure of his argument at a glance.", "Book V ch. 5 of the novel (public domain translation), drawn by the project"),
    konig: V("map", "Gives the reader the real problem as Euler met it, before any abstraction.", "Schematic of Königsberg's seven bridges as described in Euler's 1736 paper (public domain), not a copy of any map"),
    graph4: V("diagram", "The abstraction itself: land becomes dots and bridges become lines, and only the counts at each dot remain.", "Euler (1736), redrawn in modern graph notation"),
    willow: V("diagram", "Lays out van Helmont's weighings so the reader can predict where the wood came from before the answer.", "Van Helmont, Ortus medicinae (1648), public domain, figures redrawn"),
    phrases: V("music", "Shows that two phrases differ only in their last notes, so the ear's question and answer can be seen.", "Beethoven, Ninth Symphony (1824), melody public domain, drawn as notation by the project"),
    relay: V("timeline", "Traces one line of medicine through Greek, Arabic and Latin, so the transmission reads as a chain of named people.", "Standard histories of medicine (see the session's sources), drawn by the project"),
    axis: V("diagram", "Shows the 180-degree line from above, so the rule behind screen direction becomes a matter of geometry.", "Standard film grammar, drawn by the project"),
    chainArch: V("diagram", "Puts a hanging chain above its flipped image, so the reader sees why a hanging shape stands in compression.", "Hooke (1675) and the funicular principle, drawn by the project"),
  };
  const M = (job, source) => ({ type: "interactive", job, source: source || "a model built by the project; its numbers are stated in the step", rights: ORIG });
  const models = {
    discount: M("Lets the reader watch a preference reverse as the day approaches, so hyperbolic discounting is felt, not memorised."),
    planes: M("Lets the reader bring back the missing planes and watch the conclusion flip, so survivorship bias becomes visible."),
    icons: M("Lets the reader change prevalence, sensitivity and false positives and watch what a positive means."),
    shower: M("Lets the reader add delay to a loop and watch it overshoot, so the cause of oscillation is felt."),
    goodhart: M("Lets the reader apply pressure to a number and watch gaming separate it from reality."),
    hypo: M("Lets the reader test each of Semmelweis's explanations against the observations, and see which survive.", "Semmelweis (1861) observations, public domain"),
    pipeline: M("Lets the reader change each step's capacity and see that only the slowest step moves the flow."),
    voi: M("Lets the reader slide certainty and watch the value of a question rise and fall."),
    street: M("Lets the reader compare houses on the same streets by water company, so the natural experiment is performed, not described.", "Snow (1855) counts, public domain"),
    growth: M("Lets the reader switch to a logarithmic scale and see doubling as a straight line."),
    wordwork: M("Lets the reader cut words one edit at a time and see that the meaning survives."),
    mechs: M("Lets the reader switch mechanisms until every symptom is explained, then find which can be removed."),
    relations: M("Lets the reader switch the family's kinds of relation on one at a time, so each force in the plot is seen alone.", "Relations stated in the novel (public domain translation)"),
    argument: M("Lets the reader remove any premise of the Inquisitor's case and see whether the conclusion still follows.", "Book V ch. 5 of the novel (public domain translation)"),
    trial: M("Lets the reader multiply odds by each piece of evidence and see how a story that fits can still be weak evidence.", "Evidence as presented at the trial in Book XII; the weights are the project's, stated as such"),
    voices: M("Lets the reader switch voices on and see which words belong to the traveller, the king and the poet.", "Shelley, “Ozymandias” (1818), public domain"),
    bridges: M("Lets the reader add and remove bridges and watch the odd-degree count decide the verdict.", "Euler (1736), public domain"),
    atoms: M("Lets the reader follow fat's atoms out of the body, so the answer ‘breathed out as carbon dioxide’ is computed, not asserted.", "Meerman and Brown (2014) stoichiometry, with the equation stated"),
    hankin: M("Lets the reader choose a grid and an angle and watch a pattern grow from the rule, so the method is possessed, not a picture.", "Hankin's polygons-in-contact method (described 1925); drawn live from the rule, nothing copied"),
    cadence: M("Lets the reader choose the last chord and hear the difference between home, open and deceptive endings.", "Common-practice harmony, synthesised in the browser"),
    explain: M("Lets the reader switch evidence on and off and see which explanation expects it."),
    register: M("Lets the reader keep one mechanism fixed while the listener changes, so register is separated from content."),
    axis: M("Lets the reader walk the camera round two actors and see when screen direction flips."),
    chain: M("Lets the reader sag, load and flip a chain and compare it with a half-circle arch."),
    seating: M("Lets the reader try three seating plans and see which conversations start, whether the big talkers can dominate, and whether the quietest guest is left alone.", "an invented dinner; the rules (shared interests start conversations, dominant voices crowd out others) follow the session's cited studies"),
  };
  const L = (type, job, source, rights) => ({ type, job, source, rights });
  const listen = {
    c1: L("music", "The reader hears the first phrase stop on D and predicts the next note before being told.", "Beethoven, “Ode to Joy” melody (1824), public domain, synthesised in the browser", "public domain"),
    c2: L("music", "The reader hears the second phrase come home to C, the answer to the first.", "Beethoven, “Ode to Joy” melody (1824), public domain, synthesised in the browser", "public domain"),
    c6: L("audio", "The reader hears a third note between major and minor, so ‘in tune’ is heard to depend on the listener's tradition.", "Three scales written by the project; the neutral third follows descriptions of maqam Rast (Cairo Congress, 1932)", ORIG),
  };
  // data objects that are not drawn in a step but shape what the learner sees
  const data = {
    civ: { type: "data", job: "The civilisation graph the compiler reads to decide which works and regions a session connects.", source: "RENAISSANCE_CIV (renaissance-civ.js), compiled by the project from standard references", rights: ORIG },
    genome: { type: "data", job: "The capability genome and periodic table the learner model uses to name atoms, compounds and predicted gaps.", source: "RENAISSANCE_GENOME (renaissance-genome.js), the project's ontology", rights: ORIG },
  };
  window.RENAISSANCE_MEDIA = {
    types: ["text", "image", "map", "audio", "music", "video", "diagram", "animation", "interactive", "3d", "data", "timeline", "primary document"],
    rights: ["public domain", "creative commons", "open access", "licensed", "user-owned", "short quotation", ORIG, "lawful embed"],
    visuals, models, listen, data,
  };
})();
