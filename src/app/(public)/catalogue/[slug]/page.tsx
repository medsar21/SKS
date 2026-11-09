import { notFound } from "next/navigation";
import { getCatalogProduct } from "@/server/catalog-service";
import { ProductDetail } from "@/features/catalog/product-detail";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const product = await getCatalogProduct((await params).slug);
  return {
    title: product
      ? product.seoTitle ||
        `${product.name}${product.isDemo ? " — Démonstration" : ""}`
      : "Produit introuvable",
    description: product?.seoDescription || product?.description,
  };
}
export default async function ProductPage({ params }: Props) {
  const product = await getCatalogProduct((await params).slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
