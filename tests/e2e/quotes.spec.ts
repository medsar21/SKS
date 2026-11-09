import "../../scripts/load-env";
import { test, expect, type Page } from "@playwright/test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

test.use({ trace: "off", screenshot: "off", video: "off" });

async function login(page: Page, email: string, password: string) {
  // Vraie connexion Better Auth ; aucun jeton fabriqué et aucun secret dans le DOM ou les traces.
  try {
    const response = await page.request.post("/api/auth/sign-in/email", {
      headers: { Origin: "http://127.0.0.1:3000" },
      data: { email, password },
    });
    if (!response.ok()) throw new Error("refus");
  } catch {
    throw new Error(
      "Connexion de test refusée ; vérifier les identifiants locaux (détails masqués).",
    );
  }
}

async function verifyPersistence(reference: string, state?: "requested") {
  const result = await promisify(execFile)(
    process.execPath,
    [
      "--conditions=react-server",
      "--import",
      "tsx",
      "src/server/testing/verify-quote.ts",
      reference,
      ...(state ? [state] : []),
    ],
    { cwd: process.cwd(), env: process.env },
  );
  expect(result.stdout).toContain("Persistance PostgreSQL et audit vérifiés.");
}

test("catalogue → demande préremplie et responsive ; accès administratif protégé", async ({
  page,
}) => {
  await page.goto("/catalogue/exemple-vmc-3");
  await page.getByRole("link", { name: "Demander un devis" }).click();
  await expect(
    page.getByRole("checkbox", { name: /Panneau — exemple VMC/ }),
  ).toBeChecked();
  await page
    .getByLabel("Quantité · Panneau — exemple VMC", { exact: true })
    .fill("12");
  await page.getByLabel("Type de demande").selectOption("RENTAL");
  await expect(page.getByLabel("Début souhaité")).toBeVisible();
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const dir of ["ltr", "rtl"]) {
      await page.evaluate((value) => {
        document.documentElement.dir = value;
      }, dir);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  await page.goto("/admin/devis");
  await expect(page).toHaveURL(/\/connexion/);
  await page.goto("/admin/devis/inconnu");
  await expect(page).toHaveURL(/\/connexion/);
});

