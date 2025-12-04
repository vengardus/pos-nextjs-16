import { z } from "zod";
import { CategoryBaseSchema } from "./category.base.schema";

export const CategoryUpsertServerSchema = CategoryBaseSchema.extend({
    companyId: z.string().min(1, "Falta companyId."),
});
export type CategoryUpsertServerType = z.infer<typeof CategoryUpsertServerSchema>;
