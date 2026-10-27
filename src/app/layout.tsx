import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import { Plausible } from "@/components/analytics/Plausible";
import { SiteTracking } from "@/components/analytics/SiteTracking";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { openGraphBase } from "@/lib/metadata";
import "./globals.css";

/** Nunito Sans: the typeface of the qb tagline, so the site and the logo speak in one voice */
const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "800", "900"],
  display: "swap",
});

const defaultTitle = "QuintByte — Business Management Services";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: defaultTitle, template: "%s | QuintByte" },
  description: siteConfig.metaDescription,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphBase,
    title: defaultTitle,
    description: siteConfig.metaDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.metaDescription,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={nunito.variable}
      // Browser extensions commonly inject attributes on <html>
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-chip bg-slate px-6 py-3 font-extrabold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <SiteTracking />
        <Plausible />
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </body>
    </html>
  );
}
