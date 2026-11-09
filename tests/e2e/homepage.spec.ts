import { expect, test } from "@playwright/test";

test("accueil : héros, lien Services, catégories et responsive", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1 })).toHaveText(
    "DES SOLUTIONSDE CONSTRUCTIONFIABLES ET PERFORMANTES",
  );
  await expect(page.locator("#vente-location")).toHaveCount(0);
  await expect(
    main.getByRole("link", { name: "Nos services", exact: true }),
  ).toHaveAttribute("href", "/services");
  await expect(
    page
      .locator("#equipements")
      .getByRole("link")
      .filter({ has: page.locator("h3") }),
  ).toHaveCount(6);
  const photo = main.getByRole("img", {
    name: /Structure de coffrage et échafaudage/,
  });
  await expect
    .poll(() =>
      photo.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    )
    .toBe(true);
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width}px`,
    ).toBe(true);
  }
  await page.screenshot({
    path: testInfo.outputPath("reference-home.png"),
    fullPage: true,
    caret: "initial",
  });
  expect(errors).toEqual([]);
});

test("les catégories ouvrent le catalogue avec les filtres réels", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator("#equipements")
    .getByRole("link")
    .filter({
      has: page.getByRole("heading", {
        name: "Coffrage Vertical",
        exact: true,
      }),
    })
    .click();
  await expect(page).toHaveURL(/catalogue\?categorie=coffrage-vertical/);
  await expect(page.getByRole("article")).toHaveCount(2);
  await page.goto("/");
  await page
    .getByRole("link", { name: "Découvrir nos produits", exact: true })
    .click();
  await expect(page).toHaveURL(/\/catalogue$/);
  await expect(page.getByRole("article")).toHaveCount(6);
});

test("les trois services ouvrent le contact et les coordonnées", async ({
  page,
}) => {
  for (const id of ["vente", "location", "assistance"]) {
    await page.goto("/services");
    await page.locator(`#${id}`).getByRole("link").click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(
      page
        .locator("aside")
        .getByRole("link", { name: "contact@sks-projets.ma", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("main").locator("form")).toHaveCount(1);
  }
});
