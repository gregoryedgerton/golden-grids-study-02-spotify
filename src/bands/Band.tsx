import type { ReactNode } from "react";

/**
 * A band is one small-range grid with one editorial job. Bands stack; they do
 * not nest. This wrapper adds the section landmark, a heading, the one-line
 * lesson, and a props readout — nothing else. The grid inside it is the
 * library's real API, used directly.
 *
 * `cap` limits the band's width. The grid is `width: 100%` of its parent with
 * an inline aspect-ratio, so height follows width: a 5:3 band at 1360px is
 * 816px tall, a 2:3 one is 2040px. The parent owns the width; capping it is
 * how a study keeps tall bands in check. Never re-range the grid for height.
 */
export function Band({
  id, title, lesson, note, cap, children,
}: {
  id: string;
  title: string;
  lesson?: string;
  note?: string;
  cap?: string;
  children: ReactNode;
}) {
  return (
    <section className="band" id={id} aria-labelledby={`${id}-title`}>
      <header className="band__header">
        <h2 id={`${id}-title`} className="band__title">{title}</h2>
        {lesson && <p className="band__lesson">{lesson}</p>}
        {note && <p className="band__note">{note}{cap ? ` · width capped at ${cap}` : ""}</p>}
      </header>
      <div className="band__wrap" style={cap ? { maxWidth: cap } : undefined}>
        {children}
      </div>
    </section>
  );
}
