import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { useViewport } from "../lib/viewport";
import { placeholderImage } from "../lib/placeholder";
import { Band } from "./Band";

const hero = placeholderImage("HERO", 1600, 1000, 210, { x: 0.68, y: 0.42 });
const second = placeholderImage("SECOND", 900, 900, 30);

/**
 * Band 1 — the bare defaults.
 *
 * `<GoldenGrid>` with no range props is 1–4, placement "right", clockwise.
 * `placement` names where the two 1-squares START, not where the hero goes:
 * with the default the hero lands on the LEFT. The library renders the
 * placeholder first, then slots smallest to largest, so the hero is the LAST
 * element in the DOM — tab order and screen readers meet it last.
 *
 * Lever: rotate placement only. Same range, same four children; at 390 the
 * one prop that changes is placement, and 5:3 landscape becomes 3:5 portrait.
 */
export function DefaultsBand() {
  const portrait = useViewport() === "mobile";
  return (
    <Band
      id="defaults"
      title="Band 1 — Bare defaults"
      lesson="No range props means 1–4, right, clockwise. placement names where the spiral starts, so the default puts the hero on the left. The hero is the last element in the DOM."
      note={`from=1 to=4 (defaults) · placement=${portrait ? '"bottom"' : 'omitted ("right")'} · clockwise=true · hero ${portrait ? "top" : "left"} · lever: rotate placement`}
    >
      <GoldenGrid outline="1px solid var(--line)" {...(portrait ? { placement: "bottom" as const } : {})}>
        <GoldenBox>
          <figure className="media">
            <img src={hero.src} alt="Placeholder hero image" style={{ objectPosition: hero.subject }} />
            <figcaption className="media__tag">child 1 · hero (3-square)</figcaption>
          </figure>
        </GoldenBox>
        <GoldenBox>
          <figure className="media">
            <img src={second.src} alt="" />
            <figcaption className="media__tag">child 2 · 2-square</figcaption>
          </figure>
        </GoldenBox>
        <GoldenBox>
          <div className="copy copy--center"><span className="chip">child 3 · [YEAR · RUNTIME]</span></div>
        </GoldenBox>
        <GoldenBox>
          <div className="copy copy--center"><span className="chip">child 4 · [RATING]</span></div>
        </GoldenBox>
      </GoldenGrid>
    </Band>
  );
}
