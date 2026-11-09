import "../scripts/load-env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { demoCategories, demoProducts } from "../src/features/catalog/data";

async function main() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.ALLOW_DEMO_SEED !== "true"
  ) {
    throw new Error(
      "Seed refusé : exiger ALLOW_DEMO_SEED=true sur une base locale dédiée, hors production.",
    );
  }
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL requise");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  try {
    await db.$transaction(async (tx) => {
      for (const category of demoCategories) {
        const slug = `demo-${category.slug}`;
        const existing = await tx.category.findUnique({ where: { slug } });
        if (existing && !existing.isDemo)
          throw new Error(
            "Collision avec une catégorie non démo ; aucune modification.",
          );
        const record = await tx.category.upsert({
          where: { slug },
          update: {},
          create: {
            slug,
            name: `${category.name} [DÉMO]`,
            description: category.description,
            isDemo: true,
          },
        });
        for (const product of demoProducts.filter(
          (p) => p.category === category.slug,
        )) {
          const existingProduct = await tx.product.findUnique({
            where: { sku: product.sku },
          });
          if (existingProduct && !existingProduct.isDemo)
            throw new Error(
              "Collision avec un produit non démo ; aucune modification.",
            );
          await tx.product.upsert({
            where: { sku: product.sku },
            update: {},
            create: {
              sku: product.sku,
              slug: product.slug,
              name: `${product.name} [DÉMO]`,
              description: product.description,
              categoryId: record.id,
              isDemo: true,
              active: false,
            },
          });
        }
      }
      await tx.auditLog.create({
        data: {
          action: "DEMO_SEED",
          entityType: "Catalogue",
          entityId: "demo",
          metadata: { source: "prisma/seed.ts", personalData: false },
        },
      });
    });
    console.info(
      "Catalogue démo préparé. Aucun compte ni donnée personnelle créé.",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch(() => {
  console.error(
    "Échec du seed. Vérifier la configuration locale, la connexion et les éventuelles collisions de références.",
  );
  process.exitCode = 1;
});
