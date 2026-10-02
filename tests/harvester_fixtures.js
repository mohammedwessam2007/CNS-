// Stand-in MediaWiki API for the World Harvester tests. The article texts are SYNTHETIC: written for this test to have the
// shape of real encyclopedia pages (causal claims, caveats, numbers, a references tail). They are NOT Wikipedia text and must
// never be shipped as harvested content; the shipped source/public/harvest/ folder is written only by a live run.
const P = (...x) => x.join("\n\n");
const TAIL = "\n\n== See also ==\nA list of related pages.\n\n== References ==\nNumbered citations.";

const SELECTION = P(
  "Natural selection is the process by which heritable traits that help individuals survive and reproduce become more common in a population over generations. It requires three conditions: variation among individuals, inheritance of that variation, and differential reproduction. Because offspring resemble their parents, a trait that raises reproductive success spreads.",
  "== Mechanism ==\nVariation arises from mutation and recombination, and it is not directed toward any need. Selection acts only on the variation that already exists, and it does so by filtering: individuals with a trait that suits their environment leave more offspring, therefore the next generation differs from the last.",
  "== Evidence ==\nIn a survey of 1,240 moths across two woodland sites, the dark form rose from 12 percent to 71 percent of captures over fifteen years as soot darkened the bark. Predation trials on both forms confirmed that birds took the conspicuous form more often, which supports the selective explanation.",
  "== Limits and misconceptions ==\nNatural selection has no foresight and no goal; adaptation looks designed only because the survivors are the ones that happened to fit. However, selection is not the only process that changes populations, and traits can spread by chance, by linkage to a favoured gene, or by migration. Trade-offs matter because a trait that helps in one respect may cost in another, so evolution rarely produces a perfect design.",
  "Selection can also be weak, because small advantages are easily overwhelmed in small populations. A population adapts only as fast as heritable variation allows, which is a constraint on every lineage.",
  "== Levels and units ==\nSelection is usually described as acting on individuals, but the consequences are measured in populations, since only populations change in composition over time. Some traits evolve because they benefit relatives that share the same genes, which explains cooperative behaviour in many species. Others evolve through competition for mates, which can favour costly displays that lower survival, because reproductive success counts as much as survival.",
  "== History of the idea ==\nThe idea was proposed in the nineteenth century by two naturalists who reached it independently, and it was later combined with the rules of inheritance to form the modern account. That synthesis explained how continuous variation could be inherited, and it replaced earlier views in which acquired traits were passed to offspring."
) + TAIL;

const DRIFT = P(
  "Genetic drift is the change in allele frequencies from one generation to the next that arises because a finite number of individuals happen to reproduce. Unlike natural selection, drift has no direction and does not favour fitter alleles. It is strongest in small populations, because chance sampling of gametes matters more when few individuals contribute.",
  "== Effects ==\nDrift can fix a harmless or even slightly harmful allele, and it reduces variation within a population over time. Although selection and drift act together in every real population, their relative strength depends on population size and on how large the fitness difference is.",
  "== Evidence ==\nIn an experiment with 107 laboratory populations of eight flies each, allele frequencies wandered apart over nineteen generations until most populations had fixed one allele or lost it. The pattern matched the prediction of a model in which chance alone drives change.",
  "== Limits ==\nDistinguishing drift from weak selection is difficult, because both can produce the same change in frequency in a single population. Researchers therefore compare replicate populations, since drift gives different outcomes in each while selection tends to give the same one.",
  "== Bottlenecks and founders ==\nWhen a population is sharply reduced in size, the survivors carry only a sample of the original variation, so allele frequencies can change abruptly. A similar effect follows when a few individuals found a new colony. Both cases are standard examples of drift, and they help explain why isolated island populations often differ from their mainland relatives even when the environments are alike.",
  "== Relation to the neutral view ==\nA widely used model proposes that most differences between species at the molecular level are neutral, so their fate is governed by drift rather than by selection. Critics reply that some apparently neutral changes have small effects that selection can still detect, which is why the debate continues."
) + TAIL;

// deliberately near-identical to SELECTION: the tournament must not spend the learner's minutes twice on one model
const FITNESS = P(
  "Natural selection is the process by which heritable traits that help individuals survive and reproduce become more common in a population over generations. Fitness is the measure of that reproductive success. It requires variation among individuals, inheritance of that variation, and differential reproduction.",
  "== Mechanism ==\nVariation arises from mutation and recombination, and it is not directed toward any need. Selection acts only on the variation that already exists, and it does so by filtering: individuals with a trait that suits their environment leave more offspring, therefore the next generation differs from the last.",
  "== Measurement ==\nFitness is usually measured relative to other individuals, so a trait has no fitness value outside an environment. Selection acts on whole organisms, which means that a heritable trait that helps one function may reduce another.",
  "Natural selection has no foresight and no goal; adaptation looks designed only because the survivors are the ones that happened to fit. However, selection is not the only process that changes populations, and traits can spread by chance, by linkage to a favoured gene, or by migration. Trade-offs matter because a trait that helps in one respect may cost in another.",
  "== Components ==\nBiologists separate survival from reproduction when they measure fitness, since an individual that lives long but leaves no offspring contributes nothing to the next generation. Variation in the number of offspring, and in how many of them reach maturity, is what selection acts on in practice.",
  "== Frequency dependence ==\nThe fitness of a trait can depend on how common it is, so a rare form may do better than a common one until it spreads and loses its advantage. This produces stable mixtures of forms in some populations, rather than the replacement of one form by another."
) + TAIL;

