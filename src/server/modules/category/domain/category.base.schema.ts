import { z } from "zod";

// Letras (con tildes/ñ), dígitos y un espacio simple entre palabras.
// Sin símbolos, sin espacios al inicio/fin. 3–30 chars.
export const nombreRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?: [A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$/;

export const CategoryBaseSchema = z.object({
  id: z.string().uuid(),
  
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(30, "El nombre no puede exceder 30 caracteres.")
    .refine((s) => nombreRegex.test(s), {
      message: "Usa solo letras, números y espacios (sin símbolos).",
    }),
  color: z
    .string()
    .trim()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Debe ser un color hexadecimal válido."
    ),
  imageUrl: z.string().nullable(),
  isDefault: z.boolean().default(false),

  companyId: z.string().uuid().min(1, "Falta companyId."),

  createdAt: z.coerce.date().default(new Date()),
  updatedAt: z.coerce.date().nullable(),
});
export type Category = z.infer<typeof CategoryBaseSchema>;
