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
  hint: "Scroll to dial. Click any cover to open its track list.",
  reducedNotice:
    "Reduced motion is on, so the dial is replaced by a static layout of the same records. That is the fallback, not a slower dial.",
  dialNote:
    "Covers turn with their tiles; only the label counter-rotates. Each tile renders into a fixed 512px texture box and the artwork is sourced at that size, because full-resolution art costs exactly the smoothness that makes the dial worth showing.",
};

export interface Record_ {
  artist: string;
  album: string;
  year: number;
  /** The hue the placeholder cover is built from, until the artwork lands. */
  hue: number;
  /** Five tracks, each with a running time. The album view lays them out as a
   *  golden grid of its own — a second, nested use of the library inside the
   *  slot the dial was showing. */
  tracks: [string, string][];
}

/** Twenty-one invented records, ordered newest first — the order the dial
 *  travels, so depth 0 is the most recent and the eye of the spiral is the
 *  oldest. */
export const records: Record_[] = [
  { artist: "Vantablack Sunday", album: "Long Weather", year: 2026, hue: 210, tracks: [["Long Weather", "4:12"], ["Coastal Road", "3:38"], ["Nine Hours of Rain", "6:05"], ["Signal Fade", "3:20"], ["The Long Way Round", "5:47"]] },
  { artist: "The Ordinary Hours", album: "Sleeper Service", year: 2026, hue: 24, tracks: [["Sleeper Service", "5:01"], ["Berth 4", "3:44"], ["Night Crossing", "4:29"], ["Steward", "2:58"], ["Arrivals Hall", "6:22"]] },
  { artist: "Mora Vale", album: "Thin Ice, Thick Skin", year: 2025, hue: 340, tracks: [["Thin Ice", "3:55"], ["Thick Skin", "4:07"], ["Cold Open", "2:41"], ["Lake Effect", "5:18"], ["Thaw", "4:33"]] },
  { artist: "Klaxon Mailorder", album: "Catalogue No. 4", year: 2025, hue: 96, tracks: [["Catalogue No. 4", "3:12"], ["Mail Day", "2:49"], ["Pressing Error", "4:56"], ["Test Pressing", "3:31"], ["Return to Sender", "5:09"]] },
  { artist: "Ivy Kwan", album: "Studies for Piano and Rain", year: 2025, hue: 190, tracks: [["Study I", "2:22"], ["Study II", "3:47"], ["Rain on the Lid", "5:56"], ["Study III", "4:14"], ["Pedal Down", "7:02"]] },
  { artist: "Dust Parade", album: "Municipal Pool", year: 2024, hue: 44, tracks: [["Municipal Pool", "4:40"], ["Deep End", "3:26"], ["Lane Four", "2:55"], ["Chlorine", "5:11"], ["Closing Time", "4:03"]] },
  { artist: "Saltwater Telephone", album: "Long Distance", year: 2024, hue: 268, tracks: [["Long Distance", "4:58"], ["Dial Tone", "2:34"], ["Area Code", "3:49"], ["Saltwater", "5:27"], ["Reverse Charge", "4:16"]] },
  { artist: "The Tessellators", album: "Repeat Pattern", year: 2024, hue: 130, tracks: [["Repeat Pattern", "3:33"], ["Tessellate", "4:21"], ["Tile Work", "2:47"], ["Symmetry Group", "5:38"], ["Fold and Cut", "3:59"]] },
  { artist: "Bea Otilio", album: "Cassette Culture", year: 2023, hue: 12, tracks: [["Cassette Culture", "3:18"], ["Side B", "4:44"], ["Auto Reverse", "2:52"], ["Tape Hiss", "5:03"], ["Dub Master", "4:27"]] },
  { artist: "Northern Interior", album: "Quiet Industry", year: 2023, hue: 224, tracks: [["Quiet Industry", "5:14"], ["Shift Change", "3:41"], ["Mill Town", "4:35"], ["Lathe", "2:39"], ["Last Order", "6:11"]] },
  { artist: "Pelican Sound", album: "Ferry Timetable", year: 2023, hue: 170, tracks: [["Ferry Timetable", "4:09"], ["Slipway", "3:27"], ["Foot Passenger", "5:33"], ["Wake", "2:48"], ["Last Sailing", "4:52"]] },
  { artist: "Rosalind Ngata", album: "Fieldwork", year: 2022, hue: 60, tracks: [["Fieldwork", "3:46"], ["Transect", "4:18"], ["Sample Plot", "2:57"], ["Notebook", "5:22"], ["Season's End", "4:41"]] },
  { artist: "Motor Pool", album: "Second Shift", year: 2022, hue: 0, tracks: [["Second Shift", "4:25"], ["Motor Pool", "3:14"], ["Depot", "5:07"], ["Clock Card", "2:43"], ["Overtime", "6:30"]] },
  { artist: "The Lamplighters", album: "Civic Duty", year: 2021, hue: 288, tracks: [["Civic Duty", "3:52"], ["Lamplighter", "4:36"], ["Parish Notice", "2:51"], ["Town Hall", "5:19"], ["Curfew", "4:08"]] },
  { artist: "Hollow Green", album: "Orchard Road", year: 2021, hue: 112, tracks: [["Orchard Road", "4:02"], ["Windfall", "3:29"], ["Grafting", "5:41"], ["Cider House", "2:46"], ["Last Picking", "4:57"]] },
  { artist: "Ada & the Archive", album: "Reference Copy", year: 2020, hue: 316, tracks: [["Reference Copy", "3:37"], ["Accession", "4:23"], ["Cold Store", "5:49"], ["Finding Aid", "2:36"], ["Deaccession", "4:14"]] },
  { artist: "Tin Bird Choir", album: "Migration Season", year: 2020, hue: 200, tracks: [["Migration Season", "5:06"], ["Tin Bird", "3:23"], ["Flyway", "4:48"], ["Ringing", "2:59"], ["Wintering", "6:17"]] },
  { artist: "Concrete Harvest", album: "Yield", year: 2019, hue: 36, tracks: [["Yield", "4:31"], ["Pour", "3:08"], ["Cure", "5:24"], ["Formwork", "2:44"], ["Strike", "4:46"]] },
  { artist: "Vera Lune", album: "Night Bus", year: 2018, hue: 250, tracks: [["Night Bus", "4:19"], ["Last Stop", "3:35"], ["Upper Deck", "5:02"], ["Request Stop", "2:53"], ["Depot Lights", "4:38"]] },
  { artist: "The Understudies", album: "Dress Rehearsal", year: 2017, hue: 150, tracks: [["Dress Rehearsal", "3:44"], ["Understudy", "4:11"], ["Green Room", "5:31"], ["Cue", "2:38"], ["Curtain", "4:54"]] },
  { artist: "First Position", album: "Debut", year: 2016, hue: 80, tracks: [["Debut", "3:29"], ["First Position", "4:47"], ["Beginner's Luck", "2:42"], ["Rough Cut", "5:16"], ["Encore", "4:22"]] },
];
