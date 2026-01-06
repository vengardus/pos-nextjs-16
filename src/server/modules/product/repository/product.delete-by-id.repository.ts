import "server-only";

import prisma from "@/server/db/prisma";
import type { Product } from "@/server/modules/product/domain/product.interface";

export const productDeleteByIdRepository = async (
  id: string
): Promise<Product> => {
  return await prisma.productModel.delete({
    where: {
      id,
    },
  });
};
