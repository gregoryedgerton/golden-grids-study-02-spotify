import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { useViewport } from "../lib/viewport";
import { Band } from "./Band";

/**
 * Band 4 — the editorial mirror.
 *
 * `clockwise` is the mirror prop and never changes the aspect ratio. What it
 * mirrors depends on box-count parity: with an odd count (3, 5) it swaps
 * which side the hero sits on; with an even count (4, 6) the hero stays put
 * and only the tail reverses. Three boxes here, so flipping it moves the
 * prose from right to left — a zig-zag against the band above without
 * touching range or placement. Lever: flip clockwise.
 *
 * Line-less: no outline, no colour. Boxes exist only where copy sits. The
 * prose is a different length per width: the asset spec gives a word count
 * per slot per width, because this 3:2 hero is 597px at 1440 (56rem cap) and
 * 244px at 390.
 */
const PROSE = {
  desktop: "Placeholder prose. Lorem ipsum stands in for the copy slot's word count only; the asset spec in the README says how many words this box holds at each width, and the real copy arrives against that number. Do not loosen the structure to fit copy that has not arrived. Do not call the study finished while this paragraph is still here. Ninety words is roughly this long, which is the point of writing it out rather than pasting a shorter placeholder.",
  tablet: "Placeholder prose. Lorem ipsum stands in for the copy slot's word count only; the asset spec says how many words this box holds at each width, and the real copy arrives against that number. Do not loosen the structure to fit copy that has not arrived. Sixty words is roughly this long.",
  mobile: "Placeholder prose at the word count a 244px box holds. The asset spec gives a count per width; this is the 390 one, about thirty-five words, and the copy arrives against it.",
} as const;
const WORDS = { desktop: 90, tablet: 60, mobile: 35 } as const;

export function EditorialBand() {
  const viewport = useViewport();
  const clockwise = viewport === "desktop";
  return (
    <Band
      id="editorial"
      title="Band 4 — Editorial (mirror)"
      lesson="clockwise is the mirror. With an odd box count it swaps the hero's side; with an even count only the tail reverses. Flip it to zig-zag against the band above."
      note={`from=1 to=3 · placement="top" · clockwise=${clockwise} · 3:2 at every width · hero ${clockwise ? "right" : "left"} · lever: flip clockwise`}
      cap="56rem"
    >
      <GoldenGrid from={1} to={3} placement="top" clockwise={clockwise}>
        <GoldenBox>
          <div className="copy copy--prose">
            <span className="media__tag">child 1 · body · ~{WORDS[viewport]} words at this width</span>
            <p>{PROSE[viewport]}</p>
          </div>
        </GoldenBox>
        <GoldenBox>
          <div className="copy copy--center">
            <span className="media__tag">child 2 · headline</span>
            <h3>[HEADLINE]</h3>
          </div>
        </GoldenBox>
        <GoldenBox>
          <div className="copy copy--center">
            <span className="media__tag">child 3 · standfirst</span>
            <p>[Standfirst, 18 words.]</p>
          </div>
        </GoldenBox>
      </GoldenGrid>
    </Band>
  );
}
