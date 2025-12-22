import "server-only";

import prisma from "@/server/db/prisma";
import type { Product } from "@/types/interfaces/product/product.interface";

export const productDeleteByIdRepository = async (
  id: string
): Promise<Product> => {
  return await prisma.productModel.delete({
    where: {
      id,
    },
  });
};
