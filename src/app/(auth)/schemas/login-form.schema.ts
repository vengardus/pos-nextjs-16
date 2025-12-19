import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  remember: z.boolean().default(false),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;