"use client";
import { useSiteContent } from "@/features/cms/site-content";
import { Container } from "@/components/ui/container";
import { CatalogBrowser } from "./catalog-browser";
import type { CatalogQuery } from "./query";
import type { CatalogSource } from "./types";
import Link from "next/link";
import styles from "./catalog.module.css";
export function CatalogPage({
  source,
  query,
}: {
  source: CatalogSource;
  query: CatalogQuery;
}) {
  const { t, settings } = useSiteContent("catalogue");

  return (
    <main id="main" tabIndex={-1} className={styles.catalog}>
      <div
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(90deg,#111315fa 0%,#111315d9 48%,#11131530),url("${settings.siteMedia.catalog.src}")`,
        }}
      >
        <Container>
          <p className={styles.breadcrumb}>
            <Link href="/">{t("Accueil")}</Link> / {t("Produits")}
          </p>
          <div className={styles.heroRow}>
            <div>
              <p className="eyebrow">
                <span className="status-dot" />
                {t("LE CATALOGUE PROFESSIONNEL")}
              </p>
              <h1>
                {source.mode === "document" ? (
                  t("Notre catalogue produits")
                ) : (
                  <>
                    {t("La précision commence")}
                    <br />
                    {t("par le bon ")}
                    <span>{t("équipement.")}</span>
                  </>
                )}
              </h1>
            </div>
            <p className={styles.heroDescription}>
              {t(
                source.mode === "document"
                  ? `${source.products.length} équipements répartis en ${new Set(source.products.map((product) => product.category.slug)).size} catégories pour vos projets de construction.`
                  : "Explorez les familles de coffrage métallique et préparez une consultation adaptée à votre chantier.",
              )}
            </p>
          </div>
          <div className={styles.families}>
            {[
              ...new Set(
                source.products.map((product) => product.category.name),
              ),
            ].map((name) => (
              <span key={name}>{t(name)}</span>
            ))}
          </div>
        </Container>
      </div>
      <Container>
        <p className={styles.notice}>
          {source.mode === "demo"
            ? t(
                "CATALOGUE DE DÉMONSTRATION — Références et illustrations indicatives. Aucune caractéristique technique, aucun tarif ni stock confirmés.",
              )
            : source.mode === "document"
              ? t(
                  "Produits et données issus de la présentation fournie par SKS PROJETS. Les repères PDF indiquent les pages du document, pas des références commerciales. Tarifs et disponibilités non indiqués dans le document.",
                )
              : t(
                  "Tarifs et disponibilités à confirmer. Les illustrations génériques ne constituent pas des photos produit.",
                )}
        </p>
        <CatalogBrowser
          key={JSON.stringify(query)}
          source={source}
          initialQuery={query}
        />
      </Container>
    </main>
  );
}
