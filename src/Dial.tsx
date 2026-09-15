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
 * Splits a count into bands whose boxes are landscape.
 *
 * Verified against 5.0.0 source: with n visible boxes and no placeholder,
 * `right` and `left` are landscape only when n is EVEN, `top` and `bottom`
 * only when n is ODD. So the placement is derived from the band's size
 * rather than chosen first — the old fixed list of sizes silently produced
 * portrait bands whose comment claimed otherwise.
 *
 * The last band absorbs the remainder, so no record is ever dropped. A grid
 * needs at least two boxes, so a lone record is not a band at all and the
 * caller renders it on its own.
 */
function planBands(total: number) {
  const bands: { to: number; placement: "top" | "right" | "bottom" | "left"; clockwise: boolean; take: [number, number] }[] = [];
  let cursor = 0;
  let i = 0;
  while (total - cursor >= 2) {
    const left = total - cursor;
    let n: number;
    if (left <= 7) {
      n = left;                                  // the tail, whatever it is
    } else {
      n = i % 2 === 1 ? 6 : 5;                   // alternate the parity, so the placements alternate too
      if (left - n === 1) n += 1;                // never strand a single record
    }
    const family = n % 2 === 0 ? (["right", "left"] as const) : (["bottom", "top"] as const);
    bands.push({
      to: n,
      placement: family[Math.floor(i / 2) % 2],
      clockwise: i % 2 === 0,
      take: [cursor, cursor + n],
    });
    cursor += n;
    i++;
  }
  return bands;
}

/**
 * The roles in one credit line, normalised for filtering.
 *
 * Discogs qualifies a role in brackets — "Design [Additional Design]",
 * "Layout [Direction]" — which is right for the provenance table in
 * ASSETS.md and wrong for a filter, where it splits one role into three
 * chips nobody wants to choose between. The bracket is dropped here and
 * nowhere else: the album view still prints the credit as Discogs wrote it.
 */
function rolesOf(credit: string) {
  return credit
    .split(",")
    .map((part) => part.replace(/\[[^\]]*\]/g, "").trim())
    .filter(Boolean);
}

const ALL_YEARS = Array.from(new Set(records.map((r) => r.year))).sort((a, b) => b - a);
const ALL_ROLES = Array.from(new Set(records.flatMap((r) => rolesOf(r.credit)))).sort();

function Filters({
  year, role, onYear, onRole, shown, total,
}: {
  year: number | null; role: string | null;
  onYear: (y: number | null) => void; onRole: (r: string | null) => void;
  shown: number; total: number;
}) {
  return (
    <div className="filters">
      <div className="filters__row" role="group" aria-label="Filter by year">
        <span className="filters__legend">Year</span>
        <button type="button" className="chip" aria-pressed={year === null} onClick={() => onYear(null)}>All</button>
        {ALL_YEARS.map((y) => (
          <button key={y} type="button" className="chip" aria-pressed={year === y} onClick={() => onYear(year === y ? null : y)}>
            {y}
          </button>
        ))}
      </div>
      <div className="filters__row" role="group" aria-label="Filter by credit role">
        <span className="filters__legend">Role</span>
        <button type="button" className="chip" aria-pressed={role === null} onClick={() => onRole(null)}>All</button>
        {ALL_ROLES.map((x) => (
          <button key={x} type="button" className="chip" aria-pressed={role === x} onClick={() => onRole(role === x ? null : x)}>
            {x}
          </button>
        ))}
      </div>
      <p className="filters__count" aria-live="polite">
        {shown === total ? `All ${total} records` : `${shown} of ${total} records`}
      </p>
    </div>
  );
}

/**
 * The full view: the same records, laid out and still, with the collection
 * filterable by year and by the role Greg is credited for. It is what
 * `prefers-reduced-motion` gets instead of the dial, and the brief calls a
 * real static layout a requirement rather than polish — so this is a layout
 * in its own right, not a slower dial.
 *
 * Filtering is the reason `planBands` exists. A fixed list of band sizes only
 * works for a fixed collection; here the count changes on every click, and
 * the bands have to be re-derived so each one stays landscape and no record
 * falls off the end.
 */
function StaticFallback() {
  const [year, setYear] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const shown = useMemo(
    () => records
      .map((r, index) => ({ r, index }))
      .filter(({ r }) => (year === null || r.year === year) && (role === null || rolesOf(r.credit).includes(role))),
    [year, role],
  );
  const bands = useMemo(() => planBands(shown.length), [shown.length]);

  return (
    <div className="static wrap">
      <p className="static__note">{study.reducedNotice}</p>

      <Filters
        year={year} role={role} onYear={setYear} onRole={setRole}
        shown={shown.length} total={records.length}
      />

      {shown.length === 0 && (
        <p className="static__empty">Nothing in the collection matches that pair. Clear one of them.</p>
      )}

      {/* A grid needs two boxes, so a single match is laid out as itself. */}
      {shown.length === 1 && (
        <section className="static__band static__band--one">
          <Cover entry={shown[0]} />
        </section>
      )}

      {bands.map((b, i) => (
        <section className="static__band" key={`${b.placement}-${b.take[0]}-${i}`}>
          <GoldenGrid from={1} to={b.to} placement={b.placement} clockwise={b.clockwise}>
            {shown.slice(b.take[0], b.take[1]).map((entry) => (
              <GoldenBox key={entry.r.album + entry.r.year}>
                <Cover entry={entry} />
              </GoldenBox>
            ))}
          </GoldenGrid>
        </section>
      ))}
    </div>
  );
}

