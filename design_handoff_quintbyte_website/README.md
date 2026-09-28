# Handoff: QuintByte Marketing Website

## Overview
Single-page marketing site for QuintByte, a business management services company ("one business partner, the right specialists, clear accountability"). Sections: Nav → Hero → The Business Behind the Business → How It Works → Ecosystem → Services → CTA → Footer.

## About the Design Files
`QuintByte Website.dc.html` is a **design reference built in HTML** — a prototype of intended look and behavior, not production code. Recreate it in a real stack. No codebase exists yet: recommended **Next.js (App Router) + Tailwind CSS**, deployed on **Vercel**. Open the HTML in a browser to view it. `reference/original-mockup.png` is the original vision image.

## Fidelity
**High-fidelity.** Recreate colors, type, spacing and copy as specified. Fully responsive.

## Global Layout
- Content container: `max-width: 1280px; margin: 0 auto; padding-inline: clamp(20px, 4vw, 48px)`.
- Section vertical padding: `clamp(56px, 7vw, 96px)` (dark sections up to 112px).
- Two-column sections use `grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr))`, gap `clamp(36px, 5vw, 72px)` — they stack on mobile.
- Anchor IDs: `#top`, `#how`, `#ecosystem`, `#services`, `#contact`. Smooth scroll recommended.

## Design Tokens
Colors
- bg-dark `#05080d` · bg-dark-2 (services) `#070b11` · card-dark `#0c131c` · node-dark `rgba(8,20,32,0.92)`
- bg-light `#f4f6f8` · bg-white `#ffffff` · border-light `#dde3e8` / `#e6eaee` / `#c5ced6`
- ink-light `#eef4f8` · muted-on-dark `#b7c3cc`, `#9fb0bc`, `#c9d4dc` · footer-muted `#7d8d99`
- ink-dark `#0b1118` · muted-on-light `#4a5864` · chip text `#1b2630`
- accent (cyan) `#22c7ff` · accent-hover `#5ad6ff` · accent-on-light `#0a8fc2` · accent-glow `rgba(34,199,255,0.35–0.55)` · button text on cyan `#03131c`
- Service icon colors: `oklch(0.76 0.14 H)` with H = 225, 250, 240, 290, 45, 340, 215, 185, 85 (in service order).

Typography
- Font: **Plus Jakarta Sans** (400/500/600/700/800). Mono: **JetBrains Mono** 500 (step numbers).
- H1: `clamp(42px, 5.6vw, 76px)` / 800 / line-height 1.02 / letter-spacing -0.035em.
- H2: `clamp(30px, 3.4vw, 46px)` (ecosystem & CTA `clamp(32px, 3.8vw, 52px)`) / 800 / 1.06–1.1 / -0.03em.
- Eyebrow: 12px / 700 / letter-spacing 1.4px / uppercase.
- Body: 17px / 1.6 (hero `clamp(16px, 1.4vw, 19px)`). Card body 14px / 1.55. Card titles 17px / 700.
- Icons: **Material Symbols Outlined**, weight 300.

Radii: pill buttons `999px` · cards `16px` · chips `10px` · image frames `24px` · float tags `8px` · icon buttons `12px`.

Shadows: primary button `0 0 28–32px rgba(34,199,255,0.35)`; glowing nodes `0 0 22px rgba(34,199,255,0.18)`, hover `0 0 30px rgba(34,199,255,0.45)`.

## Sections

### 1. Nav (sticky)
- `position: sticky; top: 0`, bg `rgba(5,8,13,0.82)` + `backdrop-filter: blur(14px)`, bottom border `rgba(34,199,255,0.1)`. Padding 18px.
- Logo: "qb" 30px/800, letter-spacing -2px, text-shadow `0 0 18px rgba(34,199,255,0.55)` + wordmark "quint" (ink) "byte" (cyan) 19px/700. **Replace with the real SVG logo.**
- Links (14px/500, gap 34px): Home (active, cyan), Services, How It Works, About, Contact — color `#c9d4dc`, hover white.
- CTA "Talk to QuintByte →": cyan pill, 12px 22px padding, 14px/700.
- **< 900px:** hide links + CTA, show 44×44 hamburger (border `rgba(255,255,255,0.15)`, radius 12). Tap opens a vertical menu below the bar (17px/600 links, 14px padding each, full-width cyan CTA). Icon toggles menu/close; clicking a link closes it.

