import { test, expect } from "@playwright/test";
test("Services possède sa page et les navigations repartent en haut", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".brand-loading-intro").waitFor({ state: "hidden" });
  await page
    .locator("footer")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Nos services",
  );
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await page
    .locator("footer")
    .getByRole("link", { name: "Accueil", exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await page
    .locator("footer")
    .getByRole("link", { name: "Accueil", exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await page
    .locator("footer")
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await page.goto("/#equipements");
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(100);
  await page
    .locator("footer")
    .getByRole("link", { name: /Connexion professionnelle/ })
    .click();
  await expect(page).toHaveURL(/\/connexion$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
});
