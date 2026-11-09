import { z } from "zod";

export const userRoles = ["CUSTOMER", "SALES", "ADMIN"] as const;
export const userRoleLabels = {
  CUSTOMER: "Client",
  SALES: "Commercial",
  ADMIN: "Administrateur",
} satisfies Record<(typeof userRoles)[number], string>;

export const createUserSchema = z
  .object({
    name: z.string().trim().min(2, "Indiquez au moins 2 caractères.").max(120),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Indiquez une adresse email valide.").max(254)),
    role: z.enum(userRoles),
    password: z
      .string()
      .min(12, "Le mot de passe doit contenir au moins 12 caractères.")
      .max(128, "Le mot de passe doit contenir au maximum 128 caractères.")
      .regex(
        /\S/,
        "Le mot de passe ne peut pas contenir uniquement des espaces.",
      ),
    confirmPassword: z.string().max(128),
  })
  .strict()
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas.",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const userPageSchema = z.coerce.number().int().min(1).max(10000);
