import { expect, test } from "@playwright/test";

test("formulaire de devis : produit prérempli, location validée et export sans envoi", async ({
  page,
}) => {
  let posts = 0;
  page.on("request", (request) => {
    if (request.method() === "POST") posts++;
  });
  await page.goto("/contact?produit=systeme-versatec");
  await page.locator(".brand-loading-intro").waitFor({ state: "hidden" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Demander un devis",
  );
  await expect(page.getByLabel("Produit concerné")).toHaveValue(
    "PDF-08-systeme-versatec",
  );
  await page.getByLabel("Nom et prénom").fill("Utilisateur de démonstration");
  await page.getByLabel("Société").fill("Entreprise de test DEMO");
  await page.getByLabel(/^Email/).fill("demo@example.test");
  await page.getByLabel(/^Téléphone/).fill("+212600000000");
  await page.getByLabel("Ville du chantier").fill("Ville de démonstration");
  await page
    .getByLabel("Adresse du chantier")
    .fill("Adresse de démonstration uniquement");
  await page.getByLabel("Type de demande").selectOption("RENTAL");
  await page.getByLabel("Début souhaité").fill("2030-02-10");
  await page.getByLabel("Fin souhaitée").fill("2030-02-09");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Télécharger ma demande" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "période de location valide",
  );
  await page.getByLabel("Fin souhaitée").fill("2030-02-15");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger ma demande" }).click();
  const download = await pending;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString("utf8");
  expect(text).toContain("Système VERSATEC");
  expect(text).toContain("Type de demande : Location");
  expect(text).toContain("2030-02-10 au 2030-02-15");
  expect(text).toContain("BROUILLON NON ENVOYÉ");
  expect(posts).toBe(0);
  await expect(page.getByRole("status")).toContainText(
    "Aucune demande envoyée automatiquement",
  );
});
