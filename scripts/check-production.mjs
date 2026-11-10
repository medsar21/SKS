import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd(), false);
export function checkProduction(env = process.env) {
  const errors = [];
  if (
    Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) !==
    Boolean(env.TURNSTILE_SECRET_KEY)
  )
    errors.push(
      "Turnstile : renseignez NEXT_PUBLIC_TURNSTILE_SITE_KEY et TURNSTILE_SECRET_KEY ensemble.",
    );
  try {
    const db = new URL(env.DATABASE_URL ?? "");
    if (
      !["postgres:", "postgresql:"].includes(db.protocol) ||
      !db.hostname ||
      !db.pathname.slice(1)
    )
      throw Error();
  } catch {
    errors.push("DATABASE_URL PostgreSQL valide requise.");
  }
  try {
    const origin = new URL(env.BETTER_AUTH_URL ?? "");
    if (
      origin.protocol !== "https:" ||
      origin.username ||
      origin.password ||
      origin.pathname !== "/" ||
      origin.search ||
      origin.hash
    )
      throw Error();
  } catch {
    errors.push("BETTER_AUTH_URL doit être l’origine HTTPS du site.");
  }
  if (
    !env.BETTER_AUTH_SECRET ||
    env.BETTER_AUTH_SECRET.length < 32 ||
    /change|example|remplacer/i.test(env.BETTER_AUTH_SECRET)
  )
    errors.push(
      "BETTER_AUTH_SECRET aléatoire de 32 caractères minimum requis.",
    );
  if (env.SKS_CATALOGUE_SOURCE !== "prisma")
    errors.push("SKS_CATALOGUE_SOURCE=prisma requis.");
  for (const key of [
    "ALLOW_DEMO_SEED",
    "ALLOW_DEV_SETUP",
    "ALLOW_ADMIN_BOOTSTRAP",
  ]) {
    if (env[key] === "true")
      errors.push(`${key} doit être désactivé pour le serveur public.`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
}
if (process.argv[1]?.replaceAll("\\", "/").endsWith("/check-production.mjs")) {
  try {
    checkProduction();
    console.log("Configuration de production valide.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
