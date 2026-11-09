import "../../../scripts/load-env";
import "server-only";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { getDb } from "../db";
class BootstrapError extends Error {}

// Entrée JSON sur stdin : aucun mot de passe dans les arguments ou les journaux.
async function main() {
  if (process.env.ALLOW_ADMIN_BOOTSTRAP !== "true")
    throw new BootstrapError(
      "Activation explicite ALLOW_ADMIN_BOOTSTRAP=true requise.",
    );
  let input = "";
  for await (const chunk of process.stdin) {
    input += String(chunk);
    if (input.length > 8192) throw new BootstrapError("Entrée trop longue.");
  }
  const parsed = z
    .object({
      name: z.string().trim().min(1).max(200),
      email: z
        .email()
        .max(254)
        .transform((value) => value.toLowerCase()),
      password: z.string().min(16).max(128),
    })
    .safeParse(JSON.parse(input));
  if (!parsed.success)
    throw new BootstrapError(
      "Fournissez nom, email et mot de passe de 16 à 128 caractères.",
    );
  const password = await hashPassword(parsed.data.password);
  const db = getDb();
  try {
    await db.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('sks:first-admin'))`;
      if (await tx.user.count({ where: { role: "ADMIN" } }))
        throw new BootstrapError(
          "Un administrateur existe déjà. Aucun compte modifié.",
        );
      if (await tx.user.findUnique({ where: { email: parsed.data.email } }))
        throw new BootstrapError(
          "Adresse déjà utilisée. Aucun compte modifié.",
        );
      const id = randomUUID();
      await tx.user.create({
        data: {
          id,
          name: parsed.data.name,
          email: parsed.data.email,
          role: "ADMIN",
          developmentOnly: process.env.NODE_ENV !== "production",
          accounts: {
            create: {
              id: randomUUID(),
              accountId: id,
              providerId: "credential",
              password,
            },
          },
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: id,
          action: "FIRST_ADMIN_CREATED",
          entityType: "User",
          entityId: id,
        },
      });
    });
    console.log(
      "Premier administrateur créé. Désactivez ALLOW_ADMIN_BOOTSTRAP.",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch((error) => {
  // Ne jamais imprimer une erreur SQL : elle peut contenir les valeurs saisies.
  console.error(
    error instanceof BootstrapError
      ? error.message
      : "Création refusée. Vérifiez la connexion et les migrations.",
  );
  process.exitCode = 1;
});
