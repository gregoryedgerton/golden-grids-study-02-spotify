import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import type { Record_ } from "./content";
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
 *   1. **The covers stay level.** Both were built and the level version won.
 *      Turning art is the more dramatic still, but in motion a cover that
 *      spins reads as a spinning picture rather than as a record you are
 *      moving past, and every cover turning at once is a lot of rotation on
 *      screen at once. `toCssContentTransform(frame)` on the artwork does it:
 *      counter-rotation about the tile's centre plus the |cos| + |sin| cover
 *      swell that keeps a rotated square filling its clip box — exactly 1 at
 *      rest, √2 at worst. The same call without the swell holds the label
 *      level. `{ counterRotate: false }` is the turning version.
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

/**
 * The album view. Clicking a cover opens the record it belongs to, and the
 * track list is laid out as a GoldenGrid of its own — a second, nested use of
 * the library inside the thing the dial was showing. The tracks descend the
 * way the records do, so the same proportion carries the same meaning at both
 * scales: the opener takes the largest box.
 *
 * It is a dialog, not a band: the dial behind it is a sticky, viewport-tall
 * stage that cannot grow, so the panel covers it, takes focus, traps nothing
 * but makes the stage inert, and gives the page back its scroll on close.
 */
function AlbumView({ record, onClose }: { record: Record_; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const index = records.indexOf(record);
  // Parity, from the library's own geometry: right/left give a landscape band
  // only when the box count is even, top/bottom only when it is odd. The
  // dialog is wider than it is tall, so the placement follows the track count
  // rather than being fixed — five tracks would be a 5:8 portrait under
  // `right`, and the opener would fall off the bottom of the panel.
  const placement = record.tracks.length % 2 === 0 ? "right" : "bottom";

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const stage = document.querySelector<HTMLElement>(".dial__stage");
    if (stage) stage.inert = true;
    // The dial's depth is the page's scroll position, so leaving the page
    // scrollable would spin the stage behind the panel.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      if (stage) stage.inert = false;
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [onClose]);

  return (
    <div className="album" role="dialog" aria-modal="true" aria-label={`${record.album} by ${record.artist}`}>
      <header className="album__head">
        <img className="album__cover" src={covers[index]} alt="" />
        <div className="album__meta">
          <p className="album__kind">Album</p>
          <h2 className="album__title">{record.album}</h2>
          <p className="album__sub">
            {record.artist} · {record.year} · {record.tracks.length} songs
          </p>
        </div>
        <button ref={closeRef} type="button" className="album__close" onClick={onClose} aria-label="Close">×</button>
      </header>

      <div className="album__grid">
        <GoldenGrid from={1} to={record.tracks.length} placement={placement} clockwise={false}>
          {record.tracks.map(([title, time], i) => (
            <GoldenBox key={title}>
              <div className="track">
                <span className="track__n">{i + 1}</span>
                <span className="track__title">{title}</span>
                <span className="track__time">{time}</span>
              </div>
            </GoldenBox>
          ))}
        </GoldenGrid>
      </div>

      <p className="album__note">
        The track list is a second golden grid, nested inside the record the
        dial was showing. {record.tracks.length} tracks, largest box first — the
        same descent the collection uses, one scale down. Its{" "}
        <code>placement</code> follows the track count, because right and left
        are landscape only at an even count and top and bottom only at an odd
        one.
      </p>
    </div>
  );
}

function ScrollDial() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const readoutRef = useRef<HTMLParagraphElement>(null);
  const [trail, setTrail] = useState<SpiralTrail>("bottom");
  const [open, setOpen] = useState<Record_ | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

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
        // The artwork orbits with its tile but never spins: counter-rotation
        // about the tile's own centre, with the cover swell that keeps the
        // rotated square filling its clip box. The tile still travels the
        // spiral; only the picture inside it stays level.
        const art = tile.firstElementChild as HTMLElement;
        art.style.transform = toCssContentTransform(frame);
        // The label is held level the same way, without the swell, and is
        // scaled back up by the tile's net scale so it stays a readable size.
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
              {/* The cover is the control: every record on the dial opens. */}
              <button
                type="button"
                className="dial__open"
                onClick={(e) => { openerRef.current = e.currentTarget; setOpen(r); }}
              >
                <span className="visually-hidden">Open {r.album} by {r.artist}</span>
              </button>
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
      {open && <AlbumView record={open} onClose={close} />}
    </div>
  );
}
