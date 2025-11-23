import { z } from "zod";

export const RegisterMovementFormSchema = z.object({
  amount: z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        // Convertir a número con dos decimales
        return parseFloat(Number(val).toFixed(2));
      }
      return val;
    },
    z.number().min(0.01, {
      message: "El monto debe ser mayor a 0.",
    })
  ),
  motive: z.string().optional(),
  paymentMethod: z.string(),
});

export type RegisterMovementFormSchemaType = z.infer<
  typeof RegisterMovementFormSchema
>;
