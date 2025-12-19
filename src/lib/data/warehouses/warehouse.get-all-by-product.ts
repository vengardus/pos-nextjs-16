import 'server-only'

import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Warehouse } from "@/types/interfaces/warehouse/warehouse.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const warehouseGetAllByProduct = async (
  productId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!productId) throw new Error("Product id is required");
    const data = await prisma.warehouseModel.findMany({
      where: {
        productId,
      },
      include: {
        Branch: true,
      }
    });
    resp.data = data as Warehouse[];
    resp.success = true;

    console.log("query=>warehouseGetAllByProduct");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
