"use server";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { warehouseGetAllByProductCached } from "@/server/modules/warehouse/next/cache/warehouse.get-all-by-product.cache";

export const warehouseGetAllByProductAction = async (
  productId: string
): Promise<ResponseAction> => {
  if (!productId) {
    return {
      success: false,
      message: "Product id is required",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  return await warehouseGetAllByProductCached(productId);
};
