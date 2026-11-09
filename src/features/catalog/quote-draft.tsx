"use client";
import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Download, LockKeyhole } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/features/cms/site-content";
import { quoteRequestSchema } from "@/features/quotes/validation";
import { sendQuoteRequest } from "@/server/quote-actions";
import styles from "./quote-request.module.css";

// Schéma du brouillon historique conservé pour ses consommateurs éventuels.
export const quoteDraftSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(100000),
  city: z.string().trim().min(2).max(120),
  notes: z.string().trim().min(10).max(3000),
});
type ProductOption = {
  name: string;
  sku: string;
  slug: string;
  isDemo: boolean;
};
export function QuoteDraft({
  product,
  products,
  available = false,
}: {
  product?: ProductOption;
  products: ProductOption[];
  available?: boolean;
}) {
  const { t, settings } = useSiteContent("contact");
  const [requestType, setRequestType] = useState("SALE");
  const [errors, setErrors] = useState<string[]>([]);
  const [downloaded, setDownloaded] = useState(false);
  const [reference, setReference] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selected = products.find(
      (item) => item.sku === form.get("productSku"),
    );
    const result = quoteRequestSchema.safeParse({
      contactName: form.get("contactName"),
      companyName: form.get("companyName"),
      email: form.get("email"),
      phone: form.get("phone"),
      city: form.get("city"),
      siteAddress: form.get("siteAddress"),
      requestType,
      rentalStart:
        requestType === "RENTAL" ? (form.get("rentalStart") ?? "") : "",
      rentalEnd: requestType === "RENTAL" ? (form.get("rentalEnd") ?? "") : "",
      notes: form.get("notes") ?? "",
      website: form.get("website") ?? "",
      lines: selected
        ? [{ sku: selected.sku, quantity: form.get("quantity") }]
        : [],
    });
    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }
    if (form.get("consent") !== "on") {
      setErrors([
        t(
          "Veuillez accepter l’utilisation de vos informations pour traiter cette demande.",
        ),
      ]);
      return;
    }
    setErrors([]);
    setDownloaded(false);
    if (available) {
      startTransition(async () => {
        try {
          const response = await sendQuoteRequest(result.data);
          if (response.reference) setReference(response.reference);
          else
            setErrors(response.errors ?? [t("Enregistrement indisponible.")]);
        } catch {
          setErrors([
            t(
              "Connexion interrompue. Aucune confirmation reçue. Réessayez ultérieurement.",
            ),
          ]);
        }
      });
      return;
    }
    if (!selected) return;
    const data = result.data;
    const draft = `DEMANDE DE DEVIS — BROUILLON NON ENVOYÉ\n${selected.isDemo ? "PRODUIT DE DÉMONSTRATION\n" : ""}\nNom et prénom : ${data.contactName}\nSociété : ${data.companyName}\nEmail : ${data.email}\nTéléphone : ${data.phone}\n\nProduit : ${selected.name}\nRepère : ${selected.sku}\nQuantité envisagée : ${data.lines[0]!.quantity}\nType de demande : ${data.requestType === "RENTAL" ? "Location" : "Vente"}\nVille : ${data.city}\nAdresse du chantier : ${data.siteAddress}\n${data.requestType === "RENTAL" ? `Période : ${data.rentalStart} au ${data.rentalEnd}\n` : ""}Besoin : ${data.notes}\n\nAucun prix, stock ou engagement commercial confirmé. Ce document n’est pas un devis et n’a pas été envoyé.\n`;
    const url = URL.createObjectURL(
      new Blob([draft], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `brouillon-${selected.sku}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  if (reference)
    return (
      <section className={styles.formPanel} role="status">
        <h2>{t("Demande enregistrée")}</h2>
        <p>
          {t("Votre référence : ")}
          <strong>{reference}</strong>
        </p>
        <p>
          {t(
            "Votre demande sera étudiée. Elle ne constitue pas un devis ni une réservation.",
          )}
        </p>
      </section>
    );
  return (
    <form
      className={styles.formPanel}
      onSubmit={submit}
      aria-busy={pending}
      onChange={() => setDownloaded(false)}
      aria-describedby="quote-delivery-info"
    >
      <div className={styles.formIntro}>
        <p>{t("FORMULAIRE DE DEMANDE")}</p>
        <h2>{t("Les détails de votre projet")}</h2>
        <span>
          {t("Les champs marqués d’un astérisque sont obligatoires.")}
        </span>
      </div>
      <fieldset disabled={pending}>
        <legend>
          <span>01</span>
          {t("Vos coordonnées")}
        </legend>
        <div className={styles.fields}>
          <label>
            {t("Nom et prénom")} *
            <input
              name="contactName"
              autoComplete="name"
              required
              minLength={3}
              maxLength={160}
              placeholder={t("Votre nom complet")}
            />
          </label>
          <label>
            {t("Société")} *
            <input
              name="companyName"
              autoComplete="organization"
              required
              minLength={2}
              maxLength={160}
              placeholder={t("Nom de votre entreprise")}
            />
          </label>
          <label>
            {t("Email")} *
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="nom@entreprise.ma"
            />
          </label>
          <label>
            {t("Téléphone")} *
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={25}
              placeholder="+212 …"
            />
          </label>
        </div>
      </fieldset>
      <fieldset disabled={pending}>
        <legend>
          <span>02</span>
          {t("Votre besoin en matériel")}
        </legend>
        <div className={styles.fields}>
          <label className={styles.full}>
            {t("Produit concerné")} *
            <select
              name="productSku"
              defaultValue={product?.sku ?? ""}
              required
            >
              <option value="" disabled>
                {t("Sélectionnez un équipement")}
              </option>
              {products.map((item) => (
                <option key={item.sku} value={item.sku}>
                  {item.name}
                  {item.isDemo ? " · Démonstration" : ""}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("Quantité envisagée")} *
            <input
              name="quantity"
              type="number"
              min={1}
              max={100000}
              step={1}
              defaultValue={1}
              required
            />
          </label>
          <label>
            {t("Type de demande")} *
            <select
              value={requestType}
              onChange={(event) => setRequestType(event.target.value)}
            >
              <option value="SALE">{t("Vente")}</option>
              <option value="RENTAL">{t("Location")}</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset disabled={pending}>
        <legend>
          <span>03</span>
          {t("Votre chantier")}
        </legend>
        <div className={styles.fields}>
          <label>
            {t("Ville du chantier")} *
            <input
              name="city"
              autoComplete="address-level2"
              minLength={2}
              maxLength={120}
              required
              placeholder={t("Ville")}
            />
          </label>
          <label>
            {t("Adresse du chantier")} *
            <input
              name="siteAddress"
              autoComplete="street-address"
              minLength={5}
              maxLength={500}
              required
              placeholder={t("Adresse ou localisation du chantier")}
            />
          </label>
          {requestType === "RENTAL" && (
            <>
              <label>
                {t("Début souhaité")} *
                <input name="rentalStart" type="date" required />
              </label>
              <label>
                {t("Fin souhaitée")} *
                <input name="rentalEnd" type="date" required />
              </label>
            </>
          )}
          <label className={styles.full}>
            {t("Votre besoin et vos contraintes")}
            <textarea
              name="notes"
              rows={4}
              maxLength={3000}
              placeholder={t(
                "Précisez les dimensions, l’utilisation prévue, le calendrier et les contraintes techniques…",
              )}
            />
          </label>
        </div>
      </fieldset>
      <div hidden aria-hidden="true">
        <label>
          Site internet
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className={styles.consent}>
        <input name="consent" type="checkbox" required />
        <span>
          {t(
            "J’accepte que SKS PROJETS utilise ces informations pour traiter ma demande.",
          )}{" "}
          *
        </span>
      </label>
      {errors.length > 0 && (
        <div role="alert" className={styles.error}>
          <strong>{t("Vérifiez les informations saisies.")}</strong>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.delivery} id="quote-delivery-info">
        <LockKeyhole size={15} aria-hidden="true" />
        <p>
          {available
            ? t("Votre demande sera transmise à l’équipe SKS PROJETS.")
            : t(
                "L’envoi en ligne est indisponible pour le moment. Vous pouvez remplir le formulaire et télécharger votre demande, puis la transmettre par email.",
              )}
        </p>
      </div>
      <div className={styles.submit}>
        <Button
          type="submit"
          variant="accent"
          disabled={pending || products.length === 0}
        >
          {pending
            ? t("Enregistrement…")
            : available
              ? t("Envoyer ma demande")
              : t("Télécharger ma demande")}
          {available ? (
            <ArrowRight size={17} aria-hidden="true" />
          ) : (
            <Download size={17} aria-hidden="true" />
          )}
        </Button>
        {!available && settings.email && (
          <span>
            {t("À transmettre à ")}
            {settings.email}
          </span>
        )}
      </div>
      <p role="status" className={styles.status}>
        {downloaded
          ? t(
              "Demande préparée pour téléchargement. Aucune demande envoyée automatiquement.",
            )
          : t("Les tarifs et les disponibilités restent à confirmer.")}
      </p>
      {product && (
        <Link className={styles.back} href={`/catalogue/${product.slug}`}>
          {t("Retour à la fiche produit")}
        </Link>
      )}
    </form>
  );
}
