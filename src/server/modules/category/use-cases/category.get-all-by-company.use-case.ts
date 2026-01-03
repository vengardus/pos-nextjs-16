import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { categoryGetAllByCompanyRepository } from "../repository/category.get-all-by-company.repository";

export const categoryGetAllByCompanyUseCase = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");
    const data = await categoryGetAllByCompanyRepository(companyId);
    resp.data = data as Category[];
    resp.success = true;
    console.log("query=>categoryGetAllByCompany");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
