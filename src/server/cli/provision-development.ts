import "../../../scripts/load-env";
import "server-only";
import { randomUUID } from "node:crypto";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { assertDevelopmentDatabase } from "@/lib/development-policy";
import { getDb } from "../db";
import { prepareDevelopmentConfiguration } from "./local-configuration";

async function main() {
  assertDevelopmentDatabase(process.env);
  const db = getDb();
  try {
    // Vérifier accès et migration avant de préparer les identités locales.
    await db.user.findFirst({ select: { developmentOnly: true } });
    const config = prepareDevelopmentConfiguration();
    const identities = [
      {
        ...config.admin,
        role: "ADMIN" as const,
        name: "Administrateur de démonstration",
      },
      {
        ...config.customer,
        role: "CUSTOMER" as const,
        name: "Utilisateur de démonstration",
      },
    ];
    const hashed = await Promise.all(
      identities.map(async (identity) => ({
        ...identity,
        hashed: await hashPassword(identity.password),
      })),
    );
    await db.$transaction(
      async (tx) => {
        for (const identity of hashed) {
          const existing = await tx.user.findFirst({
            where: { OR: [{ id: identity.id }, { email: identity.email }] },
            include: { accounts: { where: { providerId: "credential" } } },
          });
          if (existing) {
            const password = existing.accounts[0]?.password;
            if (
              existing.id !== identity.id ||
              existing.email !== identity.email ||
              !existing.developmentOnly ||
              existing.role !== identity.role ||
              !password ||
              !(await verifyPassword({
                hash: password,
                password: identity.password,
              }))
            )
              throw new Error(
                "Collision avec un compte existant : aucune réinitialisation.",
              );
            continue;
          }
          await tx.user.create({
            data: {
              id: identity.id,
              name: identity.name,
              email: identity.email,
              role: identity.role,
              developmentOnly: true,
              accounts: {
                create: {
                  id: randomUUID(),
                  providerId: "credential",
                  accountId: identity.id,
                  password: identity.hashed,
                },
              },
            },
          });
          await tx.auditLog.create({
            data: {
              action: "DEV_TEST_ACCOUNT_CREATED",
              entityType: "User",
              entityId: identity.id,
              metadata: { role: identity.role, developmentOnly: true },
            },
          });
        }
        const sku = `DEMO-M06-${config.admin.id}`;
        const existingProduct = await tx.product.findFirst({
          where: { OR: [{ sku }, { slug: config.slug }] },
        });
        if (
          existingProduct &&
          (!existingProduct.isDemo ||
            existingProduct.sku !== sku ||
            existingProduct.slug !== config.slug ||
            !existingProduct.active)
        )
          throw new Error(
            "Collision produit : aucune modification du catalogue existant.",
          );
        if (!existingProduct) {
          const category = await tx.category.create({
            data: {
              slug: `demo-m06-${config.admin.id}`,
              name: "Équipements de démonstration — mission 06",
              isDemo: true,
            },
          });
          const product = await tx.product.create({
            data: {
              sku,
              slug: config.slug,
              name: "Panneau de démonstration — mission 06",
              description:
                "Fixture explicite de validation du parcours de devis. Aucun tarif ni stock réel.",
              categoryId: category.id,
              active: true,
              isDemo: true,
            },
          });
          await tx.auditLog.create({
            data: {
              action: "DEV_TEST_PRODUCT_CREATED",
              entityType: "Product",
              entityId: product.id,
              metadata: { isDemo: true },
            },
          });
        }
      },
      { timeout: 15000 },
    );
    console.log(
      "Comptes ADMIN/CUSTOMER de développement et produit de démonstration préparés. Secrets uniquement dans .env.local ; aucun identifiant affiché.",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch(() => {
  console.error(
    "Provisionnement non abouti. Exiger hors production : ALLOW_DEV_SETUP=true, DATABASE_URL locale autorisée, SKS_DEV_DATABASE confirmé et migrations appliquées. Aucun compte existant n’est réinitialisé. Détails sensibles masqués.",
  );
  process.exitCode = 1;
});
