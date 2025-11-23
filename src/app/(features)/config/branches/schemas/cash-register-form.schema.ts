import { z } from "zod";

export const CashRegisterFormSchema =  z.object({
    description: z.string().min(2, {
      message: "La descripción debe tener al menos 2 caracteres.",
    }),
    isDefault: z.boolean().default(false),
  })

export type CashRegisterFormSchemaType = z.infer<typeof CashRegisterFormSchema>;
