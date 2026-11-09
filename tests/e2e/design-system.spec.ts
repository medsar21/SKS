import { expect, test } from "@playwright/test";

test("navigation complète et utilisable au clavier sur desktop et mobile", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", {
    name: "Navigation principale",
  });
  const toggle = navigation.getByRole("button");
  const mobile = (page.viewportSize()?.width ?? 1280) <= 1100;

  if (mobile) {
    await expect(
      navigation.getByRole("link", { name: "Produits", exact: true }),
    ).toBeHidden();
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(
      navigation.getByRole("link", { name: "Accueil", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
    await toggle.click();
  } else {
    await expect(toggle).toBeHidden();
  }

  for (const name of [
    "Accueil",
    "Produits",
    "À propos",
    "Espace client",
    "Demande de consultation",
  ]) {
    await expect(
      navigation.getByRole("link", { name, exact: true }),
    ).toBeVisible();
  }
  await navigation.getByRole("link", { name: "Produits", exact: true }).click();
  await expect(page).toHaveURL(/\/catalogue$/);
  if (mobile) {
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
  }
  await expect(
    navigation.getByRole("link", { name: "Produits", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("lien d’évitement, repères et métadonnées de démonstration", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Aller au contenu" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page).toHaveTitle(
    "SKS PROJETS — Coffrage, étaiement et échafaudage",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator(".hero")).toHaveCSS(
    "background-color",
    "rgb(17, 19, 21)",
  );
  await expect(page.locator("#devis")).toHaveCSS(
    "background-color",
    "rgb(255, 191, 0)",
  );
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(245, 245, 242)",
  );
  await expect(page.locator(".site-header")).toHaveAttribute(
    "data-overlay",
    "true",
  );
  await expect(page.locator(".site-header")).toHaveAttribute(
    "data-scrolled",
    "false",
  );
  await page.locator("#devis").scrollIntoViewIfNeeded();
  await expect(page.locator(".site-header")).toHaveAttribute(
    "data-scrolled",
    "true",
  );
});

test("pages publiques sans débordement de 320 à 1440 px, socle RTL et mouvement réduit", async ({
  page,
}, testInfo) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydrat|didn't match/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/catalogue", "/contact"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} à ${width}px`,
      ).toBe(true);
      await page.evaluate(() => {
        document.documentElement.dir = "rtl";
      });
      await expect(page.locator("body")).toHaveCSS("direction", "rtl");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} RTL à ${width}px`,
      ).toBe(true);
    }
  }
  await page.goto("/catalogue");
  await expect(page.getByRole("article")).toHaveCount(6);
  await expect(
    page
      .getByRole("article")
      .first()
      .getByText("Document · p. 8", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    caret: "initial",
    path: testInfo.outputPath("catalogue-design-system.png"),
    fullPage: true,
  });
  expect(hydrationErrors).toEqual([]);
});
