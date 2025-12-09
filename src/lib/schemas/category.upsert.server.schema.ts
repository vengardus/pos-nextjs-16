import { z } from "zod";
import { CategoryBaseSchema } from "./category.base.schema";

export const CategoryUpsertServerSchema = CategoryBaseSchema.pick({
    name: true,
    color: true,
    companyId: true,    
    isDefault: true,
});
export type CategoryUpsertServerType = z.infer<typeof CategoryUpsertServerSchema>;
