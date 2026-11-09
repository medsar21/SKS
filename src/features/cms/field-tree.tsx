"use client";
import { useId } from "react";
export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type MediaChoice = {
  id: string;
  alt: string;
  mimeType: string;
  name: string;
};
const labels: Record<string, string> = {
  logos: "Logos des références",
  heading: "Titre de section",
  description: "Description",
  hero: "Bannière principale",
  indexSearchEngines: "Autoriser l’indexation par les moteurs de recherche",
  brand: "Nom / sigle",
  brandSub: "Sous-titre du logo",
  logo: "Logo",
  logoDark: "Logo sur fond sombre (sans recoloration)",
  company: "Contenus de l’entreprise",
  headline: "Titre principal",
  specialty: "Spécialité",
  experience: "Expérience",
  about: "Présentation",
  services: "Services",
  expertise: "Expertises",
  commitments: "Engagements",
  productIntro: "Présentation du catalogue",
  projectTitle: "Titre des domaines",
  projects: "Domaines d’application",
  contactIntro: "Présentation du contact",
  director: "Mot du directeur",
  paragraphs: "Paragraphes",
  name: "Nom",
  siteMedia: "Photos du site",
  homeAbout: "Photo de présentation de l’accueil",
  companyAbout: "Photo de la page À propos",
  catalog: "Bannière du catalogue",
  image: "Image",
  imageAlt: "Description de l’image",
  presentationPdf: "Document de présentation (PDF)",
  pageSeo: "Référencement des pages",
  technicalSheet: "Fiche technique illustrée",
  technicalNote: "Note technique",
  sourcePage: "Page source du document",
  advantages: "Avantages",
  tagline: "Bandeau supérieur",
  region: "Pays / région",
  locale: "Langue et direction",
  primary: "Couleur principale",
  accent: "Couleur d’accent",
  navigation: "Menu principal",
  cta: "Bouton principal",
  footerText: "Présentation du pied de page",
  footerLinks: "Liens du pied de page",
  copyright: "Mention en bas du site",
  email: "Email de contact",
  phone: "Téléphone",
  phoneSecondary: "Deuxième téléphone",
  website: "Site web",
  address: "Adresse",
  seoTitle: "Titre SEO",
  seoDescription: "Description SEO",
  homeSections: "Ordre et visibilité des sections d’accueil",
  homeSolutions: "Solutions présentées à l’accueil",
  homeBenefits: "Avantages et approche",
  homeJourneys: "Services (page Services)",
  title: "Titre",
  subtitle: "Sous-titre",
  number: "Numéro affiché",
  points: "Points à présenter",
  id: "Section",
  visible: "Visible",
  label: "Libellé",
  href: "Lien",
  text: "Texte / description alternative",
  url: "Lien ou image",
  cover: "Image de couverture",
  coverAlt: "Description de la couverture",
  blocks: "Blocs de contenu",
  type: "Type de bloc",
  kind: "Type d’équipement",
  usage: "Utilisation",
  images: "Images du produit",
  src: "Image",
  alt: "Description alternative",
  specifications: "Caractéristiques techniques",
  value: "Valeur",
  unit: "Unité",
  documents: "Documents à télécharger",
  availability: "Disponibilité (texte vérifié)",
};
const sectionLabels: Record<string, string> = {
  hero: "Bannière principale",
  notice: "Recherche catalogue et document de présentation",
  presentation: "Présentation",
  solutions: "Solutions",
  equipements: "Sélection du catalogue",
  references: "Nos références",
  "vente-location": "Nos références",
  approche: "Approche",
  devis: "Appel au devis",
  contact: "Contact",
};
function template(key: string): JsonValue {
  if (key === "logos") return { name: "", src: "" };
  if (
    [
      "services",
      "expertise",
      "commitments",
      "projects",
      "paragraphs",
      "advantages",
    ].includes(key)
  )
    return "";
  if (key === "homeSolutions") return "Nouvelle solution";
  if (key === "homeBenefits") return { title: "Nouvel avantage", text: "" };
  if (key === "homeJourneys")
    return {
      id: "nouveau-parcours",
      number: "03",
      label: "VOTRE PROJET",
      title: "Nouveau parcours",
      subtitle: "",
      text: "",
      points: [],
      cta: "En savoir plus",
      href: "/contact",
      image: { src: "", alt: "" },
    };
  if (key === "points") return "Nouveau point";
  if (["navigation", "footerLinks"].includes(key))
    return { label: "Nouveau lien", href: "/" };
  if (key === "images") return { src: "", alt: "" };
  if (key === "specifications") return { label: "", value: "", unit: "" };
  if (key === "documents") return { label: "", href: "" };
  return { type: "text", text: "", url: "" };
}
export function ImageField({
  value,
  onChange,
  media,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  media: MediaChoice[];
  label: string;
}) {
  const id = useId();
  return (
    <div className="cms-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/media/… ou /images/…"
      />
      <select
        aria-label={`Choisir : ${label}`}
        value=""
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value);
        }}
      >
        <option value="">Choisir dans la médiathèque…</option>
        {media
          .filter((m) => m.mimeType.startsWith("image/"))
          .map((m) => (
            <option key={m.id} value={`/media/${m.id}`}>
              {m.name} · {m.alt}
            </option>
          ))}
      </select>
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="text-link">
          Voir l’image ↗
        </a>
      )}
    </div>
  );
}
export function FieldTree({
  value,
  onChange,
  field = "",
  media = [],
}: {
  value: JsonValue;
  onChange: (v: JsonValue) => void;
  field?: string;
  media?: MediaChoice[];
}) {
  const id = useId();
  const label = labels[field] ?? (field || "Texte");
  if (typeof value === "number" || field === "sourcePage")
    return (
      <div className="cms-field">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="number"
          min={field === "sourcePage" ? 1 : undefined}
          value={value === null ? "" : String(value)}
          onChange={(event) =>
            onChange(
              event.target.value === "" ? null : Number(event.target.value),
            )
          }
        />
      </div>
    );
  if (typeof value === "boolean")
    return (
      <label className="cms-check">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
    );
  if (Array.isArray(value))
    return (
      <fieldset className="cms-array">
        <legend>{label}</legend>
        {value.map((item, index) => (
          <div className="cms-array-item" key={index}>
            <div className="cms-array-toolbar">
              <strong>
                {typeof item === "object" &&
                item !== null &&
                !Array.isArray(item)
                  ? String(
                      item.label ||
                        sectionLabels[String(item.id)] ||
                        `Élément ${index + 1}`,
                    )
                  : `Élément ${index + 1}`}
              </strong>
              <div>
                <button
                  type="button"
                  aria-label={`Monter ${label} ${index + 1}`}
                  disabled={index === 0}
                  onClick={() => {
                    const items = [...value];
                    [items[index - 1], items[index]] = [
                      items[index]!,
                      items[index - 1]!,
                    ];
                    onChange(items);
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Descendre ${label} ${index + 1}`}
                  disabled={index === value.length - 1}
                  onClick={() => {
                    const items = [...value];
                    [items[index], items[index + 1]] = [
                      items[index + 1]!,
                      items[index]!,
                    ];
                    onChange(items);
                  }}
                >
                  ↓
                </button>
                {field !== "homeSections" && (
                  <button
                    type="button"
                    className="cms-danger"
                    onClick={() =>
                      onChange(value.filter((_, i) => i !== index))
                    }
                  >
                    Retirer
                  </button>
                )}
              </div>
            </div>
            <FieldTree
              value={item}
              onChange={(v) =>
                onChange(value.map((old, i) => (i === index ? v : old)))
              }
              media={media}
            />
          </div>
        ))}
        {field !== "homeSections" && (
          <button
            type="button"
            className="cms-secondary"
            onClick={() => onChange([...value, template(field)])}
          >
            + Ajouter{" "}
            {field === "blocks"
              ? "un bloc"
              : field === "logos"
                ? "un logo"
                : "un élément"}
          </button>
        )}
      </fieldset>
    );
  if (value && typeof value === "object")
    return (
      <fieldset className="cms-object cms-fields">
        {field && <legend>{label}</legend>}
        {Object.entries(value).map(([key, entry]) => (
          <FieldTree
            key={key}
            field={key}
            value={entry}
            onChange={(v) => onChange({ ...value, [key]: v })}
            media={media}
          />
        ))}
      </fieldset>
    );
  const string = String(value ?? "");
  if (["logo", "logoDark", "image", "cover", "src"].includes(field))
    return (
      <ImageField
        label={label}
        value={string}
        media={media}
        onChange={onChange}
      />
    );
  const options =
    field === "locale"
      ? ["fr", "ar", "en"]
      : field === "type"
        ? ["text", "heading", "image", "button"]
        : field === "kind"
          ? ["panel", "prop", "accessory"]
          : null;
  return (
    <div className="cms-field">
      <label htmlFor={id}>{label}</label>
      {options ? (
        <select
          id={id}
          value={string}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {{
                fr: "Français",
                ar: "العربية · RTL",
                en: "English",
                text: "Paragraphe",
                heading: "Titre de section",
                image: "Image",
                button: "Bouton / lien",
                panel: "Panneau",
                prop: "Étai",
                accessory: "Accessoire",
              }[option] ?? option}
            </option>
          ))}
        </select>
      ) : field === "id" && sectionLabels[string] ? (
        <input id={id} value={sectionLabels[string] ?? string} readOnly />
      ) : ["primary", "accent"].includes(field) ? (
        <div className="cms-color">
          <input
            id={id}
            type="color"
            value={string}
            onChange={(e) => onChange(e.target.value)}
          />
          <span>{string}</span>
        </div>
      ) : (
        <textarea
          id={id}
          rows={
            /text|description|summary|address/i.test(field) ||
            string.length > 140
              ? 4
              : 1
          }
          value={string}
          maxLength={field === "text" ? 20000 : 10000}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field === "url" && (
        <select
          aria-label="Insérer un média dans le bloc"
          value=""
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
        >
          <option value="">Insérer un média…</option>
          {media.map((m) => (
            <option key={m.id} value={`/media/${m.id}`}>
              {m.name}
            </option>
          ))}
        </select>
      )}
      {["href", "presentationPdf"].includes(field) && (
        <select
          aria-label="Insérer un document"
          value=""
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
        >
          <option value="">Insérer un document…</option>
          {media
            .filter((m) => m.mimeType === "application/pdf")
            .map((m) => (
              <option key={m.id} value={`/media/${m.id}`}>
                {m.name}
              </option>
            ))}
        </select>
      )}
    </div>
  );
}
