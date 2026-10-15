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
Produktdata og billeder er hentet fra leverandørens fire produktsider (15.10.2026) via en Vercel Sandbox, da leverandørens site er blokeret i udviklingsmiljøet. Følgende mangler stadig:
- [ ] **Alle produkter:** indhold i emballagen, dansk brugsanvisning og sikkerhedsinformation, modelspecifik CE-overensstemmelseserklæring og testrapporter (EMC, lavspænding, RoHS, radioudstyrsdirektivet pga. Bluetooth, batteriforordningen), WEEE-registrering, importørens navn/adresse på produkt/emballage (GPSR)
- [ ] **Billeder:** skriftlig bekræftelse fra ZonyouTech på, at I må bruge deres billeder kommercielt. Billederne hentes i dag direkte fra leverandørens CDN (assets.laicms.com) – kopiér dem gerne til `public/produkter/` for at være uafhængig af leverandørens site. Kontrollér også, at billederne ikke indeholder engros-/OEM-tekst eller helbredspåstande.
- [ ] **Vellivo Eye Premium, Air og Smart:** leverandørens modelnumre
- [ ] **Vellivo Eye Air:** batteri, driftstid, opladning, mål og vægt (ikke oplyst af leverandøren)
- [ ] **Vellivo Eye Smart:** valg af farve (sølv eller pink)
- [ ] EMS-funktionen i Vellivo Lumbar: kontrollér advarsler i producentens manual (pacemaker, graviditet, epilepsi m.m.)
- [ ] Indkøbspris, fragt, forsikring, told (HS-kode) og øvrige importomkostninger til prisberegneren
- [ ] Modtaget lagerantal (`stock`)

**Udeladt bevidst:** Leverandørens påstande som "lindrer rygsmerter", "retter rygsøjlen", "heler muskelvæv", "fremmer blodcirkulationen" og "mindsker mørke rande og hævelser" er ikke oversat, da sådanne helbredspåstande ikke må bruges om velværeprodukter. Engrosoplysninger (MOQ, private label, leveringstid fra fabrik) er også udeladt.

## Priser
- [ ] Godkendelse af endelige priser. Foreløbige priser: Lumbar 899, Eye Premium 699, Eye Air 599, Eye Smart 549 kr. Markedsanalysen i [danish-market-pricing.md](danish-market-pricing.md) viser, at sammenlignelige øjenmassagere med varme og lufttryk ofte koster 526–799 kr.
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
