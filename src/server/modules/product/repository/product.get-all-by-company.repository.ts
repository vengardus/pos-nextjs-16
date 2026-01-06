import "server-only";

import prisma from "@/server/db/prisma";
import type { Product } from "@/server/modules/product/domain/product.interface";

export const productGetAllByCompanyRepository = async (
  companyId: string
): Promise<Product[]> => {
  const data = await prisma.productModel.findMany({
    where: { companyId },
    include: {
      Category: { select: { name: true } },
    },
  });

  return data.map((product) => ({
    ...product,
    categoryName: product.Category?.name,
  })) as Product[];
};
