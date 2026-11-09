"use client";

import Link from "next/link";
import { ArrowUpRight, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useSiteContent } from "@/features/cms/site-content";
import { Brand } from "@/components/site-header";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  const { settings, t } = useSiteContent("autres");
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div className="footer-identity">
            <Brand onDark />
            <p className="footer-description">{settings.footerText}</p>
            {settings.region && (
              <span className="footer-region">
                <MapPin size={14} aria-hidden="true" />
                {settings.region}
              </span>
            )}
          </div>
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="footer-heading">
              {t("Découvrir")}
            </h2>
            <ul className="footer-links">
              {settings.navigation.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-useful">
            <h2 id="footer-useful" className="footer-heading">
              {t("Liens utiles")}
            </h2>
            <ul className="footer-links">
              {settings.footerLinks.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-project">
            <span className="footer-project-label">
              {t("VOTRE PROCHAIN PROJET")}
            </span>
            <h2>{t("Vente • Location • Assistance Technique")}</h2>
            <Link href={settings.cta.href} className="footer-cta">
              {settings.cta.label}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        {(settings.email || settings.phone || settings.address) && (
          <address className="footer-contact">
            {settings.email && (
              <a href={`mailto:${settings.email}`}>
                <Mail size={15} aria-hidden="true" />
                {settings.email}
              </a>
            )}
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>
                <Phone size={15} aria-hidden="true" />
                {settings.phone}
              </a>
            )}
            {settings.phoneSecondary && (
              <a href={`tel:${settings.phoneSecondary.replace(/[^+\d]/g, "")}`}>
                <Phone size={15} aria-hidden="true" />
                {settings.phoneSecondary}
              </a>
            )}
            {settings.website && (
              <a href={settings.website} target="_blank" rel="noreferrer">
                <Globe size={15} aria-hidden="true" />
                {settings.website.replace(/^https:\/\//, "")}
              </a>
            )}
            {settings.address && (
              <span>
                <MapPin size={15} aria-hidden="true" />
                {settings.address}
              </span>
            )}
          </address>
        )}
        <div className="footer-bottom">
          <span>{settings.copyright}</span>
        </div>
      </Container>
    </footer>
  );
}
