"use server";

import { warehouseGetAllByProductCached } from "@/lib/data/warehouses/warehouse.cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";

export const warehouseGetAllByProductAction = async (
  productId: string
): Promise<ResponseAction> => {
  return await warehouseGetAllByProductCached(productId);
};

