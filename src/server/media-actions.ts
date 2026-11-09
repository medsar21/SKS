"use server";
import { revalidatePath } from "next/cache";
import { CmsError, requireContentAdmin } from "./cms-service";
import {
  uploadMediaRecord,
  updateMediaRecord,
  deleteMediaRecord,
} from "./media-service";
function failure(error: unknown) {
  return {
    error:
      error instanceof CmsError
        ? error.message
        : "Opération indisponible. Vérifiez le fichier et le texte alternatif.",
  };
}
export async function uploadMedia(
  data: FormData,
): Promise<{
  success?: boolean;
  error?: string;
  id?: string;
  revision?: number;
}> {
  await requireContentAdmin();
  try {
    const result = await uploadMediaRecord(data);
    revalidatePath("/admin/medias");
    return { success: true, ...result };
  } catch (error) {
    return failure(error);
  }
}
export async function updateMedia(
  id: string,
  alt: string,
): Promise<{
  success?: boolean;
  error?: string;
  id?: string;
  revision?: number;
}> {
  await requireContentAdmin();
  try {
    await updateMediaRecord(id, alt);
    revalidatePath("/admin/medias");
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}
export async function deleteMedia(
  id: string,
): Promise<{
  success?: boolean;
  error?: string;
  id?: string;
  revision?: number;
}> {
  await requireContentAdmin();
  try {
    await deleteMediaRecord(id);
    revalidatePath("/admin/medias");
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}
