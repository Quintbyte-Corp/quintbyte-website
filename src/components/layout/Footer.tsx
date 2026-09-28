import Link from "next/link";
import { LogoLockup } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/icons/Icon";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6 bg-bg">
      <div className="shell flex flex-col gap-11 pt-14 pb-7">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex flex-wrap items-center gap-7">
            <Link href="/" aria-label="QuintByte — home" className="rounded-md">
              <LogoLockup size={34} />
            </Link>
            <p className="text-sm leading-relaxed text-mute-2">
              {siteConfig.tagline.split(". ").map((line, i, lines) => (
                <span key={line} className="block">
                  {i < lines.length - 1 ? `${line}.` : line}
                </span>
              ))}
            </p>
          </div>

          <div className="flex flex-wrap gap-14 text-sm">
            {siteConfig.footerColumns.map((column, i) => (
              <nav key={i} aria-label={`Footer ${i + 1}`}>
                <ul className="flex flex-col gap-2.5">
                  {column.map((link, j) => (
                    <li key={link.href + j}>
                      <Link
                        href={link.href}
                        className={`transition-colors hover:text-accent ${
                          j === 0 ? "font-semibold text-ink" : "text-mute-2"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {siteConfig.socials.length > 0 ? (
              <ul className="flex items-start gap-2.5" aria-label="QuintByte on social media">
                {siteConfig.socials.map((social) => (
                  <li key={social.network}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`QuintByte on ${social.label}`}
                      className="flex size-[38px] items-center justify-center rounded-full border border-white/14 text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <BrandIcon name={social.network} className="text-[15px]" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-white/6 pt-[22px] text-[13px] text-foot">
          <p>
            © {year} {siteConfig.legalName} All rights reserved.
          </p>
          {siteConfig.legal.length > 0 ? (
            <ul className="flex gap-6">
              {siteConfig.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-ink">
                    {link.label}
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
