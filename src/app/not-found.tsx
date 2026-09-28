import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="bg-[radial-gradient(ellipse_60%_70%_at_72%_45%,rgb(34_150_255/0.16),transparent_70%)]">
      <div className="shell flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
        <Eyebrow>
          Error <span className="font-mono text-accent">404</span>
        </Eyebrow>
        <h1 className="text-[clamp(38px,4.8vw,64px)] leading-[1.04] font-extrabold tracking-[-0.035em] text-balance">
          This page isn&rsquo;t one of the moving parts.
        </h1>
        <p className="max-w-[520px] text-[17px] leading-[1.6] text-mute">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <ButtonLink href="/" glow arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/services" variant="outline-dark">
            Explore Services
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
