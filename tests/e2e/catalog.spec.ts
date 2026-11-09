import { expect, test } from "@playwright/test";

test("catalogue du PDF : recherche, catégories, documents et pagination", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/catalogue");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Notre catalogue produits",
  );
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.getByRole("button", { name: "Suivant", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Page 2 sur 3");
  await page.getByRole("searchbox").fill("VERSATEC");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Système VERSATEC", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Catégorie", { exact: true }).selectOption("etaiement");
  await expect(
    page.getByRole("heading", { name: "Aucune référence trouvée." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Effacer les filtres" }).click();
  await page
    .getByLabel("Catégorie", { exact: true })
    .selectOption("bois-coffrage");
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByLabel("Données disponibles").selectOption("documents");
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByLabel("Trier les produits").selectOption("az");
  await expect(
    page.getByRole("article").first().getByRole("heading"),
  ).toHaveText("CONTREPLAQUÉ BAKÉLISÉ");
  await page.screenshot({
    path: testInfo.outputPath("catalogue-document.png"),
    fullPage: true,
    caret: "initial",
  });
  expect(errors).toEqual([]);
});

test("fiche SKS PAL : valeurs du PDF et brouillon local", async ({ page }) => {
  await page.goto("/catalogue?q=SKS%20PAL");
  await page
    .getByRole("article")
    .filter({
      has: page.getByRole("heading", { name: "SKS PAL", exact: true }),
    })
    .getByRole("link", { name: /Voir la fiche/ })
    .click();
  await expect(page).toHaveURL(/\/catalogue\/sks-pal$/);
  for (const value of ["Fe 235", "48,3 mm", "2,50 mm", "1,00 T"])
    await expect(page.getByText(value, { exact: true })).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByRole("link", { name: /Présentation SKS PROJETS/ }),
  ).toHaveAttribute("href", "/documents/sks-projets-presentation.pdf#page=9");
  await page
    .getByRole("link", { name: "Demander un devis", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact\?produit=sks-pal/);
  await expect(page.getByLabel("Produit concerné")).toHaveValue(
    "PDF-09-sks-pal",
  );
  await page.getByLabel("Quantité envisagée").fill("12");
  await page.getByLabel("Nom et prénom").fill("Utilisateur de test");
  await page.getByLabel("Société").fill("Société de démonstration");
  await page.getByLabel(/^Email/).fill("test@example.test");
  await page.getByLabel(/^Téléphone/).fill("+212600000000");
  await page
    .getByLabel("Adresse du chantier")
    .fill("Adresse de démonstration uniquement");
  await page.getByRole("checkbox").check();
  await page.getByLabel("Ville du chantier").fill("Ville de test");
  await page
    .getByLabel("Votre besoin et vos contraintes")
    .fill("Brouillon local de test, aucune demande commerciale réelle.");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger ma demande" }).click();
  const download = await pending;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString("utf8");
  expect(text).toContain("Quantité envisagée : 12");
  expect(text).toContain("SKS PAL");
  expect(text).not.toContain("PRODUIT DE DÉMONSTRATION");
  await expect(page.getByRole("status")).toContainText(
    "Aucune demande envoyée",
  );
});

test("présentation, projets, coordonnées et fiche originale des étais", async ({
  page,
  request,
}) => {
  await page.goto("/a-propos");
  await expect(page.getByText("Amine HARIR", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Nos services", exact: true }),
  ).toBeVisible();
  await page.goto("/projets");
  await expect(page.getByRole("main").getByRole("article")).toHaveCount(5);
  await page.goto("/contact");
  const main = page.getByRole("main");
  for (const number of ["+212 522 97 34 76", "+212 663 80 33 42"])
    await expect(
      main.getByRole("link", { name: number, exact: true }),
    ).toBeVisible();
  await expect(
    main.getByRole("link", { name: "contact@sks-projets.ma", exact: true }),
  ).toHaveAttribute("href", "mailto:contact@sks-projets.ma");
  await page.goto("/catalogue/etais-metalliques");
  await expect(
    page.getByRole("heading", {
      name: "Fiche technique des étais",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Consulter la fiche originale (PDF)" }),
  ).toHaveAttribute("href", "/documents/sks-projets-presentation.pdf#page=14");
  const image = await request.get("/images/presentation/page-14.webp");
  expect(image.status()).toBe(200);
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const dir of ["ltr", "rtl"]) {
      await page.evaluate((direction) => {
        document.documentElement.dir = direction;
      }, dir);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});
