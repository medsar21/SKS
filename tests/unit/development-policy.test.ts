import { describe, expect, it } from "vitest";
import {
  assertDevelopmentDatabase,
  isDevelopmentAccountAllowed,
} from "@/lib/development-policy";

describe("comptes de développement", () => {
  it("interdit les comptes de démonstration en production", () => {
    expect(isDevelopmentAccountAllowed(true, "production")).toBe(false);
    expect(isDevelopmentAccountAllowed(true, "development")).toBe(true);
    expect(isDevelopmentAccountAllowed(false, "production")).toBe(true);
  });
  it("exige une autorisation explicite et une base PostgreSQL locale confirmée", () => {
    const config = {
      NODE_ENV: "development",
      ALLOW_DEV_SETUP: "true",
      DATABASE_URL: "postgresql://127.0.0.1:5440/sks_fixture",
      SKS_DEV_DATABASE: "sks_fixture",
    };
    expect(assertDevelopmentDatabase(config).port).toBe("5440");
    for (const overrides of [
      { NODE_ENV: "production" },
      { ALLOW_DEV_SETUP: "false" },
      { DATABASE_URL: "" },
      { DATABASE_URL: "invalide" },
      { DATABASE_URL: "sqlite://127.0.0.1/sks_fixture" },
      { DATABASE_URL: "postgresql://example.invalid/sks_fixture" },
      {
        DATABASE_URL: "postgresql://127.0.0.1/postgres",
        SKS_DEV_DATABASE: "postgres",
      },
      { SKS_DEV_DATABASE: "autre_base" },
    ])
      expect(() =>
        assertDevelopmentDatabase({ ...config, ...overrides }),
      ).toThrow();
  });
});