function Cover({ entry }: { entry: { r: Record_; index: number } }) {
  const { r, index } = entry;
  return (
    <figure className="cover">
      <img src={covers[index]} alt={`${r.album} by ${r.artist}`} />
      <figcaption className="cover__label">
        <b>{r.album}</b>
        <span>{r.artist} · {r.year}</span>
        {/* The normalised roles, so the caption reads in the same words as
            the filter chips. The album view keeps Discogs' exact string. */}
        <span className="cover__credit">{rolesOf(r.credit).join(", ")}</span>
      </figcaption>
    </figure>
  );
}

/**
 * The album view. Clicking a cover opens the record it belongs to and lists
 * its tracks.
 *
 * The tracks are a LIST, not a grid. They were a golden grid first — five
 * boxes descending, opener largest — and it was wrong for the reason the
 * programme's brief warns about: a track list is flat. Nothing about track
 * one outranks track four, so a Fibonacci descent asserts a hierarchy the
 * content does not have, and the two smallest boxes came out an eighth the
 * width of the largest, holding a number and nothing else. The spiral is for
 * the collection, where the distance between records is real. Inside one
 * record it is decoration.
 *
 * It is a dialog, not a band: the dial behind it is a sticky, viewport-tall
 * stage that cannot grow, so the panel covers it, takes focus, makes the
 * stage inert, and gives the page back its scroll on close.
 */
function AlbumView({ record, onClose }: { record: Record_; onClose: () => void }) {
  const backRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const index = records.indexOf(record);

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
    // Everything outside the dialog goes inert, not just the stage. Inerting
    // the stage alone left the skip link and the colophon tabbable, and one
    // Tab reached a link behind the opaque panel — which scrolls it into
    // view, and on this page the scroll position IS the dial's depth. The
    // dialog would then hand focus back to the right cover at the wrong
    // depth. `aria-modal` promises this containment; the walk delivers it.
    const panel = panelRef.current;
    const marked: HTMLElement[] = [];
    const walk = (node: HTMLElement) => {
      for (const child of Array.from(node.children)) {
        if (!(child instanceof HTMLElement) || child === panel) continue;
        // Descend through the dialog's own ancestors rather than inerting
        // them, or the dialog would inert itself.
        if (panel && child.contains(panel)) { walk(child); continue; }
        // The study tools are a deliberate layer above the dialog and stay
        // live. They are position: fixed, so focusing them cannot scroll the
        // page, which is the harm this walk exists to prevent.
        if (child.classList.contains("gg-tools")) continue;
        if (child.inert) continue;
        child.inert = true;
        marked.push(child);
      }
    };
    if (panel) walk(document.body);
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
      // Clear exactly what this dialog set, so anything inert for another
      // reason stays inert.
      marked.forEach((el) => { el.inert = false; });
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [onClose]);

  return (
    <div className="album" ref={panelRef} role="dialog" aria-modal="true" aria-label={`${record.album} by ${record.artist}`}>
      {/* Top LEFT, not top right: the study tools float fixed at top right on
          a stacking layer far above this dialog, so a control in that corner
          sits under them. The bar is sticky so the way back does not scroll
          away with a long track list. */}
      <div className="album__bar">
        <button ref={backRef} type="button" className="album__back" onClick={onClose}>
          <span className="album__back-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5 L8 12 L15 19" />
            </svg>
          </span>
          Back to the dial
        </button>
      </div>

      <header className="album__head">
        <img className="album__cover" src={covers[index]} alt="" />
        <div className="album__meta">
          <p className="album__kind">Album</p>
          <h2 className="album__title">{record.album}</h2>
          <p className="album__sub">
            {record.artist} · {record.year} · {record.label} · {record.tracks.length} songs
          </p>
          <p className="album__credit">Cover: {record.credit}</p>
        </div>
      </header>

      <ol className="tracks">
        {record.tracks.map(([title, time], i) => (
          <li className="track" key={title + i}>
            <span className="track__n">{i + 1}</span>
            <span className="track__title">{title}</span>
            <span className="track__time">{time}</span>
          </li>
        ))}
      </ol>

      <p className="album__note">
        The tracks are a list, not a grid. They were a golden grid first and it
        was wrong: a track list is flat, so a Fibonacci descent asserts a
        hierarchy the content does not have. The spiral is for the collection,
        where the distance between records is real; inside one record it would
        be decoration.
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

  // The readout is fixed to the bottom of the viewport, so it would sit on
  // top of the last thing on the page. Flag the document while the dial is
  // mounted and let the stylesheet clear that much room; the static view
  // has no bar and needs none.
  useEffect(() => {
    document.documentElement.dataset.readout = "on";
    return () => { delete document.documentElement.dataset.readout; };
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
        // culled and all sixteen textures paint on every frame. That is
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
            </div>
          );
        })}
      </div>
      {/* The readout is the ONLY place a record is named on the dial, and it
          is a page-level bar rather than a corner of the stage. Naming each
          cover in its own tile put sixteen labels on screen, each one
          counter-rotated and scaled back up, competing with the artwork the
          study is about. One bar says what is in focus; the covers carry
          themselves. It sits under the album dialog's layer on purpose: a
          live region floating over a modal is the wrong thing to read. */}
      <div className="dial__readout">
        <p ref={readoutRef} aria-live="polite">{records[0].album} — {records[0].artist}, {records[0].year}</p>
        <p className="dial__hint">{study.hint}</p>
      </div>
      {open && <AlbumView record={open} onClose={close} />}
    </div>
  );
}
