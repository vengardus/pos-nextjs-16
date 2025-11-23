import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const CompanyFormSchema =  z.object({
    name: z.string().min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    }),
    taxAddress: z.string().optional(),
    taxGlose: z.string().min(2, {
      message: "Glosa del impuesto debe tener al menos 2 caracteres.",
    }).max(4, {
      message: "Glosa del impuesto debe tener menos de 4 caracteres.",
    }),
    taxValue: z.preprocess((val) => Number(val), z.number().min(0.01, {
      message: "El valor del impuesto debe ser mayor a 0.",
    })),
    imageUrl: z
      .custom<FileList>()
      .optional()
      //.refine((files) => files?.length === 1, "La imagen es requerida.")
      .refine((files) =>  files === undefined ||files?.[0]?.size <= MAX_FILE_SIZE , `El tamaño máximo de archivo es 5MB.`)
      .refine(
        (files) =>  files === undefined || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Solo se aceptan archivos .jpg, .jpeg, .png."
      ),
  })

export type CompanyFormSchemaType = z.infer<typeof CompanyFormSchema>;
