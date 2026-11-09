import { getPublicMedia } from "@/server/media-service";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const media = await getPublicMedia((await params).id);
  if (!media) return new Response("Média introuvable", { status: 404 });
  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mimeType,
      "Content-Length": String(media.size),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      ...(media.mimeType === "application/pdf"
        ? {
            "Content-Disposition": `attachment; filename="document-${media.id}.pdf"`,
          }
        : {}),
    },
  });
}
