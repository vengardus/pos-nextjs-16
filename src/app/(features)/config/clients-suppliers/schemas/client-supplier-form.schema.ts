import { z } from "zod";

export const ClientSupplierFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  address: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        // Verificar si el valor es distinto de "", undefined o null
        if (val !== "" && val !== undefined && val !== null) {
          // Validar si es un email válido
          return z.string().email().safeParse(val).success;
        }
        return true;
      },
      {
        message: "Por favor ingrese un correo electrónico válido.",
      }
    ),
  personType: z.string({
    required_error: "El tipo de persona es requerido.",
  }),
  naturalIdentifier: z.string().optional(),
  legalIdentifier: z.string().optional(),
  phone: z.string().optional(),
});

export type ClientSupplierFormSchemaType = z.infer<
  typeof ClientSupplierFormSchema
>;
