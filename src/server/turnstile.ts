import { getTrustedAuthOrigins } from "@/lib/auth-origins";

export async function verifyLoginChallenge(request: Request): Promise<boolean> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!siteKey && !secret) return true;
  if (!siteKey || !secret) return false;
  const origins = getTrustedAuthOrigins(
    process.env.BETTER_AUTH_URL ?? "",
    process.env.NODE_ENV,
  );
  if (!origins.includes(request.headers.get("origin") ?? "")) return false;
  const token = request.headers.get("x-turnstile-token");
  if (!token || token.length > 2048) return false;
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      },
    );
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return (
      typeof result === "object" &&
      result !== null &&
      "success" in result &&
      result.success === true &&
      "action" in result &&
      result.action === "login" &&
      "hostname" in result &&
      typeof result.hostname === "string" &&
      origins.some((origin) => new URL(origin).hostname === result.hostname)
    );
  } catch {
    return false;
  }
}
