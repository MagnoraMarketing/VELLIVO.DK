import { ContactForm } from "@/components/forms/contact-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Missing } from "@/components/ui/missing";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontakt",
  description: "Kontakt Vellivo med spørgsmål om produkter, levering, retur eller din ordre.",
  path: "/kontakt",
});

export default function ContactPage() {
  const c = site.company;
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Kontakt", href: "/kontakt" }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="kontakt-titel">
          <h1 id="kontakt-titel" className="text-4xl font-medium">
            Kontakt os
          </h1>
          <p className="mt-3 mb-8 text-muted">Skriv til os, så vender vi tilbage hurtigst muligt. Har du en ordre, så angiv gerne ordrenummeret.</p>
          <ContactForm />
        </section>
        <aside className="card h-fit space-y-4 p-6 text-sm">
          <h2 className="font-sans text-base font-semibold tracking-normal">Virksomhedsoplysninger</h2>
          <dl className="space-y-2 text-muted">
            <div>
              <dt className="font-medium text-ink">Virksomhed</dt>
              <dd>{c.legalName ?? <Missing>Virksomhedsnavn</Missing>}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">CVR</dt>
              <dd>{c.cvr ?? <Missing>CVR-nummer</Missing>}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Adresse</dt>
              <dd>{c.address ?? <Missing>Adresse</Missing>}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">E-mail</dt>
              <dd>{c.email ? <a href={`mailto:${c.email}`} className="underline">{c.email}</a> : <Missing>E-mail</Missing>}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Telefon</dt>
              <dd>{c.phone ?? <Missing>Telefon</Missing>}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
