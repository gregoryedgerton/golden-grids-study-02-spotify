import { Tools } from "./lib/tools";
import { DefaultsBand } from "./bands/DefaultsBand";
import { BillboardBand } from "./bands/BillboardBand";
import { GalleryBand } from "./bands/GalleryBand";
import { EditorialBand } from "./bands/EditorialBand";
import { BentoBand } from "./bands/BentoBand";
import { AmenitiesBand } from "./bands/AmenitiesBand";
import { TitleDetailBand } from "./bands/TitleDetailBand";
import { PosterBand } from "./bands/PosterBand";
import { WhitespaceBand } from "./bands/WhitespaceBand";
import { TrailerBand } from "./bands/TrailerBand";
import { DialBand } from "./bands/DialBand";

/**
 * A study is a short vertical stack of bands. Each band is one small-range
 * GoldenGrid with one editorial job. Nothing here nests one grid in another.
 *
 * This page is a CATALOGUE, not a design. Every band shows one pattern, one
 * responsive lever, and one thing the library does that is easy to get
 * wrong. A study author copies the bands the reference page needs and
 * deletes the rest. All content is scaffolding.
 */
export function App() {
  return (
    <>
      <Tools />
      <a className="skip" href="#content">Skip to content</a>
      <header className="masthead">
        {/* STUDY: replace with the study's name and one-line structural claim. */}
        <h1>Layout study — [REFERENCE PAGE]</h1>
        <p className="masthead__claim">[One sentence: the structural argument this study makes.]</p>
        <p className="masthead__claim">
          Template catalogue: eleven bands, each one lever and one lesson. Orientation is
          box count × placement; hero side follows the spiral; the parent owns the width.
          Delete what the study does not need.
        </p>
      </header>

      <main id="content">
        <DefaultsBand />
        <BillboardBand />
        <GalleryBand />
        <EditorialBand />
        <BentoBand />
        <AmenitiesBand />
        <TitleDetailBand />
        <PosterBand />
        <WhitespaceBand />
        <TrailerBand />
        <DialBand />
      </main>

      <footer className="colophon">
        {/* Required on every study. Keep this line. */}
        <p>
          An unaffiliated layout study of <a href="[REFERENCE URL]">[REFERENCE SITE]</a>. All imagery and
          copy are original; nothing from the reference site is reproduced. Built with{" "}
          <a href="https://github.com/gregoryedgerton/golden-grids">Golden Grids</a> ·{" "}
          <a href="https://www.npmjs.com/package/@gifcommit/golden-grids">npm</a> ·{" "}
          <a href="https://gregoryedgerton.github.io/golden-grids/">generator</a>.
        </p>
      </footer>
    </>
  );
}
