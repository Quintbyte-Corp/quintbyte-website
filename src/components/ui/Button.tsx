import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { SvgIcon } from "@/components/icons/SvgIcon";
import { arrowForward } from "@/components/icons/ui-paths";

type Variant = "primary" | "outline-dark" | "outline-light";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-200";

const variants: Record<Variant, string> = {
  primary: "bg-accent font-bold text-on-accent hover:bg-accent-hover hover:text-on-accent",
  "outline-dark":
    "border border-white/22 font-semibold text-ink hover:border-accent hover:text-white",
  "outline-light":
    "border border-line-3 font-semibold text-ink-dark hover:border-ink-dark hover:text-ink-dark",
};

const sizes: Record<Size, string> = {
  md: "px-[26px] py-[15px] text-[15px]",
  sm: "px-[22px] py-3 text-sm",
};

type ButtonStyleProps = {
  variant?: Variant;
  size?: Size;
  /** Cyan glow used on dark surfaces (hero, nav) */
  glow?: boolean;
  /** Trailing arrow, as on every "Talk to QuintByte" button */
  arrow?: boolean;
  className?: string;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  glow = false,
  className = "",
}: ButtonStyleProps) {
  const glowClass = glow ? (size === "sm" ? "shadow-glow" : "shadow-glow-lg") : "";
  return `${base} ${variants[variant]} ${sizes[size]} ${glowClass} ${className}`;
}

type ButtonLinkProps = ButtonStyleProps & {
  href: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** A link styled as a button. Uses next/link for internal routes. */
export function ButtonLink({
  href,
  children,
  variant,
  size,
  glow,
  arrow,
  className,
  ...props
}: ButtonLinkProps) {
  const cls = buttonClasses({ variant, size, glow, className });
  const content = (
    <>
      {children}
      {arrow ? <SvgIcon d={arrowForward} className="text-lg" /> : null}
    </>
  );
  const isInternal = href.startsWith("/") || href.startsWith("#");
  return isInternal ? (
    <Link href={href} className={cls} {...props}>
      {content}
    </Link>
  ) : (
    <a href={href} className={cls} {...props}>
      {content}
    </a>
  );
}

/** Cyan text link with a trailing arrow ("Learn More →", "View All Services →") */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-[15px] font-bold text-accent transition-colors hover:text-[#7fdfff] ${className}`}
    >
      {children}
      <SvgIcon
        d={arrowForward}
        className="text-lg transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
