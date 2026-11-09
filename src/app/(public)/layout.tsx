import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "@/components/public-design.css";
import { getSiteContent } from "@/server/cms-service";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const { settings } = await getSiteContent();
  return {
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.brand} ${settings.brandSub}`,
    },
    description: settings.seoDescription,
  };
}
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
