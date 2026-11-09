"use client";
import { useSiteContent } from "@/features/cms/site-content";
import Image from "next/image";
import { useState } from "react";
import { ProductIllustration } from "@/components/product-illustration";
import type { CatalogProduct } from "./types";
import styles from "./catalog.module.css";
export function ProductGallery({ product }: { product: CatalogProduct }) {
  const { t } = useSiteContent("catalogue");

  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const image = product.images[selected];
  return (
    <div>
      <figure className={styles.gallery}>
        {image && !failed ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={1000}
            height={800}
            sizes="(max-width: 800px) 100vw, 50vw"
            onError={() => setFailed(true)}
          />
        ) : (
          <ProductIllustration
            kind={product.kind}
            className={styles.galleryArt}
          />
        )}
        <figcaption>
          {failed
            ? t("Image indisponible · illustration générique")
            : image
              ? image.alt
              : t(
                  "Illustration générique de démonstration · photo produit non fournie",
                )}
        </figcaption>
      </figure>
      {product.images.length > 1 && (
        <div className={styles.thumbnails} aria-label={t("Choisir une image")}>
          {product.images.map((item, index) => (
            <button
              key={item.src}
              type="button"
              aria-pressed={selected === index}
              aria-label={`Image ${index + 1} : ${item.alt}`}
              onClick={() => {
                setSelected(index);
                setFailed(false);
              }}
            >
              <Image src={item.src} alt="" width={88} height={70} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
