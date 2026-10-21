# Neck in layers (3D preview)

`neck-3d.html` is a self-contained preview: a slab of the neck at C6–C7 that teaches the deep cervical fascia and the carotid sheath. Open it in a browser (it loads three.js r147 from jsdelivr the first time).

## Where the anatomy comes from

- Real meshes: BodyParts3D, © The Database Center for Life Science, licensed under CC Attribution-Share Alike 2.1 Japan (the licence named in the OBJ files). The mesh data embedded in the page is a derivative and stays under that licence.
- Modelled to fit, because the database lacks them at this level: thyroid gland, the common carotid between C6 and its split, the carotid bulb, external carotid, upper internal jugular vein, vagus, sympathetic trunk, ansa cervicalis, deep cervical nodes, phrenic nerve, plexus roots, external jugular vein, accessory nerve, spinal cord. Each one is grown into the free space between the real structures; the page says so when you tap one.
- Moved: the database's common carotid and internal jugular sit in front of the trachea; they are moved 8 mm out and 8–11 mm back, to lie beside the trachea behind the thyroid lobe.
- The glass sleeves (fascial layers) are traced around their contents slice by slice; the cut faces fill the tissue between structures.

## Rebuilding

`tools/build.py <bodyparts3d folder> scene.json` (needs numpy, scipy, shapely) writes the scene data that is inlined in the page as `#neck-data`. `tools/slice.py scene.json out.png 16,-24` draws cross-sections to check it.

## Neck and Doss (`neck-doss.html`)

The same slab joined to the syllabus (NEU-205, Day 29, T057 Cervical fascia) and to Dr Sameh Doss's drawings from the owner's notes (`source/public/dept/sd-*.jpg`, already in the app).

- 19 of his drawings on this lesson, 138 labelled dots (`doss/check_all_dots.js` checks every dot finds its structure, offline). His transverse section at the thyroid (sd-075a) is pinned on the specimen first. Each of his labels has a dot (positions in `doss/spots.json`, placed by eye on each drawing); tapping one draws a thread from his label to the same structure in the 3D neck, which lights while the rest turns to glass.
- The lesson text is the course's own (`learn-notes-anat-v15.js`, `an-cervical-fascia`). Each layer card carries his drawing of that layer; the carotid sheath section has his sheath, ansa and sympathetic-chain pages.
- Exam section: the two practice questions of the bank on T057 (EHSAN-ANAT-CERVICAL-FASCIA-MCQ-2 and -3) with the app's explanations; each option threads to its structure. The held-out question of this lesson is not used.
- Rebuild: `python doss/assemble.py <dept folder>` from a folder holding `../neo/head.part`, `../neo/scene.part` and `../build/scene.json` (see the scratch layout in the commit history).
