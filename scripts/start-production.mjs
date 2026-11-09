import { spawn } from "node:child_process";
import { checkProduction } from "./check-production.mjs";
try {
  checkProduction();
  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start"],
    { stdio: "inherit", env: { ...process.env, NODE_ENV: "production" } },
  );
  for (const signal of ["SIGINT", "SIGTERM"])
    process.on(signal, () => child.kill(signal));
  child.on("exit", (code) => {
    process.exitCode = code ?? 1;
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
