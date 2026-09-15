# Shot list — Study 02 covers

Hand-off for an image-generation agent. Twenty-one album covers, one per
record. Produce every file, name it by the rubric, drop it in
`public/assets/`, and report back the table at the bottom filled in. Do not
touch the code; the swap-in is a separate step.

Read `README.md` → "Asset spec" for why the dimension is fixed, and
`src/content.ts` for the records these covers belong to.

## The brief

Twenty-one invented records by twenty-one invented artists, spanning 2016 to
2026. They are not a single label or scene; they are one person's collection,
so the set should feel gathered rather than art-directed as a series. What
holds it together is the constraint below, not a house style.

## The constraint — read this before anything else

Every cover is shown on a spiral dial. The same artwork appears at six hundred
pixels and at six, and it rotates through ninety degrees per step. So:

- **512 × 512, square, every time.** That is the tile's texture box. Larger
  costs the dial its smoothness; smaller is upscaled at focus.
- **One idea per cover.** A busy cover becomes noise at depth. If it does not
  read as a shape at 24px, it is wrong.
- **High contrast between the main shape and the ground.** The dial dims and
  fades tiles; low-contrast art disappears early.
- **Nothing that depends on being upright.** The cover turns with its tile.
  Avoid horizons, skylines, standing figures and anything with an obvious
  "this way up" — or embrace the turn and make it symmetrical.
- **Type is optional and never small.** If a cover carries the album name, set
  it at no less than a tenth of the cover's width. Most of these should carry
  no type at all; the page prints the album and artist beside the tile.
- **No real brand marks, no real artists, no real album art**, and nothing
  that resembles a specific existing release. These records do not exist.

## Style guide

- **Medium:** graphic design, not photography. Flat colour, halftone, risograph,
  collage, painted texture, type specimens, photograms — the range a real
  collection has.
- **Palette:** each cover is built from a stated hue plus black, white and one
  neutral. The hues are listed below and are spread around the wheel so
  neighbours in the collection never sit next to a near-match on the dial.
- **Finish:** clean edges, no drop shadows, no mockups, no vinyl sleeve
  renders, no perspective. The cover is the flat artwork itself, bleeding to
  all four edges.
- **Negative prompt (all covers):** logo, brand mark, watermark, signature,
  small text, photograph of a person, mockup, vinyl sleeve, CD case,
  perspective, drop shadow, border, frame, white margin.

## Naming rubric

`s02-cover-<nn>-<slug>-512x512-v<N>.jpg`

| Part | Values |
| --- | --- |
| `s02` | Study 02. Fixed. |
| `nn` | the record's number below, zero-padded: `01`–`21` |
| `slug` | the album title, lowercase, hyphenated |
| `512x512` | the produced size, exactly |
| `v<N>` | version, starting `v1`; a re-generation is `v2`, never an overwrite |

Example: `s02-cover-01-long-weather-512x512-v1.jpg`. JPEG, quality 85, sRGB,
no EXIF. Deliver into `public/assets/`.

## The twenty-one

`hue` is the cover's base hue in degrees. Treat it as the anchor, not a
straitjacket: one accent from elsewhere on the wheel is welcome, a second is
usually not.

| # | Artist | Album | Year | Hue | File |
| - | --- | --- | --- | --- | --- |
| 01 | Vantablack Sunday | Long Weather | 2026 | 210 | `s02-cover-01-long-weather-512x512-v1.jpg` |
| 02 | The Ordinary Hours | Sleeper Service | 2026 | 24 | `s02-cover-02-sleeper-service-512x512-v1.jpg` |
| 03 | Mora Vale | Thin Ice, Thick Skin | 2025 | 340 | `s02-cover-03-thin-ice-thick-skin-512x512-v1.jpg` |
| 04 | Klaxon Mailorder | Catalogue No. 4 | 2025 | 96 | `s02-cover-04-catalogue-no-4-512x512-v1.jpg` |
| 05 | Ivy Kwan | Studies for Piano and Rain | 2025 | 190 | `s02-cover-05-studies-for-piano-and-rain-512x512-v1.jpg` |
| 06 | Dust Parade | Municipal Pool | 2024 | 44 | `s02-cover-06-municipal-pool-512x512-v1.jpg` |
| 07 | Saltwater Telephone | Long Distance | 2024 | 268 | `s02-cover-07-long-distance-512x512-v1.jpg` |
| 08 | The Tessellators | Repeat Pattern | 2024 | 130 | `s02-cover-08-repeat-pattern-512x512-v1.jpg` |
| 09 | Bea Otilio | Cassette Culture | 2023 | 12 | `s02-cover-09-cassette-culture-512x512-v1.jpg` |
| 10 | Northern Interior | Quiet Industry | 2023 | 224 | `s02-cover-10-quiet-industry-512x512-v1.jpg` |
| 11 | Pelican Sound | Ferry Timetable | 2023 | 170 | `s02-cover-11-ferry-timetable-512x512-v1.jpg` |
| 12 | Rosalind Ngata | Fieldwork | 2022 | 60 | `s02-cover-12-fieldwork-512x512-v1.jpg` |
| 13 | Motor Pool | Second Shift | 2022 | 0 | `s02-cover-13-second-shift-512x512-v1.jpg` |
| 14 | The Lamplighters | Civic Duty | 2021 | 288 | `s02-cover-14-civic-duty-512x512-v1.jpg` |
| 15 | Hollow Green | Orchard Road | 2021 | 112 | `s02-cover-15-orchard-road-512x512-v1.jpg` |
| 16 | Ada & the Archive | Reference Copy | 2020 | 316 | `s02-cover-16-reference-copy-512x512-v1.jpg` |
| 17 | Tin Bird Choir | Migration Season | 2020 | 200 | `s02-cover-17-migration-season-512x512-v1.jpg` |
| 18 | Concrete Harvest | Yield | 2019 | 36 | `s02-cover-18-yield-512x512-v1.jpg` |
| 19 | Vera Lune | Night Bus | 2018 | 250 | `s02-cover-19-night-bus-512x512-v1.jpg` |
| 20 | The Understudies | Dress Rehearsal | 2017 | 150 | `s02-cover-20-dress-rehearsal-512x512-v1.jpg` |
| 21 | First Position | Debut | 2016 | 80 | `s02-cover-21-debut-512x512-v1.jpg` |

