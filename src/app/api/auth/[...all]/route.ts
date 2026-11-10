import { toNextJsHandler } from "better-auth/next-js";
import { getAuth, isAuthConfigured } from "@/server/auth";
import { verifyLoginChallenge } from "@/server/turnstile";

async function handle(request: Request) {
  if (!isAuthConfigured())
    return Response.json(
      { error: "Service d'authentification non configuré." },
      { status: 503 },
    );
  if (
    request.method === "POST" &&
    new URL(request.url).pathname.replace(/\/$/, "") ===
      "/api/auth/sign-in/email" &&
    !(await verifyLoginChallenge(request))
  )
    return Response.json(
      {
        code: "TURNSTILE_FAILED",
        error: "Vérification anti-robot requise. Réessayez.",
      },
      { status: 403 },
    );
  const handlers = toNextJsHandler(getAuth());
  return request.method === "GET"
    ? handlers.GET(request)
    : handlers.POST(request);
}
export { handle as GET, handle as POST };
