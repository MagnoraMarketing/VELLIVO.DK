# Stripe – opsætning, test og live mode

Webshoppen bruger **Stripe Checkout** til engangsbetalinger (ingen abonnementer). Kortdata håndteres udelukkende af Stripe.

## 1. Test mode (udvikling og preview)
1. Opret konto på dashboard.stripe.com og slå **Test mode** til.
2. **Developers → API keys:** kopiér *Secret key* (`sk_test_…`).
3. **Developers → Webhooks → Add endpoint**
   - URL: `https://<preview-eller-produktions-domæne>/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`
   - Kopiér *Signing secret* (`whsec_…`).
4. I Vercel → Project → Settings → Environment Variables (miljø **Preview** og/eller **Development**):
   `STRIPE_SECRET_KEY=sk_test_…`, `STRIPE_WEBHOOK_SECRET=whsec_…`
5. Lokalt: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` giver et lokalt `whsec_…`.

### Testkort
- Gennemført: `4242 4242 4242 4242`, vilkårlig fremtidig dato og CVC
- Afvist: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test-scenarier
| Scenarie | Forventet |
|---|---|
| Gennemført betaling | Ordre `paid`, lager trukket, kvitteringsside "Tak for din ordre" |
| Afvist kort | Kunden bliver på Stripe-siden; ordren forbliver `pending` og bliver `expired` efter 30 min |
| Annullér på Stripe-siden | Kunden sendes til `/ordre/annulleret`; kurven bevares |
| Gensend webhook (Dashboard → Webhooks → Resend) | Svar `{"outcome":"duplicate"}` eller `already_paid`; lageret ændres ikke |
| Forkert signatur | HTTP 400 |

## 2. Kvitteringer til kunden
Stripe Dashboard → **Settings → Customer emails** → slå *Successful payments* til. Kunden modtager så en kvittering med ordrelinjer. Tilføj virksomhedens navn, logo, adresse og CVR under **Settings → Business → Public details / Branding**.

## 3. Aktivering af live mode – trin for trin
1. **Aktivér kontoen:** Stripe Dashboard → *Activate payments*. Udfyld virksomhedsoplysninger (CVR, adresse, ejer), bankkonto og offentlige oplysninger (navn på kontoudtog fx `VELLIVO.DK`, supportmail/-telefon).
2. **Betalingsmetoder:** Settings → Payment methods. Kort er slået til som standard; overvej MobilePay, Apple Pay og Google Pay (Checkout viser dem automatisk, når de er aktiveret og domænet er verificeret).
3. **Skift til live:** slå *Test mode* fra. Developers → API keys → kopiér `sk_live_…` (opbevar sikkert – vises kun én gang ved restricted keys).
4. **Live webhook:** Developers → Webhooks (i live mode) → Add endpoint `https://vellivo.dk/api/webhooks/stripe` med de fire events ovenfor → kopiér live `whsec_…`.
5. **Vercel:** sæt i miljøet **Production**: `STRIPE_SECRET_KEY=sk_live_…`, `STRIPE_WEBHOOK_SECRET=whsec_…` (live), `NEXT_PUBLIC_SITE_URL=https://vellivo.dk`. Behold test-nøglerne på **Preview**.
6. **Redeploy** produktion (Vercel → Deployments → ⋯ → Redeploy), så variablerne indlæses.
7. **Kvitteringer** (afsnit 2) – slå til i live mode også.
8. **Første live-test:** køb et billigt produkt med eget kort, kontrollér at ordren bliver `paid` i Blob (`orders/`), at lageret falder, og at kvitteringen modtages. Refundér derefter i Stripe.
9. **Overvågning:** Developers → Webhooks → endpoint → se leveringer. Fejlede leveringer forsøges automatisk igen af Stripe i op til 3 dage.

## Sikkerhed
- `STRIPE_SECRET_KEY` og `STRIPE_WEBHOOK_SECRET` må kun ligge i Vercels miljøvariabler – aldrig i koden.
- Webhook-signaturen verificeres over den rå request-body (`constructEventAsync`).
- Ordren markeres kun betalt via webhook, aldrig ud fra kvitteringssiden.
- Beløb og valuta fra Stripe sammenlignes med ordren; afvigelser markeres `needs_review`.
