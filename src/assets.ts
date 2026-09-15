/**
 * Study 02 artwork. Until the covers in ASSETS.md are delivered, each record
 * gets a generated stand-in at the tile's texture size — obviously a
 * placeholder, and exactly the dimension the real artwork must be.
 */
import { coverImage } from "./lib/placeholder";
import { records } from "./content";

/** The tile's render box, and therefore the artwork's dimension. */
export const TEXTURE_PX = 512;

export const covers: string[] = records.map((r, i) => coverImage(i + 1, r.hue, TEXTURE_PX));
