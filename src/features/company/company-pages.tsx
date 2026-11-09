"use client";
import { ManagedImage as Image } from "@/components/managed-image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/features/cms/site-content";

import styles from "./company.module.css";

export function AboutContent() {
  const { t, settings } = useSiteContent("presentation");
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <header
        className={styles.header}
        style={{
          backgroundImage: `linear-gradient(90deg,#111315fa,#111315c9),url("${settings.siteMedia.catalog.src}")`,
        }}
      >
        <Container>
          <p>{t("QUI SOMMES-NOUS ?")}</p>
          <h1>{t("À propos de SKS PROJETS")}</h1>
          <span>
            {t("Spécialisée dans les solutions de coffrage et d’échafaudage")}
          </span>
        </Container>
      </header>
      <Container>
        <section
          className={styles.introduction}
          aria-labelledby="company-presentation"
        >
          <div>
            <p className={styles.kicker}>{t(settings.region)}</p>
            <h2 id="company-presentation">{t(settings.company.specialty)}</h2>
            <p>{t(settings.company.about)}</p>
            <strong>
              {t(
                "Un dirigeant bénéficiant de plus de 15 ans d’expérience dans le secteur du coffrage et du gros œuvre.",
              )}
            </strong>
          </div>
          <Image
            src={settings.siteMedia.companyAbout.src}
            alt={settings.siteMedia.companyAbout.alt}
            width={746}
            height={687}
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </section>
        <div className={styles.columns}>
          <section aria-labelledby="services">
            <p className={styles.kicker}>01</p>
            <h2 id="services">{t("Nos services")}</h2>
            <ul>
              {settings.company.services.map((text) => (
                <li key={text}>
                  <Check size={18} aria-hidden="true" />
                  {t(text)}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="expertise">
            <p className={styles.kicker}>02</p>
            <h2 id="expertise">{t("Nos expertises")}</h2>
            <ul>
              {settings.company.expertise.map((text) => (
                <li key={text}>
                  <Check size={18} aria-hidden="true" />
                  {t(text)}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <section className={styles.commitments} aria-labelledby="commitments">
          <p className={styles.kicker}>{t("Nos Engagements")}</p>
          <h2 id="commitments">{t("Pourquoi choisir SKS PROJETS ?")}</h2>
          <ul>
            {settings.company.commitments.map((text) => (
              <li key={text}>
                <Check size={18} aria-hidden="true" />
                {t(text)}
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.director} aria-labelledby="director">
          <p className={styles.kicker}>{t("MOT DU DIRECTEUR GÉNÉRAL")}</p>
          <h2 id="director">
            {t(
              "Ensemble, nous continuons de bâtir l’avenir, projet après projet.",
            )}
          </h2>
          <div>
            {settings.company.director.paragraphs.map((text) => (
              <p key={text}>{t(text)}</p>
            ))}
          </div>
          <strong>{t(settings.company.director.name)}</strong>
          <span>{t(settings.company.director.title)}</span>
        </section>
        <div className={styles.bottom}>
          <a
            href={settings.presentationPdf}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {t("Consulter la présentation originale (PDF)")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <Button asChild variant="accent">
            <Link href="/contact">
              {t("Contact")}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}

export function ProjectsContent() {
  const { t, settings } = useSiteContent("presentation");
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <header
        className={styles.header}
        style={{
          backgroundImage: `linear-gradient(90deg,#111315fa,#111315c9),url("${settings.siteMedia.catalog.src}")`,
        }}
      >
        <Container>
          <p>{t("Projets")}</p>
          <h1>{t(settings.company.projectTitle)}</h1>
          <span>{t(settings.company.productIntro)}</span>
        </Container>
      </header>
      <Container>
        <div className={styles.projectGrid}>
          {settings.company.projects.map((name, index) => (
            <article key={name}>
              <span>0{index + 1}</span>
              <h2>{t(name)}</h2>
              <Link href="/catalogue" className="text-link">
                {t("Nos produits")}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
        <div className={styles.bottom}>
          <a
            href={`${settings.presentationPdf}#page=18`}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {t("Présentation des domaines d’application · page 18 (PDF)")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <Button asChild variant="accent">
            <Link href="/contact">
              {t("Contact")}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
