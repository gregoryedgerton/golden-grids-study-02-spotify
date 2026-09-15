import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoldenGrid,
  GoldenBox,
  generateGoldenGridLayout,
  spiralCamera,
  spiralWindow,
  tileOnScreen,
  toCssTileTransform,
  toCssContentTransform,
  trailToRotateDeg,
  focusIndexAt,
} from "@gifcommit/golden-grids";
import type { SpiralTrail } from "@gifcommit/golden-grids";
import { useReducedMotion } from "./lib/motion";
import { records, study } from "./content";
import { covers, TEXTURE_PX } from "./assets";
import "./dial.css";

/**
 * The dial. One deep layout driven by `spiralCamera`, bound to scroll: the
 * page is a scroll body one viewport tall per record, with a sticky stage
 * inside it, and the camera's depth is the distance travelled through that
 * body. Every record passes through the focus on the way past.
 *
 * The focused record fills the stage's shorter side and is pinned flush
 * into the top-left corner, so the whole of the leftover room is on one axis
 * and the rest of the collection grows into it. `trailToRotateDeg` solves
 * which side that is for the count being laid out — the direction cycles
 * with the square count as well as the rotation, so it has to be solved
 * rather than fixed.
 *
 * The two decisions the brief asks to make early, both made here and both
 * stated on the page:
 *
 *   1. **The covers turn with their tiles.** Album art reads as an object
 *      rather than a window, so rotation costs it nothing and the turning
 *      version is the one that travels. Only the label counter-rotates, via
 *      `toCssContentTransform`; set `counterRotate: false` there to see the
 *      conservative version.
 *   2. **The artwork is sourced at the tile's texture box.** Each tile
 *      renders into a fixed 512px box and the camera scales that box;
 *      full-resolution art costs exactly the smoothness that makes the dial
 *      worth showing. `TEXTURE_PX` is the single source of that number, and
 *      the asset spec quotes it.
 *
 * Nothing here wraps the library. `spiralCamera`, `spiralWindow`,
 * `tileOnScreen`, `toCssTileTransform`, `toCssContentTransform` and
 * `trailToRotateDeg` are called directly, in the order the library's own
 * `docs/spiral-dial.md` prescribes.
 */
const COUNT = records.length;

