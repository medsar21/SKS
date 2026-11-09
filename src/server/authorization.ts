import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { canAccessAdmin } from "@/lib/permissions";
import { getAuth, isAuthConfigured } from "@/server/auth";
import { getDb } from "@/server/db";
import { isDevelopmentAccountAllowed } from "@/lib/development-policy";

export async function requireSession() {
  if (!isAuthConfigured()) redirect("/connexion?configuration=requise");
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion");
  // Relire les droits en base : une révocation vaut aussi pour une session existante.
  const user = await getDb().user.findUnique({
    where: { id: session.user.id },
    select: { role: true, developmentOnly: true },
  });
  if (
    !user ||
    !isDevelopmentAccountAllowed(user.developmentOnly, process.env.NODE_ENV)
  )
    redirect("/connexion");
  return { ...session, user: { ...session.user, role: user.role } };
}
export async function requireAdmin() {
  const session = await requireSession();
  if (!canAccessAdmin(session.user.role)) redirect("/espace-client");
  return session;
}
