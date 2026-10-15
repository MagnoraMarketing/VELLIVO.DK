import type { Category, Product, ProductImage, ShippingSettings } from "@/lib/catalog/types";

/**
 * Vellivos produktkatalog – fire produkter fra leverandøren ZonyouTech.
 *
 * Kilde: leverandørens produktsider (hentet 15.10.2026):
 * - https://zonyoutech.com/products/lumbar-traction-massager
 * - https://zonyoutech.com/products/premium-heated-eye-massager-with-bluetooth-music-air-compression-oem-eye-massagers-manufacturer
 * - https://zonyoutech.com/products/heated-air-compression-eye-massager-with-vibration-bluetooth-built-in-music
 * - https://zonyoutech.com/products/smart-eye-massager-with-heat-and-bluetooth-music-premium-eyecare-wireless-device
 *
 * Teksterne er skrevet på dansk til slutkunder. Engros-/OEM-oplysninger (MOQ,
 * leveringstid fra fabrik, private label) er udeladt. Leverandørens
 * helbredspåstande (fx "lindrer rygsmerter", "retter rygsøjlen", "mindsker
 * mørke rande") er bevidst IKKE oversat: de må ikke bruges i markedsføringen af
 * et velværeprodukt. Oplysninger, som leverandøren ikke angiver, står som
 * `null` og vises som "Afventer verificering".
 *
 * Billederne er leverandørens og hentes fra deres billed-CDN
 * (assets.laicms.com) via Vercels billedoptimering. Billeder med
 * helbredspåstande (fx "relieve pain", "improve sleep quality", "medical
 * grade"), kinesisk tekst eller OEM-/lagerindhold er fjernet efter
 * tekstgenkendelse (OCR). De resterende billeder kan have engelsk tekst.
 *
 * Ændringer laves via GitHub (eller Claude Code) og udgives automatisk af
 * Vercel. Se docs/drift-og-redigering.md.
 *
 * `stock` = modtaget antal i alt. Solgte enheder tælles automatisk i Vercel
 * Blob, så tilgængeligt lager = stock − solgt. Ved genopfyldning øges `stock`.
 *
 * Alle fire produkter er udgivet (kan købes) efter ejerens beslutning og vises
 * som "På lager" uden antal (`alwaysInStock`). `missingData` er en tjekliste
 * over dokumentation, der stadig skal indhentes hos leverandøren.
 */

const CDN = "https://assets.laicms.com/7243e482us/";

function gallery(name: string, files: [file: string, width: number, height: number][]): ProductImage[] {
  return files.map(([file, width, height], i) => ({
    url: `${CDN}${file}`,
    alt: `${name} – produktbillede ${i + 1}`,
    width,
    height,
  }));
}

export const categories: Category[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "ryg-og-laend",
    name: "Ryg og lænd",
    intro:
      "Lændemassager til hjemmet med stræk, varme, vibration og EMS – til en rolig pause for lænden i sofaen, sengen eller på kontoret.",
    seoTitle: "Lændemassager med varme og stræk",
    seoDescription:
      "Vellivo Lumbar er en trådløs lændemassager med luftpude-stræk, varme, vibration og EMS. Priser i DKK inkl. moms.",
    sortOrder: 1,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "oejenmassagere",
    name: "Øjenmassagere",
    intro:
      "Øjenmassagere med varme, luftkompression, vibration og Bluetooth-musik. Foldbare og trådløse – til skærmpausen, aftenrutinen eller rejsen.",
    seoTitle: "Øjenmassager med varme og Bluetooth",
    seoDescription:
      "Sammenlign Vellivos tre øjenmassagere med varme, luftkompression og Bluetooth-musik. Priser i DKK inkl. moms.",
    sortOrder: 2,
  },
];

const GENERAL_SAFETY = [
  "Læs altid brugsanvisningen før første brug.",
  "Rådfør dig med din læge før brug, hvis du er gravid, har en pacemaker eller andet implantat, eller hvis du er i tvivl om, hvorvidt massage er egnet for dig.",
  "Brug ikke apparatet på hævet, irriteret eller beskadiget hud.",
  "Afbryd brugen, hvis du oplever ubehag.",
  "Apparatet er ikke legetøj og skal opbevares utilgængeligt for børn.",
];

