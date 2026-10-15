import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata = { title: "Siden blev ikke fundet", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="indhold" className="container-page flex-1 py-24">
        <p className="eyebrow">Fejl 404</p>
        <h1 className="mt-2 text-4xl font-medium">Siden blev ikke fundet</h1>
        <p className="mt-4 max-w-lg text-muted">Siden findes ikke, eller den er blevet flyttet. Prøv en af disse:</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Til forsiden
          </Link>
          <Link href="/shop" className="btn-secondary">
            Se alle produkter
          </Link>
          <Link href="/kontakt" className="btn-secondary">
            Kontakt os
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
