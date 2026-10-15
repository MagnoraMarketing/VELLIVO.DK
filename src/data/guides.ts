/**
 * Købsguides. Teksterne er skrevet til at hjælpe kunden med at vælge – uden
 * helbredspåstande og uden at love bestemte effekter.
 */

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  relatedProducts: string[];
  sections: GuideSection[];
  updatedAt: string;
}

export const guides: Guide[] = [
  {
    slug: "saadan-vaelger-du-en-laendemassager",
    title: "Sådan vælger du en lændemassager til hjemmet",
    seoTitle: "Lændemassager: Sådan vælger du den rigtige",
    description:
      "Overvejer du en lændemassager? Se hvad du skal kigge efter: brugssituation, betjening, strømforsyning, rengøring og dokumentation.",
    intro:
      "En lændemassager kan være en rar del af aftenrutinen. Men modellerne er meget forskellige. Her er de spørgsmål, vi selv stiller, før vi vælger et produkt.",
    relatedProducts: ["laendemassager"],
    updatedAt: "2026-10-15",
    sections: [
      {
        heading: "1. Hvor og hvordan vil du bruge den?",
        paragraphs: [
          "Nogle lændemassagere er lavet til at ligge på, andre til at spænde om livet eller sidde op ad i en stol. Tænk over, om du helst vil bruge apparatet i sofaen, i sengen eller på kontoret.",
        ],
        bullets: [
          "Liggende brug: kræver typisk et fladt underlag.",
          "Siddende brug: se efter en form, der passer til din stol.",
          "På farten: se efter batteridrift og lav vægt.",
        ],
      },
      {
        heading: "2. Funktioner – og hvad der faktisk er dokumenteret",
        paragraphs: [
          "Varme, vibration og luftkompression er almindelige funktioner. Læs altid den konkrete produktbeskrivelse og manual – ikke kun overskrifterne. Hos Vellivo viser vi kun funktioner, som producentens dokumentation bekræfter.",
          "Vær kritisk over for store løfter i markedsføringen. Et massageapparat til hjemmebrug er et velværeprodukt, ikke medicinsk udstyr.",
        ],
      },
      {
        heading: "3. Betjening og strøm",
        paragraphs: [
          "Enkel betjening er vigtigere, end man tror. Se efter tydelige knapper eller en fjernbetjening, og tjek om apparatet kører på batteri eller ledning, og hvordan det oplades.",
        ],
      },
      {
        heading: "4. Sikkerhed og CE-mærkning",
        paragraphs: [
          "Elektriske apparater, der sælges i EU, skal være CE-mærkede og leveres med brugsanvisning og sikkerhedsinformation på dansk. Har du en pacemaker, er gravid eller er i tvivl, så tal med din læge før brug.",
        ],
      },
      {
        heading: "5. Pris, fragt og returret",
        paragraphs: [
          "Sammenlign den samlede pris inkl. moms og fragt. Ved køb online har du 14 dages fortrydelsesret og 2 års reklamationsret efter dansk lovgivning.",
        ],
      },
    ],
  },
  {
    slug: "oejenmassager-med-varme-guide",
    title: "Øjenmassager med varme – hvad skal du kigge efter?",
    seoTitle: "Øjenmassager med varme – guide til valg",
    description:
      "Guide til øjenmassagere: pasform, varmeindstillinger, opladning, hygiejne og sikkerhed. Find den model, der passer til dig.",
    intro:
      "Øjenmassagere bruges typisk som en kort pause fra skærmen eller som en del af aftenrutinen. Her er de vigtigste ting at overveje.",
    relatedProducts: ["oejenmassager", "oejenmassager-air", "oejenmassager-smart"],
    updatedAt: "2026-10-15",
    sections: [
      {
        heading: "Pasform og komfort",
        paragraphs: [
          "Masken skal sidde behageligt uden at trykke. Se efter en justerbar rem og bløde materialer, der er lette at tørre af.",
        ],
      },
      {
        heading: "Varme og indstillinger",
        paragraphs: [
          "Mange øjenmassagere har varme i flere niveauer. Start altid på laveste niveau, og følg producentens anbefalede brugstid.",
        ],
      },
      {
        heading: "Opladning og batteri",
        paragraphs: [
          "Tjek opladningsstik, ladetid og hvor mange brug en opladning rækker til. Det betyder meget, hvis du vil have den med på rejsen.",
        ],
      },
      {
        heading: "Hvornår du skal lade være",
        paragraphs: [
          "Brug ikke en øjenmassager efter en øjenoperation eller ved øjensygdom uden at have talt med din læge. Fjern kontaktlinser før brug.",
        ],
      },
    ],
  },
  {
    slug: "massageapparater-til-hjemmet",
    title: "Massageapparater til hjemmet – lænd eller øjne?",
    seoTitle: "Massageapparater til hjemmet – guide",
    description:
      "Lændemassager eller øjenmassager? Få overblik over forskellene, og find ud af, hvilken af Vellivos øjenmassagere der passer til dig.",
    intro:
      "Vellivo har en lændemassager og tre øjenmassagere. Her er en enkel oversigt, der hjælper dig med at vælge.",
    relatedProducts: ["laendemassager", "oejenmassager", "oejenmassager-air", "oejenmassager-smart"],
    updatedAt: "2026-10-15",
    sections: [
      {
        heading: "Lændemassager",
        paragraphs: [
          "Til dig, der vil have en rolig stund med fokus på lænden. Vellivo Lumbar lægges under lænden og kombinerer luftpude-stræk, varme, vibration og EMS-pulser. Den er trådløs og betjenes med fjernbetjening.",
        ],
      },
      {
        heading: "Øjenmassager",
        paragraphs: [
          "Bæres som en maske og bruges til korte pauser fra skærmen eller før sengetid. Alle tre modeller har varme, Bluetooth og kan foldes sammen.",
        ],
        bullets: [
          "Vellivo Eye Premium: varme op til ca. 42 °C, luftkompression, vibration og 1200 mAh batteri.",
          "Vellivo Eye Air: LCD-display, 5 programmer, mikrovibration, lufttryk og varme på 40–43 °C.",
          "Vellivo Eye Smart: den letteste (205 g) med grafenvarme, 3 programmer og indbygget musik.",
        ],
      },
      {
        heading: "Det gælder for alle apparater",
        paragraphs: [
          "Læs brugsanvisningen, start på laveste indstilling, og stop, hvis du oplever ubehag. Massageapparater til hjemmebrug er velværeprodukter – ikke behandling.",
        ],
      },
    ],
  },
];
