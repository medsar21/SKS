import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { getDb } from "@/server/db";
import { requireAdmin } from "@/server/authorization";
import {
  quoteRequestSchema,
  quoteSearchSchema,
  statusChangeSchema,
} from "@/features/quotes/validation";
import { Prisma } from "@/generated/prisma/client";

export class QuoteRequestError extends Error {}

// Entrée publique délibérée : aucun customerId ni prix fourni par le navigateur.
export async function submitQuoteRequest(input: unknown) {
  const data = quoteRequestSchema.parse(input);
  if (!process.env.DATABASE_URL)
    throw new QuoteRequestError(
      "Le service de devis est indisponible. Réessayez ultérieurement.",
    );
  const hash = (value: string) =>
    createHash("sha256").update(value).digest("hex");
  const submissionHash = hash(
    JSON.stringify({
      ...data,
      lines: [...data.lines].sort((a, b) => a.sku.localeCompare(b.sku)),
    }),
  );
  await getDb().$transaction(async (tx) => {
    // Compteurs persistants et verrouillés par PostgreSQL, communs aux instances.
    // Le quota global ne dépend d’aucun en-tête IP falsifiable.
    const now = BigInt(Date.now());
    for (const [key, max] of [
      ["quotes:global", 100],
      [`quotes:email:${hash(data.email)}`, 5],
    ] as const) {
      const rows = await tx.$queryRaw<{ count: number }[]>`
        INSERT INTO "rateLimit" ("id", "key", "count", "lastRequest") VALUES (${randomUUID()}, ${key}, 1, ${now})
        ON CONFLICT ("key") DO UPDATE SET
          "count" = CASE WHEN "rateLimit"."lastRequest" < ${now - 3600000n} THEN 1 ELSE "rateLimit"."count" + 1 END,
          "lastRequest" = CASE WHEN "rateLimit"."lastRequest" < ${now - 3600000n} THEN ${now} ELSE "rateLimit"."lastRequest" END
        RETURNING "count"`;
      if (!rows[0] || rows[0].count > max)
        throw new QuoteRequestError(
          "Trop de demandes. Veuillez réessayer dans une heure.",
        );
    }
  });
  return getDb().$transaction(async (tx) => {
    // Sérialise les soumissions concurrentes avant le contrôle des doublons.
    await tx.$queryRaw`SELECT "id" FROM "rateLimit" WHERE "key" = 'quotes:global' FOR UPDATE`;
    const duplicate = await tx.quote.findFirst({
      where: {
        submissionHash,
        createdAt: { gte: new Date(Date.now() - 15 * 60000) },
      },
      select: { id: true },
    });
    if (duplicate)
      throw new QuoteRequestError(
        "Cette demande a déjà été enregistrée. Consultez votre confirmation précédente.",
      );
    const products = await tx.product.findMany({
      where: { active: true, sku: { in: data.lines.map((line) => line.sku) } },
    });
    if (products.length !== data.lines.length)
      throw new QuoteRequestError(
        "Un produit est indisponible dans la base. Actualisez le catalogue avant de réessayer.",
      );
    const quote = await tx.quote.create({
      data: {
        reference: `SKS-${new Date().getUTCFullYear()}-${randomUUID().toUpperCase()}`,
        status: "SUBMITTED",
        contactName: data.contactName,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        siteAddress: data.siteAddress,
        requestType: data.requestType,
        rentalStart: data.rentalStart ? new Date(data.rentalStart) : null,
        rentalEnd: data.rentalEnd ? new Date(data.rentalEnd) : null,
        notes: data.notes,
        submissionHash,
        isDemo: products.some((product) => product.isDemo),
        lines: {
          create: data.lines.map((line) => {
            const product = products.find((p) => p.sku === line.sku)!;
            if (product.currency !== "MAD")
              throw new QuoteRequestError(
                "Devise du produit incompatible avec cette demande.",
              );
            return {
              sku: product.sku,
              label: product.name,
              quantity: new Prisma.Decimal(line.quantity),
              unitPrice: product.price,
              taxRate: null,
            };
          }),
        },
      },
      select: { id: true, reference: true },
    });
    await tx.auditLog.create({
      data: {
        action: "QUOTE_SUBMITTED",
        entityType: "Quote",
        entityId: quote.id,
        metadata: { to: "SUBMITTED" },
      },
    });
    return { reference: quote.reference };
  });
}

export async function listQuotes(input: unknown) {
  await requireAdmin();
  const { q, status, page } = quoteSearchSchema.parse(input);
  const where: Prisma.QuoteWhereInput = {
    status,
    ...(q
      ? {
          OR: ["reference", "companyName", "contactName", "city"].map(
            (key) => ({ [key]: { contains: q, mode: "insensitive" } }),
          ),
        }
      : {}),
  };
  const [quotes, total] = await getDb().$transaction([
    getDb().quote.findMany({
      where,
      select: {
        id: true,
        reference: true,
        companyName: true,
        city: true,
        status: true,
        createdAt: true,
        isDemo: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 20,
      skip: (page - 1) * 20,
    }),
    getDb().quote.count({ where }),
  ]);
  return { quotes, total, page };
}

export async function getQuoteDetail(id: string) {
  await requireAdmin();
  const validId = statusChangeSchema.shape.id.parse(id);
  const [quote, history] = await getDb().$transaction([
    getDb().quote.findUnique({
      where: { id: validId },
      include: {
        lines: true,
        customer: {
          select: { companyName: true, email: true, phone: true, city: true },
        },
      },
    }),
    getDb().auditLog.findMany({
      where: { entityType: "Quote", entityId: validId },
      select: { id: true, action: true, metadata: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);
  return { quote, history };
}

export async function changeQuoteStatus(input: unknown) {
  const session = await requireAdmin();
  const { id, from, to } = statusChangeSchema.parse(input);
  return getDb().$transaction(async (tx) => {
    const result = await tx.quote.updateMany({
      where: { id, status: from },
      data: { status: to },
    });
    if (result.count !== 1)
      throw new QuoteRequestError(
        "Le statut a changé. Actualisez la page avant de réessayer.",
      );
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "QUOTE_STATUS_CHANGED",
        entityType: "Quote",
        entityId: id,
        metadata: { from, to },
      },
    });
  });
}
