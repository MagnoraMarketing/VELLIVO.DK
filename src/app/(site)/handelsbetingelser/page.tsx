import Link from "next/link";
import { ContentPage } from "@/components/ui/content-page";
import { Missing } from "@/components/ui/missing";
import { site } from "@/config/site";
import { defaultShipping } from "@/data/catalog";
import { formatDkk } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Handelsbetingelser",
  description: "Vellivos handelsbetingelser: priser, betaling, levering, fortrydelsesret, reklamation og persondata.",
  path: "/handelsbetingelser",
});

export default function TermsPage() {
  const c = site.company;
  return (
    <ContentPage title="Handelsbetingelser" path="/handelsbetingelser" draft>
      <h2>1. Sælger</h2>
      <p>
        {c.legalName ?? <Missing>Virksomhedsnavn</Missing>}
        <br />
        {c.address ?? <Missing>Adresse</Missing>}
        <br />
        CVR: {c.cvr ?? <Missing>CVR-nummer</Missing>}
        <br />
        E-mail: {c.email ?? <Missing>E-mail</Missing>}
      </p>
      <h2>2. Priser</h2>
      <p>
        Alle priser er i danske kroner (DKK) og inkluderer 25 % moms. Fragt ({formatDkk(defaultShipping.flatRateOre)}
        {defaultShipping.freeThresholdOre !== null && `, gratis ved køb over ${formatDkk(defaultShipping.freeThresholdOre)}`}) vises
        separat i kurven og på betalingssiden. Den samlede pris fremgår, før du gennemfører købet.
      </p>
      <h2>3. Aftaleindgåelse</h2>
      <p>
        Aftalen er bindende, når betalingen er gennemført, og du har modtaget en ordrebekræftelse. Vi forbeholder os ret til at annullere
        en ordre ved åbenlyse prisfejl eller hvis varen ikke kan leveres; i så fald refunderes det fulde beløb.
      </p>
      <h2>4. Betaling</h2>
      <p>
        Betaling sker via Stripe. Beløbet trækkes, når du gennemfører betalingen. Vellivo modtager og gemmer ikke dine kortoplysninger.
      </p>
      <h2>5. Levering</h2>
      <p>
        Se <Link href="/levering">Levering</Link>. Leveringstid: {site.terms.deliveryTime ?? <Missing>Leveringstid</Missing>}.
      </p>
      <h2>6. Fortrydelsesret</h2>
      <p>
        Du har {site.terms.withdrawalDays} dages fortrydelsesret. Se <Link href="/retur-og-fortrydelsesret">Retur og fortrydelsesret</Link>{" "}
        for vejledning og standardfortrydelsesformular.
      </p>
      <h2>7. Reklamation</h2>
      <p>Du har {site.terms.complaintYears} års reklamationsret efter købeloven.</p>
      <h2>8. Produktinformation og sikkerhed</h2>
      <p>
        Vores produkter er velværeprodukter til hjemmebrug og ikke medicinsk udstyr. Læs altid brugsanvisningen og
        sikkerhedsinformationen før brug.
      </p>
      <h2>9. Persondata</h2>
      <p>
        Se vores <Link href="/privatlivspolitik">privatlivspolitik</Link>.
      </p>
      <h2>10. Klagemuligheder</h2>
      <p>
        Hvis du vil klage over et køb, så kontakt os først. Hvis vi ikke finder en løsning, kan du klage til Center for Klageløsning,
        Nævnenes Hus, Toldboden 2, 8800 Viborg, via naevneneshus.dk. Bor du i et andet EU-land, kan du bruge Europa-Kommissionens
        klageportal.
      </p>
    </ContentPage>
  );
}
