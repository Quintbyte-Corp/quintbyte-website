/**
 * Org-chart connector: a line down from the item above, across the row, and down into
 * each of `count` equal columns below, ending in a cyan node. Blue-gray lines and cyan
 * nodes (colour roles). The columns below must use the same gap (`gap`, default 16px).
 * Decorative, so hidden from assistive technology; the parent decides where it shows.
 */
export function TreeConnectors({
  count,
  gap = "16px",
  className = "",
}: {
  count: number;
  gap?: string;
  className?: string;
}) {
  const line = "bg-bluegray";
  // Half a column's width: where the first and last column centres sit
  const inset = `calc((100% - ${count - 1} * ${gap}) / ${count * 2})`;
  return (
    <div aria-hidden className={`relative h-12 ${className}`}>
      <span className={`absolute top-0 left-1/2 h-1/2 w-0.5 -translate-x-1/2 ${line}`} />
      {count > 1 ? (
        <span className={`absolute top-1/2 h-0.5 ${line}`} style={{ left: inset, right: inset }} />
      ) : null}
      <div
        className="absolute inset-x-0 top-1/2 bottom-0 grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, gap }}
      >
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="relative">
            <span className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 ${line}`} />
            <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan" />
          </span>
        ))}
      </div>
    </div>
  );
}
