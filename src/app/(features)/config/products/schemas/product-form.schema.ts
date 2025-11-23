import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  salePrice: z.preprocess((val) => Number(val), z.number().min(0.01, {
    message: "El precio de venta debe ser mayor a 0.",
  })),
  purchasePrice: z.preprocess((val) => Number(val), z.number().min(0.01, {
    message: "El precio de compra debe ser mayor a 0.",
  })),
  barcode: z.string().optional().nullable(), 
  internalCode: z.string().optional().nullable(),
  isInventoryControl: z.boolean().default(false), // Valor por defecto false
  isMultiPrice: z.boolean().default(false), // Valor por defecto false

  categoryId: z.string().refine(val => val !== "", {
    message: "Selecciona una categoría.",
  }),
  branchId: z.string().optional(),
  stock: z.number().optional(),
  minimunStock: z.number().optional(),
});




export type ProductFormSchemaType = z.infer<typeof ProductFormSchema>;
