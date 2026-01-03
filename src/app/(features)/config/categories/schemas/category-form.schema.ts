import { CategoryInputSchema } from "@/server/modules/category/domain/category.input.schema";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const CategoryFormSchema = CategoryInputSchema.omit({
  id: true,
  companyId: true,
  isDefault: true,
}).extend({
  imageFiles: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => files === undefined || files.length <= 1,
      "Solo se permite un archivo."
    )
    .refine(
      (files) => files === undefined || files?.[0]?.size <= MAX_FILE_SIZE,
      "El tamaño máximo de archivo es 5MB."
    )
    .refine(
      (files) =>
        files === undefined || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Solo se aceptan archivos .jpg, .jpeg, .png."
    ),
});

export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
