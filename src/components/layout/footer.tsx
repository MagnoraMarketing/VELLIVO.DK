import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Missing } from "@/components/ui/missing";
import { site } from "@/config/site";

const groups = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Alle produkter" },
      { href: "/kategori/ryg-og-laend", label: "Ryg og lænd" },
      { href: "/kategori/nakke-og-skuldre", label: "Nakke og skuldre" },
      { href: "/kategori/oejne-og-haender", label: "Øjne og hænder" },
      { href: "/kategori/hoved-og-hovedbund", label: "Hoved og hovedbund" },
      { href: "/guides", label: "Købsguides" },
    ],
  },
  {
    title: "Kundeservice",
    links: [
      { href: "/kontakt", label: "Kontakt" },
      { href: "/faq", label: "Ofte stillede spørgsmål" },
      { href: "/levering", label: "Levering" },
      { href: "/retur-og-fortrydelsesret", label: "Retur og fortrydelsesret" },
    ],
  },
  {
    title: "Om Vellivo",
    links: [
      { href: "/om-vellivo", label: "Om os" },
      { href: "/handelsbetingelser", label: "Handelsbetingelser" },
      { href: "/privatlivspolitik", label: "Privatlivspolitik" },
      { href: "/cookiepolitik", label: "Cookiepolitik" },
    ],
  },
];

export function Footer() {
  const c = site.company;
  return (
    <footer className="mt-24 border-t border-sand bg-paper">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted">{site.tagline}</p>
          <address className="space-y-1 text-sm text-muted not-italic">
            <div>{c.legalName ?? <Missing>Virksomhedsnavn</Missing>}</div>
            <div>{c.address ?? <Missing>Adresse</Missing>}</div>
            <div>CVR: {c.cvr ?? <Missing>CVR-nummer</Missing>}</div>
            <div>{c.email ? <a href={`mailto:${c.email}`} className="underline">{c.email}</a> : <Missing>E-mail</Missing>}</div>
          </address>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="mb-3 font-sans text-sm font-semibold tracking-normal">{g.title}</h2>
            <ul className="space-y-2 text-sm">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted hover:text-forest">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-sand">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vellivo. Alle priser er i DKK inkl. 25 % moms.</p>
          <p>Sikker betaling via Stripe. Vi gemmer aldrig kortoplysninger.</p>
        </div>
      </div>
    </footer>
  );
}
