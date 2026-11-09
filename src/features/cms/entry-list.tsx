import Link from "next/link";
import { listEntries } from "@/server/cms-service";
import { formatDate } from "@/lib/i18n";
import { articleDrafts } from "./article-drafts";
export async function EntryList({ kind }: { kind: "PAGE" | "ARTICLE" }) {
  const entries = await listEntries(kind);
  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">PUBLICATIONS & BROUILLONS</p>
          <h1>{kind === "ARTICLE" ? "Articles" : "Pages"}</h1>
          <p className="muted">
            {kind === "PAGE"
              ? "Créez des pages libres. Les pages existantes du site se modifient dans « Textes du site »."
              : "Rédigez vos articles et gérez leur publication."}
          </p>
        </div>
        <Link
          href={`/admin/edition/nouveau?type=${kind}`}
          className="cms-primary"
        >
          + {kind === "ARTICLE" ? "Nouvel article" : "Nouvelle page"}
        </Link>
      </div>
      {kind === "ARTICLE" && (
        <section
          className="cms-panel mb-6"
          aria-labelledby="article-drafts-title"
        >
          <h2 id="article-drafts-title">Propositions d’articles</h2>
          <p className="muted">
            Contenus de démonstration à relire. Ouvrez une proposition puis
            enregistrez-la en brouillon ; aucune publication automatique.
          </p>
          <div className="cms-card-grid mt-4">
            {articleDrafts.map((article) => (
              <div className="cms-panel" key={article.slug}>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <Link
                  className="text-link"
                  href={`/admin/edition/nouveau?type=ARTICLE&proposition=${article.slug}`}
                >
                  Préparer cet article →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="cms-table-wrap">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Lien</th>
              <th>Publication</th>
              <th>Modifié le</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <strong>{entry.title}</strong>
                  <small>Version {entry.revision}</small>
                </td>
                <td>
                  /{kind === "ARTICLE" ? "articles/" : ""}
                  {entry.key.split(":").slice(1).join(":")}
                </td>
                <td>
                  <span
                    className={`cms-badge ${entry.publishedAt ? "is-live" : ""}`}
                  >
                    {entry.publishedAt ? "Version publiée" : "Brouillon"}
                  </span>
                </td>
                <td>{formatDate(entry.updatedAt)}</td>
                <td>
                  <Link
                    className="text-link"
                    href={`/admin/edition/${entry.id}`}
                  >
                    Modifier →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!entries.length && (
          <p className="cms-empty">
            Aucun contenu pour le moment. Créez votre{" "}
            {kind === "ARTICLE" ? "premier article" : "première page"}.
          </p>
        )}
      </div>
    </>
  );
}
