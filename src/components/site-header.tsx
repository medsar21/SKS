"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo, DEFAULT_LOGO } from "@/components/brand-logo";
import { useSiteContent } from "@/features/cms/site-content";
import { Container } from "@/components/ui/container";
import { SiteNavigation } from "@/components/site-navigation";
export function Brand({ onDark = false }: { onDark?: boolean }) {
  const { settings } = useSiteContent();
  return (
    <Link
      href="/"
      className="brand"
      aria-label={`${settings.brand} ${settings.brandSub}, accueil`}
    >
      <BrandLogo
        src={(onDark && settings.logoDark) || settings.logo || DEFAULT_LOGO}
        alt={`${settings.brand} ${settings.brandSub}`}
        onDark={onDark && !settings.logoDark}
      />
    </Link>
  );
}
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header
      className="site-header"
      data-overlay={pathname === "/"}
      data-scrolled={scrolled}
    >
      <Container className="header-content">
        <Brand onDark />
        <SiteNavigation />
      </Container>
    </header>
  );
}
