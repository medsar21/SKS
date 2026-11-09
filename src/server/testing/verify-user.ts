import "../../../scripts/load-env";
import "server-only";
import { verifyPassword } from "better-auth/crypto";
import { z } from "zod";
import { assertDevelopmentDatabase } from "@/lib/development-policy";
import { getDb } from "@/server/db";

async function main() {
  assertDevelopmentDatabase(process.env);
  const email = z
    .string()
    .regex(/^demo-user-e2e-[a-z0-9-]+@example\.invalid$/)
    .parse(process.env.USER_E2E_EMAIL);
  const mode = z.enum(["verify", "absent", "cleanup"]).parse(process.argv[2]);
  const db = getDb();
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        developmentOnly: true,
        accounts: {
          where: { providerId: "credential" },
          select: { password: true },
        },
      },
    });
    if (mode === "absent") {
      if (user) throw new Error("Une création interdite a eu lieu.");
    } else if (mode === "cleanup") {
      if (user) {
        if (!user.developmentOnly)
          throw new Error("Compte hors développement.");
        await db.$transaction(async (tx) => {
          await tx.user.delete({ where: { id: user.id } });
          await tx.auditLog.create({
            data: {
              actorId: process.env.DEV_ADMIN_ID,
              action: "USER_TEST_ACCOUNT_REMOVED",
              entityType: "User",
              entityId: user.id,
              metadata: { developmentOnly: true, testFixture: true },
            },
          });
        });
      }
    } else {
      const password = process.env.USER_E2E_PASSWORD;
      if (
        !user?.developmentOnly ||
        !password ||
        user.role !== process.env.USER_E2E_ROLE
      )
        throw new Error("Compte de test incohérent.");
      const hash = user.accounts[0]?.password;
      if (
        !hash ||
        hash === password ||
        !(await verifyPassword({ hash, password }))
      )
        throw new Error("Hachage non vérifié.");
      const audit = await db.auditLog.findFirst({
        where: {
          entityType: "User",
          entityId: user.id,
          action: "USER_CREATED",
          actorId: process.env.DEV_ADMIN_ID,
        },
        select: { metadata: true },
      });
      if (
        !audit ||
        JSON.stringify(audit.metadata).includes(password) ||
        JSON.stringify(audit.metadata).includes(email)
      )
        throw new Error("Audit non vérifié.");
    }
    console.log(
      "Vérification du compte de test terminée ; aucune donnée affichée.",
    );
  } finally {
    await db.$disconnect();
  }
}

main().catch(() => {
  console.error(
    "Vérification des utilisateurs non aboutie. Détails sensibles masqués.",
  );
  process.exitCode = 1;
});
