import { CartView } from "@/components/cart/cart-view";
import { getActiveCampaigns, getProducts, getShippingSettings } from "@/lib/catalog/repository";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({ title: "Kurv", description: "Din indkøbskurv hos Vellivo.", path: "/kurv", noindex: true });

export default async function CartPage() {
  const [products, campaigns, shipping] = await Promise.all([getProducts(), getActiveCampaigns(), getShippingSettings()]);
  return (
    <div className="container-page py-10">
      <h1 className="mb-8 text-4xl font-medium">Kurv</h1>
      <CartView products={products} campaigns={campaigns} shipping={shipping} mode="cart" />
    </div>
  );
}
