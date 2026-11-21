/* The opening histology lesson and its original knowledge check. Figures and further reading use OpenStax A&P 2e. */
window.IX_NOVEMBER_LESSONS = {
  "oesophagus-and-stomach": {
    reading: "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach",
    text: `## 1. Recognise the transition
The oesophagus moves a bolus. Its moist **stratified squamous epithelium** withstands friction, while mucus and peristalsis help the bolus travel. The stomach needs to secrete and protect itself from its own secretions. Its mucosa has a single layer of **mucus-secreting columnar cells** extending into gastric pits.

When a slide shows a sharp change from layers of flattened cells to a single layer of tall cells with pits, look for the gastro-oesophageal junction.

[[fig:os23_3]]

> 🤔 Think: Why is a tough, multilayered lining useful in the oesophagus? ||The bolus can abrade surface cells. Deeper layers protect the tissue while surface cells are shed and replaced.||

## 2. Read an oesophageal slide from the lumen out
Find the **stratified squamous non-keratinised epithelium**. Its superficial cells retain nuclei. Under it lie the lamina propria and muscularis mucosae. The submucosa contains mucus-secreting oesophageal glands whose ducts carry mucus to the surface.

The muscularis externa has an inner circular and outer longitudinal layer. Its muscle shifts from predominantly skeletal in the upper third, to mixed in the middle, to smooth in the lower third.

[[fig:os23_13]]

> 🤔 Think: If a mucous gland is separated from the lumen by the muscularis mucosae, which layer is it in? ||The submucosa. The muscularis mucosae forms the outer boundary of the mucosa.||

## 3. Map the gastric pit and gland
A **gastric pit** is an indentation of the surface epithelium. Gastric glands open into these pits and sit in the lamina propria. In the fundus and body, relatively short pits lead to long glands. Near the pylorus, deeper pits lead to shorter, branched glands rich in mucus-secreting cells.

Draw the surface, then a shallow pit and a longer tube below it. Label the pit opening, gland neck, and gland base before adding the cells.

[[fig:os23_16]]

> 🤔 Think: How would you distinguish a pyloric section from a body section at low power? ||Compare pit depth with gland length. Deep pits and shorter, coiled mucous glands favour pylorus. Shallow pits with long glands favour body or fundus.||

## 4. Identify the gastric cells by location and job
- **Surface mucous cells** line the surface and pits. Their mucus, together with bicarbonate at the surface, helps shield the epithelium from acid.
- **Mucous neck cells** sit in the gland neck and secrete a thinner mucus.
- **Parietal cells** are large, eosinophilic cells, especially in the upper and middle regions of body and fundic glands. They secrete hydrochloric acid and intrinsic factor, which is required for vitamin B12 absorption in the terminal ileum.
- **Chief (peptic) cells** cluster toward the gland base. Their basophilic cytoplasm reflects abundant rough endoplasmic reticulum for protein synthesis. They release pepsinogen, which is activated in the acidic lumen.
- **Enteroendocrine cells** signal to other cells. Gastrin-producing G cells are concentrated in the pyloric antrum.

> 🤔 Think: Why does a chief cell produce pepsinogen instead of active pepsin? ||Pepsinogen is an inactive precursor. Secretion before activation limits proteolytic damage to the cells that make it.||

## 5. Compare peptic cells and Paneth cells
Both are secretory cells found deep in epithelial units. Start your comparison with **which organ and which unit** before you describe their appearance.

| Feature | Chief (peptic) cell | Paneth cell |
| --- | --- | --- |
| Site | Base of glands in gastric fundus and body | Base of small-intestinal crypts |
| Appearance | Basophilic basal cytoplasm and apical zymogen granules | Prominent eosinophilic apical granules |
| Product | Pepsinogen and gastric lipase | Antimicrobial products, including lysozyme and defensins |
| Function | Digestion | Innate defence in the crypt |

> 🤔 Think: A cell with bright apical granules sits at the base of a crypt beside a villus. Which cell fits, and what clue settles it? ||Paneth cell. A crypt beside a villus places it in the small intestine, and the apical eosinophilic granules support the identification.||

## 6. Recall without the slide
1. Sketch the four wall layers and place the oesophageal glands in the right one.
2. Explain why the lining changes abruptly between oesophagus and stomach.
3. Sketch a fundic gland and place a parietal cell and a chief cell at plausible levels.
4. Write the peptic-cell versus Paneth-cell table from memory.

> 🤔 Think: Which gastric cell would link damage to the body mucosa with impaired vitamin B12 absorption? ||The parietal cell. Loss of intrinsic factor limits vitamin B12 absorption even though the actual uptake occurs in the ileum.||`,
    check: [
      {
        stem: "Where are the glands that send lubricating mucus through ducts into the oesophageal lumen?",
        options: { a: "Surface epithelium", b: "Submucosa", c: "Outer longitudinal muscle", d: "Adventitia" },
        key: "b",
        why: "The oesophageal glands proper are in the submucosa. Their ducts open onto the luminal surface.",
      },
      {
        stem: "What epithelial change marks the gastro-oesophageal junction?",
        options: { a: "Simple columnar to transitional", b: "Simple squamous to cuboidal", c: "Stratified squamous to simple columnar", d: "Pseudostratified to stratified cuboidal" },
        key: "c",
        why: "The abrasion-resistant oesophageal lining gives way to the mucus-secreting simple columnar lining of the stomach.",
      },
      {
        stem: "Deep pits open into relatively short mucous glands. Where is the section most likely from?",
        options: { a: "Pylorus", b: "Oesophagus", c: "Gastric fundus", d: "Gastric body" },
        key: "a",
        why: "Deep pits and short mucous glands distinguish the pyloric region from the fundus and body.",
      },
      {
        stem: "Which gastric cell produces the factor required for vitamin B12 uptake in the terminal ileum?",
        options: { a: "Chief cell", b: "G cell", c: "Mucous neck cell", d: "Parietal cell" },
        key: "d",
        why: "Parietal cells produce intrinsic factor as well as hydrochloric acid.",
      },
      {
        stem: "Why is the basal cytoplasm of a chief cell basophilic?",
        options: { a: "It stores hydrochloric acid", b: "It contains abundant rough endoplasmic reticulum", c: "It contains large lipid droplets", d: "It is filled with secreted bicarbonate" },
        key: "b",
        why: "The ribosomes on rough endoplasmic reticulum account for basophilia and support synthesis of proteins such as pepsinogen.",
      },
      {
        stem: "Which finding best separates a Paneth cell from a gastric chief cell?",
        options: { a: "A nucleus near the base", b: "Apical secretory granules", c: "Location at the base of a small-intestinal crypt", d: "Protein secretion" },
        key: "c",
        why: "The location is decisive. Both cells secrete proteins and have apical granules, but chief cells sit in gastric glands.",
      },
    ],
  },
};
