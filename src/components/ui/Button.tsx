import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { SvgIcon } from "@/components/icons/SvgIcon";
import { arrowForward } from "@/components/icons/ui-paths";

/**
 * One button style (brief, principle 6): Deep Slate with white text, at least 48px tall.
 * `inverse` is the white button used only on the Deep Slate band. Secondary actions are
 * text links (ArrowLink), so each screen has one button.
 */
type Variant = "primary" | "inverse";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-chip px-6 py-3 text-base leading-6 font-extrabold whitespace-nowrap transition-[filter,transform] duration-150 ease-qb hover:brightness-[.92] active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "bg-slate text-white",
  inverse: "bg-white text-slate",
};

type ButtonStyleProps = {
  variant?: Variant;
  /** Trailing arrow */
  arrow?: boolean;
  className?: string;
};

export function buttonClasses({ variant = "primary", className = "" }: ButtonStyleProps) {
  return `${base} ${variants[variant]} ${className}`;
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
  arrow,
  className,
  ...props
}: ButtonLinkProps) {
  const cls = buttonClasses({ variant, className });
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

/** Slate text link with a cyan underline and a trailing arrow ("See how it works →") */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `group inline-flex min-h-12 items-center gap-2 text-base font-extrabold text-slate ${className}`;
  const content = (
    <>
      <span className="underline decoration-cyan decoration-2 underline-offset-4 transition-[text-decoration-thickness] duration-150 group-hover:decoration-[3px]">
        {children}
      </span>
      <SvgIcon
        d={arrowForward}
        className="text-lg transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </>
  );
  return href.startsWith("/") || href.startsWith("#") ? (
    <Link href={href} className={cls}>
      {content}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {content}
    </a>
  );
}
