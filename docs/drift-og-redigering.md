# Drift og redigering (uden adminområde)

Webshoppen har bevidst intet adminområde. Alt indhold redigeres i GitHub – direkte i browseren på github.com eller ved at bede Claude Code om ændringen. Når ændringen er merget til `main`, bygger og udgiver Vercel automatisk (typisk 1–2 minutter). `npm test` kører kvalitetstjek, så fejl i kataloget opdages før udgivelse.

## Ret et produkt, en pris eller en tekst
Fil: `src/data/catalog.ts`
- **Pris:** `priceOre` i øre inkl. moms (899 kr. = `89900`).
- **Tekster:** `tagline`, `shortDescription`, `description`, `features`, `usage`, `safety`, `faq`, `seoTitle` (≤ 60 tegn), `seoDescription` (≤ 160 tegn).
- **Specifikationer:** udfyld `value` (fx `"3 niveauer, ca. 40–55 °C"`). `null` vises som "Afventer verificering".
- **Indhold i æsken:** `inBox: ["…", "…"]`.

## Produktbilleder
Produkterne bruger i dag leverandørens billeder direkte fra `https://assets.laicms.com/7243e482us/…` (tilladt i `next.config.ts`). Vil du bruge egne billeder, så følg trinene nedenfor og udskift URL'erne.

### Tilføj egne produktbilleder
1. Læg billederne i `public/produkter/<slug>/` (WebP eller AVIF, ca. 1600×1600 px, < 300 KB).
2. Tilføj dem på produktet:
   ```ts
   images: [{ url: "/produkter/laendemassager/forfra.webp", alt: "Vellivo Lumbar set forfra på lys baggrund", width: 1600, height: 1600 }],
   ```
3. Brug kun billeder, hvor den kommercielle brugsret er dokumenteret (fx skriftlig tilladelse fra leverandøren). Gem dokumentationen.
Next.js leverer automatisk AVIF/WebP i rette størrelse og lazy-loader billeder under folden.

## Udgiv et produkt (gør det købbart)
Tjekliste – alle skal være opfyldt:
- [ ] Leverandørens modelnummer (`supplierModel`) og datablad
- [ ] Alle `specs` udfyldt og kontrolleret mod datablad/manual
- [ ] CE-overensstemmelseserklæring og testrapporter (EMC, LVD/sikkerhed, RoHS; evt. radioudstyrsdirektivet ved Bluetooth; batterier) og dansk brugsanvisning
- [ ] Importør (navn/adresse) på produkt/emballage, jf. produktsikkerhedsforordningen (GPSR)
- [ ] Billeder med dokumenteret brugsret i `public/produkter/`
- [ ] Endelig pris godkendt (se `npm run prisberegner`)
- [ ] `stock` sat til modtaget antal
- [ ] `missingData: []`
- [ ] `status: "published"`

`npm test` fejler, hvis et udgivet produkt mangler billeder, specifikationer, model eller har punkter i `missingData`. Udgivne produkter kommer automatisk i sitemap, får Product/Offer-schema og bliver indekserbare.

## Lager
`stock` = modtaget antal i alt. Solgte enheder tælles automatisk. Ved ny levering: læg den modtagne mængde til `stock` (fx 50 → 100). Tilgængeligt lager vises på siden og kontrolleres ved checkout. Opstår et oversalg (to kunder betaler samtidig for sidste enhed), markeres ordren `needsAttention` med en forklaring.

## Kampagner
Fil: `src/data/campaigns.ts`. Se eksemplet i filen. Rabatten beregnes på serveren og afrundes til hele kroner. En overstreget "før-pris" vises kun, hvis `lowestPrice30dOre` er sat på produktet (laveste pris de seneste 30 dage, jf. prismærkningsreglerne).

## Fragt
`defaultShipping` i `src/data/catalog.ts` (`flatRateOre`, `freeThresholdOre`).

## Virksomhedsoplysninger og vilkår
`src/config/site.ts` – udfyld `company` og `terms`. Felter med `null` vises som gule "[… udfyldes]"-markeringer på siden.

## Se ordrer, nyhedsbrev og kontaktbeskeder
- **Betalinger og kunder:** Stripe Dashboard → Payments (inkl. leveringsadresse og varelinjer).
- **Ordrer med status:** Vercel → Project → Storage → Blob → mappen `orders/` (JSON pr. ordre; `status`, `needsAttention`, `items`, `customer`).
- **Nyhedsbrev:** mappen `newsletter/` (e-mail, samtykketekst og tidspunkt).
- **Kontaktbeskeder:** mappen `contact/`.
Blob-storen er **privat** – filerne kan kun ses af projektets medlemmer.

## Prisberegner
```bash
cp prisberegning/eksempel-laendemassager.json prisberegning/lumbar.json
# udfyld tallene i lumbar.json
npm run prisberegner -- prisberegning/lumbar.json
```
Beregner omsætning ekskl. moms, samlede variable omkostninger, dækningsbidrag, dækningsgrad, bidrag efter annoncering, break-even-pris, maksimal annonceringsomkostning og prisforskel til konkurrent. Importmoms behandles som fradragsberettiget, når `vatRegistered: true`. Mangler input, vises avancen som "ikke verificeret".
