import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { useViewport } from "../lib/viewport";
import { useExpand, ExpandedCell } from "../lib/expand";
import { Band } from "./Band";

const items = ["Wifi", "Kitchen", "Washer", "Dryer", "Air conditioning", "Heating", "Workspace", "TV", "Parking", "Crib", "Gym", "Pool"];

/**
 * Band 6 — the skipped range. READ THIS ONE.
 *
 * A flat list gets ONE slot, not one box per item: CSS columns inside the
 * largest square. `from={3}` skips positions 1–2 and collapses them into a
 * single PLACEHOLDER — a 2×1 strip here. Its size is always F(from) × F(from−1)
 * units, smaller than the smallest visible box, so it never dominates; it is a
 * real slot with a real job (the call to action). Two things are easy to get
 * wrong: it is rendered FIRST in the DOM but filled by the LAST GoldenBox
 * child, and `from={2}` is not a shortcut for `from={1}` — it skips position
 * 1 alone and makes a 1×1 placeholder with the same rectangles, so the child
 * mapping and colours differ. Only `from={1}` has no placeholder.
 *
 * Lever: open the range. At 390 `from` drops to 1, the placeholder vanishes,
 * and the same three children fall into three visible slots — no reorder.
 *
 * The call to action in the placeholder strip expands the LIST slot, not its
 * own: a trigger and the cell it opens need not be the same box.
 */
export function AmenitiesBand() {
  const x = useExpand();
  const from = useViewport() === "mobile" ? 1 : 3;
  const to = from === 1 ? 3 : 4;
  return (
    <Band
      id="amenities"
      title="Band 6 — Amenities (skipped range)"
      lesson="A flat list gets one slot. from=3 collapses positions 1–2 into a 2×1 placeholder strip, rendered first in the DOM but filled by the LAST child. Open the range at 390 and the same children fall into place."
      note={`from=${from} to=${to} · placement="top" · clockwise=true · ${from > 1 ? "placeholder = F(3)×F(2) = 2×1 strip, last child" : "no placeholder: last child is the smallest slot"} · lever: open from`}
      cap="60rem"
    >
      <GoldenGrid from={from} to={to} placement="top" outline="1px solid var(--line)">
        <GoldenBox {...x.boxProps}>
          <div className="copy list">
            <span className="media__tag">child 1 · list in one slot</span>
            <ul>{items.map((it) => <li key={it}>[{it}]</li>)}</ul>
          </div>
          {x.expanded && (
            <ExpandedCell id={x.panelId} title="Everything the slot could not hold" onClose={x.close} closeRef={x.closeRef}>
              <div className="cell__group">
                <h4>All {items.length * 4} items</h4>
                <ul>{items.concat(items, items, items).map((it, i) => <li key={i}>[{it} {i + 1}]</li>)}</ul>
              </div>
            </ExpandedCell>
          )}
        </GoldenBox>
        <GoldenBox>
          <div className="copy copy--center">
            <span className="media__tag">child 2</span>
            <p>[0 of 12 shown]</p>
          </div>
        </GoldenBox>
        {/* LAST child → the placeholder strip when from > 1. */}
        <GoldenBox className="placeholder-slot">
          <div className="copy copy--center">
            <span className="media__tag">{from > 1 ? "child 3 · PLACEHOLDER" : "child 3 · smallest slot"}</span>
            <p><button className="btn" {...x.triggerProps}>[Show all 12]</button></p>
          </div>
        </GoldenBox>
      </GoldenGrid>
    </Band>
  );
}
