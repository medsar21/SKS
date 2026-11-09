import { getDb } from "@/server/db";
import { isPresentationMode } from "@/lib/deployment-mode";
export const dynamic = "force-dynamic";
export async function GET() {
  if (isPresentationMode())
    return Response.json(
      { status: "ready", mode: "presentation", database: "disabled" },
      { headers: { "Cache-Control": "no-store" } },
    );
  try {
    const db = getDb();
    await db.$queryRaw`SELECT 1`;
    await db.category.findFirst({ select: { image: true } });
    const settings = await db.contentEntry.findUnique({
      where: { key: "settings:site" },
      select: { publishedAt: true },
    });
    return Response.json(
      {
        status: settings?.publishedAt ? "ready" : "setup-required",
        mode: "production",
      },
      {
        status: settings?.publishedAt ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return Response.json(
      { status: "unavailable", mode: "production" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
