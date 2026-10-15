import Link from "next/link";
import { CartView } from "@/components/cart/cart-view";
import { getActiveCampaigns, getProducts, getShippingSettings } from "@/lib/catalog/repository";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({ title: "Kassen", description: "Gennemgå din ordre og gå til sikker betaling.", path: "/checkout", noindex: true });

export default async function CheckoutPage() {
  const [products, campaigns, shipping] = await Promise.all([getProducts(), getActiveCampaigns(), getShippingSettings()]);
  return (
    <div className="container-page py-10">
      <p className="text-sm">
        <Link href="/kurv" className="text-muted underline underline-offset-4 hover:text-forest">
          ← Tilbage til kurven
        </Link>
      </p>
      <h1 className="mt-4 mb-8 text-4xl font-medium">Kassen</h1>
      <CartView products={products} campaigns={campaigns} shipping={shipping} mode="checkout" />
    </div>
  );
}
