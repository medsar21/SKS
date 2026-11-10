import { describe, expect, it } from "vitest";
import {
  calendlyUrlSchema,
  defaultSettings,
  settingsSchema,
} from "@/features/cms/validation";

describe("configuration des rendez-vous", () => {
  it("conserve les paramètres existants sans activer de lien fictif", () => {
    const { externalLinks: _links, ...legacy } = defaultSettings;
    expect(settingsSchema.parse(legacy).externalLinks.calendlyUrl).toBe("");
    expect(_links.calendlyUrl).toBe("");
  });
  it("accepte un lien Calendly HTTPS ou une valeur vide", () => {
    expect(calendlyUrlSchema.safeParse("").success).toBe(true);
    expect(
      calendlyUrlSchema.safeParse("https://calendly.com/example/meeting")
        .success,
    ).toBe(true);
  });
  it("refuse les destinations trompeuses et les protocoles dangereux", () => {
    for (const url of [
      "javascript:alert(1)",
      "http://calendly.com/example",
      "https://calendly.com.attacker.test/example",
      "https://example.com/meeting",
      "https://user@calendly.com/meeting",
      "https://calendly.com/",
    ]) {
      expect(calendlyUrlSchema.safeParse(url).success).toBe(false);
    }
  });
});
