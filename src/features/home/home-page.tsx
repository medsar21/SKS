"use client";
import { ManagedImage as Image } from "@/components/managed-image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardList,
  Headphones,
  Layers3,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/features/catalog/product-card";
import { HomeSections, useSiteContent } from "@/features/cms/site-content";

import type { CatalogProduct } from "@/features/catalog/types";
import styles from "./home-page.module.css";
import { ReferenceMarquee } from "@/features/references/reference-marquee";

const valueIcons = [ShieldCheck, Layers3, Truck, Headphones];
export function HomePage({ products }: { products: CatalogProduct[] }) {
  const { t, settings } = useSiteContent("home");
  const categories = [
    ...new Map(
      products.map((product) => [
        product.category.slug,
        {
          ...product.category,
          image: product.category.image || product.images[0]?.src || "",
          imageAlt:
            product.category.imageAlt ||
            product.images[0]?.alt ||
            product.category.name,
        },
      ]),
    ).values(),
  ];
  return (
    <main id="main" tabIndex={-1} className={styles.home}>
      <HomeSections>
        <section
          id="hero"
          className={`hero ${styles.hero}`}
          aria-labelledby="hero-title"
        >
          <Image
            src={t(settings.siteMedia.hero.src)}
            alt={t(settings.siteMedia.hero.alt)}
            fill
            sizes="100vw"
            preload
            className={styles.heroImage}
          />
          <Container className={styles.heroContent}>
            <p className={styles.eyebrow}>
              {t("COFFRAGE · ÉTAIEMENT · ÉCHAFAUDAGE")}
            </p>
            <h1 id="hero-title">
              {t("DES SOLUTIONS")}
              <br />
              <span>{t("DE CONSTRUCTION")}</span>
              <small>{t("FIABLES ET PERFORMANTES")}</small>
            </h1>
            <p className={styles.heroDescription}>
              {t(
                "Vente, location et assistance technique d’équipements pour tous vos projets de construction au Maroc et en Afrique.",
              )}
            </p>
            <div className={styles.actions}>
              <Button asChild variant="accent">
                <Link href="/catalogue">
                  {t("Découvrir nos produits")}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" className={styles.secondary}>
                <Link href="/services">{t("Nos services")}</Link>
              </Button>
            </div>
            <span className={styles.sourceLabel}>
              {t("Visuel de la présentation SKS PROJETS")}
            </span>
          </Container>
        </section>
        <section
          id="notice"
          className={styles.values}
          aria-label={t("Les engagements SKS PROJETS")}
        >
          <Container className={styles.valueGrid}>
            {settings.homeBenefits.map(({ title, text }, index) => {
              const Icon = valueIcons[index % valueIcons.length]!;
              return (
                <div className={styles.value} key={title}>
                  <Icon aria-hidden="true" size={29} strokeWidth={1.4} />
                  <div>
                    <h2>{t(title)}</h2>
                    <p>{t(text)}</p>
                  </div>
                </div>
              );
            })}
          </Container>
        </section>
        <ReferenceMarquee id="references" />
        <section
          id="equipements"
          className={styles.categories}
          aria-labelledby="equipment-title"
        >
          <Container>
            <Reveal>
              <div className={styles.sectionHead}>
                <div>
                  <p className={styles.eyebrow}>{t("NOS PRODUITS")}</p>
                  <h2 id="equipment-title">
                    {t(`${categories.length} catégories d’équipements`)}
                    <br />
                    {t("pour les besoins du BTP")}
                  </h2>
                </div>
                <Button asChild variant="outline">
                  <Link href="/catalogue">
                    {t("Voir le catalogue complet")}
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className={styles.categoryGrid}>
                {categories.map((category) => (
                  <Link
                    className={styles.categoryCard}
                    href={`/catalogue?categorie=${category.slug}`}
                    key={category.slug}
                  >
                    <Image
                      src={category.image}
                      alt={category.imageAlt}
                      width={400}
                      height={300}
                      sizes="(max-width:640px) 50vw, 17vw"
                    />
                    <div>
                      <h3>{t(category.name)}</h3>
                      <ArrowRight size={17} aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
        <section
          id="presentation"
          className={styles.about}
          aria-labelledby="about-title"
        >
          <Container className={styles.aboutGrid}>
            <div className={styles.aboutMedia}>
              <Image
                src={settings.siteMedia.homeAbout.src}
                alt={t(settings.siteMedia.homeAbout.alt)}
                width={650}
                height={480}
                sizes="(max-width:640px) 100vw, 50vw"
              />
            </div>
            <div className={styles.aboutCopy}>
              <p className={styles.eyebrow}>{t("À PROPOS DE SKS PROJETS")}</p>
              <h2 id="about-title">
                {t("Un partenaire de confiance")}
                <br />
                {t("dans le secteur du BTP")}
              </h2>
              <p>{t(settings.company.about)}</p>
              <Button asChild variant="accent">
                <Link href="/a-propos">
                  {t("Découvrir l’entreprise")}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>
        <section
          id="solutions"
          className={styles.services}
          aria-label={t("Sélection d’équipements")}
        >
          <Container>
            <p className={styles.eyebrow}>
              {settings.homeSolutions.map((value) => t(value)).join(" · ")}
            </p>
            <div className="category-grid">
              {products.slice(0, 3).map((product) => (
                <ProductCard
                  key={product.sku}
                  product={product}
                  detailed
                  headingLevel={3}
                />
              ))}
            </div>
          </Container>
        </section>
        <section
          id="approche"
          className={styles.services}
          aria-label={t("Nos engagements")}
        >
          <Container>
            <ul className={styles.commitments}>
              {settings.company.commitments.map((value) => (
                <li key={value}>
                  <Check size={17} aria-hidden="true" />
                  {t(value)}
                </li>
              ))}
            </ul>
          </Container>
        </section>
        <section
          id="devis"
          className={`project-cta ${styles.consultation}`}
          aria-labelledby="consultation-title"
        >
          <Container>
            <ClipboardList size={38} strokeWidth={1.5} aria-hidden="true" />
            <h2 id="consultation-title">
              {t("Vous avez un projet ?")}
              <br />
              {t("Demandez une consultation.")}
            </h2>
            <p>
              {t(
                "Notre équipe vous accompagne pour identifier la solution adaptée.",
              )}
            </p>
            <Button asChild>
              <Link href="/contact">
                {t("Faire une demande")}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Button>
          </Container>
        </section>
        <section id="contact" className={styles.contact}>
          <Container>
            <p>{t(settings.company.specialty)}</p>
            <Link href={settings.cta.href}>
              {t(settings.cta.label)}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Container>
        </section>
      </HomeSections>
    </main>
  );
}
