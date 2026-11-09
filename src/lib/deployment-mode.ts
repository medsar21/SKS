import deployment from "@/config/deployment.json";

export function isPresentationMode(
  env: Readonly<Record<string, string | undefined>> = process.env,
): boolean {
  const mode = env.SKS_SITE_MODE ?? deployment.mode;
  if (mode !== "presentation" && mode !== "production")
    throw new Error("SKS_SITE_MODE doit être presentation ou production.");
  return mode === "presentation";
}
