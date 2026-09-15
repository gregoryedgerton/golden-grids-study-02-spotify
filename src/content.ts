/**
 * Study 02 content: sixteen records whose covers Greg Edgerton designed,
 * newest first — the order the dial travels, so depth 0 is 2009 and the eye
 * of the spiral is 2002.
 *
 * The releases, credits and track listings are from Discogs
 * (discogs.com/artist/3501563-Greg-Edgerton), and the artwork is the
 * designer's own work shown as a portfolio. The recordings belong to their
 * artists and labels; nothing here is offered for playback.
 */

export const study = {
  title: "Sixteen covers on a spiral",
  kicker: "Layout study 02 · unaffiliated · covers designed by Greg Edgerton",
  /** The framing the brief asks for, in the first paragraph. */
  framing:
    "This is not a Spotify rebuild. Spotify's wall of equal squares is a scannable index and the spiral is not a substitute for one. The claim is narrower and harder to dismiss: here is a way of moving through a collection that a grid cannot express.",
  claim:
    "A collection of squares is the case the grid handles worst and the spiral handles natively.",
  reference: {
    label: "an artist page on spotify.com",
    url: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
  },
  source: {
    label: "Discogs",
    url: "https://www.discogs.com/artist/3501563-Greg-Edgerton",
  },
  hint: "Scroll to dial. Click any cover to open its track list.",
  reducedNotice:
    "Reduced motion is on, so the dial is replaced by a static layout of the same records. That is the fallback, not a slower dial.",
  dialNote:
    "Covers stay level while their tiles turn, and each tile renders into a fixed 512px texture box with the artwork sourced at that size, because full-resolution art costs exactly the smoothness that makes the dial worth showing.",
};

export interface Record_ {
  artist: string;
  album: string;
  year: number;
  label: string;
  /** The designer's credit on the release, as Discogs records it. */
  credit: string;
  /** The cover file in public/assets, named by the rubric in ASSETS.md. */
  file: string;
  /** Track title and running time; the time is empty where the release does
   *  not list one. */
  tracks: [string, string][];
}

