import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { guides } from "@/data/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Købsguides – vælg det rigtige massageapparat",
  description: "Vellivos købsguides hjælper dig med at vælge lændemassager, øjenmassager og andre massageapparater til hjemmet.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Købsguides", href: "/guides" }]} />
      <header className="mt-6 mb-10 max-w-2xl">
        <h1 className="text-4xl font-medium">Købsguides</h1>
        <p className="mt-3 text-muted">Ærlige guides, der hjælper dig med at vælge – uden store løfter.</p>
      </header>
      <ul className="grid gap-6 md:grid-cols-3">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} className="card flex h-full flex-col gap-2 p-6 hover:bg-sage/40">
              <h2 className="text-xl font-medium">{g.title}</h2>
              <p className="text-sm text-muted">{g.description}</p>
              <span className="mt-auto pt-3 text-sm font-semibold text-forest">Læs guiden →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
