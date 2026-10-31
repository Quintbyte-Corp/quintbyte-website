import type { StaticImageData } from "next/image";
import aboutHero from "@/assets/photos/about-hero.jpg";
import contact from "@/assets/photos/contact.jpg";
import crmCleanup from "@/assets/photos/crm-cleanup.jpg";
import execAssistance from "@/assets/photos/exec-assistance.jpg";
import howHero from "@/assets/photos/how-hero.jpg";
import opsStarter from "@/assets/photos/ops-starter.jpg";
import servicesHero from "@/assets/photos/services-hero.jpg";
import adminOps from "@/assets/photos/svc-admin-ops.jpg";
import aiAutomation from "@/assets/photos/svc-ai-automation.jpg";
import bookkeeping from "@/assets/photos/svc-bookkeeping.jpg";
import customProject from "@/assets/photos/svc-custom-project.jpg";
import customerService from "@/assets/photos/svc-customer-service.jpg";
import graphicDesign from "@/assets/photos/svc-graphic-design.jpg";
import hr from "@/assets/photos/svc-hr.jpg";
import itSupport from "@/assets/photos/svc-it-support.jpg";
import marketing from "@/assets/photos/svc-marketing.jpg";
import researchData from "@/assets/photos/svc-research-data.jpg";
import website from "@/assets/photos/svc-website.jpg";
import teamHero from "@/assets/photos/team-hero.jpg";
import training from "@/assets/photos/training.jpg";
import type { ServiceSlug } from "./services";

/**
 * Stock photography (Unsplash licence: free for commercial use, no attribution required).
 * Every photo shows a real scene, never a generated one, and none is presented as the
 * QuintByte team or office.
 */
export type Photo = { src: StaticImageData; alt: string };

export const pagePhotos = {
  home: { src: teamHero, alt: "A small team meeting around a table with laptops" },
  training: { src: training, alt: "A team gathered around a table reviewing work together" },
  services: {
    src: servicesHero,
    alt: "Three colleagues working together on laptops at a shared desk",
  },
  howItWorks: {
    src: howHero,
    alt: "A team gathered around a whiteboard during a planning session",
  },
  about: { src: aboutHero, alt: "Two colleagues smiling while working on laptops" },
  contact: { src: contact, alt: "A woman working on her laptop by a bright window" },
} satisfies Record<string, Photo>;

export const servicePhotos: Record<ServiceSlug, Photo> = {
  "executive-assistance": {
    src: execAssistance,
    alt: "A professional working on a laptop while checking his phone",
  },
  "administrative-operations-support": {
    src: adminOps,
    alt: "A woman working at a tidy desk with a laptop",
  },
  "crm-sales-support": { src: crmCleanup, alt: "Two colleagues reviewing records on a computer" },
  "customer-service-client-support": {
    src: customerService,
    alt: "A support specialist with a headset working on a laptop",
  },
  "marketing-creative-support": {
    src: marketing,
    alt: "A weekly social media content plan on a whiteboard",
  },
  "graphic-design-creative-production": {
    src: graphicDesign,
    alt: "A designer sketching on a tablet beside colour swatches",
  },
  "it-technical-support": {
    src: itSupport,
    alt: "A technician working on a laptop at a workbench",
  },
  "website-digital-solutions": { src: website, alt: "A laptop showing website code" },
  "ai-automation-support": { src: aiAutomation, alt: "A hand-drawn workflow diagram on paper" },
  "bookkeeping-finance-support": {
    src: bookkeeping,
    alt: "A calculator on top of receipts and financial records",
  },
  "human-resources-people-support": { src: hr, alt: "Two people shaking hands across a desk" },
  "research-data-support": {
    src: researchData,
    alt: "Charts and reports being reviewed on a desk",
  },
  "business-operations-management-support": {
    src: opsStarter,
    alt: "A team planning at a whiteboard",
  },
  "custom-project-based-support": {
    src: customProject,
    alt: "A project plan laid out in sticky notes on a wall",
  },
};

export const photoFor = (slug: string): Photo | undefined =>
  (servicePhotos as Record<string, Photo>)[slug];
