# Testresultater

**Dato:** 15. oktober 2026 · **Miljø:** Node 22, Next.js 16.4.1, Chromium (Playwright 1.56)

| Tjek | Kommando | Resultat |
|---|---|---|
| Lint | `npm run lint` | ✅ ingen fejl |
| TypeScript | `npm run typecheck` | ✅ ingen fejl |
| Enhedstests | `npm test` | ✅ 44/44 bestået |
| Produktionsbuild | `npm run build` | ✅ uden fejl og advarsler |
| Browser-røgtest (mobil 375 px + desktop 1366 px) | `npm run test:e2e` | ✅ 92/92 tjek bestået (4 produkter, 2 kategorier) |

## Hvad er testet

- **Produktvisning og priser:** alle 4 produktsider, 2 kategorier, shop og forside returnerer 200 med én H1; ukendt produkt giver 404.
- **Momsberegning:** 25 % moms udregnes som 20 % af bruttobeløbet (899 kr. → 179,80 kr.).
- **Kurv:** tilføj (via localStorage), beregn subtotal, fjern vare; kladder afvises med forklaring og uden betalingsknap.
- **Fragt:** fast fragt under grænsen, gratis over grænsen.
- **Kampagner:** aktiv/inaktiv/fremtidig/udløbet, produktafgrænsning, største rabat vinder, før-pris kun med 30-dages laveste pris.
- **Checkout-validering:** kræver accept af betingelser, ignorerer klientpriser, afviser ugyldige slugs/antal, tom kurv, kladder, udsolgte varer og dubletter, der omgår lagerkontrol.
- **Webhook-signatur:** gyldig signatur accepteres; forkert hemmelighed og manipuleret payload afvises; usigneret kald til endpointet afvises.
- **Gentagne webhooks:** samme hændelse to gange → `duplicate`; ny hændelse for betalt ordre → `already_paid`; lager trækkes kun én gang.
- **Mislykkede/asynkrone betalinger:** `unpaid` → `processing` uden lagertræk; `async_payment_failed` → `failed`; `expired` → `expired`.
- **Beløbsafvigelse:** ordren sættes til `needs_review`, lager trækkes ikke.
- **Lager:** samtidige salg tælles korrekt med ETag-låsning; samme ordre registreres kun én gang; oversalg markeres.
- **Datalager:** forældet ETag og dubletter afvises; usikre stier afvises.
- **Katalogkvalitet:** unikke id/slug/SKU, gyldige kategorier, SEO-længder, ingen helbredspåstande, udgivne produkter kræver verificerede data og billeder.
- **SEO:** unik titel, meta description og canonical på alle sider; kladder har `noindex` og ingen Product-schema; BreadcrumbList findes; ingen AggregateRating; sitemap udelader kladder; gammel URL `/products/…` → 308 til `/produkter/…`.
- **Mobil:** ingen vandret scroll på 375 px; mobilmenu åbner, navigerer og lukker.
- **Manglende miljøvariabler:** Stripe/Blob-validering giver tydelige fejl; checkout og webhook svarer 503 uden konfiguration; lokal fil-lagring er spærret i produktion.
- **JavaScript-fejl:** ingen i browseren på nogen testet side.

## Ikke testet (kræver konti/nøgler)

- Et rigtigt Stripe-testkøb end-to-end (kræver `sk_test_` og webhook-secret) – se docs/stripe-opsaetning.md for testscenarier.
- Vercel Blob mod en rigtig store (adapteren er testet via samme interface med in-memory og fil-lager).
- Den udgivne side på Vercel (se rapporten i pull requesten).

## Enhedstests (detaljer)

