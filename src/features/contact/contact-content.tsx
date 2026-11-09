"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { QuoteDraft } from "@/features/catalog/quote-draft";
import type { CatalogProduct } from "@/features/catalog/types";
import { useSiteContent } from "@/features/cms/site-content";
import styles from "./contact.module.css";

export function ContactContent({
  product,
  products,
  requested,
  available,
}: {
  product?: CatalogProduct;
  products: CatalogProduct[];
  requested: boolean;
  available: boolean;
}) {
  const { t, settings } = useSiteContent("contact");
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <header className={styles.header}>
        <Container>
          <Link href="/catalogue">
            <ArrowLeft size={14} aria-hidden="true" />
            {t("Retour au catalogue")}
          </Link>
          <p>{t("VOTRE PROJET · SKS PROJETS")}</p>
          <h1>{t("Demander un devis")}</h1>
          <span>
            {t(
              "Décrivez votre besoin. Renseignez vos coordonnées et les informations de votre chantier.",
            )}
          </span>
        </Container>
      </header>
      <Container className={styles.layout}>
        <div className={styles.formColumn}>
          {requested && !product && (
            <p className={styles.notice} role="status">
              {t(
                "Cette référence est introuvable. Choisissez un produit dans le formulaire.",
              )}
            </p>
          )}
          <QuoteDraft
            product={product}
            products={products}
            available={available}
          />
        </div>
        <aside
          className={styles.sidebar}
          aria-label={t("Votre sélection et nos coordonnées")}
        >
          {product && (
            <section className={styles.selection}>
              <p className={styles.kicker}>{t("VOTRE SÉLECTION")}</p>
              {product.images[0] && (
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  width={330}
                  height={230}
                  sizes="(max-width:800px) 100vw, 330px"
                />
              )}
              <span>{product.category.name}</span>
              <h2>{product.name}</h2>
              <Link href={`/catalogue/${product.slug}`}>
                {t("Consulter la fiche produit")} →
              </Link>
            </section>
          )}
          <section className={styles.contact}>
            <p className={styles.kicker}>{t("UNE QUESTION ?")}</p>
            <h2>{t("Parlons de votre chantier.")}</h2>
            <p>
              {t(
                "Vente, location et assistance technique au Maroc et en Afrique.",
              )}
            </p>
            <address>
              {settings.email && (
                <a href={`mailto:${settings.email}`}>
                  <Mail size={16} aria-hidden="true" />
                  {settings.email}
                </a>
              )}
              {[settings.phone, settings.phoneSecondary]
                .filter(Boolean)
                .map((phone) => (
                  <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} key={phone}>
                    <Phone size={16} aria-hidden="true" />
                    {phone}
                  </a>
                ))}
              {settings.address && (
                <div>
                  <MapPin size={16} aria-hidden="true" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.website && (
                <a href={settings.website} target="_blank" rel="noreferrer">
                  {settings.website.replace(/^https:\/\//, "")}
                </a>
              )}
            </address>
          </section>
          <div className={styles.reminder}>
            <Check size={18} aria-hidden="true" />
            <p>
              {t(
                "Les tarifs et disponibilités seront à confirmer après étude de votre besoin.",
              )}
            </p>
          </div>
        </aside>
      </Container>
    </main>
  );
}
