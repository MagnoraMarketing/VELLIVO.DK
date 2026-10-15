import { ContentPage } from "@/components/ui/content-page";
import { Missing } from "@/components/ui/missing";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privatlivspolitik",
  description: "Sådan behandler Vellivo dine personoplysninger ved køb, kontakt og tilmelding til nyhedsbrev.",
  path: "/privatlivspolitik",
});

export default function PrivacyPage() {
  const c = site.company;
  return (
    <ContentPage title="Privatlivspolitik" path="/privatlivspolitik" draft>
      <h2>Dataansvarlig</h2>
      <p>
        {c.legalName ?? <Missing>Virksomhedsnavn</Missing>}, CVR {c.cvr ?? <Missing>CVR-nummer</Missing>},{" "}
        {c.address ?? <Missing>Adresse</Missing>}, {c.email ?? <Missing>E-mail</Missing>}.
      </p>
      <h2>Hvilke oplysninger behandler vi?</h2>
      <ul>
        <li>
          <strong>Køb:</strong> navn, e-mail, telefon, leveringsadresse og ordreoplysninger. Formål: at levere varen og opfylde
          købsaftalen (GDPR art. 6, stk. 1, litra b) samt bogføringsloven (litra c).
        </li>
        <li>
          <strong>Kontaktformular:</strong> navn, e-mail og din besked. Formål: at besvare din henvendelse (litra f – legitim interesse).
        </li>
        <li>
          <strong>Nyhedsbrev:</strong> e-mail og tidspunkt for dit samtykke. Formål: at sende nyhedsbrevet (litra a – samtykke). Du kan til
          enhver tid trække dit samtykke tilbage.
        </li>
      </ul>
      <h2>Betaling</h2>
      <p>Betaling håndteres af Stripe. Vi modtager ikke dine kortoplysninger – de behandles udelukkende af Stripe.</p>
      <h2>Databehandlere</h2>
      <ul>
        <li>Vercel Inc. – hosting af webshoppen og opbevaring af ordre-, kontakt- og nyhedsbrevsdata (Vercel Blob).</li>
        <li>Stripe – betalingsbehandling.</li>
      </ul>
      <p>
        Overførsel til tredjelande (fx USA) sker på grundlag af EU-Kommissionens standardkontraktbestemmelser og/eller EU-U.S. Data
        Privacy Framework. <Missing>Bekræft databehandleraftaler og datalokation (region) for Vercel og Stripe</Missing>
      </p>
      <h2>Opbevaring</h2>
      <ul>
        <li>Ordreoplysninger opbevares i 5 år fra udgangen af regnskabsåret (bogføringsloven).</li>
        <li>Henvendelser via kontaktformularen: <Missing>Opbevaringsperiode, fx 12 måneder</Missing></li>
        <li>Nyhedsbrev: indtil du afmelder dig.</li>
      </ul>
      <h2>Dine rettigheder</h2>
      <p>
        Du har ret til indsigt, berigtigelse, sletning, begrænsning, dataportabilitet og indsigelse. Kontakt os for at gøre brug af dine
        rettigheder. Du kan klage til Datatilsynet (datatilsynet.dk).
      </p>
    </ContentPage>
  );
}
