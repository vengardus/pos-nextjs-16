import "server-only";

import prisma from "@/server/db/prisma";
import type { Product } from "@/server/modules/product/domain/product.interface";

type ProductWithOptionalCategory = Product & { Category?: unknown };

export const productInsertOrUpdateRepository = async (
  product: Product
): Promise<Product> => {
  const {
    id,
    createdAt,
    barcode,
    internalCode,
    Category,
    categoryName,
    ...rest
  } = product as ProductWithOptionalCategory;

  const data = {
    ...rest,
    barcode: barcode ?? null,
    internalCode: internalCode ?? null,
  };

  if (id) {
    return await prisma.productModel.update({
      where: { id },
      data,
    });
  }

  return await prisma.productModel.create({
    data,
  });
};
