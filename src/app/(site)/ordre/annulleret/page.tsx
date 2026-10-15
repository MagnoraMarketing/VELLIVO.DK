import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Betaling annulleret", description: "Betalingen blev annulleret.", path: "/ordre/annulleret", noindex: true });

export default function CancelledPage() {
  return (
    <div className="container-page max-w-2xl py-16">
      <h1 className="text-4xl font-medium">Betalingen blev annulleret</h1>
      <p className="mt-4 text-muted">Du er ikke blevet trukket. Dine varer ligger stadig i kurven, så du kan prøve igen, når du er klar.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/kurv" className="btn-primary">
          Tilbage til kurven
        </Link>
        <Link href="/kontakt" className="btn-secondary">
          Brug for hjælp?
        </Link>
      </div>
    </div>
  );
}
