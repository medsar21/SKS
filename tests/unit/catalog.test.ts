import { describe, expect, it } from "vitest";
import { demoCatalogProducts } from "@/features/catalog/demo-catalog";
import {
  catalogQuerySchema,
  defaultQuery,
  queryCatalog,
} from "@/features/catalog/query";
import type { CatalogProduct } from "@/features/catalog/types";

describe("catalogue public", () => {
  it("normalise accents, casse et mots-clés et combine les filtres", () => {
    const query = {
      ...defaultQuery,
      q: "ELEMENT mecanoflex",
      categorie: "mecanoflex",
      utilisation: "non-renseignee",
      donnees: "incompletes" as const,
    };
    const result = queryCatalog(demoCatalogProducts, query);
    expect(result.total).toBe(1);
    expect(result.products[0]?.sku).toBe("DEMO-CAT-05");
    expect(
      queryCatalog(demoCatalogProducts, { ...query, categorie: "vmc" }).total,
    ).toBe(0);
  });
  it("trie et borne la pagination après filtrage", () => {
    const result = queryCatalog(demoCatalogProducts, {
      ...defaultQuery,
      page: 999,
    });
    expect(result.page).toBe(2);
    expect(result.products).toHaveLength(1);
    const az = queryCatalog(
      demoCatalogProducts,
      { ...defaultQuery, tri: "az" },
      100,
    ).products;
    const za = queryCatalog(
      demoCatalogProducts,
      { ...defaultQuery, tri: "za" },
      100,
    ).products;
    expect(za.map((p) => p.sku)).toEqual(az.map((p) => p.sku).reverse());
    expect(
      queryCatalog(demoCatalogProducts, {
        ...defaultQuery,
        q: "introuvable",
        page: 2,
      }).page,
    ).toBe(1);
  });
  it("distingue les documents et données techniques du stock sans en inventer", () => {
    expect(
      queryCatalog(demoCatalogProducts, {
        ...defaultQuery,
        donnees: "documents",
      }).total,
    ).toBe(0);
    expect(
      queryCatalog(demoCatalogProducts, {
        ...defaultQuery,
        donnees: "technique",
      }).total,
    ).toBe(0);
    // Fixture de test explicite ; jamais exposée dans le catalogue.
    const fixture: CatalogProduct = {
      ...demoCatalogProducts[0]!,
      usage: "Test uniquement",
      documents: [{ label: "Fixture", href: "/fixture.pdf" }],
      specifications: [{ label: "Fixture", value: "0" }],
    };
    for (const donnees of ["documents", "technique"] as const) {
      expect(
        queryCatalog([fixture], {
          ...defaultQuery,
          donnees,
          utilisation: "Test uniquement",
        }).total,
      ).toBe(1);
    }
  });
  it("valide et normalise les paramètres externes", () => {
    const query = catalogQuerySchema.parse({
      q: ["x"],
      page: "-10",
      tri: "prix",
      donnees: "stock",
    });
    expect(query).toEqual(defaultQuery);
    expect(catalogQuerySchema.parse({ page: "2" }).page).toBe(2);
  });
});
