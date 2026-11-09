import "../../../scripts/load-env";
import "server-only";
import { statfsSync } from "node:fs";
import { createConnection } from "node:net";
import { getDb } from "../db";
import { isAuthConfigured } from "../auth";

async function portOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    const finish = (open: boolean) => {
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(1500);
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
    socket.once("timeout", () => finish(false));
  });
}

async function main() {
  const disk = statfsSync(process.cwd());
  console.log(
    JSON.stringify({
      postgres5440Reachable: await portOpen(5440),
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      authConfigured: isAuthConfigured(),
      postgresEnvironmentKeys: [
        "PGHOST",
        "PGPORT",
        "PGUSER",
        "PGDATABASE",
        "PGPASSWORD",
        "PGPASSFILE",
      ].filter((key) => Boolean(process.env[key])),
      freeDiskMiB: Math.floor((disk.bavail * disk.bsize) / 1048576),
    }),
  );
  if (!process.env.DATABASE_URL)
    throw new Error(
      "DATABASE_URL absente : renseigner une connexion PostgreSQL autorisée dans .env.local. Aucun mot de passe n’est deviné.",
    );
  const db = getDb();
  try {
    await db.$queryRaw`SELECT 1`;
    console.log("Connexion PostgreSQL : vérifiée.");
    const tables = await db.$queryRaw<
      { present: string | null }[]
    >`SELECT to_regclass('public._prisma_migrations')::text AS present`;
    if (tables[0]?.present) {
      const rows = await db.$queryRaw<
        { pending: bigint }[]
      >`SELECT count(*) AS pending FROM "_prisma_migrations" WHERE finished_at IS NULL AND rolled_back_at IS NULL`;
      console.log(
        JSON.stringify({ unfinishedMigrations: Number(rows[0]?.pending ?? 0) }),
      );
    } else
      console.log(
        "Historique Prisma absent : vérifier la base avant db:deploy, sans reset ni baselining automatique.",
      );
    // Vérification d'écriture réversible, aucune donnée personnelle ou sortie de base.
    await db.$transaction(async (tx) => {
      await tx.$executeRaw`CREATE TEMP TABLE sks_write_probe (value integer NOT NULL) ON COMMIT DROP`;
      await tx.$executeRaw`INSERT INTO sks_write_probe (value) VALUES (1)`;
      const rows = await tx.$queryRaw<
        { value: number }[]
      >`SELECT value FROM sks_write_probe`;
      if (rows[0]?.value !== 1)
        throw new Error("Écriture de diagnostic non vérifiée.");
    });
    console.log(
      "Écriture PostgreSQL temporaire : vérifiée (ne prouve pas la persistance d’un devis).",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch((error: unknown) => {
  console.error(
    !process.env.DATABASE_URL && error instanceof Error
      ? error.message
      : "Diagnostic PostgreSQL non abouti : vérifier les accès, les migrations et l’espace disque. Détails sensibles masqués.",
  );
  process.exitCode = 1;
});
