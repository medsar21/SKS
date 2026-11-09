import { z } from "zod";

const date = z
  .string()
  .refine(
    (value) =>
      !value ||
      (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(Date.parse(value)) &&
        new Date(value).toISOString().slice(0, 10) === value),
    "Date invalide.",
  );
export const quoteRequestSchema = z
  .object({
    contactName: z
      .string()
      .trim()
      .min(3, "Indiquez votre nom et prénom.")
      .max(160),
    companyName: z.string().trim().min(2, "Indiquez votre société.").max(160),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s().-]{8,25}$/, "Téléphone invalide."),
    email: z
      .email("Email invalide.")
      .max(254)
      .transform((value) => value.toLowerCase()),
    city: z.string().trim().min(2, "Indiquez la ville.").max(120),
    siteAddress: z
      .string()
      .trim()
      .min(5, "Précisez l’adresse du chantier.")
      .max(500),
    requestType: z.enum(["SALE", "RENTAL"]),
    rentalStart: date.default(""),
    rentalEnd: date.default(""),
    notes: z.string().trim().max(3000).default(""),
    website: z.string().max(0, "Demande refusée.").default(""),
    lines: z
      .array(
        z
          .object({
            sku: z.string().min(1).max(100),
            quantity: z.coerce.number().int().min(1).max(100000),
          })
          .strict(),
      )
      .min(1, "Sélectionnez au moins un produit.")
      .max(30),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (new Set(data.lines.map((line) => line.sku)).size !== data.lines.length)
      ctx.addIssue({
        code: "custom",
        path: ["lines"],
        message: "Un produit ne peut apparaître qu’une fois.",
      });
    if (
      data.requestType === "RENTAL" &&
      (!data.rentalStart ||
        !data.rentalEnd ||
        data.rentalEnd < data.rentalStart)
    )
      ctx.addIssue({
        code: "custom",
        path: ["rentalEnd"],
        message: "Indiquez une période de location valide.",
      });
    if (data.requestType === "SALE" && (data.rentalStart || data.rentalEnd))
      ctx.addIssue({
        code: "custom",
        path: ["rentalStart"],
        message: "Les dates concernent uniquement la location.",
      });
  });

export const quoteStatuses = [
  "SUBMITTED",
  "DRAFT",
  "REQUESTED",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
] as const;
export type QuoteState = (typeof quoteStatuses)[number];
export const statusLabels: Record<QuoteState, string> = {
  SUBMITTED: "Reçue",
  DRAFT: "Brouillon",
  REQUESTED: "En étude",
  SENT: "Devis envoyé",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
  EXPIRED: "Expirée",
};
export const transitions: Record<QuoteState, readonly QuoteState[]> = {
  SUBMITTED: ["REQUESTED", "REJECTED"],
  DRAFT: ["REQUESTED"],
  REQUESTED: ["SENT", "REJECTED"],
  SENT: ["ACCEPTED", "REJECTED", "EXPIRED"],
  ACCEPTED: [],
  REJECTED: [],
  EXPIRED: [],
};
export const statusChangeSchema = z
  .object({
    id: z.string().min(1).max(100),
    from: z.enum(quoteStatuses),
    to: z.enum(quoteStatuses),
  })
  .strict()
  .refine(
    (data) => transitions[data.from].includes(data.to),
    "Transition de statut interdite.",
  );
export const quoteSearchSchema = z.object({
  q: z.string().trim().max(120).default(""),
  status: z.enum(quoteStatuses).optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
});
