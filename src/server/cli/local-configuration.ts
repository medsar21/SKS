import "server-only";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { parse } from "dotenv";
import { z } from "zod";

const identitySchema = z.object({
  id: z.uuid(),
  email: z.email().endsWith("@example.invalid"),
  password: z.string().min(32).max(128),
});

export function prepareDevelopmentConfiguration() {
  const file = resolve(".env.local");
  // Ne jamais créer de secrets dans un chemin que Git suivrait.
  execFileSync(
    "git",
    [
      "-c",
      `safe.directory=${process.cwd()}`,
      "check-ignore",
      "-q",
      "--",
      ".env.local",
    ],
    { stdio: "ignore" },
  );
  const content = existsSync(file) ? readFileSync(file, "utf8") : "";
  const local = parse(content);
  const changes: Record<string, string> = {};
  function value(key: string, generate: () => string) {
    const existing = process.env[key] || local[key];
    if (existing) return existing;
    const generated = generate();
    changes[key] = generated;
    return generated;
  }
  function identity(kind: "ADMIN" | "CUSTOMER") {
    const prefix = kind === "ADMIN" ? "QUOTE_E2E" : "QUOTE_E2E_CUSTOMER";
    const keys = [`DEV_${kind}_ID`, `${prefix}_EMAIL`, `${prefix}_PASSWORD`];
    const existing = keys.filter((key) => process.env[key] || local[key]);
    if (existing.length && existing.length !== keys.length)
      throw new Error(
        "Identité de test partielle : conserver ou retirer ensemble ses trois variables locales, sans toucher à un compte existant.",
      );
    return identitySchema.parse({
      id: value(keys[0]!, randomUUID),
      email: value(
        keys[1]!,
        () => `demo-${kind.toLowerCase()}-${randomUUID()}@example.invalid`,
      ),
      password: value(keys[2]!, () => randomBytes(48).toString("base64url")),
    });
  }
  const admin = identity("ADMIN");
  const customer = identity("CUSTOMER");
  const secret = value("BETTER_AUTH_SECRET", () =>
    randomBytes(48).toString("hex"),
  );
  if (secret.length < 32)
    throw new Error("BETTER_AUTH_SECRET trop court (valeur masquée).");
  const origin = value("BETTER_AUTH_URL", () => "http://127.0.0.1:3000");
  if (new URL(origin).origin !== "http://127.0.0.1:3000")
    throw new Error(
      "Pour les tests locaux, utiliser BETTER_AUTH_URL=http://127.0.0.1:3000.",
    );
  const slug = value(
    "QUOTE_E2E_PRODUCT_SLUG",
    () => `demo-mission06-${randomUUID()}`,
  );
  changes.QUOTE_E2E = "true";
  changes.SKS_CATALOGUE_SOURCE = "prisma";
  // Créer le fichier et restreindre ses droits AVANT d’y écrire des secrets.
  if (!existsSync(file)) writeFileSync(file, "", { flag: "wx", mode: 0o600 });
  if (process.platform === "win32") {
    const identity = execFileSync("whoami", [], { encoding: "utf8" }).trim();
    execFileSync(
      "icacls",
      [file, "/inheritance:r", "/grant:r", `${identity}:(F)`, "*S-1-5-18:(F)"],
      { stdio: "ignore" },
    );
  }
  const output = Object.entries(changes)
    .map(([key, entry]) => {
      if (/[\r\n$]/.test(entry))
        throw new Error("Valeur locale non sérialisable (contenu masqué).");
      return `${key}=${JSON.stringify(entry)}`;
    })
    .join("\n");
  writeFileSync(file, `${content.trimEnd()}\n${output}\n`, { mode: 0o600 });
  return { admin, customer, slug };
}
