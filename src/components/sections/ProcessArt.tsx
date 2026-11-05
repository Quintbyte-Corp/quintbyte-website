import type { CSSProperties, ReactNode } from "react";

/**
 * The How It Works scene, inline so it can build once as it scrolls into view: the rail
 * draws from the client ("you", apricot) to the last step, and each step's node, stem and
 * card follow as the line reaches it. RevealObserver flips `data-revealed` ([data-build]);
 * the animation lives in globals.css (".qb-process"). Static without JavaScript and under
 * reduced motion. Steps 03 and 06 are checkpoints, as in data/process.ts.
 */
const SLATE = "var(--color-slate)";
const MINT = "var(--color-mint)";
const CYAN = "var(--color-cyan)";
const BLUEGRAY = "var(--color-bluegray)";

const RAIL = { x1: 100, x2: 1500, y: 600, ms: 1500, delay: 200 };

const card = { fill: "#fff", stroke: SLATE, strokeWidth: 4 };
const bar = { fill: "none", stroke: BLUEGRAY, strokeWidth: 6 };

const icons: ReactNode[] = [
  // 01 Understand: a conversation
  <>
    <path
      d="M220 320h80a20 20 0 0 1 20 20v36a20 20 0 0 1-20 20h-20l-30 28v-28h-30a20 20 0 0 1-20-20v-36a20 20 0 0 1 20-20z"
      {...card}
    />
    {[232, 260, 288].map((cx) => (
      <circle key={cx} cx={cx} cy={358} r={7} fill={CYAN} />
    ))}
  </>,
  // 02 Scope: a clipboard list
  <>
    <rect x={456} y={310} width={88} height={116} rx={6} {...card} />
    <rect x={482} y={300} width={36} height={18} rx={4} fill={SLATE} />
    <path d="M474 348h52M474 372h40M474 396h52" {...bar} />
  </>,
  // 03 Confirm: an agreed document
  <>
    <rect x={694} y={310} width={92} height={116} rx={8} {...card} />
    <path d="M722 346h36M722 372h20" {...bar} strokeWidth={8} />
    <circle cx={770} cy={410} r={24} {...card} />
    <path d="M757 411l9 9 19-20" fill="none" stroke={SLATE} strokeWidth={4} />
  </>,
  // 04 Assign: the right people
  <>
    {[
      [936, MINT],
      [1024, BLUEGRAY],
      [980, "#fff"],
    ].map(([cx, fill]) => (
      <g key={cx}>
        <circle cx={cx} cy={356} r={18} fill={SLATE} />
        <path
          d={`M${Number(cx) - 28} 414v-14a20 20 0 0 1 20-20h16a20 20 0 0 1 20 20v14z`}
          fill={fill as string}
          stroke={SLATE}
          strokeWidth={4}
        />
      </g>
    ))}
  </>,
  // 05 Deliver: a finished package
  <>
    <path d="M1164 350l56-26 56 26v66l-56 26-56-26z" {...card} />
    <path d="M1164 350l56 26 56-26M1220 376v66" fill="none" stroke={SLATE} strokeWidth={4} />
    <path d="M1192 337l56 26" {...bar} />
  </>,
  // 06 Review: a closer look
  <>
    <rect x={1410} y={310} width={84} height={108} rx={8} {...card} />
    <path d="M1438 346h28M1438 372h16M1438 398h28" {...bar} strokeWidth={8} />
    <circle cx={1482} cy={388} r={30} fill={MINT} stroke={SLATE} strokeWidth={6} />
    <path d="M1504 410l26 26" fill="none" stroke={SLATE} strokeWidth={10} />
  </>,
];

const stations = [260, 500, 740, 980, 1220, 1460];
const checkpoints = new Set([2, 5]);

/** When the drawing line reaches x */
const reach = (x: number) =>
  Math.round(RAIL.delay + ((x - RAIL.x1) / (RAIL.x2 - RAIL.x1)) * RAIL.ms);

export function ProcessArt({ label }: { label: string }) {
  return (
    <svg
      data-build=""
      role="img"
      aria-label={label}
      viewBox="0 0 1600 900"
      className="qb-process absolute inset-0 size-full"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width={1600} height={900} fill="var(--color-paper)" />
      <path
        className="qp-draw qp-rail"
        d={`M${RAIL.x1} ${RAIL.y}H${RAIL.x2}`}
        pathLength={100}
        fill="none"
        stroke={BLUEGRAY}
        strokeWidth={6}
      />
      <circle className="qp-pop" cx={RAIL.x1} cy={RAIL.y} r={24} fill="var(--color-apricot)" />

      {stations.map((x, i) => (
        <g key={x} style={{ "--t": `${reach(x)}ms` } as CSSProperties}>
          <path
            className="qp-draw qp-stem"
            d={`M${x} ${RAIL.y - 24}V460`}
            pathLength={100}
            fill="none"
            stroke={BLUEGRAY}
            strokeWidth={4}
          />
          <g className="qp-card">
            <rect x={x - 95} y={270} width={190} height={190} rx={16} {...card} />
            {icons[i]}
          </g>
          <g className="qp-pop">
            {checkpoints.has(i) ? (
              <circle cx={x} cy={RAIL.y} r={24} {...card} />
            ) : (
              <>
                <circle cx={x} cy={RAIL.y} r={24} fill="#fff" stroke={BLUEGRAY} strokeWidth={4} />
                <circle cx={x} cy={RAIL.y} r={10} fill={CYAN} />
              </>
            )}
          </g>
          {checkpoints.has(i) ? (
            <path
              className="qp-draw qp-tick"
              d={`M${x - 13} ${RAIL.y + 1}l9 9 19-20`}
              pathLength={100}
              fill="none"
              stroke={SLATE}
              strokeWidth={4}
            />
          ) : null}
        </g>
      ))}
    </svg>
  );
}
