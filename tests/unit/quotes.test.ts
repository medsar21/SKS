import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  quoteRequestSchema,
  statusChangeSchema,
} from "@/features/quotes/validation";

const mocks = vi.hoisted(() => {
  const tx = {
    $queryRaw: vi.fn(),
    quote: { findFirst: vi.fn(), create: vi.fn(), updateMany: vi.fn() },
    product: { findMany: vi.fn() },
    auditLog: { create: vi.fn() },
  };
  return { tx, transaction: vi.fn(), requireAdmin: vi.fn() };
});
vi.mock("server-only", () => ({}));
vi.mock("@/server/db", () => ({
  getDb: () => ({ $transaction: mocks.transaction }),
}));
vi.mock("@/server/authorization", () => ({ requireAdmin: mocks.requireAdmin }));
import {
  submitQuoteRequest,
  changeQuoteStatus,
  listQuotes,
  getQuoteDetail,
} from "@/server/quote-service";

const valid = {
  contactName: "Contact de démonstration",
  companyName: "Société de démonstration",
  phone: "+212600000000",
  email: "demo@example.invalid",
  city: "Ville de démonstration",
  siteAddress: "Chantier de démonstration",
  requestType: "SALE",
  lines: [{ sku: "DEMO", quantity: 12 }],
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("DATABASE_URL", "postgresql://unused");
  mocks.transaction.mockImplementation(
    async (fn: (tx: typeof mocks.tx) => Promise<unknown>) => fn(mocks.tx),
  );
  mocks.tx.$queryRaw.mockResolvedValue([{ count: 1 }]);
  mocks.tx.quote.findFirst.mockResolvedValue(null);
  mocks.tx.quote.create.mockResolvedValue({
    id: "quote-test",
    reference: "SKS-DEMO",
  });
  mocks.tx.quote.updateMany.mockResolvedValue({ count: 1 });
  mocks.tx.product.findMany.mockResolvedValue([
    {
      sku: "DEMO",
      name: "Produit de démonstration",
      price: null,
      currency: "MAD",
      isDemo: true,
    },
  ]);
  mocks.tx.auditLog.create.mockResolvedValue({});
  mocks.requireAdmin.mockResolvedValue({ user: { id: "staff-test" } });
});

describe("validation devis", () => {
  it("refuse prix, identité client et quantités invalides provenant du navigateur", () => {
    for (const payload of [
      { ...valid, customerId: "intrus" },
      { ...valid, unitPrice: 1 },
      { ...valid, lines: [{ sku: "DEMO", quantity: 0 }] },
      { ...valid, lines: [{ sku: "DEMO", quantity: 1, unitPrice: 0 }] },
      { ...valid, website: "spam" },
    ])
      expect(quoteRequestSchema.safeParse(payload).success).toBe(false);
  });
  it("refuse doublons de produits et location sans période cohérente", () => {
    expect(
      quoteRequestSchema.safeParse({
        ...valid,
        lines: [...valid.lines, ...valid.lines],
      }).success,
    ).toBe(false);
    for (const dates of [
      {},
      { rentalStart: "2026-11-20", rentalEnd: "2026-11-19" },
      { rentalStart: "2026-02-30", rentalEnd: "2026-03-02" },
    ])
      expect(
        quoteRequestSchema.safeParse({
          ...valid,
          requestType: "RENTAL",
          ...dates,
        }).success,
      ).toBe(false);
    expect(
      quoteRequestSchema.safeParse({
        ...valid,
        requestType: "RENTAL",
        rentalStart: "2026-11-20",
        rentalEnd: "2026-11-21",
      }).success,
    ).toBe(true);
  });
  it("interdit les sauts, retours et modifications des statuts définitifs", () => {
    expect(
      statusChangeSchema.safeParse({
        id: "test",
        from: "SUBMITTED",
        to: "ACCEPTED",
      }).success,
    ).toBe(false);
    expect(
      statusChangeSchema.safeParse({
        id: "test",
        from: "ACCEPTED",
        to: "REQUESTED",
      }).success,
    ).toBe(false);
    expect(
      statusChangeSchema.safeParse({
        id: "test",
        from: "SUBMITTED",
        to: "REQUESTED",
      }).success,
    ).toBe(true);
  });
});

describe("service devis", () => {
  it("enregistre SUBMITTED, les instantanés serveur et l’audit dans la même transaction", async () => {
    await expect(submitQuoteRequest(valid)).resolves.toEqual({
      reference: "SKS-DEMO",
    });
    expect(mocks.transaction).toHaveBeenCalledTimes(2);
    expect(mocks.tx.quote.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "SUBMITTED",
          isDemo: true,
          lines: {
            create: [
              expect.objectContaining({
                label: "Produit de démonstration",
                unitPrice: null,
                taxRate: null,
              }),
            ],
          },
        }),
      }),
    );
    expect(mocks.tx.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        entityId: "quote-test",
        action: "QUOTE_SUBMITTED",
        metadata: { to: "SUBMITTED" },
      }),
    });
  });
  it("ne confirme pas une demande si l’audit échoue", async () => {
    mocks.tx.auditLog.create.mockRejectedValueOnce(new Error("audit"));
    await expect(submitQuoteRequest(valid)).rejects.toThrow("audit");
  });
  it("refuse les produits absents ou inactifs", async () => {
    mocks.tx.product.findMany.mockResolvedValueOnce([]);
    await expect(submitQuoteRequest(valid)).rejects.toThrow("indisponible");
    expect(mocks.tx.quote.create).not.toHaveBeenCalled();
  });
  it("bloque les doublons et le dépassement du quota persistant", async () => {
    mocks.tx.quote.findFirst.mockResolvedValueOnce({ id: "existant" });
    await expect(submitQuoteRequest(valid)).rejects.toThrow("déjà");
    mocks.tx.$queryRaw.mockResolvedValueOnce([{ count: 101 }]);
    await expect(submitQuoteRequest(valid)).rejects.toThrow("Trop de demandes");
    expect(mocks.tx.quote.create).not.toHaveBeenCalled();
  });
  it("vérifie les permissions avant tout accès à la base", async () => {
    mocks.requireAdmin.mockRejectedValueOnce(new Error("interdit"));
    await expect(
      changeQuoteStatus({ id: "test", from: "SUBMITTED", to: "REQUESTED" }),
    ).rejects.toThrow("interdit");
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it("protège aussi la liste et la consultation détaillée", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("interdit"));
    await expect(listQuotes({})).rejects.toThrow("interdit");
    await expect(getQuoteDetail("test")).rejects.toThrow("interdit");
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it("empêche une modification concurrente et son audit", async () => {
    mocks.tx.quote.updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(
      changeQuoteStatus({ id: "test", from: "SUBMITTED", to: "REQUESTED" }),
    ).rejects.toThrow("statut a changé");
    expect(mocks.tx.auditLog.create).not.toHaveBeenCalled();
  });
});
