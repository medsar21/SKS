import { describe, expect, it } from "vitest";
import { getTrustedAuthOrigins } from "@/lib/auth-origins";

describe("origines autorisées pour la connexion", () => {
  it("autorise les deux domaines SKS avec une base Vercel", () => {
    const origins = getTrustedAuthOrigins(
      "https://sksprojet.vercel.app",
      "production",
    );
    expect(origins).toContain("https://www.sks-projets.ma");
    expect(origins).toContain("https://sks-projets.ma");
    expect(origins).toContain("https://sksprojet.vercel.app");
    expect(origins).not.toContain("https://sks-projets.ma.attacker.invalid");
    expect(
      origins.some(
        (origin) => origin.includes("*") || origin.startsWith("http:"),
      ),
    ).toBe(false);
  });
  it("normalise la base configurée et évite les doublons", () => {
    const origins = getTrustedAuthOrigins(
      "https://www.sks-projets.ma/",
      "production",
    );
    expect(origins).toHaveLength(2);
  });
  it("réserve les origines locales au développement", () => {
    expect(
      getTrustedAuthOrigins("http://127.0.0.1:3001", "development"),
    ).toContain("http://localhost:3000");
    expect(
      getTrustedAuthOrigins("https://www.sks-projets.ma", "production"),
    ).not.toContain("http://localhost:3000");
  });
});
