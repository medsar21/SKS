"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { CmsError, requireContentAdmin } from "./cms-service";
import {
  saveProductRecord,
  saveCategoryRecord,
  deleteCatalogRecord,
} from "./catalog-admin-service";
function failure(error: unknown) {
  return {
    error:
      error instanceof CmsError
        ? error.message
        : error instanceof z.ZodError
          ? error.issues
              .map((i) => `${i.path.join(".")} : ${i.message}`)
              .join(" · ")
          : "Enregistrement impossible. Vérifiez que le nom du lien et la référence sont uniques.",
  };
}
export async function saveProduct(
  input: unknown,
): Promise<{
  success?: boolean;
  error?: string;
  id?: string;
  revision?: number;
}> {
  await requireContentAdmin();
  try {
    const result = await saveProductRecord(input);
    revalidatePath("/", "layout");
    return { success: true, ...result };
  } catch (error) {
    return failure(error);
  }
}
export async function saveCategory(
  input: unknown,
): Promise<{
  success?: boolean;
  error?: string;
  id?: string;
  revision?: number;
}> {
  await requireContentAdmin();
  try {
    await saveCategoryRecord(input);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}
export async function deleteCatalogItem(
  kind: "product" | "category",
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
    await deleteCatalogRecord(kind, id, revision);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}
