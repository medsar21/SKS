"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  saveProduct,
  saveCategory,
  deleteCatalogItem,
} from "@/server/catalog-admin-actions";
import { emptyProductDetails, type productDetailsSchema } from "./validation";
import type { z } from "zod";
import {
  FieldTree,
  ImageField,
  type JsonValue,
  type MediaChoice,
} from "./field-tree";
type Category = {
  image?: string;
  imageAlt?: string;
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isDemo: boolean;
  revision: number;
  _count: { products: number };
};
export type EditableProduct = {
  id?: string;
  revision: number;
  sku: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  price: string;
  active: boolean;
  isDemo: boolean;
  details: z.infer<typeof productDetailsSchema>;
};
export function ProductListing({
  products,
}: {
  products: (EditableProduct & { category: { name: string } })[];
}) {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    `${p.name} ${p.sku} ${p.category.name}`
      .toLocaleLowerCase("fr")
      .includes(search.toLocaleLowerCase("fr")),
  );
  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">CATALOGUE CONNECTÉ</p>
          <h1>Produits</h1>
          <p className="muted">
            Créez les fiches et activez les références à afficher sur le site.
          </p>
        </div>
        <Link className="cms-primary" href="/admin/produits/nouveau">
          + Nouveau produit
        </Link>
      </div>
      <label className="cms-field cms-panel">
        Rechercher un produit
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="cms-table-wrap">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Prix MAD</th>
              <th>État</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>
                  <small>
                    {p.sku} {p.isDemo ? "· Démonstration" : ""}
                  </small>
                </td>
                <td>{p.category.name}</td>
                <td>{p.price || "Non renseigné"}</td>
                <td>
                  <span className={`cms-badge ${p.active ? "is-live" : ""}`}>
                    {p.active ? "Actif" : "Masqué"}
                  </span>
                </td>
                <td>
                  <Link className="text-link" href={`/admin/produits/${p.id}`}>
                    Modifier →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="cms-empty">
            Aucun produit correspondant. Créez une catégorie puis votre première
            fiche.
          </p>
        )}
      </div>
    </>
  );
}
export function ProductEditor({
  product,
  categories,
  media,
}: {
  product?: EditableProduct;
  categories: Category[];
  media: MediaChoice[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false);
  const [value, setValue] = useState<EditableProduct>(
    product ?? {
      revision: 0,
      sku: "",
      slug: "",
      name: "",
      description: "",
      categoryId: categories[0]?.id ?? "",
      price: "",
      active: false,
      isDemo: false,
      details: emptyProductDetails,
    },
  );
  const update = (key: string, text: string) =>
    setValue((v) => ({ ...v, [key]: text }));
  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">FICHE PRODUIT</p>
          <h1>{product ? "Modifier le produit" : "Nouveau produit"}</h1>
        </div>
        <Link className="cms-secondary" href="/admin/produits">
          ← Tous les produits
        </Link>
      </div>
      {!categories.length && (
        <p className="cms-notice">
          Créez d’abord une{" "}
          <Link href="/admin/categories" className="text-link">
            catégorie
          </Link>
          .
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          startTransition(async () => {
            const result = await saveProduct(value);
            if (result.error) setError(result.error);
            else if (result.id) {
              router.push("/admin/produits");
              router.refresh();
            }
          });
        }}
      >
        <fieldset disabled={pending} className="cms-editor-fieldset">
          <div className="cms-panel cms-fields">
            {[
              ["name", "Nom du produit"],
              ["sku", "Référence SKU"],
              ["slug", "Lien de la fiche"],
            ].map(([key, label]) => (
              <label className="cms-field" key={key}>
                {label}
                <input
                  required
                  maxLength={key === "slug" ? 100 : 200}
                  value={String(value[key as keyof EditableProduct])}
                  onChange={(e) => update(key!, e.target.value)}
                />
              </label>
            ))}
            <label className="cms-field">
              Description
              <textarea
                required
                rows={5}
                maxLength={10000}
                value={value.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </label>
            <label className="cms-field">
              Catégorie
              <select
                required
                value={value.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="cms-field">
              Prix unitaire en MAD (facultatif)
              <input
                inputMode="decimal"
                placeholder="Ex. 150.00"
                value={value.price}
                onChange={(e) => update("price", e.target.value)}
              />
            </label>
            <label className="cms-check">
              <input
                type="checkbox"
                checked={value.isDemo}
                onChange={(e) =>
                  setValue((v) => ({ ...v, isDemo: e.target.checked }))
                }
              />
              Référence de démonstration
            </label>
            <label className="cms-check">
              <input
                type="checkbox"
                checked={value.active}
                onChange={(e) =>
                  setValue((v) => ({ ...v, active: e.target.checked }))
                }
              />
              Afficher ce produit dans le catalogue public
            </label>
          </div>
          <div className="cms-panel">
            <FieldTree
              value={value.details as JsonValue}
              onChange={(details) =>
                setValue((v) => ({
                  ...v,
                  details: details as EditableProduct["details"],
                }))
              }
              media={media}
            />
          </div>
          <div className="cms-savebar">
            <p>Les produits actifs sont visibles après enregistrement.</p>
            <button
              type="submit"
              disabled={!categories.length}
              className="cms-primary"
            >
              {pending ? "Enregistrement…" : "Enregistrer le produit"}
            </button>
          </div>
        </fieldset>
      </form>
      {error && (
        <p className="cms-error" role="alert">
          {error}
        </p>
      )}
      {product && !product.active && (
        <div className="cms-panel mt-6">
          <button
            type="button"
            className="cms-danger"
            onClick={() => setConfirm(!confirm)}
          >
            Supprimer ce produit
          </button>
          {confirm && (
            <p>
              Supprimer cette référence ?{" "}
              <button
                className="cms-danger"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteCatalogItem(
                      "product",
                      product.id!,
                      product.revision,
                    );
                    if (result.error) setError(result.error);
                    else {
                      router.push("/admin/produits");
                      router.refresh();
                    }
                  })
                }
              >
                Confirmer
              </button>{" "}
              <button onClick={() => setConfirm(false)}>Annuler</button>
            </p>
          )}
        </div>
      )}
    </>
  );
}
function CategoryForm({
  category,
  media,
}: {
  category?: Category;
  media: MediaChoice[];
}) {
  const [image, setImage] = useState(category?.image ?? "");
  const router = useRouter();
  const [pending, startTransition] = useTransition(),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false);
  return (
    <form
      className="cms-fields"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setError("");
        startTransition(async () => {
          const result = await saveCategory({
            id: category?.id,
            revision: category?.revision ?? 0,
            name: data.get("name"),
            slug: data.get("slug"),
            description: data.get("description"),
            isDemo: data.get("isDemo") === "on",
            image,
            imageAlt: data.get("imageAlt") ?? "",
          });
          if (result.error) setError(result.error);
          else {
            router.refresh();
            setError("Catégorie enregistrée.");
          }
        });
      }}
    >
      <fieldset disabled={pending} className="cms-editor-fieldset cms-fields">
        <label className="cms-field">
          Nom de la catégorie
          <input
            name="name"
            required
            maxLength={200}
            defaultValue={category?.name ?? ""}
          />
        </label>
        <label className="cms-field">
          Lien de la catégorie
          <input
            name="slug"
            required
            maxLength={100}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            defaultValue={category?.slug ?? ""}
          />
        </label>
        <label className="cms-field">
          Description
          <textarea
            name="description"
            rows={3}
            maxLength={10000}
            defaultValue={category?.description ?? ""}
          />
        </label>
        <ImageField
          label="Photo de la catégorie"
          value={image}
          onChange={setImage}
          media={media}
        />
        <label className="cms-field">
          Description de la photo
          <input
            name="imageAlt"
            defaultValue={category?.imageAlt ?? ""}
            maxLength={500}
          />
        </label>
        <label className="cms-check">
          <input
            name="isDemo"
            type="checkbox"
            defaultChecked={category?.isDemo ?? false}
          />
          Catégorie de démonstration
        </label>
        <div className="cms-actions">
          <button className="cms-primary" type="submit">
            Enregistrer la catégorie
          </button>
          {category && (
            <button
              className="cms-danger"
              type="button"
              onClick={() => setConfirm(!confirm)}
            >
              Supprimer
            </button>
          )}
        </div>
        {confirm && category && (
          <p className="cms-notice">
            Supprimer cette catégorie vide ?{" "}
            <button
              className="cms-danger"
              type="button"
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteCatalogItem(
                    "category",
                    category.id,
                    category.revision,
                  );
                  if (result.error) setError(result.error);
                  else router.refresh();
                })
              }
            >
              Confirmer
            </button>{" "}
            <button type="button" onClick={() => setConfirm(false)}>
              Annuler
            </button>
          </p>
        )}
      </fieldset>
      <p role="status">{error}</p>
    </form>
  );
}
export function CategoryManager({
  categories,
  media = [],
}: {
  categories: Category[];
  media?: MediaChoice[];
}) {
  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">ORGANISATION DU CATALOGUE</p>
          <h1>Catégories</h1>
        </div>
        <Link className="cms-secondary" href="/admin/produits">
          Voir les produits →
        </Link>
      </div>
      <details className="cms-panel" open={!categories.length}>
        <summary>+ Nouvelle catégorie</summary>
        <CategoryForm media={media} />
      </details>
      {categories.map((c) => (
        <details key={`${c.id}-${c.revision}`} className="cms-panel mt-4">
          <summary>
            {c.name}{" "}
            <span className="cms-badge">{c._count.products} produit(s)</span>
          </summary>
          <CategoryForm category={c} media={media} />
        </details>
      ))}
    </>
  );
}
