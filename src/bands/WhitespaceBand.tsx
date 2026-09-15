import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { useViewport } from "../lib/viewport";
import { Band } from "./Band";

/**
 * Band 9 — whitespace by design.
 *
 * Children are positional. Pass fewer children than slots and the SMALLEST
 * slots stay empty; to blank a specific slot, pass an empty `<GoldenBox />`.
 * With no outline and no colour an empty slot draws nothing, so the
 * whitespace lives inside the golden rectangle instead of around it. (An
 * empty slot is still a positioned div in the DOM; with an outline it would
 * be a visible empty box.)
 *
 * Above mobile the children are [quote, blank, rating]: the quote in the
 * 5-square, a deliberate blank in the 3-square beside it, the rating in the
 * 2-square, both 1-squares empty by omission. At 390 the explicit blank is
 * dropped and the rating is promoted into the 3-square. Lever: shorten the
 * children list.
 */
export function WhitespaceBand() {
  const blank = useViewport() !== "mobile";
  return (
    <Band
      id="whitespace"
      title="Band 9 — Whitespace by design"
      lesson="Children are positional: too few leaves the smallest slots empty; an explicit empty GoldenBox blanks a specific one. With no outline or colour, empty slots draw nothing."
      note={`from=1 to=5 · placement="bottom" · clockwise=false · hero left · children [quote${blank ? ", <GoldenBox />" : ""}, rating] · lever: shorten children`}
      cap="60rem"
    >
      <GoldenGrid from={1} to={5} placement="bottom" clockwise={false}>
        <GoldenBox>
          <div className="copy copy--quote copy--center">
            <span className="media__tag">child 1 · pull quote · ~40 words</span>
            <p>“[A featured review, about forty words long, sitting alone in the largest box with nothing competing for it. The review that decides a booking, given the room it needs.]”</p>
          </div>
        </GoldenBox>
        {blank && <GoldenBox />}
        <GoldenBox>
          <div className="copy stat">
            <span className="stat__n">4.9</span>
            <span className="stat__label">{blank ? "child 3" : "child 2"} · [rating]</span>
          </div>
        </GoldenBox>
      </GoldenGrid>
    </Band>
  );
}
