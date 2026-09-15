/**
 * Study 02 artwork: the covers themselves, in public/assets, cropped square
 * and resampled to the tile's texture box.
 */
import { records } from "./content";

/** The tile's render box, and therefore the artwork's dimension. */
export const TEXTURE_PX = 512;

const base = import.meta.env.BASE_URL;
export const covers: string[] = records.map((r) => `${base}assets/${r.file}`);
