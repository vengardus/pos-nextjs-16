import { z } from "zod";

export const UserFormSchema = z.object({
  email: z.string().min(2, {
    message: "El email debe tener al menos 2 caracteres.",
  }),
  password: z.string().min(7, {
    message: "La contraseña debe tener al menos 7 caracteres.",
  }),
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  documentTypeId: z.string(), // Opcional por defecto
  documentNumber: z.string().min(2, {
    message: "El número de documento debe tener al menos 2 caracteres.",
  }).optional(), // Opcional inicialmente, pero se valida condicionalmente
  phone: z.string().optional(),
  address: z.string().optional(),
  branchId: z.string().min(1, {
    message: "Selecciona una sucursal.",
  }),
  cashRegisterId: z.string().min(1, {
    message: "Selecciona un caja.",
  }),
  roleId: z.string(), 
}).superRefine((data, ctx) => {
  const hasType = Boolean(data.documentTypeId.length);
  const hasNumber = Boolean(data.documentNumber && data.documentNumber.length);

  // 1️⃣ Si selecciona tipo y falta número
  if (hasType && !hasNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["documentNumber"],
      message:
        "El número de documento es obligatorio cuando se selecciona un tipo de documento.",
    });
  }

  // 2️⃣ Si ingresa número y falta tipo
  if (!hasType && hasNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["documentTypeId"],
      message:
        "Debes seleccionar un tipo de documento antes de ingresar un número.",
    });
  }
});
export type UserFormSchemaType = z.infer<typeof UserFormSchema>;
