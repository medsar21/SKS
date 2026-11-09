import "server-only";
import { z } from "zod";
import sharp from "sharp";
import { getDb } from "./db";
import { CmsError, requireContentAdmin } from "./cms-service";
import { MAX_MEDIA_BYTES, MAX_MEDIA_LABEL } from "@/features/cms/media-limits";

export async function listMedia() {
  await requireContentAdmin();
  return getDb().mediaAsset.findMany({
    select: {
      id: true,
      name: true,
      alt: true,
      mimeType: true,
      size: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
export async function getPublicMedia(id: string) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id) || !process.env.DATABASE_URL)
    return null;
  return getDb().mediaAsset.findUnique({ where: { id } });
}
export async function uploadMediaRecord(data: FormData) {
  const session = await requireContentAdmin();
  const file = data.get("file");
  const alt = z.string().trim().min(1).max(500).parse(data.get("alt"));
  if (!(file instanceof File) || !file.size || file.size > MAX_MEDIA_BYTES)
    throw new CmsError(
      `Choisissez une image ou un PDF de ${MAX_MEDIA_LABEL} maximum.`,
    );
  let buffer = Buffer.from(await file.arrayBuffer());
  let mimeType: string;
  if (
    file.type === "application/pdf" &&
    buffer.subarray(0, 5).toString() === "%PDF-"
  )
    mimeType = "application/pdf";
  else {
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
        "image/gif",
      ].includes(file.type)
    )
      throw new CmsError(
        "Formats autorisés : JPEG, PNG, WebP, AVIF, GIF et PDF.",
      );
    try {
      buffer = await sharp(buffer, { limitInputPixels: 40000000 })
        .rotate()
        .resize({
          width: 2400,
          height: 2400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 88 })
        .toBuffer();
    } catch {
      throw new CmsError("Cette image est invalide ou trop grande.");
    }
    mimeType = "image/webp";
  }
  if (buffer.length > MAX_MEDIA_BYTES)
    throw new CmsError(
      `L’image optimisée dépasse ${MAX_MEDIA_LABEL}. Réduisez ses dimensions.`,
    );
  const name = z
    .string()
    .min(1)
    .max(200)
    .parse(file.name.replace(/[^\p{L}\p{N} ._-]/gu, "_").slice(0, 200));
  return getDb().$transaction(async (tx) => {
    const media = await tx.mediaAsset.create({
      data: {
        name,
        alt,
        mimeType,
        size: buffer.length,
        data: new Uint8Array(buffer),
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "MEDIA_UPLOADED",
        entityType: "MediaAsset",
        entityId: media.id,
        metadata: { mimeType, size: buffer.length },
      },
    });
    return { id: media.id };
  });
}
export async function updateMediaRecord(id: string, alt: string) {
  const session = await requireContentAdmin();
  z.string().min(1).max(100).parse(id);
  z.string().trim().min(1).max(500).parse(alt);
  await getDb().$transaction(async (tx) => {
    await tx.mediaAsset.update({ where: { id }, data: { alt } });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "MEDIA_UPDATED",
        entityType: "MediaAsset",
        entityId: id,
      },
    });
  });
}
export async function deleteMediaRecord(id: string) {
  const session = await requireContentAdmin();
  z.string().min(1).max(100).parse(id);
  await getDb().$transaction(
    async (tx) => {
      const url = `/media/${id}`;
      const [entries, products, history, categories] = await Promise.all([
        tx.contentEntry.findMany({ select: { body: true, published: true } }),
        tx.product.findMany({ select: { details: true } }),
        tx.contentRevision.findMany({ select: { snapshot: true } }),
        tx.category.findMany({ select: { image: true } }),
      ]);
      if (
        [...entries, ...products, ...history, ...categories].some((value) =>
          JSON.stringify(value).includes(url),
        )
      )
        throw new CmsError(
          "Ce média est utilisé dans un contenu, un produit ou son historique. Conservez-le pour éviter les images cassées.",
        );
      await tx.mediaAsset.delete({ where: { id } });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "MEDIA_DELETED",
          entityType: "MediaAsset",
          entityId: id,
        },
      });
    },
    { isolationLevel: "Serializable" },
  );
}
