import { expect, test } from "@playwright/test";

test("les outils de contenu restent privés pour un visiteur anonyme", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const path of [
    "/admin/pages",
    "/admin/articles",
    "/admin/edition/nouveau",
    "/admin/edition/site",
    "/admin/produits",
    "/admin/categories",
    "/admin/medias",
    "/admin/references",
    "/admin/historique",
  ]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/connexion/, { timeout: 15000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Ravi de vous retrouver.",
    );
  }
});

test("les articles publics sont accessibles depuis la navigation", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: /menu/i }).click();
  await page
    .getByRole("navigation", { name: "Navigation principale" })
    .getByRole("link", { name: "Articles", exact: true })
    .click();
  await expect(page).toHaveURL(/\/articles$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Articles");
  await expect(page.locator("#main")).toBeVisible();
});
