/*
 * Final text, published without a lawyer review on the CEO's decision (October 2026).
 *
 * Every statement comes from GDE-003 §3 or GDE-005 §5.1 and §13; the analytics provider is
 * Plausible (decision D-06). Held back until the CEO approves it in writing: the
 * marketing-email statement (GDE-003 §3 "[CONFIRM]"). US spelling throughout.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

const privacyEmail = "privacy@quintbyte.com";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Notice",
  description:
    "How QuintByte Corp. collects, uses and protects the personal information you share through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <LegalDocument
        title="Privacy Notice"
        updated="October 2026"
        intro={
          <p>
            This notice explains what personal information QuintByte collects through this website,
            why, and how you can see, correct or delete it.
          </p>
        }
      >
        <LegalSection id="who" title="Who we are">
          <p>
            This website is run by {siteConfig.legalName} (&ldquo;QuintByte&rdquo;,
            &ldquo;we&rdquo;), registered with the Philippine Securities and Exchange Commission
            under Reg. No. {siteConfig.secRegNo}, based in {siteConfig.location}.
          </p>
          <p>
            Our privacy contact is Kurtney Asegurado, Chief Operating Officer, at{" "}
            <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>.
          </p>
        </LegalSection>

        <LegalSection id="collect" title="What we collect">
          <p>When you send us a message through the contact form, we collect:</p>
          <ul>
            <li>your name and email address;</li>
            <li>your business or company name, if you give it;</li>
            <li>the service you are interested in, and your message.</li>
          </ul>
          <p>With each message we also record:</p>
          <ul>
            <li>the page you sent it from, and the campaign link that brought you to the site;</li>
            <li>your browser type (its &ldquo;user agent&rdquo;);</li>
            <li>
              a one-way coded version of your IP address, used only to stop repeated or automated
              submissions. We do not store the address itself.
            </li>
          </ul>
          <p>
            To know which campaign brought you here, the site keeps that link in your
            browser&rsquo;s session storage until you close the tab. We count visits and clicks with
            Plausible Analytics, which does not use cookies and does not identify you. This website
            does not use advertising cookies or advertising pixels.
          </p>
        </LegalSection>

        <LegalSection id="use" title="How we use it">
          <p>We use your details only to reply to your inquiry. That includes:</p>
          <ul>
            <li>answering your message and arranging a call if you want one;</li>
            <li>keeping a record of the inquiry;</li>
            <li>protecting the form from spam and abuse.</li>
          </ul>
        </LegalSection>

        <LegalSection id="access" title="Who can see it">
          <p>
            Inside QuintByte, access to inquiries is limited to our Chief Executive Officer and
            Chief Operating Officer.
          </p>
          <p>Your inquiry passes through these service providers, which handle it for us:</p>
          <ul>
            <li>Vercel, which hosts this website;</li>
            <li>Supabase, which stores form inquiries;</li>
            <li>Resend, which delivers the emails the form sends;</li>
            <li>Google Workspace, our email;</li>
            <li>Google Sheets, where we track inquiries.</li>
          </ul>
          <p>Some of these providers may store or process information outside the Philippines.</p>
        </LegalSection>

        <LegalSection id="retention" title="How long we keep it">
          <p>
            We keep inquiries for 24 months, unless you become a client, in which case your
            information is handled under our agreement with you.
          </p>
        </LegalSection>

        <LegalSection id="rights" title="Your rights">
          <p>
            We handle personal information in line with the Philippine Data Privacy Act of 2012. You
            can ask to see, correct or delete the information we hold about you by emailing{" "}
            <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>. Our Chief Operating Officer
            answers every request within 30 days.
          </p>
        </LegalSection>

        <LegalSection id="security" title="Security">
          <p>
            This website uses encrypted connections (HTTPS), and inquiries are stored in a database
            that the public cannot read.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="Changes to this notice">
          <p>
            When our practices change we will update this notice and the date at the top. The terms
            for using the website are in our <Link href="/terms">Terms of Service</Link>.
          </p>
        </LegalSection>
      </LegalDocument>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Notice", path: "/privacy" },
        ])}
      />
    </>
  );
}
