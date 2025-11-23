import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const CategoryFormSchema =  z.object({
    name: z.string().min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    }),
    color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
      message: "Debe ser un color hexadecimal válido.",
    }),
    imageUrl: z
      .custom<FileList>()
      .optional()
      .refine((files) => (files?.length === 1 || files === undefined), "La imagen es requerida.")
      .refine((files) =>  files === undefined ||files?.[0]?.size <= MAX_FILE_SIZE , `El tamaño máximo de archivo es 5MB.`)
      .refine(
        (files) =>  files === undefined || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Solo se aceptan archivos .jpg, .jpeg, .png."
      ),
  })

export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
