import Image from "next/image";
import type { Product } from "@/lib/catalog/types";

/**
 * Viser produktets første billede. Mangler der godkendte billeder, vises en
 * neutral illustration af produkttypen – tydeligt markeret, så den ikke kan
 * forveksles med et foto af den konkrete model.
 */
export function ProductVisual({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  showLabel = true,
}: {
  product: Pick<Product, "slug" | "name" | "images">;
  priority?: boolean;
  sizes?: string;
  showLabel?: boolean;
}) {
  const img = product.images[0];
  if (img) {
    return (
      <Image
        src={img.url}
        alt={img.alt}
        width={img.width}
        height={img.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-sand/70 via-cream to-sage/60">
      <Illustration slug={product.slug} />
      <span className="sr-only">Illustration af produkttypen {product.name}. Produktfoto mangler.</span>
      {showLabel && (
        <span className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-medium text-muted">
          Illustration · produktfoto følger
        </span>
      )}
    </div>
  );
}

function Illustration({ slug }: { slug: string }) {
  const stroke = "#2f4a3f";
  const common = { fill: "none", stroke, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (slug) {
    case "laendemassager":
      return (
        <svg viewBox="0 0 200 200" className="h-3/5 w-3/5" aria-hidden="true">
          <ellipse cx="100" cy="150" rx="70" ry="10" fill="#d9ccb8" opacity=".5" />
          <path d="M40 120c0-30 25-50 60-50s60 20 60 50v12H40z" {...common} fill="#fffdf9" />
          <path d="M60 110c10-14 25-20 40-20s30 6 40 20" {...common} opacity=".5" />
          <circle cx="100" cy="122" r="5" fill={stroke} />
        </svg>
      );
    case "oejenmassager":
      return (
        <svg viewBox="0 0 200 200" className="h-3/5 w-3/5" aria-hidden="true">
          <path d="M30 100c0-20 20-30 70-30s70 10 70 30-15 32-40 32c-14 0-20-12-30-12s-16 12-30 12c-25 0-40-12-40-32z" {...common} fill="#fffdf9" />
          <path d="M20 95c-6 0-10 4-10 8M180 95c6 0 10 4 10 8" {...common} opacity=".6" />
          <ellipse cx="72" cy="102" rx="16" ry="8" {...common} opacity=".4" />
          <ellipse cx="128" cy="102" rx="16" ry="8" {...common} opacity=".4" />
        </svg>
      );
    case "nakkemassager":
      return (
        <svg viewBox="0 0 200 200" className="h-3/5 w-3/5" aria-hidden="true">
          <path d="M50 70c-10 30 0 70 25 80M150 70c10 30 0 70-25 80" {...common} strokeWidth={16} stroke="#fffdf9" />
          <path d="M50 70c-10 30 0 70 25 80M150 70c10 30 0 70-25 80" {...common} />
          <path d="M75 150c15 8 35 8 50 0" {...common} />
          <circle cx="100" cy="160" r="4" fill={stroke} />
        </svg>
      );
    case "haandmassager":
      return (
        <svg viewBox="0 0 200 200" className="h-3/5 w-3/5" aria-hidden="true">
          <ellipse cx="100" cy="155" rx="62" ry="9" fill="#d9ccb8" opacity=".5" />
          <path d="M45 140V95c0-25 25-40 55-40s55 15 55 40v45z" {...common} fill="#fffdf9" />
          <path d="M70 140v-30c0-12 13-20 30-20s30 8 30 20v30" {...common} opacity=".45" />
          <rect x="88" y="120" width="24" height="8" rx="4" fill={stroke} opacity=".8" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 200" className="h-3/5 w-3/5" aria-hidden="true">
          <circle cx="100" cy="90" r="42" {...common} fill="#fffdf9" />
          <path d="M100 132v35" {...common} strokeWidth={14} stroke="#fffdf9" />
          <path d="M100 132v35" {...common} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return <circle key={i} cx={100 + Math.cos(a) * 24} cy={90 + Math.sin(a) * 24} r="5" fill={stroke} opacity=".7" />;
          })}
        </svg>
      );
  }
}
