import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { useViewport } from "../lib/viewport";
import { placeholderImage } from "../lib/placeholder";
import { Band } from "./Band";

const poster = placeholderImage("POSTER FRAME", 1280, 720, 200, { x: 0.5, y: 0.5 });
const still = placeholderImage("STILL", 900, 900, 90);

/**
 * Band 10 — the trailer: drop the band.
 *
 * Dropping is a band-level decision, never a box-level one. You cannot remove
 * one slot from a spiral — the rectangle always fills, and a missing child
 * renders as an empty positioned box. When a band's job does not survive the
 * viewport (an autoplaying loop and 73px controls on a phone), the unit of
 * removal is the whole editorial job. Below 640 the section keeps its heading
 * and note and renders a visible stub in place of the grid. Lever: drop.
 *
 * Video fills its slot like an image. Under `prefers-reduced-motion` the
 * stylesheet hides the video and shows the poster instead — a static
 * fallback, not a slower loop.
 */
export function TrailerBand() {
  const dropped = useViewport() === "mobile";
  return (
    <Band
      id="trailer"
      title="Band 10 — Trailer (drop the band)"
      lesson="Dropping is a band-level decision: a missing child leaves an empty box, so the unit of removal is the whole editorial job. Video fills its slot like an image; reduced motion shows the poster."
      note={dropped ? "dropped below 640px by design · the heading and this stub remain · lever: drop" : 'from=1 to=4 · placement="left" · clockwise=true · hero right · <video> with object-fit: cover · lever: drop'}
    >
      {dropped ? (
        <p className="stub">[Trailer band dropped at this width. A study says so here, in one line, rather than rendering a 73px loop.]</p>
      ) : (
        <GoldenGrid from={1} to={4} placement="left" outline="1px solid var(--line)">
          <GoldenBox>
            <figure className="media">
              <video autoPlay muted loop playsInline poster={poster.src} aria-label="Placeholder trailer loop">
                <source src={`${import.meta.env.BASE_URL}loop.webm`} type="video/webm" />
              </video>
              <img className="media__poster" src={poster.src} alt="Placeholder poster frame" />
              <figcaption className="media__tag">child 1 · video · reduced motion shows poster</figcaption>
            </figure>
          </GoldenBox>
          <GoldenBox>
            <figure className="media">
              <img src={still.src} alt="" />
              <figcaption className="media__tag">child 2 · still</figcaption>
            </figure>
          </GoldenBox>
          <GoldenBox>
            <div className="copy copy--center"><span className="chip">child 3 · [DURATION]</span></div>
          </GoldenBox>
          <GoldenBox>
            <div className="copy copy--center"><p><button type="button" className="btn">[Play]</button></p></div>
          </GoldenBox>
        </GoldenGrid>
      )}
    </Band>
  );
}