```
✓ tests/unit/pricing.test.ts > fragt > opkræver fragt under grænsen og giver gratis fragt over
✓ tests/unit/pricing.test.ts > kampagner > anvender aktiv kampagne og runder til hele kroner
✓ tests/unit/pricing.test.ts > kampagner > ignorerer inaktive, fremtidige og udløbne kampagner
✓ tests/unit/pricing.test.ts > kampagner > gælder kun valgte produkter
✓ tests/unit/pricing.test.ts > kampagner > viser kun før-pris, når laveste 30-dages pris er kendt
✓ tests/unit/pricing.test.ts > kampagner > vælger den største rabat ved flere kampagner
✓ tests/unit/pricing.test.ts > priceCart (autoritativ kurvberegning) > beregner subtotal, fragt, total og moms
✓ tests/unit/pricing.test.ts > priceCart (autoritativ kurvberegning) > giver gratis fragt over grænsen
✓ tests/unit/pricing.test.ts > priceCart (autoritativ kurvberegning) > slår dubletter sammen og kontrollerer samlet lager
✓ tests/unit/pricing.test.ts > priceCart (autoritativ kurvberegning) > afviser kladder, ukendte produkter og ugyldige antal
✓ tests/unit/pricing.test.ts > priceCart (autoritativ kurvberegning) > afviser tom kurv og antal over maksimum
✓ tests/unit/pricing.test.ts > priceCart (autoritativ kurvberegning) > udsolgt-besked er forståelig
✓ tests/unit/webhook.test.ts > Stripe webhook-signatur > accepterer en korrekt signeret payload
✓ tests/unit/webhook.test.ts > Stripe webhook-signatur > afviser forkert hemmelighed og manipuleret payload
✓ tests/unit/webhook.test.ts > processStripeEvent > markerer ordren betalt og registrerer salget på lageret
✓ tests/unit/webhook.test.ts > processStripeEvent > markerer utilstrækkeligt lager til manuel opfølgning
✓ tests/unit/webhook.test.ts > processStripeEvent > er idempotent ved gentagne webhooks
✓ tests/unit/webhook.test.ts > processStripeEvent > markerer ikke betalt ved asynkron betaling, der endnu ikke er gennemført
✓ tests/unit/webhook.test.ts > processStripeEvent > håndterer mislykket asynkron betaling
✓ tests/unit/webhook.test.ts > processStripeEvent > markerer udløbne/annullerede sessioner
✓ tests/unit/webhook.test.ts > processStripeEvent > sender ordren til manuel kontrol ved beløbsafvigelse og trækker ikke lager
✓ tests/unit/webhook.test.ts > processStripeEvent > håndterer ukendte ordrer og irrelevante hændelser
✓ tests/unit/store.test.ts > datalager > afviser skrivning med forældet ETag og dubletter
✓ tests/unit/store.test.ts > datalager > afviser usikre stier
✓ tests/unit/store.test.ts > datalager > registrerer samtidige salg korrekt og kun én gang pr. ordre
✓ tests/unit/checkout.test.ts > checkout-validering > kræver accept af handelsbetingelser
✓ tests/unit/checkout.test.ts > checkout-validering > ignorerer/afviser klientpriser og ugyldige værdier
✓ tests/unit/checkout.test.ts > checkout-validering > bygger en Stripe-session i DKK med serverberegnede beløb
✓ tests/unit/catalog.test.ts > produktkatalog > har unikke id'er, slugs og SKU'er
✓ tests/unit/catalog.test.ts > produktkatalog > refererer kun til eksisterende kategorier
✓ tests/unit/catalog.test.ts > produktkatalog > har gyldige priser og SEO-felter
✓ tests/unit/catalog.test.ts > produktkatalog > udgivne produkter har verificerede data, billeder og lager
✓ tests/unit/catalog.test.ts > produktkatalog > indeholder ingen helbredspåstande
✓ tests/unit/catalog.test.ts > produktkatalog > kampagner har gyldige rabatter og perioder
✓ tests/unit/env.test.ts > miljøvariabler > kaster en tydelig fejl, når Stripe mangler
✓ tests/unit/env.test.ts > miljøvariabler > afviser forkert formaterede nøgler og registrerer test/live
✓ tests/unit/env.test.ts > miljøvariabler > kræver Vercel Blob i produktion – lokal lagring kun under udvikling
✓ tests/unit/pricing-calculator.test.ts > prisberegner > markerer manglende input og er ufuldstændig
✓ tests/unit/pricing-calculator.test.ts > prisberegner > beregner dækningsbidrag for momsregistreret virksomhed
✓ tests/unit/pricing-calculator.test.ts > prisberegner > break-even-prisen giver nul i bidrag efter annoncering
✓ tests/unit/pricing-calculator.test.ts > prisberegner > medregner importmoms som omkostning, når virksomheden ikke er momsregistreret
✓ tests/unit/pricing-calculator.test.ts > prisberegner > break-even inkluderer fragt opkrævet hos kunden
✓ tests/unit/money.test.ts > moms og formattering > beregner momsandelen af en pris inkl. 25 % moms
✓ tests/unit/money.test.ts > moms og formattering > formaterer beløb i DKK
```

