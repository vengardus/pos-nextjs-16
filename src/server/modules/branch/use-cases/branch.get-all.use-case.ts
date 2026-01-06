import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { branchGetAllRepository } from "../repository/branch.get-all.repository";

export const branchGetAllUseCase = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const data = await branchGetAllRepository(companyId);
    resp.data = data;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