test.describe("parcours PostgreSQL réel sur base de test dédiée", () => {
  test.skip(
    process.env.QUOTE_E2E !== "true" ||
      !process.env.DATABASE_URL ||
      !process.env.QUOTE_E2E_EMAIL ||
      !process.env.QUOTE_E2E_PASSWORD ||
      !process.env.QUOTE_E2E_CUSTOMER_EMAIL ||
      !process.env.QUOTE_E2E_CUSTOMER_PASSWORD ||
      !process.env.QUOTE_E2E_PRODUCT_SLUG,
    "PostgreSQL, produit actif de démonstration et compte ADMIN/SALES de test requis.",
  );
  test.skip(process.env.NODE_ENV === "production", "Interdit en production.");
  test("@postgres catalogue → PostgreSQL → administration authentifiée", async ({
    page,
  }) => {
    await page.goto(
      `/catalogue/${encodeURIComponent(process.env.QUOTE_E2E_PRODUCT_SLUG!)}`,
    );
    await expect(
      page.getByText("Démonstration", { exact: true }).first(),
    ).toBeVisible();
    await page.getByRole("link", { name: "Demander un devis" }).click();
    await page
      .getByLabel("Nom et prénom")
      .fill("Contact de démonstration Playwright");
    await page
      .getByLabel("Société", { exact: true })
      .fill("Société de démonstration Playwright");
    await page.getByLabel("Téléphone").fill("+212600000000");
    await page
      .getByLabel("Email", { exact: true })
      .fill(`demo-${Date.now()}@example.invalid`);
    await page.getByLabel("Ville du chantier").fill("Ville de démonstration");
    await page
      .getByLabel("Adresse du chantier")
      .fill("Chantier de démonstration Playwright");
    await page.locator('input[name^="quantity:"]:enabled').fill("12");
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(
      page.getByRole("heading", { name: "Demande enregistrée" }),
    ).toBeVisible();
    const reference = await page
      .getByRole("status")
      .locator("strong")
      .innerText();
    // Lecture indépendante en base : ne se contente pas du message de succès.
    await verifyPersistence(reference);
    await login(
      page,
      process.env.QUOTE_E2E_EMAIL!,
      process.env.QUOTE_E2E_PASSWORD!,
    );
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Vue d’ensemble" }),
    ).toBeVisible();
    await page.goto(`/admin/devis?q=${encodeURIComponent(reference)}`);
    await page.getByRole("link", { name: reference, exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(reference);
    await expect(
      page.getByText("Société de démonstration Playwright", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Demande reçue", { exact: false }),
    ).toBeVisible();
    await page.getByLabel("Nouveau statut").selectOption("REQUESTED");
    const actionRequest = page.waitForRequest(
      (request) =>
        request.method() === "POST" &&
        Boolean(request.headers()["next-action"]),
    );
    await page.getByRole("button", { name: "Modifier le statut" }).click();
    const request = await actionRequest;
    await expect(
      page.getByText("En étude", { exact: true }).first(),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByText("En étude", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Changement de statut", { exact: false }),
    ).toBeVisible();
    await verifyPersistence(reference, "requested");

    const detailUrl = page.url();
    const actionId = request.headers()["next-action"];
    expect(actionId).toBeTruthy();
    const replay = async (visitor: Page) => {
      const response = await visitor.request.post(detailUrl, {
        headers: {
          Origin: "http://127.0.0.1:3000",
          "Next-Action": actionId!,
          "Content-Type":
            request.headers()["content-type"] ?? "text/plain;charset=UTF-8",
        },
        data: request.postDataBuffer()!,
        maxRedirects: 0,
      });
      expect(response.status()).toBe(303);
      return (
        response.headers().location ??
        response.headers()["x-action-redirect"] ??
        ""
      );
    };
    const anonymous = await page
      .context()
      .browser()!
      .newContext({ baseURL: new URL(detailUrl).origin });
    try {
      const visitor = await anonymous.newPage();
      expect(await replay(visitor)).toContain("/connexion");
      await visitor.goto(detailUrl);
      await expect(visitor).toHaveURL(/\/connexion/);
      const signup = await visitor.request.post("/api/auth/sign-up/email", {
        headers: { Origin: "http://127.0.0.1:3000" },
        data: {
          name: "Inscription de démonstration refusée",
          email: `demo-refuse-${Date.now()}@example.invalid`,
          password: process.env.QUOTE_E2E_CUSTOMER_PASSWORD!,
          role: "ADMIN",
          developmentOnly: false,
        },
      });
      expect([400, 403]).toContain(signup.status());
    } finally {
      await anonymous.close();
    }

    if (
      process.env.QUOTE_E2E_CUSTOMER_EMAIL &&
      process.env.QUOTE_E2E_CUSTOMER_PASSWORD
    ) {
      const customerContext = await page
        .context()
        .browser()!
        .newContext({ baseURL: new URL(detailUrl).origin });
      try {
        const customer = await customerContext.newPage();
        await login(
          customer,
          process.env.QUOTE_E2E_CUSTOMER_EMAIL,
          process.env.QUOTE_E2E_CUSTOMER_PASSWORD,
        );
        for (const path of ["/admin", "/admin/devis", detailUrl]) {
          await customer.goto(path);
          await expect(customer).toHaveURL(/\/espace-client$/);
          expect(await customer.content()).not.toContain(reference);
        }
        expect(await replay(customer)).toContain("/espace-client");
      } finally {
        await customerContext.close();
      }
    }
    await verifyPersistence(reference, "requested");
  });
});
