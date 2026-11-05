import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/icons/Icon";
import { siteConfig } from "@/config/site";

const label = "text-xs font-extrabold tracking-[0.14em] text-mint uppercase";
const link =
  "text-white underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-cyan";

/** Deep Slate footer: it carries on from the closing band on pages that have one */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="qb-band bg-slate text-white">
      <div className="shell">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-10 border-t border-white/25 py-12">
          <Link href="/" aria-label="QuintByte home" className="block self-start">
            {/* Reversed tagline lockup (QB Brand Sheet: the reversed files on Deep Slate) */}
            <Logo file="taglineReversed" height={88} className="h-auto w-full max-w-[246px]" />
          </Link>

          {siteConfig.footerColumns.map((column, i) => (
            <nav key={i} aria-label={`Footer ${i + 1}`} className="flex flex-col gap-1.5">
              <span className={label}>Explore</span>
              <ul className="flex flex-col gap-1.5 text-base">
                {column.map((item, j) => (
                  <li key={item.href + j}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col gap-1.5 text-base">
            <span className={label}>Contact</span>
            <a href={`mailto:${siteConfig.contactEmail}`} className={`${link} font-extrabold`}>
              {siteConfig.contactEmail}
            </a>
            <a href={siteConfig.phone.href} className={link}>
              {siteConfig.phone.display}
            </a>
            {siteConfig.socials.length > 0 ? (
              <ul className="mt-3 flex gap-2" aria-label="QuintByte on social media">
                {siteConfig.socials.map((social) => (
                  <li key={social.network}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`QuintByte on ${social.label}`}
                      className="flex size-12 items-center justify-center rounded-full border border-white/50 text-white transition-colors duration-150 hover:border-white"
                    >
                      <BrandIcon name={social.network} className="text-base" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5 text-base">
            <span className={label}>Hours</span>
            <span>{siteConfig.hours}</span>
          </div>

          <div className="flex flex-col gap-1.5 text-base">
            <span className={label}>Where</span>
            <span>{siteConfig.location}</span>
            <span>{siteConfig.serving}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-white/25 pt-6 pb-8 text-sm">
          {/* Legal line as specified in GDE-005 A2 */}
          <p>
            © {year} {siteConfig.legalName} | SEC Reg. No. {siteConfig.secRegNo} |{" "}
            {siteConfig.location}
          </p>
          {siteConfig.legal.length > 0 ? (
            <ul className="flex gap-6">
              {siteConfig.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white underline decoration-white/60 decoration-2 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-cyan"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
