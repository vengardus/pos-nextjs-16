import "server-only";

import prisma from "@/server/db/prisma";
import type { Prisma } from "@prisma/client";
import type { Warehouse } from "@/types/interfaces/warehouse/warehouse.interface";

export const warehouseInsertManyRepository = async (
  warehouse: Array<Omit<Warehouse, "id" | "createdAt">>
): Promise<Prisma.BatchPayload> => {
  return await prisma.warehouseModel.createMany({
    data: warehouse,
  });
};
