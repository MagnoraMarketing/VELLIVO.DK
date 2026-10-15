import type { Product } from "@/lib/catalog/types";

export function availability(product: Pick<Product, "status" | "stock">): {
  label: string;
  tone: "ok" | "low" | "out" | "soon";
  purchasable: boolean;
} {
  if (product.status !== "published") return { label: "Kommer snart", tone: "soon", purchasable: false };
  if (product.stock <= 0) return { label: "Udsolgt", tone: "out", purchasable: false };
  if (product.stock <= 5) return { label: "Få på lager", tone: "low", purchasable: true };
  return { label: "På lager", tone: "ok", purchasable: true };
}

const tones = {
  ok: "bg-sage text-forest",
  low: "bg-warning-bg text-warning",
  out: "bg-sand text-muted",
  soon: "bg-sand text-ink",
};

export function StatusBadge({ product }: { product: Pick<Product, "status" | "stock"> }) {
  const a = availability(product);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[a.tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {a.label}
    </span>
  );
}
