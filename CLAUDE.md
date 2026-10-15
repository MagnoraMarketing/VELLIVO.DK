@AGENTS.md

# Vellivo – noter til Claude Code

- Sprog: al brugervendt tekst er dansk. Ingen helbredspåstande, falske anmeldelser, opdigtede lagertal eller virksomhedsdata.
- Produktdata ligger i `src/data/catalog.ts`. Alle fire produkter er udgivet efter ejerens beslutning og vises som "På lager" uden antal (`alwaysInStock`). `missingData` er en tjekliste over dokumentation, der stadig mangler (CE, brugsanvisning m.m.). Udgivne produkter skal have billeder og leverandørmodel – `tests/unit/catalog.test.ts` håndhæver det.
- Beløb er i øre (heltal). Priser er inkl. 25 % moms.
- Ingen database/admin: dynamiske data (ordrer, solgte enheder, nyhedsbrev, kontakt) ligger i privat Vercel Blob via `src/lib/store`.
- Kør `npm run lint && npm run typecheck && npm test && npm run build` før commit.
