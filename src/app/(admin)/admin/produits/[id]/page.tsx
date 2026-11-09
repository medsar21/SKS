import { notFound } from "next/navigation";
import { getAdminCatalog } from "@/server/catalog-admin-service";
import { listMedia } from "@/server/media-service";
import { ProductEditor } from "@/features/cms/catalog-manager";
export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ products, categories }, media] = await Promise.all([
    getAdminCatalog(),
    listMedia(),
  ]);
  const product = products.find((p) => p.id === id);
  if (id !== "nouveau" && !product) notFound();
  return (
    <ProductEditor
      key={id}
      product={product}
      categories={categories}
      media={media.map(({ id, alt, name, mimeType }) => ({
        id,
        alt,
        name,
        mimeType,
      }))}
    />
  );
}
