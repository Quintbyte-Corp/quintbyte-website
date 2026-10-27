import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { BrandIcon } from "@/components/icons/Icon";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-bluegray/50 bg-paper">
      <div className="shell flex flex-col gap-12 pt-16 pb-8">
        <div className="flex flex-wrap justify-between gap-12">
          <Link href="/" aria-label="QuintByte home" className="self-start">
            {/* Colour tagline lockup with QUINTBYTE, 48px tall (brief: "The logo on the site") */}
            <Logo file="tagline" height={48} />
          </Link>

          <div className="flex flex-wrap gap-12 text-base">
            {siteConfig.footerColumns.map((column, i) => (
              <nav key={i} aria-label={`Footer ${i + 1}`}>
                <ul className="flex flex-col gap-2">
                  {column.map((link, j) => (
                    <li key={link.href + j}>
                      <Link
                        href={link.href}
                        className={`text-slate underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-cyan ${j === 0 ? "font-extrabold" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <ContactDetails className="max-w-[300px]" />

            {siteConfig.socials.length > 0 ? (
              <ul className="flex items-start gap-2" aria-label="QuintByte on social media">
                {siteConfig.socials.map((social) => (
                  <li key={social.network}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`QuintByte on ${social.label}`}
                      className="flex size-12 items-center justify-center rounded-full border border-bluegray text-slate transition-colors duration-150 hover:border-slate"
                    >
                      <BrandIcon name={social.network} className="text-base" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-bluegray/50 pt-6 text-sm text-slate">
          {/* Legal line as specified in GDE-005 A2 */}
          <p>
            © {year} {siteConfig.legalName} | SEC Reg. No. {siteConfig.secRegNo} |{" "}
            {siteConfig.location}
          </p>
          {siteConfig.legal.length > 0 ? (
            <ul className="flex gap-6">
              {siteConfig.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-cyan"
                  >
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
