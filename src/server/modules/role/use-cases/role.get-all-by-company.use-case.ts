import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Role } from "@/server/modules/role/domain/role.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { roleGetAllByCompanyRepository } from "../repository/role.get-all-by-company.repository";

export const roleGetAllByCompanyUseCase = async (
  companyId: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("ID de compañía es requerido");
    const { data, total } = await roleGetAllByCompanyRepository(
      companyId,
      page,
      limit,
      search
    );
    resp.data = data as Role[];
    resp.success = true;

    if (page !== undefined && limit !== undefined) {
      resp.pagination = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    }
    console.log("query=>roleGetAllByCompany");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
