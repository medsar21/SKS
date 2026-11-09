import { getAdminCatalog } from "@/server/catalog-admin-service";
import { ProductListing } from "@/features/cms/catalog-manager";
export default async function ProductsPage() {
  const { products } = await getAdminCatalog();
  return <ProductListing products={products} />;
}
