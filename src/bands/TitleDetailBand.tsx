import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import { useViewport } from "../lib/viewport";
import { placeholderImage } from "../lib/placeholder";
import { Band } from "./Band";

const art = placeholderImage("KEY ART", 1000, 1000, 280, { x: 0.5, y: 0.35 });

/**
 * Band 7 — title detail: promote a different child.
 *
 * Images survive demotion; prose does not. In this 5:3 band, capped at 60rem,
 * the 2-square is 384px at 1440 — room for a synopsis — but 308px at 820 and
 * 146px at 390, under any readable measure. So below desktop the synopsis takes the hero
 * and the art steps down to the 2-square. Same range, same placement, same
 * clockwise; only the order of the children changes. Lever: reorder.
 *
 * The children are built from data with `.map`, straight to `<GoldenBox>`.
 * That is deliberate: GoldenGrid keeps only direct GoldenBox children. A
 * wrapper component that returns one, or a fragment around several, is
 * dropped silently and the slot renders empty.
 *
 * Register: each GoldenBox carries its own surface through the `style` prop
 * — one of the two styling hooks GoldenBox exposes (`style`, `className`).
 */
const SYNOPSIS = {
  desktop: "Placeholder synopsis. Seventy words of it, so the slot is measured against a real paragraph rather than a short label. The point of this band is that this paragraph is legible in the hero at every width but not in the 2-square below desktop, which is why the order of the children changes and nothing else does. The real copy arrives against the word count in the asset spec.",
  tablet: "Placeholder synopsis at about fifty words. In the 2-square this would be unreadable at 820, so the synopsis takes the hero and the art steps down. The order of the children changes and nothing else does; the real copy arrives against the asset spec.",
  mobile: "Placeholder synopsis at about thirty words, the count a 220px hero holds. The synopsis leads, the art steps down, and nothing else about the band changes.",
} as const;
const WORDS = { desktop: 70, tablet: 50, mobile: 30 } as const;

export function TitleDetailBand() {
  const viewport = useViewport();
  const desktop = viewport === "desktop";
  const artBox = {
    key: "art",
    surface: "transparent",
    node: (
      <figure className="media">
        <img src={art.src} alt="Placeholder key art" style={{ objectPosition: art.subject }} />
        <figcaption className="media__tag">art</figcaption>
      </figure>
    ),
  };
  const synopsisBox = {
    key: "synopsis",
    surface: "rgba(127, 127, 127, 0.12)",
    node: (
      <div className="copy copy--prose">
        <span className="media__tag">synopsis · ~{WORDS[viewport]} words at this width</span>
        <p>{SYNOPSIS[viewport]}</p>
      </div>
    ),
  };
  const chips = [
    { key: "meta", surface: "rgba(127, 127, 127, 0.2)", node: <div className="copy copy--center"><span className="chip">[YEAR · 2h 04m · PG]</span></div> },
    { key: "cast", surface: "rgba(127, 127, 127, 0.28)", node: <div className="copy copy--center"><span className="chip">[Cast, 3 names]</span></div> },
  ];
  const boxes = desktop ? [artBox, synopsisBox, ...chips] : [synopsisBox, artBox, ...chips];

  return (
    <Band
      id="title"
      title="Band 7 — Title detail (reorder)"
      lesson="Images survive demotion, prose does not. Below desktop the synopsis takes the hero and the art steps down: same props, reordered children. Map data straight to GoldenBox; a wrapper or fragment is dropped silently."
      note={`from=1 to=4 · placement="left" · clockwise=false · hero right · children [${boxes.map((b) => b.key).join(", ")}] · lever: reorder`}
      cap="60rem"
    >
      <GoldenGrid from={1} to={4} placement="left" clockwise={false}>
        {boxes.map((b) => (
          <GoldenBox key={b.key} style={{ background: b.surface }}>
            {b.node}
          </GoldenBox>
        ))}
      </GoldenGrid>
    </Band>
  );
}
