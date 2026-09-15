# Layout study 02 — a collection on the spiral dial

**Live:** https://gregoryedgerton.github.io/golden-grids-study-02-spotify/

> **This is not a rebuild.** Spotify's wall of equal squares is a scannable
> index and the spiral is not a substitute for one. The claim is narrower and
> harder to dismiss: here is a way of moving through a collection that a grid
> cannot express.

An unaffiliated layout study. It names the page it argues with, takes the same
kind of content — a collection of square covers — and shows what the grid
cannot do with it.

The collection is real: sixteen records whose covers Greg Edgerton designed,
from 2002 to 2009, newest first. Releases, credits and track listings come
from [Discogs](https://www.discogs.com/artist/3501563-Greg-Edgerton). The
artwork is the designer's own work, shown as a portfolio; the recordings
belong to their artists and labels and nothing here is offered for playback.
Nothing from Spotify is reproduced.

Built with [Golden Grids](https://github.com/gregoryedgerton/golden-grids)
([npm](https://www.npmjs.com/package/@gifcommit/golden-grids) ·
[generator](https://gregoryedgerton.github.io/golden-grids/)), from the
[study template](https://github.com/gregoryedgerton/golden-grids-study-template).

> **Status: built.** Sixteen real covers at the tile's texture size, with the
> real track listings behind them. [`ASSETS.md`](ASSETS.md) is the provenance:
> where each scan came from, the credit on each release, and how the files
> were made. What remains is the written post.

---

## Reference

**Page:** an artist page on open.spotify.com — the rows of equal album squares
(Discography, Featuring, Discovered on, Artist Playlists).
https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4

**Captured:** 2026-09-15, signed out, at 390 / 820 / 1440. Spotify scrolls an
inner container rather than the document, so the capture script scrolls the
tallest scroller and then grows the viewport to its height;
[`captures/capture.cjs`](captures/capture.cjs) does both.

| Width | Reference (artist page) | Reference (album page) |
| --- | --- | --- |
| 390px | ![](captures/reference-grid-390.png) | ![](captures/reference-album-390.png) |
| 820px | ![](captures/reference-grid-820.png) | ![](captures/reference-album-820.png) |
| 1440px | ![](captures/reference-grid-1440.png) | ![](captures/reference-album-1440.png) |

## The claim

A collection of squares is the case the grid handles worst and the spiral
handles natively.

The reference's rows assert that every record carries equal weight, which is
false the moment anyone scrolls: the row exists because some records are being
surfaced. More than that, a grid of equal squares has no way to express
*distance*. Nothing in it says "this record is four years further back than
that one". The spiral does that with size alone, and a scroll walks it.

## Why album covers

Album art is square and Fibonacci tiles are square, so nothing is lost. That
is a content argument, not a production one — the slot crops either way, so
the question is not whether cropping is *work* but whether cropping *destroys
something*. A photograph is a composition; take a square out of the middle of
a landscape and the composition goes with the sixty percent you discarded.
Album art has no outside to lose. It is also designed to survive thumbnail
scale, which is exactly the demand the dial makes of it.

## Structure

No bands. The page is one deep layout driven by the spiral camera:

- `generateGoldenGridLayout` lays out sixteen squares, one per record,
  rotated by `trailToRotateDeg` so the spiral grows into the open side of the
  stage — right when the stage is landscape, down when it is portrait. The
  direction cycles with the square count as well as the rotation, so it is
  solved rather than fixed.
- The page is a scroll body one viewport tall per record with a sticky,
  viewport-tall stage inside it. The camera's depth is the distance travelled
  through that body, so one viewport of scroll is one record.
- `spiralCamera` is called at `fillRatio: 1` and the focus is anchored flush
  into the stage's top-left corner, so all of the leftover room lies on one
  axis and the rest of the collection grows into it. Centring the focus at the
  default 0.62 leaves a margin on all four sides of a wide stage and the
  spiral floats in it.
- Each tile carries its own `toCssTileTransform`. There is deliberately no
  transform on the stage: a scaled stage layer forces every tile through one
  clamped raster and the deep dial goes soft.
- `spiralWindow` fades the far tail and `tileOnScreen` culls whatever has left
  the stage; a sub-pixel check drops the deepest records at shallow depths.
  Fifteen of the sixteen tiles still paint at the busiest depth; three do at
  the end of the travel. The window is a late saving, not a mid-turn one.

Nothing wraps the library. `spiralCamera`, `spiralWindow`, `tileOnScreen`,
`toCssTileTransform`, `toCssContentTransform` and `trailToRotateDeg` are
called directly, in the order the library's own `docs/spiral-dial.md`
prescribes.

## The two decisions

The brief asks for both to be made early and stated.

**1. The covers stay level.** Both versions were built and the level one won.
Turning art is the more dramatic still, but in motion a cover that spins reads
as a spinning picture rather than as a record you are moving past, and
sixteen of them turning at once is a great deal of rotation on screen.

`toCssContentTransform(frame)` on the artwork does it: counter-rotation about
the tile's own centre — unlike the tile matrix, which assumes a zero origin —
plus the |cos| + |sin| cover swell that keeps the rotated square filling its
clip box, exactly 1 at rest and √2 at worst. `{ counterRotate: false }` is the
turning version, one argument away.

Nothing else is written inside a tile. Each record was captioned in its own
tile at first, every caption counter-rotated and scaled back up so it stayed
readable, and sixteen of those on screen competed with the artwork the study
is about. One bar at the bottom of the viewport names what is in focus and
the covers carry themselves.

**2. The artwork is sourced at the tile's texture box.** Every tile renders
into a fixed 512px box and the camera scales that box, so full-resolution art
costs exactly the smoothness that makes the dial worth showing. `TEXTURE_PX`
in `src/assets.ts` is the single source of that number and the asset spec
quotes it.

## Clicking a record

Every cover is a control. Clicking one opens that record and lists its tracks.

**The tracks are a list, not a grid, and that is the finding.** They were a
golden grid first — five boxes descending, opener largest, the same shape the
collection uses one scale down. It looked deliberate and it was wrong, for the
reason the programme's own brief warns about: a track list is flat. Nothing
about track one outranks track four, so a Fibonacci descent asserts a
hierarchy the content does not have. The geometry then made the point for us:
with five boxes the two smallest are an eighth the width of the largest, so
they could hold a track number and nothing else, and the layout had to shed
the running time and then the title to stay legible. Needing three fallbacks
to fit a five-item list is the content telling you it is not a spiral.

The spiral is for the collection, where the distance between records is real
and size can carry it. Inside one record it would be decoration. So the
tracks are an ordered list, the way the reference does it, and the panel says
so on the page.

It is a dialog rather than an expanded cell, because the dial is a sticky,
viewport-tall stage that cannot grow the way a band can. It covers the stage,
takes focus, makes the stage `inert`, locks the page scroll — the dial's depth
*is* the scroll position, so leaving it live would spin the stage behind the
panel — and gives all of it back on close, with focus returning to the cover
that opened it. Escape closes.

## Reduced motion

Scroll-bound rotation is genuinely unpleasant for some people, so
`prefers-reduced-motion` produces a real static layout of the same sixteen
records — stacked golden grids, largest record first — not a slower dial. The
page says which one it is showing.

That full view is also the only place the collection is **filterable**, by
year and by the role the cover is credited to. The dial is a route through
the collection and deliberately not an index; the full view is where you go
to ask it a question. Filtering is what forced the band plan to be computed:
the count changes on every click, so each band's placement is derived from
its box count to keep it landscape, and the last band absorbs the remainder
so no match is ever dropped. Captions shrink with their box and disappear on
the smallest ones, because a Fibonacci descent makes the smallest a fraction
of the largest.

The study tools panel carries a **Reduced motion** switch (`m`) so the full
view can be seen and captured without changing a system setting; `?motion=1`
does the same for one load.

| | Dial | Reduced motion |
| --- | --- | --- |
| 390px | ![](captures/dial-390-d3_5.png) | ![](captures/study-reduced-390.png) |
| 1440px | ![](captures/dial-1440-d3_5.png) | ![](captures/study-reduced-1440.png) |

Stills at four depths (0, 3.5, 8 and 13) and three widths are in
`captures/dial-*.png`;
[`captures/dial.cjs`](captures/dial.cjs) takes them.

## Visual register

The structure is the argument, so everything that is not structure is held
constant: the study uses the reference's own palette and type, measured from
the live page on 2026-09-15 (`captures/tokens.cjs` →
`captures/reference-tokens.json`).

| Token | Reference (measured) | Study |
| --- | --- | --- |
| Face | SpotifyMixUI, falling back to Helvetica Neue, helvetica, arial | the same fallback stack; the face is proprietary and is not shipped |
| Ground | `#121212`; cards `#1f1f1f`, hover `#282828`; lines `#333333` | same |
| Text | white primary, `#b3b3b3` secondary | same |
| Accent | `#1ed760`, the one accent colour | same, on focus rings |
| Body | 16px 400 | same |
| Section heading | 24px 700 (20px at 390) | same |
| Display | 96px 800 (the artist name) | the study's title, at the same role |
| Secondary line | 14px 400 (13px at 390) | same |
| Cover radius | 6px | 6px in the static layout; 0 on the dial, where the tiles tile the plane |
| Pills | 9999px | same |

Colour scheme is dark only, as the reference has no light one.

## Asset spec

The handoff artifact. Pass one ends here: the dial is built and every slot is
inventoried. Pass two replaces the stand-ins with original artwork. The shot
list with one prompt per cover is [`ASSETS.md`](ASSETS.md).

**Count:** 16. **Dimension:** 512 × 512 each, square, no exceptions — that is
the tile's texture box, and anything larger costs the dial its smoothness
while anything smaller is upscaled at focus. Three of the sixteen had no scan
at 512 and were upsampled; `ASSETS.md` marks them, and a better scan drops in
as `-v2` at the same size.

**What the artwork has to survive:** the dial shows the same cover at a few
hundred pixels and at a few. Strong, simple compositions read best; a busy
cover becomes noise at depth. Rotation is not a constraint on the artwork —
the covers are held level while their tiles turn — and putting real covers on
the dial is part of why that decision went the way it did.

**The records** are in `src/content.ts`: sixteen releases from 2002 to 2009,
ordered newest first — the order the dial travels, so depth 0 is 2009 and the
eye of the spiral is 2002. Each carries its artist, year, label, the
designer's credit as Discogs records it, and its track listing.

## What worked

- **Square in, square out.** Every tile is a square and every cover is a
  square, so the layout crops nothing. This is the one content type where the
  spiral's geometry and the material agree completely.
- **Distance reads as size.** A record four steps back is visibly smaller and
  further round the turn. A grid has no way to say that.
- **The trail solve.** Rotating the layout so the spiral grows into the open
  side of the stage is what keeps a wide desktop stage and a tall phone stage
  both full. It has to be solved for the count, not fixed.
- **The counter-rotation.** Holding the artwork level while its tile travels
  the spiral is what makes the dial read as movement through a collection
  rather than as a spinning picture. It is the one transform the dial cannot
  do without.
- **Knowing where the spiral stops.** The clearest thing this study learned is
  where its own idea does not apply: a record's track list is flat, so it gets
  a list. The same rule Study 01 reached for its amenities — flat content gets
  one slot, or none — held here at a different scale.

## What did not

- **Paint cost is the real risk, and the window does not solve it where it
  matters.** A solid tail looks better mid-turn — the outward records keep
  filling the negative space — but outward squares grow by φ each step, so
  they always cover the stage and nothing is ever culled: all sixteen
  textures paint on every frame. The fading window was chosen instead, and it
  buys much less than this page first claimed. Measured on the deploy: at the
  busiest depth fifteen of sixteen tiles still paint at 1200×900, and
  fourteen at 375×812. The count only falls away in the back half of the
  travel, reaching three at the end. So the window costs some coverage at the
  corners mid-turn and saves one or two tiles at the exact moment the paint
  load is worst. The mid-range-phone risk the brief names is still there;
  what would actually address it is fewer textures or a smaller `TEXTURE_PX`,
  not this window. Confirm on a real phone, not a development machine.
  (An earlier revision of this file said the count stayed at thirteen or
  fewer. That number came from too coarse a sample and was wrong.)
- **The dial is not an index.** You cannot find a specific record in it
  without travelling. That is the honest limit of the argument and the reason
  the framing paragraph is the first thing on the page.
- **One record at a time.** The reference shows forty covers at once; the dial
  shows one clearly and a dozen partially. For browsing a collection you know,
  that is worse.
- **The dial does not advertise itself.** Nothing about a spiral says "these
  are clickable". The readout says so in words, which is an admission that the
  affordance is not carried by the layout. A grid of covers does not need to
  be told.
- **The track list was a golden grid and should not have been.** Built, shipped
  and taken out again. It is documented above rather than quietly deleted,
  because a study that only shows the library winning is an advertisement.

## Running it

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/`. The library is consumed
from the npm registry at its published version, never linked from a local
checkout, so the study exercises what the public installs.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages. The base path derives
from the repository name inside the workflow. The Pages source was pointed at
GitHub Actions once with
`gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow`.

## Pre-publish checklist

- [x] The reference page is named, with a URL, in the README and on the page.
- [x] The unaffiliated line is visible on the page and in the README.
- [x] Nothing from the reference site is reproduced. Captures are commentary
      and are not used as assets. The covers are the designer's own work and
      the recordings are credited to their artists and labels.
- [x] Every cover is the designer's own work, with its provenance and credit
      recorded in `ASSETS.md`.
- [x] The asset spec is complete: count, dimension, and what the artwork has
      to survive.
- [x] "What did not" has at least one honest entry.
- [x] Checked and legible at 390px, 820px and 1440px.
- [x] Visible keyboard focus.
- [x] `prefers-reduced-motion` produces a real static layout, not a slower dial.
- [x] Text contrast meets WCAG AA.
- [x] Covers that carry meaning have alt text; the dial's own tiles are
      `alt=""` because the readout names the focused record.
