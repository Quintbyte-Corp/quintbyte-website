/**
 * Three lines in the 24 Oct 2026 copy need the CEO's yes, because the site has to be true
 * on the day it goes live (brief, "Claims to confirm before launch"). Each switch picks
 * the approved line or the brief's fallback. All three confirmed by the CEO, 27 Oct 2026.
 */
export const claims = {
  /** "Yes, even the taxes": only once BIR registration is done and QuintByte is filing */
  taxesFiled: true,
  /** "We run formal training sessions": the first session (Heart) was booked for Tue 27 Oct */
  trainingHeld: true,
  /** "Five friends": every team member is happy with the word; otherwise "five partners" */
  friends: true,
} as const;

const five = claims.friends ? "five friends" : "five partners";

/** "QuintByte (QB) is a service firm of five friends" */
export const firmOfFive = `a service firm of ${five}`;

/** Home hero paragraph */
export const heroParagraph = claims.taxesFiled
  ? `QuintByte, or QB for short, is ${firmOfFive} who teamed up to serve our clients properly. We split the work, cover for each other, and pay for our own tools, taxes and training. Yes, even the taxes. You get one accountable partner instead of a string of freelancers.`
  : `QuintByte, or QB for short, is ${firmOfFive} who teamed up to serve our clients properly. We split the work and cover for each other. We pay for our own tools and training, and we're a registered company, not a side hustle. You get one accountable partner instead of a string of freelancers.`;

/** "How we stay sharp" paragraph */
export const trainingParagraph = claims.trainingHeld
  ? "We run formal training sessions for each other on the tools we use for your work. When one of us learns a better way, all five of us use it on Monday."
  : "We're building a habit of formal training on the tools we use for your work. When one of us learns a better way, all five of us use it on Monday.";

/** Contact FAQ "Which tools do you use?" */
export const toolsAnswer = `Claude and ChatGPT for research and drafting, always checked by a person. Google Workspace for email, calendars and documents. Canva for design. Your CRM, or one we recommend if you don't have one yet. ${
  claims.trainingHeld
    ? "We train each other on these formally, and we adapt to the tools you already use."
    : "We're building a habit of formal training on these, and we adapt to the tools you already use."
}`;

/** Home and share description (brief, step 8) */
export const siteDescription = `QuintByte (QB) is ${firmOfFive} in San Pablo City, Laguna, giving businesses admin, CRM and operations support.`;
