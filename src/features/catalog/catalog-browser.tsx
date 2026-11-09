"use client";
import { useSiteContent } from "@/features/cms/site-content";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./product-card";
import { catalogCategories } from "./demo-catalog";
import { defaultQuery, queryCatalog, type CatalogQuery } from "./query";
import type { CatalogSource } from "./types";
import { Button } from "@/components/ui/button";
import styles from "./catalog.module.css";

export function CatalogBrowser({
  source,
  initialQuery,
}: {
  source: CatalogSource;
  initialQuery: CatalogQuery;
}) {
  const { t } = useSiteContent("catalogue");

  const [query, setQuery] = useState(initialQuery);
  const result = useMemo(
    () => queryCatalog(source.products, query),
    [source.products, query],
  );
  const categories = [
    ...new Map(
      [
        ...(source.mode === "demo" ? catalogCategories : []),
        ...source.products.map((p) => p.category),
      ].map((c) => [c.slug, c]),
    ).values(),
  ];
  const usages = [
    ...new Set(source.products.flatMap((p) => (p.usage ? [p.usage] : []))),
  ];
  const update = (changes: Partial<CatalogQuery>) =>
    setQuery((current) => ({ ...current, page: 1, ...changes }));
  return (
    <div className={styles.browser}>
      <aside className={styles.filters} aria-label={t("Filtres du catalogue")}>
        <div className={styles.filterTitle}>
          <SlidersHorizontal size={17} aria-hidden="true" />
          <h2>{t("Affiner la sélection")}</h2>
        </div>
        <label htmlFor="category">{t("Catégorie")}</label>
        <select
          id="category"
          value={query.categorie}
          onChange={(e) => update({ categorie: e.target.value })}
        >
          <option value="tous">{t("Toutes les catégories")}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
          {!categories.some((c) => c.slug === query.categorie) &&
            query.categorie !== "tous" && (
              <option value={query.categorie}>{t("Catégorie inconnue")}</option>
            )}
        </select>
        <label htmlFor="usage">{t("Utilisation")}</label>
        <select
          id="usage"
          value={query.utilisation}
          onChange={(e) => update({ utilisation: e.target.value })}
        >
          <option value="tous">{t("Toutes les utilisations")}</option>
          {usages.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
          <option value="non-renseignee">{t("Utilisation à préciser")}</option>
          {query.utilisation !== "tous" &&
            query.utilisation !== "non-renseignee" &&
            !usages.includes(query.utilisation) && (
              <option value={query.utilisation}>
                {t("Utilisation inconnue")}
              </option>
            )}
        </select>
        <label htmlFor="data">{t("Données disponibles")}</label>
        <select
          id="data"
          value={query.donnees}
          onChange={(e) =>
            update({ donnees: e.target.value as CatalogQuery["donnees"] })
          }
        >
          <option value="tous">{t("Toutes les fiches")}</option>
          <option value="technique">{t("Caractéristiques renseignées")}</option>
          <option value="documents">{t("Documents PDF disponibles")}</option>
          <option value="incompletes">
            {t("Caractéristiques à compléter")}
          </option>
        </select>
        <p className="muted">
          {t(
            "Ces filtres concernent les informations des fiches. Ils n’indiquent aucun stock.",
          )}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuery(defaultQuery)}
        >
          {t("Réinitialiser")}
        </Button>
        <div className={styles.advice}>
          <span className="mini-label">{t("BIEN PRÉPARER SON PROJET")}</span>
          <p>
            {t("Dimensions, quantités, contraintes : chaque détail compte.")}
          </p>
          <a className="text-link" href={t("/contact")}>
            {t("Préparer mon besoin →")}
          </a>
        </div>
      </aside>
      <section
        aria-label={t("Résultats du catalogue")}
        className={styles.results}
      >
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Search size={20} aria-hidden="true" />
            <label htmlFor="search" className="sr-only">
              {t("Rechercher un produit")}
            </label>
            <input
              id="search"
              type="search"
              maxLength={160}
              placeholder={t("Nom, famille ou référence…")}
              value={query.q}
              onChange={(e) => update({ q: e.target.value })}
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="sort">
              {t("Trier les produits")}
            </label>
            <select
              id="sort"
              value={query.tri}
              onChange={(e) =>
                update({ tri: e.target.value as CatalogQuery["tri"] })
              }
            >
              <option value="reference">{t("Référence")}</option>
              <option value="az">{t("Nom : A à Z")}</option>
              <option value="za">{t("Nom : Z à A")}</option>
            </select>
          </div>
        </div>
        <p className={styles.count} role="status" aria-live="polite">
          {result.total} {t("référence")}
          {result.total > 1 ? "s" : ""}
          {source.mode === "demo" ? t(" de démonstration") : ""} {t("· Page")}{" "}
          {result.page} {t("sur ")}
          {result.pages}
        </p>
        {result.total ? (
          <div className={styles.grid}>
            {result.products.map((p) => (
              <ProductCard key={p.sku} product={p} detailed />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <Search size={32} aria-hidden="true" />
            <h2>{t("Aucune référence trouvée.")}</h2>
            <p>{t("Essayez un autre mot-clé ou élargissez vos filtres.")}</p>
            <Button variant="outline" onClick={() => setQuery(defaultQuery)}>
              {t("Effacer les filtres")}
            </Button>
          </div>
        )}
        {result.pages > 1 && (
          <nav
            className={styles.pagination}
            aria-label={t("Pagination du catalogue")}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={result.page === 1}
              onClick={() => update({ page: result.page - 1 })}
            >
              {t("Précédent")}
            </Button>
            {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={result.page === p ? "default" : "outline"}
                aria-label={`Page ${p}`}
                aria-current={result.page === p ? "page" : undefined}
                onClick={() => update({ page: p })}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={result.page === result.pages}
              onClick={() => update({ page: result.page + 1 })}
            >
              {t("Suivant")}
            </Button>
          </nav>
        )}
      </section>
    </div>
  );
}