function fibonacci(n: number): number[] {
  const seq = [1, 1];
  while (seq.length < n) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  return seq.slice(0, n);
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function Dial() {
  const reduced = useReducedMotion();
  return reduced ? <StaticFallback /> : <ScrollDial />;
}

/**
 * The reduced-motion fallback: the same records, laid out and still. A real
 * layout, not a slower dial — the brief calls that a requirement, and the
 * page says which one it is showing.
 */
function StaticFallback() {
  const bands = [
    { from: 1, to: 6, placement: "bottom" as const, take: [0, 6] },
    { from: 1, to: 6, placement: "right" as const, take: [6, 12] },
    { from: 1, to: 5, placement: "top" as const, take: [12, 17] },
    { from: 1, to: 4, placement: "left" as const, take: [17, 21] },
  ];
  return (
    <div className="static wrap">
      <p className="static__note">{study.reducedNotice}</p>
      {bands.map((b, i) => (
        <section className="static__band" key={i}>
          <GoldenGrid from={b.from} to={b.to} placement={b.placement} clockwise={i % 2 === 0}>
            {records.slice(b.take[0], b.take[1]).map((r, j) => {
              const k = b.take[0] + j;
              return (
                <GoldenBox key={r.album}>
                  <figure className="cover">
                    <img src={covers[k]} alt={`${r.album} by ${r.artist}`} />
                    <figcaption className="cover__label">
                      <b>{r.album}</b>
                      <span>{r.artist} · {r.year}</span>
                    </figcaption>
                  </figure>
                </GoldenBox>
              );
            })}
          </GoldenGrid>
        </section>
      ))}
    </div>
  );
}

function ScrollDial() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const readoutRef = useRef<HTMLParagraphElement>(null);
  const [trail, setTrail] = useState<SpiralTrail>("bottom");

  // Rebuilt only when the open side of the stage changes. The trail is
  // SOLVED for the count being laid out: which side the spiral grows into
  // cycles with the square count as well as the rotation.
  const layout = useMemo(
    () => generateGoldenGridLayout(fibonacci(COUNT), true, trailToRotateDeg(trail, true, COUNT)),
    [trail]
  );

  useEffect(() => {
    let raf = 0;
    const paint = () => {
      const stage = stageRef.current;
      const body = bodyRef.current;
      if (!stage || !body) return;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const step = stage.offsetHeight || height;
      if (!width || !height) return;

      // Which side is open is the stage's shape, measured, never assumed.
      const open: SpiralTrail = width >= height ? "right" : "bottom";
      if (open !== trail) { setTrail(open); return; }

      const top = body.getBoundingClientRect().top + window.scrollY;
      const depth = clamp((window.scrollY - top) / step, 0, COUNT - 1);
      // fillRatio 1 fills the stage's SHORTER side with the focused record and
      // the anchor pins it flush into the top-left corner, so every pixel of
      // leftover room lies on one axis — the long one — and the trail grows
      // into it. Centring the focus at 0.62 instead leaves a margin on all
      // four sides of a wide stage and the spiral floats in it.
      const frame = spiralCamera(layout, depth, width, height, { fillRatio: 1 });
      const focusHalf = Math.min(width, height) / 2;
      const anchor = { x: focusHalf, y: focusHalf };

      layout.squares.forEach((square, k) => {
        const tile = tilesRef.current[k];
        if (!tile) return;
        // The fading window, not a solid tail. A solid tail keeps every
        // outward record at full presence, and because outward squares grow
        // by φ each step they always cover the stage — so nothing is ever
        // culled and all twenty-one textures paint on every frame. That is
        // the mid-range-phone risk the brief names. The fade drops the far
        // tail instead, and tileOnScreen culls whatever has left the stage.
        const { opacity, hidden } = spiralWindow(k, depth, COUNT);
        const onScreen = tileOnScreen(frame, square, width, height, { anchor });
        // The deepest records are sub-pixel at shallow depths; painting a
        // 512px texture into two pixels helps nobody.
        const tooSmall = square.size * frame.scale < 2;
        tile.style.transform = toCssTileTransform(frame, square, width, height, { anchor, texturePx: TEXTURE_PX });
        tile.style.opacity = String(opacity);
        tile.style.visibility = hidden || !onScreen || tooSmall ? "hidden" : "visible";
        // The label orbits with its tile but never spins, and is scaled back
        // up by the tile's net scale so it stays a readable size at any depth.
        const label = tile.lastElementChild as HTMLElement;
        label.style.transform = toCssContentTransform(frame, { cover: false });
        const net = (frame.scale * square.size) / TEXTURE_PX;
        label.style.setProperty("--inv", String(clamp(1 / Math.max(net, 0.01), 0.5, 3)));
        label.style.opacity = net < 0.25 ? "0" : "1";
      });

      if (readoutRef.current) {
        const focus = clamp(Math.round(focusIndexAt(depth, COUNT)), 0, COUNT - 1);
        // The dial travels newest first, so the focused square counts back
        // from the end of the collection.
        const r = records[COUNT - 1 - focus];
        readoutRef.current.textContent = `${r.album} — ${r.artist}, ${r.year}`;
      }
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); };
    schedule();
    const observer = new ResizeObserver(schedule);
    if (stageRef.current) observer.observe(stageRef.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [layout, trail]);

  return (
    <div className="dial" ref={bodyRef} style={{ height: `${COUNT * 100}svh` }}>
      <div className="dial__stage" ref={stageRef} role="group" aria-label={`Spiral dial of ${COUNT} records`}>
        {layout.squares.map((_, k) => {
          // Square 0 is the eye of the spiral — the oldest record — and the
          // last square is the newest, which depth 0 focuses.
          const r = records[COUNT - 1 - k];
          return (
            <div
              key={k}
              className="dial__tile"
              ref={(el) => { tilesRef.current[k] = el; }}
              style={{ width: TEXTURE_PX, height: TEXTURE_PX, visibility: "hidden" }}
            >
              <img className="dial__art" src={covers[COUNT - 1 - k]} alt="" draggable={false} />
              <div className="dial__label" aria-hidden="true">
                <span className="cover__label">
                  <b>{r.album}</b>
                  <span>{r.artist} · {r.year}</span>
                </span>
              </div>
            </div>
          );
        })}
        <div className="dial__readout">
          <p ref={readoutRef} aria-live="polite">{records[0].album} — {records[0].artist}, {records[0].year}</p>
          <p className="dial__hint">{study.hint}</p>
        </div>
      </div>
    </div>
  );
}
