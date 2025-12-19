import { z } from "zod";
import { CategoryBaseSchema } from "./category.base.schema";

export const CategoryInputSchema = CategoryBaseSchema.pick({
  id: true,
  name: true,
  color: true,
  companyId: true,
  isDefault: true,
}).extend({
  id: CategoryBaseSchema.shape.id.optional(),
  name: CategoryBaseSchema.shape.name.transform(
    (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  ),
});
export type CategoryInput = z.infer<typeof CategoryInputSchema>;
