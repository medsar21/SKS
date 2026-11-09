import Link from "next/link";
import { requireContentAdmin } from "@/server/cms-service";
import { copyGroups } from "@/features/cms/copy-defaults";
const descriptions: Record<string, { title: string; description: string }> = {
  presentation: {
    title: "Présentation SKS PROJETS",
    description:
      "À propos, services, expertises, engagements, mot du directeur et domaines d’application issus du document fourni.",
  },
  autres: {
    title: "Autres pages et connexion",
    description:
      "Présentation du formulaire de devis, liste des articles, connexion et espace client.",
  },
  home: {
    title: "Page d’accueil",
    description:
      "Bannière, présentation, solutions, vente et location, avantages, appels à l’action et contact.",
  },
  catalogue: {
    title: "Catalogue et fiches produit",
    description:
      "Titres, filtres, boutons, galerie et informations des fiches.",
  },
  contact: {
    title: "Contact et préparation du projet",
    description: "Présentation, étapes, brouillon de consultation et liens.",
  },
  formulaires: {
    title: "Formulaire de devis",
    description: "Libellés et textes d’aide du formulaire de demande.",
  },
};
export default async function TextsPage() {
  await requireContentAdmin();
  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">ÉDITER LE SITE EXISTANT</p>
          <h1>Textes, images et liens</h1>
          <p className="muted">
            Modifiez le contenu du design actuel, champ par champ.
          </p>
        </div>
        <Link href="/" className="cms-secondary">
          Voir le site ↗
        </Link>
      </div>
      <div className="cms-card-grid">
        {Object.entries(copyGroups).map(([key, fields]) => (
          <Link
            href={`/admin/edition/copy-${key}`}
            key={key}
            className="cms-panel cms-feature-card"
          >
            <span className="cms-badge">{fields.length} champs</span>
            <h2>{descriptions[key]?.title ?? key}</h2>
            <p>{descriptions[key]?.description}</p>
            <span className="text-link">Modifier le contenu →</span>
          </Link>
        ))}
      </div>
      <p className="cms-notice">
        Le logo, les couleurs, les menus, les coordonnées, le pied de page et
        l’ordre des sections se modifient dans{" "}
        <Link className="text-link" href="/admin/edition/site">
          Paramètres du site
        </Link>
        .
      </p>
    </>
  );
}
