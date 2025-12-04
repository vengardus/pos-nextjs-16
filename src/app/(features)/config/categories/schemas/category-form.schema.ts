import { CategoryBaseSchema } from "@/lib/schemas/category.base.schema";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const CategoryFormSchema = CategoryBaseSchema.extend({
  imageUrl: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => files?.length === 1 || files === undefined,
      "La imagen es requerida."
    )
    .refine(
      (files) => files === undefined || files?.[0]?.size <= MAX_FILE_SIZE,
      `El tamaño máximo de archivo es 5MB.`
    )
    .refine(
      (files) =>
        files === undefined || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Solo se aceptan archivos .jpg, .jpeg, .png."
    ),
});

export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
