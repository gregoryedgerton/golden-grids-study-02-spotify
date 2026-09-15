import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import type { PlacementValue } from "@gifcommit/golden-grids";
import { useViewport, pick } from "../lib/viewport";
import { placeholderImage } from "../lib/placeholder";
import { useExpandGroup, ExpandedCell, ExpandableMedia, PhotoView } from "../lib/expand";
import { Band } from "./Band";

const photos = [
  placeholderImage("HERO", 1600, 1000, 190, { x: 0.65, y: 0.45 }),
  placeholderImage("TWO", 1000, 800, 20),
  placeholderImage("THREE", 800, 1000, 120),
  placeholderImage("FOUR", 600, 400, 300),
  placeholderImage("FIVE", 500, 500, 60),
];

/**
 * Band 3 — the gallery: shrink the range, rotate placement in lockstep.
 *
 * Orientation is box count × placement. With `right` or `left` the band is
 * landscape only when the box count is even; with `top` or `bottom`, only
 * when it is odd. And the hero lands one spiral step further round for every
 * box added. So to drop boxes as the viewport narrows WITHOUT the band going
 * portrait or the hero changing sides, rotate placement one step per box
 * removed: 1–5 bottom, 1–4 left, 1–3 top — hero on the right at every width.
 *
 * Declare all five children once; `to` is the cut. Extra children are ignored.
 * Gutters come from insetting the content inside its slot, not from the grid.
 *
 * Every photograph is its own control: clicking one expands that slot to the
 * whole band. See src/lib/expand.tsx — the picture is the affordance, so a
 * reader never has to hunt for a call to action.
 */
export function GalleryBand() {
  const viewport = useViewport();
  const x = useExpandGroup();
  const [to, placement] = pick<readonly [number, PlacementValue]>(viewport, {
    mobile: [3, "top"],
    tablet: [4, "left"],
    desktop: [5, "bottom"],
  });
  return (
    <Band
      id="gallery"
      title="Band 3 — Gallery (lockstep shrink)"
      lesson="Orientation is box count × placement: right/left is landscape with an even count, top/bottom with an odd one. Rotate placement one step per box removed and the hero stays right, the band stays landscape."
      note={`from=1 to=${to} · placement="${placement}" · clockwise=true · hero right · declare five, to trims · lever: shrink range + rotate`}
    >
      <GoldenGrid from={1} to={to} placement={placement}>
        {photos.map((p, i) => (
          <GoldenBox key={i} {...x.boxProps(`p${i}`)}>
            <ExpandableMedia
              group={x}
              slotKey={`p${i}`}
              src={p.src}
              alt={i === 0 ? "Placeholder hero photograph" : ""}
              objectPosition={i === 0 ? p.subject : undefined}
              caption={`child ${i + 1}`}
            />
            {x.isOpen(`p${i}`) && (
              <ExpandedCell id={x.panelId(`p${i}`)} title={`Child ${i + 1}`} onClose={x.close} closeRef={x.closeRef}>
                <PhotoView src={p.src} alt="" caption={`Child ${i + 1} · the slot that showed it is the slot showing it now`} />
              </ExpandedCell>
            )}
          </GoldenBox>
        ))}
      </GoldenGrid>
    </Band>
  );
}
