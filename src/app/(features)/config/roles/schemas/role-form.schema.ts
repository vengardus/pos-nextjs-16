import { z } from "zod";

export const RoleFormSchema = z.object({
  description: z.string().min(2, {
    message: "La descripción debe tener al menos 2 caracteres.",
  }),
  cod: z.string().min(2, {
    message: "El código debe tener al menos 2 caracteres.",
  }),
  isDefault: z.boolean().default(false),
});

export type RoleFormSchemaType = z.infer<typeof RoleFormSchema>;
