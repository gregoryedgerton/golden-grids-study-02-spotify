# CLAUDE.md

Guidance for agents working in a Golden Grids layout study.

## What this repo is

One page, and it is NOT a stack of bands. Study 02 is the capability
demonstration: one deep layout driven by the spiral camera, bound to scroll,
with sixteen album covers on it. `src/Dial.tsx` is the whole study.

It is also not a rebuild. The reference is a wall of equal squares, which is a
good index and a bad argument for a spiral; the study says so in its first
paragraph and takes the same kind of content instead of the same page. Read `docs/program/PROGRAM.md` first,
then `docs/program/STUDY-BRIEF.md` for the brief format and the committed
studies, then `docs/program/TEMPLATE-SPEC.md` for what this scaffold must stay
true of.

## Rules that are not negotiable

- Name the reference page. Nothing from the reference site — photography,
  wordmarks, copy — goes into the repo or the deploy.
- The covers ARE real, and that is allowed here because they are the
  designer's own work: every release on the dial carries a Discogs credit to
  Greg Edgerton for layout, design, art direction or artwork. The recordings
  are not his; nothing is offered for playback. `ASSETS.md` is the provenance
  and must stay accurate — if a cover is swapped, its row changes with it.
- The library is consumed from npm at its published version. Never link a
  local checkout. A bug found here is an issue on the library, not a patch.
- No wrapper over the library. `spiralCamera`, `spiralWindow`, `tileOnScreen`,
  `toCssTileTransform`, `toCssContentTransform` and `trailToRotateDeg` are
  called directly, in the order `docs/spiral-dial.md` in the library repo
  prescribes.
- `TEXTURE_PX` in `src/assets.ts` is the single source of the tile's render
  size AND the artwork's dimension. Changing one without the other is the bug
  the brief warns about.
- The reduced-motion path is a real static layout, not a slower dial. It is a
  requirement, not polish.
- Breakpoints live only in `src/lib/viewport.ts`. Three states, never two.
- Study tools (`src/lib/tools.tsx`) are the only floating UI. Controls go
  there, on their own stacking layer; the study's stylesheet never styles them.
  Grid outlines and band notes are off by default. The panel owns the
  viewport's top-right corner: it is fixed at
  `top: 12px; right: 12px` with `z-index: 2147483000` (`src/lib/tools.css`) —
  a collapsed tab, and a 260px-wide panel when open — and nothing the study
  draws may stack above it. A control the study puts in that corner is
  covered and cannot be clicked, however it is positioned. Put dialog and
  panel controls anywhere else; Study 02's album dialog uses a sticky bar at
  the top left, and an expanded cell's dismiss control sits at its head's
  left edge for the same reason.
- Expansion (`src/lib/expand.tsx`) is how a slot shows content it cannot hold:
  the band grows, nothing scrolls inside a box, and the covered content goes
  inert. Every photograph should be expandable — points of interaction are
  encouraged, and the picture is the affordance.
- Media fills a slot with `object-fit: cover`; per-image `object-position` is
  the escape hatch. Never reshape a band to suit an image.
- Pass one ends with the asset spec in `README.md` filled in. Do not invent
  placeholder content and call the study done.
- No CSS framework, no design system, no routing, no state library, no tests.

## The dial

- The page is a scroll body one viewport tall per record with a sticky,
  viewport-tall stage. Depth is the distance travelled through that body.
- `fillRatio: 1` with the focus anchored flush into the stage's top-left
  corner, so all of the leftover room is on one axis and the trail grows into
  it. The same anchor must be passed to `toCssTileTransform` and
  `tileOnScreen` as to the camera.
- The trail is SOLVED with `trailToRotateDeg` for the count being laid out.
  The direction cycles with the square count as well as the rotation.
- Covers STAY LEVEL: `toCssContentTransform(frame)` on the artwork, about its
  own 50% 50% origin. The cover swell in that transform is what keeps the
  rotated square filling its clip box. `{ counterRotate: false }` is the
  turning version.
- NOTHING is written inside a tile. A tile is a cover and a hit area, and
  that is all. Naming each record in its own tile put sixteen captions on
  screen, each counter-rotated and scaled back up, competing with the artwork
  the study is about. The single `.dial__readout` bar names what is in focus,
  fixed to the bottom of the viewport at z-index 40 — above the stage, below
  the album dialog at 50, so opening a record covers the bar rather than
  floating a live region over a modal. `[data-readout]` on the document is
  what clears room for it at the end of the page; it is set while the dial is
  mounted and the full view neither sets it nor needs it.
- Every cover opens its record, in a dialog that inerts EVERYTHING outside
  itself except the study tools, and locks the page scroll, because the
  dial's depth is the scroll. Inerting only the stage is not enough: one Tab
  used to reach a link behind the panel, and focusing an off-screen link
  scrolls it into view, which rewrites the depth the reader is returning to.
- The dialog's way out is at its top LEFT and reads *Back to the dial*. It is
  a return, not a dismiss, because a record is somewhere the reader
  travelled to. It cannot go top right, which the tools own, and its bar is
  sticky because a long track list would otherwise scroll the way back off
  screen.
- The track list is a LIST, not a grid, and must stay one. It was a golden
  grid and it was wrong: a track list is flat, so a Fibonacci descent asserts
  a hierarchy the content does not have. The spiral is for the collection.
- The fading window plus `tileOnScreen` plus a sub-pixel check do NOT hold the
  paint count low where it matters. Measured on the deploy: fifteen of sixteen
  tiles still paint at the busiest depth at 1200×900, fourteen at 375×812, and
  the count only falls to three in the back half of the travel. A solid tail
  paints all sixteen, so the window saves one or two tiles at the worst
  moment. Do not restate this as a solved paint budget — the README's "What
  did not" says plainly that it is not one.
