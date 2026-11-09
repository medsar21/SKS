import "server-only";
import { isPresentationMode } from "@/lib/deployment-mode";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getDb } from "@/server/db";
import { isDevelopmentAccountAllowed } from "@/lib/development-policy";
import { getTrustedAuthOrigins } from "@/lib/auth-origins";

export function isAuthConfigured(): boolean {
  if (isPresentationMode()) return false;
  return Boolean(
    process.env.DATABASE_URL &&
    process.env.BETTER_AUTH_URL &&
    process.env.BETTER_AUTH_SECRET &&
    process.env.BETTER_AUTH_SECRET.length >= 32,
  );
}

let instance: ReturnType<typeof createAuth> | undefined;
function createAuth() {
  if (!isAuthConfigured()) throw new Error("Authentification non configurée");
  return betterAuth({
    database: prismaAdapter(getDb(), { provider: "postgresql" }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: getTrustedAuthOrigins(
      process.env.BETTER_AUTH_URL!,
      process.env.NODE_ENV,
    ),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
    },
    user: {
      additionalFields: {
        role: { type: "string", defaultValue: "CUSTOMER", input: false },
        developmentOnly: { type: "boolean", defaultValue: false, input: false },
      },
    },
    session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 60 },
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
            const user = await getDb().user.findUnique({
              where: { id: session.userId },
              select: { developmentOnly: true },
            });
            if (
              !user ||
              !isDevelopmentAccountAllowed(
                user.developmentOnly,
                process.env.NODE_ENV,
              )
            )
              return false;
          },
        },
      },
    },
    advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 30,
      customRules: { "/sign-in/email": { window: 60, max: 5 } },
    },
  });
}
export function getAuth() {
  return (instance ??= createAuth());
}
