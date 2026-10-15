import Link from "next/link";
import { ClearCart } from "@/components/cart/clear-cart";
import { CheckIcon } from "@/components/ui/icons";
import { getOrder, type Order } from "@/lib/data/orders";
import { isStripeConfigured } from "@/lib/env";
import { formatDkk } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";
import { getStripe } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({ title: "Ordrebekræftelse", description: "Tak for din ordre.", path: "/ordre/bekraeftelse", noindex: true });

/**
 * Kvitteringssiden markerer ALDRIG en ordre som betalt. Den viser blot den
 * status, som er sat af den verificerede Stripe-webhook.
 */
async function loadOrder(sessionId: string | undefined): Promise<Order | null> {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId) || !isStripeConfigured()) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.order_id;
    if (!orderId) return null;
    const loaded = await getOrder(orderId);
    return loaded && loaded.order.stripeSessionId === sessionId ? loaded.order : null;
  } catch {
    return null;
  }
}

export default async function ConfirmationPage({ searchParams }: PageProps<"/ordre/bekraeftelse">) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : undefined;
  const order = await loadOrder(sessionId);

  if (!order) {
    return (
      <div className="container-page max-w-2xl py-16">
        <h1 className="text-4xl font-medium">Vi kunne ikke finde ordren</h1>
        <p className="mt-4 text-muted">
          Har du gennemført en betaling, modtager du en kvittering fra Stripe på e-mail. Kontakt os, hvis du har spørgsmål.
        </p>
        <Link href="/kontakt" className="btn-secondary mt-6">
          Kontakt os
        </Link>
      </div>
    );
  }

  const paid = order.status === "paid";
  const failed = order.status === "failed" || order.status === "expired";
  return (
    <div className="container-page max-w-2xl py-16">
      {paid && <ClearCart />}
      {paid && (
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sage text-forest">
          <CheckIcon width={28} height={28} />
        </span>
      )}
      <h1 className="text-4xl font-medium">{paid ? "Tak for din ordre!" : failed ? "Betalingen blev ikke gennemført" : "Vi afventer bekræftelse af betalingen"}</h1>
      <p className="mt-4 text-muted">
        {paid
          ? `Din betaling er bekræftet. Ordrenummer: ${order.number}. Du modtager en kvittering på e-mail${order.customer?.email ? ` (${order.customer.email})` : ""}.`
          : failed
            ? "Din betaling blev afvist eller annulleret. Du er ikke blevet trukket. Prøv igen fra kurven."
            : `Ordrenummer: ${order.number}. Vi har modtaget din ordre, men betalingen er endnu ikke bekræftet. Siden opdateres, når du genindlæser den.`}
      </p>
      <section aria-labelledby="ordrelinjer" className="card mt-8 p-6">
        <h2 id="ordrelinjer" className="mb-4 text-xl font-medium">
          Din ordre
        </h2>
        <ul className="divide-y divide-sand text-sm">
          {order.items.map((i) => (
            <li key={i.sku} className="flex justify-between py-2">
              <span>
                {i.quantity} × {i.productName}
              </span>
              <span>{formatDkk(i.lineTotalOre)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-sand pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Fragt</dt>
            <dd>{order.shippingOre === 0 ? "Gratis" : formatDkk(order.shippingOre)}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>I alt</dt>
            <dd>{formatDkk(order.totalOre)}</dd>
          </div>
          <div className="flex justify-between text-xs text-muted">
            <dt>Heraf moms</dt>
            <dd>{formatDkk(order.vatOre)}</dd>
          </div>
        </dl>
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={failed ? "/kurv" : "/shop"} className="btn-primary">
          {failed ? "Tilbage til kurven" : "Fortsæt med at handle"}
        </Link>
        <Link href="/kontakt" className="btn-secondary">
          Kontakt os
        </Link>
      </div>
    </div>
  );
}
