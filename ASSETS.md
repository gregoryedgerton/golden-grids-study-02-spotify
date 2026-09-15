# The covers — provenance

The sixteen records on the dial are releases whose covers Greg Edgerton
designed. This file is the provenance, not a generation brief: it records
where each cover came from, what the credit is, and how the file was made,
so the study can be checked and the artwork can be swapped for a better scan
without guesswork.

## What these are, and are not

- **The artwork is the designer's own work**, shown as a portfolio. Every
  release below carries a Discogs credit to Greg Edgerton for layout, design,
  art direction or artwork.
- **The recordings are not.** They belong to their artists and labels.
  Nothing here is offered for playback, download or sale, and no label
  wordmark is reproduced beyond what appears inside the cover itself.
- **Nothing comes from Spotify.** The reference is named and captured for
  commentary; no asset from it is used.
- Releases, credits and track listings are from the Discogs artist page:
  https://www.discogs.com/artist/3501563-Greg-Edgerton

## How the files were made

Each cover is the largest near-square scan Discogs holds for the release
(where a release had several images, the largest within 12% of square was
taken; where a master had several versions, the version with the largest scan
was taken). Each was centre-cropped to its short side and resampled to
512 × 512, JPEG quality 85 — `TEXTURE_PX` in `src/assets.ts` is the single
source of that number and the dial's tile box uses the same one.

Scans below 512px on the long side were upsampled and are marked. A better
scan can be dropped in at any time: same filename with `-v2`, same 512 × 512.

## Naming rubric

`s02-cover-<nn>-<slug>-512x512-v<N>.jpg`

| Part | Values |
| --- | --- |
| `s02` | Study 02. Fixed. |
| `nn` | position on the dial, newest first: `01`–`16` |
| `slug` | the release title, lowercase, hyphenated |
| `512x512` | the produced size, exactly |
| `v<N>` | version; a rescan is `v2`, never an overwrite |

## The sixteen

| # | Year | Artist | Release | Label | Credit | Source scan | File |
| - | ---- | ------ | ------- | ----- | ------ | ----------- | ---- |
| 01 | 2009 | Otep | Smash The Control Machine | Victory Records | Art Direction, Artwork | 600×600 | `s02-cover-01-smash-the-control-machine-512x512-v1.jpg` |
| 02 | 2008 | 16 Second Stare | Red Carpet Material | Mighty Loud | Design, Layout | 600×600 | `s02-cover-02-red-carpet-material-512x512-v1.jpg` |
| 03 | 2007 | Sebastian Bach | Angel Down | Caroline Records | Art Direction, Layout, Design | 600×530 | `s02-cover-03-angel-down-512x512-v1.jpg` |
| 04 | 2007 | No Hollywood Ending | Everybody's Talking | Merovingian Music / No Milk | Layout, Design | 500×500 ⚠ upsampled | `s02-cover-04-everybody-s-talking-512x512-v1.jpg` |
| 05 | 2006 | Sleepaway | Sleepaway | No Milk Records | Design, Artwork | 600×600 | `s02-cover-05-sleepaway-512x512-v1.jpg` |
| 06 | 2006 | Facing New York | Facing New York | Five One, Inc. | Design [Additional Design] | 600×549 | `s02-cover-06-facing-new-york-512x512-v1.jpg` |
| 07 | 2006 | The Bank Robbers | Tomorrow Belongs To Me | No Milk Records | Layout, Design | 400×395 ⚠ upsampled | `s02-cover-07-tomorrow-belongs-to-me-512x512-v1.jpg` |
| 08 | 2005 | Baumer | Come On, Feel It | Astro Magnetics | Art Direction | 600×595 | `s02-cover-08-come-on-feel-it-512x512-v1.jpg` |
| 09 | 2005 | Socratic | Lunch For The Sky | Drive-Thru Records | Design | 600×597 | `s02-cover-09-lunch-for-the-sky-512x512-v1.jpg` |
| 10 | 2005 | Mommy And Daddy | Duel At Dawn | Kanine Records | Design [Additional] | 597×600 | `s02-cover-10-duel-at-dawn-512x512-v1.jpg` |
| 11 | 2005 | Tourmaline | Strange Distress Calls | No Milk Records | Design | 600×537 | `s02-cover-11-strange-distress-calls-512x512-v1.jpg` |
| 12 | 2004 | The Sideways | As Explained Through Science Fiction | Self-released | Layout, Design | 600×537 | `s02-cover-12-as-explained-through-science-fiction-512x512-v1.jpg` |
| 13 | 2003 | The Bank Robbers | The Pattern Reversed | No Milk Records | Layout, Design | 600×593 | `s02-cover-13-the-pattern-reversed-512x512-v1.jpg` |
| 14 | 2003 | Last Perfect Thing | Too Much Of Anything | We Make Records | Design, Layout | 600×600 | `s02-cover-14-too-much-of-anything-512x512-v1.jpg` |
| 15 | 2002 | Socratic | It's Getting Late | No Milk Records | Layout [Direction] | 600×528 | `s02-cover-15-it-s-getting-late-512x512-v1.jpg` |
| 16 | 2002 | The Bank Robbers | Life Is But A Dream. | No Milk Records | Layout, Design | 600×596 | `s02-cover-16-life-is-but-a-dream-512x512-v1.jpg` |

## Track listings

Taken from the same Discogs release pages, in release order, titles as
Discogs records them. Four releases list no running times; the study's track
list omits the time where there is none rather than inventing one.

| # | Release | Tracks | Running times |
| - | ------- | ------ | ------------- |
| 01 | Smash The Control Machine | 13 | yes |
| 02 | Red Carpet Material | 13 | yes |
| 03 | Angel Down | 14 | yes |
| 04 | Everybody's Talking | 15 | yes |
| 05 | Sleepaway | 10 | not listed |
| 06 | Facing New York | 10 | yes |
| 07 | Tomorrow Belongs To Me | 11 | yes |
| 08 | Come On, Feel It | 12 | yes |
| 09 | Lunch For The Sky | 15 | yes |
| 10 | Duel At Dawn | 13 | yes |
| 11 | Strange Distress Calls | 11 | not listed |
| 12 | As Explained Through Science Fiction | 7 | yes |
| 13 | The Pattern Reversed | 10 | not listed |
| 14 | Too Much Of Anything | 4 | yes |
| 15 | It's Getting Late | 6 | not listed |
| 16 | Life Is But A Dream. | 8 | yes |

Total: 172 tracks across 16 releases.
