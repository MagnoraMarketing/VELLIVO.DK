import { ContentPage } from "@/components/ui/content-page";
import { Missing } from "@/components/ui/missing";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Retur og fortrydelsesret",
  description: "Sådan bruger du din 14 dages fortrydelsesret og 2 års reklamationsret hos Vellivo.",
  path: "/retur-og-fortrydelsesret",
});

export default function ReturnsPage() {
  const c = site.company;
  return (
    <ContentPage title="Retur og fortrydelsesret" path="/retur-og-fortrydelsesret" draft>
      <h2>14 dages fortrydelsesret</h2>
      <p>
        Du har 14 dages fortrydelsesret, når du handler hos Vellivo. Fristen løber fra den dag, du modtager varen. Du skal give os
        besked om, at du vil fortryde købet, inden fristen udløber – fx via vores kontaktformular, på e-mail eller ved at bruge
        standardfortrydelsesformularen nedenfor. Du skal derefter sende varen retur senest 14 dage efter, at du har givet besked.
      </p>
      <h2>Returadresse</h2>
      <p>{c.returnAddress ?? <Missing>Returadresse</Missing>}</p>
      <h2>Returfragt</h2>
      <p>
        <Missing>Beslutning: Betaler kunden eller Vellivo returfragten?</Missing> Hvis kunden betaler, skal det fremgå tydeligt her og i
        handelsbetingelserne.
      </p>
      <h2>Varens stand</h2>
      <p>
        Du må undersøge varen, som du ville gøre i en fysisk butik. Hvis varen er brugt ud over, hvad der er nødvendigt for at fastslå dens
        art, egenskaber og funktion, kan vi trække et beløb fra tilbagebetalingen svarende til værdiforringelsen. Af hygiejnehensyn bør du
        ikke bruge produkter, der kommer i direkte kontakt med huden, hvis du overvejer at returnere dem.
      </p>
      <h2>Tilbagebetaling</h2>
      <p>
        Vi tilbagebetaler købsbeløbet inkl. de oprindelige standardleveringsomkostninger senest 14 dage efter, at vi har modtaget din
        meddelelse om fortrydelse. Vi kan tilbageholde beløbet, indtil vi har modtaget varen retur. Beløbet tilbageføres til det
        betalingsmiddel, du brugte ved købet.
      </p>
      <h2>Reklamationsret</h2>
      <p>
        Du har {site.terms.complaintYears} års reklamationsret efter købeloven. Det betyder, at du kan reklamere over fejl og mangler, der
        var til stede ved leveringen. Kontakt os med en beskrivelse af fejlen og gerne billeder.{" "}
        {site.terms.warranty ? site.terms.warranty : "Vellivo giver ikke en særskilt garanti ud over reklamationsretten, medmindre andet fremgår af produktsiden."}
      </p>
      <h2>Standardfortrydelsesformular</h2>
      <p>(Udfyld og returnér kun denne formular, hvis du ønsker at gøre fortrydelsesretten gældende)</p>
      <div className="rounded-xl bg-paper p-5 text-sm">
        <p>
          Til: {c.legalName ?? <Missing>Virksomhedsnavn</Missing>}, {c.address ?? <Missing>Adresse</Missing>},{" "}
          {c.email ?? <Missing>E-mail</Missing>}
        </p>
        <p>Jeg meddeler herved, at jeg ønsker at gøre min fortrydelsesret gældende i forbindelse med min købsaftale om følgende varer:</p>
        <p>Bestilt den / modtaget den: ____________</p>
        <p>Ordrenummer: ____________</p>
        <p>Forbrugerens navn og adresse: ____________</p>
        <p>Dato og underskrift (kun hvis formularen indsendes på papir): ____________</p>
      </div>
    </ContentPage>
  );
}
