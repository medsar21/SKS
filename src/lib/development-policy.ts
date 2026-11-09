export function isDevelopmentAccountAllowed(
  developmentOnly: boolean,
  nodeEnv: string | undefined,
): boolean {
  return !developmentOnly || nodeEnv !== "production";
}

export function assertDevelopmentDatabase(
  env: Readonly<Record<string, string | undefined>>,
): URL {
  if (env.NODE_ENV === "production" || env.ALLOW_DEV_SETUP !== "true")
    throw new Error(
      "Provisionnement réservé au développement explicitement autorisé (ALLOW_DEV_SETUP=true).",
    );
  if (!env.DATABASE_URL)
    throw new Error("DATABASE_URL manque dans .env.local.");
  let url: URL;
  try {
    url = new URL(env.DATABASE_URL);
  } catch {
    throw new Error("DATABASE_URL invalide (valeur non affichée).");
  }
  const database = decodeURIComponent(url.pathname.slice(1));
  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    !database ||
    ["postgres", "template0", "template1"].includes(database) ||
    database !== env.SKS_DEV_DATABASE
  )
    throw new Error(
      "Base PostgreSQL locale dédiée requise ; SKS_DEV_DATABASE doit confirmer son nom exact.",
    );
  return url;
}
