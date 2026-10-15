"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { ProductVisual } from "@/components/product/product-visual";
import { LockIcon } from "@/components/ui/icons";
import type { Campaign, Product, ShippingSettings } from "@/lib/catalog/types";
import { formatDkk } from "@/lib/money";
import { describeCartError, effectivePrice, MAX_QUANTITY_PER_LINE, priceCart, shippingFor } from "@/lib/pricing";

interface Props {
  products: Product[];
  campaigns: Campaign[];
  shipping: ShippingSettings;
  mode: "cart" | "checkout";
}

/**
 * Viser kurven med priser beregnet af samme funktion som serveren bruger.
 * Den endelige pris beregnes altid igen på serveren ved checkout.
 */
export function CartView({ products, campaigns, shipping, mode }: Props) {
  const { items, ready, setQuantity, remove } = useCart();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!ready) {
    return <p className="card p-8 text-muted">Henter kurv…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-start gap-4 p-8">
        <p className="text-lg">Din kurv er tom.</p>
        <Link href="/shop" className="btn-primary">
          Se produkter
        </Link>
      </div>
    );
  }

  const lines = items.map((item) => {
    const product = products.find((p) => p.slug === item.slug) ?? null;
    const price = product ? effectivePrice(product, campaigns) : null;
    return { item, product, price };
  });
  const result = priceCart(items, products, campaigns, shipping);
  const issues = result.ok ? [] : result.errors.map(describeCartError);
  const subtotal = lines.reduce((s, l) => s + (l.price ? l.price.priceOre * l.item.quantity : 0), 0);
  const shippingOre = shippingFor(subtotal, shipping);
  const total = subtotal + shippingOre;
  const vat = Math.round(total - total / 1.25);

  async function startCheckout() {
    setError(null);
    if (!accepted) {
      setError("Du skal acceptere handelsbetingelserne for at fortsætte.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, acceptTerms: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Betalingen kunne ikke startes.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Betalingen kunne ikke startes.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <ul className="space-y-4" aria-label="Varer i kurven">
        {lines.map(({ item, product, price }) => (
          <li key={item.slug} className="card flex gap-4 p-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              {product && <ProductVisual product={product} sizes="96px" showLabel={false} />}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {product ? (
                    <Link href={`/produkter/${product.slug}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                  ) : (
                    <span className="font-medium">Produktet findes ikke længere</span>
                  )}
                  {price && <p className="text-sm text-muted">{formatDkk(price.priceOre)} pr. stk.</p>}
                </div>
                <p className="font-semibold">{price ? formatDkk(price.priceOre * item.quantity) : "–"}</p>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-3">
                <label className="sr-only" htmlFor={`antal-${item.slug}`}>
                  Antal af {product?.name ?? item.slug}
                </label>
                <select
                  id={`antal-${item.slug}`}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.slug, Number(e.target.value))}
                  className="h-11 rounded-full border border-sand-dark bg-paper px-4 text-sm"
                >
                  {Array.from({ length: MAX_QUANTITY_PER_LINE }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} stk.
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => remove(item.slug)} className="min-h-11 text-sm text-muted underline underline-offset-4 hover:text-danger">
                  Fjern
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section aria-labelledby="opsummering" className="card h-fit space-y-4 p-6">
        <h2 id="opsummering" className="text-xl font-medium">
          Opsummering
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatDkk(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Fragt ({shipping.label})</dt>
            <dd>{shippingOre === 0 ? "Gratis" : formatDkk(shippingOre)}</dd>
          </div>
          {shipping.freeThresholdOre !== null && shippingOre > 0 && (
            <p className="text-xs text-muted">Gratis fragt ved køb over {formatDkk(shipping.freeThresholdOre)}.</p>
          )}
          <div className="flex justify-between border-t border-sand pt-3 text-base font-semibold">
            <dt>I alt</dt>
            <dd>{formatDkk(total)}</dd>
          </div>
          <div className="flex justify-between text-xs text-muted">
            <dt>Heraf moms (25 %)</dt>
            <dd>{formatDkk(vat)}</dd>
          </div>
        </dl>

        {issues.length > 0 ? (
          <div role="alert" className="space-y-2 rounded-xl bg-warning-bg p-4 text-sm text-warning">
            {issues.map((i) => (
              <p key={i}>{i}</p>
            ))}
            <p>Fjern eller ret varerne ovenfor for at fortsætte.</p>
          </div>
        ) : mode === "cart" ? (
          <Link href="/checkout" className="btn-primary w-full">
            Gå til kassen
          </Link>
        ) : (
          <div className="space-y-4">
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-forest" />
              <span>
                Jeg accepterer Vellivos{" "}
                <Link href="/handelsbetingelser" className="underline underline-offset-4" target="_blank">
                  handelsbetingelser
                </Link>{" "}
                og har læst{" "}
                <Link href="/privatlivspolitik" className="underline underline-offset-4" target="_blank">
                  privatlivspolitikken
                </Link>
                .
              </span>
            </label>
            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}
            <button type="button" onClick={startCheckout} disabled={submitting} className="btn-primary w-full">
              <LockIcon width={18} height={18} />
              {submitting ? "Sender dig til betaling…" : `Gå til sikker betaling · ${formatDkk(total)}`}
            </button>
            <p className="text-xs text-muted">Du gennemfører betalingen hos Stripe. Leveringsadresse og betaling indtastes på næste side.</p>
          </div>
        )}
      </section>
    </div>
  );
}