### 2. Hero
- Background: `radial-gradient(ellipse 60% 70% at 72% 45%, rgba(34,150,255,0.16), transparent 70%)` on `#05080d`.
- Left column (gap 28px): pill eyebrow "BUSINESS MANAGEMENT SERVICES" (border `rgba(255,255,255,0.14)`, bg `rgba(255,255,255,0.04)`, 8px 16px); H1 "Your business has enough **moving parts.**" (last two words cyan); paragraph (max-width 520px): "You shouldn't have to manage all of them alone. QuintByte brings together the people, systems, and support your business needs — managed through one coordinated partnership."; buttons "Talk to QuintByte →" (cyan, 15px 26px) and "Explore Services" (outline `rgba(255,255,255,0.22)`, hover border cyan).
- Right: **Orbit diagram**, square, max-width 600px, sized with container-query units (`cqw`).
  - Rings: circle at inset 14% (solid `rgba(34,199,255,0.18)`) and inset 4% (dashed `0.12`).
  - Center disc 38% wide: radial gradient `#0e3a58 → #071a2a → #040a12`, border `rgba(34,199,255,0.55)`, glow `0 0 60px rgba(34,199,255,0.45)` + inset glow; "qb" 14cqw cyan with text glow + "quintbyte" 3.4cqw.
  - 10 nodes on a radius of 40%, starting at the top (-90°) and stepping 36° clockwise: Executive Support (person), CRM & Sales (bar_chart), Marketing (campaign), Creative (palette), IT & Tech (computer), AI & Automation (smart_toy), Finance (database), HR & People (groups), Customer Support (forum), Operations (settings). Node: 17% wide, aspect 1/0.92, radius 3cqw, icon 5.4cqw cyan, label 2.3cqw/600.
  - A 1px connector line from the center to each node: `linear-gradient(90deg, rgba(34,199,255,0.5), rgba(34,199,255,0.05))`.
  - Optional: gentle glow pulse or slow ring rotation (not in the prototype).

### 3. The Business Behind the Business (light `#f4f6f8`)
- Eyebrow (accent-on-light) "THE BUSINESS BEHIND THE BUSINESS"; H2 "Running a business means managing more than the business itself."; body "There's always something that needs to be done — and it can quickly become overwhelming."
- Chips (wrap, gap 10px; white, border `#dde3e8`, radius 10, 10px 14px, 14px/600, icon 18px `#0a8fc2`): Inbox (inbox), Meetings (calendar_month), Customers (groups), Leads (person_add), Payroll (payments), CRM (contacts), Marketing (campaign), IT & Systems (dns), Documents (description), Processes (account_tree), Reports (assessment), Projects (folder).
- Right: image `assets/business-owner.png`, aspect 4/3, radius 24, object-fit cover. Floating tags overlaid top-left (top 10%, left 8%, vertical stack gap 12px, each with a staggered left margin): Follow-ups 40%, Reports 0%, Contracts 30%, Marketing 4%, Expenses 26%, Payroll 14%. Tag style: bg `rgba(6,16,26,0.85)`, border `rgba(34,199,255,0.45)`, radius 8, 7px 12px, 13px/600, glow `0 0 18px rgba(34,199,255,0.25)`, icon 16px cyan. Consider a subtle float animation.

### 4. How It Works (white, top border `#e6eaee`)
- Eyebrow "HOW IT WORKS"; H2 "Simple for you.<br>Structured behind the scenes."; body "We follow a clear process to make sure you get the right support, the right people, and the right results."
- 6 steps, grid `repeat(auto-fit, minmax(min(100%,170px),1fr))`, gap 28px. Each: mono number pill (24px, border `#d6dde3`) + dashed connector line (`#b8c3cc`, 4px dash) → icon 34px → title 17px/700 → desc 14px muted.
  1. Understand (search) — We identify what your business actually needs.
  2. Scope (description) — We define responsibilities, skills, outputs, and requirements.
  3. Confirm (task_alt) — We confirm capability, capacity, pricing, and delivery conditions.
  4. Assign (groups) — We connect the work with the appropriate specialist or team member.
  5. Deliver (play_circle) — We perform the work while coordinating delivery.
  6. Review (visibility) — We maintain visibility, address issues, and review the work.

