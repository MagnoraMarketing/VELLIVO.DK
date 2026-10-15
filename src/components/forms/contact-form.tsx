"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/lib/actions/public";

const initial: FormState = { status: "idle", message: "" };

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const e = state.fieldErrors ?? {};
  if (state.status === "success") {
    return (
      <p role="status" className="rounded-2xl bg-sage px-5 py-4 font-medium text-forest">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="space-y-5" noValidate>
      <div className="hidden" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Navn" error={e.name}>
          <input id="name" name="name" autoComplete="name" required className="input" aria-invalid={Boolean(e.name)} aria-describedby={e.name ? "name-err" : undefined} />
        </Field>
        <Field id="email" label="E-mail" error={e.email}>
          <input id="email" name="email" type="email" autoComplete="email" required className="input" aria-invalid={Boolean(e.email)} aria-describedby={e.email ? "email-err" : undefined} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="subject" label="Emne (valgfrit)">
          <input id="subject" name="subject" className="input" />
        </Field>
        <Field id="orderReference" label="Ordrenummer (valgfrit)">
          <input id="orderReference" name="orderReference" className="input" />
        </Field>
      </div>
      <Field id="message" label="Besked" error={e.message}>
        <textarea id="message" name="message" rows={6} required className="input" aria-invalid={Boolean(e.message)} aria-describedby={e.message ? "message-err" : undefined} />
      </Field>
      <p className="text-xs text-muted">Vi bruger dine oplysninger til at besvare din henvendelse. Læs mere i vores privatlivspolitik.</p>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Sender…" : "Send besked"}
      </button>
    </form>
  );
}
