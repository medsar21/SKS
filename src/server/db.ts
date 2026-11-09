import "server-only";
import { isPresentationMode } from "@/lib/deployment-mode";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalDb = globalThis as unknown as { sksPrisma?: PrismaClient };

export function getDb(): PrismaClient {
  if (isPresentationMode())
    throw new Error("La base est désactivée en mode présentation.");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL non configurée");
  const client =
    globalDb.sksPrisma ??
    new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5000,
        max: process.env.VERCEL === "1" ? 3 : 10,
        idleTimeoutMillis: 20_000,
      }),
    });
  globalDb.sksPrisma = client;
  return client;
}
