import { describe, expect, it } from "vitest";
import {
  productInputSchema,
  catalogueFilterSchema,
} from "@/features/catalog/validation";
import { formatMoney, dictionaries } from "@/lib/i18n";
const input = {
  name: "Panneau démo",
  sku: "DEMO-001",
  slug: "panneau-demo",
  description: "Description de démonstration.",
  categoryId: "synthetic-category",
};
describe("validation métier", () => {
  it("refuse prix négatifs, précision excessive et slugs invalides", () => {
    expect(
      productInputSchema.safeParse({ ...input, price: "1234.50" }).success,
    ).toBe(true);
    for (const price of ["-1", "1.234", "NaN", "1e5"])
      expect(productInputSchema.safeParse({ ...input, price }).success).toBe(
        false,
      );
    expect(
      productInputSchema.safeParse({ ...input, slug: "../admin" }).success,
    ).toBe(false);
    expect(catalogueFilterSchema.safeParse("<script>").success).toBe(false);
  });
  it("prépare MAD et la direction arabe", () => {
    expect(formatMoney(1200)).toMatch(/1.*200/);
    expect(formatMoney(1200, "en")).toContain("MAD");
    expect(dictionaries.ar.direction).toBe("rtl");
  });
});
