import { getDb } from "@/server/db";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const db = getDb();
    await db.$queryRaw`SELECT 1`;
    await db.category.findFirst({ select: { image: true } });
    const settings = await db.contentEntry.findUnique({
      where: { key: "settings:site" },
      select: { publishedAt: true },
    });
    return Response.json(
      { status: settings?.publishedAt ? "ready" : "setup-required" },
      {
        status: settings?.publishedAt ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
