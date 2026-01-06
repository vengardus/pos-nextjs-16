import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Product } from "@/server/modules/product/domain/product.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { productGetAllByCompanyRepository } from "../repository/product.get-all-by-company.repository";

export const productGetAllByCompanyUseCase = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");

    const data = await productGetAllByCompanyRepository(companyId);

    resp.data = data as Product[];
    resp.success = true;
    console.log("query=>productGetAllByCompany");
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
