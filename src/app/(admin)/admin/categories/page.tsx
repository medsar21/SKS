import { getAdminCatalog } from "@/server/catalog-admin-service";
import { CategoryManager } from "@/features/cms/catalog-manager";
import { listMedia } from "@/server/media-service";
export default async function CategoriesPage() {
  const { categories } = await getAdminCatalog();
  const media = await listMedia();
  return <CategoryManager categories={categories} media={media} />;
}
