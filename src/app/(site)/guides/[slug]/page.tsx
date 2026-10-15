import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/ui/json-ld";
import { absoluteUrl, site } from "@/config/site";
import { guides } from "@/data/guides";
import { getActiveCampaigns, getProducts } from "@/lib/catalog/repository";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  return g ? pageMetadata({ title: g.seoTitle, description: g.description, path: `/guides/${g.slug}` }) : {};
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();
  const [products, campaigns] = await Promise.all([getProducts(), getActiveCampaigns()]);
  const related = products.filter((p) => guide.relatedProducts.includes(p.slug));

  return (
    <article className="container-page py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          dateModified: guide.updatedAt,
          inLanguage: "da-DK",
          mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        }}
      />
      <Breadcrumbs items={[{ name: "Købsguides", href: "/guides" }, { name: guide.title, href: `/guides/${guide.slug}` }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl font-medium">{guide.title}</h1>
        <p className="mt-4 text-lg text-muted">{guide.intro}</p>
        <p className="mt-2 text-xs text-muted">Opdateret {new Date(guide.updatedAt).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}</p>
      </header>
      <div className="prose-vellivo mt-8 max-w-3xl">
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
            {s.bullets && (
              <ul>
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <p>
          Har du spørgsmål? <Link href="/kontakt">Kontakt os</Link> eller læs vores <Link href="/faq">ofte stillede spørgsmål</Link>.
        </p>
      </div>
      {related.length > 0 && (
        <section aria-labelledby="produkter" className="mt-16">
          <h2 id="produkter" className="mb-6 text-2xl font-medium">
            Produkter nævnt i guiden
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} campaigns={campaigns} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
