import { z } from "zod";
import type { CatalogProduct } from "./types";

export const catalogQuerySchema = z.object({
  q: z.string().max(160).catch(""),
  categorie: z.string().max(160).catch("tous"),
  utilisation: z.string().max(160).catch("tous"),
  donnees: z
    .enum(["tous", "technique", "documents", "incompletes"])
    .catch("tous"),
  tri: z.enum(["reference", "az", "za"]).catch("reference"),
  page: z.coerce.number().int().min(1).max(100000).catch(1),
});
export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
export const defaultQuery = catalogQuerySchema.parse({});
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
export const hasTechnicalData = (product: CatalogProduct) =>
  product.specifications.some((item) => item.value !== null);
export function queryCatalog(
  products: CatalogProduct[],
  query: CatalogQuery,
  pageSize = 6,
) {
  const filtered = products
    .filter((product) => {
      const text = normalize(
        `${product.name} ${product.sku} ${product.category.name} ${product.description}`,
      );
      return (
        normalize(query.q.trim())
          .split(/\s+/)
          .every((word) => text.includes(word)) &&
        (query.categorie === "tous" ||
          product.category.slug === query.categorie) &&
        (query.utilisation === "tous" ||
          (product.usage ?? "non-renseignee") === query.utilisation) &&
        (query.donnees === "tous" ||
          (query.donnees === "technique" && hasTechnicalData(product)) ||
          (query.donnees === "documents" && product.documents.length > 0) ||
          (query.donnees === "incompletes" && !hasTechnicalData(product)))
      );
    })
    .sort((a, b) =>
      query.tri === "reference"
        ? a.sku.localeCompare(b.sku, "fr")
        : a.name.localeCompare(b.name, "fr") * (query.tri === "za" ? -1 : 1),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(query.page, pages);
  return {
    total: filtered.length,
    pages,
    page,
    products: filtered.slice((page - 1) * pageSize, page * pageSize),
  };
}
