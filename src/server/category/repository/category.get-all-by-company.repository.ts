import "server-only";

import prisma from "@/infrastructure/db/prisma";
import type { Category } from "@/types/interfaces/category/category.interface";

export const categoryGetAllByCompanyRepository = async (
  companyId: string
): Promise<Category[]> => {
  return await prisma.categoryModel.findMany({
    where: {
      companyId,
    },
  });
};
