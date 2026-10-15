"use server";

import { z } from "zod";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/consent";
import { createHash } from "node:crypto";
import { sortableId } from "@/lib/data/ids";
import { isStoreWritable } from "@/lib/env";
import { getStore, StoreConflictError } from "@/lib/store";

export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
}

const newsletterSchema = z.object({
  email: z.email({ error: "Indtast en gyldig e-mailadresse." }).max(254),
  consent: z.literal("on", { error: "Du skal give samtykke for at tilmelde dig." }),
  website: z.string().max(0).optional(), // honeypot
});

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    consent: formData.get("consent") ?? undefined,
    website: String(formData.get("website") ?? ""),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] = i.message;
    if (fieldErrors.website) return { status: "success", message: "Tak for din tilmelding." };
    return { status: "error", message: "Tjek venligst felterne.", fieldErrors };
  }
  if (!isStoreWritable()) {
    return { status: "error", message: "Tilmelding er midlertidigt utilgængelig. Prøv igen senere." };
  }
  const email = parsed.data.email.toLowerCase();
  // Filnavnet er en hash af e-mailen, så samme adresse kun gemmes én gang.
  const key = createHash("sha256").update(email).digest("hex").slice(0, 32);
  try {
    await getStore().putJson(
      `newsletter/${key}.json`,
      {
        email,
        status: "subscribed",
        consentText: NEWSLETTER_CONSENT_TEXT,
        consentAt: new Date().toISOString(),
        source: String(formData.get("source") ?? "website").slice(0, 60),
      },
      { onlyIfNew: true },
    );
  } catch (err) {
    // Allerede tilmeldt – vi afslører ikke, om adressen findes.
    if (!(err instanceof StoreConflictError)) {
      console.error("[newsletter]", err);
      return { status: "error", message: "Noget gik galt. Prøv igen senere." };
    }
  }
  return { status: "success", message: "Tak! Du er nu tilmeldt Vellivos nyhedsbrev." };
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Skriv dit navn.").max(120),
  email: z.email({ error: "Indtast en gyldig e-mailadresse." }).max(254),
  subject: z.string().trim().max(160).optional(),
  orderReference: z.string().trim().max(40).optional(),
  message: z.string().trim().min(5, "Skriv en besked (mindst 5 tegn).").max(5000, "Beskeden er for lang."),
  website: z.string().max(0).optional(),
});

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    subject: String(formData.get("subject") ?? "") || undefined,
    orderReference: String(formData.get("orderReference") ?? "") || undefined,
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] = i.message;
    if (fieldErrors.website) return { status: "success", message: "Tak for din besked." };
    return { status: "error", message: "Tjek venligst de markerede felter.", fieldErrors };
  }
  if (!isStoreWritable()) {
    return { status: "error", message: "Kontaktformularen er midlertidigt utilgængelig." };
  }
  try {
    await getStore().putJson(
      `contact/${sortableId()}.json`,
      {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject ?? null,
        orderReference: parsed.data.orderReference ?? null,
        message: parsed.data.message,
        receivedAt: new Date().toISOString(),
      },
      { onlyIfNew: true },
    );
  } catch (err) {
    console.error("[contact]", err);
    return { status: "error", message: "Beskeden kunne ikke sendes. Prøv igen senere." };
  }
  return { status: "success", message: "Tak for din besked. Vi vender tilbage hurtigst muligt." };
}
