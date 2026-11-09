import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { assertDevelopmentDatabase } from "../../src/lib/development-policy";
test.use({ trace: "off", screenshot: "off", video: "off" });

test("@managed admin : import, photo, brouillon, publication et demande persistante", async ({
  page,
  context,
  browser,
}) => {
  test.setTimeout(180000);
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(30000);
  test.skip(
    process.env.MANAGED_E2E !== "true",
    "Base isolée et identités de test requises.",
  );
  assertDevelopmentDatabase(process.env);
  const origin = process.env.PLAYWRIGHT_BASE_URL!;
  const login = await context.request.post(`${origin}/api/auth/sign-in/email`, {
    headers: { Origin: origin },
    data: {
      email: process.env.SKS_TEST_ADMIN_EMAIL,
      password: process.env.SKS_TEST_ADMIN_PASSWORD,
    },
  });
  expect(login.ok(), "Connexion administrateur de test").toBeTruthy();
  await page.goto("/admin");
  await page.locator(".brand-loading-intro").waitFor({ state: "hidden" });
  await page.getByRole("checkbox", { name: /Je confirme l’import/ }).check();
  await page
    .getByRole("button", { name: "Initialiser les contenus du site" })
    .click();
  await expect(page.locator("p[role=status]")).toContainText(
    /(?:17|0) produit\(s\)/,
    { timeout: 45000 },
  );
  await expect(page.locator("p[role=status]")).toContainText(
    /(?:6|0) catégorie\(s\)/,
  );
  expect((await context.request.get("/api/ready")).status()).toBe(200);
  // Répéter ne remplace aucun contenu existant.
  await page
    .getByRole("button", { name: "Initialiser les contenus du site" })
    .click();
  await expect(page.locator("p[role=status]")).toContainText("0 produit(s)", {
    timeout: 45000,
  });

  const photoName = `photo-test-isole-${randomUUID()}`;
  const heroAlt = `Bannière de test isolé ${randomUUID()}`;
  await page.goto("/admin/medias");
  await page.getByLabel("Fichier", { exact: true }).setInputFiles({
    name: `${photoName}.png`,
    mimeType: "image/png",
    buffer: await sharp({
      create: { width: 640, height: 360, channels: 3, background: "#ffbf00" },
    })
      .png()
      .toBuffer(),
  });
  await page
    .getByLabel("Description du média", { exact: true })
    .fill("Photo de test isolé");
  await page.getByRole("button", { name: "Ajouter le média" }).click();
  await expect(page.locator("form").getByRole("status")).toContainText(
    "Média ajouté",
  );
  const mediaCard = page
    .locator(".cms-media-card")
    .filter({ hasText: photoName });
  const mediaUrl = await mediaCard.locator("code").textContent();
  expect(mediaUrl).toMatch(/^\/media\//);
  const mediaResponse = await context.request.get(mediaUrl!);
  expect(mediaResponse.ok()).toBeTruthy();
  expect(mediaResponse.headers()["content-type"]).toContain("image/webp");

  console.log("Media upload verified");
  await page.goto("/admin/edition/site");
  const hero = page.getByRole("group", {
    name: "Bannière principale",
    exact: true,
  });
  await hero.getByLabel("Image", { exact: true }).fill(mediaUrl!);
  await hero
    .getByLabel("Description alternative", { exact: true })
    .fill(heroAlt);
  const title = `Titre de test isolé ${randomUUID().slice(0, 8)}`;
  await page.getByLabel("Titre SEO", { exact: true }).fill(title);
  await page.getByRole("button", { name: "Enregistrer le brouillon" }).click();
  await expect(page.locator("p[role=status]")).toContainText(
    "Brouillon enregistré",
  );
  console.log("Draft saved");
  const publicContext = await browser.newContext();
  try {
    const visitor = await publicContext.newPage();
    visitor.setDefaultTimeout(10000);
    visitor.setDefaultNavigationTimeout(30000);
    console.log("Checking unpublished public page");
    await visitor.goto(origin);
    await expect(visitor).not.toHaveTitle(title);
    await expect(visitor.locator("#hero img")).not.toHaveAttribute(
      "alt",
      heroAlt,
    );
    await page
      .getByRole("button", { name: "Publier les modifications" })
      .click();
    await expect(page.locator("p[role=status]")).toContainText(
      "Modifications publiées",
    );
    await visitor.reload();
    await expect(visitor).toHaveTitle(title);
    await expect(visitor.locator("#hero img")).toHaveAttribute("alt", heroAlt);
    await expect(visitor.locator("#hero img")).toHaveAttribute(
      "src",
      new RegExp(encodeURIComponent(mediaUrl!)),
    );
    // Les cartes de catégories et les fiches produit utilisent aussi la base.
    await page.goto("/admin/categories");
    const category = page
      .locator("details")
      .filter({
        has: page.locator("summary", { hasText: "Coffrage Vertical" }),
      });
    await category.locator("summary").click();
    await category
      .getByLabel("Photo de la catégorie", { exact: true })
      .fill(mediaUrl!);
    await category
      .getByLabel("Description de la photo", { exact: true })
      .fill(photoName);
    await category
      .getByRole("button", { name: "Enregistrer la catégorie" })
      .click();
    await expect(
      page.getByText("Catégorie enregistrée.", { exact: true }),
    ).toBeVisible();
    await visitor.goto(origin);
    await expect(
      visitor
        .locator("#equipements")
        .getByRole("img", { name: photoName, exact: true }),
    ).toBeVisible();
    await page.goto("/admin/produits");
    await page
      .getByRole("row")
      .filter({ hasText: "Système VERSATEC" })
      .getByRole("link", { name: /Modifier/ })
      .click();
    const description = `Description de démonstration ${randomUUID()}`;
    await page
      .getByRole("textbox", { name: "Description", exact: true })
      .fill(description);
    await page.getByRole("button", { name: "Enregistrer le produit" }).click();
    await expect(page).toHaveURL(/\/admin\/produits$/);
    await visitor.goto(`${origin}/catalogue/systeme-versatec`);
    await expect(visitor.getByText(description, { exact: true })).toBeVisible();
    await visitor.goto(`${origin}/catalogue`);
    await expect(
      visitor.getByRole("heading", { name: "Système VERSATEC", exact: true }),
    ).toBeVisible();
    await visitor.goto(`${origin}/contact?produit=systeme-versatec`);
    await visitor.getByLabel("Nom et prénom").fill("Client de test isolé");
    await visitor
      .getByLabel(/^Société/)
      .fill("Entreprise de démonstration uniquement");
    await visitor
      .getByLabel(/^Email/)
      .fill(`quote-${randomUUID()}@example.invalid`);
    await visitor.getByLabel(/^Téléphone/).fill("+212600000000");
    await visitor.getByLabel("Ville du chantier").fill("Ville de test");
    await visitor
      .getByLabel("Adresse du chantier")
      .fill("Adresse de démonstration uniquement");
    await visitor.getByRole("checkbox").check();
    await visitor.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(
      visitor.getByRole("heading", { name: "Demande enregistrée" }),
    ).toBeVisible();
    const reference = await visitor
      .getByRole("status")
      .locator("strong")
      .textContent();
    await page.goto("/admin/devis");
    await expect(page.getByRole("link", { name: reference! })).toBeVisible();
    await visitor.goto(`${origin}/admin/edition/site`);
    await expect(visitor).toHaveURL(/\/connexion/);
  } finally {
    await publicContext.close();
  }
});