const EYE_SAFETY = [
  ...GENERAL_SAFETY,
  "Tag briller og kontaktlinser af før brug.",
  "Brug ikke øjenmassageren efter en øjenoperation eller ved øjensygdom uden at have talt med din læge.",
];

const COMMON_MISSING = [
  "Indhold i emballagen",
  "Dansk brugsanvisning og sikkerhedsinformation",
  "Modelspecifik EU-overensstemmelseserklæring (CE) og testrapporter",
  "Skriftlig bekræftelse af ret til at bruge leverandørens billeder",
  "Godkendt endelig salgspris og lagerantal",
];

const DISCLAIMER_FAQ = {
  q: "Er det et medicinsk produkt?",
  a: "Nej. Det er et massageapparat til velvære og afslapning i hjemmet – ikke medicinsk udstyr. Har du smerter eller gener, så kontakt din læge.",
};

export const products: Product[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    slug: "laendemassager",
    sku: "VEL-LUMBAR-ST1202C",
    name: "Vellivo Lumbar",
    categorySlug: "ryg-og-laend",
    status: "published",
    priceOre: 89900,
    lowestPrice30dOre: null,
    stock: 0,
    alwaysInStock: true,
    tagline: "Trådløs lændemassager med stræk, varme, vibration og EMS",
    shortDescription:
      "Vellivo Lumbar samler luftpude-stræk, varme, vibration, svingmassage og EMS-pulser i ét apparat. Genopladeligt, trådløst og betjenes med fjernbetjening.",
    description: [
      "Mange af os sidder ned store dele af dagen – på kontoret, i bilen eller i sofaen. Vellivo Lumbar er en lændemassager til hjemmet, som du lægger dig på, når lænden trænger til en rolig pause.",
      "Apparatet kombinerer fem funktioner: en luftpude, der giver et blidt stræk under lænden, varme med konstant temperatur, vibration, svingmassage og EMS-pulser i 10 styrker. Du kan vælge funktionerne selv eller bruge det automatiske program, der skifter mellem dem.",
      "Det indbyggede batteri på 2000 mAh lades op på cirka 2 timer via USB-C og rækker til op til 2 timers trådløs brug, så du kan bruge det, hvor det passer dig. Efter 10 minutter slukker apparatet automatisk.",
      "Formen følger lændens naturlige kurve, og luftpuden har overtryksbeskyttelse, så strækket aldrig bliver for kraftigt.",
    ],
    features: [
      { title: "4-i-1 massage", text: "Luftpude-stræk, varme, vibration/svingmassage og EMS-pulser i ét apparat." },
      { title: "10 EMS-niveauer", text: "Justér styrken på EMS-pulserne, så den passer til dig." },
      { title: "Automatisk program", text: "Et forudindstillet program kombinerer stræk, varme, vibration og pulser." },
      { title: "Fjernbetjening", text: "Skift funktion med ét tryk på den medfølgende fjernbetjening." },
      { title: "10 minutters auto-sluk", text: "Slukker automatisk, så en session ikke bliver for lang." },
      { title: "Trådløs med USB-C", text: "2000 mAh batteri, cirka 2 timers opladning og op til 2 timers brug." },
    ],
    specs: [
      { label: "Model", value: "ST-1202C" },
      { label: "Funktioner", value: "Luftpude-stræk, varme (konstant temperatur), vibration, svingmassage, EMS-pulser" },
      { label: "EMS-styrke", value: "10 niveauer" },
      { label: "Betjening", value: "Fjernbetjening med ét-tryks skift mellem funktioner" },
      { label: "Auto-sluk", value: "Efter 10 minutter" },
      { label: "Sikkerhed", value: "Overtryksbeskyttelse på luftpuden" },
      { label: "Batteri", value: "2000 mAh genopladeligt litiumbatteri" },
      { label: "Opladning", value: "USB-C, cirka 2 timer til fuld opladning" },
      { label: "Driftstid", value: "Op til 2 timer pr. opladning" },
      { label: "Arbejdsstrøm", value: "300–2000 mA" },
      { label: "Materiale", value: "ABS-plast" },
      { label: "Mål", value: "42 × 20 × 8 cm" },
      { label: "Vægt", value: "1,7 kg (2,25 kg med emballage)" },
      { label: "Emballagens mål", value: "47,2 × 21,5 × 12 cm" },
      { label: "Certificering", value: "Leverandøren oplyser CE, FCC og RoHS" },
    ],
    usage: [
      "Oplad apparatet helt via USB-C før første brug (cirka 2 timer).",
      "Læg apparatet på et fladt underlag, og læg dig, så det ligger under lænden.",
      "Tænd med fjernbetjeningen, og vælg funktion – eller start det automatiske program.",
      "Start med laveste EMS-niveau, og øg kun, hvis det føles behageligt.",
      "Apparatet slukker automatisk efter 10 minutter.",
    ],
    inBox: null,
    safety: [
      ...GENERAL_SAFETY,
      "Brug ikke EMS-funktionen, hvis du har en pacemaker, andet elektronisk implantat eller epilepsi, og ikke under graviditet.",
    ],
    faq: [
      {
        q: "Hvor længe holder batteriet?",
        a: "Op til 2 timer pr. opladning. En fuld opladning via USB-C tager cirka 2 timer.",
      },
      {
        q: "Hvad er EMS?",
        a: "EMS står for elektrisk muskelstimulation: svage elektriske pulser, der giver en prikkende fornemmelse. Du kan vælge mellem 10 styrker eller slå funktionen fra.",
      },
      {
        q: "Kan jeg bruge den på kontoret?",
        a: "Ja, den er trådløs, men den er beregnet til at ligge på, så den egner sig bedst til en pause, hvor du kan lægge dig.",
      },
      DISCLAIMER_FAQ,
    ],
    seoTitle: "Lændemassager med stræk, varme og EMS – Vellivo Lumbar",
    seoDescription:
      "Trådløs lændemassager med luftpude-stræk, varme, vibration og 10 EMS-niveauer. 2000 mAh batteri og fjernbetjening. Pris i DKK inkl. moms.",
    images: gallery("Vellivo Lumbar lændemassager", [
      ["xq9ful.webp", 1992, 1992],
      ["o5kdme.webp", 1944, 1976],
      ["anuh5w.webp", 1992, 1992],
      ["wn02vh.webp", 784, 673],
      ["g1ddsp.webp", 784, 1004],
      ["dtlff2.webp", 787, 699],
      ["ijgzyx.webp", 787, 1351],
      ["898b3u.webp", 784, 699],
    ]),
    supplierUrl: "https://zonyoutech.com/products/lumbar-traction-massager",
    supplierModel: "ST-1202C",
    missingData: COMMON_MISSING,
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    slug: "oejenmassager",
    sku: "VEL-EYE-PREMIUM",
    name: "Vellivo Eye Premium",
    categorySlug: "oejenmassagere",
    status: "published",
    priceOre: 69900,
    lowestPrice30dOre: null,
    stock: 0,
    alwaysInStock: true,
    tagline: "Øjenmassager med varme, luftkompression, vibration og Bluetooth",
    shortDescription:
      "Vellivo Eye Premium kombinerer varme op til ca. 42 °C, rytmisk luftkompression, vibration og Bluetooth-musik. Foldbar, trådløs og opladelig via USB-C.",
    description: [
      "Lange dage foran skærmen mærkes ofte omkring øjnene. Vellivo Eye Premium gør en pause på 15 minutter til en rolig stund med varme, blid massage og musik.",
      "Varmen kan justeres op til cirka 42 °C, og luftkamre fyldes og tømmes rytmisk omkring tindinger og øjenområdet. Kombineret med vibration og flere forudindstillede programmer – fx til afslapning eller før sengetid – finder du let den indstilling, der passer dig.",
      "Via Bluetooth kan du lytte til din egen musik, podcast eller naturlyde direkte i masken. Den kan foldes 180°, så den fylder lidt i tasken, og det genopladelige batteri på 1200 mAh lades op via USB-C.",
    ],
    features: [
      { title: "Justerbar varme", text: "Varme op til cirka 42 °C." },
      { title: "Luftkompression", text: "Rytmisk lufttryk omkring tindinger og øjenområdet." },
      { title: "Vibration", text: "Blid vibration som supplement til varme og lufttryk." },
      { title: "Bluetooth-musik", text: "Lyt til musik, podcasts eller naturlyde under brug." },
      { title: "Foldbar 180°", text: "Folder fladt sammen – nem at tage med på rejsen." },
      { title: "Trådløs", text: "1200 mAh batteri med USB-C-opladning." },
    ],
    specs: [
      { label: "Funktioner", value: "Varme, luftkompression, vibration, Bluetooth, musik" },
      { label: "Varme", value: "Justerbar, op til cirka 42 °C" },
      { label: "Programmer", value: "Flere forudindstillede programmer (bl.a. afslapning og før sengetid)" },
      { label: "Batteri", value: "1200 mAh, genopladeligt" },
      { label: "Opladning", value: "USB-C" },
      { label: "Design", value: "Foldbar 180°" },
      { label: "Mål", value: "220 × 70 × 95 mm" },
      { label: "Vægt", value: "350 g (535 g med emballage)" },
      { label: "Æskens mål", value: "200 × 142 × 87 mm" },
      { label: "Anbefalet brug", value: "Cirka 15 minutter ad gangen" },
      { label: "Certificering", value: "Leverandøren oplyser CE, FCC og RoHS" },
    ],
    usage: [
      "Oplad øjenmassageren via USB-C før første brug.",
      "Tag briller og kontaktlinser af, og placér masken over øjnene. Justér remmen.",
      "Tænd, og vælg program, varme og eventuelt Bluetooth-musik.",
      "Brug den cirka 15 minutter ad gangen.",
    ],
    inBox: null,
    safety: EYE_SAFETY,
    faq: [
      {
        q: "Hvor varm bliver den?",
        a: "Varmen kan justeres op til cirka 42 °C. Start altid på laveste niveau.",
      },
      {
        q: "Kan jeg høre min egen musik?",
        a: "Ja. Forbind din telefon via Bluetooth, og lyt til musik, podcasts eller naturlyde direkte i masken.",
      },
      {
        q: "Hvad er forskellen på jeres tre øjenmassagere?",
        a: "Eye Premium har luftkompression, vibration, varme og Bluetooth. Eye Air har desuden LCD-display og 5 programmer. Eye Smart er den letteste (205 g) med grafenvarme og 3 programmer.",
      },
      DISCLAIMER_FAQ,
    ],
    seoTitle: "Øjenmassager med varme og Bluetooth – Vellivo Eye Premium",
    seoDescription:
      "Foldbar øjenmassager med varme op til 42 °C, luftkompression, vibration og Bluetooth-musik. Trådløs med USB-C. Pris i DKK inkl. moms.",
    images: gallery("Vellivo Eye Premium øjenmassager", [
      ["uw6fxs.webp", 2040, 2040],
      ["b6pmt2.webp", 2040, 2040],
      ["fsojws.webp", 2032, 2032],
      ["r7rg0v.webp", 2040, 2040],
      ["4j58jr.webp", 797, 797],
      ["6g1y9f.webp", 1494, 996],
    ]),
    supplierUrl:
      "https://zonyoutech.com/products/premium-heated-eye-massager-with-bluetooth-music-air-compression-oem-eye-massagers-manufacturer",
    supplierModel: "Premium Heated Eye Massager",
    missingData: ["Leverandørens modelnummer", ...COMMON_MISSING],
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    slug: "oejenmassager-air",
    sku: "VEL-EYE-AIR",
    name: "Vellivo Eye Air",
    categorySlug: "oejenmassagere",
    status: "published",
    priceOre: 59900,
    lowestPrice30dOre: null,
    stock: 0,
    alwaysInStock: true,
    tagline: "Øjenmassager med LCD-display, 5 programmer og Bluetooth",
    shortDescription:
      "Vellivo Eye Air har mikrovibration, blidt lufttryk og varme med konstant temperatur på 40–43 °C. LCD-display, 5 programmer, Bluetooth-lyd og foldbart design.",
    description: [
      "Vellivo Eye Air er lavet til at koble af efter en lang dag med skærm eller studier. Mikrovibration og blide lufttrykspunkter arbejder omkring øjnene og giver en dybt afslappende fornemmelse.",
      "Indbyggede varmepuder holder en behagelig, konstant temperatur på 40–43 °C, så du får en lun, spa-agtig pause. Forbind telefonen via Bluetooth, og lyt til musik, podcasts eller hvid støj under brug.",
      "På det letlæselige LCD-display og med de enkle knapper skifter du mellem 5 programmer, der kombinerer varme, vibration og lyd. Masken kan foldes 180°, og den justerbare elastikrem og den buede næsebro giver en tæt og behagelig pasform.",
    ],
    features: [
      { title: "Mikrovibration og lufttryk", text: "Kombineret massage omkring øjenområdet." },
      { title: "Konstant varme", text: "Varmepuder holder 40–43 °C." },
      { title: "LCD-display", text: "Se indstillingerne tydeligt, og betjen med enkle knapper." },
      { title: "5 programmer", text: "Kombinationer af varme, vibration og lyd." },
      { title: "Bluetooth-lyd", text: "Musik, podcasts eller hvid støj fra din telefon." },
      { title: "Foldbar 180°", text: "Pladsbesparende og nem at tage med." },
    ],
    specs: [
      { label: "Funktioner", value: "Mikrovibration, lufttryk, varme, Bluetooth-lyd" },
      { label: "Varme", value: "Konstant temperatur, 40–43 °C" },
      { label: "Programmer", value: "5" },
      { label: "Betjening", value: "Knapper og LCD-display" },
      { label: "Design", value: "Foldbar 180°, justerbar elastikrem, buet næsebro" },
      { label: "Farve", value: "Hvid" },
      { label: "Batteri og driftstid", value: null },
      { label: "Opladning", value: null },
      { label: "Mål og vægt", value: null },
      { label: "Certificering", value: "Leverandøren oplyser CE, FCC og RoHS" },
    ],
    usage: [
      "Tag briller og kontaktlinser af, og placér masken over øjnene. Justér elastikremmen.",
      "Tænd, og vælg et af de 5 programmer på displayet.",
      "Forbind eventuelt telefonen via Bluetooth for at lytte til lyd.",
      "Start på en lav indstilling, og brug den i en kort pause.",
    ],
    inBox: null,
    safety: EYE_SAFETY,
    faq: [
      {
        q: "Hvor varm bliver den?",
        a: "Varmepuderne holder en konstant temperatur på 40–43 °C.",
      },
      {
        q: "Passer den til alle hovedstørrelser?",
        a: "Elastikremmen kan justeres, og den buede næsebro giver en tæt pasform til de fleste.",
      },
      DISCLAIMER_FAQ,
    ],
    seoTitle: "Øjenmassager med LCD og 5 programmer – Vellivo Eye Air",
    seoDescription:
      "Øjenmassager med mikrovibration, lufttryk, varme 40–43 °C, LCD-display, 5 programmer og Bluetooth. Foldbar. Pris i DKK inkl. moms.",
    images: gallery("Vellivo Eye Air øjenmassager", [
      ["kcd47r.webp", 2040, 2040],
      ["0k4h0m.webp", 2040, 2040],
      ["7h26pj.webp", 2040, 2040],
      ["iqg78f.webp", 2000, 2000],
      ["dyg3u4.webp", 2000, 2000],
      ["gg3w0k.webp", 2040, 2040],
      ["h5wixp.webp", 797, 797],
    ]),
    supplierUrl: "https://zonyoutech.com/products/heated-air-compression-eye-massager-with-vibration-bluetooth-built-in-music",
    supplierModel: "Heated Air Compression Eye Massager",
    missingData: ["Leverandørens modelnummer", "Batteri, driftstid og opladning", "Mål og vægt", ...COMMON_MISSING],
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    slug: "oejenmassager-smart",
    sku: "VEL-EYE-SMART",
    name: "Vellivo Eye Smart",
    categorySlug: "oejenmassagere",
    status: "published",
    priceOre: 54900,
    lowestPrice30dOre: null,
    stock: 0,
    alwaysInStock: true,
    tagline: "Let øjenmassager med grafenvarme og Bluetooth-musik",
    shortDescription:
      "Vellivo Eye Smart vejer kun 205 g og har grafenvarme på 38–42 °C, vibration og lufttryk, 3 programmer, indbygget musik og Bluetooth. 15 minutters auto-sluk.",
    description: [
      "Vellivo Eye Smart er den letteste af vores øjenmassagere. Varmefilm af grafen bliver varme på få sekunder og holder en jævn temperatur mellem 38 og 42 °C.",
      "Vibration i flere frekvenser og rytmisk lufttryk giver en blid, æltende massage omkring øjnene. Vælg mellem 3 programmer, og lyt til den indbyggede musik eller din egen via Bluetooth.",
      "Skallen er i holdbar ABS, og øjenpuden er beklædt med blødt, hudvenligt kunstlæder. Masken kan foldes 180°, og den slukker automatisk efter 15 minutter. En fuld opladning via USB-C tager cirka 2,5 time og rækker til 70–80 minutters brug.",
    ],
    features: [
      { title: "Grafenvarme", text: "Hurtig og jævn varme på 38–42 °C." },
      { title: "Vibration og lufttryk", text: "Blid, æltende massage omkring øjnene." },
      { title: "3 programmer", text: "Vælg den massage, der passer dig." },
      { title: "Musik og Bluetooth", text: "Indbygget musik eller din egen via Bluetooth." },
      { title: "Kun 205 g", text: "Let og foldbar 180° – god til rejsen." },
      { title: "15 minutters auto-sluk", text: "Slukker automatisk efter en session." },
    ],
    specs: [
      { label: "Funktioner", value: "Grafenvarme, vibration, lufttryk, indbygget musik, Bluetooth" },
      { label: "Varme", value: "Konstant temperatur, 38–42 °C" },
      { label: "Programmer", value: "3 massageprogrammer" },
      { label: "Auto-sluk", value: "Efter 15 minutter" },
      { label: "Materialer", value: "ABS-skal, øjenpude i kunstlæder" },
      { label: "Batteri", value: "800 mAh" },
      { label: "Indgang", value: "DC 5 V / 1 A" },
      { label: "Opladning", value: "USB-C, cirka 2,5 time" },
      { label: "Driftstid", value: "70–80 minutter pr. opladning" },
      { label: "Design", value: "Foldbar 180°" },
      { label: "Mål", value: "220 × 90 × 82 mm" },
      { label: "Vægt", value: "205 g (375 g med emballage)" },
      { label: "Æskens mål", value: "190 × 115 × 95 mm" },
      { label: "Farver hos producenten", value: "Sølv og pink" },
      { label: "Certificering", value: "Leverandøren oplyser CE, FCC og RoHS" },
    ],
    usage: [
      "Oplad via USB-C før første brug (cirka 2,5 time).",
      "Tag briller og kontaktlinser af, og placér masken over øjnene.",
      "Tænd, og vælg et af de 3 programmer. Slå eventuelt musik eller Bluetooth til.",
      "Masken slukker automatisk efter 15 minutter.",
    ],
    inBox: null,
    safety: EYE_SAFETY,
    faq: [
      {
        q: "Hvor længe holder batteriet?",
        a: "70–80 minutter pr. opladning – svarende til cirka fem sessioner á 15 minutter.",
      },
      {
        q: "Hvad er grafenvarme?",
        a: "Tynde varmefilm af grafen, der bliver varme på få sekunder og fordeler varmen jævnt.",
      },
      DISCLAIMER_FAQ,
    ],
    seoTitle: "Let øjenmassager med grafenvarme – Vellivo Eye Smart",
    seoDescription:
      "Øjenmassager på 205 g med grafenvarme 38–42 °C, vibration, lufttryk, 3 programmer og Bluetooth-musik. Pris i DKK inkl. moms.",
    images: gallery("Vellivo Eye Smart øjenmassager", [
      ["fgd32w.webp", 2040, 2040],
      ["083dpl.webp", 2040, 2040],
      ["0hhjk4.webp", 2040, 2040],
      ["e4e5d966-62f5-4be0-b5dd-009a9d977fee.webp", 1785, 2391],
      ["18fce02e-dbda-417f-9d7d-da4f5e977c2f.webp", 1785, 2391],
      ["b259caaa-ad7b-44b8-ba86-408007d9bfc3.webp", 1757, 2353],
      ["aada0e3c-60f2-4f42-bdc6-3e79a76aea7d.webp", 1785, 2391],
    ]),
    supplierUrl:
      "https://zonyoutech.com/products/smart-eye-massager-with-heat-and-bluetooth-music-premium-eyecare-wireless-device",
    supplierModel: "Smart Eye Massager with Heat",
    missingData: ["Leverandørens modelnummer", "Valg af farve (sølv/pink)", ...COMMON_MISSING],
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
