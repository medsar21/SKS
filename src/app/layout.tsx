import type { Metadata } from "next";
import { getSiteContent } from "@/server/cms-service";
import { SiteContentProvider } from "@/features/cms/site-content";
import { BrandIntro } from "@/components/brand-intro";
import "./globals.css";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    title: {
      default: "SKS PROJETS — Coffrage, étaiement et échafaudage",
      template: "%s | SKS PROJETS",
    },
    description:
      "Expert en solutions de coffrage, d’étaiement et d’échafaudage. Vente, location et assistance technique. SKS PROJETS | Maroc | Afrique.",
    robots: {
      index: settings.indexSearchEngines,
      follow: settings.indexSearchEngines,
    },
  };
}
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  return (
    <html
      lang={content.settings.locale}
      dir={content.settings.locale === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
    >
      <body>
        <SiteContentProvider {...content}>
          <BrandIntro />
          <a href="#main" className="skip-link">
            Aller au contenu
          </a>
          {children}
        </SiteContentProvider>
      </body>
    </html>
  );
}
