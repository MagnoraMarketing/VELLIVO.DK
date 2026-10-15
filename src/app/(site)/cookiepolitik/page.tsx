import { ContentPage } from "@/components/ui/content-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookiepolitik",
  description: "Vellivo bruger ingen sporings- eller marketingcookies. Læs hvilke data der gemmes i din browser.",
  path: "/cookiepolitik",
});

export default function CookiePage() {
  return (
    <ContentPage title="Cookiepolitik" path="/cookiepolitik" draft>
      <h2>Vi bruger ingen sporings- eller marketingcookies</h2>
      <p>
        Vellivo.dk bruger ikke cookies til statistik, annoncering eller sporing. Derfor viser vi ikke et cookiebanner.
      </p>
      <h2>Nødvendig lagring i din browser</h2>
      <p>
        Indholdet af din indkøbskurv (produkt og antal) gemmes lokalt i din browser (localStorage), så kurven huskes, mens du handler.
        Oplysningen sendes ikke til os, før du går til betaling, og bruges ikke til andet. Lagringen er nødvendig for at levere den
        tjeneste, du har bedt om.
      </p>
      <h2>Betaling hos Stripe</h2>
      <p>
        Når du går til betaling, sendes du til Stripes betalingsside. Stripe kan sætte cookies, der er nødvendige for sikker betaling og
        forebyggelse af svindel. Se Stripes egen cookiepolitik på stripe.com.
      </p>
      <h2>Hvis vi ændrer dette</h2>
      <p>
        Hvis vi senere tager statistik- eller marketingværktøjer i brug, vil vi først indhente dit samtykke via et cookiebanner og
        opdatere denne side.
      </p>
    </ContentPage>
  );
}
