import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="Vellivo – til forsiden">
      <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="18" fill="currentColor" className="text-forest" />
        <path d="M18 20 L32 46 L46 20" fill="none" stroke="#faf7f2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-serif text-2xl font-medium tracking-tight text-ink">vellivo</span>
    </Link>
  );
}
