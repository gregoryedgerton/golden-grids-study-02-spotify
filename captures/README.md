# Captures

Screenshots that back the study's claims. Two are of the reference page and
are the left half of every side-by-side; two are of the study itself. They
live in the repo because the argument is structural and needs the evidence
beside it.

All four sets are taken at 390px, 820px and 1440px: the width where a grid
collapses to one column and order carries it, the awkward middle where
twelve-column grids are weakest, and the width the grid was designed for.

## The reference

Two different pages, so `capture.cjs` takes the file prefix as its third
argument. It defaults to `reference`, which is the one value neither set
uses — pass the prefix every time.

| Files                     | Source page                                              | Command                                                          |
| ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| `reference-grid-<w>.png`  | `https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4` | `node captures/capture.cjs <artist-url> captures reference-grid` |
| `reference-album-<w>.png` | an album page on the same site, see below                | `node captures/capture.cjs <album-url> captures reference-album` |

The album page's URL was not recorded when these were taken, and it is not
written down anywhere else in the repo. The capture itself shows the page: the
album is *Scorpion*, on the same artist. Recover the URL from the site before
re-capturing, and write it into this table when you do.

`capture.cjs` looks for an inner scroll container first, because the
reference scrolls a pane rather than the page. When it finds one it grows the
viewport to that pane's height and takes a viewport shot; only when it finds
none does it fall back to `fullPage`. So these are not always full-page
captures, and the album page in particular is not.

## The study

| Files                    | What it is                                    | Command                                                  |
| ------------------------ | --------------------------------------------- | -------------------------------------------------------- |
| `dial-<w>-d<depth>.png`  | The dial at four depths: 0, 3.5, 8 and 13     | `node captures/dial.cjs <study-url> captures 0,3.5,8,13`  |
| `study-reduced-<w>.png`  | The reduced-motion static layout               | `node captures/capture.cjs <study-url>?motion=1 captures study-reduced` |

Depths are written into the filename with the decimal point as an underscore,
so 3.5 becomes `d3_5`. `dial.cjs` always takes a viewport shot, never a
full-page one — the stage is one viewport tall by design.

The reduced-motion set needs the study in its reduced state. `?motion=1` sets
it for one load, which is what the command above relies on; the tools panel's
`m` switch does the same thing interactively and persists.

## Provenance

The reference captures are commentary on a named site. They are not
redistributed as assets of the study and nothing from them is copied into the
build.
