import { getSiteContent } from "@/server/cms-service";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuoteForm } from "@/features/quotes/quote-form";
import { getCatalog } from "@/server/catalog-service";

export const metadata = { title: "Demande de devis B2B" };
export const dynamic = "force-dynamic";
export default async function QuoteRequestPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { copy } = await getSiteContent();
  const t = (value: string) => copy[`autres:${value}`] ?? value;

  const { produit } = await searchParams;
  const { products, mode } = await getCatalog();
  return (
    <Container asChild>
      <main id="main" tabIndex={-1} className="pb-20">
        <SectionHeading
          className="page-intro"
          level={1}
          eyebrow={t("VOTRE PROJET B2B")}
          title={t("Demander un devis")}
          description={t(
            "Vente ou location : précisez les équipements et les besoins de votre chantier.",
          )}
        />
        <QuoteForm
          products={products.map(({ sku, slug, name, isDemo }) => ({
            sku,
            slug,
            name,
            isDemo,
          }))}
          selectedSlug={typeof produit === "string" ? produit : undefined}
          available={Boolean(process.env.DATABASE_URL) && mode === "prisma"}
        />
      </main>
    </Container>
  );
}
