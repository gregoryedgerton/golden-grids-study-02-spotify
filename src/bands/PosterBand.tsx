import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { placeholderImage } from "../lib/placeholder";
import { Band } from "./Band";

const poster = placeholderImage("POSTER", 800, 800, 350, { x: 0.5, y: 0.3 });

/**
 * Band 8 — the poster card: cap the width.
 *
 * The grid is `width: 100%` of its parent with an inline `aspect-ratio`, so
 * height follows width. A portrait 2:3 band at 1360px wide is 2040px tall.
 * The fix is never to re-range the grid; it is to cap the band's WIDTH and
 * let the grid fill that. The parent owns the width. Here the wrapper is
 * capped at 420px and left-aligned; the air to its right is part of the
 * design, not a bug. Lever: cap width. No breakpoint.
 */
export function PosterBand() {
  return (
    <Band
      id="poster"
      title="Band 8 — Poster card (cap the width)"
      lesson="Height follows width: a 2:3 band at 1360px is 2040px tall. Never re-range the grid for height; cap the parent's width and let the grid fill it."
      note='from=1 to=3 · placement="left" · clockwise=true · 2:3 portrait, hero top · lever: cap width'
      cap="420px"
    >
      <GoldenGrid from={1} to={3} placement="left" outline="2px solid var(--line)">
        <GoldenBox>
          <figure className="media">
            <img src={poster.src} alt="Placeholder poster" style={{ objectPosition: poster.subject }} />
            <figcaption className="media__tag">child 1 · poster</figcaption>
          </figure>
        </GoldenBox>
        <GoldenBox>
          <div className="copy copy--center"><h3>[TITLE]</h3></div>
        </GoldenBox>
        <GoldenBox>
          <div className="copy copy--center"><p><button type="button" className="btn">[Open]</button></p></div>
        </GoldenBox>
      </GoldenGrid>
    </Band>
  );
}
