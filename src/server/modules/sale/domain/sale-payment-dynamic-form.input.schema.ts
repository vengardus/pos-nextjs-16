import { z } from "zod";

const dynamicFieldSchema = z.object({
  label: z.string(),
  value:  z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") {
      // Convertir a número con dos decimales
      return parseFloat(Number(val).toFixed(2));
    }
    return val;
  }, z.number().min(0.00, {
    message: "El monto debe ser mayor a 0.",
  })),
  cod: z.string(),
  id: z.string(),
});

// Schema general del formulario (que contiene un array de campos dinámicos).
export const SalePaymentDynamicFormSchema = z.object({
  clientId: z.string({
    message: "Ingrese un cliente.",
  }),
  paymentMethod: z.string({
    message: "Seleccione un tipo de cobranza.",
  }),
  dynamicFields: z
    .array(dynamicFieldSchema)
    .min(1, "Debe haber al menos un campo"),

  cardReference: z.string().optional(),

  // reaadonly
  totalAmount: z.string(),
  changeAmount: z.string(),
  restAmount: z.string(),
});

// Tipo inferido a partir del schema.
export type SalePaymentDynamicFormSchemaType = z.infer<
  typeof SalePaymentDynamicFormSchema
>;
