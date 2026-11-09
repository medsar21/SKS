import "server-only";
import { isPresentationMode } from "@/lib/deployment-mode";
import { getDb } from "@/server/db";
import { demoCatalogProducts } from "@/features/catalog/demo-catalog";
import { documentCatalogProducts } from "@/features/catalog/document-catalog";
import type { CatalogSource } from "@/features/catalog/types";
import {
  productDetailsSchema,
  emptyProductDetails,
} from "@/features/cms/validation";

export async function getCatalog(): Promise<CatalogSource> {
  if (isPresentationMode())
    return { products: documentCatalogProducts, mode: "document" };
  // Activation explicite uniquement, aucune connexion automatique ni repli masquant une panne.
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.SKS_CATALOGUE_SOURCE === "demo"
  ) {
    return { products: demoCatalogProducts, mode: "demo" };
  }
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.SKS_CATALOGUE_SOURCE !== "prisma"
  ) {
    return { products: documentCatalogProducts, mode: "document" };
  }
  const records = await getDb().product.findMany({
    where: { active: true },
    select: {
      sku: true,
      slug: true,
      name: true,
      description: true,
      isDemo: true,
      price: true,
      details: true,
      category: {
        select: { slug: true, name: true, image: true, imageAlt: true },
      },
    },
    orderBy: { sku: "asc" },
  });
  return {
    mode: "prisma",
    products: records.map((product) => {
      const details = productDetailsSchema.parse(
        product.details ?? emptyProductDetails,
      );
      return {
        ...product,
        ...details,
        specifications: details.specifications.map((spec) => ({
          ...spec,
          value: spec.value || null,
          unit: spec.unit || undefined,
        })),
        usage: details.usage || null,
        price: product.price?.toFixed(2) ?? null,
      };
    }),
  };
}

export async function getCatalogProduct(slug: string) {
  return (await getCatalog()).products.find((product) => product.slug === slug);
}
