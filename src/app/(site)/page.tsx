import Link from "next/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { ProductCard } from "@/components/product/product-card";
import { ProductVisual } from "@/components/product/product-visual";
import { Price } from "@/components/product/price";
import { JsonLd } from "@/components/ui/json-ld";
import { InfoIcon, LeafIcon, LockIcon, ReturnIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";
import { absoluteUrl, site } from "@/config/site";
import { siteFaq } from "@/data/faq";
import { guides } from "@/data/guides";
import { getActiveCampaigns, getCategories, getProducts, getShippingSettings } from "@/lib/catalog/repository";
import { formatDkk } from "@/lib/money";
import { effectivePrice } from "@/lib/pricing";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Vellivo – massageapparater og wellness til hjemmet",
  description:
    "Vellivo er en dansk webshop med lændemassager og øjenmassagere med varme. Priser i DKK inkl. moms og ærlig produktinformation.",
  path: "/",
});

const categoryCopy: Record<string, string> = {
  "ryg-og-laend": "Til en rolig pause for lænden – i sofaen eller sengen.",
  oejenmassagere: "Varme, luftkompression og Bluetooth-musik – til skærmpausen.",
};

export default async function HomePage() {
  const [products, categories, campaigns, shipping] = await Promise.all([
    getProducts(),
    getCategories(),
    getActiveCampaigns(),
    getShippingSettings(),
  ]);
  const hero = products.find((p) => p.slug === "laendemassager") ?? products[0];
  const heroPrice = hero ? effectivePrice(hero, campaigns) : null;
  const featured = products.filter((p) => p.id !== hero?.id);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: absoluteUrl("/"), inLanguage: "da-DK" }} />

      {/* 1–4: Hero med tagline, hovedprodukt og CTA */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div className="fade-up space-y-6">
            <p className="eyebrow">Dansk wellness til hjemmet</p>
            <h1 className="text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl">
              Mere velvære <em className="text-forest not-italic">i hverdagen</em>
            </h1>
            <p className="max-w-md text-lg text-muted">
              Lændemassager og øjenmassagere med varme, massage og Bluetooth – udvalgt med omtanke, forklaret ærligt og med klare priser i
              DKK inkl. moms.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Se alle produkter
              </Link>
              {hero && (
                <Link href={`/produkter/${hero.slug}`} className="btn-secondary">
                  Mød {hero.name}
                </Link>
              )}
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <ReturnIcon width={18} height={18} className="text-forest" /> 14 dages fortrydelsesret
              </li>
              <li className="flex items-center gap-2">
                <LockIcon width={18} height={18} className="text-forest" /> Sikker betaling
              </li>
              <li className="flex items-center gap-2">
                <TruckIcon width={18} height={18} className="text-forest" /> Levering i Danmark
              </li>
            </ul>
          </div>
          {hero && heroPrice && (
            <div className="fade-up relative">
              <div className="card overflow-hidden">
                <div className="aspect-[4/3]">
                  <ProductVisual product={hero} priority sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="eyebrow">Hovedprodukt</p>
                    <p className="font-serif text-2xl">{hero.name}</p>
                    <p className="text-sm text-muted">{hero.tagline}</p>
                  </div>
                  <div className="text-right">
                    <Price price={heroPrice} draft={hero.status !== "published"} />
                    <p className="text-xs text-muted">inkl. moms</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6: Kategorier */}
      <section aria-labelledby="kategorier" className="container-page py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Kategorier</p>
            <h2 id="kategorier" className="mt-2 text-3xl font-medium">
              Find det, der passer til dig
            </h2>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/kategori/${c.slug}`} className="group card flex h-full flex-col gap-2 p-6 transition-colors hover:bg-sage/40">
                <span className="font-serif text-xl">{c.name}</span>
                <span className="text-sm text-muted">{categoryCopy[c.slug] ?? c.intro}</span>
                <span className="mt-auto pt-3 text-sm font-semibold text-forest group-hover:underline">Se udvalget →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 5: Udvalgte produkter */}
      <section aria-labelledby="udvalgte" className="container-page py-12">
        <p className="eyebrow">Sortiment</p>
        <h2 id="udvalgte" className="mt-2 mb-8 text-3xl font-medium">
          Udvalgte produkter
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} campaigns={campaigns} />
          ))}
        </div>
      </section>

      {/* 7: Fordele */}
      <section aria-labelledby="fordele" className="mt-12 bg-paper py-16">
        <div className="container-page">
          <p className="eyebrow">Hvorfor Vellivo</p>
          <h2 id="fordele" className="mt-2 mb-10 max-w-xl text-3xl font-medium">
            En webshop, du kan regne med
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: InfoIcon, title: "Ærlig produktinformation", text: "Vi viser kun funktioner og specifikationer, som producentens dokumentation bekræfter." },
              { icon: ShieldIcon, title: "Ingen overdrevne løfter", text: "Vores produkter er velværeprodukter. Vi lover ikke behandling eller helbredelse." },
              {
                icon: TruckIcon,
                title: "Klar pris – ingen overraskelser",
                text:
                  shipping.freeThresholdOre !== null
                    ? `Alle priser inkl. moms. Fragt ${formatDkk(shipping.flatRateOre)} – gratis over ${formatDkk(shipping.freeThresholdOre)}.`
                    : `Alle priser inkl. moms. Fragt ${formatDkk(shipping.flatRateOre)}.`,
              },
              { icon: LockIcon, title: "Sikker betaling", text: "Betaling via Stripe. Vi gemmer aldrig dine kortoplysninger." },
            ].map((f) => (
              <li key={f.title} className="space-y-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-forest">
                  <f.icon />
                </span>
                <h3 className="font-sans text-base font-semibold tracking-normal">{f.title}</h3>
                <p className="text-sm text-muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8: Funktioner */}
      <section aria-labelledby="funktioner" className="container-page grid gap-10 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow">Funktioner</p>
          <h2 id="funktioner" className="mt-2 text-3xl font-medium">
            Funktioner forklaret i et sprog, alle kan forstå
          </h2>
          <p className="mt-4 text-muted">
            Massageapparater har ofte mange funktioner med tekniske navne. På hver produktside forklarer vi, hvad funktionerne betyder i
            praksis – og vi markerer tydeligt, hvis en oplysning endnu ikke er bekræftet af producenten.
          </p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            { t: "Varme", d: "Mange apparater har en varmefunktion med flere niveauer. Start altid lavt." },
            { t: "Vibration", d: "Rytmisk bevægelse i forskellige intensiteter." },
            { t: "Luftkompression", d: "Luftkamre, der fyldes og tømmes og giver et blødt tryk." },
            { t: "Batteridrift", d: "Trådløs brug – tjek ladetid og driftstid på produktsiden." },
          ].map((f) => (
            <div key={f.t} className="card p-5">
              <dt className="font-semibold">{f.t}</dt>
              <dd className="mt-1 text-sm text-muted">{f.d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 9: Produktguide */}
      <section aria-labelledby="guide" className="bg-forest py-16 text-cream">
        <div className="container-page">
          <p className="text-xs font-semibold tracking-[0.18em] text-sage uppercase">Produktguide</p>
          <h2 id="guide" className="mt-2 mb-8 text-3xl font-medium">
            Hvilket apparat passer til dig?
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="flex h-full flex-col gap-2 rounded-[var(--radius-card)] bg-forest-dark/60 p-6 ring-1 ring-white/10 transition-colors hover:bg-forest-dark">
                  <span className="font-serif text-xl">{g.title}</span>
                  <span className="text-sm text-sage">{g.description}</span>
                  <span className="mt-auto pt-3 text-sm font-semibold">Læs guiden →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10: FAQ */}
      <section aria-labelledby="faq" className="container-page grid gap-10 py-20 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="eyebrow">Spørgsmål og svar</p>
          <h2 id="faq" className="mt-2 text-3xl font-medium">
            Ofte stillede spørgsmål
          </h2>
          <p className="mt-4 text-muted">
            Finder du ikke svaret?{" "}
            <Link href="/kontakt" className="font-medium text-forest underline underline-offset-4">
              Skriv til os
            </Link>
            .
          </p>
        </div>
        <div className="divide-y divide-sand rounded-[var(--radius-card)] bg-paper px-6">
          {siteFaq.slice(0, 5).map((f) => (
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

      {/* 11: Relaterede produkter / hele sortimentet */}
      <section aria-labelledby="sortiment" className="container-page py-8">
        <div className="card flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="sortiment" className="text-2xl font-medium">
              Se hele sortimentet
            </h2>
            <p className="mt-1 text-muted">En lændemassager og tre øjenmassagere med varme.</p>
          </div>
          <Link href="/shop" className="btn-primary">
            Til shoppen
          </Link>
        </div>
      </section>

      {/* 12: Nyhedsbrev */}
      <section id="nyhedsbrev" aria-labelledby="nyhedsbrev-titel" className="container-page py-16">
        <div className="grid gap-8 rounded-[var(--radius-card)] bg-sand/60 p-8 md:grid-cols-2 md:p-12">
          <div>
            <LeafIcon className="mb-3 text-forest" />
            <h2 id="nyhedsbrev-titel" className="text-3xl font-medium">
              Nyheder og tilbud
            </h2>
            <p className="mt-3 text-muted">Tilmeld dig nyhedsbrevet og få besked om nye produkter, guides og tilbud.</p>
          </div>
          <NewsletterForm source="forside" />
        </div>
      </section>
    </>
  );
}
