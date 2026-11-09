import { z } from "zod";
import { companyContent } from "@/features/company/content";
import {
  defaultCompanyProfile,
  defaultSiteMedia,
  defaultPageSeo,
} from "./site-defaults";
import {
  homeBenefits,
  homeJourneys,
  homeSolutions,
} from "@/features/home/content";

export const safeLink = z
  .string()
  .max(500)
  .refine((value) => {
    if (
      !value ||
      /[\s\\]/.test(value) ||
      Array.from(value).some((char) => char.charCodeAt(0) < 32)
    )
      return false;
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    if (/^#[a-zA-Z0-9_-]+$/.test(value)) return true;
    try {
      return ["https:", "mailto:", "tel:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Utilisez un chemin du site, https://, mailto: ou tel:.");
export const imagePath = z
  .string()
  .max(500)
  .refine(
    (value) =>
      value === "" ||
      (/^\/(?:images\/[a-zA-Z0-9_./-]+|media\/[a-zA-Z0-9_-]+)$/.test(value) &&
        !value.includes("..")),
    "Choisissez une image de la médiathèque ou un chemin /images/ du site.",
  );
const text = z.string().trim().max(10000);
const short = z.string().trim().min(1).max(200);
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Lien : minuscules, chiffres et tirets uniquement.",
  );
const menuLink = z.object({ label: short, href: safeLink });
export const managedImageSchema = z
  .object({ src: imagePath, alt: z.string().max(500) })
  .refine(
    (value) => !value.src || Boolean(value.alt.trim()),
    "Décrivez l’image pour l’accessibilité.",
  );
const textList = z.array(short).max(100);
const companyProfileSchema = z.object({
  headline: short,
  specialty: short,
  experience: short,
  about: text,
  services: textList,
  expertise: textList,
  commitments: textList,
  productIntro: text,
  projectTitle: short,
  projects: textList,
  contactIntro: text,
  director: z.object({
    name: short,
    title: short,
    paragraphs: z.array(text).max(50),
  }),
});
const seoPage = z.object({ title: short, description: z.string().max(1000) });
export const settingsSchema = z.object({
  brand: short,
  brandSub: z.string().max(80),
  logo: imagePath,
  logoDark: imagePath.default(""),
  company: companyProfileSchema.default(defaultCompanyProfile),
  siteMedia: z
    .object({
      hero: managedImageSchema,
      catalog: managedImageSchema,
      homeAbout: managedImageSchema,
      companyAbout: managedImageSchema,
    })
    .default(defaultSiteMedia),
  presentationPdf: safeLink.default("/documents/sks-projets-presentation.pdf"),
  pageSeo: z
    .object({
      about: seoPage,
      projects: seoPage,
      contact: seoPage,
      catalog: seoPage,
    })
    .default(defaultPageSeo),
  tagline: z.string().max(250),
  region: z.string().max(80),
  locale: z.enum(["fr", "ar", "en"]),
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  navigation: z.array(menuLink).max(20),
  cta: menuLink,
  footerText: text,
  footerLinks: z.array(menuLink).max(20),
  copyright: z.string().max(300),
  credit: z.string().max(300),
  email: z.union([z.literal(""), z.email()]),
  phone: z.string().max(80),
  phoneSecondary: z.string().max(80).default(""),
  website: z.union([z.literal(""), safeLink]).default(""),
  address: z.string().max(500),
  seoTitle: short,
  indexSearchEngines: z.boolean().default(false),
  seoDescription: z.string().max(500),
  homeSections: z
    .array(
      z.object({
        id: z.enum([
          "hero",
          "notice",
          "presentation",
          "solutions",
          "equipements",
          "vente-location",
          "approche",
          "devis",
          "contact",
        ]),
        visible: z.boolean(),
      }),
    )
    .length(9)
    .refine(
      (items) => new Set(items.map((i) => i.id)).size === 9,
      "Chaque section doit figurer une seule fois.",
    ),
  homeSolutions: z.array(short).max(20),
  homeBenefits: z.array(z.object({ title: short, text })).max(20),
  homeJourneys: z
    .array(
      z.object({
        id: slugSchema,
        number: z.string().max(10),
        label: short,
        title: short,
        subtitle: text,
        text,
        points: z.array(short).max(20),
        cta: short,
        href: safeLink,
        image: managedImageSchema.default({ src: "", alt: "" }),
      }),
    )
    .max(10),
});
export type SiteSettings = z.infer<typeof settingsSchema>;
export const defaultSettings: SiteSettings = {
  brand: "SKS",
  brandSub: "PROJETS",
  logo: "",
  logoDark: "",
  company: defaultCompanyProfile,
  siteMedia: defaultSiteMedia,
  presentationPdf: "/documents/sks-projets-presentation.pdf",
  pageSeo: defaultPageSeo,
  tagline: companyContent.tagline,
  region: companyContent.region,
  locale: "fr",
  primary: "#111315",
  accent: "#ffbf00",
  navigation: [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos" },
    { label: "Services", href: "/#vente-location" },
    { label: "Produits", href: "/catalogue" },
    { label: "Domaines", href: "/projets" },
    { label: "Contact", href: "/contact" },
    { label: "Espace client", href: "/espace-client" },
  ],
  cta: { label: "Demande de consultation", href: "/contact" },
  footerText: companyContent.specialty,
  footerLinks: [
    { label: "Nos produits", href: "/catalogue" },
    {
      label: "Présentation SKS PROJETS (PDF)",
      href: "/documents/sks-projets-presentation.pdf",
    },
    { label: "Connexion professionnelle ↗", href: "/connexion" },
  ],
  copyright: "SKS PROJETS | Maroc | Afrique",
  credit: "Conception & intégration · MNH Technologie",
  email: companyContent.email,
  phone: companyContent.phones[0]!,
  phoneSecondary: companyContent.phones[1]!,
  website: `https://${companyContent.website}`,
  address: companyContent.address,
  seoTitle: "SKS PROJETS — Coffrage, étaiement et échafaudage",
  indexSearchEngines: false,
  seoDescription: companyContent.contactIntro,
  homeSections: [
    "hero",
    "notice",
    "vente-location",
    "equipements",
    "presentation",
    "solutions",
    "approche",
    "devis",
    "contact",
  ].map((id) => ({
    id: id as SiteSettings["homeSections"][number]["id"],
    visible: !["solutions", "approche", "contact"].includes(id),
  })),
  homeSolutions: [...homeSolutions],
  homeBenefits: homeBenefits.map(({ title, text }) => ({ title, text })),
  homeJourneys: homeJourneys.map((j) => ({
    ...j,
    points: [...j.points],
    href: "/contact",
  })),
};
export const blockSchema = z
  .object({
    type: z.enum(["text", "heading", "image", "button"]),
    text: z.string().max(20000),
    url: z.string().max(500),
  })
  .superRefine((block, ctx) => {
    if (
      block.type === "image" &&
      (!block.url || !imagePath.safeParse(block.url).success)
    )
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "Image locale requise.",
      });
    if (block.type === "button" && !safeLink.safeParse(block.url).success)
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "Lien invalide.",
      });
    if (
      (block.type === "image" || block.type === "button") &&
      !block.text.trim()
    )
      ctx.addIssue({
        code: "custom",
        path: ["text"],
        message: "Libellé ou texte alternatif requis.",
      });
  });
