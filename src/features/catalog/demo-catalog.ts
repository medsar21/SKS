import type { CatalogProduct } from "./types";

export const catalogCategories = [
  { slug: "mecanoflex", name: "MECANOFLEX" },
  { slug: "ecoform", name: "ECOFORM" },
  { slug: "vmc", name: "VMC" },
  { slug: "accessoires", name: "Accessoires" },
];

// Scénarios de navigation uniquement : aucun équipement commercial ni compatibilité attestés.
export const demoCatalogProducts: CatalogProduct[] = (
  [
    ["mecanoflex", "Panneau — exemple MECANOFLEX"],
    ["ecoform", "Panneau — exemple ECOFORM"],
    ["vmc", "Panneau — exemple VMC"],
    ["accessoires", "Liaison — exemple d’accessoire"],
    ["mecanoflex", "Élément d’angle — exemple MECANOFLEX"],
    ["ecoform", "Élément d’angle — exemple ECOFORM"],
    ["accessoires", "Assemblage — exemple d’accessoire"],
  ] as const
).map(([category, name], index) => ({
  sku: `DEMO-CAT-${String(index + 1).padStart(2, "0")}`,
  slug: `exemple-${category}-${index + 1}`,
  name,
  category: catalogCategories.find((item) => item.slug === category)!,
  description:
    "Référence illustrative pour explorer le catalogue. Configuration et usage à valider avec SKS PROJETS.",
  kind: category === "accessoires" ? "accessory" : "panel",
  isDemo: true,
  usage: null,
  images: [],
  specifications: [
    { label: "Dimensions", value: null, unit: "mm" },
    { label: "Masse", value: null, unit: "kg" },
    { label: "Matériau et finition", value: null },
    { label: "Compatibilités", value: null },
  ],
  documents: [],
}));
