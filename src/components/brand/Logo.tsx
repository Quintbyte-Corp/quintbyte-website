import type { CSSProperties } from "react";
import Link from "next/link";
import { LOGO_CYAN, mark, wordmark } from "./logo-paths";

type Tone = {
  /** Colour for the "b" / "quint" parts */
  accent?: string;
  /** Colour for the "q" / "byte" parts (black in the official file) */
  ink?: string;
};

type MarkProps = Tone & { className?: string; style?: CSSProperties; title?: string };

/** The official "qb" monogram. Monochrome when accent and ink are the same colour. */
export function LogoMark({
  className,
  style,
  title,
  accent = LOGO_CYAN,
  ink = "currentColor",
}: MarkProps) {
  return (
    <svg
      viewBox={mark.viewBox}
      className={className}
      style={style}
      fillRule="evenodd"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={mark.accent} fill={accent} />
      <path d={mark.ink} fill={ink} />
    </svg>
  );
}

export function LogoWordmark({
  className,
  style,
  accent = LOGO_CYAN,
  ink = "currentColor",
}: MarkProps) {
  return (
    <svg
      viewBox={wordmark.viewBox}
      className={className}
      style={style}
      fillRule="evenodd"
      aria-hidden
      focusable="false"
    >
      <path d={wordmark.accent} fill={accent} />
      <path d={wordmark.ink} fill={ink} />
    </svg>
  );
}

/**
 * Horizontal lockup used in the header and footer: mark + wordmark, on dark.
 * `size` is the mark height in px (design: 30px in the nav, 34px in the footer).
 */
export function LogoLockup({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <LogoMark
        className="w-auto drop-shadow-[0_0_14px_rgb(34_199_255/0.45)]"
        // Height drives the size; width follows the viewBox aspect ratio.
        style={{ height: size }}
      />
      <LogoWordmark className="w-auto" style={{ height: size * 0.6 }} />
    </span>
  );
}

export function LogoHomeLink({ size, onClick }: { size?: number; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="QuintByte — home"
      className="inline-flex shrink-0 rounded-md"
    >
      <LogoLockup size={size} />
    </Link>
  );
}
