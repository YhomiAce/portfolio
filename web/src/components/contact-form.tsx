"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/contact/action";
import { HONEYPOT_FIELD, type ContactState } from "@/lib/contact/schema";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-base text-fg placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-red-500";

/** Contact form wired to the `sendMessage` server action, with inline errors and a success state. */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-3 py-6">
        <p className="text-2xl font-semibold tracking-tight">Thanks, message received.</p>
        <p className="text-muted">I read every message and usually reply within a couple of days.</p>
      </div>
    );
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.status === "error" ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass}
          />
          {errors.name ? (
            <p id="contact-name-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass}
          />
          {errors.email ? (
            <p id="contact-email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="contact-body" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-body"
          name="body"
          rows={5}
          required
          maxLength={5000}
          defaultValue={values.body}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? "contact-body-error" : undefined}
          className={`${inputClass} resize-y`}
        />
        {errors.body ? (
          <p id="contact-body-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors.body}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>Leave this empty</label>
        <input id={`contact-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-medium text-accent-fg shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
