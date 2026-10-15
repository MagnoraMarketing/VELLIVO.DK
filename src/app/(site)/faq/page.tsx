import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/ui/json-ld";
import { siteFaq } from "@/data/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ofte stillede spørgsmål",
  description: "Svar på spørgsmål om priser, moms, betaling, levering, fortrydelsesret og Vellivos massageapparater.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="container-page py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: siteFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <Breadcrumbs items={[{ name: "Ofte stillede spørgsmål", href: "/faq" }]} />
      <h1 className="mt-6 mb-8 text-4xl font-medium">Ofte stillede spørgsmål</h1>
      <div className="max-w-3xl divide-y divide-sand rounded-[var(--radius-card)] bg-paper px-6">
        {siteFaq.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              <h2 className="font-sans text-base font-medium tracking-normal">{f.q}</h2>
              <span className="text-xl text-forest transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
