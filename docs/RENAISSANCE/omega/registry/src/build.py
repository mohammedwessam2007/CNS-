#!/usr/bin/env python3
"""Build the normalized first-generation registry (OMEGA §118–§120).

Inputs
  ../../../registry/gen1.txt      520 v1 candidates (pass | name | mechanism | prior art | verdict)
  legacy_fill.py                  mechanism / prior-art lines written for v1 rows that had "—"
  p41_45.py … p62_66.py           OMEGA passes 41–66, every field written per candidate
Output
  ../gen1_all.tsv                 one row per candidate, the 13 identity fields plus id, pass, verdict
  ../gen1_summary.json            counts used by the docs and checked by tests/omega_registry_test.js

Honesty markers inside fields
  [pass]      the field is shared by every v1 candidate of that pass (written once per pass, not per candidate)
  [computed]  the field was derived by lexical similarity, not judged by hand
Run: python3 build.py            (fails on any unresolved reference or unreviewed duplicate)
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
LEGACY = os.path.join(OUT, "..", "..", "registry", "gen1.txt")

CODES = {
    "DUP": "renamed existing idea", "EVID": "contradicted by evidence", "COST": "cost exceeds value",
    "TAX": "open-ended thinking tax", "SLOP": "decoration or gamification", "GUILT": "backlog or streak pressure",
    "ADDICT": "manufactured compulsion", "TRUTH": "fabrication risk", "COPY": "rights problem",
    "SCOPE": "outside the mission", "UNTEST": "cannot be measured",
}

# v1 passes: theme, problem, why education misses it, benefit, friction, machine cost, risks, test (shared per pass)
CLUSTERS = {
    1: ("Units and proof", "learning is counted by exposure, not by demonstrated capability", "courses count hours and completions", "credit only for capability shown unaided and later", "L", "L", "slower visible progress", "delayed unaided far-transfer items"),
    2: ("Cross-domain mapping", "ideas stay inside the field that taught them", "departments teach in silos", "mechanisms recognised across fields", "L", "M", "false analogies", "far-transfer items across fields"),
    3: ("Curriculum shape", "courses are fixed sequences sized for institutions", "syllabi serve cohorts and calendars", "a curriculum sized to one life and its evidence", "L", "M", "drift without structure", "season-level delayed results"),
    4: ("Session unit", "the lesson is a monologue on a topic", "lecture is the default format", "each session built around one decision-bearing unit", "L", "M", "fragmentation", "in-session and delayed accuracy by unit type"),
    5: ("Memory and the life bridge", "what is learned is not used or retained", "review is a separate chore; life is not measured", "ideas kept alive inside later sessions and used in the week", "L", "L", "self-report bias", "hook accuracy and reality-tap rates"),
    6: ("Biology donor", "learning systems lack self-regulation", "curricula have no homeostasis", "the organ regulates dose, pruning and timing itself", "L", "M", "metaphor over mechanism", "does the regulation change measured outcomes"),
    7: ("Evolution donor", "content never improves by selection", "materials are written once", "representations and items that improve by selection on delayed outcomes", "L", "M", "overfitting to one learner", "fitness trends with n"),
    8: ("Control-theory donor", "adaptation oscillates or overreacts", "teachers adjust by feel", "stable adaptation that respects delays", "L", "M", "sluggish response", "success rate and minutes stay near set points"),
    9: ("Information-theory donor", "items and representations waste information", "tests are not designed for information gain", "each item and picture chosen for what it reveals", "L", "M", "false precision", "information per item vs outcome"),
    10: ("Compression donor", "explanations lose the part that mattered or keep too much", "summaries optimise length", "compressed core with the irreducible part preserved", "L", "M", "over- or under-compression", "delayed transfer with vs without the preserved part"),
    11: ("CPU and caching donor", "review and delivery are inefficient", "no model of access patterns", "the right idea ready at the right time", "L", "M", "metaphor stretch", "warm-up accuracy near target"),
    12: ("Operating-systems donor", "a new organ could harm the host app or the life", "apps compete for time and state", "isolation, priority and kill switches", "L", "L", "none significant", "isolation and gate tests"),
    13: ("Compiler donor", "sessions are hand-made and inconsistent", "authoring is craft, not build", "sessions built and checked like programs", "L", "M", "rigidity", "linter and schema tests"),
    14: ("Distributed-systems donor", "state and sources can disagree", "single-source assumptions", "consistent state and fault-tolerant sources", "L", "M", "complexity", "consistency and provenance checks"),
    15: ("Scientific-discovery donor", "results are taught, not how they were found", "textbooks present conclusions", "reasoning with the original evidence", "M", "M", "hindsight in the design", "prediction accuracy on unseen evidence"),
    16: ("Expertise donor", "expert perception is not taught", "experts' cues are tacit", "fast, accurate recognition from many cases", "M", "M", "narrow transfer", "new-case accuracy and speed"),
    17: ("Game-design donor", "practice lacks structure and challenge", "exercises are flat lists", "structured challenge without manipulation", "L", "M", "gamification slop", "does the structure raise delayed transfer"),
    18: ("Story donor", "ideas without narrative are forgotten", "stories seen as soft", "memorable anchors that stay true", "L", "M", "fabrication and manipulation", "hook accuracy for story-anchored ideas"),
    19: ("Visual-art donor", "taste and looking are untrained", "art taught as appreciation of names", "trained perception with stated criteria", "M", "M", "rights and subjectivity", "blind-pair accuracy"),
    20: ("Music donor", "listening is passive", "music taught as history or theory lists", "active, structural listening", "M", "M", "rights of recordings", "prediction items on public-domain pieces"),
    21: ("Architecture donor", "design reasoning is invisible", "buildings taught as styles", "plans and structures read as arguments and causal chains", "M", "M", "scope", "design-reasoning items"),
    22: ("Economics donor", "time and incentives are ignored", "learning assumed free", "every minute priced; incentives audited", "L", "L", "coldness", "minutes and incentive audits"),
    23: ("Measurement and incentive-design donor", "metrics get gamed", "grades are targets", "measures that resist gaming", "L", "L", "complexity", "gaming tests on each metric"),
    24: ("Motivation-psychology donor", "motivation handled with tricks", "rewards and messages chosen by habit", "evidence-based motivation without manipulation", "L", "L", "weak effects", "delayed outcomes, not engagement"),
    25: ("Cognitive-science donor", "teaching ignores how cognition works", "tradition over evidence", "sessions built on robust cognitive findings", "L", "M", "misapplied findings", "delayed accuracy vs design choices"),
    26: ("Neuroscience-of-learning donor", "neuro claims mislead education", "neuromyths spread", "only robust neuro-informed practices kept", "L", "L", "neuromyths", "evidence grade of each practice"),
    27: ("Mathematics donor", "quantitative intuition is missing", "maths taught as procedures", "numbers and proofs as experiences and senses", "M", "M", "maths anxiety", "estimation and reasoning items"),
    28: ("Philosophy and argument donor", "arguments are judged by rhetoric", "debate rewards winning", "structured, fair, testable arguments", "L", "L", "abstraction", "argument items"),
    29: ("Anthropology donor", "one culture's cases dominate", "canon bias", "wider cases and self-aware cultural lenses", "L", "M", "tokenism", "case-origin audit and items"),
    30: ("History donor", "history taught as fixed story", "hindsight and myths", "history as evidence, dispute and counterfactual", "L", "M", "presentism", "history items under period knowledge"),
    31: ("Governance donor", "the organ could grow unaccountable", "apps have no constitution", "written rules, audits and limits", "L", "L", "bureaucracy", "rule audits"),
    32: ("Civilization and infrastructure donor", "ideas and tools lack infrastructure", "no standards across content", "standards, resilience and cultural evolution of ideas", "L", "M", "scope creep", "standard compliance"),
    33: ("Interface donor", "interfaces overload and pull", "feature accretion and dark patterns", "one-button calm interface", "L", "L", "hidden depth", "UI tests (44 px, controls per screen)"),
    34: ("Speculative-technology donor", "new tech promises learning gains", "hype cycles", "only technologies with a clear, testable benefit", "M", "H", "cost and hype", "benefit vs cost evidence"),
    35: ("Metacognition donor", "learners misjudge their own knowledge", "self-assessment untrained", "calibrated self-knowledge", "L", "L", "anxiety", "calibration trends"),
    36: ("Paired-skills donor", "skills trained alone don't combine", "subjects separate", "skills trained in pairs that reinforce", "L", "M", "forced pairs", "paired-item accuracy"),
    37: ("Frontier and serendipity donor", "curiosity has no outlet at the edge", "curricula end at settled knowledge", "bounded exploration beyond the syllabus", "L", "M", "novelty addiction, backlog", "exploration rate and outcomes"),
    38: ("Personal-science donor", "the learner's life is not data", "no experiments on one's own life", "registered, evidence-based self-experiments", "L", "L", "rumination, privacy", "experiment registry and results"),
    39: ("Meta-generator donor", "content improvement is manual", "no machinery for improving teaching", "systems that generate and test better sessions", "M", "M", "automation slop", "generator outputs pass tests and outcomes"),
    40: ("Endgame donor", "the organ could become permanent", "courses never end", "graduation into authorship, reality and habits", "L", "L", "abandonment of support too early", "unaided long-term measures"),
}

MARK_PASS = "[pass] "
MARK_COMP = "[computed] "
STOP = set("a an the of to in on for and or by with as is be it its per at from into not no".split())


def toks(s):
    return {w for w in re.findall(r"[a-z0-9]+", s.lower()) if w not in STOP and len(w) > 2}


def jacc(a, b):
    return len(a & b) / max(1, len(a | b))


def norm(name):
    return re.sub(r"[^a-z0-9]+", " ", name.lower()).strip()


def load_legacy():
    ns = {}
    exec(open(os.path.join(HERE, "legacy_fill.py"), encoding="utf-8").read(), ns)
    fill = ns["FILL"]
    rows, n = [], 0
    for line in open(LEGACY, encoding="utf-8"):
        if line.startswith("#") or not line.strip():
            continue
        n += 1
        p, name, mech, prior, verdict = [x.strip() for x in line.split(" | ")]
        lid = "L%03d" % n
        fm, fp = fill.get(lid, ("", ""))
        if mech in ("—", ""):
            mech = fm
        if prior in ("—", ""):
            prior = fp
        if not mech:
            raise SystemExit("legacy row without mechanism: %s %s" % (lid, name))
        if not prior:
            raise SystemExit("legacy row without prior art: %s %s" % (lid, name))
        theme, problem, why, benefit, fr, cost, risk, test = CLUSTERS[int(p)]
        rows.append({
            "id": lid, "pass": int(p), "pass_theme": theme, "name": name, "problem": MARK_PASS + problem, "mechanism": mech,
            "donor": prior, "why_missed": MARK_PASS + why, "benefit": MARK_PASS + benefit, "friction": fr, "machine_cost": cost,
            "risks": ("rejected: " + CODES[verdict[2:]]) if verdict.startswith("R:") else MARK_PASS + risk,
            "test": MARK_PASS + test, "related": "", "novelty": "UNCLEAR" if prior.startswith("none found") else "KNOWN",
            "verdict": verdict, "origin": "v1",
        })
    return rows


def load_omega():
    rows = []
    for f in sorted(x for x in os.listdir(HERE) if re.match(r"p\d+_\d+\.py$", x)):
        ns = {}
        exec(open(os.path.join(HERE, f), encoding="utf-8").read(), ns)
        for p, (theme, items) in sorted(ns["PASSES"].items()):
            for i, r in enumerate(items, 1):
                name, problem, mech, donor, why, benefit, fr, cost, risks, test, related, novelty, verdict = r
                rows.append({
                    "id": "O%d%02d" % (p, i), "pass": p, "pass_theme": theme, "name": name, "problem": problem, "mechanism": mech,
                    "donor": donor, "why_missed": why, "benefit": benefit, "friction": fr, "machine_cost": cost, "risks": risks,
                    "test": test, "related": related, "novelty": novelty, "verdict": verdict, "origin": "omega",
                })
    return rows


def main():
    rows = load_legacy() + load_omega()
    byname = {}
    errors, review = [], []
    for r in rows:
        k = norm(r["name"])
        if k in byname:
            errors.append("duplicate name: %s (%s and %s)" % (r["name"], byname[k]["id"], r["id"]))
        byname[k] = r
    for r in rows:
        r["_t"] = toks(r["name"] + " " + r["mechanism"])

    # v1 merges carried no target: point each at the most similar kept candidate of its pass, marked [computed]
    for r in rows:
        if r["origin"] == "v1" and r["verdict"] == "M":
            cands = [x for x in rows if x["pass"] == r["pass"] and x["verdict"] == "S" and x is not r]
            best = max(cands, key=lambda x: jacc(r["_t"], x["_t"]))
            r["verdict"] = "M:" + best["name"]
            r["merge_note"] = MARK_COMP
    # v1 related: the two most similar other candidates across the registry, marked [computed]
    for r in rows:
        if r["origin"] == "v1":
            sims = sorted((x for x in rows if x is not r), key=lambda x: -jacc(r["_t"], x["_t"]))[:2]
            r["related"] = MARK_COMP + "; ".join(x["name"] for x in sims)

    # resolve every reference by name
    def resolve(name):
        return byname.get(norm(name))

    for r in rows:
        rel = r["related"].replace(MARK_COMP, "")
        ids = []
        for nm in [x.strip() for x in rel.split(";") if x.strip() and x.strip() != "—"]:
            t = resolve(nm)
            if not t:
                errors.append("%s %s: related '%s' not found" % (r["id"], r["name"], nm))
            elif t is r:
                errors.append("%s relates to itself" % r["id"])
            else:
                ids.append(t["id"])
        r["related_ids"] = ids
        v = r["verdict"]
        if v.startswith("M:"):
            t = resolve(v[2:])
            if not t:
                errors.append("%s %s: merge target '%s' not found" % (r["id"], r["name"], v[2:]))
            elif t is r:
                errors.append("%s merges into itself" % r["id"])
            else:
                r["merge_id"] = t["id"]
        elif v.startswith("R:"):
            if v[2:] not in CODES:
                errors.append("%s: unknown rejection code %s" % (r["id"], v))
        elif v != "S":
            errors.append("%s: bad verdict %s" % (r["id"], v))
        if r["novelty"] not in ("KNOWN", "COMBO", "UNCLEAR"):
            errors.append("%s: bad novelty %s" % (r["id"], r["novelty"]))
        if r["friction"] not in "LMH" or r["machine_cost"] not in "LMH":
            errors.append("%s: bad friction/cost" % r["id"])
        if not v.startswith("R:"):
            for f in ("problem", "mechanism", "donor", "why_missed", "benefit", "risks", "test"):
                if r[f].strip() in ("", "—"):
                    errors.append("%s %s: kept candidate lacks %s" % (r["id"], r["name"], f))

    # near-duplicate screen between OMEGA rows and everything else; a pair is fine only if one of them already
    # records the relation (merge, DUP rejection, or related link) — otherwise it must be reviewed
    for r in rows:
        if r["origin"] != "omega":
            continue
        for x in rows:
            if x is r or (x["origin"] == "omega" and x["id"] < r["id"]):
                continue
            if jacc(toks(r["name"]), toks(x["name"])) >= 0.6 and len(toks(r["name"])) >= 2:
                linked = r.get("merge_id") == x["id"] or x.get("merge_id") == r["id"] or x["id"] in r["related_ids"] or r["id"] in x["related_ids"] or r["verdict"] == "R:DUP"
                if not linked:
                    review.append("%s '%s' ~ %s '%s'" % (r["id"], r["name"], x["id"], x["name"]))

    if errors or review:
        for e in errors:
            print("ERROR", e)
        for e in review:
            print("REVIEW", e)
        sys.exit(1)

    cols = ["id", "pass", "pass_theme", "name", "problem", "mechanism", "donor", "why_missed", "benefit", "friction", "machine_cost", "risks", "test", "related", "related_ids", "novelty", "verdict"]
    with open(os.path.join(OUT, "gen1_all.tsv"), "w", encoding="utf-8") as f:
        f.write("\t".join(cols) + "\n")
        for r in rows:
            vals = []
            for c in cols:
                v = r.get(c, "")
                if c == "related_ids":
                    v = " ".join(v)
                if c == "verdict" and r.get("merge_note"):
                    v = r["merge_note"] + v
                vals.append(str(v).replace("\t", " ").replace("\n", " "))
            f.write("\t".join(vals) + "\n")

    def count(pred):
        return sum(1 for r in rows if pred(r))

    rej = {}
    for r in rows:
        if r["verdict"].startswith("R:"):
            rej[r["verdict"][2:]] = rej.get(r["verdict"][2:], 0) + 1
    summary = {
        "total": len(rows), "v1": count(lambda r: r["origin"] == "v1"), "omega": count(lambda r: r["origin"] == "omega"),
        "passes": len({r["pass"] for r in rows}),
        "kept": count(lambda r: r["verdict"] == "S"), "merged": count(lambda r: r["verdict"].startswith("M:")),
        "rejected": count(lambda r: r["verdict"].startswith("R:")), "rejected_by_code": dict(sorted(rej.items(), key=lambda kv: -kv[1])),
        "distinct_after_dedupe": count(lambda r: r["verdict"] == "S") + count(lambda r: r["verdict"].startswith("R:") and r["verdict"] != "R:DUP"),
        "novelty_kept": {k: count(lambda r, k=k: r["verdict"] == "S" and r["novelty"] == k) for k in ("KNOWN", "COMBO", "UNCLEAR")},
        "fields_shared_per_pass_v1": count(lambda r: r["origin"] == "v1"),
    }
    # §121 selection: the strongest 200 kept candidates by a stated heuristic (not a judgment of merit):
    # low friction and machine cost, many links in and out, and a named test; ties broken by id
    inbound = {}
    for r in rows:
        for i in r["related_ids"]:
            inbound[i] = inbound.get(i, 0) + 1
        if r.get("merge_id"):
            inbound[r["merge_id"]] = inbound.get(r["merge_id"], 0) + 2
    grade = {"L": 2, "M": 1, "H": 0}
    for r in rows:
        r["score"] = grade[r["friction"]] + grade[r["machine_cost"]] + min(4, inbound.get(r["id"], 0)) + min(2, len(r["related_ids"])) + (1 if r["novelty"] != "KNOWN" else 0) + (1 if not r["test"].startswith(MARK_PASS) else 0)
    top = sorted((r for r in rows if r["verdict"] == "S"), key=lambda r: (-r["score"], r["id"]))[:200]
    with open(os.path.join(OUT, "strongest200.tsv"), "w", encoding="utf-8") as f:
        f.write("rank\tid\tscore\tname\n")
        for k, r in enumerate(top, 1):
            f.write("%d\t%s\t%d\t%s\n" % (k, r["id"], r["score"], r["name"]))
    summary["strongest200_min_score"] = top[-1]["score"]
    json.dump(summary, open(os.path.join(OUT, "gen1_summary.json"), "w"), indent=1)
    print(json.dumps(summary, indent=1))


if __name__ == "__main__":
    main()
