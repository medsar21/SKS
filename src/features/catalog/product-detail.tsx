"use client";
import { useSiteContent } from "@/features/cms/site-content";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "./product-gallery";
import type { CatalogProduct } from "./types";
import styles from "./catalog.module.css";
export function ProductDetail({ product }: { product: CatalogProduct }) {
  const { t } = useSiteContent("catalogue");
  const originalSheet =
    product.documents.find((doc) => doc.href.endsWith("#page=14")) ??
    product.documents[0];

  return (
    <Container asChild>
      <main id="main" tabIndex={-1} className={styles.detail}>
        <Link className="text-link mb-8" href={t("/catalogue")}>
          <ArrowLeft size={16} aria-hidden="true" />
          {t("Retour au catalogue")}
        </Link>
        <div className={styles.detailGrid}>
          <ProductGallery product={product} />
          <div className={styles.detailCopy}>
            <p className="eyebrow">{product.category.name}</p>
            {product.isDemo && (
              <span className="demo-badge">{t("Démonstration")}</span>
            )}
            <h1>{product.name}</h1>
            <p className="mini-label">
              {product.sourcePage
                ? `Document SKS PROJETS · page ${product.sourcePage}`
                : `${t("RÉF. ")}${product.sku}`}
            </p>
            <p className="muted mt-6">{product.description}</p>
            <section className="panel" aria-labelledby="specs">
              <p className="mini-label mb-4">{t("01 / LA TECHNIQUE")}</p>
              <h2 id="specs">{t("Caractéristiques techniques")}</h2>
              <p className="muted my-5">
                {t(
                  "Les données non renseignées nécessitent une validation avant toute utilisation.",
                )}
              </p>
              {product.specifications.length ? (
                <dl className={styles.specifications}>
                  {product.specifications.map((spec) => (
                    <div key={spec.label}>
                      <dt>{spec.label}</dt>
                      <dd>
                        {spec.value === null
                          ? t("Non renseigné")
                          : `${spec.value}${spec.unit ? ` ${spec.unit}` : ""}`}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="muted">
                  {t("Aucune caractéristique technique validée disponible.")}
                </p>
              )}
            </section>
            <dl className={styles.summary}>
              <div>
                <dt>{t("Utilisation")}</dt>
                <dd>{product.usage ?? "À préciser"}</dd>
              </div>
              <div>
                <dt>{t("Tarif")}</dt>
                <dd>
                  {product.price
                    ? new Intl.NumberFormat("fr-MA", {
                        style: "currency",
                        currency: "MAD",
                      }).format(Number(product.price))
                    : t("Non renseigné")}
                </dd>
              </div>
              <div>
                <dt>{t("Disponibilité")}</dt>
                <dd>{product.availability || t("Non vérifiée")}</dd>
              </div>
            </dl>
            <Button asChild variant="accent">
              <Link
                href={`${product.sourcePage ? "/contact" : "/demande-de-devis"}?produit=${encodeURIComponent(product.slug)}`}
              >
                {t("Demander un devis")}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </Button>
            <p className="muted mt-3">
              {t("Précisez les quantités et les besoins de votre chantier.")}
            </p>
          </div>
        </div>
        <div className={styles.infoGrid}>
          {!!product.advantages?.length && (
            <section className="panel" aria-labelledby="advantages">
              <h2 id="advantages">{t("Les avantages")}</h2>
              <ul className="my-5 list-disc space-y-3 ps-5 text-sm">
                {product.advantages.map((advantage) => (
                  <li key={advantage}>{advantage}</li>
                ))}
              </ul>
            </section>
          )}
          {product.technicalSheet?.src && (
            <section className="panel" aria-labelledby="original-specs">
              <h2 id="original-specs">{t("Fiche technique des étais")}</h2>
              <p className="muted my-4">{product.technicalNote}</p>
              {originalSheet && (
                <a
                  href={originalSheet.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  {t("Consulter la fiche originale (PDF)")}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
              <Image
                className="mt-5 w-full"
                src={product.technicalSheet!.src}
                alt={product.technicalSheet!.alt}
                width={1440}
                height={810}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
            </section>
          )}

          <section className="panel" aria-labelledby="documents">
            <p className="mini-label mb-4">{t("02 / LA DOCUMENTATION")}</p>
            <h2 id="documents">{t("Documents PDF")}</h2>
            {product.documents.length ? (
              product.documents.map((doc) => (
                <a
                  className="text-link mt-5"
                  key={doc.href}
                  href={doc.href}
                  download={!product.sourcePage}
                  target={product.sourcePage ? "_blank" : undefined}
                  rel={product.sourcePage ? "noreferrer" : undefined}
                >
                  <Download size={18} aria-hidden="true" />
                  {doc.label} {t("(PDF)")}
                </a>
              ))
            ) : (
              <p className="muted mt-5">
                {t(
                  "Aucun document PDF validé disponible pour cette référence.",
                )}
              </p>
            )}
          </section>
        </div>
      </main>
    </Container>
  );
}
