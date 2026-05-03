import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Category } from "@/server/modules/category/domain/category.base.schema";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { categoryGetAllByCompanyRepository } from "../repository/category.get-all-by-company.repository";

export const categoryGetAllByCompanyUseCase = async (
  companyId: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("ID de compañía es requerido");
    
    const { data, total } = await categoryGetAllByCompanyRepository(
      companyId,
      page,
      limit,
      search
    );
    
    resp.data = data as Category[];
    resp.success = true;

    if (page !== undefined && limit !== undefined) {
      resp.pagination = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    }
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
