/**
 * Røgtest af den kørende webshop (mobil + desktop).
 * Brug: npm run build && VELLIVO_LOCAL_STORE=1 npx next start -p 3100 &  BASE_URL=http://localhost:3100 npm run test:e2e
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const SHOTS = process.env.SCREENSHOT_DIR;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const pages = [
  "/",
  "/shop",
  "/kategori/ryg-og-laend",
  "/kategori/oejenmassagere",
  "/produkter/laendemassager",
  "/produkter/oejenmassager",
  "/produkter/oejenmassager-air",
  "/produkter/oejenmassager-smart",
  "/guides",
  "/guides/saadan-vaelger-du-en-laendemassager",
  "/om-vellivo",
  "/kontakt",
  "/faq",
  "/levering",
  "/retur-og-fortrydelsesret",
  "/handelsbetingelser",
  "/privatlivspolitik",
  "/cookiepolitik",
  "/kurv",
  "/checkout",
  "/ordre/annulleret",
];

let failures = 0;
const check = (cond, msg) => {
  if (cond) console.log(`  ✓ ${msg}`);
  else {
    failures++;
    console.log(`  ✗ ${msg}`);
  }
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

for (const vp of [
  { name: "mobil", width: 375, height: 812 },
  { name: "desktop", width: 1366, height: 900 },
]) {
  console.log(`\n== ${vp.name} (${vp.width}px) ==`);
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: "da-DK" });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(e.message));
  const titles = new Set();
  for (const path of pages) {
    const res = await page.goto(BASE + path, { waitUntil: "load" });
    const status = res?.status();
    const h1 = await page.locator("h1").count();
    const title = await page.title();
    const desc = await page.locator('meta[name="description"]').getAttribute("content").catch(() => null);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href").catch(() => null);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const ok = status === 200 && h1 === 1 && !!desc && !!canonical && overflow <= 1;
    check(ok, `${path} → ${status}, h1=${h1}, canonical=${canonical ? "ja" : "nej"}, overflow=${overflow}px`);
    if (vp.name === "desktop") {
      check(!titles.has(title), `${path} har unik titel: "${title}"`);
      titles.add(title);
    }
    if (SHOTS && ["/", "/produkter/laendemassager", "/shop", "/kurv"].includes(path)) {
      await page.screenshot({ path: `${SHOTS}/${vp.name}${path.replace(/\//g, "_") || "_forside"}.png`, fullPage: true });
    }
  }

  // Udgivne produkter: indekserbare, Product-schema og købsknap
  await page.goto(BASE + "/produkter/laendemassager", { waitUntil: "load" });
  const robots = await page.locator('meta[name="robots"]').getAttribute("content").catch(() => null);
  check(!/noindex/.test(robots ?? ""), "udgivet produkt er indekserbart");
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  check(ld.some((t) => t.includes('"Product"') && t.includes("InStock")), "Product-schema med InStock");
  check(ld.some((t) => t.includes('"BreadcrumbList"')), "BreadcrumbList-schema findes");
  check(!ld.some((t) => t.includes("AggregateRating")), "ingen AggregateRating");
  check((await page.getByText("På lager").count()) > 0, "produktet vises som 'På lager'");
  check((await page.getByRole("button", { name: "Læg i kurv" }).count()) === 1, "'Læg i kurv'-knap findes");

  // Mobilnavigation
  if (vp.name === "mobil") {
    await page.goto(BASE + "/");
    await page.getByRole("button", { name: "Åbn menu" }).click();
    check(await page.locator("#mobilmenu").isVisible(), "mobilmenu åbner");
    await page.locator("#mobilmenu").getByRole("link", { name: "Shop", exact: true }).click();
    await page.waitForURL("**/shop");
    check(page.url().endsWith("/shop"), "mobilmenu navigerer til /shop");
    check(!(await page.locator("#mobilmenu").isVisible().catch(() => false)), "mobilmenu lukker efter navigation");
  }

  // Kurv: læg i kurv fra produktsiden, se kassen, fjern vare
  await page.goto(BASE + "/produkter/laendemassager", { waitUntil: "load" });
  await page.getByRole("button", { name: "Læg i kurv" }).click();
  await page.getByText("er lagt i kurven").waitFor({ timeout: 10000 }).catch(() => {});
  await page.goto(BASE + "/kurv", { waitUntil: "load" });
  await page.getByRole("button", { name: "Fjern" }).waitFor({ timeout: 10000 }).catch(() => {});
  check((await page.getByText("899").count()) > 0, "kurven viser prisen (899 kr.)");
  check((await page.getByRole("link", { name: "Gå til kassen" }).count()) === 1, "'Gå til kassen' vises");
  await page.getByRole("button", { name: "Fjern" }).click();
  await page.getByText("Din kurv er tom").waitFor({ timeout: 10000 }).catch(() => {});
  check((await page.getByText("Din kurv er tom").count()) > 0, "vare kan fjernes fra kurven");

  check(consoleErrors.length === 0, `ingen JavaScript-fejl (${consoleErrors.join("; ")})`);
  await ctx.close();
}

// API'er
const api = await fetch(BASE + "/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: [{ slug: "laendemassager", quantity: 1 }], acceptTerms: true }) });
check([503].includes(api.status), `/api/checkout svarer 503 uden Stripe-nøgler (${api.status})`);
const wh = await fetch(BASE + "/api/webhooks/stripe", { method: "POST", body: "{}" });
check([400, 503].includes(wh.status), `/api/webhooks/stripe afviser usigneret kald (${wh.status})`);
const sm = await (await fetch(BASE + "/sitemap.xml")).text();
check(sm.includes("/produkter/laendemassager"), "sitemap indeholder udgivne produkter");
check(sm.includes("/kategori/ryg-og-laend"), "sitemap indeholder kategorier");
const nf = await fetch(BASE + "/produkter/findes-ikke");
check(nf.status === 404, "ukendt produkt giver 404");
const redirect = await fetch(BASE + "/products/laendemassager", { redirect: "manual" });
check(redirect.status === 308 && redirect.headers.get("location")?.endsWith("/produkter/laendemassager"), "gammel URL omdirigeres permanent");

await browser.close();
console.log(failures ? `\n${failures} fejl` : "\nAlle røgtests bestået");
process.exit(failures ? 1 : 0);
