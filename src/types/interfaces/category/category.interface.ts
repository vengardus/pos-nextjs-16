import { CategoryBaseSchema } from "@/server/category/domain/category.base.schema";
import z from "zod";

// export type Category = {
//   id: string;
//   name: string;
//   imageUrl?: string | null;
//   color: string;
//   companyId: string;
//   isDefault: boolean;


//   createdAt: Date;
//   updatedAt?: Date | null;
// };

export type Category = z.infer<typeof CategoryBaseSchema>;
