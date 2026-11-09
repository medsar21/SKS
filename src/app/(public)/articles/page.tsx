import {getSiteContent} from "@/server/cms-service";
import Link from "next/link";
import Image from "next/image";
import { getPublishedArticles } from "@/server/cms-service";
export const metadata = { title: "Articles" };
export default async function ArticlesPage() {
const {copy}=await getSiteContent();const t=(value:string)=>copy[`autres:${value}`]??value;

  const articles = await getPublishedArticles();
  return (
    <main className="container py-16" id="main" tabIndex={-1}>
      <p className="eyebrow">{t("SKS PROJETS · PUBLICATIONS")}</p>
      <h1 className="mb-8">{t("Articles")}</h1>
      <div className="cms-card-grid">
        {articles.map((article) => (
          <Link
            href={`/articles/${article.slug}`}
            key={article.slug}
            className="cms-panel cms-feature-card"
          >
            {article.body.cover && (
              <Image
                className="cms-entry-image"
                src={article.body.cover}
                alt={article.body.coverAlt}
                width={650}
                height={400}
              />
            )}
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <span className="text-link">{t("Lire l’article →")}</span>
          </Link>
        ))}
      </div>
      {!articles.length && (
        <p className="cms-empty">{t("Aucun article publié pour le moment.")}</p>
      )}
    </main>
  );
}
