import { formatDkk } from "@/lib/money";
import type { EffectivePrice } from "@/lib/pricing";

export function Price({ price, size = "md", draft = false }: { price: EffectivePrice; size?: "md" | "lg"; draft?: boolean }) {
  const main = size === "lg" ? "text-3xl" : "text-lg";
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {draft && <span className="text-sm text-muted">Forventet pris</span>}
      <span className={`${main} font-semibold text-ink`}>{formatDkk(price.priceOre)}</span>
      {price.referencePriceOre !== null && (
        <span className="text-sm text-muted">
          <span className="sr-only">Laveste pris de seneste 30 dage:</span>
          <s>{formatDkk(price.referencePriceOre)}</s>
        </span>
      )}
      {price.campaign && (
        <span className="rounded-full bg-clay/15 px-2 py-0.5 text-xs font-semibold text-[#7a4a33]">
          {price.campaign.name} −{price.campaign.discountPercent}%
        </span>
      )}
    </div>
  );
}
