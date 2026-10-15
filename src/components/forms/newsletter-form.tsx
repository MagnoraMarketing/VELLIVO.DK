"use client";

import Link from "next/link";
import { useActionState } from "react";
import { subscribeNewsletter, type FormState } from "@/lib/actions/public";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/consent";

const initial: FormState = { status: "idle", message: "" };

export function NewsletterForm({ source = "website" }: { source?: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);
  if (state.status === "success") {
    return (
      <p role="status" className="rounded-2xl bg-sage px-5 py-4 font-medium text-forest">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="source" value={source} />
      <div className="hidden" aria-hidden="true">
        <label>
          Lad dette felt være tomt
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={`nl-email-${source}`} className="sr-only">
            E-mail
          </label>
          <input
            id={`nl-email-${source}`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Din e-mail"
            className="input"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? `nl-email-err-${source}` : undefined}
          />
          {state.fieldErrors?.email && (
            <p id={`nl-email-err-${source}`} className="mt-1 text-sm text-danger">
              {state.fieldErrors.email}
            </p>
          )}
        </div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Tilmelder…" : "Tilmeld"}
        </button>
      </div>
      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-forest" aria-invalid={Boolean(state.fieldErrors?.consent)} />
          <span>
            {NEWSLETTER_CONSENT_TEXT} Læs vores{" "}
            <Link href="/privatlivspolitik" className="underline underline-offset-4">
              privatlivspolitik
            </Link>
            .
          </span>
        </label>
        {state.fieldErrors?.consent && <p className="mt-1 text-sm text-danger">{state.fieldErrors.consent}</p>}
      </div>
      {state.status === "error" && !state.fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
    </form>
  );
}
