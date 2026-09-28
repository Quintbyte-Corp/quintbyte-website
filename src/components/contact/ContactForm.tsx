"use client";

import { type ReactNode, useActionState, useEffect, useRef } from "react";
import { submitContact } from "@/app/contact/actions";
import { SvgIcon } from "@/components/icons/SvgIcon";
import {
  arrowForward,
  checkCircle,
  error as errorIcon,
  keyboardArrowDown,
  progressActivity,
} from "@/components/icons/ui-paths";
import { buttonClasses } from "@/components/ui/Button";
import {
  type ContactFields,
  type ContactState,
  type InterestOption,
  LIMITS,
  NOT_SURE,
} from "@/lib/contact/constants";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "w-full rounded-chip border bg-white px-4 py-3 text-[15px] text-ink-dark placeholder:text-mute-light/70 transition-colors outline-none focus:border-accent-light focus:ring-3 focus:ring-accent/25";

type FieldProps = {
  name: keyof ContactFields;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
};

function Field({ name, label, required, error, hint, children }: FieldProps) {
  const id = `contact-${name}`;
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-chip">
        {label}
        {required ? (
          <span className="text-mute-light" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-mute-light"> (optional)</span>
        )}
      </label>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
        className: `${inputClass} ${error ? "border-[#c2410c]" : "border-line-3"}`,
      })}
      {hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-mute-light">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#b23c0a]"
        >
          <SvgIcon d={errorIcon} className="shrink-0 text-base" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm({
  options,
  defaultInterest = NOT_SURE,
}: {
  options: readonly InterestOption[];
  defaultInterest?: string;
}) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Move focus to the outcome so keyboard and screen-reader users hear it
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 rounded-frame border border-line bg-white p-[clamp(24px,4vw,40px)] text-ink-dark outline-none"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-accent/15">
          <SvgIcon d={checkCircle} className="text-[28px] text-accent-light" />
        </span>
        <h2 className="text-2xl font-extrabold tracking-[-0.02em]">
          Thank you{state.name ? `, ${state.name.split(" ")[0]}` : ""}.
        </h2>
        <p className="text-[17px] leading-[1.6] text-mute-light">
          We&rsquo;ve received your message. The first step is to understand what your business
          actually needs — we&rsquo;ll be in touch to talk it through.
        </p>
      </div>
    );
  }

  const values = state.status === "error" ? state.values : undefined;
  const errors = state.status === "error" ? state.errors : undefined;

  return (
    <form
      action={formAction}
      noValidate
      className="relative flex flex-col gap-5 rounded-frame border border-line bg-white p-[clamp(24px,4vw,40px)] text-ink-dark"
    >
      {state.status === "error" ? (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-chip border border-[#f3c7b3] bg-[#fff4ee] px-4 py-3 text-sm font-medium text-[#8a2f08] outline-none"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name" required error={errors?.name}>
          {(p) => (
            <input
              {...p}
              type="text"
              autoComplete="name"
              required
              maxLength={LIMITS.name}
              defaultValue={values?.name}
            />
          )}
        </Field>
        <Field name="company" label="Business / Company" error={errors?.company}>
          {(p) => (
            <input
              {...p}
              type="text"
              autoComplete="organization"
              maxLength={LIMITS.company}
              defaultValue={values?.company}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="email" label="Email" required error={errors?.email}>
          {(p) => (
            <input
              {...p}
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={LIMITS.email}
              defaultValue={values?.email}
            />
          )}
        </Field>
        <Field name="interest" label="Service / Area of interest" required error={errors?.interest}>
          {(p) => (
            <div className="relative">
              <select
                {...p}
                required
                defaultValue={values?.interest ?? defaultInterest}
                className={`${p.className} appearance-none pr-11`}
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <SvgIcon
                d={keyboardArrowDown}
                className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xl text-mute-light"
              />
            </div>
          )}
        </Field>
      </div>

      <Field
        name="message"
        label="Message"
        required
        error={errors?.message}
        hint="What are you trying to achieve? A few sentences is plenty."
      >
        {(p) => (
          <textarea
            {...p}
            rows={6}
            required
            maxLength={LIMITS.message}
            defaultValue={values?.message}
            className={`${p.className} resize-y`}
          />
        )}
      </Field>

      {/* Spam protection: humans never see or fill this field */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input
        type="hidden"
        name="rendered_at"
        ref={(el) => {
          if (el && !el.value) el.value = String(Date.now());
        }}
      />

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={pending}
          className={buttonClasses({ className: "disabled:cursor-wait disabled:opacity-70" })}
        >
          {pending ? (
            <>
              Sending
              <SvgIcon d={progressActivity} className="animate-spin text-lg" />
            </>
          ) : (
            <>
              Send message
              <SvgIcon d={arrowForward} className="text-lg" />
            </>
          )}
        </button>
        <p className="text-[13px] text-mute-light">
          We use these details only to respond to your enquiry.
        </p>
      </div>
    </form>
  );
}
