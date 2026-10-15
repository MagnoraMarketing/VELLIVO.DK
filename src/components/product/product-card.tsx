import Link from "next/link";
import type { Campaign, Product } from "@/lib/catalog/types";
import { effectivePrice } from "@/lib/pricing";
import { Price } from "@/components/product/price";
import { ProductVisual } from "@/components/product/product-visual";
import { StatusBadge } from "@/components/product/status-badge";

export function ProductCard({ product, campaigns, priority = false }: { product: Product; campaigns: Campaign[]; priority?: boolean }) {
  const price = effectivePrice(product, campaigns);
  return (
    <article className="group card relative flex flex-col overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]">
          <ProductVisual product={product} priority={priority} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-medium">
            <Link href={`/produkter/${product.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {product.name}
            </Link>
          </h3>
          <StatusBadge product={product} />
        </div>
        <p className="text-sm text-muted">{product.tagline}</p>
        <div className="mt-auto pt-2">
          <Price price={price} draft={product.status !== "published"} />
          <p className="mt-0.5 text-xs text-muted">inkl. moms</p>
        </div>
      </div>
    </article>
  );
}
