import type { SVGProps } from "react";

export type SvgIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Accessible label. Omit for decorative icons (the default). */
  title?: string;
};

/**
 * Renders one glyph path at 1em × 1em so it follows the surrounding font-size, exactly
 * like the icon font in the design. Safe to use in client components: it carries no
 * icon data of its own.
 */
export function SvgIcon({
  d,
  viewBox = "0 -960 960 960",
  title,
  ...props
}: SvgIconProps & { d: string }) {
  return (
    <svg
      viewBox={viewBox}
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  );
}
