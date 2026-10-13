/**
 * FAQ answers, word for word from GDE-003 §7, with the six held answers as approved in
 * "Website Open Items: Joao's Answers" (13 Oct 2026). Each question appears on exactly one
 * page, so its FAQPage structured data is never duplicated across the site.
 *
 * `hold` keeps an answer off the site until its open point is settled. Clear it only
 * when the CEO confirms the fact in writing (GDE-005 §1).
 */

export type FaqPage = "services" | "how-it-works" | "contact";

export type Faq = {
  question: string;
  answer: string;
  page: FaqPage;
  hold?: string;
};

export const faqs: readonly Faq[] = [
  {
    page: "services",
    question: "What does QuintByte do?",
    answer:
      "QuintByte is a Business Management Services company. We take on the work around your work: executive assistance, CRM and sales support, operations coordination, bookkeeping support and web development. One accountable partner coordinates everything, so you get the right specialists without hiring and managing them yourself.",
  },
  {
    page: "contact",
    question: "Where is QuintByte based?",
    answer:
      "QuintByte is based in San Pablo City, Laguna, Philippines. Our team is Filipino, with strong English, a service-first attitude and skills across admin, operations, CRM and web development. We work with clients in the United States, Australia and the Philippines, and cover Philippine and Australian hours easily, with U.S. hours by arrangement.",
  },
  {
    page: "services",
    question: "How is QuintByte different from hiring freelancers or a virtual assistant agency?",
    answer:
      "At QuintByte, one partner coordinates everything for you. Instead of finding, briefing and managing each freelancer yourself, or working through an agency account desk, you get one point of contact, a supervisor who checks the work, and a named backup on every account.",
  },
  {
    page: "services",
    question: "What size of business do you work with?",
    answer:
      "We work best with owner-led businesses of about 5 to 50 people. They are ready to hand off their admin and want focused support without building a large team. We support businesses in the United States, Australia and the Philippines.",
  },
  {
    page: "services",
    question: "Can I start with one service and add more later?",
    answer:
      "Yes. Common first steps are a two-week executive assistance pilot, a fixed-scope CRM cleanup, or an operations starter that documents one process and sets up a weekly report. You can add services once the first one is working.",
  },
  {
    page: "how-it-works",
    question: "How does onboarding work, and how long does it take?",
    answer:
      "Onboarding starts within three business days of your first payment. After you accept a proposal and the payment clears, we hold a kickoff to agree priorities, access, communication and reporting. We aim to have the first step running within the first week.",
  },
  {
    page: "how-it-works",
    question: "Who will be working on my account?",
    answer:
      "A named QuintByte team member or trained associate does the daily work. A founder supervises it, and a named backup covers absences. You always have one point of contact.",
  },
  {
    page: "how-it-works",
    question: "How do you communicate and report on progress?",
    answer:
      "We use the channels you prefer, usually email and a chat tool, and send a short weekly report. It covers what was done, what is in progress and what needs your decision. We agree response times in writing at the start.",
  },
  {
    page: "contact",
    question: "What hours do you work, and which time zones do you cover?",
    answer:
      "Our team is in the Philippines (GMT+8). We cover Philippine and Australian business hours easily, and support U.S. hours by arrangement. We confirm coverage hours in your proposal before work starts.",
  },
  {
    page: "contact",
    question: "How do you keep my information and system access secure?",
    answer:
      "Team members handling client work sign confidentiality agreements. We use the access you grant for the agreed work only, and prefer delegated access over shared passwords. Every account uses two-factor authentication, any shared passwords stay in a password manager, and we remove access promptly when work ends.",
  },
  {
    page: "contact",
    question: "How is pricing structured?",
    answer:
      "International clients usually pay by the hour in prepaid blocks, or a fixed price for a defined first project. Philippine clients usually choose a monthly package. Every quote is based on scope, hours and the skills needed, and you see the full price before work starts.",
  },
  {
    page: "contact",
    question: "Is there a minimum commitment or contract length?",
    answer:
      "Flexible from the start. Pilots and first projects are short and fixed. Ongoing support is billed monthly in advance, with a minimum of 40 hours a month for hourly support. Either side can end ongoing support with 30 days' written notice.",
  },
  {
    page: "services",
    question: "How do you make sure I am happy with the work?",
    answer:
      "Tell your point of contact and we will make it right. We review the issue, correct it, and adjust the person, process or scope if needed. Because we start small, we catch things early and fix them fast.",
  },
  {
    page: "contact",
    question: "What if I'm not sure which service I need?",
    answer:
      "That is normal. Book a 15-minute call or send a message about what takes most of your time. We will ask a few questions and suggest one small first step, or tell you honestly if someone else would serve you better.",
  },
  {
    page: "contact",
    question: "Which countries do you serve?",
    answer:
      "We serve owner-led businesses in the United States, Australia and the Philippines. Our team works from the Philippines, covers Australian business hours easily, and supports U.S. hours by arrangement. If you are elsewhere, send us a message and we will tell you honestly whether we can help.",
  },
  {
    page: "contact",
    question: "Which tools and software does your team use?",
    answer:
      "We work in your systems. Our team regularly uses Google Workspace, Microsoft 365, Salesforce, HubSpot and Canva, plus web tools such as React, Next.js, Vercel, Supabase and Resend.",
  },
];

/** The published questions for one page */
export const faqsFor = (page: FaqPage) => faqs.filter((f) => f.page === page && !f.hold);
