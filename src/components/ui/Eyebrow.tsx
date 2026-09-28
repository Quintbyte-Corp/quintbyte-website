import type { ReactNode } from "react";

type Tone = "dark" | "light" | "pill";

const tones: Record<Tone, string> = {
  /** On dark sections */
  dark: "font-bold text-mute-3",
  /** On light sections */
  light: "font-bold text-accent-light-text",
  /** Hero pill */
  pill: "rounded-full border border-white/14 bg-white/4 px-4 py-2 font-semibold text-mute-3",
};

/** 12px / 700 / 1.4px tracking / uppercase section label */
export function Eyebrow({
  children,
  tone = "dark",
  as: Tag = "p",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  as?: "p" | "span";
  className?: string;
}) {
  return (
    <Tag className={`text-xs tracking-[1.4px] uppercase ${tones[tone]} ${className}`}>
      {children}
    </Tag>
  );
}
