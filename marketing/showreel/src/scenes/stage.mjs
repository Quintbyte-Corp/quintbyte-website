/**
 * Geometry of the isometric ecosystem stage, shared by the orbit (which morphs into it)
 * and the ecosystem scene. Mirrors the site's visual: a 1.25:1 stage, plates 42% wide,
 * glow ring 62% wide, floor grid 96% wide, positions as % of stage height.
 */
const WIDTH = 1150;
const HEIGHT = WIDTH / 1.25;
const TOP = 88;
const at = (pct) => TOP + (pct / 100) * HEIGHT;

export const STAGE = {
  width: WIDTH,
  height: HEIGHT,
  top: TOP,
  left: 960 - WIDTH / 2,
  // Plates, bottom → top (site: top 48%, 44.5%, 41%, 37%)
  plateY: [at(48), at(44.5), at(41), at(37)],
  plateSide: WIDTH * 0.42,
  plateCorner: WIDTH * 0.04,
  ringY: at(60),
  ringSide: WIDTH * 0.62,
  ringCorner: WIDTH * 0.05,
  floorY: at(62),
  floorSide: WIDTH * 0.96,
  floorCorner: WIDTH * 0.04,
  cardY: at(44),
  cardBottom: TOP + HEIGHT - 0.04 * HEIGHT,
  cardWidth: WIDTH * 0.3,
  u: WIDTH / 100, // 1cqw
};
