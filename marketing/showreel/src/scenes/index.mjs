/**
 * Scene registry: each scene draws itself for global time t within [from, to].
 * Overlapping windows are the transitions.
 */
import { ignite } from "./01-ignite.mjs";
import { type } from "./02-type.mjs";
import { chaos } from "./03-chaos.mjs";
import { orbit } from "./04-orbit.mjs";
import { ecosystem, whipOut } from "./05-ecosystem.mjs";
import { processScene, whipIn } from "./06-process.mjs";
import { logoScene } from "./07-logo.mjs";
import { FPS } from "../timing.mjs";

export const SCENES = [
  { name: "ignite", from: 0, to: 2.06, draw: ignite },
  { name: "type", from: 1.98, to: 4.05, draw: type },
  { name: "chaos", from: 3.8, to: 7.05, draw: chaos },
  { name: "orbit", from: 6.95, to: 11.25, draw: orbit },
  { name: "ecosystem", from: 10.98, to: 14.5, draw: ecosystem },
  { name: "process", from: 14.3, to: 17.05, draw: processScene },
  { name: "logo", from: 16.95, to: 20, draw: logoScene },
];

/** Horizontal smear (px) for whip pans: how far the frame moves within one frame */
export function smearAt(t) {
  const dt = 1 / FPS;
  const moved = Math.abs(whipOut(t) - whipOut(t - dt)) + Math.abs(whipIn(t) - whipIn(t - dt));
  return Math.min(moved * 1.4, 520);
}
