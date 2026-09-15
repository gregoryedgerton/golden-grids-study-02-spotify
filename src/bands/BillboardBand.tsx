import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { useViewport } from "../lib/viewport";
import { placeholderImage } from "../lib/placeholder";
import { Band } from "./Band";

const art = placeholderImage("KEY ART", 1200, 1200, 340, { x: 0.5, y: 0.4 });

/**
 * Band 2 — the peer pair, and the single box.
 *
 * 1–2 is the only range starting at 1 with no hierarchy: positions 1 and 2
 * are both value 1, so the band is two equal squares. The FIRST child sits on the
 * `placement` side. `clockwise` does nothing until a third square exists.
 *
 * 1–1 is the `single` render model: one full-bleed box, and every child
 * after the first is IGNORED. So the collapse at 390 cannot just drop `to`;
 * the copy has to physically move into the art's box, as an overlay on a
 * scrim. Lever: collapse to a single box and merge.
 */
export function BillboardBand() {
  const single = useViewport() === "mobile";
  return (
    <Band
      id="billboard"
      title="Band 2 — Billboard (peer pair → single)"
      lesson="1–2 is the only range from 1 with no hierarchy: two equal squares, first child on the placement side, clockwise a no-op. 1–1 is single: one box, every later child ignored — so the copy moves into the art box."
      note={`from=1 to=${single ? 1 : 2} · placement="right" (first child on the right) · ${single ? "single: child 2 ignored, copy overlaid on child 1" : "2:1, no dominant box"} · lever: collapse + merge`}
    >
      <GoldenGrid from={1} to={single ? 1 : 2} placement="right">
        <GoldenBox>
          <figure className="media">
            <img src={art.src} alt="Placeholder key art" style={{ objectPosition: art.subject }} />
            {single && (
              <div className="overlay">
                <h3>[TITLE]</h3>
                <p>[One-line standfirst, 12 words.]</p>
                <p><button type="button" className="btn">[Play]</button></p>
              </div>
            )}
            <figcaption className="media__tag">child 1 · art{single ? " + overlaid copy" : ""}</figcaption>
          </figure>
        </GoldenBox>
        <GoldenBox>
          {/* Ignored at 1–1: `single` takes one child. */}
          <div className="copy copy--center">
            <span className="chip">child 2 · copy</span>
            <h3>[TITLE]</h3>
            <p>[One-line standfirst, 12 words.]</p>
            <p><button type="button" className="btn">[Play]</button></p>
          </div>
        </GoldenBox>
      </GoldenGrid>
    </Band>
  );
}