/** Newest first: the order the dial travels. */
export const records: Record_[] = [
  {
    artist: "Otep",
    album: "Smash The Control Machine",
    year: 2009,
    label: "Victory Records",
    credit: "Art Direction, Artwork",
    file: "s02-cover-01-smash-the-control-machine-512x512-v1.jpg",
    tracks: [["Rise Rebel Resist", "3:59"], ["Sweet Tooth", "4:21"], ["Smash The Control Machine", "3:44"], ["Head", "5:11"], ["Numb & Dumb", "4:26"], ["Oh, So Surreal", "4:21"], ["Run For Cover", "3:35"], ["Kisses And Kerosene", "4:12"], ["Unveiled", "3:28"], ["Ur A WMN Now", "4:19"], ["Serv Asat", "2:30"], ["Where The River Ends", "11:57"], ["I Remember", "8:34"]],
  },
  {
    artist: "16 Second Stare",
    album: "Red Carpet Material",
    year: 2008,
    label: "Mighty Loud",
    credit: "Design, Layout",
    file: "s02-cover-02-red-carpet-material-512x512-v1.jpg",
    tracks: [["Ballad Of Billy Rose", "3:34"], ["Anymore", "3:41"], ["Stuck In The Moment", "3:41"], ["One More Time", "3:50"], ["Red Carpet Material", "3:03"], ["Pa 2001", "4:40"], ["Better Man", "4:34"], ["Smash", "3:50"], ["Down", "4:50"], ["Roxy", "3:34"], ["Control", "4:03"], ["Take Me Back", "3:42"], ["Goodbye", "4:30"]],
  },
  {
    artist: "Sebastian Bach",
    album: "Angel Down",
    year: 2007,
    label: "Caroline Records",
    credit: "Art Direction, Layout, Design",
    file: "s02-cover-03-angel-down-512x512-v1.jpg",
    tracks: [["Angel Down", "3:48"], ["You Don't Understand", "3:07"], ["Back In The Saddle", "4:19"], ["(Love Is) A Bitchslap", "3:09"], ["Stuck Inside", "2:57"], ["American Metalhead", "4:03"], ["Negative Light", "4:33"], ["Live & Die", "3:53"], ["By Your Side", "5:28"], ["Our Love Is A Lie", "3:21"], ["Take You Down With Me", "4:38"], ["Stabbin' Daggers", "3:42"], ["You Bring Me Down", "3:16"], ["Falling Into You", "4:21"]],
  },
  {
    artist: "No Hollywood Ending",
    album: "Everybody's Talking",
    year: 2007,
    label: "Merovingian Music / No Milk",
    credit: "Layout, Design",
    file: "s02-cover-04-everybody-s-talking-512x512-v1.jpg",
    tracks: [["ATM", "3:45"], ["Hot Without A Heartbeat (Part 1)", "3:16"], ["ChaChaChasity", "2:28"], ["Sixteen Times", "3:28"], ["Dissect Yourself", "4:47"], ["Here We Go", "0:55"], ["Do You Copy?", "3:49"], ["Under A Magnifying Glass", "3:32"], ["Deceiver", "3:37"], ["But I'm Not...", "1:10"], ["I Guess That's It", "4:14"], ["Dangerous By Design", "4:43"], ["Obituary Cover Girl (Part 2)", "4:45"], ["S Vs. S", "4:31"], ["Everybody's Talking", "17:52"]],
  },
  {
    artist: "Sleepaway",
    album: "Sleepaway",
    year: 2006,
    label: "No Milk Records",
    credit: "Design, Artwork",
    file: "s02-cover-05-sleepaway-512x512-v1.jpg",
    tracks: [["Nice Shoes, Hollywood!", ""], ["Time, Traffic, And Weather", ""], ["Best Unspoken", ""], ["From My Bed To Yours", ""], ["Who Needs The Radio When You've Got Me?", ""], ["What Are You Gonna Say When I Call You?", ""], ["Understand", ""], ["If I Try", ""], ["Something Of A Saturday", ""], ["Sorry I Never Bought You A Car Or Took You To Vegas", ""]],
  },
  {
    artist: "Facing New York",
    album: "Facing New York",
    year: 2006,
    label: "Five One, Inc.",
    credit: "Design [Additional Design]",
    file: "s02-cover-06-facing-new-york-512x512-v1.jpg",
    tracks: [["We Are", "4:00"], ["Javelina", "3:16"], ["Cutting My Hair", "4:25"], ["Full Turn", "5:20"], ["Apple Sugar Cider", "5:58"], ["Flagstaff", "4:55"], ["Tip Of The Iceberg", "3:43"], ["Styrofoam Walls", "4:22"], ["Fly On The Wall", "6:51"], ["Butterfly Clock", "6:09"]],
  },
  {
    artist: "The Bank Robbers",
    album: "Tomorrow Belongs To Me",
    year: 2006,
    label: "No Milk Records",
    credit: "Layout, Design",
    file: "s02-cover-07-tomorrow-belongs-to-me-512x512-v1.jpg",
    tracks: [["I'll See You In Another Life", "1:04"], ["Defending The Kingdom", "3:37"], ["Making Promises", "3:28"], ["I Can Make You Disappear", "3:43"], ["Believe Everything", "3:03"], ["Spirit of the Stairway", "3:53"], ["The Sound Of The World", "3:02"], ["The Truth Is Rarely Pure, and Never Simple", "4:16"], ["Facing Our Nightmare", "4:22"], ["Before The Words Are Spoken", "3:25"], ["Here's Your Song You've Always Wanted", "6:56"]],
  },
  {
    artist: "Baumer",
    album: "Come On, Feel It",
    year: 2005,
    label: "Astro Magnetics",
    credit: "Art Direction",
    file: "s02-cover-08-come-on-feel-it-512x512-v1.jpg",
    tracks: [["How The West 1", "4:08"], ["Turn Up The Good", "2:53"], ["Come On, Feel It", "2:52"], ["Denoument", "3:40"], ["Take What's Mine", "3:05"], ["Baumer Vs. The Red Baron", "0:27"], ["Do The Choo Choo", "3:54"], ["All In", "3:03"], ["Perfect Day", "3:17"], ["Boss Level", "0:30"], ["Not Done With You Yet", "2:39"], ["Exceptional Affair", "4:24"]],
  },
  {
    artist: "Socratic",
    album: "Lunch For The Sky",
    year: 2005,
    label: "Drive-Thru Records",
    credit: "Design",
    file: "s02-cover-09-lunch-for-the-sky-512x512-v1.jpg",
    tracks: [["Theme From Your Mother's Garden", "2:06"], ["Alexandria As Our Lens", "3:57"], ["Tear A Gash", "4:57"], ["I Don't Wear A Coat", "3:20"], ["The Dense Indents", "4:35"], ["She's The Type Of Girl", "4:37"], ["I Am The Doctor", "3:15"], ["Too Late Too Soon", "5:13"], ["U And Left Turns", "4:27"], ["Lunch For The Sky", "3:20"], ["We Burn Houses", "3:28"], ["Spots I've Been And Go", "6:35"], ["B To E", "3:24"], ["Spending Galore", "4:46"], ["In The Studio With Socratic", "9:12"]],
  },
  {
    artist: "Mommy And Daddy",
    album: "Duel At Dawn",
    year: 2005,
    label: "Kanine Records",
    credit: "Design [Additional]",
    file: "s02-cover-10-duel-at-dawn-512x512-v1.jpg",
    tracks: [["Pretty Loser", "2:34"], ["Good Deal", "3:08"], ["Cops", "3:05"], ["Way West Way", "4:50"], ["Lost The Plot", "3:14"], ["Top Down", "2:41"], ["The Streets Have Come Alive", "3:04"], ["Franconia Road", "2:31"], ["Already Warm", "2:53"], ["Full", "2:28"], ["So Far, So Good", "5:18"], ["(silence)", "0:22"], ["Untitled", "3:31"]],
  },
  {
    artist: "Tourmaline",
    album: "Strange Distress Calls",
    year: 2005,
    label: "No Milk Records",
    credit: "Design",
    file: "s02-cover-11-strange-distress-calls-512x512-v1.jpg",
    tracks: [["Earthquakes And Astronauts", ""], ["One Chance", ""], ["Blank", ""], ["Horoscopes", ""], ["First Time", ""], ["Waiting For A Heart Attack", ""], ["Autumn", ""], ["Grey Skies", ""], ["Mary Wanna Marry Me?", ""], ["Belle (Margot And Mitchell)", ""], ["April O'Neil", ""]],
  },
  {
    artist: "The Sideways",
    album: "As Explained Through Science Fiction",
    year: 2004,
    label: "Self-released",
    credit: "Layout, Design",
    file: "s02-cover-12-as-explained-through-science-fiction-512x512-v1.jpg",
    tracks: [["Across The Miles", "7:43"], ["Looking Through Your Eyes", "8:03"], ["The Reason", "7:17"], ["Into The Oz", "8:04"], ["A Medieval View Of The Universe", "22:35"], ["(no audio)", "3:10"], ["(Hidden Track)", "11:15"]],
  },
  {
    artist: "The Bank Robbers",
    album: "The Pattern Reversed",
    year: 2003,
    label: "No Milk Records",
    credit: "Layout, Design",
    file: "s02-cover-13-the-pattern-reversed-512x512-v1.jpg",
    tracks: [["The Pattern Reversed", ""], ["A Chance Worth Taking", ""], ["Losing, More Than Just An Hour", ""], ["The Rest Of Your Life Starts Here", ""], ["Let The Chips Fall", ""], ["Your Best Kept Secret", ""], ["Every Time We Say Goodbye", ""], ["Bethany Beach", ""], ["All Is Not Fair In Love And War", ""], ["The Definition Of Beauty", ""]],
  },
  {
    artist: "Last Perfect Thing",
    album: "Too Much Of Anything",
    year: 2003,
    label: "We Make Records",
    credit: "Design, Layout",
    file: "s02-cover-14-too-much-of-anything-512x512-v1.jpg",
    tracks: [["Charles", "3:23"], ["Side On", "5:11"], ["Wait", "3:54"], ["From Her", "5:02"]],
  },
  {
    artist: "Socratic",
    album: "It's Getting Late",
    year: 2002,
    label: "No Milk Records",
    credit: "Layout [Direction]",
    file: "s02-cover-15-it-s-getting-late-512x512-v1.jpg",
    tracks: [["Decay", ""], ["Sleepless Nights", ""], ["Troma", ""], ["Switzerland", ""], ["Break Out The Violins", ""], ["Dead For Days", ""]],
  },
  {
    artist: "The Bank Robbers",
    album: "Life Is But A Dream.",
    year: 2002,
    label: "No Milk Records",
    credit: "Layout, Design",
    file: "s02-cover-16-life-is-but-a-dream-512x512-v1.jpg",
    tracks: [["In Like A Lyon, Out Like A Lamb", "3:17"], ["Crossing Hulses", "4:54"], ["All Is Not Fair In Love And War", "3:49"], ["Jaime", "2:19"], ["Taking Away The One True Thing", "4:01"], ["Sunday Night", "3:36"], ["I Want You To Know", "2:09"], ["Nothing Left To Say", "3:36"]],
  },
];
