"use server";
import {
  quoteRequestSchema,
  statusChangeSchema,
} from "@/features/quotes/validation";
import {
  submitQuoteRequest,
  changeQuoteStatus,
  QuoteRequestError,
} from "@/server/quote-service";
import { requireAdmin } from "@/server/authorization";
import { revalidatePath } from "next/cache";

export async function sendQuoteRequest(
  input: unknown,
): Promise<{ reference?: string; errors?: string[] }> {
  const parsed = quoteRequestSchema.safeParse(input);
  if (!parsed.success)
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  try {
    return await submitQuoteRequest(parsed.data);
  } catch (error) {
    // Aucune donnée personnelle, erreur SQL ou configuration renvoyée ou journalisée.
    return {
      errors: [
        error instanceof QuoteRequestError
          ? error.message
          : "Enregistrement indisponible. Aucune confirmation reçue : réessayez ultérieurement.",
      ],
    };
  }
}

export async function updateQuoteStatus(
  input: unknown,
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  const parsed = statusChangeSchema.safeParse(input);
  if (!parsed.success) return { error: "Transition de statut interdite." };
  try {
    await changeQuoteStatus(parsed.data);
  } catch (error) {
    return {
      error:
        error instanceof QuoteRequestError
          ? error.message
          : "Modification indisponible. Réessayez ultérieurement.",
    };
  }
  revalidatePath("/admin/devis");
  revalidatePath(`/admin/devis/${parsed.data.id}`);
  return { success: true };
}
