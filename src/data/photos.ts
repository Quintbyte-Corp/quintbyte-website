import type { StaticImageData } from "next/image";
import about from "@/assets/illustrations/about.svg";
import contact from "@/assets/illustrations/contact.svg";
import home from "@/assets/illustrations/home.svg";
import howItWorks from "@/assets/illustrations/how-it-works.svg";
import services from "@/assets/illustrations/services.svg";
import adminOps from "@/assets/illustrations/svc-administrative-operations-support.svg";
import aiAutomation from "@/assets/illustrations/svc-ai-automation-support.svg";
import bookkeeping from "@/assets/illustrations/svc-bookkeeping-finance-support.svg";
import businessOps from "@/assets/illustrations/svc-business-operations-management-support.svg";
import crm from "@/assets/illustrations/svc-crm-sales-support.svg";
import customProject from "@/assets/illustrations/svc-custom-project-based-support.svg";
import customerService from "@/assets/illustrations/svc-customer-service-client-support.svg";
import execAssistance from "@/assets/illustrations/svc-executive-assistance.svg";
import graphicDesign from "@/assets/illustrations/svc-graphic-design-creative-production.svg";
import hr from "@/assets/illustrations/svc-human-resources-people-support.svg";
import itSupport from "@/assets/illustrations/svc-it-technical-support.svg";
import marketing from "@/assets/illustrations/svc-marketing-creative-support.svg";
import researchData from "@/assets/illustrations/svc-research-data-support.svg";
import website from "@/assets/illustrations/svc-website-digital-solutions.svg";
import training from "@/assets/illustrations/training.svg";
import type { ServiceSlug } from "./services";

/**
 * QuintByte's own flat illustrations in the brand colours (no stock photos, no generated
 * people). Figures are faceless, so none is presented as a real team member; apricot is
 * kept for the client ("you"). Each is drawn for its frame: page scenes 16:9 (training
 * 16:10), contact and service scenes 4:3 with the key content clear of a 16:10 crop.
 * Real team photos can replace the home and about scenes later.
 */
export type Photo = { src: StaticImageData; alt: string };

export const pagePhotos = {
  home: {
    src: home,
    alt: "Illustration: a client talking with their lead, with the rest of the team connected behind them",
  },
  training: {
    src: training,
    alt: "Illustration: one team member teaching the others a tool on a screen",
  },
  services: {
    src: services,
    alt: "Illustration: six kinds of work connected to one lead, with the client below",
  },
  howItWorks: {
    src: howItWorks,
    alt: "Illustration: six steps along one line, starting from the client, with two checkpoints",
  },
  about: { src: about, alt: "Illustration: five friends standing together" },
  contact: {
    src: contact,
    alt: "Illustration: a message travelling from a laptop to a checkmark",
  },
} satisfies Record<string, Photo>;

export const servicePhotos: Record<ServiceSlug, Photo> = {
  "executive-assistance": {
    src: execAssistance,
    alt: "Illustration: a calendar, a clock and an inbox tray of letters",
  },
  "administrative-operations-support": {
    src: adminOps,
    alt: "Illustration: loose papers being filed into a cabinet, with a checklist",
  },
  "crm-sales-support": {
    src: crm,
    alt: "Illustration: a pile of contact cards being sorted into a tidy pipeline",
  },
  "customer-service-client-support": {
    src: customerService,
    alt: "Illustration: a support specialist with a headset, surrounded by chat messages",
  },
  "marketing-creative-support": {
    src: marketing,
    alt: "Illustration: a board of planned posts and a megaphone",
  },
  "graphic-design-creative-production": {
    src: graphicDesign,
    alt: "Illustration: shapes on an artboard, a pen path and colour swatches",
  },
  "it-technical-support": {
    src: itSupport,
    alt: "Illustration: a laptop with every check passing, a gear and a router",
  },
  "website-digital-solutions": {
    src: website,
    alt: "Illustration: a website in a browser, its phone layout and the code behind it",
  },
  "ai-automation-support": {
    src: aiAutomation,
    alt: "Illustration: an automated workflow that ends with a person checking the result",
  },
  "bookkeeping-finance-support": {
    src: bookkeeping,
    alt: "Illustration: a ledger, receipts and a calculator",
  },
  "human-resources-people-support": {
    src: hr,
    alt: "Illustration: three team profile cards above an onboarding path",
  },
  "research-data-support": {
    src: researchData,
    alt: "Illustration: a report with charts and a magnifying glass",
  },
  "business-operations-management-support": {
    src: businessOps,
    alt: "Illustration: a dashboard with a gauge, key numbers and a process",
  },
  "custom-project-based-support": {
    src: customProject,
    alt: "Illustration: a project timeline with a milestone and planning notes",
  },
};

export const photoFor = (slug: string): Photo | undefined =>
  (servicePhotos as Record<string, Photo>)[slug];
