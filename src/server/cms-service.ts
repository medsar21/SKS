import "server-only";
import { isPresentationMode } from "@/lib/deployment-mode";
import { cache } from "react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma, type ContentKind } from "@/generated/prisma/client";
import { requireSession } from "./authorization";
import { getDb } from "./db";
import { copyGroups } from "@/features/cms/copy-defaults";
import {
  defaultSettings,
  settingsSchema,
  entryInputSchema,
  pageBodySchema,
  emptyPageBody,
  slugSchema,
  reservedSlugs,
  imagePath,
  safeLink,
  type EntryInput,
} from "@/features/cms/validation";

export class CmsError extends Error {}
export async function requireContentAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") redirect("/admin?acces=contenu-refuse");
  return session;
}
const snapshotSchema = z.object({
  title: z.string(),
  summary: z.string(),
  body: z.unknown(),
});
export const getSiteContent = cache(async () => {
  if (isPresentationMode())
    return { settings: defaultSettings, copy: {} as Record<string, string> };
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL)
    throw new Error(
      "Configurez DATABASE_URL avant le démarrage en production.",
    );
  if (!process.env.DATABASE_URL)
    return { settings: defaultSettings, copy: {} as Record<string, string> };
  const entries = await getDb().contentEntry.findMany({
    where: { kind: { in: ["COPY", "SETTINGS"] }, publishedAt: { not: null } },
    select: { key: true, published: true },
  });
  let settings = defaultSettings;
  const copy: Record<string, string> = {};
  for (const entry of entries) {
    const data = snapshotSchema.parse(entry.published);
    if (entry.key === "settings:site")
      settings = settingsSchema.parse(data.body);
    else if (entry.key.startsWith("copy:")) {
      const group = entry.key.slice(5);
      for (const [original, value] of Object.entries(
        z.record(z.string(), z.string()).parse(data.body),
      ))
        copy[`${group}:${original}`] = value;
    }
  }
  return { settings, copy };
});
export async function getPublicEntry(kind: "PAGE" | "ARTICLE", slug: string) {
  if (isPresentationMode() || !process.env.DATABASE_URL) return null;
  const entry = await getDb().contentEntry.findUnique({
    where: { key: `${kind.toLowerCase()}:${slug}` },
    select: { published: true, publishedAt: true },
  });
  if (!entry?.published || !entry.publishedAt) return null;
  const data = snapshotSchema.parse(entry.published);
  return {
    ...data,
    body: pageBodySchema.parse(data.body),
    publishedAt: entry.publishedAt,
  };
}
export async function getPublishedArticles() {
  if (isPresentationMode() || !process.env.DATABASE_URL) return [];
  const records = await getDb().contentEntry.findMany({
    where: { kind: "ARTICLE", publishedAt: { not: null } },
    select: { key: true, published: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
  });
  return records.map((record) => {
    const data = snapshotSchema.parse(record.published);
    return {
      ...data,
      body: pageBodySchema.parse(data.body),
      slug: record.key.slice(8),
      publishedAt: record.publishedAt,
    };
  });
}
export async function listEntries(kind: ContentKind) {
  await requireContentAdmin();
  return getDb().contentEntry.findMany({
    where: { kind },
    select: {
      id: true,
      key: true,
      title: true,
      summary: true,
      revision: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}
export async function getEntryEditor(
  id: string,
  kind: "PAGE" | "ARTICLE" = "PAGE",
) {
  await requireContentAdmin();
  const group = id.startsWith("copy-") ? id.slice(5) : null;
  if (group && !copyGroups[group]) return null;
  const systemKey =
    id === "site" ? "settings:site" : group ? `copy:${group}` : null;
  const record = await getDb().contentEntry.findUnique({
    where: systemKey ? { key: systemKey } : { id },
    include: {
      revisions: {
        select: { id: true, version: true, createdAt: true },
        orderBy: { version: "desc" },
        take: 30,
      },
    },
  });
  if (record)
    return {
      ...record,
      key: record.key.split(":").slice(1).join(":"),
      body:
        record.kind === "SETTINGS"
          ? settingsSchema.parse(record.body)
          : (record.body as unknown),
      published: Boolean(record.published),
      updatedAt: record.updatedAt.toISOString(),
      revisions: record.revisions.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        createdAtLabel: r.createdAt.toLocaleString("fr-MA", {
          timeZone: "Africa/Casablanca",
        }),
      })),
    };
  if (!systemKey && id !== "nouveau") return null;
  return {
    id: undefined,
    key: group ?? (id === "site" ? "site" : ""),
    kind:
      id === "site" ? ("SETTINGS" as const) : group ? ("COPY" as const) : kind,
    title:
      id === "site" ? "Paramètres du site" : group ? `Textes · ${group}` : "",
    summary: "",
    body:
      id === "site"
        ? defaultSettings
        : group
          ? Object.fromEntries(
              copyGroups[group]!.map((item) => [item.value, item.value]),
            )
          : emptyPageBody,
    published: false,
    revision: 0,
    revisions: [],
  };
}
function parseBody(kind: ContentKind, key: string, body: unknown) {
  if (kind === "SETTINGS") {
    if (key !== "site") throw new CmsError("Paramètre inconnu.");
    return settingsSchema.parse(body);
  }
  if (kind === "COPY") {
    const defaults = copyGroups[key];
    if (!defaults) throw new CmsError("Groupe de textes inconnu.");
    const values = z
      .record(z.string().max(10000), z.string().max(20000))
      .parse(body);
    if (Object.keys(values).some((k) => !defaults.some((d) => d.value === k)))
      throw new CmsError("Champ de texte inconnu.");
    for (const item of defaults) {
      const value = values[item.value] ?? item.value;
      if (item.kind === "image") imagePath.parse(value);
      if (item.kind === "url") safeLink.parse(value);
    }
    return values;
  }
  slugSchema.parse(key);
  if (kind === "PAGE" && reservedSlugs.has(key))
    throw new CmsError("Ce lien est réservé à une page du site.");
  return pageBodySchema.parse(body);
}
function json(value: unknown) {
  return z.json().parse(value) as Prisma.InputJsonValue;
}
export async function saveEntry(input: EntryInput) {
  const session = await requireContentAdmin();
  const parsed = entryInputSchema.parse(input);
  const body = parseBody(parsed.kind, parsed.key, parsed.body);
  const key = `${parsed.kind.toLowerCase()}:${parsed.key}`;
  const snapshot = json({ title: parsed.title, summary: parsed.summary, body });
  return getDb().$transaction(async (tx) => {
    const existing = parsed.id
      ? await tx.contentEntry.findUnique({ where: { id: parsed.id } })
      : null;
    if (
      parsed.id &&
      (!existing ||
        existing.revision !== parsed.revision ||
        existing.kind !== parsed.kind)
    )
      throw new CmsError(
        "Ce contenu a changé. Rechargez la page avant de réessayer.",
      );
    if (!parsed.id && parsed.revision !== 0)
      throw new CmsError("Version invalide.");
    if (existing && existing.key !== key) {
      if (existing.kind === "COPY" || existing.kind === "SETTINGS")
        throw new CmsError(
          "Le lien de ce contenu système ne peut pas changer.",
        );
      if (existing.publishedAt)
        throw new CmsError(
          "Retirez d’abord la publication avant de modifier le lien de ce contenu.",
        );
    }
    const publication =
      parsed.intent === "publish"
        ? { published: snapshot, publishedAt: new Date() }
        : parsed.intent === "unpublish"
          ? { published: Prisma.DbNull, publishedAt: null }
          : {};
    const data = {
      key,
      kind: parsed.kind,
      title: parsed.title,
      summary: parsed.summary,
      body: json(body),
      ...publication,
    };
    let record;
    if (existing) {
      const updated = await tx.contentEntry.updateMany({
        where: { id: existing.id, revision: parsed.revision },
        data: { ...data, revision: { increment: 1 } },
      });
      if (updated.count !== 1)
        throw new CmsError(
          "Une autre modification vient d’être enregistrée. Rechargez la page.",
        );
      record = await tx.contentEntry.findUniqueOrThrow({
        where: { id: existing.id },
      });
    } else record = await tx.contentEntry.create({ data });
    await tx.contentRevision.create({
      data: { entryId: record.id, version: record.revision, snapshot },
    });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: `CONTENT_${parsed.intent.toUpperCase()}`,
        entityType: "ContentEntry",
        entityId: record.id,
        metadata: { revision: record.revision, key },
      },
    });
    return { id: record.id, revision: record.revision };
  });
}
export async function restoreEntry(id: string, version: number) {
  const session = await requireContentAdmin();
  z.string().max(100).parse(id);
  z.number().int().positive().parse(version);
  return getDb().$transaction(async (tx) => {
    const record = await tx.contentEntry.findUniqueOrThrow({ where: { id } });
    const revision = await tx.contentRevision.findUniqueOrThrow({
      where: { entryId_version: { entryId: id, version } },
    });
    const snapshot = snapshotSchema.parse(revision.snapshot);
    parseBody(
      record.kind,
      record.key.split(":").slice(1).join(":"),
      snapshot.body,
    );
    const updated = await tx.contentEntry.updateMany({
      where: { id, revision: record.revision },
      data: {
        title: snapshot.title,
        summary: snapshot.summary,
        body: json(snapshot.body),
        revision: { increment: 1 },
      },
    });
    if (updated.count !== 1)
      throw new CmsError("Le contenu a changé. Rechargez la page.");
    await tx.contentRevision.create({
      data: {
        entryId: id,
        version: record.revision + 1,
        snapshot: revision.snapshot as Prisma.InputJsonValue,
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "CONTENT_RESTORED",
        entityType: "ContentEntry",
        entityId: id,
        metadata: { version },
      },
    });
  });
}
export async function deleteEntry(id: string, revision: number) {
  const session = await requireContentAdmin();
  z.string().min(1).max(100).parse(id);
  z.number().int().positive().parse(revision);
  return getDb().$transaction(async (tx) => {
    const entry = await tx.contentEntry.findUniqueOrThrow({ where: { id } });
    if (entry.kind === "COPY" || entry.kind === "SETTINGS")
      throw new CmsError(
        "Ce contenu fait partie du site. Modifiez-le ou retirez sa publication.",
      );
    if (entry.publishedAt)
      throw new CmsError(
        "Retirez d’abord la publication avant de supprimer ce contenu.",
      );
    const result = await tx.contentEntry.deleteMany({
      where: { id, revision },
    });
    if (result.count !== 1)
      throw new CmsError("Le contenu a changé. Rechargez la page.");
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "CONTENT_DELETED",
        entityType: "ContentEntry",
        entityId: id,
      },
    });
  });
}
export async function getAdminOverview() {
  await requireContentAdmin();
  const db = getDb();
  const [pages, articles, products, media, quotes, activity] =
    await Promise.all([
      db.contentEntry.count({ where: { kind: "PAGE" } }),
      db.contentEntry.count({ where: { kind: "ARTICLE" } }),
      db.product.count(),
      db.mediaAsset.count(),
      db.quote.count(),
      db.auditLog.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        select: { id: true, action: true, entityType: true, createdAt: true },
      }),
    ]);
  return { pages, articles, products, media, quotes, activity };
}
export async function listAudit() {
  await requireContentAdmin();
  return getDb().auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      createdAt: true,
      actor: { select: { name: true } },
    },
  });
}
export async function getDraftPreview(id: string) {
  await requireContentAdmin();
  const entry = await getDb().contentEntry.findUnique({ where: { id } });
  if (!entry || !["PAGE", "ARTICLE"].includes(entry.kind)) return null;
  return {
    title: entry.title,
    summary: entry.summary,
    body: pageBodySchema.parse(entry.body),
  };
}
