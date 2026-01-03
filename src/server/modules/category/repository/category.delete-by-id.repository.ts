import "server-only";

import prisma from "@/server/db/prisma";
import type { Category } from "@/types/interfaces/category/category.interface";

export const categoryDeleteByIdRepository = async (
  id: string
): Promise<Category> => {
  return await prisma.categoryModel.delete({
    where: {
      id,
    },
  });
};
