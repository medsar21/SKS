import { expect, test } from "@playwright/test";
test("ancre des services avec mouvement réduit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Nos services", exact: true }).click();
  await expect(page).toHaveURL(/#vente-location$/);
  await expect(page.locator("#vente-location")).toBeInViewport();
  await expect(
    page.getByRole("heading", { name: "Assistance technique", exact: true }),
  ).toBeVisible();
});
