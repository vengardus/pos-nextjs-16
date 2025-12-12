import z from "zod";

export const requestSchema = z.object({
  prompt: z
    .string({
      // En Zod 4, unificas ambos mensajes en `error`
      error: "Error en la solicitud",
    })
    .trim()
    .min(1, "Error en la solicitud")
    .max(50, "El prompt no puede exceder 50 caracteres"),
  auth_code: z
    .string({
      error: "El código de autenticación es obligatorio",
    })
    .trim()
    .min(1, "El código de autenticación es obligatorio"),
});