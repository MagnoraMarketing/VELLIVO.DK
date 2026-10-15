# Vellivo.dk

Dansk wellness-webshop for **Vellivo – mere velvære i hverdagen.**
Lændemassager og øjenmassagere fra leverandøren ZonyouTech. Priser i DKK inkl. 25 % moms.

**Teknik:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Stripe Checkout · Vercel (hosting + Vercel Blob) · GitHub.
Ingen database og intet adminområde – produktdata redigeres i koden via GitHub (eller Claude Code), og Vercel udgiver automatisk.

> **Sortiment:** Vellivo Lumbar (lændemassager, model ST-1202C), Vellivo Eye Premium, Vellivo Eye Air og Vellivo Eye Smart (øjenmassagere). Produktdata og billeder er hentet fra leverandørens produktsider og skrevet om til dansk for slutkunder – uden engrosoplysninger og uden leverandørens helbredspåstande.
>
> **Status:** Alle fire produkter er udgivet og vises som **"På lager"** uden antal (`alwaysInStock` i `src/data/catalog.ts`). Køb kræver, at `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` og en privat Vercel Blob-store (`BLOB_READ_WRITE_TOKEN`) er sat i Vercel – ellers svarer kassen med en venlig fejlbesked. Dokumentation, der stadig mangler (CE, dansk brugsanvisning m.m.), står i [docs/missing-information.md](docs/missing-information.md).

## Arkitektur

| Område | Hvor |
|---|---|
| Produkter, kategorier, priser, fragt | `src/data/catalog.ts` |
| Kampagner | `src/data/campaigns.ts` |
| Købsguides / FAQ | `src/data/guides.ts`, `src/data/faq.ts` |
| Virksomhedsoplysninger og vilkår | `src/config/site.ts` |
| Pris-, moms-, fragt- og kurvlogik (bruges af både browser og server) | `src/lib/pricing.ts`, `src/lib/money.ts` |
| Checkout (Stripe Checkout Session) | `src/app/api/checkout/route.ts`, `src/lib/checkout.ts` |
| Stripe-webhook (signaturverificeret, idempotent) | `src/app/api/webhooks/stripe/route.ts`, `src/lib/stripe/webhook.ts` |
| Ordrer, lagertællere, nyhedsbrev, kontakt | Vercel Blob (privat) – `src/lib/data/*`, `src/lib/store/*` |
| Prisberegner (dækningsbidrag, break-even) | `npm run prisberegner -- prisberegning/<fil>.json` |

### Betalingsflow
1. Kunden lægger varer i kurven (kun slug + antal gemmes i browseren).
2. `/checkout` → `POST /api/checkout`: serveren validerer produkter, status, antal og lager og beregner pris, kampagne, fragt og moms. **Klientens priser bruges aldrig.**
3. Serveren opretter en ordre (`pending`) i Vercel Blob og en Stripe Checkout Session (DKK, engangsbetaling, levering i DK).
4. Kunden betaler hos Stripe. Stripe sender kvittering på e-mail.
5. Stripe kalder `/api/webhooks/stripe`; signaturen verificeres med `STRIPE_WEBHOOK_SECRET`.
6. Ordren markeres `paid` (beløb, valuta og session kontrolleres), og salget trækkes fra lageret præcis én gang. Gentagne webhooks ignoreres.
7. Kvitteringssiden viser kun status – den markerer **aldrig** en ordre betalt.

Asynkrone betalinger (`processing` → `paid`/`failed`), udløbne sessioner (`expired`) og beløbsafvigelser (`needs_review`) håndteres. Kortdata håndteres udelukkende af Stripe.

### Lager
`stock` i `catalog.ts` = **modtaget antal i alt**. Solgte enheder tælles i Vercel Blob (`inventory/<id>.json`) med ETag-låsning. Tilgængeligt = modtaget − solgt. Ved genopfyldning øges `stock` i koden.

## Kom i gang lokalt

```bash
npm install
cp .env.example .env.local   # udfyld Stripe test-nøgler (valgfrit)
npm run dev                  # http://localhost:3000
```
Uden `BLOB_READ_WRITE_TOKEN` gemmes data lokalt i `./.data` (kun under udvikling).

Stripe-webhooks lokalt: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` og sæt det viste `whsec_…` som `STRIPE_WEBHOOK_SECRET`.

## Kvalitetstjek

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # Vitest: moms, pris, fragt, kampagner, kurv, webhook-signatur, idempotens, lager, katalogkrav
npm run build       # Produktionsbuild
# Røgtest i browser (mobil + desktop):
VELLIVO_LOCAL_STORE=1 npx next start -p 3100 &
BASE_URL=http://localhost:3100 npm run test:e2e
```
Se [docs/testresultater.md](docs/testresultater.md).

## Dokumentation

- [docs/danish-market-pricing.md](docs/danish-market-pricing.md) – konkurrent- og prisanalyse
- [docs/drift-og-redigering.md](docs/drift-og-redigering.md) – redigér produkter, billeder, lager, kampagner; se ordrer
- [docs/stripe-opsaetning.md](docs/stripe-opsaetning.md) – Stripe test og **live mode** trin for trin
- [docs/vercel-deployment.md](docs/vercel-deployment.md) – Vercel, Blob og **publicering på vellivo.dk**
- [docs/missing-information.md](docs/missing-information.md) – manglende oplysninger før lancering
- [docs/testresultater.md](docs/testresultater.md) – testresultater

## Miljøvariabler

| Variabel | Påkrævet | Beskrivelse |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ja (produktion) | fx `https://vellivo.dk` |
| `STRIPE_SECRET_KEY` | for betaling | `sk_test_…` / `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | for betaling | `whsec_…` |
| `BLOB_READ_WRITE_TOKEN` | ja (produktion) | Sættes automatisk, når en **privat** Vercel Blob-store forbindes |

Variablerne valideres på serveren (`src/lib/env.ts`). Mangler de, svarer checkout/webhook med 503 og en forståelig besked – resten af shoppen virker.
