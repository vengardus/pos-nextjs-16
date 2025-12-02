import { z } from "zod";

export const PaymentMethodFormSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido.",
    })
    .trim()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    }),
  cod: z
    .string({
      required_error: "El código es requerido.",
    })
    .trim()
    .min(2, {
      message: "El código debe tener al menos 2 caracteres.",
    }),
  color: z
    .string({
      required_error: "Debe seleccionar un color.",
    })
    .regex(/^#([0-9A-F]{3}){1,2}$/i, {
      message: "Debe ser un color hexadecimal válido.",
    }),
  isDefault: z.boolean().default(false),
});

export type PaymentMethodFormSchemaType = z.infer<typeof PaymentMethodFormSchema>;
