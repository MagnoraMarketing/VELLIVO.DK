import "server-only";
import { z } from "zod";

/**
 * Server-side validering af miljøvariabler. Funktionerne kaster en tydelig fejl,
 * hvis en påkrævet variabel mangler, så fejlen opdages ved første kald.
 */

const stripeSchema = z.object({
  STRIPE_SECRET_KEY: z
    .string()
    .regex(/^(sk|rk)_(test|live)_/, "STRIPE_SECRET_KEY skal starte med sk_test_, sk_live_, rk_test_ eller rk_live_"),
  STRIPE_WEBHOOK_SECRET: z.string().regex(/^whsec_/, "STRIPE_WEBHOOK_SECRET skal starte med whsec_"),
});

const adminSchema = z.object({
  ADMIN_PASSWORD: z.string().min(12, "ADMIN_PASSWORD skal være mindst 12 tegn"),
  ADMIN_SESSION_SECRET: z.string().min(32, "ADMIN_SESSION_SECRET skal være mindst 32 tegn"),
});

const blobSchema = z.object({
  BLOB_READ_WRITE_TOKEN: z.string().min(20),
});

export class MissingEnvError extends Error {
  constructor(group: string, issues: string) {
    super(`Manglende eller ugyldige miljøvariabler (${group}): ${issues}`);
    this.name = "MissingEnvError";
  }
}

function parse<T extends z.ZodType>(schema: T, group: string): z.infer<T> {
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new MissingEnvError(group, issues);
  }
  return result.data;
}

export const stripeEnv = () => parse(stripeSchema, "Stripe");
export const adminEnv = () => parse(adminSchema, "Admin");
export const blobEnv = () => parse(blobSchema, "Vercel Blob");

export const isStripeConfigured = () => stripeSchema.safeParse(process.env).success;
export const isAdminConfigured = () => adminSchema.safeParse(process.env).success;
export const isBlobConfigured = () => blobSchema.safeParse(process.env).success;

/** Lokal fil-lagring er kun tilladt uden for produktion (udvikling og test). */
export const allowLocalStore = () => process.env["NODE_ENV"] !== "production" || process.env.VELLIVO_LOCAL_STORE === "1";

/** Kan webshoppen gemme data (ordrer, formularer, adminændringer)? */
export const isStoreWritable = () => isBlobConfigured() || allowLocalStore();

export function stripeMode(): "test" | "live" | "unconfigured" {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (/_live_/.test(key)) return "live";
  if (/_test_/.test(key)) return "test";
  return "unconfigured";
}
