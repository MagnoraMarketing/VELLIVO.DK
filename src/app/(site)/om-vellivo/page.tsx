import Link from "next/link";
import { ContentPage } from "@/components/ui/content-page";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Om Vellivo",
  description: "Vellivo er et dansk wellness-brand, der gør massage, komfort og velvære mere tilgængeligt i hverdagen.",
  path: "/om-vellivo",
});

export default function AboutPage() {
  return (
    <ContentPage title="Om Vellivo" path="/om-vellivo" intro={site.tagline}>
      <p>
        Vellivo er et dansk wellness-brand med et enkelt mål: at gøre massage, komfort og velvære mere tilgængeligt i hverdagen. Vi
        sælger massageapparater til hjemmet – til ryg, nakke, øjne, hænder og hovedbund.
      </p>
      <h2>Sådan arbejder vi</h2>
      <ul>
        <li>
          <strong>Ærlig produktinformation.</strong> Vi viser kun funktioner og specifikationer, som producentens dokumentation
          bekræfter. Mangler en oplysning, skriver vi det.
        </li>
        <li>
          <strong>Ingen overdrevne løfter.</strong> Vores produkter er velværeprodukter – ikke medicinsk udstyr. Vi lover ikke
          behandling eller bestemte resultater.
        </li>
        <li>
          <strong>Klare priser.</strong> Alle priser er i danske kroner inkl. moms, og fragten vises, før du betaler.
        </li>
        <li>
          <strong>Ingen falske anmeldelser.</strong> Vi viser kun anmeldelser fra rigtige kunder, når vi har dem.
        </li>
      </ul>
      <h2>Produktsikkerhed</h2>
      <p>
        Før et produkt åbner for salg, gennemgår vi producentens CE-dokumentation, brugsanvisning og sikkerhedsinformation. Indtil da
        vises produktet som “Kommer snart”.
      </p>
      <p>
        Har du spørgsmål, er du velkommen til at <Link href="/kontakt">kontakte os</Link>.
      </p>
    </ContentPage>
  );
}
