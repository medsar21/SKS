import { getSiteContent } from "@/server/cms-service";
import Link from "next/link";
import { Brand } from "@/components/site-header";
import { LoginForm } from "@/features/auth/login-form";
import { isAuthConfigured } from "@/server/auth";
export const dynamic = "force-dynamic";
export const metadata = { title: "Connexion professionnelle" };
export default async function LoginPage() {
  const { copy } = await getSiteContent();
  const t = (value: string) => copy[`autres:${value}`] ?? value;

  const configured = isAuthConfigured();
  return (
    <main
      id="main"
      className="login-page container flex min-h-screen flex-col items-center justify-center gap-8 py-12"
    >
      <Brand />
      <div className="panel w-full max-w-md">
        <p className="eyebrow text-primary">{t("ESPACE PROFESSIONNEL")}</p>
        <h1 className="!mb-4 !text-3xl !tracking-tight">
          {t("Ravi de vous retrouver.")}
        </h1>
        <p className="muted mb-7">
          {t("Accès réservé aux comptes autorisés par SKS PROJETS.")}
        </p>
        {!configured && (
          <div
            role="status"
            className="mb-6 border border-orange-200 bg-orange-50 p-4 text-xs leading-6 text-orange-900"
          >
            {t(
              "Authentification non configurée. PostgreSQL et un secret local sont nécessaires. Aucun compte de démonstration ni accès automatique n’est fourni.",
            )}
          </div>
        )}
        <LoginForm configured={configured} />
      </div>
      <Link href="/" className="text-link">
        {t("← Retour au site")}
      </Link>
    </main>
  );
}
