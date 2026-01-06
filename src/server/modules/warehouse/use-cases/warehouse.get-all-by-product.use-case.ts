import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Warehouse } from "@/server/modules/warehouse/domain/warehouse.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { warehouseGetAllByProductRepository } from "../repository/warehouse.get-all-by-product.repository";

export const warehouseGetAllByProductUseCase = async (
  productId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!productId) {
      throw new Error("Product id is required");
    }

    const data = await warehouseGetAllByProductRepository(productId);

    resp.data = data as Warehouse[];
    resp.success = true;

    console.log("query=>warehouseGetAllByProduct");
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
