import { z } from "zod";
import { imagePath } from "@/features/cms/validation";

export const referencesSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000),
  logos: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(200),
        src: imagePath.refine(
          Boolean,
          "Choisissez le logo dans la médiathèque.",
        ),
      }),
    )
    .max(100),
});
export type ReferenceContent = z.infer<typeof referencesSchema>;
export const defaultReferences: ReferenceContent = {
  heading: "Nos références",
  description: "",
  logos: [],
};
