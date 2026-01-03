import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { userGetAllByCompanyRepository } from "../repository/user.get-all-by-company.repository";

export const userGetAllByCompanyUseCase = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    if (!companyId) throw new Error("Company id is required");
    const users = await userGetAllByCompanyRepository(companyId);
    console.log("query=>userGetAllByCompany");
    resp.data = users as UserWithRelations[];
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
