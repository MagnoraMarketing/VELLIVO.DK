"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { CheckIcon } from "@/components/ui/icons";
import { MAX_QUANTITY_PER_LINE } from "@/lib/pricing";

export function AddToCart({ slug, name, purchasable, stock, reason }: { slug: string; name: string; purchasable: boolean; stock: number; reason: string }) {
  const { add } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const max = Math.max(1, Math.min(MAX_QUANTITY_PER_LINE, stock));

  if (!purchasable) {
    // Ingen inaktive købsknapper: forklar status og tilbyd et reelt alternativ.
    return (
      <div className="space-y-3 rounded-2xl border border-sand bg-paper p-5">
        <p className="text-sm text-muted">{reason}</p>
        <Link href="#nyhedsbrev" className="btn-secondary w-full sm:w-auto">
          Få besked, når {name} kan købes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="antal" className="label">
            Antal
          </label>
          <div className="flex h-12 items-center rounded-full border border-sand-dark bg-paper">
            <button type="button" className="h-12 w-12 rounded-full text-lg hover:bg-sand/60" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Færre">
              −
            </button>
            <input
              id="antal"
              type="number"
              inputMode="numeric"
              min={1}
              max={max}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(max, Math.max(1, Number(e.target.value) || 1)))}
              className="w-12 [appearance:textfield] bg-transparent text-center font-semibold [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button type="button" className="h-12 w-12 rounded-full text-lg hover:bg-sand/60" onClick={() => setQuantity((q) => Math.min(max, q + 1))} aria-label="Flere">
              +
            </button>
          </div>
        </div>
        <button
          type="button"
          className="btn-primary h-12 flex-1"
          onClick={() => {
            add(slug, quantity);
            setAdded(true);
          }}
        >
          Læg i kurv
        </button>
        <button
          type="button"
          className="btn-secondary h-12 flex-1"
          onClick={() => {
            add(slug, quantity);
            router.push("/checkout");
          }}
        >
          Køb nu
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-6 text-sm text-forest">
        {added && (
          <span className="inline-flex items-center gap-1.5">
            <CheckIcon width={16} height={16} /> {name} er lagt i kurven.{" "}
            <Link href="/kurv" className="font-semibold underline underline-offset-4">
              Se kurv
            </Link>
          </span>
        )}
      </p>
    </div>
  );
}
