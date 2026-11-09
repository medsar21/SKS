import { toNextJsHandler } from "better-auth/next-js";
import { getAuth, isAuthConfigured } from "@/server/auth";

async function handle(request: Request) {
  if (!isAuthConfigured())
    return Response.json(
      { error: "Service d'authentification non configuré." },
      { status: 503 },
    );
  const handlers = toNextJsHandler(getAuth());
  return request.method === "GET"
    ? handlers.GET(request)
    : handlers.POST(request);
}
export { handle as GET, handle as POST };
