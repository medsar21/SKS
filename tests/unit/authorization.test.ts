import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  getSession: vi.fn(),
  findUser: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
}));
vi.mock("@/server/auth", () => ({
  isAuthConfigured: mocks.configured,
  getAuth: () => ({ api: { getSession: mocks.getSession } }),
}));
vi.mock("@/server/db", () => ({
  getDb: () => ({ user: { findUnique: mocks.findUser } }),
}));
import { requireAdmin, requireSession } from "@/server/authorization";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NODE_ENV", "test");
  mocks.configured.mockReturnValue(true);
  mocks.getSession.mockResolvedValue({
    user: { id: "fixture-user", role: "ADMIN" },
  });
  mocks.findUser.mockResolvedValue({ role: "ADMIN", developmentOnly: false });
});

describe("autorisation serveur", () => {
  it("refuse une session absente et ne lit aucune donnée privée", async () => {
    mocks.getSession.mockResolvedValueOnce(null);
    await expect(requireAdmin()).rejects.toThrow("redirect:/connexion");
    expect(mocks.findUser).not.toHaveBeenCalled();
  });
  it("refuse un client même si un ancien contenu de session indiquait ADMIN", async () => {
    mocks.findUser.mockResolvedValueOnce({
      role: "CUSTOMER",
      developmentOnly: false,
    });
    await expect(requireAdmin()).rejects.toThrow("redirect:/espace-client");
    expect(mocks.findUser).toHaveBeenCalledWith({
      where: { id: "fixture-user" },
      select: { role: true, developmentOnly: true },
    });
  });
  it("autorise uniquement les rôles ADMIN et SALES relus en base", async () => {
    for (const role of ["ADMIN", "SALES"]) {
      mocks.findUser.mockResolvedValueOnce({ role, developmentOnly: false });
      expect((await requireAdmin()).user.role).toBe(role);
    }
  });
  it("refuse un compte supprimé ou de développement en production", async () => {
    mocks.findUser.mockResolvedValueOnce(null);
    await expect(requireSession()).rejects.toThrow("redirect:/connexion");
    vi.stubEnv("NODE_ENV", "production");
    mocks.findUser.mockResolvedValueOnce({
      role: "ADMIN",
      developmentOnly: true,
    });
    await expect(requireSession()).rejects.toThrow("redirect:/connexion");
  });
  it("refuse un service d’authentification non configuré", async () => {
    mocks.configured.mockReturnValueOnce(false);
    await expect(requireSession()).rejects.toThrow("configuration=requise");
    expect(mocks.getSession).not.toHaveBeenCalled();
  });
});
