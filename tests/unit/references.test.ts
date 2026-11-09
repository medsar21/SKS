import { describe, expect, it } from "vitest";
import {
  defaultReferences,
  referencesSchema,
} from "@/features/references/content";
import {
  defaultSettings,
  settingsSchema,
  reservedSlugs,
} from "@/features/cms/validation";

describe("références administrables et compatibilité des services", () => {
  it("ne fournit aucune référence inventée et valide les logos", () => {
    expect(defaultReferences.logos).toEqual([]);
    expect(
      referencesSchema.safeParse({
        ...defaultReferences,
        logos: [{ name: "Logo de démonstration", src: "javascript:alert(1)" }],
      }).success,
    ).toBe(false);
    expect(
      referencesSchema.safeParse({
        ...defaultReferences,
        logos: [{ name: "", src: "/images/sks-projets-logo.png" }],
      }).success,
    ).toBe(false);
    expect(
      referencesSchema.parse({
        ...defaultReferences,
        logos: [{ name: "Logo de démonstration", src: "/media/demo-logo" }],
      }).logos,
    ).toHaveLength(1);
  });
  it("adapte les anciens paramètres publiés sans effacer leurs contenus", () => {
    const { services: _services, ...oldSeo } = defaultSettings.pageSeo;
    void _services;
    const settings = settingsSchema.parse({
      ...defaultSettings,
      pageSeo: oldSeo,
      navigation: [{ label: "Services", href: "/#vente-location" }],
      homeSections: defaultSettings.homeSections.map((section) => ({
        ...section,
        id: section.id === "references" ? "vente-location" : section.id,
      })),
    });
    expect(settings.navigation[0]?.href).toBe("/services");
    expect(
      settings.homeSections.find((section) => section.id === "references"),
    ).toBeDefined();
    expect(settings.pageSeo.services.title).toBe("Nos services");
    expect(settings.homeJourneys).toEqual(defaultSettings.homeJourneys);
    expect(reservedSlugs.has("services")).toBe(true);
  });
});
