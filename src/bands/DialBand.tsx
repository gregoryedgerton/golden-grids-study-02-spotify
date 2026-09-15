import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "../lib/motion";
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
import { coverImage } from "../lib/placeholder";
import { Band } from "./Band";
import "./DialBand.css";

/**
 * The spiral dial — the library's other capability, bound to scroll.
 *
 * This band is a scroll body COUNT viewports tall with a sticky stage inside
 * it. Scrolling through the body moves the camera one square deeper per
 * viewport of travel. Nothing here is a wrapper over the library: every
 * number on screen comes from `spiralCamera` and the per-tile transforms,
 * called directly, in the order the library docs prescribe.
 *
 * Decisions a study has to make, shown here with one answer each:
 *   - Covers TURN with their tiles; only the label counter-rotates. (Study 02
 *     recommends trying both. `toCssContentTransform(frame)` on the art is
 *     the other answer.)
 *   - Each tile renders into a fixed 512px texture box and the source art is
 *     512px square, so the net raster scale stays near 1 at focus — at or
 *     below 1 while the stage's smaller side is under ~826px (0.62 × 826).
 *     A study that must hold that on a large stage sizes the texture from the
 *     measured stage instead.
 *   - The trail grows into the open side of the stage: right when landscape,
 *     below when portrait. Solved per count with `trailToRotateDeg`.
 *   - `prefers-reduced-motion` swaps in a flat GoldenGrid of the first five
 *     covers. A static layout, not a slower dial. Requirement, not polish.
 */
const COUNT = 13;
const TEXTURE_PX = 512;

function fibonacci(n: number): number[] {
  const seq = [1, 1];
  while (seq.length < n) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  return seq.slice(0, n);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
}

const covers = Array.from({ length: COUNT }, (_, i) => coverImage(i + 1, (i * 47 + 20) % 360, TEXTURE_PX));

export function DialBand() {
  const reduced = useReducedMotion();

  return (
    <Band
      id="dial"
      title="Band 11 — Spiral dial"
      note={reduced
        ? "prefers-reduced-motion: static GoldenGrid of the first five covers, 1–5 top (8:5)"
        : `${COUNT} squares · scroll-bound depth · covers turn, labels stay upright`}
    >
      {reduced ? <StaticFallback /> : <Dial />}
    </Band>
  );
}

/** The static answer to reduced motion: the first five covers as a flat grid.
 *  Five boxes with `top` is 8:5 landscape (odd count → top/bottom); `right`
 *  would be 5:8 portrait and over 2000px tall at 1440. */
function StaticFallback() {
  return (
    <GoldenGrid from={1} to={5} placement="top" outline="1px solid var(--line)">
      {covers.slice(0, 5).map((src, i) => (
        <GoldenBox key={i}>
          <figure className="media">
            <img src={src} alt="" />
            <figcaption className="media__tag">cover {i + 1}</figcaption>
          </figure>
        </GoldenBox>
      ))}
    </GoldenGrid>
  );
}

function Dial() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const [trail, setTrail] = useState<SpiralTrail>("bottom");

  // The layout is rebuilt only when the open side of the stage changes.
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
      // Camera and cull measure the stage's content box; the depth step is
      // one whole 100svh of travel, which is the stage's border box.
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const step = stage.offsetHeight || height;
      if (!width || !height) return;

      // Which side is open is the stage's shape, measured, never assumed.
      const open: SpiralTrail = width >= height ? "right" : "bottom";
      if (open !== trail) {
        setTrail(open); // the effect re-runs with the re-solved layout
        return;
      }

      const top = body.getBoundingClientRect().top + window.scrollY;
      const depth = clamp((window.scrollY - top) / step, 0, COUNT - 1);
      const frame = spiralCamera(layout, depth, width, height);

      layout.squares.forEach((square, k) => {
        const tile = tilesRef.current[k];
        if (!tile) return;
        const { opacity, hidden } = spiralWindow(k, depth, COUNT);
        const onScreen = tileOnScreen(frame, square, width, height);
        tile.style.transform = toCssTileTransform(frame, square, width, height, { texturePx: TEXTURE_PX });
        tile.style.opacity = String(opacity);
        tile.style.visibility = hidden || !onScreen ? "hidden" : "visible";
        // The label overlay counter-rotates about the tile centre so it reads
        // upright while the cover beneath it turns with the spiral. The chip
        // inside it is scaled back up by the tile's net scale so it stays a
        // readable size on a small stage, and fades on tiles too small to read.
        const label = tile.lastElementChild as HTMLElement;
        label.style.transform = toCssContentTransform(frame, { cover: false });
        const net = (frame.scale * square.size) / TEXTURE_PX;
        label.style.setProperty("--inv", String(Math.min(1 / Math.max(net, 0.01), 3)));
        label.style.opacity = net < 0.2 ? "0" : "1";
      });

      if (readoutRef.current) {
        const focus = Math.round(focusIndexAt(depth, COUNT)) + 1;
        readoutRef.current.textContent = `depth ${depth.toFixed(2)} · focus on cover ${focus}`;
      }
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
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
      <div className="dial__stage" ref={stageRef} role="group" aria-label="Spiral dial of placeholder covers">
        {layout.squares.map((_, k) => (
          <div
            key={k}
            className="dial__tile"
            ref={(el) => { tilesRef.current[k] = el; }}
            style={{ width: TEXTURE_PX, height: TEXTURE_PX, visibility: "hidden" }}
          >
            <img className="dial__art" src={covers[k]} alt="" draggable={false} />
            <div className="dial__label" aria-hidden="true">
              <span className="media__tag">cover {k + 1}</span>
            </div>
          </div>
        ))}
        <p className="dial__readout" aria-live="off">
          <span ref={readoutRef}>depth 0.00 · focus on cover {COUNT}</span>
          <span className="dial__hint"> · scroll to dial</span>
        </p>
      </div>
    </div>
  );
}
