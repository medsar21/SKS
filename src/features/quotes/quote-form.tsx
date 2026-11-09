"use client";
import { useSiteContent } from "@/features/cms/site-content";
import { useState, useTransition, type FormEvent } from "react";
import { sendQuoteRequest } from "@/server/quote-actions";
import { Button } from "@/components/ui/button";

type ProductOption = {
  sku: string;
  slug: string;
  name: string;
  isDemo: boolean;
};
export function QuoteForm({
  products,
  selectedSlug,
  available,
}: {
  products: ProductOption[];
  selectedSlug?: string;
  available: boolean;
}) {
  const { t } = useSiteContent("formulaires");

  const [selected, setSelected] = useState<string[]>(
    products.filter((p) => p.slug === selectedSlug).map((p) => p.sku),
  );
  const [requestType, setRequestType] = useState("SALE");
  const [errors, setErrors] = useState<string[]>([]);
  const [reference, setReference] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      ...Object.fromEntries(
        [
          "contactName",
          "companyName",
          "phone",
          "email",
          "city",
          "siteAddress",
          "notes",
          "website",
        ].map((key) => [key, form.get(key) ?? ""]),
      ),
      requestType,
      rentalStart: form.get("rentalStart") ?? "",
      rentalEnd: form.get("rentalEnd") ?? "",
      lines: selected.map((sku) => ({
        sku,
        quantity: Number(form.get(`quantity:${sku}`)),
      })),
    };
    setErrors([]);
    startTransition(async () => {
      try {
        const result = await sendQuoteRequest(input);
        if (result.reference) setReference(result.reference);
        else setErrors(result.errors ?? ["Enregistrement indisponible."]);
      } catch {
        setErrors([
          "Connexion interrompue. Aucune confirmation reçue ; réessayez avec les mêmes informations.",
        ]);
      }
    });
  }
  if (reference)
    return (
      <div className="panel" role="status">
        <h2>{t("Demande enregistrée")}</h2>
        <p className="my-5 break-words">
          {t("Votre référence : ")}
          <strong>{reference}</strong>
        </p>
        <p>
          {t(
            "Conservez cette référence. Votre demande sera étudiée ; elle ne constitue pas un devis ni une réservation.",
          )}
        </p>
      </div>
    );
  return (
    <form
      method="post"
      onSubmit={submit}
      className="panel max-w-4xl"
      aria-busy={pending}
    >
      {!available && (
        <p role="status" className="mb-6">
          {t(
            "Le service d’enregistrement n’est pas configuré. Vous pouvez préparer votre demande, mais son envoi est indisponible.",
          )}
        </p>
      )}
      {selectedSlug && !products.some((p) => p.slug === selectedSlug) && (
        <p role="status">
          {t("Produit introuvable. Sélectionnez une référence ci-dessous.")}
        </p>
      )}
      <fieldset disabled={pending}>
        <legend className="mb-6 text-xl font-semibold">
          {t("Vos coordonnées professionnelles")}
        </legend>
        <div className="grid gap-x-6 sm:grid-cols-2">
          <label className="form-label">
            {t("Nom et prénom")}
            <input
              className="form-field"
              name="contactName"
              autoComplete="name"
              required
              minLength={3}
              maxLength={160}
            />
          </label>
          <label className="form-label">
            {t("Société")}
            <input
              className="form-field"
              name="companyName"
              autoComplete="organization"
              required
              minLength={2}
              maxLength={160}
            />
          </label>
          <label className="form-label">
            {t("Téléphone")}
            <input
              className="form-field"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={25}
            />
          </label>
          <label className="form-label">
            {t("Email")}
            <input
              className="form-field"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label className="form-label">
            {t("Ville du chantier")}
            <input
              className="form-field"
              name="city"
              autoComplete="address-level2"
              required
              minLength={2}
              maxLength={120}
            />
          </label>
          <label className="form-label">
            {t("Adresse du chantier")}
            <input
              className="form-field"
              name="siteAddress"
              autoComplete="street-address"
              required
              minLength={5}
              maxLength={500}
            />
          </label>
        </div>
        <fieldset className="my-6 space-y-4">
          <legend className="mb-4 text-xl font-semibold">
            {t("Produits et quantités")}
          </legend>
          {products.length === 0 && <p>{t("Aucun produit disponible.")}</p>}
          {products.map((product) => (
            <div
              key={product.sku}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"
            >
              <label className="flex min-w-0 items-start gap-3">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={selected.includes(product.sku)}
                  onChange={(event) =>
                    setSelected(
                      event.target.checked
                        ? [...selected, product.sku]
                        : selected.filter((sku) => sku !== product.sku),
                    )
                  }
                />
                <span>
                  {product.name}{" "}
                  {product.isDemo && (
                    <span className="demo-badge">{t("Démonstration")}</span>
                  )}
                </span>
              </label>
              <label className="text-sm">
                {t("Quantité · ")}
                {product.sku}
                <input
                  className="form-field max-w-36"
                  name={`quantity:${product.sku}`}
                  aria-label={`Quantité · ${product.name}`}
                  type="number"
                  min={1}
                  max={100000}
                  step={1}
                  defaultValue={1}
                  disabled={!selected.includes(product.sku)}
                  required={selected.includes(product.sku)}
                />
              </label>
            </div>
          ))}
        </fieldset>
        <label className="form-label">
          {t("Type de demande")}
          <select
            className="form-field"
            value={requestType}
            onChange={(event) => setRequestType(event.target.value)}
          >
            <option value="SALE">{t("Vente")}</option>
            <option value="RENTAL">{t("Location")}</option>
          </select>
        </label>
        {requestType === "RENTAL" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="form-label">
              {t("Début souhaité")}
              <input
                className="form-field"
                name="rentalStart"
                type="date"
                required
              />
            </label>
            <label className="form-label">
              {t("Fin souhaitée")}
              <input
                className="form-field"
                name="rentalEnd"
                type="date"
                required
              />
            </label>
          </div>
        )}
        <label className="form-label">
          {t("Message complémentaire")}
          <textarea
            className="form-field"
            name="notes"
            rows={5}
            maxLength={3000}
          />
        </label>
        <div hidden aria-hidden="true">
          <label>
            {t("Site internet")}
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="muted mb-6">
          {t(
            "Les tarifs, disponibilités et conditions de location seront confirmés après étude. Les références de démonstration restent identifiées comme telles. Vos coordonnées sont réservées à l’équipe habilitée pour traiter cette demande.",
          )}
        </p>
        {errors.length > 0 && (
          <div role="alert" className="mb-5">
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <Button
          disabled={pending || !available || products.length === 0}
          type="submit"
        >
          {pending ? t("Enregistrement…") : t("Envoyer ma demande")}
        </Button>
      </fieldset>
    </form>
  );
}
