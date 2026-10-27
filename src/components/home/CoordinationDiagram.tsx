import type { CSSProperties } from "react";

/**
 * Hero coordination diagram, rebuilt from hero-coordination-diagram.svg in the QB asset
 * pack): five specialists connect to one accountable lead, who connects to you. The
 * connectors draw once (600ms, globals.css ".qb-draw") and are static under reduced
 * motion. Labels must match services offered today (README in the asset pack).
 *
 * Colour roles: blue-gray connectors, cyan nodes and the lead-to-you line, an apricot
 * "You" node, slate text.
 */
const specialists = [
  { label: "Executive assistant", x: 90, y: 90, labelY: 70 },
  { label: "CRM and sales", x: 250, y: 60, labelY: 40 },
  { label: "Operations", x: 410, y: 90, labelY: 70 },
  { label: "Web and automation", x: 100, y: 240, labelY: 274 },
  { label: "Bookkeeping", x: 400, y: 240, labelY: 274 },
] as const;

const LEAD = { x: 250, y: 240, r: 40 };
const YOU = { x: 250, y: 380 };
const delay = (ms: number) => ({ "--draw-delay": `${ms}ms` }) as CSSProperties;

export function CoordinationDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 420"
      role="img"
      aria-labelledby="coord-title coord-desc"
      className={`h-auto w-full font-sans ${className}`}
    >
      <title id="coord-title">How QuintByte works</title>
      <desc id="coord-desc">
        Five specialists, in executive assistance, CRM and sales, operations, web and automation,
        and bookkeeping, connect to one accountable lead, who connects to you.
      </desc>

      {specialists.map((s, i) => (
        <line
          key={s.label}
          className="qb-draw"
          style={delay(i * 60)}
          pathLength={100}
          x1={s.x}
          y1={s.y}
          x2={LEAD.x}
          y2={LEAD.y}
          stroke="var(--color-bluegray)"
          strokeWidth={2}
        />
      ))}
      <line
        className="qb-draw"
        style={delay(360)}
        pathLength={100}
        x1={LEAD.x}
        y1={LEAD.y + LEAD.r}
        x2={YOU.x}
        y2={YOU.y - 11}
        stroke="var(--color-cyan)"
        strokeWidth={2.5}
      />

      {specialists.map((s) => (
        <g key={s.label}>
          <circle cx={s.x} cy={s.y} r={8} fill="var(--color-cyan)" />
          <text x={s.x} y={s.labelY} textAnchor="middle" fontSize={17} fill="var(--color-slate)">
            {s.label}
          </text>
        </g>
      ))}

      <circle
        cx={LEAD.x}
        cy={LEAD.y}
        r={LEAD.r}
        fill="#fff"
        stroke="var(--color-slate)"
        strokeWidth={3}
      />
      <image href="/brand/qb-mark.svg" x={LEAD.x - 22} y={LEAD.y - 22} width={44} height={44} />
      <text
        x={LEAD.x + 52}
        y={LEAD.y + 64}
        fontSize={17}
        fontWeight={800}
        fill="var(--color-slate)"
      >
        One accountable lead
      </text>

      <circle cx={YOU.x} cy={YOU.y} r={11} fill="var(--color-apricot)" />
      <text x={YOU.x + 22} y={YOU.y + 6} fontSize={17} fontWeight={800} fill="var(--color-slate)">
        You
      </text>
    </svg>
  );
}
