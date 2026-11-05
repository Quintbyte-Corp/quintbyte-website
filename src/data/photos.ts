import type { SceneName } from "@/components/art/scenes";
import type { ServiceSlug } from "./services";

/**
 * Which brand illustration each page and service shows (components/art/Scene.tsx, drawn by
 * scripts/illustrations.py), with its text alternative. No stock photos and no generated
 * people: figures are faceless, so none is presented as a real team member; apricot is
 * kept for the client ("you"). How It Works has its own scene (sections/ProcessArt.tsx).
 * Real team photos can replace the home and about scenes later.
 */
export type Photo = { scene: SceneName; alt: string };

export const pagePhotos = {
  home: {
    scene: "home",
    alt: "Illustration: a client talking with their lead, with the rest of the team connected behind them",
  },
  training: {
    scene: "training",
    alt: "Illustration: one team member teaching the others a tool on a screen",
  },
  services: {
    scene: "services",
    alt: "Illustration: six kinds of work connected to one lead, with the client below",
  },
  about: { scene: "about", alt: "Illustration: five friends standing together" },
  contact: {
    scene: "contact",
    alt: "Illustration: a message travelling from a laptop to a checkmark",
  },
} satisfies Record<string, Photo>;

export const servicePhotos: Record<ServiceSlug, Photo> = {
  "executive-assistance": {
    scene: "svc-executive-assistance",
    alt: "Illustration: a calendar, a clock and an inbox tray of letters",
  },
  "administrative-operations-support": {
    scene: "svc-administrative-operations-support",
    alt: "Illustration: loose papers being filed into a cabinet, with a checklist",
  },
  "crm-sales-support": {
    scene: "svc-crm-sales-support",
    alt: "Illustration: a pile of contact cards being sorted into a tidy pipeline",
  },
  "customer-service-client-support": {
    scene: "svc-customer-service-client-support",
    alt: "Illustration: a support specialist with a headset, surrounded by chat messages",
  },
  "marketing-creative-support": {
    scene: "svc-marketing-creative-support",
    alt: "Illustration: a board of planned posts and a megaphone",
  },
  "graphic-design-creative-production": {
    scene: "svc-graphic-design-creative-production",
    alt: "Illustration: shapes on an artboard, a pen path and colour swatches",
  },
  "it-technical-support": {
    scene: "svc-it-technical-support",
    alt: "Illustration: a laptop with every check passing, a gear and a router",
  },
  "website-digital-solutions": {
    scene: "svc-website-digital-solutions",
    alt: "Illustration: a website in a browser, its phone layout and the code behind it",
  },
  "ai-automation-support": {
    scene: "svc-ai-automation-support",
    alt: "Illustration: an automated workflow that ends with a person checking the result",
  },
  "bookkeeping-finance-support": {
    scene: "svc-bookkeeping-finance-support",
    alt: "Illustration: a ledger, receipts and a calculator",
  },
  "human-resources-people-support": {
    scene: "svc-human-resources-people-support",
    alt: "Illustration: three team profile cards above an onboarding path",
  },
  "research-data-support": {
    scene: "svc-research-data-support",
    alt: "Illustration: a report with charts and a magnifying glass",
  },
  "business-operations-management-support": {
    scene: "svc-business-operations-management-support",
    alt: "Illustration: a dashboard with a gauge, key numbers and a process",
  },
  "custom-project-based-support": {
    scene: "svc-custom-project-based-support",
    alt: "Illustration: a project timeline with a milestone and planning notes",
  },
};

export const photoFor = (slug: string): Photo | undefined =>
  (servicePhotos as Record<string, Photo>)[slug];
