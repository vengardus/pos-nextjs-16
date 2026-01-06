import 'server-only'

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { SummaryTopSellingProducts } from "@/server/modules/dashboard/domain/dashboard.summary-top-selling-products.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { saleGetTopSellingProductsRepository } from "../repository/sale.get-top-selling-products.repository";

export const saleGetTopSellingProductsUseCase = async (
  companyId: string,
  itemsByQuantity: number = 5,
  itemsByAmount: number = 10
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const { topByQuantity, topByAmount } =
      await saleGetTopSellingProductsRepository(
        companyId,
        itemsByQuantity,
        itemsByAmount
      );

    resp.success = true;
    resp.data = {
      topByQuantity,
      topByAmount,
    } as SummaryTopSellingProducts;

    console.log(`query=>saleGetTopSellingProducts`);
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
