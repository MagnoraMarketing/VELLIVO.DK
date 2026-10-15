import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getActiveCampaigns, getCategories, getProducts } from "@/lib/catalog/repository";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Shop – alle massageapparater",
  description: "Se Vellivos lændemassager og øjenmassagere med varme, massage og Bluetooth. Priser i DKK inkl. moms.",
  path: "/shop",
});

export default async function ShopPage() {
  const [products, categories, campaigns] = await Promise.all([getProducts(), getCategories(), getActiveCampaigns()]);
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Shop", href: "/shop" }]} />
      <header className="mt-6 mb-8 max-w-2xl">
        <h1 className="text-4xl font-medium">Alle produkter</h1>
        <p className="mt-3 text-muted">
          Vellivos sortiment består af en lændemassager og tre øjenmassagere til hjemmet. Alle priser er i DKK inkl. 25 % moms.
        </p>
      </header>
      <nav aria-label="Kategorier" className="mb-8">
        <ul className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/kategori/${c.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-sand-dark bg-paper px-4 text-sm font-medium hover:border-forest">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} campaigns={campaigns} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
