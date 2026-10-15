import { ContentPage } from "@/components/ui/content-page";
import { Missing } from "@/components/ui/missing";
import { site } from "@/config/site";
import { defaultShipping } from "@/data/catalog";
import { formatDkk } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Levering",
  description: "Information om levering, fragtpriser og leveringstid hos Vellivo.",
  path: "/levering",
});

export default function DeliveryPage() {
  const s = defaultShipping;
  return (
    <ContentPage title="Levering" path="/levering" draft>
      <h2>Fragtpriser</h2>
      <ul>
        <li>Fragt til adresser i Danmark: {formatDkk(s.flatRateOre)} inkl. moms.</li>
        {s.freeThresholdOre !== null && <li>Gratis fragt ved køb for mindst {formatDkk(s.freeThresholdOre)}.</li>}
      </ul>
      <p>Den samlede fragtpris vises altid i kurven og på betalingssiden, før du betaler.</p>
      <h2>Leveringstid</h2>
      <p>{site.terms.deliveryTime ?? <Missing>Leveringstid</Missing>}</p>
      <h2>Fragtfirma</h2>
      <p>{site.terms.carrier ?? <Missing>Fragtfirma og leveringsmetode</Missing>}</p>
      <h2>Leveringsområde</h2>
      <p>Vi leverer i første omgang kun til adresser i Danmark (ekskl. Færøerne og Grønland).</p>
      <h2>Forsinkelser og skader</h2>
      <p>
        Hvis din pakke er forsinket eller beskadiget ved levering, så kontakt os hurtigst muligt. Varen er på vores ansvar, indtil du har
        modtaget den.
      </p>
    </ContentPage>
  );
}
