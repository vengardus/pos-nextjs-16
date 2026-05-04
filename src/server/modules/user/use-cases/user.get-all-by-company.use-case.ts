import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { userGetAllByCompanyRepository } from "../repository/user.get-all-by-company.repository";

export const userGetAllByCompanyUseCase = async (
  companyId: string,
  page: number,
  pageSize: number,
  search?: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    if (!companyId) throw new Error("Company id is required");
    const { data, total } = await userGetAllByCompanyRepository(
      companyId,
      page,
      pageSize,
      search
    );
    console.log("query=>userGetAllByCompany");
    resp.data = data as UserWithRelations[];
    resp.pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
