@AGENTS.md

# Vellivo – noter til Claude Code

- Sprog: al brugervendt tekst er dansk. Ingen helbredspåstande, falske anmeldelser, opdigtede lagertal eller virksomhedsdata.
- Produktdata ligger i `src/data/catalog.ts`. Udgiv kun et produkt (`status: "published"`), når `missingData` er tom og specifikationer, billeder (i `public/produkter/`) og pris er verificeret – `tests/unit/catalog.test.ts` håndhæver det.
- Beløb er i øre (heltal). Priser er inkl. 25 % moms.
- Ingen database/admin: dynamiske data (ordrer, solgte enheder, nyhedsbrev, kontakt) ligger i privat Vercel Blob via `src/lib/store`.
- Kør `npm run lint && npm run typecheck && npm test && npm run build` før commit.
