"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MAX_LINES, MAX_QUANTITY_PER_LINE, type CartLineInput } from "@/lib/pricing";

/**
 * Kurven gemmer KUN produkt-slug og antal i localStorage (nødvendig funktion,
 * ikke sporing). Priser hentes altid fra serveren.
 */
const STORAGE_KEY = "vellivo-cart-v1";

interface CartContextValue {
  items: CartLineInput[];
  count: number;
  ready: boolean;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function sanitize(raw: unknown): CartLineInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (l): l is CartLineInput =>
        typeof l === "object" && l !== null && typeof l.slug === "string" && /^[a-z0-9-]{1,80}$/.test(l.slug) && Number.isInteger(l.quantity),
    )
    .map((l) => ({ slug: l.slug, quantity: Math.min(MAX_QUANTITY_PER_LINE, Math.max(1, l.quantity)) }))
    .slice(0, MAX_LINES);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineInput[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let initial: CartLineInput[] = [];
    try {
      initial = sanitize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]"));
    } catch {
      initial = [];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- engangsindlæsning fra localStorage efter hydrering
    setItems(initial);
    setLoaded(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setItems(sanitize(JSON.parse(e.newValue ?? "[]")));
        } catch {
          setItems([]);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Privat browsing e.l. – kurven virker stadig i den aktuelle fane.
    }
  }, [items, loaded]);

  const add = useCallback((slug: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, quantity: Math.min(MAX_QUANTITY_PER_LINE, l.quantity + quantity) } : l));
      }
      if (prev.length >= MAX_LINES) return prev;
      return [...prev, { slug, quantity: Math.min(MAX_QUANTITY_PER_LINE, quantity) }];
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, quantity: Math.min(MAX_QUANTITY_PER_LINE, quantity) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((s, l) => s + l.quantity, 0),
      ready: loaded,
      add,
      setQuantity,
      remove,
      clear,
    }),
    [items, loaded, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart skal bruges inden for CartProvider");
  return ctx;
}
