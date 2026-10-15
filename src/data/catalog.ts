import type { Category, Product, ShippingSettings } from "@/lib/catalog/types";

/**
 * Startkatalog for Vellivo.
 *
 * VIGTIGT: Alle fem produkter er KLADDER. Leverandørens produktsider
 * (zonyoutech.com) kunne ikke hentes fra udviklingsmiljøet, så ingen konkrete
 * modelnumre eller tekniske specifikationer er verificeret. Specifikationer med
 * `value: null` vises som "Afventer verificering" og skal udfyldes i admin,
 * når leverandørens datablad, manual og CE-dokumentation foreligger.
 *
 * Teksterne beskriver produkttypen og brugssituationen – ikke funktioner, der
 * ikke er bekræftet. Der må ikke tilføjes helbredspåstande.
 *
 * Filen er webshoppens produktkatalog. Ændringer laves via GitHub (eller
 * Claude Code) og udgives automatisk af Vercel. Se docs/drift-og-redigering.md.
 *
 * `stock` = modtaget antal i alt. Solgte enheder tælles automatisk i Vercel
 * Blob, så tilgængeligt lager = stock − solgt. Ved genopfyldning øges `stock`.
 *
 * Et produkt må først få `status: "published"`, når ALLE punkter i
 * `missingData` er løst, specifikationerne er udfyldt, billeder med
 * afklarede rettigheder ligger i public/produkter/, og prisen er godkendt.
 * `npm test` kontrollerer dette automatisk (tests/unit/catalog.test.ts).
 */

export const categories: Category[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "ryg-og-laend",
    name: "Ryg og lænd",
    intro:
      "Massageapparater til ryg og lænd, som du kan bruge i sofaen, sengen eller på kontorstolen. Find et apparat, der passer til dine vaner og den måde, du helst slapper af på.",
    seoTitle: "Lændemassager og rygmassager til hjemmet",
    seoDescription:
      "Se Vellivos massageapparater til ryg og lænd. Klare priser i DKK inkl. moms, ærlige produktoplysninger og fortrydelsesret.",
    sortOrder: 1,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "nakke-og-skuldre",
    name: "Nakke og skuldre",
    intro:
      "Nakke- og skuldermassagere til en rolig pause efter en lang dag foran skærmen. Kompakte apparater, der er lette at have fremme i hverdagen.",
    seoTitle: "Nakkemassager og nakke- og skuldermassager",
    seoDescription:
      "Nakke- og skuldermassagere fra Vellivo. Se priser inkl. moms, produktinformation og levering i Danmark.",
    sortOrder: 2,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    slug: "oejne-og-haender",
    name: "Øjne og hænder",
    intro:
      "Små, personlige massageapparater til øjne og hænder – til aftenrutinen, rejsen eller pausen ved skrivebordet.",
    seoTitle: "Øjenmassager og håndmassager",
    seoDescription:
      "Øjenmassagere og håndmassagere fra Vellivo. Tydelige priser i DKK inkl. moms og ærlig produktinformation.",
    sortOrder: 3,
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    slug: "hoved-og-hovedbund",
    name: "Hoved og hovedbund",
    intro:
      "Hovedbundsmassagere til en lille pause i hverdagen. Enkle apparater, der er nemme at tage frem og lægge væk igen.",
    seoTitle: "Hovedbundsmassager – elektrisk massage til hovedbunden",
    seoDescription:
      "Elektriske hovedbundsmassagere fra Vellivo. Se pris inkl. moms og produktinformation.",
    sortOrder: 4,
  },
];

const PENDING_SPECS = (extra: string[]): Product["specs"] => [
  { label: "Leverandørens modelnummer", value: null },
  ...extra.map((label) => ({ label, value: null })),
  { label: "Strømforsyning / oplader", value: null },
  { label: "Batteri og driftstid", value: null },
  { label: "Mål og vægt", value: null },
  { label: "Materialer", value: null },
  { label: "CE-mærkning og overensstemmelseserklæring", value: null },
];

const COMMON_MISSING = [
  "Leverandørens præcise modelnummer",
  "Datablad med tekniske specifikationer",
  "Dansk brugsanvisning og sikkerhedsinformation",
  "EU-overensstemmelseserklæring (CE) og testrapporter",
  "Produktbilleder med dokumenteret ret til kommerciel brug",
  "Indkøbspris, fragt og importomkostninger (til prisberegneren)",
  "Indhold i emballagen",
  "Godkendt endelig salgspris",
];

const GENERAL_SAFETY = [
  "Læs altid producentens brugsanvisning før første brug.",
  "Rådfør dig med din læge før brug, hvis du er gravid, har en pacemaker eller andet implantat, eller hvis du er i tvivl om, hvorvidt massage er egnet for dig.",
  "Brug ikke apparatet på hævet, irriteret eller beskadiget hud.",
  "Afbryd brugen, hvis du oplever ubehag.",
  "Apparatet er ikke legetøj og skal opbevares utilgængeligt for børn.",
];

