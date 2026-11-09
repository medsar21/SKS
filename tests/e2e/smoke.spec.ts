import { test, expect } from "@playwright/test";
test("accueil, catalogue et filtrage accessibles", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "DES SOLUTIONS",
  );
  await expect(page.locator("#notice")).toContainText("Sécurité");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    caret: "initial",
    path: testInfo.outputPath("accueil.png"),
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Découvrir nos produits", exact: true })
    .click();
  await page.getByLabel("Catégorie", { exact: true }).selectOption("etaiement");
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(
    page.getByRole("heading", { name: "Étais métalliques", exact: true }),
  ).toBeVisible();
});
test("les espaces privés redirigent les visiteurs anonymes", async ({
  page,
}) => {
  for (const path of ["/admin", "/espace-client"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/connexion/);
    await expect(
      page.getByRole("heading", { name: "Ravi de vous retrouver." }),
    ).toBeVisible();
  }
});
