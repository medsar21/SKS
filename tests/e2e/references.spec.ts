import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { assertDevelopmentDatabase } from "../../src/lib/development-policy";
test.use({ trace: "off", screenshot: "off", video: "off" });
test("@managed logos : brouillon, publication, animation, pause et retrait", async ({
  page,
  context,
  browser,
}) => {
  test.setTimeout(180000);
  test.skip(
    process.env.MANAGED_E2E !== "true",
    "Base isolée et administrateur de test requis.",
  );
  assertDevelopmentDatabase(process.env);
  const origin = process.env.PLAYWRIGHT_BASE_URL!;
  const response = await context.request.post(
    `${origin}/api/auth/sign-in/email`,
    {
      headers: { Origin: origin },
      data: {
        email: process.env.SKS_TEST_ADMIN_EMAIL,
        password: process.env.SKS_TEST_ADMIN_PASSWORD,
      },
    },
  );
  expect(response.ok(), "Authentification de test").toBeTruthy();
  await page.goto("/admin/references");
  await page.locator(".brand-loading-intro").waitFor({ state: "hidden" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Nos références",
  );
  const logos = page.getByRole("group", {
    name: "Logos des références",
    exact: true,
  });
  await expect(
    logos.getByRole("button", { name: "+ Ajouter un logo", exact: true }),
  ).toBeVisible();
  while (await logos.getByRole("button", { name: /Retirer/ }).count())
    await logos
      .getByRole("button", { name: /Retirer/ })
      .first()
      .click();
  const heading = `Références de démonstration ${randomUUID().slice(0, 8)}`;
  await page.getByLabel("Titre de section", { exact: true }).fill(heading);
  await logos
    .getByRole("button", { name: "+ Ajouter un logo", exact: true })
    .click();
  await logos
    .getByLabel("Nom", { exact: true })
    .fill("Logo SKS de démonstration");
  await logos
    .getByLabel("Image", { exact: true })
    .fill("/images/sks-projets-logo.png");
  await page.getByRole("button", { name: "Enregistrer le brouillon" }).click();
  await expect(page.locator("p[role=status]")).toContainText(
    "Brouillon enregistré",
  );
  const visitors = await browser.newContext();
  try {
    const visitor = await visitors.newPage();
    await visitor.goto(origin);
    await expect(
      visitor.getByRole("heading", { name: heading, exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole("button", { name: "Publier les modifications" })
      .click();
    await expect(page.locator("p[role=status]")).toContainText(
      "Modifications publiées",
    );
    await visitor.reload();
    await expect(
      visitor.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await expect(
      visitor.getByRole("img", {
        name: "Logo SKS de démonstration",
        exact: true,
      }),
    ).toHaveCount(1);
    const track = visitor.locator('#references [class*="track"]');
    await expect
      .poll(() => track.evaluate((el) => getComputedStyle(el).animationName))
      .not.toBe("none");
    await visitor
      .getByRole("button", { name: "Mettre les logos en pause" })
      .click();
    await expect
      .poll(() =>
        track.evaluate((el) => getComputedStyle(el).animationPlayState),
      )
      .toBe("paused");
    await visitor.getByRole("button", { name: "Animer les logos" }).click();
    await visitor.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => track.evaluate((el) => getComputedStyle(el).animationName))
      .toBe("none");
    await visitor.setViewportSize({ width: 390, height: 844 });
    expect(
      await visitor.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Retirer la publication" }).click();
    await expect(page.locator("p[role=status]")).toContainText(
      "Publication retirée",
    );
    await visitor.reload();
    await expect(visitor.locator("#references img")).toHaveCount(0);
    await expect(
      visitor.getByRole("heading", { name: "Nos références", exact: true }),
    ).toBeVisible();
    await expect(visitor.getByRole("heading", { level: 1 })).toBeVisible();
  } finally {
    await visitors.close();
  }
});
