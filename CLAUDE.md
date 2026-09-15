# CLAUDE.md

Guidance for agents working in a Golden Grids layout study.

## What this repo is

One page, and it is NOT a stack of bands. Study 02 is the capability
demonstration: one deep layout driven by the spiral camera, bound to scroll,
with twenty-one album covers on it. `src/Dial.tsx` is the whole study.

It is also not a rebuild. The reference is a wall of equal squares, which is a
good index and a bad argument for a spiral; the study says so in its first
paragraph and takes the same kind of content instead of the same page. Read `docs/program/PROGRAM.md` first,
then `docs/program/STUDY-BRIEF.md` for the brief format and the committed
studies, then `docs/program/TEMPLATE-SPEC.md` for what this scaffold must stay
true of.

## Rules that are not negotiable

- Name the reference page. Substitute every asset. Nothing from the reference
  site — photography, wordmarks, copy — goes into the repo or the deploy.
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
  Grid outlines and band notes are off by default.
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
  rotated square filling its clip box. The label is held level the same way
  without the swell and sits on the tile's centre line, so the square clip box
  never cuts it. `{ counterRotate: false }` is the turning version.
- Every cover opens its record. The track list is a nested GoldenGrid whose
  `placement` follows the track count (parity), in a dialog that inerts the
  stage and locks the page scroll, because the dial's depth is the scroll.
- The fading window plus `tileOnScreen` plus a sub-pixel check keep the paint
  count between twelve and fourteen. A solid tail looks better mid-turn and
  paints all twenty-one — see the README's "What did not".

Two geometry rules, verified against source, that the static fallback relies on:

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
