import "server-only";

import prisma from "@/server/db/prisma";
import type { Category } from "@/server/modules/category/domain/category.base.schema";

export const categoryGetAllByCompanyRepository = async (
  companyId: string
): Promise<Category[]> => {
  return await prisma.categoryModel.findMany({
    where: {
      companyId,
    },
  });
};