### 5. Ecosystem (dark, radial glow at 75% 55%)
- Eyebrow "ONE PARTNER, MULTIPLE **CAPABILITIES.**" (last word cyan); H2 "A complete business support ecosystem."; body "Instead of coordinating multiple freelancers or providers, you get one business partner with the right specialists, clear processes, and accountable delivery."; link "Learn More →" (cyan, 15px/700).
- Visual (aspect 1.25, max-width 560px, `cqw` units): an isometric stacked platform. Every plate uses `transform: translate(-50%,-50%) scaleY(0.5) rotate(45deg)`.
  - Floor grid: 96% wide at top 62%, grid lines `rgba(34,199,255,0.07)` every 7%, radial mask fade.
  - Glow ring plate: 62% wide at top 60%, border 1.5px `rgba(34,199,255,0.55)`, outer + inset glow.
  - 4 stacked plates, 42% wide, at top 48%, 44.5%, 41% and 37% (top plate). Backgrounds go from darker to lighter (`#050d16 → #06111c → #081624 → radial #12324a`), and the border brightens toward the top (`#3fd2ff` on the top plate).
  - "qb" on the top plate: counter-rotated -45deg, 12cqw, `#8fe6ff` with a strong cyan glow. Use the real logo mark if available.
  - Three cards (30% wide, z-index 2, left-aligned; gradient `rgba(14,30,46,.96) → rgba(6,14,22,.96)`, border `rgba(34,199,255,0.55)`, radius 2.5cqw, glow): People / Right Specialists (groups) on the left at top 44%; Processes / Clear Workflows (account_tree) on the right at top 44%; Systems / The Right Tools (dns) at bottom-center, bottom 4%.
  - A pre-rendered PNG/WebGL version of this visual would also be acceptable.

### 6. Services (`#070b11`)
- Eyebrow "OUR SERVICES"; H2 "Comprehensive support for a better running business."; right-aligned "View All Services →" (header wraps on mobile).
- Grid `repeat(auto-fill, minmax(min(100%,300px),1fr))`, gap 16px. Card: `#0c131c`, border `rgba(255,255,255,0.07)`, radius 16, padding 26px, min-height 170px; hover border `rgba(34,199,255,0.5)` and translateY(-2px), 0.2s transition. Icon 30px (color from tokens) → title → desc.
  - Executive Assistance (person) — Calendar, emails, travel, meetings and more.
  - Operations Support (settings) — Documentation, coordination, internal systems.
  - CRM & Sales Support (bar_chart) — Manage leads, pipeline and sales activities.
  - Customer Support (forum) — Email, chat, inquiries and client care.
  - Marketing Support (campaign) — Social media, content, campaigns.
  - Creative Production (palette) — Graphic design, branding and visual assets.
  - IT & Technical Support (computer) — Systems, tools and technical assistance.
  - Website & Digital Solutions (language) — Websites, apps and digital products.
  - AI & Automation (smart_toy) — Automate workflows and reduce manual work.

### 7. CTA (`#f4f6f8`, id `contact`)
- H2 "Ready to get started?"; body "You don't need to know exactly which service you need. Tell us what you're trying to achieve — we'll help define the right support."; buttons "Talk to QuintByte →" (cyan) and "Contact Us" (outline `#c5ced6`, `mailto:hello@quintbyte.com` — confirm the address).
- Image `assets/office.png`, aspect 16/10, radius 24, cover.

### 8. Footer (`#05080d`, top border `rgba(255,255,255,0.06)`)
- Logo + tagline "One business partner. / The right specialists. / Clear accountability." (14px, `#9fb0bc`).
- Link columns: Services, How It Works, About Us | How It Works, Contact. Social icons are 38px circles (Facebook, LinkedIn, YouTube, X) — use real brand icons and URLs.
- Bottom bar: "© 2026 QuintByte Corp. All rights reserved." · Privacy Policy · Terms of Service (13px, `#7d8d99`).

## Interactions & Behavior
- Hover: primary buttons → `#5ad6ff`; outline buttons → cyan border; nav links → white; service cards lift; orbit nodes glow.
- Mobile menu state: `open: boolean`, breakpoint 900px.
- "Talk to QuintByte" should lead to a contact form or booking page (not designed yet — to be built).
- Recommended: fade/slide-up reveal on scroll, `prefers-reduced-motion` respected.

## Assets
- `assets/business-owner.png` — man at laptop, dark office (section 3).
- `assets/office.png` — office with QuintByte logo wall (CTA).
- Icons: Google Material Symbols Outlined.
- Logo: currently typographic — replace with the official QuintByte SVG.
- Convert images to WebP/AVIF and serve responsive sizes.

## Files
- `QuintByte Website.dc.html` — full design reference (open in a browser; `image-slot.js` is a prototype-only helper for images).
- `reference/original-mockup.png` — original vision mockup.

## Next steps for Claude Code
1. Scaffold Next.js + Tailwind, add tokens to the Tailwind config, and load the fonts via `next/font`.
2. Build section components: Nav, Hero, OrbitDiagram, BusinessBehind, HowItWorks, Ecosystem, Services, CTA, Footer.
3. Add SEO metadata, OG image, favicon and analytics.
4. Deploy to Vercel and connect the domain.
