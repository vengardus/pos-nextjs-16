import "server-only";

import prisma from "@/server/db/prisma";
import type { Warehouse } from "@/server/modules/warehouse/domain/warehouse.interface";

export const warehouseGetAllByProductRepository = async (
  productId: string
): Promise<Warehouse[]> => {
  return await prisma.warehouseModel.findMany({
    where: {
      productId,
    },
    include: {
      Branch: true,
    },
  });
};
