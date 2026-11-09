import type { Product, Category } from "@/generated/prisma/client";

export type CatalogProduct = Pick<
  Product,
  "sku" | "slug" | "name" | "description" | "isDemo"
> & {
  category: Pick<Category, "slug" | "name"> & {
    image?: string | null;
    imageAlt?: string | null;
  };
  kind: "panel" | "prop" | "accessory";
  usage: string | null;
  images: { src: string; alt: string }[];
  specifications: { label: string; value: string | null; unit?: string }[];
  documents: { label: string; href: string }[];
  price?: string | null;
  availability?: string;
  seoTitle?: string;
  seoDescription?: string;
  sourcePage?: number | null;
  advantages?: string[];
  technicalSheet?: { src: string; alt: string };
  technicalNote?: string;
};
export type CatalogSource = {
  products: CatalogProduct[];
  mode: "demo" | "prisma" | "document";
};
