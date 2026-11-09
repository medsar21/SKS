import { pageSeo } from "@/server/page-seo";
import { ContactContent } from "@/features/contact/contact-content";
import { getCatalog } from "@/server/catalog-service";
export const generateMetadata = () => pageSeo("contact");
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { produit } = await searchParams;
  const { products, mode } = await getCatalog();
  const product =
    typeof produit === "string"
      ? products.find((item) => item.slug === produit)
      : undefined;
  return (
    <ContactContent
      product={product}
      products={products}
      requested={produit !== undefined}
      available={Boolean(process.env.DATABASE_URL) && mode === "prisma"}
    />
  );
}