- When measuring the paint count, FRONT THE TAB. The paint loop runs on
  `requestAnimationFrame`, which a background tab pauses, so every tile reads
  `visibility: hidden` and the count reads zero. Sample at 0.25 depth steps or
  finer and let each step settle; a coarse sample walks straight past the
  peak, which is how the wrong number got published in the first place.

## Filtering

- The filter belongs to the COLLECTION, not to a layout. `Dial()` holds it,
  renders the chips above whichever layout is showing, and hands the chosen
  records down. Toggling reduced motion keeps the choice. Do not push the
  state back into a layout: the dial and the full view are two ways of
  looking at one filtered set.
- Chips sit above the dial on first load and above the grids in the full
  view: year, and the role Greg is credited for. They are not sticky. The
  dial's whole body IS the scroll, so a bar pinned over it would compete with
  the readout at the other edge.
- The DIAL count is the filtered count, and everything the camera is told
  derives from it: the Fibonacci sequence, `trailToRotateDeg`, `spiralWindow`,
  `focusIndexAt`, and the height of the scroll body the depth is read from.
  A module-level `COUNT` was there before and would now be a dial of sixteen
  showing four covers.
- TWO RECORDS IS THE FLOOR for anything the library lays out. Both
  `trailToRotateDeg` and `generateGoldenGridLayout` throw below it, and the
  throw takes the whole page down, not just the dial. One match renders as
  `SoloRecord`, a single square; zero renders a message. Never hand either
  layout fewer than two.
- The album dialog is mounted by `Dial()`, above both layouts, because a lone
  record is neither a spiral nor a grid and still has to open.
- Filtering from inside the dial returns the reader to its start, since the
  depth they were at no longer exists in a shorter collection. Filtering from
  the chips above it leaves the scroll alone.

## The full view

- It is what `prefers-reduced-motion` gets instead of the dial, reachable at
  `?motion=1` or from the tools panel's `m` switch, and it is a real layout
  in its own right.
  `rolesOf` strips Discogs' bracketed qualifiers (`Design [Additional]`)
  because they split one role into chips nobody would choose between. That
  normalisation is for the filter and the cover caption ONLY — the album view
  prints the credit exactly as Discogs wrote it, and so does `ASSETS.md`.
- `rolesOf` strips Discogs' bracketed qualifiers (`Design [Additional]`)
  because they split one role into chips nobody would choose between. That
  normalisation is for the filter and the cover caption ONLY — the album view
  prints the credit exactly as Discogs wrote it, and so does `ASSETS.md`.
- `planBands` derives each band's placement FROM its box count, never the
  other way round, because the count changes on every click. A fixed list of
  sizes was there before and it silently produced portrait bands under a
  comment claiming they were landscape. The last band absorbs the remainder
  so no record is ever dropped, and a lone match is rendered on its own
  because a grid needs two boxes.
- Captions shrink with their box: each `.golden-grid__box` is a container and
  the caption sheds its credit line, then its size, then itself. A Fibonacci
  descent makes the smallest box a fraction of the largest, so one caption
  size cannot serve both.

Two geometry rules, verified against source, that the full view relies on:

- Parity: with *n* = visible boxes (+1 for a placeholder), `right`/`left` are
  landscape only when *n* is even; `top`/`bottom` only when *n* is odd.
- Hero side: the largest box sits on the `placement` side turned *n − 2*
  quarter-turns in the spiral's direction (opposite at 4, one step at 3).

## API facts, verified against 5.0.0 source

- `GoldenGrid` props: `from` (1), `to` (4), `color`, `outline`, `clockwise`
  (true), `placement` (`"right"` | `"bottom"` | `"left"` | `"top"`), `children`.
- `GoldenBox` children map largest slot → smallest. Extra children are ignored.
- When `from > 1`, the skipped positions collapse into one placeholder slot,
  rendered first in the DOM and filled by the **last** `GoldenBox` child.
- Structural CSS is auto-injected. `GoldenBox` renders a 100%×100%
  `position: relative` div and nothing else; it accepts `className` and
  `style`. All visual styling is ours.
- Only direct `GoldenBox` children count; a wrapper component or fragment is
  dropped silently. `from={2}` skips position 1 alone:
  a 1×1 placeholder, rendered first, filled by the last child, raw base colour.
  Same rectangles as `from={1}`, different child mapping and colours. `from === to === 1`
  is `single`: one box, later children ignored.
- DOM order is placeholder first, then slots smallest to largest: the hero is
  the last element.
- The dial (`DialBand.tsx`) uses `spiralCamera`, `toCssTileTransform`,
  `spiralWindow`, `tileOnScreen`, `toCssContentTransform`, `trailToRotateDeg`
  directly, per `docs/spiral-dial.md` in the library repo.

## Commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build → dist/
npm run preview
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.
Base path derives from `GITHUB_REPOSITORY`; do not hard-code it.

## Sandbox constraints

The library README links this repo as its "try it without installing" path,
opened in StackBlitz at `https://stackblitz.com/~/github.com/gregoryedgerton/golden-grids-study-template`.

- **Vite stays on 7.x.** Vite 8 depends on rolldown, whose WebContainer
  binding is a wasm download fetched at first run under an experimental WASI
  runtime. It made the sandbox slow and fragile. Do not bump to 8 without
  loading the StackBlitz link afterwards and watching it reach `VITE ready`.
- `.stackblitzrc` pins install and start so the importer does not guess.
- Do not append `?file=` to the `~/github.com` link; it made the IDE fail to
  start in testing. The classic `/github/` importer accepts `?file=` but waits
  on a WebSocket and can stall at "Cloning repo from GitHub".
