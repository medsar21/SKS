export const demoCategories = [
  {
    slug: "coffrage",
    kind: "panel",
    name: "Coffrage métallique",
    description: "Des systèmes pour donner forme à vos ouvrages.",
  },
  {
    slug: "etaiement",
    kind: "prop",
    name: "Étaiement",
    description: "Des solutions pour accompagner vos structures.",
  },
  {
    slug: "accessoires",
    kind: "accessory",
    name: "Accessoires de chantier",
    description: "Les éléments complémentaires de votre équipement.",
  },
] as const;
export const demoProducts = [
  {
    sku: "DEMO-CF-01",
    slug: "panneau-coffrage-demo",
    name: "Panneau de coffrage",
    category: "coffrage",
    description:
      "Exemple de panneau métallique modulaire. Dimensions et caractéristiques à confirmer.",
    kind: "panel",
  },
  {
    sku: "DEMO-ET-01",
    slug: "etai-demo",
    name: "Étai métallique",
    category: "etaiement",
    description:
      "Exemple d'étai de chantier. Charges et plage de réglage à confirmer.",
    kind: "prop",
  },
  {
    sku: "DEMO-AC-01",
    slug: "accessoires-demo",
    name: "Accessoires d’assemblage",
    category: "accessoires",
    description:
      "Exemple d'accessoires de liaison. Compatibilités à confirmer.",
    kind: "accessory",
  },
] as const;
export type DemoProduct = (typeof demoProducts)[number];
