# Vercel – deployment og publicering på vellivo.dk

## Status (15.10.2026)
- Vercel-projektet **`vellivo`** findes i teamet *magnoramarketing's projects* og er koblet til GitHub-repoet (`main` → produktion).
- Projektet havde ingen miljøvariabler, og framework-forvalget var tomt. `vercel.json` sætter nu `framework: "nextjs"` og region `fra1` (Frankfurt, tættest på Danmark).
- **Domæne:** Vercels registry-opslag angiver **vellivo.dk som ledigt** – dvs. domænet er ikke registreret endnu. Det skal registreres, før siden kan publiceres på vellivo.dk.

## 1. Opret privat Blob-store
1. Vercel → Project `vellivo` → **Storage → Create → Blob**.
2. Vælg **Private** adgang og region tæt på Danmark (fx Frankfurt).
3. Forbind storen til projektet for **Production, Preview og Development**. Vercel tilføjer automatisk `BLOB_READ_WRITE_TOKEN`.

> Storen skal være **privat**, fordi den indeholder kundeoplysninger (ordrer, nyhedsbrev, kontaktbeskeder).

## 2. Miljøvariabler
Project → Settings → Environment Variables:

| Variabel | Production | Preview |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://vellivo.dk` | (kan udelades) |
| `STRIPE_SECRET_KEY` | `sk_live_…` (ved lancering) | `sk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | live `whsec_…` | test `whsec_…` |
| `BLOB_READ_WRITE_TOKEN` | automatisk | automatisk |

Redeploy efter ændringer.

## 3. Deploy
- Merge pull requesten til `main` → Vercel bygger og udgiver automatisk.
- Hver pull request får en preview-URL. Preview-deployments har `noindex` via `robots.txt` (kun produktion må indekseres).
- Vercel-projektet har *Deployment Protection* (SSO) på preview-URL'er – log ind med Vercel-kontoen for at se dem.

## 4. Publicering på vellivo.dk – trin for trin
1. **Registrér domænet** `vellivo.dk` hos en dansk registrator (fx via Punktum dk / en forhandler som Simply.com, One.com eller GratisDNS). Registranten skal være virksomheden (CVR). Kontrollér samtidig varemærkeforhold (se docs/missing-information.md).
2. Vercel → Project `vellivo` → **Settings → Domains → Add** → `vellivo.dk` og `www.vellivo.dk`. Vælg at `www` omdirigerer til `vellivo.dk` (eller omvendt – vær konsekvent med `NEXT_PUBLIC_SITE_URL`).
3. Hos registratoren: opsæt DNS som Vercel viser, typisk
   - `A`-record for `vellivo.dk` → `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`
   (eller skift navneservere til Vercel: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`).
4. Vent på at Vercel viser *Valid Configuration*; SSL-certifikat udstedes automatisk.
5. Sæt `NEXT_PUBLIC_SITE_URL=https://vellivo.dk` i Production og redeploy.
6. Opdatér Stripe-webhook-URL til `https://vellivo.dk/api/webhooks/stripe` (live mode).
7. **Google Search Console:** tilføj domæneejendom, verificér via DNS-TXT, indsend `https://vellivo.dk/sitemap.xml`.
8. Test: forside, produktsider, kurv, checkout (testkøb), `robots.txt`, `sitemap.xml`, mobilvisning.

## 5. Efter lancering
- Vercel → Observability / Logs: hold øje med fejl i `/api/checkout` og `/api/webhooks/stripe`.
- Stripe → Webhooks: kontrollér at leveringer lykkes.

## 6. Anbefalet beskyttelse
Opret en rate limit-regel i **Vercel Firewall** for `POST /api/checkout` og formularindsendelser (fx 20 forespørgsler pr. minut pr. IP), så automatiserede kald ikke kan oprette mange ventende ordrer. Webhook-endpointet beskyttes af Stripes signatur.
