import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { branchUserGetAllByUserRepository } from "../repository/branch-user.get-all-by-user.repository";

export const branchUserGetAllByUserUseCase = async (
  userId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!userId) throw new Error("User id is required");

    const data = await branchUserGetAllByUserRepository(userId);

    resp.data = data;
    resp.success = true;
    console.log("query=>branchUserGetAllByUser");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
