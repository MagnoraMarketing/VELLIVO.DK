"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/cart-context";

/** Tømmer kurven, når betalingen er gennemført. */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
