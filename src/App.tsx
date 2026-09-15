import { Tools } from "./lib/tools";
import { Dial } from "./Dial";
import { study } from "./content";

/**
 * Study 02 — a collection of records on the spiral dial.
 *
 * Reference: an artist page on spotify.com (captured 2026-09-15 at 390 / 820
 * / 1440; see captures/). Unlike Study 01 this is NOT a rebuild: the
 * reference is a wall of equal squares, which is a good index and a bad
 * argument for a spiral. The study takes the same content — a collection of
 * square covers — and shows what the grid cannot do with it.
 *
 * There are no bands. The page is one deep layout driven by the spiral
 * camera, bound to scroll, with a static layout under reduced motion.
 */
export function App() {
  return (
    <>
      <Tools />
      <a className="skip" href="#dial">Skip to the dial</a>

      <header className="masthead wrap">
        <p className="masthead__kicker">{study.kicker}</p>
        <h1>{study.title}</h1>
        <p>{study.framing}</p>
        <p className="masthead__claim">{study.claim}</p>
      </header>

      <main id="dial">
        <Dial />
      </main>

      <section className="section wrap">
        <h2>How it is built</h2>
        <p>{study.dialNote}</p>
        <p>
          Sixteen covers, one square each, laid out by{" "}
          <code>generateGoldenGridLayout</code> and moved through by{" "}
          <code>spiralCamera</code>. The page is a scroll body one viewport tall
          per record; the camera's depth is the distance travelled through it.
          Nothing here wraps the library.
        </p>
      </section>

      <footer className="colophon wrap">
        <p>
          An unaffiliated layout study of{" "}
          <a href={study.reference.url}>{study.reference.label}</a>. Nothing from
          Spotify is reproduced. The sixteen records are ones whose covers Greg
          Edgerton designed; releases, credits and track listings come from{" "}
          <a href={study.source.url}>{study.source.label}</a>, and the recordings
          belong to their artists and labels. Built with{" "}
          <a href="https://github.com/gregoryedgerton/golden-grids">Golden Grids</a> ·{" "}
          <a href="https://www.npmjs.com/package/@gifcommit/golden-grids">npm</a> ·{" "}
          <a href="https://gregoryedgerton.github.io/golden-grids/">generator</a> ·{" "}
          <a href="https://github.com/gregoryedgerton/golden-grids-study-02-spotify">source</a>.
        </p>
      </footer>
    </>
  );
}
