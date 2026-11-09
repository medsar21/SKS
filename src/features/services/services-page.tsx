"use client";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
  ClipboardList,
  Headphones,
} from "lucide-react";
import { ManagedImage as Image } from "@/components/managed-image";
import { Container } from "@/components/ui/container";
import { useSiteContent } from "@/features/cms/site-content";
import home from "@/features/home/home-page.module.css";
import styles from "./services-page.module.css";

export function ServicesPage() {
  const { settings, t } = useSiteContent("home");
  return (
    <main id="main" tabIndex={-1} className={home.home}>
      <header className={styles.header}>
        <Container>
          <p>{t("NOS SERVICES")}</p>
          <h1>{settings.pageSeo.services.title}</h1>
          <span>{settings.pageSeo.services.description}</span>
        </Container>
      </header>
      <section className={home.services} aria-labelledby="services-title">
        <Container>
          <div className={home.sectionHead}>
            <div>
              <h2 id="services-title">
                {t("Un accompagnement complet")}
                <br />
                {t("pour vos chantiers")}
              </h2>
            </div>
            <p>
              {t(
                "Vente de matériel, location de matériel, assistance technique et accompagnement chantier.",
              )}
            </p>
          </div>
          <div className={home.serviceGrid}>
            {settings.homeJourneys.map((service, index) => {
              const Icon = [ShoppingCart, ClipboardList, Headphones][
                index % 3
              ]!;
              return (
                <article
                  id={service.id}
                  key={service.id}
                  className={home.serviceCard}
                >
                  <div className={home.serviceMedia}>
                    <Image
                      src={service.image.src}
                      alt={service.image.alt || service.title}
                      width={650}
                      height={400}
                      sizes="(max-width:640px) 100vw, 33vw"
                    />
                    <span>
                      <Icon size={26} aria-hidden="true" />
                    </span>
                  </div>
                  <div className={home.serviceBody}>
                    <h3>{t(service.title)}</h3>
                    <p>{t(service.text)}</p>
                    <Link
                      href={service.href}
                      aria-label={`${t("Nous contacter")} : ${t(service.title)}`}
                    >
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
