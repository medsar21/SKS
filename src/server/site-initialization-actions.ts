"use server";
import { revalidatePath } from "next/cache";
import { requireContentAdmin, CmsError } from "./cms-service";
import { initializeManagedSite } from "./site-initialization-service";
export async function initializeSite() {
  await requireContentAdmin();
  try {
    const result = await initializeManagedSite();
    revalidatePath("/", "layout");
    return { success: true, ...result };
  } catch (error) {
    return {
      error:
        error instanceof CmsError
          ? error.message
          : "Initialisation impossible. Vérifiez les migrations et les ressources installées. Aucune modification partielle n’a été conservée.",
    };
  }
}