const ANTIBIOTIC = P(
  "Antibiotic resistance evolves when bacteria carrying a resistance mutation survive treatment and multiply while susceptible cells die. It is natural selection observed on a short timescale, because bacteria reproduce within hours and a large population contains rare variants. The drug does not cause the mutation; it selects among variants that were already present.",
  "== Experiment ==\nIn a plate experiment with 2,400 colonies, resistant cells were found at a frequency of about one in a million before exposure, and exposure to the drug raised that frequency to nearly 100 percent within a day. The result shows selection acting on pre-existing variation rather than an induced change.",
  "== Costs and trade-offs ==\nResistance mutations often carry a fitness cost in the absence of the drug, because the changed target protein works less efficiently. However, compensatory mutations can restore growth, which is why resistance may persist after a drug is withdrawn. Gene transfer between species is a further route that is not explained by mutation alone.",
  "Treatment policy therefore depends on population size, exposure time, and the cost of resistance, since these determine how quickly a resistant lineage takes over.",
  "== Spread in hospitals ==\nResistant bacteria spread between patients on hands, instruments and surfaces, so infection control slows the spread even when it does nothing to the mutation rate. Surveillance data from 41 hospitals showed that wards with the highest prescribing also had the highest proportion of resistant isolates, although the association does not by itself show the direction of cause.",
  "== Evolutionary responses ==\nSome strategies aim to slow the evolution of resistance, for example by combining drugs, because a cell would need separate mutations against each at once. Others cycle drugs or restrict the use of the last effective one. The choice among them is an application of evolutionary reasoning rather than a matter of chemistry alone."
) + TAIL;

const HOMEOPATHY = P(
  "Homeopathy is an alternative medical practice that uses extremely diluted preparations of substances. Practitioners hold that a substance causing symptoms in a healthy person can treat similar symptoms in a sick one. The dilutions are so great that the final preparation often contains no molecules of the original substance.",
  "== History ==\nThe practice was developed in the late eighteenth century by a German physician and became popular in several countries during the nineteenth century. Systematic reviews of clinical trials have not found it more effective than placebo for any condition, and the proposed mechanism conflicts with established chemistry and physics.",
  "== Regulation ==\nRegulators in different countries treat the products differently, and some require that labels state that the claims are not supported by evidence. Consumers are advised to consult a physician for serious symptoms rather than rely on diluted preparations, because delayed treatment can cause harm.",
  "== Practice ==\nA consultation typically records a long list of symptoms and personal circumstances, and the practitioner selects a preparation according to a reference text. Preparations are made by repeated dilution with shaking between steps, and the labels give the dilution as a number followed by a letter. Supporters point to patient satisfaction with the consultation, while critics note that satisfaction does not show that the preparation itself had any effect.",
  "== Scientific assessment ==\nScientific bodies in several countries have reviewed the evidence and concluded that the practice has no demonstrated effect beyond placebo. They note that the claimed principle of similars has never been shown in controlled experiments, and that high dilutions leave no active ingredient to act on the body. Some trials reported benefit, but these tended to be small and poorly controlled, and larger better designed trials did not repeat the result."
) + TAIL;

const STUB = "Selection may refer to several things in science and everyday language. Natural selection is one of them. This page is a short disambiguation stub.";

const ORIGIN_IV = P(
  "How will the struggle for existence, discussed too briefly in the last chapter, act in regard to variation? Can the principle of selection, which we have seen is so potent in the hands of man, apply in nature? I think we shall see that it can act most effectively.",
  "Let it be borne in mind in what an endless number of strange peculiarities our domestic productions, and, in a lesser degree, those under nature, vary; and how strong the hereditary tendency is. Under domestication, it may be truly said that the whole organisation becomes in some degree plastic.",
  "Can it, then, be thought improbable, seeing that variations useful to man have undoubtedly occurred, that other variations useful in some way to each being in the great and complex battle of life, should sometimes occur in the course of thousands of generations? If such do occur, can we doubt that individuals having any advantage, however slight, over others, would have the best chance of surviving and of procreating their kind?",
  "This preservation of favourable variations and the rejection of injurious variations, I call Natural Selection. Variations neither useful nor injurious would not be affected by natural selection, and would be left either a fluctuating element, as perhaps we see in certain polymorphic species, or would ultimately become fixed.",
  "We shall best understand the probable course of natural selection by taking the case of a country undergoing some physical change, for instance, of climate. The proportional numbers of its inhabitants would almost immediately undergo a change, and some species might become extinct. We may conclude, from what we have seen of the intimate and complex manner in which the inhabitants of each country are bound together, that any change in the numerical proportions of some of the inhabitants, independently of the change of climate itself, would most seriously affect many of the others."
);

