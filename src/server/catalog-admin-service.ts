import "server-only";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { getDb } from "./db";
import { CmsError, requireContentAdmin } from "./cms-service";
import {
  productInputSchema,
  categoryInputSchema,
  productDetailsSchema,
  emptyProductDetails,
} from "@/features/cms/validation";

export async function getAdminCatalog() {
  await requireContentAdmin();
  const [products, categories] = await Promise.all([
    getDb().product.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    getDb().category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);
  return {
    products: products.map((p) => ({
      ...p,
      price: p.price?.toFixed(2) ?? "",
      details: productDetailsSchema.parse(p.details ?? emptyProductDetails),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    categories,
  };
}
export async function saveProductRecord(input: unknown) {
  const session = await requireContentAdmin();
  const p = productInputSchema.parse(input);
  return getDb().$transaction(async (tx) => {
    if (!(await tx.category.findUnique({ where: { id: p.categoryId } })))
      throw new CmsError("Catégorie introuvable.");
    const { id, revision, price, details, ...fields } = p;
    const data = {
      ...fields,
      price: price ? new Prisma.Decimal(price) : null,
      details,
    };
    let product;
    if (id) {
      const result = await tx.product.updateMany({
        where: { id, revision },
        data: { ...data, revision: { increment: 1 } },
      });
      if (result.count !== 1)
        throw new CmsError("Ce produit a changé. Rechargez la page.");
      product = await tx.product.findUniqueOrThrow({ where: { id } });
    } else product = await tx.product.create({ data });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: id ? "PRODUCT_UPDATED" : "PRODUCT_CREATED",
        entityType: "Product",
        entityId: product.id,
        metadata: { active: product.active, revision: product.revision },
      },
    });
    return { id: product.id };
  });
}
export async function saveCategoryRecord(input: unknown) {
  const session = await requireContentAdmin();
  const c = categoryInputSchema.parse(input);
  return getDb().$transaction(async (tx) => {
    const { id, revision, ...data } = c;
    let category;
    if (id) {
      const result = await tx.category.updateMany({
        where: { id, revision },
        data: { ...data, revision: { increment: 1 } },
      });
      if (result.count !== 1)
        throw new CmsError("Cette catégorie a changé. Rechargez la page.");
      category = await tx.category.findUniqueOrThrow({ where: { id } });
    } else category = await tx.category.create({ data });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: id ? "CATEGORY_UPDATED" : "CATEGORY_CREATED",
        entityType: "Category",
        entityId: category.id,
      },
    });
  });
}
export async function deleteCatalogRecord(
  kind: "product" | "category",
  id: string,
  revision: number,
) {
  const session = await requireContentAdmin();
  z.enum(["product", "category"]).parse(kind);
  z.string().min(1).max(100).parse(id);
  z.number().int().min(0).parse(revision);
  await getDb().$transaction(
    async (tx) => {
      if (kind === "product") {
        const product = await tx.product.findUniqueOrThrow({ where: { id } });
        const references =
          (await tx.quoteLine.count({ where: { sku: product.sku } })) +
          (await tx.orderLine.count({ where: { sku: product.sku } }));
        if (product.active || references)
          throw new CmsError(
            "Désactivez ce produit. Une référence utilisée dans un devis ou une commande reste conservée.",
          );
        if (
          (await tx.product.deleteMany({ where: { id, revision } })).count !== 1
        )
          throw new CmsError("Produit modifié entre-temps. Rechargez la page.");
      } else {
        if (await tx.product.count({ where: { categoryId: id } }))
          throw new CmsError(
            "Déplacez les produits de cette catégorie avant de la supprimer.",
          );
        if (
          (await tx.category.deleteMany({ where: { id, revision } })).count !==
          1
        )
          throw new CmsError(
            "Catégorie modifiée entre-temps. Rechargez la page.",
          );
      }
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: `${kind.toUpperCase()}_DELETED`,
          entityType: kind,
          entityId: id,
        },
      });
    },
    { isolationLevel: "Serializable" },
  );
}
