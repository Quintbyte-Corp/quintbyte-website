/**
 * Contact form types and limits shared by the client form and the server action.
 * Deliberately free of data imports so it stays tiny in the browser bundle.
 */

export const NOT_SURE = "not-sure";

/** Field limits (GDE-005 §5.1: message 10 to 2,000 characters) */
export const LIMITS = { name: 120, company: 160, email: 254, message: 2000 } as const;
export const MESSAGE_MIN = 10;

export type InterestOption = { value: string; label: string };

export type ContactFields = {
  name: string;
  company: string;
  email: string;
  interest: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "error"; message: string; errors?: FieldErrors; values: ContactFields }
  | { status: "success"; name: string };
