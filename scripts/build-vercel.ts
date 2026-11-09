import "./load-env";
import { spawn } from "node:child_process";
import { isPresentationMode } from "../src/lib/deployment-mode";

async function main() {
  const presentation = isPresentationMode();
  console.log(
    presentation
      ? "Présentation client : contenu du PDF, sans base, compte ni envoi de formulaire."
      : "Production connectée : vérification de la configuration et migrations.",
  );
  const steps = [
    ...(!presentation ? [["scripts/check-production.mjs"]] : []),
    ["node_modules/prisma/build/index.js", "generate"],
    ...(!presentation
      ? [["node_modules/prisma/build/index.js", "migrate", "deploy"]]
      : []),
    ["node_modules/next/dist/bin/next", "build"],
  ];
  for (const args of steps) {
    await new Promise<void>((resolve, reject) => {
      const child = spawn(process.execPath, args, {
        stdio: "inherit",
        env: { ...process.env, NODE_ENV: "production" },
      });
      child.on("error", reject);
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(new Error("Étape de build échouée.")),
      );
    });
  }
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Build impossible.");
  process.exitCode = 1;
});
