# Neck in layers (3D preview)

`neck-3d.html` is a self-contained preview: a slab of the neck at C6–C7 that teaches the deep cervical fascia and the carotid sheath. Open it in a browser (it loads three.js r147 from jsdelivr the first time).

## Where the anatomy comes from

- Real meshes: BodyParts3D, © The Database Center for Life Science, licensed under CC Attribution-Share Alike 2.1 Japan (the licence named in the OBJ files). The mesh data embedded in the page is a derivative and stays under that licence.
- Modelled to fit, because the database lacks them at this level: thyroid gland, the common carotid between C6 and its split, the carotid bulb, external carotid, upper internal jugular vein, vagus, sympathetic trunk, ansa cervicalis, deep cervical nodes, phrenic nerve, plexus roots, external jugular vein, accessory nerve, spinal cord. Each one is grown into the free space between the real structures; the page says so when you tap one.
- Moved: the database's common carotid and internal jugular sit in front of the trachea; they are moved 8 mm out and 8–11 mm back, to lie beside the trachea behind the thyroid lobe.
- The glass sleeves (fascial layers) are traced around their contents slice by slice; the cut faces fill the tissue between structures.

## Rebuilding

`tools/build.py <bodyparts3d folder> scene.json` (needs numpy, scipy, shapely) writes the scene data that is inlined in the page as `#neck-data`. `tools/slice.py scene.json out.png 16,-24` draws cross-sections to check it.
