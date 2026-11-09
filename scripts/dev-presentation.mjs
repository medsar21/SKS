import { spawn } from "node:child_process";
import { createRequire } from "node:module";

// Aperçu local du contenu fourni, sans connexion à une base ni modification de .env.
const require = createRequire(import.meta.url);
const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      SKS_SITE_MODE: "presentation",
      DATABASE_URL: "",
      SKS_CATALOGUE_SOURCE: "document",
    },
  },
);
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
