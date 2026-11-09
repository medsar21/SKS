import { HomePage } from "@/features/home/home-page";
import { getCatalog } from "@/server/catalog-service";
import { getSiteContent } from "@/server/cms-service";
export async function generateMetadata() {
  const { settings } = await getSiteContent();
  return {
    title: { absolute: settings.seoTitle },
    description: settings.seoDescription,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      type: "website",
    },
  };
}
export default async function Page() {
  const { products } = await getCatalog();
  return <HomePage products={products} />;
}
