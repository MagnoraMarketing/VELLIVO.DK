/** Tydelig markering af en oplysning, som virksomheden endnu ikke har leveret. */
export function Missing({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-warning-bg px-1.5 py-0.5 text-[0.85em] font-medium text-warning" title="Oplysningen mangler og skal udfyldes før lancering">
      [{children} udfyldes]
    </span>
  );
}

export function DraftNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div role="note" className="mb-8 rounded-2xl border border-warning/20 bg-warning-bg p-4 text-sm text-warning">
      <strong className="font-semibold">Udkast.</strong>{" "}
      {children ??
        "Denne side er et redigerbart udkast og skal gennemgås og godkendes af virksomheden (evt. med juridisk rådgivning), før webshoppen åbner for salg."}
    </div>
  );
}
