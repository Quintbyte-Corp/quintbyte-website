import type { Metadata } from "next";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="bg-white">
      <div className="shell flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="max-w-[960px] type-hero text-balance">
          This page isn&rsquo;t one of the moving parts.
        </h1>
        <p className="max-w-[560px] type-body">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ArrowLink href="/services">Explore Services</ArrowLink>
        </div>
      </div>
    </section>
  );
}