## Browser-røgtest (detaljer)

```

== mobil (375px) ==
  ✓ / → 200, h1=1, canonical=ja, overflow=0px
  ✓ /shop → 200, h1=1, canonical=ja, overflow=0px
  ✓ /kategori/ryg-og-laend → 200, h1=1, canonical=ja, overflow=0px
  ✓ /kategori/oejenmassagere → 200, h1=1, canonical=ja, overflow=0px
  ✓ /produkter/laendemassager → 200, h1=1, canonical=ja, overflow=0px
  ✓ /produkter/oejenmassager → 200, h1=1, canonical=ja, overflow=0px
  ✓ /produkter/oejenmassager-air → 200, h1=1, canonical=ja, overflow=0px
  ✓ /produkter/oejenmassager-smart → 200, h1=1, canonical=ja, overflow=0px
  ✓ /guides → 200, h1=1, canonical=ja, overflow=0px
  ✓ /guides/saadan-vaelger-du-en-laendemassager → 200, h1=1, canonical=ja, overflow=0px
  ✓ /om-vellivo → 200, h1=1, canonical=ja, overflow=0px
  ✓ /kontakt → 200, h1=1, canonical=ja, overflow=0px
  ✓ /faq → 200, h1=1, canonical=ja, overflow=0px
  ✓ /levering → 200, h1=1, canonical=ja, overflow=0px
  ✓ /retur-og-fortrydelsesret → 200, h1=1, canonical=ja, overflow=0px
  ✓ /handelsbetingelser → 200, h1=1, canonical=ja, overflow=0px
  ✓ /privatlivspolitik → 200, h1=1, canonical=ja, overflow=0px
  ✓ /cookiepolitik → 200, h1=1, canonical=ja, overflow=0px
  ✓ /kurv → 200, h1=1, canonical=ja, overflow=0px
  ✓ /checkout → 200, h1=1, canonical=ja, overflow=0px
  ✓ /ordre/annulleret → 200, h1=1, canonical=ja, overflow=0px
  ✓ kladde-produkt har noindex
  ✓ kladde-produkt har ingen Product-schema
  ✓ BreadcrumbList-schema findes
  ✓ ingen AggregateRating
  ✓ kladde viser 'Få besked' i stedet for inaktiv købsknap
  ✓ mobilmenu åbner
  ✓ mobilmenu navigerer til /shop
  ✓ mobilmenu lukker efter navigation
  ✓ kurven afviser kladder med forklaring
  ✓ ingen 'Gå til kassen' for ugyldig kurv
  ✓ subtotal beregnes (2 × 899 kr.)
  ✓ vare kan fjernes fra kurven
  ✓ ingen JavaScript-fejl ()

== desktop (1366px) ==
  ✓ / → 200, h1=1, canonical=ja, overflow=0px
  ✓ / har unik titel: "Vellivo – massageapparater og wellness til hjemmet | Vellivo"
  ✓ /shop → 200, h1=1, canonical=ja, overflow=0px
  ✓ /shop har unik titel: "Shop – alle massageapparater | Vellivo"
  ✓ /kategori/ryg-og-laend → 200, h1=1, canonical=ja, overflow=0px
  ✓ /kategori/ryg-og-laend har unik titel: "Lændemassager med varme og stræk | Vellivo"
  ✓ /kategori/oejenmassagere → 200, h1=1, canonical=ja, overflow=0px
  ✓ /kategori/oejenmassagere har unik titel: "Øjenmassager med varme og Bluetooth | Vellivo"
  ✓ /produkter/laendemassager → 200, h1=1, canonical=ja, overflow=0px
  ✓ /produkter/laendemassager har unik titel: "Lændemassager med stræk, varme og EMS – Vellivo Lumbar | Vellivo"
  ✓ /produkter/oejenmassager → 200, h1=1, canonical=ja, overflow=0px
  ✓ /produkter/oejenmassager har unik titel: "Øjenmassager med varme og Bluetooth – Vellivo Eye Premium | Vellivo"
  ✓ /produkter/oejenmassager-air → 200, h1=1, canonical=ja, overflow=0px
  ✓ /produkter/oejenmassager-air har unik titel: "Øjenmassager med LCD og 5 programmer – Vellivo Eye Air | Vellivo"
  ✓ /produkter/oejenmassager-smart → 200, h1=1, canonical=ja, overflow=0px
  ✓ /produkter/oejenmassager-smart har unik titel: "Let øjenmassager med grafenvarme – Vellivo Eye Smart | Vellivo"
  ✓ /guides → 200, h1=1, canonical=ja, overflow=0px
  ✓ /guides har unik titel: "Købsguides – vælg det rigtige massageapparat | Vellivo"
  ✓ /guides/saadan-vaelger-du-en-laendemassager → 200, h1=1, canonical=ja, overflow=0px
  ✓ /guides/saadan-vaelger-du-en-laendemassager har unik titel: "Lændemassager: Sådan vælger du den rigtige | Vellivo"
  ✓ /om-vellivo → 200, h1=1, canonical=ja, overflow=0px
  ✓ /om-vellivo har unik titel: "Om Vellivo | Vellivo"
  ✓ /kontakt → 200, h1=1, canonical=ja, overflow=0px
  ✓ /kontakt har unik titel: "Kontakt | Vellivo"
  ✓ /faq → 200, h1=1, canonical=ja, overflow=0px
  ✓ /faq har unik titel: "Ofte stillede spørgsmål | Vellivo"
  ✓ /levering → 200, h1=1, canonical=ja, overflow=0px
  ✓ /levering har unik titel: "Levering | Vellivo"
  ✓ /retur-og-fortrydelsesret → 200, h1=1, canonical=ja, overflow=0px
  ✓ /retur-og-fortrydelsesret har unik titel: "Retur og fortrydelsesret | Vellivo"
  ✓ /handelsbetingelser → 200, h1=1, canonical=ja, overflow=0px
  ✓ /handelsbetingelser har unik titel: "Handelsbetingelser | Vellivo"
  ✓ /privatlivspolitik → 200, h1=1, canonical=ja, overflow=0px
  ✓ /privatlivspolitik har unik titel: "Privatlivspolitik | Vellivo"
  ✓ /cookiepolitik → 200, h1=1, canonical=ja, overflow=0px
  ✓ /cookiepolitik har unik titel: "Cookiepolitik | Vellivo"
  ✓ /kurv → 200, h1=1, canonical=ja, overflow=0px
  ✓ /kurv har unik titel: "Kurv | Vellivo"
  ✓ /checkout → 200, h1=1, canonical=ja, overflow=0px
  ✓ /checkout har unik titel: "Kassen | Vellivo"
  ✓ /ordre/annulleret → 200, h1=1, canonical=ja, overflow=0px
  ✓ /ordre/annulleret har unik titel: "Betaling annulleret | Vellivo"
  ✓ kladde-produkt har noindex
  ✓ kladde-produkt har ingen Product-schema
  ✓ BreadcrumbList-schema findes
  ✓ ingen AggregateRating
  ✓ kladde viser 'Få besked' i stedet for inaktiv købsknap
  ✓ kurven afviser kladder med forklaring
  ✓ ingen 'Gå til kassen' for ugyldig kurv
  ✓ subtotal beregnes (2 × 899 kr.)
  ✓ vare kan fjernes fra kurven
  ✓ ingen JavaScript-fejl ()
  ✓ /api/checkout afviser køb af kladde / ukonfigureret betaling (503)
  ✓ /api/webhooks/stripe afviser usigneret kald (503)
  ✓ sitemap udelader kladde-produkter
  ✓ sitemap indeholder kategorier
  ✓ ukendt produkt giver 404
  ✓ gammel URL omdirigeres permanent

Alle røgtests bestået
```
