import Image from "next/image";
import Link from "next/link";

/**
 * The qb logo files from QB_Logo_Pack v1.1, served from public/brand. Never recoloured,
 * stretched or shadowed (QB Brand Sheet). Ratios come from each file's viewBox.
 */
const files = {
  mark: { src: "/brand/qb-mark.svg", ratio: 1012 / 1000 },
  markReversed: { src: "/brand/qb-mark-reversed.svg", ratio: 1012 / 1000 },
  tagline: { src: "/brand/qb-tagline-color.svg", ratio: 1395 / 500 },
  taglineReversed: { src: "/brand/qb-tagline-reversed-short.svg", ratio: 1395 / 500 },
} as const;

type LogoFile = keyof typeof files;

/** A logo file at a given height in px. Decorative unless it has alt text. */
export function Logo({
  file,
  height,
  alt = "",
  className = "",
}: {
  file: LogoFile;
  height: number;
  alt?: string;
  className?: string;
}) {
  const { src, ratio } = files[file];
  return (
    <Image
      src={src}
      alt={alt}
      width={Math.round(height * ratio)}
      height={height}
      unoptimized
      className={className}
    />
  );
}

/** Header: the colour qb mark alone, 32px tall, linking home */
export function LogoHomeLink() {
  return (
    <Link href="/" aria-label="QuintByte home" className="flex shrink-0 items-center">
      <Logo file="mark" height={32} />
    </Link>
  );
}
