import "server-only";

import prisma from "@/server/db/prisma";
import type { Category } from "@/server/modules/category/domain/category.base.schema";

export const categoryDeleteByIdRepository = async (
  id: string
): Promise<Category> => {
  return await prisma.categoryModel.delete({
    where: {
      id,
    },
  });
};
