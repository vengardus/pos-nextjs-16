import { z } from "zod";

export const CategoryAgentSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("create_category"),
    name: z
      .string()
      .min(1, "El nombre no puede estar vacío.")
      .max(30, "El nombre no puede exceder 30 caracteres.")
      .refine((s) => !/\bcategor[ií]a\b/i.test(s), {
        message:
          "El nombre no debe contener la palabra 'categoría' o 'categoria'.",
      }),
  }),
  z.object({
    intent: z.literal("none"),
    name: z.string().optional().default(""),
  }),
]);

export type CategoryAgentResult = z.infer<typeof CategoryAgentSchema>;
