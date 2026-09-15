import { useEffect, useState } from "react";

/**
 * `prefers-reduced-motion`, as state. Lives beside the viewport hook so a
 * band never carries a media query of its own. A band that animates must
 * render a static layout when this is true — not a slower animation.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
