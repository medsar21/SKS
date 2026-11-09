import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  db: vi.fn(),
  findEntry: vi.fn(),
  updateEntry: vi.fn(),
  createEntry: vi.fn(),
  createRevision: vi.fn(),
  createAudit: vi.fn(),
  transaction: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
}));
vi.mock("@/server/authorization", () => ({ requireSession: mocks.session }));
vi.mock("@/server/db", () => ({ getDb: mocks.db }));

import {
  deleteEntry,
  getAdminOverview,
  getDraftPreview,
  getEntryEditor,
  listAudit,
  listEntries,
  restoreEntry,
  saveEntry,
} from "@/server/cms-service";
import {
  deleteCatalogRecord,
  getAdminCatalog,
  saveCategoryRecord,
  saveProductRecord,
} from "@/server/catalog-admin-service";
import {
  deleteMediaRecord,
  listMedia,
  updateMediaRecord,
  uploadMediaRecord,
} from "@/server/media-service";
import { emptyPageBody, type EntryInput } from "@/features/cms/validation";

const input: EntryInput = {
  id: "demo-entry",
  revision: 3,
  kind: "PAGE",
  key: "page-demo",
  title: "Page de démonstration",
  summary: "Contenu de test uniquement",
  body: emptyPageBody,
  intent: "draft",
};
const publishedAt = new Date("2026-10-28T12:00:00Z");
const existing = {
  id: input.id,
  kind: input.kind,
  key: "page:page-demo",
  revision: 3,
  publishedAt,
};
const tx = {
  contentEntry: {
    findUnique: mocks.findEntry,
    findUniqueOrThrow: mocks.findEntry,
    updateMany: mocks.updateEntry,
    create: mocks.createEntry,
  },
  contentRevision: { create: mocks.createRevision },
  auditLog: { create: mocks.createAudit },
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({
    user: { id: "demo-admin", role: "ADMIN" },
  });
  mocks.db.mockReturnValue({ $transaction: mocks.transaction });
  mocks.transaction.mockImplementation(
    async (work: (client: typeof tx) => unknown) => work(tx),
  );
  mocks.findEntry.mockResolvedValue(existing);
  mocks.updateEntry.mockResolvedValue({ count: 1 });
  mocks.createEntry.mockResolvedValue({ ...existing, revision: 1 });
});

describe("accès serveur au CMS, au catalogue et aux médias", () => {
  const operations = [
    ["lister les contenus", () => listEntries("PAGE")],
    ["ouvrir l’éditeur", () => getEntryEditor("demo-entry")],
    ["aperçu privé", () => getDraftPreview("demo-entry")],
    ["tableau de bord", () => getAdminOverview()],
    ["journal privé", () => listAudit()],
    ["enregistrer", () => saveEntry(input)],
    ["restaurer", () => restoreEntry("demo-entry", 1)],
    ["supprimer", () => deleteEntry("demo-entry", 3)],
    ["lire le catalogue privé", () => getAdminCatalog()],
    ["modifier un produit", () => saveProductRecord({})],
    ["modifier une catégorie", () => saveCategoryRecord({})],
    [
      "supprimer un produit",
      () => deleteCatalogRecord("product", "demo-product", 1),
    ],
    ["lister les médias", () => listMedia()],
    ["téléverser", () => uploadMediaRecord(new FormData())],
    [
      "modifier un média",
      () => updateMediaRecord("demo-media", "Description démo"),
    ],
    ["supprimer un média", () => deleteMediaRecord("demo-media")],
  ] as const;

  it.each(operations)(
    "refuse SALES et CUSTOMER avant de %s",
    async (_name, operation) => {
      for (const role of ["SALES", "CUSTOMER"]) {
        mocks.session.mockResolvedValue({ user: { id: "demo-user", role } });
        await expect(operation()).rejects.toThrow(
          "redirect:/admin?acces=contenu-refuse",
        );
      }
      expect(mocks.db).not.toHaveBeenCalled();
    },
  );

  it.each(operations)(
    "exige une session avant de %s",
    async (_name, operation) => {
      mocks.session.mockRejectedValue(new Error("redirect:/connexion"));
      await expect(operation()).rejects.toThrow("redirect:/connexion");
      expect(mocks.db).not.toHaveBeenCalled();
    },
  );
});

describe("brouillons, publication et concurrence", () => {
  it.each(["draft", "publish", "unpublish"] as const)(
    "refuse de déplacer un contenu publié pendant %s",
    async (intent) => {
      await expect(
        saveEntry({ ...input, key: "autre-lien", intent }),
      ).rejects.toThrow("Retirez d’abord la publication");
      expect(mocks.updateEntry).not.toHaveBeenCalled();
      expect(mocks.createAudit).not.toHaveBeenCalled();
    },
  );

  it("permet de renommer un brouillon sans publication", async () => {
    mocks.findEntry.mockResolvedValue({ ...existing, publishedAt: null });
    await saveEntry({ ...input, key: "nouveau-lien" });
    expect(mocks.updateEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ key: "page:nouveau-lien" }),
      }),
    );
  });

  it("conserve la publication lors d’un enregistrement de brouillon", async () => {
    await saveEntry(input);
    const data = mocks.updateEntry.mock.calls[0]![0].data;
    expect(data).not.toHaveProperty("published");
    expect(data).not.toHaveProperty("publishedAt");
    expect(mocks.createRevision).toHaveBeenCalledOnce();
    expect(mocks.createAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          actorId: "demo-admin",
          action: "CONTENT_DRAFT",
        }),
      }),
    );
  });

  it("publie un instantané validé et journalise dans la même transaction", async () => {
    await saveEntry({ ...input, intent: "publish" });
    expect(mocks.transaction).toHaveBeenCalledOnce();
    expect(mocks.updateEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          published: {
            title: input.title,
            summary: input.summary,
            body: emptyPageBody,
          },
          publishedAt: expect.any(Date),
        }),
      }),
    );
    expect(mocks.createRevision).toHaveBeenCalledOnce();
    expect(mocks.createAudit).toHaveBeenCalledOnce();
  });

  it("refuse une version périmée sans écriture ni audit", async () => {
    await expect(saveEntry({ ...input, revision: 2 })).rejects.toThrow(
      "Ce contenu a changé",
    );
    expect(mocks.updateEntry).not.toHaveBeenCalled();
    expect(mocks.createAudit).not.toHaveBeenCalled();
  });

  it("détecte une écriture concurrente avant la création de révision", async () => {
    mocks.updateEntry.mockResolvedValue({ count: 0 });
    await expect(saveEntry(input)).rejects.toThrow("Une autre modification");
    expect(mocks.createRevision).not.toHaveBeenCalled();
    expect(mocks.createAudit).not.toHaveBeenCalled();
  });
});
