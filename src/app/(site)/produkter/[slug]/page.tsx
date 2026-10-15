import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { AddToCart } from "@/components/product/add-to-cart";
import { Price } from "@/components/product/price";
import { ProductCard } from "@/components/product/product-card";
import { ProductVisual } from "@/components/product/product-visual";
import { availability, StatusBadge } from "@/components/product/status-badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LockIcon, ReturnIcon, TruckIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/ui/json-ld";
import { site } from "@/config/site";
import { guides } from "@/data/guides";
import { getActiveCampaigns, getCatalogProducts, getCategories, getProductBySlug, getProducts, getShippingSettings } from "@/lib/catalog/repository";
import { formatDkk } from "@/lib/money";
import { effectivePrice } from "@/lib/pricing";
import { pageMetadata, productJsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  return getCatalogProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produkter/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/produkter/${product.slug}`,
    // Kladder indekseres ikke, før de er godkendt og kan købes.
    noindex: product.status !== "published",
    images: product.images.slice(0, 1).map((i) => ({ url: i.url, alt: i.alt })),
  });
}

export default async function ProductPage({ params }: PageProps<"/produkter/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [products, categories, campaigns, shipping] = await Promise.all([getProducts(), getCategories(), getActiveCampaigns(), getShippingSettings()]);
  const category = categories.find((c) => c.slug === product.categorySlug);
  const price = effectivePrice(product, campaigns);
  const avail = availability(product);
  const isDraft = product.status !== "published";
  const related = products.filter((p) => p.id !== product.id).sort((a, b) => Number(b.categorySlug === product.categorySlug) - Number(a.categorySlug === product.categorySlug)).slice(0, 3);
  const relatedGuides = guides.filter((g) => g.relatedProducts.includes(product.slug));
  const schema = productJsonLd(product, price);

  return (
    <div className="container-page py-10">
      {schema && <JsonLd data={schema} />}
      <Breadcrumbs
        items={[
          { name: "Shop", href: "/shop" },
          ...(category ? [{ name: category.name, href: `/kategori/${category.slug}` }] : []),
          { name: product.name, href: `/produkter/${product.slug}` },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Galleri */}
        <section aria-label="Produktbilleder" className="space-y-3">
          <div className="card aspect-square overflow-hidden">
            <ProductVisual product={product} priority sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          {product.images.length > 1 && (
            <ul className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((img) => (
                <li key={img.url} className="card aspect-square overflow-hidden">
                  <ProductVisual product={{ ...product, images: [img] }} sizes="15vw" />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Købsboks */}
        <section aria-labelledby="produktnavn" className="space-y-6">
          <div className="space-y-3">
            <StatusBadge product={product} />
            <h1 id="produktnavn" className="text-4xl font-medium">
              {product.name}
            </h1>
            <p className="text-lg text-muted">{product.tagline}</p>
          </div>
          <div>
            <Price price={price} size="lg" draft={isDraft} />
            <p className="mt-1 text-sm text-muted">
              Inkl. 25 % moms.{" "}
              {shipping.freeThresholdOre !== null && price.priceOre >= shipping.freeThresholdOre
                ? "Gratis levering i Danmark."
                : `Fragt ${formatDkk(shipping.flatRateOre)}${shipping.freeThresholdOre !== null ? ` – gratis over ${formatDkk(shipping.freeThresholdOre)}` : ""}.`}
            </p>
            {isDraft && <p className="mt-2 text-sm text-muted">Prisen er foreløbig og kan ændre sig før lancering.</p>}
          </div>
          <p className="leading-relaxed">{product.shortDescription}</p>
          <AddToCart
            slug={product.slug}
            name={product.name}
            purchasable={avail.purchasable}
            stock={product.stock}
            reason={
              isDraft
                ? `${product.name} er endnu ikke til salg. Vi åbner for salg, når producentens dokumentation, billeder og sikkerhedsinformation er gennemgået.`
                : `${product.name} er desværre udsolgt lige nu.`
            }
          />
          <ul className="grid gap-3 border-t border-sand pt-6 text-sm text-muted sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <TruckIcon width={18} height={18} className="shrink-0 text-forest" /> Levering i Danmark
            </li>
            <li className="flex items-center gap-2">
              <ReturnIcon width={18} height={18} className="shrink-0 text-forest" /> {site.terms.withdrawalDays} dages fortrydelsesret
            </li>
            <li className="flex items-center gap-2">
              <LockIcon width={18} height={18} className="shrink-0 text-forest" /> Sikker betaling
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          <section aria-labelledby="beskrivelse">
            <h2 id="beskrivelse" className="mb-4 text-2xl font-medium">
              Om {product.name}
            </h2>
            <div className="space-y-4 leading-relaxed text-muted">
              {product.description.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </section>

          {product.features.length > 0 && (
            <section aria-labelledby="funktioner">
              <h2 id="funktioner" className="mb-4 text-2xl font-medium">
                Det får du
              </h2>
              <ul className="grid gap-4 sm:grid-cols-3">
                {product.features.map((f) => (
                  <li key={f.title} className="card p-5">
                    <h3 className="font-sans text-base font-semibold tracking-normal">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted">{f.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="specifikationer">
            <h2 id="specifikationer" className="mb-4 text-2xl font-medium">
              Tekniske specifikationer
            </h2>
            {product.specs.some((s) => s.value === null) && (
              <p className="mb-4 rounded-xl bg-warning-bg px-4 py-3 text-sm text-warning">
                Felter markeret “Afventer verificering” er endnu ikke bekræftet af producenten. Vi udfylder dem, når dokumentationen er
                gennemgået.
              </p>
            )}
            <dl className="divide-y divide-sand overflow-hidden rounded-[var(--radius-card)] bg-paper">
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[1fr_1.2fr] gap-4 px-5 py-3 text-sm">
                  <dt className="font-medium">{s.label}</dt>
                  <dd className={s.value ? "text-ink" : "text-muted italic"}>{s.value ?? "Afventer verificering"}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="betjening">
            <h2 id="betjening" className="mb-4 text-2xl font-medium">
              Betjening
            </h2>
            <ol className="list-decimal space-y-2 pl-5 text-muted">
              {product.usage.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="indhold">
            <h2 id="indhold" className="mb-4 text-2xl font-medium">
              Indhold i æsken
            </h2>
            {product.inBox ? (
              <ul className="list-disc space-y-1 pl-5 text-muted">
                {product.inBox.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted italic">Afventer verificering fra producenten.</p>
            )}
          </section>

          <section aria-labelledby="sikkerhed">
            <h2 id="sikkerhed" className="mb-4 text-2xl font-medium">
              Sikkerhedsinformation
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-muted">
              {product.safety.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              {product.name} er et velværeprodukt til hjemmebrug og ikke medicinsk udstyr. Det er ikke beregnet til at diagnosticere,
              behandle eller helbrede sygdomme.
            </p>
          </section>

          {product.faq.length > 0 && (
            <section aria-labelledby="produkt-faq">
              <h2 id="produkt-faq" className="mb-4 text-2xl font-medium">
                Spørgsmål og svar
              </h2>
              <div className="divide-y divide-sand rounded-[var(--radius-card)] bg-paper px-6">
                {product.faq.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                      {f.q}
                      <span className="text-xl text-forest transition-transform group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section aria-labelledby="levering" className="card p-6">
            <h2 id="levering" className="mb-3 font-sans text-base font-semibold tracking-normal">
              Levering og retur
            </h2>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                Fragt: {formatDkk(shipping.flatRateOre)}
                {shipping.freeThresholdOre !== null && ` (gratis over ${formatDkk(shipping.freeThresholdOre)})`}.
              </li>
              <li>Leveringstid: {site.terms.deliveryTime ?? "oplyses ved lancering"}.</li>
              <li>{site.terms.withdrawalDays} dages fortrydelsesret og {site.terms.complaintYears} års reklamationsret.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href="/levering" className="font-medium text-forest underline underline-offset-4">
                Om levering
              </Link>
              <Link href="/retur-og-fortrydelsesret" className="font-medium text-forest underline underline-offset-4">
                Om retur
              </Link>
            </div>
          </section>
          {relatedGuides.length > 0 && (
            <section aria-labelledby="guide-links" className="card p-6">
              <h2 id="guide-links" className="mb-3 font-sans text-base font-semibold tracking-normal">
                Købsguides
              </h2>
              <ul className="space-y-2 text-sm">
                {relatedGuides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}`} className="text-forest underline underline-offset-4">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {isDraft && (
            <section id="nyhedsbrev" aria-labelledby="nyhed" className="card scroll-mt-24 p-6">
              <h2 id="nyhed" className="mb-3 font-sans text-base font-semibold tracking-normal">
                Få besked ved lancering
              </h2>
              <NewsletterForm source={`produkt-${product.slug}`} />
            </section>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relaterede" className="mt-20">
          <h2 id="relaterede" className="mb-6 text-2xl font-medium">
            Relaterede produkter
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} campaigns={campaigns} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
