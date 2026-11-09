import "server-only";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { requireSession } from "@/server/authorization";
import { getDb } from "@/server/db";
import { isDevelopmentAccountAllowed } from "@/lib/development-policy";
import { createUserSchema, userPageSchema } from "@/features/users/validation";

export class UserManagementError extends Error {}

export async function requireUserAdministrator() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN")
    redirect("/admin?acces=utilisateurs-refuse");
  return session;
}

export async function listManagedUsers(pageInput: unknown = 1) {
  await requireUserAdministrator();
  const requestedPage = userPageSchema.parse(pageInput);
  const db = getDb();
  const pageSize = 25;
  const total = await db.user.count();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pages);
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      developmentOnly: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: pageSize,
    skip: (page - 1) * pageSize,
  });
  return { users, page, pages, total };
}

export async function createManagedUser(input: unknown) {
  const session = await requireUserAdministrator();
  const values = createUserSchema.parse(input);
  const password = await hashPassword(values.password);
  const developmentOnly = process.env.NODE_ENV !== "production";
  try {
    return await getDb().$transaction(async (tx) => {
      // Recheck permissions after hashing, immediately before the write.
      const actor = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, developmentOnly: true },
      });
      if (
        actor?.role !== "ADMIN" ||
        !isDevelopmentAccountAllowed(
          actor.developmentOnly,
          process.env.NODE_ENV,
        )
      )
        throw new UserManagementError(
          "Vos droits ont changé. Actualisez la page avant de réessayer.",
        );
      const id = randomUUID();
      await tx.user.create({
        data: {
          id,
          name: values.name,
          email: values.email,
          role: values.role,
          developmentOnly,
          accounts: {
            create: {
              id: randomUUID(),
              accountId: id,
              providerId: "credential",
              password,
            },
          },
        },
        select: { id: true },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "USER_CREATED",
          entityType: "User",
          entityId: id,
          metadata: { role: values.role, developmentOnly },
        },
      });
      return { id };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      throw new UserManagementError("Cette adresse email est déjà utilisée.");
    throw error;
  }
}
