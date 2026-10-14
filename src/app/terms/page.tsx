/*
 * Final text, published without a lawyer review on the CEO's decision (October 2026).
 *
 * Facts from GDE-003 §1.1 and §3. Governing law is the Republic of the Philippines;
 * the venue (courts of San Pablo City, Laguna) is held back until the CEO approves it in
 * writing. Sections 2–6 are a plain-language general website disclaimer. US spelling.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that apply when you use the QuintByte website, run by QuintByte Corp. in San Pablo City, Laguna, Philippines.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <LegalDocument
        title="Terms of Service"
        updated="October 2026"
        intro={<p>These terms apply when you use this website. Please read them before you do.</p>}
      >
        <LegalSection id="about" title="1. About these terms">
          <p>
            This website is run by {siteConfig.legalName}, registered with the Philippine Securities
            and Exchange Commission under Reg. No. {siteConfig.secRegNo}, based in{" "}
            {siteConfig.location}. By using the website you agree to these terms.
          </p>
          <p>
            These terms cover the website only. Services we provide to clients are covered by a
            separate written agreement.
          </p>
        </LegalSection>

        <LegalSection id="information" title="2. Information on this website">
          <p>
            The website gives general information about QuintByte and our services. It is not an
            offer. The scope, availability and price of any service are confirmed only in a written
            proposal.
          </p>
        </LegalSection>

        <LegalSection id="use" title="3. Using the website">
          <p>
            Please use the website lawfully. Do not try to disrupt it, gain unauthorized access to
            it, or use the contact form to send spam or unlawful content.
          </p>
        </LegalSection>

        <LegalSection id="content" title="4. Our content">
          <p>
            {siteConfig.legalName} owns the text, design and QuintByte name and logo on this
            website. Please do not copy or reuse them without our written permission.
          </p>
        </LegalSection>

        <LegalSection id="links" title="5. Links to other websites">
          <p>
            Some links, such as a booking page, take you to services run by other companies. Their
            own terms and privacy notices apply there.
          </p>
        </LegalSection>

        <LegalSection id="disclaimer" title="6. Disclaimer">
          <p>
            We work to keep the website accurate and available, but we provide it &ldquo;as
            is&rdquo; and cannot promise that it will always be complete, current or free of
            interruptions.
          </p>
        </LegalSection>

        <LegalSection id="privacy" title="7. Privacy">
          <p>
            Our <Link href="/privacy">Privacy Notice</Link> explains how we handle the personal
            information you share through the website.
          </p>
        </LegalSection>

        <LegalSection id="law" title="8. Governing law">
          <p>These terms are governed by the laws of the Republic of the Philippines.</p>
        </LegalSection>

        <LegalSection id="changes" title="9. Changes">
          <p>
            We may update these terms. The date at the top shows when they last changed. For
            questions, use our <Link href="/contact">contact page</Link>.
          </p>
        </LegalSection>
      </LegalDocument>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms" },
        ])}
      />
    </>
  );
}