export const products: Product[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    slug: "laendemassager",
    sku: "VEL-LUMBAR-01",
    name: "Vellivo Lumbar",
    categorySlug: "ryg-og-laend",
    status: "draft",
    priceOre: 89900,
    lowestPrice30dOre: null,
    stock: 0,
    tagline: "Massage til lænden – i dit eget tempo",
    shortDescription:
      "Vellivo Lumbar er vores lændemassager til hjemmet. Læg den på sofaen eller i sengen, og giv lænden en rolig pause efter en lang dag.",
    description: [
      "Mange af os tilbringer store dele af dagen siddende – på kontoret, i bilen eller i sofaen. Vellivo Lumbar er tænkt som et enkelt apparat, du kan lægge dig på, når du har lyst til en stille stund med fokus på lænden.",
      "Apparatet er udviklet til hjemmebrug og placeres under lænden, mens du ligger ned. Du styrer selv, hvor længe og hvor ofte du bruger det, så det passer ind i din egen aftenrutine.",
      "Vi offentliggør først de præcise tekniske detaljer – for eksempel varme- og massageindstillinger, strømforsyning og batteri – når vi har modtaget og kontrolleret producentens datablad og dokumentation. Sådan sikrer vi, at det, du læser her, også er det, du får.",
    ],
    features: [
      { title: "Til brug liggende", text: "Placeres under lænden, mens du ligger på sofaen, sengen eller gulvet." },
      { title: "Til hjemmet", text: "Et apparat til personlig brug i hverdagen – ikke til klinisk behandling." },
      { title: "Ærlig produktinfo", text: "Funktioner og specifikationer vises først, når de er bekræftet af producenten." },
    ],
    specs: PENDING_SPECS(["Varme", "Vibration", "Luftkompression / stræk", "EMS", "Betjening (knapper/fjernbetjening)"]),
    usage: [
      "Læg apparatet på et fladt underlag og læg dig, så det ligger under lænden.",
      "Tænd apparatet og vælg den laveste indstilling første gang.",
      "Følg producentens anbefalede brugstid (oplyses, når manualen er verificeret).",
    ],
    inBox: null,
    safety: GENERAL_SAFETY,
    faq: [
      {
        q: "Kan Vellivo Lumbar erstatte behandling hos en fagperson?",
        a: "Nej. Vellivo Lumbar er et massageapparat til velvære i hjemmet og ikke et medicinsk udstyr. Har du smerter eller gener, bør du kontakte din læge eller en autoriseret behandler.",
      },
      {
        q: "Har apparatet varme?",
        a: "Vi afventer producentens datablad og oplyser først funktionerne, når de er bekræftet.",
      },
      {
        q: "Hvornår kan jeg købe produktet?",
        a: "Produktet åbner for salg, når specifikationer, billeder og dokumentation er godkendt. Tilmeld dig nyhedsbrevet, hvis du vil have besked.",
      },
    ],
    seoTitle: "Lændemassager – Vellivo Lumbar til hjemmet",
    seoDescription:
      "Vellivo Lumbar er en lændemassager til hjemmebrug. Læs om brug, sikkerhed og levering. Pris i DKK inkl. moms.",
    images: [],
    supplierUrl: "https://zonyoutech.com/products/lumbar-traction-massager",
    supplierModel: null,
    missingData: COMMON_MISSING,
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    slug: "oejenmassager",
    sku: "VEL-EYE-01",
    name: "Vellivo Eye",
    categorySlug: "oejne-og-haender",
    status: "draft",
    priceOre: 69900,
    lowestPrice30dOre: null,
    stock: 0,
    tagline: "En stille pause for øjnene",
    shortDescription:
      "Vellivo Eye er en øjenmassager, du tager på som en maske. Luk øjnene, sluk for skærmen og giv dig selv et par rolige minutter.",
    description: [
      "Skærme fylder meget i hverdagen. Vellivo Eye er lavet til de øjeblikke, hvor du har brug for at lukke øjnene og koble lidt af – i sofaen, i sengen eller på farten.",
      "Øjenmassageren bæres som en blød maske over øjnene og justeres med en elastik, så den sidder komfortabelt. Den er tænkt til korte pauser i løbet af dagen eller som en del af aftenrutinen.",
      "Oplysninger om varme, massagetyper, batteri og opladning offentliggøres, så snart producentens dokumentation er gennemgået. Indtil da sælges produktet ikke.",
    ],
    features: [
      { title: "Bæres som maske", text: "Ligger over øjnene og holdes på plads af en justerbar rem." },
      { title: "Til korte pauser", text: "Velegnet til en kort pause i løbet af dagen eller før sengetid." },
      { title: "Kompakt", text: "Let at tage med på rejsen eller have liggende ved sengen." },
    ],
    specs: PENDING_SPECS(["Varme", "Luftkompression", "Vibration", "Lyd / Bluetooth", "Foldbar"]),
    usage: [
      "Fjern makeup og eventuelle kontaktlinser før brug.",
      "Placer masken over øjnene og juster remmen.",
      "Start på laveste indstilling og følg producentens anbefalede brugstid.",
    ],
    inBox: null,
    safety: [
      ...GENERAL_SAFETY,
      "Brug ikke øjenmassageren, hvis du for nylig er blevet øjenopereret, eller hvis du har en øjensygdom, uden at have talt med din læge.",
    ],
    faq: [
      {
        q: "Kan jeg bruge Vellivo Eye med briller eller kontaktlinser?",
        a: "Tag briller og kontaktlinser af før brug.",
      },
      {
        q: "Hvordan oplades øjenmassageren?",
        a: "Vi oplyser opladning og batteritid, når producentens datablad er verificeret.",
      },
    ],
    seoTitle: "Øjenmassager – Vellivo Eye",
    seoDescription:
      "Vellivo Eye er en øjenmassager til korte pauser og aftenrutinen. Se pris inkl. moms, brug og sikkerhed.",
    images: [],
    supplierUrl: "https://zonyoutech.com/products",
    supplierModel: null,
    missingData: ["Konkret model i leverandørens katalog skal vælges", ...COMMON_MISSING],
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    slug: "nakkemassager",
    sku: "VEL-NECK-01",
    name: "Vellivo Neck",
    categorySlug: "nakke-og-skuldre",
    status: "draft",
    priceOre: 34900,
    lowestPrice30dOre: null,
    stock: 0,
    tagline: "Til nakke og skuldre efter skærmdagen",
    shortDescription:
      "Vellivo Neck er en kompakt nakke- og skuldermassager til hverdagen – placer den om nakken, læn dig tilbage og tag en pause.",
    description: [
      "Lange dage ved computeren eller med blikket i telefonen mærkes ofte i nakke og skuldre. Vellivo Neck er en enkel massager, der er let at tage frem, når du har brug for en pause.",
      "Massageren er udviklet til personlig brug derhjemme eller på kontoret. Den fylder ikke meget og kan ligge klar ved sofaen eller skrivebordet.",
      "Vi offentliggør præcise oplysninger om massagetype, intensitetsniveauer, varme og batteri, når producentens dokumentation er gennemgået.",
    ],
    features: [
      { title: "Kompakt format", text: "Let at have fremme i stuen eller på kontoret." },
      { title: "Til hverdagsbrug", text: "Lavet til korte pauser i løbet af dagen." },
      { title: "Enkel at bruge", text: "Få indstillinger, så du hurtigt kommer i gang." },
    ],
    specs: PENDING_SPECS(["Massagetype", "Intensitetsniveauer", "Varme"]),
    usage: [
      "Placer massageren om nakken eller på skuldrene.",
      "Start på laveste indstilling.",
      "Følg producentens anbefalede brugstid.",
    ],
    inBox: null,
    safety: GENERAL_SAFETY,
    faq: [
      {
        q: "Kan jeg bruge Vellivo Neck, mens jeg arbejder?",
        a: "Det afhænger af modellens udformning, som vi oplyser, når specifikationerne er bekræftet.",
      },
      {
        q: "Hvad er forskellen på en nakkemassager og en massagepude?",
        a: "En nakkemassager er formet til at ligge om nakken eller på skuldrene, mens en massagepude typisk placeres bag ryggen. Læs mere i vores købsguide.",
      },
    ],
    seoTitle: "Nakkemassager – Vellivo Neck til nakke og skuldre",
    seoDescription:
      "Vellivo Neck er en kompakt nakke- og skuldermassager til hverdagen. Se pris inkl. moms, brug og levering.",
    images: [],
    supplierUrl: "https://zonyoutech.com/products",
    supplierModel: null,
    missingData: ["Konkret model i leverandørens katalog skal vælges", ...COMMON_MISSING],
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    slug: "haandmassager",
    sku: "VEL-HAND-01",
    name: "Vellivo Hand",
    categorySlug: "oejne-og-haender",
    status: "draft",
    priceOre: 79900,
    lowestPrice30dOre: null,
    stock: 0,
    tagline: "Velvære til hænder, der arbejder hele dagen",
    shortDescription:
      "Vellivo Hand er en håndmassager, du stikker hånden ind i, mens du sidder i sofaen eller ved bordet.",
    description: [
      "Hænderne arbejder hele dagen – ved tastaturet, i haven eller i køkkenet. Vellivo Hand er et apparat, du kan stikke hånden ind i, når du har lyst til en rolig pause.",
      "Håndmassageren placeres på et bord eller i skødet, mens du sidder. Den er tænkt til personlig brug i hjemmet.",
      "Oplysninger om varmeindstillinger, kompression, intensitet, batteri og strømforsyning offentliggøres, når producentens datablad er verificeret.",
    ],
    features: [
      { title: "Til brug siddende", text: "Hvil hånden i apparatet, mens du sidder i sofaen eller ved bordet." },
      { title: "Til hjemmet", text: "Et personligt apparat til hverdagens små pauser." },
      { title: "Ærlig produktinfo", text: "Vi viser kun funktioner, der er bekræftet af producenten." },
    ],
    specs: PENDING_SPECS(["Varmeindstillinger", "Luftkompression", "Intensitetsniveauer", "Passer til håndstørrelse"]),
    usage: [
      "Placer apparatet på et stabilt underlag.",
      "Stik hånden ind, så fingrene hviler naturligt.",
      "Start på laveste indstilling og følg producentens anbefalede brugstid.",
    ],
    inBox: null,
    safety: GENERAL_SAFETY,
    faq: [
      {
        q: "Kan Vellivo Hand bruges til begge hænder?",
        a: "Det oplyser vi, når modellens specifikationer er bekræftet.",
      },
      {
        q: "Er håndmassageren et medicinsk udstyr?",
        a: "Nej. Vellivo Hand er et apparat til velvære og afslapning i hjemmet.",
      },
    ],
    seoTitle: "Håndmassager – Vellivo Hand",
    seoDescription:
      "Vellivo Hand er en håndmassager til hjemmet. Læs om brug og sikkerhed, og se pris i DKK inkl. moms.",
    images: [],
    supplierUrl: "https://zonyoutech.com/products/hand-massager",
    supplierModel: null,
    missingData: COMMON_MISSING,
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000005",
    slug: "hovedbundsmassager",
    sku: "VEL-SCALP-01",
    name: "Vellivo Scalp",
    categorySlug: "hoved-og-hovedbund",
    status: "draft",
    priceOre: 29900,
    lowestPrice30dOre: null,
    stock: 0,
    tagline: "En lille hverdagsluksus til hovedbunden",
    shortDescription:
      "Vellivo Scalp er en elektrisk hovedbundsmassager, der ligger godt i hånden – til en kort pause eller som en del af din rutine.",
    description: [
      "Nogle gange skal der ikke meget til. Vellivo Scalp er en håndholdt hovedbundsmassager, du kan tage frem, når du har lyst til en lille pause.",
      "Den kompakte form gør den nem at have liggende på badeværelset eller i tasken.",
      "Vi oplyser først om vandtæthed, materialer, opladning og batteri, når producentens dokumentation er gennemgået. Brug den derfor ikke i bad eller bruser, før vandtætheden er bekræftet i specifikationerne.",
    ],
    features: [
      { title: "Håndholdt", text: "Kompakt format, der ligger godt i hånden." },
      { title: "Til hverdagen", text: "Let at have liggende på badeværelset eller i tasken." },
      { title: "Ærlig produktinfo", text: "Vandtæthed og batteri oplyses først, når det er bekræftet." },
    ],
    specs: PENDING_SPECS(["Vandtæthed (IP-klasse)", "Massagehoveder", "Hastigheder / programmer"]),
    usage: [
      "Sørg for, at apparatet er opladet før brug.",
      "Før massageren roligt hen over hovedbunden.",
      "Rengør massagehovederne efter producentens anvisning.",
    ],
    inBox: null,
    safety: GENERAL_SAFETY,
    faq: [
      {
        q: "Er Vellivo Scalp vandtæt?",
        a: "Det er endnu ikke bekræftet. Vi opdaterer siden med IP-klassen, når producentens dokumentation er verificeret.",
      },
      {
        q: "Kan flere i husstanden bruge den?",
        a: "Ja, men rengør massagehovederne mellem brug.",
      },
    ],
    seoTitle: "Hovedbundsmassager – Vellivo Scalp",
    seoDescription:
      "Vellivo Scalp er en elektrisk hovedbundsmassager. Se pris inkl. moms, brug og produktinformation.",
    images: [],
    supplierUrl: "https://zonyoutech.com/products",
    supplierModel: null,
    missingData: ["Konkret model i leverandørens katalog skal vælges", ...COMMON_MISSING],
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
];

/**
 * Foreløbige fragtsatser (inkl. moms). Standardværdier, indtil virksomheden har
 * en aftale med en fragtpartner – ret dem her.
 */
export const defaultShipping: ShippingSettings = {
  flatRateOre: 4900,
  freeThresholdOre: 50000,
  label: "Levering i Danmark",
};
