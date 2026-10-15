"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductVisual } from "@/components/product/product-visual";
import type { Product } from "@/lib/catalog/types";

/** Produktgalleri med stort billede og klikbare miniaturer. */
export function ProductGallery({ product }: { product: Pick<Product, "slug" | "name" | "images"> }) {
  const [active, setActive] = useState(0);
  const images = product.images;
  if (images.length === 0) {
    return (
      <div className="card aspect-square overflow-hidden">
        <ProductVisual product={product} priority sizes="(min-width: 1024px) 55vw, 100vw" />
      </div>
    );
  }
  const current = images[Math.min(active, images.length - 1)];
  return (
    <div className="space-y-3">
      <div className="card relative aspect-square overflow-hidden bg-paper">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          priority={active === 0}
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain"
        />
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6" aria-label="Vælg billede">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Vis billede ${i + 1} af ${images.length}`}
                aria-current={i === active ? "true" : undefined}
                className={`relative block aspect-square w-full overflow-hidden rounded-xl bg-paper ring-2 transition ${
                  i === active ? "ring-forest" : "ring-transparent hover:ring-sand-dark"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
