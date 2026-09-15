import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { Band } from "./Band";

const stats = [
  { n: "4.92", label: "[rating]" },
  { n: "318", label: "[reviews]" },
  { n: "7", label: "[years hosting]" },
  { n: "★", label: "[badge]" },
];

/**
 * Band 5 — the bento: no breakpoint at all.
 *
 * Not every band needs a lever. When every slot holds a number or a glyph the
 * grid is already fluid: the type is sized in container-query units against
 * the slot, so range, placement and child order never change. This file does
 * not call useViewport.
 *
 * `color` is a hue walk from a base hex: the SMALLEST box sits nearest the
 * base colour and the hero furthest — 180° away, plus 15° per box past four —
 * with a total lightness spread of 3% × box count centred on the base (±6%
 * over four boxes, so 4% per step). Pick a base light enough that dark text
 * clears AA on every step; the text colour is set explicitly, not inherited.
 */
export function BentoBand() {
  return (
    <Band
      id="bento"
      title="Band 5 — Bento (no breakpoint)"
      lesson="Not every band needs a breakpoint: numbers scale with container units. color walks the hue 180° from the smallest box to the hero, lightness spread 3% × box count, ±6% over four boxes."
      note='from=1 to=4 · placement="right" · clockwise=false · color="#e8dcc0" · hero left · no useViewport call · lever: none'
      cap="60rem"
    >
      <GoldenGrid from={1} to={4} placement="right" clockwise={false} color="#e8dcc0">
        {stats.map((s, i) => (
          <GoldenBox key={i}>
            <div className="copy stat stat--on-fill">
              <span className="stat__n">{s.n}</span>
              <span className="stat__label">child {i + 1} · {s.label}</span>
            </div>
          </GoldenBox>
        ))}
      </GoldenGrid>
    </Band>
  );
}
