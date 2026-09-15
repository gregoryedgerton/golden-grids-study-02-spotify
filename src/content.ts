/**
 * Study 02 copy and collection. Original throughout: the artists, albums and
 * cover artwork are invented for this study, so nothing from Spotify or from
 * any real release is reproduced. The shot list for the covers is ASSETS.md.
 */

export const study = {
  title: "Twenty-one records on a spiral",
  kicker: "Layout study 02 · unaffiliated · original artwork",
  /** The framing the brief asks for, in the first paragraph. */
  framing:
    "This is not a Spotify rebuild. Spotify's wall of equal squares is a scannable index and the spiral is not a substitute for one. The claim is narrower and harder to dismiss: here is a way of moving through a collection that a grid cannot express.",
  claim:
    "A collection of squares is the case the grid handles worst and the spiral handles natively.",
  reference: {
    label: "an artist page on spotify.com",
    url: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
  },
  hint: "Scroll to dial. Every record passes through the focus.",
  reducedNotice:
    "Reduced motion is on, so the dial is replaced by a static layout of the same records. That is the fallback, not a slower dial.",
  dialNote:
    "Covers turn with their tiles; only the label counter-rotates. Each tile renders into a fixed 512px texture box and the artwork is sourced at that size, because full-resolution art costs exactly the smoothness that makes the dial worth showing.",
};

export interface Record_ {
  artist: string;
  album: string;
  year: number;
  /** Two hues the placeholder cover is built from, until the artwork lands. */
  hue: number;
}

/** Twenty-one invented records, ordered newest first — the order the dial
 *  travels, so depth 0 is the most recent and the eye of the spiral is the
 *  oldest. */
export const records: Record_[] = [
  { artist: "Vantablack Sunday", album: "Long Weather", year: 2026, hue: 210 },
  { artist: "The Ordinary Hours", album: "Sleeper Service", year: 2026, hue: 24 },
  { artist: "Mora Vale", album: "Thin Ice, Thick Skin", year: 2025, hue: 340 },
  { artist: "Klaxon Mailorder", album: "Catalogue No. 4", year: 2025, hue: 96 },
  { artist: "Ivy Kwan", album: "Studies for Piano and Rain", year: 2025, hue: 190 },
  { artist: "Dust Parade", album: "Municipal Pool", year: 2024, hue: 44 },
  { artist: "Saltwater Telephone", album: "Long Distance", year: 2024, hue: 268 },
  { artist: "The Tessellators", album: "Repeat Pattern", year: 2024, hue: 130 },
  { artist: "Bea Otilio", album: "Cassette Culture", year: 2023, hue: 12 },
  { artist: "Northern Interior", album: "Quiet Industry", year: 2023, hue: 224 },
  { artist: "Pelican Sound", album: "Ferry Timetable", year: 2023, hue: 170 },
  { artist: "Rosalind Ngata", album: "Fieldwork", year: 2022, hue: 60 },
  { artist: "Motor Pool", album: "Second Shift", year: 2022, hue: 0 },
  { artist: "The Lamplighters", album: "Civic Duty", year: 2021, hue: 288 },
  { artist: "Hollow Green", album: "Orchard Road", year: 2021, hue: 112 },
  { artist: "Ada & the Archive", album: "Reference Copy", year: 2020, hue: 316 },
  { artist: "Tin Bird Choir", album: "Migration Season", year: 2020, hue: 200 },
  { artist: "Concrete Harvest", album: "Yield", year: 2019, hue: 36 },
  { artist: "Vera Lune", album: "Night Bus", year: 2018, hue: 250 },
  { artist: "The Understudies", album: "Dress Rehearsal", year: 2017, hue: 150 },
  { artist: "First Position", album: "Debut", year: 2016, hue: 80 },
];
