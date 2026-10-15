import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { guides } from "@/data/guides";
import { getActiveCampaigns, getCategories, getCategoryBySlug, getProducts } from "@/lib/catalog/repository";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return pageMetadata({ title: category.seoTitle, description: category.seoDescription, path: `/kategori/${category.slug}` });
}

export default async function CategoryPage({ params }: PageProps<"/kategori/[slug]">) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const [products, campaigns, categories] = await Promise.all([getProducts(), getActiveCampaigns(), getCategories()]);
  const inCategory = products.filter((p) => p.categorySlug === category.slug);
  const relatedGuides = guides.filter((g) => g.relatedProducts.some((s) => inCategory.some((p) => p.slug === s)));

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Shop", href: "/shop" }, { name: category.name, href: `/kategori/${category.slug}` }]} />
      <header className="mt-6 mb-10 max-w-2xl">
        <h1 className="text-4xl font-medium">{category.name}</h1>
        <p className="mt-3 text-muted">{category.intro}</p>
      </header>
      {inCategory.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inCategory.map((p, i) => (
            <ProductCard key={p.id} product={p} campaigns={campaigns} priority={i < 3} />
          ))}
        </div>
      ) : (
        <p className="card p-8 text-muted">
          Der er endnu ingen produkter i denne kategori.{" "}
          <Link href="/shop" className="font-medium text-forest underline">
            Se hele sortimentet
          </Link>
          .
        </p>
      )}
      {relatedGuides.length > 0 && (
        <section aria-labelledby="guides" className="mt-16">
          <h2 id="guides" className="mb-4 text-2xl font-medium">
            Guides til at vælge
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {relatedGuides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="card block p-6 hover:bg-sage/40">
                  <span className="font-serif text-lg">{g.title}</span>
                  <span className="mt-1 block text-sm text-muted">{g.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <nav aria-label="Andre kategorier" className="mt-16 border-t border-sand pt-8">
        <h2 className="mb-3 font-sans text-sm font-semibold tracking-normal">Andre kategorier</h2>
        <ul className="flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <li key={c.id}>
                <Link href={`/kategori/${c.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-sand-dark bg-paper px-4 text-sm hover:border-forest">
                  {c.name}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
}
