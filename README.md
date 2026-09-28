# QuintByte website

Marketing site for QuintByte Corp. Business Management Services —
_One business partner. The right specialists. Clear accountability._

- **Visual source of truth:** `design_handoff_quintbyte_website/` (Claude Design export — README, prototype HTML, mockup, photos)
- **Content source of truth:** _QuintByte Corp. Business Management Services — Comprehensive Service Description_ (BMS document)

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 · deployed on Vercel.
No UI or animation runtime libraries: icons are inlined SVG, motion is CSS plus one IntersectionObserver.
The contact form talks to Supabase and Resend over plain REST (no SDKs).

## Getting started

```bash
cp .env.example .env.local   # all variables are optional locally
npm install
npm run dev                  # http://localhost:3000
```

| Script              | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Dev server                                                     |
| `npm run build`     | Production build (static except `/contact`)                    |
| `npm run typecheck` | Route type generation + `tsc --noEmit`                         |
| `npm run lint`      | ESLint                                                         |
| `npm run format`    | Prettier (with Tailwind class sorting)                         |
| `npm run icons`     | Regenerate inline icon paths after changing the icon list      |
| `npm run logo`      | Regenerate logo paths and app icons from the official logo SVG |

## Routes

| Route              | Content                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `/`                | The designed home page: hero/orbit → business behind → process → ecosystem → services → CTA |
| `/services`        | All 14 official service categories, engagement options                                      |
| `/services/[slug]` | One page per service (statically generated) with scope, "best suited for", process          |
| `/how-it-works`    | Understand → Scope → Confirm → Assign → Deliver → Review                                    |
| `/about`           | The QuintByte model, ecosystem, what makes QuintByte different, operating principle         |
| `/contact`         | Enquiry form; `?service=<slug>` preselects the area of interest                             |

Plus `sitemap.xml`, `robots.txt` (previews are `noindex`), generated Open Graph images (site and per service), app icons and JSON-LD (Organization, WebSite, Service, BreadcrumbList).

## Where things live

```
src/
  app/                 routes, metadata files (sitemap, robots, OG images, icons), contact server action
  components/
    brand/             official logo (mark, wordmark, lockup) — geometry generated from the SVG
    icons/             Material Symbols weight-300 glyphs as SVG (Icon = server, SvgIcon + ui-paths = client)
    home/              hero, orbit diagram, business-behind (home-only sections)
    sections/          sections shared across pages (process, ecosystem, services, CTA, page hero…)
    layout/            header (server shell + small client nav), footer
    contact/           contact form (client)
    motion/            scroll reveal (server marker + one client observer)
    seo/               JSON-LD helpers
  config/site.ts       brand lines, navigation, contact email, social and legal links
  data/services.ts     the 14 services — single source for cards, pages, form options, sitemap, schema
  data/process.ts      the six process steps
  data/company.ts      company-level copy from the BMS document
  data/home.ts         orbit nodes, chips, floating tags, ecosystem pillars
  lib/contact/         validation and delivery (Supabase + Resend)
  assets/              official logo SVG and optimized photos
supabase/migrations/   contact_submissions table (RLS on, service-role inserts only)
```

To change a service, edit `src/data/services.ts`; every page, card, form option, sitemap entry and schema item follows.

## Contact form

Fields: Name, Business / Company, Email, Service / Area of interest (incl. "Not sure yet"), Message.
Validated on the server; spam is filtered with a honeypot and a minimum fill time.

Delivery is configured by environment variables (see `.env.example`):

- **Supabase** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) stores submissions — run `supabase/migrations/0001_contact_submissions.sql` first.
- **Resend** (`RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`) emails a notification with reply-to set to the sender.

With neither configured, development logs submissions to the console and production shows a
"form unavailable" message — a submission is never silently dropped.

## Deploying to Vercel

1. Import the project in Vercel (framework preset: Next.js).
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin, plus any contact-form variables.
3. Deploy and connect the domain.

## Content still to confirm

These are deliberately empty and hidden in the UI until confirmed — nothing is invented:

- Public contact email (`NEXT_PUBLIC_CONTACT_EMAIL`; the design used `hello@quintbyte.com` pending confirmation)
- Social profile URLs (`src/config/site.ts` → `socials`)
- Privacy Policy and Terms of Service pages (`src/config/site.ts` → `legal`)
