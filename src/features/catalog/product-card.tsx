"use client";
import { useSiteContent } from "@/features/cms/site-content";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductIllustration } from "@/components/product-illustration";
import type { DemoProduct } from "@/features/catalog/data";
import type { CatalogProduct } from "./types";
import Image from "next/image";

export function ProductCard({
  product,
  headingLevel = 2,
  detailed = false,
}: {
  product: DemoProduct | CatalogProduct;
  headingLevel?: 2 | 3;
  detailed?: boolean;
}) {
  const { t } = useSiteContent("catalogue");

  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <article className="category-card product-card">
      <div className="card-top">
        <span>
          {"sourcePage" in product && product.sourcePage
            ? `Document · p. ${product.sourcePage}`
            : product.sku}
        </span>
        {(!("isDemo" in product) || product.isDemo) && (
          <span className="demo-badge">{t("Démonstration")}</span>
        )}
      </div>
      {"images" in product && product.images[0] ? (
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          width={500}
          height={400}
          sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 33vw"
          className="category-art object-contain"
        />
      ) : (
        <ProductIllustration kind={product.kind} className="category-art" />
      )}
      <div className="category-content">
        {detailed && typeof product.category !== "string" && (
          <span className="mini-label">{product.category.name}</span>
        )}
        <Heading className="product-card-title">
          {detailed ? (
            <Link href={`/catalogue/${product.slug}`}>{product.name}</Link>
          ) : (
            product.name
          )}
        </Heading>
        <p>{product.description}</p>
        <p>
          {"price" in product && product.price
            ? new Intl.NumberFormat("fr-MA", {
                style: "currency",
                currency: "MAD",
              }).format(Number(product.price))
            : t("Tarif et disponibilité non renseignés.")}
        </p>
        {"availability" in product && product.availability && (
          <p>{product.availability}</p>
        )}
        <div className="product-card-actions">
          <Link
            className="text-link product-card-primary"
            href={detailed ? `/catalogue/${product.slug}` : "/contact"}
          >
            {detailed ? t("Voir la fiche") : t("Préparer une consultation")}
            <span className="sr-only"> : {product.name}</span>
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          {detailed && (
            <Link
              className="text-link product-card-secondary"
              href={`${"sourcePage" in product && product.sourcePage ? "/contact" : "/demande-de-devis"}?produit=${encodeURIComponent(product.slug)}`}
            >
              {t("Demander un devis")}
              <span className="sr-only"> : {product.name}</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
