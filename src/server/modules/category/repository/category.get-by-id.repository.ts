import "server-only";

import prisma from "@/server/db/prisma";
import type { Category } from "@/types/interfaces/category/category.interface";

export const categoryGetByIdRepository = async (
  id: string
): Promise<Category | null> => {
  return await prisma.categoryModel.findUnique({
    where: {
      id,
    },
  });
};
