"use client";

import Link from "next/link";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-24">
      <h1 className="text-4xl font-medium">Der opstod en fejl</h1>
      <p className="mt-4 max-w-lg text-muted">Noget gik galt. Prøv igen – eller kontakt os, hvis problemet fortsætter.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Prøv igen
        </button>
        <Link href="/" className="btn-secondary">
          Til forsiden
        </Link>
      </div>
    </div>
  );
}
