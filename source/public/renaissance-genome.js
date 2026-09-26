/* RENAISSANCE · the capability genome (§60–63) and periodic table (§61).
 *
 * Each of the 28 capability atoms knows its components, prerequisites, synergies, conflicts, where it transfers, how it
 * shows up in real life, what grows out of it and which compounds it forms. Evidence (answers) and learning cost
 * (minutes of steps that train it) are never written here: RENAISSANCE.genome() computes them from the content and the
 * learner's record. The atoms describe the training record, not the person (docs/RENAISSANCE/omega/05).
 */
(function () {
  "use strict";
  const G = (components, prerequisites, synergies, conflicts, transfer, expressions, descendants) => ({ components, prerequisites, synergies, conflicts, transfer, expressions, descendants });
  const atoms = {
    causal: G(["tell cause from correlation", "find the mechanism between two events", "run the arrow the right way"], [], ["mech", "counter", "experiment"], ["narrative"], ["medicine", "history", "evidence"], ["a differential diagnosis that names mechanisms", "asking what else could have produced a result"], ["mech", "counter"]),
    mech: G(["open a black box into parts", "follow matter or energy through a system", "say what each part does"], ["causal"], ["systems", "measure"], [], ["science", "medicine", "engineering"], ["explaining where lost fat goes", "fault-finding in a machine or a ward routine"], ["systems"]),
    prob: G(["count in frequencies", "start from the base rate", "turn a condition round correctly"], [], ["calib", "info"], ["narrative"], ["medicine", "law", "finance"], ["reading a positive test at low prevalence", "weighing a witness"], ["calib", "info"]),
    counter: G(["change one thing in a past and follow it", "tell dependency from coincidence"], ["causal"], ["model", "strategy"], [], ["history", "strategy"], ["asking what would have happened without the drug", "history without paper"], ["model"]),
    model: G(["state rival explanations", "ask which makes the evidence expected", "prefer fewer assumptions"], ["prob", "causal"], ["falsify", "minimal"], ["narrative"], ["history", "science", "medicine"], ["choosing between two diagnoses", "the dream story against two centuries of demand"], ["judgment"]),
    scale: G(["think in orders of magnitude", "see doubling as a straight line on a log scale"], ["represent"], ["systems", "predict"], ["linear intuition"], ["epidemics", "finance", "technology"], ["reading an epidemic curve early"], ["systems"]),
    abstr: G(["strip a case to what matters", "keep only the structure", "name the structure"], ["represent"], ["minimal", "analogy", "compress"], [], ["mathematics", "any unfamiliar field"], ["a city as four dots and seven lines", "seeing the same flow in a clinic and a kitchen"], ["minimal", "orient"]),
    compress: G(["say the load-bearing part in one line", "keep the jewel, drop the rest"], ["abstr"], ["minimal", "taste"], ["pretension"], ["writing", "teaching", "leadership"], ["a thirty-second proof at dinner", "a compile plan for a long book"], ["minimal"]),
    analogy: G(["find shared mechanism under different surfaces", "say where the analogy breaks"], ["abstr"], ["abstr", "synth"], ["surface matching"], ["any two fields"], ["the Inquisitor and the 1961 doctor", "the film line and the CT display"], ["synth"]),
    falsify: G(["design the test that could prove you wrong", "prefer the observation that splits hypotheses"], ["causal"], ["experiment", "model"], ["confirmation"], ["science", "medicine", "evidence"], ["silencing the rooster for a morning", "asking what the rival story predicts"], ["experiment"]),
    calib: G(["attach a probability to a belief", "keep score of past confidence"], ["prob"], ["judgment", "predict"], ["overconfidence"], ["medicine", "forecasting", "investing"], ["saying ‘I don't know yet, here is my estimate’"], ["judgment"]),
    predict: G(["commit before being told", "use a model to project forward"], [], ["calib", "systems"], [], ["everything"], ["predicting where a melody goes", "predicting overshoot from a delay"], ["calib"]),
    synth: G(["combine ideas from two fields into one model", "check that the combination keeps both mechanisms"], ["analogy"], ["recomb", "minimal"], [], ["research", "strategy"], ["the carbon cycle behind a willow and a dieter"], ["recomb"]),
    represent: G(["switch pictures until the pattern shows", "choose the representation for the question"], [], ["abstr", "scale"], [], ["data", "medicine", "teaching"], ["counts instead of percentages", "an overhead view of a film set"], ["abstr"]),
    strategy: G(["see the other side's moves", "change incentives instead of people", "bind your future self"], ["selfmodel"], ["systems", "judgment"], [], ["business", "negotiation", "public policy"], ["a commitment device that holds", "targets that do not invite cheating"], ["judgment"]),
    narrative: G(["read structure and point of view", "separate a story that fits from evidence that discriminates", "hear who is speaking"], [], ["taste", "judgment"], ["prob", "causal"], ["literature", "law", "journalism", "medicine"], ["reading a case history for what it leaves out", "the frame that reverses a boast"], ["judgment"]),
    taste: G(["compare blind before names", "state a criterion that can be checked", "see a craftsman's choice"], ["represent"], ["compress", "narrative"], ["prestige"], ["art", "writing", "design", "music"], ["telling an inspired pattern from a mechanical one", "hearing a deceptive cadence"], ["recomb"]),
    question: G(["find the question whose answer changes the decision", "ask what you could use"], ["info"], ["info", "judgment"], [], ["medicine", "business", "conversation"], ["the one question before buying a car", "a question at dinner that opens the other person"], ["judgment"]),
    recomb: G(["combine two known rules into a new device", "test the combination"], ["synth"], ["taste", "experiment"], [], ["design", "engineering", "art"], ["a window grille from a grid and an angle", "a shade from a chain and a wind catcher"], ["invention"]),
    experiment: G(["change one thing at a time", "use a control", "randomise when choice is biased"], ["falsify"], ["measure", "causal"], [], ["science", "medicine", "product"], ["a coin-toss test of a lucky shirt", "a small trial with a count"], ["measure"]),
    constraint: G(["find the slowest step", "ignore improvements elsewhere"], ["systems"], ["minimal", "systems"], [], ["operations", "medicine", "study"], ["the pharmacy that sets the clinic's pace"], ["systems"]),
    systems: G(["see stocks, flows and delays", "spot reinforcing and balancing loops"], [], ["constraint", "scale", "predict"], ["linear intuition"], ["physiology", "ecology", "economics"], ["a glacier's mass balance", "a thermostat that overshoots"], ["mech"]),
    info: G(["ask what didn't come back", "weigh what an observation can and cannot tell"], ["prob"], ["question", "falsify"], [], ["research", "journalism", "evidence"], ["the planes that didn't return", "a report three frames deep"], ["question"]),
    judgment: G(["decide under uncertainty with the evidence in hand", "know when to stop gathering"], ["calib", "model"], ["question", "strategy"], ["pretension"], ["medicine", "leadership", "life"], ["respecting a patient's choice not to know", "a verdict that weighs rivals"], []),
    selfmodel: G(["predict what your future self will do", "design for the tired self"], [], ["strategy"], ["willpower illusions"], ["habits", "study", "health"], ["a deadline promised to a supervisor"], ["strategy"]),
    measure: G(["choose what to count", "see how a number can be gamed"], [], ["experiment", "mech"], ["proxies taken for goals"], ["management", "medicine", "science"], ["a hospital target that invites clock-stopping"], ["experiment"]),
    orient: G(["find the flows and the constraint in a new field", "ask the first question that matters there"], ["abstr", "question"], ["abstr", "question"], [], ["any unfamiliar domain"], ["reading a port, a glacier or a swarm for the first time"], []),
    minimal: G(["find the fewest parts that still explain", "check nothing load-bearing was dropped"], ["abstr"], ["compress", "constraint"], ["over-compression"], ["medicine", "engineering", "teaching"], ["three boxes on a napkin"], []),
  };
  // compounds (§20, §62): capabilities that only work when atoms fire together
  const compounds = [
    { id: "diagnosis", name: "diagnosis", atoms: ["prob", "causal", "question"], seen: "a positive test, a rival disease and the one question that splits them" },
    { id: "verdict", name: "narrative forecasting (a fair verdict)", atoms: ["narrative", "prob", "falsify"], seen: "the trial: a story that fits against evidence that discriminates" },
    { id: "empathy", name: "probabilistic empathy", atoms: ["selfmodel", "prob", "narrative"], seen: "predicting what a tired patient will actually do" },
    { id: "aesthetic-systems", name: "aesthetic systems reasoning", atoms: ["taste", "systems", "abstr"], seen: "a pattern whose beauty comes from one rule" },
    { id: "counterfactual-engineering", name: "counterfactual engineering", atoms: ["counter", "mech", "constraint"], seen: "Baghdad without paper; a clinic without its pharmacist" },
    { id: "mathematical-taste", name: "mathematical taste", atoms: ["taste", "abstr", "compress"], seen: "preferring Euler's one-sentence proof to trying routes" },
    { id: "strategic-anthropology", name: "strategic anthropology", atoms: ["strategy", "narrative", "represent"], seen: "the navigator who keeps the canoe still" },
    { id: "invention", name: "invention", atoms: ["recomb", "experiment", "constraint"], seen: "a rooftop shade from a hanging chain and a wind catcher" },
  ];
  // the periodic table: rows are what an atom does, columns what it acts on; empty cells are predicted atoms
  const table = {
    rows: ["perceive", "model", "decide / compress", "test", "meta"],
    cols: ["causes", "uncertainty", "representation", "inquiry", "value", "making"],
    cells: [
      [["systems"], ["info"], ["scale"], ["orient"], ["taste"], ["analogy"]],
      [["causal", "mech"], ["prob"], ["represent", "abstr"], ["question"], ["selfmodel"], ["narrative"]],
      [["constraint", "minimal"], ["predict"], ["compress", "model"], ["measure"], ["judgment"], ["synth"]],
      [["counter"], ["calib"], [], ["falsify", "experiment"], [], ["recomb"]],
      [[], [], [], [], ["strategy"], []],
    ],
    gaps: {
      "test×representation": "P1: detecting a misleading representation (trained in part by the film session's conventions and the 1932 tuning debate)",
      "test×value": "P2: testing a value (what would change what I care about)",
      "meta×causes": "P3: auditing one's own causal assumptions",
      "meta×uncertainty": "P4: noticing one's confidence drifting (the forecast scores are the first instrument)",
      "meta×representation": "P5: inventing a representation",
      "meta×inquiry": "P6: questions about which questions to ask",
      "meta×making": "P7: inventing a method",
    },
  };
  // the world-model map (§98–99): which sessions give each layer of the world a working model, and where the build
  // keeps rival models side by side instead of forcing one grand theory. A layer with no session is a named gap.
  const world = {
    layers: {
      matter: ["willow", "arch"],
      energy: ["willow"],
      information: ["select", "base", "question", "km3"],
      life: ["willow", "falsify", "snow"],
      evolution: [],
      mind: ["commit", "loop", "km1", "cadence"],
      intelligence: [],
      society: ["proxy", "salon", "km2"],
      economics: ["proxy", "bottleneck", "question"],
      institutions: ["proxy", "km3", "wisdom"],
      technology: ["double", "cut", "arch", "pattern"],
      history: ["wisdom", "falsify", "snow", "euler"],
      culture: ["km1", "ozy", "cadence", "pattern", "salon", "cut"],
      art: ["pattern", "cadence", "ozy", "cut", "taste"],
      meaning: ["km2", "ozy", "km1"],
      future: ["double", "commit"],
    },
    // sessions that keep two or more live models of the same thing (anti-monoculture)
    plural: {
      km1: "the brothers as parts of one person, and the voices that refuse to be parts (polyphony)",
      km2: "the Inquisitor as a critique of one church, and of any power that trades freedom for comfort",
      km3: "the story that fits against the evidence that discriminates; legal and moral guilt",
      willow: "water (van Helmont) against air (what the later chemistry showed)",
      falsify: "several explanations of childbed fever, weighed against the same observations",
      wisdom: "rival explanations weighed on six pieces of evidence",
      cadence: "‘in tune’ as physics against ‘in tune’ as a learned tradition (the 1932 Cairo debate)",
    },
  };
  window.RENAISSANCE_GENOME = { atoms, compounds, table, world };
})();
