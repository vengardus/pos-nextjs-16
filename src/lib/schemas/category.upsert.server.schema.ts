import { z } from "zod";
import { CategoryBaseSchema } from "./category.base.schema";

export const CategoryUpsertServerSchema = CategoryBaseSchema.pick({
    name: true,
    color: true,
    companyId: true,    
    isDefault: true,
}).extend({
  name: CategoryBaseSchema.shape.name.transform(
    (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  ),
});;
export type CategoryUpsertServerType = z.infer<typeof CategoryUpsertServerSchema>;
