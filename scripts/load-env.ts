import nextEnv from "@next/env";

// Même priorité .env.local/.env que Next ; aucune valeur n'est journalisée.
nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production", {
  info: () => undefined,
  error: () => {
    throw new Error("Chargement de la configuration locale impossible.");
  },
});
