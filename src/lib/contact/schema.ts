import { services } from "@/data/services";
import {
  type ContactFields,
  type FieldErrors,
  type InterestOption,
  LIMITS,
  NOT_SURE,
} from "./constants";

/** Options for "Service / Area of interest": "Not sure yet" first, then the 14 services */
export const interestOptions: readonly InterestOption[] = [
  { value: NOT_SURE, label: "Not sure yet" },
  ...services.map((s) => ({ value: s.slug, label: s.title })),
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (form: FormData, key: string) => {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
};

export function parseContact(form: FormData): { values: ContactFields; errors: FieldErrors } {
  const values: ContactFields = {
    name: text(form, "name"),
    company: text(form, "company"),
    email: text(form, "email"),
    interest: text(form, "interest") || NOT_SURE,
    message: text(form, "message"),
  };

  const errors: FieldErrors = {};
  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > LIMITS.name) errors.name = "Please shorten your name.";

  if (values.company.length > LIMITS.company) errors.company = "Please shorten the company name.";

  if (!values.email) errors.email = "Please enter your email address.";
  else if (values.email.length > LIMITS.email || !EMAIL_RE.test(values.email))
    errors.email = "Please enter a valid email address.";

  if (!interestOptions.some((o) => o.value === values.interest))
    errors.interest = "Please choose an option from the list.";

  if (!values.message) errors.message = "Please tell us a little about what you need.";
  else if (values.message.length > LIMITS.message)
    errors.message = `Please keep your message under ${LIMITS.message} characters.`;

  return { values, errors };
}

export const interestLabel = (value: string) =>
  interestOptions.find((o) => o.value === value)?.label ?? "Not sure yet";
