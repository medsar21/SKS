import {getSiteContent} from "@/server/cms-service";
import Link from "next/link";
import { requireSession } from "@/server/authorization";
import { getMyCustomer } from "@/server/customer-service";
import { canAccessAdmin } from "@/lib/permissions";
export default async function CustomerPage() {
const {copy}=await getSiteContent();const t=(value:string)=>copy[`autres:${value}`]??value;

  const session = await requireSession();
  const customer = await getMyCustomer();
  return (
    <>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="eyebrow text-primary">{t("VOTRE ESPACE PROFESSIONNEL")}</p>
          <h1 className="!text-4xl !tracking-tight">
            {t("Bienvenue, ")}{session.user.name}.
          </h1>
        </div>
      </div>
      {canAccessAdmin(session.user.role) && (
        <Link className="text-link my-6" href="/admin">
          {t("Accéder à l’administration ↗")}</Link>
      )}
      <div className="panel mt-5">
        <h2 className="text-2xl">
          {customer?.companyName ?? "Votre compte professionnel"}
        </h2>
        <p className="muted mt-4">
          {customer
            ? `${customer._count.quotes} devis et ${customer._count.orders} commande(s) associés à votre entreprise.`
            : "Votre compte n’est pas encore rattaché à une entreprise. Contactez votre administrateur."}
        </p>
        <p className="muted mt-3">
          {t("La consultation détaillée des documents sera disponible à la prochaine étape.")}</p>
      </div>
    </>
  );
}
