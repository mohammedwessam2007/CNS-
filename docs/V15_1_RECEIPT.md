# v15.1 Receipt: pictures inside the app

The owner's request: *"I don't want to press links. I want the images present in the app itself, like screenshotted."*

In v15.0 the app fetched every picture live from Wikipedia and Commons while it ran. It also showed "search everywhere" links (Google Images, Radiopaedia, Kenhub) under every picture, and in place of a picture that did not arrive. On a slow or blocked connection, a lecture page became a column of links.

## What v15.1 does

| Piece | What it does |
|---|---|
| **Pictures bundled at build time** (`deploy/vercel/pics.mjs`) | Every Vercel build downloads a real picture for **every exact term in the notes (457)** and **every fixed topic picture in the v9/v14 registries (70)** into `dist/pics/`. The images are served from the app's own domain. The selection rules are the same as the in-app engine: the Wikipedia article for the exact term → its own images, ranked by caption and file-name match (lead-image bonus, penalties for logos, pathology and animations, a micrograph bonus for histology) → **only files that exist on Wikimedia Commons** (free licence; licence and author shown). If nothing qualifies, Commons files titled with the exact term. |
| **Bundled first, everywhere** (`learn-v15.js`) | LEARN section pictures, option pictures, both autopsy sides and the "FROM YOUR NOTES" card use the bundled picture first. Any Commons thumbnail elsewhere in the app (v9/v10/v14 topic pictures) is swapped for the bundled copy when the file is in the bundle. Commons "file by title" lookups are answered from the bundle with no network. Only free-text searches still go live. |
| **No links to press** | The search-everywhere links are gone. Picture cards (v9, v10, v14, v15) no longer open Commons pages. The "academic atlas · link only" card is off. |
| **In-app zoom** | Tap any picture: it opens full screen inside the app. Tap it again for 2×, which you can pan. Tap outside or ✕ to close. The caption and credit come along. A pre-answer picture keeps its title hidden. |
| **Fail-soft** | If the build cannot reach Wikimedia, it still succeeds with no bundle and the app uses the live lookup as in v15.0. If a bundled file fails to load on the device, the app tries the live lookup, then an honest one-line note (with no links). |
| **Build cache** | Downloaded bytes are kept in `node_modules/.cache/intellectuality-pics/`, which Vercel keeps between builds. Later builds re-check the choices but do not re-download unchanged files. |

## Evidence (`receipts/v15_1/`)

| Check | Result |
|---|---|
| LEARN suite, source tree with live lookups mocked (`learn_test_live_mocks.json`) | **17/17**: pictures inside the page, **0 outside links** on a lecture page, tap-to-zoom (2×, close, no navigation), honest note with no links when sources are down |
| LEARN suite, Vercel build bundled from a local Wikimedia stand-in (`learn_test_bundled.json`) | **18/18**: every lecture picture served from `/pics/…`, **0 Wikipedia and 0 Commons requests** on the lecture page, and with Wikipedia and Commons both **down**, every lecture picture still shows. After a wrong answer: 0 outside links; option, autopsy and note pictures come from the bundle |
| Certification | **60/60** source tree · **60/60** Vercel build (L6 now also accepts "Commons down → bundled pictures still show") |
| Hostile matrix | **25/25** |
| Vercel host adapter | **14/14** |
| Pre-answer leak audit | clean on both builds (bundled file names are hashes, so they carry no title) |
| Option gallery | 7/7 |
| Rollback to exact v53 and back | pass |
| Cold load, iPad size (bundled build, local) | FCP 172 ms. `pics/manifest.js` is 207 KB raw / 31 KB gzip, loaded with `defer` |
| Overflow and tap targets at 390/820/1024/1180 px | 0 / 0 |

`receipts/v15_1/screens/*_2a_learn.png` and `*_4_autopsy.png` show the lecture and the autopsy with bundled pictures in place. **In those screenshots the pictures are labelled test stand-ins ("BUNDLED IN THE APP · <file name>").** The sandbox cannot reach Wikimedia, so the stand-in server returned labelled images in place of the real files.

## Live build

See **Live build result** below. It records what the Vercel build actually bundled from Wikimedia.

## Not proven here

- **Which real image each term received** was chosen by the rules above on Vercel's build machine. I could not view the images from the sandbox. The build log lists every `term → Commons file · licence` choice, and `/pics/manifest.json` on the live site lists them too.
- **Offline use.** The bundled pictures come from the app's own domain, not from a device cache. Pictures seen once are cached by the browser as usual. There is no service worker, so a never-opened page still needs a connection.
- **Options without a curated term** (about two thirds of options) still use the v14 look-alike logic. That logic uses a bundled copy when the file is bundled, and a live Commons search otherwise.