## Per-cover direction

One line each. The album title is the brief; the hue is the palette; the
constraint above governs everything else.

01. **Long Weather** — Vantablack Sunday, 2026. Hue 210. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Long Weather”, built from hue 210 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
02. **Sleeper Service** — The Ordinary Hours, 2026. Hue 24. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Sleeper Service”, built from hue 24 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
03. **Thin Ice, Thick Skin** — Mora Vale, 2025. Hue 340. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Thin Ice, Thick Skin”, built from hue 340 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
04. **Catalogue No. 4** — Klaxon Mailorder, 2025. Hue 96. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Catalogue No. 4”, built from hue 96 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
05. **Studies for Piano and Rain** — Ivy Kwan, 2025. Hue 190. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Studies for Piano and Rain”, built from hue 190 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
06. **Municipal Pool** — Dust Parade, 2024. Hue 44. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Municipal Pool”, built from hue 44 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
07. **Long Distance** — Saltwater Telephone, 2024. Hue 268. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Long Distance”, built from hue 268 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
08. **Repeat Pattern** — The Tessellators, 2024. Hue 130. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Repeat Pattern”, built from hue 130 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
09. **Cassette Culture** — Bea Otilio, 2023. Hue 12. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Cassette Culture”, built from hue 12 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
10. **Quiet Industry** — Northern Interior, 2023. Hue 224. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Quiet Industry”, built from hue 224 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
11. **Ferry Timetable** — Pelican Sound, 2023. Hue 170. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Ferry Timetable”, built from hue 170 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
12. **Fieldwork** — Rosalind Ngata, 2022. Hue 60. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Fieldwork”, built from hue 60 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
13. **Second Shift** — Motor Pool, 2022. Hue 0. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Second Shift”, built from hue 0 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
14. **Civic Duty** — The Lamplighters, 2021. Hue 288. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Civic Duty”, built from hue 288 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
15. **Orchard Road** — Hollow Green, 2021. Hue 112. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Orchard Road”, built from hue 112 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
16. **Reference Copy** — Ada & the Archive, 2020. Hue 316. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Reference Copy”, built from hue 316 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
17. **Migration Season** — Tin Bird Choir, 2020. Hue 200. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Migration Season”, built from hue 200 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
18. **Yield** — Concrete Harvest, 2019. Hue 36. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Yield”, built from hue 36 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
19. **Night Bus** — Vera Lune, 2018. Hue 250. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Night Bus”, built from hue 250 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
20. **Dress Rehearsal** — The Understudies, 2017. Hue 150. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Dress Rehearsal”, built from hue 150 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.
21. **Debut** — First Position, 2016. Hue 80. Prompt: flat graphic album cover, 512×512, square, one bold idea drawn from the title “Debut”, built from hue 80 with black, white and one neutral, bleeding to all four edges, readable as a shape at thumbnail size, no type unless it is very large, no logo or watermark.

## Report back

| # | File | Produced size | Notes (deviations, if any) |
| - | --- | --- | --- |
| 01 | | | |
| 02 | | | |
| 03 | | | |
| 04 | | | |
| 05 | | | |
| 06 | | | |
| 07 | | | |
| 08 | | | |
| 09 | | | |
| 10 | | | |
| 11 | | | |
| 12 | | | |
| 13 | | | |
| 14 | | | |
| 15 | | | |
| 16 | | | |
| 17 | | | |
| 18 | | | |
| 19 | | | |
| 20 | | | |
| 21 | | | |
