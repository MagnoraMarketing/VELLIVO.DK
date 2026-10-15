# Manglende oplysninger før lancering

Webshoppen er teknisk klar, men følgende skal leveres/besluttes af virksomheden. Intet af nedenstående er opfundet i koden – felterne vises som gule "[… udfyldes]"-markeringer eller "Afventer verificering".

## Juridisk og virksomhed (`src/config/site.ts`)
- [ ] Juridisk virksomhedsnavn
- [ ] CVR-nummer
- [ ] Adresse og returadresse
- [ ] Kontakt-e-mail og telefon
- [ ] Importør (navn og adresse) – kræves på produkt/emballage (GPSR)
- [ ] Leveringstid og fragtfirma
- [ ] Beslutning: hvem betaler returfragt
- [ ] Evt. garanti ud over 2 års reklamationsret
- [ ] Opbevaringsperiode for kontaktbeskeder (privatlivspolitik)
- [ ] Databehandleraftaler med Vercel og Stripe; bekræft Blob-region
- [ ] Juridisk gennemgang af handelsbetingelser, privatlivs-, cookie- og returpolitik (siderne er markeret som udkast)

## Domæne og varemærke
- [ ] **vellivo.dk er ikke registreret** (Vercels registry-opslag 15.10.2026: ledigt). Registrér domænet i virksomhedens navn.
- [ ] Varemærkesøgning for "Vellivo" i Patent- og Varemærkestyrelsen (DKPTO) og EUIPO er **ikke** udført. Websøgning viste andre brugere af navnet: vellivo.store (børneprodukt) og vellivo.com ("Vellivo X"). Navnet "Velliv" (pensionsselskab) ligger tæt op ad. Anbefaling: få en varemærkeretlig vurdering før lancering.

## Leverandør og produkter (`src/data/catalog.ts`)
Leverandørens website (zonyoutech.com) kunne ikke tilgås fra udviklingsmiljøet. For **hvert** produkt mangler:
- [ ] Konkret model og modelnummer (for Eye, Neck og Scalp skal modellen også vælges i kataloget)
- [ ] Datablad: varme, vibration, luftkompression, EMS, intensitet, betjening, strømforsyning, batteri/ladetid, mål, vægt, materialer, IP-klasse (Scalp)
- [ ] Indhold i emballagen
- [ ] Dansk brugsanvisning og sikkerhedsinformation
- [ ] EU-overensstemmelseserklæring (CE) og testrapporter: EMC-direktivet, lavspændingsdirektivet (hvis relevant), RoHS, radioudstyrsdirektivet (RED) hvis Bluetooth/trådløst, batteriforordningen ved batterier, WEEE-registrering (producentansvar i DK via DPA-System), GPSR-krav
- [ ] Afklaring af, om produktet markedsføres som medicinsk udstyr (det må det ikke med de nuværende tekster)
- [ ] Produktbilleder/video med skriftlig ret til kommerciel brug
- [ ] Indkøbspris, MOQ, fragt, forsikring, told (HS-kode), øvrige importomkostninger
- [ ] Modtaget lagerantal

## Priser
- [ ] Godkendelse af endelige priser. Anbefalinger i [danish-market-pricing.md](danish-market-pricing.md): Lumbar 899, Eye 549, Neck 299–349, Hand 799, Scalp 269 kr.
- [ ] Manuel kontrol af konkurrentpriser og fragt (kun indhentet via søgeresultater)
- [ ] Prisberegning med faktiske omkostninger (`npm run prisberegner`)
- [ ] Endelig fragtpris og grænse for gratis fragt (nu foreløbigt 49 kr. / gratis over 500 kr.)

## Konti og nøgler
- [ ] Stripe-konto aktiveret (live mode) – se [stripe-opsaetning.md](stripe-opsaetning.md)
- [ ] Privat Vercel Blob-store forbundet – se [vercel-deployment.md](vercel-deployment.md)
- [ ] Udsendelse af nyhedsbrev: tilmeldinger gemmes (med samtykketekst og tidspunkt), men der er ikke valgt et e-mailsystem til udsendelse/afmelding. Double opt-in anbefales, når et system vælges.

## SEO
- [ ] Søgevolumen og konkurrence for danske søgeord (kræver fx Google Keyword Planner/Search Console)
- [ ] Google Search Console opsat efter lancering