export const pageBodySchema = z
  .object({
    cover: imagePath,
    coverAlt: z.string().max(500),
    seoTitle: z.string().max(200),
    seoDescription: z.string().max(500),
    blocks: z.array(blockSchema).max(100),
  })
  .refine(
    (body) => !body.cover || Boolean(body.coverAlt.trim()),
    "Décrivez l’image de couverture.",
  );
export type PageBody = z.infer<typeof pageBodySchema>;
export const emptyPageBody: PageBody = {
  cover: "",
  coverAlt: "",
  seoTitle: "",
  seoDescription: "",
  blocks: [{ type: "text", text: "", url: "" }],
};
export const reservedSlugs = new Set([
  "admin",
  "api",
  "media",
  "articles",
  "catalogue",
  "connexion",
  "espace-client",
  "contact",
  "a-propos",
  "projets",
  "demande-de-devis",
  "_next",
  "favicon",
  "robots",
  "sitemap",
]);
export const entryInputSchema = z.object({
  id: z.string().max(100).optional(),
  revision: z.number().int().min(0),
  kind: z.enum(["PAGE", "ARTICLE", "COPY", "SETTINGS"]),
  key: z.string().min(1).max(120),
  title: short,
  summary: z.string().max(1000),
  body: z.unknown(),
  intent: z.enum(["draft", "publish", "unpublish"]),
});
export type EntryInput = z.infer<typeof entryInputSchema>;
export const productDetailsSchema = z.object({
  advantages: z.array(short).max(100).default([]),
  sourcePage: z.number().int().min(1).max(9999).nullable().default(null),
  technicalSheet: managedImageSchema.default({ src: "", alt: "" }),
  technicalNote: z.string().max(2000).default(""),
  kind: z.enum(["panel", "prop", "accessory"]),
  usage: z.string().max(500),
  images: z
    .array(
      z.object({
        src: imagePath.refine(Boolean, "Image requise."),
        alt: z.string().min(1).max(500),
      }),
    )
    .max(20),
  specifications: z
    .array(
      z.object({
        label: short,
        value: z.string().max(1000),
        unit: z.string().max(30),
      }),
    )
    .max(100),
  documents: z.array(z.object({ label: short, href: safeLink })).max(20),
  availability: z.string().max(300),
  seoTitle: z.string().max(200),
  seoDescription: z.string().max(500),
});
export const emptyProductDetails: z.infer<typeof productDetailsSchema> = {
  advantages: [],
  sourcePage: null,
  technicalSheet: { src: "", alt: "" },
  technicalNote: "",
  kind: "panel",
  usage: "",
  images: [],
  specifications: [],
  documents: [],
  availability: "",
  seoTitle: "",
  seoDescription: "",
};
export const productInputSchema = z.object({
  id: z.string().max(100).optional(),
  revision: z.number().int().min(0),
  sku: short,
  slug: slugSchema,
  name: short,
  description: text.min(1),
  categoryId: z.string().min(1).max(100),
  price: z
    .string()
    .regex(
      /^(?:\d{1,10}(?:\.\d{1,2})?)?$/,
      "Montant MAD invalide, au maximum deux décimales.",
    ),
  active: z.boolean(),
  isDemo: z.boolean(),
  details: productDetailsSchema,
});
export const categoryInputSchema = z.object({
  image: imagePath.default(""),
  imageAlt: z.string().max(500).default(""),
  id: z.string().max(100).optional(),
  revision: z.number().int().min(0),
  slug: slugSchema,
  name: short,
  description: text,
  isDemo: z.boolean(),
});
