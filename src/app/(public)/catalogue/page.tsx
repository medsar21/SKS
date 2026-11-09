import { pageSeo } from "@/server/page-seo";
import { CatalogPage } from "@/features/catalog/catalog-page";
import { catalogQuerySchema } from "@/features/catalog/query";
import { getCatalog } from "@/server/catalog-service";
export const generateMetadata = () => pageSeo("catalog");
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [source, params] = await Promise.all([getCatalog(), searchParams]);
  return (
    <CatalogPage source={source} query={catalogQuerySchema.parse(params)} />
  );
}