const COMMERCIAL = P(
  "Natural selection explained for professionals: a premium course text covering variation, heritable traits, fitness and adaptation in a population. The material requires variation, inheritance and differential reproduction, because selection cannot act without them. Genetic drift and mutation are discussed as complementary processes.",
  "Participants study natural selection in a population with a fixed carrying capacity, and learn why fitness is relative. However, the commercial licence reserves all rights and forbids redistribution of the text, even in part."
);

const WORLD = {
  "en.wikipedia.org": {
    rights: { text: "Creative Commons Attribution-ShareAlike 4.0 License", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
    search: {
      "natural selection": ["Natural selection", "Selection", "Homeopathy"],
      "genetic drift": ["Genetic drift"],
      "fitness (biology)": ["Fitness (biology)"],
      "evolution of antibiotic resistance": ["Evolution of antibiotic resistance"],
    },
    pages: {
      "Natural selection": { pageid: 101, text: SELECTION, extlinks: 55, badge: "Featured articles", rev: 1100000101 },
      "Genetic drift": { pageid: 102, text: DRIFT, extlinks: 30, badge: "Good articles", rev: 1100000102 },
      "Fitness (biology)": { pageid: 103, text: FITNESS, extlinks: 12, badge: null, rev: 1100000103 },
      "Evolution of antibiotic resistance": { pageid: 104, text: ANTIBIOTIC, extlinks: 41, badge: null, rev: 1100000104 },
      Homeopathy: { pageid: 105, text: HOMEOPATHY, extlinks: 80, badge: "Featured articles", rev: 1100000105 },
      Selection: { pageid: 106, text: STUB, extlinks: 2, badge: null, rev: 1100000106 },
    },
  },
  "en.wikisource.org": {
    rights: { text: "Creative Commons Attribution-ShareAlike 4.0 License", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
    search: { "On the Origin of Species Natural Selection": ["On the Origin of Species (1859)/Chapter 4"] },
    pages: { "On the Origin of Species (1859)/Chapter 4": { pageid: 201, text: ORIGIN_IV, extlinks: 3, badge: null, rev: 1100000201 } },
  },
  "example.org": {
    rights: { text: "All rights reserved. Copyright the publisher.", url: "https://example.org/terms" },
    search: { "natural selection": ["Natural selection (course text)"] },
    pages: { "Natural selection (course text)": { pageid: 301, text: COMMERCIAL, extlinks: 5, badge: null, rev: 7 } },
  },
};

// A fetch that behaves like the MediaWiki API for the stand-in world, and records everything asked of it.
function makeFetch(opts = {}) {
  const calls = [];
  const f = async (url, init = {}) => {
    const u = new URL(url), host = u.hostname, q = Object.fromEntries(u.searchParams);
    calls.push({ url: String(url), host, path: u.pathname, q, ua: (init.headers && (init.headers["User-Agent"] || init.headers["user-agent"])) || null, t: Date.now() });
    const json = (o, status = 200, headers = {}) => ({ ok: status < 400, status, headers: { get: (k) => headers[k.toLowerCase()] ?? null }, json: async () => o });
    if (opts.rateLimit && opts.rateLimit(host, q, calls.length)) return json({}, 429, { "retry-after": "1" });
    const w = WORLD[host];
    if (u.pathname !== "/w/api.php" || !w) return json({ error: { code: "nosuch" } }, 404);
    if (q.meta === "siteinfo") return json({ query: { rightsinfo: w.rights } });
    if (q.list === "search") return json({ query: { search: (w.search[q.srsearch] || []).map((t) => ({ title: t, pageid: w.pages[t].pageid })) } });
    if (q.titles) {
      const pg = w.pages[q.titles];
      if (!pg) return json({ query: { pages: [{ title: q.titles, missing: true }] } });
      const heads = (pg.text.match(/^==[^=].*==\s*$/gm) || []).length;
      return json({ query: { pages: [{ pageid: pg.pageid, title: q.titles, extract: pg.text, length: pg.text.length, revisions: [{ revid: pg.rev, timestamp: "2026-08-01T10:00:00Z" }], extlinks: Array.from({ length: pg.extlinks }, (_, i) => ({ url: "https://ref" + i + ".example/" })), categories: pg.badge ? [{ title: "Category:" + pg.badge }] : [], _heads: heads }] } });
    }
    return json({ error: { code: "badrequest" } }, 400);
  };
  f.calls = calls;
  return f;
}

module.exports = { WORLD, makeFetch, SELECTION, DRIFT, FITNESS, ANTIBIOTIC, HOMEOPATHY, STUB, ORIGIN_IV, COMMERCIAL };
