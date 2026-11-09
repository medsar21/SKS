import "server-only";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { createHash } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import {
  documentCatalogProducts,
  documentCategories,
} from "@/features/catalog/document-catalog";
import {
  defaultSettings,
  settingsSchema,
  productDetailsSchema,
  imagePath,
} from "@/features/cms/validation";
import { copyGroups } from "@/features/cms/copy-defaults";
import { getDb } from "./db";
import { CmsError, requireContentAdmin } from "./cms-service";

// Import métier explicite, distinct du seed de démonstration. Jamais exécuté au démarrage.
export async function initializeManagedSite() {
  const session = await requireContentAdmin();
  const imagePaths = new Set<string>();
  function collect(value: unknown): void {
    if (typeof value === "string" && value.startsWith("/images/"))
      imagePaths.add(imagePath.parse(value));
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === "object")
      Object.values(value).forEach(collect);
  }
  collect(defaultSettings);
  collect(documentCatalogProducts);
  imagePaths.add("/images/sks-projets-logo.png");
  const root = resolve("public");
  const assets = await Promise.all(
    [...imagePaths].map(async (path) => {
      const absolute = resolve(root, `.${path}`);
      if (!absolute.startsWith(root + sep))
        throw new CmsError("Chemin de ressource invalide.");
      const data = await readFile(absolute);
      return {
        path,
        data,
        id: `source-${createHash("sha256").update(data).digest("hex").slice(0, 32)}`,
        mimeType: path.endsWith(".png") ? "image/png" : "image/webp",
      };
    }),
  );
  const urls = new Map(
    assets.map((asset) => [asset.path, `/media/${asset.id}`]),
  );
  function managed(value: unknown): Prisma.InputJsonValue {
    if (typeof value === "string") return urls.get(value) ?? value;
    if (Array.isArray(value)) return value.map((item) => managed(item));
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, managed(item)]),
      );
    return value as number | boolean;
  }
  return getDb().$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('sks:initialize-managed-site'))`;
      const actor = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });
      if (actor?.role !== "ADMIN")
        throw new CmsError("Droits administrateur requis.");
      let mediaCreated = 0,
        categoriesCreated = 0,
        productsCreated = 0,
        contentsCreated = 0;
      for (const asset of assets) {
        if (
          !(await tx.mediaAsset.findUnique({
            where: { id: asset.id },
            select: { id: true },
          }))
        ) {
          await tx.mediaAsset.create({
            data: {
              id: asset.id,
              name: asset.path.split("/").pop()!,
              alt: "Visuel fourni dans la présentation SKS PROJETS",
              mimeType: asset.mimeType,
              size: asset.data.length,
              data: new Uint8Array(asset.data),
            },
          });
          mediaCreated++;
        }
      }
      const categories = new Map<string, string>();
      for (const category of documentCategories) {
        let row = await tx.category.findUnique({
          where: { slug: category.slug },
        });
        if (!row) {
          const representative = documentCatalogProducts.find(
            (product) => product.category.slug === category.slug,
          );
          row = await tx.category.create({
            data: {
              ...category,
              isDemo: false,
              image: urls.get(representative?.images[0]?.src ?? "") ?? "",
              imageAlt: representative?.images[0]?.alt ?? category.name,
            },
          });
          categoriesCreated++;
        }
        categories.set(category.slug, row.id);
      }
      for (const product of documentCatalogProducts) {
        const existing = await tx.product.findFirst({
          where: { OR: [{ sku: product.sku }, { slug: product.slug }] },
        });
        if (existing) {
          if (existing.sku !== product.sku || existing.slug !== product.slug)
            throw new CmsError(
              "Collision avec une référence existante. Aucun produit existant n’a été remplacé.",
            );
          continue;
        }
        const details = productDetailsSchema.parse(
          managed({
            ...product,
            availability: product.availability ?? "",
            seoTitle: product.seoTitle ?? "",
            seoDescription: product.seoDescription ?? "",
            specifications: product.specifications.map((item) => ({
              ...item,
              value: item.value ?? "",
              unit: item.unit ?? "",
            })),
          }),
        );
        await tx.product.create({
          data: {
            sku: product.sku,
            slug: product.slug,
            name: product.name,
            description: product.description,
            categoryId: categories.get(product.category.slug)!,
            isDemo: false,
            active: true,
            details,
            currency: "MAD",
          },
        });
        productsCreated++;
      }
      const settings = settingsSchema.parse(
        managed({ ...defaultSettings, logo: "/images/sks-projets-logo.png" }),
      );
      const initial = [
        {
          key: "settings:site",
          kind: "SETTINGS" as const,
          title: "Paramètres du site",
          body: settings as unknown as Prisma.InputJsonValue,
        },
        ...Object.entries(copyGroups).map(([group, fields]) => ({
          key: `copy:${group}`,
          kind: "COPY" as const,
          title: `Textes · ${group}`,
          body: Object.fromEntries(
            fields
              .filter((field) => field.kind !== "image")
              .map((field) => [field.value, field.value]),
          ) as Prisma.InputJsonValue,
        })),
      ];
      for (const entry of initial) {
        if (
          await tx.contentEntry.findUnique({
            where: { key: entry.key },
            select: { id: true },
          })
        )
          continue;
        const snapshot = { title: entry.title, summary: "", body: entry.body };
        const created = await tx.contentEntry.create({
          data: {
            ...entry,
            published: snapshot,
            publishedAt: new Date(),
            revisions: { create: { version: 1, snapshot } },
          },
        });
        contentsCreated++;
        await tx.auditLog.create({
          data: {
            actorId: session.user.id,
            action: "CONTENT_INITIALIZED",
            entityType: "ContentEntry",
            entityId: created.id,
          },
        });
      }
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "SITE_PRESENTATION_IMPORTED",
          entityType: "Site",
          entityId: "sks-projets",
          metadata: {
            mediaCreated,
            categoriesCreated,
            productsCreated,
            contentsCreated,
          },
        },
      });
      return {
        mediaCreated,
        categoriesCreated,
        productsCreated,
        contentsCreated,
      };
    },
    { timeout: 60000 },
  );
}
