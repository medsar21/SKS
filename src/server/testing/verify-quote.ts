// Vérification PostgreSQL réelle pour Playwright, uniquement sur base de test autorisée.
import "../../../scripts/load-env";
import { getDb } from "../db";

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.QUOTE_E2E !== "true")
    throw new Error("Test non autorisé");
  const reference = process.argv[2];
  if (!reference?.startsWith("SKS-")) throw new Error("Référence requise");
  const db = getDb();
  const expectedStatus =
    process.argv[3] === "requested" ? "REQUESTED" : "SUBMITTED";
  try {
    const quote = await db.quote.findUnique({
      where: { reference },
      include: { lines: true },
    });
    if (
      !quote ||
      quote.status !== expectedStatus ||
      !quote.isDemo ||
      quote.companyName !== "Société de démonstration Playwright" ||
      quote.lines.length !== 1 ||
      !quote.lines[0]?.quantity.equals(12)
    )
      throw new Error("Persistance non vérifiée");
    const audit = await db.auditLog.count({
      where: {
        entityId: quote.id,
        entityType: "Quote",
        action: "QUOTE_SUBMITTED",
      },
    });
    if (audit !== 1) throw new Error("Audit non vérifié");
    if (expectedStatus === "REQUESTED") {
      const changes = await db.auditLog.findMany({
        where: {
          entityId: quote.id,
          entityType: "Quote",
          action: "QUOTE_STATUS_CHANGED",
        },
        select: { metadata: true, actorId: true },
      });
      const entry = changes[0];
      const metadata = entry?.metadata;
      if (
        changes.length !== 1 ||
        !entry?.actorId ||
        (process.env.DEV_ADMIN_ID &&
          entry.actorId !== process.env.DEV_ADMIN_ID) ||
        !metadata ||
        typeof metadata !== "object" ||
        Array.isArray(metadata) ||
        metadata.from !== "SUBMITTED" ||
        metadata.to !== "REQUESTED"
      )
        throw new Error("Historique de changement de statut non vérifié");
    }
    console.log("Persistance PostgreSQL et audit vérifiés.");
  } finally {
    await db.$disconnect();
  }
}
main().catch(() => {
  console.error("Échec de vérification PostgreSQL (aucune donnée affichée).");
  process.exitCode = 1;
});
