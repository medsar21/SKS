"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createManagedUser,
  requireUserAdministrator,
  UserManagementError,
} from "@/server/user-service";

export async function addUser(
  input: unknown,
): Promise<{ success: true } | { error: string }> {
  await requireUserAdministrator();
  try {
    await createManagedUser(input);
    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (error) {
    if (error instanceof UserManagementError) return { error: error.message };
    if (error instanceof z.ZodError)
      return {
        error: "Vérifiez les champs et la confirmation du mot de passe.",
      };
    return {
      error: "Création impossible. Vérifiez la connexion et réessayez.",
    };
  }
}
