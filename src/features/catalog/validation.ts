import { z } from "zod";
export const catalogueFilterSchema = z.enum([
  "tous",
  "coffrage",
  "etaiement",
  "accessoires",
]);
export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  sku: z.string().trim().min(2).max(64),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(160),
  description: z.string().trim().min(10).max(5000),
  categoryId: z.string().min(1),
  price: z
    .string()
    .regex(/^\d{1,10}(\.\d{1,2})?$/)
    .optional(),
});
