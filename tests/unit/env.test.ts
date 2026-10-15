import { afterEach, describe, expect, it } from "vitest";
import { allowLocalStore, isBlobConfigured, isStripeConfigured, MissingEnvError, stripeEnv, stripeMode } from "@/lib/env";

const env = process.env as Record<string, string | undefined>;
const original = { ...env };
afterEach(() => {
  for (const k of Object.keys(env)) if (!(k in original)) delete env[k];
  Object.assign(env, original);
});

describe("miljøvariabler", () => {
  it("kaster en tydelig fejl, når Stripe mangler", () => {
    delete env.STRIPE_SECRET_KEY;
    delete env.STRIPE_WEBHOOK_SECRET;
    expect(isStripeConfigured()).toBe(false);
    expect(() => stripeEnv()).toThrow(MissingEnvError);
  });

  it("afviser forkert formaterede nøgler og registrerer test/live", () => {
    env.STRIPE_SECRET_KEY = "pk_test_forkert";
    env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    expect(isStripeConfigured()).toBe(false);
    env.STRIPE_SECRET_KEY = "sk_test_abc";
    expect(isStripeConfigured()).toBe(true);
    expect(stripeMode()).toBe("test");
    env.STRIPE_SECRET_KEY = "sk_live_abc";
    expect(stripeMode()).toBe("live");
  });

  it("kræver Vercel Blob i produktion – lokal lagring kun under udvikling", () => {
    delete env.BLOB_READ_WRITE_TOKEN;
    expect(isBlobConfigured()).toBe(false);
    env.NODE_ENV = "production";
    delete env.VELLIVO_LOCAL_STORE;
    expect(allowLocalStore()).toBe(false);
    env.NODE_ENV = "development";
    expect(allowLocalStore()).toBe(true);
  });
});
