import "../../scripts/load-env";
import { randomBytes, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test, expect, type BrowserContext } from "@playwright/test";
import { assertDevelopmentDatabase } from "../../src/lib/development-policy";

test.use({ trace: "off", screenshot: "off", video: "off" });

async function login(context: BrowserContext, email: string, password: string) {
  const response = await context.request.post(
    "http://127.0.0.1:3000/api/auth/sign-in/email",
    {
      headers: { Origin: "http://127.0.0.1:3000" },
      data: { email, password },
    },
  );
  if (!response.ok())
    throw new Error("Connexion de test refusée (identifiants masqués).");
}

async function verifyFixture(
  mode: "verify" | "absent" | "cleanup",
  email: string,
  password: string,
  role: string,
) {
  await promisify(execFile)(
    process.execPath,
    [
      "--conditions=react-server",
      "--import",
      "tsx",
      "src/server/testing/verify-user.ts",
      mode,
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        USER_E2E_EMAIL: email,
        USER_E2E_PASSWORD: password,
        USER_E2E_ROLE: role,
      },
    },
  );
}

test("@postgres administrateur : création, connexion et protection des utilisateurs", async ({
  browser,
}) => {
  test.setTimeout(120000);
  test.skip(
    process.env.NODE_ENV === "production" ||
      process.env.ALLOW_DEV_SETUP !== "true" ||
      !process.env.SKS_DEV_DATABASE ||
      !process.env.DEV_ADMIN_ID ||
      !process.env.QUOTE_E2E_EMAIL ||
      !process.env.QUOTE_E2E_PASSWORD,
    "Base locale dédiée et administrateur de développement explicitement autorisés requis.",
  );
  assertDevelopmentDatabase(process.env);
  const origin = "http://127.0.0.1:3000";
  const admin = await browser.newContext();
  const password = randomBytes(24).toString("base64url");
  const fixtures: { email: string; role: string }[] = [];
  let captured:
    { body: string; action: string; contentType: string } | undefined;
  try {
    await login(
      admin,
      process.env.QUOTE_E2E_EMAIL!,
      process.env.QUOTE_E2E_PASSWORD!,
    );
    const page = await admin.newPage();
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(20000);
    await page.goto(`${origin}/admin/utilisateurs`);
    await expect(
      page.getByRole("heading", { name: "Utilisateurs", exact: true }),
    ).toBeVisible();
    await page.locator(".brand-loading-intro").waitFor({ state: "hidden" });
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      for (const direction of ["ltr", "rtl"]) {
        await page.evaluate((value) => {
          document.documentElement.dir = value;
        }, direction);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
    await page.evaluate(() => {
      document.documentElement.dir = "ltr";
    });
    page.on("request", (request) => {
      const headers = request.headers();
      if (
        request.method() === "POST" &&
        headers["next-action"] &&
        request.postData()
      )
        captured = {
          body: request.postData()!,
          action: headers["next-action"],
          contentType: headers["content-type"] ?? "text/plain;charset=UTF-8",
        };
    });
    const form = page.locator("form").filter({
      has: page.getByRole("button", {
        name: "Créer l’utilisateur",
        exact: true,
      }),
    });
    for (const role of ["CUSTOMER", "SALES", "ADMIN"]) {
      const email = `demo-user-e2e-${randomUUID()}@example.invalid`;
      fixtures.push({ email, role });
      await form
        .getByLabel("Nom complet", { exact: true })
        .fill("Utilisateur de démonstration Playwright");
      await form.getByLabel("Adresse email", { exact: true }).fill(email);
      await form.getByLabel("Rôle", { exact: true }).selectOption(role);
      await form.getByLabel("Mot de passe", { exact: true }).fill(password);
      await form
        .getByLabel("Confirmer le mot de passe", { exact: true })
        .fill(password);
      await form
        .getByRole("button", { name: "Créer l’utilisateur", exact: true })
        .click();
      await expect(form.getByRole("status")).toContainText("Utilisateur créé.");
      await expect(
        form.getByLabel("Mot de passe", { exact: true }),
      ).toHaveValue("");
      await expect(page.getByText(email, { exact: true })).toBeVisible();
      await verifyFixture("verify", email, password, role);
      const context = await browser.newContext();
      try {
        await login(context, email, password);
        const userPage = await context.newPage();
        await userPage.goto(`${origin}/admin/utilisateurs`);
        if (role === "ADMIN") {
          await expect(
            userPage.getByRole("heading", {
              name: "Utilisateurs",
              exact: true,
            }),
          ).toBeVisible();
        } else {
          await expect(userPage).not.toHaveURL(/\/admin\/utilisateurs/);
          await expect(
            userPage.getByRole("button", {
              name: "Créer l’utilisateur",
              exact: true,
            }),
          ).toHaveCount(0);
          if (!captured) throw new Error("Requête de test absente.");
          const forbiddenEmail = `demo-user-e2e-${randomUUID()}@example.invalid`;
          fixtures.push({ email: forbiddenEmail, role: "ADMIN" });
          const denied = await context.request.post(
            `${origin}/admin/utilisateurs`,
            {
              headers: {
                Origin: origin,
                "Next-Action": captured.action,
                "Content-Type": captured.contentType,
              },
              data: captured.body
                .replaceAll(email, forbiddenEmail)
                .replaceAll(`"role":"${role}"`, '"role":"ADMIN"'),
              maxRedirects: 0,
            },
          );
          expect(denied.headers()["x-action-redirect"]).toContain(
            "/admin?acces=utilisateurs-refuse",
          );
          await verifyFixture("absent", forbiddenEmail, password, "ADMIN");
        }
      } finally {
        await context.close();
      }
    }
    const existing = fixtures.find((fixture) => fixture.role === "CUSTOMER")!;
    await form
      .getByLabel("Nom complet", { exact: true })
      .fill("Doublon de démonstration");
    await form
      .getByLabel("Adresse email", { exact: true })
      .fill(existing.email.toUpperCase());
    await form
      .getByLabel("Mot de passe", { exact: true })
      .fill(`${password}-different`);
    await form
      .getByLabel("Confirmer le mot de passe", { exact: true })
      .fill(`${password}-different`);
    await form
      .getByRole("button", { name: "Créer l’utilisateur", exact: true })
      .click();
    await expect(form.getByRole("alert")).toHaveText(
      "Cette adresse email est déjà utilisée.",
    );
    await verifyFixture("verify", existing.email, password, existing.role);
    const anonymous = await browser.newContext();
    try {
      const visitor = await anonymous.newPage();
      await visitor.goto(`${origin}/admin/utilisateurs`);
      await expect(visitor).toHaveURL(/\/connexion/);
      if (!captured) throw new Error("Requête de test absente.");
      const forbiddenEmail = `demo-user-e2e-${randomUUID()}@example.invalid`;
      fixtures.push({ email: forbiddenEmail, role: "ADMIN" });
      const denied = await anonymous.request.post(
        `${origin}/admin/utilisateurs`,
        {
          headers: {
            Origin: origin,
            "Next-Action": captured.action,
            "Content-Type": captured.contentType,
          },
          data: captured.body.replaceAll(existing.email, forbiddenEmail),
          maxRedirects: 0,
        },
      );
      expect(denied.headers()["x-action-redirect"]).toContain("/connexion");
      await verifyFixture("absent", forbiddenEmail, password, "ADMIN");
    } finally {
      await anonymous.close();
    }
  } finally {
    await admin.close();
    for (const fixture of fixtures)
      await verifyFixture("cleanup", fixture.email, password, fixture.role);
  }
});
