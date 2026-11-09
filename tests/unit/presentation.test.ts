import { afterEach, describe, expect, it, vi } from "vitest";
const db = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("Unexpected database access");
  }),
);
vi.mock("server-only", () => ({}));
vi.mock("@/server/db", () => ({ getDb: db }));
import { isPresentationMode } from "@/lib/deployment-mode";
import { getCatalog } from "@/server/catalog-service";
import {
  getSiteContent,
  getPublishedArticles,
  getPublicEntry,
} from "@/server/cms-service";
import { isAuthConfigured } from "@/server/auth";
import { submitQuoteRequest } from "@/server/quote-service";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});
describe("présentation client isolée des services connectés", () => {
  it("utilise le mode versionné et exige une sélection valide", () => {
    expect(isPresentationMode({})).toBe(false);
    expect(isPresentationMode({ SKS_SITE_MODE: "presentation" })).toBe(true);
    expect(isPresentationMode({ SKS_SITE_MODE: "production" })).toBe(false);
    expect(() => isPresentationMode({ SKS_SITE_MODE: "typo" })).toThrow();
  });
  it("sert les 17 produits et contenus sans lire de base, même si une URL existe", async () => {
    vi.stubEnv("SKS_SITE_MODE", "presentation");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DATABASE_URL", "postgresql://unused.invalid/unused");
    const catalog = await getCatalog();
    expect(catalog.mode).toBe("document");
    expect(catalog.products).toHaveLength(17);
    expect((await getSiteContent()).settings.indexSearchEngines).toBe(false);
    expect(await getPublishedArticles()).toEqual([]);
    expect(await getPublicEntry("PAGE", "test")).toBeNull();
    expect(db).not.toHaveBeenCalled();
  });
  it("désactive l’authentification et interdit tout enregistrement de devis", async () => {
    vi.stubEnv("SKS_SITE_MODE", "presentation");
    expect(isAuthConfigured()).toBe(false);
    await expect(submitQuoteRequest({})).rejects.toThrow("aucune demande");
    expect(db).not.toHaveBeenCalled();
  });
});
