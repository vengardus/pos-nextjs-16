"use server";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { productGetAllByCompanyUseCase } from "@/server/modules/product/use-cases/product.get-all-by-company.use-case";

export const productSearchAction = async (
  companyId: string,
  search: string
): Promise<ResponseAction> => {
  return await productGetAllByCompanyUseCase(
    companyId,
    1,
    50, // Limit to 50 results for search
    search
  );
};
