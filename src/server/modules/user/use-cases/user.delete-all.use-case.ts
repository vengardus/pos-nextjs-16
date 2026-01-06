import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { userDeleteAllRepository } from "../repository/user.delete-all.repository";

export const userDeleteAllUseCase = async (): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const users = await userDeleteAllRepository();
    resp.data = users;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
