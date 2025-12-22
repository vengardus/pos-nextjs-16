import "server-only";

import prisma from "@/server/db/prisma";
import type { Warehouse } from "@/types/interfaces/warehouse/warehouse.interface";

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
