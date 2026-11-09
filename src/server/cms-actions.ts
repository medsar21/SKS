"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  CmsError,
  saveEntry,
  restoreEntry,
  deleteEntry,
  requireContentAdmin,
} from "./cms-service";
import { entryInputSchema } from "@/features/cms/validation";

function message(error: unknown) {
  if (error instanceof CmsError) return error.message;
  if (error instanceof z.ZodError)
    return error.issues
      .map((i) => `${i.path.join(".")} : ${i.message}`)
      .join(" · ");
  return "Enregistrement impossible. Vérifiez les liens uniques et la connexion à la base, puis réessayez.";
}
export async function saveContent(
  input: unknown,
): Promise<{
  success?: boolean;
  error?: string;
  id?: string;
  revision?: number;
}> {
  await requireContentAdmin();
  try {
    const result = await saveEntry(entryInputSchema.parse(input));
    revalidatePath("/", "layout");
    return { success: true, ...result };
  } catch (error) {
    return { error: message(error) };
  }
}
export async function restoreContent(
  id: string,
  version: number,
): Promise<{
  success?: boolean;
  error?: string;
  id?: string;
  revision?: number;
}> {
  await requireContentAdmin();
  try {
    await restoreEntry(id, version);
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    return { error: message(error) };
  }
}
export async function deleteContent(
  id: string,
  revision: number,
): Promise<{
  success?: boolean;
  error?: string;
  id?: string;
  revision?: number;
}> {
  await requireContentAdmin();
  try {
    await deleteEntry(id, revision);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: message(error) };
  }
}
