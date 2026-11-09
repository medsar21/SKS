import { requireAdmin } from "@/server/authorization";
import Link from "next/link";
import { getAdminOverview } from "@/server/cms-service";
import { SiteInitialization } from "@/features/cms/site-initialization";
import {
  FileText,
  Newspaper,
  Package,
  ImageIcon,
  ArrowUpRight,
} from "lucide-react";
export default async function AdminPage() {
  const session = await requireAdmin();
  if (session.user.role !== "ADMIN")
    return (
      <>
        <h1>Vue d’ensemble</h1>
        <p className="muted">Espace commercial</p>
        <Link className="cms-primary" href="/admin/devis">
          Gérer les demandes de devis
        </Link>
      </>
    );
  const stats = await getAdminOverview();
  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">SKS PROJETS · ADMINISTRATION</p>
          <h1>Vue d’ensemble</h1>
          <p className="muted">
            Pilotez votre contenu et votre catalogue depuis un seul espace.
          </p>
        </div>
        <Link className="cms-secondary" href="/">
          Voir le site <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="cms-stat-grid">
        {[
          {
            label: "Pages",
            count: stats.pages,
            href: "/admin/pages",
            Icon: FileText,
          },
          {
            label: "Articles",
            count: stats.articles,
            href: "/admin/articles",
            Icon: Newspaper,
          },
          {
            label: "Produits",
            count: stats.products,
            href: "/admin/produits",
            Icon: Package,
          },
          {
            label: "Médias",
            count: stats.media,
            href: "/admin/medias",
            Icon: ImageIcon,
          },
        ].map(({ label, count, href, Icon }) => (
          <Link className="cms-stat" href={href} key={label}>
            <Icon size={21} />
            <strong>{count}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </div>
      <SiteInitialization />
      <div className="cms-card-grid">
        <div className="cms-panel">
          <p className="eyebrow">COMMENCER À MODIFIER</p>
          <h2>Votre site, vos contenus.</h2>
          <p className="muted my-4">
            Personnalisez les textes et visuels du site, rédigez des articles et
            organisez votre catalogue. Les brouillons vous permettent de
            préparer vos changements.
          </p>
          <div className="cms-quick-links">
            <Link href="/admin/utilisateurs">
              Ajouter et consulter les utilisateurs <span>↗</span>
            </Link>
            <Link href="/admin/edition/copy-home">
              Modifier la page d’accueil <span>↗</span>
            </Link>
            <Link href="/admin/edition/site">
              Logo, couleurs, menus et coordonnées <span>↗</span>
            </Link>
            <Link href="/admin/edition/nouveau?type=ARTICLE">
              Rédiger un article <span>↗</span>
            </Link>
            <Link href="/admin/produits/nouveau">
              Ajouter un produit <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="cms-panel">
          <p className="eyebrow">DEMANDES & ACTIVITÉ</p>
          <h2>{stats.quotes} demande(s) de devis</h2>
          <Link className="text-link my-4 inline-flex" href="/admin/devis">
            Consulter les demandes →
          </Link>
          <h3 className="mt-6">Dernières opérations</h3>
          <ul className="cms-activity">
            {stats.activity.map((a) => (
              <li key={a.id}>
                <span>
                  {a.action.replaceAll("_", " ").toLocaleLowerCase("fr")}
                </span>
                <small>
                  {a.createdAt.toLocaleDateString("fr-MA", {
                    timeZone: "Africa/Casablanca",
                  })}
                </small>
              </li>
            ))}
          </ul>
          <Link className="text-link" href="/admin/historique">
            Tout le journal →
          </Link>
        </div>
      </div>
    </>
  );
}
