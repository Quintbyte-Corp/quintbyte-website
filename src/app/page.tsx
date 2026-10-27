import type { Metadata } from "next";
import { BusinessBehind } from "@/components/home/BusinessBehind";
import { Hero } from "@/components/home/Hero";
import { StaySharp } from "@/components/home/StaySharp";
import { CtaSection } from "@/components/sections/CtaSection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WaysToStart } from "@/components/sections/WaysToStart";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BusinessBehind />
      <WaysToStart />
      <ProcessSection />
      <EcosystemSection />
      <StaySharp />
      <ServicesSection />
      <CtaSection />
    </>
  );
}
