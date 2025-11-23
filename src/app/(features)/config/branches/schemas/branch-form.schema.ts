import { z } from "zod";

export const BranchFormSchema =  z.object({
    name: z.string().min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    }),
    taxAddredss: z.string().min(2, {
      message: "La dirección fiscal debe tener al menos 2 caracteres.",
    }).optional(),
    isDefault: z.boolean().default(false),
  })

export type BranchFormSchemaType = z.infer<typeof BranchFormSchema>;
