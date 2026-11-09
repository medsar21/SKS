import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  db: vi.fn(),
  hash: vi.fn(),
  transaction: vi.fn(),
  actor: vi.fn(),
  create: vi.fn(),
  audit: vi.fn(),
  count: vi.fn(),
  list: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
}));
vi.mock("@/server/authorization", () => ({ requireSession: mocks.session }));
vi.mock("@/server/db", () => ({ getDb: mocks.db }));
vi.mock("better-auth/crypto", () => ({ hashPassword: mocks.hash }));

import { Prisma } from "@/generated/prisma/client";
import { createUserSchema } from "@/features/users/validation";
import { createManagedUser, listManagedUsers } from "@/server/user-service";

const input = {
  name: "Utilisateur de démonstration",
  email: "demo-user@example.invalid",
  role: "CUSTOMER",
  password: "mot-de-passe-de-test-uniquement",
  confirmPassword: "mot-de-passe-de-test-uniquement",
};
const tx = {
  user: { findUnique: mocks.actor, create: mocks.create },
  auditLog: { create: mocks.audit },
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NODE_ENV", "test");
  mocks.session.mockResolvedValue({
    user: { id: "demo-admin", role: "ADMIN" },
  });
  mocks.actor.mockResolvedValue({ role: "ADMIN", developmentOnly: false });
  mocks.hash.mockResolvedValue("hashed-test-fixture");
  mocks.db.mockReturnValue({
    $transaction: mocks.transaction,
    user: { count: mocks.count, findMany: mocks.list },
  });
  mocks.transaction.mockImplementation(
    async (work: (client: typeof tx) => unknown) => work(tx),
  );
  mocks.count.mockResolvedValue(1);
  mocks.list.mockResolvedValue([]);
});

describe("validation des nouveaux comptes", () => {
  it("normalise le nom et l’email, sans modifier le mot de passe", () => {
    const password = "  mot-de-passe-de-test  ";
    const parsed = createUserSchema.parse({
      ...input,
      name: "  Démonstration  ",
      email: "  DEMO-USER@EXAMPLE.INVALID  ",
      password,
      confirmPassword: password,
    });
    expect(parsed.name).toBe("Démonstration");
    expect(parsed.email).toBe("demo-user@example.invalid");
    expect(parsed.password).toBe(password);
  });
  it.each([
    { password: "court", confirmPassword: "court" },
    { password: " ".repeat(12), confirmPassword: " ".repeat(12) },
    { password: "x".repeat(129), confirmPassword: "x".repeat(129) },
    { confirmPassword: "confirmation-differente" },
    { role: "SUPERADMIN" },
    { email: "invalide" },
    { name: " " },
    { developmentOnly: false },
    { actorId: "autre-administrateur" },
    { id: "identifiant-impose" },
  ])("refuse une entrée invalide ou des champs non autorisés", (changes) => {
    expect(createUserSchema.safeParse({ ...input, ...changes }).success).toBe(
      false,
    );
  });
});

describe("autorisation des utilisateurs", () => {
  it.each(["SALES", "CUSTOMER"])(
    "refuse %s avant toute lecture privée ou écriture",
    async (role) => {
      mocks.session.mockResolvedValue({ user: { id: "demo-other", role } });
      await expect(listManagedUsers()).rejects.toThrow(
        "redirect:/admin?acces=utilisateurs-refuse",
      );
      await expect(createManagedUser(input)).rejects.toThrow(
        "redirect:/admin?acces=utilisateurs-refuse",
      );
      expect(mocks.db).not.toHaveBeenCalled();
      expect(mocks.hash).not.toHaveBeenCalled();
    },
  );
  it("refuse un visiteur sans session avant de lire ou créer", async () => {
    mocks.session.mockRejectedValue(new Error("redirect:/connexion"));
    await expect(listManagedUsers()).rejects.toThrow("redirect:/connexion");
    await expect(createManagedUser(input)).rejects.toThrow(
      "redirect:/connexion",
    );
    expect(mocks.db).not.toHaveBeenCalled();
  });
  it("revérifie les droits dans la transaction après le hachage", async () => {
    mocks.actor.mockResolvedValue({ role: "CUSTOMER", developmentOnly: false });
    await expect(createManagedUser(input)).rejects.toThrow(
      "Vos droits ont changé",
    );
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });
  it("ne permet pas à un compte de développement de créer un compte en production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    mocks.actor.mockResolvedValue({ role: "ADMIN", developmentOnly: true });
    await expect(createManagedUser(input)).rejects.toThrow(
      "Vos droits ont changé",
    );
    expect(mocks.create).not.toHaveBeenCalled();
  });
});

describe("création atomique et confidentialité", () => {
  it.each(["CUSTOMER", "SALES", "ADMIN"])(
    "crée un compte %s avec hachage et audit attribué à la session",
    async (role) => {
      const result = await createManagedUser({ ...input, role });
      expect(mocks.hash).toHaveBeenCalledWith(input.password);
      expect(mocks.transaction).toHaveBeenCalledOnce();
      expect(mocks.create).toHaveBeenCalledWith({
        data: {
          id: result.id,
          name: input.name,
          email: input.email,
          role,
          developmentOnly: true,
          accounts: {
            create: {
              id: expect.any(String),
              accountId: result.id,
              providerId: "credential",
              password: "hashed-test-fixture",
            },
          },
        },
        select: { id: true },
      });
      expect(mocks.audit).toHaveBeenCalledWith({
        data: {
          actorId: "demo-admin",
          action: "USER_CREATED",
          entityType: "User",
          entityId: result.id,
          metadata: { role, developmentOnly: true },
        },
      });
      expect(Object.keys(result)).toEqual(["id"]);
      expect(JSON.stringify(mocks.audit.mock.calls)).not.toContain(
        input.password,
      );
      expect(JSON.stringify(mocks.audit.mock.calls)).not.toContain(input.email);
      expect(JSON.stringify(mocks.audit.mock.calls)).not.toContain(
        "hashed-test-fixture",
      );
    },
  );
  it("crée un compte utilisable en production depuis un administrateur autorisé", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await createManagedUser(input);
    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ developmentOnly: false }),
      }),
    );
  });
  it("refuse les emails en double sans remplacer de compte ni mot de passe", async () => {
    mocks.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("doublon", {
        code: "P2002",
        clientVersion: "test",
      }),
    );
    await expect(createManagedUser(input)).rejects.toThrow(
      "Cette adresse email est déjà utilisée.",
    );
    expect(mocks.audit).not.toHaveBeenCalled();
  });
  it("ne confirme pas la création si l’audit échoue dans la transaction", async () => {
    mocks.audit.mockRejectedValue(new Error("audit unavailable"));
    await expect(createManagedUser(input)).rejects.toThrow("audit unavailable");
    expect(mocks.transaction).toHaveBeenCalledOnce();
  });
  it("valide les données avant de hacher ou d’écrire", async () => {
    await expect(
      createManagedUser({ ...input, role: "SUPERADMIN" }),
    ).rejects.toThrow();
    expect(mocks.hash).not.toHaveBeenCalled();
    expect(mocks.db).not.toHaveBeenCalled();
  });
  it("limite la liste et ne sélectionne ni comptes ni mots de passe", async () => {
    mocks.count.mockResolvedValue(27);
    const result = await listManagedUsers(999);
    expect(result).toMatchObject({ page: 2, pages: 2, total: 27 });
    expect(mocks.list).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        developmentOnly: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 25,
      skip: 25,
    });
  });
});
