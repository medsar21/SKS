import { checkProduction } from "./check-production.mjs";
try {
  checkProduction();
  await import("../server.js");
} catch {
  console.error("Démarrage refusé : vérifiez la configuration de production.");
  process.exitCode = 1;
}
